# Brief · El recorrido del lead de pago, del clic a la reunión · semana del 18 al 22 de septiembre de 2026

Para el agente que va a analizar el recorrido y proponer mejoras. Todo lo que hay aquí sale de Meta (cuenta act_3453332464718877), del CRM GoHighLevel, de Vapi y del repositorio; nada es estimado. Donde falta un dato se dice.

## 1. Qué hay diseñado

### 1.1 Anuncios (Meta)
Tres anuncios activos, uno por vertical, 15 €/día cada uno, España, 25-65 años, público abierto, objetivo lead con formulario instantáneo. El mismo esqueleto de texto en los tres:

> «Un paciente pide precio a las 00:00. A los 4 segundos está en el CRM sin que nadie copie nada. A las 9:30 le ha llamado una voz, le ha resuelto dudas y le ha dado hora. A los 3 días, si no ha confirmado, el presupuesto tiene fecha de seguimiento y siguiente paso, sin que nadie tenga que acordarse. Siete agentes sobre el sistema comercial que ya tienes. No sustituimos tu CRM. No sustituimos a tu equipo. Pide el diagnóstico de tu sistema y te decimos qué parte hay que arreglar.»

- Clínicas: «¿Qué pasa cuando un paciente pide precio?» (id 120245699601980358).
- Formación: «¿Qué pasa cuando un alumno pide información?» (120245699600960358).
- Reformas: «¿Qué pasa cuando alguien pide presupuesto?», con el caso «Marta… presupuesto de 28.500 €» (120245684073590358).
- Asesorías: pausada desde el 20-sep. «Reloj» de formación («te contestamos en cinco minutos, compruébalo»): creado y pausado, pendiente de Maikel.
- Pausados anteriores: HERO 01/03/06 (a la landing «dónde se rompe tu crecimiento»), dinámicos de 10 creativos (landing y lead form), CRM v9 vídeo, HackTheLead.

Promesas del anuncio que hay que contrastar con la realidad: respuesta en 4 segundos, llamada a las 9:30, seguimiento a los 3 días.

### 1.2 Formulario instantáneo (clínicas, formación; reformas con el mismo modelo)
Intro: «Para clínicas que YA invierten en captación. Quince minutos revisando los ocho puntos. Sales con un plan por escrito.» Botón «Ver si encajo». Preguntas: inversión mensual (5 tramos), volumen (presupuestos o solicitudes al mes), dónde crees que se te escapa (tiempo de respuesta / seguimiento de presupuestos / anuncios y captación / web y formularios / no lo sé), nombre, empresa, email, teléfono. No hay campo libre. Pantalla de gracias: «Hecho. Te escribo en unos minutos. Te mando un WhatsApp con una pregunta para preparar la llamada» y botón «Elegir hora ahora» a qualivo.io/diagnostico/?paso=agenda.

### 1.3 Páginas
- Portada https://qualivo.io/ (desde el 22-sep, botón principal «Prueba a tu agente ahora», secundario «Quiero ver dónde está la fuga»).
- Diagnóstico (formulario en dos pasos + calendario): https://qualivo.io/diagnostico/
- Verticales: https://qualivo.io/clinicas/ · https://qualivo.io/formacion/ · https://qualivo.io/reformas/ · https://qualivo.io/asesorias/
- Reserva directa: https://qualivo.io/llamada/ y https://qualivo.io/agenda
- Demo «prueba tu agente»: https://qualivo.io/prueba/
- Calculadora: https://qualivo.io/calculadora-de-fugas/

