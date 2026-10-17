# HackTheLead · Dashboard + Alertas de leads

Mini-app de **Google Sheets + Apps Script** independiente del dashboard de EAC.
Hace dos cosas:

1. **Dashboard por campaña y por anuncio** de las campañas `HTL_` de Meta
   (gasto, impresiones, clicks, CTR, CPC, **leads y CPL**).
2. **Aviso por email** cada vez que entra un lead nuevo en los formularios.

---

## ⚠️ Requisito clave: token PERMANENTE

Los avisos de leads y el refresco corren en **triggers automáticos**, sin nadie
delante. Un token del Graph Explorer (caduca en 1-2 h) **no sirve**. Usa un
**token de Usuario del Sistema** de Business Manager (caducidad *Nunca*) con
permisos `ads_read`, `leads_retrieval`, `pages_show_list`, `pages_read_engagement`.

---

## Instalación

1. Crea un **Google Sheet** nuevo (p.ej. "HackTheLead – Métricas").
2. Extensiones → **Apps Script**. Crea un archivo `.gs` por cada archivo de
   `src/` (Config, Meta, Dashboard, Alerts, Main) y pega su contenido. Pega
   también `appsscript.json` en el manifiesto (Configuración → mostrar manifiesto).
   *(O usa `clasp` apuntando `rootDir` a `htl-dashboard/src`.)*
3. **Configuración del proyecto → Propiedades del script** y añade:

   | Clave | Valor |
   |---|---|
   | `HTL_META_TOKEN` | Token de Usuario del Sistema (permanente) |
   | `HTL_AD_ACCOUNT_ID` | `3453332464718877` |
   | `HTL_PAGE_ID` | `359073050620335` |
   | `HTL_FORM_IDS` | `1699166241130533` (coma-separado si vigilas varios) |
   | `HTL_ALERT_EMAIL` | `info@maikelechevarria.com` |
   | `HTL_DATE_PRESET` | `maximum` (o `last_30d`, `last_7d`, `today`) |
   | `HTL_NAME_FILTER` | `HTL` (opcional; substring de las campañas a incluir) |

4. Recarga el Sheet → aparece el menú **HackTheLead**.

## Uso (menú HackTheLead)

| Opción | Qué hace |
|---|---|
| **Actualizar dashboard** | Pinta las pestañas `Campañas` y `Anuncios` desde la API. |
| **Activar alertas de leads (email)** | Instala el trigger (cada 15 min) que te avisa por email de cada lead nuevo. |
| **Enviar email de prueba (QA)** | Manda un email con el último lead real, para verificar formato/entrega. |
| **Programar refresco diario (7:00)** | Repinta el dashboard cada mañana. |
| **Comprobar leads ahora** | Fuerza una comprobación inmediata de leads nuevos. |

## Notas

- El dashboard filtra por nombre de campaña que **contenga `HTL`** (ajustable con
  `HTL_NAME_FILTER`), así ignora el resto de campañas de la cuenta.
- **Leads / CPL** salen de las `actions` de los insights (`lead`). El CPL es
  gasto ÷ leads del periodo elegido.
- La primera vez que activas las alertas, se fija la marca en "ahora": solo
  notifica leads **a partir de ese momento** (no manda históricos).
- Alternativa sin código para el email: un **workflow en GHL** con trigger
  "Facebook Lead Form submitted" → acción *Enviar email*. Más simple si solo
  quieres el aviso; este proyecto lo hace además del dashboard.
