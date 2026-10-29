# Al Milímetro · montaje de los flujos en GoHighLevel

> ↩️ **VUELVE A VALER (29-oct, 14:00):** GHL con plan de agencia es el motor estándar. La versión al día, adaptada a Wazzap y con los pasos clic a clic, está en `automatizaciones/plataforma/2026-10-29-montaje-agencia.md`. Esta hoja queda como borrador previo.

Hoja de montaje del 29-oct-2026, preparada por Automatización para el agente de Al Milímetro.
Base: `propuestas-wip/sistema/mensajes.md` (rama `claude/al-milimetro-landing`), con
los mensajes W1-W12 y E1-E4. Aquí está **cómo se montan**. Los textos están en ese fichero.

> **Modo prueba hasta la reunión con Sonia (viernes 30):** todos los workflows llevan en
> el disparador el filtro **«Contact tag includes `am-prueba`»**. Solo reaccionan a
> contactos de prueba internos. Para pasarlos a real se quita ese filtro, y eso
> necesita el **OK de Maikel**, porque a partir de ahí escriben a leads.

## Por qué es una hoja de montaje y no está montado

1. En esta sesión **no hay token de GHL**: no está en las variables de entorno. Va al informe.
2. Aunque lo hubiera, **la API de GHL no crea workflows**. Solo crea etiquetas, campos, valores personalizados, contactos y oportunidades. Los workflows se montan en la interfaz, clic a clic; esta hoja está pensada para hacerlo en unos 60-90 minutos.

## Hallazgos que condicionan el montaje

- **La landing-v2 no envía los leads a ningún sitio.** El formulario «Calcula tu reforma» calcula y enseña el resultado, pero no hace ningún `fetch`. Hay que conectarlo a la entrada del paso 4 (WF0). Lo bueno: los descartes (tipo, zona, acabados) se resuelven en pantalla y **no se envían**, que es lo que pidió Sonia («los descartados no entran en la base de datos»). W4 solo hace falta para los leads que entren por formulario de Meta o por WhatsApp.
- **Ventana de 24 h de WhatsApp.** Todo mensaje que inicia el negocio es una **plantilla aprobada por Meta**. Eso incluye los **avisos a Sonia**: salen del número del negocio a su móvil personal. Hay que añadir una plantilla de utilidad `am_aviso_sonia` («{{1}}») o mandarle los avisos por SMS o email interno mientras no esté aprobada.
- **El horario no es una franja única:** de lunes a jueves de 9:00 a 19:00 y los viernes de 9:00 a 15:00. Se resuelve con el bloque «¿En horario?» de abajo.

---

## 1. Etiquetas

| Etiqueta | Para qué |
|---|---|
| `am-prueba` | **Llave del modo prueba.** Solo los contactos con esta etiqueta entran en los flujos. |
| `am-nuevo` | Dispara el primer contacto (WF1). La pone WF0. |
| `am-a` · `am-b` · `am-c` · `am-revision` | Clase del lead, según la landing o el formulario. |
| `am-respondio` | Ha contestado: paran todas las secuencias. |
| `am-visita` | Tiene visita reservada. |
| `am-presupuesto` | Presupuesto enviado (WF4). |
| `am-mas-adelante` | Ha pulsado «Más adelante»: pasa a C. |
| `am-stop` | Parada manual de Sonia o de Maikel: sale de todo. |

## 2. Campos personalizados (contacto)

`am_tipo_obra` (texto: «tu piso», «tu chalet», «la cocina y el baño») · `am_zona`
(municipio o barrio) · `am_cp` · `am_m2` · `am_cuando` · `am_presupuesto` ·
`am_frase` (segundas preguntas) · `am_clase` (A/B/C/revision) · `am_visita_direccion`
(«tu casa de Majadahonda») · `am_presupuesto_fecha` (fecha) · `utm_source`,
`utm_medium`, `utm_campaign`, `utm_content`.

## 3. Valores personalizados (subcuenta)