### 1.4 El recorrido automatizado cuando entra un lead
1. **Entrada.** Formulario de Meta → webhook (api/meta-leadform) → contacto en GoHighLevel con etiquetas (paid, leadform, sector-, inv-, vol-, fuga-), trato en «Nuevo», aviso a Maikel por correo y móvil, evento a Meta. La landing hace lo mismo por api/diagnostico.
2. **Activación** (reloj cada 10 min, api/activacion, 9:00-21:00 con ventanas por canal): WhatsApp 1 al momento con su fuga y una pregunta → Raquel llama (voz 1) → WhatsApp 2 a las 2 h → voz 2 al día siguiente → correos día 2, 6 y 9 → WhatsApp 3 al día 4 → «cerrar»: etiqueta no-responde y etapa «No responde» (30 días). Cualquier respuesta para la cadencia.
3. **Canales.** WhatsApp por el 663 personal (pasarela Wazzap, en PAUSA desde el 22-sep por restricción de WhatsApp) o por el 647 oficial (solo dentro de la ventana de 24 h o con plantilla vía workflow de GHL). Voz: Raquel en Vapi, identificador de llamada el móvil de Maikel, prompt propio, herramientas de huecos y reserva. Correo: Resend.
4. **Respuestas.** Si el lead escribe: agente de WhatsApp (api/wa-agente) contesta como Maikel, con la ficha del lead y los huecos reales, y reserva. Si Maikel escribe en el hilo, el agente se aparta (wa-humano). Tratos en Negociación/Oferta/Piloto/Cliente: nada sale sin su ok.
5. **Cita.** Reserva en el calendario de GHL (sala fija de Meet), trato a «Reunión agendada», confirmación por WhatsApp, evento «Schedule» a Meta. Recordatorio a las 9:00 del día con «esto es lo que veremos», y la víspera a las 18:00 si se reservó con dos o más días.
6. **Después.** No presentado: etapa propia, llamada de Raquel y correo. Conversaciones paradas: reenganche a 1/3/5 días escrito por el agente en su contexto, descarte tras tres. Puntuación A-D en el contacto y en la hoja «Puntuación de leads Qualivo».
7. **Control.** Bitácora diaria de Raquel con audios en Notion («📞 Llamadas de Raquel»); informe de leads de pago a las 9:00 y 20:00; revisión semanal del viernes (hoja «Revisión semanal Qualivo»); bus con Paid (bus/out/paid.jsonl y demand.jsonl).

### 1.5 Lo que está a medias o roto
- Primer WhatsApp sin canal sancionado: plantillas aprobadas en el 647 (apertura, primer contacto, confirmación y tres de la demo), pero solo salen por workflow de GHL; el envío directo devuelve «sin permiso» hasta regenerar el token de Meta con la cuenta de WhatsApp asignada.
- La pantalla de gracias del formulario promete «un WhatsApp en minutos» que desde el 21 no siempre llega.
- Recordatorio de cita sin confirmación ni liberación de hueco.
- Reformas y formación llegan sin contexto («no lo sé»): Raquel abre en frío.
- Proceso v2 escrito en Notion («Proceso comercial v2»), pendiente de cuatro decisiones de Maikel: precio en el primer mensaje, teléfono por defecto, liberar hueco sin confirmación, número del piloto por vertical.
- La demo /prueba ya es botón principal de la portada, sin tráfico de pago aún.

## 2. Qué ha pasado: anuncios (18 a 22 de septiembre)

| Vertical | Gasto | Impresiones | CTR | Clics al formulario | Leads | CPL | Clic → lead |
|---|---|---|---|---|---|---|---|
| Reformas (3V) | 90,03 € | 3.762 | 2,79 % | 59 | 9 | 10,00 € | 15 % |
| Formación | 86,77 € | 3.228 | 2,91 % | 46 | 8 | 10,85 € | 17 % |
| Clínicas | 84,23 € | 2.367 | 2,11 % | 22 | 4 | 21,06 € | 18 % |
| Asesorías | 29,87 € | 1.038 | 2,22 % | 19 | 0 | — | 0 % (pausada el 20) |
| **Total** | **291,90 €** | **10.426** | | **146** | **21** | **13,90 €** | |

CPM: clínicas 35,59 €, reformas 23,93 €, formación 26,88 €. Frecuencia en reformas ya en 2,0 a los cinco días. Meta no expone por API las «aperturas de formulario»: se ven en el Ads Manager, no aquí. Los 21 leads de Meta son 20 contactos en el CRM (uno duplicado o descartado).

## 3. Qué ha pasado: los 20 leads, uno a uno (respuestas literales del formulario)

**Clínicas (4)**

