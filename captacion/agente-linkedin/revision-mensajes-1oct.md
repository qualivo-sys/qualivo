# Revisión del agente de LinkedIn · qué está mandando de verdad · 1-oct-2026

Medido en HeyReach el 1-oct a mediodía. **Leídas las 83 conversaciones completas de la campaña
activa y los 377 leads de su lista, uno a uno.** Nada de esto sale de documentos: sale de la API.

Maikel preguntó si los mensajes tenían sentido. **No lo tienen, y el motivo no es el tono: es que
afirman un hecho falso sobre la empresa en la primera frase.**

---

## 1 · Hay una campaña activa que no está en ningún documento

| | |
|---|---|
| Campaña | **`Qualivo · segundo toque LinkedIn`** · id **605109** |
| Estado | **IN_PROGRESS · enviando hoy** |
| Arrancó | 16-sep-2026 16:37 |
| Lista | `Qualivo · segundo toque (ya tocados por email)` · id 943342 · **377 leads** |
| Progreso | 263 en curso · 105 terminados · 9 fallidos |
| Invitaciones | **207 enviadas · 102 aceptadas (49,3%)** |
| Conversaciones abiertas | **83** |
| **Respuestas** | **3 (3,6%)** |
| Reuniones | **0** |
| Hoy 1-oct | 18 invitaciones · 13 mensajes · 1 respuesta |

**Esto cambia el diagnóstico de LinkedIn que hay escrito.** La auditoría del 1-oct concluye *«No
existe ningún pozo de conversaciones calientes en LinkedIn… de LinkedIn no van a salir reuniones esta
semana porque no hay con quién»*. Hay 102 conexiones aceptadas y 83 conversaciones abiertas, y la
campaña mandó 13 mensajes esta mañana. El problema de LinkedIn no es que esté parado: es que está
funcionando y lo que manda está mal.

La secuencia es: ver perfil → +1d invitación **sin nota** (correcto, §13) → +1d `{msg1}` → +4d `{msg2}`.

---

## 2 · El defecto · los 83 mensajes afirman una herramienta o un gasto como hecho

El mensaje 1 es una plantilla con dos huecos (nombre, empresa) y **una premisa afirmada**:

> «{Nombre}, una duda que me ha surgido mirando {Empresa}.
>
> **Con {PREMISA}**, ¿...?
>
> Te lo pregunto porque es precisamente una de las fugas que estamos detectando últimamente.»

Recuento de la premisa **sobre los 377 leads de la lista**, contados uno a uno:

| Premisa afirmada | Leads |
|---|---:|
| **Con HubSpot** | **160** |
| Con Salesforce | 48 |
| Con lo que movéis en Google | 33 |
| Con Pipedrive | 30 |
| Con Odoo | 28 |
| Con Dynamics 365 | 20 |
| Con el píxel de Meta | 20 |
| Con lo que invertís en LinkedIn | 19 |
| Con Zoho CRM | 19 |

**160 de 377, el 42% de la lista, recibe «Con HubSpot».** Que el 42% de las pymes españolas de
11-200 empleados use HubSpot no es creíble como hecho medido. La sonda está marcando cualquier rastro
parecido a HubSpot y el copy lo convierte en una afirmación.

### Esto rompe cuatro reglas escritas, no es cuestión de gusto

- **§19, literal:** *«Está absolutamente prohibido inventar… que utilizan determinado CRM.»* 83 de 83
  mensajes enviados afirman un CRM o un gasto publicitario.
- **§19 otra vez:** *«que viste una campaña»*. «Una duda que me ha surgido mirando {Empresa}» afirma
  una observación que no consta.
- **§20 · no diagnosticar sin datos:** *«es precisamente una de las fugas que estamos detectando
  últimamente»* presenta el diagnóstico como ya hecho.
- **Regla absoluta del Outbound Brain:** *«Nunca transformar una inferencia en un hecho.»*
- **§11, la regla de oro:** *«Si el mensaje podría enviarse cambiando solamente {empresa}, es
  demasiado genérico.»* Es exactamente la construcción: nombre + empresa + un hueco.

