# Propuesta · formulario de tamaño para el 12-oct (formación y clínicas) · 8-oct-2026

Respuesta a Maikel ("¿cómo haríamos el formulario nuevo?"). Base: los formularios actuales
`Qualivo_FORMACION_sep2026` y `Qualivo_CLINICAS_sep2026` (tipo "mayor intención", 3 preguntas
+ nombre, empresa, email, teléfono). Es propuesta; se construye con el OK de Maikel.

## Qué cambia y por qué

| hoy | 12-oct | motivo |
|---|---|---|
| ¿Cuánto invertís al mes? | **fuera** | falsada dos veces: repele (apertura→envío 14 %) y no filtra (17 de 20 pasan sin presupuesto) |
| ¿Cuántas solicitudes al mes? | se queda, con los tramos del documento de oferta | es la pregunta que mejor separa B de C |
| ¿Dónde se te escapa? | **fuera** del nativo (la mayoría contesta "no lo sé"); pasa a la landing y al primer WhatsApp | no cualifica; sí sirve para elegir guion de reunión, y eso lo puede preguntar el SDR |
| — | **ticket medio** | lo que más predice la reunión según Ops; nunca se ha preguntado |
| — | **quién decide** | 4 de 11 reuniones sin decisor |
| — | **cuándo** | 5 de 11 "más adelante"; separa encaje de momento |

Cuatro preguntas de negocio, no cinco: Meta recomienda pocas, y cada pregunta cuesta envíos.
El tipo sigue siendo "mayor intención" (pantalla de revisión antes de enviar) para no cambiar
dos cosas a la vez.

## Las preguntas (texto exacto propuesto)

**Formación**
1. ¿Cuántas solicitudes de información recibís al mes?
   Menos de 20 · Entre 20 y 49 · Entre 50 y 99 · Entre 100 y 250 · Más de 250
2. ¿Cuánto paga de media un alumno por un curso o programa?
   Menos de 300 € · Entre 300 y 1.000 € · Entre 1.000 y 3.000 € · Más de 3.000 €
3. ¿Quién decide contratar un servicio como este?
   Yo · Yo con mi socio o gerente · Otra persona
4. ¿Cuándo quieres resolverlo?
   Este mes · En 1 a 3 meses · Más adelante, solo estoy mirando

**Clínicas** (mismo esqueleto)
1. ¿Cuántos pacientes nuevos piden cita o presupuesto al mes?
   Menos de 20 · Entre 20 y 49 · Entre 50 y 99 · Entre 100 y 250 · Más de 250
2. ¿Cuánto vale de media un tratamiento de los que presupuestáis?
   Menos de 300 € · Entre 300 y 1.000 € · Entre 1.000 y 3.000 € · Más de 3.000 €
3. y 4. iguales.

Después: nombre, empresa, email, teléfono (autorrellenados por Meta, como hoy).

Pantalla de gracias: la misma que hoy ("Hecho. Te escribo en unos minutos" + botón "Elegir
hora ahora"). Meta no permite una pantalla distinta según la respuesta, así que en el nativo
el "encaja / todavía no" ocurre en el WhatsApp, no en el formulario.

## Regla de clasificación (la escribe el webhook en GHL como etiquetas)

- **B**: ≥ 50 solicitudes, **o** 20-49 con ticket ≥ 1.000 €.
- **medio**: 20-49 con ticket < 1.000 €.
- **C**: < 20.
- Etiquetas nuevas: `vol-*` (ya existe), `ticket-*`, `decisor-yo` / `decisor-socio` /
  `decisor-otro`, `momento-mes` / `momento-1-3` / `momento-luego`, y `nivel-b` / `nivel-medio`
  / `nivel-c` calculadas. Las etiquetas `inv-*` y `fuga-*` dejan de llegar de estos formularios.

## Qué pasa después del envío, por tipo (esto es cadencia: lo decide Ops, Paid lo propone)

- **B + decide + este mes o 1-3 meses** → primer WhatsApp con el enlace del calendario para
  reservar en el momento (lo de Impulso). Sin precalificación por chat.
- **B + "otra persona decide"** → igual, pero el mensaje pide que esa persona esté en la
  reunión, y la confirmación lo repite.
- **medio** → cadencia actual: el SDR hace la pregunta del dolor ("¿entran y no compran, o
  no entran?") y precalifica. Esa respuesta elige el guion de reunión.
- **C, o "más adelante"** → un solo mensaje: "Todavía no: trabajamos con negocios de más de
  50 solicitudes al mes. Te dejo [recurso]. Si creces, escríbeme." Etiqueta nurture, sin
  cadencia de cita.

## La landing (solo formación, test del 12) añade dos cosas que el nativo no puede

- **Precio visible** antes del formulario: "Los proyectos empiezan con un sprint de 1.200 € + IVA".
- **Pantalla distinta según respuesta**: encaja → calendario en la misma página; todavía no →
  el motivo y la puerta abierta. Mismas cuatro preguntas que el nativo (misma regla, mismas
  etiquetas) más la del dolor.

## Cómo se construye y quién

1. **Paid** crea los dos formularios por API (viernes 9), con enlace de vista previa para que
   Maikel los vea en el móvil antes del lunes. Los formularios de Meta no se editan: un cambio
   después es otro formulario.
2. **Growth** actualiza el webhook: nuevas claves → etiquetas de arriba, y la regla B / medio / C.
   Comprobación con un envío de prueba el viernes (etiquetado `prueba-interna`, como siempre).
3. **Ops** ajusta las tres ramas de cadencia (B directo a calendario, medio como hoy, C mensaje
   único).
4. **Paid**, lunes 12 a las 08:05: creativos nuevos para los cuatro anuncios (dos viejos, dos
   3V2) apuntando a los formularios nuevos, en el mismo anuncio, sin pausar nada. Los
   formularios viejos quedan para comparar.

**Qué necesito de Maikel**: OK a los tramos de las preguntas 1 y 2 (o sus cifras), OK al texto,
y confirmación de que el precio de la landing será 1.200 € de sprint.

**Qué se mide desde el 12**: % B por formulario y vertical frente a la línea base
(formación 38 % B, clínicas 33 % B, 17-sep → 2-oct); apertura→envío frente a hoy; citas con
C (objetivo: cero); reuniones celebradas con decisor presente.
