# My Little Brain

**Tu sistema operativo personal.** No es un contador de calorias: es un coach de
rendimiento que junta cuerpo, entrenamiento, foco, mente y habitos en un solo
sistema, y que se alimenta hablando con el, no rellenando formularios.

> — Me he tomado una cerveza y una hamburguesa
> — Hoy he entrenado pecho: banca 5×8 con 80 kg
> — He estudiado ingles 45 minutos
> — He dormido 5 horas y estoy fundido

De esas cuatro frases salen: cuatro registros con macros estimados, un
entrenamiento con sus series, 45 minutos de aprendizaje, el sueno del dia, XP,
rachas y un ajuste de calorias si hace falta. **El usuario solo habla.**

---

## Que hace

| Area | Que lleva |
|---|---|
| **Cuerpo** | Peso, perimetros, grasa corporal (US Navy), IMC, tendencia real de peso y objetivos de calorias y macros que se recalculan solos. |
| **Entrenamiento** | Plan generado a medida (dias disponibles, material, nivel, lesiones), registro serie a serie y progresion doble de cargas. |
| **Foco** | Trabajo profundo, negocio, aprendizaje, idiomas y lectura. |
| **Mente** | Sueno, animo, energia, estres y motivacion. |
| **Habitos** | Habitos con objetivo semanal, rachas, XP y niveles. |
| **Revision semanal** | El informe de los domingos: puntuaciones, patrones, cuello de botella y tres acciones para la semana siguiente. |

### Lo que lo diferencia de un tracker

1. **Se le habla, no se rellena.** El coach interpreta lo que le cuentas y usa
   herramientas para escribir en la base de datos. Tambien acepta **fotos de
   comida**.
2. **Los numeros los calcula la app, no el modelo.** Calorias (Mifflin-St Jeor),
   macros, grasa corporal, tendencia de peso, puntuaciones por area y
   correlaciones de Pearson se calculan en codigo y se le pasan al coach como
   contexto. El modelo interpreta; no inventa datos.
3. **El cuello de botella.** La revision semanal cruza sueno, alcohol, foco,
   entreno y animo y senala **la palanca** que arrastra a las demas.
4. **Memoria a largo plazo.** Lo que cuentas una vez (una lesion, que odias el
   pescado, que viajas los martes) se guarda y condiciona todo lo que viene
   despues.

---

## Puesta en marcha

### 1. Supabase (base de datos + login + fotos)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → pega `supabase/schema.sql` entero → **Run**.
   Crea las 17 tablas, las politicas de RLS (cada usuario solo ve lo suyo), el
   trigger que da de alta el perfil al registrarse y el bucket privado
   `comidas` para las fotos.
3. **Project Settings → API**: copia la *Project URL* y la clave *anon public*.

### 2. Claude (el coach)