Y es **el mismo error del 29-sep a mayor escala.** Entonces se afirmó que unas empresas no usaban
Google Ads porque el tag no salía en el HTML, y lo cargaba Dataslayer por JavaScript. La lección
escrita fue que en la sonda estática *«la ausencia no prueba nada»*. Aquí se ha hecho lo inverso y
peor: **se afirma la presencia**, que es una afirmación positiva sobre la empresa de otro.

---

## 3 · Las 3 respuestas · ninguna contesta la pregunta, dos niegan la premisa

Son las únicas tres respuestas humanas de las 83 conversaciones.

**1 · Rafa Calle · CEO de magnettu** — *«The market's highest ROI tool to engage employees and clients
on LinkedIn»*. Se le mandó «Con lo que invertís en LinkedIn…». Contestó el 1-oct a las 08:27:

> **«Hola Maikel, supongo que es la prospección con IA la que ha sacado la conclusión. No invertimos
> 1€ en LinkedIn»**

La premisa era falsa, y **el destinatario identificó en voz alta que el mensaje lo había generado una
IA**. Es el CEO de una herramienta de LinkedIn con audiencia en LinkedIn.

**2 · Carlos B. · CISO de Vinoselección** — *«No lo llevo yo. Gracias.»* Persona equivocada.

**3 · Mehdi Alaoui · Expense Reduction Analysts** — *«?»* El mensaje no se entendió.

**Cero positivas. Cero reuniones.** HeyReach marca 1 como «interested»; a la vista de las tres, es
una etiqueta mal puesta.

---

## 4 · El caso con nombre · Santiago Noya, y es la fuga del apartado 7 otra vez

Cruzados los 377 leads contra todos los que pidieron parar, escalaron o tienen seguimiento parado,
**hay una sola coincidencia, y es grave**:

| | |
|---|---|
| **18-sep 11:35** · por email, campaña V3 señal HubSpot | *«**No estamos trabajando con Hubspot desde hace meses.** Gracias»* |
| Estado de su seguimiento | **PARADO, A REVISAR** por decisión de Maikel |
| **30-sep 08:40** · por LinkedIn, campaña 605109 | *«Santiago, una duda que me ha surgido mirando DOS ESPACIOS. **Con HubSpot**, ¿tenéis bastante control sobre las oportunidades…?»* |

Nos dijo por escrito que no usan HubSpot. **Doce días después se le afirmó por otro canal que usa
HubSpot.** Y su seguimiento estaba congelado a propósito.

Es la mecánica de María Carrascal con otra forma: **una respuesta en un canal no llegó a la lista del
otro.** No es un riesgo teórico del apartado 7, es un segundo caso con nombre y fecha.

La causa está en el nombre de la lista: **«ya tocados por email»**. Los 377 se eligieron *porque* ya
están en secuencias de email, y no existe nada que lleve el estado de Smartlead a HeyReach. El único
campo común es el dominio.

### Lo que sí funciona, y conviene decirlo

De los 17 que pidieron parar, los 4 que escalaron, las supresiones de RGPD y los dominios de cliente
y ex cliente, **no hay ni uno en esta lista de 377.** La limpieza manual del 1-oct y las exclusiones
de HeyReach (`excludeFromLeadBlacklist`, `excludeFromCompanyBlacklist`, `excludeHasOtherAccConversations`)
están aguantando los casos duros. El agujero no está en los bloqueos: está en las respuestas que no
son bloqueo.

---

## 5 · La lista está fuera del ICP, igual que Q-Flow

El rol §6 prohíbe `sector = X → prospectar` sin FIT. Entre los 83 destinatarios reales:

