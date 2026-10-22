# Plan de contenidos · 26-oct a 30-nov

> **Encargo:** Maikel, vía Chief of Staff (22-oct). Las redes no se paran y no dependen siempre de Maikel.
> **Base:**
> - posicionamiento y pilares de mensaje: Notion, «Base de mensajes de Qualivo · v0»;
> - cliente ideal: `content/estrategia/2026-10-15-cliente-ideal.md`;
> - dolores y objeciones con las palabras del cliente: base de mensajes, §1;
> - reglas: `content/content-os-v1.md`, R1-R18.
>
> **Estado:** propuesta para que Maikel la apruebe. No se publica ni se envía nada hasta que pase por la regla de aprobación (sección 4).

## 1. En una página

- **Para quién escribimos:** dueños y responsables comerciales de empresas con equipo, que ya captan solicitudes (sobre todo con anuncios) y venden con llamada, visita, asesor o presupuesto. Sobre todo formación y reformas, que son los sectores del piloto.
- **Qué queremos que piensen:** «esto me pasa a mí» (R13), y que Qualivo sabe arreglarlo porque lo hace en su propia casa.
- **Qué medimos:** conversaciones con perfiles que encajan, visitas a /formacion/ y /reformas/ con UTM y diagnósticos que salen de ahí. El alcance y los «me gusta» se apuntan, pero no deciden.
- **Cómo lo hacemos sin depender de Maikel:**
  - el jueves está listo el lote de la semana siguiente;
  - el viernes Maikel lo aprueba de una vez, en unos 20 minutos;
  - se programa lo aprobado.
- **De dónde sale cada pieza:** de algo que ha pasado de verdad en nuestro sistema o en una conversación con un cliente potencial (R1). Sin dato, no hay pieza.

## 2. Una obsesión por semana

Siguen el orden del trimestre del Content OS (§5.3). La semana 47 se alinea con el anuncio de Paid «Solicitudes de calidad», que sale el 17-nov.

| Semana | Tema | Pilar de mensaje | Pieza del blog que se refuerza | Dato real de partida |
|---|---|---|---|---|
| **44 · 26-oct a 1-nov** | Seguimiento de propuestas y cierre | P2 y P3 | /blog/presupuestos-sin-respuesta/ (re-apuntado el 22-oct) | Tareas a los 2, 5 y 10 días con borrador al enviar una propuesta (19-oct). Tarea a los 30 días en Negociación. Dos tratos de 0 € al limpiar el CRM (1-oct). |
| **45 · 2 a 8-nov** | Citas que se celebran | P2 | /blog/cliente-no-se-presenta-a-la-cita/ | Recordatorio de la víspera que pide un «sí» y aviso una hora antes (`api/recordatorios-hora.js`). Sin la tasa propia de plantones (R7). |
| **46 · 9 a 15-nov** | Medir de qué anuncio sale cada venta | P4 | /blog/conversiones-offline-meta/ | Los 28 «cualificados» que eran reservas (19-oct). El 21-oct, 0 de 1.159 contactos llevaban la etiqueta del blog. |
| **47 · 16 a 22-nov** | Una solicitud buena se atrae | P1 | /blog/cualificar-leads/ y /blog/lead-scoring/ | Las dos notas de cada contacto («quién es» y «qué hace»). El grupo «nada todavía» de inversión: 0 reuniones de 11 (Paid). |
| **48 · 23 a 30-nov** | Un CRM que el equipo usa | P3 | /blog/equipo-comercial-no-usa-el-crm/ | Una tarea con fecha en cada trato abierto (6-oct). Las objeciones «la tercera implantación» y «la gente no usa el CRM». Casos de clientes solo si llega el permiso escrito (R6). |

## 3. Ritmo y formatos

