# EAC · Prompt y especificación del workflow WF4

Dos formatos: el **prompt** para el asistente de IA de GoHighLevel, y la
**especificación manual** por si el asistente se queda corto (suele pasar con
las bifurcaciones). Los nombres de etiquetas, campos y plantillas son los
reales de la cuenta.

---

## 1 · PROMPT PARA EL ASISTENTE DE IA DE GOHIGHLEVEL

```
Crea un workflow llamado "WF4 · Imanes de leads".

DISPARADOR
Cuando se añade a un contacto cualquiera de estas etiquetas:
lm-test-tcp, lm-calc-sueldo, lm-guia-seleccion, lm-test-perfil, lm-temario-fd

PRIMER FILTRO — leads calientes
Si el campo personalizado "Lead Temperature" es igual a "Caliente":
  - Crea una tarea para el propietario del contacto titulada
    "Llamar en menos de 1 hora — lead caliente del blog", con vencimiento hoy.
  - Envía una notificación interna al equipo comercial.
  - Envía solo el primer email que corresponda a su imán (ver bifurcación).
  - Termina el workflow aquí. No entra en la secuencia larga.

Si no es "Caliente", continúa.

BIFURCACIÓN POR IMÁN
Según la etiqueta con la que entró, el contacto va a una de tres ramas:

Rama A — etiquetas lm-test-tcp, lm-calc-sueldo o lm-guia-seleccion
  Email de entrega según la etiqueta exacta:
    lm-test-tcp      → plantilla "EAC · S1 TCP · D0 · Tu resultado"
    lm-calc-sueldo   → plantilla "EAC · S1 TCP · D0b · Calculadora (entrega)"
    lm-guia-seleccion→ plantilla "EAC · S1 TCP · D0c · Guía de selección (entrega)"
  Después, para los tres por igual:
    esperar 1 día  → "EAC · S1 TCP · D1 · Mitos"
    esperar 2 días → "EAC · S1 TCP · D3 · Sueldo"
    esperar 2 días → "EAC · S1 TCP · D5 · Curso oficial"
    esperar 3 días → "EAC · S1 TCP · D8 · Selección"
    esperar 3 días → "EAC · S1 TCP · D11 · Precio"
    esperar 3 días → "EAC · S1 TCP · D14 · Cierre"

Rama B — etiqueta lm-temario-fd
    "EAC · S2 FD · D0 · Temario"
    esperar 2 días → "EAC · S2 FD · D2 · No es controlador"
    esperar 3 días → "EAC · S2 FD · D5 · Perfil"
    esperar 4 días → "EAC · S2 FD · D9 · Cierre"

Rama C — etiqueta lm-test-perfil
    "EAC · S3 Perfil · D0 · Comparativa"
    esperar 2 días → "EAC · S3 Perfil · D2 · Tierra"
    esperar 3 días → "EAC · S3 Perfil · D5 · Formación"
    esperar 4 días → "EAC · S3 Perfil · D9 · Cierre"

CONDICIONES DE SALIDA
El contacto sale del workflow inmediatamente si ocurre cualquiera de estas cosas:
  - Su oportunidad pasa a la etapa "Entrevistado" o "Negociación"
  - Su oportunidad se marca como ganada
  - Se le añade la etiqueta "no-cumple-requisitos" o "descartado"
  - Responde a cualquier email de la secuencia

VENTANA DE ENVÍO
Enviar solo de lunes a viernes, entre las 9:00 y las 19:00, hora de Madrid.
Si un envío cae fuera, esperar a la siguiente franja válida.
```

---

## 2 · ESPECIFICACIÓN MANUAL (si montas a mano)

**Automatización → Workflows → Crear workflow → Empezar desde cero**
Nombre: `WF4 · Imanes de leads`

### Disparador
- Tipo: **Etiqueta añadida al contacto**
- Etiqueta: `lm-test-tcp` · `lm-calc-sueldo` · `lm-guia-seleccion` · `lm-test-perfil` · `lm-temario-fd`
- Reentrada: **no permitir** que el mismo contacto vuelva a entrar

