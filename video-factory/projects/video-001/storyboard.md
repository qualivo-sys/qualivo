# Storyboard · video-001 · 34 s · 9:16
> **Los anuncios dentro de ChatGPT van a cambiar la forma de hacer publicidad**
> Estado: `pendiente_de_aprobacion` · 3 planos generados de 8 · 30 creditos

## PLANO 01 · 3s · `rodado`
**Voz:** «El 11 de agosto ChatGPT empezó a probar anuncios. En España todavía no.»
**Visual:** Maikel a cámara, plano medio corto. Sin rótulo todavía: la primera frase entra sola.
**Plano:** medio corto · **Cámara:** fija, ligero temblor de mano · **Luz:** natural

*Rodado, no generado. El gancho lo tiene que decir su cara o no se lo cree nadie.*

## PLANO 02 · 4s · `generado`
**Voz:** «Y no me interesa por lo obvio.»
**Visual:** Plano detalle de un móvil sobre una mesa de oficina con una conversación abierta. Una mano lo desbloquea. No se lee el contenido.
**Plano:** detalle · **Cámara:** slow push in, handheld · **Luz:** luz de ventana lateral
**Referencia:** `oficina`

**Prompt Kling:**
```
Extreme close-up of a phone lying on a cluttered small-office desk, a hand reaching in to pick it up, screen glare hides the content, cinematic documentary style, handheld slow push in, natural window light, muted colour grade, shallow depth of field, 9:16 vertical
```

*Plano de apoyo. Si sale mal, se sustituye por rótulo sobre negro.*

## PLANO 03 · 4s · `rodado`
**Voz:** «Me interesa lo que pasa después del clic.»
**Visual:** Maikel a cámara, un paso más cerrado que el plano 1.
**Plano:** primer plano · **Cámara:** fija · **Luz:** natural

*El salto de encuadre respecto al plano 1 hace de corte.*

## PLANO 04 · 5s · `generado`
**Voz:** «Llevamos veinte años con el mismo camino. Anuncio, página, formulario.»
**Visual:** La dueña sentada delante del ordenador rellenando un formulario largo. Se ve el gesto de bajar y bajar con el ratón.
**Plano:** medio, por encima del hombro · **Cámara:** handheld estático · **Luz:** luz de ventana + pantalla
**Referencia:** `duena`

**Prompt Kling:**
```
Over-the-shoulder shot of a woman in her forties at a desktop computer in a small cluttered office, filling in a long web form, scrolling down repeatedly, tired but ordinary expression, cinematic documentary style, handheld, natural window light mixed with screen light, muted colour grade, 9:16 vertical
```

*Debe usar references/duena.png como start_image.*

## PLANO 05 · 4s · `generado`
**Voz:** «Y alguien que te llama a los tres días.»
**Visual:** Teléfono fijo de oficina sonando. Nadie lo coge. La silla al lado está vacía.
**Plano:** detalle · **Cámara:** fija · **Luz:** luz de tarde, más apagada
**Referencia:** `oficina`

**Prompt Kling:**
```
A desk phone ringing in an empty small office, nobody answers, empty chair beside it, late afternoon light, cinematic documentary style, static handheld, muted colour grade, shallow depth of field, 9:16 vertical
```

*Este plano hace el chiste sin decirlo. Es el que más gana con imagen generada.*

## PLANO 06 · 5s · `rodado`
**Voz:** «Ahora el anuncio puede llevarte a una conversación. Sin página y sin cuatro campos.»
**Visual:** Maikel a cámara. Rótulo: ANUNCIO → CONVERSACIÓN.
**Plano:** medio · **Cámara:** fija · **Luz:** natural

*Rótulo generado con Chromium, no con Kling.*

## PLANO 07 · 5s · `rodado`
**Voz:** «Alguien busca una asesoría para las nóminas de treinta personas. Lo cuenta, y sale con tres nombres.»
**Visual:** Maikel a cámara. Rótulo con la frase entre comillas.
**Plano:** primer plano · **Cámara:** fija · **Luz:** natural

*El ejemplo tiene que salir de su boca. Generado pierde credibilidad.*

## PLANO 08 · 4s · `rodado`
**Voz:** «El que gana no es el que tenga la web más bonita. Es el que haya dejado claro para quién trabaja.»
**Visual:** Maikel a cámara. Tarjeta de cierre con maikelechevarria.com.
**Plano:** medio · **Cámara:** fija · **Luz:** natural

*Sin llamada a la acción dura. Cierra en idea.*

---

## Riesgos
- El plano 4 necesita que la imagen de referencia de la dueña sea buena. Si no, se cae y se sustituye por un plano de las manos, que es más fácil de acertar.
- Kling sale a 24 fps y el material rodado a 30. Hay que igualar antes de concatenar.
- El vídeo mezcla planos rodados y generados: si el color no se iguala, se nota el pegote. Aplicar la misma corrección a los dos.

## Hechos verificados que sostienen el guion
- El 11 de agosto de 2026 OpenAI amplió sus pruebas de anuncios en ChatGPT a Reino Unido, México, Brasil, Japón y Corea del Sur. España no está incluida.
  <https://openai.com/index/testing-ads-in-chatgpt/>
- Los anuncios solo se muestran a usuarios de los planes gratuito y Go. Plus, Pro, Business, Enterprise y Educación no los ven.
  <https://openai.com/index/testing-ads-in-chatgpt/>
