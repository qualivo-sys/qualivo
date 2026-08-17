# video-003 · «Le pedí a la IA que me ayudara con el trabajo»

> Concepto de Maikel, 17-ago-2026. Humor: delega todo en agentes que son clones
> suyos, se va a descansar, y acaba gestionando a sus propios agentes. Remate:
> «Igual me he pasado automatizando.» Botón: el Agente de agentes le convoca a
> una reunión.

**Por qué funciona con la regla de marca:** los Maikels generados SON el chiste.
El vídeo declara que son IA desde el primer segundo — transparencia por diseño,
no hay humo que esconder.

**Duración:** 35-40 s · 9:16 · Soul `013da942-1cb0-465a-8dbd-080b1acb7a41`

---

## Tres decisiones de producción (tomadas antes de gastar)

### 1 · Quién habla y quién no

Sin sincronía labial en castellano (regla del proyecto), así que:

- **Habla en cámara = Maikel real.** La frase de apertura y el remate final los
  graba él con el móvil. Son las dos frases que sostienen el vídeo.
- **Los agentes no mueven la boca.** Sus frases van como VOZ EN OFF (grabada por
  Maikel, jugando a variar el tono — él hablando consigo mismo es parte del
  chiste) + rótulo AGENTE DE ADS / CRM / CONTENIDOS.
- **El Agente de agentes tampoco habla:** mira a cámara y su frase entra como
  notificación en pantalla. Más seco, más gracioso.

### 2 · Los cinco Maikels a la vez: rejilla, no clonación

Un plano único con cinco clones en la misma habitación es la toma más frágil
posible (composición multicapa, luz que no casa, deriva de identidad). En su
lugar: **rejilla estilo videollamada** — cada agente en su celda con su rótulo,
apareciendo uno a uno hasta llenar la pantalla. Es más barato (reutiliza los
clips de los agentes), cero riesgo, y encaja mejor con el concepto: los agentes
VIVEN en pantallas. ffmpeg hace la rejilla en local.

### 3 · Los teléfonos que suenan: notificaciones generadas

Nada de grabar el móvil sonando: las llamadas entrantes («Cliente», «Alba»,
«Equipzilla», «CRM»…) se generan como PNG de notificación con Chromium y se
superponen en cascada sobre el plano de la piscina. Control total del ritmo del
gag, que es donde vive la risa.

---

## Escaleta

| # | Seg | Origen | Contenido |
|---|-----|--------|-----------|
| 1 | 0-5 | **REAL** | Maikel agotado ante el ordenador. A cámara: «He decidido delegar todo mi trabajo en agentes de IA.» |
| 2 | 5-9 | Soul+Kling | Clon concentradísimo ante el ordenador. Rótulo AGENTE DE ADS. VO: «Yo me encargo de las campañas.» |
| 3 | 9-13 | Soul+Kling | Clon mirando pantalla y asintiendo muy serio. AGENTE DE CRM. VO: «Yo me encargo de los interesados.» |
| 4 | 13-17 | Soul+Kling | Clon tecleando frenético. AGENTE DE CONTENIDOS. VO: «Yo hago el contenido.» |
| 5 | 17-22 | rejilla | Las celdas se apilan: los 3 agentes + clon con cascos + clon con café. VO Maikel real: «Perfecto. Pues yo descanso.» |
| 6 | 22-27 | Soul+Kling | Clon tumbado en la piscina con una bebida. Silencio. Rótulo pequeño: «Por fin.» |
| 7 | 27-33 | mismo plano | Cascada de notificaciones de llamada: Cliente → Alba → Equipzilla → CRM → más y más. Sonido de vibración. |
| 8 | 33-38 | **REAL** | Maikel mira a cámara: «Igual me he pasado automatizando.» Corte a negro. |
| 9 | 38-41 | Soul+Kling | Negro. Rótulo AGENTE DE AGENTES. Clon mira a cámara. Notificación: «Maikel, tienes una reunión.» |

Planos generados: 2 de escena (agentes cascos/café solo aparecen en rejilla) →
**6 vídeos Kling** (agentes ×3, piscina, agente-agentes, +1 de repuesto) y
**~6 imágenes Soul** de arranque. Coste estimado: **75-90 creditos** de ~170.

Nota Regla 1: todas las acciones son simples — sentado trabajando, asintiendo,
tecleando, tumbado. Ninguna coreografía.

---

## Lo que tiene que grabar Maikel (10 minutos con el móvil)

1. **Plano 1:** en una mesa con ordenador, cara de agotado, la frase de apertura.
   Tres tomas. Vertical.
2. **Plano 8:** mirando a cámara, pausa, «Igual me he pasado automatizando».
   Tres tomas: seria, medio sonriendo, y resignada. Vertical.
3. **Nota de voz** con todas las frases de los agentes + «Perfecto. Pues yo
   descanso.» — variando un poco el tono por agente.

Con esos tres archivos, el resto es máquina.