| Canal | Piezas por semana | Días | Formatos |
|---|---|---|---|
| **LinkedIn, perfil de Maikel** | 3 | Lunes, miércoles y jueves | Texto, con imagen solo si es una captura real. Series: «Agentizando mi propia empresa» (lunes), bandera roja (miércoles), historia u opinión de la semana (jueves). |
| **LinkedIn, página de Qualivo** | 2 | Martes y viernes | En voz de «nosotros»: cómo trabajamos y la pieza de la semana adaptada. No repite el texto del perfil. |
| **Instagram de Maikel** | 2 (más 1 opcional) | Martes y viernes (domingo, opcional) | Infografía de una imagen, 1080 × 1350 (formato de casa). Vídeo corto con voz y pantalla. Tarjeta «Sin humo» como opcional. |
| **Newsletter general de Qualivo** | 1 cada dos semanas | Miércoles 28-oct, 11-nov y 25-nov | Una idea y un CTA. |
| **Grabación** | 1 sesión, 4 guiones | La propone Maikel. El lote los deja listos el jueves anterior | Por defecto, voz de Maikel sobre pantalla (R14). Cada guion tiene una versión a cámara por si Maikel la quiere. |

**Sobre la cámara.**
- **Lo que pide el encargo:** vídeos de Maikel a cámara.
- **Lo que dijo Maikel el 22-oct, para el anuncio:** que de momento no quiere salir a cámara.
- **Cómo lo resuelvo:** los guiones se graban con voz sobre pantalla salvo que Maikel diga otra cosa. Cada guion indica qué se ve en pantalla en cada frase.

**Mezcla de CTA (R15):**
- la mitad, conversación (una pregunta al final);
- un tercio, recurso (blog o demo de /formacion/ o /reformas/);
- uno de cada cinco, diagnóstico.
- Como mucho, un CTA por pieza.

**UTM (Content OS §9):**
- `utm_source`: linkedin, instagram o newsletter.
- `utm_medium`: organic, o email en la newsletter.
- `utm_campaign`: la de la semana (`s44-seguimiento-propuestas`, `s45-citas`, `s46-atribucion`, `s47-cualificacion`, `s48-crm`).
- `utm_content`: el slug de la pieza.

## 4. Aprobación y publicación

1. **El jueves:** el lote de la semana siguiente queda en `content/redes/semana-NN/lote.md` y en Notion, con cada pieza marcada como **sin riesgo** o **necesita ok**.
2. **El viernes:** Maikel lo revisa de una vez. Lo aprobado se programa.
3. **Si el viernes no responde,** solo salen las piezas **sin riesgo**:
   - sin cifras de resultados;
   - sin clientes ni contactos, aunque sea sin nombre;
   - sin promesas;
   - sin decisiones pendientes.
   - Los datos de nuestro propio sistema que ya están publicados (el blog, por ejemplo) cuentan como sin riesgo. Si Maikel lo prefiere más estricto, lo cambio.
4. **Antes de darse por buena,** cada pieza pasa el Master Reviewer (R18).
5. **Lo que no se hace nunca:**
   - publicar algo que no haya pasado por esta regla;
   - enviar una newsletter sin su autorización escrita y con la audiencia cerrada (R17).

**Programación:** con la herramienta que ya tenemos (el planificador social de GHL). Ver los bloqueos.

## 5. Newsletters: tres sin que nadie reciba dos

- **Las sectoriales** (formación y reformas) son el encargo de Growth, con Contenido y Automations, con entrega el 27-oct. Van a los contactos aptos de esos dos sectores.
- **La general** va al resto de la base apta: otros sectores y sector desconocido.
- **La regla:**
  - cada persona recibe como mucho una newsletter cada dos semanas;
  - quien está en un segmento sectorial no recibe la general;
  - las oportunidades activas, los clientes y quien está en una secuencia de outbound quedan fuera de las tres.
- **Calendario propuesto:**
  - general: 28-oct, 11-nov y 25-nov;
  - sectoriales: las semanas alternas (4 y 18-nov), lo que decida Growth.
- **Antes de cada envío:**
  - Growth da el recuento de la audiencia;
  - Automations prueba la baja y la deduplicación;
  - Maikel autoriza por escrito.

## 6. Calendario

**sr** = sin riesgo · **ok** = necesita ok de Maikel.

### Semana 44 · Seguimiento de propuestas (el lote completo está en `semana-44/lote.md`)

