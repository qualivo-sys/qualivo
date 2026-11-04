# Google Ads · paquete del 4-nov-2026 (en pausa, para cargar con Google Ads Editor)

Encargo de Maikel (4-nov): «Prepara las campañas y déjalas en pausa. Pensemos qué podemos hacer en Google: no podemos seguir sin leads y sin reuniones».

**Nada se activa sin el OK de Maikel en el chat de Paid.** Paid no tiene acceso a ninguna cuenta de Google Ads de Qualivo. En «Credenciales qualivo» no hay ninguna fila de Google Ads (consultado el 4-nov), así que el paquete se entrega listo para importar.

Sustituye al paquete del 26-oct (`../campanas.csv`), que tenía dos problemas:
- Apostaba por búsquedas de formación y reformas con menos de 100 búsquedas al mes cada una.
- Usaba casos de clientes en los anuncios, prohibidos por la decisión de Maikel del 29-oct.

## 1. Qué hay en Google para nosotros (datos, no opinión)

Búsquedas mensuales en España según DinoRANK (14-oct, 26-oct y 4-nov), en `scratchpad/dr_leads_crm_4nov.json`.

| Grupo | Búsquedas/mes | CPC | Lectura |
|---|---|---|---|
| Formación, intención de contratar | ~70 | sin puja | No da para una campaña de búsqueda |
| Reformas, intención de contratar | <100 | 3-4 € | No da para una campaña de búsqueda |
| Clínicas, intención de contratar | ~870 | 5-6 € (dental 14-30 €) | **Sí**: el único sector con demanda |
| «agencia de generación de leads» y variantes | ~120 | ~7 € | **Sí**: pocos, pero quieren contratar |
| CRM, WhatsApp CRM, funnel de ventas | 1.300-2.000 | 8-20 € | **No**: buscan software o aprender. Van como negativas |

## 2. Las dos campañas

### A. `QV_SEARCH_AltaIntencion` · Búsqueda · 10 €/día · CPC máx. 6 €
- **3 grupos de anuncios:**
  - Agencia de captación de leads (7 palabras clave), a la home.
  - Seguimiento y CRM como servicio (4 palabras clave), a la home.
  - Clínicas (10 palabras clave), a `/clinicas/`.
- **Palabras clave** en concordancia de frase. Hay 35 negativas desde el primer día (gratis, curso, software, HubSpot y similares).
- **Anuncios** responsive de búsqueda con 15 títulos y 4 descripciones. No hay casos de clientes ni cifras inventadas.
- **Horario:** de lunes a viernes, de 8 a 20 h.
- **Puja:** maximizar clics con techo de CPC mientras no haya conversiones. Con 15 conversiones se pasa a maximizar conversiones.

### B. `QV_PMAX_Captacion` · Performance Max · 10 €/día
- **Un grupo de recursos general**, con los textos validados en `pmax-recursos.csv`:
  - 15 títulos.
  - 5 títulos largos.
  - 5 descripciones.
- **Temas de búsqueda:** agencia de captación de leads, captación de pacientes, captación de alumnos, seguimiento de leads y presupuestos de reformas.
- **Señal de audiencia:**
  - Lista de clientes y leads de GHL.
  - Visitantes de `/formacion/`, `/clinicas/` y `/reformas/`.
  - Segmento personalizado con las búsquedas de la tabla.
- **Recursos que faltan:**
  - Logo cuadrado y logo horizontal.
  - 3 imágenes: horizontal 1,91:1, cuadrada y vertical 4:5.
  - Los vídeos de Javier y de reformas subidos a YouTube como ocultos. **Responsable: Creative.**
- **Riesgo honesto:** Performance Max sin historial de conversiones y a 10 €/día suele llenarse de formularios basura de display. Solo lo lanzaría:
  - Con la conversión «reunión agendada» importada desde GHL, no solo «formulario enviado».
  - Con la URL final fija, sin expansión de URL.
  - Con exclusión de marca y de ubicaciones de apps móviles.

  **Mi recomendación es empezar por A.** B va en el paquete porque Maikel lo pidió, pero en segundo lugar.

## 3. Lo que hace falta antes de activar (y quién)

| # | Qué | Quién | Tiempo |
|---|---|---|---|
| 1 | Cuenta de Google Ads de Qualivo con facturación. Invitar a Paid o importar estos CSV con Google Ads Editor | Maikel | 15 min |
| 2 | Etiqueta de Google Ads (AW-…) y Conversion Linker en las landings, con consentimiento | Growth | ½ día |
| 3 | Guardar el `gclid` de la URL en un campo propio de GHL (el formulario ya envía la query string) | Growth / Automatización | ½ día |
| 4 | Conversiones: «Solicitud» (formulario web) como secundaria; «Reunión agendada» y «Reunión con encaje» importadas desde GHL como principales | Paid, cuando haya acceso | 1 h |
| 5 | Recursos de Performance Max (logos, imágenes, vídeos en YouTube) | Creative | 1 día |

Sin el punto 3, Google no sabría qué lead viene de él y tendríamos el mismo problema que con Meta antes del 3-nov.

## 4. Presupuesto frente al tope de noviembre (800 €)

- Gastado hasta el 4-nov a las 03:30 UTC: unos 163 € (Meta Insights).
- La prueba de Meta del 4 al 6-nov cuesta unos 120 €. Al terminar quedarán **unos 515 € para 24 días, unos 21 €/día**.
- Opciones:
  - **a) Solo Meta:** el anuncio que gane, a 20 €/día. Cabe.
  - **b) Meta 10 €/día + Google búsqueda 10 €/día.** Cabe, pero con 10 €/día cada uno aprende despacio.
  - **c) Meta 20 €/día + Google búsqueda 10 €/día:** unos 720 € del 7 al 30-nov. **No cabe:** habría que subir el tope a unos 1.000 €.
- Performance Max sumaría otros 10 €/día: con el tope actual no cabe junto a lo demás.

## 5. Qué se espera y cuándo muere

| | Búsqueda alta intención (10 €/día) |
|---|---|
| Clics/mes | 40-75 [E] (CPC 4-8 €) |
| Leads/mes | 2-6 [E] (conversión de visita a lead 4-8 %, estimada) |
| Lectura | A los 14 días de activarse |
| Muere si | En 4 semanas no hay al menos 2 reuniones agendadas atribuidas por gclid, o el coste por reunión pasa de 236 € (2× Meta) |

## 6. Ficheros

- `campanas.csv`: las 2 campañas, en pausa.
- `palabras-clave.csv`: 21 palabras clave de frase en 3 grupos.
- `negativas.csv`: negativas por campaña.
- `anuncios-rsa.csv`: 3 anuncios responsive de búsqueda (longitudes comprobadas: títulos ≤ 30 y descripciones ≤ 90).
- `pmax-recursos.csv`: los textos de Performance Max (longitudes comprobadas).

Se generan con `build.py` (esta carpeta), con comprobación de longitudes.
