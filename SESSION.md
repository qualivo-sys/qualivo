# Arranque de sesión · qué se guarda dónde

El contenedor de cada sesión es de usar y tirar. **Lo único que sobrevive es lo
que está en git.** El scratchpad, las claves y las herramientas instaladas se
borran al reiniciar.

## Lo que está a salvo (en git, rama `claude/qualivo-landing-vercel-nubk1i`)

- La web entera, la landing del diagnóstico y las funciones de `/api`.
- `content/propuesta-de-valor-v1.md`, `content/gtm-septiembre-2026.md` y las
  estrategias de blog, redes y LinkedIn.
- Todas las piezas gráficas con su HTML, sus PNG, sus fuentes y su `render.js`:
  `content/infografias/`, `content/carruseles/`, `content/anuncios/`.
- Los prompts de imagen listos (`content/anuncios/2026-09-11-wow/PROMPTS.md`).
- Las skills en `.claude/skills/`.

## Lo que NO puede ir a git y hay que volver a pasar cada sesión

El repositorio es **público**. Ninguna clave va dentro, nunca. Al empezar una
sesión, Maikel pega las que hagan falta y se guardan en el scratchpad con
permisos cerrados (`chmod 600`). Se borran solas al acabar.

| Clave | Para qué | Dónde va |
|---|---|---|
| Kie (`KIE_API_KEY`) | Generar las fotos de los anuncios | scratchpad |
| Meta Ads (`META_ADS_TOKEN`, cuenta `act_3453332464718877`) | Subir y leer campañas | scratchpad |
| GHL (`GHL_API_KEY`, `GHL_LOCATION_ID`) | Programar publicaciones, leer el CRM | scratchpad |
| Google, JSON de cuenta de servicio `apiclaude@kinetic-dream-377917` | Sheet de SEO, GA4, Search Console | scratchpad |
| Apify | Rastrear competidores | scratchpad |

Las que usa la web en producción (`GHL_API_KEY`, `RESEND_API_KEY`,
`META_CAPI_TOKEN`, `META_ADS_TOKEN`, `GOOGLE_SA_JSON`, `INFORME_SHEET_ID`…) viven
en **variables de entorno de Vercel** y no dependen de la sesión.

## Poner en marcha las herramientas de render

```
cd <scratchpad> && npm install playwright
# Chromium ya está en /opt/pw-browsers/chromium-1194/chrome-linux/chrome
node content/infografias/2026-09-10/render.js
```

Cada carpeta gráfica trae su propio `render.js` con la ruta ya puesta.

## Reglas que no cambian entre sesiones

- Pausa de redes hasta que Maikel la levante por escrito.
- Cero cifras inventadas.
- Nada se publica sin que Maikel lo haya visto.
- Los `.md` internos no se despliegan: `content/`, `drafts/`, `outreach/` y este
  fichero están en `.vercelignore`.
