# Playbook · Cualificación de leads: formulario, scoring y clasificación automática

Escrito el 13-oct-2026 desde la implantación en **EAC (Escola Aeronàutica de
Catalunya)**. Hermano del playbook `dashboard-comercial/`: ese mide el embudo,
este decide a quién se llama primero.

Lo importante de este playbook no son los pesos. Es el **método para no
construir un scoring que miente**, porque la v1 de EAC mentía: los leads que
acababan entrevistándose puntuaban **menos** que los que no.

---

## 1. Antes de diseñar nada: falsificar el modelo que ya existe

El orden correcto es medir, no proponer. Para cada pregunta que el formulario ya
hace, calcular la tasa de conversión real a **entrevista realizada** (no a cita
agendada: la cita la agenda cualquiera).

```
por cada respuesta posible:
   leads que la dieron · cuántos llegaron a entrevista · %
```

En EAC, con 428 leads de Meta:

| Pregunta | Resultado | Decisión |
|---|---|---|
| ¿Sabes nadar? | «No» / «puedo aprender» → **0 entrevistas de 88 leads** | el filtro más potente que había |
| Nivel de estudios | Bachillerato convertía **peor** que ESO | **fuera** |
| Edad | ni llegaba mapeada desde Meta | **fuera** del scoring |
| Nivel de inglés | señal débil, dirección correcta | se queda con poco peso |
| **Responder al WhatsApp** | **15,0 % contra 6,4 % · ×2,3** | la señal más fuerte, y no es una pregunta |

**La lección transferible:** lo que el lead *declara* predice mucho peor que lo
que el lead *hace*. Antes de puntuar intenciones declaradas, buscar una señal de
comportamiento (contesta un mensaje, abre un email, entra dos veces en la web).

> Si el cliente no tiene histórico suficiente para medir, el scoring sale como
> hipótesis y se marca como tal. Lo que no vale es presentarlo como si estuviera
> validado.

---

## 2. Diseño del formulario

### Regla de oro: cada campo cuesta leads

El CPL de la campaña buena de EAC es €2,22. Cada pregunta extra lo sube. Así que
una pregunta solo entra si **descarta a quien nunca iba a comprar** o **predice
que la persona aparecerá**. Lo demás se pregunta en la llamada, que es gratis.

EAC acabó en 8 campos, de los que 3 son de contacto.

### Las tres preguntas que casi nadie hace y casi siempre valen

1. **¿Dónde vives?** — si la formación es presencial. En EAC el 13 % de los leads
   eran de fuera del país para un curso en Barcelona.
2. **Formato de la entrevista, con la opción online primera y por defecto** —
   ataca el plantón directamente. En EAC online plantaba al 44 % y presencial al
   74 %.
3. **¿Cuándo quieres empezar?** — el mejor proxy de intención que existe, y
   separa «llamada urgente» de «secuencia de email». Tratarlos igual quema
   agenda comercial.

### Versión corta para formulario instantáneo de Meta

Ahí cada pregunta pesa el doble en el CPL: contacto + el filtro duro +
residencia + cuándo empezar. El resto se pregunta al agendar.

---

## 3. La trampa que nos costó 51 contactos

**Las opciones del formulario tienen que ser carácter a carácter las del
desplegable del CRM.**

Un campo `SINGLE_OPTIONS` de GoHighLevel admite solo sus valores exactos. Si el
formulario manda `caliente` y el desplegable dice `Caliente`, GHL **acepta la
escritura** y guarda un valor que su propio desplegable no reconoce. Resultado:
ninguna lista inteligente lo ve, ninguna automatización se dispara, y el scoring
lo lee vacío. Silencioso al 100 %.

En EAC esto pasaba en tres sitios a la vez:

| Campo | El formulario mandaba | El CRM esperaba |
|---|---|---|
| Temperatura | `caliente` `templado` `frio` | `Caliente` `Tibio` `Frio` `Congelado` |
| Edad | `16-25` `26-35` `36-45` | `Menor de 18` `18-21` `22-30` `31-40` `Mayor de 40` |
| Inglés | `Si` `No, pero puedo aprender` | `A1-A2` `B1` `B2` `C1 o superior` |

Y `templado` no existía como opción: 29 contactos con el campo inservible.

**Comprobación obligatoria antes de dar nada por hecho:**

