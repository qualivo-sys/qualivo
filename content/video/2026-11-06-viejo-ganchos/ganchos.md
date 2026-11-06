# Anuncio viejo de formación · 3 ganchos nuevos (bucle del viernes 6-nov)

- **Encargo:** de Paid, proceso P1 (`paid/bucle/2026-11-06-diagnostico.md`).
- **Qué se cambia:** solo los primeros 5,7 s, que son la tarjeta del gancho y su voz, y el texto del anuncio.
- **Qué se queda igual:** el resto del vídeo (cuerpo, voz y música) y el formulario.
- **Estado:** borrador hecho el 6-nov por la mañana. Se ajusta con las objeciones literales que trae Growth a las 11:00. Las piezas definitivas se entregan el lunes a las 10:00.
- **Lanzamiento:** necesita el OK de Maikel porque es un anuncio nuevo de ~10 €/día. No se lanza nada sin él.

**Vídeo base:**
- Es el anuncio viejo de formación (anuncio 120246158348220358, creativo 4544689645776556): la serie «sistema» de septiembre, versión formación, de 70 s, con la escena en `../2026-09-17-sistema/escena-formacion*.html`. Paid lo confirmó por la API de Meta el 6-nov: «QV_3V_formacion_Sep26» (9:16) y «QV_3V_formacion_45_Sep26» (4:5), los dos de 69,8 s [C].
- **Voz:** Javier Rojas, ElevenLabs multilingual v2, la misma del original. Comprobado por similitud espectral con la locución original: 0,96 frente a 0,83 de la otra voz de Javier.
- **Música:** musica-lofi-b, comprobada por correlación con la mezcla (0,98).
- **Volumen:** el gancho queda a -15,6 / -16 LUFS, como el original.

**Reglas:**
- Sin casos de clientes.
- Sin «siete agentes» ni «IA» en el gancho.
- Sin cifras sin fuente.

**Propuesta de valor:** Qualivo entra en todo el proceso de captación y lo conecta con ventas, para que lleguen leads cualificados y se cierren más.

## Los 3 ganchos

| | Tarjeta (pantalla) | Voz (≤ 5 s) | Objeción que responde | Patrón que aguanta en la Biblioteca (6-nov) |
|---|---|---|---|---|
| **G1** | ¿SABES QUÉ ANUNCIO TE TRAE **ALUMNOS?**<br>*Y cuál solo te trae formularios. Mira lo que montamos dentro de una academia.* | «¿Sabes qué anuncio te trae alumnos… y cuál solo te trae formularios?» (4,3 s) | «No lo sé, eso es lo que quiero averiguar»: la respuesta más repetida del formulario, 23 de 56 [C, Growth]. También «Lo que necesito es… que los que entran se apunten» | Métrica de negocio: «por instalación cerrada, no por lead» (Cronuts, 35 días) |
| **G2** | TE PIDEN INFORMACIÓN. **Y NO SE MATRICULAN.**<br>*Mira dónde se pierde cada solicitud, del anuncio a la matrícula.* | «Te piden información del curso… y no se matriculan. Mira dónde se pierden.» (5,0 s) | «Lo que necesito es que entren más, o que los que entran se apunten todos» [C, Growth, 28-oct] | Dolor de después del lead: Mejores Franquicias (190 días), MediSimple (79), Sellebrate (63) |
| **G3** | ¿TU ACADEMIA YA INVIERTE **EN ANUNCIOS?**<br>*Mira lo que pasa con cada solicitud después del clic.* | «Si tu academia ya invierte en anuncios, mira lo que pasa con cada solicitud.» (4,7 s) | «No sé cuánto valen vuestros servicios… no quiero hacer perder el tiempo a nadie», y el lead de ticket bajo que no avanza [C, Growth]. El filtro se dice antes del clic | Filtro en el anuncio: Scaling Digitals («que ya invierten», 34 días), Webpositer (50) |

**Reserva (G4, sin hacer):** «Ya tengo a alguien con los anuncios.» → «Perfecto: nosotros conectamos lo que viene después.» Responde a la objeción «eso ya lo tengo» [C, Growth]. Entra si Growth la ve más fuerte que alguna de las tres.

**G3 y el filtro:** dice «ya invierte en anuncios» sin cifra. El umbral (500 € o «ya invierte») lo decide Maikel, y no se toca sin él.

## Texto del anuncio (uno por gancho)

**G1 · Texto principal:**
¿Sabes qué anuncio te trae alumnos… y cuál solo te trae formularios? Si la respuesta es «no lo sé», es la más repetida en nuestro formulario. En Qualivo montamos todo el recorrido de captación (anuncio, formulario, primera respuesta, seguimiento y reserva de la llamada) y lo conectamos con tu equipo de admisiones, para que veas qué anuncio acaba en matrícula. Diagnóstico gratuito de 30 minutos.

**G2 · Texto principal:**
Te piden información del curso… y no se matriculan. La pregunta no es cuántas solicitudes entran, sino cuántas acaban en matrícula. Mira lo que montamos dentro de una academia: cada solicitud entra ordenada en tu CRM, recibe respuesta en minutos, la llama una voz si no contesta y coge hora con admisiones. Y tú ves qué anuncio trae matrículas. Diagnóstico gratuito de 30 minutos.

**G3 · Texto principal:**
Si tu academia ya invierte en anuncios, esto es para ti. Mira lo que pasa con cada solicitud después del clic: entra ordenada en tu CRM, recibe respuesta en minutos, una voz la llama si no contesta y coge hora con admisiones. Conectamos la captación con tu equipo para que lleguen solicitudes cualificadas y se matriculen más. Diagnóstico gratuito de 30 minutos.

**Titular (los tres):** Del anuncio a la matrícula, conectado.
**Descripción (los tres):** Diagnóstico gratuito de 30 minutos.

**Duración del diagnóstico:** 30 minutos, confirmado por Paid el 6-nov: es lo que dice la página de reserva.

## Cómo medimos

- **Etapa del gancho:** vistas a 3 s y CTR al formulario, contra el anuncio viejo.
- **Etapa de negocio:** aptos y coste por apto, con el mismo formulario.
- **Regla:** no se juzga antes de unos 70 € por gancho (10 €/día durante una semana) [E].

## Avisos

- El cuerpo del vídeo viejo, que no se toca, dice «siete agentes» en el cierre: tarjeta final y última frase. Choca con la regla 16, pero es el anuncio ganador y el encargo es cambiar solo el gancho. Si Maikel quiere, se cambia la tarjeta final en otra ronda.
- Archivos:
  - `salida/viejo-g{1,2,3}-916.mp4` y `-45.mp4`, de 69,8 s, la misma duración que el original;
  - escenas en `escena-gancho*.html` (`#g1`, `#g2`, `#g3`);
  - montaje en `montar.py`.
