# [PARA CEREBRO] La máquina de las siete puertas está apagada · 29-sep-2026

Escrito por Outbound en la rutina diaria del 29-sep. Dos cosas que necesitan decisión de Maikel
y una que se puede ejecutar hoy mismo.

## 1. BLOQUEO · seis de las siete puertas están COMPLETED

La rutina diaria manda cargar leads por puerta. No se puede: las campañas no están activas.

| Puerta | Campaña | Estado real | Leads |
|---|---|---|---|
| Anuncios | ICP02 · 3918859 | **COMPLETED** | 0 |
| CRM | ICP08 · 3918858 | **COMPLETED** | 15 |
| Base acumulada | ICP15 · 3918857 | PAUSED | — |
| Multiservicio | 3918544 | **COMPLETED** | 15 |
| Mide pero no captura | ICP12 · 3918868 | **COMPLETED** | — |
| Dirección nueva | ICP10 · 3918872 | **COMPLETED** | — |
| Equipo comercial | ICP05 · 3918864 | **COMPLETED** | — |

Cargar leads en una campaña COMPLETED no envía nada. **El motor de las siete puertas no está
funcionando desde hace días, y la rutina diaria sigue describiéndolo como si estuviera vivo.**

Lo único que envía hoy por Qualivo son tres campañas, todas con el depósito agotado:
Clínicas (198 leads), Formación (94), Lista ActiveCampaign (62).

**Decisión que necesito:** reabrir las puertas (duplicar cada campaña a una nueva ACTIVE, nunca
POST de secuencia sobre una con leads en curso) o concentrar todo en dos puertas. Ver punto 3.

## 2. Capacidad real: 725/día, no 475

26 buzones, no 15. Reparto real:

| Dominio | Buzones | Límite/día |
|---|---|---|
| goqualivo.com | 3 | 165 |
| gotqualivo.com | 2 | 110 |
| qualivoedge.com | 5 | 150 |
| novaqualivo.com | 5 | 100 |
| **Qualivo (total)** | **15** | **525** |
| scubalight* (cliente) | 11 | 200 |

Ninguno con reputación por debajo del 80%. **Descartado el falso positivo:** los 10 buzones de
`scubalightstudiosboost/pulse` daban 0% porque no tienen datos de warmup, no porque estén
quemados. No se tocan.

**Riesgo real distinto, ese sí:** esos 10 buzones están sobre dominios creados el **25-sep** y ya
envían a 15/día sin warmup registrado. Cuatro días de antigüedad. Eso quema dominios. Es
infraestructura de un cliente (DKR · Open Playtest), así que lo dejo señalado, no lo toco.

## 3. HALLAZGO · la puerta que gana es la que menos volumen tiene asignado

Sonda a las webs de las empresas que SÍ generaron reunión o respuesta este mes:

| Dominio | Resultado | GTM | GA4 | Píxel Meta | Google Ads | Formularios |
|---|---|---|---|---|---|---|
| alphamediagroup.es | 2 reuniones | ✅ | — | ✅ | — | 1 |
| miauniversity.es | 2 reuniones + propuesta | ✅ | ✅ | ✅ | — | 1 |
| aslagreensolutions.com | reunión + propuesta | ✅ | ✅ | — | — | 1 |
| dataslayer.ai | reunión | ✅ | — | — | — | 0 |
| talkualfoods.com | reunión + propuesta | ✅ | — | — | — | 20 |

(anticbarcelona113.es, kybos.es y kubysoft.com bloquean la sonda; no entran en el recuento.)

**GTM en 5 de 5. Formularios ≤1 en 4 de 5. Google Ads en 0 de 5. Píxel de Meta en solo 2 de 5.**

Eso es exactamente la puerta **"Mide pero no captura" (ICP12): gtm/ga4 presente y formularios ≤1.**
Miden su tráfico y no tienen por dónde capturarlo. Es la fuga que mejor sabemos nombrar y la que
más se parece a las empresas que nos cogen el teléfono.

Y es la puerta con **8 leads/día asignados**, mientras "Anuncios" tiene 20-25/día y solo 2 de 5
ganadoras llevan píxel de Meta.

### Límite honesto de este hallazgo
Son 5 empresas. La regla del propio sistema es 7 días y 100 envíos antes de decidir por puerta.
Esto no prueba nada todavía: es una hipótesis lo bastante fuerte como para merecer el volumen
que hoy se lleva otra puerta. Además, 9 de las 15 reservas del mes entraron con correo personal
(gmail/yahoo) y no tienen dominio que sondear — de esas no sabemos nada y son la mayoría.

## 4. Tensión de ICP que hay que resolver

Las reuniones del mes están dominadas por **formación**: ProAudio, CPD Ceprovic, Sabarea
Flamenco, Ágape Cuerpo y Arte, EHE/MIA University, y Kybos respondiendo al correo de cierre.

Pero la rutina diaria dice **"academias 3608540 NO cargar"**, y el ICP oficial pide empresas de
servicios de 5-50 personas con piezas montadas y suelo de 500 €/mes en captación. Las academias
pequeñas que reservan con un gmail no pasan ese filtro.

Las dos lecturas posibles, y son opuestas:
- **a)** Las academias reservan pero no compran — y entonces el filtro está bien y hay que dejar
  de atraerlas, porque están llenando el calendario de no-presentados (el pipeline marca 5).
- **b)** El ICP oficial está dejando fuera al único segmento que contesta.

No lo puedo resolver yo: hace falta saber cuántas de esas reuniones llegaron a propuesta. **Es
material para el informe de patrones del viernes.**

## Qué propongo para hoy

1. Reabrir **dos** puertas, no siete: "Mide pero no captura" y "CRM". Concentrar los 525/día de
   Qualivo ahí en vez de repartir entre siete campañas que no llegan a 100 envíos ninguna.
2. Sondar antes de enriquecer (palanca 2), que es el cuello declarado. Sin gastar un crédito de
   Apollo hasta que la sonda diga que el dominio tiene GTM y ≤1 formulario.
3. No cargar academias hasta que el viernes diga si compran o solo reservan.

Pendiente de ok de Maikel: los puntos 1 y 2 tocan campañas y créditos.
