# CONTROL PLANE

Principio: **empezar con lo que ya hay.** Nada de infraestructura nueva. Git, Notion, GHL y
Sheets bastan para la primera versión, y la primera versión debe existir antes de discutir la
segunda.

## 1 · El bus: ficheros, no plataforma

Los "timbres" actuales son un bus real pero frágil: texto libre, sin acuse, y el Cerebro se entera
haciendo polling de resúmenes. Se sustituyen por algo que ya funciona en todas partes: **ficheros
append-only en una rama compartida**.

```
main (rama de integración)
└── bus/
    ├── out/
    │   ├── brain.jsonl        un fichero por agente
    │   ├── outbound.jsonl     UN SOLO ESCRITOR por fichero
    │   ├── sdr.jsonl          → cero conflictos de merge
    │   ├── demand.jsonl
    │   ├── content.jsonl
    │   ├── sales.jsonl
    │   └── ops.jsonl
    └── tasks/
        └── 2026-09.jsonl      lo escribe solo el Brain
```

**Por qué funciona:** un escritor por fichero elimina los conflictos. Es durable, versionado,
auditable y se lee con `grep`. Es el audit log y el event bus a la vez, sin montar nada.

**Cómo se usa:** cada agente añade una línea al cerrar un bloque de trabajo. El Brain lee todos los
ficheros cada mañana. Los timbres se mantienen solo para lo urgente, que es lo que no puede
esperar a mañana.

Schemas en `05-protocols/00-borrador-protocolos.md`.

## 2 · Registry

`registry.json` en la rama de integración es la única fuente de verdad sobre qué agentes existen,
qué poseen, qué pueden hacer y cómo están de salud. **Sustituye a la tabla "Quién es quién" de
`cerebro.md`**, que ya se bifurcó en tres copias.

Regla: un agente que no está en el registry no existe. Si aparece uno nuevo, o entra en el
registry o se apaga.

## 3 · Salud: el silencio es un fallo

El fallo más caro encontrado en la inspección llevaba un mes activo y nadie se enteró porque no
fallaba: simplemente no ocurría.

**Mecanismo:** Ops lee `last_run` de las 23 rutinas cada mañana a las 5:00, antes que nadie.
Cualquier rutina que debía correr y no corrió emite `agent.degraded`, y eso entra en el Morning
Brief del día.

**Y una regla estructural:** *lo semanal se ancla a lo diario*. La inspección demuestra que las
rutinas diarias se ejecutan y las semanales no. Así que el chequeo diario del lunes pregunta
"¿corrió el Weekly Plan?" y el del sábado "¿corrió el Weekly Review?". Se construye lo poco fiable
encima de lo fiable, en vez de esperar que lo poco fiable mejore solo.

## 4 · Permisos y escalera de confianza

🟢 autónomo · 🟡 prepara y pide · 🔴 solo humano.

Siempre 🔴, sin excepción y sin promoción posible: gastar dinero, poner precio, firmar, prometer
plazo o alcance, comunicar a un cliente algo sensible, borrar datos, rotar credenciales.

**La escalera** resuelve el problema de fondo: si todo lo 🟡 espera a Maikel para siempre, Maikel
es el cuello de botella para siempre.

```
🟡 con contador → 10 ejecuciones seguidas aprobadas sin corrección
                → el Brain lo propone en el Weekly Review
                → Maikel firma
                → 🟢, registrado en Decisiones
                → una sola corrección lo devuelve a 🟡
```

Solo promocionan acciones **reversibles** y de radio **interno** o, con cuidado,
**visible_cliente**. Lo irreversible no promociona nunca.

## 5 · Radio de impacto

Cada acción declara además del color su `blast_radius`:

| Radio | Significado | Control |
|---|---|---|
| `interno` | solo lo ve Qualivo | se corrige y ya |
| `visible_cliente` | llega a un cliente o prospecto | doble comprobación, sin deshacer posible |
| `irreversible` | dinero, contrato, borrado, envío masivo | siempre 🔴 |

Dos acciones pueden ser 🟡 y necesitar controles distintos. El color dice quién decide; el radio
dice cuánto cuesta equivocarse.

## 6 · Memoria: quién manda sobre cada dato

| Dato | Fuente única | Espejo permitido |
|---|---|---|
| Estrategia y posicionamiento | Google Doc Estrategia Central v1 | repo, solo lectura |
| ICPs y copy de outbound | Notion OUTBOUND BRAIN | repo, solo lectura |
| Agentes, permisos, salud | `registry.json` | ninguno |
| Leads, contactos, oportunidades | GoHighLevel | CSV derivados |
| Caja, cobros, gastos | Google Sheet Cockpit + Quipu | ninguno en Notion |
| Tareas, decisiones, sprints, experimentos | Notion Sala de Mando | ninguno |
| Código, datos, protocolos, bus | repo, rama de integración | ninguno |
| Eventos y partes | `bus/` | ninguno |

**Reparto:** Notion es la capa humana, el repo es la capa máquina, GHL es lo comercial, Sheets es
el dinero. Un dato tiene un dueño. Un espejo lo escribe un proceso, nunca una persona.

**Consecuencia inmediata:** `sistema/cerebro.md` deja de ser la constitución. Su contenido se
reparte entre `registry.json`, la Estrategia Central y Notion. Las tres copias divergentes se
borran el mismo día, no antes.

## 7 · Secretos

Regla dura: **ninguna credencial vive solo en el scratchpad de un contenedor.** Hoy varias lo
hacen y por eso hay rutinas que pueden empezar a fallar sin aviso.

Ops mantiene el inventario de dónde vive cada clave y qué rutina depende de ella. Las claves no
entran nunca en el repo.

## 8 · Observabilidad mínima

Con `bus/` y el registry se puede responder, sin preguntarle a nadie:

- Qué agentes existen y qué poseen → `registry.json`
- Qué han hecho y cuándo → `bus/out/*.jsonl`
- Qué está roto y desde cuándo → parte de salud de Ops
- Qué espera a Maikel → tareas 🟡 y 🔴 abiertas
- Por qué se decidió algo → Notion Decisiones
