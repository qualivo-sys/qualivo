# Lookalike de conversaciones ganadoras · correo frío

Encargo del Chief of Staff, por orden de Maikel, del 21-oct. Entrega: viernes 23-oct.
Lo ha escrito Outbound. Es solo análisis y propuesta: no se ha lanzado nada ni se ha cambiado ninguna secuencia.

Etiquetas: **[C]** comprobado en la fuente · **[E]** estimación · **[H]** hipótesis · **[?]** pregunta para Maikel.

**Fuentes:**
- Smartlead: el historial de mensajes de cada lead (`/campaigns/{id}/leads/{lid}/message-history`) y `/statistics` de las 9 campañas de señal, consultados el 21-oct.
- Gmail de Maikel: los hilos de Skolae y Morillas.
- Apollo: búsqueda de empresas por dominio y recuento de universo, 21-oct, 4 créditos.
- Repo: `captacion/datos/probe-reuniones-ganadas.csv`, `captacion/reunion-icp-29sep.md`, `captacion/adelantta-propuesta-lunes.md` y `control/acciones-8oct-sin-claves.md`.
- Hipótesis de comprador: `docs/chief-of-staff/2026-10-21-icp-cliente-que-compra.md` (rama festive-darwin).

---

## 1. Ingeniería inversa, una por una

### 1.1 Las cinco que salieron del correo frío con señal

Las cinco recibieron la misma familia de copy: la V3 «al grano», con la primera línea escrita por lead según la señal comprobada. Todas se contactaron por primera vez entre el 11 y el 17 de septiembre [C].

| | Alpha Media Group | TALKUAL | Dataslayer | Faraday Venture Partners | Morillas Brand Consultants |
|---|---|---|---|---|---|
| **Sector** | Publicidad exterior (SIC 7312) | Alimentación online, B2C con parte B2B | Software de reporting para marketing | Capital riesgo | Agencia de branding (SIC 7311) |
| **Antigüedad** | 1995 | 2019 | 2020 | 2011 | 1962; Premio Nacional de Diseño |
| **Tamaño y equipo** | 40 personas, 15 comerciales [C, Tactiq] | Sin dato | Tiene CSM propio [C] | Equipo de inversión y Head of Marketing [C] | Unos 4,3 M € de facturación (Apollo); departamento «Client» [C] |
| **Señal con la que se le escribió** | Google Ads | HubSpot | HubSpot | LinkedIn Ads | LinkedIn Ads |
| **Otras señales en su web** | GTM y píxel de Meta (sonda del 29-sep) | GTM | GTM y chat de HubSpot | Sin sondear | Sin sondear |
| **Campaña** | Anuncios · Google Ads (señal) 3963336 | V3 · Motor de puertas 3940264 | V3 · Motor de puertas 3940264 | Anuncios · LinkedIn Ads (señal) 3964077 | Anuncios · LinkedIn Ads (señal) 3964077 |
| **A quién se escribió** | Sergi, CEO | Oriol | Juan, fundador | Gonzalo, socio | Marc, socio |
| **Quién respondió** | El mismo CEO | Oriol, que pasó la conversación a Betlem | Adela, Customer Success Manager, a la que Juan reenvió el correo | Gonzalo derivó a Nicole, Head of Marketing | Eric, Social Media Manager, que reservó directamente en el calendario |
| **Paso que hizo responder** | Correo 1 | Correo 1 | Correo 2, el caso del CRM propio: 25 oportunidades y 34.500 € | Correo 2, el caso de 10,2 veces | Correo 2, el caso de 10,2 veces con la garantía de 30 días |
| **Tiempo hasta la respuesta** | **4 minutos** | 3,5 horas | 3 días hasta el reenvío interno; la respuesta llegó 8 días después del correo 2 | **5 minutos** tras el correo 2 (22 días después del 1) | Reserva **1 h 45 min** después del correo 2 |
| **Gancho literal** | «qué campaña trajo al último cliente que firmó, no el último lead» | «ahí dentro hay oportunidades abiertas que nadie ha vuelto a tocar» | El mismo que TALKUAL, más el caso | «lo que duele no es el coste por lead: es no saber cuál de esas campañas acabó en cliente» | El mismo que Faraday |
| **Dónde está hoy** | Cliente, cerrado el 2-oct y **sin facturar todavía** [C, CoS] | Reunión y propuesta [C, sonda del 29-sep]; resultado **[?]** | Reunión; tres toques sin respuesta después [C, 8-oct] | Primera llamada el 20-oct; en negociación según el CoS. Resultado de la reunión **[?]** | Reunión el 13-oct; segunda con Ana, de su equipo, pendiente de fecha [C, Gmail 16-oct] |

