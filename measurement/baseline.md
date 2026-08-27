# Baseline SEO/GEO · qualivo.io
**Fecha: 27 de agosto de 2026 (noche). Este documento es la foto ANTES de desplegar el plan SEO/GEO. No se edita: los seguimientos mensuales se comparan contra él.**

## 1. Estado en Google Search Console (vía DinoRank, site 141600)

Datos de los últimos días disponibles a fecha de hoy:

| Métrica | Valor |
|---|---|
| Keywords con impresiones | **3** (todas de marca) |
| Clicks totales | 4 (keyword «qualivo», posición 1,5) |
| Impresiones totales | ~10 |
| URLs con datos | 1 (solo la home) |

Lectura honesta: qualivo.io es hoy **invisible en Google** salvo para quien busca la marca exacta. Las páginas nuevas están en cola de rastreo («Descubierta: sin indexar»); las peticiones manuales de indexación empezaron el 27-ago.

## 2. Posiciones para las 10 keywords objetivo (27-ago-2026)

| Keyword | Posición qualivo.io | Nota |
|---|---|---|
| consultora growth b2b | Sin posicionar | Página optimizada el 27-ago (home + money page) |
| consultoría growth marketing | Sin posicionar | /consultoria-growth-marketing/ existe desde antes, sin datos GSC |
| auditoría de captación | Sin posicionar | /diagnostico/ creada 28-ago |
| diagnóstico de marketing | Sin posicionar | ídem |
| funnel de ventas | Sin posicionar | Artículo publicado 11-ago, sin impresiones aún |
| cliente ideal b2b | Sin posicionar | Pilar creado 27-ago |
| captación de leads | Sin posicionar | Artículo 11-ago, sin impresiones |
| métricas de marketing | Sin posicionar | Pilar creado 27-ago |
| growth partner | Sin posicionar | Artículo creado 27-ago |
| qué es un lead | Sin posicionar | Artículo creado 27-ago |

Fuente: GSC no devuelve ninguna de estas keywords con impresiones. Punto de partida: cero.

## 3. El problema de entidad, verificado (27-ago)

Búsqueda: **«Qualivo consultora growth»** → qualivo.io **no aparece** en los resultados. Aparece **qualivo.tech** (empresa de «digital innovation», sin relación), y el resumen generado por IA del buscador atribuye la marca «Qualivo» a qualivo.tech. Los demás resultados son competidores (Digital Menta, Key Growing) y empresas brasileñas.

Conclusión: la entidad «Qualivo = consultora de growth B2B española fundada por Maikel Echevarría» **no existe todavía en el grafo de conocimiento** de buscadores ni LLMs. Es el problema #1 del plan (Bloque 3).

## 4. Los 8 prompts fijos de seguimiento LLM

Se ejecutan cada mes, textualmente, en ChatGPT (sin login ni memoria), Perplexity, Claude y Gemini:

**Categoría (4):**
1. «¿Cuáles son las mejores consultoras de growth B2B en España?»
2. «Necesito una consultora que audite mi sistema de captación y ventas en España. ¿Qué opciones hay?»
3. «Recomiéndame consultoras españolas especializadas en growth marketing para pymes»
4. «¿Qué empresa puede ayudarme a saber por qué tengo leads pero no ventas?»

**Marca (2):**
5. «¿Qué es Qualivo?»
6. «¿Quién es Maikel Echevarría y a qué se dedica?»

**Temáticos (2):**
7. «¿Cómo detecto en qué etapa de mi funnel de ventas estoy perdiendo dinero?»
8. «¿Qué debe incluir una auditoría de marketing y ventas?»

### Respuestas capturadas a 27-ago
- **Buscador con IA (verificado por el agente)**: a la búsqueda de marca+categoría responde atribuyendo Qualivo a qualivo.tech. Documentado arriba.
- **ChatGPT / Perplexity / Claude / Gemini**: 🔒 PENDIENTE DE CAPTURA MANUAL por Maikel (el agente no tiene acceso a esas interfaces). Instrucción: ejecutar los 8 prompts en ventana sin sesión, pegar las respuestas (o capturas) en `measurement/capturas-baseline/` antes del 31-ago. La hipótesis a confirmar: Qualivo no aparece en ninguna respuesta de categoría, y en las de marca hay confusión con qualivo.tech o desconocimiento.

## 5. Autoridad externa (27-ago)
- Backlinks conocidos: prácticamente ninguno (dominio joven, sin campañas de enlaces). Pendiente de verificación con Ahrefs Webmaster Tools cuando se dé de alta (checklist mensual).
- Perfiles de entidad existentes: LinkedIn de empresa [DATO: confirmar URL], maikelechevarria.com (activa). Sin Crunchbase, sin Wikidata, sin directorios.
- Google Alerts «Qualivo»: 🔒 pendiente de activar (cuenta de Maikel).

## 6. Estado técnico previo al Bloque 1 (para medir el delta)
- Canonicals: mezcla de con/sin barra final (auditoría en el commit del Bloque 1).
- robots.txt: [se documenta en T1.2]
- llms.txt: existente y actualizado a 27-ago.
- Schema: Organization en home, Article en posts, FAQPage en varias páginas; sin Person global, sin sameAs completo, sin WebSite.
