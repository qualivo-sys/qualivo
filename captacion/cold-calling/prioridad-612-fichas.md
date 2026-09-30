# Cómo priorizar las 612 fichas de Maps para llamar · 30-sep-2026

Recuentos reales sobre `captacion/datos/maps-pool-612.json`, no estimados.

## El titular: el pool útil es la mitad de lo que parece

| | fichas |
|---|---:|
| Total | 612 |
| Sin teléfono | 8 |
| **Reformas, carpintería, construcción, muebles y afines** | **315** |
| Salud y estética (dental, fisio, estética, médico) | 204 |
| Formación (centros, academias, escuelas de negocio) | 93 |
| **En juego: salud/estética + formación, con teléfono** | **293** |

**315 de 612 fichas, el 51 %, son de los sectores que hay que aparcar.** Reformas tiene 14
diagnósticos y cero nivel A (`estrategia/mapa-sectores-29sep.md`); carpintería no tiene ninguna
evidencia y el perfil típico es de una a tres personas, fuera del ICP.

Eso cambia la aritmética: no son 604 fichas a 5-8 llamadas al día (120 días laborables), son
**293 a 5-8 al día, unos 37-58 días**. Sigue siendo un trimestre, pero es abarcable.

Las 8 sin teléfono, para que no se busquen: Clínica Estética Eranza · Clinica Cosmos Medicina
Estética · Clínica Dental Dr. Cerezuela · Academia SEO Local Tribu Local · AlKofer Sevilla ·
Reformando Zaragoza · Sg Multiservicios · Atelier Nogal.

## El sector y la ciudad son la misma variable en este pool

| Grupo | Sevilla | València | Zaragoza | Málaga | Madrid | Barcelona |
|---|---:|---:|---:|---:|---:|---:|
| Salud / estética | 71 | 63 | 33 | 28 | 0 | 0 |
| Formación | 0 | 0 | 0 | 0 | 49 | 43 |

La extracción se hizo sector por ciudad y no se solapan. Dos consecuencias prácticas:

1. **Agrupar por ciudad y agrupar por vertical es lo mismo.** Simplifica las tandas.
2. **No hay ni una clínica de Madrid o Barcelona en el pool.** Y son los dos mercados donde el
   ticket de un tratamiento dental supera el suelo de 1.000 € con más holgura. Es un hueco de la
   extracción, no del sector: si clínicas es la vertical de mejor calidad medida (50 % de nivel A),
   falta justamente donde mejor pagaría. **Merece una extracción de clínicas en Madrid y
   Barcelona** con `captacion/scripts/maps_sector.py`, que ya está escrito para esas dos ciudades.

## Comprobaciones de higiene, ya hechas

- **Dominios bloqueados en el pool: cero.** Comprobados los seis contra las 612 fichas.
- **Dominios repetidos dentro del pool: cero.** El dedupe interno está bien hecho.
- **El cruce con la lista de calientes NO está hecho, y hace falta.** Clínica Dental Dr. Lorente
  está en las dos listas, con dos teléfonos distintos (963312771 en el lead de campaña,
  961143957 en la ficha de Maps como sede «Alameda»). Sin cruzar, esa clínica recibe dos llamadas
  frías como si fuera dos empresas. Se cruza por dominio antes de montar ninguna cola.

---

## La regla que manda: la inversión, no el sector

Está medido en `estrategia/mapa-sectores-29sep.md`:

| Sector | Diagnósticos | Nivel A | Tasa |
|---|---|---|---|
| Clínicas | 6 | 3 | **50 %** |
| Formación | 12 | 5 | **42 %** |
| Reformas | 14 | **0** | **0 %** |

Y su conclusión: *«el filtro no es el sector, es la inversión»*. 21 de 30 diagnósticos venían por
debajo del suelo de 500 €/mes. Así que la señal de inversión va por delante y el sector desempata.

---

## Capa 0 · exclusiones duras (gratis, antes de nada)

1. Las **8 fichas sin teléfono**.
2. Los **seis dominios bloqueados** (ya comprobado: ninguno está en el pool).
3. **Las fichas sin web.** En este pool no hay ninguna: las 612 traen dominio.
4. **Las 315 de reformas, carpintería y construcción**, aparcadas para frío hasta que una dé un
   nivel A.
5. **Cualquier ficha ya tocada.** Cruce contra los leads de Smartlead, contra
   `captacion/datos/calientes-30sep.json` y contra
   `captacion/agente-llamadas/historial_llamadas.json`. **No es opcional:** el incidente de
   reenvíos de agosto (`captacion/incidente-reenvios-smartlead-2026-08.md`) costó una queja LOPD
   por repetir contacto. Repetirlo ahora por no cruzar dos JSON sería peor, porque sería a mano.

