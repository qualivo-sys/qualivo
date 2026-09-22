# Playbook · Atribución de leads (UTM) — de cada venta al anuncio

Replicable para cualquier cliente con GoHighLevel (GHL) + Meta Ads + Google Ads (probado en Eleva Academy, sept-2026).
Objetivo: que **cada lead entre en el CRM con canal → campaña → anuncio (→ palabra clave)** y que el dashboard muestre
leads, entrevistas y ventas por anuncio. Sin secretos en este repo: todo va por variables de entorno.

## 0. Diagnóstico en 10 minutos (hazlo antes de tocar nada)
1. **¿Los leads traen atribución?** `GET /contacts/{id}` (API v2) → mira `attributionSource` / `lastAttributionSource`
   (`utmSource, campaign, utmContent, utmTerm, gclid, adName, adId`). Si todo es `null` o `sessionSource: "Direct traffic"`, no hay atribución.
2. **¿Cómo está embebido el formulario de GHL en la landing?** `curl -sL https://landing | grep -o 'widget/form/[A-Za-z0-9]*\|form_embed'`.
   - Solo `<iframe src=".../widget/form/ID">` **sin** `form_embed.js` → **causa nº 1**: la página nunca pasa la URL (ni las UTM) al formulario.
3. **¿Los anuncios llevan UTM?** Meta: `GET /{ad}?fields=creative{url_tags}`. Google: `campaign.final_url_suffix` (GAQL).
4. **Formularios instantáneos de Meta** conectados por la integración nativa de GHL ya traen `campaign / adset / ad` en
   `lastAttributionSource` y en `formSubmission.eventData.url_params` → no necesitan UTM.

## 1. La pieza clave: el script de GHL en la landing (5 min, sin tocar código si hay GTM)
Junto al iframe del formulario (o vía Google Tag Manager → etiqueta *HTML personalizado* → activador *All Pages* → **Publicar**):
```html
<script src="https://link.msgsndr.com/js/form_embed.js"></script>
```
Verificación real en navegador headless (Playwright): tras publicar, el DOM de la landing debe contener `link.msgsndr.com/js/form_embed.js`.
Prueba end-to-end: abrir `https://landing/?utm_source=meta&utm_campaign=PRUEBA&utm_content=PRUEBA-AD`, enviar el formulario
con un **email nuevo** (GHL deduplica por email y teléfono: si ya existe, fusiona y no crea atribución) y comprobar
`attributionSource.campaign == "PRUEBA"`. Borrar después el contacto de prueba.

## 2. UTM en los anuncios
**Meta (todos los anuncios, nuevos y antiguos):**
```
utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```
- Anuncio nuevo: `url_tags` en el creativo al crearlo.
- Anuncio existente: Meta **no** deja editar `url_tags` (error 1815573). Vía panel: *editar anuncio → Seguimiento → Parámetros de URL* (edición de solo tracking, no reinicia aprendizaje). Vía API: clonar el creativo idéntico + `url_tags` y `POST /{ad} creative={creative_id}` (funcionó sin reinicio en Eleva; guarda el creativo original para rollback).
- Anuncios dinámicos (`asset_feed_spec`): máx. 10 imágenes; un conjunto dinámico admite 1 solo anuncio. Para atribución por creatividad, usa anuncios de una imagen.

**Google Ads (sufijo de URL final, por campaña):**
```
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```
Vía API: `campaigns:mutate` con `finalUrlSuffix` + `updateMask: finalUrlSuffix`.

## 3. Acceso a la API de Google Ads con cuenta de servicio (sin OAuth de usuario)
1. Google Cloud: habilitar *Google Ads API*; cuenta de servicio con clave JSON (misma que Search Console/GA4 si ya existe).
2. Centro de API de Google Ads: developer token (pide *Basic access* para cuentas reales).
3. Google Ads → *Administrador → Acceso y seguridad → Usuarios → +* → email de la cuenta de servicio (mejor en el **MCC**; nivel *Solo lectura* o *Estándar*). Las cuentas de servicio quedan activas sin aceptar invitación (puede tardar unos minutos).
4. Llamadas: token JWT con scope `https://www.googleapis.com/auth/adwords`, cabeceras `developer-token` y `login-customer-id` (ID del MCC),
   endpoint `https://googleads.googleapis.com/v22/customers/{CUSTOMER_ID}/googleAds:search` (usa la versión vigente; las antiguas devuelven 404 HTML).
   `listAccessibleCustomers` responde `NOT_ADS_USER` hasta que el alta de usuario propaga.

## 4. Dónde leerlo después (para dashboard/informes)
- **Por contacto:** `attributionSource` (primer toque) y `lastAttributionSource` (último).
- **Por envío de formulario:** `GET /forms/submissions?locationId&startAt&endAt` → `others.eventData.url_params` (utm_*), `campaign`, `keyword`.
- **Por oportunidad:** `opportunities/search` incluye `contact.tags` y `attributions`.
- Copiar la atribución a campos personalizados (para verla en la tarjeta del trato): workflow GHL *Contacto creado → Update Contact Field*
  con `{{contact.attributionSource.utmContent}}`, `{{contact.attributionSource.campaign}}`, `{{contact.attributionSource.utmSource}}`.

## 5. Checklist de entrega
- [ ] `form_embed.js` en la landing (verificado en navegador)
- [ ] UTM en todos los anuncios de Meta (nuevos + antiguos) y sufijo en Google
- [ ] Prueba end-to-end con email nuevo → `attributionSource` con campaña/anuncio → contacto borrado
- [ ] Primeros leads reales con campaña/anuncio (Meta landing, formularios instantáneos, Google con palabra clave)
- [ ] Dashboard: leads/entrevistas/ventas por canal → campaña → anuncio

## Errores que nos encontramos (y su causa)
| Síntoma | Causa | Arreglo |
|---|---|---|
| `attributions: 0` en todos los leads | iframe sin `form_embed.js` | script (GTM) |
| El test devuelve `crm:true` pero no aparece el contacto | GHL dedupe por teléfono/email → fusionó con uno antiguo | email y teléfono nuevos |
| Campos ocultos del formulario vacíos aunque llegan las UTM | GHL prefill usa la *clave interna* del campo (p. ej. `anuncio_utm_content`), no `utm_content` | usar la atribución nativa o un workflow que copie los valores |
| Meta: "no se pudo actualizar el creativo" | `url_tags` es inmutable | clonar creativo + cambiar en el anuncio |
| Google Ads API 404 HTML | versión de API retirada | usar la vigente (v22 en 2026-09) |
| Google Ads `NOT_ADS_USER` | la cuenta de servicio aún no es usuario de la cuenta | añadirla como usuario (MCC) y esperar propagación |
