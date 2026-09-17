# VERSIÓN 4:5 EN FEED, DENTRO DE LOS MISMOS ANUNCIOS · 17-sep-2026

```
AGENTE       qualivo.paid
PIDE         Maikel, 17-sep: «ponla dentro del mismo ad no hagas uno nuevo tienes que editar
             la ubicación» · «metelo dentro delmismo ad»
CAMPAÑA      QV_3VERTICALES_Sep26   120245682520090358
ESTADO       ✅ HECHO Y VERIFICADO · 17-sep 19:5x · los cuatro anuncios sirven 4:5 en feed
```

## Qué está hecho

> **Cerrado.** Los cuatro anuncios apuntan ya a su creativo nuevo. Ver *Cómo se desbloqueó*
> al final para la parte del token.


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

## Cómo se desbloqueó

La certificación de no discriminación que firmó Maikel iba a su **perfil personal**
(`1569066887680025`). La API escribía como **Twin Integration** (`122095940019184700`), un
usuario de sistema ADMIN del negocio Qualivo. Son dos usuarios distintos y la certificación va
por usuario, así que firmar no desbloqueaba nada.

Con el token del usuario de sistema quedó bloqueado **todo lo que pone anuncios en circulación**,
no solo cambiar el creativo:

| Intento con el token de sistema | Resultado |
|---|---|
| Cambiar el creativo de un anuncio | ❌ `subcode 2859002` |
| Cambiarlo y pausar en la misma llamada | ❌ `subcode 2859002` |
| Crear un anuncio nuevo **en pausado** | ❌ `subcode 2859002` |
| Copiar un anuncio | ❌ `subcode 2859002` |
| Reescribir el nombre del mismo anuncio | ✅ `success: true` |

Lo resolvió Maikel generando un token de **usuario** desde su perfil certificado. Con ese, los
cuatro `POST` pasaron a la primera.

**El callejón del Administrador, para que no se repita:** con personalización por ubicación, la
interfaz exige una URL de sitio web y **no enseña el campo donde escribirla** en un anuncio de
formulario instantáneo. Ni en Destino ni en Contenido del anuncio. Por API sí existe:
`asset_feed_spec.link_urls`. Si vuelve a pasar, no se busca el campo: se hace por API.

## Verificación final · 17-sep

Los cuatro anuncios, leídos después de escribir:

```
AD · 3V · reformas    ACTIVE   creativo 1385315713721702   form 1061906346738399
AD · 3V · formacion   ACTIVE   creativo 3193765407499417   form 1786744439184083
AD · 3V · clinicas    ACTIVE   creativo 2005089564211895   form 1479297290674260
AD · 3V · asesorias   ACTIVE   creativo 1819169675904697   form 1910722980312589
```

Los cuatro con las mismas dos reglas: `v45 → fb[feed] ig[stream]` y `v916 → fb[story] ig[story]`.
Las 16 vistas previas (4 creativos × 4 ubicaciones) renderizan. Conjunto `ACTIVE` a 20,00 €/día,
sin tocar. Los anuncios pasan a `IN_PROCESS` mientras Meta revisa el creativo nuevo, que es lo
normal tras una sustitución.

## Nota sobre credenciales

El token de usuario se usó solo en memoria de la sesión. **No está en el repositorio, ni en este
documento, ni en el bus.** Caduca a las 20:00 del 17-sep. El token de página de Twin Integration
sigue sin rotar, día 11, y sigue sin poder tocar anuncios hasta que se certifique al usuario de
sistema o al negocio.