| Quién | Qué es | Por qué no encaja |
|---|---|---|
| **Jaume Feliu · PymeLegal** | *«Consultor y **Delegado de Protección de Datos** RGPD-LOPDGDD-LSSICE»* | **Mensaje en frío con premisa inventada a un DPO.** Ya tenemos un expediente de un DPO (CCOO, 321728) |
| **Álvaro Ruiz · CustomerTop** | *«Generamos reuniones con decisores»* | Competencia directa en appointment setting |
| **Rafa Calle · magnettu** | SaaS de LinkedIn outreach | Le vendemos outbound a quien lo fabrica |
| Pello Irujo · LAULAGUN BEARINGS | rodamientos industriales | fabricación, ningún motor |
| Txabi Gaztelu · PROQUINORTE | química | fabricación |
| João Curado · Flomics | biotech | — |
| Nacho Mateo · South Summit | eventos / ecosistema startup | — |
| Oscar Fonrodona · Tangelo Games | videojuegos | — |
| Viola De Bellis · VDB Luxury Property | gestión de propiedades de lujo | — |
| Toni Raurich · eBooking.com | viajes online | — |

Es textualmente el fallo de Q-Flow, donde un destinatario escribió *«no tiene nada que ver con mi
actividad… cuida eso»*. La diferencia es que Q-Flow está pausada desde julio y **esto está enviando
hoy**.

---

## 6 · Lo que está en cola si no se para

| | |
|---|---|
| Mensajes 1 ya enviados | 83 |
| **Pendientes en la lista** | **294** |
| De ellos, con «Con HubSpot» preparado | **≈138** |
| Ritmo actual | ~13 mensajes/día |

A ese ritmo son unos 23 días laborables más de lo mismo. Comprobado también: **los 377 tienen `msg1`
y `msg2` rellenos**, así que el `fallbackMessage` genérico de la secuencia no está disparando. Ese
riesgo no existe hoy, pero el fallback está escrito y es peor que el mensaje normal («mirando
vuestra empresa», sin nombre de empresa), así que conviene vaciarlo o arreglarlo.

---

## 7 · Intenté pausarla y no pude

Por el apartado A de la adenda tengo «pausas por stop conditions» sin pedir permiso, y lo consideré
una: se está afirmando algo falso a decisores con nombre, y uno de ellos ya lo ha dicho en público.
**El clasificador de permisos de este entorno bloqueó la llamada** (`pause_campaign` sobre 605109),
así que la campaña sigue activa. No he buscado la vuelta.

**Lo tiene que pausar Maikel**, en HeyReach, campaña `Qualivo · segundo toque LinkedIn`. Es
reversible con `resume_campaign`.

---

## 8 · Qué recomiendo, por orden

1. **Pausar 605109 hoy.** Coste real de pausar: 3 respuestas en 15 días, todas negativas. Coste de no
   pausar: 294 mensajes más con la misma premisa inventada.
2. **Quitar la premisa afirmada del copy.** No hace falta reescribir el mensaje entero: la estructura
   observación → hipótesis → pregunta del §14 funciona si la primera frase deja de afirmar. En vez de
   *«Con HubSpot, ¿tenéis control…»*, la versión que no miente es la hipótesis del vertical, que es la
   misma salida que ya está escrita para el email: preguntar por la etapa del embudo sin atribuir
   herramienta. **Es copy nuevo, así que es decisión de Maikel** (apartado A).
3. **Antes de reanudar, pasar la lista por FIT.** De los 83 vistos, al menos 10 están claramente fuera
   del ICP y dos son competencia. Esto sí lo puedo hacer yo: es preparación de lista.
4. **Sacar a Santiago Noya de la campaña** y no volver a escribirle por ningún canal hasta que su
   seguimiento se desbloquee. Y a Jaume Feliu (PymeLegal) sacarlo y dejarlo fuera: un DPO con una
   premisa inventada es el peor sitio donde puede fallar esto.
5. **La regla que falta, y es la de P0.3:** antes de que HeyReach escriba a alguien, comprobar si esa
   persona ha respondido algo por email. Hoy no se comprueba. Santiago Noya es la prueba de que hace
   falta, y es la misma regla que pide el apartado G: que dos agentes no puedan contactar al mismo
   prospecto ignorando lo que pasó en el otro canal.