`am_whatsapp_negocio` (número nuevo) · `am_sonia_movil` (aviso) · `am_enlace_panel`
(Intelligence `?sector=almilimetro`).

## 4. Pipeline y calendario

- **Pipeline «Reformas»:** Nuevo → Contactado → Visita reservada → Visita hecha → Presupuesto enviado → Ganado / Perdido.
- **Calendario «Visita técnica»** (de Sonia): los huecos que dé el lunes 2-nov. Recordatorios propios del calendario **desactivados**, porque los manda WF3.

## 5. Bloque reutilizable «¿En horario?»

En cada envío que no sea inmediato (todo menos W2 y E1), antes de la acción:

```
If/Else «¿En horario?» (Europe/Madrid)
  Rama SÍ  = (día de la semana es lun, mar, mié o jue  Y  hora entre 09:00 y 18:59)
           O (día de la semana es vie  Y  hora entre 09:00 y 14:59)
  Rama NO  → Wait «hasta la siguiente franja»:
             Wait → Advanced window: lun-vie, 09:00-09:15 → volver al If/Else
```

> Verificar al montar que el If/Else de la subcuenta ofrece las condiciones de día de
> la semana y de hora. Si no, la alternativa es el **Wait con «Advanced window»**
> (lun-jue, 9:00-19:00) más un segundo Wait solo para el viernes (9:00-15:00).

**En todos los workflows, en Settings:** zona horaria Europe/Madrid, «Allow re-entry» desactivado y **«Stop on response» activado**.

---

## 6. Workflows

### WF0 · Entrada (landing → CRM)

- **Disparador:** *Inbound Webhook*. La URL se pega en la landing-v2: al terminar el formulario, `POST` con nombre, teléfono, email, todas las respuestas, la clase y las UTM.
- **Acciones:** crear o actualizar el contacto → rellenar los campos del paso 2 → etiqueta de clase (`am-a`/`am-b`/`am-c`/`am-revision`) → **en pruebas, solo si el email es @qualivo.io o @almilimetroreformas.com: añadir `am-prueba`** → crear la oportunidad en «Nuevo» → añadir `am-nuevo`.
- **No crea nada** si el formulario fue descartado (la landing no lo envía).

### WF1 · Primer contacto (confirmación) · mensajes W1, W2, W3 y E1, y aviso de lead A

- **Disparador:** etiqueta añadida `am-nuevo` · filtro `am-prueba`.
- **Acciones:**
  1. **E1** por email, al momento y a cualquier hora.
  2. Si `am-revision` → **W3** (si no contestó ya las segundas preguntas en la página) → fin.
  3. Bloque horario **sin espera**: en horario → **W1** · fuera → **W2**. `{{3}}` vale «mañana por la mañana» (lun-jue) o «el lunes por la mañana» (vie desde las 15:00 y fin de semana).
  4. Si `am-a` → **aviso a Sonia** «Nuevo contacto A…» (si es fuera de horario, espera a las 9:00).
  5. Etapa → «Contactado». Añadir a WF2.

### WF2 · Seguimiento sin respuesta · día 1 y 3 por WhatsApp, días 3, 7 y 14 por email

- **Disparador:** añadido desde WF1 · filtro `am-prueba`. **Stop on response** activado.
- **Acciones:**
  1. Wait 2 h (en horario) → si A: **aviso a Sonia** «Llámale hoy» · si B: asistente de voz (fase 2, de momento sin acción).
  2. Wait 1 día → bloque horario → **W5** (versión sin fotos, hasta que Sonia confirme cuáles son suyas).
  3. Wait 2 días (día 3) → bloque horario → **W6** + **E2**.
  4. Wait 4 días (día 7) → **E3**.
  5. Wait 7 días (día 14) → si B o C: **E4**.
- **Regla de 2:** W5 y W6 son los dos únicos WhatsApp seguidos sin respuesta. No hay un tercero.
- **Botón «Más adelante» de W6** → WF6.

