# Avatar · tres opciones y demanda real

**Para la sesión del 29-oct.** Encargo del Chief of Staff (27-oct): tres opciones de avatar con pros, contras y una recomendación, y comprobar con la web, el blog y el CRM cuánta demanda real hay para el avatar recomendado.
**Etiquetas:** **[C]** comprobado con fuente · **[E]** estimación · **[H]** hipótesis.
**Fuentes internas** (rama `claude/qualivo-landing-vercel-nubk1i` salvo que se diga otra cosa):
- `content/brief-recorrido-semana-38.md`: los 20 leads de Meta del 18 al 22-sep, uno a uno.
- `bus/out/demand.jsonl`: diarios de Growth del 22-sep al 26-oct.
- `content/anuncios/competencia-formacion-2026-10.md`: anuncios activos de la competencia en formación, 26-oct.
- `measurement/baseline.md`: Search Console a 27-ago.
- `content/seo-keywords-usadas.md` y `content/listado-maestro-busquedas.md`.

---

## 1 · Las tres opciones

### A · Academias y centros de formación privada que ya invierten en anuncios *(recomendada)*

**Quién:** dirección o propiedad de una academia (oposiciones, idiomas, cursos profesionales, escuelas técnicas, formación online con asesores). Invierte 500-3.000 €/mes en anuncios y atiende con 1-3 personas. No puede pagar el servicio completo.

| Pros | Contras |
|---|---|
| **Es la demanda que ya entra.** Formación trajo 8 de los 20 leads de Meta de la semana 38, a 10,85 € cada uno, y es el único vertical que seguía activo en Meta el 18-oct [C] | **Mucho plantón** en los leads de presupuesto bajo: 3 de las 4 citas de formación de la semana 38 fueron plantón o cancelación [C]. Comprar 690 € exige más compromiso que una cita gratis |
| **Muchos no llegan al precio del servicio:** 5 de los 8 leads de formación de la semana 38 invertían menos de 500 € o nada [C]. Es justo quien podría pagar un programa y no una agencia | **Se solapa con el ICP del servicio:** EAC, Eleva y el cliente de formación cerrado el 24-oct son academias [C]. Riesgo de canibalizar (se mitiga con el filtro de 4.4) |
| **Hay casos, material y pantallas** de formación: landing, vídeo del sistema, demo de llamada, simulador del embudo y guía de las 5 fugas para academias ya hechos [C] | **El mensaje «muchos leads, pocas matrículas» está ocupado** por al menos 5 anunciantes [C]. La diferencia tiene que ser enseñar el sistema funcionando |
| **Un ciclo corto y medible** (solicitud → llamada → matrícula) permite prometer indicadores sin prometer ingresos | Varias academias quieren **«una herramienta para gestionar sus solicitudes, no una charla de método»** (objeción del cliente cerrado el 24-oct) [C]. El programa tiene que dejar la herramienta instalada |
| **Nadie vende el sistema de admisiones como programa.** Lo que se anuncia a academias son servicios y CRM [C] | |

### B · Infoproductores y formadores online que venden con webinars, lanzamientos y closers

**Quién:** experto o experta que vende un programa online, con webinars o lanzamientos y 1-3 closers. Por ejemplo: Nuria Roure, Andrea Acha o Lola, que llegaron a Qualivo como leads o clientes [C].

| Pros | Contras |
|---|---|
| **Compran formación por costumbre** y entienden el formato | **Growth trabaja «Infoproducto» como vertical de clientes** del servicio. Habría que coordinarlo |
| El seguimiento de la base sin captar más es un caso de Qualivo [C], aunque hoy está sin permiso escrito [C] | **Son sofisticados:** «me da miedo delegar porque me funciona» (Andrea Acha) [C]. Compran optimización, no un sistema desde cero |
| Mercado más grande y abierto a LATAM | **Ticket bajo del cliente final:** Lola vende un programa de 49 € [C]. Hay menos dinero por venta que recuperar |
| | **Competencia directa con los grandes** del lanzamiento y Hotmart, y una cultura de promesas de ingresos que choca con la normativa |

### C · Agencias y freelancers que quieren implantar este sistema para pymes

**Quién:** quien monta o quiere montar una agencia de automatización o IA.

| Pros | Contras |
|---|---|
| **El mercado que más compra:** comunidades de 1.000 a 337.000 miembros [C] | **El más saturado y barato:** 10-77 $/mes en Skool [C] |
| Pagan mensualmente y aprovechan plantillas técnicas | **Vive de promesas de ingresos** («cobra por hacerlo») que la política de Meta y la Ley General de Publicidad castigan [C] |
| | **Qualivo formaría a su competencia.** 20 de 133 prospectos de una muestra ya eran competidores directos [C, `clasificacion-133-2oct.md`] |
| | **Sin salida hacia el servicio:** una agencia no contrata a Qualivo |
| | Aleja la marca de las pymes, que es a quien vende Qualivo |

**Descartada antes de llegar aquí:** «negocios de servicios por cita en general» (clínicas, reformas y formación juntos). El mensaje sale genérico y es justo lo que el mercado ya hace (`01`, patrón 4).

### Recomendación

**A, academias.** Es donde ya entra demanda, donde está el material y donde nadie vende un programa. **B queda como segunda edición** si A funciona, y siempre coordinada con Growth. **C, no.**

Que A tenga que cuidar el compromiso (plantones) y la canibalización no lo descarta: decide el diseño. Por eso se valida con una **preventa pagada**, no con una lista de espera, y el programa filtra por tamaño.

---

