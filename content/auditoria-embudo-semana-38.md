# Auditoría del sistema comercial · leads de pago · semana 38 (18 a 22 de septiembre de 2026)

```
AUDITOR    Qualivo Growth System Auditor (metodología content/prompt-auditor-sistema.md, 15 bloques)
PIDE       Maikel, 22-sep: analizar el recorrido del lead de pago del clic en Meta a la reunión hecha y
           decidir el 23-sep (17:00-19:00) qué arreglar primero
ALCANCE    los 20 leads de pago de la semana (códigos CL-, FO-, RE- del brief; nombres en el CRM y en la
           copia privada de Notion). Ningún nombre de lead en este documento.
CORTE      brief content/brief-recorrido-semana-38.md (22-sep, tarde) para todo lo que pasa después del
           envío; Meta API vía Paid (22-sep 22:00) para la parte de anuncios cuando el brief no lo tiene
REGLA      cero cifras inventadas: cada número lleva su fuente. Lo que es estimación lo dice y muestra el
           supuesto. Lo que no está en ninguna fuente aparece como «falta dato».
```

## 0. Fuentes usadas y datos que faltan

**Leído y cruzado**: brief de la semana 38 · proceso comercial v0 (21-sep) · bitácora de Raquel (16 a 22-sep) · auditoría de Paid del 19-sep y recorrido 360 del 22-sep (rama `claude/qualivo-paid`) · dailies del bus (`bus/out/paid.jsonl`, `bus/out/demand.jsonl`) · el código del recorrido (`api/meta-leadform.js`, `activacion.js`, `_activacion.js`, `_mensajes.js`, `_agente.js`, `agendar.js`, `_cita.js`, `_recordatorios.js`, `seguimientos.js`, `_reenganche.js`, `_scoring.js`, `vapi-fin.js`, `prueba.js`, `_demo.js`, `_aviso.js`, `vercel.json`) · Notion: base «📞 Llamadas de Raquel» (consulta SQL sobre las llamadas del 18 al 22) y página «Proceso comercial v2» · Gmail: los avisos automáticos del sistema a Maikel del 18 al 22 (hora exacta de entrada de cada lead, de cada WhatsApp de la cadencia y de cada llamada) · Google Calendar del 23-sep · hojas «Puntuación de leads Qualivo» y «Revisión semanal Qualivo» · las páginas en producción (portada, /diagnostico/, /clinicas/, /formacion/, /reformas/, /asesorias/, /prueba/, /llamada/).

**Falta dato** (no está en ninguna fuente de esta sesión; pedir a Maikel o a la sesión de operaciones):

1. **Aperturas de formulario en el Ads Manager** por anuncio y por plataforma (Meta no las expone por API; Paid llama «aperturas» a los 149 clics al formulario, que no es lo mismo).
2. **Hora del primer contacto entregado** (no intentado) de FO-2 y CL-2: no hay aviso en Gmail y el brief no da la hora. Sale del hilo de GHL.
3. **Estado real de las citas del 17 y 18 de septiembre** (Paid, 22-sep: llevan cinco días en «confirmed» sin cerrar) y de la cita de FO-4/FO-2 marcada «showed» en GHL cuando Maikel dice que no se hizo.
4. **Si los recordatorios de las 9:00 del 22-sep salieron** a las tres citas de esa mañana (RE-6 10:30, FO-5 10:00, FO-4 11:00) y por qué canal. Está en las notas de GHL (`rec-dia-20260922`).
5. **Cuántos leads del formulario de Meta pulsaron «Elegir hora ahora»** en la pantalla de gracias (evento `diagnostico_leadform_agenda` en analítica).
6. **Cuántos mensajes salieron por el 663 el 21 y el 22** antes de la restricción (el código dice «unos sesenta en dos días»; el número exacto está en GHL).
7. **Grabación o notas de la reunión hecha con CL-1**: no hay transcripción; el ritual semanal ya lo pide.

---

## 1. Resumen ejecutivo

El sistema capta bien y agenda bien. Lo que no hace es **convertir citas en reuniones** ni **sostener el primer contacto por WhatsApp**, que es exactamente lo que Qualivo vende.

Los números de la semana (brief, 18 a 22-sep):

| Etapa | Volumen | Conversión |
|---|---|---|
| Gasto Meta | 291,90 € | |
| Clics al formulario | 146 | |
| Leads (Meta 21, CRM 20) | 20 | 13,7 % clic→lead |
| Contestaron por WhatsApp | 6 | 30 % |
| Hablaron con Raquel (lead al teléfono) | 5 | 25 % |
| Citas | 9 | **45 % lead→cita** |
| Citas resueltas al cierre | 6 | |
| Plantones | 5 | **83 % de las resueltas** |
| Reunión hecha | 1 | 17 % de las resueltas |
| Propuesta | 1 (1.000 €) | 100 % de las hechas |
| Coste por reunión hecha | **291,90 €** | |

**Qué funciona.** El webhook de Meta al CRM (tras el arreglo de la firma del 19-sep), la puntuación A-D, la reserva de citas (Raquel y el agente de WhatsApp), el registro de llamadas en Notion con audio, y la disciplina de revisar cada llamada y corregir el guion el mismo día. Del lead a la cita se convierte el 45 %: no hay que tocarlo.

**Qué está roto.**

1. **No existe un canal de primer contacto por WhatsApp que Meta permita.** El 19-sep fallaba 6 de 6 (API oficial sin plantilla). Se tapó con el número personal (663, pasarela Wazzap) y el 22-sep WhatsApp lo restringió tras unos sesenta mensajes en dos días. Las plantillas del 647 están aprobadas pero el envío directo devuelve «sin permiso» hasta regenerar el token. Desde el 22 a las 16:20 un lead nuevo solo recibe llamada y correo, y **los recordatorios de cita y los avisos al móvil de Maikel que iban por la pasarela fallan en silencio** (`_recordatorios.js:126-137`, `_aviso.js:40-47`).
2. **La cita se reserva sin compromiso y no se confirma.** Sin precio, sin que el lead haya leído nada, a 1-4 días vista, y el «¿sigue en pie?» de la víspera no lo procesa nadie (`_recordatorios.js`). Las tres citas que Raquel cerró el lunes 21 fueron tres plantones el martes 22. No hay detección automática de no-show ni el proceso 3c del documento comercial (`seguimientos.js` solo crea una tarea a los dos días; `act-noshow` no lo pone nadie).
3. **El 40 % de los leads (8 de 20) entra de noche o en fin de semana y espera entre 4 y 49 horas** hasta la primera llamada. El anuncio promete «a las 9:30 le ha llamado una voz».
4. **Los datos no cuadran entre sí**: la hoja semanal dice «5 diagnósticos hechos» la semana del 15 al 21; el brief y Paid dicen 1 reunión hecha; el Proceso v2 dice 2 de 7. Sin un campo showed/noshow cerrado el mismo día no hay tasa de asistencia fiable.

**Qué arreglar primero.** El canal de primer contacto (token del 647 + plantilla) y la confirmación obligatoria con liberación de hueco. Son dos decisiones de Maikel y una hora de trabajo cada una. Sin lo primero, lo segundo no tiene por dónde salir.

---

## 2. Mapa del embudo

Fuente: brief (corte 22-sep) salvo donde se indica. Las tasas de la parte de Meta usan el denominador del brief; Paid tiene un corte posterior (302,56 €, 149 clics, 21 envíos) y sus cifras no se mezclan con estas.

| Etapa | Volumen | Conversión | Observaciones |
|---|---|---|---|
| Impresiones | 10.426 | | CPM clínicas 35,59 €, formación 26,88 €, reformas 23,93 €. Frecuencia reformas 2,0 a los cinco días. |
| Clics al formulario | 146 | 1,40 % de impresiones | CTR 2,11 % (clínicas) a 2,91 % (formación). |
| Envíos (leads Meta) | 21 | **14,4 %** clic→envío | Paid: un lead form sano va entre 20 y 40 %. 128 personas abren y no envían. Asesorías: 19 clics, 0 envíos. |
| Leads en el CRM | 20 | | 1 duplicado (FO-3 envió dos veces el 19-sep, 09:15 y 18:20; consta en los avisos de Gmail). |
| Primer contacto intentado en < 15 min | 12 de 20 | 60 % | Ver anexo B. 2 de esos 12 nunca se entregaron (FO-1 sin canal; CL-1 falló ×2 por la API oficial). |
| Primer contacto intentado en > 1 h | 6 de 20 | 30 % | 4 de ellos entre 3 h 40 y 10 h 40 (noche), 2 de más de un día (FO-2 y RE-5, marcados «fuera» por «nada todavía» hasta que Maikel cambió la regla el 21). |
| Contestaron por WhatsApp | 6 | 30 % | Clínicas 3 de 4, reformas 3 de 8, formación 0 de 8. |
| Lead al teléfono con Raquel | 5 | 25 % | Notion: 39 llamadas a leads del formulario de Meta entre el 18 y el 22; en 6 cogió el lead (15 % de las llamadas), en 2 cogió otra persona, 15 buzones, 13 sin respuesta o sin conectar. |
| Conversación real (WhatsApp o voz) | 10 | 50 % | 6 + 5 menos el solape (RE-2 y FO-4 hicieron las dos cosas). Estimación por cruce del brief con Notion. |
| Citas | 9 | **45 %** lead→cita · 90 % conversación→cita | 4 las cerró Raquel por teléfono (3 el 21, 1 el 22), 1 el agente de WhatsApp (RE-8, 26 minutos tras el formulario), el resto Maikel o el lead por el enlace. Coste por cita: 32,43 €. |
| Citas resueltas al cierre | 6 | | 3 pendientes el 23-sep (RE-8 10:00, FO-7 17:00, CL-2 17:45; comprobadas en el calendario de Maikel). |
| Reunión hecha | 1 | **17 %** de las resueltas | CL-1, lunes 21. Entró por la landing de clínicas y escribió ella primero. |
| Plantones | 5 | 83 % de las resueltas | FO-2, FO-4, FO-5, RE-6, CL-2 (CL-2 reagendada). Las 3 citas que cerró Raquel el 21 → 3 plantones. |
| Propuesta | 1 · 1.000 € | 100 % de las hechas | n = 1. |
| Venta | 0 | | Coste por reunión hecha 291,90 €; por propuesta 291,90 €. |

