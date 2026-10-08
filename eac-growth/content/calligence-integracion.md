# EAC · Integración con Calligence

Petición de Andrés Herranz (CTO de Calligence), 5-oct-2026. Necesitan token,
`location_id` y `calendar_id` para montar la integración; después nos devuelven
la URL del webhook al que mandaremos los leads que queramos que trabajen.

Documentación: https://calligence.ai/docs/integraciones/gohighlevel/

---

## 1 · Lo que hay que enviarles

### El token — «ojo a lo que se comenta en la documentación»

A lo que se refiere Andrés: **rechazan las API keys antiguas de GoHighLevel, las
que empiezan por `eyJ`**. Hace falta un *Private Integration Token*, que empieza
por `pit-`. La cuenta de EAC ya usa uno de ese formato, así que el aviso está
cubierto.

**Aun así, conviene crear uno nuevo solo para Calligence**, no reutilizar el que
ya usamos en el panel y en n8n. Dos razones: si algún día hay que revocar el de
Calligence no se cae todo lo demás, y al revés. Y así cada integración lleva solo
los permisos que necesita.

Se crea en **Ajustes → Private Integrations** de la subcuenta, con estos permisos
exactos:

- `View Contacts`
- `Edit Contacts`
- `View Calendar Events`
- `Edit Calendar Events`  *(los dos de calendario solo si queremos que Calligence agende)*

### El `location_id`

`5Eylu2xUj1SoQaQnfmF8` — ya enviado. Es el que aparece en la URL del navegador
después de `/location/`. Calligence valida que el token se creó en esa misma
subcuenta.

### El `calendar_id` — opcional, pero conviene

Decide en qué calendario crea Calligence las citas. **Recomiendo el de TCP online:**

```
ioHhQzGFWSDrTZ5wiWJK   ·   TCP Online
```

No es una preferencia estética: en septiembre la cita online plantó al **44 %**
y la presencial al **74 %**. Si Calligence va a agendar de forma automática, que
agende en el formato que la gente sí cumple. La visita presencial se puede
ofrecer después, a quien la pida.

Los otros, por si se quiere otra cosa:

| Calendario | Id |
|---|---|
| TCP Presencial | `xQnPRSCwFBsyaNyuLx6g` |
| Azafata de Tierra | `ZUGucAyo260mo68ieXB7` |
| Despachador de Vuelo | `NOOzpOmm1qgvr0LA2kKv` |

---

## 2 · Qué leads les mandamos

Andrés dice «los leads que queráis que trabajemos», así que esto lo decidimos
nosotros. El problema de partida es conocido: **562 leads en septiembre y una
sola comercial**, con una cola que llegó a 60 pendientes.

Propuesta, apoyada en el workflow de precalificación que ya está montado en n8n:

| Temperatura | Quién lo trabaja | Por qué |
|---|---|---|
| **Caliente** | Luz, a mano, en menos de 1 h | Son pocos y es donde el trato humano rinde |
| **Templado** | Calligence | El grueso de la cola, hoy mal atendido |
| **Frío** | Calligence | Hoy directamente no se llaman |
| Sin teléfono válido | Nadie | No hay nada que trabajar |

Así Luz deja de elegir a ciegas sobre 560 fichas y se queda con las que de verdad
pueden acabar en matrícula.

---

## 3 · Los workflows de vuelta

Andrés recomienda basarlos en las etiquetas que ellos ponen al terminar. Son
cuatro, y **las añaden pero nunca las quitan**:

| Etiqueta de Calligence | A qué columna mover | Comentario |
|---|---|---|
| `Calligence: Éxito` | **Cita Programada** | Han conseguido agendar |
| `Calligence: No interesado` | **PERDIDO** | Conviene pedirles el motivo si lo devuelven |
| `Calligence: Inválido` | **No localizado** | EAC no tiene columna «Inválido»; ésta es la equivalente |
| `Calligence: Pendiente` | **Llamados** | Lo intentaron pero no cerraron; sigue vivo |

Regla que hay que respetar: **nunca mover hacia atrás un trato que ya está más
avanzado**. Si alguien ya está en Entrevistado y llega un `Calligence: Pendiente`
tardío, se ignora.

### Un efecto secundario que nos interesa

