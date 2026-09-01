#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tanda 2 de artículos + regenera la portada del blog con TODO el catálogo."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import gen_articles as g   # al importar, regenera la tanda 1 (con índice/TOC)

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
CTA_GEN, CTA_NEG = g.CTA_GEN, g.CTA_NEG
S = lambda h, b: (h, b)

B2 = [
 {"slug":"nail-art-principiantes","eyebrow":"Nail art","title":"Nail art para principiantes: diseños fáciles paso a paso | Eleva Nails",
  "desc":"Aprende nail art desde cero: materiales, diseños fáciles paso a paso (puntos, líneas, francesa, efecto espejo) y trucos para que queden perfectos.",
  "h1":"Nail art para principiantes",
  "lead":"El nail art es lo que hace que tus uñas destaquen (y lo que te deja cobrar más). Aquí tienes diseños fáciles para empezar hoy mismo, aunque nunca hayas decorado unas uñas.",
  "callout":"<b>Empieza simple:</b> puntos, líneas y francesa. Con 3-4 técnicas básicas ya puedes crear decenas de diseños.",
  "sections":[S("Materiales básicos","<ul><li>Dotting tool (o un palillo) para puntos.</li><li>Pincel fino para líneas.</li><li>Cinta de nail art / stickers.</li><li>Top coat para sellar.</li></ul>"),
   S("Diseños fáciles paso a paso","<p><b>Puntos:</b> moja el dotting tool en esmalte y apoya. <b>Francesa:</b> línea limpia en la punta. <b>Líneas:</b> pincel fino con poco producto. <b>Efecto espejo:</b> pigmento cromado sobre gel curado.</p>"),
   S("Trucos para que queden perfectos","<ul><li>Trabaja en capas finas.</li><li>Sella siempre con top coat.</li><li>Limpia el pincel entre color y color.</li></ul>"),
   S("De hobby a profesión","<p>Si te engancha, el nail art es de las especialidades mejor pagadas. <a href='/curso-unas-acrilicas'>Fórmate en profesional</a>.</p>")],
  "related":[("/disenos-unas-2026","tendencias 2026"),("/unas-francesa-paso-a-paso","francesa paso a paso"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"disenos-unas-2026","eyebrow":"Tendencias","title":"Diseños de uñas 2026: las tendencias que arrasan | Eleva Nails",
  "desc":"Las tendencias de diseños de uñas 2026: colores, acabados y estilos que más se van a pedir. Inspiración para clientas y profesionales.",
  "h1":"Diseños de uñas 2026: tendencias",
  "lead":"¿Qué se va a llevar en 2026? Te adelantamos las tendencias de uñas que más pedirán tus clientas para que vayas por delante.",
  "callout":"<b>Clave 2026:</b> lo natural y elegante (efecto glass, nude, aura) convive con lo llamativo (cromados, 3D). Saber hacer ambos te hace imprescindible.",
  "sections":[S("Acabados que triunfan","<ul><li>Efecto glass / cristal.</li><li>Cromado y espejo.</li><li>Aura nails (degradado con aerógrafo/pigmento).</li><li>Nude y french invertida.</li></ul>"),
   S("Colores del año","<p>Tonos nude cálidos, cerezas oscuros, y pasteles lechosos. El rojo vuelve con fuerza.</p>"),
   S("Por qué te conviene dominarlas","<p>Las clientas piden lo que ven en redes. Ofrecer tendencia = más reservas y más ticket. <a href='/conseguir-clientas-unas'>Cómo captar clientas con redes</a>.</p>")],
  "related":[("/nail-art-principiantes","nail art para empezar"),("/manicura-rusa-que-es","manicura rusa"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"unas-francesa-paso-a-paso","eyebrow":"Técnica","title":"Uñas francesa paso a paso (manicura francesa perfecta) | Eleva Nails",
  "desc":"Cómo hacer la manicura francesa paso a paso: la línea perfecta, variantes modernas (baby french, color) y trucos para que quede limpia.",
  "h1":"Uñas francesa paso a paso",
  "lead":"La francesa es un clásico que nunca falla y de las más pedidas. Te enseñamos a hacer la línea perfecta y sus variantes modernas.",
  "callout":"<b>El secreto:</b> una línea de sonrisa limpia y simétrica. Con pincel fino o tips de guía, sale perfecta con práctica.",
  "sections":[S("Paso a paso","<ol class='steps'><li>Prepara y aplica base.</li><li>Color nude o transparente de fondo.</li><li>Dibuja la línea blanca en la punta (pincel fino).</li><li>Sella con top coat.</li></ol>"),
   S("Variantes modernas","<ul><li>Baby french (línea finísima).</li><li>French de color.</li><li>French invertida (en la base).</li></ul>"),
   S("Errores a evitar","<p>Demasiado producto, línea gruesa o asimétrica. <a href='/errores-comunes-manicura'>Más errores comunes</a>.</p>")],
  "related":[("/nail-art-principiantes","nail art"),("/disenos-unas-2026","tendencias 2026"),("/como-hacer-unas-de-gel","uñas de gel")],
  "course":CTA_GEN},

 {"slug":"baby-boomer-unas","eyebrow":"Técnica","title":"Uñas baby boomer: qué son y cómo se hacen | Eleva Nails",
  "desc":"Qué son las uñas baby boomer (degradado francesa nude a blanco), cómo se hacen paso a paso y por qué son de las más pedidas. Guía de Eleva Nails.",
  "h1":"Uñas baby boomer",
  "lead":"Las baby boomer son la evolución elegante de la francesa: un degradado suave de nude a blanco. Súper pedidas y perfectas para novias y eventos.",
  "callout":"<b>Qué son:</b> un difuminado sin línea marcada entre el nude y el blanco. Se puede hacer en gel o acrílico.",
  "sections":[S("Cómo se hacen","<p>Se logra difuminando el blanco sobre el nude mientras el producto está fresco (esponja, pincel o técnica de acrílico) y sellando.</p>"),
   S("Gel o acrílico","<p>En gel con difuminado; en acrílico jugando con los polvos nude y blanco. <a href='/gel-vs-acrilico-vs-acrygel'>Diferencias entre técnicas</a>.</p>"),
   S("Para quién","<p>Ideal para un look natural y sofisticado. Muy demandado en bodas.</p>")],
  "related":[("/unas-francesa-paso-a-paso","francesa"),("/curso-unas-acrilicas","curso de acrílico"),("/disenos-unas-2026","tendencias")],
  "course":CTA_GEN},

 {"slug":"como-quitar-unas-gel-casa","eyebrow":"Cuidados","title":"Cómo quitar uñas de gel en casa sin dañarlas | Eleva Nails",
  "desc":"Cómo quitar las uñas de gel en casa paso a paso y sin dañar la uña natural: método con acetona, tiempos y errores a evitar.",
  "h1":"Cómo quitar uñas de gel en casa",
  "lead":"Quitar el gel mal es la causa nº1 de uñas dañadas. Te enseñamos a retirarlo en casa de forma segura, sin arrancar ni debilitar la uña.",
  "callout":"<b>Regla de oro:</b> nunca arranques ni fuerces. El gel se retira reblandeciéndolo, no tirando.",
  "sections":[S("Lo que necesitas","<ul><li>Lima, acetona, algodón y papel de aluminio (o clips).</li><li>Palo de naranjo y aceite de cutícula.</li></ul>"),
   S("Paso a paso","<ol class='steps'><li>Lima la capa brillante del top.</li><li>Empapa algodón en acetona y envuélvelo con aluminio 10-15 min.</li><li>Retira el gel reblandecido con el palo de naranjo, sin forzar.</li><li>Hidrata cutícula y uña.</li></ol>"),
   S("Cuida la uña después","<p>Hidrata y evita reponer inmediatamente si la uña está débil. <a href='/cuidado-unas-sanas'>Cómo tener uñas sanas</a>.</p>")],
  "faq":[("¿Se pueden quitar las uñas de gel sin acetona?","Es más difícil y lento; la acetona sigue siendo el método más seguro si no arrancas."),
         ("¿Cada cuánto conviene descansar?","Si notas la uña débil, deja unos días entre retirada y nueva aplicación e hidrata.")],
  "related":[("/como-quitar-unas-acrilicas-casa","quitar acrílicas"),("/cuidado-unas-sanas","uñas sanas"),("/como-hacer-unas-de-gel","hacer uñas de gel")],
  "course":CTA_GEN},

 {"slug":"como-quitar-unas-acrilicas-casa","eyebrow":"Cuidados","title":"Cómo quitar uñas acrílicas en casa (sin dañarlas) | Eleva Nails",
  "desc":"Cómo retirar las uñas acrílicas en casa paso a paso con acetona, sin arrancar ni dañar la uña natural. Guía segura de Eleva Nails.",
  "h1":"Cómo quitar uñas acrílicas en casa",
  "lead":"El acrílico aguanta mucho, así que retirarlo pide paciencia. Aquí tienes el método seguro para hacerlo en casa sin destrozar tu uña.",
  "callout":"<b>Nunca arranques el acrílico:</b> te llevas capas de uña natural. Siempre reblandecer con acetona.",
  "sections":[S("Paso a paso","<ol class='steps'><li>Corta el largo con alicate.</li><li>Lima la capa superior.</li><li>Envuelve con algodón+acetona y aluminio 15-20 min.</li><li>Retira lo reblandecido; repite si hace falta.</li><li>Hidrata.</li></ol>"),
   S("Diferencia con el gel","<p>El acrílico tarda más en reblandecer. <a href='/como-quitar-unas-gel-casa'>Cómo quitar el gel</a>.</p>")],
  "related":[("/como-quitar-unas-gel-casa","quitar gel"),("/cuidado-unas-sanas","uñas sanas"),("/curso-unas-acrilicas","curso de acrílico")],
  "course":CTA_GEN},

 {"slug":"gel-vs-acrilico-vs-acrygel","eyebrow":"Técnica","title":"Gel, acrílico o acrygel: diferencias y cuál elegir | Eleva Nails",
  "desc":"Diferencias entre uñas de gel, acrílico y acrygel: resistencia, olor, dificultad y para qué es mejor cada una. Comparativa clara de Eleva Nails.",
  "h1":"Gel, acrílico o acrygel: diferencias",
  "lead":"¿Gel, acrílico o acrygel? Es la duda de toda principiante. Te lo comparamos claro para que sepas cuál usar en cada caso.",
  "callout":"<b>Resumen:</b> acrílico = máxima resistencia; gel = flexible y olor suave; acrygel = punto medio, fácil de manejar.",
  "sections":[S("Acrílico","<p>Muy resistente, ideal para largos y clientas exigentes. Olor más fuerte y curva de aprendizaje mayor.</p>"),
   S("Gel","<p>Flexible, natural, olor suave. Cura en lámpara. Genial para nivelación y esculpido medio.</p>"),
   S("Acrygel","<p>Combina lo mejor: fácil de trabajar (no chorrea), resistente y sin olor fuerte. Perfecto para empezar.</p>"),
   S("¿Cuál aprender primero?","<p>Un buen curso te enseña las tres. <a href='/que-curso-de-unas-necesitas'>Descubre qué curso te encaja</a>.</p>")],
  "related":[("/curso-unas-gel","curso de gel"),("/curso-unas-acrilicas","curso de acrílico"),("/que-curso-de-unas-necesitas","qué curso necesitas")],
  "course":CTA_GEN},

 {"slug":"rubber-base-que-es","eyebrow":"Técnica","title":"Qué es la rubber base y para qué sirve | Eleva Nails",
  "desc":"Qué es la rubber base (base rubber), para qué sirve, en qué se diferencia de la base normal y cómo usarla para nivelar y reforzar la uña.",
  "h1":"Qué es la rubber base",
  "lead":"La rubber base se ha vuelto imprescindible: nivela, refuerza y hace que el esmaltado dure más. Te explicamos qué es y cómo usarla.",
  "callout":"<b>En una frase:</b> es una base de gel más densa que nivela la uña y aporta resistencia, ideal para semipermanente que dura semanas.",
  "sections":[S("Para qué sirve","<ul><li>Nivelar uñas irregulares.</li><li>Reforzar uñas finas.</li><li>Alargar la duración del semipermanente.</li></ul>"),
   S("Cómo se usa","<p>Se aplica una capa media, se nivela y se cura en lámpara antes del color. <a href='/semipermanente-que-dure'>Cómo hacer que dure el semi</a>.</p>")],
  "related":[("/semipermanente-que-dure","semi que dura"),("/nivelacion-unas-torno","nivelación"),("/como-hacer-unas-de-gel","uñas de gel")],
  "course":CTA_GEN},

 {"slug":"manicura-rusa-que-es","eyebrow":"Técnica","title":"Manicura rusa: qué es, ventajas y riesgos | Eleva Nails",
  "desc":"Qué es la manicura rusa (en seco con torno), por qué está de moda, sus ventajas, riesgos y por qué exige formación profesional. Eleva Nails.",
  "h1":"Manicura rusa: qué es",
  "lead":"La manicura rusa está por todas partes: acabado ultra limpio y duradero. Pero mal hecha puede dañar. Te contamos qué es y qué debes saber.",
  "callout":"<b>Ojo:</b> la manicura rusa trabaja muy cerca de la piel con torno. Da un acabado espectacular pero <b>exige formación</b> para no lesionar la cutícula.",
  "sections":[S("Qué es","<p>Es una manicura en seco (sin agua) que retira la cutícula con torno y fresas específicas, dejando un acabado muy pulcro y prolongando el esmaltado.</p>"),
   S("Ventajas","<ul><li>Acabado impecable y duradero.</li><li>Esmaltado que llega hasta la cutícula.</li></ul>"),
   S("Riesgos y formación","<p>Hecha sin técnica puede dañar la matriz o causar infecciones. Por eso <b>requiere formación profesional</b> y bioseguridad. <a href='/higiene-esterilizacion-manicura'>Higiene en manicura</a>.</p>")],
  "related":[("/nivelacion-unas-torno","torno para principiantes"),("/higiene-esterilizacion-manicura","higiene"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"cuidado-unas-sanas","eyebrow":"Cuidados","title":"Cómo tener uñas sanas y fuertes: guía de cuidado | Eleva Nails",
  "desc":"Consejos para tener uñas sanas y fuertes: hidratación, alimentación, descansos del esmaltado y errores que las debilitan. Guía de Eleva Nails.",
  "h1":"Cómo tener uñas sanas y fuertes",
  "lead":"Unas uñas sanas son la base de cualquier manicura bonita (y de un buen trabajo profesional). Aquí tienes cómo cuidarlas de verdad.",
  "callout":"<b>Lo esencial:</b> hidratar la cutícula a diario, no arrancar el producto y una buena preparación antes de esmaltar.",
  "sections":[S("Hábitos que fortalecen","<ul><li>Aceite de cutícula a diario.</li><li>Guantes para tareas con químicos/agua.</li><li>Alimentación con proteínas y biotina.</li></ul>"),
   S("Errores que las dañan","<ul><li>Arrancar el gel/acrílico.</li><li>Usar las uñas como herramienta.</li><li>Retirar mal el producto.</li></ul>"),
   S("Para profesionales","<p>Una técnica que cuida la uña de la clienta fideliza. Se aprende en la formación.</p>")],
  "related":[("/como-quitar-unas-gel-casa","quitar gel bien"),("/errores-comunes-manicura","errores comunes"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"errores-comunes-manicura","eyebrow":"Técnica","title":"10 errores comunes al hacer uñas (y cómo evitarlos) | Eleva Nails",
  "desc":"Los errores más comunes al hacer uñas: mala preparación, exceso de producto, curado incorrecto, mala estructura… y cómo corregirlos. Eleva Nails.",
  "h1":"10 errores comunes al hacer uñas",
  "lead":"Si el esmaltado se levanta o las uñas no duran, seguramente es uno de estos errores. Los repasamos para que dejes de cometerlos.",
  "callout":"<b>El 90% de los despegues</b> vienen de una mala preparación de la uña. Ahí está la clave.",
  "sections":[S("Los errores más habituales","<ul><li>No preparar/deshidratar bien la uña.</li><li>Exceso de producto.</li><li>Tocar la piel con el producto.</li><li>Curado insuficiente.</li><li>Mala estructura (sin apex).</li><li>No sellar el borde libre.</li><li>Limar de forma agresiva.</li><li>Capas gruesas.</li><li>Higiene deficiente.</li><li>Precios y tiempos mal calculados.</li></ul>"),
   S("Cómo corregirlos","<p>Casi todos se arreglan con técnica y práctica guiada. <a href='/cuanto-cobrar-por-unas'>Y calcula bien tus precios/tiempos</a>.</p>")],
  "related":[("/unas-acrilicas-paso-a-paso","acrílicas paso a paso"),("/cuidado-unas-sanas","uñas sanas"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"cuanto-se-tarda-aprender-unas","eyebrow":"Formación","title":"¿Cuánto se tarda en aprender a hacer uñas? | Eleva Nails",
  "desc":"¿Cuánto se tarda en aprender a hacer uñas de forma profesional? Tiempos realistas según técnica y dedicación, y cómo acelerar el aprendizaje.",
  "h1":"¿Cuánto se tarda en aprender a hacer uñas?",
  "lead":"Depende de tu dedicación y del método, pero antes de lo que crees puedes hacer trabajos vendibles. Te damos tiempos realistas.",
  "callout":"<b>Realista:</b> con formación y práctica constante puedes empezar a cobrar en pocos meses; la velocidad y el acabado pro llegan con las horas de manos.",
  "sections":[S("Por niveles","<ul><li>Base (semipermanente, francesa): semanas.</li><li>Esculpido (gel/acrílico): meses de práctica.</li><li>Velocidad profesional: se coge trabajando.</li></ul>"),
   S("Cómo acelerar","<p>Formación con corrección + práctica diaria sobre modelo. La teoría sola no basta. <a href='/que-curso-de-unas-necesitas'>Elige tu curso</a>.</p>")],
  "related":[("/como-ser-manicurista","cómo ser manicurista"),("/curso-unas-online","curso online"),("/requisitos-manicurista-espana","requisitos")],
  "course":CTA_GEN},

 {"slug":"instagram-para-manicuristas","eyebrow":"Negocio","title":"Instagram para manicuristas: cómo captar clientas | Eleva Nails",
  "desc":"Cómo usar Instagram y TikTok para captar clientas de uñas: qué publicar, hashtags locales, reels y cómo convertir seguidoras en reservas.",
  "h1":"Instagram para manicuristas",
  "lead":"Instagram y TikTok son tu escaparate y tu mejor fuente de clientas gratis. Te contamos cómo usarlos para llenar la agenda.",
  "callout":"<b>Clave:</b> no necesitas ser influencer. Necesitas mostrar tu trabajo con constancia y facilitar la reserva.",
  "sections":[S("Qué publicar","<ul><li>Antes/después y proceso en vídeo.</li><li>Reels cortos (lo que más alcance da).</li><li>Testimonios de clientas.</li></ul>"),
   S("Hashtags y localización","<p>Usa etiquetas locales (#uñasmadrid) y activa la ubicación para que te encuentren en tu zona.</p>"),
   S("De seguidora a reserva","<p>Pon el enlace de reserva/WhatsApp visible y responde rápido. <a href='/conseguir-clientas-unas'>Plan completo de captación</a>.</p>")],
  "related":[("/conseguir-clientas-unas","conseguir clientas"),("/fidelizar-clientas-unas","fidelizar clientas"),("/montar-negocio-unas","montar tu negocio")],
  "course":CTA_NEG},

 {"slug":"fidelizar-clientas-unas","eyebrow":"Negocio","title":"Cómo fidelizar a tus clientas de uñas | Eleva Nails",
  "desc":"Estrategias para fidelizar clientas de uñas: agendar la siguiente cita, tarjeta de fidelidad, WhatsApp y detalles que hacen que vuelvan siempre.",
  "h1":"Cómo fidelizar a tus clientas de uñas",
  "lead":"Captar una clienta cuesta; retenerla es lo que hace rentable tu negocio. Estas son las tácticas que hacen que vuelvan una y otra vez.",
  "callout":"<b>Dato:</b> retener a una clienta es mucho más barato que captar una nueva. La fidelización es donde está el margen.",
  "sections":[S("Tácticas que funcionan","<ul><li>Agenda la siguiente cita antes de que se vaya.</li><li>Tarjeta de fidelidad / recompensas.</li><li>Recordatorios por WhatsApp.</li><li>Un detalle sorpresa de vez en cuando.</li></ul>"),
   S("La experiencia importa","<p>Puntualidad, higiene y trato cercano hacen que hablen de ti. <a href='/instagram-para-manicuristas'>Y que te recomienden en redes</a>.</p>")],
  "related":[("/conseguir-clientas-unas","conseguir clientas"),("/cuanto-cobrar-por-unas","cuánto cobrar"),("/montar-negocio-unas","montar tu negocio")],
  "course":CTA_NEG},

 {"slug":"abrir-salon-unas","eyebrow":"Negocio","title":"Cómo abrir un salón de uñas: guía paso a paso | Eleva Nails",
  "desc":"Cómo abrir un salón de uñas: licencia, inversión, ubicación, normativa, precios y captación. Guía práctica para dar el salto al local. Eleva Nails.",
  "h1":"Cómo abrir un salón de uñas",
  "lead":"Dar el salto de casa a tu propio local es un momentazo. Para que salga bien, aquí tienes lo que necesitas prever antes de abrir.",
  "callout":"<b>Antes de firmar el alquiler:</b> valida la demanda (empieza en casa), calcula bien los números y ten claro el punto de equilibrio.",
  "sections":[S("Lo que necesitas","<ul><li>Alta de autónoma o sociedad.</li><li>Licencia de actividad del local.</li><li>Normativa sanitaria y de residuos.</li><li>Mobiliario, aspiración y material.</li></ul>"),
   S("Los números","<p>Alquiler, reforma, material y un colchón para los primeros meses. Calcula cuántos servicios necesitas para cubrir gastos. <a href='/cuanto-cobrar-por-unas'>Calcula precios</a>.</p>"),
   S("Empieza validando","<p>Muchas abren local cuando ya tienen agenda llena en casa. <a href='/montar-negocio-unas'>Cómo montar tu negocio desde cero</a>.</p>")],
  "related":[("/montar-negocio-unas","montar negocio"),("/autonoma-manicurista","hacerte autónoma"),("/conseguir-clientas-unas","captar clientas")],
  "course":CTA_NEG},

 {"slug":"semipermanente-que-dure","eyebrow":"Técnica","title":"Cómo hacer que dure la manicura semipermanente | Eleva Nails",
  "desc":"Trucos para que el esmaltado semipermanente dure 3 semanas sin levantarse: preparación, sellado del borde, rubber base y cuidados de la clienta.",
  "h1":"Cómo hacer que dure la semipermanente",
  "lead":"Si el semipermanente se levanta a los pocos días, pierdes clientas. Estos son los trucos profesionales para que aguante 3 semanas impecable.",
  "callout":"<b>El 90% de la duración</b> se decide en la preparación y en el sellado del borde libre.",
  "sections":[S("Preparación perfecta","<p>Empuje de cutícula, matificado suave, deshidratante y primer. Sin esto, no hay durabilidad.</p>"),
   S("Sella el borde libre","<p>Pasa cada capa por el filo de la uña. Es el truco que evita el 'chipping'.</p>"),
   S("Rubber base y capas finas","<p>Nivela con <a href='/rubber-base-que-es'>rubber base</a> y trabaja en capas finas bien curadas.</p>"),
   S("Cuidados de la clienta","<p>Aceite de cutícula y guantes. Un buen aftercare alarga el trabajo.</p>")],
  "related":[("/rubber-base-que-es","rubber base"),("/errores-comunes-manicura","errores comunes"),("/cuidado-unas-sanas","uñas sanas")],
  "course":CTA_GEN},

 {"slug":"curso-pedicura","eyebrow":"Formación","title":"Curso de pedicura profesional: qué aprenderás | Eleva Nails",
  "desc":"Qué se aprende en un curso de pedicura profesional, salidas laborales y por qué combinar manicura y pedicura multiplica tus ingresos. Eleva Nails.",
  "h1":"Curso de pedicura profesional",
  "lead":"La pedicura es un servicio muy demandado y rentable que complementa la manicura. Formarte en ambas te hace mucho más completa (y solicitada).",
  "callout":"<b>Ventaja:</b> ofrecer manicura + pedicura sube el ticket medio y llena huecos de agenda todo el año.",
  "sections":[S("Qué aprenderás","<ul><li>Pedicura estética y spa.</li><li>Tratamiento de durezas y cuidado.</li><li>Esmaltado y semipermanente en pies.</li><li>Higiene y bioseguridad.</li></ul>"),
   S("Salidas","<p>Centros de estética, spas, podología estética y tu propio negocio. <a href='/salidas-laborales-unas'>Ver salidas laborales</a>.</p>")],
  "related":[("/como-ser-manicurista","cómo ser manicurista"),("/curso-unas-certificado","curso con certificado"),("/salidas-laborales-unas","salidas laborales")],
  "course":CTA_GEN},

 {"slug":"higiene-esterilizacion-manicura","eyebrow":"Profesión","title":"Higiene y esterilización en manicura: guía esencial | Eleva Nails",
  "desc":"Cómo aplicar la higiene y esterilización correctas en manicura: desinfección, esterilización del material, normativa y por qué es clave para tu reputación.",
  "h1":"Higiene y esterilización en manicura",
  "lead":"La bioseguridad no es opcional: protege a tus clientas, a ti y a tu reputación. Te contamos lo esencial que toda profesional debe cumplir.",
  "callout":"<b>Regla:</b> desinfectar no es esterilizar. El material que toca piel debe esterilizarse correctamente entre clientas.",
  "sections":[S("Desinfección vs esterilización","<p>Desinfectar reduce microorganismos; esterilizar los elimina. El material reutilizable (alicates, fresas) requiere esterilización.</p>"),
   S("Buenas prácticas","<ul><li>Guantes y superficies desinfectadas.</li><li>Material de un solo uso cuando toque.</li><li>Esterilizador (autoclave/UV según normativa).</li><li>Gestión correcta de residuos.</li></ul>"),
   S("Por qué importa para tu negocio","<p>Una clienta que ve higiene, confía y vuelve. Es parte de la profesionalidad. <a href='/como-ser-manicurista'>Todo lo que necesitas para ser pro</a>.</p>")],
  "related":[("/manicura-rusa-que-es","manicura rusa"),("/requisitos-manicurista-espana","requisitos"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"unas-a-domicilio","eyebrow":"Negocio","title":"Cómo trabajar haciendo uñas a domicilio | Eleva Nails",
  "desc":"Cómo montar un servicio de uñas a domicilio: ventajas, material portátil, precios, seguridad y cómo captar clientas. Empieza sin local. Eleva Nails.",
  "h1":"Cómo trabajar haciendo uñas a domicilio",
  "lead":"El servicio a domicilio es una forma genial de empezar sin local: bajos costes, flexibilidad y un extra que muchas clientas valoran (y pagan).",
  "callout":"<b>Ideal para empezar:</b> sin alquiler, con tu propia agenda y cobrando un plus por la comodidad del domicilio.",
  "sections":[S("Ventajas","<ul><li>Cero gastos de local.</li><li>Flexibilidad total.</li><li>Puedes cobrar un extra por desplazamiento.</li></ul>"),
   S("Lo que necesitas","<p>Kit portátil, lámpara, higiene impecable y organización de rutas. Alta de autónoma para facturar. <a href='/autonoma-manicurista'>Cómo hacerte autónoma</a>.</p>"),
   S("Capta clientas","<p>Redes locales y boca a boca. <a href='/conseguir-clientas-unas'>Plan de captación</a>.</p>")],
  "related":[("/montar-negocio-unas","montar negocio"),("/autonoma-manicurista","hacerte autónoma"),("/conseguir-clientas-unas","captar clientas")],
  "course":CTA_NEG},

 {"slug":"press-on-nails-negocio","eyebrow":"Negocio","title":"Press on nails: qué son y cómo hacer negocio | Eleva Nails",
  "desc":"Qué son las press on nails (uñas adhesivas reutilizables), por qué están en auge y cómo montar un negocio vendiéndolas personalizadas. Eleva Nails.",
  "h1":"Press on nails: qué son y su negocio",
  "lead":"Las press on nails (uñas postizas reutilizables) están de moda y abren un modelo de negocio que puedes llevar sin cita: creas sets y los vendes.",
  "callout":"<b>Oportunidad:</b> puedes fabricar sets personalizados y venderlos online, sin depender de la agenda de citas.",
  "sections":[S("Qué son","<p>Uñas prefabricadas que se aplican con adhesivo o gel y se pueden reutilizar. Ideales para quien no quiere cita o para eventos.</p>"),
   S("El modelo de negocio","<ul><li>Sets a medida bajo pedido.</li><li>Venta online + redes.</li><li>Complemento a tu servicio en cabina.</li></ul>"),
   S("Necesitas técnica igual","<p>Un buen set parte de dominar la técnica y el diseño. <a href='/nail-art-principiantes'>Empieza por el nail art</a>.</p>")],
  "related":[("/nail-art-principiantes","nail art"),("/montar-negocio-unas","montar negocio"),("/disenos-unas-2026","tendencias")],
  "course":CTA_NEG},
]

for a in B2:
    a.setdefault('recap', None)
    open(os.path.join(OUT, a['slug']+'.html'), 'w', encoding='utf-8').write(g.build(a))
print("Tanda 2:", len(B2), "artículos")

# ---- Portada del blog con TODO el catálogo ----
def card(href, kicker, title, desc, feat=False):
    cls = "bcard feat" if feat else "bcard"
    return f'<a class="{cls}" href="{href}"><span class="bk">{kicker}</span><h3>{title}</h3><p>{desc}</p></a>'

GROUPS = [
 ("Empieza por aquí", [
   ("/como-ser-manicurista","Guía pilar","Cómo ser manicurista profesional","Requisitos, formación, sueldos y cómo empezar.",True),
   ("/montar-negocio-unas","Guía pilar","Cómo montar un negocio de uñas","De casa a tu propio centro: todo lo que necesitas.",True),
   ("/","🧮 Calculadora","Cuánto gana una manicurista","Sueldos reales + calculadora de ingresos.",False),
   ("/cuanto-cobrar-por-unas","💰 Calculadora","Cuánto cobrar por tus uñas","Pon precio y calcula tu beneficio por hora.",False),
   ("/que-curso-de-unas-necesitas","✅ Test","¿Qué curso de uñas necesitas?","Tu formación ideal en 2 minutos.",False),
 ]),
 ("Formación", [
   ("/curso-unas-online","Formación","Curso de uñas online","Cómo elegir uno que te prepare de verdad.",False),
   ("/curso-unas-online-vs-presencial","Formación","Online vs presencial","Qué modalidad te conviene.",False),
   ("/curso-unas-acrilicas","Técnica","Curso de uñas acrílicas","La técnica más demandada.",False),
   ("/curso-unas-gel","Técnica","Curso de uñas de gel","Versátil y muy pedida.",False),
   ("/curso-pedicura","Formación","Curso de pedicura","Un servicio extra muy rentable.",False),
   ("/curso-unas-certificado","Titulación","Curso con certificado","Qué titulación obtienes.",False),
   ("/curso-unas-gratis-sepe","Formación","Curso gratis o SEPE","Qué opciones existen de verdad.",False),
   ("/mejores-cursos-de-unas","Formación","Cómo elegir el mejor curso","Checklist para acertar.",False),
   ("/cuanto-se-tarda-aprender-unas","Formación","¿Cuánto se tarda en aprender?","Tiempos realistas.",False),
 ]),
 ("Técnica paso a paso", [
   ("/unas-acrilicas-paso-a-paso","Técnica","Uñas acrílicas paso a paso","El proceso completo.",False),
   ("/como-hacer-unas-de-gel","Técnica","Cómo hacer uñas de gel","Paso a paso fácil.",False),
   ("/gel-vs-acrilico-vs-acrygel","Técnica","Gel, acrílico o acrygel","Diferencias y cuál elegir.",False),
   ("/unas-francesa-paso-a-paso","Técnica","Uñas francesa paso a paso","La línea perfecta.",False),
   ("/baby-boomer-unas","Técnica","Uñas baby boomer","El degradado de moda.",False),
   ("/nail-art-principiantes","Nail art","Nail art para principiantes","Diseños fáciles para empezar.",False),
   ("/disenos-unas-2026","Tendencias","Diseños de uñas 2026","Lo que se va a llevar.",False),
   ("/manicura-rusa-que-es","Técnica","Manicura rusa: qué es","Ventajas y riesgos.",False),
   ("/rubber-base-que-es","Técnica","Qué es la rubber base","Para qué sirve.",False),
   ("/nivelacion-unas-torno","Técnica","Nivelación y torno","Cómo usarlos sin dañar.",False),
   ("/semipermanente-que-dure","Técnica","Semipermanente que dura","Que aguante 3 semanas.",False),
   ("/kit-unas-principiantes","Material","Kit para empezar","El material imprescindible.",False),
 ]),
 ("Cuidados", [
   ("/como-quitar-unas-gel-casa","Cuidados","Quitar uñas de gel en casa","Sin dañar la uña.",False),
   ("/como-quitar-unas-acrilicas-casa","Cuidados","Quitar uñas acrílicas en casa","Método seguro.",False),
   ("/cuidado-unas-sanas","Cuidados","Uñas sanas y fuertes","Guía de cuidado.",False),
   ("/errores-comunes-manicura","Técnica","10 errores al hacer uñas","Y cómo evitarlos.",False),
   ("/higiene-esterilizacion-manicura","Profesión","Higiene y esterilización","Guía esencial.",False),
 ]),
 ("Negocio y profesión", [
   ("/conseguir-clientas-unas","Negocio","Cómo conseguir clientas","Llena tu agenda desde cero.",False),
   ("/instagram-para-manicuristas","Negocio","Instagram para manicuristas","Capta clientas gratis.",False),
   ("/fidelizar-clientas-unas","Negocio","Cómo fidelizar clientas","Que vuelvan siempre.",False),
   ("/autonoma-manicurista","Negocio","Hacerte autónoma","El alta paso a paso.",False),
   ("/abrir-salon-unas","Negocio","Cómo abrir un salón","Del sueño al local.",False),
   ("/unas-a-domicilio","Negocio","Uñas a domicilio","Empieza sin local.",False),
   ("/press-on-nails-negocio","Negocio","Press on nails","Un negocio sin cita.",False),
   ("/requisitos-manicurista-espana","Profesión","Requisitos para trabajar","Qué necesitas de verdad.",False),
   ("/salidas-laborales-unas","Profesión","Salidas laborales","Dónde puedes trabajar.",False),
 ]),
 ("Cursos por ciudad", [
   ("/curso-unas-madrid","Local","Curso de uñas en Madrid","Online + prácticas.",False),
   ("/curso-unas-barcelona","Local","Curso de uñas en Barcelona","Online + prácticas.",False),
   ("/curso-unas-valencia","Local","Curso de uñas en Valencia","Online + prácticas.",False),
   ("/curso-unas-sevilla","Local","Curso de uñas en Sevilla","Online + prácticas.",False),
 ]),
]

sections_html = ""
total = 0
for gtitle, cards in GROUPS:
    sections_html += "  <h2>%s</h2>\n  <div class=\"bloglist\">\n" % gtitle
    for c in cards:
        sections_html += "    " + card(*c) + "\n"; total += 1
    sections_html += "  </div>\n"

WA = g.WA
blog = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog de Eleva Nails | Formación, negocio y sueldos en el mundo de las uñas</title>
<meta name="description" content="+40 guías y herramientas gratuitas para dedicarte a las uñas: cuánto se gana, cómo formarte, técnica paso a paso, cuidados y cómo montar tu negocio.">
<meta property="og:title" content="Blog de Eleva Nails">
<meta property="og:type" content="website">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://blog.elevanails.es/blog">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💅</text></svg>">
<link rel="stylesheet" href="/brand.css">
</head>
<body>
""" + g.HEADER + """
<div class="wrap">
  <span class="eyebrow">Blog Eleva Nails</span>
  <h1>Todo para vivir de las uñas</h1>
  <p class="lead">Guías y herramientas gratuitas para formarte, dominar la técnica, poner precios, captar clientas y montar tu negocio. Sin humo.</p>
""" + sections_html + """
  <p class="foot">© Eleva Nails · Formación profesional de manicura</p>
</div>
""" + WA + """
</body>
</html>"""
open(os.path.join(OUT, 'blog.html'), 'w', encoding='utf-8').write(blog)
print("Portada del blog regenerada con", total, "tarjetas")
