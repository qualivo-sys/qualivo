# Outbound → CoS · diagnóstico de dos incidencias (30-oct)

Lo pidió Maikel para su bloque de las 13:00. [C] es un dato confirmado (Smartlead, Apollo, DNS) y [E] una estimación. No contiene datos personales.

## 1. El depósito está en 2,2 días: ¿por qué se vacía?

### Causa probable

1. **La carga va por detrás del consumo [E].**
   - Con ~250 correos/día y una secuencia de 3-4 pasos, las campañas de señal empiezan ~80 leads nuevos al día [E].
   - La carga ha sido irregular: 86 el 29-oct [C], pero hay días sin carga o a medias.
   - Hoy el agente de carga se quedó parado 90 minutos en la primera revelación de Apollo [C].
2. **La cifra de 2,2 días engaña [C].**
   - De los 1.236 leads en cola, 1.173 son de Infoproducto.
   - Infoproducto tiene un tope de 15 al día, así que esos leads no alimentan el resto de campañas.
   - Las campañas de señal solo tienen **~63 leads** [C], menos de un día de envío.
   - Ya están a 0 [C]: Zoho, LinkedIn Ads, Pipedrive, Salesforce y los dos ABM.
3. **Las fuentes de Apollo se agotan [C].**
   - Las búsquedas por tecnología de Salesforce, Zoho y Pipedrive en España, con nuestro filtro de tamaño (50 empleados o menos), ya devuelven casi solo empresas vistas.
   - Lo que sigue dando volumen: Google Ads, Odoo y, en parte, HubSpot.
4. **El filtro de calidad se come parte de lo revelado [C].**
   - Descartamos los dominios catch-all, los correos sin verificar y los duplicados.
   - Por eso el rendimiento es de ~0,58 leads por crédito con el método nuevo, frente a 0,18 con el anterior.
   - Es el precio de mantener el rebote en el 1,1% [C].
5. **La Biblioteca de anuncios de Meta aún no aporta [C].** Es la fuente que tiene que dar los ~25-30 leads/día que faltan. Growth entrega hoy la primera lista.

### Impacto en las reuniones de noviembre [E]

Supuesto, sin confirmar: de las respuestas de octubre, ~39% eran de personas [C]. Con eso, cada 1.000 leads nuevos dan ~1-2 reuniones con encaje.

| Ritmo de carga | Leads en noviembre (20 días laborables) | Reuniones esperadas |
|---|---:|---:|
| 80/día | ~1.600 | ~2-3 |
| 40/día (vacío intermitente) | ~800 | 1-2 |

El objetivo es de **3 reuniones con encaje** (parte alta 4). **Cada día sin carga cuesta ~0,1-0,15 reuniones** [E].

### Alternativas

| | Qué es | Coste | Riesgo |
|---|---|---|---|
| A | Carga diaria fija como script directo, no como agente: Apollo con filtro previo (~80/día) más la Biblioteca de anuncios en Meta (~25-30/día) | ~140 créditos/día [E]: ~1.550 hasta el 14-nov, con ~2.390 disponibles [E]. 0 € | Bajo. Si se agotan los filtros de CRM, Google Ads y Meta llevan el peso |
| B | Ampliar el ICP: de 50 a 200 empleados, o más sectores | Los mismos créditos por lead | Medio: entran empresas con menos encaje y bajan las reuniones con encaje por cada 1.000 leads |
| C | Fuente extra sin Apollo: Google Maps con Apify por sector y ciudad, con verificación de correo | ~5-10 € por ejecución | Medio: sin señal de inversión publicitaria y más rebote si la verificación falla |

**Recomendación: A ya, con C como reserva** si el 6-nov la carga media está por debajo de 70/día.

Además:
- El depósito pasa a medirse **sin Infoproducto**, para que la alarma enseñe el riesgo real.
- Sin subir volumen, como pide el CoS.

## 2. Reputación del buzón de Kubysoft al 66%

### Lo comprobado [C]

**Buzón y dominio**
- Buzón SMTP de IONOS en kubysoft.es, dado de alta el 1-oct.
- SPF, DKIM (los dos selectores de IONOS) y DMARC (p=none) correctos.
- No está en SURBL ni en Spamhaus DBL.

