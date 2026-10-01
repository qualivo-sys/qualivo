# Análisis por vertical, de la impresión a la reunión · 1-oct-2026

Primera vez que se puede. La atribución no sale del campo `source` de GoHighLevel
—que sigue roto, 28 de 34 oportunidades solo dicen "formulario instantáneo"— sino
de las **etiquetas del contacto**: `form-<id>` y `sector-<vertical>`.

**Validación antes de mirar nada:** los envíos que cuenta Meta por vertical
coinciden exactamente con las oportunidades que tiene el CRM por vertical.

| | envíos en Meta | oportunidades en GHL |
|---|---|---|
| reformas | 15 | **15** |
| formación | 14 | **14** |
| clínicas | 5 | **5** |
| asesorías | 0 | **0** |

Cuatro de cuatro. La atribución por etiquetas es fiable y el webhook no pierde
nada.

Fuentes: Meta Marketing API v21.0 (`act_3453332464718877`, 17-sep a 1-oct) y
GoHighLevel API v2 (pipeline *Prospección*), leídos el 1-oct a las 11:00 CEST.
Sin nombres, correos ni teléfonos.

---

## 1 · Dos medidas de "reunión celebrada", y cuál vale

El CRM tiene dos formas de decir que una reunión ocurrió y dan números distintos:

- **etiqueta `reunion-celebrada`: 8**
- **etapa avanzada** (Oferta enviada, Segunda reunión, Negociación): **5**

Los 3 de diferencia son reuniones que se celebraron y no avanzaron: 2 de formación
que pasaron a *Más adelante* y 1 de reformas que sigue en *Reunión agendada*. Los
tres son **nivel A**.

Para "¿ocurrió la reunión?" vale la **etiqueta: 8**. Para "¿fue a algún sitio?"
vale la **etapa: 5**. Doy las dos y no mezclo.

Ninguno de los 4 no presentados tiene la etiqueta. Coherente.

---

## 2 · El cuadro por vertical

| | gasto | envíos | €/envío | citas resueltas | celebradas | plantones | asistencia | **€/reunión** | nivel A |
|---|---|---|---|---|---|---|---|---|---|
| **formación** | 207,59 € | 14 | 14,83 € | 7 | **4** | 3 | 57 % | **51,90 €** | 6 |
| **clínicas** | 175,84 € | 5 | 35,17 € | 2 | **2** | 0 | **100 %** | **87,92 €** | 3 |
| **reformas** | 189,79 € | 15 | **12,65 €** | 3 | **2** | 1 | 67 % | **94,90 €** | 3 |
| asesorías | 29,87 € | 0 | — | 0 | 0 | 0 | — | — | 0 |
| **total** | **603,09 €** | **34** | **17,74 €** | **12** | **8** | **4** | **67 %** | **75,39 €** |**12** |

El coste por reunión celebrada del conjunto es **75,39 €**. He estado reportando
302 € durante nueve días.

---

## 3 · El hallazgo que desmonta la propuesta estrella del brief

De los **4 plantones, 3 tenían la cita CONFIRMADA** (`act-cita-confirmada`).

El brief proponía como arreglo principal *"confirmación obligatoria la víspera con
liberación de hueco"*. **La confirmación ya existe y no evita el plantón:** tres de
cada cuatro que no se presentaron habían confirmado.

Eso no quiere decir que el plantón no importe. Quiere decir que **el remedio
propuesto no ataca la causa**, y que llevamos una semana con la prioridad puesta en
algo que ya está hecho. Lo que sí sugieren los datos es la distancia temporal: una
cita a tres o cuatro días da tiempo a que se enfríe por mucho que se confirme. La
hipótesis a probar es **cita el mismo día o al siguiente**, no más recordatorios.

---

## 4 · Dónde se pierde, por vertical

**5 leads pagados nunca arrancaron la cadencia** (sin etiqueta `act-wa1`):

| | sin arrancar |
|---|---|
| formación | 3 |
| clínicas | 2 |
| **reformas** | **0** |

Reformas no pierde ni uno. Formación y clínicas pierden 5 entre las dos, a 14,83 €
y 35,17 € el lead. Eso es dinero tirado antes de que nadie hable con nadie, y no
es un problema de anuncios: es del arranque de la cadencia.

En el agregado, **19 de 34 (56 %) nunca llegan a una cita** y solo 4 (12 %) se
caen en el plantón. La fuga grande sigue estando antes de la cita, no en ella.

---

## 5 · Mi opinión, vertical por vertical

**Formación — subir.** 51,90 € por reunión celebrada, el mejor de los tres por un
margen amplio. 4 de las 8 reuniones y 6 de los 12 nivel A. Su problema es que se
lleva 3 de los 4 plantones y 3 de los 5 que no arrancaron: produce mucho y pierde
mucho por el camino. Arreglando el arranque de cadencia, es el vertical.

**Reformas — encenderla otra vez.** Está apagada desde el 30-sep y no debería.
12,65 € por envío (el más barato), 94,90 € por reunión, cero leads perdidos en el
arranque y **la única negociación abierta de todo el paid**. Llevo cinco días
pidiendo matarla con un número que no podía calcular; el número real no justifica
apagarla.

**Clínicas — encenderla, pero con vídeo nuevo.** Es la que mejor convierte de
largo: **2 de 2 citas celebradas, 100 % de asistencia**, y 87,92 € por reunión,
mejor que reformas. Su problema está arriba, no abajo: 35,17 € por envío y 4,63 €
por apertura, con un CPM que es el doble que el de formación. **El vertical
convierte; el vídeo no capta.** Encenderla con el mismo creativo repite el
problema, como ya pasó el 30-sep.

**Asesorías — muerta.** 29,87 €, 19 aperturas, 0 envíos. Cerrada.

---

## 6 · Lo que esto cambia de lo que yo venía diciendo

1. **Retiro definitivamente la recomendación de matar reformas.** No era una
   corrección de matiz: estaba equivocada, y lo estaba porque el KPI con el que la
   defendía no lo podía calcular.
2. **Mi freno a clínicas del 29-sep era correcto en el síntoma y equivocado en la
   conclusión.** El coste por apertura era malo de verdad, pero el vertical es el
   mejor que tenemos convirtiendo. Pausarla por el coste por apertura fue optimizar
   la métrica equivocada.
3. **La prioridad de arreglo**, por tamaño de la fuga y por coste de arreglarla:
   arrancar la cadencia en los 5 que nunca arrancaron → pedir la cita a las 7
   conversaciones abiertas → acortar la distancia hasta la cita → creativo nuevo
   para clínicas. La confirmación de la víspera sale de la lista: ya está y no
   funciona.
4. **Ya no necesito que nadie arregle el campo `source`.** Las etiquetas resuelven
   la atribución y la validación contra Meta sale clavada en los cuatro verticales.
