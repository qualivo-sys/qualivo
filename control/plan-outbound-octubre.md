# Plan de outbound de octubre · reuniones cualificadas que compren

Escrito el 8-oct-2026 sobre lo medido en las últimas cinco semanas. La métrica es
**reuniones cualificadas que acaban en compra**, no envíos ni respuestas.

---

## 1 · El diagnóstico en una línea

**El correo frío no es un canal de volumen: es un canal de cinco o seis conversaciones
al mes, y las hemos estado perdiendo por no contestarlas.**

## 2 · La aritmética que lo demuestra

Tomando las tasas que hemos medido de verdad, no las que nos gustaría:

| Paso | Dato medido | Fuente |
|---|---|---|
| Capacidad real | ~250 envíos/día con 10 buzones limpios | informe del lunes |
| Tasa de respuesta en la mejor semana | **1,97%** (6 de 305) | 28-sep a 4-oct |
| De esas respuestas, interés real | **5,6%** (6 de 108) | triaje del 11-sep |

Con **5.000 envíos al mes**, que es el techo con la capacidad actual:

> 5.000 × 2% = **100 respuestas** · de esas, 5,6% = **5 o 6 personas con interés real**

Cinco o seis. **A pleno volumen.** No es un grifo, es un puñado de conversaciones.

Y el histórico dice qué pasó con ellas: de las 6 que hubo, **ninguna se contestó**,
esperaron entre 28 y 35 días, y **ninguna acabó en reunión**. La única reunión que ha
dado el correo frío en tres meses es Sergi López, de Alpha Media, que **contestó a las
9:17 y se le atendió ese día**. Y es también el único cierre, 750 €.

**Conclusión: el cuello del correo frío no es el copy ni el volumen. Es la latencia sobre
cinco personas al mes.**

## 3 · Lo que dejo de hacer

**a) Dejo de perseguir volumen.** Subir de 80 a 250 envíos al día multiplica por tres un
número que acaba en cinco o seis conversaciones. No vale la pena el riesgo de
entregabilidad.

**b) La variante hiperpersonalizada queda cerrada.** 265 envíos, 0 respuestas. No prueba
que sea peor, pero después de 265 envíos no ha dado señal de ser mejor, y la regla dice
que por debajo del 2% con más de 100 envíos se cierra.

**c) Dejo de sumar canales en los informes.** El correo frío y WhatsApp se diferencian en
un orden de magnitud. Promediarlos esconde el problema.

## 4 · Lo que mantengo y afino: las puertas

Hipótesis, con su tamaño de muestra delante para que nadie la lea como un hecho. Del
16-sep:

| Puerta | Env. | Resp. | Qué significa la señal |
|---|---:|---:|---|
| Google Ads | 40 | 3 | ya paga por demanda |
| Zoho | 20 | 1 | tiene dónde apilarla |
| LinkedIn Ads | 20 | 1 | paga por demanda B2B |
| Salesforce | 50 | 1 | CRM pesado |
| Pipedrive, Odoo, Dynamics, Brevo, Mailchimp, ActiveCampaign | — | **0** | ni una cosa ni la otra |

**Aviso importante, y es una corrección mía:** el 7-oct recomendé cerrar las puertas de
abajo diciendo «está medido». No lo estaba. **Ninguna de estas puertas llega a los 100
envíos que exige la regla de corte de Maikel.** El único caso con fundamento posible es
ActiveCampaign, con 60 y 0 el 16-sep más 60 y 0 en el informe del lunes; si son envíos
distintos suman 120 y 0 y entonces sí se cierra.

`captacion/scripts/puertas.py` aplica la regla sobre el histórico completo y da el
veredicto. **No cierro nada hasta que lo haya corrido.**

El perfil que sí describe al único cliente que compró no es firmográfico, es una
situación: **paga anuncios, tiene CRM con contactos dentro, y decide una sola persona.**
Tu correo del 22-sep a Sergi lo dice mejor que cualquier ICP: *«no necesitas que te
traigan más contactos. Tienes 8.000 en Zoho»*.

