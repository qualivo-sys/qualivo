# Plan de captación de noviembre · Paid + Outbound

**Para aprobar el 27-oct a las 15:00.** Lo integra Paid, con el plan de Outbound del 26-oct (`docs/outbound/2026-10-26-plan-noviembre-outbound.md`, rama `claude/client-acquisition-ideas-k00f5d`). **Nada se activa ni se gasta hasta que Maikel lo apruebe.**

**Etiquetas:** [C] confirmado con datos · [E] estimación. **Fuentes:** Meta API, GHL, Smartlead (vía Outbound), 23-27 oct.

---

## 1 · Objetivo del mes

| Etapa | Meta de noviembre | De dónde sale [E] | Referencia real [C] |
|---|---|---|---|
| Leads cualificados (aptos) | **10-13** | Paid: 9-11 (unos 65 € por apto con el filtro de E-01, con los 150 € extra de E-02). Outbound: 1-2 | E-01: 128 € → 2 aptos (1 cliente y 1 dudoso) y 1 contacto repetido |
| Reuniones celebradas con encaje | **5-7** | Paid: 4-5 (cerca del 50 % de los aptos). Outbound: 1-2 (criterio: ≥1 reunión por cada 500 envíos) | Meta en 3 meses: 58 leads → 10 reuniones celebradas (17 %); con filtro, el apto llegó a reunión en 24 h |
| Propuestas | **2-3** | — | Meta en 3 meses: 7 propuestas de 10 reuniones |
| **Clientes nuevos** | **1-2** (meta de la instrucción maestra) | Paid 1 + reserva | Meta: 2 de 11 reuniones acaban en piloto o cliente. E-01: 1 cliente de 3.600 € con unos 48 € de anuncios |

**Lectura honesta:** un cliente es lo realista y dos es la parte alta. Outbound sigue activo (decisión de Maikel del 27-oct), pero su dato hasta ahora es de 0 reuniones en 1.373 correos (semana del 19-oct: 41 respuestas, 2 con interés) [C]. Las 1-2 reuniones de Outbound son una meta, no algo ya visto: se revisa el 13-nov con el criterio de su plan.

---

## 2 · Paid

### 2.1 Calendario (una sola prueba activa a la vez, 20 €/día en total)

| Fechas | Qué | Reparto | Matar | Escalar / quedarse |
|---|---|---|---|---|
| 28-31 oct | E-01 sigue como está, hasta su fecha de muerte. **29-oct:** se montan el 11 y el 11-nolose **en pausa** y se prueba que el lead llega a GHL | 20 € formación | — | Lectura del 31-oct |
| **27-oct → 10-nov · prueba A (E-02, ACTIVA desde el 27-oct con el OK de Maikel)** | **11 contra 11-nolose** en un conjunto nuevo a 15 €/día; el conjunto viejo de E-01 **baja a 15 €/día** y sigue de control. Mismo cuerpo, cambia solo el gancho, con el formulario filtrado de E-01 | 15 € + 15 € (30 €/día, 14 días) | Un anuncio con 75 € y ningún lead apto se apaga | Gana el de menor coste por lead apto; a igualdad, el que lleve a reunión |
| **15-28 nov · prueba B** (empieza al volver a 20 €/día) | **Reformas filtrado** (3V reformas con el arranque «ventanas y reformas», formulario que deja fuera «nada todavía») | 10 € al ganador de A + 10 € a reformas | 70 € sin ningún lead A o B | ≥1 reunión con encaje a 137 € o menos y ≥4 leads A o B |
| 29-30 nov | Lectura del mes y decisión de diciembre | — | — | — |

**El 09** (sistema en vivo) queda **en reserva**. Si las dos versiones del 11 mueren antes del 14-nov, entra el 09 en su lugar.

### 2.2 Presupuesto