### 1.2 Las tres que no salieron del correo frío con señal

| | Skolae (Abilways) | Adelantta | Freematica |
|---|---|---|---|
| **Origen real** | **No es correo frío.** Remi (marketing) llegó por recomendación de Raquel Rebelo, con la que Maikel habló por LinkedIn en julio. Maikel le escribió el 22-sep [C, Gmail] | Correo frío de julio, con el copy antiguo («un sistema que aprende»), en la campaña Academias 3608540 [C] | Correo frío de la puerta «base acumulada» (ICP15 3918857) [C] |
| **Qué respondió** | Reunión el 2-oct y demo. El 16-oct aplaza a **mayo de 2027** por presupuesto [C] | Al correo 3, el de despedida, el fundador exige respuesta por escrito a 4 puntos: servicio, resultados, coste y referencias. Maikel contesta **16 días después** y sale una reunión el 11-ago con Laura (marketing) [C] | **Solo una autorespuesta de fuera de oficina.** No hay respuesta humana [C] |
| **Lección** | El canal que funcionó fue la recomendación, no la secuencia | El decisor pide concreción por escrito; el «20 minutos sin compromiso» genérico no le sirve | No cuenta como conversación ganadora: hay que sacarla de la lista |

**Que conste:** la conversación de Morillas no está en los ficheros de LinkedIn. Salió de la campaña de correo de LinkedIn Ads.

---

## 2. Patrón común y criterios de lookalike

### 2.1 Lo que comparten las cinco del correo frío [C]

1. **La primera línea nombra una inversión que se ve desde fuera**: Google Ads, LinkedIn Ads o HubSpot de pago. Y la segunda nombra el dolor de esa inversión: no saber qué campaña acabó en cliente, u oportunidades que nadie ha vuelto a tocar. **Ninguna respondió a un mensaje por sector** («en clínicas suele pasar…»).
2. **Son empresas asentadas**, con al menos cinco años y equipo propio que atiende al cliente. Ninguna es un autónomo.
3. **El primer correo llega al de arriba (CEO, socio o fundador), que en 4 de 5 casos deriva.** Solo Alpha contestó el propio CEO. En las otras cuatro el correo bajó a marketing, customer success o redes, y la conversación siguió con esa persona.
4. **El caso con cifra del correo 2 hace tanto trabajo como el 1:** 3 de 5 respondieron al 2. Los casos que funcionaron son el 10,2 de EAC y las 25 oportunidades y 34.500 € del CRM propio.
5. **Responden rápido o no responden:** 4 minutos, 5 minutos, 1 h 45 min y 3,5 horas. Lo que no contesta en un día después de un correo, no contesta.
6. **Los sectores no son los del Playbook Q4.** Son publicidad, branding, capital riesgo, software y alimentación. Los tres sectores del Playbook (formación, reformas y clínicas) no aparecen entre las cinco.

### 2.2 Contraste con la hipótesis de comprador del CoS

| Rasgo de H-ICP | ¿Se ve en las cinco? |
|---|---|
| Empresa consolidada | **Sí, en 5 de 5** |
| Demanda recurrente | Sí en Alpha, Morillas y TALKUAL; Faraday es un caso aparte (capta inversiones, no clientes) |
| Equipo comercial o de atención | Sí: 15 comerciales en Alpha, CSM en Dataslayer, departamento de clientes en Morillas y Head of Marketing en Faraday |
| CRM infrautilizado | Sí en Alpha (Zoho «usado a medias», Tactiq). En TALKUAL y Dataslayer hay HubSpot, pero **no está comprobado** que esté infrautilizado |
| Decisor sin visibilidad | Sí en Alpha, Faraday («todo eso es muy manual», Tactiq) y Morillas («no tenéis claro cuántas oportunidades se quedan por el camino», resumen de Maikel del 13-oct) |

**Lectura [E]:** las cinco confirman H-ICP en lo de empresa consolidada con equipo y en la falta de visibilidad. Y añaden un rasgo útil para el correo frío: **la puerta de entrada es una inversión visible, no el sector.** También hay una tensión que conviene decidir: dos de las cinco son de publicidad y branding, y el cargador actual las descarta. Hoy el filtro de sector quita «marketing», «advertising» y «software» para no escribir a agencias que compiten con nosotros.

### 2.3 Criterios de lookalike, todos comprobables antes de escribir

