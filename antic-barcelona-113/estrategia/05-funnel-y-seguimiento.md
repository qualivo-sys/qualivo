# 05 · El funnel y el seguimiento de leads

> **La campaña no se gana en Meta. Se gana entre el minuto 0 y la hora 2 después
> del formulario.**

## 1. El recorrido completo

```
   ANUNCIO META
        │
        ▼
   LANDING  ─────────────► ViewContent (scroll 50 %)
        │
        ├──► CTA "Diseña tu pieza" ──────────┐
        │                                     │
        └──► CTA "Descargar la guía"          │
                    │                          │
                    ▼                          │
             LEAD MAGNET                       │
          (nombre · email · WhatsApp)          │
                    │                          │
                    ▼  Lead                    │
             GRACIAS + PDF por email           │
                    │                          │
                    └──────────────────────────┤
                                               ▼
                                      CUESTIONARIO · 6 pasos
                                      1. ¿Qué pieza?
                                      2. ¿Dónde irá?
                                      3. ¿Qué medidas?
                                      4. ¿Qué estilo?
                                      5. ¿Qué presupuesto?
                                      6. ¿Qué plazo?
                                               │
                                               ▼ CompleteRegistration
                                          SCORING AUTOMÁTICO
                                     ┌─────────┼─────────┐
                                     ▼         ▼         ▼
                                   HOT       WARM      COLD
                            WhatsApp    Email +    Secuencia
                            en < 2 h    seguim.    de contenido
                                 │      a 7 días
                                 ▼
                            LLAMADA / VISITA AL TALLER
                                 │
                                 ▼
                            PRESUPUESTO
                                 │
                                 ▼
                              VENTA  → Purchase
```

## 2. Las dos puertas de entrada

El funnel tiene dos entradas deliberadamente distintas, porque hay dos tipos de visitante:

| | **Puerta fría — la guía** | **Puerta caliente — el cuestionario** |
|---|---|---|
| Para quién | Está explorando, no tiene proyecto definido | Ya tiene un espacio y un problema concreto |
| Fricción | Baja (3 campos) | Media (6 pasos, 2 min) |
| Volumen | 70-110/mes | 20-30/mes |
| Valor por lead | Bajo | Alto |
| Papel | **Evento de optimización** — da señal a Meta | **Evento de negocio** — alimenta al comercial |

Un visitante que llega por la guía puede pasar al cuestionario después (la pantalla de
gracias lo empuja). Un visitante decidido va directo al cuestionario. **No hay que
forzar a nadie a pasar por la guía.**

## 3. El scoring — lo que ya está construido

```js
if (plazo === 'Solo estoy explorando')            → COLD
if (pieza && espacio && medidas && plazo≤3meses
    && presupuesto)                                → HOT
else                                               → WARM
```

| Tier | % esperado | Qué significa | SLA de respuesta |
|---|---|---|---|
| 🔥 **HOT** | 20-30 % | Proyecto definido, presupuesto y plazo cercano | **WhatsApp en < 2 h laborables** |
| 🟡 **WARM** | 45-55 % | Tiene proyecto pero sigue explorando | Email + WhatsApp en 24 h |
| 🔵 **COLD** | 20-30 % | Inspiración. Sin proyecto | Secuencia automática. Sin llamada |

**Mejora propuesta al scoring actual:** el sistema actual no distingue por presupuesto
declarado. Sugerimos añadir un cuarto tier:

> **💎 PRIORITY** = HOT + presupuesto declarado > **[SUPUESTO 4.000 €]** + plazo "lo antes
> posible" → **llamada de teléfono en < 30 min**, no WhatsApp.

Con 1-2 ventas al mes, perder un PRIORITY por contestar tarde es perder el mes entero.

## 4. Las secuencias

### 4.1 Puerta de la guía (todos los que descargan)