Quedan **293**.

---

## Capa 1 · la sonda que ya existe, sobre los 293 dominios (gratis)

`captacion/scripts/probe_dataset.py` devuelve exactamente las señales que hacen falta, cuesta cero
créditos y deduplica contra lo ya sondeado.

```bash
python3 - <<'PY'
import json
d = json.load(open('captacion/datos/maps-pool-612.json'))
# filtrar a los 293 y volcar como [{"web": dom, "v": grupo}]
PY
python3 captacion/scripts/probe_dataset.py captacion/datos/maps-webs.json
```

### ARREGLAR LA SONDA ANTES DE PUNTUAR

`probe_dataset.py` da `estado: OK` con solo pasar de 2.500 bytes. Una pantalla de Cloudflare pesa
más que eso, así que cuela como web buena con todas las señales a cero.

Lo encontré en la primera web que sondé: `dentallorente.com` devuelve 12.054 bytes de «One moment,
please…». Leído tal cual, esa clínica parece no medir ni invertir nada.

Prevalencia sobre `captacion/datos/probe-dataset.csv`, 2.532 filas en `OK`:

| | filas |
|---|---:|
| Título de WAF (Cloudflare, «Just a moment…», «Attention Required») | **15** · falso negativo seguro |
| Todas las señales a cero por otro motivo | 285 · a revisar |

Arreglo, dos líneas: marcar `BLOQUEADA_O_CAIDA` si el cuerpo o el título contiene *one moment ·
just a moment · checking your browser · attention required · access denied*.

Y la regla que ya está escrita en `herramientas.md` y aquí se ve por qué: **una señal positiva de
la sonda es un hecho; una negativa no es nada.** Nunca se descarta una empresa por lo que la sonda
NO vio.

### La puntuación

**Inversión (pesa el doble, es lo que predice el nivel A)**

| Señal | Puntos |
|---|---:|
| `meta_pixel` o `google_ads` | **+3** |
| `linkedin_pixel` | +1 |
| `gtm` y `ga4` pero ningún píxel de anuncios | +1 |

**Seguimiento / CRM**

| Señal | Puntos |
|---|---:|
| `hubspot` | +2 |
| `chat` (Crisp, Tawk, Intercom, Tidio…) | +1 |

**Captación activa**

| Señal | Puntos |
|---|---:|
| `formularios` ≥ 2 **y** `campos_email` ≥ 1 | +1 |
| `whatsapp` | +1 |

**Antiseñal**

| Señal | Puntos |
|---|---:|
| 0 formularios, 0 píxeles y solo `mailto_generico`, con la web leída de verdad | **−2** |
| WAF o web caída | no puntúa · a «revisar a mano», **nunca descartada** |

Una web escaparate con un `info@` y nada más es, casi siempre, una empresa de una a tres personas.
Es la antiseñal más fiable que da la sonda — **siempre que la sonda haya leído la web**.

---

## Capa 2 · tamaño, solo sobre los que ya puntúan

El ICP pide 5-50 personas y la ficha de Maps no lo dice. Se resuelve con Apollo, pero **solo para
los que salgan de la capa 1 con 4 puntos o más**.

Lo que falló el 30-sep con Apollo fue **el correo de personas, no el dato de empresa**: 8 de 10
volvieron `email_status: unavailable`. El tamaño de plantilla por dominio es otro endpoint. Y
`apollo_organizations_lookup` es **gratis** según `herramientas.md`: se empieza por ahí y solo se
paga `mixed_companies_search` si el lookup no lo trae.

Filtro: fuera los de 1-4 empleados y los de más de 50.

Si Apollo no tiene la empresa, **no se descarta**: se marca `tamano-desconocido` y se comprueba en
la propia llamada («¿quién lleva eso ahí, tienes a alguien llamando o lo lleváis entre todos?»).

Dos pistas de tamaño gratis que no dan ni la sonda ni Apollo:

- **Varios teléfonos o varias sedes publicadas** en la misma web o en varias fichas de Maps del
  mismo dominio. Dr. Lorente tiene dos números y dos sedes: es la mejor pista de que pasa el suelo
  de 5 personas.
- **El propio nombre de la ficha**: «Dentista» y «Fisioterapeuta» como categoría (14 y 1 fichas)
  apuntan a consulta individual mucho más que «Clínica dental».

---

## Capa 3 · el orden de marcado

**Antes de cualquier ficha fría van los leads calientes.** Ya recibieron correo y lo abrieron tres
veces o más. Pero la lista de calientes necesita tres arreglos primero, ver la sección siguiente.

