# Creador OS · Álvaro Fuentes (@soyalvarofuen)

> Análisis de Growth, 1-nov-2026. Fuentes: creadoros.com (/, /thank-you/, /privacidad, /terminos-y-condiciones), configuración pública del evento de Calendly, metadatos del vídeo en Wistia, Biblioteca de anuncios (sim/hist.json, 185 anuncios), Apify (perfil + 14 posts de @soyalvarofuen).
> [C] = comprobado · [E] = estimación. No se reservó ninguna llamada.

## Quién / empresa
- **Álvaro Fuentes**, «Content Architect». Titular de Creador OS y del «Sistema Híbrido de Adquisición» **como persona física**: en privacidad y T&C no aparecen sociedad, NIF ni domicilio, solo el email [C].
- La zona horaria del Calendly es Europe/Berlin [C] → [E] puede vivir fuera de España o usar un horario CET; escribe en castellano de España («conozcáis») [C].
- Cuenta pequeña: 1.563 seguidores, página de Facebook con 35 «me gusta» [C]. Un post de sep-2026: «POV: viajas a Londres a un Mastermind de 1M$/mes» [C, alt del reel] → [E] forma parte de un mastermind y probablemente ha copiado el modelo de ahí.

## Qué vende y a quién
- A quién: «Solo para negocios online que ya facturan»: mentores, consultores, infoproductores y agencias «que venden servicios o programas high ticket de más de 1.000 €» [C, FAQ].
- Qué: done-for-you de **120 días**: «Implementamos en tu negocio un sistema de ventas diarias para que aumentes tu facturación mes a mes sin depender de lanzamientos o reels virales» [C].
  - Fase 01 «Oferta y Posicionamiento» (ICP, oferta core, mecanismo único).
  - Fase 02 «Sistema de Adquisición» (contenido, paid ads, «nutrición prellamada»).
  - Fase 03 «Optimización y Escalado» («KPIs clave: CPL, show up rate y close rate»).
- Precio: no se ve; «se formalizará mediante un contrato específico» [C, T&C]. Los anuncios hablan de clientes que venden «programas de +6.000 €» y «tickets de +3.000 €» [C] → [E] su servicio está en ese rango o por debajo.
- Garantía: en el formulario de Calendly, «en los próximos 120 días te dejamos instalado un sistema predecible que te traiga clientes high ticket todas las semanas (**o seguimos trabajando contigo gratis hasta que lo consigas**)» [C]. Los T&C dicen «no garantiza ningún resultado concreto» [C].
- Escasez: «Solo trabajamos con 5 negocios nuevos cada mes que ya están vendiendo» [C, anuncios de octubre].
- Prueba social: 3 casos con nombre y antes/después [C, home]:
  - **Pablo Rodríguez**, consultor de LinkedIn B2B: de 1.500 €/mes a «+9.500 € en 24 días». Reposicionado como «LinkedIn Growth System» con ticket de 3.000 € + setter en DMs + 200 € en anuncios; 5 llamadas.
  - **Pedro Buerbaum**, Akka Spain: +13K seguidores en IG en 90 días.
  - **Rebeca Jiménez**, infoproductora de oposiciones: «+5.000 € en 30 días · ROAS 8,83x» a tráfico frío.

## Embudo [C]
1. **Anuncio** (vídeo; solo Instagram en 176 de 185) con «See details» → creadoros.com. Todos acaban igual: «He grabado un vídeo de 5 minutos donde te explico…».
2. **Landing en una sola página** (WordPress + Elementor, tema Hello):
   - Cabecera: «Creador OS. By Álvaro Fuentes. Solo para Negocios Online que ya Facturan».
   - «• PASO 1 · REVISA ESTE VÍDEO •»: VSL en Wistia «VSL Álvaro Fuentes v3 (22/10)», **3 min 40 s** (219,5 s). Lo dice el anuncio («5 minutos») y lleva versión y fecha, así que lo itera.
   - «• PASO 2 · AGENDA TU LLAMADA •» → casos → 3 fases → «• PASO 3 · ESCOGE TU HUECO •» con **Calendly incrustado** → FAQ.
3. **Calendly** «Llamada de Estrategia 1-1 con Álvaro», **45 min**, Google Meet, organizador único, reserva instantánea. «Si tienes algún socio en el negocio, añádelo en la convocatoria.» 6 preguntas obligatorias:
   1. ¿Cuál es tu @ de Instagram?
   2. «Si te aseguramos que en los próximos 120 días te dejamos instalado un sistema… (o seguimos trabajando contigo gratis…), ¿querrías saber cómo funciona?» Sí / «No (no agendes)»
   3. Situación financiera: «Tengo recursos (varios miles de EUR)» / «Tengo acceso a financiación (crédito, ahorros…)» / «No tengo recursos (menos de 1.000 € disponibles)»
   4. «¿Aceptas acudir a la llamada con toda tu atención y concentración?» Sí / «No (no agendes)»
   5. «¿Eres el único decisor financiero de esta inversión?» Sí / «No, hay otro decisor (socio / cofundador / pareja)»
   6. ¿Cuándo te gustaría empezar? (Ya mismo · 1-2 semanas · 1 mes · No tengo prisa)
4. **Gracias** (/thank-you/, redirección de Calendly con los datos de la reserva):
   - «IMPORTANTE: Tu llamada NO está confirmada hasta que completes los pasos de abajo.»
   - Paso 1: vídeo de 2 min en Loom.
   - Paso 2: buscar el email «Calendario Personal» y aceptar la invitación.
   - Paso 3: 4 «entrenamientos» en YouTube («Así reposicionamos su formación de LinkedIn para hacer un x6 en 24 días», «Cómo vender servicios de +3.000 € por Instagram en 20 minutos»…) + carrusel de resultados.
