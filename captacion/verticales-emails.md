# Emails por vertical (voz Maikel)

Mismo modelo validado en formación (25 respuestas), adaptado al dolor concreto de
cada sector. Variables Smartlead: `{{first_name}}`, `{{company_name}}`.
Email 1 sin links (mejor entregabilidad); follow-ups en el mismo hilo (Día 0/3/7).
Cada vertical = **su propia campaña en Smartlead + su lista Apollo**.

> Nota de capacidad: 5 buzones ≈ 100 envíos/día en total, repartidos entre los
> verticales activos. Para más volumen (hacia 30k/mes) → más buzones/dominios.

---

## 1) Clínicas estéticas / dentales
**ICP Apollo:** clínicas estéticas, dentales, medicina estética · España · 6-100 empl · director/a, propietario/a, gerente.
**Subject A:** {{company_name}}: pacientes que pagáis y se enfrían
**Subject B:** una fuga de pacientes en {{company_name}}

Buenos días, {{first_name}}.

Soy Maikel, fundador de Qualivo. Ayudo a clínicas a convertir su captación en un
sistema que aprende: conectamos IA, campañas y CRM para que cada paciente nuevo
reduzca el coste de conseguir el siguiente.

Un patrón que vemos mucho en estética y dental: se paga bien por leads de
tratamiento, pero se pierde un buen porcentaje porque nadie los sigue rápido —
no cogen la segunda llamada y acaban en la clínica que respondió antes.

¿En {{company_name}} el seguimiento lo lleváis con un sistema o más a mano? Te lo
pregunto sin venderte nada; si te encaja, te enseño en 20 min cómo lo montamos.

Un saludo,
Maikel Echevarria · Qualivo

PD: perdona el atrevimiento del correo en frío. Nunca se sabe cuándo empieza una
buena relación profesional.

---

## 2) Inmobiliarias boutique
**ICP Apollo:** inmobiliarias, agencias inmobiliarias · España · 6-100 empl · director/a, gerente, propietario/a.
**Subject A:** leads de portales que se enfrían
**Subject B:** {{company_name}}: la primera hora lo es todo

Buenos días, {{first_name}}.

Soy Maikel, fundador de Qualivo. Ayudo a inmobiliarias a que su captación funcione
como un sistema que aprende (IA + campañas + CRM) y baje el coste por operación.

El lead inmobiliario tiene fecha de caducidad: quien llama en la primera hora se
lleva la visita. La mayoría de agencias tarda horas — y para entonces el comprador
ya está hablando con otra.

¿En {{company_name}} cómo tenéis el primer contacto: automático e inmediato, o
depende de que alguien esté libre? Sin venderte nada; si quieres, te lo enseño en
20 min.

Un saludo,
Maikel Echevarria · Qualivo

PD: perdona el correo en frío — nunca se sabe cuándo empieza algo bueno.

---

## 3) Reformas / interiorismo
**ICP Apollo:** empresas de reformas, interiorismo, construcción · España · 6-100 empl · propietario/a, gerente, director/a.
**Subject A:** presupuestos que se enfrían
**Subject B:** {{company_name}}: leads de reforma que se pierden

Buenos días, {{first_name}}.

Soy Maikel, fundador de Qualivo. Ayudo a empresas de reformas a convertir su
captación en un sistema que aprende — IA + campañas + CRM — para dejar de competir
solo por precio.

Lo que vemos en el sector: llegan solicitudes de presupuesto, pero se tarda en
responder y el cliente ya ha contratado a quien le llamó primero y le dio
confianza. No es falta de leads: es velocidad y seguimiento.

¿En {{company_name}} el seguimiento de los presupuestos es automático o va a mano?
Te lo pregunto sin venderte nada; si te encaja, 20 min y te lo enseño.

Un saludo,
Maikel Echevarria · Qualivo

PD: perdona el atrevimiento del correo en frío.

---

## 4) Gestorías / asesorías (fiscal-laboral)
**ICP Apollo:** gestorías, asesorías fiscales/laborales, consultoría pymes · España · 6-100 empl · socio/a, gerente, director/a.
**Subject A:** captar pymes sin depender del boca a boca
**Subject B:** {{company_name}}: crecer cartera de forma predecible

Buenos días, {{first_name}}.

Soy Maikel, fundador de Qualivo. Ayudo a gestorías y asesorías a que la captación
de nuevos clientes deje de depender del boca a boca, con un sistema que aprende:
IA + campañas + CRM que reduce el coste de conseguir cada pyme cliente.

La mayoría de despachos crece por recomendación — genial, pero impredecible. Con un
canal de captación propio y bien seguido, el crecimiento se vuelve previsible mes
a mes.

¿En {{company_name}} tenéis un canal de captación activo o todo es referidos? Sin
venderte nada; si te interesa, te lo enseño en 20 min.

Un saludo,
Maikel Echevarria · Qualivo

PD: perdona el correo en frío — nunca se sabe cuándo empieza una buena relación.

---

## Follow-ups (comunes, adaptar el sustantivo por vertical)
**F1 (Día 3):** "{{first_name}}, te escribí hace unos días. Un ejemplo concreto: conectar las conversiones reales (ventas, no clics) de vuelta a las campañas baja el coste de adquisición notablemente con la misma inversión. ¿Lo vemos en 20 min aplicado a {{company_name}}?"
**F2 (Día 7):** "{{first_name}}, no quiero llenarte la bandeja — lo dejo aquí. Si mover la captación de {{company_name}} entra en tus planes este trimestre, respóndeme y te paso el detalle. Un saludo."

## Setup por vertical (checklist)
1. Apollo: `mixed_people_api_search` con el ICP del vertical → enrich emails verificados.
2. Smartlead: nueva campaña "[Vertical] ES · Q3" → pegar secuencia → asignar los 5 buzones → schedule España.
3. Repartir el ritmo: 100/día ÷ nº verticales activos (o ampliar buzones).
4. Webhook de respuestas → ya apunta a n8n (vale para todas las campañas si añades su webhook).