---

## Lo que no he podido comprobar

- **Si la premisa es cierta en algún caso.** No he sondeado las 377 webs; no sé cuántos de los 160
  «HubSpot» lo usan de verdad. Lo que sí sé es que se afirma como hecho sin que conste la
  verificación, y que en los dos casos donde el destinatario contestó sobre la premisa, era falsa.
- **El cruce real contra la supresión de Smartlead.** Sin claves de Smartlead he cruzado los 377
  contra los nombres y empresas que aparecen en el repo, no contra la lista de bloqueo global de
  Smartlead ni contra los 4.778 dominios cargados. La coincidencia de Santiago Noya la encontré por
  el repo; podría haber más que no veo.
- **Quién creó esta campaña y con qué aprobación.** No está en ningún documento del repo.

---

# ACTUALIZACIÓN · 2-oct-2026 · parada confirmada

Comprobado en HeyReach el 2-oct.

## Estado

| | |
|---|---|
| Campaña 605109 | **PAUSED** |
| Actividad del 2-oct | **0 invitaciones · 0 mensajes · 0 respuestas** |
| Campañas en IN_PROGRESS en toda la cuenta | **ninguna** |

La pausa ya estaba puesta cuando lo intenté hoy: la API devolvió *«You cannot pause an inactive
campaign»*. La puso Maikel entre el informe de ayer y esta mañana. **El canal de LinkedIn está parado
por completo**: las nueve campañas están PAUSED o FINISHED.

Lo último que salió fueron los 13 mensajes y 18 invitaciones del 1-oct por la mañana, antes del
informe. Después, nada.

## Los que contestaron ya estaban protegidos, por la secuencia

Intenté cerrar individualmente a los tres que respondieron y la API contestó *«Cannot perform the
action because the workflow is already finished»*. Es correcto y es bueno: la secuencia tiene una
rama `respuesta → END`, así que **HeyReach cierra solo a quien contesta** y ninguno de los tres
recibiría el `{msg2}` si se reanuda. Esa parte del diseño funciona.

## Santiago Noya, cerrado a mano

Él **no** respondió por LinkedIn —respondió por email— así que seguía en curso y un «resume» le
habría mandado el seguimiento. **Detenido en la campaña** (`stop_lead_in_campaign`, 2-oct). Es el
único de los 377 que cruzaba con alguien con respuesta previa o seguimiento congelado.

## Lo que la pausa NO arregla

**El copy sigue escrito en los 377 leads**, en sus campos `msg1` y `msg2` de la lista 943342: 160
«Con HubSpot», 48 Salesforce, 33 «lo que movéis en Google», y así. Pausar detiene el envío; no borra
la premisa. **Si alguien reanuda 605109 tal cual, vuelve a mandar exactamente lo mismo a los 294 que
quedan.**

Para que cambiar el mensaje sirva hay que tocar dos sitios, no uno:

1. **Los campos `msg1`/`msg2` de los 377 leads** — ahí vive el mensaje real.
2. **El `fallbackMessage` de la secuencia**, que hoy dice «una duda que me ha surgido mirando vuestra
   empresa» sin nombre de empresa. No está disparando porque los 377 tienen los campos rellenos,
   pero sigue ahí para la próxima carga.

## Pendiente de Maikel

- **El copy nuevo.** Es decisión suya por el apartado A. Mi recomendación sigue siendo la del punto 8:
  quitar la premisa afirmada y entrar por la hipótesis del vertical, sin atribuir herramienta.
- **Jaume Feliu (PymeLegal), Delegado de Protección de Datos.** No lo he detenido porque es una
  valoración de riesgo mía, no una stop condition, y con la campaña pausada no le llega nada.
  Recomiendo sacarlo antes de cualquier reanudación.
- **Pasar la lista por FIT** antes de reanudar. Eso sí puedo hacerlo yo: es preparación de lista.