- Medición:
  - Píxel `3540004689482777`: `PageView`; **`Contact` al pulsar «AGENDA TU LLAMADA»** (una vez por carga de página); **`Schedule` en la página de gracias** (comentario en el código: «Schedule NO se dispara aquí: ya lo envía la thank you page»).
  - GA4 `G-HBTB665WSQ`.
  - **Webhook a Google Sheets** que guarda una fila «Lead directo» por sesión al pulsar el botón [C, comentario del código] → su «CRM» es una hoja de cálculo.

## Instagram @soyalvarofuen [C, Apify 1-nov]
- **1.563 seguidores** · 531 seguidos · **14 publicaciones** · verificado.
- Bio: «Te ayudo a captar clientes High ticket en Evergreen con Sistemas de Contenido / Solo trabajo 1-1 / Escríbeme "OS" y reviso tu caso personalmente» → enlace a YouTube (urlgeni.us).
- 14 posts entre jul-2025 y oct-2026: 11 carruseles de estilo de vida (Londres, Suecia, Menorca, Turquía, «Otoño y mucho workkk») y 3 reels («No necesitas 1.000 seguidores para vender high ticket en Instagram», «Lo que ocurre cuando dejas de crear contenido viral:»). Mediana de 15 likes y 1-2 comentarios; ningún «comenta X».
- Lectura [E]: el Instagram no capta. Es el perfil que el lead visita para comprobar que Álvaro es una persona real (verificado, viajes, mastermind). El trabajo lo hacen los anuncios, el VSL y Calendly. Encaja con su propio mensaje: «No crees contenido viral… estamos cerrando tickets de +3.000 € por Stories, sin tener ni 1.000 seguidores».

## Anuncios que le funcionan [C hist.json]
- 185 anuncios, **27 activos**, 148 en vídeo, 35 imágenes. Por mes: julio 49, agosto 40, septiembre 18, **octubre 64** (está acelerando). Botón «See details» en 167. 16 anuncios llevan al perfil de Instagram.
- Duplica poco (máximo 9 copias) y aguanta lo que funciona:

| Señal | Texto | Copias | Días | Estado |
|---|---|---|---|---|
| El más longevo | «No hagas más contenido viral. Ayudamos a Pablo, consultor especializado en LinkedIn, a pasar de 1.500€ a 9.500€ en 25 días. No porque creara más contenido viral. Sino porque le ajustamos la oferta…» | 8 (2 activas) | **108** | activo |
| Caso | «Rebeca pasó de 0€ a 5.000€ en el primer mes con su infoproducto. No necesitó hacerse viral…» | 4 (1 activa) | 108 | activo |
| Paso | «El primer paso que tienes que revisar para vender high ticket con tu Instagram» | 3 | 102 | activo |
| Contra lo viral | «No crees Contenido Viral en 2026… Estamos cerrando tickets de +3.000€ por Stories de Instagram. Sin tener ni 1.000 seguidores» | 3 | 93 | activo |
| Tanda de octubre (dolor largo) | «Viste a un referente montar un embudo de lead magnets y lo copiaste… a quien entra por un prompt o un PDF es muy difícil venderle un programa de +6.000€» · «Tu agencia te trae leads que no te conocen… preferimos traerte leads el doble de caros que te compran» · «Haces la llamada y el lead te dice que le encaja, pero que se lo tiene que pensar… A los tres días te deja en visto» · «Tu techo de facturación es, en realidad, un techo de tiempo» · «una semana tienes la agenda llena y la siguiente casi vacía» | 3-9 cada uno | 2-11 | activos (test) |

- Lectura [E]:
  - Lo que ha sobrevivido más de 100 días es **corto, con un caso con nombre y una inversión del sentido común** («no hagas más contenido viral… le ajustamos la oferta»).
  - En octubre prueba 8-9 dolores largos en paralelo, cada uno con un escenario concreto, la misma solución («sistema de captación diario») y el mismo cierre (vídeo de 5 min + 5 plazas al mes).

## Qué nos sirve a Qualivo
1. **Las preguntas de Calendly son un buen guion de cualificación**: cómo se financia (recursos / financiación / no), si es el único que decide (o trae al socio o la pareja), compromiso de asistencia y cuándo empezar. Adaptadas a academias: ¿quién decide la matrícula?, ¿cuándo empieza el curso?, ¿financiación? Las podemos meter tal cual en el flujo del agente de voz o de WhatsApp.
2. **La página de gracias dice «tu llamada NO está confirmada hasta…»** (igual que Fede). Ya hay 3 de 5 cuentas que hacen la confirmación activa obligatoria: prueba de mercado para nuestro módulo de confirmación y recordatorios.
3. **El anuncio de un caso con mecanismo** («no fue por X, fue porque le ajustamos Y») es su ganador más longevo. Para Qualivo: «No fue por más anuncios. Fue porque empezó a contestar en 2 minutos.» Solo con un caso real y con permiso.
4. **Los eventos bien colocados con herramientas baratas** (Contact al clic, Schedule en la página de gracias, Google Sheets como CRM) demuestran que el mercado se monta esto con parches. **Ahí está nuestro hueco**: él tiene la captación pero no la respuesta inmediata, el seguimiento ni el panel. Es un cliente potencial de Qualivo además de un referente.
5. **El ángulo «leads el doble de caros que te compran»** encaja con nuestro mensaje de calidad sobre volumen (leads A/B y reuniones celebradas, no coste por lead).