| Banda | Quién entra | Cuántos hay | Por qué |
|---|---|---:|---|
| **1** | Salud y estética con píxel de anuncios y 5-50 empleados | de los 195 | 50 % de nivel A medido + inversión confirmada |
| **2** | Formación y escuelas de negocio con píxel y 5-50 empleados | de los 92 | 42 % de nivel A; la parte alta invierte de verdad (5.000 €/mes en un caso medido) |
| **3** | Cualquiera de esos que mide (`gtm`+`ga4`) pero sin píxel de anuncios | — | tiene la pieza de medición y puede invertir sin píxel en la portada |
| **4** | El resto con formulario, y los `tamano-desconocido` | — | solo si sobra capacidad |
| **Revisar** | WAF y webs caídas | — | **no se descartan**, se miran a mano |
| **Aparcado** | Reformas · carpintería · construcción · muebles · sin teléfono | 315 + 8 | no se marcan |

Los recuentos por banda solo se pueden cerrar después de pasar la sonda arreglada sobre los 293.

Dentro de cada banda: puntuación descendente, y tandas de una ciudad a la vez (que aquí es lo
mismo que una vertical a la vez).

---

## Tres arreglos en la lista de calientes, antes de marcarla

### 1 · Kalu Institute tiene 18 aperturas y está enterrado

`calientes-30sep.json` lo trae con **18 aperturas**, más del triple que el siguiente. Es la señal
de intención más fuerte de todo el material. Y está en la pila de «prefijo raro» porque su número,
790697761, no es válido en España.

**18 aperturas no se aparcan: se les busca el número.** Es media hora de mirar su web.

### 2 · Los cinco «prefijos raros» son números mal leídos

790697761 · 803708600 · 815875657 · 790086174: ninguno es un móvil ni un fijo español válido.
Encaja con el fallo del 22-sep, cuando cuatro de ocho números reconstruidos desde una tabla
estaban mal porque la tabla recortaba por la derecha. **Se vuelve a la web, uno a uno.** Marcarlos
como están es llamar a desconocidos.

### 3 · Ocho de los veinte son buzones de rol, y uno no se debe llamar

`cita@` · `recepcion@` · `clinica@` · `famydent@` · `academia@` · `datos@` · `consulta@` ·
`privacidad@`. Y `herramientas.md` §6 dice «descartar siempre: buzones de rol».

Para llamar sirven igual — el teléfono es de la empresa, no del buzón. Pero **las aperturas de un
buzón de rol no prueban interés de un decisor**: pueden ser de recepción, de varias personas o de
un escáner de correo. Se usan para ordenar, no como prueba.

Y uno hay que sacarlo: **`privacidad@cbclinic.com`, con 4 aperturas.** Un buzón de privacidad
abriendo un correo frío cuatro veces no es intención de compra. Llamar ahí es pedir una queja
LOPD. Fuera de la cola.

### Y Microfusa está agotada

Aparece con 6 aperturas y en las 6 llamadas de prueba de hoy. Pero ya se la llamó el **22-sep**:
acabó en una centralita con menú, la asistente no supo marcar un dígito y terminó en «mándennos un
correo al departamento de marketing» (`captacion/raquel-estado-22sep.md`). Con la de hoy son **dos
toques**, el máximo. Sale de la cola de teléfono.

---

## Lo que hay que medir desde la primera tanda

Del punto 20 del rol, y ninguna cuesta dinero:

- llamadas · contactos reales · conversaciones de más de 30 s · conversaciones con decisor ·
  problemas detectados · reuniones propuestas · agendadas · celebradas · motivos de rechazo.
- **Y la combinación** que pide el rol: vertical + email + señal + apertura + problema + pregunta.
  Sin anotar qué pregunta se hizo, esa tabla no se puede construir nunca.

**Repartir las primeras 40 llamadas a propósito entre franjas** —10:00-11:30, 11:30-13:30,
16:00-18:00— con la misma mezcla de bandas en cada una. No tengo dato de a qué hora coge mejor el
teléfono una recepción de clínica y no me lo voy a inventar: se mide en la primera tanda.

### La regla de parada, que ya existe

De `diseno.md`: **si tras 40-50 llamadas no hay 2 o más reuniones, se para y se revisa el guion.**
Se aplica por banda, no al total: una banda 1 que no convierte dice algo muy distinto de una banda
3 que no convierte.

---

## Lo que necesito para ejecutar

1. **Clave de Smartlead** para cruzar los leads ya tocados. Sin el cruce no monto cola.
2. **Ok a Apollo**: `organizations_lookup` es gratis; solo pediría créditos si hace falta
   `mixed_companies_search` (estimo menos de 100 dominios de los 2.467 disponibles).
3. **Ok a llamar, y a qué banda.** Yo no marco nada hasta entonces.