- **Noviembre:** unos **750 €** [E]: 30 €/día hasta el 10-nov y 20 €/día después. **Tope del mes: 780 €** (los 150 € extra de E-02, aprobados por Maikel el 27-oct). Meta puede gastar hasta un 25 % más en un día suelto, pero no en la media semanal.
- **Sin subir presupuesto.** Google Ads, retargeting y optimizar por cualificados (PAID-05) se quedan fuera de noviembre: paquete en pausa (`paid/campanas/2026-10-27-paquete-google-y-retargeting.md`).

### 2.3 Métricas

| Métrica | Cómo | Para qué |
|---|---|---|
| **Coste por lead apto** (pasa el filtro de volumen y valor) | Formulario nativo leído por API, nunca la columna de resultados de Meta | Decidir qué anuncio gana |
| **Coste por reunión con encaje** | GHL (`reunion-encaja` o etapa) | Escalar o matar sector |
| Cliente e importe | GHL ganada → se envía sola a Meta (cron de señales desde el 24-oct) | Que Meta aprenda quién compra |
| CTR y CPM | Meta | Solo para detectar el cansancio del vídeo (aviso si el CTR baja del 0,5 % tres días seguidos) |

---

## 3 · Outbound (de su plan del 26-oct)

**Situación** [C, Outbound, 23-oct]:
- **Email frío:** unos 300 correos/día en 15 buzones. Quedan 88 leads sin empezar fuera de Infoproducto.
- **ABM formación:** 10 cuentas, 8 en borrador.
- **LinkedIn:** sin cuenta conectada desde el 2-oct.
- **Llamadas en frío:** no se hacen.
- **Desde el 26-oct, por decisión de Maikel:** no entran leads nuevos ni se activan envíos nuevos mientras la asesoría no valide la LSSI (art. 21).

**Decisión de Maikel (27-oct): sigue el email frío, el ABM por email arranca y entran más leads** («activa ya, deja lo de la LSSI»). Las opciones A y B quedan descartadas.

| Canal | Noviembre | Reuniones [E] |
|---|---|---|
| Email frío (Smartlead, 15 buzones) | Sigue con unos 300 correos/día. Se cargan leads nuevos de Apollo (quedan unos 2.650 créditos hasta el 14-nov), en formación y reformas con señal de anuncios o CRM | 1-2 si llega a ≥1 reunión por cada 500 envíos. **Hoy está en 0 de 1.373** [C] |
| ABM formación por email | 10 cuentas revisadas a mano: 4 correos en 12 días | 0-1 |
| LinkedIn | Manual, cuando se reconecte la cuenta, como apoyo al ABM | Solo apoyo |
| Teléfono / WhatsApp | Solo para contestar a quien escribe | — |

**Criterio de Outbound** (su plan del 26-oct, cada 2 semanas por puerta y con 300 envíos o más):
- **Mantener:** ≥1 reunión cada 500 envíos y ≥1 % de respuestas positivas.
- **Cambiar el ángulo:** entre 0,5 % y 1 %.
- **Cerrar:** por debajo del 0,5 %.
- **Parar en el momento:** bajas o quejas por encima del 1 %, o rebote por encima del 3 %.

**Riesgo que queda escrito, sin cambiar la decisión:** el art. 21 de la LSSI sigue sin validar por la asesoría para el correo frío. La baja inmediata y el pie identificativo se mantienen.

**Coordinación con Paid:** a una cuenta que ya está en Outbound no se le apunta con Paid ni al revés. Los leads que entran por anuncios se excluyen de las listas de Apollo (cruce semanal de Outbound con GHL).

---|---|---|---|
| **A · Pausar el email frío** (también lo ya cargado) hasta que la asesoría responda | Outbound solo contesta y cualifica lo que entra | 0 | Ninguno legal. Se pierde un canal que hoy da 0 reuniones |
| **B · Solo destinatarios con relación previa** (excliente, contacto que ya nos escribió, base con permiso que recuente Growth) | Mensajes de Outbound y newsletter de Growth | 0-2 | Bajo, si el permiso se puede acreditar |
| **C · LinkedIn manual y llamadas** | ABM de 10 cuentas por LinkedIn cuando se reconecte la cuenta. Llamadas solo a quien lo pida (sin consentimiento no se llama, Ley 11/2022) | 0-1 | Medio: falta el criterio de la asesoría sobre los mensajes comerciales en LinkedIn |

