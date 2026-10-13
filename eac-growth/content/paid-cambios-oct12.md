# EAC · Cambios en paid · 12 de octubre de 2026

Cuatro decisiones pendientes, ejecutadas. **El presupuesto total no sube:
€75/día antes y €75/día después.**

## 1 · DINAMICA_LANDING de €40 a €15/día

Lo acordado para el 7 de octubre: cuatro entrevistas a €40/día o vuelta a €15.
Se quedó en **2 entrevistas, a €426,61 cada una** contra €108,90 de media de la
cuenta. En los doce primeros días de octubre gastó **€448 más para traer 2 leads**.

Cinco días de retraso sobre la fecha comprometida.

## 2 · Idiomas y ubicación

El origen de los leads extranjeros que reportó Lu: **13 % de los leads de octubre
con teléfono de fuera, y 9 de 13 salían de `[AD] Clientes Potenciales`**.

Los tres conjuntos activos tenían:

```
locales: [5, 6, 23]  →  Alemán · Inglés (EEUU) · Español
```

Un curso presencial en español anunciado a gente con Facebook en alemán. Y dos
de los tres llevaban `location_types: ["home","recent"]`, donde *recent* son
personas que han **pasado** por Barcelona: turistas y gente de paso.

Ahora: `locales: [1, 23]` — **Español y Catalán**.

> El catalán no es un detalle: poner solo español habría excluido a la parte de
> Barcelona que tiene Facebook en catalán. Casi se nos escapa.

`location_types` queda en `["home"]`, salvo en DINAMICA, donde Meta mantiene
`["frequently_in","home"]` — «gente habitualmente allí», que ya no son turistas.

## 3 · Campaña propia para los vídeos

`EAC_TCP_VIDEOS_TEST_Oct26` · conjunto `VIDEOS_TEST · Intereses Educación · BCN`
· **€25/día**, los que libera DINAMICA.

Existe porque el de objeciones llevaba **989 impresiones congeladas desde el 2 de
octubre** pese a tener mejor CTR que el anuncio dominante (1,82 % contra 1,43 %).
Con presupuesto de campaña, el anuncio que ya tiene señal se lo queda todo y uno
nuevo no llega a arrancar nunca. Con presupuesto propio los tres compiten en
igualdad.

Los tres vídeos quedan **solo** en la campaña nueva; en el conjunto antiguo están
pausados para no contaminar la comparación.

Segmentación idéntica a la del conjunto que funciona: Barcelona +40 km,
residentes, 18-26, español y catalán.

### Detalles de la API que costaron un rato

| Síntoma | Causa | Arreglo |
|---|---|---|
| `(#100) subcódigo 4834011` al crear campaña | Meta ya exige declarar `is_adset_budget_sharing_enabled` cuando el presupuesto no va en la campaña | mandarlo en `false` |
| `(#100) subcódigo 2490487` al crear conjunto | falta `bid_strategy` | `LOWEST_COST_WITHOUT_CAP` |
| `(#613)` al editar segmentación | 1 llamada cada 30 s por conjunto, y acababa de tocarle el presupuesto | esperar y reintentar |

## 4 · Google — no ejecutado

`CURSO_TCP_CAT` lleva **€253 en octubre para 3 leads en el CRM y cero
entrevistas** (€63 por conversión declarada por Google, €84 por lead real).

**No se ha tocado**: las credenciales de Google Ads se perdieron al reciclarse el
contenedor. Solo se puede leer, a través del panel, que las tiene en Vercel.

## Para revertir

El estado anterior de los tres conjuntos quedó guardado antes de tocar nada.
Volver atrás es devolver `locales` a `[5,6,23]`, `location_types` a
`["home","recent"]` y el presupuesto de DINAMICA a `4000`.

## Qué mirar y cuándo

| Cuándo | Qué |
|---|---|
| En 48 h | Que los tres vídeos tengan impresiones **repartidas**. Si uno vuelve a acaparar, el problema no era el presupuesto |
| En una semana | Si bajan los leads con teléfono extranjero del 13 % |
| En dos semanas | Coste por entrevista de la campaña de vídeos contra los €138 de la cuenta |
