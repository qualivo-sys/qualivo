# Anuncios «estilo Veam» · formación · semana 40

Referencia: anuncio de Veam Visuals (16 s, sin voz, música y rótulos grandes sobre
planos reales de trabajo; en su campaña de escalado, grupo «ganadores»). Nuestro
equivalente del «detrás de las cámaras» es el sistema trabajando en pantalla, con la
hora, y Maikel.

Todos van al conjunto de formación (`120245699224780358`) con el formulario nuevo
(`1089963670593608`: cuándo + «desde 750 €/mes»), como anuncios que compiten entre sí.
No se toca el conjunto ni el presupuesto: se mide cuál trae más contactos A/B y más
reuniones presentadas.

## Borradores hechos (27-sep)

- `qualivo-veam-v1.mp4`: 16 s. Gancho → 23:04 → 23:05 → 9:00 → ficha → aviso → «nos
  encargamos de todo» → capta/entiende/actúa.
- `qualivo-veam-v2.mp4`: igual, con la captación en el segundo plano: pantalla real de
  Anuncios, «Atraemos a los que compran · no a los curiosos». **Es la base.**
- Fuente: `escena.html` (cada fotograma se pinta con `setT(t)`), `render.js`,
  `musica.mp3` (ElevenLabs Music, 16 s, instrumental). Los fotogramas de Maikel salen de
  su vídeo selfie (no están en el repositorio; se regeneran con ffmpeg a 25 fps).

## Lo que se graba el lunes (15 minutos)

Móvil en vertical, cámara trasera a la altura de los ojos, 1080p o 4K a 30 fps. Luz de
ventana de frente, fondo ordenado, ropa lisa. Dos o tres tomas por plano, con un segundo
de silencio antes y después.

**Con voz, a cámara**

| # | Frase | Para |
|---|---|---|
| G1 | «Si un alumno te pide información a las once de la noche, ¿quién le contesta?» | Ángulo respuesta |
| G2 | «Tu anuncio funciona. Lo que falla es lo que pasa después.» | Ángulo seguimiento |
| G3 | «El anuncio más barato no es el que más matrículas trae.» | Ángulo captación |
| C1 | «Te lo enseño con tu escuela en 15 minutos. Pide el diagnóstico.» | Cierre |

**Sin voz, trabajando (5 s cada uno)**

1. Entra en plano y se sienta frente al portátil.
2. Teclea (plano cerrado de manos).
3. Señala algo en la pantalla.
4. El móvil vibra, lo mira y sonríe.
5. Gira el portátil hacia cámara.
6. En una videollamada, por encima del hombro (pantalla visible o en negro).
7. Camina hacia cámara.

**Transiciones (salen de sus gestos)**

- Mano que tapa el objetivo → aparece la pantalla del sistema.
- Giro rápido del móvil (whip pan) → corte a pantalla.
- Se acerca hasta tapar la cámara → «entramos» en la pantalla.
- Enseña el móvil a cámara → match cut con el WhatsApp de las 23:05.
- Chasquido de dedos → cambio de escena en el golpe de la música.

## Versión A · estilo Veam, sin voz (16 s)

| s | Plano | Rótulo |
|---|---|---|
| 0-2 | Maikel entra y se sienta (plano 1) | **NINGÚN ALUMNO SIN RESPUESTA** · *ni a las 23:04* |
| 2-3,75 | Mano tapa la cámara → pantalla Anuncios | **ATRAEMOS A LOS QUE COMPRAN** · *no a los curiosos* |
| 3,75-5,5 | Móvil que vibra (plano 4) → notificación 23:04 | **23:04** · *pide información* |
| 5,5-7,25 | Enseña el móvil → WhatsApp 23:05 | **23:05** · *ya tiene respuesta* |
| 7,25-8,75 | Llamada del asistente | **9:00** · *la llamamos* |
| 8,75-10,5 | Señala la pantalla (plano 3) → ficha con puntuaciones | **SABE QUIÉN ESTÁ LISTO** · *y por qué* |
| 10,5-12,25 | Aviso «está lista para hablar» | **Y TE AVISA A TI** · *solo cuando hace falta* |
| 12,25-14 | Teclea / videollamada, cortes rápidos con pantallas | **NOSOTROS NOS ENCARGAMOS** · *de todo* |
| 14-16 | Camina hacia cámara (plano 7) | **CAPTA / ENTIENDE / ACTÚA** · qualivo.io |

## Versión B · con su voz (18-20 s)

| s | Plano | Voz | Rótulo |
|---|---|---|---|
| 0-3 | G1 a cámara | «Si un alumno te pide información a las once de la noche, ¿quién le contesta?» | Subtítulos palabra a palabra |
| 3-5 | Chasquido → 23:04 | (música) | **23:04** · *pide información* |
| 5-7 | WhatsApp 23:05 | | **23:05** · *ya tiene respuesta* |
| 7-9 | Llamada 9:00 | | **9:00** · *la llamamos* |
| 9-11 | Ficha | | **SABE QUIÉN ESTÁ LISTO** |
| 11-13 | Aviso | | **Y TE AVISA A TI** |
| 13-17 | C1 a cámara | «Te lo enseño con tu escuela en 15 minutos. Pide el diagnóstico.» | qualivo.io |

Variantes B2 y B3: mismo montaje con G2 (seguimiento) o G3 (captación; el segundo plano
es Anuncios). Con esto cubrimos los dos anuncios de formación acordados con Paid
(respuesta frente a seguimiento) y uno de captación.

## Textos del anuncio

| Versión | Texto principal | Título | Descripción |
|---|---|---|---|
| A y v2 | Un alumno pide información a las 23:04. A las 23:05 ya tiene respuesta. A las 9:00 le llamamos. Y tú solo entras cuando está listo para matricularse. Te lo enseñamos con tu escuela en 15 minutos. | Ningún alumno sin respuesta | Diagnóstico de 15 minutos |
| B1 | ¿Quién contesta a quien pide información de noche o en fin de semana? Si la respuesta es «el lunes», ese alumno ya ha hablado con otra escuela. Lo arreglamos sin contratar a nadie. | Responde en un minuto, también de noche | Diagnóstico de 15 minutos |
| B2 | Tus anuncios traen interesados. Lo que se pierde es lo que pasa después: el que dice «me lo pienso» y nadie vuelve a escribirle. Cada interesado con su siguiente paso, sin que nadie tenga que acordarse. | Tu anuncio funciona. Lo que falla es lo de después | Diagnóstico de 15 minutos |
| B3 | El anuncio que más interesados trae casi nunca es el que más matrículas deja. Unimos cada anuncio con lo que pasa después para invertir en los que venden. | El anuncio más barato no es el que más vende | Diagnóstico de 15 minutos |

Botón: «Solicitar» (formulario). Sin «gratis» ni «gratuito».

## Reglas

- Pantallas: capturas reales de Intelligence; nada que enseñe cómo está montado por dentro.
- Música sin voz generada, o su voz real. Nunca voz sintética.
- Cada versión entra como anuncio nuevo en el mismo conjunto; se deja correr 7 días sin
  tocar y se decide por reuniones presentadas, no por coste por contacto.
