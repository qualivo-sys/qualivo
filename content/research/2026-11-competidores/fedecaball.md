# Fede Caball · Crea & Sube (creaysubementoria.com/rm)

> Análisis de Growth, 1-nov-2026. Fuentes: creaysubementoria.com (/rm, home, /cita-gracias, /terminos-condiciones), formulario GHL `un6Izz7u4qq09O1Sq1nL` (lectura pública, sin rellenar), Biblioteca de anuncios (sim/hist.json, 220 anuncios), Apify (perfil + 30 posts de @fedecaball).
> [C] = comprobado · [E] = estimación. La Biblioteca no da gasto.

## Quién / empresa
- **Federico Caballero** («Fede Caball»). «Empecé como editor audiovisual en 2019 y en 2020 fundé mi agencia… Escalé y vendí un canal automatizado de YouTube. Meta me invitó a sus eventos privados de creadores» [C, home].
- Titular según los T&C: «Fede Cabal / Crea y Sube», **sin razón social, NIF ni domicilio** [C].
- Escribe con voseo («Llená», «calificás», «agendá») y factura en USD [C] → [E] rioplatense (Argentina o Uruguay) con público de toda Latinoamérica. **No es una cuenta española**: sus casos son de Chile, Colombia, etc.
- Equipo de cierre: el calendario rota entre 5 personas (Marcos Moreno, Victoria Robledo, Benjamin Aguilar, Mel Cuzzolino, Marianela Torales) [C, payload del calendario].

## Qué vende y a quién
- A quién: «marcas personales, profesionales y dueños de negocios» que ya venden (realtors, nutricionistas, marketers, coaches) [C].
- Qué: mentoría/acompañamiento de **contenido orgánico** de 90 días: consultorías grupales semanales con Fede, auditoría de perfil, «sistema de contenido semanal en 2 horas», soporte 1:1 por WhatsApp, sesiones de ads/ventas/prospección, «instalación del sistema Cash Funnel» (freebies, historias, secuencias de DM) [C, home].
- Promesa: «crecer a 100K-500K seguidores y atraer entre 100 y 1.000 mensajes de clientes calificados por día. Sin depender de anuncios, sin trends ni bailes» [C, /rm].
- Precio: «nuestros servicios o programas requieren una inversión mínima de **USD 1.000**. Este no necesariamente es el valor total del programa» [C, pregunta del formulario].
- Garantía: «si implementás todo lo que te enseñamos y no obtenés resultados, no pagás. La garantía tiene requisitos claros» [C, FAQ]. Los T&C remiten las condiciones al contrato [C].
- Prueba social: «+1.000 clientes», «+300M vistas orgánicas», «+1M seguidores propios»; 6 casos con @ y cifra («Un solo reel le generó 200.000 USD — Rodrigo, @rodrigomoya.co»; «Ismael Salas, realtor: US$100K en 30 días, 11 casas vendidas»; «La Nutri del Sur, 399K seguidores») [C].

## Embudo [C salvo indicación]
1. **Anuncios** de cuatro tipos: «Book now» → /rm (65), «Send message» → DM de Instagram (71), «Visit Instagram profile» (34) y, a principios de año, un grupo de WhatsApp de «mentoría 100% gratuita» (13).
2. **/rm («LP: RM»), GoHighLevel**:
   - Titular: «Vamos a instalar un sistema de contenido con Reels, Carruseles de IA e Historias de Instagram».
   - «Llená el formulario de abajo para ver si calificás. Después agendá una llamada de auditoría.»
   - Casos, FAQ y calendario nativo de GHL. En /rm no hay VSL; la home sí tiene uno (vturb/ConverteAI, «VSL New.mp4», duración no visible).
   - El código muestra dos versiones A/B de la landing: «versión A (VSL primero)» y «versión B (con imagen)».
3. **Formulario del calendario** («FORMULARIO PRINCIPAL EN CALENDARIO»):
   - WhatsApp
   - «¿Cuál es el perfil de Instagram que deseas impulsar?»
   - «Explicá ¿Qué vendés?»
   - ¿Dónde escuchaste de nosotros?
   - Principal obstáculo (leads · conversión · demanda · sistema comercial · referidos · estrategia)
   - Prioridad en 60-90 días (4 niveles)
   - Facturación media de los últimos 3 meses (de 500 a +10.000 USD/mes)
   - Inversión dispuesta (de 0 a +3.000 USD)
   - Cláusula de claridad: «inversión mínima de USD 1.000… ¿Estás en condiciones?» (Entiendo y quiero agendar / No dispongo ese monto)
   - Campos ocultos con las UTM (source, campaign, medium, content). Existe una etiqueta o página «No Califica».
4. **Calendario GHL** «Llamada de Consultoría – Crea&Sube», evento «Llamada de Admisión», **60 min**, round robin de 5:
   - «📲 Confirmación obligatoria por WhatsApp. Sin confirmar… la sesión no se realiza.»
   - «Reprogramá o cancelá con mínimo 6 horas. Fuera de ese plazo, no aceptamos reagendas.»
   - «Conectate desde computadora.»