| Criterio | Cómo se comprueba | Fuente |
|---|---|---|
| Inversión visible: **LinkedIn Ads**, Google Ads o HubSpot | Tecnología en Apollo más sonda de la web con curl | Gratis |
| **Anuncio activo de captación** (ICP-5 de Growth): un anuncio de Meta o Google que pide datos o una llamada, en una empresa sin ecommerce | Biblioteca de anuncios de Meta y Centro de transparencia de Google. Es la señal más fuerte de la tabla, porque es dinero que se gasta esta semana | Gratis, a mano o con un script |
| 11 a 200 empleados (hoy cargamos de 1 a 50) | Apollo | Gratis |
| Fundada hace 5 años o más | Apollo, `founded_year` | Gratis |
| B2B o B2B2C con equipo que atiende: ventas, cuentas o customer success | Apollo, recuento de personas por departamento | Gratis |
| Destinatario: CEO, socio o fundador; si no hay correo verificado, Head of Marketing o de ventas | Apollo | 1 crédito por persona |
| Fuera: competidores directos (agencias de performance y consultoras de CRM), autónomos, ticket bajo | Lista de exclusión y lectura de la web | Gratis |

**Una sola lista con ICP-5 (aviso del CoS, 21-oct).** El anuncio activo de captación es una señal más dentro de estos criterios. Las 10 empresas de reformas y formación que pase Growth entran en esta misma lista, con una marca de origen («ICP-5»). Si alguna ya estaba en la de lookalike, se marca y no se duplica. Ninguna se contacta hasta que lo apruebe Maikel. En ellas, el email solo se usa donde la asesoría confirme que la LSSI lo permite.

**Lo que cambia respecto a la carga de hoy:** el tope de tamaño (de 50 a 200), la prioridad de la puerta LinkedIn Ads y la entrada de agencias que no compiten con nosotros, como branding, publicidad exterior o comunicación.

---

## 3. Universo y coste

### 3.1 Cuántas hay [C, Apollo 21-oct]

Empresas con sede en España y entre 11 y 200 empleados:

| Señal | Empresas en Apollo |
|---|---:|
| LinkedIn Ads o LinkedIn Insight Tag | **2.246** |
| HubSpot | **3.162** |
| Conversión o remarketing de Google Ads | **3.923** |

Las tres listas se solapan; sin cruzarlas, el total único no se sabe **[E]**. Hay que restar lo ya contactado: unos 4.336 dominios en 90 días, más los 120 leads cargados hoy. Aun así, la suma da bastante más de lo que caben en tres semanas de envío.

### 3.2 Cuánto cuesta revelar al decisor [C, cargas del 20 y 21-oct]

| Carga | Créditos | Leads cargados | Créditos por lead cargado |
|---|---:|---:|---:|
| 20-oct (Google Ads, Meta y CRM) | ~320 | 102 | 3,1 |
| 21-oct, Google Ads | 120 | 67 | 1,8 |
| 21-oct, Meta | 120 | 53 | 2,3 |

Las pérdidas vienen sobre todo de los dominios catch-all: 46 de 240 revelados hoy. Después van los correos de otro dominio y las empresas ya contactadas, que solo se detectan después de pagar el crédito.

**Con los créditos que quedan [E]:**
- Quedan unos 3.000 créditos. Son los ~3.400 del 20-oct, menos los 240 de los revelados de Google Ads y Meta, los 10 de la ronda SDR y los 4 de este análisis. Falta restar lo que gaste la carga de CRM, que sigue en marcha.
- A unos 2 créditos por lead, dan para **unos 1.300-1.500 leads cargados** antes del 14-nov.
- Es suficiente para el experimento de la sección 4 (600 cuentas, unos 1.200 créditos) y deja margen para la carga diaria.

### 3.3 Alternativas sin gasto nuevo

1. **Ensanchar el filtro de Apollo, que es gratis:** de 50 a 200 empleados, y dejar entrar a las agencias que no compiten. Multiplica el pozo de búsqueda sin coste.
2. **Quitar antes de revelar lo que ya sabemos que se va a caer.** Hoy se perdieron 40 créditos (9 de Google Ads y 31 de Meta) en empresas ya contactadas, porque la búsqueda no devuelve el dominio. Se arregla pasando primero por la búsqueda de empresas por nombre y dominio, que es gratis.
3. **Mailerfind por dominio** para las empresas que Apollo no cubre. Ya está contratado.
4. **Google Maps, luego el dominio, y sonda de LinkedIn Insight y HubSpot con curl.** Es el camino para la pyme que Apollo cubre mal: H-10 del banco del CoS.

