# Outbound → Paid (CoS en copia) · propuesta de buzones nuevos (29-oct)

Lo pide el CoS tras el «vale a todo» de Maikel del 29-oct: el objetivo es conseguir al menos 2 clientes más en noviembre. Esto es solo la propuesta; no se compra nada hasta que Maikel confirme el pago en el ritual del 30-oct. [C] es un dato confirmado; [E], una estimación.

## Las dos opciones

| | A · 1 dominio | B · 2 dominios |
|---|---|---|
| Buzones nuevos | 5 | 10 |
| Coste al mes [E] | ~40 € (5 licencias de Google Workspace a ~8 €) | ~80 € |
| Coste de los dominios [E] | ~12 €/año | ~24 €/año |
| Smartlead | Sin coste añadido: el calentamiento va incluido en el plan actual [E] | Igual |
| Correos/día que añaden cuando estén calientes | +150 (30 por buzón) | +300 |

Los buzones actuales son de Google Workspace (el MX de qualivoedge y novaqualivo apunta a Google) [C]. Los nuevos se montarían igual, con SPF, DKIM y DMARC desde el primer día.

## Calendario si se compra el viernes 30-oct

| Fecha | Qué pasa |
|---|---|
| 30-oct | Compra, DNS y alta en Smartlead con calentamiento |
| 30-oct al 19-nov | Calentamiento de 3 semanas, sin envíos en frío |
| 20-nov | Empiezan a enviar en frío a 10/día por buzón |
| 23 al 27-nov | Suben a 20-30/día por buzón |

**Lo que aportan en noviembre** [E]: unos 1.000-1.500 correos con la opción B (500-750 con la A). El efecto completo, +150 o +300 al día, llega en diciembre.

## Lo que hay que saber antes de pagar

**Hoy el cuello de botella son los leads, no los buzones.**
- La capacidad actual es de ~300/día y ayer salieron 252 [C].
- El depósito de leads está en 2,2 días, por debajo del suelo de 3 [C].
- Para llenar 300 buzones-día más hacen falta ~100 leads nuevos al día más.

Los buzones solo suman si la carga sube a la vez, con la Biblioteca de anuncios de Meta como fuente principal (decisión del CoS del 29-oct) y Apollo solo para encontrar al decisor.

**Créditos de Apollo:** con la opción B y la carga a ~200 leads/día, los ~2.000 créditos previstos para noviembre no llegan. Harían falta ~1.000-1.500 más en diciembre [E].

**Recomendación de Outbound:**
1. Comprar ya la opción A, porque el calentamiento son 3 semanas y cada semana de retraso es una semana menos en diciembre.
2. Decidir la B el 13-nov, en la revisión, si la carga con la Biblioteca de anuncios llega a 150 leads/día o más.