**Recomendación:** **A + B ya**, y **C solo si la asesoría lo valida**. Las campañas que siguen enviando a leads cargados se **pausan**: 0 reuniones de 1.373 envíos no compensan el riesgo legal.

---

## 4 · Calendario por semanas

| Semana | Paid | Outbound | Creative | Contenido | Growth | **Maikel (horas)** |
|---|---|---|---|---|---|---|
| **27-31 oct** | **E-02 activo** (11 contra 11-nolose, 15 + 15 €/día); lectura de E-01 (31) | Cargar leads nuevos de Apollo; arrancar ABM formación (10 cuentas) | Subir los MP4 del 11 y miniaturas (antes del 29) | — | Recuento de la base con permiso (opción B) | **1 h:** aprobar el plan, validar anuncios y la cifra del rótulo |
| **2-8 nov** | **Prueba A en marcha** (11 contra 11-nolose) | Email frío al volumen actual; ABM en curso; cruce con GHL | Retoques del 3V reformas (arranque de ventanas) | Brief del 2.º anuncio de reformas, si hace falta | Newsletter de formación (con permiso) | **2-3 h:** reuniones que salgan (1 h cada una) |
| **9-15 nov** | Lectura de E-02 (10-nov) y vuelta a 20 €/día; montar reformas en pausa y probar el envío a GHL | **Revisión del 13-nov** con el criterio de Outbound (mantener, cambiar ángulo o cerrar) | Entregar el 3V de ventanas | — | Newsletter de reformas | **2-3 h:** reuniones y OK a la prueba B |
| **16-22 nov** | **Prueba B en marcha** (reformas) + ganador de A a 10 €/día | Email frío y ABM; LinkedIn de apoyo si se reconecta | — | — | Seguimiento de propuestas | **2-4 h:** reuniones y propuestas |
| **23-30 nov** | Lectura de B (28-nov); cierre del mes; propuesta de diciembre (Google o retargeting, si se cumplen las condiciones) | Informe del mes | — | — | — | **2-3 h:** reuniones y revisión del mes (30 min) |

---

## 5 · Lo que se deja fuera de noviembre

- Google Ads (Search y Demand Gen): paquete listo, a partir del 1-dic.
- Retargeting en Meta: audiencias por debajo de 1.000 personas.
- Optimizar Meta por cualificados (PAID-05): no hay volumen.
- Clínicas y asesorías como sectores de pago.
- Infoproducto (1.221 leads de Mailerfind): hasta decidir si es de Qualivo o de un cliente.
- Más vídeos nuevos: con el 11 (dos ganchos), el 09 de reserva y el 3V reformas hay suficiente.

---

## 6 · Decisiones para Maikel (5)

| # | Decisión | Recomendación de Paid |
|---|---|---|
| 1 | Paid de noviembre: unos 750 € (tope 780 €), con E-02 ya activo (15 + 15 €/día hasta el 10-nov) y la prueba B del 15 al 28 | **Aprobar** |
| 2 | Cifra del rótulo del 11: «sus clientes pagan 500 € o más» o «1.000 € o más» | **500 € o más.** El cliente que firmó por E-01 declaró un valor de 300-999 € por cliente [C]: con «1.000 €» nos habríamos dejado fuera al único cliente del mes |
| 3 | ~~Email frío~~ **Decidido por Maikel el 27-oct: sigue activo y entran leads** | — |
| 4 | Volumen de leads nuevos de Apollo en noviembre (créditos hasta el 14-nov) | Cargar solo formación y reformas con señal (anuncios o CRM), y revisar el 13-nov con el criterio de 500 envíos |
| 5 | Infoproducto (1.221 leads): ¿Qualivo o cliente? | **Fuera de noviembre** hasta decidirlo |
