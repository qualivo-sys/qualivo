# Impulso 360 · Impulso Business Lab · Rober Rubio

> Análisis de Growth, 1-nov-2026. Fuentes: go.impulsobusinesslab.com (HTML + chunks JS de Next.js), /gracias, impulsobusinesslab.com (home, aviso legal, condiciones de garantía, T&C), impulso360.io/montamostuempresa (→ /testab), impulsobizlab.io/aplicar-embed3, Biblioteca de anuncios (sim/hist.json, 201 anuncios), Apify (perfil + 30 posts de @impulsobusinesslab).
> [C] = comprobado · [E] = estimación. No se rellenó ningún formulario: las preguntas salen del código público de la página.

## Quién / empresa
- **IMPULSO BUSINESS LAB, S.L.**, NIF **B26678896**, Avda. Reyes Católicos 31, 38005 Santa Cruz de Tenerife [C, condiciones de garantía y aviso legal de /testab]. **Española.**
- Fundador: **Rober Rubio** («Conoce a Rober Rubio», «Contrata a Rober Rubio como speaker») [C, home]. El nombre del Instagram es «Rober Rubio | I Only Run Paid Ads» [C].
- Equipo citado en reseñas: Diego, Luis, Ana, Mafer (coach asignada) [C]. Origen del método: vendía un programa de pérdida de peso, «Diciembre de 2022: 2.200 €. Enero de 2023: 17.000 €» al ponerle nombre a un mecanismo («nutrición menstrual») [C, carrusel].
- Dominios: impulsobusinesslab.com, go.impulsobusinesslab.com, impulsobizlab.io, impulso360.io, opiniones.impulsobusinesslab.com, y en la bio un subdominio de sequoiasaleshub.com [C].

## Qué vende y a quién
- A quién: «coaches, consultores, terapeutas, entrenadores online, agencias de servicios» que **ya facturan** (mínimo +1.000 €/mes en anuncios, +2.000 €/mes en la landing). Excluye negocio físico, ecommerce, SaaS, inmobiliaria y MLM [C].
- Qué: done-for-you del **«Embudo de Autoridad»**: oferta «cold-friendly» («lista en 48h»), landing, emails, CRM, automatizaciones, calendario, guiones de venta y anuncios «low cost» (5-15 €/día) «que Andrómeda premia», más mentoría semanal, grupo de Telegram y eventos presenciales (Tenerife) [C].
- Titular actual: «Te instalamos el embudo de autoridad con el que nuestros clientes han llegado a +10k, +20k y hasta +50k al mes **sin crear contenido** — O no pagas» [C].
- Precio: «**Nuestro programa más accesible es de 274 €/mes durante 12 meses**» (3.288 € en total) [C, pregunta del formulario]. Hay un nivel superior, «Impulso Élite» [C]; [E] más caro.
- Garantías [C, /condiciones-de-garantia, actualizado el 14-mar-2026]:
  - **Garantía 360**: devolución o continuación si en 12 semanas desde el lanzamiento no recuperas la inversión. Requisitos: subir 5 grabaciones de llamadas, 5 guiones por escrito, el 80 % de los cuestionarios semanales e invertir en Meta si no llegas a 2.000 visualizaciones diarias de historias.
  - **Garantía Élite**: «15 clientes al mes o no pagas». Ticket mínimo de 997 €; inversión mínima de 3.000 € en campañas WCR (webinar) + 500 € en Social Funnel; contactar a **todos los leads en menos de 48 h hábiles**; subir el 80 % de las llamadas de cierre a su «Sales Call Analyzer» con nota media de 8/10. Fórmula de inversión: (ticket × 15) / 4.
- Prueba social: «+300 negocios», «+1,2M€ generados», «ROAS x7-x12», «+279 reseñas de 5 estrellas», «96 % de satisfacción», «+80 casos en vídeo» (10 testimonios en YouTube en la landing), unos 200 nombres en marquesina, reseñas largas con respuesta del fundador [C]. «Solo trabajamos con 10 negocios al mes» [C].

