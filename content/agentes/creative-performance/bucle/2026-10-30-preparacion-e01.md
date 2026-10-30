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
Por impresión, QV_11-nolose abre el formulario el doble que QV_11 [C]. El gancho que nombra la duda del cliente («no sé») funciona mejor que el que afirma.

**Hipótesis:** para E-01 conviene un gancho que diga la objeción en voz alta, no uno que prometa resultados.

## Ganchos candidatos
Cada uno queda pendiente de casarlo con una objeción literal de Growth.

| # | Objeción probable (por confirmar a las 11:00) | Gancho, en pantalla y en los 3 primeros segundos | Por qué |
|---|---|---|---|
| 1 | «Ya probé anuncios y solo llegan curiosos» | «¿Tus anuncios te traen alumnos… o preguntas?» | Nombra el dolor; enlaza con el filtro del formulario |
| 2 | «Las agencias solo me hablan de clics» | «Tu agencia te enseña clics. ¿Cuántas matrículas?» | Ataca la métrica equivocada; la propuesta es conectar captación y ventas |
| 3 | «No sé cuánto invertir» | «¿No sabes cuánto invertir en anuncios? Empieza por saber cuánto te deja un alumno.» | Replica el «no sé» que ganó en E-02 |
| 4 | «Me llegan leads, pero no cierro» | «El problema no son los leads. Es lo que pasa después.» | Va directo a la mitad de ventas de la propuesta |
| 5 | «Es caro» o «no es para mí» | «Este formulario descarta a quien no invierte 500 € al mes. A propósito.» | Da la vuelta al filtro: exclusividad y auto-selección |
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
4. **«¿No sabes cuánto invertir en anuncios?»** (candidato 3): el «no sé», que ya ganó en E-02.

Se descartan el 1 («¿alumnos o preguntas?»), que queda absorbido por el nuevo 1, y el 6, que solapa con el 3.

A las 15:00 cada uno de los 4 tiene que casar con una objeción **literal** de Growth. Se quedan los 3 que casen. Si una objeción no casa con ninguno, se escribe un gancho nuevo para ella.

### Formato, a partir de lo que aguanta
- **Vídeo 9:16:** el nicho y el gancho en texto, en el segundo 0.
- **Imagen 4:5:** texto largo en el cuerpo del anuncio, como Ted Gravlin (317 días). Retrato del dueño de academia que vende y da clase a la vez.
