# Anuncio viejo de formación · apertura nueva para escuelas (22-nov)

- **Encargo:** de Maikel, relayado por Paid el 22-nov. Variante del anuncio antiguo (anuncio 120246158348220358, «QV_3V_formacion_Sep26») que cambia únicamente la apertura. El cuerpo no se toca.
- **Estado:** guion y prueba de montaje. No se publica; sin fecha de lanzamiento.

## Cómo encaja con el cuerpo

El original abre con la tarjeta «¿Qué pasa con un alumno cuando pide información?» y la voz «Mira lo que pasa con un alumno desde que pide información. Ejemplo, una academia.» (0-5,65 s). El cuerpo empieza en 5,65 s con «Laura responde a un anuncio. El sistema ya sabe qué curso quiere, en qué turno y para cuándo.»

El cuerpo no empieza explicando los agentes, así que el punto de corte es el mismo del original (5,68 s de vídeo). La apertura nueva termina en «qué pasa con las solicitudes» y el cuerpo responde enseñándolo con Laura.

Lo que se pierde: la frase «Ejemplo, una academia» de la voz original. La etiqueta «Caso de ejemplo» sigue en pantalla durante el cuerpo.

## Dos pruebas

| | Tarjeta | Voz | Apertura | Total |
|---|---|---|---|---|
| **G5 · frase de Maikel entera** | ¿TU ESCUELA YA INVIERTE **EN PUBLICIDAD?** / *Hay algo que deberías revisar: qué pasa con las solicitudes después de conseguirlas.* | «¿Tu escuela de formación online ya invierte en publicidad? Entonces hay algo que deberías revisar: qué pasa con las solicitudes después de conseguirlas.» | 9,6 s | 73,8 s |
| **G6 · compacta** | ¿TU ESCUELA YA INVIERTE **EN PUBLICIDAD?** / *Mira qué pasa con cada solicitud después de conseguirla.* | «¿Tu escuela de formación online ya invierte en publicidad? Mira qué pasa con cada solicitud.» | 5,7 s | 69,8 s |

- La frase entera no cabe en 3-5 s: dicha a ritmo normal, con las pausas recortadas a 0,32 s, ocupa 9,1 s.
- G6 ocupa exactamente el hueco de la tarjeta original, así que el vídeo dura lo mismo que el antiguo.
- Voz: Javier Rojas, ElevenLabs multilingual v2, la misma del original. Música: la misma. En G5 la música suena 4 s de más al principio y vuelve a empezar con un fundido para llegar al empalme igual que el original; ese fundido no se ha podido escuchar.
- La tarjeta dice «escuela» y no «academia». El cuerpo y la tarjeta final siguen diciendo «academia» y «siete agentes»: no se han tocado.

## Archivos

- `salida/viejo-g5-916.mp4`, `-45.mp4` y `salida/viejo-g6-916.mp4`, `-45.mp4`.
- Montaje: `montar_apertura.py` y `render_apertura.js` (apertura de duración libre; `montar.py` sigue sirviendo para G1-G4).
- Textos en `ganchos.json` (`g5`, `g6`); locución en `voz/`.
