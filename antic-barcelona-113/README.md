# Antic Barcelona 113 — Campaña de captación

Prototipo completo de campaña para **Antic Barcelona 113** (mobiliario a medida en
madera recuperada y piedra natural, taller en Terrassa): estrategia, funnel navegable
y creatividades para Meta Ads.

## Qué hay aquí

```
estrategia/         7 documentos: diagnóstico, plan de medios, copys, medición,
                    funnel, calendario y producción con IA
landing/            Sitio estático desplegable en Vercel
  index.html          Landing principal
  guia.html           Lead magnet (descarga de la guía)
  gracias.html        Confirmación + salto al cuestionario
  cuestionario.html   Cuestionario de 6 pasos con scoring HOT/WARM/COLD
  creatividades.html  Tablero de creatividades para el cliente
  privacidad.html     Política de privacidad (base de trabajo, pendiente legal)
  ads/                Plantilla de render de creatividades + especificación
  assets/             Fotos, fuentes autoalojadas, CSS y JS
creatividades/
  meta/               PNG a resolución final: 11 creatividades × 3 formatos
  ia/                 Piezas recontextualizadas con IA a 2K (originales)
scripts/            Render de creatividades y capturas de verificación
```

## Desarrollo local

```bash
cd landing && python3 -m http.server 8123
# http://localhost:8123
```

## Regenerar las creatividades

Las creatividades se definen en `landing/ads/creativos.js` y se renderizan a PNG con
Playwright. Editar el texto o la foto ahí y volver a lanzar:

```bash
npm install
cd landing && python3 -m http.server 8123 &
node scripts/render-ads.mjs      # → creatividades/meta/{4x5,1x1,9x16}
node scripts/shots.mjs           # capturas de verificación en /tmp/shots
```

## Notas

- **Fuentes autoalojadas.** No se carga Google Fonts: mejora el tiempo de carga y evita
  el problema de RGPD conocido con su CDN.
- **Píxel de Meta.** `landing/assets/js/main.js` expone `window.ab113.track()` con los
  eventos ya cableados (`Lead`, `CompleteRegistration`, `Contact`, `ViewContent`,
  `InitiateCheckout`). Falta insertar el ID de píxel y el gestor de consentimiento
  antes de publicar en producción.
- **Imágenes con IA.** Las tres piezas de `creatividades/ia/` recontextualizan fotos
  reales del taller conservando la pieza. Van etiquetadas en la propia creatividad y en
  el tablero. No se usan en la sección de proyectos reales.