5. **Gracias** (/cita-gracias): «Gracias por reservar, pero falta confirmar. Tu sesión todavía no está confirmada. Leé los mensajes que te enviamos por WhatsApp», más casos y FAQ.
- Medición: script propio `fxTrack` que manda **eventos personalizados al píxel (fbq trackCustom), a gtag y a dataLayer**: `InteraccionVSL`, `Scroll`, `VerTestimonio`, `VioCalendario`, con la variante A/B y la zona de la página. Usa también Microsoft Clarity («Crea y Sube Oct 2026 – Clarity Hub»). El ID del píxel no está en el HTML [E: lo inyecta la integración de GHL].

## Instagram @fedecaball [C, Apify 1-nov]
- **1.162.965 seguidores** · 88 seguidos · 1.016 publicaciones · verificado.
- Bio: «Ayudo a Marcas y Negocios a Escalar sus Ventas con Contenido Orgánico / +5 Años y +1,200 Clientes / Tocá Aquí y te Ayudo 1-1» → creaysubementoria.com/calendario.
- Ritmo: **30 posts en 13 días** (19 al 31-oct), unos 2,3 al día: 19 carruseles y 11 reels.
- **29 de 30 llevan «👉🏻 Comenta: "PALABRA" y te envío…»**. Palabras: YO (7), SISTEMA (4), CARRUSEL, MANY, EDICIÓN, GRABAR, DESTACADAS, EMBUDO, GANCHOS, STORIE, SÍNTOMA, ANALISIS, CASA, REELS, PUERTAS, TEO, EVA.
- El texto del post es solo la llamada a la acción: el gancho va en la imagen o el vídeo (Apify no lo extrae).
- Promesas del regalo: «aprende a crear Reels que venden», «con IA», «con Claude», «te envío el bot para optimizar tu perfil», «te regalo una auditoría de perfil», «atrae 100-500 mensajes de clientes».
- Interacción: mediana de 322 likes y 258 comentarios. Máximos:
  - «Comenta YO y aprende a crear Reels con IA que venden» (carrusel): 3.308 likes y 2.414 comentarios.
  - «Comenta EDICIÓN… Reels que venden con Claude»: 2.687 comentarios.
  - «Comenta DESTACADAS… bot para optimizar tu perfil» (reel): 1.562 comentarios.
- Los comentarios repiten la palabra («Edición», «Embudo», «Destacadas»…) → [E] ManyChat o similar responde por DM con el recurso y abre la conversación (él mismo anuncia «Comenta MANY e instala esta automatización»).
- Formato [E por títulos y alt]: carruseles tipo meme o captura de Twitter y reels con texto en pantalla.

## Anuncios que le funcionan [C hist.json]
- 220 anuncios, **83 activos**, 201 en vídeo. Página con 42.841 «me gusta». Muchos anuncios solo en Instagram (109).

| Señal | Texto | Copias | Días | Estado |
|---|---|---|---|---|
| Caballo de batalla | «Si tu contenido no te trae clientes todos los días… no tienes un negocio, tienes un problema. Hay marcas personales creciendo a +100K seguidores y generando leads diarios SOLO con contenido estratégico. No es suerte. Es sistema. 👉 …agenda una sesión» → «Book now» /rm | **65 (35 activas)** | **208** (7-abr → hoy) | activo |
| Conversación directa | Sin texto; vídeo con botón «Send message» → DM de Instagram | **50 (16 activas)** | 193 | activo |
| Posts orgánicos promocionados | «👉🏻 Comenta: "CASA" y te envío la estrategia que usan mis clientes para vender 🎁», «CLASE», «100K», «PDF», «HOOKS», «15 HORAS», «2 HORAS», «SISTEMA»… | 1-6 cada uno | hasta 271 | ~20 activos |
| Webinar o grupo (apagado) | «¿Instagram no funciona… o estás improvisando tu contenido? En esta mentoría 100% gratuita… regístrate al grupo de WhatsApp» | 13 | 52 (feb-mar) | apagado |

- Lectura [E]: dos motores a la vez. (a) Un anuncio de agenda directa que lleva 7 meses activo con 35 copias: el más «probado» de las 5 cuentas. (b) Promoción de sus mejores posts «Comenta X» y de anuncios de DM, que meten conversaciones en Instagram para que el equipo de setters las convierta en llamadas.

## Qué nos sirve a Qualivo
1. **Confirmar por WhatsApp como requisito para que exista la llamada** («sin confirmar, la sesión no se realiza»), avisado en el calendario y en la página de gracias. Es nuestro producto: podemos enseñarlo como práctica de una cuenta con más de 1 M de seguidores.
2. **Decir el precio mínimo en el formulario** («inversión mínima de USD 1.000… ¿estás en condiciones?»). Filtra sin asustar porque aclara que no es el precio total. Para academias: «Nuestros programas empiezan en 500 €».
3. **Eventos de microconversión al píxel** (vio el VSL, vio un testimonio, vio el calendario) y Clarity con variante A/B. Es la medición que podemos montar en las landings de clientes y enseñar en el panel.
4. **Anuncios «Send message» a DM y posts «Comenta X»**: en cuentas con audiencia, el anuncio barato abre una conversación y no manda a una landing. Encaja con nuestro agente de WhatsApp o Instagram: la conversación necesita alguien que conteste en minutos, y ahí entramos nosotros.
5. **El mensaje que aguanta 208 días es corto y binario** («si tu contenido no te trae clientes todos los días… no tienes un negocio, tienes un problema»). Versión para Qualivo: «Si tus leads esperan más de 5 minutos una respuesta, no tienes un problema de anuncios: tienes un problema de sistema».