| Día | Canal | Pieza | Formato | CTA | Métrica | Riesgo |
|---|---|---|---|---|---|---|
| Lun 26 | LinkedIn perfil | Agentizando · «Me escribía demasiada gente» | Texto | Conversación | Comentarios sobre quién lleva el seguimiento | ok (depende del remitente único) |
| Mar 27 | Instagram | «Presupuesto enviado: día 2, día 5, día 10» | Infografía | Recurso: blog | Guardados y visitas al blog | sr |
| Mar 27 | LinkedIn página | «Qué pasa en Qualivo después de enviar una propuesta» | Texto | Recurso: blog | Clics | sr |
| Mié 28 | LinkedIn perfil | Bandera roja · «Un trato en negociación sin importe» | Texto | Conversación | Respuestas con su caso | sr |
| Mié 28 | Newsletter | «Después de darle a enviar» | Correo | Responder | Respuestas | ok (R17) |
| Jue 29 | LinkedIn perfil | «Día 2, día 5, día 10» | Texto | Conversación | Comentarios de perfiles que encajan | sr |
| Vie 30 | Instagram | Vídeo del guion 1 | Voz y pantalla, 45 s | Recurso: /reformas/ | Visitas con UTM | sr (cuando esté grabado) |
| Vie 30 | LinkedIn página | «La tercera implantación» | Texto | Diagnóstico | Diagnósticos | sr |

### Semana 45 · Citas que se celebran

| Día | Canal | Pieza | Formato | CTA | Riesgo |
|---|---|---|---|---|---|
| Lun 2 | LinkedIn perfil | Agentizando · «El recordatorio que pide un sí» | Texto | Conversación | sr |
| Mar 3 | Instagram | «Malo, bueno, excelente: tres recordatorios de cita» | Infografía | Recurso: blog | sr |
| Mar 3 | LinkedIn página | «Cómo confirmamos una cita» | Texto | Recurso: demo de /formacion/ (pestaña Citas) | sr |
| Mié 4 | LinkedIn perfil | Bandera roja · «Una reunión celebrada sin resultado apuntado» | Texto | Conversación | sr |
| Jue 5 | LinkedIn perfil | Opinión · por qué no enseñamos nuestra tasa de plantones (R7) y qué miramos en su lugar | Texto | Conversación | ok |
| Vie 6 | Instagram | Vídeo del guion 4 | Voz y pantalla | Recurso: /formacion/ | sr |
| Vie 6 | LinkedIn página | «La cita que cambia de hora sin llamar» | Texto | Diagnóstico | sr |

### Semana 46 · Medir de qué anuncio sale cada venta

| Día | Canal | Pieza | Formato | CTA | Riesgo |
|---|---|---|---|---|---|
| Lun 9 | LinkedIn perfil | Agentizando · «0 de 1.159» (los enlaces del blog que no dejaban rastro) | Texto con captura | Conversación | ok |
| Mar 10 | Instagram | «Una vez al día, a la semana, al mes: qué mirar» | Infografía | Recurso: blog | sr |
| Mié 11 | LinkedIn perfil | Sin humo · «28 cualificados que eran reservas» | Texto | Conversación | ok (pendiente desde el 20-oct) |
| Mié 11 | Newsletter | «Lo que le contamos a Meta» | Correo | Responder | ok (R17) |
| Jue 12 | LinkedIn perfil | Tesis contraria · el coste por contacto no dice qué anuncio funciona | Texto | Conversación | sr |
| Vie 13 | Instagram | Vídeo «Qué anuncio trae clientes, no solo contactos» (pestaña Anuncios de la demo) | Voz y pantalla | Recurso: /formacion/ | sr |
| Vie 13 | LinkedIn página | «Qué recibe Meta de nosotros y cuándo» | Texto | Recurso: blog | sr |

### Semana 47 · Una solicitud buena se atrae

