# EAC · Automatizaciones en n8n

Tres workflows creados el 2-oct-2026 en `qualivo.app.n8n.cloud`, **los tres inactivos**
a la espera de revisión. Salen de los acuerdos de la reunión del 29 de septiembre.

Las credenciales van en el almacén cifrado de n8n (`EAC · GHL (Bearer)` y
`EAC · Meta (token)`), no en los nodos. Ningún token en este repo.

---

## 1 · `EAC · Calidad de lead → Meta (CAPI)` — `vkV67LyK3JQ88jvl`

**El compromiso de la reunión:** «conexión API para comunicar a Meta el estado de
precalificación de leads».

**Por qué importa.** Hoy Meta solo sabe que alguien rellenó el formulario, así que
optimiza hacia leads de 2 € que luego no se presentan: el formulario instantáneo
tiene un 75 % de plantón. Esto le devuelve la señal que le falta — quién llegó a
agendar y quién llegó a entrevistarse — para que busque gente que sí aparece.

**Webhook:** `POST https://qualivo.app.n8n.cloud/webhook/eac-calidad-lead`

```json
{ "contactId": "...", "stage": "Entrevistado",
  "email": "...", "phone": "+34...",
  "campaign": "...", "ad": "..." }
```

Mapeo de etapas a eventos (solo señal positiva; Meta no aprende bien de la negativa):

| Etapa del tablero | Evento en Meta | Valor |
|---|---|---|
| Cita Programada | `CitaAgendada` | 20 € |
| Entrevistado | `EntrevistaRealizada` | 100 € |
| Matriculado *(cuando exista la columna)* | `Matricula` | 1.500 € |

Cualquier otra etapa no envía nada. Un lead sin email ni teléfono tampoco: Meta
no podría casarlo.

**Para activarlo** hace falta un workflow en GHL que llame a ese webhook cuando
una oportunidad cambie de etapa.

**Verificado:** hashes SHA-256 comprobados contra los de referencia y evento
aceptado por Meta (`events_received: 1`).

---

## 2 · `EAC · Precalificación y prioridad de leads` — `ACW2C85sKeVXqNNv`

**El compromiso de la reunión:** priorizar calientes y templados para que Luz no
tenga que llamar a 560 leads al mes a ciegas.

**Webhook:** `POST https://qualivo.app.n8n.cloud/webhook/eac-precalificacion`

```json
{ "contactId": "...", "opportunityId": "...",
  "firstName": "...", "programa": "TCP",
  "provincia": "Barcelona", "nivel_ingles": "B2",
  "estudios": "Bachillerato", "edad": 24,
  "cuando_empezar": "ya", "source": "web" }
```

Puntúa y etiqueta `lead-caliente` / `lead-templado` / `lead-frio`. Si sale
caliente, además mueve la oportunidad a la columna 🔥 y crea una tarea de
llamada a 1 hora para Ludmila.

Criterios (primera versión): geografía (TCP es presencial en Barcelona, fuera de
Cataluña resta), nivel de inglés, estudios, edad, cuándo quiere empezar y canal
de entrada. Umbrales: 55 puntos para caliente, 30 para templado.

> ⚠️ **Los umbrales son nuestros, no de Javier.** Él tenía preparadas las reglas
> de requisitos por programa (TCP limitado a Cataluña; despachador nacional con
> requisitos de estudios e inglés). Hay que cuadrarlas con las suyas antes de
> activar, y mapear los nombres reales de los campos del formulario.

**Probado** con cuatro casos: Barcelona con inglés alto sale caliente (110 pts),
Sevilla con inglés bajo sale frío (−15), despachador nacional sale caliente (70),
menor de edad sale frío (−10).

---

## 3 · `EAC · Vigilar WhatsApp` — `em8IwiSMncL4rtGk`

Cada mañana a las 9 mira si ha habido actividad de WhatsApp en las últimas 36 h.

Existe porque el 21 de septiembre la conexión se cayó y **nadie lo notó durante
siete días**: 135 mensajes que no llegaron y las citas de la semana a la mitad.
Simulado contra aquel apagón, habría avisado el 23 por la mañana — seis días
antes de que lo notara el cliente.

> ⚠️ **Le falta el nodo de aviso.** La credencial de Slack del espacio no está
> compartida con la API, así que el workflow calcula el diagnóstico y ahí se
> queda. Hay que añadirle a mano un nodo de Slack al canal `general-qualivo`
> conectado a «¿Sigue entrando algo?». Es lo único que queda para que sirva.

---

## Pendiente de EAC para que esto funcione

- Crear en GHL los dos workflows que llaman a los webhooks 1 y 2.
- Pasar las reglas de requisitos de Javier y los nombres reales de los campos.
- Crear la columna «Matriculado»: sin ella el evento de más valor nunca se dispara,
  y es justo el que mejor enseñaría a Meta a quién buscar.
