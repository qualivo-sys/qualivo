# Plan de infraestructura de envío (escalar volumen)

Objetivo: pasar de ~150/día (5 buzones) a **500-1.000/día** para correr todos los
verticales a tope y acercarse a los 30k/mes. Smartlead ya está (buzones y warmup
ilimitados en el plan Pro) → el coste real son **dominios + seats de email**.

## Reglas de oro (deliverability)
- **~30-40 emails/día por buzón** en frío (nunca más).
- **2-3 buzones por dominio** (no sobrecargar un dominio).
- **Nunca el dominio principal** (qualivo.io) → dominios secundarios que redirigen.
- Cada dominio: **SPF + DKIM + DMARC** + dominio de tracking propio en Smartlead.
- **Warmup 2-3 semanas** antes de enviar en frío desde un buzón nuevo.
- Rampa gradual: empezar 10-15/día e ir subiendo a 30-40.

## Dimensionado por objetivo
| Objetivo/día | Buzones (~30/día) | Dominios (~3 buzones/dom) | Seats email/mes | Dominios/año |
|---|---|---|---|---|
| 300 | 10 | 4 | ~65 € | ~48 € |
| **500 (recomendado)** | **17** | **6** | **~115 €** | **~72 €** |
| 1.000 | 34 | 12 | ~230 € | ~145 € |
| 30k/mes (~1.400/día lab.) | ~50 | ~18 | ~340 € | ~215 € |

*(Seats a ~6-7 €/buzón/mes Google Workspace o Outlook. Dominios ~12 €/año.)*

## Estrategia por vertical (recomendada)
Dale a **cada vertical su propio grupo de dominios** → cada uno corre a tope sin
competir por buzones, y si un vertical tiene problemas de reputación no arrastra a
los demás.
- Formación: 2 dominios / 6 buzones
- Construcción: 2 dominios / 6 buzones
- Clínicas: 2 dominios / 6 buzones
→ 6 dominios · 18 buzones · ~540/día repartidos. (Los 5 actuales quedan de refuerzo.)

## Ideas de dominios secundarios (redirigen a qualivo.io)
getqualivo.com · tryqualivo.com · qualivo-team.com · hey-qualivo.com ·
qualivo-agency.com · goqualivoads.com · (evita guiones raros y números).

## Los 3 caminos para montarlo
1. **Manual (más barato):** compras dominios → Google Workspace/Outlook → DNS →
   conectas a Smartlead → warmup. ~2-3 semanas hasta enviar. Yo te guío el DNS.
2. **Done-for-you (más rápido):** Maildoso / Zapmail / Premium Inbox te entregan
   packs de 10-50 buzones ya configurados y calentando en **días**. ~3-4 €/buzón/mes.
3. **Apollo:** tu Apollo tiene compra de dominios + buzones integrada — camino
   más pegado a tu stack. A explorar.

## Timeline realista
- Semana 0: comprar dominios + crear buzones + DNS.
- Semana 0-2/3: warmup (sin enviar en frío).
- Semana 3: rampa de envío + asignar buzones a cada campaña.
- Semana 4+: 500/día estable.

## Mientras tanto (ya hecho)
- 5 buzones actuales subidos a **30/día = 150/día**.
- En 1-2 semanas se pueden subir a 40/día = **200/día** sin comprar nada.
