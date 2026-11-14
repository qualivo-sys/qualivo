# ZeroChats · «Setter IA» para Instagram

Fecha del análisis: 1 nov 2026. Leyenda: **[C]** comprobado (con fuente) · **[E]** supuesto o inferido.

## 1. Quién / empresa

- **Producto:** ZeroChats, un SaaS de «Setting IA», es decir, un agente que responde los DM de Instagram y WhatsApp, cualifica, hace seguimiento y agenda llamadas [C: zerochats.com/es].
- **Titular legal:** no lo he encontrado. zerochats.com/es no enlaza aviso legal y las rutas /es/aviso-legal, /legal, /terms y /privacy dan 404 [C].
- **Equipo:**
  - El contacto de WhatsApp de la página del VSL se llama «Alicia», con un número español (+34). El código menciona «el seguimiento de Alicia» para los tramos de facturación [C: go.zerochats.com/vsl2-es-video y comentarios del formulario] → hay al menos una setter o SDR humana [E].
  - Cinco reels de @zerochats están publicados en colaboración con **@davidzetace** [C: Apify, campo `coauthorProducers`], que podría ser socio o responsable de contenido [E].
  - Un testimonio dice «**Ramón** puso una bomba en mi cuenta de Instagram llamada ZeroChats». Puede ser alguien del equipo [E].
  - Fundador: sin confirmar.
- **Origen:** probablemente España, por el teléfono +34, los precios en € y el patrocinio del «Sales Summit España» [C del dato; E de la conclusión]. Tienen una versión aparte para EE. UU. («la de Estados Unidos vive aparte», /es/cita-confirmada-us) [C].
- **Página de Facebook:** 38 «me gusta» [C: hist.json].
- **Relación con BlueHackers:** **Marcos Razzetti es cliente de ZeroChats** y aparece como testimonio en anuncios y reels: «aumentó un 47 % sus agendas diarias» [C: anuncio del 16 sep 2026 y reel del 18 sep 2026].

## 2. Qué vende y a quién

- **Producto** [C: bundle de la web]:
  - agente IA que «cualifica, nutre y agenda 24/7, sin setters humanos», con API oficial de Meta y logo «Meta Business Partner»;
  - simulador de conversaciones y «barra de calidad» de 0 a 10 para las instrucciones;
  - varios agentes especializados (ventas, objeciones, cierre) que se pasan la conversación entre ellos;
  - seguimientos programados con audios y vídeos;
  - atribución por contenido (qué post o reel trae las agendas);
  - asistente que contesta preguntas sobre el negocio, con informe semanal por email;
  - comentario → DM automático por palabra clave;
  - integración con GoHighLevel.
- **Precio** [C: objeto `pricing` del bundle]:
  - **Plan Business: 497 €/mes**, «Pruébalo gratis» con prueba de 5 días [C: «Prueba Gratis 5 días»]. Incluye 2.000 chats al mes y WhatsApp como extra.
  - **Plan Anual: «Precio personalizado»**, que se vende en llamada. Incluye gestor de cuenta, implementación hecha por el equipo, soporte VIP por WhatsApp, 36.000 conversaciones al año y precio bloqueado 12 meses.
  - Comparativa en la web: «1 setter humano: 1000 €/mes» frente a «Setters de IA ilimitados: 247 €/mes».
  - Ticket del anual: varios miles de euros al año [E].
- **A quién:** «Sólo para coaches e infoproductores» y «referentes de coaching e infoproductos de habla hispana» [C: vsl2-es]. La home dice «Ideal para negocios que facturan +2.000 €/mes» [C]. Sus casos son sobre todo del nicho fitness y nutrición online (nutri4train, jynfits, entrenaconpat, fitmanpower…) [C: muro de clientes].
- **Garantía** [C]:
  - **«En 14 días nuestro Setter IA te añadirá un 50 % extra de llamadas cualificadas, o te devolvemos el dinero»** (meta de zerochats.com/es/funnel y anuncios desde septiembre).
  - Pricing: «Si en menos de 14 días tu conversión no es igual, y no te estás ahorrando el coste de tus setters, te devolvemos el dinero».
  - El anuncio más reciente (27 oct 2026) dice otra cosa: «Nosotros te lo implementamos, tú no haces nada, y si en **30 días** no igualamos el mismo número de agendas que ya tenías… **no pagas**». Están probando versiones de la garantía [E].

