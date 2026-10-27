# 5-9 · Temario, embudo, validación, plan y riesgos

**Estado:** v1 para la sesión del 29-oct (27-oct-2026). Completo, pero depende de las decisiones; se cierra el 30-oct.
**Depende de** las decisiones de `00-decisiones-maikel.md`. Si cambia el avatar o el formato, cambia casi todo lo de aquí.
**Etiquetas:** **[C]** comprobado · **[E]** estimación · **[H]** hipótesis.

---

## 5 · Temario

**Formato:** 6 semanas. Cada semana trae un módulo grabado (40-60 min en lecciones de 5-12 min), una tarea que deja algo instalado y una sesión en directo de 75 min.

| Semana | Módulo | Lecciones (borrador) | Entregable que se lleva el alumno | Material de Qualivo que se reutiliza |
|---|---|---|---|---|
| 0 | **Punto de partida** | Cómo medir hoy tu recorrido en 30 min · Las 5 fugas entre el anuncio y la matrícula | Hoja de punto de partida rellena (es la línea base de la garantía) | Calculadora de fugas · Biblioteca de dolores · `blog/embudo-de-ventas`, `blog/leads-pero-no-ventas` |
| 1 | **Anuncios que traen compradores** | El sector nombrado en el anuncio · Formulario de Meta o landing · Las 3 preguntas de encaje · Qué medir del anuncio (no el lead) | Formulario con 3 preguntas de encaje y casilla de consentimiento | Memoria creativa del agente Creative · `content/anuncios/competencia-formacion-2026-10.md` · `blog/formulario-de-facebook-o-landing-page` · ICP 21-oct (aprendizaje del anuncio «Ya inviertes») |
| 2 | **Respuesta en menos de 5 minutos** | El primer mensaje por WhatsApp · Fuera de horario y fines de semana · El vigía de los 15 minutos · Cuándo usar un agente de voz y cuándo no | Flujo de primera respuesta instalado (GHL o n8n) y plantilla de WhatsApp aprobada | Borradores «agentizando · vigía primer mensaje», «la línea se cae» · Prompts de los agentes de voz (`captacion/agente-llamadas/`) · Pieza «fuera de horario» |
| 3 | **Cualificar y priorizar** | Puntuar sin complicarse · A quién llama la persona primero · Lo que nunca debe decidir un agente | Puntuación de 3 criterios y vista «a quién llamar hoy» | `blog/lead-scoring`, `blog/cualificar-leads` · Método del caso de webinars (sin nombre ni cifras si no hay permiso) |
| 4 | **Agenda y asistencia** | El recordatorio que pide un «sí» · Qué hacer con el que no aparece · Reprogramar sin perseguir | Recordatorios de -24 h y -1 h con respuesta, y flujo de reprogramación | Borrador «recordatorio que pide un sí» · `blog/cliente-no-se-presenta-a-la-cita` |
| 5 | **Propuesta y seguimiento** | Precio, plazos y matrícula en el mismo mensaje · Días 2, 5 y 10 · Las 5 objeciones de formación · Cerrar como perdido con motivo | Secuencia de seguimiento con tareas y borradores, y lista de objeciones con respuesta | `blog/presupuestos-sin-respuesta`, `blog/objecion-de-precio`, `blog/propuesta-comercial` · Borradores «bandera roja · tratos sin fecha» |
| 6 | **Medir y decidir** | Coste por matrícula por campaña · Devolver las matrículas a Meta (conversiones offline) · El panel de 30 días · Qué apagar y qué subir | Panel de 30 días funcionando y primera decisión de presupuesto | Demo de Intelligence (con datos simulados) · `blog/conversiones-offline-meta`, `blog/metricas-de-marketing` · Informe automático de EAC (`apps-script-standalone/EAC_AutoDaily.gs`, sin datos del cliente) |

**Paquete técnico** (lo prepara un agente, lo revisa Maikel):
- Plantilla de GHL importable con el recorrido completo [H: comprobar que la cuenta de agencia de Qualivo permite compartir plantillas].
- Los mismos flujos en n8n para quien no usa GHL.
- Prompts de los agentes (respuesta, cualificación, recordatorio, seguimiento) con sus límites.
- Hoja de métricas (Google Sheets) para quien no tiene CRM.

**Dos condiciones que piden las academias** [C, cierres de Growth del 24 y el 26-oct]:
- **Herramienta, no método:** cada semana termina con algo instalado y funcionando, no con teoría.
- **Los datos son suyos:** todo se monta en la cuenta del alumno (su GHL, su n8n, su WhatsApp). Qualivo no guarda ni usa sus contactos.

