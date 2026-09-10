# CÓMO HABLAS CON ELLOS Y CÓMO TE REPORTAN

La regla que lo gobierna todo: **tú hablas con el Cerebro. El Cerebro habla con los seis.**

Si empiezas a darle instrucciones a cada agente por tu cuenta, el orquestador vuelves a ser tú y
el Cerebro se queda ciego: prioriza sin saber lo que le has pedido a los demás. Bajas a un agente
concreto solo cuando quieres trabajar dentro de su territorio.

```
                        TÚ
                        │
              ┌─────────┴─────────┐
              │                   │
        por defecto          cuando trabajas
              │              en un territorio
              ▼                   ▼
          CEREBRO ──────▶ Content · Demand · Outbound
              ▲              SDR · Sales · Ops
              │                   │
              └───────────────────┘
                   bus/out/*.jsonl
```

---

# PARTE 1 · CÓMO LES HABLAS

## Las tres formas, y cuándo usar cada una

| Forma | Cómo | Cuándo |
|---|---|---|
| **Al Cerebro** | abres su sesión y escribes | por defecto, para todo |
| **A un agente** | abres su sesión y escribes | cuando quieres trabajar dentro de su territorio |
| **Timbre** | disparas su rutina poke con texto | cuando no quieres abrir nada y da igual que tarde |

## Los cuatro prefijos

Van en la primera línea. Sirven para que el agente sepa qué esperas antes de leer nada.

```
[ENCARGO]     quiero que hagas algo. Vas a devolverme un parte cuando esté
[PREGUNTA]    quiero saber algo. No toques nada
[DECISIÓN]    te respondo a algo que me pediste. Ejecuta
[URGENTE]     para lo que estés haciendo
```

## Plantilla de encargo

No hace falta que sea largo. Hace falta que tenga las cuatro cosas:

```
[ENCARGO]
Qué quiero:      subir la tasa de respuesta de la campaña de gestorías
Por qué ahora:   es el número que está más lejos del objetivo del mes
Cómo sé que va:  respuestas por cada 100 envíos, esta semana vs la pasada
Hasta dónde:     puedes cambiar el asunto y el primer párrafo. El precio y el
                 canal no se tocan
```

Ese último bloque es el que evita el 90% de los problemas. Si no dices hasta dónde, el agente o se
queda corto y te pregunta todo, o se pasa y toca lo que no debía.

## Si no dices nada

El agente asume que sigue el sprint de la semana. **El silencio no es una orden nueva.** Ningún
agente empieza algo grande porque hoy no le hayas escrito.

---

# PARTE 2 · CÓMO TE REPORTAN

## Solo lees tres cosas

| Cuándo | Qué | Quién | Longitud |
|---|---|---|---|
| Cada mañana 08:00 | Morning Brief | Cerebro | una pantalla |
| Viernes 13:00 | CEO Brief | Cerebro | dos pantallas |
| Día 1 | Cierre financiero | Cerebro | una pantalla |

**Ningún agente te escribe directamente.** Escriben su parte al bus, el Cerebro lo consolida y te
llega una sola cosa. Si seis agentes te reportan a diario, tu día es leer informes.

## Morning Brief · lo que ves cada mañana

```
─────────────────────────────────────────────
QUALIVO · 11 sep, jueves
─────────────────────────────────────────────

1 · TE ESPERAN 2 DECISIONES
   A) Outbound quiere probar asunto nuevo en gestorías (🟡)
      Recomiendo: sí. Riesgo bajo, la variante actual lleva 3 semanas plana.
      → "sí" / "no" / "luego"

   B) Google Ads: se cumplen 2 de las 3 condiciones (🔴, 450 €)
      Recomiendo: esperar al cobro de Eleva. Falta esa condición.
      → "enciende" / "espera"

2 · NÚMEROS
   Conversaciones semana      7 de 10      funnel-diario.csv · 10 sep
   Propuestas mes             3 de 8-10    GHL · 10 sep
   Recurrente                 4.100 €      Quipu · 1 sep
   Runway                     SIN DATO     falta cierre de agosto

3 · SALUD
   Todo verde. 23 de 23 rutinas.

4 · AYER
   Outbound   142 envíos, 6 respuestas
   SDR        4 respuestas trabajadas, 1 reunión el viernes
   Sales      propuesta de Equilibrha enviada
   Demand     3 radiografías
   Content    2 artículos, 1 carrusel
   Ops        clave de Smartlead movida fuera del scratchpad

5 · HOY
   Sales     dossier de la reunión de Grup Montaner
   SDR       llamar a las 3 radiografías de ayer
   Outbound  cargar 80 leads del segmento asesorías

6 · RIESGOS
   Emana lleva 9 días sin actividad. Sales tiene tarea para hoy.
─────────────────────────────────────────────
```

