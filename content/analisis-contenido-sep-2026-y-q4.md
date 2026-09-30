# Contenido de Qualivo: análisis de septiembre y planteamiento del trimestre

> 30-sep-2026. El agente de contenido lo escribe a petición de Maikel.
> Cubre lo que ha hecho contenido desde el 21-sep (el día que arranca el rol
> de Head of Content), las conclusiones y la propuesta para octubre a
> diciembre. Se apoya en el plan de octubre (`content/plan-octubre-2026.md`)
> y no lo sustituye.

## 1. Qué hemos hecho (21 al 30-sep)

| Qué | Cantidad | Estado |
|---|---|---|
| Artículos nuevos en el blog | 7: presupuestos sin respuesta, cliente que no se presenta, qué poner para atraer clientes, coste por lead, formulario o landing, «ahora no es el momento», primera reunión | Publicados |
| Artículos antiguos reorientados al diagnóstico | 7: auditoría, seguimiento comercial, leads pero no ventas, cómo captar clientes, captación de leads, embudo, cliente ideal B2B | Publicados |
| Carruseles en Instagram | 2: «Casi 7×» (22-sep) y «Te han dado plantón» (24-sep) | Publicados con el ok de Maikel |
| Borradores de LinkedIn e Instagram | Unos 10, con imagen y ficha | **Sin publicar** (pausa de redes) |
| Newsletter de plantones | 1, con plantilla en GHL | **Sin enviar** (falta el ok y el DNS) |
| Nurturing de formación | 6 correos maquetados | **Apagado** (falta el ok, el vídeo y el DNS) |
| Guía de plantones por sector | 1 | Solo se entrega a mano |
| Revisiones del Master Reviewer | 8 informes, una por día | Todas aplicadas |
| Plan de octubre | 1 | En el repositorio |

Otra sesión ha producido en paralelo, sobre todo el 29 y el 30-sep:
- el calendario de octubre;
- tres carruseles, guiones de voz y anuncios con IA;
- correos de la semana;
- un simulador del embudo como imán de leads.

## 2. Conclusiones

### 2.1 Producimos mucho más de lo que sale

Casi todo lo que no es blog está parado. Hay unos 10 borradores de redes, una
newsletter, 6 correos de nurturing y otra tanda de carruseles de la otra
sesión esperando un ok, el fin de la pausa o el arreglo del DNS. El contenido
que no sale no hace nada. **Ahora mismo el cuello de botella de contenido no
es producir. Es distribuir.**

### 2.2 No sabemos si el contenido trae clientes

- Los botones del blog llevan a `/diagnostico/` **sin UTM**. El formulario
  guarda el UTM (`api/diagnostico.js`), pero el blog no lo manda, así que un
  lead que viene de un artículo no se distingue de uno directo.
- No hay dato de Search Console posterior al baseline del 27-ago.
- La newsletter y el nurturing aún no han salido, así que no hay aperturas ni
  respuestas.

Resultado: hoy no podemos atribuir **ni un lead ni una reunión** al
contenido. No es que no funcione. Es que no lo medimos.

### 2.3 Lo que mejor funciona sale de la operación real

Las piezas con más fuerza cuentan algo que pasó en Qualivo esa semana:
- los plantones;
- el formulario con precio;
- las objeciones de las reuniones;
- la automatización que falló en silencio;
- las reuniones de 15 minutos que se alargaban.

Son difíciles de copiar y hablan del problema del cliente con pruebas. Los
dos carruseles que Maikel eligió publicar también salen de ahí.

### 2.4 La calidad a la primera es baja y el coste de corregir, alto

- Las notas del revisor van de 6 a 7 en casi todo, con un 4 el 30-sep y un 8
  en las reorientaciones.
- Ninguna pieza nueva ha salido limpia a la primera: cada una tenía entre 3 y
  13 fallos críticos.
- Casi siempre son del mismo tipo:
  - frases que la fuente no dice («siempre», «casi siempre», causas
    supuestas);
  - la construcción «no es X, es Y»;
  - comportamientos de Maikel inventados.

**Lección:** escribir pegado a la fuente, con menos afirmaciones y más cortas.

### 2.5 Hemos publicado errores por ir más rápido que la operación

- **Formación, 5 citas y no 4.** Se corrigió después de publicar.
- **El formulario con precio.** El artículo contaba el experimento como si
  durara siete días, y se paró al día siguiente. Corregido el 29-sep.
- **La tasa de plantones propia** («5 de 9», «9 citas, 5 plantones») sigue
  publicada en tres artículos, el índice del blog y llms.txt, contra la
  regla de Maikel.

**Lección:** no publicar resultados de un experimento que sigue abierto, y
comprobar cada cifra contra el detalle, no contra el resumen.

### 2.6 Dos sesiones de contenido y reglas que chocan

