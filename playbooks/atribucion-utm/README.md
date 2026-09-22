# Playbook · Atribución y UTM de punta a punta

Cómo dejar una cuenta de cliente midiendo de verdad de dónde viene cada lead:
UTM en todos los anuncios, los campos donde caen en el CRM, y la comprobación
de que el recorrido completo funciona.

Escrito a partir de la implantación en **EAC · Escola Aeronàutica de Catalunya**
(Meta + Google Ads + TikTok → GoHighLevel + GA4 + GTM), septiembre 2026. Las
cifras y los nombres propios que aparecen son de ese caso; el procedimiento es
genérico.

**Para reusarlo en otra sesión, basta con:**

> Lee `playbooks/atribucion-utm/README.md` y aplícalo al cliente EAC (Escola
> Aeronàutica de Catalunya): landing, formularios de GHL, cuenta de Meta y
> Google Ads.

---

## 0 · Antes de tocar nada: credenciales

**Innegociable:** ninguna clave en el repo. Todo por variables de entorno o un
`.env` que esté en `.gitignore`. Los scripts leen solo del entorno. Si un
secreto se expone, se rota.

```bash
export META_TOKEN=...            # token de usuario con ads_management
export META_ACT=act_XXXXXXXXXX   # cuenta publicitaria
export META_PAGE=...             # página de Facebook
export META_IG=...               # cuenta de Instagram vinculada
export META_PIXEL=...

export GHL_TOKEN=pit-...         # Private Integration Token
export GHL_LOCATION=...

export GADS_DEV_TOKEN=...        # developer token
export GADS_CLIENT_ID=...
export GADS_CLIENT_SECRET=...
export GADS_REFRESH_TOKEN=...
export GADS_LOGIN_CID=...        # el MCC, sin guiones
export GADS_CID=...              # la cuenta del cliente, sin guiones
```

### Google Ads NO acepta cuenta de servicio

Esto cuesta una tarde si no se sabe. La API de Google Ads **no admite una
service account** normal: solo OAuth de usuario, o una service account con
delegación a nivel de dominio de Workspace (que el cliente casi nunca tiene).

Lo que sí funciona, y es lo que usamos:

1. Crear credenciales OAuth de tipo **Aplicación de escritorio** en un proyecto
   de Google Cloud propio (de la agencia, no del cliente).
2. Pedir consentimiento con el scope `https://www.googleapis.com/auth/adwords`
   desde una cuenta que tenga acceso a la cuenta de Google Ads del cliente.
3. Guardar el **refresh token** y canjearlo por un access token en cada llamada.
4. En cada petición: cabecera `developer-token`, y `login-customer-id` con el
   **MCC**, no con la cuenta del cliente. Sin eso da 403 aunque los permisos
   estén bien.

Para Sheets y GA4 sí vale una service account con JWT: se comparte el documento
o la propiedad con el email `...@....iam.gserviceaccount.com`.

---

## Qué hay en esta carpeta

```
playbooks/atribucion-utm/
├── README.md
├── .env.example                   copiar a .env (git-ignored) y rellenar
└── scripts/
    ├── lib.mjs                    Meta, GHL y Google Ads; credenciales solo del entorno
    ├── diagnostico.mjs            las 5 preguntas, solo lectura
    ├── ghl-campos.mjs             crea los 7 campos en el CRM (idempotente)
    ├── meta-utm.mjs               UTM en todos los anuncios de Meta (--dry para simular)
    ├── gads-utm.mjs               plantilla de seguimiento en Google Ads (--dry)
    ├── gtm-utm-iframe.js          etiqueta de GTM para formularios en iframe
    ├── lead-handler-ejemplo.js    backend que escribe las UTM en el CRM
    └── prueba-e2e.mjs             lead de prueba → comprueba → borra
```

Los que cambian algo aceptan `--dry`. Úsalo siempre la primera vez.

---

## 1 · Diagnóstico en 10 minutos