Por vertical (brief):

| Vertical | Gasto | Leads | CPL | Contestó WA | Habló con Raquel | Citas | Plantones | Reunión | €/cita | Score A/B/C/D |
|---|---|---|---|---|---|---|---|---|---|---|
| Formación | 86,77 € | 8 | 10,85 € | 0 | 2 | 5 | 3 | 0 | 17,35 € | 1/2/2/3 |
| Reformas | 90,03 € | 8 | 10,00 € | 3 | 3 | 2 | 1 | 0 | 45,02 € | 0/2/1/5 |
| Clínicas | 84,23 € | 4 | 21,06 € | 3 | 0 | 2 | 1 (reagendada) | 1 | 42,12 € | 1/2/1/0 |
| Asesorías | 29,87 € | 0 | — | — | — | — | — | — | — | pausada el 20 |

Lectura: **formación agenda barato y no aparece; reformas es barato de traer y no convierte; clínicas es la única con reunión hecha y propuesta.** El KPI que decide el presupuesto tiene que ser coste por reunión hecha, no CPL (Paid ya lo ha cambiado el 22).

---

## 3. Fugas detectadas

Impacto: leads o reuniones que se pierden por semana a gasto constante. Urgencia: 🔴 esta semana · 🟠 este mes · 🟡 después. Dificultad: qué hace falta.

| # | Problema | Evidencia | Impacto | Urgencia | Dificultad |
|---|---|---|---|---|---|
| F1 | **Cita → reunión: 5 plantones de 6 citas resueltas.** Se reserva sin precio, sin decisión previa, a 1-4 días, y nadie procesa la confirmación. | Brief §4; Notion: las 3 citas de Raquel del 21 (FO-5 10:00, RE-6 10:30, FO-4 11:00 del 22) → 3 plantones. FO-4 creyó que era una llamada de teléfono («¿es telefónico, no?»); RE-6 no entendió qué era el diagnóstico («¿de momento?»). | ~4 reuniones/semana | 🔴 | Decisión (precio, víspera, liberar) + 1 día de código para procesar «¿sigue en pie?» y marcar no-show |
| F2 | **No hay canal de primer contacto por WhatsApp sancionado.** 663 restringido desde el 22 16:20; 647 solo por workflow de GHL; plantilla directa no se intenta con la configuración por defecto (`GATEWAY_PRIMERO`, `_activacion.js:286`). | Auditoría Paid 19-sep (6 de 6 fallos), brief §1.5, código | Desde el 22, todo lead nuevo sin WhatsApp; recordatorios y avisos al móvil fallan en silencio | 🔴 | Maikel regenera el token de Meta con la cuenta de WhatsApp del 647 (1 h) |
| F3 | **Recordatorio y confirmación sin respaldo.** Si el hilo iba por la pasarela y está en pausa, el recordatorio va a `errores` y no sale correo (`_recordatorios.js:126-137`). Las 3 citas del 23 dependen de esto. | Código | 3 citas mañana | 🔴 | 2 h de código: correo si el WhatsApp no sale |
| F4 | **Clic → envío 14 %.** La pregunta de presupuesto repele y no filtra: 5 de 20 «nada», 12 «no lo sé» o «< 500 €». Sin campo abierto: 11 de 20 marcan «no lo sé» y Raquel abre en frío. | Paid 360 §4; brief §3 | 128 aperturas sin envío; +16 leads/semana si se llega al 25 % (estimación de Paid) | 🟠 | Paid duplica el formulario (Meta no deja editar uno con leads) |
| F5 | **Latencia de noche y fin de semana.** 8 de 20 esperan de 3 h 40 a 49 h a la primera llamada. Los 7 leads del fin de semana recibieron la llamada a las 9:00:37-9:00:44 del lunes, en tanda (avisos de Gmail). FO-4: «te va a venir fatal ahora». | Anexo B | 40 % del embudo arranca tarde y en el peor minuto | 🟠 | Cadencia: primera llamada de fin de semana a partir de 9:30-10:00, escalonada; sábado por la mañana ya existe (10-14) |
| F6 | **Raquel alcanza al lead en 6 de 39 llamadas (15 %).** 15 buzones, 13 sin respuesta o sin conectar. Locuciones de operadora, IVR, +1 775 en la base antigua, hasta 4 buzones al mismo lead (FO-3) contra la regla «dos llamadas como máximo» del propio diseño. | Notion, bitácora 21 y 22 | 0,56 $ por conversación: coste irrelevante; el límite es el alcance | 🟠 | Guion ya corregido el 22; falta cadencia (parar tras 2 buzones el mismo día, contexto en reintentos) |
| F7 | **El WhatsApp 1 miente.** Dice «he leído lo que me has contado de tu empresa» a un lead de formulario que no ha podido contar nada (no hay campo libre). No lleva la fuga ni la pregunta que el brief describe. | `_mensajes.js:56-68`, aviso de Gmail 21-sep 08:00 | Rompe la promesa de la pantalla de gracias («un WhatsApp con una pregunta») | 🟠 | 1 h: texto por vertical con la fuga marcada (los del Proceso v2 ya están escritos) |
| F8 | **Promesas de plazo incoherentes.** Anuncio «a las 9:30 le ha llamado una voz»; gracias «te escribo en unos minutos»; correo de bienvenida promete «en unos minutos» siempre, también de madrugada (`diagnostico.js:214`); portada y /diagnostico «plan en 24 h», verticales «48 h»; Raquel dice «llamada telefónica» y es Meet. | Anexo D | Confianza | 🟠 | Textos |
| F9 | **No-show no se detecta ni se trabaja.** Nadie marca noshow, nadie pone `act-noshow` ni `no-presentado`; el proceso 3c (10 min, llamada, día 2, día 5) no está en código. El scoring resta 3 por una etiqueta que nadie pone. | Informe de código §6-7 | Los 5 plantones se trabajan a mano o no se trabajan | 🟠 | 1 día de código |
| F10 | **Tres cifras distintas de reuniones hechas.** Hoja semanal «5 diagnósticos hechos» (15-21 sep); brief y Paid 1; Proceso v2 «2 de 7». Citas del 17 y 18 sin cerrar en GHL. | Hojas, bus | Sin tasa de asistencia no se puede diagnosticar la fuga más cara | 🟠 | Regla manual hoy: cerrar cada cita el mismo día |
| F11 | **Datos personales de leads en el repositorio público.** `bus/out/demand.jsonl` (unos 17 nombres con empresa y estado de cita), la bitácora de Raquel (nombres y empresas de leads), comentarios en `api/*.js` (nombres de pila), `content/diario-contenido.md` y `content/borradores/…`. | Informe de código §11 | Riesgo legal (la queja de agosto ya fue de protección de datos) | 🔴 | 1 h: sustituir por códigos, como ya hace el brief |
| F12 | **Tres citas la misma mañana a 30 minutos** (22-sep 10:00, 10:30, 11:00) y mañana dos citas (17:00 y 17:45) **dentro de la sesión de análisis de 17:00 a 19:00**. | Calendario de Maikel | Capacidad y foco de la única persona que vende | 🔴 | Mover la sesión o las citas |
| F13 | **Reformas: 7 de 8 «no lo sé», 5 de 8 puntúan D, 45 €/cita.** Anuncio con caso de 28.500 € atrae curiosos. | Brief, Paid | 90 € a la semana con 0 reuniones | 🟡 | Bajar a 10 €/día o cambiar la oferta |
| F14 | **Asesorías: 19 clics, 0 envíos, pausada a mitad de test.** | Brief, Paid | No se sabe si es el formulario o el público | 🟡 | Decidir: 14 días completos o matar |
| F15 | **La demo /prueba promete recordatorios y flujo de no-show que no existen** en el correo del dueño (`_demo.js:187, :198`) y deja que cualquiera haga llamar al 663 de Maikel a un tercero, hasta 30 al día, sin verificación. | Informe de código §8 | Reputación y coste (una llamada a Opus por prueba) | 🟡 | Texto + verificación del móvil antes de tráfico de pago |
| F16 | **Etiquetas que no cuadran con el código.** La cadencia cierra con `act-fin`, no con `no-responde`; el scoring baja a D por `no-responde`. `reunion-celebrada` no lo pone nadie. Aviso móvil pendiente de los leads de landing de noche no sale nunca (`diagnostico.js:191-200`). | Informe de código §7, §9 | Puntuación y reporting sesgados | 🟡 | 2 h de código |

