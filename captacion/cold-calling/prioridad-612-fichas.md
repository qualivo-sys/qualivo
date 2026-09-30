# Cómo priorizar las 612 fichas de Maps para llamar · 30-sep-2026

> **No he visto el fichero.** `maps_pool.json` está en el scratchpad de la
> sesión de Outbound, no en el repo. Esto es el criterio y los comandos para
> aplicarlo en cuanto esté; los recuentos por banda solo se pueden dar después
> de pasarlo.

## Por qué esto importa más de lo que parece

604 fichas con teléfono. El piloto de voz va a **5–8 llamadas al día**
(`captacion/agente-llamadas/diseno.md`). Eso son **entre 75 y 120 días
laborables** para agotar la lista.

Dicho de otra forma: el orden de esta cola decide a quién se llama hasta
enero. No es un ejercicio de limpieza, es la decisión comercial del trimestre.

Y el margen es real: en septiembre, 100 llamadas dieron 7 reuniones (7%)
frente a 3.065 correos con 26 respuestas (0,85%). Si la lista se ordena mal,
se gasta el canal bueno en las empresas malas.

---

## La regla que manda: la inversión, no el sector

Está medido y escrito en `estrategia/mapa-sectores-29sep.md`:

| Sector | Diagnósticos | Nivel A | Tasa |
|---|---|---|---|
| Clínicas | 6 | 3 | **50 %** |
| Formación | 12 | 5 | **42 %** |
| Reformas | 14 | **0** | **0 %** |

Y la conclusión que sacó el propio mapa: *«el filtro no es el sector, es la
inversión»*. 21 de 30 diagnósticos venían por debajo del suelo de 500 €/mes.

Así que el orden se construye con **la señal de inversión por delante** y el
sector como desempate, no al revés.

---

## Capa 0 · exclusiones duras (gratis, instantáneo, antes de nada)

Se quitan de la cola de teléfono, sin discusión:

1. **Las 8 fichas sin teléfono.** No sirven para este canal.
2. **Los seis dominios bloqueados**: growitschool.com ·
   growthhackingcourse.io · anticbarcelona113.es · formacion.ninja ·
   kubysoft.com · escolaeronauticadecatalunya.cat. Clientes y ex clientes.
3. **Las fichas sin web.** El ICP V1 exige «web o campañas» como una de las
   tres piezas. Sin web no hay ninguna de las dos. No es un juicio de valor:
   es el propio criterio.
4. **Cualquier ficha ya tocada**, por correo o por teléfono. Se cruza contra
   los leads de Smartlead y contra
   `captacion/agente-llamadas/historial_llamadas.json`. **Este cruce no es
   opcional**: el incidente de reenvíos de agosto
   (`captacion/incidente-reenvios-smartlead-2026-08.md`) costó una queja LOPD
   por repetir contacto por fallo de sistema. Repetirlo ahora por no cruzar un
   fichero sería peor, porque sería a mano.
5. **Reformas y carpintería, aparcadas para frío.** Reformas: 14
   diagnósticos, cero nivel A. Carpintería: ninguna evidencia, y el perfil
   típico de la ficha es de 1 a 3 personas, que queda fuera del ICP. Que
   sigan entrando por anuncios si son baratas, pero no se les gasta una
   llamada hasta que una dé un nivel A.

Quedan en juego: **clínica dental, fisioterapia, estética, centros de
formación y escuelas de negocio.**

---

## Capa 1 · la sonda que ya tenemos, sobre los dominios (gratis)

No hace falta inventar nada: `captacion/scripts/probe_dataset.py` ya devuelve
exactamente las señales que necesitamos, cuesta cero créditos y deduplica
contra lo ya sondeado.

```bash
# 1. maps_pool.json -> [{"web": "dominio.es", "v": "clinicas"}, ...]
# 2. sondear (acumula y deduplica en el CSV de siempre)
python3 captacion/scripts/probe_dataset.py captacion/datos/maps-webs.json
```

Columnas que devuelve y que usamos: `formularios`, `campos_email`, `gtm`,
`ga4`, `meta_pixel`, `linkedin_pixel`, `google_ads`, `hubspot`, `chat`,
`whatsapp`, `mailto_generico`, `estado`.

### La puntuación

Tres bloques, y el de inversión pesa el doble que los otros porque es el que
predice el nivel A.

**Inversión (lo que más pesa)**

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
| 0 formularios, 0 píxeles y solo `mailto_generico` | **−2** |
| `estado` = `BLOQUEADA_O_CAIDA` | no puntúa · va a «revisar a mano» |

Una web escaparate con un `info@` y nada más es, casi siempre, una empresa de
una a tres personas. Es la antiseñal más fiable que da la sonda.

---

## Capa 2 · tamaño, y solo sobre los que ya puntúan

El ICP pide 5–50 personas y la ficha de Maps no lo dice. Se resuelve con
Apollo, pero **solo para los que salen de la capa 1 con 4 puntos o más**, para
no quemar créditos en fichas que ya no van a llamarse.

