# Pablo Tregón · ScaleContent (antes Panteras Digitales)

Fecha del análisis: 1 nov 2026. Leyenda: **[C]** comprobado (con fuente) · **[E]** supuesto o inferido.

## 1. Quién / empresa

- **Persona fundadora:** Pablo Tregón [C: meta `og:author` "Pablo Tregón" en panterasdigitales.com/prevideo; página de Meta «Pablo Tregón Automatización de Contenido», id 552530817935233].
- **Titular legal:**
  - panterasdigitales.com: Pablo Tregón Esteban, persona física (autónomo) con domicilio en Teruel. Actividad: «Servicios de publicidad y marketing / formación en automatizar la creación de contenido con IA» [C: panterasdigitales.com/aviso-legal]. No copio aquí el NIF ni la dirección.
  - scalebusiness.ai: «New World Systems LLC», sociedad de Wyoming (EE. UU.), marca comercial **ScaleContent**, con contacto alberto@scalebusiness.ai. El aviso legal está sin terminar («Texto pendiente de redacción y revisión legal por Alberto», versión de septiembre de 2026) [C: scalebusiness.ai/legal/aviso-legal].
  - Hay un socio o colaborador llamado Alberto [C: el mismo aviso legal]; su papel exacto es [E].
- **Marca:** la web nueva dice «SCALE CONTENT · PANTERAS DIGITALES», así que han pasado de Panteras Digitales a ScaleContent sin abandonar la primera [C: pie de panterasdigitales.com/org-video]. Afirman «2023 · primeros en España» [C: org-video].
- **Página de Facebook:** 67 «me gusta» [C: `pageLikeCount` en hist.json].

## 2. Qué vende y a quién

- **Producto:** la «instalación en 20 días» de un sistema de contenido con IA [C: scalebusiness.ai]:
  - clones hiperrealistas del experto (cara y voz), grabados en un único día de estudio, del que salen «+20 clones de por vida» [C: org-video];
  - software entrenado con su negocio que decide qué publicar y en qué formato, escribe guiones y carruseles y lo edita y publica todo;
  - medición de cada pieza para multiplicar las que funcionan. El anuncio nuevo lo llama «Matriz de Testeo Infinita» [C: anuncio activo del 28 oct 2026].
- **A quién:**
  - «Solo para negocios de servicios o expertos que crean contenido y facturan +10.000/mes» [C: titular de scalebusiness.ai].
  - Versiones anteriores: «+5.000 €/mes» e «invierten +3.000 €/mes en marketing» [C: panterasdigitales.com/prevideo y org-prevideo].
  - Sectores que citan: fitness, abogacía, inmobiliario, trading, salud, formadores, oposiciones, negocio local [C: org-video].
- **Precio:**
  - El formulario pregunta si el cliente «puede invertir entre **5.000-7.000 € en total**» o hacerlo «fraccionado en 2-3 pagos» [C: paso «inversion» del formulario de scalebusiness.ai].
  - FAQ: «instalación con precio cerrado… se puede repartir en varios pagos… la cifra exacta te la damos en la llamada» [C].
  - Ticket estimado: 5-7 k€ de pago único por la instalación [C por la pregunta del formulario; el importe final es E]. No se ve cuota recurrente [E].
- **Garantía:** no aparece ninguna en las landings [C: revisé scalebusiness.ai, prevideo, org-prevideo y org-video]. Solo frases como «Sin compromiso. Si no encaja, te lo decimos nosotros primero» [C].

## 3. Embudo

**Embudo actual (anuncio → scalebusiness.ai):**

1. **Anuncio** de vídeo con CTA «See details» y destino scalebusiness.ai [C: hist.json].
2. **Landing con VSL**, en Next.js con recursos en Supabase:
   - El VSL dura **613 s (≈10:13)** [C: `durationSeconds` del reproductor].
   - Se reproduce a velocidad 1,1×, no deja adelantar (`allowSeekForward:false`), muestra una barra de progreso «log» y mide los umbrales 10/25/50/75/95 % [C: configuración del reproductor].
   - Los vídeos están alojados en Panda Video [C].
3. **Formulario encima del vídeo:** «**Rellénalo para activar el sonido**». El vídeo arranca mudo y para oírlo hay que dejar el teléfono («5 minutos. Te lo mando también por WhatsApp») [C].
   - Pasos del formulario [C, en este orden]:
     1. teléfono;
     2. «¿En qué consiste tu negocio de servicios?»;
     3. «¿Qué estás buscando con esta solución?»;
     4. «¿Qué haces HOY para crear contenido?» (me grabo con regularidad / marca parada / posts sin cara / desde cero);
     5. nombre de Instagram;
     6. facturación (<7k / 7-20k / 20-50k / >50k €);
     7. cuándo empezar (lo antes posible / semanas / 1-3 meses / solo mirando);
     8. inversión (5-7k € / fraccionado / «no puedo invertir y NO tiene sentido agendar»);
     9. consentimiento: «te contactaré yo o mi equipo por teléfono **(próximas 24 h)** para confirmar tu cita… **si no respondes, tendremos que cancelar la llamada**» (sí / no).
   - El último paso es «Listo!! dale al play». No hay página de gracias aparte: todo ocurre dentro del widget [C].