Antes de cambiar nada, saber qué está roto. `scripts/diagnostico.mjs` responde
a las cinco preguntas de golpe:

```bash
node scripts/diagnostico.mjs
```

| # | Pregunta | Señal de alarma |
|---|---|---|
| 1 | ¿El píxel recibe eventos hoy? | 0 eventos, o el evento de lead a cero mientras PageView sigue vivo |
| 2 | ¿Qué anuncios llevan UTM y cuáles no? | `utm_content` y `utm_term` vacíos en todos |
| 3 | ¿Qué guarda el CRM en la atribución? | `utmSource` vacío en leads de pago |
| 4 | ¿Hay campos donde caiga la UTM? | no existen, o existen y están vacíos |
| 5 | ¿Cuántas acciones de conversión primarias hay en Google Ads? | más de una para el mismo formulario |

Dos cosas que el script ya tiene en cuenta, porque nos costaron un rato:

- **Solo cuenta los anuncios ACTIVOS.** En EAC había 346 anuncios en la cuenta y
  250 en pausa sin UTM, todos archivo de la agencia anterior. Listarlos como
  fallo enterraba los 4 que sí importaban.
- **La atribución no viene en `GET /contacts/`**, que devuelve otro objeto
  llamado `attributions`. Hay que pedirla con `POST /contacts/search`, que es el
  único que trae `attributionSource` y `lastAttributionSource`.

**Mira el día a día, no el agregado.** En EAC, la ventana de 28 días mostraba un
81% de impresiones de spam; el desglose diario revelaba un único pico de 2,5 M
un 22 de agosto y el resto del mes limpio. Un agregado esconde el día exacto en
que algo se rompió, que es justo el dato que necesitas.

---

## 2 · CRM: los campos donde cae la atribución

GoHighLevel ya guarda la atribución en el objeto `attributionSource` del
contacto, pero **no en campos**: no se puede filtrar, ni segmentar, ni sacar en
un informe. Hay que copiarla a campos personalizados.

```bash
node scripts/ghl-campos.mjs        # crea los 7 campos, idempotente
```

Crea: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
`landing_url`, `click_id`. Todos `TEXT`. Devuelve los IDs, que es lo que
necesitas para escribir en ellos desde la API.

### Dónde leer la atribución que ya existe

En `GET /contacts/` cada contacto trae `attributionSource` (el primer toque) y
`lastAttributionSource` (el último). Lo que contienen depende del origen:

| Origen | Qué trae | Qué NO trae |
|---|---|---|
| Formulario en la web con UTM | `utmSource`, `utmMedium`, `campaign`, `utmContent`, `utmTerm`, `url`, `fbclid`, `referrer`, `userAgent`, `ip` | — |
| Formulario nativo de Meta | `campaign` y `utmMedium` con los **nombres** de campaña y conjunto, `campaignId`, `adId` | no hay UTM reales: no hubo clic a la web |
| Tráfico directo / orgánico | `sessionSource`, `url` | todo lo demás |

Ojo con el formulario nativo: GHL mete el **nombre del conjunto de anuncios en
`utmMedium`**. Si lo copias tal cual a un campo llamado «UTM Medium» tendrás
`[Ad] Conversión CP: Intereses Educación` donde esperabas `paid`. Mejor
normalizar por etiqueta (ver workflow WF6 más abajo).

### Workflow que rellena los campos

La API de GHL **no permite crear workflows**. Hay que montarlo en el editor.
Prompt para el asistente de IA:

```
Crea un workflow llamado "WF6 · Atribución a campos UTM".
DISPARADOR: se crea un contacto nuevo. Permitir reentrada.
ACCIÓN: una sola "Actualizar campo del contacto" que rellene:
  UTM Source   ← {{contact.attributionSource.utmSource}}
  UTM Medium   ← {{contact.attributionSource.utmMedium}}
  UTM Campaign ← {{contact.attributionSource.campaign}}
  UTM Content  ← {{contact.attributionSource.utmContent}}
  UTM Term     ← {{contact.attributionSource.utmTerm}}
  Landing URL  ← {{contact.attributionSource.url}}
  Click ID     ← {{contact.attributionSource.fbclid}}
DESPUÉS, condición: si "UTM Source" está vacío
  - etiqueta "meta-lead" o "meta-leadform" → UTM Source = "meta", UTM Medium = "leadform"
  - etiqueta "tiktok-form" → "tiktok" / "leadform"
  - etiqueta "google-form" → "google" / "cpc"
  - etiqueta "organico-web" → "organico" / "seo"
  - en cualquier otro caso → "desconocido"
```

