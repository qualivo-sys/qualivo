# VERSIÓN 4:5 EN FEED, DENTRO DE LOS MISMOS ANUNCIOS · 17-sep-2026

```
AGENTE       qualivo.paid
PIDE         Maikel, 17-sep: «ponla dentro del mismo ad no hagas uno nuevo tienes que editar
             la ubicación» · «metelo dentro delmismo ad»
CAMPAÑA      QV_3VERTICALES_Sep26   120245682520090358
ESTADO       ⚠️ CONSTRUIDO Y VALIDADO · BLOQUEADO por una certificación de cuenta
```

## Qué está hecho

Los cuatro vídeos 4:5 están subidos y procesados, y los cuatro creativos nuevos están creados
y verificados contra la API. Lo único que falta es enganchar cada creativo a su anuncio, y eso
es lo que Meta bloquea.

| Sector | Anuncio (no cambia) | Creativo nuevo | Vídeo 4:5 |
|---|---|---|---|
| reformas | 120245684073590358 | 1385315713721702 | 1052337574284397 |
| formacion | 120245684074690358 | 3193765407499417 | 1099426922541589 |
| clinicas | 120245684075330358 | 2005089564211895 | 2234101800466696 |
| asesorias | 120245684170770358 | 1819169675904697 | 1735323664230414 |

Cada creativo lleva los dos vídeos etiquetados y la regla de ubicación que Meta devuelve guardada:

```
regla p1   v45   → facebook: feed    instagram: stream
regla p2   v916  → facebook: story   instagram: story
```

El conjunto tiene exactamente esas cuatro ubicaciones, así que la cobertura es del 100 % y no
queda hueco por el que el vertical se cuele en feed. Vista previa comprobada y renderizando en
`MOBILE_FEED_STANDARD`, `INSTAGRAM_STANDARD`, `INSTAGRAM_STORY` y `FACEBOOK_STORY_MOBILE`.

Se conservan el formulario nativo, el copy, el titular y la descripción de cada vertical.
**No se ha creado ningún anuncio nuevo.** Los cuatro anuncios siguen con su creativo anterior
y sirviendo, intactos.

## Lo que bloquea · lo tiene que hacer Maikel

```
code 3 · subcode 2859002
"Certificación necesaria — Antes de poner anuncios en circulación, debes certificar el
 cumplimiento de nuestra política de no discriminación."
 facebook.com/certification/nondiscrimination
```

Salta **solo al cambiar el creativo de un anuncio**, no en cualquier edición: reescribir el
nombre del mismo anuncio devuelve `success: true`. Es una certificación de cuenta, de un clic,
y la firma el administrador. El agente no puede firmarla ni debe.

En cuanto esté firmada, enganchar los cuatro creativos es un minuto.

## Dos cosas que no eran obvias, por si hace falta repetirlo

Descubiertas probando contra la API, no de memoria:

1. La miniatura de un vídeo dentro de `asset_feed_spec` va en **`thumbnail_hash`**. Con
   `image_hash` responde `(#100) Invalid keys "image_hash"`.
2. El formulario de leads va en **`asset_feed_spec.call_to_actions`**. Ni `link_urls` ni
   `onsite_destinations` lo aceptan.
3. Un anuncio con personalización de activos **exige `link_urls`** aunque el destino real sea
   un formulario nativo: sin él, `subcode 1885800` «Falta la URL del enlace en el contenido».
   Se ha puesto la landing de cada vertical.

## La avería de Meta que hubo por el camino

`POST /advideos` devolvió **HTTP 500 a todo** durante ~20 minutos: los cuatro vídeos nuevos, el
mismo vídeo 9:16 que ya se había subido a las 12:47, y un clip de prueba de 3 segundos y 38 KB.
`/adimages` funcionaba, los creativos se creaban y las lecturas iban bien, con el mismo token y
la misma cuenta. No era el fichero ni el permiso: era ese endpoint.

**Rodeo usado:** subir por `POST /{page_id}/videos` con `published=false` y referenciar ese
`video_id` en el creativo. Meta lo copia a la biblioteca de la cuenta con un id nuevo. Los
vídeos **no** se han publicado en la página.

## Coste de la sustitución

En el momento de hacerlo la campaña llevaba **69 impresiones y 2,21 €** (Meta Insights, 17-sep).
No es cero, como dije antes por error: es calderilla y el aprendizaje no ha arrancado, pero
conviene no repetirlo cuando sí haya histórico.
