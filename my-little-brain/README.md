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
| **Revision semanal** | El informe de los domingos: puntuaciones, patrones, cuello de botella y tres acciones para la semana siguiente. Se genera sola cada domingo para los usuarios Pro. |
| **Check-in diario** | Manana (sueno, animo, energia, peso) y noche (foco, pasos, notas), en dos formularios de diez segundos. |
| **Progreso** | Logros, constancia por semana, horas de foco, peso, grasa, sueno y animo. |
| **Cuenta** | Recuperar y cambiar contrasena, descargar todos los datos en JSON y borrar la cuenta (RGPD). |
| **Avisos** | Notificaciones push: el coach te escribe por la manana y por la noche (abren el chat con el check-in lanzado), recuerda el entreno pendiente y avisa cuando la revision del domingo esta lista. |
| **Comidas** | Calculadora con tabla de ~95 alimentos: "200 g pollo, 150 arroz, 1 cucharada de aceite" sale calculado al momento, sin IA. El coach usa la misma tabla. |

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
5. **Lecturas gratis, sin llamar al modelo.** El panel saca solo sus propias
   conclusiones —"duermes 5,8 h y tus dias cortos rinden un 40% menos de foco",
   "llevas 4 dias sin entrenar", "alcohol 3 de los ultimos 7 dias"— con datos y
   una accion concreta. Cuestan cero y siempre son ciertas.
6. **El chat responde escribiendo.** Streaming token a token y las acciones
   ejecutadas van apareciendo bajo la respuesta segun se guardan.

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
| `SUPABASE_SERVICE_ROLE_KEY` | para pagos y cron | Se salta RLS. Solo servidor: webhook de Stripe y tarea del domingo. |
| `ANTHROPIC_API_KEY` | para el coach | Sin ella el resto de la app funciona; el chat avisa. |
| `ANTHROPIC_MODEL` | no | Modelo del chat. Por defecto `claude-opus-5`; `claude-sonnet-5` cuesta menos de la mitad y va muy bien. |
| `ANTHROPIC_MODEL_REVISION` | no | Modelo de la revision semanal. Por defecto el del chat. |
| `ANTHROPIC_WORKSPACE_ID` | segun la clave | Si la API responde "anthropic-workspace-id is required", tu clave es vinculada a identidad: pon aqui el `wrkspc_…` de Console → Settings → Workspaces. |
| `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET` | para cobrar | Sin ellas la app no ofrece pagar. |
| `NEXT_PUBLIC_SITE_URL` | no | URL publica, para las vueltas de Stripe. En Vercel se deduce. |
| `CRON_SECRET` | para el cron | Cadena aleatoria; Vercel la manda como Bearer. |
| `NEXT_PUBLIC_LEGAL_EMPRESA`, `_CIF`, `_DIRECCION`, `_EMAIL` | para publicar | Responsable del tratamiento en `/legal`. Mientras falten, esas paginas muestran un aviso. |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | para avisos | Claves Web Push (`npx web-push generate-vapid-keys`). Sin ellas, Ajustes dice que los avisos no estan configurados. |

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
    entrar/                     Login y registro (Supabase Auth, con consentimiento de datos de salud)
    recuperar/                  Recuperar contrasena por email
    legal/                      Politica de privacidad y terminos
    auth/callback/              Vuelta del email de confirmacion
    app/
      page.tsx                  Panel del dia: puntuaciones, metas, habitos, entreno
      coach/                    Chat con el coach (streaming)
      checkin/                  Check-in de manana y de noche
      progreso/                 Logros, constancia y graficas
      onboarding/               Alta conversacional (sin formularios)
      entreno/                  Plan + registro de sesion con progresion
      cuerpo/                   Peso, medidas, comidas del dia y graficas
      habitos/                  Habitos, rejilla de 7 dias y rachas
      semana/                   Revision semanal (el informe del domingo)
      ajustes/                  Perfil, plan, contrasena, exportar y borrar cuenta
      acciones.ts               Server actions (toda la escritura desde la UI)
    api/coach/                  Chat con herramientas (el corazon del producto)
    api/revision/               Generacion de la revision semanal
    api/pago/                   Stripe: checkout, portal y webhook
    api/cron/revision/          Tarea de los domingos (Vercel Cron)
    api/exportar/               Portabilidad: todos los datos del usuario en JSON
  lib/
    motor/                      Dominio puro, sin dependencias externas
      ejercicios.ts             Catalogo (~55 ejercicios con patron, material y tecnica)
      planificador.ts           Plantillas semanales y seleccion de ejercicios
      progresion.ts             Progresion doble, 1RM estimado, tonelaje
      nutricion.ts              Mifflin-St Jeor, macros y ajuste por tendencia
      cuerpo.ts                 IMC, grasa US Navy, tendencia de peso
      puntuaciones.ts           Agregacion diaria, notas por area, XP y correlaciones
      senales.ts                Lecturas proactivas calculadas sin IA
      logros.ts                 Logros derivados de los datos
    ia/
      prompt.ts                 Personalidad y reglas del coach
      herramientas.ts           Las 13 herramientas que puede usar (y su ejecucion)
      contexto.ts               El contexto de datos que recibe en cada mensaje
      revision.ts               Estadisticas de la semana y prompt de la revision
      limites.ts                Cuota de mensajes por plan
    datos.ts                    Carga unica del panel (una sola fuente de verdad)
    pago.ts                     Stripe (cliente y helpers)
    sse.ts                      Lector de Server-Sent Events del chat
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
- **Streaming (SSE)**: la respuesta se emite token a token con eventos `texto`,
  `accion`, `fin` y `error`. Las acciones aparecen bajo el mensaje segun se
  guardan, con el XP ganado.