**Lo que no se reutiliza:** nada con datos de clientes. Toda captura sale de la demo con datos simulados o de la cuenta de Qualivo.

---

## 6 · Embudo de lanzamiento

### 6.1 Recorrido

```
Contenido (LinkedIn de Maikel + Instagram)       ┐
Base propia con consentimiento                    ├─→ Imán: simulador + guía 5 fugas  ─→ Clase en directo (60 min)
Anuncios Meta (solo si hace falta; ver 7)         ┘         (lista de espera)                         │
                                                                                                     ▼
                                     Kit 47 € (tras el imán)        Oferta del programa (48-72 h, plazas limitadas)
                                                                                                     │
                                                       ¿5+ en ventas o >3.000 €/mes en anuncios? ─ sí → diagnóstico de Qualivo
                                                                                                     │ no
                                                                                                     ▼
                                                     Compra → bienvenida → sesión 0 → 6 semanas → oferta de implantación
```

**El embudo es la demo.** Quien se apunta recibe lo mismo que aprenderá a montar: respuesta en un minuto, recordatorio que pide un «sí» y seguimiento. Así lo vive antes de comprarlo.

### 6.2 Captación

| Canal | Qué | Quién | Coste |
|---|---|---|---|
| LinkedIn de Maikel | Ya hay 3 piezas por semana sobre dolores (plan del 27-oct). **No se añaden piezas:** 1 de cada 3 lleva la llamada al simulador del embudo para academias, con ejemplo de formación | Contenido | 0 € |
| Instagram | Las 2 mejores piezas de la semana adaptadas, como ya prevé el plan | Contenido y Creative | 0 € |
| Base propia | Solo contactos con **consentimiento de comunicaciones comerciales** o clientes de servicios similares (art. 21.2 LSSI). **No se usan las bases de outbound** | Growth audita qué contactos cumplen | 0 € |
| Anuncios Meta | Solo para la clase y solo si el orgánico se queda corto (ver 7.3). Anuncio con el sector nombrado, que es el formato que trae reuniones [C, Creative] | Paid y Creative | 300 € como máximo en la validación |

### 6.3 Página

Una sola página en el dominio de Qualivo (por ejemplo `qualivo.io/sistema-matricula`), con dos estados: lista de espera y venta.
Bloques: titular de 3.4 · para quién y para quién no · las 6 semanas · qué te llevas instalado · la garantía · quién lo imparte (Maikel, con pantallas reales) · preguntas frecuentes · casilla de consentimiento **separada** para WhatsApp y otra para email comercial.

### 6.4 Secuencia de emails y WhatsApp (solo con consentimiento)

| Cuándo | Canal | Mensaje |
|---|---|---|
| Al apuntarse | Email | Simulador y guía de las 5 fugas + enlace a la clase |
| Al apuntarse, si marcó WhatsApp | WhatsApp | Primer mensaje en menos de 1 minuto: «¿Cuántas solicitudes os entran al mes?» (cualifica y demuestra) |
| Día 1 | Email | Un error propio de Qualivo y qué aprendió |
| Día 3 | Email | La fuga más cara en formación, con ejemplo simulado |
| Clase -24 h | WhatsApp | Recordatorio que pide un «sí» |
| Clase -1 h | WhatsApp y email | Enlace |
| Clase +2 h | Email | Grabación + oferta, con fecha de cierre real |
| Clase +24 h | Email | Preguntas frecuentes y para quién no es |
| Cierre -12 h | Email (y WhatsApp a quien asistió y lo autorizó) | Último aviso. Sin falsas urgencias: la fecha es real |

Cada email lleva baja en un clic. Cada mensaje de WhatsApp usa plantilla aprobada y opción de baja.

### 6.5 Venta, bienvenida y comunidad

- **Venta:** pago en la página (Stripe). Llamada opcional de 15 min para dudas, agendada por el propio sistema; la hace Maikel solo si el agente no resuelve la duda por escrito.
- **Desistimiento:** el programa incluye sesiones en directo, así que es un **servicio** y tiene 14 días [H: confirmar con asesor]. El Kit de 47 € es contenido digital: casillas del art. 103.m TRLGDCU [C].
- **Bienvenida:** email + formulario de punto de partida + acceso + fecha de la sesión 0.
- **Antes de la clase:** recordatorio que pide un «sí» a las -24 h y aviso a la -1 h, igual que en las citas de Qualivo. Los leads de formación con poco presupuesto faltan mucho a las citas [C, `04`].
- **Comunidad:** grupo privado **solo durante la edición y 30 días más**. Después, se cierra. Las grabaciones siguen accesibles 12 meses.