4. **Agenda:** un widget propio («BookingWidgetIsland», «buscando huecos en la agenda…») para una «llamada de diagnóstico · 1 h» [C].
   - El proveedor del calendario no se ve; parece desarrollo propio sobre Supabase [E].
   - Alternativa: «¿No encuentras hueco? Escríbenos por WhatsApp» con un número español (+34) [C].
5. **Llamada previa de un setter** en 24 h y después la consultoría y demo [C: consentimiento del formulario].
   - En septiembre de 2026 publicaron un anuncio buscando un «CALL SETTER full time… llamarás a personas que ya han dejado sus datos… una llamada corta de valoración, agendar la reunión y conseguir que se presenten. 600 € fijos + variable 1.500-3.000 €/mes» [C: hist.json].

**Embudo anterior (2025 – verano de 2026):**

- Anuncio → panterasdigitales.com/prevideo u org-prevideo, una pre-landing hecha en GoHighLevel (leadconnectorhq) con el botón «Ver DEMO del sistema» → org-video.
- org-video tenía los «5 pasos de la implantación», 13 ejemplos de clones por sector, testimonios en WhatsApp y una agenda **GoHighLevel** (`api.leadconnectorhq.com/widget/booking/…`) para una consultoría y demo «20 minutos, sin compromiso» [C].
- 88 anuncios iban a `fb.me`, probablemente formulario instantáneo o Instant Experience [E].

**Seguimiento:**

- Píxel de Meta **654208970814991**, el mismo en Panteras y en ScaleContent [C].
- En scalebusiness.ai se envía `PageView` con `eventID`, preparado para deduplicar con la API de conversiones [C para el eventID; E para el uso de la API].
- No he visto en el HTML otros eventos (Lead o Schedule); pueden dispararse desde el servidor [E].

**Prueba social en la landing** [C: scalebusiness.ai y org-video]:

- Jordi (inmobiliaria, Barcelona): de 20 h/mes grabándose a 0 h; 46 publicaciones en 30 días; un vídeo de 151.000 views.
- Javier Pulido (coach fitness online): agendas de 160 € a 11-16 €, 95.000 € facturados el primer mes, ~1.000 €/día en anuncios.
- Rebeca (profesora de inglés): 180 vídeos con su clon.
- Un doctor en nutrición: +730.000 visualizaciones y +19.000 seguidores en 4 meses.
- Contadores: «+1.000 clones creados · +40 negocios · +10M visualizaciones».
- Capturas de WhatsApp «sin guion», por ejemplo «Pulido: €95K este mes».
- Los vídeos de testimonio duran entre 974 y 1.362 s [C].

## 4. Instagram

- **Cuenta personal de Pablo Tregón:** no la he encontrado. Probé `pablotregon` (existe, pero tiene 1 seguidor, 0 posts y nombre vacío), y `pablo.tregon`, `pablotregon_`, `pablo_tregon`, `pablotregon.ia`, `pablo.tregon.ia`, `pablotregonia`, `tregonpablo`, `pablotregon.ai`, `pablo_tregon_ia`, `pablotregonesteban` y `pablotregon.ceo`, que no existen [C: Apify `instagram-profile-scraper`]. Las landings no enlazan ningún Instagram [C].
- **@scalecontent.ai** (la marca) [C: Apify, 1 nov 2026]:
  - 20 seguidores, 11 publicaciones y 2 destacadas; la bio dice «Te instalamos el software para escalar tu negocio con contenido… y te clonamos para producirlo sin depender de ti» y enlaza a scalebusiness.ai.
  - Las 11 publicaciones son **reels de 41-61 s** (mediana 49 s), todos del 29 oct al 1 nov de 2026: la cuenta acaba de arrancar.
  - Vistas: mediana 129, máximo 307. Likes: mediana 2. Comentarios: 0.
  - **Ganchos** [C]:
    - «Tu sobrino te está arruinando el negocio. Y encima le das las gracias.» (307 vistas, el mejor);
    - «"El buen producto se vende solo", dijo el del local vacío» (177);
    - «Tu perfil espanta a tus clientes»;
    - «El que te dice "graba todos los días" no tiene un negocio. Te tiene a ti»;
    - «Publicar una vez al mes es peor que no publicar nada».
  - **Fórmula:** afirmación provocadora + pregunta de cierre del tipo «Sé sincero: ¿…?» que busca comentarios. No usan «comenta X».
  - Casi seguro que los producen con sus propios clones, como demostración de producto [E].
- **@panterasdigitales:** existe, pero tiene 1 seguidor y 0 posts [C].
- Su anuncio de búsqueda de setter dice «hay una palabra clave» al final del vídeo [C], pero no hay rastro de que usen «comenta X» en su contenido orgánico.