## 5 · Los tres mecanismos que instalo, y son lo que de verdad cambia el mes

**1 · SLA de 4 horas sobre las respuestas con interés.**
Es la única palanca con pérdida demostrable. `captacion/scripts/sin_contestar.py` ya está
escrito: si el último mensaje del hilo es suyo, no hemos contestado. Descarta
autorespuestas. Corre cada hora y lo que pase de 4 horas se avisa.
Pasar de 0 a contestar 5 conversaciones al mes es la diferencia entre 0 y ~2 reuniones.

**2 · Ninguna propuesta sale a una sola persona.**
13 reuniones, 11 propuestas, **1 cierre**. En 6 de las 11 la decisión estaba fuera de la
sala, dicho por ellos: *«se lo trasladaré a dirección comercial»* (Skolae), *«para que lo
veas con tu socio»* (Música de los Ríos), *«con tu socia»* (Ana Claros), *«para que lo
presentes al equipo»* (TALKUAL), Dataslayer reunido con Adela y Carolina pero no con
Juan, y en ADELANTTA las preguntas de compromiso las hace Laura.

**Y la única que cerró es la única donde acabamos hablando con dos personas a la vez: el
correo de cierre de Alpha Media va a Sergi y a Gemma.**

Regla: cuando aparezca un socio, un equipo o una dirección comercial, el siguiente paso
no es mandar el PDF, es *«¿lo vemos los tres veinte minutos?»*. Coste cero.

**3 · Canal de origen en cada reunión.**
`captacion/scripts/origen_tratos.py` ya normaliza los trece valores sueltos de `source`
de GHL a cinco canales. Nunca se enganchó al informe. Sin esto no podemos decidir dónde
poner el esfuerzo, y llevamos el mes decidiendo a ojo.

## 6 · Los números de octubre

| Frente | Qué hago | Objetivo del mes |
|---|---|---:|
| Correo frío, 4 puertas buenas | 2.000-2.500 envíos, no 5.000 | **2 reuniones** |
| Las 5-6 respuestas con interés | SLA 4 h, contestadas el mismo día | **100% contestadas** |
| Las 11 propuestas vivas | segunda persona en la conversación | **2 cierres** |
| «Más adelante», 9 opps / 11.350 € | partir en dos: con fecha o cerrada con motivo | **3 reales de 9** |

Dos reuniones de correo frío parece poco. **Es el doble de todo lo que ha dado el canal
en tres meses.**

Y la frase incómoda: **el dinero de este mes no sale del correo frío.** Sale de las 11
propuestas ya enviadas. Once propuestas a un 20% son dos cierres, y al valor del pipeline
eso son unos 7.000 € frente a los 750 € que llevamos. El outbound de octubre tiene que
llenar noviembre; octubre se cobra cerrando lo que ya está abierto.

## 7 · Qué hace falta de Maikel

1. **La clave de Smartlead en el scratchpad**, rotada, porque ahora mismo está en texto
   plano dentro del prompt de dos rutinas. Sin ella no corre nada de la sección 5.
2. **La firma del ABM**, que salió sin identificar al remitente y es un incumplimiento de
   la LSSI, no un detalle de estilo. El correo 2 sale el 13-oct y llega a tiempo.
3. **El precio en el texto de las rutinas**, que sigue diciendo 1.000-2.500 €/mes cuando
   desde el 21-sep son 1.200 € más 750 €/mes con garantía.

## 8 · Qué me haría cambiar de opinión

- Si al correr `puertas.py` con el histórico completo **Google Ads no sostiene su tasa**
  por encima de 100 envíos, la hipótesis de la puerta se cae y habría que buscar otra.
- Si las 11 propuestas no se mueven **ni con la segunda persona dentro**, entonces el
  problema no es quién está en la sala y me he equivocado: sería precio o producto.
- Si al medir el origen resulta que las reuniones de WhatsApp **no cualifican** igual que
  las de correo frío, la comparación de canales que sostiene este plan no vale.
