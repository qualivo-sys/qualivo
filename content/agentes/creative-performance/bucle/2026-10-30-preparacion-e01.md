# Bucle de los viernes · E-01 · preparación de Creative · 30-oct-2026

Base: el diagnóstico de Paid (`paid/bucle/2026-10-30-diagnostico.md`, rama `claude/qualivo-paid`). El bucle salta porque cada apto cuesta ~86 € y la referencia es 65 €. El problema es el **gancho**: la oferta y el formulario con filtro de dinero no se tocan.

Este archivo es un borrador previo. Los ganchos se cierran a las 15:00 (Madrid), cuando tenga:
- las **objeciones literales de Growth** (11:00);
- los anuncios con más de 30 días activos de la **Biblioteca de anuncios** (Paid, antes de las 12:00 UTC).

## Lo que no se mueve
- Oferta: diagnóstico gratis más el mismo formulario con filtro de inversión de 500 €/mes o más.
- Rótulo: «sus clientes pagan 500 € o más».
- Formatos: 9:16 y 4:5.
- Propuesta de valor: Qualivo entra en todo el proceso de captación y lo conecta con el de ventas para que lleguen leads cualificados y se cierren más.
- Sin casos de clientes y sin cifras sin fuente.

## Pista de E-02
**No hay ganador en E-02.** QV_11-nolose lleva 8 € gastados, 3 aperturas del formulario y 0 leads. QV_11 lleva 38 €, 5 aperturas y 0 leads [C, Meta, 30-oct]. Lo único que hay es una señal con una muestra muy pequeña: un 0,96 % de aperturas por impresión frente a un 0,47 %.

**Hipótesis, no resultado:** el gancho que dice en voz alta la duda del cliente («no sé») atrae a más gente que abre el formulario.

## Ganchos candidatos
Cada uno queda pendiente de casarlo con una objeción literal de Growth.

| # | Objeción probable (por confirmar a las 11:00) | Gancho, en pantalla y en los 3 primeros segundos | Por qué |
|---|---|---|---|
| 1 | «Ya probé anuncios y solo llegan curiosos» | «¿Tus anuncios te traen alumnos… o preguntas?» | Nombra el dolor; enlaza con el filtro del formulario |
| 2 | «Las agencias solo me hablan de clics» | «Tu agencia te enseña clics. ¿Cuántas matrículas?» | Ataca la métrica equivocada; la propuesta es conectar captación y ventas |
| 3 | «No sé cuánto invertir» | «¿No sabes cuánto invertir en anuncios? Empieza por saber cuánto te deja un alumno.» | Prueba la hipótesis del «no sé» de E-02 (señal, no resultado) |
| 4 | «Me llegan leads, pero no cierro» | «El problema no son los leads. Es lo que pasa después.» | Va directo a la mitad de ventas de la propuesta |
| 5 | «Es caro» o «no es para mí» | «Preguntamos cuánto inviertes antes de llamarte.» (antes ponía «el formulario descarta», que es falso: el filtro se aplica en la cualificación) | Da la vuelta al filtro: exclusividad y auto-selección |
| 6 | «No tengo tiempo para atender leads» | «Si respondes a los leads cuando puedes, ya los has perdido.» | Velocidad de respuesta, sin cifra inventada |

## Formato propuesto para los 3 finales
- **9:16 (vídeo):** gancho con texto grande en el segundo 0, sin logo al principio. Luego 3 planos de «qué pasa después» (formulario → filtro → llamada), cierre con «diagnóstico gratis» y el rótulo de 500 €.
- **4:5 (estático):** el gancho como titular a sangre, la objeción entre comillas y un CTA único.
- Sin caras de clientes ni testimonios.

## Por hacer, a las 13:00 y a las 15:00
- [ ] 13:00 · cruzar la Biblioteca (>30 días): patrón de gancho, formato y oferta.
- [ ] 15:00 · elegir 3 de estos 6 (o nuevos) y atar cada uno a una objeción **literal**.
- [ ] Lunes 10:00 · piezas listas. Se lanzan solo con el OK de Maikel en el chat de Paid.

---

## Corte de la Biblioteca de anuncios (adelantado: los datos llegaron a las 07:15 UTC)
Fuente: `content/research/2026-11-competidores/biblioteca-anuncios-paid.md`, rama `claude/qualivo-paid`, commit 1c2aa462. Son 13 anunciantes de España y 8 de Estados Unidos, todos con más de 30 días activos.

