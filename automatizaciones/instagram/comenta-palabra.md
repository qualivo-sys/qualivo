# Instagram · «Comenta PALABRA» → mensaje directo con el recurso

Propuesta técnica del 2-nov-2026 (Automatización), encargada por Growth a petición de Maikel.
La mecánica sale del análisis de Pau Llambí (`content/research/2026-11-competidores/pau-llambi-gtm-school.md`,
rama `claude/qualivo-landing-vercel-nubk1i`): sus reels con palabra clave tienen unos 49 comentarios de
mediana y los que no la llevan, entre 2 y 10 [C, según el análisis de Growth].

> **Nada de esto está activado.** Encenderlo escribe a personas (los que comentan), así que necesita el
> OK de Maikel (regla del 29-oct).

---

## 1. Qué hay ya montado (2-nov)

- **n8n:** «Qualivo · Instagram (ManyChat) → GHL + respuesta» (`42DZcGGDJR4eUvZG`), **activo** desde
  septiembre. Recibe en el webhook `manychat-instagram` lo que manda ManyChat y crea o actualiza el
  contacto en la subcuenta de Qualivo, con las etiquetas `instagram` / `instagram-dm` y una nota.
  **No tiene ninguna ejecución reciente** [C]: o ManyChat no está conectado, o no le llega nada. Está
  por confirmar, igual que dice el agente de Contenido.
- **⚠️ Seguridad:** ese workflow lleva **el token de GHL de Qualivo escrito en claro dentro del nodo de
  código**. Hay que rotarlo y pasarlo a una credencial de n8n. Yo no lo he tocado (es producción) ni lo
  copio aquí.

## 2. Recomendación: GHL nativo; ManyChat como alternativa

| | **A · GHL (recomendada)** | **B · ManyChat + puente n8n** |
|---|---|---|
| Disparador | Workflow con *Instagram comment on a post/reel*, filtro «el comentario contiene FUGAS» | Automatización «Comment → DM» de ManyChat con palabra clave |
| Mensaje directo | Respuesta privada al comentario (*Instagram private reply / Send DM*) | DM de ManyChat |
| Contacto en el CRM | Directo: GHL crea el contacto de Instagram y le pone `ig-<palabra>` | Por el puente n8n que ya existe, añadiendo la etiqueta `ig-<palabra>` |
| Coste | Incluido en GHL | ManyChat Pro (de pago, unos 15 $/mes [E]): gasto nuevo, necesita OK |
| Riesgo | Hay que comprobar que la subcuenta de Qualivo tiene ese disparador para reels | Dos herramientas más que mantener; el puente ahora no recibe nada |

**Por qué A:** todo queda en un sitio, el contacto nace ya en el CRM con su etiqueta y no hay gasto
nuevo. Solo se pasa a B si en la subcuenta de Qualivo no aparece el disparador de comentarios de
Instagram, o si no funciona con reels.

## 3. Cómo se monta (opción A, un workflow por palabra, en GHL de Qualivo)

**Requisito:** la cuenta de Instagram de Qualivo tiene que ser **profesional**, estar vinculada a la página
de Facebook y conectada en GHL (*Settings → Integrations → Facebook & Instagram*). Eso solo puede hacerlo
Maikel, con su usuario de Meta.

**Workflow `IG · Comenta FUGAS`** (lo mismo para GUION y 5 MIN):

1. **Trigger:** *Instagram Comment* (en la interfaz puede aparecer como *Facebook/Instagram comment on
   post*) → cuenta de Qualivo → **todas las publicaciones**, con el filtro: el comentario **contiene**
   `fugas`, sin distinguir mayúsculas.
   - En pruebas, filtro adicional: solo un reel de prueba o el usuario de Maikel.
2. **Respuesta pública al comentario** (opcional, ayuda al alcance). Variar el texto entre 3 opciones para
   no repetir lo mismo: «¡Te lo mando por privado! 📩», «Enviado, mira tus mensajes 👀» o «Hecho, te
   escribo por privado».
3. **Respuesta privada (DM)** con el texto de §4.
4. **Add Tag** `ig-fugas` + `origen-instagram` · *Update contact source*: «Instagram · comenta FUGAS».
5. **Wait for reply**, hasta 24 h.
   - Si contesta a la pregunta de cualificación: se guarda en el campo `ig_respuesta`, se pone la
     etiqueta `ig-respondio` y **aviso a Maikel** (canal «Avisar a Maikel»).
   - Si no contesta: fin, **sin recordatorios**.

**Claves por palabra** (todo en minúsculas y sin espacios, para que cuadren la etiqueta y la UTM):

| Palabra en el reel | Filtro del comentario | Etiqueta | `utm_campaign` |
|---|---|---|---|
| FUGAS | contiene `fugas` | `ig-fugas` | `fugas` |
| GUION | contiene `guion` o `guión` | `ig-guion` | `guion` |
| 5 MIN | contiene `5 min` o `5min` | `ig-5min` | `5min` |

## 4. El mensaje directo (borrador; el texto final lo cierra Contenido)

> ¡Hola {{contact.first_name}}! Aquí tienes {{recurso}} 👉 {{enlace}}
>
> Una pregunta rápida para mandarte lo que de verdad te sirva: ¿cuántos contactos nuevos te entran al mes, más o menos?

- **Enlace:** `https://qualivo.io/<ruta del recurso>?utm_source=ig_dm&utm_medium=dm&utm_campaign=<palabra>`. Lo pide Growth; no se usa `utm_source=manychat`, aunque fuera la opción B, para que todo cuente igual en Intelligence.
- **Una sola pregunta**, como en el resto del sistema (nunca varias a la vez).
- **Sin vender en el DM.** La reunión se propone solo si contesta, y la propone Maikel.

