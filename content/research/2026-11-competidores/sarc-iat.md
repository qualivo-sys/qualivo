# Sarc-IAT · Fran Sarciat («Business OS»)

Fecha del análisis: 1 nov 2026. Leyenda: **[C]** comprobado (con fuente) · **[E]** supuesto o inferido.

## 1. Quién / empresa

- **Persona fundadora:** Fran Sarciat, «Founder & AI Operations Engineer» [C: home de sarc-iat.com].
  - Meta `og:author` «Fran Sarciat» en sarciat-ia.com/business-os [C].
  - Su bio de IG dice «Fundador @sarc.iat» [C: Apify].
- **Empresa:** SARC-IAT, «Agencia de IA en España y software a medida B2B», con base en **Mallorca**. Tienen páginas de «agencia IA Mallorca», «desarrollo software Mallorca» y «Baleares» [C: sarc-iat.com].
- **Aviso legal:**
  - No lo he encontrado. La landing sarciat-ia.com/business-os no tiene enlaces legales y sarciat-ia.com/ y /aviso-legal dan 404 [C].
  - En sarc-iat.com no vi enlace de aviso legal en el HTML [C]. Titular legal: desconocido.
  - Pie de la landing: «© 2026 BUSINESS OS · SARC-IAT · Business OS» [C].
- **Detalle clave:** la landing de los anuncios está **incrustada desde `implementacion.impulsobusinesslab.com`** (embed id 100114, página «vsl-landing», source=paid) y el embed está dentro de una página de GoHighLevel [C: script `embed-loader.js` en sarciat-ia.com/business-os]. Impulso Business Lab es «Impulso 360», otra cuenta del mismo conjunto de anuncios, que vende «montamos tu empresa / Embudo de Autoridad». Por tanto, **Sarc-IAT es probablemente cliente de Impulso** y les compró el embudo montado [E].
- **Página de Facebook:** 26 «me gusta» [C: hist.json].
- **Dos dominios:**
  - sarciat-ia.com, solo para la landing de anuncios;
  - sarc-iat.com, la web corporativa con blog y SEO local [C].

## 2. Qué vende y a quién

- **Oferta de los anuncios: «Business OS / Arquitectura Operativa Autónoma (AOA)»** [C: landing y anuncios]. Tiene dos piezas:
  1. **Centralización operativa:** un CRM o panel de operaciones a medida, «alojado en tu servidor», que sustituye Excels y SaaS sueltos.
  2. **Ingeniería de automatización:** agentes de IA que «reciben leads, los califican y agendan citas por **WhatsApp** y web, 24 h».
- **Promesa de la landing:** «Ingeniería Operativa Autónoma + Centralización Estratégica = **Dejas de ser el empleado indispensable de tu propio negocio**. Construimos tu propio software y agentes de IA que captan, califican y agendan clientes solos para que factures más sin trabajar más horas» [C].
- **A quién:**
  - «Para fundadores de agencias y negocios de servicios atrapados en la operativa diaria» [C: landing];
  - en anuncios, «dueños de negocios que facturen y tengan la agenda desbordada»;
  - casos de negocio local, como un centro de entrenamiento («Tony») o una agencia de servicios [C].
- **Precio:**
  - Guía pública: «MVP o portal B2B 3.000-4.500 €», «software corporativo/ERP 5.000-8.500 €», «plataformas con agentes IA 9.000-15.000 €», y «presupuestos cerrados desde 3.000 €» [C: sarc-iat.com/cuanto-cuesta-desarrollo-software-a-medida/].
  - Anuncio de mayo de 2026: «asistente de IA que atiende, cualifica y agenda 24/7 · llave en mano · demo en menos de 48 horas · **Pago único de 500 €** · solo 3 instalaciones a la semana» [C: hist.json, anuncio del 5 may 2026, ya inactivo].
  - Ticket del Business OS actual: 3-15 k€ [E, por la guía].
- **Garantía:**
  - Anuncio activo: «te garantizamos los resultados **por contrato**» [C].
  - La landing dice lo contrario: «no se garantizan resultados idénticos entre clientes» [C].
  - En metodología: «30 días de garantía post-lanzamiento» y «15 días de monitorización» [C: sarc-iat.com/metodologia/].
  - Gancho de riesgo cero: «Si no vemos viabilidad en 15 minutos, no te venderemos nada» [C].

## 3. Embudo

1. **Anuncio** (vídeo o imagen, CTA «Watch more») → sarciat-ia.com/business-os [C: 14 de 17 anuncios].
2. **Landing (GHL + embed de Impulso)** [C]:
   - Botón «RESERVA TU SESIÓN DE DIAGNÓSTICO» y debajo el VSL.
   - **VSL de ≈478 s (≈8 min)** [C: ffprobe del .mov alojado en filesafe/GHL]. El reproductor es un `<video>` nativo.
   - Testimonios en vídeo de 5 personas con nombre y apellido (Cristina Oncala, Albert Borrás, Laura Bueno, Javier González, Roberto). Sus frases hablan de webs y aplicaciones más que de cifras [C].
   - Bloque «Esto no es una llamada de ventas agresiva… Agenda limitada: solo aceptamos un número reducido de proyectos nuevos cada mes» [C].