## Embudo actual (go.impulsobusinesslab.com) [C]
**Web propia en Next.js, sin GHL**, con API propia (`/api/lead`, `/api/clasificar`, `/api/disqualify`, `/api/slots?days=21&tier=`, `/api/book`, `/api/track`, `/api/agendas-recientes`).
1. Barra superior de exclusión: «Solo para negocios que ya facturan · Si todavía no tienes negocio, esto no es para ti · No enseñamos a empezar desde cero».
2. Titular + «Solicitar una plaza →». «Responde en menos de 3 minutos, descubre si podemos garantizarte el éxito y agenda tu auditoría.»
3. **Formulario + calendario en la misma pantalla**; el calendario sale bloqueado («Rellena el formulario para desbloquear el calendario. Solo te llevará 30 segundos»).
   - Paso 1: nombre, apellidos, email, WhatsApp (prefijos de España y Latinoamérica) y consentimiento a IMPULSO BUSINESS LAB SL.
   - Quiz «4 toques y sabrás si podemos escalar tu negocio»:
     1. **Escenario**: no factura / <2.000 € → 5.000 € / 2.000-10.000 € → +10.000 € / +10.000 € → 30-50k.
     2. **Tipo de negocio**: 7 opciones marcadas como `qualifies` sí o no; si eliges «varias», salta una subpregunta. Aviso: «si tu negocio no es de ese tipo, no agendes: cancelaremos la llamada y bloquearemos tu contacto».
     3. **Inversión requerida**: «274 €/mes durante 12 meses. ¿Estás en disposición?» Sí / No.
     4. **Urgencia**: Ya / 2-3 meses / «No tengo prisa» → pantalla «explorador» con 7 vídeos cortos de preguntas frecuentes, sin calendario.
   - Si encaja: «Encajas. Elige el día y la hora de tu auditoría. Al tocar una hora queda agendada al instante.» La reunión dura 45-90 min «con una persona del equipo, no con un comercial».
   - Si no encaja: «Cuéntanoslo por WhatsApp… te contestamos en minutos» con el mensaje rellenado («Hola, el formulario me ha dicho que no encajo, pero creo que sí. Mi negocio es: …»), o «Céntrate en llegar a una base estable de facturación y vuelve entonces».
   - Disponibilidad por niveles (`tier`) según la cualificación [E: los mejores leads ven más huecos o más cercanos].
4. **Gracias** (/gracias): «Llamada confirmada… Acepta la invitación del calendario».
- **Medición (lo más avanzado de las 5 cuentas)**: 2 píxeles (`1551239168855614`, `1019615233276985`) + **API de Conversiones con deduplicación** (`eventID`, fbp, fbc, email y teléfono enviados a /api/track):
  - `ViewContent` al cargar la landing.
  - `InitiateCheckout` al empezar el formulario (una vez por sesión).
  - **`CompleteRegistration` solo si cualifica** (y no si factura <1k).
  - `Schedule` al reservar.
  - Analítica propia de cada respuesta (`quiz_answer`, `dq`, `explorador`, `whatsapp_derivado`).
  - Encaja con su garantía, que exige campañas optimizadas al evento «Registro Completo».

### Embudos anteriores [C]
- impulso360.io/montamostuempresa → /testab (GHL + vturb + Clarity): «Garantizado: Social Funnel + Anuncios Low-Cost + MicroOferta LowTicket = Sistema instalado generando mínimo 7k€/mes en 30 días o no pagas».
- impulsobizlab.io/aplicar-embed3 («Prepárate para tu llamada», GHL). En la Biblioteca se describe como «Landing con vídeo principal de Loom, FAQ con 7 vídeos, galería de testimonios de YouTube».

## Instagram @impulsobusinesslab [C, Apify 1-nov]
- **31.469 seguidores** · 2.157 seguidos · 354 publicaciones · verificado · cuenta de empresa.
- Bio: «Instalamos tu Embudo de Autoridad para vender high ticket / Coaching • Consultoría • Formación / +400 casos de éxito 15k / 📩 Escríbeme SISTEMA por privado».
- Ritmo: **30 posts en 13 días** (19 al 31-oct): **26 carruseles** + 4 reels. 28 de 30 con «Comenta PALABRA y te mando…».
- Palabras: CUALIFICADO, PRESUPUESTO, FILTRO, ESCALAR, PRUEBA, APAGAR, MECANISMO, REAGENDA, SEGUNDOS, GARANTIA, CREATIVOS, PRECIO, HOOK, OBJECIONES, LLAMADA, CARO, ANGULOS, TESTING, MATRIZ, VARIANTES, CADUCA, PIXEL, LIBROS, BAUTIZO.
- Temas: anuncios en Meta (creativos, testing, cuándo apagar, escalar, píxel), venta en llamada (objeciones, «es caro», presupuesto) y oferta (mecanismo con nombre, garantía condicionada). **Pies largos con datos propios** («leads a 33 $ con un 33 % de descartados frente a 41 $ con un 68 % → cualificado 49 $ frente a 129 $»).
- Interacción **muy baja para 31k seguidores**: mediana de 7 likes y 5 comentarios; máximo 24 likes y 28 comentarios («Comenta CREATIVOS»). [E] Audiencia antigua o poco activa; el contenido funciona como material de confianza y para retargeting más que por alcance orgánico.
- Datos de sus pies que nos sirven directamente [C, cifras suyas sin verificar]:
  - **REAGENDA**: «El lead que mueve su cita compra un 8,3 %. El que viene a la primera, un 3,2 %. Y asiste más: 35 % frente a 23 %. Pero cuando escribe "no puedo", le contestamos "vale, ya me dices". De 64 que avisaron, solo 21 acabaron con otra cita. Y se presentaron 9.»
  - **PRESUPUESTO**: «"¿Cuánto facturas?" no filtra. En 30 días, 83 de 245 agendas cambiaron su facturación hasta que les dejaba pasar… Lo que sí predice la venta es su actitud ante invertir: sí puede → compra el 47 %; duda → 15 %; no → 0 %.»
  - **OBJECIONES**: 20-50 vídeos de 1-2 min, cada uno contra una objeción, mostrados **solo a quien agendó en los últimos 7 días** y en secuencia; refuerzo por email del closer y WhatsApp automático → «un 15 % más de cierre».
  - **LLAMADA**: confianza, credibilidad, valor y deseo antes del precio.