## 3. Embudo

Hay **dos embudos en paralelo** [C: destinos en hist.json]:

**A) Autoservicio (prueba gratis).**

- Anuncio → app.zerochats.com/es/funnel o zerochats.com/es/funnel/middle → registro con Google, prueba de 5 días y «asesoría gratuita con un experto para configurarlo en 15 min» [C].
- La landing muestra un panel de ejemplo («Leads agendados último mes: jynfits 72, nutri4train 57…», «Tasa conversión 29,8 %»), un muro de @ de clientes y «77 negocios adquirieron ZeroChats esta semana» [C].

**B) VSL + llamada (alto valor), el embudo actual go.zerochats.com/vsl2-es.**

1. **Landing «Agenda tu llamada»** [C]:
   - «+345 negocios activos · Sólo para coaches e infoproductores»;
   - «Descubre el Setter IA que usan los mayores referentes de coaching, infoproductos en habla hispana»;
   - «**Completa el formulario para ver el vídeo de 5 minutos**».
   - Es un VSL bloqueado: se ve después del formulario.
2. **Formulario de cualificación**, propio, dentro de un iframe en GoHighLevel [C]:
   - nombre, email y teléfono (paso 1);
   - «¿A qué te dedicas?» (coach/consultor/infoproductor · agencia o growth partner · negocio tradicional o físico · todavía no tengo negocio);
   - «¿Cómo gestionas tu setting?» (no hago · lo hago yo · un setter · equipo de 2 o más);
   - cuenta de Instagram;
   - facturación (<3.000 € · 3-5k · 5-10k · 10-20k · 20-50k · 50-100k · +100k);
   - «¿Tienes ingresos fuera de este negocio?»;
   - «¿Necesitas agendar con leads que ya te escriben o iniciar conversaciones en frío?» (frío o «aún no genero leads» → «no podemos ayudarte»);
   - leads al día (sin flujo · <20 · 20-50 · 50-100 · >100).
3. **Lógica de enrutado** [C: comentarios del propio código]:
   - **Descualificado** (negocio físico, sin negocio, outbound o sin leads, o «factura menos de 3.000 € y no tiene ingresos fuera») → go.zerochats.com/gracias, que es una página de **«Todavía no es tu momento»**. Esa página vuelve a vender el plan autoservicio de 497 €/mes.
   - **Cualificado** → go.zerochats.com/vsl2-es-video, con un VSL en **Vidalytics** («Mira este vídeo de 5 minutos») y el **calendario de GoHighLevel** `api.leadconnectorhq.com/widget/bookings/zerochats-ads`. Las respuestas del formulario pasan a la reserva como campos ocultos.
   - **Tramo medio** (cualifica, pero no llega al corte de Meta): ve el mismo VSL, pero **sin calendario**. En su lugar le aparece un botón de WhatsApp con Alicia: «Antes de dar hueco revisamos cada caso uno por uno. Escríbenos por WhatsApp…». Así evitan que su reserva dispare `Schedule` y «ensucie» el píxel.
4. **Seguimiento** [C: código y comentarios]:
   - Dos píxeles de Meta (1490081385466127 y 1663122101949673), GA4 G-ZFCD7QRE8C, Microsoft Clarity, AdPulze (confirma teléfono y email en la sesión de rastreo) y Pushlap (afiliados).
   - Cita literal: «**Desde el 01/10 Lead es el único evento de píxel del formulario… salta en el paso 2 y solo desde el corte [de facturación]… Se busca cualificación y no volumen: Meta aprende de quien puede pagar.**»
   - Cita literal: «Desde el 07/10 lo manda un único sitio, el flujo "ADS | Cualificación formulario → Meta" por la **API de conversiones, con 150 USD**».
   - Hay un test A/B de vídeo en la página de gracias («gracias-video-b» etiquetado en GHL).
   - Ojo: el comentario habla de un corte de 5.000 €, pero el array `ZC_CUALIFICA` incluye «3.000-5.000 €» [C]. Ahora mismo el corte efectivo parece ser 3.000 € [E].