## 2 · Demanda real del avatar A: lo que dicen nuestros datos

### 2.1 Leads que ya han entrado

| Dato | Valor | Fuente |
|---|---|---|
| Leads de Meta del 18 al 22-sep | 20 contactos: **8 de formación**, 9 de reformas y 4 de clínicas (21 leads en Meta; 1 duplicado) | `brief-recorrido-semana-38.md` [C] |
| Coste por lead de formación esa semana | **10,85 €** (86,77 € de gasto, 8 leads). Reformas 10,00 €, clínicas 21,06 € | Ídem [C] |
| Inversión mensual declarada por los 8 de formación | **2 nada · 3 menos de 500 € · 2 de 500-2.000 € · 1 de 2.000-5.000 €** | Ídem [C] |
| Solicitudes al mes declaradas | 3 menos de 20 · 1 de 20-50 · 2 de 50-100 · 2 más de 100 | Ídem [C] |
| Qué pasó con esos 8 | 4 citas: 3 plantones o cancelaciones y 1 pendiente. 4 sin contacto real (número que no conecta, buzones) | Ídem [C] |
| Leads de pago del 15-sep al 7-oct (todos los sectores) | **45** | Growth, 7-oct [C] |
| Vertical activo en Meta a 18-oct | **Solo formación**, a 20 €/día | Growth, 18-oct [C] |
| Leads de formación con presupuesto bajo que llegaron a reunión | Lola: invierte 500-800 €/mes y vende un programa de 49 € · Vicente: cursos de 160 € («no me llega») | Growth, 5-oct · ICP 21-oct [C] |
| Último cierre | Una escuela de formación, entrada por formulario de Meta el 22-oct: **3.600 €** por el periodo mínimo. Le respondieron en 1 minuto por WhatsApp | Growth, 24-oct [C] |

**Lectura [E]:**
1. **Hay flujo, pero menor del supuesto.** El recuento del CRM del 27-oct da 29 leads de formación en 6 semanas: unos 5 por semana. 17 de ellos (59 %) invierten menos de 500 € o nada, y de sus 11 citas solo se celebraron 2 [C, Growth vía Chief of Staff]. Detalle en `05`, apartado 5.
2. **Más de la mitad está por debajo del servicio.** 5 de 8 invierten menos de 500 € o nada [C]. Hoy Qualivo los descarta. Para el infoproducto son el público natural, **si pagan**.
3. **Su compromiso es bajo.** Faltan a citas gratis. Una lista de espera no prueba demanda; solo una preventa pagada.
4. **La muestra es pequeña:** 8 leads de una semana. No se vende como conclusión (regla del Chief of Staff).

### 2.2 Búsquedas

| Fuente | Qué dice | Etiqueta |
|---|---|---|
| Search Console de qualivo.io a 27-ago | 3 palabras clave, todas de marca. Ningún dato de búsquedas de academias | [C] |
| Palabras clave del blog desde el 22-sep | Todas genéricas (captación, CRM, propuesta, lead scoring). **Ninguna de academias ni de matrículas** | [C] |
| Listado maestro de búsquedas | Sin entradas de formación, academias, alumnos ni matrículas | [C] |
| Estudio de palabras clave de EAC | Habla de cursos de aviación, no de cómo captan las academias. No sirve | [C] |

**Conclusión: no tenemos datos de búsqueda para el avatar A.** No los invento.
**Cómo conseguirlos sin coste:** con la herramienta de SEO que ya se usa (DinoRank), Growth puede sacar en una hora el volumen de: «captar alumnos», «cómo conseguir alumnos para mi academia», «marketing para academias», «crm para academias», «más matrículas», «captación de alumnos», «publicidad para academias», «leads para centros de formación» [H: que DinoRank dé volumen para estas búsquedas]. **Lo propongo, no lo encargo:** la petición la decide el Chief of Staff.

### 2.3 Señal del lado de la oferta: quién se anuncia a academias

Del 26-oct, Biblioteca de anuncios de Meta, 7 búsquedas, 120 anuncios activos en España [C]:
- **Servicios y agencias:** Scire Marketing Online, Cliender, marketinhouse, Ai4growth, Ventas.io, Bastida&Farina, Valeronmedia, The Selling System.
- **Software:** Gestyde, Clientify, Alinaflow (CRM para academias con «Recepcionista IA»), Leadsales.

**Lectura [E]:**
- Si más de 10 empresas pagan anuncios para vender a academias, hay compradores. Es una señal indirecta, no una prueba.
- Todas venden **servicio o software**. Ninguna vende un programa para que la academia lo monte. Eso confirma el hueco H3 del estudio de mercado.

### 2.4 Lo que falta y quién lo tiene

| Falta | Quién lo tiene | Para qué |
|---|---|---|
| Todos los leads de formación desde el 15-sep, con sus etiquetas de inversión y volumen | CRM (GHL), Growth | Saber cuántos al mes quedan por debajo del servicio. Es **el tamaño del público que ya llega** sin gastar más |
| Descargas del simulador del embudo y de la guía de las 5 fugas para academias | Nadie. La página existe sin indexar y sin enlazar desde el 29-sep, pendiente del ok de Maikel [C] | Es el imán del infoproducto ya hecho. Publicarlo es la forma más barata de medir interés |
| Volumen de búsqueda | DinoRank, Growth | Ver 2.2 |

**Propuesta para la sesión:** que Maikel decida si se pide a Growth el recuento del CRM (30 min de agente) antes del 2-nov. Con ese número, el objetivo de la validación (8 preventas) se puede comparar con el flujo real.
