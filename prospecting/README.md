# Radar de Prospección · Qualivo

Sistema que **detecta empresas que están contratando** para roles de captación
de leads, CRM, automatización de procesos, SDR/ventas o growth — y las prepara
para contactarlas ofreciéndoles los servicios de Qualivo.

**La idea:** una oferta de empleo de *"Especialista en generación de leads"*,
*"CRM Manager"*, *"Automatización de procesos"* o *"SDR"* es una **señal de
compra** — esa empresa tiene ese dolor **ahora**. En vez de (o además de)
contratar, puede resolverlo con Qualivo como servicio. El radar encuentra esas
ofertas, saca al decisor con su email/LinkedIn y deja preparado el mensaje.

Es un proyecto de **Google Apps Script** independiente (vive en su propia hoja),
con el mismo patrón de conectores que el dashboard EAC del repo.

---

## Cómo funciona (pipeline)

```
FUENTES ─┬─ Apollo (empresas del target + ofertas de empleo abiertas)
         └─ Web    (SerpApi/Google Jobs · o Google Custom Search sobre portales:
                    InfoJobs, LinkedIn Jobs, Tecnoempleo, Indeed, Glassdoor…)
   │
   ▼
CUALIFICAR   ¿el título de la oferta es una señal? (ROLE_KEYWORDS) + frescura
   ▼
ENRIQUECER   decisor (CEO/CMO/Head of Growth…) + email (Apollo, opcional revelar)
   ▼
PUNTUAR      score 0-100 (categoría de la señal · nº de ofertas · tamaño · email)
   ▼
ESCRIBIR     fila en la hoja "Prospectos" con el mensaje ya redactado
   ▼
CONTACTAR    (manual, bajo revisión) borrador Gmail · Smartlead · HeyReach
```

El **trigger diario** solo ejecuta hasta *ESCRIBIR*. El contacto nunca es
automático: se lanza a mano desde el menú sobre filas ya revisadas (protege
reputación de dominio y cumplimiento RGPD / LSSI).

---

## Estructura

```
prospecting/
  appsscript.json     Manifiesto (scopes: sheets, external_request, scriptapp, gmail.compose)
  Config.gs           Marca, target (geo/tamaño/keywords), claves de credenciales
  Utils.gs            HTTP, normalización de texto, fechas, dominios
  Scoring.gs          Detección de señal (roleSignal) + puntuación (scoreProspect)
  Message.gs          Redacción del mensaje personalizado (email + LinkedIn)
  Apollo.gs           Apollo REST: empresas, ofertas, decisor + email
  WebSources.gs       SerpApi (Google Jobs) / Google Custom Search sobre portales
  Radar.gs            Orquestador: junta fuentes → cualifica → enriquece → escribe
  Sheet.gs            Pestaña "Prospectos" + "_Log" (estructura y escritura)
  Outreach.gs         Borradores Gmail / envío a Smartlead / HeyReach (manual)
  Smartlead.gs        Conector Smartlead (add lead a campaña en pausa)
  HeyReach.gs         Conector HeyReach (add lead a lista)
  ConfigSheet.gs      Hoja _Config para credenciales → Script Properties
  Main.gs             Menú, setup y triggers
```

---

## Despliegue

