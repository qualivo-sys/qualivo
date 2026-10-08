# Reconciliación del gasto · 8-oct-2026 (pedida por Growth: 719,54 € frente a 1.026,80 €)

Las dos cifras son correctas y miden cosas distintas. Fuente: Meta Marketing API, cuenta
`act_3453332464718877`, leída el 8-oct a las 14:30 UTC.

| qué mide | periodo | importe |
|---|---|---|
| **toda la cuenta** (las cinco campañas QV_*) | 1-sep → 8-oct | **1.061,59 €** |
| toda la cuenta | 1-sep → 7-oct (la cifra "1.026,80" de Growth es esta, leída un día antes) | 1.027,88 € (lectura del 7-oct) |
| toda la cuenta | 15-sep → 7-oct (periodo del informe de Ops) | 1.010,74 € |
| **solo la campaña viva `QV_VERTICALES_Sep26`** (desde el 18-sep) | 18-sep → 8-oct | **768,31 €** |
| ídem, lectura del 6-7 oct (la cifra "719,54" es esta: el contador del tope de campaña) | hasta 6-7 oct | 719-731 € |
| octubre | 1-oct → 8-oct | 363,60 € |

Desglose de la cuenta 1-sep → 8-oct por campaña: `QV_VERTICALES_Sep26` 768,31 ·
`QV_3VERTICALES_Sep26` (reformas y el primer pivote, 17-sep → 30-sep) 189,79 ·
`QV_CRM_VIDEO` 44,95 · `QV_DIAG_LEADFORM` 37,46 · `QV_HERO_LEADS` 21,08 = 1.061,59 €.

**Cuál usar para qué**
- Coste por reunión o por piloto "del paid": la cuenta entera desde el 15-sep (1.010,74 € hasta
  el 7-oct). Todo ese dinero buscaba leads de Qualivo.
- Lectura del test de creativos y del funnel v2: solo `QV_VERTICALES_Sep26` (768,31 €), que es
  donde viven los cuatro anuncios.
- Tope de campaña (1.604 €): se compara con los 768,31 € de la campaña, no con la cuenta.

Queda reconciliado. A partir de ahora Paid reporta siempre las dos cifras con su etiqueta.
