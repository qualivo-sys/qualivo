# EAC · Dashboard de Métricas (Google Sheets + Apps Script)

Dashboard de métricas de marketing para **EAC – Escola Aeronàutica de Catalunya**
(cliente de Qualivo), construido sobre **Google Sheets** con datos **en vivo**
desde Meta Ads, Google Ads, TikTok Ads y el CRM (HubSpot / GoHighLevel).

Replica la hoja de referencia con:

- **Resumen general** (KPIs blended): inversión, impresiones, clicks, CTR, leads, CPL blended, budget y % gastado.
- **Por plataforma**: Meta · Google · TikTok · TOTAL.
- **Por campaña**: desglose con CPL/CPA por campaña.
- **Pipeline CRM**: open por etapa, lead status, fuentes, matrículas/cierres, ROAS.
- **Comparativa mensual** (varios meses lado a lado).
- **Leads**: listado individual del mes.
- **Selector de mes** (desplegable) que repinta al instante desde caché.

---

## Estructura del repo

```
src/
  appsscript.json          Manifiesto (scopes, zona horaria)
  Config.gs                Cliente, etapas del pipeline, claves de credenciales
  Utils.gs                 HTTP, fechas, números, normalización
  Schema.gs                Estructuras normalizadas + métricas derivadas
  Aggregate.gs             Orquesta conectores + caché por mes (_Cache)
  Dashboard.gs             Render del Dashboard y la Comparativa
  Leads.gs                 Render del listado de leads
  Formatting.gs            Estilos / tablas / KPIs
  Main.gs                  Menú, onOpen, onEdit, triggers
  ConfigSheet.gs           Hoja _Config para credenciales
  SeedData.gs              Datos de ejemplo (abril–junio 2026) para demo
  connectors/
    MetaAds.gs             Meta Marketing API
    GoogleAds.gs           Google Ads API (GAQL / searchStream)
    TikTokAds.gs           TikTok Marketing API
    HubSpot.gs             HubSpot CRM (contactos + deals)
    GoHighLevel.gs         GoHighLevel / LeadConnector v2 (oportunidades)
```

El **Google Sheet** ya está creado:
**EAC – Dashboard de Métricas** →
https://docs.google.com/spreadsheets/d/1l7C_rQO4UpF45iJGUuW1WqV0F_Dtbap8hVUQLfxdnMI/edit

---

## Despliegue (subir el código al Sheet)

El código se sube al Apps Script **vinculado** a ese Sheet con
[`clasp`](https://github.com/google/clasp).

### Opción A · con clasp (recomendada)

```bash
# 1. Instalar clasp y autenticarte con tu cuenta de Google
npm install -g @google/clasp
clasp login

# 2. Obtener el scriptId del proyecto vinculado al Sheet:
#    Abre el Sheet → Extensiones → Apps Script → Configuración del proyecto → ID
cp .clasp.json.example .clasp.json
#    edita .clasp.json y pega el scriptId

# 3. Subir el código
clasp push
```

> `rootDir` ya apunta a `src/`, así que `clasp push` sube los `.gs` y el
> `appsscript.json`. Activa la **API de Apps Script** en
> https://script.google.com/home/usersettings antes del primer push.

### Opción B · copiar/pegar

Abre el Sheet → **Extensiones → Apps Script** y crea un archivo por cada `.gs`
de `src/` (incluido `connectors/`), pegando su contenido. Pega también el
contenido de `appsscript.json` en el manifiesto (Configuración → mostrar
manifiesto).

---

## Configuración de credenciales

Tras subir el código, recarga el Sheet. Aparecerá el menú **EAC Dashboard**.

1. **EAC Dashboard → Configurar credenciales (hoja _Config)**: rellena los
   tokens en la hoja `_Config`.
2. **EAC Dashboard → Guardar credenciales de _Config**: las vuelca a las
   *Script Properties* (almacenamiento seguro del proyecto).
3. Borra los valores de `_Config` si no quieres dejarlos visibles, o usa
   directamente *Configuración del proyecto → Propiedades del script*.

### Credenciales por plataforma

| Plataforma | Claves | Permisos / notas |
|---|---|---|
| **Meta** | `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_API_VERSION` | Token con `ads_read`. Account ID sin el prefijo `act_`. |
| **Google Ads** | `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | OAuth con scope `adwords`. Customer ID sin guiones. `LOGIN_CUSTOMER_ID` sólo si usas MCC. |
| **TikTok** | `TIKTOK_ACCESS_TOKEN`, `TIKTOK_ADVERTISER_ID` | App de TikTok Marketing API aprobada. |
| **HubSpot** | `HUBSPOT_TOKEN`, `HUBSPOT_STATUS_PROP` | Private App token. `STATUS_PROP` = propiedad de estado del lead (por defecto `hs_lead_status`). |
| **GoHighLevel** | `GHL_TOKEN`, `GHL_LOCATION_ID` | Token v2 con `opportunities.readonly`. |

> El CRM usa **GHL** si hay credenciales; si no, **HubSpot**. EAC migró de
> HubSpot a GHL en mayo de 2026, por eso ambos conectores están disponibles.

---

## Uso

| Menú | Acción |
|---|---|
| **Refrescar mes seleccionado** | Llama a las APIs del mes elegido en el desplegable y repinta. |
| **Refrescar últimos 3 meses** | Trae los 3 meses más recientes. |
| **Reconstruir vistas** | Repinta desde caché sin llamar a las APIs. |
| **Inicializar / crear pestañas** | Crea las pestañas base. |
| **Cargar datos de ejemplo (demo)** | Carga abril–junio 2026 de la hoja de referencia (sin credenciales). |
| **Programar refresco diario** | Trigger diario a las 7:00 que refresca el mes en curso. |

**Cambiar de mes**: usa el desplegable en `Dashboard!B2`. El cambio repinta el
Dashboard y los Leads al instante desde la caché (no llama a las APIs).

### Para verlo funcionando ya mismo

1. Sube el código (Opción A o B).
2. Recarga el Sheet → menú **EAC Dashboard → Inicializar / crear pestañas**.
3. **EAC Dashboard → Cargar datos de ejemplo (demo)**.

Verás el dashboard completo con los datos de abril, mayo y junio. Luego
configura credenciales y usa **Refrescar** para datos en vivo.

---

## Cómo se calculan las métricas

Todas las métricas derivadas se calculan en un único punto (`deriveMetrics`)
para que todas las plataformas sean consistentes:

- **CTR** = clicks / impresiones
- **CPC** = inversión / clicks
- **CPM** = inversión / impresiones × 1000
- **CPL / CPA** = inversión / leads
- **CVR** = leads / clicks
- **CPL blended** = inversión total / leads totales
- **% Budget gastado** = inversión total / budget contratado (`CLIENT.monthlyBudget`, 4.000 €)
- **ROAS** = revenue (won €) / inversión total

El budget mensual y la zona horaria se ajustan en `src/Config.gs`.
