# Revisión de la Supresión V1 de Growth · 2-oct-2026

Growth avisa de que la supresión mínima del punto 19.2 ya existe en la rama
`claude/qualivo-landing-vercel-nubk1i`. **Antes de ordenar a Email, LinkedIn y Calling que dependan de
ella, la he revisado.** Leídos los tres ficheros completos: `api/_supresion.js` (247 líneas),
`herramientas/supresion.js` y `api/supresion.js`.

**No he podido ejecutarla:** esta sesión no tiene `GHL_API_KEY`, `GHL_LOCATION_ID` ni
`SMARTLEAD_API_KEY` en el entorno. Lo que sigue es revisión de código, no una prueba en vivo. Las seis
pruebas que cita Growth (alphamediagroup.es, escuelaginer.com, magnettu.com bloqueados; vocento.com,
antevenio.com, tarlogic.com libres) **no las he reproducido.**

---

## 1 · Lo que está bien hecho, y es lo que más importa

El riesgo de una herramienta así es que un fallo de API se lea como «limpio». Es el error que ya costó
un informe con SURBL, cuando `dig` no estaba instalado y las consultas vacías se leyeron como
«limpio».

**Aquí no pasa, y está resuelto en el sitio correcto.** El CLI:

```js
const estado = r.bloqueado ? 'BLOQUEADO' : (r.avisos.length ? 'DESCONOCIDO' : 'LIBRE');
```

Un fallo de GHL o de Smartlead va a `avisos`, no a `motivos`, así que **no se puede confundir con
LIBRE**, y el código de salida es 1 tanto si está bloqueado como si es desconocido. Eso es exactamente
la invariante que hace falta.

También está bien: las campañas de clientes (`DKR|scubalight|Kubysoft|Infoproducto|Mailerfind`) se
excluyen, así que el estado de un lead de un cliente no bloquea nuestra prospección.

---

## 2 · El fallo · una comprobación que falla en silencio

`citasFuturasDe()`, en `api/_supresion.js`:

```js
async function citasFuturasDe(contactId) {
  const r = await fetch(A.GHL_BASE + '/contacts/' + contactId + '/appointments', { headers: A.cabeceras() });
  if (!r.ok) return [];          // <-- aquí
```

**Todas las demás comprobaciones lanzan error cuando la API falla.** `contactosGHL` hace
`throw new Error('ghl_contacts_search ' + r.status)`, `oportunidadesDe` igual, `sl()` igual. Esta
devuelve lista vacía, que significa «no tiene ninguna cita futura».

Y como no lanza, **nunca llega a `avisos`**. O sea: si el endpoint de citas de GHL falla y nada más
bloquea a esa persona, el resultado es **LIBRE**, no DESCONOCIDO.

Rompe la invariante que el propio módulo declara en su cabecera:

> *«Lo que no se puede comprobar se devuelve como "desconocido", nunca como libre.»*

**Consecuencia concreta:** alguien con una reunión agendada para la semana que viene puede salir LIBRE
y entrar en prospección. Eso es justo la stop condition del apartado 13 de la adenda,
«meeting booked → parar Email/LinkedIn/Calling de adquisición».

Es una ventana estrecha —hace falta que el endpoint de oportunidades funcione y el de citas no, porque
son rutas distintas— pero el coste de equivocarse es escribirle a alguien que ya tiene cita contigo.

**Arreglo:** `if (!r.ok) throw new Error('ghl_appointments ' + r.status);`, igual que las otras tres.
Una línea.

---

## 3 · Lo que no cubre, y hace falta · LinkedIn no se consulta

El módulo mira **GHL y Smartlead**. No mira HeyReach. Tres consecuencias:

1. **Las 263 personas en curso en la campaña 605109** de LinkedIn salen LIBRE por lo que respecta a
   LinkedIn. Si la campaña se reanuda y además entran en una secuencia de correo, nadie lo ve.
2. **Una promesa hecha en LinkedIn no es representable.** El caso de María Carrascal —«si no es para
   que me vendas nada», prometido y roto dos veces— no tiene dónde escribirse. Es el motivo por el que
   existe el apartado 7 del rol.
3. **El caso de magnettu da el resultado correcto por el motivo equivocado.** Growth lo cita como
   prueba: BLOQUEADO porque está «en secuencia activa» de **Smartlead**. Pero lo que de verdad pasó con
   Rafa Calle es que **respondió por LinkedIn** negando la premisa. Eso el sistema no lo ve. Si mañana
   sale de la secuencia de correo, pasa a LIBRE.