---

## 4. Experimento propuesto · «lookalike de conversaciones ganadoras»

| | |
|---|---|
| **Hipótesis** | Si escribimos solo a empresas que se parecen a las cinco que respondieron (inversión visible, asentadas, con equipo) y con el mismo gancho que las hizo responder, sacaremos más reuniones por cada 1.000 envíos que la media actual. |
| **Cuentas** | 600 nuevas en tres semanas, unas 40 al día: 250 de LinkedIn Ads, 200 de HubSpot y 150 de Google Ads. |
| **Mensaje** | El correo 1 **tal como lo recibieron Alpha, TALKUAL, Dataslayer y Faraday**: sin enlaces en el cuerpo (solo el de «Reserva 15 min conmigo» en la firma), con la garantía en el propio correo 1 («acordamos un número que mover y lo probamos un mes; si no se mueve, no pagáis el piloto») y «¿Te va bien esta semana?». El correo 2 lleva un solo caso con cifra: el 10,2 para Ads y las 25 oportunidades y 34.500 € para CRM. El correo 3 es la pregunta de las tres fugas. El pie legal con la BAJA se mantiene. |
| **Variable que se cambia** | **Una sola: el correo 1.** Hoy lleva dos enlaces (diagnóstico y llamada) y la garantía no aparece hasta el correo 2. Es la versión que se manda desde el 17-sep. Las respuestas en el correo 1 vinieron de la versión sin enlaces; la de Morillas, que ya tenía enlaces, solo respondió al correo 2 [C]. Se mide en dos grupos dentro de la misma campaña, con el copy por lead: mitad con la versión ganadora y mitad con la actual. **No hace falta tocar la secuencia**, porque el copy va en campos del lead. |
| **Canales** | Correo. LinkedIn no entra hasta que se reconecte HeyReach. |
| **Métrica principal** | Reuniones celebradas por cada 1.000 envíos. La secundaria, respuestas positivas por cada 1.000 envíos. |
| **Línea base** | Hay dos. **La global de unos 0,8** reuniones por cada 1.000 envíos (cifra del CoS). **La de las campañas de señal desde el 16-sep: 5 reuniones en 1.885 envíos, unas 2,7 por cada 1.000** [C]: las cinco de la sección 1. Esas mismas campañas tuvieron 40 respuestas de todo tipo, en 1.018 leads. |
| **Criterio de éxito** | La versión ganadora llega a 3 o más reuniones por cada 1.000 envíos y supera a la actual. Con unos 1.500 envíos por grupo, eso son 4 o más reuniones. |
| **Regla de parada** | Bajas por encima del 1% de los leads de un grupo, cualquier queja formal o marcado como spam, o rebote por encima del 3% con 50 envíos o más. Se para ese grupo, no el envío: la regla de nunca a cero sigue en pie. |
| **Duración** | Tres semanas de envío más una de cola para que lleguen los correos 2 y 3. Si Maikel da el ok el lunes 26, del 27-oct al 21-nov. |
| **Coste** | 0 € nuevos. Unos 1.200 créditos de Apollo de los ya pagados. |
| **Horas** | Agente: unas 2 horas al día de carga y triaje, ya dentro de la rutina. Maikel: solo las reuniones que salgan. |
| **Riesgo de contaminar** | Bajo. Usa las campañas de señal que ya existen y no toca E-01 ni E-02. Lo único que comparte con otras pruebas es la capacidad de los buzones: 300 al día, de los que este experimento usa unos 80. |

### Puntuación I, C y E

- **I = 7.** De aquí salieron el único cliente nuevo de octubre y dos negociaciones abiertas. Doblar la tasa de reuniones del canal que mejor funciona es lo que más mueve O1.
- **C = 5.** El patrón es claro, pero son cinco casos, todos de una ventana de una semana de septiembre y con buzones que hoy están en la lista negra SURBL. Puede que la tasa de septiembre no se repita con los buzones de ahora.
- **E = 8.** Las campañas, el cargador y el copy por lead ya existen. El cambio es de filtro y de un párrafo.

---

## Preguntas para Maikel (no le cuestan tiempo ahora; se resuelven cuando las vea)

1. ¿Cómo acabaron las reuniones de TALKUAL y Faraday del 20-oct? ¿Hay propuesta?
2. ¿Entran las agencias que no compiten (branding, publicidad exterior, comunicación)? Morillas y Alpha lo son.
3. ¿Se vuelve al correo 1 sin enlaces? Esto cambia el copy, así que necesita su ok.