Cuando Calligence mueva un lead a **Cita Programada**, el workflow `WF9` que ya
está escrito dispara el webhook de n8n y **Meta recibe el evento `CitaAgendada`**.
Es decir: el trabajo de Calligence alimenta solo el aprendizaje de las campañas,
sin montar nada más.

---

## 4 · Prompt del workflow de envío (para crear ya)

Se puede dejar montado antes de tener la URL; solo hay que pegarla cuando llegue.

```
Create a workflow named "WF12 · Enviar lead a Calligence".

Trigger: Contact Tag is added, tag "lead-templado".
Add a second trigger: Contact Tag is added, tag "lead-frio".
No re-entry: the same contact must not be sent twice.

First step, an If/Else condition:
  If the contact has a phone number → continue.
  Otherwise → End workflow.

If it continues, a Webhook:
  Method: POST
  URL: <PENDIENTE — la manda Calligence>
  Content type: JSON
  Body:
    lead_id  → the contact id
    location_id → 5Eylu2xUj1SoQaQnfmF8

Then add the tag "enviado-calligence".
End workflow.
```

Las etiquetas `lead-templado` y `lead-frio` las pone el workflow de
precalificación de n8n, así que las dos piezas encajan sin trabajo extra.

---

---

## 5 · Respuestas a lo que preguntó Andrés (8-oct)

### ¿El calendario es de una persona o round robin?

**Round robin, los cuatro.** Cada uno reparte al 50 % entre dos personas:

| Calendario | Reparto |
|---|---|
| TCP Online · `ioHhQzGFWSDrTZ5wiWJK` | Cursos EAC 50 % · Ludmila Mia 50 % |
| TCP Presencial · `xQnPRSCwFBsyaNyuLx6g` | igual |
| Azafata de Tierra · `ZUGucAyo260mo68ieXB7` | igual |
| Despachador · `NOOzpOmm1qgvr0LA2kKv` | igual |

Son IDs de calendario, no de grupo.

### El campo del curso

Existe: **`Programa interes`**, id `nNHjlcQ0uABOGPQDwfI6`, tipo opción única.

**Pero estaba relleno en el 2 % de los contactos.** Sobre 300 revisados, solo 5
lo tenían; los 189 que vienen de Facebook, ninguno. Meta no lo manda, así que
Calligence habría leído vacío casi siempre.

Resuelto en n8n: el workflow de precalificación **deduce el curso** del nombre
de la campaña (`attributionSource.campaign`) o del formulario de la web, y lo
escribe antes de que el lead salga hacia Calligence. Verificado:

| Origen | Deduce |
|---|---|
| `[AD] Clientes Potenciales (Intereses)` | TCP / Auxiliar de vuelo |
| `Despachador de vuelo web` | Flight Dispatcher |
| `Auxiliar de vuelo web` | TCP / Auxiliar de vuelo |
| TikTok, sin campaña reconocible | Aun no estoy seguro |

> ⚠️ **El campo no tiene opción para «Azafata de tierra».** Sus opciones son
> TCP / Auxiliar de vuelo, Piloto comercial, Flight Dispatcher, Marketing aereo
> y Aun no estoy seguro. Mientras ATO siga pausada no molesta, pero si se
> reactiva hay que añadir la opción o esos leads irán mal etiquetados.

---

## 6 · El envío, montado en n8n

`EAC · Enviar lead a Calligence` (`FF3vkBcZWMM7Ubmg`), inactivo.

Recibe un `contactId`, se trae el contacto de GHL y antes de mandar nada
comprueba dos cosas: que hay **teléfono válido** (Calligence va a llamar: sin
número gastaríamos un lead de su cuota) y que **no se ha enviado ya**. Después
marca el contacto con `enviado-calligence`.

La URL del webhook vive **solo dentro de n8n**, nunca en este repo: Andrés pidió
tratarla como una contraseña.

---

## 7 · Lo que falta

- [ ] Crear el Private Integration token dedicado y mandárselo a Andrés
- [ ] Confirmarle el `calendar_id` que elijamos
- [ ] Esperar su URL de webhook y pegarla en `WF12`
- [ ] Crear los cuatro workflows de vuelta por etiqueta
- [ ] Preguntarles si devuelven el motivo del «No interesado»: sin eso perdemos
      la información más útil de toda la operación