```js
// leer las opciones reales del CRM y comparar con las del formulario
const campos = await GET(`/locations/${LOC}/customFields`);
// ojo: en LECTURA se llama picklistOptions, en ESCRITURA se llama options.
// Mandar picklistOptions en un PUT devuelve 422.
```

Si el cliente quiere una redacción más amable («Alto (B2 o superior)»), se
cambian **las opciones del CRM**, nunca las del formulario. En ese orden.

---

## 4. La clasificación

Cuatro clases, con una acción comercial distinta cada una. Sin acción distinta,
la clase no sirve de nada.

| Clase | Puntos | Acción |
|---|---|---|
| **A** | 75-100 | Llamada inmediata + tarea asignada |
| **B** | 50-74 | Contactar el mismo día |
| **C** | 25-49 | Secuencia de nutrición |
| **D** | 0-24 | Información automatizada |

**Truco de implantación:** si el CRM ya tiene un desplegable de temperatura con
cuatro valores (`Caliente` `Tibio` `Frio` `Congelado`), mapear A/B/C/D uno a uno
contra ellos. No hace falta campo nuevo y las automatizaciones que ya existen
siguen funcionando.

### Dos defectos estructurales que hay que tapar siempre

**a) El techo por debajo del umbral.** Sumar los máximos de todos los criterios
y comprobar que se puede llegar al umbral de la clase A. Si el máximo posible es
70 y la clase A empieza en 75, **nadie será nunca clase A** y nadie lo notará
durante semanas. Nos pasó en EAC, en nuestra propia reconstrucción, después de
haber criticado el mismo fallo en la v1.

```
assert(sumaDeMaximos >= umbralClaseA)
```

**b) El lead al que nadie preguntó.** Las preguntas nuevas solo existen en el
formulario nuevo. Un lead del formulario viejo las deja vacías, saca 0 puntos y
cae a la clase peor. En EAC eran ~600 leads al mes marcados como basura por una
pregunta que no se les hizo.

Solución: si faltan las respuestas clave, puntuar con el **modelo medido**
(comportamiento, teléfono, canal) partiendo de la mitad de la escala, y etiquetar
`sin-formulario` para saber después qué modelo puntuó a quién.

### El descalificador duro va aparte de la puntuación

Si una respuesta significa «esta persona no puede comprar el producto», no es un
criterio de −10 puntos: es un descalificador. En EAC, quien no sabe nadar y
quiere matricularse ya saca **88 puntos = clase A**, y de 88 leads que no saben
nadar **0 llegaron a entrevista**.

Pero si el modelo está pactado con el cliente, **no se toca su puntuación**: se
añade una etiqueta (`req-nadar-no`) y un aviso al principio de la tarea de
llamada. Se le enseña el dato y decide él si quiere que tope.

---

## 5. Montarlo sin depender del CRM

Los workflows del CRM se rompen, se desactivan o nunca se crean. En EAC el
workflow que debía mandar los leads al agente de llamadas **no existía** y nadie
se enteró en semanas.

Patrón que funciona: **webhook para el camino rápido + poller para la red de
seguridad.**

| Pieza | Cada | Qué hace |
|---|---|---|
| Webhook de precalificación | al instante | puntúa, escribe campos, mueve etapa, crea tarea |
| Poller de scoring | 15 min | recoge los que no tienen puntuación |
| Poller de respuestas | 15 min | detecta quién ha contestado y recalcula |
| Poller de calidad → ads | 30 min | manda a Meta quién agendó y quién se entrevistó |

**Ahorro de peticiones:** colgar la lógica nueva de una llamada que un poller ya
hace, en vez de crear otro workflow. La red de seguridad de la etapa ATO/FD de
EAC se enganchó al poller de CAPI, que ya se traía las oportunidades del
pipeline: cero peticiones extra.

---

## 6. Errores de implantación que ya nos comimos

- **`PUT /contacts/{id}` con `tags` REEMPLAZA el array.** Una prueba borró tres
  etiquetas de un contacto real, una de ellas la que disparaba su secuencia de
  email. Campos por `PUT`, etiquetas por `POST /contacts/{id}/tags`.
- **`contacts/search` va con segundos de retraso** respecto a las escrituras.
  Verificar con un `GET` directo o se concluye que no se escribió nada.
- **`crypto` no existe** en el sandbox del nodo Code de n8n Cloud, ni como
  `require` ni como global. Para hashear (Conversions API) usar el nodo nativo
  `n8n-nodes-base.crypto`.
