# Tres anuncios IA · 30-sep-2026

Tres anuncios verticales (9:16) sin Maikel a cámara, cada uno sobre un dolor distinto. Voz de
Javier (clon) en una sola toma, música deep house del catálogo de HeyGen (comprobar licencia
antes de pautar), planos generados con Kling y pantallas reales de Qualivo Intelligence.

| Archivo | Dolor | Duración |
| --- | --- | --- |
| `01_Qualivo_Velocidad_9x16.mp4` | Contestar tarde: el alumno ya ha hablado con otro centro | 34 s |
| `02_Qualivo_Plantones_9x16.mp4` | Citas que no se presentan y nadie recupera | 43 s |
| `03_Qualivo_Curiosos_9x16.mp4` | Leads baratos que no compran | 35 s |

Los MP4 no se suben al repo (repo público y pesados); se regeneran con
`herramientas/video-plantilla/anuncios3_build.py velocidad:b plantones:c curiosos:b`.
Las portadas para Instagram están en esta carpeta.

Todos terminan con el filtro de calidad: «¿Tu centro ya invierte en anuncios?». No citan
resultados de clientes (regla editorial) y no mencionan la garantía.

## Locuciones

**01 · Velocidad**
Te pidió información un domingo a las once de la noche. Tú le contestaste el lunes a las diez.
Para entonces, ya había hablado con otros dos centros. No perdiste a ese alumno por el precio.
Lo perdiste por llegar tarde. Con Qualivo, cada persona que pide información recibe respuesta en
minutos, con sus palabras, también de noche y en fin de semana. Si no contesta, el sistema le
vuelve a escribir, y le llama. Y cuando está listo para hablar, te lo pasamos, con la cita ya en tu
agenda. Si tu centro ya invierte en anuncios, te enseñamos en treinta minutos cuántos alumnos se
te enfrían por el camino.

**02 · Plantones**
Diez personas reservaron una llamada contigo esta semana. Se presentaron cuatro. Preparaste seis
reuniones para nadie. Y lo peor: pagaste por esos seis leads, y nadie volvió a escribirles. Con
Qualivo, la cita se confirma el día antes, el recordatorio le cuenta lo que vais a ver, y si a la
hora no ha entrado, le llamamos. Y quien falta recibe esa misma mañana una hora nueva. Tu agenda se
llena de gente que viene de verdad. Si tu centro ya invierte en anuncios, te enseñamos en treinta
minutos cuántas citas se te caen, y cómo recuperarlas.

**03 · Curiosos**
Tu anuncio te trae leads a cinco euros. Parece una ganga. Hasta que les llamas: uno solo quería
mirar, otro no tiene presupuesto, y otro ni recuerda haberlo pedido. Un lead barato que no compra
es el más caro de todos. Nosotros filtramos antes de que hables con nadie: preguntas que detectan
quién quiere empezar, cuándo, y cómo lo va a pagar. Y le enseñamos a Meta quién se matricula de
verdad, no quién rellena un formulario. Así sabes qué anuncio te trae alumnos, no solo
interesados. Si tu centro ya invierte en anuncios, te enseñamos en treinta minutos cuánto te
cuesta de verdad cada alumno.

## Si Maikel quiere poner su voz

Grabar el mismo texto de corrido (móvil, habitación sin eco, a medio metro). El montador
transcribe la toma, encuentra dónde empieza cada frase y reajusta todas las escenas solo: basta con
dejar el audio en `voz-ads/<nombre>-m.mp3`, transcribirlo con marcas por palabra a `voz-ads/<nombre>-m.json`
(faster-whisper, igual que las tomas de IA) y lanzar `anuncios3_build.py <nombre>:m`.

## Cómo probarlos

Semana 1 del plan de octubre: mismo conjunto, mismo formulario y mismo presupuesto; se decide por
coste por lead A o B, no por coste por lead. Los ganchos y textos principales para Meta están en
`content/guiones/2026-09-30-guiones-maikel.md`.