---

## 4. Cuello de botella real

**La cita se reserva sin compromiso y no se confirma: 5 de 6 citas resueltas fueron plantón.**

Por qué es este y no otro:

- **Lo anterior funciona.** Lead → cita es el 45 % (9 de 20). Paid lo mide en 42,9 % con su corte. Es una cifra buena. Conversación → cita es 9 de 10. No hay que vender más ni agendar más.
- **Lo posterior funciona.** La única reunión que se hizo acabó en propuesta (1 de 1). Con n = 1 no se puede afirmar más, pero no hay señal de que la reunión falle.
- **La pérdida está concentrada.** A gasto constante, pasar del 17 % al 50 % de asistencia supone 3 reuniones más a la semana sin tocar un anuncio. Ninguna palanca de Paid se acerca (Paid 360 §4: solo el formulario daría ~2,7 reuniones; solo la confirmación ~3,8).
- **Tiene causa identificable, no azar.** Las 3 citas que Raquel cerró el 21 fueron a 3 personas que no sabían qué compraban: una creía que era una llamada de teléfono y ya tenía agencia (FO-4), otra no entendió qué era el diagnóstico (RE-6), otra rechazó los dos primeros huecos y aceptó uno de compromiso (FO-5). Ninguna había leído nada ni sabía el precio. Las dos reuniones que sí se hicieron en la semana 37-38 (Paid 21-sep) fueron de leads que **escribieron ellos primero** después de pasar por la landing.
- **El sistema no tiene la pieza que lo arregla.** No hay confirmación procesada, no hay liberación de hueco, no hay detección de no-show, y desde el 22 no hay canal para la confirmación de la víspera.

El canal de WhatsApp (F2) es la **condición previa**: sin él la confirmación y el primer mensaje con precio no tienen por dónde salir. Por eso las dos van juntas en las 72 horas. Pero el cuello, el que limita el crecimiento, es la cita que no se convierte en reunión.

---

## 5. Oportunidades de IA y automatización

| Proceso actual | Automatización propuesta | Impacto esperado |
|---|---|---|
| Confirmación de la víspera: se manda «¿sigue en pie?» y nadie lee la respuesta. | El agente de WhatsApp lee la respuesta: sí → confirmada; cambio → reagenda con dos huecos; nada en 2 h → Raquel llama; nada → libera el hueco, trato a «Más adelante», nota. Todo con los textos del Proceso v2 §6. | Es la palanca del cuello de botella. Estimación de Paid: 17 % → 60 % de asistencia. |
| No-show: se ve a mano y se trabaja a mano (Maikel escribió a FO-2 y FO-5 a mano el 22). | A los 10 minutos de la hora sin conexión: mensaje con dos huecos (agente), llamada de Raquel si no contesta, etiqueta `no-presentado`, trato a la etapa, día 2 y día 5 (Proceso v2 §8). Detección: la sala de Meet no tiene API sencilla; usar la confirmación de Maikel («no ha venido») en un clic desde el aviso, o la ausencia de `reunion-celebrada` 30 min después. | Recupera parte de los 5 plantones semanales; hoy 0 reagendados de forma automática. |
| Primer WhatsApp genérico. | Plantilla por vertical con la fuga marcada, qué montaríamos y precio orientativo (textos ya escritos en Notion v2 §3), con variables de Meta. Si «no lo sé»: la fuga típica del sector. | Convierte al lead de formulario en un lead que «ha leído algo», que es el perfil que se presenta. |
| Raquel llama en frío a leads que no han leído nada; reintentos sin contexto. | Raquel solo llama cuando el WhatsApp con precio ya está entregado (estado del mensaje, no etiqueta); apertura de reintento con contexto obligatoria vía `assistantOverrides.firstMessage` desde `activacion.js` (propuesto en la bitácora del 21, sin aplicar); parar tras 2 buzones el mismo día. | Menos llamadas quemadas (FO-3: 4 buzones; RE-1: 3 locuciones en un día). |
| Resultado de la reunión: no se registra. | Al terminar la hora de la cita, aviso a Maikel con tres botones (hecha / no vino / movida) que escriben `reunion-celebrada` o `no-presentado`, cierran la cita en GHL y alimentan el scoring y la hoja semanal. | Una sola cifra de reuniones hechas en todas partes. |
| Puntuación A-D: se calcula pero depende de etiquetas que nadie pone. | Que la cadencia ponga `no-responde` al cerrar y que la cita hecha ponga `reunion-celebrada`; revisar el peso de la cita (FO-7 y CL-2 salen C con cita). | Scoring útil para priorizar las llamadas de Maikel. |
| Grabación de reuniones: no hay. | Transcripción de Meet activada en la sala fija; el agente de operaciones saca patrones el viernes (ritual semanal ya lo pide). | El único sitio donde hoy no se aprende es en la reunión que vende. |
| Reporting: tres cifras distintas de reuniones. | Un solo origen: citas de GHL con estado cerrado el mismo día; la hoja semanal y el bus leen de ahí. | Decisiones del viernes con un número que no cambia según quién lo cuente. |
| Demo /prueba: llama a cualquier móvil que le den. | Verificación del móvil por WhatsApp (plantilla) antes de la llamada; texto del correo del dueño alineado con lo que existe. | Sin riesgo cuando entre tráfico de pago. |

---

## 6. Top 10 acciones prioritarias (Impacto × Velocidad × Facilidad)

1. **Token de Meta del 647 + plantilla de apertura en el 647** (Maikel, Business Manager, ~1 h). Desbloquea el primer contacto, la confirmación, los recordatorios y los avisos al móvil. Todo lo demás cuelga de esto.
2. **Confirmación obligatoria la víspera con liberación de hueco** (decisión de Maikel + 1 día de código: procesar la respuesta, Raquel llama si no contesta, liberar y anotar). Ataca el cuello de botella.
3. **Precio orientativo y garantía en el primer mensaje** (decisión; los textos por vertical ya están en Notion v2 §3). Cambia quién reserva.
4. **Cerrar el resultado de cada cita el mismo día** (regla manual desde mañana: showed / noshow / cancelled en GHL antes de las 20:00; Paid mide coste por reunión hecha). Sin esto, no se puede saber si el 2 y el 3 funcionan.
5. **Respaldo por correo en recordatorios y confirmaciones cuando el WhatsApp no sale** (2 h de código). Cubre las 3 citas de mañana y las que vengan mientras el 647 no esté.
6. **Pregunta abierta obligatoria en el formulario de Meta en lugar de la de presupuesto** (Paid duplica el formulario; A/B 14 días; métrica: envío→cita y plantón, no CPL).
7. **Cadencia de fin de semana y de reintentos**: primera llamada de los leads del fin de semana a partir de las 9:30-10:00, escalonada, nunca siete en el mismo minuto; parar tras 2 buzones el mismo día; máximo 2 llamadas sin conversación (regla del diseño de agosto); contexto obligatorio en reintentos.
8. **Presupuesto: reformas de 15 a 10 €/día, la diferencia a clínicas**; asesorías: 14 días completos o matar. Decisión, sin coste.
9. **Sacar los datos personales del repositorio público** (bus, bitácora, comentarios del código, borradores): códigos como en el brief. 1 h.
10. **Detección y proceso de no-show en código** (3c del proceso comercial): 1 día. Después del 2 y del 4.

---

## 7. Quick wins (0-30 días)

- **Hoy**: mover la sesión de análisis del 23 (17:00-19:00) o las citas de FO-7 (17:00) y CL-2 (17:45). Confirmar a mano las tres citas de mañana desde el canal donde tengan hilo, y por correo.
- **Hoy**: sustituir nombres por códigos en `bus/out/demand.jsonl`, la bitácora y los comentarios del código. Revisar `content/diario-contenido.md` y `content/borradores/`.
- **Esta semana**: token del 647 y plantilla de apertura (acción 1). Regla de cerrar citas el mismo día (acción 4). Respaldo por correo en recordatorios (acción 5).
- **Esta semana**: arreglar el correo de bienvenida para que no prometa «en unos minutos» de madrugada (`diagnostico.js:214`, un booleano). Unificar «plan en 24 h» (portada, /diagnostico, /llamada) y «48 h» (verticales): elegir uno.
- **Esta semana**: Raquel dice «videollamada por Meet, y si prefieres teléfono te llama Maikel» (ya en el prompt del 21; comprobar en la próxima grabación). Que Raquel no cierre hueco a quien no ha dicho «quiero verlo» (Notion v2 §5).
- **Esta semana**: primera llamada de fin de semana a 9:30-10:00 y escalonada; parar tras dos buzones el mismo día; nunca desde el +1 775 (todavía salieron tres el 22 en la base antigua).
- **Dos semanas**: formulario de Meta con pregunta abierta (A/B); reformas a 10 €/día; decisión sobre asesorías.
- **Dos semanas**: proceso de no-show en código y `reunion-celebrada` / `no-responde` puestos por el sistema, para que el scoring y la hoja semanal digan la verdad.
- **Mes**: transcripción de Meet activada en la sala fija; el viernes el agente de operaciones lee también las reuniones.