5. **Página de gracias tras reservar:** /es/cita-confirmada [C: ruta en el bundle; no la he abierto con datos].

**Prueba social** [C]:

- «+345 negocios», «+300 referentes», «opiniones de +1000 usuarios».
- Testimonios con @ y seguidores, por ejemplo: «@sergiofuentes (60k) — me ha triplicado mi porcentaje de conversión» y «@olgaitarte: de 2.500 € a +12.500 €».
- Comparativa «setter humano 10-20 % de conversión vs IA 35-45 %».
- Calculadora de ahorro y el sello «Meta Business Partner».

## 4. Instagram (@zerochats)

Datos de Apify del 1 nov 2026 [C]:

- **Perfil:** 4.156 seguidores, 56 publicaciones, 10 destacadas.
- **Bio:** «El Setter IA que utilizan los mayores referentes de coaching e infoproductos en habla hispana. **DM "Chat" para poner a prueba la IA**». Es decir, la CTA de la bio es una demo en vivo del propio producto por DM.
- **Últimos 30 posts** (24 propios, 5 en colaboración con @davidzetace y 1 de @salesummitesp), del 24 mar al 27 oct 2026:
  - 29 reels y 1 imagen;
  - duración mediana de 65 s (de 22 a 300 s);
  - vistas: mediana ≈1.800, máximo 17.663; likes: mediana 10,5; comentarios: mediana 1.
- **Formato casi único:** reel de caso de éxito con el @ del cliente y una métrica en la primera línea.
- **Ganchos más vistos:**
  - «@aguado_training, +7 años ayudando a hombres de +40, se cansó de que ningún setter le durara más de 2 meses» (17.663 vistas);
  - «@nutri4train llegó a 75 agendas a la semana… despidiendo a sus 3 setters» (13.466);
  - «Pau y Alfonso mejoraron un 37 % la conversión a agendas de @fitwilly» (12.987);
  - «Xavi Esquerigüela multiplicó por 5 su facturación eliminando 3 setters» (9.897);
  - «@valenyjavigoals hizo +20 ventas en 7 días» (3.503).
- **CTA «comenta X»:** solo en el post del Sales Summit («Comenta ENTRADA»). La CTA estable es «DM "Chat"» en la bio.

## 5. Anuncios que le funcionan (Biblioteca de Anuncios)

Resumen de la página [C: ad_stats.txt]:

- 188 anuncios en total, solo 3 activos.
- Formatos: VIDEO 171, IMAGE 12.
- CTA: Learn more 135, Sign up 27, Watch more 11, Visit IG 11.
- **157 de 188 anuncios se publican solo en Instagram** [C: `publisherPlatform`].
- Actividad mensual en 2026: julio 38, agosto 35, septiembre 40, octubre 21.
- Destinos: zerochats.com/es/funnel 77, app.zerochats.com/es/funnel 71, funnel/middle 18, vsl2-es 3.
- Las UTM dejan ver que prueban muchos creativos únicos con nombre de gancho: `Hook2_setterhumano_vs_zerochats`, `Hook1_comparativa_que_nadie_muestra`, `Setter_roto`, `setters_muere`, `Cuello_botella`, `roi_calculado`, `Apuesto_100`, `del1_al25`, `Video_nutrifortrain`, `Video_Fitman_intereses`… [C]. Copian poco cada texto; su método es **mucho test de creatividad** [E].

