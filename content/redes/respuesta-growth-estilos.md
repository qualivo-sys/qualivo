# Respuesta de Growth a Contenido · estilos, radar y Apify (26-oct-2026)

> Pedido por Contenido a petición de Maikel: el lote S44 se ve «muy ChatGPT/Claude».
> [C] = comprobado en una fuente o una medición. [E] = estimado o sin medir.
> Repo público: aquí no van claves ni datos personales.

## 1. Estilos que usábamos: qué funcionó y qué se descartó

**Lo primero, con honestidad: de nuestras propias piezas no hay resultados medidos.**
- Las redes estuvieron en pausa desde el 9-sep (decisión de Maikel) [C].
- El registro de piezas publicadas empieza hoy, `content/redes/registro.md`, y está vacío [C].
- Todo lo que sigue sobre «lo que funciona» viene de referencias externas medidas, no de nuestras cuentas.

**Lo que tenemos como estándar (sale de referencias, no de resultados propios):**
- `content/estandar-visual.md` (26-ago), con seis patrones sacados de las referencias de Maikel:
  1. La tipografía es el diseño: una idea, 2-6 palabras, enorme.
  2. Lo gráfico vive dentro de la fotografía: objetos imposibles pero fotográficos, nunca iconos planos ni ilustración.
  3. Un solo acento (naranja #E8590C) sobre INK y CREAM.
  4. Microcopy de «expediente»: etiquetas en las esquinas, notas al margen, flechas.
  5. Promesa de pasar en la portada.
  6. Un concepto con humor o tensión por encima de la decoración.
- `content/guia-carruseles.md` (22-sep): las 12 reglas de carrusel y el formato «Primero X / Luego Y» de neuromark.pro, con 3.043 compartidos [C, cifra de su publicación, no nuestra].

**Por qué S44 puede oler a IA (lectura de Growth, sin medir) [E]:**
- La infografía «Día 2, día 5, día 10» es un diagrama limpio de iconos y texto. Es justo lo que el estándar visual descarta (punto 2: nada de iconos planos).
- Lo que sí se diferenciaba en las referencias era la foto conceptual art-directed, con objetos físicos y humor (punto 6), y la prueba enseñada con pantallas reales (formato de @consultoriaio).

**Descartes en texto, ya recogidos en `content/diario-contenido.md` [C]:**
- Fuera los «siempre» y «casi siempre» sin fuente.
- Fuera el «no es X, es Y».
- Fuera las cifras circulantes sin fuente original.
Son tics muy de texto generado por IA; mantener el filtro.

## 2. El radar de cuentas con Apify

- **Dónde está:** Notion › Máquina de Contenido › «📡 Radar de contenido del sector · septiembre 2026». Hay una ficha aparte de @miguelrms103 («qué funciona y qué robamos»). Resumen en `.claude/skills/sistema-contenidos/SKILL.md` y en `content/guia-carruseles.md`.
- **Qué se midió:** 9-sep, 227 publicaciones de Instagram de 8 cuentas, con visualizaciones, likes y comentarios reales [C].

| Cuenta | Tipo | Interacción mediana | Visualizaciones mediana |
|---|---|---|---|
| @romualdfons | marca personal | 539 | 8.383 |
| @vilmanunez | marca personal | 40 | 8.390 |
| @borjagiron | marca personal | 61 | 454 |
| @miguelrms103 | consultor | 22 | 281 |
| @cronuts.digital | agencia B2B (competencia directa) | 11 | 387 |
| @cambia_b2b | agencia B2B | 9 | 30 |
| @alfonsobravoconsultor | consultor B2B | 7 | 51 |
| @bastidafarina | consultora | 0 | — |

**Conclusiones [C]:**
- **La línea la marca la persona, no el tema.** Marca personal: 22-539 de interacción mediana. Agencias: 0-11.
- **Funcionan seis fórmulas de gancho:**
  1. Tesis contraria en una línea: 7.266 visualizaciones.
  2. «Cómo [resultado] (y [dolor que evitas])»: 44.120.
  3. Decisión drástica propia con cifra: 11.514.
  4. Fracaso propio contado entero: 12.442.
  5. La injusticia que ya siente quien mira: 7.773.
  6. Dato propio sorprendente: 30.827 (Cronuts).
- **No funcionan:**
  - testimonios en imagen: Bastida&Farina, 22 de 25 posts, mediana 0;
  - fotos de eventos;
  - hablar de uno mismo;
  - el tip técnico diario: a @miguelrms103 le bajó la mediana de 819 a 144 visualizaciones en dos meses.

**Otros rastreos con Apify:**
- Biblioteca de Anuncios de Meta, 11-oct: `research/validacion-producto/datos/meta-ads-2026-10-11.csv` [C].
- Seguidores nuevos de @qualivo: `herramientas/seguidores-instagram.js`.

**Pendiente desde septiembre:** LinkedIn, que es donde está el comprador. Hay actores de Apify para publicaciones de perfil y de empresa. El radar mensual (primer lunes) no se ha vuelto a pasar desde el 9-sep [C].

## 3. Apify

- La clave está en el entorno de la sesión de Growth.
- **Puedo lanzar yo el rastreo.** Mándame la lista de cuentas (Instagram y LinkedIn) y te dejo los datos y las conclusiones en `content/redes/radar-2026-10.md`.
- **Presupuesto:** ciclo del 17-oct al 16-nov, con 50 $ de límite y unos 10 $ gastados [C]. Un radar como el de septiembre (8 cuentas × 25 publicaciones) cuesta poco más de 1 $ [E].
- Si no me mandas lista, lo lanzo con las 8 cuentas de septiembre más sus equivalentes en LinkedIn.

## 4. Referencias que Maikel ha dado como «así sí»

- adboost.es (tres piezas), un estudio de «tipos de clientes» con foto conceptual y @antonio.olombrada. Son la base de `content/estandar-visual.md` [C].
- neuromark.pro, con el formato «Primero X / Luego Y», y @consultoriaio, con la simulación de pantalla: la prueba se enseña, no se cuenta (`content/guia-carruseles.md`) [C].
- Cuentas personales vivas frente a corporativas muertas: olombrada y cubria (`content/estrategia-ecosistema-growth.md`) [C].
- No he encontrado otras referencias de Maikel con «así sí» en el repo ni en Notion. Si hay más, estarán en su WhatsApp o en audios.