El alta usa el mismo motor con otro prompt: pregunta de una en una, va guardando
el perfil segun se lo cuentas y termina generando el plan.

### La revision semanal

`POST /api/revision` calcula en codigo todas las cifras de la semana
(adherencia, medias, alcohol, sueno, correlaciones) y le pide al modelo que las
**interprete** y senale el cuello de botella. La respuesta se guarda en
`revisiones` y se puede regenerar.

### Cobro (Stripe)

`POST /api/pago/checkout` abre la sesion de Stripe Checkout con el `user_id` en
los metadatos; `POST /api/pago/portal` abre el portal de facturacion. El
**webhook** (`/api/pago/webhook`) verifica la firma con el cuerpo crudo y es la
unica fuente de verdad del plan: escribe `perfiles.plan` con service role al
completarse el pago y al actualizarse o cancelarse la suscripcion. Si las
variables de Stripe no estan, la app simplemente no ofrece pagar.

Para probarlo en local: `stripe listen --forward-to localhost:3000/api/pago/webhook`.

### La revision automatica de los domingos

`vercel.json` programa `/api/cron/revision` los domingos a las 07:00 UTC. La
tarea recorre a los usuarios Pro con datos de la semana, genera la revision que
falte y la deja guardada. Va protegida con `CRON_SECRET` y se salta a quien no
tenga nada registrado, para no gastar llamadas.

### Privacidad y RGPD

Se tratan datos de salud (categoria especial), asi que ademas del contrato hay
**consentimiento explicito** en el registro (queda anotado con fecha en los
metadatos del usuario). El usuario puede ejercer por su cuenta los derechos que
mas se ejercen: **portabilidad** (`/api/exportar`, JSON con todo) y
**supresion** (borrar cuenta desde Ajustes: el `on delete cascade` de
`auth.users` se lleva todas las tablas y las fotos se borran del bucket). Los
textos de `/legal` estan escritos para este producto y esta arquitectura
(Supabase en Irlanda, Anthropic como encargado, Stripe, sin cookies de
analitica); los datos del responsable van por variables de entorno. **Que los
revise alguien de legal antes de cobrar a nadie**: son un punto de partida
serio, no un dictamen.

### Avisos push y el cron horario

Los avisos son Web Push estandar (funcionan en Android y en iPhone con la app
anadida a la pantalla de inicio). El navegador se suscribe en Ajustes, el
service worker (`public/sw.js`) pinta el aviso y al tocarlo abre la ruta que
toque: el de la manana y el de la noche abren el chat con el check-in ya
lanzado, y el coach pregunta lo que falta en un solo mensaje.

