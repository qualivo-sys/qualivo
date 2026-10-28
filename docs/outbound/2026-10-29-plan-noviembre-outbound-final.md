# Outbound · plan final de noviembre (versión del 28-oct, para el 29-oct a las 10:00)

Encaja con el plan de captación de Paid (`paid/plan/2026-10-27-plan-captacion-noviembre.md`). Aplica la decisión de Maikel del 27-oct: se activa ahora y se meten más leads en el embudo, con barandillas. [C] es un dato confirmado; [E], una estimación.

## 1. Volumen por semana

**Buzones de Qualivo** (comprobados el 28-oct) [C]:

| Dominio | Buzones | Correos/día por buzón | Reputación |
|---|---|---|---|
| qualivoedge | 5 | 30 | 100% |
| novaqualivo | 5 | 30 | 89-93% |
| goqualivo y gotqualivo | 5 | 1 | En lista negra SURBL; se retiran de la rotación cuando Maikel lo confirme |

- **Capacidad:** ~300 correos/día, que es el tope de 30 por buzón.
- **Regla para novaqualivo:** si la reputación baja del 85%, sus buzones pasan a 20/día.

| Semana | Leads nuevos | Correos/día [E] | Correos/semana [E] |
|---|---|---|---|
| 2-6 nov | ~100/día | ~300 (40% primer correo, 60% seguimientos) | ~1.500 |
| 9-13 nov | ~100/día | ~300 | ~1.500 |
| 16-20 nov | ~100/día | ~300 | ~1.500 |
| 23-27 nov | ~100/día, si quedan créditos | ~300 | ~1.500 |

No se sube por encima de 300/día. Para hacerlo harían falta buzones nuevos y 3 semanas de calentamiento.

## 2. Secuencias activas y ABM

**Secuencias por señal.** Texto plano, sin seguimiento de aperturas ni clics, 3 correos (días 0, 3 y 7) con la primera línea según la señal comprobada:

| Señal | Campañas |
|---|---|
| Anuncios | Google Ads (3963336), Meta (3964316), LinkedIn Ads (3964077) |
| CRM | Salesforce, Odoo, Zoho, Pipedrive |
| CRM HubSpot | V3 (3940264) |

**Desde el 27-oct cada lead se comprueba en su web antes de cargarlo:**
- debe aparecer el píxel de anuncios o GTM;
- si la señal es HubSpot, su script tiene que estar en la web.

El 27-oct este filtro descartó 15 de 116 leads [C], después de que una empresa contestara que ya no usaba HubSpot.

**ABM, 8 cuentas.** Correo personalizado con su anuncio en Meta, 4 toques (días 0, 3, 7 y 12), desde un único buzón:

| Vertical | Cuentas | Estado | Campaña |
|---|---|---|---|
| Formación | 2 | Activa desde el 27-oct | 4213037 |
| Reformas | 6 | Pendiente del ok a la secuencia (`bus/out/outbound-abm-reformas-secuencia-28oct.md`) | 4213038 |

De las 30 cuentas del piloto en Notion, las 22 restantes se cargan a medida que haya un decisor verificado.

## 3. Lo ya cargado y enviado

**Leads de Apollo cargados en campañas de señal (desde el 20-oct)** [C]:

| Día | Leads |
|---|---|
| 20-oct | 102 |
| 21-oct | 160 |
| 22-oct | 172 |
| 27-oct | 58 |
| **Total** | **492** |

Por campaña, de esos 492:

| Campaña | Leads |
|---|---|
| Google Ads | 206 |
| Meta | 99 |
| LinkedIn Ads | 64 |
| Salesforce | 27 |
| Odoo | 22 |
| HubSpot (V3) | 38 |
| Pipedrive | 19 |
| Zoho | 17 |

**Envíos de email frío de Qualivo** [C]:

| Periodo | Correos | Respuestas |
|---|---|---|
| Octubre (al 27-oct) | 2.697 | 65 |
| Semana del 19-oct | 1.373 | 41 |
| 26 y 27-oct | 600 | 10 |

**Resultado:** 1 reunión agendada (Habitabio, 12-nov), salida de la campaña de señal de Meta. Hay además 2 conversaciones abiertas:
- Siello, por WhatsApp;
- Tunergia, que pide retomarlo en diciembre.

**Créditos de Apollo:** se han gastado unos 1.000 desde el 20-oct [E]. Quedan unos 2.500 hasta el 14-nov [E].

## 4. Barandillas (decisión del 27-oct)

- **Identificación y baja:** el primer correo identifica a Qualivo y ofrece la baja. Cada baja se ejecuta en el momento: bloqueo del dominio y pausa del lead. En octubre se ejecutaron 15 [C].
- **Direcciones:** solo profesionales y verificadas. Se descartan catch-all, dominio cruzado, buzones de rol y particulares.
- **Registro:** cada lead guarda la fuente (Apollo + fecha) y la señal comprobada (`origen` y el texto del primer correo).
- **Parada automática** de una campaña si:
  - las bajas o quejas superan el 1%;
  - o el rebote supera el 3%.
- **Exclusiones:** despachos legales (desde el 22-oct, por bajas), agencias, software y selección de personal.
- **Control diario:** guardián de reenvíos, alarma de depósito, triaje de respuestas cada hora e informe a las 17:30.

## 5. Objetivo de reuniones y coste

**Ritmo real hasta hoy:** 1 reunión por unos 2.700 correos [C], con 1 reunión de origen frío en todo octubre.

**Objetivo para noviembre: 3-4 reuniones cualificadas de outbound [E].**
- ~6.000 correos al ritmo actual dan 2.
- La comprobación de la señal y las verticales de formación y reformas, alineadas con Paid, deberían subirlo a 3-4.

**Coste variable de noviembre** [E]:

| Concepto | Coste |
|---|---|
| Créditos de Apollo | ~2.000-2.200 (casi todo el saldo) |
| Smartlead y buzones | Ya pagados, sin coste añadido |

Coste por reunión: unos 550-700 créditos de Apollo [E].

**Qué se aplica de lo aprendido con Kubysoft:**
- **Preselección a mano antes de enviar:**
  - en señal, se hace con la comprobación automática en la web más una revisión por muestreo de la lista antes de cargarla;
  - en ABM, cuenta por cuenta.
- **Alerta con 3 o más clics → pasar a comercial:**
  - en las campañas de señal no se puede, porque van en texto plano sin seguimiento (es lo que protege la entrega);
  - en el ABM sí (va en HTML y lleva enlace): con 3 o más clics se avisa a Maikel con las fechas de los clics y el mensaje enviado.
  - Se monta con el triaje horario.

## 6. Decisiones para Maikel (máximo 3)

1. **Ok a la secuencia del ABM de reformas** (2 minutos). Con él se activan las 6 cuentas.
2. **Permiso de Apollo para la carga automática.** Hay que añadir `mcp__Apollo_io__apollo_people_bulk_match` a `.claude/settings.json`. Sin ese permiso, la carga diaria se para cada vez que el contenedor se reinicia: le pasó el 27 y el 28-oct.
3. **Retirar goqualivo y gotqualivo** de las campañas. Lo decidió el Chief of Staff; el sistema exige que Maikel lo confirme en el chat de Outbound.