Se sube al Apps Script **vinculado a la hoja de prospección** con
[`clasp`](https://github.com/google/clasp).

```bash
npm install -g @google/clasp
clasp login

# Copia la config de ESTE proyecto (rootDir = prospecting/) y pega el scriptId
cp .clasp-prospecting.json.example .clasp-prospecting.json
#   -> abre la hoja → Extensiones → Apps Script → Configuración → ID del script

# Sube el código apuntando a esta config
clasp push -P .clasp-prospecting.json      # o: mv .clasp-prospecting.json .clasp.json && clasp push
```

> Alternativa sin clasp: en la hoja → **Extensiones → Apps Script** y pega cada
> `.gs` de `prospecting/` como un archivo, más el `appsscript.json` en el
> manifiesto.

---

## Puesta en marcha

1. Recarga la hoja → menú **Radar Qualivo → Inicializar / crear pestañas**.
2. **Radar Qualivo → Configurar credenciales (_Config)** y rellena las claves
   (mínimo `APOLLO_API_KEY`). Luego **Guardar credenciales de _Config**.
3. **Radar Qualivo → ▶ Ejecutar radar ahora**. Revisa la pestaña `Prospectos`.
4. Cuando te convenza, **⏱ Programar radar diario** para que corra solo.

### Credenciales (`_Config` → Script Properties)

| Clave | Para qué | Notas |
|---|---|---|
| `APOLLO_API_KEY` | Fuente principal + enriquecimiento | Apollo → Settings → API. **Imprescindible.** |
| `SERPAPI_KEY` | Fuente web (Google Jobs) | Opcional. Datos de empresa/fecha estructurados. |
| `GOOGLE_CSE_KEY` + `GOOGLE_CSE_ID` | Fuente web (portales) | Opcional. Programmable Search restringido a portales. |
| `SMARTLEAD_API_KEY` + `SMARTLEAD_CAMPAIGN_ID` | Email en frío | Campaña destino **en pausa** para revisar. |
| `HEYREACH_API_KEY` + `HEYREACH_LIST_ID` | LinkedIn | Lista destino en HeyReach. |
| `QUALIVO_SENDER_NAME` / `QUALIVO_SENDER_EMAIL` | Firma / remitente de los borradores | |
| `QUALIVO_CALENDAR_LINK` | CTA del mensaje | Calendly / Google Calendar. |
| `RADAR_LOCATIONS` / `RADAR_MAX_COMPANIES` / `RADAR_MAX_JOB_AGE_DAYS` / `RADAR_REVEAL_EMAILS` / `RADAR_QUALIFY_THRESHOLD` | Ajustes del radar | Opcionales; pisan los valores por defecto de `Config.gs`. |

> **Créditos de Apollo:** `RADAR_REVEAL_EMAILS=false` valida el flujo sin gastar
> créditos (no revela emails). `RADAR_MAX_COMPANIES` limita empresas por
> ejecución.

---

## Envío automático de email (Smartlead)

El envío se hace **por Smartlead**, no por Gmail: así el disparo va con warmup,
límites diarios, rotación de buzones y gestión de rebotes/bajas, sin quemar tu
dominio. El motor solo **añade el lead ya personalizado** a la campaña; Smartlead
envía según su secuencia y horario.

**Flujo automático (end-to-end):**
```
Radar detecta → cualifica → revela email (Apollo) → añade a campaña Smartlead
                                                     → Smartlead envía la secuencia
```

**Puesta en marcha:**
1. En **Smartlead**: crea una campaña, conecta el buzón de envío y **actívale el
   warmup**. Define límite diario prudente (p.ej. 20-30/día al principio).
2. En la secuencia, usa como **asunto** `{{asunto}}` y como **cuerpo**
   `{{mensaje}}` — el motor rellena esas variables con el mensaje personalizado
   de cada empresa (no hace falta escribir la plantilla a mano).
3. Añade un **paso de baja / unsubscribe** y tu identificación (requisito legal).
4. En `_Config`: pon `SMARTLEAD_API_KEY`, `SMARTLEAD_CAMPAIGN_ID` y
   `RADAR_AUTO_SMARTLEAD` = `true`. Guarda credenciales.
5. A partir de ahí, el **radar diario** detecta y **empuja solo** a Smartlead.

> Deja la campaña **en pausa** hasta revisar los primeros leads; cuando te
> convenza, dale a *start* en Smartlead y ya envía en automático.

> **Aviso legal (RGPD / LSSI-CE, España):** el email B2B en frío se ampara en
> interés legítimo, pero **debes** identificarte con claridad, ofrecer baja fácil
> en cada envío y atender las bajas. El sistema deja preparado el mensaje; el
> cumplimiento (opt-out, identificación, registro de bajas) lo configuras en la
> campaña de Smartlead. Empieza con volumen bajo para proteger la reputación.

---

## Ajustar el target

En `Config.gs`: geografía (`TARGET.locations`), tamaño de empresa
(`TARGET.employeeRanges`), cargos del decisor (`DECISION_MAKER_TITLES`) y las
palabras clave que disparan una señal (`ROLE_KEYWORDS`). El tono del mensaje por
tipo de señal está en `COPY` (`Message.gs`).

## Seguridad

- Las credenciales **no van en el código**: se guardan en Script Properties.
- Nunca subas claves ni cuentas de servicio a git (ver `.gitignore` del repo).