### WF3 · Visita (confirmación y recordatorio) · W7 y W8

- **Disparador:** *Appointment booked* en el calendario «Visita técnica» · filtro `am-prueba`.
- **Acciones:** **quitar de WF2** → `am-visita` → etapa «Visita reservada» → **W7** (día, hora y `am_visita_direccion`) → Wait hasta 1 día antes de la cita, ajustado a horario → **W8**.
- **Botón «Necesito cambiarla» de W8** → aviso a Sonia.

### WF4 · Recuperación del presupuesto · W9 a W12

- **Disparador:** etapa cambiada a «Presupuesto enviado» · filtro `am-prueba`. **Stop on response** activado.
- **Acciones:** `am-presupuesto` → Wait 2 días → **W9** → Wait 5 → **W10** → Wait 7 → **W11** → Wait 7 → **W12** → **tarea a Sonia**: «Marcar como perdido con motivo». No se pasa a «Perdido» automáticamente, porque el motivo lo pone ella.

### WF5 · Ha contestado → aviso a Sonia y parada

- **Disparador:** *Customer replied* (WhatsApp o email) · filtro `am-prueba`.
- **Acciones:** `am-respondio` → **quitar de WF2 y WF4** → **aviso a Sonia** «{{nombre}} te ha contestado por WhatsApp: "{{primeras palabras}}"».
- Si la respuesta es el botón «Hoy me viene bien» o «Mejor mañana» de W1 → el mismo aviso, con la preferencia.

### WF6 · Paradas

- **Disparador A:** Sonia cambia la oportunidad de etapa a mano → quitar de WF2 (y de WF4 salvo que la etapa sea «Presupuesto enviado»).
- **Disparador B:** etiqueta `am-stop` → quitar de todos los workflows de Al Milímetro.
- **Disparador C:** botón «Más adelante» de W6 → quitar de WF2 → `am-mas-adelante` + `am-c` → (nutrición de C, de momento no, porque sus emails están por escribir).

### WF7 · Resumen diario a Sonia (9:00, de lunes a viernes) · PROPUESTO, no se monta hoy

GHL no hace bien recuentos programados. Se hará en n8n contra la API de GHL cuando
haya token, con el texto de `mensajes.md`.

---

## 7. Prueba (hoy, solo con contactos internos)

| # | Caso | Contacto de prueba | Qué tiene que pasar |
|---|---|---|---|
| 1 | Lead A en horario | Prueba A (móvil interno + `am-prueba`) | E1 + W1 + aviso a Sonia (en pruebas, a un móvil interno, no al de Sonia) |
| 2 | Lead B fuera de horario | Prueba B, viernes después de las 15:00 o simulado | E1 + W2 con «el lunes por la mañana» y nada más hasta las 9:00 |
| 3 | Revisión | Prueba R | E1 + W3 |
| 4 | Contesta a W1 | Prueba A responde | Aviso «te ha contestado» y salida de WF2 (no llega W5) |
| 5 | Reserva visita | Prueba B reserva | Salida de WF2 + W7, y W8 la víspera |
| 6 | Presupuesto | Mover Prueba B a «Presupuesto enviado» | W9 a los 2 días (acortar las esperas a minutos solo para la prueba) |
| 7 | Contacto **sin** `am-prueba` | Contacto normal | **No le llega nada** |

**Mientras se prueba, `am_sonia_movil` apunta a un móvil interno de Qualivo**, no al de Sonia.

## 8. Lo que falta para pasarlo a real (mañana, después de la reunión)

1. Token de GHL de la subcuenta (para el WF7 y para verificar) y el OK de Maikel para quitar `am-prueba`.
2. Número nuevo dado de alta en la API de WhatsApp, y las **12 plantillas + `am_aviso_sonia`** aprobadas por Meta.
3. Dominio de Sonia verificado (SPF y DKIM) y su dirección de envío.
4. Huecos de Sonia en el calendario y el móvil para los avisos.
5. La landing-v2 enviando el formulario al webhook de WF0.