---

## 3 · UTM en Meta

Meta no tiene «plantilla de seguimiento» a nivel de cuenta: la UTM vive en
`url_tags` **de cada creativo**. Y un creativo es inmutable: para cambiarle las
UTM hay que **crear uno nuevo y asignarlo al anuncio**.

```bash
node scripts/meta-utm.mjs --dry     # lista qué cambiaría
node scripts/meta-utm.mjs           # crea creativos nuevos y los asigna
```

Plantilla que usamos:

```
utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}&utm_placement={{placement}}
```

Notas de campo:

- **Solo tiene sentido en anuncios con destino web.** Los de formulario nativo
  (`destination_type: ON_AD`) no generan clic, así que la UTM nunca viaja.
- Al clonar un `asset_feed_spec` hay que **quitar** `additional_data`,
  `reasons_to_shop` y `shops_bundle`, o la API los rechaza.
- Copia el `degrees_of_freedom_spec` del creativo original. Si mandas
  `standard_enhancements` te devuelve *«El contenido no debería incluir mejoras
  estándar»* (subcódigo 3858504): ese campo está obsoleto y hay que declarar las
  funciones una a una.
- **Los conjuntos con contenido dinámico (DCO) solo admiten un anuncio.** No
  puedes añadir uno nuevo al lado: o sustituyes el creativo del que hay, o
  duplicas el conjunto (y entonces tocas presupuesto, que es decisión del
  cliente).
- Cambiar el creativo pone el anuncio en `PENDING_REVIEW` unas horas. Es normal.

---

## 4 · UTM en Google Ads

Aquí sí hay plantilla, y se pone una sola vez por campaña (o por cuenta).

```bash
node scripts/gads-utm.mjs
```

```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign=NOMBRE_CAMPAÑA&utm_term={keyword}&utm_content={creative}&utm_id={campaignid}
```

- Se escribe en `campaign.tracking_url_template` con `campaigns:mutate` y
  `updateMask=tracking_url_template`.
- `{lpurl}` es obligatorio al principio o los anuncios se desaprueban por
  *destino no coincide*.
- Si el cliente venía de HubSpot o similar, suele haber ya una plantilla con
  parámetros `hsa_*`. Consérvalos: alimentan sus informes antiguos.

### Revisa las acciones de conversión mientras estás dentro

Es el error más caro que encontramos. Busca cuántas acciones tienen
`primary_for_goal = true` e `include_in_conversions_metric = true` para el mismo
formulario. En EAC había **tres**: la antigua de carga de página, la importada
de GA4 y la nueva de GTM. Cada lead iba a contar por tres y el CPA objetivo
pujaría con datos falsos.

Deja **una** primaria; las demás a secundarias.

---

## 5 · El caso de los imanes en iframe

Si el formulario vive en un dominio distinto (una herramienta en Vercel
incrustada en el blog del cliente), la UTM se queda en la página padre y nunca
llega al iframe.

Solución: una etiqueta HTML en GTM, disparada en DOM Ready, que copia los
parámetros de la URL del artículo al `src` del iframe, con memoria de sesión
por si el lector navega antes de rellenar. El código está en
`scripts/gtm-utm-iframe.js`.

Y en el backend del formulario, parsear esos parámetros y escribirlos en los
campos del CRM: ver `scripts/lead-handler-ejemplo.js`.

---

## 6 · Checklist de cierre

Ninguno de estos se da por bueno sin verlo en pantalla.