## 5. Límites de Meta que condicionan el diseño

- **Una respuesta privada por comentario**, en los 7 días siguientes al comentario [E, política de Meta].
- Después, **solo se puede seguir escribiendo si la persona contesta**: se abre la ventana de 24 h. Por eso no hay recordatorios automáticos.
- Si un reel se hace viral, Instagram limita los DMs automáticos por hora [E]. GHL los encola; no hay que hacer nada, pero no es instantáneo.

## 6. Medición

- Cada contacto llega con `ig-<palabra>` y la UTM de su palabra. En Intelligence, el embudo por etiqueta es: comentarios → DMs → respuestas (`ig-respondio`) → reuniones (cita en el calendario) → clientes.
- Growth decide qué tema repetir con «reuniones por palabra», no con comentarios.

## 7. Qué necesita de Maikel

1. **Conectar la cuenta profesional de Instagram de Qualivo en GHL**, vinculada a la página de Facebook (5 min, con su usuario de Meta). Es lo único que bloquea.
2. **Elegir A (GHL) o B (ManyChat).** Mi recomendación es A. B tiene coste.
3. **El OK para encender**, primero con un reel de prueba y su usuario.
4. **Rotar el token de GHL** que está en claro en el workflow de ManyChat (2 min, en GHL → Private Integrations), o autorizarme a pasarlo a una credencial.

Contenido prepara los recursos y sus URLs. Con eso y el punto 1, yo dejo los tres workflows montados y
apagados, y los pruebo con un reel de prueba.

---

## v2 (3-nov) · ORDEN, AGENTE y VENTAS: decisión y hoja de montaje

Encargo de Contenido, confirmado por el Chief of Staff: todos los CTA acaban en «Comenta PALABRA y te
mando…». Estas tres palabras sustituyen a las de la v1 (FUGAS, GUION y 5 MIN).

### Decisión: GHL (no ManyChat)

- **El Instagram de Qualivo ya está conectado a GHL** [C, 3-nov]. Hay 45 conversaciones de Instagram en la
  subcuenta, la última de hoy, y dos perfiles de Instagram enlazados en Social Planner. No hay que
  conectar nada ni pagar ManyChat.
- **ManyChat descartado:** no tiene actividad y su puente lleva la clave de GHL en claro. Ese puente se
  queda como está; lo decide Maikel (rotar la clave y apagarlo).
- **Hecho por API hoy, en GHL de Qualivo:** etiquetas `ig-orden`, `ig-agente`, `ig-ventas` e
  `ig-respondio`, y el campo `contact.ig_respuesta` (`origen-instagram` ya existía).
- **Los workflows no se pueden crear por API** en GHL. Se montan en la interfaz, unos 30 minutos, con esta
  hoja: Maikel o el agente con navegador.

### Las tres palabras

| Comentario | Recurso (lo escribe Contenido) | Etiqueta | `utm_campaign` | Pregunta de cualificación |
|---|---|---|---|---|
| contiene `orden` | Plantilla para ordenar contactos por «¿encaja?» y «¿tiene interés?» | `ig-orden` | `orden` | «¿Cuántos contactos nuevos te entran al mes, más o menos?» |
| contiene `agente` | Reglas del agente de WhatsApp | `ig-agente` | `agente` | «¿Hoy quién contesta los WhatsApp de los leads, tú o alguien del equipo?» |
| contiene `ventas` | Checklist para que las campañas aprendan de quién compra | `ig-ventas` | `ventas` | «¿Cuánto inviertes al mes en anuncios, más o menos?» |

Enlace de cada recurso: `https://qualivo.io/<ruta>?utm_source=ig_dm&utm_medium=dm&utm_campaign=<palabra>`.

### Workflow (uno por palabra) · `IG · Comenta ORDEN`, igual para AGENTE y VENTAS

1. **Trigger:** *Instagram Comment* (puede aparecer como *Facebook/Instagram Comment On Post*).
   - **Elegir el perfil de Qualivo:** hay dos perfiles de Instagram conectados, así que hay que comprobar el usuario.
   - Publicaciones: **solo el reel de prueba** mientras se prueba; después, todas.
   - Filtro: el comentario **contiene** `orden`, sin distinguir mayúsculas.
2. **Respuesta pública al comentario** (opcional), rotando 3 textos: «¡Te lo mando por privado! 📩», «Enviado, mira tus mensajes 👀» y «Hecho, te escribo por privado».
3. **Respuesta privada (DM):**
   > ¡Hola {{contact.first_name}}! Aquí tienes {{recurso}} 👉 {{enlace con UTM}}
   >
   > Una pregunta rápida para mandarte lo que te sirva: {{pregunta de la tabla}}
4. **Add Tag:** `ig-orden` + `origen-instagram`.
5. **Wait for reply**, hasta 24 h:
   - si contesta → **Update field** `ig_respuesta` = su respuesta → **Add Tag** `ig-respondio` → **Internal notification** a Maikel con el contacto y la respuesta;
   - si no contesta → fin. **Sin recordatorios:** Meta solo deja una respuesta privada por comentario.
6. **Settings:** *Allow re-entry* OFF y *Stop on response* ON. **Se queda en Draft.**

### Prueba (antes de encender)

1. Workflow publicado con el trigger limitado al **reel de prueba**. Desde el Instagram personal de Maikel, se comenta «orden».
2. Tiene que pasar todo esto:
   - llega el DM con el enlace y la UTM correcta;
   - el contacto aparece en GHL con `ig-orden` y `origen-instagram`;
   - al contestar, se rellena `ig_respuesta` y llega el aviso.
3. Se repite con «agente» y «ventas», y con un comentario sin palabra, que no tiene que provocar nada.
4. **Encender para todas las publicaciones:** con el OK directo de Maikel (ventana de las 16:30).