Que aviso toca a cada hora lo decide `decidirAvisos()` en `src/lib/push.ts`
(logica pura, con pruebas): cada tipo sale como mucho una vez al dia, en la
hora local del usuario, y solo si hay algo pendiente (nada de "buenos dias"
si ya has hecho el check-in).

`/api/cron/avisos` debe llamarse **cada hora**. Vercel Hobby solo permite crons
diarios, asi que el disparo horario esta en GitHub Actions
(`.github/workflows/mlb-avisos.yml`), que necesita el secreto `CRON_SECRET` en
el repo (Settings → Secrets and variables → Actions) con el mismo valor que en
Vercel. Si el proyecto pasa a Vercel Pro, basta con mover la entrada a
`vercel.json`.

### Multiusuario y modelo de seguridad

Cada tabla tiene `user_id` y politicas de RLS `auth.uid() = user_id`; las fotos
viven en `comidas/<user_id>/…` con la misma regla. Tres decisiones importan mas
de lo que parece, porque la clave `anon` viaja en el navegador y cualquier
usuario puede llamar a la API de Supabase directamente con su token:

1. **RLS filtra filas, no columnas.** `perfiles` guarda `plan` y los
   identificadores de Stripe, asi que la escritura esta cortada por columna:
   `revoke update on perfiles` y `grant update (…)` solo sobre los campos que el
   usuario edita de verdad. Sin esto, cualquiera podria ponerse plan `founder` o
   escribirse el `stripe_customer_id` de otra persona y abrir su portal de
   facturacion.
2. **El contador de uso no es dato del usuario.** `uso_ia` tiene politica de
   solo lectura; se incrementa con la funcion `incrementar_uso`
   (`security definer`), que solo sabe sumar. Si el usuario pudiera escribir la
   tabla, se pondria el contador a cero y consumiria API a tu cuenta.
3. **El plan lo decide Stripe.** Solo el webhook, con service role, escribe
   `perfiles.plan`. Para regalarte a ti mismo el plan `founder`, hazlo desde el
   SQL editor de Supabase:
   `update perfiles set plan = 'founder' where email = 'tu@email.com';`

El limite de mensajes al coach se lleva por mes y plan (`free` 40, `pro` 1500,
`founder` 100.000) y se comprueba antes de cada llamada.

---

## Estado

**Probado:** el dominio completo pasa `npm run prueba` — las 13 herramientas
escriben donde deben, el emparejamiento de ejercicios por nombre libre, el plan
que excluye ejercicios segun las lesiones, el calculo de calorias y grasa, la
agregacion diaria, las puntuaciones, el contexto del coach, la progresion de
cargas, las senales proactivas, los logros, el lector de streaming (incluidos
bloques partidos entre chunks y bloques corruptos) y el parseo de la revision.
La portada, el registro y la proteccion de rutas estan comprobados en navegador.

**Revisado en seguridad:** se paso una revision especifica sobre RLS, rutas de
API, webhook, uso de la service-role key y el ejecutor de herramientas. Salieron
dos agujeros reales —escalado de plan por columna en `perfiles` y borrado del
contador `uso_ia`— y los dos estan corregidos en el esquema (ver arriba). Si ya
habias ejecutado `schema.sql` antes, vuelve a ejecutarlo: es idempotente y
aplica las dos correcciones.

**Sin verificar en ejecucion:** todo lo que necesita un proyecto de Supabase
real (login completo, RLS en vivo, subida de fotos) y las llamadas reales a la
API de Claude. El codigo compila y esta cubierto por las pruebas, pero la
primera vez conviene hacer el recorrido completo con datos reales.

**Aun no esta hecho:** notificaciones push, modo offline con cola de
sincronizacion, emails con marca propia (confirmacion y revision del domingo),
lectura de codigos de barras, integracion con wearables y monitorizacion de
errores. La revision del domingo se genera sola pero no se notifica: aparece
en la app.

---

Las calorias, los macros y la grasa corporal son estimaciones con formulas
estandar. My Little Brain no es un producto sanitario, no diagnostica y no
sustituye a un medico ni a un dietista-nutricionista.
