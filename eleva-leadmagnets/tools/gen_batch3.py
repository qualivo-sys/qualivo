#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tanda 3: más artículos + los añade a la portada del blog existente."""
import os, sys, re
sys.path.insert(0, os.path.dirname(__file__))
import gen_articles as g
OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
GEN, NEG = g.CTA_GEN, g.CTA_NEG
def S(h, b): return (h, b)

B3 = [
 # ---- Diseños y tendencias ----
 {"grp":"Diseños y tendencias","slug":"unas-efecto-espejo","eyebrow":"Diseño","title":"Uñas efecto espejo (cromadas): cómo se hacen | Eleva Nails",
  "desc":"Qué son las uñas efecto espejo o cromadas, cómo se consiguen con pigmento cromado paso a paso y trucos para un acabado metálico perfecto.",
  "h1":"Uñas efecto espejo (cromadas)","lead":"El efecto espejo es de los acabados más pedidos: un metalizado impactante que se logra con pigmento cromado. Te contamos cómo se hace.",
  "callout":"<b>Clave:</b> el cromado se aplica sobre un top curado (sin pegajosidad) y se difumina con aplicador. La base oscura potencia el brillo.",
  "sections":[S("Cómo se consigue","<p>Sobre gel color curado, frota el pigmento cromado con un aplicador de silicona hasta que espeje y sella con top sin capa pegajosa.</p>"),
   S("Trucos","<ul><li>Base negra/oscura = espejo más intenso.</li><li>Sella bien los bordes.</li><li>Poco pigmento, mucho frotado.</li></ul>")],
  "related":[("/disenos-unas-2026","tendencias 2026"),("/nail-art-principiantes","nail art"),("/como-hacer-unas-de-gel","uñas de gel")],"course":GEN},
 {"grp":"Diseños y tendencias","slug":"unas-ojo-de-gato","eyebrow":"Diseño","title":"Uñas ojo de gato (cat eye): cómo hacerlas | Eleva Nails",
  "desc":"Cómo hacer uñas ojo de gato con gel magnético e imán paso a paso, y trucos para conseguir el reflejo perfecto. Guía de Eleva Nails.",
  "h1":"Uñas ojo de gato (cat eye)","lead":"El efecto ojo de gato hipnotiza: un reflejo de luz que se mueve. Se logra con gel magnético y un imán. Aquí tienes cómo.",
  "callout":"<b>El secreto:</b> el imán. Acércalo al gel magnético sin curar y crea la línea de luz; luego cura sin mover.",
  "sections":[S("Paso a paso","<ol class='steps'><li>Aplica gel magnético.</li><li>Acerca el imán unos segundos para crear el reflejo.</li><li>Cura en lámpara.</li><li>Sella con top.</li></ol>"),
   S("Variantes","<p>Puedes hacer líneas, diagonales o efecto galaxia según cómo muevas el imán.</p>")],
  "related":[("/disenos-unas-2026","tendencias"),("/nail-art-principiantes","nail art"),("/unas-efecto-espejo","efecto espejo")],"course":GEN},
 {"grp":"Diseños y tendencias","slug":"unas-encapsuladas","eyebrow":"Diseño","title":"Uñas encapsuladas: qué son y cómo se hacen | Eleva Nails",
  "desc":"Qué son las uñas encapsuladas (flores, glitter o elementos dentro del gel), cómo se hacen paso a paso y para qué ocasiones son ideales.",
  "h1":"Uñas encapsuladas","lead":"Encapsular es 'meter' decoración (flores secas, glitter, foil) dentro de capas de gel para un acabado 3D liso y espectacular.",
  "callout":"<b>Idea:</b> se colocan los elementos sobre una capa de gel y se 'encierran' con más gel constructor, curando entre capas.",
  "sections":[S("Cómo se hacen","<p>Base + capa de gel, colocas la decoración, sellas con gel constructor y curas. Se lima y da brillo para un acabado uniforme.</p>"),
   S("Ideas","<ul><li>Flores secas.</li><li>Glitter y foil.</li><li>Efecto acuario.</li></ul>")],
  "related":[("/nail-art-principiantes","nail art"),("/como-hacer-unas-de-gel","uñas de gel"),("/disenos-unas-2026","tendencias")],"course":GEN},
 {"grp":"Diseños y tendencias","slug":"degradado-ombre-unas","eyebrow":"Diseño","title":"Uñas degradado (ombré): cómo hacerlo paso a paso | Eleva Nails",
  "desc":"Cómo hacer el degradado u ombré en las uñas con esponja o pincel, difuminado de dos colores y trucos para que quede suave. Eleva Nails.",
  "h1":"Uñas degradado (ombré)","lead":"El degradado funde dos colores en uno. Es la base de las baby boomer y de mil diseños. Te enseñamos la técnica.",
  "callout":"<b>Truco:</b> con esponja de maquillaje difuminas los colores sobre la uña y sellas. En gel, difuminando antes de curar.",
  "sections":[S("Con esponja","<p>Pinta franjas de color en una esponja y estampa varias veces sobre la uña hasta fundir. Sella.</p>"),
   S("En gel","<p>Aplica los colores juntos y difumina con pincel limpio antes de curar.</p>")],
  "related":[("/baby-boomer-unas","baby boomer"),("/nail-art-principiantes","nail art"),("/unas-francesa-paso-a-paso","francesa")],"course":GEN},
 {"grp":"Diseños y tendencias","slug":"unas-navidad","eyebrow":"Temporada","title":"Uñas de Navidad: diseños fáciles y tendencia | Eleva Nails",
  "desc":"Ideas y diseños de uñas de Navidad fáciles: rojos, dorados, copos de nieve y efectos. Inspiración para clientas y profesionales. Eleva Nails.",
  "h1":"Uñas de Navidad","lead":"La Navidad es de las épocas de más reservas del año. Ten preparados diseños que se piden solos y llena la agenda de diciembre.",
  "callout":"<b>Temporada fuerte:</b> planifica los diseños navideños con antelación: rojos, dorados, cromados y detalles.",
  "sections":[S("Diseños que arrasan","<ul><li>Rojo clásico y french roja.</li><li>Dorado y cromado.</li><li>Copos de nieve y detalles 3D.</li></ul>"),
   S("Aprovecha la temporada","<p>Sube ideas en redes semanas antes y abre reservas. <a href='/conseguir-clientas-unas'>Cómo captar clientas</a>.</p>")],
  "related":[("/disenos-unas-2026","tendencias"),("/unas-verano","uñas de verano"),("/nail-art-principiantes","nail art")],"course":GEN},
 {"grp":"Diseños y tendencias","slug":"unas-verano","eyebrow":"Temporada","title":"Uñas de verano: colores y diseños que triunfan | Eleva Nails",
  "desc":"Ideas de uñas de verano: colores vivos, neón, frutas, efecto agua y diseños frescos que más se piden en temporada. Eleva Nails.",
  "h1":"Uñas de verano","lead":"En verano las clientas buscan color y alegría. Prepara una carta de diseños veraniegos y aprovecha el pico de reservas.",
  "callout":"<b>Verano = color:</b> neones, pasteles, frutas y detalles marineros son los más pedidos.",
  "sections":[S("Tendencias de verano","<ul><li>Neón y french de colores.</li><li>Frutas y flores.</li><li>Efecto agua/aura.</li></ul>"),
   S("Saca partido a la temporada","<p>Contenido en redes + promos. <a href='/instagram-para-manicuristas'>Instagram para captar</a>.</p>")],
  "related":[("/unas-navidad","uñas de Navidad"),("/disenos-unas-2026","tendencias"),("/nail-art-principiantes","nail art")],"course":GEN},
 # ---- Formas y estilos ----
 {"grp":"Formas y estilos","slug":"formas-de-unas","eyebrow":"Estilo","title":"Formas de uñas: cuál elegir según tu mano | Eleva Nails",
  "desc":"Guía de formas de uñas (almendra, coffin, stiletto, cuadrada, ovalada): ventajas de cada una y cuál favorece según el dedo y el estilo de vida.",
  "h1":"Formas de uñas: cuál elegir","lead":"La forma cambia por completo el resultado. Te explicamos las principales y cuál favorece a cada mano y estilo de vida.",
  "callout":"<b>Regla:</b> manos pequeñas → almendra/ovalada alargan; vida activa → cuadrada corta o redonda aguantan mejor.",
  "sections":[S("Las formas principales","<ul><li>Ovalada y redonda: naturales y resistentes.</li><li>Almendra: alarga y estiliza.</li><li>Cuadrada: clásica y firme.</li><li>Coffin y stiletto: llamativas, para looks fuertes.</li></ul>"),
   S("Cómo aconsejar a la clienta","<p>Ten en cuenta el largo del dedo, la profesión y el mantenimiento que quiere.</p>")],
  "related":[("/unas-almendra","uñas almendra"),("/unas-coffin-bailarina","coffin"),("/unas-cortas-bonitas","uñas cortas")],"course":GEN},
 {"grp":"Formas y estilos","slug":"unas-almendra","eyebrow":"Estilo","title":"Uñas almendra: por qué favorecen y cómo limarlas | Eleva Nails",
  "desc":"Uñas forma almendra: por qué estilizan la mano, cómo limarlas simétricas y para quién son ideales. Guía de Eleva Nails.",
  "h1":"Uñas almendra","lead":"La forma almendra es de las más pedidas: alarga los dedos y estiliza. Te contamos cómo conseguirla simétrica.",
  "callout":"<b>Favorecen a casi todas:</b> alargan la mano y son elegantes sin ser tan extremas como el stiletto.",
  "sections":[S("Cómo limarlas","<p>Marca el centro como punta suave y lima ambos lados en curva simétrica hacia el ápice. Revisa a contraluz.</p>"),
   S("Para quién","<p>Ideales para alargar dedos cortos y para un look sofisticado.</p>")],
  "related":[("/formas-de-unas","formas de uñas"),("/unas-coffin-bailarina","coffin"),("/curso-unas-acrilicas","curso de acrílico")],"course":GEN},
 {"grp":"Formas y estilos","slug":"unas-coffin-bailarina","eyebrow":"Estilo","title":"Uñas coffin (bailarina): qué son y cómo hacerlas | Eleva Nails",
  "desc":"Qué son las uñas coffin o bailarina, cómo limarlas rectas y simétricas y por qué son tendencia. Guía de Eleva Nails.",
  "h1":"Uñas coffin (bailarina)","lead":"La forma coffin (o bailarina) es puro glamour: punta recta y laterales estrechados. Muy tendencia y perfecta para diseños.",
  "callout":"<b>Necesita largo:</b> la coffin luce con uñas medias-largas, normalmente esculpidas en gel o acrílico.",
  "sections":[S("Cómo se hace","<p>Se esculpe el largo, se estrechan los laterales y se corta la punta recta, dejando la clásica forma de ataúd.</p>"),
   S("Ideal para","<p>Nail art elaborado y looks llamativos. Requiere buena estructura para que no se rompa.</p>")],
  "related":[("/formas-de-unas","formas de uñas"),("/unas-almendra","almendra"),("/curso-unas-acrilicas","curso de acrílico")],"course":GEN},
 {"grp":"Formas y estilos","slug":"unas-cortas-bonitas","eyebrow":"Estilo","title":"Uñas cortas bonitas: diseños y por qué elegirlas | Eleva Nails",
  "desc":"Ideas de uñas cortas bonitas: diseños elegantes, prácticos y favorecedores para el día a día. Demuestra que corto también es tendencia.",
  "h1":"Uñas cortas bonitas","lead":"Las uñas cortas están más de moda que nunca: cómodas, elegantes y perfectas para el día a día. Aquí tienes ideas que enamoran.",
  "callout":"<b>Corto no es aburrido:</b> nude, micro-french, mini nail art y cromados quedan preciosos en corto.",
  "sections":[S("Diseños que favorecen","<ul><li>Nude y lechosos.</li><li>Micro-french.</li><li>Detalles minimalistas.</li></ul>"),
   S("Ventajas","<p>Prácticas, resistentes y aptas para cualquier profesión. Muy pedidas.</p>")],
  "related":[("/formas-de-unas","formas de uñas"),("/disenos-unas-2026","tendencias"),("/nail-art-principiantes","nail art")],"course":GEN},
 # ---- Problemas y soluciones ----
 {"grp":"Problemas y soluciones","slug":"unas-debiles-que-se-rompen","eyebrow":"Cuidados","title":"Uñas débiles que se rompen: causas y soluciones | Eleva Nails",
  "desc":"Por qué tienes las uñas débiles y quebradizas y cómo fortalecerlas: causas, hábitos, endurecedores y cuándo acudir a un profesional.",
  "h1":"Uñas débiles que se rompen","lead":"Si tus uñas se parten y no crecen, casi siempre hay solución. Repasamos las causas más comunes y cómo fortalecerlas.",
  "callout":"<b>Ojo:</b> muchas veces la causa es retirar mal el gel/acrílico o la falta de hidratación, no algo interno.",
  "sections":[S("Causas frecuentes","<ul><li>Retirar mal el producto.</li><li>Falta de hidratación.</li><li>Químicos sin guantes.</li><li>Carencias nutricionales.</li></ul>"),
   S("Cómo fortalecerlas","<p>Aceite de cutícula, endurecedor, guantes y una retirada correcta. <a href='/cuidado-unas-sanas'>Guía de uñas sanas</a>.</p>")],
  "related":[("/cuidado-unas-sanas","uñas sanas"),("/como-quitar-unas-gel-casa","quitar gel bien"),("/unas-estriadas-causas","uñas estriadas")],"course":GEN},
 {"grp":"Problemas y soluciones","slug":"unas-estriadas-causas","eyebrow":"Cuidados","title":"Uñas estriadas: causas y cómo disimularlas | Eleva Nails",
  "desc":"Por qué salen estrías en las uñas (verticales u horizontales), qué significan y cómo disimularlas con nivelación. Guía de Eleva Nails.",
  "h1":"Uñas estriadas: causas y soluciones","lead":"Las estrías en las uñas son muy comunes. Te explicamos por qué aparecen y cómo dejar la superficie lisa.",
  "callout":"<b>Dato:</b> las estrías verticales suelen ser normales con la edad; las horizontales pueden indicar un parón del crecimiento.",
  "sections":[S("Por qué aparecen","<p>Edad, deshidratación, golpes o retirada agresiva del producto. Las horizontales conviene vigilarlas.</p>"),
   S("Cómo disimularlas","<p>Con una buena nivelación (rubber base) la superficie queda lisa. <a href='/rubber-base-que-es'>Qué es la rubber base</a>.</p>")],
  "related":[("/rubber-base-que-es","rubber base"),("/cuidado-unas-sanas","uñas sanas"),("/unas-debiles-que-se-rompen","uñas débiles")],"course":GEN},
 {"grp":"Problemas y soluciones","slug":"padrastros-cuticula","eyebrow":"Cuidados","title":"Padrastros y cutícula: cómo cuidarlos bien | Eleva Nails",
  "desc":"Qué son los padrastros, por qué salen y cómo cuidar la cutícula correctamente sin dañarla. Consejos profesionales de Eleva Nails.",
  "h1":"Padrastros y cutícula","lead":"Los padrastros son molestos y afean la manicura. Te explicamos cómo cuidarlos y tratar la cutícula sin hacer daño.",
  "callout":"<b>Nunca arranques un padrastro:</b> córtalo con alicate limpio e hidrata. La cutícula se empuja, no se corta en exceso.",
  "sections":[S("Por qué salen","<p>Sequedad y manipulación. La hidratación diaria es la mejor prevención.</p>"),
   S("Cuidado correcto","<p>Empuje suave, corte solo del padrastro y aceite de cutícula a diario.</p>")],
  "related":[("/cuidado-unas-sanas","uñas sanas"),("/higiene-esterilizacion-manicura","higiene"),("/errores-comunes-manicura","errores comunes")],"course":GEN},
 {"grp":"Problemas y soluciones","slug":"alergia-gel-acrilico","eyebrow":"Cuidados","title":"Alergia al gel o acrílico: síntomas y cómo evitarla | Eleva Nails",
  "desc":"Qué es la alergia a los acrilatos (gel/acrílico), síntomas, por qué aparece y cómo prevenirla con buena técnica y bioseguridad. Eleva Nails.",
  "h1":"Alergia al gel o acrílico","lead":"La alergia a los acrilatos es cada vez más común, sobre todo por mala técnica. Te contamos síntomas y cómo prevenirla.",
  "callout":"<b>Importante:</b> suele deberse al contacto del producto con la piel y al curado insuficiente. La técnica correcta la previene.",
  "sections":[S("Síntomas","<p>Picor, enrojecimiento, hinchazón o descamación alrededor de la uña. Si aparece, consulta a un profesional sanitario.</p>"),
   S("Cómo prevenirla","<ul><li>No tocar la piel con el producto.</li><li>Curado completo.</li><li>Guantes y buena higiene.</li></ul><p><a href='/higiene-esterilizacion-manicura'>Más sobre bioseguridad</a>.</p>")],
  "related":[("/higiene-esterilizacion-manicura","higiene"),("/errores-comunes-manicura","errores comunes"),("/como-ser-manicurista","cómo ser manicurista")],"course":GEN},
 # ---- Material y herramientas ----
 {"grp":"Material y herramientas","slug":"lampara-uv-vs-led","eyebrow":"Material","title":"Lámpara UV vs LED para uñas: cuál elegir | Eleva Nails",
  "desc":"Diferencias entre lámpara UV y LED para uñas: velocidad de curado, compatibilidad con productos, precio y cuál comprar. Guía de Eleva Nails.",
  "h1":"Lámpara UV vs LED: cuál elegir","lead":"La lámpara es una de tus herramientas clave. Te explicamos las diferencias entre UV y LED para que aciertes en la compra.",
  "callout":"<b>Hoy:</b> las lámparas LED (o híbridas UV/LED) son el estándar: curan más rápido y valen para casi todos los productos.",
  "sections":[S("Diferencias","<ul><li>LED: curado rápido, mayor vida útil.</li><li>UV: más lenta, bombillas a reemplazar.</li><li>Híbrida: compatible con todo.</li></ul>"),
   S("Cuál comprar","<p>Una LED/híbrida de potencia suficiente. Revisa que sea compatible con tus geles.</p>")],
  "related":[("/kit-unas-principiantes","kit para empezar"),("/torno-unas-cual-comprar","qué torno comprar"),("/como-hacer-unas-de-gel","uñas de gel")],"course":GEN},
 {"grp":"Material y herramientas","slug":"torno-unas-cual-comprar","eyebrow":"Material","title":"Torno de uñas: cuál comprar y cómo usarlo | Eleva Nails",
  "desc":"Guía para comprar un torno de uñas: potencia, RPM, fresas y cuál elegir siendo principiante o profesional. Uso seguro. Eleva Nails.",
  "h1":"Torno de uñas: cuál comprar","lead":"El torno ahorra tiempo y mejora el acabado, pero hay que elegirlo y usarlo bien. Te ayudamos a acertar.",
  "callout":"<b>Para empezar:</b> un torno con control de velocidad y sentido de giro, y fresas de calidad. La potencia importa más que las RPM máximas.",
  "sections":[S("Qué mirar","<ul><li>Control de velocidad y reversa.</li><li>Buen par (torque), no solo RPM.</li><li>Fresas adecuadas por uso.</li></ul>"),
   S("Uso seguro","<p>Baja velocidad, sin presionar. <a href='/nivelacion-unas-torno'>Cómo usar el torno sin dañar</a>.</p>")],
  "related":[("/nivelacion-unas-torno","nivelación y torno"),("/lampara-uv-vs-led","UV vs LED"),("/kit-unas-principiantes","kit")],"course":GEN},
 {"grp":"Material y herramientas","slug":"mejores-geles-marcas","eyebrow":"Material","title":"Cómo elegir buenos geles y esmaltes (marcas) | Eleva Nails",
  "desc":"Cómo elegir geles y esmaltes de calidad: qué mirar en un buen producto, densidades, pigmentación y por qué el material influye en la duración.",
  "h1":"Cómo elegir buenos geles y esmaltes","lead":"El material influye muchísimo en el resultado y la duración. En vez de un ranking de marcas, te damos criterios objetivos para elegir bien.",
  "callout":"<b>Regla:</b> un buen gel es pigmentado, de densidad estable y compatible con tu lámpara. Lo barato suele salir caro en repasos.",
  "sections":[S("Qué mirar en un buen producto","<ul><li>Pigmentación (cubre en pocas capas).</li><li>Densidad manejable.</li><li>Compatibilidad con tu lámpara.</li><li>Buena adhesión y curado.</li></ul>"),
   S("Profesional vs barato","<p>Te lo comparamos en <a href='/kit-profesional-vs-barato'>kit profesional vs barato</a>.</p>")],
  "related":[("/kit-profesional-vs-barato","profesional vs barato"),("/kit-unas-principiantes","kit"),("/semipermanente-que-dure","semi que dura")],"course":GEN},
 {"grp":"Material y herramientas","slug":"kit-profesional-vs-barato","eyebrow":"Material","title":"Kit de uñas profesional vs barato: ¿merece la pena? | Eleva Nails",
  "desc":"¿Compensa un kit de uñas barato? Comparamos material profesional vs económico en resultado, duración y rentabilidad. Guía de Eleva Nails.",
  "h1":"Kit profesional vs barato","lead":"Cuando empiezas tienta ahorrar en material, pero no siempre sale a cuenta. Te ayudamos a decidir dónde invertir y dónde no.",
  "callout":"<b>Consejo:</b> ahorra en lo accesorio, invierte en lámpara, torno y geles. Un mal material te hace repetir trabajos (y perder clientas).",
  "sections":[S("Dónde NO ahorrar","<p>Lámpara, torno y geles/base. Son la diferencia entre que dure o se levante.</p>"),
   S("Dónde sí puedes ajustar","<p>Decoración, pinceles secundarios y consumibles.</p>")],
  "related":[("/kit-unas-principiantes","kit para empezar"),("/mejores-geles-marcas","elegir geles"),("/lampara-uv-vs-led","UV vs LED")],"course":GEN},
 # ---- Más de negocio ----
 {"grp":"Más de negocio","slug":"seguro-responsabilidad-civil-manicurista","eyebrow":"Negocio","title":"Seguro de responsabilidad civil para manicuristas | Eleva Nails",
  "desc":"Qué es y por qué necesitas un seguro de responsabilidad civil como manicurista, qué cubre y cuándo contratarlo. Guía práctica de Eleva Nails.",
  "h1":"Seguro de responsabilidad civil para manicuristas","lead":"Trabajar con clientas implica riesgos (una quemadura, una infección, un daño). Un seguro de RC te protege el negocio. Te explicamos lo básico.",
  "callout":"<b>Recomendado:</b> si trabajas por tu cuenta (local, casa o domicilio), un seguro de responsabilidad civil te cubre ante reclamaciones.",
  "sections":[S("Qué cubre","<p>Daños a terceros derivados de tu actividad: reacciones, lesiones o perjuicios a la clienta.</p>"),
   S("Cuándo contratarlo","<p>En cuanto empieces a cobrar. Es barato comparado con el riesgo. Va de la mano del <a href='/autonoma-manicurista'>alta de autónoma</a>.</p>")],
  "related":[("/autonoma-manicurista","hacerte autónoma"),("/abrir-salon-unas","abrir salón"),("/montar-negocio-unas","montar negocio")],"course":NEG},
 {"grp":"Más de negocio","slug":"facturar-manicurista-iva","eyebrow":"Negocio","title":"Facturar como manicurista: IVA y facturas básico | Eleva Nails",
  "desc":"Cómo facturar siendo manicurista autónoma: IVA aplicable, cómo hacer una factura y llevar las cuentas al día sin líos. Guía de Eleva Nails.",
  "h1":"Facturar como manicurista: IVA y facturas","lead":"Cuando trabajas por tu cuenta toca facturar y declarar. No es tan complicado; te damos las nociones básicas para no perderte.",
  "callout":"<b>Aviso:</b> esto es orientativo. Para tu caso concreto consulta con una gestoría; cada situación tiene sus particularidades.",
  "sections":[S("Lo básico","<ul><li>Emite factura por tus servicios.</li><li>Aplica el IVA que corresponda a tu actividad.</li><li>Guarda ingresos y gastos para las declaraciones trimestrales.</li></ul>"),
   S("Hazlo fácil","<p>Una app de facturación o una gestoría te ahorran tiempo. Céntrate en captar y hacer uñas.</p>")],
  "related":[("/autonoma-manicurista","hacerte autónoma"),("/cuanto-cobrar-por-unas","cuánto cobrar"),("/montar-negocio-unas","montar negocio")],"course":NEG},
 {"grp":"Más de negocio","slug":"portfolio-manicurista","eyebrow":"Negocio","title":"Cómo hacer un portfolio de uñas que venda | Eleva Nails",
  "desc":"Cómo crear un portfolio de manicura que capte clientas: fotos, organización, qué incluir y cómo usarlo en redes y con clientas. Eleva Nails.",
  "h1":"Cómo hacer un portfolio que venda","lead":"Tu portfolio es tu mejor vendedor. Unas buenas fotos de tus trabajos convencen más que mil palabras. Te enseñamos a montarlo.",
  "callout":"<b>Clave:</b> fotos con buena luz, fondo limpio y variedad de estilos. La calidad de la foto vende la calidad del trabajo.",
  "sections":[S("Qué incluir","<ul><li>Variedad de técnicas y diseños.</li><li>Antes/después.</li><li>Detalle y foto general.</li></ul>"),
   S("Dónde usarlo","<p>Instagram, WhatsApp Business y un álbum físico en cabina. <a href='/instagram-para-manicuristas'>Instagram para captar</a>.</p>")],
  "related":[("/instagram-para-manicuristas","Instagram"),("/conseguir-clientas-unas","captar clientas"),("/fidelizar-clientas-unas","fidelizar")],"course":NEG},
 {"grp":"Más de negocio","slug":"ser-formadora-unas","eyebrow":"Negocio","title":"Cómo ser formadora de uñas: la salida más rentable | Eleva Nails",
  "desc":"Cómo convertirte en formadora de uñas: qué necesitas, cómo empezar a dar cursos y por qué es una de las salidas más rentables del sector.",
  "h1":"Cómo ser formadora de uñas","lead":"Formar a otras es de las salidas más rentables y con más proyección. Si dominas la técnica, enseñar multiplica tus ingresos.",
  "callout":"<b>Requisito:</b> dominar la técnica y saber transmitirla. La experiencia real y un buen portfolio son tu aval.",
  "sections":[S("Qué necesitas","<ul><li>Nivel técnico alto y experiencia.</li><li>Capacidad de enseñar y estructurar.</li><li>Portfolio y marca personal.</li></ul>"),
   S("Cómo empezar","<p>Talleres presenciales, cursos online o colaboraciones con academias. <a href='/salidas-laborales-unas'>Ver todas las salidas</a>.</p>")],
  "related":[("/salidas-laborales-unas","salidas laborales"),("/montar-negocio-unas","montar negocio"),("/como-ser-manicurista","cómo ser manicurista")],"course":NEG},
]