Si un día no hay nada que decidir, el punto 1 dice "nada" y es una buena noticia.

## Qué te puede interrumpir fuera del brief

Solo cuatro cosas. Todo lo demás espera a mañana.

1. Un lead caliente que rompe el SLA y necesita algo tuyo.
2. Un cliente en riesgo.
3. Algo caído: web, envíos, cobros.
4. Una decisión de dinero que caduca hoy.

## Cómo respondes a una decisión

En una palabra, en el mismo sitio donde te llegó. El Cerebro se encarga del resto: ejecuta,
avisa al agente y lo registra en Notion.

```
"A sí, B espera"
```

Eso es una respuesta completa. No hace falta más.

## Si no respondes

| Color | A las 48 h sin respuesta |
|---|---|
| 🟡 | caduca. El agente sigue con lo siguiente y queda registrado como no hecho |
| 🔴 | se queda esperando indefinidamente. Nunca se ejecuta solo |

**Nada se auto-aprueba jamás.** El coste de no responder es que no pasa, nunca que pase sin ti.

## El parte que devuelve un agente

Cuando le hablas directamente a uno, termina siempre así:

```
STATUS              hecho / en curso / bloqueado
OBJECTIVE           qué le pediste
ACTIONS             qué hizo
RESULTS             qué pasó
METRICS             cifra + fuente + fecha, o SIN DATO
ISSUES              qué se ha encontrado
DECISIONS_REQUIRED  qué necesita de ti, con recomendación
NEXT_ACTION         qué hace después
HEALTH              si algo suyo está roto
ATTENTION_SPENT     cuántas decisiones tuyas ha consumido
```

Si un agente te contesta sin este bloque, está mal configurado.

---

# PARTE 3 · TUS DOS RITUALES

Dos momentos al día, nada más.

**08:00 · Leer el brief y decidir.** Cinco minutos. Respondes las decisiones y no abres nada más.
Las 09:00 a 11:00 son tuyas para vender.

**18:00 · Cerrar.** Le dices al Cerebro cómo ha ido lo tuyo: reuniones, lo que has cerrado, lo que
has aprendido. Es lo único que él no puede ver por su cuenta, y sin eso el viernes no aprende.

```
[DECISIÓN] Cierre del día.
Reuniones: Grup Montaner, buena, quiere propuesta el lunes.
Cerrado: nada.
Aprendido: les preocupa más el tiempo del equipo que el coste.
```

Esa última línea vale más que todos los CSV juntos. Es la única fuente de Voice of Customer que
tienes hasta que haya llamadas transcritas.

---

# PARTE 4 · A QUIÉN LE HABLAS SEGÚN LO QUE QUIERAS

| Quiero... | Hablo con |
|---|---|
| saber cómo va todo | Cerebro |
| cambiar la prioridad del mes | Cerebro |
| saber si llego a fin de mes | Cerebro |
| más leads o cambiar el ICP | Outbound |
| que persigan a alguien concreto | SDR |
| preparar una reunión o una propuesta | Sales |
| cambiar la web o la Radiografía | Demand |
| publicar sobre algo concreto | Content |
| que algo deje de fallar | Ops |
| una idea nueva que no sé de quién es | Cerebro. Él la asigna o la rechaza |

La última fila es la importante. Cuando dudes, Cerebro. Para eso está el Focus Guardian: si la
idea no mueve un número, te lo dice antes de que nadie gaste una hora.