### Ajustes del workflow
- Ventana de envío: **lunes a viernes, 9:00–19:00, Europe/Madrid**
- Detener al responder: **sí**

### Paso 1 · Condición «¿es caliente?»
`Lead Temperature` **es igual a** `Caliente`

**Rama SÍ**
1. Crear tarea → propietario del contacto → «Llamar en menos de 1 hora — lead caliente del blog» → vence hoy
2. Notificación interna al equipo comercial
3. Enviar el email de entrega que corresponda a su etiqueta
4. **Finalizar workflow**

**Rama NO** → Paso 2

### Paso 2 · Bifurcación por etiqueta
Tres ramas según la etiqueta de entrada, con los emails y esperas de la tabla:

| Rama | Etiqueta de entrada | Emails (día) |
|---|---|---|
| A | `lm-test-tcp` | D0 Tu resultado · D1 · D3 · D5 · D8 · D11 · D14 |
| A | `lm-calc-sueldo` | D0b Calculadora · D1 · D3 · D5 · D8 · D11 · D14 |
| A | `lm-guia-seleccion` | D0c Guía · D1 · D3 · D5 · D8 · D11 · D14 |
| B | `lm-temario-fd` | S2 D0 · D2 · D5 · D9 |
| C | `lm-test-perfil` | S3 D0 · D2 · D5 · D9 |

> Los números son **días desde la entrada**, no esperas acumuladas.
> Entre D1 y D3 se esperan 2 días, entre D3 y D5 otros 2, y así.

### Paso 3 · Condiciones de salida
En **Ajustes del workflow → Eventos de salida**, añade:
- Etapa de oportunidad = `Entrevistado` o `Negociación`
- Estado de oportunidad = `Ganada`
- Etiqueta añadida = `no-cumple-requisitos` o `descartado`

---

## 3 · WORKFLOW COMPLEMENTARIO · WF5 · Puntuación en vivo

```
Crea un workflow llamado "WF5 · Puntuación en vivo".

DISPARADOR
Cuando un contacto hace clic en un enlace de un email.

ACCIONES
1. Suma 6 al campo numérico "Lead Score".
2. Si el nuevo valor de "Lead Score" es mayor o igual a 70:
   - Cambia el campo "Lead Temperature" a "Caliente"
   - Añade la etiqueta "caliente"
   - Crea una tarea urgente para el propietario del contacto:
     "Lead subió a caliente — llamar hoy"
   - Envía notificación interna
3. Si es menor de 70, no hagas nada más.

Permite que el mismo contacto vuelva a entrar en este workflow
(la puntuación debe poder subir varias veces).
```

---

## 4 · ANTES DE ACTIVARLO: comprobar solapamientos

La cuenta ya tiene diez workflows publicados, entre ellos `WF1 · Speed-to-Lead
Hot TCP`, `WF1 · Speed-to-Lead Hot TCP Orgánico`, `WF2 · Dispacher` y
`WF3 · Azafata de tierra`.

**Riesgo real:** un lead que entre por un imán puede disparar también uno de
esos workflows y recibir dos mensajes de bienvenida distintos en minutos.

Antes de publicar WF4:
1. Abre cada uno de esos cuatro workflows y mira su disparador.
2. Si alguno se dispara por etiqueta genérica o por fuente que también cubra a
   los imanes, añádele una **condición de exclusión**: que no entre si el
   contacto tiene la etiqueta `lead-magnet`.
3. Publica WF4 y deja pasar un día con pocos leads antes de dar por bueno.

**Prueba antes de publicar:** crea un contacto de prueba con tu email, añádele
la etiqueta `lm-test-tcp` a mano y comprueba que recibe el D0 correcto, que no
recibe nada de los otros workflows, y que al marcar su oportunidad como
`Entrevistado` sale de la secuencia.