**Lo que pido a Growth:** añadir HeyReach como tercera fuente (`get_conversations_v2` por
`leadProfileUrl` o por dominio) con dos criterios: **en campaña activa** y **respondió alguna vez**. Y
un campo manual de **promesa de no contactar**, que no sale de ninguna API y hoy no tiene sitio.

---

## 4 · Tres límites de cobertura que no son fallos, pero hay que saberlos

**a) Las categorías de Smartlead están casi vacías.** `CATEGORIAS_BLOQUEO` y `CATEGORIAS_RESPONDIO`
van por el id numérico de categoría del lead. El triaje del 11-sep midió que **105 de 108 respuestas
tenían la categoría vacía**. Así que la parte de «respondió» o «no le interesa» solo funciona donde
alguien clasificó a mano. Lo que no depende de eso —`lead_status` en secuencia activa— sí funciona
siempre.

**b) Las etiquetas de baja son coincidencia exacta:** `act-baja`, `baja`, `nut-stop`. **No está
comprobado** que los 17 que pidieron parar y los 4 que escalaron lleven alguna de esas tres en GHL. El
1-oct se descubrió que 4 de los 17 no estaban dados de baja de verdad. Hay que verificar que los 21
están etiquetados, o esta comprobación no los ve.

**c) La foto de Smartlead se cachea 6 horas** en disco. «En secuencia activa» puede ir hasta 6 horas
desfasado. Para una cadencia diaria es suficiente; conviene saberlo.

Y una pendiente de Maikel que Growth ya señala: en Vercel faltan `SMARTLEAD_API_KEY`,
`SUPRESION_DOMINIOS` y `SUPRESION_SHEET_ID`. **Sin `SUPRESION_DOMINIOS` el endpoint no tiene lista de
dominios de cliente**, así que la primera categoría de bloqueo —la de Alpha Media, Sheerpa/Eleva, EAC
y Equipzilla— está vacía en producción. El CLI sí la lee del entorno local.

---

## 5 · Una recomendación de forma, para que nadie se equivoque al usarlo

El endpoint `/api/supresion` devuelve `{ bloqueado, motivos, avisos, contacto_previo }` y avisa en un
comentario: *«Si devuelve bloqueado o un aviso, no se contacta.»* El CLI calcula bien el estado, pero
**el endpoint deja esa decisión al consumidor**, y un consumidor que mire solo `bloqueado` obtiene un
falso LIBRE.

**Propongo devolver también `estado: 'LIBRE' | 'BLOQUEADO' | 'DESCONOCIDO'`** calculado en el
servidor, con la misma línea que ya usa el CLI. Así la invariante no depende de que cada consumidor se
acuerde.

---

## 6 · Lo que cambia en mis órdenes de hace una hora

En el Control Center de las 17:0x escribí que construiría yo el fichero de supresión. **Eso queda
retirado: ya existe y es mejor que lo que yo iba a hacer.** Las órdenes quedan así:

| Agente | Cambia a |
|---|---|
| **Research / Outbound** | El Level 0 usa `node herramientas/supresion.js --lista`, no una lista mía. Las 20 candidatas pasan por ahí antes de nada |
| **Email · LinkedIn · Calling** | Nadie contacta sin pasar por la herramienta. **BLOQUEADO y DESCONOCIDO son los dos un no.** DESCONOCIDO no es «probablemente sí» |
| **Growth** | Las tres peticiones: el `throw` de `citasFuturasDe`, HeyReach como tercera fuente, y `estado` en la respuesta del endpoint |

Con la supresión en marcha, **la frase «no te vengo a vender nada» del mensaje C de LinkedIn deja de
estar bloqueada por falta de mecanismo**. Sigue necesitando tu ok como copy nuevo, pero ya no es una
promesa que no podamos cumplir — salvo en LinkedIn, que es justo el canal donde se prometió y el que
todavía no se consulta. **Hasta que HeyReach entre, yo no mandaría esa frase por LinkedIn.**

---

## Lo que no sé

- **Si funciona de verdad.** No he podido ejecutarla: sin claves en esta sesión. Las seis pruebas de
  Growth no están reproducidas por mí.
- **Si los 21 que pidieron parar están etiquetados** con `act-baja`, `baja` o `nut-stop` en GHL. Es
  comprobable en una consulta y es lo primero que yo probaría.
- **Qué hace la herramienta con un dominio que nunca ha entrado en Smartlead ni en GHL.** Por el
  código debería salir LIBRE con `contacto_previo: 0`, que es lo correcto, pero no lo he visto correr.
