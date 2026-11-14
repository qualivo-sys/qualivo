# Cliente ideal · borrador para la sesión del 15-oct (9:00-11:00)

> **Base:** la estrategia del mes (`content/estrategia/2026-10-estrategia-icp-inversores-que-no-convierten.md`). Este archivo añade **el contraste con datos** y deja las decisiones listas para cerrarlas en la sesión.
>
> **Fuentes:** `casos/` (publicados), `bus/out/demand.jsonl` (dailies de Growth) y `api/_scoring.js` y `api/_funnel-v2.js` (código).
>
> **Repo público.** Los leads con trato abierto van con un código, nunca con su nombre (R5). Lo que no está en el repo se marca **«a confirmar con Maikel»**.

## 1. Contraste con datos

### 1.1 Los clientes que más han pagado

| Cliente | Sector | Inversión en captación | Ticket | Equipo que atiende | Volumen | El problema era… | Fuente |
|---|---|---|---|---|---|---|---|
| **EAC** | Formación (aviación) | Unos 4.300 € en el mes del caso (44.000 € atribuidos ÷ 10,2 de ROAS; cálculo propio) | Unos 4.400 € por matrícula (44.000 € ÷ 10 matrículas; cálculo propio) | Sí: «lead → entrevista → matrícula» | 573 oportunidades en el CRM en el mes | Medir del anuncio a la matrícula y repartir la inversión por curso | `/casos/eac/` |
| **Nuria Roure** | Formación y servicios online (sueño) | 2.000 € (periodo **a confirmar**) | **A confirmar** | Sí: llamadas (Ringover) | **A confirmar** | «No era conseguir más leads. Era saber cuáles merecían atención»: lead scoring y seguimiento | `/casos/nuria-roure/` |
| **BelloVinilo** | B2B, reformas y revestimientos | 3.600 € en total; «1.200 €» al mes según Maikel (14-oct), **periodo a confirmar** | **A confirmar** (reformas, ticket alto) | **A confirmar** | **A confirmar** | «No había un funnel que arreglar. Había que crearlo todo» | `/casos/bellovinilo/` |
| **Leva** | **A confirmar** | **A confirmar** | **A confirmar** | **A confirmar** | **A confirmar** | Maikel, 14-oct: «aunque ahora tengamos estos problemas con ellos» | No está en el repo |
| **Focus Practical** (contraejemplo de ticket) | Formación de oficios | Campañas de unos cientos de euros (264 € en el reel REBT) | 260-1.099 € por curso | **A confirmar** | Volumen alto a CPL de unos 3 € | Coste por lead bajo | `/casos/focus-practical/` |

### 1.2 Leads de referencia de octubre (con código)

| Código | Sector | Cómo entró | Nivel | Qué pasó | Fuente |
|---|---|---|---|---|---|
| **R-01** | Comercio con varias tiendas | Formulario nativo del funnel v2 (primer lead v2, 8-oct) | A | Reunión el 14-oct (44 min). Quiere un plan de captación por tienda. Se le envía hoy | Daily del 9 y del 14-oct |
| **R-02** | Clínica (salud y estética) | Formulario de Meta | A | Reunión el 6-oct. Oferta enviada. Siguiente llamada el 13-oct | Daily del 6-oct |
| **C-01** | App o servicio digital | Formulario de Meta | C | Reunión el 14-oct (40 min). Propuesta enviada. **Objeción: quiere pagar por resultados** | Daily del 14-oct |

**R-01 y R-02** son los dos «leads de referencia» a los que se mandó el evento Qualified a Meta el 14-oct.

### 1.3 Lo que tienen en común (y lo que no cuadra)

1. **Invertían o estaban dispuestos a invertir más de 1.000-2.000 € al mes.** Se sabe en EAC, Nuria y BelloVinilo.
2. **El dinero de cada venta da para pagarnos.** EAC sale a unos 4.400 € por matrícula. En los demás, el ticket hay que confirmarlo. Focus Practical, con cursos de 260-1.099 €, es el contraejemplo: el problema era el coste por lead, no la conversión.
3. **Había alguien atendiendo a los interesados.** Entrevistas en EAC, llamadas en Nuria.
4. **El dolor estaba después del lead.** Nuria y EAC lo cumplen. **BelloVinilo no:** se construyó desde cero. El ICP también puede ser «invierte y no tiene sistema». Lo decides tú.
5. **El contraejemplo de octubre:** el C que pide pagar por resultados. Es una señal de capacidad o de confianza baja, y encaja con su nivel C.

**Para cerrar en la sesión:** el ticket de Nuria y de BelloVinilo, los datos de Leva y quién **no** pagó o se fue, para poder contrastar.