- **`neverError` enmascara los fallos.** Con él, un email que falla sigue
  marcando el contacto como avisado. Si hay un efecto secundario después de una
  llamada HTTP, poner un nodo que compruebe el `statusCode`.
- **Filtrar por etiqueta de contacto se lleva cosas por delante.** Un contacto
  arrastra `lead-tcp` y `lead-flight-dispatcher` a la vez. Para decidir por
  producto, usar el nombre del trato o el campo de producto, no las etiquetas.
- **Comprobar que el filtro no tiene homónimos.** Un script nuestro cogió una
  campaña pausada con nombre parecido a la activa y habría cambiado el
  presupuesto de la equivocada. Atar por ID y abortar si el filtro no devuelve
  exactamente un resultado.
- **Simular siempre antes de escribir** (`--go` como bandera explícita), y
  guardar el estado previo en un JSON para poder revertir.

---

## 7. Brief para pegar en la sesión del cliente

```
Vamos a montar para <CLIENTE> la cualificación de leads que acabamos de implantar en EAC: formulario único en
todas las campañas, scoring y clasificación automática A/B/C/D. Lee primero
playbooks/cualificacion-leads/README.md del repo qualivo-sys/qualivo, y después
playbooks/dashboard-comercial/README.md para entender cómo se mide el embudo de este cliente.

NO empieces proponiendo pesos. El orden es:

1. FALSIFICAR lo que ya hay. Para cada pregunta que el formulario del cliente ya hace, calcula la conversión
   real a <evento de valor: entrevista / reunión / matrícula>, no a cita agendada. Enséñame la tabla antes de
   diseñar nada. En EAC esto tumbó dos preguntas de cuatro y descubrió que el scenario que había estaba
   invertido.
2. BUSCAR UNA SEÑAL DE COMPORTAMIENTO. Lo declarado predice peor que lo hecho. Mira si responder un mensaje,
   abrir emails o repetir visita correlaciona con el evento de valor. En EAC responder al WhatsApp multiplicaba
   por 2,3.
3. LEER LAS OPCIONES REALES DEL CRM antes de escribir el formulario, y que coincidan carácter a carácter.
   Comprueba también si las que ya existen están desalineadas: en EAC lo estaban en tres campos.
4. DISEÑAR el formulario con el mínimo de campos. Cada campo sube el CPL. Justifica cada pregunta con el dato
   del punto 1 o márcala explícitamente como hipótesis sin histórico.
5. IMPLANTAR con webhook + poller, colgando la lógica nueva de llamadas que ya existan para no gastar
   peticiones de n8n.

Datos del cliente:
- CRM: <GoHighLevel / otro>, location <ID>. Pipeline y etapas: <lista en orden>.
- Campo de temperatura/clasificación si existe, con sus opciones EXACTAS: <lista>.
- Evento de valor que cuenta de verdad: <entrevista realizada / reunión / matrícula>.
- Canales de pago y cuentas: <Meta act_<ID>, Google Ads <id>>.
- Formularios actuales y sus preguntas: <lista>.
- Producto y precio: <…> (importa: el descalificador duro suele venir de un requisito del producto).

Entregables:
1. Tabla de falsificación de las preguntas actuales, con decisión de quitar/mantener para cada una.
2. Formulario nuevo creado en la plataforma, con las opciones alineadas al CRM y verificadas leyendo el CRM.
3. Scoring y clasificación en producción, con: assert de que el techo llega al umbral de la clase A, rama para
   el lead sin formulario nuevo, y descalificador duro como etiqueta aparte de la puntuación.
4. Simulación del modelo sobre los perfiles límite, enseñada antes de activar.
5. Playbook actualizado con lo que cambie para este cliente.

Restricciones: ningún token en el repo (todo por variables de entorno), rama de trabajo propia, simular toda
escritura masiva antes de ejecutarla y guardar el estado previo para revertir.
```

---

## 8. Lo que queda abierto en EAC (no copiar sin comprobar)

- Las tres preguntas nuevas (residencia, cuándo empezar, en qué punto estás)
  **no tienen histórico**: se miden a un mes y entonces se les ponen puntos.
- El modelo pactado permite que un descalificado salga clase A. Está avisado con
  etiqueta, pendiente de que el cliente decida si quiere que tope.
- 51 contactos pendientes de reescritura por el desalineo del desplegable.