### 6.6 Métricas objetivo por etapa [E]

Son estimaciones prudentes para España sin lista grande. Se sustituyen por datos reales en la validación.

| Etapa | Objetivo | Referencia |
|---|---|---|
| Visita → registro a la clase | 25-35 % | [H] referencia habitual de páginas de registro |
| Registro → asistencia en directo | 30-40 % | [H] |
| Registro que encaja con el avatar | ≥ 60 % | Se mide con las 3 preguntas de encaje |
| Asistente → compra del programa | 8-12 % | [H] |
| Registro que no asiste → compra tras la grabación | 1-3 % | [H] |
| Comprador del kit de 47 € → programa | 5-10 % | [H] |
| Alumno → implantación o servicio | 10-20 % | [H] |

**Cuenta de ejemplo para 12 plazas [E]:** 200 registros → 70 asistentes → 7 compras en directo + 3 tras la grabación = **10 alumnos**. Con el orgánico solo, 200 registros en 2 semanas es optimista: por eso hay 300 € de anuncios en reserva.

### 6.7 Presupuesto mínimo viable

| Partida | Validación (nov) | Primera edición (ene) |
|---|---|---|
| Plataforma | 0 € si se usa la cuenta de GHL de Qualivo y la web actual [H: confirmar que existe y qué plan es] | 0 € |
| Pagos | Stripe: 1,5 % + 0,25 € por cobro en la UE [C] | Igual |
| Anuncios | 0-300 € | 0-500 € |
| Asesoría (IVA, condiciones, garantía) | 1 consulta [E: 100-200 €] | — |
| **Total** | **≤ 500 €** | **≤ 500 €** |

**Retorno esperado de la primera edición [E]:** 8-12 alumnos a 490 € = 3.920-5.880 € de base. Coste en caja ≤ 1.000 €.

---

## 7 · Plan de validación (2 a 23-nov)

**Objetivo:** saber si el avatar paga **antes** de grabar nada. Se vende primero; se construye después.

### 7.1 Qué se hace

| Semana | Acción | Trabajo |
|---|---|---|
| **S1 · 2-8 nov** | **Página de lista de espera** con el simulador y la guía de las 5 fugas, que ya existen, como imán y una encuesta de 4 preguntas (sector, solicitudes al mes, quién las atiende, qué pagarías). **8 entrevistas de 20 min** con dueños o directores de academias. **Auditoría de la base** con consentimiento | Contenido y Creative: página y revisión del imán. Growth: base y lista de entrevistados. Maikel: entrevistas |
| **S2 · 9-15 nov** | Invitación a la **clase en directo del martes 17-nov** (16:00-17:00). Si el jueves 12 hay menos de 60 inscritos, se activan los 300 € de anuncios | Contenido: piezas. Paid: campaña preparada en borrador |
| **S3 · 16-22 nov** | **Clase** el 17-nov. **Preventa** de la edición fundadora del 17 al 22-nov: 490 € + IVA, 12 plazas, empieza el 12-ene. **Si no se llega a 8 plazas, se devuelve el 100 % el 23-nov** | Maikel: la clase. Agentes: secuencia de emails y WhatsApp |
| **Lun 23-nov** | **Decisión** | Maikel y Chief of Staff |

**Para las entrevistas:** se hacen como investigación, no como venta. Fuentes [H, validar con la regla de LSSI de Growth]: contactos de LinkedIn de Maikel con academia, leads entrantes de Qualivo descartados por tamaño (pidieron información de un servicio similar) y, si Maikel lo aprueba, preguntar a EAC y Eleva por colegas del sector.

### 7.2 Criterio de decisión

| Resultado a 22-nov | Decisión |
|---|---|
| **8 o más preventas pagadas** (≥ 3.920 € de base) **y** ≥ 60 % de inscritos encaja con el avatar | **Seguir.** Se construye en diciembre y la edición empieza el 12-ene |
| **4 a 7 preventas**, o mucho interés de un avatar distinto (por ejemplo agencias o infoproductores) | **Pivotar.** Se devuelve el dinero o se ofrece el kit + una sesión. Se ajusta avatar, precio o formato y se repite **una vez** en enero |
| **3 o menos preventas** y menos de 60 inscritos a la clase | **Parar.** Se devuelve el dinero. Lo producido (guía, clase grabada) se queda como contenido de captación del servicio |