## Anuncios que le funcionan [C hist.json]
- 201 anuncios (desde may-2025), **solo 5 activos**, y los 5 son carruseles orgánicos promocionados al perfil («Comenta BAUTIZO», «LLAMADA», «REAGENDA», «VSL»). Página con 800 «me gusta». Formatos: 131 vídeos, 28 imágenes, 27 carruseles, 13 DCO.

| Señal | Texto | Copias | Días | Estado |
|---|---|---|---|---|
| El más longevo | «❌ ¿Cuánto más vas a seguir peleando con Instagram para conseguir clientes? … 💥 Un negocio no se construye con likes… 🚀 Nosotros montamos TU negocio por ti» → montamostuempresa | **34** | **482** (jun-2025 → 21-oct-2026) | apagado |
| DCO | Catálogo dinámico | 13 | 528 | apagado |
| Formato filtro | «✅ Esto SÍ es para ti si… Facturas más de 1.000€/mes… 3 publicaciones = 20.000€/mes» | 12-14 | 181 | apagado |
| Escena + garantía | «Te suena el móvil. Es una llamada de venta. Y ya se te hace un nudo en el estómago… explicar tu valor durante 45 minutos… "me lo tengo que pensar". Nosotros le damos la vuelta… Cuando descuelgas, la venta ya está hecha… Y si no consigues 15 clientes, no pagas» | 10 + 9 + 8 (3 versiones, 19 en ad_stats) | 121-131 | apagado |
| Contra agencias | «Esto NO es para ti si… La semana pasada me escribió un coach. 4.500 euros en una agencia. Tres meses. Cero clientes…» | 9-16 | 112-132 | apagado |
| Números | «15 clientes en menos de un mes. 437€ invertidos. 32€ por cliente. Sin agencia de 2.000€/mes» | 6-7 | 188-220 | apagado |

- Lectura [E]:
  - Lo que aguanta es (1) **el filtro «Esto NO es / Esto SÍ es para ti»** con «ticket medio inferior a 500 €» como exclusión explícita, (2) la **escena de la llamada de venta incómoda** y (3) la **garantía de 15 clientes**.
  - En la última semana de octubre apagó casi todo el captador y solo promociona carruseles. [E] Pausa, cambio de cuenta publicitaria o paso al embudo nuevo con otra página.

## Qué nos sirve a Qualivo
1. **Su exclusión es literalmente nuestro filtro**: «❌ Tu ticket medio es inferior a 500 €». Validado durante más de 130 días de anuncios. Copiar el formato «Esto NO es para ti si / Esto SÍ es para ti si» en anuncio y landing.
2. **Quiz + calendario bloqueado + CompleteRegistration solo para cualificados + CAPI deduplicada.** Es el estándar al que debería llegar nuestra landing (hoy hay 0 leads a 20 €/día): optimizar Meta al lead cualificado o a la reserva, no al formulario. Y los no cualificados, a WhatsApp con mensaje rellenado, no a un callejón sin salida.
3. **Preguntar la actitud ante la inversión, no la facturación** (sí → 47 % de compra, duda → 15 %, no → 0 %, según él), con el precio de entrada a la vista («274 €/mes durante 12 meses»). Para academias: «La matrícula empieza en X €. ¿Encaja en tu presupuesto?».
4. **Argumentos con sus propios datos para vender nuestro seguimiento**: reagendar convierte 2,6 veces más y la mayoría de los «no puedo» se pierden por un «vale, ya me dices». Y su garantía Élite **exige contactar a todos los leads en menos de 48 h**: el mercado ya acepta que la velocidad de respuesta decide la venta. Nosotros lo hacemos en minutos.
5. **Vídeos de objeciones solo para quien ya agendó** (retargeting de 7 días + WhatsApp). Es un módulo «antes de la llamada» que podemos añadir al producto: menos ausencias y más cierre.
