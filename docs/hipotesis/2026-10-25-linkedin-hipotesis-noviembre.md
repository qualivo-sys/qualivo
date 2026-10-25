# LinkedIn · hipótesis para noviembre y perfil del comprador

Respuesta al encargo de Growth del 21-oct. **Entregado el 25-oct; el plazo era el 23 a las 18:00.
Llegué tarde y lo digo aquí para que conste en la consolidación.** Llega a tiempo para la
entrega del lunes 26 a las 9:00.

Solo análisis: no se ha lanzado nada, no se ha cambiado nada y no se ha contactado con nadie.
No se tocan E-01 ni E-02. Etiquetas: **[C]** confirmado · **[E]** estimación · **[H]** hipótesis.

---

## 0 · La condición que gobierna las cinco

**HeyReach devuelve 0 cuentas de LinkedIn conectadas** [C, API, comprobado el 19, 23 y 25-oct;
el 2-oct devolvía 1]. Mientras siga así, **ninguna de estas hipótesis se puede ejecutar**, por
mucho presupuesto que se apruebe.

No es parte de las hipótesis: es una puerta cerrada delante de todas. La trato como requisito
previo y no la vuelvo a repetir en cada ficha. Las puntuaciones de E (facilidad) que doy abajo
**asumen la puerta abierta**; con la puerta cerrada, todas valen 0.

> **Pregunta para Maikel (no es una petición):** ¿sigue vinculada la cuenta de LinkedIn en
> HeyReach y qué plan hay contratado? Es lo que decide si noviembre tiene canal o no.

---

## 1 · Qué hago con H-11

**La corrijo y la parto en dos.** Tal como está mezcla un diagnóstico (que tengo bastante
confirmado) con un resultado (que no). Puntuarlas juntas hunde las dos.

| | H-11 original | Lo que propongo |
|---|---|---|
| Contenido | «Nunca se probó bien apuntado» + «≥1 reunión en 4 semanas» | Se separan: **H-L1** es la causa, el resultado es su criterio de éxito |
| Bloqueo | dentro de la hipótesis | fuera, como requisito previo (§0) |
| I / C / E | 3 / 2 / 4 · ICE 3,0 | ver H-L1 |

El motivo del cambio: la confianza en **la causa** es alta (hay dos recuentos confirmados), y la
confianza en **el resultado** es baja. Son números distintos y conviene no promediarlos.

---

## 2 · Las cinco hipótesis

### H-L1 · La lista, no el canal · corrige H-11

> **Creemos que** los 90 días sin una sola reunión se explican por **a quién se escribió**, no
> por el canal. **Porque observamos** que 36 de 84 cuentas de la primera campaña estaban fuera
> de ICP y que el 26 % de los destinatarios de la segunda tenía un cargo sin relación con el
> recorrido comercial. **Si modificamos** la lista (filtro de cargo + solo cuentas con señal
> verificada), **esperamos** pasar de 1 respuesta positiva por trimestre a ≥3 en cuatro semanas.

- **Etapa:** lead · **Objetivo:** O1 adquisición rentable
- **Evidencia:** 36/84 fuera de ICP [C, triaje propio 30-sep] · 26 % de 60 destinatarios con
  cargo no comercial [C, filtro validado contra los datos de la campaña] · la única respuesta a
  esa campaña fue un CTO diciendo «no lo llevo yo» [C] · 486 invitaciones y 0 reuniones en
  90 días [C, API]
- **Qué la refutaría:** una lista de ≥60 contactos con el cargo correcto y señal verificada que
  siga dando 0 respuestas positivas en cuatro semanas. Eso movería la causa al mensaje o al canal.
- **Experimento:** variable = composición de la lista (filtro de cargo ya construido y validado,
  `filtro_fit.py`). Métrica principal = **respuestas positivas**, no aceptaciones. Duración
  4 semanas. Presupuesto **0 €** (las 26 cuentas ya aceptaron; invitación cuesta cero).
- **Esfuerzo:** ~4 h de agente [E] · **~40 min de Maikel** repartidos: aprobar copy y contestar.
- **Éxito:** ≥3 respuestas positivas y ≥1 reunión celebrada. **Parada:** 4 semanas o 60 contactos
  sin ninguna positiva, lo que llegue antes.