# ---- Ciudades extra ----
CIUDADES2=[("malaga","Málaga"),("zaragoza","Zaragoza"),("bilbao","Bilbao"),("murcia","Murcia")]
for slug_c, city in CIUDADES2:
    B3.append({"grp":"Más ciudades","slug":"curso-unas-"+slug_c,"eyebrow":"Formación · "+city,
      "title":f"Curso de uñas en {city}: formación profesional | Eleva Nails",
      "desc":f"Curso de uñas profesional para {city}: online + prácticas presenciales, titulación adaptada al Certificado de Profesionalidad y kit incluido. Eleva Nails.",
      "h1":f"Curso de uñas en {city}",
      "lead":f"Fórmate como manicurista profesional desde {city} con Eleva Nails: estudia online a tu ritmo y consolida con prácticas presenciales, con titulación y kit incluido.",
      "callout":f"<b>Para {city}:</b> formación mixta (online + prácticas), titulación adaptada al Certificado de Profesionalidad y bolsa de trabajo.",
      "sections":[S("Cómo es la formación","<p>Online a tu ritmo + prácticas presenciales, con kit profesional y soporte.</p>"),
        (f"Salidas en {city}","<p>Trabaja en salones o monta tu negocio. <a href='/salidas-laborales-unas'>Ver salidas</a>.</p>"),
        ("¿Cuánto se gana?","<p>900-1.500 €/mes por cuenta ajena; hasta 2.500-3.000 € como autónoma. <a href='/'>Calcula tu caso</a>.</p>")],
      "related":[("/como-ser-manicurista","cómo ser manicurista"),("/","cuánto se gana"),("/que-curso-de-unas-necesitas","qué curso necesitas")],"course":GEN})