| Lead | Inversión/mes | Presupuestos/mes | Dónde se le escapa | Qué pasó |
|---|---|---|---|---|
| Beatriz · HGC Dental (sáb 19, 08:58, por la landing; escribió «Clínica dental en Terrassa. Se pierden en el seguimiento») | menos de 500 € | más de 50 | seguimiento y presupuestos | reunión hecha el 21, propuesta 1.000 € |
| Pilar · CPD Ceprovic (dom 20, 15:56) | nada todavía | 10-20 | seguimiento y presupuestos | contestó; plantón el 22 a las 16:00; cita movida al 23 a las 17:45 |
| Ana · Centro Médico y Dental Ana Claros (lun 21, 04:20) | menos de 500 € | 20-50 | seguimiento y presupuestos | contestó con audio; quiere hablar la semana del 28 |
| Carlos · Clínica Dental Marín (lun 21, 20:20) | 500-2.000 € | más de 50 | no lo sé | contestó; lo lleva Maikel |

**Formación (8)**

| Lead | Inversión/mes | Solicitudes/mes | Dónde se le escapa | Qué pasó |
|---|---|---|---|---|
| Carmen · Tec (vie 18, 18:40) | menos de 500 € | 20-50 | no lo sé | sin canal: el número no conecta ni recibe WhatsApp |
| ProAudio · Dabid (vie 18, 22:15) | nada todavía | menos de 20 | anuncios y captación | cita, plantón; sin respuesta al nuevo hueco |
| Pablo · Opoprime (sáb 19, 09:15) | 500-2.000 € | más de 100 | anuncios y captación | 4 buzones; en No responde |
| Elena · Erai (dom 20, 13:30) | menos de 500 € | 50-100 | tiempo de respuesta | cita, cancelada/plantón |
| Angélica (dom 20, 23:50) | menos de 500 € | menos de 20 | tiempo de respuesta | cita, plantón |
| Rafael · Ágape Cuerpo y Arte (mar 22, 10:20) | 500-2.000 € | 50-100 | anuncios y captación | buzón; en cadencia |
| Noelia · bailaora y profesora de flamenco (mar 22, 16:10) | nada todavía | menos de 20 | no lo sé | cita el 23 a las 17:00 (Raquel) |
| Renato · Mia University (mar 22, 22:20; escribió «University. Seguimento») | 2.000-5.000 € | más de 100 | seguimiento y presupuestos | entró de noche; WhatsApp fallido (pasarela en pausa), solo aviso |

**Reformas (8)**

| Lead | Inversión/mes | Presupuestos/mes | Dónde se le escapa | Qué pasó |
|---|---|---|---|---|
| Raúl · Ruben (sáb 19, 08:15) | nada todavía | 5-15 | no lo sé | locución de espera, sin hablar |
| David Bellmunt (sáb 19, 14:40) | menos de 500 € | más de 30 | no lo sé | contestó; lo lleva Maikel |
| Paco · «en parte de ejecución» (sáb 19, 18:30) | 500-2.000 € | 5-15 | no lo sé | buzones; No responde |
| Marcos · Multiservicios Torito (dom 20, 02:10) | menos de 500 € | 5-15 | no lo sé | buzones; No responde |
| Benjamín · Talavera de la Reina (dom 20, 09:10) | nada todavía | 5-15 | tiempo de respuesta | habló con Raquel: no es quien lo lleva |
| Celso · COPU (lun 21, 10:10) | 2.000-5.000 € | menos de 5 | no lo sé | cita, plantón el 22 a las 10:30 |
| Ramón · «empresario» (lun 21, 13:30) | nada todavía | 5-15 | no lo sé | contestó; lo lleva Maikel |
| Sonia · Al Milímetro reformas (mar 22, 12:30) | menos de 500 € | 5-15 | no lo sé | contestó; cita el 23 a las 10:00 (agente de WhatsApp) |

Resumen por vertical:

| Vertical | Leads | Contestaron WhatsApp | Hablaron con Raquel | Citas | Plantones | No responde | Score A/B/C/D |
|---|---|---|---|---|---|---|---|
| Formación | 8 | 0 | 2 | 5 | 3 | 2 | 1/2/2/3 |
| Reformas | 8 | 3 | 3 | 2 | 1 | 2 | 0/2/1/5 |
| Clínicas | 4 | 3 | 0 | 2 | 0 | 0 | 1/2/1/0 |

