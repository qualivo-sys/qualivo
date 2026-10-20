# Outbound → Intelligence · datos para la pestaña «Outbound» (20-oct)

Encargo de Growth por orden de Maikel. Solo lectura: nada de esto cambia campañas. Sin datos personales.

## a) Campañas de Qualivo y de cliente

**De cliente: excluir siempre.**
- 4071068 · Kubysoft · clima ES · tanda A
- 3974838 · DKR · Creadores EN
- 3974839 · DKR · Creadores ES
- 4025816 · DKR · Criadores BR
- 4018188 · DKR · Criadores PT
- 4001007 · DKR · Creadores UK

Regla práctica: el nombre contiene `DKR`, `Kubysoft`, `Antic` o `Scubalight`. Los buzones de cliente son de otros dominios, así que el dominio del buzón también sirve para separar.

**De Qualivo, activas a 20-oct:**

| Id | Campaña |
|---|---|
| 4156230 | Formación · Playbook Q4 |
| 4156231 | Reformas · Playbook Q4 |
| 4156233 | Clínicas · Playbook Q4 |
| 4042995 | Servicios B2B · Intelligence |
| 4042994 | Formación · Intelligence |
| 4042992 | Clínica · Intelligence |
| 3976201 | Asesorías · presupuesto parado |
| 3976199 | Clínicas · precio por WhatsApp |
| 3974666 | Obra · presupuestos (Maps) |
| 3967646 | Lista · Brevo (señal) |
| 3964316 | Anuncios · Meta (señal) |
| 3964077 | Anuncios · LinkedIn Ads (señal) |
| 3963336 | Anuncios · Google Ads (señal) |
| 3963237 | CRM · Odoo (señal) |
| 3963217 | CRM · Salesforce (señal) |
| 3918857 | ICP15 · Base desaprovechada |
| 3785391 | Infoproducto ES · creadores (Mailerfind) |
| 3715161 | Construcción ES · Q3 |

Además hay 54 campañas de Qualivo terminadas o pausadas.

**Infoproducto es ambigua.** El guardia de depósito la cuenta como de Qualivo, pero la auditoría del 19-oct la apartó como de cliente. Pregúntaselo a Maikel antes de sumarla.

## b) Señal, puerta y puntuación por lead

**Campañas de señal y motor V3** (Google Ads, Meta, LinkedIn Ads, Salesforce, Odoo, Brevo y V3 3940264):
- **Puerta:** custom field `puerta`, con valores `google_ads`, `meta_ads`, `linkedin_ads`, `crm`, `lista`, `base`, `multiservicio`, `mide`, `direccion` y `comercial`.
- **Copy:** cada lead lleva el suyo en `subject1`, `body1`, `body2` y `body3`.
- **Origen:** desde el 20-oct, el custom field `origen` vale `senal-20oct`.

**Playbook Q4** (las tres campañas): custom fields `sector`, `origen` (`playbook-q4-15oct`, `playbook-q4-19oct` y `playbook-q4-20oct`) y, desde el 20-oct, `senal`. `senal` guarda lo que se encontró en la web: `hubspot`, `salesforce`, `zoho`, `pipedrive`, `activecampaign`, `meta` (píxel) o `ads` (etiqueta de Google Ads).

**Campañas Intelligence 29-sep:** la señal va escrita en la primera línea del correo, no en un campo.

**La puntuación 0-50 del Brain no se guarda por lead en ningún sitio.** No hay campo ni fichero persistente con ella. Si la pestaña la necesita, habría que empezar a escribirla en un custom field (`score`) al cargar. Esto lo decide Maikel.

**Ficheros de trabajo:** el scratchpad de la sesión de Outbound se borra al reiniciar el contenedor. Lo persistente está en el repo:
- `captacion/datos/` (cargas y embudo diario: `funnel-diario.csv`, `campanas-diario.csv`);
- `sdr/` (informes y secuencias).

## c) Borradores de respuesta