---

## 8. Plan 30-60-90

**Días 0-30 · que la cita se convierta en reunión.**
Canal 647 operativo con plantillas (apertura, confirmación, recordatorio, no-show). Confirmación de víspera procesada y liberación de hueco. Precio y garantía en el primer mensaje. Resultado de cada cita cerrado el mismo día. Formulario con pregunta abierta en A/B. Cadencia de fin de semana corregida. PII fuera del repositorio. **Métrica**: tasa de asistencia (objetivo: de 1 de 6 a 3 de 6) y coste por reunión hecha (objetivo: de 291,90 € a menos de 100 €).

**Días 30-60 · que el lead llegue con contexto y a tiempo.**
Leer el A/B del formulario y decidir (7-oct según Paid). Prueba de landing en paralelo, 10 €/día por vertical, medida por plantón. Presupuesto por coste por reunión hecha. Reintentos de Raquel con contexto y tope de dos llamadas. No-show automatizado (10 min, día 2, día 5). Reenganche y reintentos contando solo mensajes entregados. **Métrica**: minutos del lead al primer contacto entregado (mediana; objetivo < 15 min en horario y < 60 min al abrir la ventana), % de leads con conversación real (objetivo > 60 %).

**Días 60-90 · que se venda y se aprenda.**
Reuniones grabadas y transcritas; patrones el viernes. Seguimiento post-reunión (día 1, 4, 10) automatizado con aprobación de Maikel. Número del piloto por vertical fijado y en la propuesta. Scoring validado contra cierres (Paid lo pidió el 21: con un mes de datos se corrige la fórmula). Demo /prueba con verificación de móvil antes de recibir tráfico de pago. **Métrica**: propuestas por reunión hecha, pilotos por propuesta, ingreso por lead de pago.

---

## 9. Si fuera nuestro cliente: las próximas 72 horas (5 acciones)

1. **Mañana antes de las 10:00: asegurar las tres citas del 23** (RE-8 10:00, FO-7 17:00, CL-2 17:45). Confirmación a mano por el canal donde haya hilo y por correo, con el enlace de Meet y «qué veremos». Comprobar antes que el recordatorio automático de las 9:00 ha salido (etiqueta `rec-dia-20260923`); con la pasarela en pausa es probable que no. Y mover la sesión de análisis o las dos citas de la tarde, que se solapan.
2. **Regenerar el token de Meta con la cuenta de WhatsApp del 647 asignada y enviar a aprobación la plantilla de apertura por vertical** (textos de Notion v2 §3, con o sin precio según la decisión 3). Es la única acción que devuelve el WhatsApp al sistema sin depender del número personal.
3. **Tomar las cuatro decisiones del Proceso v2** (precio orientativo en el primer mensaje · teléfono por defecto · liberar el hueco sin confirmación · número del piloto por vertical). Con la 1 y la 3 decididas, el agente de operaciones puede montar la confirmación de víspera con liberación en un día.
4. **Cerrar el resultado de todas las citas abiertas** (las del 17 y 18 en «confirmed», la de FO-2 «showed» que no se hizo) y fijar la regla: toda cita se cierra el mismo día. Que la hoja semanal y el bus lean de ahí. A partir de ahí, Paid mide coste por reunión hecha.
5. **Paid, en pausado hasta el ok**: formulario con pregunta abierta obligatoria en vez de la de presupuesto (A/B, 14 días); reformas a 10 €/día y la diferencia a clínicas; asesorías: reabrir 14 días o matar.

---

## 10. Si solo tuviéramos 1.000 €

No en más anuncios: meter más leads en un embudo que pierde 5 de 6 citas es perder más caro (Paid, 22-sep).

- **0 €** en arreglar lo que falla: el token, la plantilla, la confirmación, el no-show y el respaldo por correo son horas del propio sistema, no dinero.
- **~630 €** en 14 días de Meta al ritmo actual pero recolocados: clínicas 20 €/día (es la única vertical que ha producido dinero), formación 15 €/día (la más barata por cita; es el banco de pruebas de la confirmación), landing en paralelo 10 €/día en una sola vertical (clínicas) para comparar plantón; reformas 0 € hasta tener otra oferta. Objetivo: 20-25 leads y **6 reuniones hechas** en 14 días, no más leads.
- **~370 €** de reserva para lo que sí cuesta dinero al escalar: conversaciones de WhatsApp Business por el 647 (Meta cobra por plantilla de marketing), minutos de Vapi (0,10 $/minuto de media esta semana: 63 min, 6,19 $) y el modelo del agente de WhatsApp y de la demo.

Por qué: el euro marginal rinde más en asistencia que en volumen. Con 1.000 € el objetivo no es 40 leads, es demostrar que con confirmación y precio previo se hacen 3 de cada 6 citas.

---

## 11. Si solo pudiéramos tocar una cosa

**Confirmación obligatoria la víspera con liberación de hueco, por el 647 y con Raquel de respaldo.**

Es la pieza que separa una cita de una reunión. Convierte el «¿sigue en pie?» en un compromiso, quita del calendario a quien no va a venir (y libera el tiempo de Maikel), y da el dato que hoy falta: cuántos confirman y cuántos no. Todo lo demás (precio previo, pregunta abierta, landing) mejora la calidad de quien reserva; esto hace que quien reserva aparezca. Y es medible en una semana con las citas que ya hay.

Condición: necesita el canal (token del 647). Si solo pudiera hacer una llamada de teléfono, sería a Meta para regenerar el token.

---

## 12. Estimación de crecimiento

Todo lo de este apartado es **estimación**. Supuestos explícitos; base: una semana como la 38 a gasto constante (291,90 €, 20 leads, 9 citas). La tasa reunión → propuesta → venta no existe todavía (n = 1), así que se asume y se marca.

Supuestos:
- Lead → cita se mantiene en 45 % (medido).
- Asistencia: hoy 17 % de las resueltas (1 de 6). Conservador 33 % (2 de 6), realista 50 %, agresivo 60 % (el escenario de Paid).
- Clic → envío: hoy 14,4 %; en el escenario agresivo 25 % con el formulario nuevo (rango bajo de lo que Paid llama sano), lo que a gasto constante daría unos 35 leads en vez de 20.
- Reunión → propuesta 1 de 2 y propuesta → piloto 1 de 2 (supuesto; la única reunión hecha dio propuesta). Ticket del piloto: 1.000 € el primer mes y 750 €/mes después (Proceso v2 §3; la única propuesta real es de 1.000 €).

| Por semana | Hoy | Conservador | Realista | Agresivo |
|---|---|---|---|---|
| Leads | 20 | 20 | 20 | ~35 |
| Citas | 9 | 9 | 9 | ~16 |
| Reuniones hechas | 1 | 3 | 4,5 | ~9,5 |
| Reuniones recuperables | — | +2 | +3,5 | +8,5 |

| Por mes (4 semanas) | Hoy | Conservador | Realista | Agresivo |
|---|---|---|---|---|
| Reuniones hechas | 4 | 12 | 18 | ~38 |
| Propuestas (1 de 2) | 2 | 6 | 9 | ~19 |
| Pilotos (1 de 2) | 1 | 3 | 4,5 | ~9,5 |
| Facturación del primer mes de esos pilotos | 1.000 € | 3.000 € | 4.500 € | ~9.500 € |
| Recurrente que dejan (750 €/mes) | 750 € | 2.250 € | 3.375 € | ~7.100 € |

Ingreso perdido hoy respecto al realista, con estos supuestos: **unos 3.500 € de primer mes y 2.600 €/mes de recurrente por cada mes que la asistencia siga en 1 de 6**. El escenario agresivo exige además capacidad: 9 reuniones a la semana las hace Maikel solo si son de 10-15 minutos por teléfono (Proceso v2 §7).

Lo que invalida la estimación: que reunión → propuesta → piloto sea mucho peor que 1 de 4 (no hay datos), o que el precio en el primer mensaje baje lead → cita más de lo que sube la asistencia (es la prueba de la quincena).

---

## 13. Conclusión final

Funciona la captación (CPL 13,90 €, 45 % lead → cita), la reserva (Raquel y el agente agendan), el registro (Notion, avisos) y la disciplina de corregir a diario. Está roto el primer contacto por WhatsApp (sin canal sancionado, número personal restringido), la conversión de cita en reunión (5 plantones de 6) y la trazabilidad del resultado (tres cifras distintas de reuniones hechas). Primero: token del 647 con plantilla y confirmación de víspera con liberación; en paralelo, precio previo y cierre del resultado de cada cita el mismo día. El resultado que tiene que mejorar antes es la **tasa de asistencia** (de 1 de 6 a 3 de 6 en dos semanas), que arrastra el coste por reunión hecha (de 291,90 € a menos de 100 €). Métrica semanal: **reuniones hechas por cada 100 € de Meta**, con el resultado de cada cita cerrado el mismo día, y debajo: minutos hasta el primer contacto entregado y % de citas confirmadas la víspera.