**Referencia de flujo:** si Maikel pide a Growth el recuento del CRM (`04`, apartado 2.4), se sabrá cuántos leads de formación por debajo del servicio entran al mes. Con unos 8 leads de formación por semana gastando unos 17 €/día [C, semana 38], 8 preventas exigen convertir una parte grande de lo que llega: por eso la clase se alimenta también de LinkedIn y, si hace falta, de los 300 €.

**Coste máximo de equivocarse [E]:** ~15 h de Maikel y ≤ 500 € en caja. Y la clase sirve igualmente para captar academias que prefieran el servicio: se mide cuántas piden diagnóstico.

### 7.3 Señales que se miden

Inscritos y su encaje · asistencia · preventas · pedidos de diagnóstico de Qualivo · respuestas a la encuesta (qué pagarían) · las frases literales de las entrevistas, que van a la biblioteca de dolores.

---

## 8 · Plan por semanas desde el 2-nov

**Encaje con la instrucción maestra:** las fases 1 y 2 (hasta el 30-nov) son para estabilizar y ejecutar, y la fase 4 (19-31 dic) no admite lanzamientos. Por eso **se valida en noviembre, se construye en diciembre a ritmo bajo y se entrega en enero**.

| Semana | Contenido | Creative | Paid | Growth | Maikel | Horas de Maikel |
|---|---|---|---|---|---|---|
| S1 · 2-8 nov | Revisión del simulador y la guía, textos de la página, encuesta | Página de lista de espera y portada de la guía | — | Auditoría de consentimientos; lista de 15 posibles entrevistados | Aprueba página y guía (1 h). 8 entrevistas de 20 min (3 h) | **4 h** |
| S2 · 9-15 nov | Guion de la clase, 3 invitaciones dentro del plan de LinkedIn ya previsto | Diapositivas con pantallas reales | Campaña de 300 € en borrador | Seguimiento de inscritos | Revisa guion (1 h). Graba 1 vídeo corto de invitación (0,5 h). Decide anuncios el jueves 12 | **2 h** |
| S3 · 16-22 nov | Secuencia de emails y WhatsApp de la preventa | Página de venta | Campaña si se activó | Respuestas y dudas de la preventa | Clase (1,5 h con ensayo). Llamadas de dudas (1,5 h) | **3 h** |
| S4 · 23-29 nov | Informe de validación | — | Cierre de la campaña | Datos de conversión | Decisión con el Chief of Staff (0,5 h). Si sigue: correo a fundadores (0,5 h) | **1 h** |
| S5-S6 · 30 nov-13 dic | Esquemas y materiales de los 6 módulos | Plantillas visuales, panel | — | — | Graba 2 módulos por semana sobre pantalla (3 h/semana) | **3 h/semana** |
| S7 · 14-18 dic | Paquete técnico revisado, página de alumnos | — | — | — | Graba los 2 últimos módulos y revisa el paquete (3 h) | **3 h** |
| 19 dic-6 ene | **Nada.** Fase 4 de cierre y descanso | | | | | **0 h** |
| S8 · 7-11 ene | Bienvenida y sesión 0 | — | — | Accesos | Sesión 0 (1 h) | **1 h** |
| 12 ene-19 feb | Resúmenes de sesión, soporte de primera línea | — | — | Métricas de alumnos | Edición: ~3,6 h/semana (ver 4.3) | **~3,6 h/semana** |

**Total de Maikel hasta la decisión del 23-nov: ~10 h.** Hasta el inicio de la edición: ~25 h.

### 8.1 Qué se quita o se pospone para que quepa (propuesta, la confirma el Chief of Staff)

| Se quita o pospone | Libera | Por qué es razonable |
|---|---|---|
| **Adaptaciones a Instagram de noviembre** salvo las 2 que reutiliza la validación | ~1 h/semana de Maikel (revisión) y horas de Creative | El canal del ICP es LinkedIn; Instagram ya estaba en duda (ICP 21-oct, apartado 5) [C] |
| **Artículos nuevos del blog** hasta enero | ~1 h/semana de revisión de Maikel y horas de Contenido | Ya hay más de 80 artículos; el temario los reutiliza [C] |
| **Nuevas landings de vertical** (asesorías, clínicas…) hasta enero | Horas de Creative y ~1 h/semana de Maikel | La landing nueva es la del infoproducto |
| **Reels**: siguen pospuestos a diciembre o después, como ya proponía el ICP | — | Ya estaban fuera del plan |
| **No se toca:** entregas a clientes, Paid y Outbound de Qualivo, revisión del viernes | — | Prioridad 1 y 2 de la instrucción maestra |

**Regla de corte:** si alguna semana Maikel supera las horas previstas, se para el infoproducto esa semana, no se alarga la jornada.