Hay un punto importante aquí: **lo que falló hoy con Apollo fue el correo de
personas, no el dato de empresa.** De 10 decisores enriquecidos, 8 volvieron
con `email_status: unavailable`. El tamaño de plantilla por dominio es otro
endpoint (`organizations_enrich`), y ese sí responde. No se puede concluir del
fallo de los correos que Apollo no sirva para esto.

Créditos disponibles: 2.467 hasta el 14 de octubre. De sobra.

Filtro: **fuera los de 1–4 empleados y los de más de 50.** Los de más de 50
no son ICP tampoco, aunque duela descartarlos.

Si Apollo no tiene la empresa, no se descarta: se marca `tamano-desconocido` y
se comprueba en la propia llamada con la pregunta «¿y quién lleva eso ahí,
tienes a alguien llamando o lo lleváis entre todos?». Esa pregunta ya está en
el guion.

---

## Capa 3 · el orden de marcado

**Antes de cualquier ficha fría van los 15 leads calientes** de
`captacion/llamadas-calientes-30sep.md`. Ya recibieron correo y lo abrieron
tres veces o más: ninguna ficha fría vale lo que uno de esos. (Menos los que
ya llevan dos toques: Microfusa ya está agotada, ver más abajo.)

Después, las fichas frías en cuatro bandas:

| Banda | Quién entra | Por qué primero |
|---|---|---|
| **1** | Clínica dental · estética · fisio, con píxel de anuncios y 5–50 empleados | mejor tasa de nivel A medida (50 %) y señal de inversión confirmada |
| **2** | Formación y escuelas de negocio, con píxel de anuncios y 5–50 empleados | 42 % de nivel A, y la parte alta del sector invierte de verdad (5.000 €/mes en un caso medido) |
| **3** | Cualquiera de esas cinco categorías que mide (`gtm`+`ga4`) pero no tiene píxel de anuncios | tiene la pieza de medición y puede estar invirtiendo sin píxel en la home |
| **4** | El resto con web y formulario, y los `tamano-desconocido` | solo si sobra capacidad |
| **Aparcado** | Reformas · carpintería · sin web · sin teléfono · webs caídas | no se marcan |

Dentro de cada banda, **ordenar por puntuación descendente y, a igualdad, por
ciudad**, agrupando Barcelona y Madrid en tandas separadas: así el que llama
entra en contexto de un mercado a la vez y las horas punta de recepción se
parecen entre fichas.

---

## Lo que hay que medir desde la primera tanda

Sin esto, dentro de un mes no sabremos si funcionó el guion o funcionó la
lista. Dos cosas, y son baratas:

1. **Anotar en cada llamada el resultado, el número que dijo el prospecto y
   qué pregunta se le hizo** (la tabla de resultados está en
   `guion-cold-calling-v1.md`).
2. **Repartir las primeras 40 llamadas a propósito entre franjas horarias**
   —10:00–11:30, 11:30–13:30, 16:00–18:00— con la misma mezcla de bandas en
   cada franja. No tengo dato de a qué hora coge mejor el teléfono una
   recepción de clínica, y no me lo voy a inventar: se mide en la primera
   tanda y se ordena el resto con eso.

### La regla de parada, que ya existe y se respeta

De `diseno.md`: **si tras 40–50 llamadas no hay 2 o más reuniones, se para y
se revisa el guion.** Se aplica por banda, no al total: una banda 1 que no
convierte dice algo muy distinto de una banda 3 que no convierte.

---

## Dos avisos concretos sobre la lista de hoy

1. **Microfusa está agotada, no es un lead.** Aparece en la lista de calientes
   del 30-sep con 6 aperturas, y en las 6 llamadas de prueba de hoy. Pero ya
   se la llamó el **22-sep**: la llamada acabó en una centralita con menú, la
   asistente no supo marcar un dígito y terminó en «mándennos un correo al
   departamento de marketing» (`captacion/raquel-estado-22sep.md`). Con la de
   hoy son **dos toques**, que es el máximo. Sale de la cola de teléfono.
2. **Los cinco «prefijos raros» de la lista de calientes no son prefijos
   raros, son números mal leídos.** 790697761, 803708600, 815875657,
   790086174: ninguno es un móvil ni un fijo español válido. Encaja
   exactamente con el fallo del 22-sep, cuando cuatro de ocho números
   reconstruidos desde una tabla de un informe estaban mal porque la tabla
   recortaba por la derecha. **Antes de marcarlos hay que volver a la ficha o
   a la web**, uno a uno. Si se marcan como están, se llama a desconocidos.

---

## Lo que necesito para ejecutar esto

1. **`maps_pool.json` en el repo.** Lo pasa la sesión de Outbound o lo pego yo
   si me lo das. Sin él, esto es criterio sin lista.
2. **El ok a gastar créditos de Apollo** en `organizations_enrich` sobre los
   que pasen la capa 1 (estimo 80–150 dominios, muy por debajo de los 2.467
   disponibles).
3. **El ok a llamar**, y a qué banda. Yo no marco nada hasta entonces.