Otros datos de la semana: 5 de 20 marcaron «no invierto nada»; 12 marcaron «no lo sé» o menos de 500 €; 8 de 20 entraron de noche o en fin de semana y recibieron el primer contacto a las 9:00 del día siguiente. Todos entraron por el formulario nativo de Meta menos Beatriz (landing /clinicas) y César Ballesteros (landing /reformas, semana anterior, plantón). Raquel: 61 llamadas en la semana, 14 buzones, 11 conversaciones largas, 63 minutos, 6,19 $. Citas de leads de pago: 9; plantones: 5; reunión hecha: 1 (Beatriz); propuesta: 1 (1.000 €). Citas pendientes el 23: Sonia 10:00, Noelia 17:00, Pilar 17:45 (las tres de formulario Meta).

## 4. Dónde se rompe el recorrido

1. **Formulario → primer contacto.** El primer WhatsApp salió por el 663 a 15 de 20; hoy ese número está restringido. Los leads nuevos solo reciben llamada y correo hasta que el 647 mande plantillas.
2. **Primer contacto → conversación.** 6 de 20 contestaron al WhatsApp. Raquel contacta con 1 de cada 3, el resto buzones y locuciones.
3. **Conversación → cita.** 9 citas: aquí no es el cuello.
4. **Cita → reunión hecha.** 5 plantones de 9. Citas en frío, a 1-4 días, sin precio, sin nada que perder; el recordatorio de las 9:00 no las rescata.
5. **Reunión → propuesta.** 1 de 1. Cuando la reunión pasa, funciona.

La auditoría de Paid del 19-sep ya decía: primer WhatsApp fallaba 6 de 6, etiquetas que mienten, sin respaldo. Se tapó con el número personal y lo han restringido. El problema estructural sigue: no hay canal de primer contacto por WhatsApp sancionado por Meta.

## 5. Hipótesis (para discutir)

1. El plantón es de diseño: reservamos con la persona menos comprometida, sin precio ni decisión previa. Prueba: precio antes de reservar y confirmación la víspera con hueco que se libera (Proceso v2).
2. El formulario instantáneo trae curiosos; la landing trae gente que ya se ha explicado. Esta semana 0 leads de landing, no comparable. Prueba: un anuncio por vertical a la landing, 10 €/día, dos semanas, comparando plantones, no CPL.
3. Una pregunta abierta obligatoria en el formulario filtra a los «no sé» y da a Raquel con qué abrir.
4. Clínicas merece más presupuesto aunque el CPL sea el doble: es la única con reunión hecha y propuesta.
5. Reformas: cambiar la oferta («que ningún presupuesto se quede sin respuesta»), no el anuncio; o pausar y pasar el dinero a clínicas.
6. Formación: problema de asistencia, no de interés. Renato y Pablo son la muestra para probar precio y confirmación.
7. Raquel contacta a 1 de 3; el guion se ha corregido el 22 (locuciones, «¿eres una máquina?», colgar tras el adiós, base antigua, número de contacto). Lo que el guion no arregla: llamar a las 9:00 en punto a leads del fin de semana.

## 6. Decisiones pendientes
- Precio y garantía en el primer contacto: sí o no.
- Confirmación obligatoria la víspera con hueco que se libera: sí o no.
- Presupuesto: mover reformas → clínicas, o cambiar la oferta de reformas.
- Pregunta abierta en el formulario de Meta (cambio de Paid).
- Prueba landing en paralelo, 10 €/día por vertical.
- Canal de primer contacto: plantillas por el 647 (token nuevo de Meta) o asumir llamada + correo.

## 7. Dónde está todo
- Proceso y reglas: content/proceso-comercial.md · content/ritual-semanal.md
- Raquel: captacion/agente-llamadas/bitacora-raquel.md · prompt-raquel-landing-v2.md · Notion «📞 Llamadas de Raquel»
- Auditoría de Paid (19-sep): paid/revisiones/2026-09-19-auditoria-del-embudo.md en la rama claude/qualivo-paid
- Bus entre agentes: bus/out/paid.jsonl y bus/out/demand.jsonl
- Hojas: «Puntuación de leads Qualivo» (158tKmIYVhAvrmJEeAU404bIztALIc7JoNZVAk2Pkt6s) · «Revisión semanal Qualivo» (1noinQXEOr-13m6tjiUWMmn8nbvby7QojDKxOV2oFNkM)
- Proceso v2 para validar: Notion https://app.notion.com/p/3e356e1ad6ed81c3a88fc8a0e61e65e9