Hay dos sesiones escribiendo contenido a la vez, y hay reglas que se
contradicen entre documentos:
- resultados de clientes en redes;
- Maikel a cámara o no;
- el precio en el contenido;
- la tasa de plantones.

Así se duplica trabajo y aparecen piezas que luego hay que retirar.

### 2.7 Lo que sí ha quedado construido y sirve para el trimestre

- Molde visual de redes y molde de correo seguro para cualquier gestor de
  correo, con la marca de qualivo.io.
- Plantilla de artículo con schema, FAQ y registro de keywords.
- Revisión diaria con el Master Reviewer.
- Guía de voz afinada, sin lemas de máquina.
- Siete artículos que forman un recorrido: captación → coste → cita → reunión → cierre.

## 3. Cómo plantearía el trimestre (octubre a diciembre)

### Principio

**Menos piezas, más distribución y medición.** El contenido trabaja para el
embudo del plan de octubre: cada pieza ataca la fuga de esa semana y se mide
por leads y reuniones, no por publicaciones.

### Cinco cambios desde ya

1. **Medir el contenido (octubre, semana 0).**
   - UTM en todos los botones del blog (`utm_source=blog`,
     `utm_campaign=<artículo>`), en la newsletter y en el nurturing.
   - Una pregunta en el formulario: «¿Cómo nos conociste?».
   - Search Console, una vez al mes contra el baseline del 27-ago.
   - Es poco trabajo y en mi terreno. Lo hago en cuanto Maikel lo apruebe.
2. **Distribuir lo que ya existe antes de producir más.**
   - Levantar la pausa de LinkedIn con dos posts por semana: hay material para
     un mes.
   - Arreglar el DNS y encender el nurturing.
   - Enviar la newsletter de plantones a los 22 contactos con permiso.
3. **Bajar de 5 a 3 artículos por semana.** Los otros dos días de la rutina
   van a distribuir (adaptar el artículo a LinkedIn, al correo y al argumento
   comercial) y a medir.
4. **Una sola fuente de reglas y un solo responsable de contenido.**
   - Juntar en un documento las reglas que hoy están repartidas: precio,
     clientes, cámara, plantones, WhatsApp y tono.
   - Decidir quién lleva qué entre las dos sesiones. Mi propuesta: blog,
     redes, newsletter y argumentos comerciales, en una sola.
5. **Nada de cifras de experimentos abiertos ni de tasas internas.**
   - Se cuenta cuando el experimento termina, salga bien o mal.
   - La tasa de plantones se quita hoy.

### Mes a mes

| Mes | Foco de contenido | Salida |
|---|---|---|
| **Octubre** · medir y distribuir | UTM y «¿cómo nos conociste?». LinkedIn en marcha. Nurturing encendido. Cada semana, piezas sobre su fuga (plantones → calidad → respuesta → cierre) | Primer dato de leads y reuniones que vienen del contenido. Reglas unificadas |
| **Noviembre** · prueba social | Pedir permiso a los primeros clientes para contar su caso (el arranque del 13-oct, y los clientes de septiembre si se confirman). Newsletter quincenal a la base con permiso. Los ganchos que funcionen en anuncios pasan a orgánico | 2 casos autorizados. Newsletter en marcha. Primer artículo que trae leads medidos |
| **Diciembre** · activo de fondo | Serie «lo que aprendimos agentizando Qualivo» (el trimestre contado con datos cerrados). El simulador del embudo, como llamada a la acción principal. Plan editorial de Q1 con lo que haya funcionado | Un imán de leads que funciona. Plan de Q1 basado en datos |

### Cómo sabremos si funciona

| Métrica | Cuándo |
|---|---|
| Leads atribuidos al contenido (UTM + «¿cómo nos conociste?») | Desde octubre, cada viernes en el cuadro de mando |
| Reuniones celebradas con leads que venían del contenido | Cada viernes |
| Respuestas a la newsletter y al nurturing | Desde que salgan |
| Comentarios en LinkedIn de gente del perfil ideal | Cada semana |
| Keywords del blog con impresiones (Search Console) | Una vez al mes |

Los objetivos con número se fijan en noviembre, con el dato de octubre
delante. Ponerlos hoy sería inventarlos.

## 4. Lo que necesito de Maikel para arrancar

1. **Cuatro reglas por decidir:**
   - resultados de clientes en redes, sí o no;
   - cámara en octubre, sí o no;
   - precio en el contenido;
   - quitar hoy la tasa de plantones.
2. **Levantar la pausa de LinkedIn:** dos posts por semana.
3. **DNS de qualivo.io:** el SPF con Google y el DMARC. Son diez minutos y
   desbloquean todos los correos.
4. **Responsable de contenido:** una sola sesión, o un reparto claro entre
   las dos.
5. **Ok a los UTM del blog y a la pregunta «¿cómo nos conociste?».**