---

## 9 · Riesgos

| Riesgo | Probabilidad / impacto [E] | Qué hacemos |
|---|---|---|
| **Quita foco a conseguir 1-2 clientes al mes** | Media / alto | Límite de 4 h/semana, regla de corte y validación barata. La clase también capta academias para el servicio y se mide |
| **Canibaliza el servicio** | Baja-media / medio | Filtro de tamaño en la compra, no se vende a clientes activos, el programa enseña a montar pero no opera (ver 4.4) |
| **El soporte a alumnos se come el tiempo** | Alta si no se limita / alto | Máximo 15 alumnos, grupo cerrado a los 30 días, agente de primera línea, 2 revisiones por alumno y no más |
| **Alumnos que no implantan y reclaman** | Media / medio | Garantía ligada a hacer las tareas; línea base en la semana 0; revisión en la semana 5 |
| **Casos sin permiso** | Alta hoy / alto | No se usan sin permiso escrito. Comprobar ya los permisos de los casos publicados en la web (ver 4.5) |
| **Publicidad engañosa o rechazo en Meta** | Baja con esta promesa / alto | Ni ingresos ni «hazte rico». Promesa sobre lo que el sistema hace. Revisión de textos antes de publicar ([LGP](https://www.boe.es/buscar/act.php?id=BOE-A-1988-26156), [Meta](https://transparency.meta.com/policies/ad-standards/deceptive-content/unrealistic-outcomes)) |
| **LSSI y RGPD en la captación** | Media / alto | Nada de email en frío. Casillas separadas para email y WhatsApp. Baja en cada mensaje. Growth audita la base ([LSSI art. 21](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758)) [C] |
| **IVA** | Baja / medio | Programa y kit: IVA español del 21 % ([LIVA art. 90](https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740)) [C]. Venta a consumidores de otros países de la UE: IVA español mientras no se superen 10.000 €/año; por encima, OSS (modelos 035 y 369) ([AEAT](https://sede.agenciatributaria.gob.es/Sede/iva/iva-comercio-electronico.html)) [C]. Empresas de la UE con NIF-IVA: inversión del sujeto pasivo y modelo 349 [H]. **Primera edición solo España** |
| **LATAM** | — / medio | Fuera de la primera versión: precios en USD, IVA local de servicios digitales, pasarelas [H]. Si se abre, con Hotmart, que cobra el 9,9 % + fijo ([Hotmart](https://hotmart.com/es/precios)) [C] |
| **Devoluciones** | Media / bajo | Kit: casillas de renuncia al desistimiento del art. 103.m ([TRLGDCU](https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555)) [C]. Programa: 14 días como servicio [H] + garantía propia |
| **Plataforma** | Baja / bajo | Empezar con lo que hay: web de Qualivo + Stripe + GHL [H: confirmar la cuenta]. Alternativas si hiciera falta: Skool 99 $/mes y 2,9 % (añade el IVA a compradores de la UE) [C], Teachable 89 $/mes con OSS gestionado [C], Hotmart sin cuota y 9,9 % [C], Kajabi desde 179 $/mes [C] |
| **Que suene a «otro curso de IA»** | Media / alto | Reglas del apartado 2.4: pantalla real, algo instalado por lección, errores propios, voz de Maikel |
| **La infraestructura del embudo falla** | Alta / alto | En octubre fallaron la pasarela de WhatsApp (tope de 20 envíos al día, salientes atascados), la voz de Twilio (caída desde el 15-oct) y n8n (tope de ejecuciones el 24-oct) [C, diarios de Growth]. Como «el embudo es la demo», un fallo delante de alumnos potenciales cuesta caro. **Antes del 9-nov:** prueba de extremo a extremo del recorrido de la clase con 5 registros de prueba, sin voz, y comprobar el tope de WhatsApp frente a los inscritos previstos |
| **Poco compromiso del avatar** | Alta / medio | Los leads de formación de bajo presupuesto faltan a citas gratis [C]. Se valida con preventa pagada, no con lista de espera, y se usa el recordatorio que pide un «sí» |
| **Tiempo de Maikel y el plan Reset** | Media / alto | Las horas del plan respetan la desconexión de las 19:00. La clase es a las 16:00. Diciembre a partir del 19 sin trabajo del infoproducto |

**Pendiente de asesor (una consulta, antes de abrir la preventa):** desistimiento en un programa mixto (grabado + directo), redacción de la garantía, si el precio se muestra con o sin IVA, y si la preventa con devolución condicionada necesita alguna mención especial.