- [ ] El píxel registra eventos **hoy**, no «la semana pasada».
- [ ] Todos los anuncios con destino web tienen `utm_content` y `utm_term`.
- [ ] Los anuncios de formulario nativo **no** se cuentan como fallo: no aplican.
- [ ] Existen los 7 campos en el CRM y el workflow los rellena.
- [ ] Google Ads: **una sola** acción de conversión primaria por formulario.
- [ ] La plantilla de Google Ads empieza por `{lpurl}`.
- [ ] **Prueba de punta a punta**, automatizada:
      `node scripts/prueba-e2e.mjs https://formulario.example.com/api/lead`
      Manda un lead con `utm_campaign=PRUEBA_CAMP`, comprueba que los 7 campos
      llegan al CRM y borra el contacto de prueba.
- [ ] TikTok, a mano en cada anuncio:
      `?utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_content=__AID_NAME__&utm_term=__CID_NAME__`

---

## 7 · Errores reales y qué significan

| Síntoma | Causa | Arreglo |
|---|---|---|
| `(#100) subcódigo 3858504` · «no debería incluir mejoras estándar» | mandaste `standard_enhancements` en `degrees_of_freedom_spec` | copia el `degrees_of_freedom_spec` del creativo original, con cada función declarada por separado |
| `subcódigo 1885553` · «no puede haber más de un anuncio en el conjunto con contenido dinámico» | intentas añadir un anuncio a un conjunto DCO | sustituye el creativo del anuncio existente, o duplica el conjunto |
| `subcódigo 1487497` · «la imagen sigue siendo usada por creativos» | borrar una imagen con creativos vivos | borra primero los creativos; repite dos o tres rondas hasta que salgan todos |
| «No puedes eliminar este mensaje publicitario porque lo están usando grupos de anuncios» | variantes por ubicación que Meta genera sola, enganchadas a conjuntos en pausa | solo se van borrando esos conjuntos, lo que destruye su histórico: decisión del cliente |
| Google Ads 403 con permisos correctos | falta `login-customer-id`, o va la cuenta del cliente en vez del MCC | pon el MCC, sin guiones |
| Google Ads: 0 conversiones con la etiqueta instalada | la etiqueta `awct` espera el ID **numérico** (`808595127`), no `AW-808595127` | corrige la constante en GTM y publica |
| El CRM devuelve `ok:false` sin motivo | payload con un campo que GHL no acepta (a nosotros nos pasó con `meta`) | quítalo y propaga el texto del error, no un booleano pelado |
| El contacto de prueba no aparece al buscarlo por email | el índice de búsqueda tarda unos segundos | reintenta en bucle hasta 30 s con `GET /contacts/?query=` |
| Impresiones desplomadas con el mismo gasto | la puja inteligente se quedó sin señal de conversión | repara la medición y dale 2-3 semanas de reaprendizaje; quita el CPA objetivo mientras |
| `utm_medium` con el nombre del conjunto | así lo guarda GHL en los leads de formulario nativo | normaliza por etiqueta en el workflow WF6 |
| El contacto no trae `attributionSource` | lo pediste con `GET /contacts/`, que devuelve `attributions`, otro objeto | usa `POST /contacts/search` |
| El diagnóstico marca decenas de anuncios sin UTM | está contando los pausados, que son archivo del cliente | filtra por `effective_status === 'ACTIVE'` |

---

## 8 · Lo que este playbook no arregla

La atribución te dice **de dónde** viene cada lead. No te dice por qué no se
convierten.

En EAC, con la medición ya reparada, los leads subieron un 60% y el CPL bajó un
26%… y las entrevistas cayeron un 31%. El cuello de botella estaba en la
capacidad de llamada y en a quién se llamaba primero, no en la captación.

Mide el **coste por entrevista** y el **coste por matrícula**, no solo el CPL.
En EAC: Meta €758 por entrevista, Google €160, orgánico €0. Con el CPL más
barato de los tres, Meta era el canal más caro del embudo.