| Día | Canal | Pieza | Formato | CTA | Riesgo |
|---|---|---|---|---|---|
| Lun 16 | LinkedIn perfil | Agentizando · «Dos notas para cada contacto» | Texto | Recurso: blog | sr |
| Mar 17 | Instagram | «Niveles: del formulario que solo pide el email al que separa a quien está listo» | Infografía | Recurso: blog | sr |
| Mar 17 | LinkedIn página | «Cuatro preguntas antes del primer mensaje» | Texto | Recurso: demo (pestaña Formulario) | sr |
| Mié 18 | LinkedIn perfil | Bandera roja · «El anuncio que trae a quien aún no invierte» | Texto | Conversación | ok (dato de Paid) |
| Jue 19 | LinkedIn perfil | Opinión · «Pagar por cada solicitud también es pagar por las que no iban a comprar» | Texto | Conversación | sr |
| Vie 20 | Instagram | Vídeo «Una solicitud buena se atrae» | Voz y pantalla | Diagnóstico | sr |
| Vie 20 | LinkedIn página | «Qué es una solicitud que encaja, y quién lo decide» | Texto | Diagnóstico | sr |

### Semana 48 · Un CRM que el equipo usa

| Día | Canal | Pieza | Formato | CTA | Riesgo |
|---|---|---|---|---|---|
| Lun 23 | LinkedIn perfil | Agentizando · «Una tarea con fecha en cada trato» | Texto | Conversación | sr |
| Mar 24 | Instagram | «No digas / mejor di: el CRM» | Infografía | Recurso: blog | sr |
| Mar 24 | LinkedIn página | «Lo que el comercial recibe antes de llamar» (pestaña Ficha) | Texto | Recurso: demo | sr |
| Mié 25 | LinkedIn perfil | Bandera roja · «El CRM que se rellena el viernes por la tarde» | Texto | Conversación | sr |
| Mié 25 | Newsletter | «Por qué no se usa el CRM» | Correo | Responder | ok (R17) |
| Jue 26 | LinkedIn perfil | Caso con permiso, si llega (R6). Si no, «la tercera implantación» en primera persona | Texto | Diagnóstico | ok |
| Vie 27 | Instagram | Vídeo «La ficha que llega antes de la llamada» | Voz y pantalla | Recurso: /reformas/ | sr |
| Vie 27 | LinkedIn página | Resumen del mes: lo que hemos cambiado en nuestro sistema | Texto | Conversación | sr |

Los temas de las semanas 45-48 son propuesta. Cada jueves se cierra el lote con lo que haya pasado esa semana. Si una pieza se queda sin dato, se cambia, no se inventa.

## 7. Medición

**Registro:** `content/redes/registro.md`, una fila por pieza publicada. Se rellena a las 48 horas y a los 7 días.

**Por cada pieza se apunta:**
- fecha;
- canal;
- pieza;
- alcance;
- interacciones de perfiles que encajan (dueño o comercial de una empresa del perfil, comprobado a mano);
- conversaciones iniciadas (comentario con su caso, mensaje privado o respuesta a la newsletter);
- visitas con UTM a /formacion/ o /reformas/;
- diagnósticos que salen de ahí.

**Cada viernes,** dentro del parte, va un resumen de la semana: qué pieza abrió conversaciones y qué se cambia.

**Lo que no decide:** alcance, «me gusta» y seguidores.

## 8. Lo que bloquea (para «Bloqueos» del Chief of Staff)

1. **Programación:** confirmar que el planificador social de GHL tiene conectados el perfil de LinkedIn de Maikel, la página de Qualivo y el Instagram de Maikel, y quién programa. Sin eso, el lote se queda en borrador aprobado.
2. **Grabación:** que Maikel fije su bloque semanal (propuesta: lunes por la mañana) y diga si graba voz sobre pantalla o a cámara.
3. **Newsletters:** el recuento de la base apta de Growth y la baja probada de Automations, antes del 28-oct.
4. **Decisiones que desbloquean piezas:**
   - el remitente único desde el segundo toque (Agentizando del lunes 26);
   - el Sin humo de los 28 cualificados, pendiente desde el 20-oct;
   - los permisos escritos de casos, para la semana 48.

## 9. Encaje con el trabajo diario

- **La rutina diaria de las 7:15 sigue:** blog, re-apunte y borrador por serie.
- **Los borradores diarios** alimentan el lote del jueves en lugar de salir sueltos.
- **El parte diario** añade, en la fila «Copy / Contenido», el estado de las redes:
  - qué se publicó ayer;
  - qué está programado para los próximos 7 días;
  - qué espera aprobación;
  - los resultados de la semana.