## 2. El perfil

**En una frase:** empresas que ya pagan por captar (1.000-2.000 € al mes o más), tienen a alguien atendiendo a los interesados y venden algo que vale lo bastante como para que una venta más pague el servicio, pero convierten poco lo que les llega.

**Tres criterios medibles. Encaja si cumple dos de tres:**
1. **Inversión en anuncios:** 1.000 € al mes o más. Mejor si son 2.000 € o más.
2. **Alguien atiende a los interesados:** una persona dedicada o un equipo comercial.
3. **Volumen o ticket:** 50 solicitudes al mes o más, o ticket de 1.000 € o más.

## 3. El formulario: lo que ya cubre y lo que falta

| Criterio | ¿Lo pregunta hoy el formulario v2? | Qué hacer |
|---|---|---|
| Volumen | Sí: «solicitudes al mes», en 5 tramos | Nada |
| Ticket | Sí: «cuánto paga de media un cliente», en 4 tramos. Solo deja marca, no entra en la nota | Que entre en la tipología (Growth) |
| Inversión en anuncios | **No** | Pregunta nueva: menos de 1.000 €, 1.000-3.000 €, 3.000-10.000 €, más de 10.000 € |
| Equipo que atiende | **No** | Pregunta nueva: yo, una persona, un equipo comercial, una agencia o call center |

**Hallazgo del Master Reviewer (15-oct).** Sin la pregunta de inversión, la parte de capacidad de la nota suma siempre 2. La tipología de un contacto v2 llega como mucho a 7, así que **ningún contacto v2 puede ser A directa por encaje alto** (hace falta ≥9). Es la razón técnica para añadir la pregunta.

**Dónde:** en la landing nueva del ICP (L3) y en el conjunto de anuncios nuevo. En formación, cuando acabe el test v2.1.

## 4. El anuncio: dos opciones

| | **A · Conjunto aparte multisector** (recomendada) | B · Abrir el de formación |
|---|---|---|
| Qué es | Un conjunto nuevo con los ángulos «la cuenta» y «el comercial quemado», dirigido a la landing del ICP, a unos 15 €/día | Ampliar la audiencia y el mensaje del conjunto de formación |
| Test de formación v2.1 | Intacto | **Se rompe:** no se sabría si cambia por la landing o por la audiencia |
| Qué aprendemos | Si el ICP multisector trae leads que encajan y a qué coste | Poco, mezclado |
| Riesgo | Presupuesto extra | Perder la lectura del test del 26-oct |

**Recomendación: A**, desde la semana 43. Lo monta Creative Performance con Paid.

**En Meta no se puede segmentar a «empresas que ya anuncian».** El filtro es el mensaje: «Ya tienes anuncios y comerciales, pero los leads no compran» descarta solo a quien empieza de cero.

## 5. Mensaje en la home y la landing

- **Home:** el H1 se queda. Debajo, una línea que nombre al ICP: «Para empresas que ya invierten en captación y tienen a alguien atendiendo a los interesados». La decides tú.
- **Landing del ICP (L3):**
  - **Titular:** «Inviertes 2.000 € al mes en anuncios. ¿Cuántas ventas te traen?»
  - **Bajada:** «Tus anuncios ya funcionan. Lo que falla es lo que pasa después del clic.»
- **Formación:** no se toca mientras dure el test.

## 6. Criterios para la lista de prospección

1. **Biblioteca de anuncios de Meta:** España, anuncios activos desde hace más de 30 días y 3 o más anuncios activos a la vez (señal de inversión sostenida).
2. **Sector:** formación, reformas y construcción, clínicas, inmobiliarias, lanzamientos e infoproducto, y servicios B2B.
3. **El anuncio lleva a un formulario o una landing** (genera leads), no a una tienda online.
4. **Equipo:** se ven comerciales o setters en LinkedIn, o publican ofertas de empleo comercial.
5. **Tamaño:** de 5 a 50 personas.
6. **Contacto:** el dueño y el director comercial, uno a uno por LinkedIn. Sin correo en frío (regla vigente).

## 7. Lo que sale de la sesión

- [ ] Perfil y criterios cerrados (sección 2), con el caso BelloVinilo decidido («sin sistema» ¿entra o no?)
- [ ] Los datos que faltan de la tabla 1.1 (ticket de Nuria y BelloVinilo, Leva, quién no pagó)
- [ ] Preguntas nuevas del formulario: sí o no, y dónde
- [ ] Opción de anuncio (A o B) y presupuesto
- [ ] Línea del ICP en la home: sí o no
- [ ] Permisos de casos: a quién se piden hoy