## 5. Anuncios que le funcionan (Biblioteca de Anuncios)

Resumen de la página [C: ad_stats.txt]:

- 180 anuncios en total, 19 activos.
- Formatos: VIDEO 168, DCO 12.
- CTA: Learn more 98, Watch more 64, See details 17.
- Destinos: fb.me 88, panterasdigitales/org-prevideo 53, scalebusiness.ai 23, prevideo 11, org-video 5.
- Ubicaciones: Facebook, Instagram, Audience Network, Messenger y Threads.
- Actividad mensual en 2026: marzo 19, junio 30, octubre 23.

| Señal [E] | Anuncio | Copias · días |
|---|---|---|
| **Ganador claro** | «**Haz los números.** 40-50 horas/mes creando contenido… Tu hora vale 100€… 50 h × 100€ = 5.000€/mes en tiempo perdido. 60.000€/año… Tu competencia: 3-4 h/mes, +30 reels… Diferencia: clones digitales… Gustavo: 1.5M vistas… Tu audiencia no detecta que es IA. **4 minutos. Te lo muestro todo.**» Título: «Contenido/Ads hiperrealistas sin grabarte. Existe.» | **130 copias, 4 activas, 333 días** (desde el 3 dic 2025) [C] |
| Segundo | «Llevas +8 años dominando tu sector… tu Instagram está muerto porque… no tienes tiempo… tu competencia mediocre construye más autoridad…» | 21 copias, 121 días [C] |
| Nuevo, en test | «Si tu negocio vive de que te contraten a ti, tu contenido no puede depender de que saques un rato para grabarte. Por eso te instalamos en 20 días la **Matriz de Testeo Infinita**… Haz clic, mira el vídeo y, si te encaja, agenda una consultoría.» | 15 copias, 15 activas, 4 días (desde el 28 oct 2026) [C] |

Títulos más repetidos [C]:

- «Contenido/Ads hiperrealistas sin grabarte. Existe.» (54);
- «Genera Reels con tu cara en 5 minutos SIN grabarte…» (35);
- «+30 reels/mes = 4h sin grabarte» (25).

Lectura [E]: el ángulo que funciona es el **coste de oportunidad en euros** (horas × valor de la hora), con una cifra anual muy visible y una prueba corta. El anuncio de la «Matriz» intenta pasar de «clones» a «sistema que mide y multiplica», más cerca de un sistema que de una herramienta.

## 6. Qué nos sirve a Qualivo

1. **El anuncio «Haz los números»**, adaptado a nuestro dolor. 333 días y 130 copias son la señal más fuerte del grupo. Por ejemplo: «Haz los números: 120 leads/mes × 40 % sin respuesta en los primeros 5 min × ticket de 1.500 € × tu tasa de cierre = X €/mes que se van a la academia de enfrente». Que sea texto largo con aritmética, una prueba concreta y «X minutos, te lo enseño».
2. **VSL bloqueado por un formulario que «activa el sonido».** Captamos el teléfono antes de que vean el vídeo, así que el lead existe aunque no agende. Encaja con lo que vendemos: ese lead entra al momento en nuestro WhatsApp y en el agente de voz. Podemos aplicarlo en nuestra propia landing.
3. **Formulario con la inversión explícita y el fraccionamiento** («5-7 k € o en 2-3 pagos / no puedo invertir y NO tiene sentido agendar»), más el consentimiento: «te llamamos en 24 h; si no respondes, cancelamos». Filtra precio, crea un compromiso previo y reduce las ausencias. Hay que copiarlo tal cual adaptado a nuestro rango de precio.
4. **Oferta de «instalación» con plazo y precio cerrados** («te instalamos en 20 días», «precio cerrado, se puede repartir»). Encaja con nuestro «montamos el sistema comercial»: «Te instalamos en 14 días tu sistema de respuesta en minutos + seguimiento + panel de matrículas».
5. **Prueba con métricas antes y después por caso** («160 € → 16 € por agenda», «20 h/mes → 0 h») y capturas de WhatsApp «sin guion». Además, contratan setters humanos para llamar en 24 h a quien deja sus datos: son el tipo de negocio que nos compraría el agente de voz o el WhatsApp de respuesta inmediata [E], y podríamos usarlos de ejemplo de «tu equipo tarda 24 h, el nuestro 2 min».

## Fuentes

- Biblioteca de Anuncios de Meta: /tmp/claude-0/-home-user-qualivo/e81e3e1a-5db3-5fdc-ba5b-52d4a8d77b22/scratchpad/sim/ad_stats.txt y hist.json (página 552530817935233).
- https://scalebusiness.ai/ y https://scalebusiness.ai/legal/aviso-legal (curl, 1 nov 2026).
- https://panterasdigitales.com/prevideo, /organic-prelanding (org-prevideo), /org-video, /aviso-legal.
- Instagram: Apify `instagram-profile-scraper` y `instagram-scraper` (1 nov 2026).