- **Contaminación:** media. Comparte buzón y persona con el correo frío; sin dedupe por dominio
  (ver H-L5) puede mezclarse con Outbound.
- **I 6** · es el 100 % del canal, pero el canal no ha facturado nunca · **C 7** sobre la causa,
  **C 3** sobre el resultado · **E 7** · el filtro está hecho y la lista existe
- **Coste 0 € · 0 días** desde que la cuenta esté conectada.

### H-L2 · Cómo encontrar y abordar al comprador del ICP

> **Creemos que** al decisor del H-ICP se le encuentra en LinkedIn por **una señal que él mismo
> ha publicado: que está contratando gente para el equipo que atiende**. **Porque observamos**
> que los cuatro que mejor encajan tienen equipo que atiende y demanda que no abarcan, y que una
> vacante es el único indicio público, fechado y verificable de que ese equipo existe y crece.
> **Si modificamos** la señal de entrada (de «tiene tecnología instalada» a «está contratando»),
> **esperamos** más respuestas y ninguna corrección de hechos.

- **Etapa:** lead · **Objetivo:** O1
- **Evidencia:** el patrón de quien paga incluye «tiene equipo que atiende» y «más demanda de la
  que puede atender» [C, 8 diagnósticos de Tactiq] · los dos únicos clientes que siguen pagando
  tienen equipo de admisiones o comerciales [C, CFO] · sin Sales Navigator (`isValidNavigator:
  false` [C, API]) el filtro de «cambio de director comercial en 90 días» **no es ejecutable**, y
  la vacante sí lo es, gratis, en LinkedIn Jobs e InfoJobs
- **Qué la refutaría:** 40 cuentas con vacante comercial abierta que respondan igual o peor que
  las de señal tecnológica.

**El filtro, concreto:**

| | Qué |
|---|---|
| Búsqueda | LinkedIn Jobs e InfoJobs · «comercial», «jefe de ventas», «director comercial», «recepción», «asesor» · España · últimos 7 días |
| Empresa | 20-500 empleados · demanda recurrente · sectores de los diagnósticos: formación, clínica, reformas, servicios B2B, distribución |
| Persona | **El dueño o el gerente**, no el mando operativo (ver H-L4) |
| Descartes | ETT y consultoras de selección (publican vacantes de terceros), franquicias que publican por sus franquiciados, ofertas sin empresa identificada |

**El mensaje** (día 4, tras aceptar; la invitación va sin nota). No nombra IA, ni CRM, ni
agentes: son medios, no el argumento.

> {Nombre}, vi que estáis buscando {puesto} para {Empresa}.
>
> Cuando entra alguien nuevo, lo que suele costar no es que venda: es que las oportunidades que
> ya están abiertas le lleguen repartidas y con el siguiente paso puesto.
>
> ¿Eso lo tenéis resuelto o va a depender de que alguien se lo vaya explicando?

Una sola pregunta, y «lo tenemos resuelto» es una respuesta válida que no nos deja en evidencia.
El dolor que toca es el de la sección 4 del ICP: *«la gente no usa el CRM»*, dicho sin nombrar
el CRM.

- **Experimento:** variable = señal de entrada. Métrica = **respuestas positivas por cada 40
  cuentas**. Duración 4 semanas, 40 cuentas, 10 invitaciones/día como techo.
- **Esfuerzo:** ~8 h de agente [E] · **~30 min de Maikel**. El cuello no es el límite de LinkedIn
  (18/día configurado, 40 el máximo [C, API]): es que cada cuenta se verifica a mano.
- **Éxito:** ≥4 respuestas positivas por 40 cuentas y 0 correcciones de hechos.
  **Parada:** 40 cuentas o 4 semanas.
- **Contaminación:** baja si se lanza después de H-L1; alta si se solapan, porque cambian dos
  variables a la vez. **Propongo H-L1 primero.**
- **I 7** · abre lista nueva alineada con el ICP · **C 5** · el patrón está confirmado, la señal
  no se ha probado nunca · **E 6** · fuentes gratuitas pero verificación manual
- **Coste 0 € · 2 días** de preparación.

