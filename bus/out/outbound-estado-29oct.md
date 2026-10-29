# Outbound · estado a 29-oct, 17:15 (Madrid)

[C] es un dato confirmado (Smartlead, Apollo, DNS); [E], una estimación. Sin datos personales.

## 1. En una línea

El canal envía, pero con poco margen:
- Quedan **2,3 días de leads** [C], cuando el mínimo son 3.
- Los dos dominios que envían han entrado en una **lista negra de dominios (SURBL)** [C].
- Hoy se han cargado **86 leads nuevos** [C] con un método que rinde 3 veces más por crédito.
- Para llegar a 100 leads al día falta la **fuente de la Biblioteca de anuncios de Meta**, pendiente del ok a Apify.

## 2. Campañas activas de Qualivo (envíos en frío)

| Bloque | Hoy, hasta las 17:15 | Últimos 7 días | Respuestas en 7 días* | Rebotes en 7 días | Leads sin empezar |
|---|---:|---:|---:|---:|---:|
| Señal: anuncios (Google Ads, Meta, LinkedIn Ads) | 61 | 507 | 21 | 8 | 55 |
| Señal: CRM (Odoo, Salesforce, Zoho, Pipedrive, HubSpot V3) | 51 | 238 | 9 | 0 | 8 |
| ABM (formación y reformas) | 6 | 8 | 0 | 0 | 0 |
| Campañas antiguas aún activas (Infoproducto, Construcción, Servicios B2B, Obra, Asesorías, Playbook Q4, Formación) | 72 | 869 | 26 | 15 | 1.173 |
| **Total Qualivo** | **190** [C] | **1.622** [C] | **56** [C] | **23** [C] | **1.236** [C] |

\*Las respuestas incluyen rebotes y respuestas automáticas. En octubre, solo ~39% de lo que volvía lo había escrito una persona [C].

- **Rebote de las campañas de señal en 7 días:** 8 de 745, un 1,1% [C], por debajo del límite del 3%.
- **Leads sin empezar:** el 95% son de Infoproducto (1.173) [C]. Falta decidir si esa lista es de Qualivo o de un cliente.
- **Carga de hoy:** 86 leads [C] (Meta 30, Google Ads 19, Odoo 16, Salesforce 11, HubSpot 7, Zoho 3). Han costado 177 créditos de Apollo [C].
- **Créditos de Apollo:** quedan ~2.240 hasta el 14-nov [C], cuando se recargan 4.000.
- **Las campañas de los clientes DKR y Kubysoft no están en estas cifras.**

## 3. Reuniones de octubre (email en frío)

| Empresa | Origen | Estado |
|---|---|---|
| Faraday Venture Partners | LinkedIn Ads | Celebrada el 20-oct [C] |
| Habitabio | Meta | Agendada el 12-nov a las 10:00; ya tiene el rango de precio [C] |
| Tunergia | Odoo | Pidió retomarlo en 2 meses. Respuesta enviada hoy; se recontacta a mediados de diciembre [C] |
| Strat Consultores | Meta | Preguntó por la tasa de agendas del email en frío. Respondido hoy [C] |
| Siello | Email, después WhatsApp | Conversación abierta por WhatsApp con Maikel [C] |

**Objetivo de noviembre:** 3 reuniones celebradas con encaje, con 4 como parte alta [E]. Es la definición común con Paid y se revisa el 13-nov.

## 4. ABM

| Vertical | Cuentas activas | Campaña |
|---|---:|---|
| Formación | 2 [C] | 4213037, desde el 27-oct |
| Reformas | 6 [C] | 4213038, desde el 28-oct |

**Pendientes de decisor:** 22 de las 30 cuentas del piloto [C].

**Siguiente paso:** cargarlas antes del 6-nov y sumar 20-30 cuentas más desde la Biblioteca de anuncios [E].

## 5. Buzones

| Dominio | Buzones | Ritmo | Reputación | SURBL |
|---|---:|---|---|---|
| qualivoedge.com | 5 | 30/día por buzón | 100% [C] | **Listado** desde ≤29-oct [C] |
| novaqualivo.com | 5 | **20/día** desde hoy (antes 30) | 81-87% [C] | **Listado** [C] |
| goqualivo / gotqualivo | 5 | Fuera de las campañas | — | Listados desde septiembre [C] |
| 2 dominios nuevos (10 cuentas, comprados hoy) | 10 | Aún no aparecen en Smartlead a las 17:15 [C] | — | — |

**Ritmo desde el 30-oct:** ~250 correos al día [E].

**Rampa de los dominios nuevos:**

| Tipo de buzón | Calendario |
|---|---|
| Precalentados | 10/día la primera semana, 20 la segunda y 30 después |
| Nuevos | Calentamiento hasta el ~19-nov; luego 10/día desde el 20-nov, 20/día desde el 24-nov y 30/día desde el 27-nov |

**SURBL:**
- Los correos no llevan enlaces a nuestros dominios. Solo aparecen como remitente.
- Hoy hay 1 rechazo por SURBL [C].
- La solicitud de retirada está preparada para Maikel en `bus/out/outbound-surbl-retirada-29oct.md`.

## 6. Bloqueos y quién los desbloquea

| Bloqueo | Impacto | Quién | Qué tiene que hacer |
|---|---|---|---|
| Apify para la Biblioteca de anuncios | Sin esta fuente no se llega a 100 leads/día | Maikel | Un «ok Apify» en el chat de Outbound (máximo 10 € por ejecución) |
| Infoproducto: ¿de Qualivo o de un cliente? | 1.173 leads parados en el cálculo del depósito | Maikel | Decirlo en una línea |
| Retirada de SURBL | Rechazos en los servidores que usan SURBL | Maikel | Enviar el formulario con el texto ya preparado |
| Buzones nuevos sin conectar | No suman envíos | Maikel | Decir dónde se compraron y si son precalentados |
| LinkedIn caído desde el 2-oct | Canal parado | Maikel | Reconectar la cuenta en HeyReach |
| Lista de Growth de la Biblioteca de anuncios | Volumen de Meta | Growth | Contestar con la lista o confirmar que la saca Outbound con Apify |

## 7. Los 3 próximos pasos para noviembre

1. **Volumen:**
   - fuentes: Apollo con filtro previo (~80 leads/día) y Biblioteca de anuncios (~25-30/día) desde que haya ok [E];
   - objetivo: salir de la alarma de depósito antes del 3-nov.
2. **Reputación:**
   - retirada de SURBL;
   - novaqualivo a 20 por buzón;
   - los dominios nuevos con su rampa.
   - No subir de ~250 correos/día hasta cerrar la semana sin rechazos nuevos.
3. **ABM:** cargar las 22 cuentas pendientes y 20-30 nuevas antes del 6-nov.