---

# Anexo A · Los 15 bloques, con la evidencia

### A1 · Adquisición

- Tres anuncios activos (uno por vertical, 15 €/día), mismo esqueleto de texto, público abierto 25-65 España, objetivo lead con formulario instantáneo. Asesorías pausada el 20 (29,87 €, 19 clics, 0 envíos). «Reloj» de formación creado y pausado.
- CTR 2,11 % (clínicas) a 2,91 % (formación); CPM clínicas 35,59 € frente a 23,93 € reformas; frecuencia reformas 2,0 en cinco días (fatiga temprana con público abierto).
- CPL: reformas 10,00 €, formación 10,85 €, clínicas 21,06 €. **Coste por cita**: formación 17,35 €, clínicas 42,12 €, reformas 45,02 €. **Coste por reunión hecha**: clínicas 84,23 €, el resto infinito.
- Paid (22-sep): Instagram feed se lleva 157,88 € a 2,77 €/clic frente a Facebook feed 94,25 € a 1,45 €/clic; propone separar por plataforma.
- Mensaje: el anuncio describe el sistema que vendemos (respuesta en 4 s, voz a las 9:30, seguimiento a los 3 días). La respuesta a «dónde se te escapa» lo confirma por sector: clínicas dice seguimiento (3 de 4), formación respuesta/anuncios, reformas «no lo sé» (7 de 8). **Reformas no reconoce el problema que el anuncio describe**: es venta educativa, no de respuesta directa.
- Diagnóstico: no es un problema de targeting ni de creatividad. Es de **oferta en reformas** y de **formulario** (siguiente bloque). Y de que el KPI de optimización (lead) no es el evento de negocio (reunión hecha): el evento «Schedule» sí se manda a Meta (`_cita.js:135`); no se manda «reunión hecha» porque no existe el dato.

### A2 · Landing y formularios