for a in B3:
    a.setdefault('recap', None)
    open(os.path.join(OUT, a['slug']+'.html'),'w',encoding='utf-8').write(g.build(a))
print("Tanda 3:", len(B3), "artículos")

# ---- Insertar nuevos grupos en la portada del blog ----
from collections import OrderedDict
groups=OrderedDict()
for a in B3:
    groups.setdefault(a['grp'], []).append(a)
blocks=""
for gt, arts in groups.items():
    blocks += "  <h2>%s</h2>\n  <div class=\"bloglist\">\n" % gt
    for a in arts:
        href = "/"+a['slug']
        kicker = a['eyebrow'].split('·')[0].strip()
        desc = a['lead'][:90].rsplit(' ',1)[0]+"…"
        blocks += '    <a class="bcard" href="%s"><span class="bk">%s</span><h3>%s</h3><p>%s</p></a>\n' % (href, kicker, a['h1'], desc)
    blocks += "  </div>\n"

bp=os.path.join(OUT,'blog.html')
html=open(bp,encoding='utf-8').read()
if 'gen_batch3' not in html and 'Diseños y tendencias' not in html:
    html=html.replace('  <p class="foot">', blocks+'  <p class="foot">',1)
    open(bp,'w',encoding='utf-8').write(html)
    print("Portada actualizada con", len(B3), "tarjetas nuevas")
else:
    print("Portada ya tenía la tanda 3 (no se duplica)")