**Calentamiento**
- 202 correos de calentamiento enviados, **70 en spam (35%)**.
- La proporción se mantiene estable del 23 al 30-oct (8-12 rescatados de spam al día): no mejora con el tiempo.

**Campaña 4071068**
- 69 leads contactados, **4 rebotes (5,8%)**: casi el doble del límite del 3%.
- La autopausa saltó por eso. 0 respuestas.

### Causa probable [E]

1. **Envío por el SMTP compartido de IONOS.**
   - Si la autenticación está bien y el dominio está limpio, lo que queda es la reputación de las IPs compartidas.
   - Por eso un tercio va a spam desde el primer día y no mejora.
   - En Google Workspace o Microsoft 365 no suele pasar.
2. **Lista sin verificar.** Un 5,8% de rebote indica que los correos no pasaron por verificación (catch-all incluidos). Los rebotes castigan la reputación del buzón.
3. **Se envía desde el dominio principal del cliente.** Cada rebote y cada marca de spam afecta también al correo normal de Kubysoft. Ese es el mayor riesgo para la relación con el cliente.

### Impacto en las reuniones de noviembre

- **En las de Qualivo: ninguno.** Es una campaña de cliente y no cuenta para el objetivo de 3.
- **En el cliente: alto.** Lleva parada desde la autopausa y, si sigue así, noviembre se queda sin resultados para Kubysoft. Riesgo de retención [E].

### Alternativas

| | Qué es | Coste | Riesgo |
|---|---|---|---|
| A | Seguir en pausa con el calentamiento, verificar la lista (fuera catch-all y rebotes) y reanudar a 10/día solo con la reputación al 80% o más | 0 € | Bajo para el dominio. Pero con un 35% en spam estable puede no llegar nunca al 80%: semanas sin enviar |
| B | Dominio secundario para Kubysoft (parecido a kubysoft.es) con 2-3 buzones de Google Workspace precalentados, y la lista verificada | ~20-25 €/mes + ~12 €/año el dominio [E]. Lo aprueba el cliente o Maikel | Bajo: protege el dominio principal. Con buzones precalentados, empieza en ~1 semana a 10/día |
| C | Reanudar ya a poco volumen desde el buzón actual | 0 € | Alto: más daño al dominio principal del cliente. Además va contra la regla del CoS de hoy |

**Recomendación: B, con A mientras tanto.**
- La campaña sigue en pausa.
- Verificamos la lista ya.
- Proponemos al cliente un dominio secundario con buzones precalentados.
- El buzón de IONOS se queda para el correo normal de Kubysoft.

## 3. Decisiones de Maikel, con opciones

| Tema | Opciones | Recomendación |
|---|---|---|
| **SURBL** (qualivoedge y novaqualivo listados) | 1) Enviar el formulario de retirada con el texto preparado (`bus/out/outbound-surbl-retirada-29oct.md`), 5 min y 0 €. 2) No hacer nada y dejar que caduque. 3) Retirar los dominios cuando los nuevos estén calientes (20-nov) | **1**, y 3 solo si siguen listados el 20-nov |
| **Lista de Infoproducto** (1.173 leads) | 1) Es de Qualivo: se queda a 15/día, fuera del cálculo del depósito. 2) Es de un cliente: se separa y no cuenta para nada de Qualivo. 3) Se pausa: no la recomiendo; según la regla de Maikel, los envíos nunca se dejan a cero | Decirlo en una línea. Mientras tanto, la saco del cálculo |
| **LinkedIn** (caído desde el 2-oct) | 1) Reconectar la cuenta en HeyReach, 2 min. 2) Dejarlo hasta diciembre | **1**: es un canal gratis y complementa al email |
| **Kubysoft** | La A, la B o la C de la sección 2 | **B, con A mientras tanto** |

## Mientras tanto (reglas del CoS de hoy)

- No subo el volumen.
- No reactivo ninguna campaña con problemas de reputación, Kubysoft incluida.
- Sigo con lo autorizado: la carga con Apollo de hoy, la lista de la Biblioteca de anuncios en Meta, el triaje y el calentamiento de los 10 buzones nuevos.