| Momento | Canal | Contenido | Objetivo |
|---|---|---|---|
| **Inmediato** | Email | Guía en PDF adjunta + enlace de descarga | Cumplir la promesa |
| **+10 min** | WhatsApp | "Hola [nombre], te acabamos de enviar la guía por email. Si tienes un espacio concreto en mente, cuéntanoslo y te decimos qué encaja." | Abrir conversación |
| **Día 1** | Email | *Los 3 errores al encargar una mesa a medida* (medidas mal tomadas, madera que no aguanta el uso, plazo mal planificado) | Autoridad |
| **Día 3** | Email | Proyecto real con antes/después + medidas + material | Prueba |
| **Día 5** | WhatsApp | "¿Llegaste a mirar la guía? ¿Te cuadran las medidas de tu comedor?" | Reactivar |
| **Día 8** | Email | Invitación al taller de Terrassa (con horario y cómo llegar) | Salto a offline |
| **Día 14** | Email | El material: de dónde sale el roble centenario | Diferenciación |
| **Día 21** | Email | "¿Seguimos?" → enlace directo al cuestionario | Última llamada |
| Día 21+ | Email | Newsletter mensual de proyectos | Nutrición larga |

### 4.2 HOT — el guion de WhatsApp

**No usar plantilla genérica.** El cuestionario ya dio seis datos: usarlos.

```
Hola [nombre], soy [comercial] de Antic Barcelona 113.

Acabo de ver tu formulario: una mesa de [largo]×[ancho] para el
[espacio], en estilo [estilo].

Eso lo hacemos, y con esas medidas tenemos margen para trabajar el
canto natural. Te puedo enseñar dos o tres piezas parecidas que hemos
hecho y darte una horquilla de precio.

¿Te va bien que te llame [hoy a las X / mañana por la mañana]?
```

Tres cosas que hace bien este mensaje: demuestra que **una persona ha leído** el
formulario, confirma que **es factible** (baja la ansiedad principal) y propone una
**hora concreta** en vez de "cuando puedas".

### 4.3 WARM — a 7 días

Mismo mensaje pero sin propuesta de llamada; en su lugar, envío de 3 proyectos similares
en medidas/estilo y una pregunta abierta: *"¿alguno se parece a lo que tienes en la
cabeza?"*.

### 4.4 COLD — sin comercial

Entran en la secuencia de contenido de la guía y en la audiencia de retargeting de Meta.
No consumen tiempo comercial. Se reactivan solos: en esta categoría, un COLD de enero
compra en septiembre.

## 5. Los cinco números que hay que vigilar en el funnel

| Paso | Conversión objetivo | Si está por debajo… |
|---|---|---|
| Anuncio → Landing (CTR) | 0,8-1,5 % | Problema de creatividad |
| Landing → Formulario | 15-25 % | Problema de landing: promesa, velocidad o CTA |
| Formulario → Cuestionario | 20-35 % | La pantalla de gracias no empuja bien |
| Cuestionario iniciado → completado | 60-75 % | Demasiada fricción. Revisar el paso de presupuesto |
| Cuestionario → Presupuesto enviado | 40-60 % | **Problema comercial, no de marketing** |

> El paso de **presupuesto** en el cuestionario es el que más abandono genera en todos
> los funnels de ticket alto. Por eso está diseñado con la opción *"Prefiero hablarlo"*.
> Mantenerla. Quitar esa salida sube el abandono un 15-20 %.

## 6. CRM mínimo viable

No hace falta comprar nada el primer mes. Hoja de cálculo compartida con estas columnas:

`fecha` · `nombre` · `email` · `teléfono` · `tier` · `pieza` · `espacio` · `medidas` ·
`estilo` · `presupuesto` · `plazo` · `utm_campaign` · `utm_content` · `fbclid` ·
`primer_contacto` · `estado` · `presupuesto_enviado` · `importe` · `resultado` ·
`cómo nos conoció`

Estados: `Nuevo` → `Contactado` → `Cualificado` → `Presupuesto enviado` → `Ganado` / `Perdido` / `Aplazado`

**Mes 3:** migrar a HubSpot free o Pipedrive si el volumen supera los 40 leads/mes.

## 7. La pregunta incómoda para la reunión

> **¿Quién contesta el WhatsApp, en qué horario, y qué pasa un sábado por la tarde?**

Con 1-2 ventas al mes, el margen de error es cero. Un lead HOT que escribe un viernes a
las 19 h y recibe respuesta el lunes a las 10 h **está perdido**: en 63 horas ha mirado
otras tres opciones.

Si el cliente no puede garantizar respuesta en 2 h laborables, hay dos opciones
honestas: **(a)** poner una respuesta automática de WhatsApp Business que fije expectativa
("te respondemos en menos de 24 h laborables") — funciona sorprendentemente bien —, o
**(b)** que la agencia asuma la primera respuesta como servicio, con guion cerrado.

Esto hay que decidirlo **antes** de lanzar, no en el primer informe malo.