3. **Agenda:** **calendario GoHighLevel** incrustado (`api.leadconnectorhq.com/widget/booking/J3ObTW6ISH7rMPNKJGBM`) [C]. No hay formulario previo propio. Las preguntas del calendario de GHL no se ven sin ejecutar JavaScript [C: no visibles].
4. **Página de gracias:** no la he localizado [C].
5. **Seguimiento:**
   - Píxel de Meta **3180850308786403** con `PageView` en sarciat-ia.com [C].
   - El embed reenvía UTM, fbclid y gclid al formulario de GHL («si no, GHL marca referral») [C: comentario en embed-loader.js].
   - sarc-iat.com usa GA4 G-ZY2H59PC1E y no tiene píxel [C].
6. **Web corporativa sarc-iat.com:**
   - Simulador de ahorro (empleados × horas × €/h → «ahorro anual estimado 50.400 €»);
   - metodología «Día 0 auditoría → **Día 2 demo funcional + presupuesto cerrado** → implementación → entrega en Git con telemetría a 0 €» [C].

## 4. Instagram

Datos de Apify del 1 nov 2026 [C].

**@fransarciat (personal)**

- 723 seguidores, sigue a 1.130, 81 publicaciones.
- Bio: «🚀 Transformo negocios en operaciones autónomas con Business OS | Fundador @sarc.iat / 🏆 +10 casos | +3h/día ahorradas / 👇 Tu demo en 48h». Enlaces: sarc-iat.com/metodologia y WhatsApp.
- Últimos posts: reels de 22-31 s, vistas de 34 a 1.355 y 0-1 comentarios.
- **CTA «comenta X»:** «Comenta la palabra **PANEL**», «**AGENTE**», «**WEB**», «**DEMO**». En los reels de octubre de 2026: «escríbelo en comentarios y analizamos qué tareas…».
- Ganchos [C]:
  - «Sábado 10:15h: tu equipo descansa y tú sigues cuadrando hojas»;
  - «Terminar un trabajo hoy y tardar 18 días en facturarlo ahoga tu caja»;
  - «No te faltan clientes: te sobran 6 programas aislados»;
  - en abril: «¿Cuántos clientes estás perdiendo por no responder a tiempo?» y «Tu mayor problema no es el marketing, es tu tiempo de respuesta» (≈1.000-1.350 vistas).

**@sarc.iat (marca)**

- 125 seguidores, 56 publicaciones.
- Bio: «🏢 Dueños de negocios → elimina el cuello de botella / +10 casos de éxito | +3h/día ahorradas / 🔐 Business OS / Tu demo en 48h».
- Últimos 30 posts (7 abr – 31 oct 2026): 13 reels, 10 carruseles y 7 imágenes.
  - Vistas en reels: mediana 658, máximo 1.482. Likes: mediana 3. Comentarios: casi 0.
  - Duración de los reels: unos 28 s.
- Serie fija los domingos: «Mañana es lunes…» (imagen motivacional y de planificación).
- Ganchos más vistos:
  - «¿Tu negocio depende al 100 % de que tú estés ahí solucionando incendios? … no tienes una empresa, tienes un autoempleo muy caro» (1.482);
  - «¿Cansado de perder oportunidades por no responder a tiempo? Te presentamos al integrante que le falta a tu negocio: un Agente de IA» (1.078);
  - «¿Pagas por un software lleno de botones y solo usas dos funciones?» (939);
  - «¿Sigues perdiendo horas copiando datos de WhatsApp o emails a tu CRM a mano?» (885).
- No usan «comenta X» en la marca.

Lectura [E]: es una audiencia pequeña. Las vistas de reels casi seguro están empujadas con anuncios o por alcance a no seguidores, y la interacción es baja.

## 5. Anuncios que le funcionan (Biblioteca de Anuncios)

Resumen de la página [C: ad_stats.txt]:

- 17 anuncios en total, 7 activos.
- Formatos: VIDEO 13, IMAGE 4. CTA: Watch more 14, Learn more 3.
- Destino: business-os 14, fb.me 3.
- Actividad: abril 1, mayo 2, septiembre 14.
- Es una cuenta pequeña: una prueba en abril-mayo y una campaña desde el 18 sep 2026 que sigue activa [C]. Ningún anuncio tiene mucho rodaje todavía; la señal es débil [E].