### H-L3 · Una señal que el prospecto puede comprobar

> **Creemos que** una señal **que el prospecto ha publicado él** convierte mejor que una que
> nosotros deducimos de su web. **Porque observamos** que la señal deducida ya produjo un
> desmentido por escrito. **Si modificamos** la primera línea para que diga lo que se vio y no lo
> que se dedujo, **esperamos** cero correcciones y más conversación.

- **Etapa:** lead → reunión · **Objetivo:** O1
- **Evidencia:** un prospecto respondió «no invertimos 1 € en LinkedIn» a un mensaje que daba por
  hecho esa inversión [C, hilo del 1-oct]. La sonda detecta el Insight Tag, que se instala para
  medir y armar públicos, y **no prueba gasto** [C]. El mismo vicio está en 4 de las 11 puertas
  del correo frío [C, `carga_v3.py`] · 19 leads cargados llevan esa frase exacta congelada [C]
- **Qué la refutaría:** que los mensajes con señal deducida y los de señal publicada den la misma
  tasa de respuesta positiva sobre 80 envíos.
- **Experimento:** A/B dentro de la misma lista. Métrica = respuestas positivas y **número de
  correcciones de hechos**, que hoy no se mide y debería. Duración 4 semanas. Presupuesto 0 €.
- **Esfuerzo:** ~2 h de agente [E] · **~15 min de Maikel** para aprobar las dos versiones.
- **Éxito:** la versión publicada gana en positivas y no genera ninguna corrección.
  **Parada:** 80 envíos repartidos.
- **Contaminación:** **alta con H-L2**, porque comparten variable. O se hacen en orden, o H-L2
  incorpora esta como su versión B.
- **I 5** · protege credibilidad más que volumen · **C 6** · un desmentido es evidencia de que
  ocurre, no de cuánto cuesta · **E 8** · copy ya reescrito y probado
- **Coste 0 € · 0 días.**

### H-L4 · Escribir al dueño, no al mando

> **Creemos que** las oportunidades mueren sin decisor porque **entramos por la persona
> equivocada**. **Porque observamos** que 6 de 11 propuestas se presentaron sin el decisor
> delante y que el propio patrón del ICP dice que quien decide no está en el día a día comercial.
> **Si modificamos** el cargo de entrada hacia el dueño o gerente, **esperamos** que una mayor
> parte de las conversaciones llegue a reunión con quien firma.

- **Etapa:** cierre · **Objetivo:** O2 conversión
- **Evidencia:** 6 de 11 propuestas sin decisor [C, Outbound, vía H-01] · *«Yo soy el CEO, no el
  director comercial»* [C, Tactiq] · el cierre de octubre se produjo en la segunda reunión,
  cuando entró la segunda persona [C] · en mi canal, el 26 % de destinatarios tenía cargo no
  comercial y el único que respondió derivó [C]
- **Qué la refutaría:** que las conversaciones abiertas con dueños lleguen a reunión en la misma
  proporción que las abiertas con mandos operativos, sobre ≥20 de cada.
- **Experimento:** variable = cargo de entrada. Métrica = **% de conversaciones que llegan a
  reunión con quien decide**. Duración 6 semanas, por volumen. Presupuesto 0 €.
- **Esfuerzo:** ~3 h de agente [E] · **~20 min de Maikel**.
- **Éxito:** ≥50 % de las reuniones con el decisor delante. **Parada:** 6 semanas o 40 cuentas.
- **Contaminación:** **se solapa con H-L2**, que ya propone entrar por el dueño. Propongo
  **medirla dentro de H-L2** en vez de como prueba aparte, y dejarla como hipótesis separada solo
  si Growth quiere compararla con Outbound, donde hay volumen para hacerlo bien.
- **I 7** · toca el cierre, que es donde está el dinero · **C 6** · evidencia fuerte pero de otro
  canal · **E 4** · LinkedIn no tiene volumen para demostrarlo solo
- **Coste 0 € · 0 días**, si va dentro de H-L2.

### H-L5 · Dos canales, una sola empresa