Saca una API key en [console.anthropic.com](https://console.anthropic.com) →
**API keys**.

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

| Variable | Obligatoria | Para que |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | si | Proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | si | Clave publica de Supabase (RLS protege los datos). |
| `ANTHROPIC_API_KEY` | para el coach | Sin ella el resto de la app funciona; el chat avisa. |
| `ANTHROPIC_MODEL` | no | Por defecto `claude-opus-5`. |

### 4. Local y despliegue

```bash
npm install
npm run dev        # http://localhost:3000
npm run prueba     # prueba de humo del dominio (sin red)
```

En **Vercel**: importa el repo, pon **Root Directory** en `my-little-brain`,
anade las variables de entorno y despliega. Es una PWA: desde el movil,
*Compartir → Anadir a pantalla de inicio*.

---

## Como esta hecho

```
src/
  app/
    page.tsx                    Portada publica
    entrar/                     Login y registro (Supabase Auth)
    auth/callback/              Vuelta del email de confirmacion
    app/
      page.tsx                  Panel del dia: puntuaciones, metas, habitos, entreno
      coach/                    Chat con el coach
      onboarding/               Alta conversacional (sin formularios)
      entreno/                  Plan + registro de sesion con progresion
      cuerpo/                   Peso, medidas, comidas del dia y graficas
      habitos/                  Habitos, rejilla de 7 dias y rachas
      semana/                   Revision semanal (el informe del domingo)
      ajustes/                  Perfil, plan y sesion
      acciones.ts               Server actions (toda la escritura desde la UI)
    api/coach/                  Chat con herramientas (el corazon del producto)
    api/revision/               Generacion de la revision semanal
  lib/
    motor/                      Dominio puro, sin dependencias externas
      ejercicios.ts             Catalogo (~55 ejercicios con patron, material y tecnica)
      planificador.ts           Plantillas semanales y seleccion de ejercicios
      progresion.ts             Progresion doble, 1RM estimado, tonelaje
      nutricion.ts              Mifflin-St Jeor, macros y ajuste por tendencia
      cuerpo.ts                 IMC, grasa US Navy, tendencia de peso
      puntuaciones.ts           Agregacion diaria, notas por area, XP y correlaciones
    ia/
      prompt.ts                 Personalidad y reglas del coach
      herramientas.ts           Las 13 herramientas que puede usar (y su ejecucion)
      contexto.ts               El contexto de datos que recibe en cada mensaje
      revision.ts               Estadisticas de la semana y prompt de la revision
      limites.ts                Cuota de mensajes por plan
    datos.ts                    Carga unica del panel (una sola fuente de verdad)
    supabase/                   Clientes de navegador y servidor
supabase/schema.sql             Tablas, RLS, trigger de alta y bucket de fotos
pruebas/humo.mjs                Prueba de humo del dominio con un Supabase falso
```

### El coach

`POST /api/coach` monta un bucle de herramientas con
`client.beta.messages.create` sobre **`claude-opus-5`**:

- **Contexto cacheado**: el prompt del coach viaja con `cache_control` para no
  pagarlo entero en cada mensaje; los datos del usuario van en un segundo bloque.
- **13 herramientas**: `registrar_comida`, `registrar_peso`,
  `registrar_entrenamiento`, `registrar_foco`, `registrar_bienestar`,
  `registrar_habito`, `crear_habito`, `crear_objetivo`, `crear_tarea`,
  `recordar`, `actualizar_perfil`, `generar_plan_entreno` y
  `consultar_historial`. Cada entrada se valida con `zod` antes de tocar la base
  de datos.
- **Escribe como el usuario**: el bucle usa el cliente de Supabase de la sesion,
  asi que las politicas de RLS siguen mandando aunque el modelo se equivoque.
- **Fallbacks** (`fallbacks: "default"`): si los clasificadores declinan una
  peticion, la API la reintenta sola en otro modelo dentro de la misma llamada.
- **Efecto en la UI**: cada mensaje devuelve las acciones ejecutadas y el XP
  ganado, y se pintan bajo la respuesta.

El alta usa el mismo motor con otro prompt: pregunta de una en una, va guardando
el perfil segun se lo cuentas y termina generando el plan.

### La revision semanal

`POST /api/revision` calcula en codigo todas las cifras de la semana
(adherencia, medias, alcohol, sueno, correlaciones) y le pide al modelo que las
**interprete** y senale el cuello de botella. La respuesta se guarda en
`revisiones` y se puede regenerar.

### Multiusuario

Cada tabla tiene `user_id` y politicas de RLS `auth.uid() = user_id`; las fotos
viven en `comidas/<user_id>/…` con la misma regla. El limite de mensajes al
coach se lleva en `uso_ia` por mes y plan (`free` 40, `pro` 1500, `founder`
100.000), y se comprueba antes de cada llamada.

---

## Estado

**Probado:** el dominio completo pasa `npm run prueba` — las 13 herramientas
escriben donde deben, el emparejamiento de ejercicios por nombre libre, el plan
que excluye ejercicios segun las lesiones, el calculo de calorias y grasa, la
agregacion diaria, las puntuaciones, el contexto del coach, la progresion de
cargas y el parseo de la revision. La portada, el registro y la proteccion de
rutas estan comprobados en navegador.

**Sin verificar en ejecucion:** todo lo que necesita un proyecto de Supabase
real (login completo, RLS en vivo, subida de fotos) y las llamadas reales a la
API de Claude. El codigo compila y esta cubierto por las pruebas, pero la
primera vez conviene hacer el recorrido completo con datos reales.

**Aun no esta hecho:** cobro con Stripe (la estructura de planes y el limite de
uso ya estan; falta el checkout y el webhook que cambie `perfiles.plan`),
lectura de codigos de barras, integracion con wearables y envio automatico de la
revision del domingo (hoy se genera con un boton).

---

Las calorias, los macros y la grasa corporal son estimaciones con formulas
estandar. My Little Brain no es un producto sanitario, no diagnostica y no
sustituye a un medico ni a un dietista-nutricionista.