| Señal [E] | Anuncio | Copias · días |
|---|---|---|
| Más copias y activo | Título «Un Sistema, No Veinte Apps»: «**«Fran, he invertido miles de euros en un CRM y un chatbot… y para esto prefiero no tener nada»**. Eso me dijo hace poco el dueño de una agencia… Hoy, ese mismo cliente tiene un único software en su propio servidor: ✅ datos centralizados ✅ un Agente de IA que atiende por WhatsApp, cualifica y agenda ✅ 30 % de ahorro y +20 h/semana… **te garantizamos los resultados por contrato**.» | 5 copias, 3 activas, 44 días [C] |
| Activo | «El Reto de las 48 Horas»: «¿Harto de consultoras que tardan tres semanas en pasarte un presupuesto de 40 páginas…? Tony, dueño de un centro de entrenamiento… Le propuse un reto: 48 horas… un Agente de IA funcionando en WhatsApp… agenda en su Google Calendar (en el vídeo puedes ver la prueba real en pantalla)… Pídenos una demo funcional… en 48 horas.» | 3 copias, 1 activa, 44 días [C] |
| Activo (imagen) | «¿PIERDES VENTAS EN WHATSAPP FUERA DE HORARIO?»: «Un cliente potencial te encuentra… **un viernes a las 20:45h**… Nadie le responde **hasta el lunes a las 09:30h**. ¿Qué crees que ha pasado en esas 60 horas?… el 70 % de las ventas se las lleva la empresa que responde primero… Agente Comercial de IA… responde al instante, cualifica, agenda en tu calendario, **envía recordatorios para reducir no shows**… Demo funcional en menos de 48 horas.» | 2 copias, 1 activa, 44 días [C] |
| Activo | «¿TU EMPRESA SE PARA CUANDO TÚ NO ESTÁS?»: «Si te fueras 15 días de vacaciones sin cobertura… no tienes un negocio, tienes un autoempleo muy bien pagado…» | 2 copias, 43 días [C] |
| Activo (imagen) | «ARQUITECTURA OPERATIVA AUTÓNOMA»: «Sistemas en Propiedad… Frankenstein digital…» | 2 copias, 44 días [C] |
| Prueba de mayo | «El mes pasado perdiste al menos 3 clientes por no contestar rápido por WhatsApp… **Pago único de 500 €**… solo 3 instalaciones a la semana» | 1 copia, 15 días [C] |

## 6. Qué nos sirve a Qualivo

1. **El ángulo de la hora exacta**: «viernes 20:45 → lunes 09:30 = 60 horas → ya ha reservado con tu competencia». Es literalmente nuestro dolor, contado como una escena concreta con hora. Para academias: «Una madre pide información del curso el sábado a las 11:20; tu secretaría contesta el lunes a las 10:00». Conviene combinarlo con un dato del tipo «el que responde primero se lleva la venta», que debemos respaldar con una fuente propia o de Qualivo antes de usarlo [E].
2. **Demo funcional en 48 h antes de pagar** («Reto de las 48 horas», «Te mostramos una maqueta funcional antes de que inviertas un solo euro»). Para Qualivo: «En 48 h te enseñamos tu agente de WhatsApp respondiendo con los cursos, precios y horarios de tu academia». Baja el riesgo percibido y da contenido de vídeo con prueba en pantalla.
3. **La objeción convertida en gancho con cita literal de un cliente** («Fran, he invertido miles en un CRM y un chatbot… prefiero no tener nada»). Ataca a la competencia (chatbots y CRM genéricos) sin nombrarla. Nos sirve contra «ya probé un chatbot» o «ya tengo HubSpot».
4. **Propiedad frente a cuotas** («Sistemas en Propiedad», «sin cuotas que suben cuanto más facturas», «código 100 % tuyo») y la **garantía por contrato**. Si encaja con nuestro modelo, podemos usar «el sistema y los datos son tuyos» y una garantía escrita de tiempo de respuesta y seguimiento. Ojo: su landing se contradice con la garantía; nosotros tenemos que ser coherentes.
5. **Aviso:** es una cuenta pequeña (17 anuncios, 125 y 723 seguidores, interacción mínima) con un embudo comprado a Impulso, y se nota que va probando ofertas (500 € de pago único → Business OS de 3-15 k€). Es útil como **banco de ángulos**, no como prueba de que algo funciona. Su paso de «agente de WhatsApp por 500 €» a «sistema completo» confirma que el agente solo no se vende caro y que el paquete sistema + panel sí permite subir el ticket [E].

## Fuentes

- Biblioteca de Anuncios: /tmp/claude-0/-home-user-qualivo/e81e3e1a-5db3-5fdc-ba5b-52d4a8d77b22/scratchpad/sim/ad_stats.txt y hist.json (página 782018858324783).
- https://sarciat-ia.com/business-os → https://implementacion.impulsobusinesslab.com/embed/100114/vsl-landing?source=paid (curl, 1 nov 2026).
- https://sarc-iat.com/, /metodologia/, /cuanto-cuesta-desarrollo-software-a-medida/.
- Instagram: Apify `instagram-profile-scraper` y `instagram-scraper` (@fransarciat, @sarc.iat; 1 nov 2026).
