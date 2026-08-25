# Catálogo de voz grabada

> Todo lo que ya está dicho en la voz de Maikel, con archivo y marca de tiempo.
> Regla de la casa: **antes de generar voz nueva, mirar aquí.**
> Datos en `catalogo-de-voz.json` (transcripción con marcas, generada con Whisper).

## GUION A · «Esto es lo que haces» → las fugas

Montado el 21-ago-2026 en `EstoFugas.tsx`. Fuente: `avatar/REEL-ESTO-v1.mp4`
(la narración entera, seguida) y los clips sueltos:

| Frase | Archivo | Marca |
|---|---|---|
| «Cuando tu negocio se estanca y el beneficio no sube, esto es lo que haces» | `esto-hook` | 0.00–5.00 |
| «Meter más dinero en publicidad» | `esto-r1` | 0.00–4.00 |
| «Contratar a otra persona» | `esto-r2` | 0.00–3.00 |
| «Comprar otra herramienta» | `esto-r3` | 0.00–2.00 |
| «Y echarle más horas» | `esto-r4` | 0.00–5.00 |
| «Y a los tres meses estás exactamente igual» | `esto-facturas` | 0.00–5.36 |
| «Porque el problema no era cuánto estabas metiendo, era por dónde se te estaba escapando» | `esto-insight` | 0.00–7.00 |
| «Yo me dedico a encontrarlas. Antes de meter más, mira por dónde estás perdiendo» | `esto-cierre` | 0.00–5.56 |

**Versión larga de las fugas — mejor que la que se usó** (`esto-fugas2`, 0.00–13.00):

> «Anuncios que llevan meses sin revisar. Clientes que piden información y tardas
> dos días en responder. Comerciales que no saben ni a quién llamar. Ventas a las
> que nadie hace seguimiento. Esos son fugas y no aparecen en ninguna factura.»

Cuatro fugas en cuatro puntos distintos del recorrido —captación, atención,
comercial, cierre— que es exactamente el posicionamiento del documento madre.
La versión corta que se montó solo tenía tres y todas del tramo comercial.

## GUION B · «La lista infinita» — COMPLETO Y SIN MONTAR

Siete tomas, `avatar/avatarD-toma1..7-final.mp4`. Narración seguida:

1. «Últimamente me he dado cuenta de una cosa. Tener una empresa puede
   convertirse fácilmente en tener una lista infinita de cosas que recordar.» *(7.9 s)*
2. «¿Qué tengo que responder a este cliente? ¿Que tengo que revisar esto? ¿Que
   tengo que decirle a alguien que haga aquello?» *(7.0 s)*
3. «Y al final te pasas el día apagando pequeñas cosas, una detrás de otra.» *(4.5 s)*
4. «Y lo peor es que muchas de ellas ni siquiera deberían depender de ti.
   Deberían pasar solas.» *(6.0 s)*
5. «Un cliente hace algo y automáticamente ocurre lo siguiente. Un lead entra y
   se gestiona. Una tarea termina y se crea la siguiente.» *(7.5 s)*
6. «Porque para mí el objetivo de la IA no es que tengas otra herramienta a la
   que preguntarle cosas. Es que empiece a trabajar contigo.» *(10.3 s)*
7. «Que tu empresa funcione un poco más, aunque tú no estés pendiente de ella
   todo el rato.» *(5.7 s)*

Total ≈ 49 s en bruto; apretando silencios queda en 38–40.

**Pendiente conocido**: la toma 6 no gusta en imagen (queda raro al caminar).
Solución con lo aprendido: se conserva **la voz** de la toma 6 y debajo van otras
imágenes. Ese era el problema todo el rato — se descartaba la toma entera cuando
solo fallaba el plano.

## Montaje final del GUION A (21-ago-2026)

`EstoFugas.tsx`, 54 s. Seis tramos:

| Tramo | Duración | Voz | Imagen |
|---|---|---|---|
| A | 14.1 s | hook + las cuatro cosas | `esto-v1` con su vídeo |
| B | 5.7 s | «y a los tres meses…» | `esto-facturas` |
| C | 7.0 s | `vo-insight` | grifo abriéndose → la fuga de cerca |
| D | 12.8 s | `vo-fugas4` (las cuatro) | cinco encuadres de la tubería + un chip por fuga |
| E | 8.6 s | **sin voz** | logo + `capo.mp4` (el mapa del negocio) |
| F | 5.9 s | `vo-cierre` | tubería parcheada + tarjeta FUGAS |

**El tramo sin voz necesita sonido propio.** Ocho segundos mudos en medio de un
reel se sienten como una avería. Sonido sintetizado para el capó: pad de medios,
un tic por cada nodo que aparece (880 Hz subiendo), un barrido de análisis, y un
aviso de dos notas cuando se encienden las fugas. Se mezcla en ffmpeg sin
volver a renderizar:

```
[1:a]adelay=39600|39600,volume=0.9[capo];[0:a][capo]amix=inputs=2:duration=first:normalize=0
```

**Marca de marca**: el nombre de la empresa nunca se pronuncia, va en pantalla.
Aquí es una cartela de 1,3 s con el logo antes de la animación.

### Tomas nuevas del 21-ago-2026 (112 créditos)

| Archivo | Frase | Sitio |
|---|---|---|
| `avatar/nueva-tuberia.mp4` (6 s) | «Si pones más dinero en una tubería con fugas, el dinero se te escapa igual.» | sala de reuniones |
| `avatar/nueva-capo.mp4` (8 s) | «Abrimos el capó, miramos el negocio entero y buscamos por dónde se te está escapando.» | calle |

**El truco de la referencia**: la imagen de partida es **un fotograma del propio
plano que ya está en el montaje** (`esto-insight` en 6.3 s, `esto-cierre` en 6.4 s),
no una foto suelta ni una hoja de personaje. Misma cara, misma ropa, misma luz,
mismo sitio: la continuidad sale gratis. Esto resuelve de raíz el problema que
nos hizo tirar tantas tomas.

```bash
ffmpeg -ss 6.3 -i esto-insight.mp4 -frames:v 1 -vf scale=1080:1920 ref-sala.png
```

Modelo `grok-imagine/image-to-video`, 1080p, `aspect_ratio 9:16`, una sola imagen
de referencia (con varias el clip sale mudo). Ambas dijeron la frase palabra por
palabra a la primera — comprobado con Whisper antes de montarlas.

### Toma nueva del 25-ago-2026 (65 créditos)

| Archivo | Frase | Sitio |
|---|---|---|
| `premium/voz-prioridad.mp4` (6 s) | «No todas cuestan lo mismo. La pregunta es cuál tapas primero.» | calle (ref-calle.png) |

Grabada para el reel premium del cubo (`CuboPremium.tsx`). Verificada con
Whisper: frase completa, acentuación correcta a la primera.

### Regla de ortografía en los prompts de voz (25-ago)

**Grok lee literalmente lo que está escrito.** La toma del capó se generó con
«capo» sin tilde en el prompt y la voz dijo /kápo/. Regenerada con «capó» y una
línea de refuerzo («stress on the final syllable») salió perfecta a la primera.

Regla: el texto que va a decir la voz se escribe SIEMPRE con la ortografía
completa del español — tildes, eñes, signos de apertura. Nada de asciificar.
Coste del despiste: 65 créditos y un re-render.