| Señal [E] | Anuncio | Copias · días |
|---|---|---|
| Más copias y días recientes | «**Danos 14 días y te añadimos un 50 % más de llamadas cualificadas que con tu equipo actual. Si no, te devolvemos el dinero.** Marcos Razzetti pensaba lo mismo que seguramente pienses tú: que una IA no iba a responder como él…» → funnel / vsl2-es | 11 copias, 54 días (desde el 1 sep 2026) [C] |
| El más longevo | «Si vendes por Instagram, hay una cosa que cambia todo. ZeroChats es un agente de IA que… te agenda llamadas de venta solo… Habla exactamente igual que un humano. Interpreta audios. Cualifica…» | 3 copias, 126 días [C] |
| Imagen de captación de prueba gratis | «Cierra ventas 24/7 con tu agente digital 🤖 … sin setters ni comisiones. Actívalo gratis y recibe una asesoría gratuita… en 15 min» | 8 copias, 46 días (oct 2025); la Biblioteca agrupa 101 anuncios bajo ese creativo (suma de `collationCount`) [C] |
| Objeción | «"Ya probé automatizar mis DMs y no funcionó." … los bots de flujos rígidos como ManyChat…» | 3 copias, 112 días [C] |
| Caso | «Noelia García hace 90 días convertía el 1 % de los leads… Hoy convierte el 25 %… Un setter humano… no puede gestionar con calidad más de 50 conversaciones al día» | 2 copias, 101 días [C] |
| Activo (VSL nuevo) | «+345 referentes de coaching e infoproductos han sustituido sus setters por ZeroChats: Marcos Razzetti, Paulattier, Olayabaker… si en 30 días no igualamos… no pagas» → go.zerochats.com/vsl2-es | Activo desde el 27 oct 2026 [C] |

## 6. Qué nos sirve a Qualivo

1. **Optimizar Meta por calidad, no por volumen.** Solo disparan `Lead` cuando la facturación supera el corte, desde el servidor y con valor (150 USD). Los del tramo medio no reciben calendario para no ensuciar `Schedule`. Es exactamente lo que deberíamos montar para nosotros y venderlo como parte del «sistema comercial» a academias: el evento de conversión pasa a ser «lead A/B» o «reunión cualificada», con valor.
2. **Enrutado en tres caminos tras el formulario:** descualificado → «Todavía no es tu momento» con oferta barata (downsell); medio → WhatsApp con persona; alto → calendario. Lo podemos copiar tal cual: el tramo medio lo atiende nuestro agente de WhatsApp o de voz, y el alto agenda directo.
3. **Garantía medible y a plazo corto:** «14 días, +50 % de llamadas cualificadas o te devolvemos el dinero» y su versión «30 días, igualamos tus agendas o no pagas». Qualivo puede garantizar algo del mismo estilo: «respuesta en <5 min al 100 % de los leads y +X % de citas en 30 días, o no pagas el mes».
4. **Prueba con nombre, @ y métrica en la primera línea** («@nutri4train llegó a 75 agendas a la semana despidiendo a sus 3 setters»), un muro de @ de clientes y el sello de Meta. Sus reels de casos llegan a 10-17 mil vistas. Para Qualivo: «Academia X: de 2 h a 3 min de respuesta, +38 % de matrículas».
5. **Posicionamiento frente a ellos.** Son un competidor directo en «respuesta inmediata», pero centrado en DM de Instagram para coaches, con precio ancla de 497 €/mes. Qualivo puede diferenciarse con WhatsApp + voz + panel de matrículas para academias con ticket de +500 €, y vender «implementado por nosotros» como su plan anual. También podemos tomar prestado su gancho de comparar con un setter humano («1 setter: 1.000 €/mes; responde 9-18 h») aplicado a la recepcionista o al comercial de la academia.

## Fuentes

- Biblioteca de Anuncios: /tmp/claude-0/-home-user-qualivo/e81e3e1a-5db3-5fdc-ba5b-52d4a8d77b22/scratchpad/sim/ad_stats.txt y hist.json (página 722435347610979).
- https://go.zerochats.com/vsl2-es (formulario `ZC_FORMULARIO` y `ZC_AJUSTES`), https://go.zerochats.com/vsl2-es-video, https://go.zerochats.com/gracias, https://zerochats.com/es, https://zerochats.com/es/funnel (redirige a go.zerochats.com/funnel-es-yf-page), https://app.zerochats.com/es/funnel, https://zerochats.com/es/funnel/middle (curl, 1 nov 2026).
- Instagram: Apify `instagram-profile-scraper` y `instagram-scraper` (1 nov 2026).