- **Formulario instantáneo de Meta**: intro «Para clínicas que YA invierten…», botón «Ver si encajo», inversión (5 tramos), volumen, dónde se te escapa (5 opciones, sin campo libre), nombre, empresa, email, teléfono. Clic → envío 14,4 %. Paid detectó el 19-sep que 3 de 5 intercambiaban nombre y empresa (orden de campos). Pantalla de gracias: «Te escribo en unos minutos. Te mando un WhatsApp con una pregunta» + «Elegir hora ahora» (funciona: `diagnostico/landing.js:174` lee `?paso=agenda` y abre el calendario; cuántos lo pulsan: falta dato).
- **Landing /diagnostico/** (vista como usuario): claro, una promesa («te decimos dónde se te escapa el dinero entre el anuncio y el cierre»), prueba social con números, los ocho puntos, garantía del piloto. Formulario en dos pasos: sector, equipo, inversión, web → nombre, email, teléfono, **hipótesis en texto libre** («tu corazonada en una frase»). Después, calendario embebido. Es el flujo que produjo las dos únicas reuniones hechas de las semanas 37-38, pero esta semana no recibió tráfico de pago: **0 leads de landing de esta campaña** (CL-1 entró por /clinicas).
- **Verticales** (/clinicas/, /formacion/, /reformas/, /asesorias/): coherentes entre sí, hablan el idioma del sector («paciente», «matrícula», «presupuesto»), formulario con hipótesis pre-rellenada por sector. Inconsistencias: prometen «plan por escrito en 48 h» y la portada, /diagnostico/ y /llamada/ prometen «24 horas». Clínicas dice «todavía no tenemos un caso de clínica publicado» (honesto; pero es la vertical que más convierte y no tiene caso).
- **/prueba/**: buena idea, bien explicada («te suena el móvil, es ella»); riesgos en A13.
- **Móvil**: no probado en dispositivo en esta sesión; la bitácora del 19 corrige el scroll del calendario en iPhone desde /clinicas/.
- Diagnóstico: la landing hace bien su trabajo y **no la ve casi nadie**; el formulario instantáneo trae el 100 % del volumen y pierde el 86 % en la apertura sin dar contexto a cambio. La pregunta abierta obligatoria (decisión pendiente) es lo que acerca uno al otro.

### A3 · Coherencia de promesa

Ver tabla completa en el anexo D. Resumen: se cumplen las promesas mecánicas (CRM en segundos, invitación al correo, enlace de Meet, recordatorio a las 9:00 cuando hay canal); **no se cumplen las de contacto** (WhatsApp «en unos minutos» para 8 de 20; el WA1 dice haber leído lo que el lead no pudo escribir; correo de bienvenida promete «minutos» a las 4 de la mañana), **las de canal** (Raquel dice llamada, es Meet), ni **las de plazo del plan** (24 h o 48 h según la página). Y hay una rotura de confianza estructural: **vendemos «un agente escribe por WhatsApp en dos minutos» y nuestro propio primer WhatsApp falló 6 de 6 el 19 y no tiene canal desde el 22.**

### A4 · Tiempo de respuesta

Datos lead a lead en el anexo B (entrada del brief; hora de cada envío y llamada de los avisos de Gmail, en hora de Madrid).

Primer contacto **intentado** (cualquier canal):

| Tramo | Leads | Quiénes |
|---|---|---|
| < 5 min | 9 | FO-1, FO-6, FO-7, RE-6, RE-7, RE-8, CL-1, CL-2, CL-4 (FO-1 y CL-1 no se entregaron) |
| 5-15 min | 3 | FO-4, RE-2, RE-3 |
| 15-60 min | 2 | FO-3 (46 min, llamada desde EE. UU. a buzón), RE-1 (54 min) |
| 1-12 h | 4 | CL-3 (3 h 40), RE-4 (5 h 50), FO-5 (8 h 10), FO-8 (≥ 10 h 40, pendiente) |
| > 12 h | 2 | RE-5 (27 h, marcado «fuera»), FO-2 (más de dos días, marcado «fuera») |

Primera **llamada** (voz 1), que es lo que el anuncio promete «a las 9:30»:

| Situación | Latencia | Leads |
|---|---|---|
| Entre semana, en ventana | 20 min | FO-6, FO-7, RE-6 (los tres: 20 min exactos, como dicta el código) |
| Sábado por la mañana | 46 min | FO-3 (desde el +1 775, buzón) |
| Sábado tarde / domingo | 19 h 30 a 49 h | FO-4, RE-2, RE-3, RE-4, RE-1, RE-5 |
| Noche entre semana | 4 h 40 a 12 h 40 | CL-3, CL-4, FO-5 |

Mediana de la primera llamada para los 7 leads del fin de semana: **unas 31 horas**; para los 6 leads entre semana en ventana o de noche: **20 min a 12 h 40**. Y los 7 del fin de semana recibieron la llamada **entre las 9:00:37 y las 9:00:44 del lunes**, en tanda (avisos de Gmail), justo cuando entran a trabajar: FO-4 pidió que la llamaran a las 11:30. Media y mediana por vertical no tienen sentido con 4-8 leads; el patrón es de día de la semana, no de vertical.

Impacto: los 3 leads que llegaron a cita por Raquel y se presentaron a nada (FO-4, FO-5, RE-6) tuvieron latencias de 19 h 30, 9 h 10 y 20 min: **la velocidad no predice la asistencia** (H-SHOW-01 de Paid). Lo que sí la predice, con la muestra que hay, es haber leído y escrito antes (CL-1).

### A5 · Activación del lead

- Contactabilidad: 18 de 20 con canal (FO-1 sin canal: número no conecta ni recibe WhatsApp; FO-8 pendiente).
- Tasa de respuesta por WhatsApp: 6 de 20 (30 %). Por vertical: clínicas 3 de 4, reformas 3 de 8, **formación 0 de 8**.
- Tasa de conversación (WhatsApp o voz con el lead): 10 de 20 (50 %).
- Canales rotos: API oficial del 647 (sin plantilla: `failed` en silencio); pasarela 663 (restringida); plantilla directa (token sin permiso y además no se intenta por defecto). Correo: sale (bienvenida al minuto cero, cadencia días 2/6/9).
- Fricción: el WA1 genérico pide «¿te va bien que lo veamos por aquí un momento?» sin decir qué; al que contesta, el agente de WhatsApp estuvo **mudo del 21 al 22 a las 19:49** por una clave de Anthropic mal puesta (daily de Growth). Es decir, durante el pico de la semana quien contestaba al WhatsApp no recibía respuesta automática.
- Seguimiento: la cadencia (WA1 → voz1 20 min → WA2 2 h → voz2 día siguiente → correo día 2 → WA3 día 4 → correos 6 y 9 → «No responde») se ejecuta; dos leads ya cerrados en «No responde» (FO-3, RE-3, RE-4 según brief: tres). Reenganche 1/3/5 en código; cuenta como intento un mensaje fallido (`_reenganche.js:139`).

### A6 · WhatsApp

| Pieza | Estado | Dependencia | Fallo |
|---|---|---|---|
| Primer mensaje por API oficial (647) | **roto** | ventana de 24 h que un lead nuevo no tiene | `failed` silencioso; etiqueta `act-wa1` se pone igual (Paid 19-sep) |
| Primer mensaje por plantilla del 647 | **parcial** | workflow de GHL con etiqueta `wa-primer-contacto`; envío directo sin permiso | no se intenta directo salvo `GATEWAY_PRIMERO=0`; depende de que el workflow esté encendido (Paid: tres versiones, dos apagadas) |
| Pasarela 663 (Wazzap) | **crítico** | número personal, móvil encendido, cliente no oficial | restringido el 22; tope 20/día en código |
| Respuestas (agente de WhatsApp) | operativo desde el 22 19:49 | clave de Anthropic; ventana de 24 h abierta por el lead | mudo del 21 al 22 |
| Confirmación de cita | parcial | plantilla directa (sin permiso) → `enviarMensaje` → workflow `wa-confirmacion-cita` | sin respaldo por correo propio (solo invitación de GHL) |
| Recordatorio 9:00 y víspera 18:30 | **crítico con la pausa** | canal del hilo (647 o pasarela) | si el hilo iba por la pasarela: error, sin correo |
| Avisos al móvil de Maikel | **roto con la pausa** | pasarela | fallan en silencio |
| Reenganche 1/3/5 | parcial | `enviarMensaje` | intento fallido cuenta como hecho |

Mejora: un único camino sancionado (647 con plantillas para todo lo que abre conversación; texto libre solo dentro de las 24 h) y **correo como respaldo obligatorio** de confirmación y recordatorio. El 663 solo para Maikel a mano.

### A7 · Voz y llamadas (Raquel)

Notion, llamadas del 18 al 22 (61 en total, coincide con el brief):

| Campaña | Llamadas | Cogió el lead | Cogió otra persona | Cita | Buzón | Sin respuesta / no conectó |
|---|---|---|---|---|---|---|
| Lead form Meta | 39 | 6 (15 %) | 2 | 4 | 15 | 13 |
| Landing | 2 | 0 | 1 | 1 | 1 | 0 |
| Base antigua (no es pago) | 13 | 1 | 4 | 0 | — | 6 |
| Pruebas de Maikel | 7 | | | | | |

- Ratio contacto (lead al teléfono) por llamada: **15 %**. Por lead único de pago: 5 de 20 (25 %).
- Ratio cita por conversación con el lead: 4 de 6 (67 %). Cuando Raquel habla con la persona, agenda. **El problema no es el guion de cierre: es que casi nunca habla con nadie y que a quien agenda no le ha contado nada.**
- Ratio cita → reunión de las citas de Raquel: 0 de 3 resueltas (FO-5, RE-6, FO-4). La cuarta (FO-7) es mañana.
- Coste: 6,19 $ por 63 minutos; 0,56 $ por conversación real (Paid). Irrelevante.
- Guion: 22 correcciones aplicadas entre el 16 y el 22 (bitácora), la mayoría de comportamiento mecánico (buzones, locuciones, IVR, colgar tras el adiós, «¿eres una máquina?», ordinales, pronunciación). Lo que sigue pendiente y no es guion: primera llamada de fin de semana a las 9:00 en punto y en tanda; reintentos sin contexto (RE-6 antiguo: «la última vez que te llamo» → «¿de qué tema me habla?»); hasta 4 buzones al mismo lead contra la regla del diseño («dos llamadas como máximo»); base antigua todavía desde el +1 775.
- Horarios: voz entre semana 9-14 y 16-20, sábado 10-14, domingo nunca (`_activacion.js:42-54`); el documento de diseño dice 9:30-14 de lunes a viernes. El código manda.
- Calidad percibida: dos leads preguntaron si era una máquina; con la respuesta nueva («sí, soy la asistente de IA de Máikel; la reunión es con él») FO-7 agendó igualmente.

### A8 · Calidad del lead

- Inversión declarada: 5 de 20 «nada todavía», 12 «no lo sé» o «< 500 €» (brief). Solo 3 de 20 declaran entre 500 y 5.000 € con más de 50 peticiones (FO-3, FO-8, CL-4) y un cuarto (RE-6, 2.000-5.000 € con < 5 presupuestos).
- Fuga declarada: 11 «no lo sé», 3 seguimiento, 3 respuesta, 3 anuncios (Paid). Los que dicen seguimiento son casi todos clínicas.
- Puntuación A-D (hoja, 22-sep 14:15, 23 leads incluidos anteriores): A 2 · B 7 · C 5 · D 9. De la semana: 2 A (CL-1 y FO-4), 6 B, 4 C, 8 D. Dos de las tres citas de mañana son C (FO-7, CL-2): el modelo penaliza la inversión y premia poco la cita; Notion v2 §10 lo tiene como pendiente.
- ICP (invierte algo, más de 20 peticiones, sector de las cuatro verticales): **7 de 20** (CL-1, CL-3, CL-4, FO-3, FO-4, FO-6, FO-8). No ICP por inversión cero: 5. Curiosos (reformas «no lo sé» con < 15 presupuestos): 6. **% ICP: 35 %.**
- Cruce con resultado: la reunión hecha (CL-1) es ICP; los 3 plantones de Raquel: 1 ICP (FO-4), 2 no (FO-5 con < 20 y RE-6 con < 5 presupuestos aunque invierte). Las citas se están cerrando con quien coge el teléfono, no con quien encaja: **Raquel agenda a la persona menos comprometida** (brief, hipótesis 1) y a veces a la que menos encaja.
- Por sector: clínicas 4 leads, 3 ICP, 1 reunión, 0 plantones firmes; es la vertical con mejor calidad y peor CPL. Reformas 8 leads, 0 ICP claros, 5 D.

### A9 · Cita y show rate

- Lead → reserva: 9 de 20 (45 %). Reserva → confirmación real (el lead confirma la víspera): **no se mide** (la respuesta a «¿sigue en pie?» no se procesa). Reserva → asistencia: 1 de 6 resueltas (17 %). No-show: 5 de 6 (83 %).
- Las 9 citas: 4 por Raquel (3 plantones, 1 pendiente), 1 por el agente de WhatsApp (pendiente), 4 por Maikel o el lead por el enlace (1 hecha, 2 plantones, 1 reagendada/pendiente). Con esta muestra: **0 de 3 de Raquel, 1 de 3 de las que el lead o Maikel cerraron por escrito**.
- Causas probables, ordenadas por evidencia: (1) no sabían qué compraban ni cuánto costaba (transcripciones de FO-4 y RE-6); (2) cita a 1 día, por la mañana, cerrada por teléfono con una IA («¿eres una máquina?»); (3) recordatorio de las 9:00 sin confirmación y, el 22, tres citas a 30 minutos; (4) canal: videollamada por Meet a gente que esperaba un teléfono (FO-4).
- Recordatorios: cron 9:00 (mismo día) y 18:30 (víspera, si reservó con 2+ días). Sin liberación, sin procesar respuesta, sin correo de respaldo si el WhatsApp no sale. **No se sabe si los del 22 salieron** (falta dato).
- No-show: no se detecta; el proceso 3c no está en código; FO-2 y FO-5 se trabajaron a mano (Maikel) y FO-2 colgó a los 12 s la llamada en frío de Raquel.
- Compromiso: hoy cero (sin precio, sin dato pedido, sin confirmación). Notion v2 y H-SHOW-01 de Paid proponen lo mismo: pedir algo pequeño antes de la cita.

### A10 · CRM (GoHighLevel)

- Etapas: Nuevo → Conversación → Reunión agendada → Negociación/Oferta/Piloto/Cliente, más «No presentado» y «No responde» (nuevas el 22). Tratos por lead con origen, fuente, sector y anuncio (`_tratos.js`). Notas por cada llamada, cada envío y cada evento. Bien.
- Automatizaciones: la cadencia vive en el cron de Vercel leyendo etiquetas de GHL; **en GHL hay tres workflows del primer contacto (dos apagados) y dos «Aviso cita» duplicados** (Paid 19-sep): cualquiera enciende el que no toca. Los workflows de plantilla (`wa-primer-contacto`, `wa-confirmacion-cita`, `wa-prueba-agente`) son hoy la única vía sancionada de WhatsApp y no son visibles desde el código.
- Campos: Score · Tipología / Comportamiento / Nivel / Motivo; campos WA del agente. Faltan los cuatro que pidió Paid el 21 (`contactado_en` del primer contacto **entregado**, `resultado_llamada`, `motivo_no_encaja`, `ticket_estimado`); Growth los dio en el daily del 22 a mano.
- Etiquetas: `activacion` y `act-wa1` se ponen falle o no el envío (Paid); `act-fin` en vez de `no-responde`; `no-presentado` y `reunion-celebrada` no las pone nadie; `aviso-movil-pendiente` se queda para siempre en leads de landing nocturnos.
- Duplicados: FO-3 envió dos veces (Meta 21, CRM 20): el upsert por email lo resolvió.
- Trazabilidad: buena hacia atrás (cada envío deja nota) y mala hacia delante (**el resultado de la cita no se cierra**: citas del 17 y 18 en «confirmed» cinco días después; una «showed» que no se hizo).

### A11 · Dependencias humanas

| Proceso | Depende de | Riesgo |
|---|---|---|
| Primer contacto por WhatsApp (desde el 22) | Maikel a mano desde su móvil, o de que regenere el token | Sin él, el lead solo recibe llamada y correo |
| Avisos al móvil | La pasarela (número personal de Maikel, móvil encendido) | Fallan en silencio con la pausa |
| Confirmación y recordatorio de mañana | Maikel a mano | Tres citas dependen de que se acuerde |
| Detección de no-show y su proceso | Maikel («no se pudo conectar») | Sin dato, sin proceso, sin tasa |
| Cerrar el resultado de la cita | Maikel en GHL | Cinco días sin cerrar las del 17 y 18 |
| Respuestas de los leads en «Negociación» o superior | Aprobación de Maikel (regla del 22) | Correcto por diseño; cuello si hay 10 a la vez |
| Leads que «lleva Maikel» (CL-3, CL-4, RE-2, RE-7) | Maikel escribe | 4 de los 6 que contestaron están en su bandeja; el agente se aparta (`wa-humano`) |
| Reunión y propuesta | Maikel | Única persona; 3 citas a 30 min el 22; 2 citas dentro de la sesión del 23 |
| Encender/apagar workflows en GHL | Interfaz de GHL, a mano | Tres versiones del mismo workflow |
| Escuchar grabaciones y corregir a Raquel | Agente de operaciones cada día | Bien, pero el cambio es manual en Vapi con copia previa |
| Decisiones de precio, canal, liberación | Maikel | Pendientes desde el 22; todo el rediseño espera |
| Grabación de reuniones | Nadie | La reunión que vende es la única sin transcripción |

### A12 · Datos y atribución

- Meta ← sistema: evento «Lead» al entrar y «Schedule» al agendar; «Disqualified» para sin canal. No hay «reunión hecha» ni «propuesta» de vuelta a Meta porque no existe el dato. Meta optimiza a lead, y el lead que optimiza es el que abre el formulario en Instagram y marca «no lo sé».
- Meta → CRM: id de formulario, anuncio y lead en etiquetas (`form-`, `creativo-`, `meta-lead-`). Bien. El webhook perdió 8 de 9 leads del 15 al 19 por la comprobación de firma (corregido) y se rescata cada 10 min (`rescate-leads`).
- CRM → hojas y bus: la hoja semanal cuenta «diagnósticos hechos» de una forma que da 5 cuando hubo 1 (probablemente `appointmentStatus` de GHL, que nadie cierra). El bus Paid ↔ Growth funciona desde el 21 (antes, 33 líneas que nadie leía).
- Cortes distintos: Paid 302,56 € / 149 / 21 vs brief 291,90 € / 146 / 20. No es error pero obliga a decir siempre el corte.
- Pérdidas: aperturas de formulario (Ads Manager, no API); clics en «Elegir hora ahora»; hora del primer contacto **entregado** (hoy solo intentado); confirmaciones de víspera; resultado de la reunión; grabación de la reunión.
- Atribución landing vs formulario: **no comparable esta semana** (0 leads de landing de pago). Las dos reuniones hechas en dos semanas vinieron de landing; n = 2.

### A13 · IA y automatización (por impacto)

1. Confirmación de víspera procesada por el agente + liberación (cuello).
2. No-show automatizado (10 min, llamada, día 2, día 5).
3. Plantilla de apertura con fuga, qué montaríamos y precio (textos hechos).
4. Raquel: llamar solo con el WhatsApp entregado; reintentos con contexto; tope de llamadas; fin de semana escalonado.
5. Cierre del resultado de la reunión en un clic → scoring, hoja, bus, Meta.
6. Scoring con las etiquetas que el sistema sí pone; peso de la cita revisado.
7. Transcripción de reuniones → patrones del viernes.
8. Demo /prueba: verificación del móvil, tope por IP, texto honesto.
9. Reporting con un solo origen.
Lo que ya hay y está bien: registro de llamadas en Notion con audio e hipótesis, corrección diaria del guion, scoring A-D dos veces por hora, reenganche 1/3/5 escrito por el agente en contexto, avisos al minuto, trazas del webhook en un contacto del CRM.

### A14 · Pérdida de ingresos

Ver §12. Resumen a gasto constante y con los supuestos declarados: hoy 1 reunión/semana; realista 4,5; la diferencia son **unos 3.500 € de primer mes y 2.600 €/mes de recurrente al mes** de pilotos que no se abren. Escenario agresivo (formulario + confirmación): ~9,5 reuniones/semana, que exige reuniones de 10-15 min por teléfono para que Maikel las absorba.

### A15 · Madurez del sistema (1-10)

| Área | Nota | Por qué |
|---|---|---|
| Captación | 5 | CTR y CPL razonables; público abierto con frecuencia 2,0 a los cinco días; oferta de reformas no reconoce el problema; KPI de optimización no es el de negocio |
| Landing | 6 | Clara, coherente por vertical, formulario con hipótesis; sin tráfico de pago; plazos 24/48 h inconsistentes; sin caso de clínica |
| Formularios | 3 | Instantáneo de Meta: 14 % de envío, pregunta que repele, sin campo abierto, campos en orden que confunde |
| Tracking | 4 | Eventos Lead/Schedule a Meta y trazas del webhook bien; resultado de cita sin cerrar; tres cifras de reuniones hechas; etiquetas que mienten |
| Velocidad de respuesta | 4 | 20 min en horario; 4-49 h fuera; tanda de las 9:00 |
| WhatsApp | 2 | Sin canal sancionado; número personal restringido; recordatorios y avisos sin respaldo |
| Voz | 5 | Funciona y cuesta nada; alcanza al lead en 15 % de las llamadas; guion corregido a diario; cadencia (fin de semana, reintentos, tope) sin corregir |
| CRM | 5 | Etapas, tratos, notas, scoring; workflows duplicados; etiquetas incoherentes; no-show manual |
| Calendario | 6 | Reserva fiable (duración corregida el 18), Meet fijo, invitación automática; sin liberación; huecos a 30 min la misma mañana; solapes |
| Confirmaciones | 2 | Recordatorio sin confirmación procesada; sin canal desde el 22; 5 plantones de 6 |
| Ventas | 4 | 1 de 1 a propuesta; sin precio previo; sin grabación; n = 1 |
| Automatización | 6 | Mucho montado en diez días y funcionando; fallos silenciosos (pasarela, avisos, etiquetas) |
| IA | 6 | Agente de WhatsApp, Raquel, scoring, reenganche, demo; agente mudo 24 h por una clave |
| Reporting | 4 | Bus y hoja semanal existen; cifras que no cuadran; informe de patrones vacío |

---

# Anexo B · Tiempo de respuesta, lead a lead

Hora de Madrid. Entrada: brief. Envíos y llamadas: avisos automáticos del sistema en Gmail (los WhatsApp 1 que salen en ventana los manda el webhook sin aviso, por eso figuran como «al momento» sin hora verificada). Resultado: brief y Notion.

| Lead | Entró | 1er intento | Espera | 1ª llamada | Espera llamada | Qué pasó |
|---|---|---|---|---|---|---|
| FO-1 | vie 18 18:40 | WA1 al momento (663 falló ×3) | 0 | vie 18:42, no conectó (0 s) | 2 min | sin canal; solo correo |
| FO-2 | vie 18 22:15 | marcado «fuera» (nada todavía): sin cadencia hasta el 21 | > 2 días | falta dato | — | cita; plantón mar 22 10:00; colgó a los 12 s la llamada de no-show |
| FO-3 | sáb 19 09:15 | llamada 10:01 desde +1 775 (buzón); WA1 18:30 por pasarela | 46 min / 9 h 15 | sáb 10:01 | 46 min | 4 buzones; No responde. Envió el formulario dos veces (09:15 y 18:20) |
| FO-4 | dom 20 13:30 | WA1 13:40 | 10 min | lun 21 09:00 («llámame a las 11:30»; 18:08 cogió y agendó) | 19 h 30 | cita mar 11:00; plantón. Creía que era teléfono; tiene agencia |
| FO-5 | dom 20 23:50 | WA1 lun 08:00 | 8 h 10 | lun 09:00 | 9 h 10 | cita mar 10:00; plantón. Rechazó los dos primeros huecos |
| FO-6 | mar 22 10:20 | WA1 al momento | 0 | mar 10:40 (buzón); WA2 12:20 | 20 min | en cadencia |
| FO-7 | mar 22 16:10 | WA1 al momento | 0 | mar 16:30 (300 s, cita) | 20 min | cita mié 17:00 |
| FO-8 | mar 22 22:20 | nada (fuera de ventana; pasarela en pausa) | ≥ 9 h 40 | pendiente (mié 9:00 como pronto) | ≥ 10 h 40 | universidad, 2.000-5.000 €, > 100: el mejor lead de la semana entra a la hora en que el sistema no tiene canal |
| RE-1 | sáb 19 08:15 | marcado «fuera»; rescatado por pasarela 09:09 | 54 min | lun 21 (3 llamadas, locución + buzón); mar 10:20 locución | ~49 h | sin hablar |
| RE-2 | sáb 19 14:40 | WA1 14:50 | 10 min | lun 09:00 (buzón ×2) | 42 h 20 | contestó por WhatsApp; lo lleva Maikel |
| RE-3 | sáb 19 18:30 | WA1 18:40 | 10 min | lun 09:00 (no conectó ×2) | 38 h 30 | No responde |
| RE-4 | dom 20 02:10 | WA1 08:00 | 5 h 50 | lun 09:00 (no conectó ×2) | 30 h 50 | No responde |
| RE-5 | dom 20 09:10 | marcado «fuera» + correo de descarte | 27 h | lun 12:15 (no es el lead; «me llegó un correo de que no interesaba») | 27 h | descartado por error del sistema; queda para Maikel |
| RE-6 | lun 21 10:10 | WA1 al momento | 0 | lun 10:30 (273 s, cita) | 20 min | cita mar 10:30; plantón. «¿Pregunta: de momento?» |
| RE-7 | lun 21 13:30 | WA1 al momento | 0 | no (contestó al WhatsApp) | — | lo lleva Maikel |
| RE-8 | mar 22 12:30 | WA1 al momento | 0 | no (agendó con el agente a los 26 min) | — | cita mié 10:00 |
| CL-1 | sáb 19 08:58 (landing) | WA1 falló ×2 (API oficial) | nunca entregado | no (escribió ella primero) | — | reunión hecha lun 21; propuesta 1.000 € |
| CL-2 | dom 20 15:56 | falta dato (sin aviso en Gmail) | — | mar 22 16:07 (buzón; era la llamada de plantón) | — | cita mar 16:00; plantón; movida a mié 17:45 |
| CL-3 | lun 21 04:20 | WA1 08:00 | 3 h 40 | lun 09:00 (buzón); mar 09:00 (buzón) | 4 h 40 | contestó con audio mar 12:17; semana del 28 |
| CL-4 | lun 21 20:20 | WA1 al momento | 0 | mar 09:00 (comunicando); WA2 09:10 | 12 h 40 | contestó; lo lleva Maikel |

# Anexo C · Las 9 citas

| Cita | Lead | Quién la cerró | Cuándo se cerró → cuándo era | Margen | Resultado |
|---|---|---|---|---|---|
| 1 | CL-1 | el lead (escribió primero) / Maikel | sáb 19 → lun 21 | 2 días | **hecha**, propuesta |
| 2 | FO-2 | por escrito (contestó, varios mensajes) | falta dato → mar 22 10:00 | — | plantón; Maikel propuso 10:00/17:30, sin respuesta |
| 3 | FO-5 | Raquel, lun 09:00 | lun 21 → mar 22 10:00 | 1 día | plantón |
| 4 | RE-6 | Raquel, lun 10:30 | lun 21 → mar 22 10:30 | 1 día | plantón |
| 5 | FO-4 | Raquel, lun 18:08 | lun 21 → mar 22 11:00 | < 1 día | plantón |
| 6 | CL-2 | por escrito (Maikel) | falta dato → mar 22 16:00 | — | plantón; movida a mié 17:45 |
| 7 | RE-8 | agente de WhatsApp | mar 22 12:56 → mié 23 10:00 | < 1 día | pendiente |
| 8 | FO-7 | Raquel, mar 16:30 | mar 22 → mié 23 17:00 | 1 día | pendiente |
| 9 | CL-2 (reagendada) | Maikel | mar 22 18:11 → mié 23 17:45 | 1 día | pendiente |

Tres de las cuatro citas cerradas por voz fueron para la mañana siguiente entre las 10:00 y las 11:00; ninguna llevaba precio ni nada leído; ninguna se confirmó la víspera (no cumplían la regla de 2+ días para el recordatorio de víspera).

# Anexo D · Coherencia de promesa

| Dónde | Promesa | Evidencia | ¿Se cumple? | Riesgo |
|---|---|---|---|---|
| Anuncio | «A los 4 segundos está en el CRM sin que nadie copie nada» | Webhook → GHL; trazas; rescate cada 10 min. Del 15 al 19 se perdieron 8 de 9 por la firma (corregido) | Sí, desde el 19 | Bajo |
| Anuncio | «A las 9:30 le ha llamado una voz, le ha resuelto dudas y le ha dado hora» | 20 min en ventana; fin de semana 19-49 h; lunes 9:00 en tanda; Raquel no resuelve dudas de precio (prohibido en su guion) | Parcial | Medio: es la frase del anuncio |
| Anuncio | «A los 3 días… fecha de seguimiento y siguiente paso» | Reenganche 1/3/5 sí; no-show no; seguimiento post-reunión no | Parcial | Medio |
| Formulario (intro) | «Quince minutos… sales con un plan por escrito» | 1 reunión, 1 propuesta | Sí (n = 1) | Bajo |
| Pantalla de gracias | «Te escribo en unos minutos. Te mando un WhatsApp con una pregunta» | 8 de 20 esperaron 3 h 40 a 49 h; desde el 22 sin canal; WA1 sin pregunta concreta | **No** | Alto: primera impresión |
| Pantalla de gracias | «Elegir hora ahora» | `landing.js:174` abre el calendario | Sí | Bajo (cuántos lo usan: falta dato) |
| WhatsApp 1 | «he leído lo que me has contado de tu empresa» | El formulario de Meta no tiene campo libre | **No** | Alto: suena a plantilla que finge |
| WhatsApp 1 (fin de semana) | «¿te va bien que lo agendemos para el lunes?» | La llamada del lunes sale a las 9:00 sin haber agendado nada | Parcial | Medio |
| Correo de bienvenida | «Te escribo por WhatsApp en unos minutos» (siempre, también de madrugada) | `diagnostico.js:214` pasa `waAhora` como verdadero si hay teléfono | **No** de noche | Medio |
| Correo de bienvenida / portada / /diagnostico / /llamada | «plan por escrito en 24 horas» | Verticales dicen «48 horas» | Inconsistente | Bajo |
| Raquel (guion antiguo) | «llamada» / cita telefónica | Es videollamada por Meet (FO-4) | **No** (corregido el 21, sin verificar en grabación) | Alto para el plantón |
| Raquel | «te acabo de mandar la invitación a tu correo» | GHL envía la invitación (`toNotify`) | Sí | Bajo |
| Confirmación por WhatsApp | «quince minutos por videollamada, este es el enlace» | Sale si hay canal; sin respaldo por correo propio | Parcial | Medio |
| Recordatorio 9:00 | hora + enlace + «qué veremos» | Sale si hay canal; sin canal, error sin correo | Parcial | Alto mañana |
| Víspera 18:30 | «¿Sigue en pie?» | Nadie procesa la respuesta | **No** (pregunta retórica) | Alto |
| Landing verticales | «Un agente escribe por WhatsApp en dos minutos, con lo que el cliente ha contado, no con una plantilla» | Nuestro propio WA1 es genérico, falló 6 de 6 el 19 y no tiene canal desde el 22 | **No en nuestro propio embudo** | Alto: es lo que vendemos |
| Demo /prueba (correo del dueño) | recordatorio el día antes y a las 9:00; «si no viene: llamada de la agente y nuevo hueco»; seguimiento días 1, 4 y 10 | No existe en código | **No** | Medio (sin tráfico de pago aún) |
| Ritual / proceso comercial | «No presentado: mismo día a los 10 minutos… Raquel llama» | No implementado | **No** | Medio |

# Anexo E · Preguntas para Maikel el 23-sep

1. Las cuatro del Proceso v2: ¿precio orientativo (1.000 € + 750 €/mes con garantía) en el primer mensaje? ¿Teléfono por defecto en vez de Meet? ¿Se libera el hueco si no confirma la víspera? ¿Qué número de piloto por vertical?
2. ¿Regeneras hoy el token de Meta con la cuenta de WhatsApp del 647? ¿Quién envía a aprobación las plantillas nuevas?
3. ¿El 663 vuelve a usarse para algo automático, o solo tú a mano? (Recomendación: solo tú.)
4. Reformas: ¿10 €/día y probar la oferta «que ningún presupuesto se quede sin respuesta», o pausar y pasar a clínicas? Asesorías: ¿14 días o fuera?
5. ¿Formulario de Meta con pregunta abierta obligatoria en lugar de la de presupuesto (A/B 14 días), o las dos preguntas?
6. ¿Quién cierra el resultado de cada cita el mismo día y cómo (un clic desde el aviso)? ¿Qué pasó con las citas del 17 y 18 y con la de FO-2 marcada «showed»?
7. ¿Salieron los recordatorios del 22 a las 9:00 a FO-5, RE-6 y FO-4? (Notas de GHL.)
8. ¿Cuántas aperturas de formulario ves en el Ads Manager por anuncio y plataforma?
9. ¿Movemos la sesión de mañana o las citas de las 17:00 y 17:45?
10. ¿Activamos la transcripción de Meet en la sala fija para grabar las reuniones desde mañana?