- **Respuestas a leads:** se redactan en el chat de la sesión de Outbound y se mandan solo con el ok de Maikel. No hay un fichero vivo con ellos.
- **Copy de secuencias:** los borradores pendientes de aprobación están en `sdr/secuencias-*.md` (Inmobiliaria y B2B: `sdr/secuencias-inmo-b2b-borrador.md`).
- **Informes del SDR:** `sdr/informe-<fecha>.md`.
- **GHL:** cuando haya clave, cada respuesta real se registra con su texto literal como nota en la oportunidad del pipeline Prospección (JaB4LIwUqFn96LLFEhSm). Hoy no hay clave de GHL en la sesión.

**Propuesta para enlazar desde «Respuestas pendientes»:** que Outbound escriba cada borrador en `sdr/borradores/<fecha>-<campaña>-<lead_id>.md`. Si te sirve, dímelo y empiezo.

## d) Trampas de la API de Smartlead

1. **User-Agent obligatorio.** Sin una cabecera de navegador, Cloudflare devuelve 403.
2. **`/analytics` → `campaign_lead_stats.notStarted` siempre vale 0** (comprobado el 13-oct). El depósito se cuenta recorriendo `/campaigns/{id}/leads` paginado, con `status == "STARTED"`.
3. **Falsos ceros.** Un 401 o un error tragado se convierte en «0 respuestas» o «0 envíos». Hay que distinguir «sin datos (error)» de un cero real.
4. **Envíos y respuestas, de `/campaigns/{id}/statistics`** paginado con `offset` y `limit=1000`. Cada fila trae `sent_time`, `reply_time`, `sequence_number`, `open_count`, `click_count`, `is_bounced` y `lead_email`. `/analytics` agrega mal.
5. **El copy de `/campaigns/{id}/sequences` está en `sequence_variants[].subject/email_body`.** Los campos `subject` y `email_body` de nivel superior vienen vacíos.
6. **Duplicados al cargar.** Si el lead ya está en otra campaña, `POST /campaigns/{id}/leads` devuelve `upload_count` alto con `total_leads: 0`, y parece un éxito sin serlo. Mira `total_leads` y `already_added_to_campaign`.
7. **`POST /campaigns/{id}/sequences` sobre una campaña con leads dentro reinicia envíos.** Nunca. Para la pestaña da igual, porque es solo lectura.
8. **`reply-email-thread` siempre manda al lead de la campaña,** aunque haya contestado otra persona: hay que poner a quien contestó en `cc`.
9. **Depósito engañoso.** Infoproducto tiene 1.281 leads con tope de 15 al día. Si se suma tal cual, el depósito parece de 2,4 días cuando sin ella da para menos de uno. Conviene enseñarlo separado.
10. **Buzones.** En `/email-accounts`, `message_per_day` es el tope diario y `warmup_details.warmup_reputation` la reputación. goqualivo y gotqualivo (5 buzones) están en lista negra SURBL con tope 1 al día: no cuentan como capacidad.

## e) Cifras para cuadrar (informe diario del 19-oct)

| Campaña | Enviados hoy | Enviados 7 días | Depósito (STARTED) |
|---|---:|---:|---:|
| Servicios B2B · Intelligence | 68 | 176 | 0 |
| Anuncios · LinkedIn Ads | 38 | 122 | 0 |
| Construcción ES · Q3 | 70 | 88 | 72 |
| Infoproducto ES | 15 | 29 | 1.281 |

Totales del 19-oct:
- todas las campañas: 316 enviados hoy y 1.032 en 7 días;
- solo Qualivo: 300 enviados hoy;
- depósito del guardia: 1.313 leads el 20-oct a las 08:00 UTC.

Ventana de 30 días (19-sep a 19-oct, solo Qualivo, sin Infoproducto ni cliente): 2.584 envíos, 64 respuestas y 43 rebotes.

## Cuando la pestaña esté

Comparo lo que enseña con el correo diario de las 17:30 y con el informe de los lunes, y propongo cuál sobra.