### Qué copiamos de lo que aguanta 100 días o más, y qué no
| Patrón | ¿Para E-01? | Cómo |
|---|---|---|
| 2 · **Lead frente a cliente** («no te vendemos leads, te reservamos citas») | **Sí, el más fuerte** | Es nuestra propuesta de valor. Lo usan The Kim Bros (263 días), DOCMEDIA y Pymes World. En formación: «No te traemos leads. Te traemos alumnos que pueden pagar.» |
| 3 · **El seguimiento como causa de la pérdida** (MediSimple, 72 días) | **Sí** | Encaja con los candidatos 4 y 6 y con «conectar captación y ventas». |
| 4 · **Un gancho por nicho** (Venus Consulting, 127 días) | **Sí, ya lo tenemos** | E-01 ya es solo para formación. Hay que nombrar el nicho en el segundo 0: «Si tienes una academia o una formación…». |
| 1 · **Resultado con plazo** («en 30 días», «agenda llena en 14 días») | **No, de momento** | Sin cifra con fuente no podemos prometer ningún plazo, y no hay casos de clientes. Se puede usar el plazo del proceso, no del resultado. Por ejemplo: «En 30 minutos de diagnóstico te digo dónde se te escapan los alumnos.» (confirmar la duración real del diagnóstico) |
| 5 · **Exclusividad por zona** | No encaja | La formación online no tiene zona. Lo más parecido es el filtro de 500 €, que da la exclusividad por inversión (candidato 5). |
| 6 · **Embudo con landing o VSL; nadie usa formulario nativo** | Para Paid, no para el gancho | El formulario está congelado en este bucle. Lo apunto como test aparte: formulario nativo frente a landing. Ya ha dado 1 cliente de 3.600 € con 5 envíos, así que no se toca ahora. |

### Candidatos que pasan a las 15:00 (antes de las objeciones de Growth)
1. **«No te traemos leads. Te traemos alumnos que pueden pagar.»**: patrón 2, junto con el filtro de 500 €. Sustituye al candidato 5.
2. **«Tu agencia te enseña clics. ¿Cuántas matrículas?»** (candidato 2): anti-agencia, como Yoann y Luna (122 días).
3. **«El problema no son los leads. Es lo que pasa después.»** (candidato 4): patrón 3, seguimiento.
4. **«¿No sabes cuánto invertir en anuncios?»** (candidato 3): prueba la hipótesis del «no sé». En E-02 solo hay una señal, no un ganador.

Se descartan el 1 («¿alumnos o preguntas?»), que queda absorbido por el nuevo 1, y el 6, que solapa con el 3.

A las 15:00 cada uno de los 4 tiene que casar con una objeción **literal** de Growth. Se quedan los 3 que casen. Si una objeción no casa con ninguno, se escribe un gancho nuevo para ella.

### Formato, a partir de lo que aguanta
- **Vídeo 9:16:** el nicho y el gancho en texto, en el segundo 0.
- **Imagen 4:5:** texto largo en el cuerpo del anuncio, como Ted Gravlin (317 días). Retrato del dueño de academia que vende y da clase a la vez.

### Paso 3 · ángulos que NO usa nadie de los 21 (13:00)
| Hueco | Por qué es nuestro | Riesgo |
|---|---|---|
| **El filtro a la vista** («preguntamos cuánto inviertes antes de llamarte») | Ninguno enseña su filtro; todos prometen volumen o calidad en abstracto. Nosotros sí filtramos, y está en el formulario de E-01. | Puede bajar el volumen. Es lo que buscamos: se mide en coste por apto, no por lead. |
| **La fuga entre el lead y la venta, contada desde la venta** | MediSimple habla de seguimiento, pero solo en clínicas y desde la captación. Ninguno habla de conectar la captación con el comercial ni de «lo que pasa después». | Abstracto: tiene que llevar una imagen concreta (un lead sin llamar, un CRM vacío). |
| **Formación como nicho** | Venus Consulting hace nichos, pero ninguno de los 21 se dirige a academias ni a formación. | Ninguno. |
| **La duda dicha en voz alta** («no sé cuánto invertir») | Todos afirman; nadie pregunta con la objeción del cliente. | Solo es una señal en E-02 (hipótesis, no resultado). |

Lo que sí usa todo el mundo, y se evita: «leads cualificados» como promesa genérica, «más de X clientes» como autoridad (no tenemos cifra con fuente) y resultados con plazo.

**Formatos:** el vídeo es mayoría en los que aguantan más tiempo (15 de 21) [C, contado en la tabla de Paid]. La imagen con texto largo es la que más días aguanta: 317 días, Ted Gravlin [C].

**Estado a las 13:00:** las objeciones literales de Growth (11:00) todavía no están en ningún archivo del repositorio. Las pido por Paid. Sin ellas, a las 15:00 los ganchos se atan a objeciones **probables**, marcadas [E].

---

## Paso 4 · los 3 ángulos (propuesta de Creative para cerrar con Paid a las 15:00)

**Fuente de las objeciones:** respuestas de los formularios nativos de Meta del 15-sep al 30-oct, leídas por API por Paid el 30-oct [C]. Son **opciones de respuesta del formulario, no frases literales de conversación**. Growth no ha enviado las suyas.