> **Creemos que** escribir por correo y por LinkedIn a la misma empresa, con argumentos que no
> cuadran entre sí, quema credibilidad antes de la primera conversación. **Porque observamos**
> que ya ocurrió y que los dos sistemas solo comparten el dominio. **Si modificamos** el proceso
> con una lista compartida por dominio y un dueño por cuenta, **esperamos** cero solapes y poder
> atribuir de verdad qué canal trajo cada respuesta.

- **Etapa:** lead · **Objetivo:** O1 (y es condición para medir bien O1 y O2)
- **Evidencia:** una empresa recibió correo y LinkedIn sin que ninguno de los dos sistemas lo
  supiera [C] · HeyReach y Smartlead no comparten nada salvo el dominio [C] · la lista de la
  campaña activa se llama literalmente «ya tocados por email» [C], así que el solape es por
  diseño, no accidental
- **Qué la refutaría:** que con el cruce montado no aparezca ningún solape en 200 cuentas. Eso
  diría que el riesgo era teórico.
- **Experimento:** no es un experimento de campo, es una medición. Cruzar los dominios de los dos
  sistemas y contar solapes. Presupuesto 0 €.
- **Esfuerzo:** ~4 h de agente [E] · **0 min de Maikel**.
- **Éxito:** el cruce existe y da un número. **Parada:** no aplica.
- **Contaminación:** ninguna. Al contrario: **sin esto, H-L1 y H-L3 no son atribuibles**, porque
  no sabremos si la respuesta la provocó LinkedIn o el correo que llegó dos días antes.
- **I 5** · no genera leads, pero hace creíbles las medidas de los demás · **C 8** · el solape
  está documentado · **E 3** · **me falta la clave de Smartlead para leerlo**
- **Coste 0 € · 1 día** desde que haya clave.

> **Pregunta (no es una petición):** ¿quién tiene la clave de Smartlead y dónde debería vivir para
> que no se pierda entre sesiones? Es lo único que separa esta hipótesis de estar hecha.

---

## 3 · Orden propuesto y por qué

| Orden | Hipótesis | Motivo |
|---|---|---|
| 1 | **H-L5** | Es medición, no experimento. Sin ella las demás no son atribuibles |
| 2 | **H-L1** | Coste cero, lista que ya existe, y es la que corrige H-11 |
| 3 | **H-L2** (con H-L4 dentro) | Abre lista nueva alineada con el ICP |
| 4 | **H-L3** | Como versión B de H-L2, no como prueba aparte |

Las cuatro suman **0 € de inversión nueva** y **~1 h 45 min de Maikel en total**.

Mantengo lo que dije en la auditoría: **con 0 clientes en 90 días no pido presupuesto nuevo para
LinkedIn.** Lo que pido es la puerta abierta de §0 y tiempo de aprobación.

---

## 4 · Lo que no he podido contrastar

- **Edad del decisor.** No la doy por buena. En LinkedIn, además, **no es filtrable**: la
  plataforma no ofrece segmentación por edad en búsqueda. Si se valida, se validará en Meta
  (ICP-1), no aquí.
- **Nivel técnico del decisor.** El ICP ya avisa de que «no entiende marketing» no les define, y
  mis datos no añaden nada: no tengo ninguna conversación de LinkedIn larga como para juzgarlo.
- **Calidad de sus campañas.** No la puedo ver sin afirmar cosas que no sé. Es justo el error de
  H-L3.
- **Contenido orgánico de Maikel.** Sin datos: HeyReach no mide publicaciones. Lo único medible
  es que la cuenta hizo 0 likes y 0 follows en 90 días [C].

---

## 5 · Preguntas abiertas

1. ¿Sigue vinculada la cuenta de LinkedIn en HeyReach, y qué plan hay? (§0)
2. ¿Quién tiene la clave de Smartlead y dónde debería guardarse? (H-L5)
3. ICP-3 propone 4 piezas en el LinkedIn de Maikel. ¿El agente de Contenido y yo somos el mismo
   canal a efectos de medida, o lo separamos? Si publica y yo invito la misma semana, el efecto
   de cada uno no será separable.
4. En la auditoría propuse un criterio de corte a 4 semanas: si con lista y copy corregidos no
   sale ≥1 reunión celebrada, se cierra LinkedIn como canal de captación. ¿Sigue en pie con este
   banco, o lo sustituye?
