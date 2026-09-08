# EAC · Guía de marca para contenido (Motor de Crecimiento Qualivo)

Marca de **Escola Aeronàutica de Catalunya** aplicada al blog y a los lead magnets.
Objetivo: parecer la **referencia formativa del sector aéreo** en España — seria, con datos, y a la vez cercana y aspiracional.

## Identidad en una frase
> "Tu carrera en la aviación empieza aquí." Formación oficial, salida laboral real, gente que te acompaña. Aspiracional (**¿Despegamos?**) pero siempre con datos (plazas, AESA, homologación, sueldos reales).

## Color (ver `brand.css`)
| Rol | Token | Hex |
|---|---|---|
| Tinta / héroe (casi-negro azulado) | `--eac-ink` | `#0E1621` |
| Rojo EAC (acentos, CTA, subrayados) | `--eac-red` | `#D8232A` |
| Azul cielo (enlaces, datos) | `--eac-sky` | `#1E6FE0` |
| Fondo lectura | `--eac-paper` | `#FFFFFF` |
| Fondo sección / tarjeta | `--eac-mist` | `#F4F6F9` |
| Texto secundario | `--eac-muted` | `#5B6675` |

Regla: **negro + rojo** dominan; el azul y el verde son de apoyo (enlaces y datos positivos). Nada de degradados chillones.

## Tipografía
- **Titulares:** Montserrat (800/700) — carácter, autoridad.
- **Cuerpo:** Inter — legible a 18px, interlineado 1.7.
- Fallback a system-ui siempre.

## Tono de voz
- **Cercano y directo**, de tú. Cero humo corporativo.
- **Orientado a la salida laboral**: cada tema responde "¿esto para qué me sirve / cuánto se gana / cómo entro?".
- **Con datos y honestidad**: si un curso es exigente, se dice. Genera más confianza que la venta fácil.
- **Aspiracional con los pies en el suelo**: "despegar", "cabina", "uniforme" sí; promesas de sueldo garantizado no.
- **Inclusivo**: la profesión es mixta (TCP, despachador, agente de tierra) — evitar "azafata" como genérico salvo en keywords donde la gente lo busca así.

## Reglas de contenido (para todos los artículos)
1. **Estructura hub-and-spoke**: cada satélite enlaza a su pilar y a 2-3 hermanos.
2. **Schema** `Article` + `FAQPage` cuando haya preguntas.
3. **Índice** arriba y **recap** al final.
4. **CTA a un lead magnet** relevante (no a "pide info" genérico).
5. **GEO**: redactar para que ChatGPT/Perplexity/Gemini puedan citarlo (definiciones claras, listas, cifras con fuente).
6. **Dato real por artículo** (píldora `.eac-stat`): plazas, % inserción, sueldo medio, duración… con fuente.

## Los 3 productos (para enlazar/CTA correctamente)
- **TCP / Auxiliar de vuelo** (buque insignia).
- **Azafata de tierra y operaciones (AT)**.
- **Despachador de vuelo (FD)** — el menos conocido y el que más cuesta cerrar → el contenido tiene que hacer la evangelización.