| Pregunta del formulario | Respuestas [C] |
|---|---|
| ¿Dónde se te escapan los clientes? | «no lo sé» 13 · seguimiento 12 · anuncios 7 · tardo en contestar 4 |
| Dolor principal | llegan pero no compran 3 · no entran 1 · no son mi perfil 1 · no lo sé 1 |
| Inversión en anuncios | menos de 500 € 16 · nada 8 · 500 € o más 15 |

La oferta (diagnóstico gratis), el formulario y el rótulo «sus clientes pagan 500 € o más» no cambian.

### A · «No sabes dónde se te escapan» (la fuga que no se ve)
- **Objeción:** «no lo sé», 13 respuestas, la primera [C].
- **Hueco:** la duda dicha en voz alta; nadie de los 21 pregunta.
- **Valor:** el diagnóstico te enseña en qué punto, entre el anuncio y la venta, se pierde el alumno.
- **Gancho, segundo 0:** «Tienes una formación. Te entran contactos. Y no sabes en qué punto se te escapan.»
- **9:16:**
  1. Texto grande sobre un plano de un móvil con notificaciones de leads.
  2. Tres pasos que se iluminan: anuncio → formulario → llamada → matrícula, con un hueco rojo que va cambiando de sitio.
  3. «En el diagnóstico te digo dónde está el tuyo.»
  4. Cierre con el rótulo de 500 € y «Diagnóstico gratis».
- **4:5:** titular «¿Dónde se te escapan los alumnos? Si la respuesta es "no lo sé", empieza por ahí.» Debajo, un embudo dibujado con 4 tramos y un interrogante en uno.

### B · «El problema no son los leads. Es lo que pasa después.» (seguimiento)
- **Objeción:** seguimiento, 12 respuestas, más «tardo en contestar», 4 [C].
- **Hueco:** la pérdida contada desde la venta. Solo MediSimple toca el seguimiento, y lo hace en clínicas.
- **Valor:** Qualivo conecta la captación con las ventas.
- **Gancho, segundo 0:** «El problema no son los leads. Es lo que pasa después.»
- **9:16:**
  1. Un lead entra a las 10:14 y el reloj corre: nadie llama, el WhatsApp sale «visto», y el mismo contacto aparece después en otra academia (plano simbólico, sin marcas).
  2. «Conectamos tus anuncios con tu equipo de ventas para que ningún contacto se quede esperando.»
  3. Cierre con el rótulo y el diagnóstico.
- **4:5:** dos columnas, «Lo que te venden: leads» frente a «Lo que necesitas: que alguien los llame a tiempo y los cierre». Va en la línea de los anuncios que aguantan con «leads no, citas o clientes».
- Sin cifra de minutos o de porcentaje de pérdida: no hay fuente.

### C · «Llegan, pero no compran», enseñando el filtro (conversión)
- **Objeción:** «llegan pero no compran», 3 respuestas, el dolor principal más repetido [C].
- **Hueco:** enseñar el filtro; nadie de los 21 lo hace.
- **Valor:** llegan leads cualificados y se cierran más.
- **Gancho, segundo 0:** «Si te llegan contactos pero no compran, el problema empieza antes del primer mensaje.»
- **9:16:**
  1. Un formulario en pantalla con la pregunta «¿Cuánto inviertes en anuncios?» resaltada.
  2. «Preguntamos cuánto inviertes antes de llamarte.»
  3. «Solo hablamos con quien puede invertir. Por eso hablamos con menos gente, y mejor.» No se dice que «compran más»: sería una promesa sin cifra.
  4. Cierre con el rótulo.
- **4:5:** el formulario a sangre, con el filtro marcado y el titular «Más de la mitad no pasa nuestro filtro. A propósito.»
  - El formulario NO descarta a nadie: todos entran en GHL y el filtro se aplica después, en la cualificación.
  - Fuente de «más de la mitad»: 24 de 40 respuestas válidas (60 %) invierten menos de 500 € o nada. Son todos los formularios del 15-sep al 30-oct, no solo E-01, y sin contar los 2 leads de prueba [C, Paid].

### Riesgos e hipótesis, para la fila de la base de hipótesis
- **A:** hipótesis: nombrar el «no sé» sube el CTR de enlace frente al vídeo actual. Riesgo: si atrae a curiosos, el filtro los corta igualmente.
- **B:** hipótesis: el seguimiento es el dolor más concreto y atrae a quien ya invierte. Mide el coste por apto.
- **C:** hipótesis: enseñar el filtro baja el volumen y sube el porcentaje de aptos. Mide el porcentaje de aptos sobre envíos (hoy, 2 de 5 [C]).
- **Para los tres:** el mismo formulario, el mismo presupuesto y sin casos de clientes. Lanzamiento el lunes, solo con el OK de Maikel.
