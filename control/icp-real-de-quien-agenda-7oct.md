# ¿Se puede replicar el ICP de quien agenda? · 7-oct-2026

Pregunta de Maikel. Respuesta corta: **sí, pero no por el eje que parece.** Al leer las
respuestas una por una, el perfil de empresa de los que agendan no es un perfil, y en
cambio sí hay un patrón de **situación** que es replicable y que explica el único cierre.

---

## 1 · La trampa antes de nada: no tengo el denominador

Sé quién agendó. **No sé a quién escribimos que no agendó.** Eso vive en Smartlead y no
tengo la clave.

Clonar el perfil de los que agendan sin ese dato es sesgo de supervivencia: si el 90% de
todos los contactados ya son PYMEs españolas de servicios, entonces «los que agendan son
PYMEs españolas de servicios» no informa de nada. Solo sirve si los que agendan se
**diferencian** de los que no.

Lo digo de entrada porque esta semana he cometido dos veces ese mismo tipo de error:
filtré 22 empresas por una regla que no existía, y dejé caer `person_locations` de una
búsqueda. El patrón del error es el mismo: mi criterio más estricto o más suelto que el
dato.

## 2 · El perfil de empresa no es un perfil

| Quién agendó | Qué es | Correo |
|---|---|---|
| Alpha Media Group · **el único cierre** | publicidad exterior, outdoor planner | corporativo |
| Skolae / Abilways | formación B2B, multinacional, Castellana 200 | corporativo |
| Asla Green Solutions | sostenibilidad, B Corp, persona en huso EDT | corporativo |
| Dataslayer | SaaS de datos | corporativo |
| ADELANTTA | financiación alternativa | corporativo |
| TALKUAL | alimentación, migrando la web | corporativo |
| Escuela Giner | educación infantil, un ciclo privado | corporativo |
| NutriPsicoSalud | clínica | corporativo |
| EHE Institute | formación | corporativo |
| **Centro Ana Claros** | clínica dental | **gmail** |
| **Música de los Ríos** | escuela de música | **yahoo** |

El ICP escrito dice «empresa de servicios de 500k-1M€ con dirección comercial muy
involucrada». Lo que agenda incluye una clínica dental que escribe desde gmail, una
escuela de música desde yahoo y una multinacional francesa de formación en la
Castellana. **Eso no es un ICP, ni son dos.**

Y los cargos tampoco cuadran: el que cerró es **CEO** (Sergi López, Alpha Publicidad),
y en Skolae quien contesta es **Responsable de Marketing**, no dirección comercial.

## 3 · Por dónde entraron, que es el dato que de verdad manda

Esto es lo que invalida el clonado directo. Hay evidencia literal en los hilos:

- **Reserva automática, se agendaron solos:** Asla. Prueba textual, correo del 24-sep:
  *«quería presentarme antes del lunes, que hasta ahora solo has visto la reserva
  automática»*. Dataslayer igual: la reunión se titula «Adela Delso · Diagnóstico
  Qualivo» y la acepta Carolina. CANCOMAR, de mañana, también.
- **Referido:** Skolae. Correo del 22-sep: *«te escribo porque Raquel me pasó tu
  contacto. Hablamos en julio por LinkedIn»*.
- **Relación previa:** Andrea Acha, el hilo se llama «Lanzamiento septiembre».
  ADELANTTA, hilo abierto desde el 10-sep.
- **Anuncios:** Lola y Martín.
- **Correo frío con señal:** Alpha Media, TALKUAL, EHE, Giner, Ana Claros, Música de los
  Ríos, Izas.

**Cerca de la mitad de los que agendaron no vinieron de correo frío.** Se agendaron
solos en el calendario, los trajo un referido, o venían de un hilo antiguo.

Si clonamos «el perfil de quien agenda» y lo metemos en outbound frío, estamos clonando
gente que en buena parte **no entró por ahí**. Quien se reserva solo en el calendario ya
está autoseleccionado: su firmografía no dice nada sobre quién contesta un correo frío.

## 4 · El patrón que SÍ es replicable, y no es firmográfico

Mirando lo que dijeron, no lo que son:

| Cuenta | Lo que dijo |
|---|---|
| **Alpha Media** | *«no necesitas que te traigan más contactos. Tienes 8.000 en Zoho»* |
| Skolae | dos puertas de entrada del mismo cliente y sin visibilidad de ninguna |
| ADELANTTA | *«recibís muchas propuestas con fórmulas generales que no conocen vuestro negocio»* |
| Escuela Giner | un solo ciclo privado, la cuenta tiene que salir con esas matrículas |

El hilo común de los que más engancharon es **«ya tengo contactos o demanda y no sé qué
pasa con ellos»**. Un depósito sin trabajar.

**Alpha Media es el caso puro: 8.000 contactos parados en Zoho. Y es el único cierre.**

Eso sí se puede buscar, y además coincide con la puerta que ya lo trajo: empresas que
**compran demanda** (anuncios activos) y **tienen dónde apilarla** (CRM instalado). No
«empresa de servicios de 50 empleados».

## 5 · Qué haría y qué no

**No gastaría créditos en enriquecer a los 12 que agendaron.** Serían 12 créditos de los
2.304 que quedan, así que no es el coste lo que me frena: es que el eje firmográfico ya
se ha demostrado incoherente en el punto 2. Pagaría por el dato menos útil.

**Lo que haría, por orden:**

1. **Sacar el denominador de Smartlead.** Quién recibió correo y no agendó, con su
   puerta. Sin eso, cualquier perfil que yo saque hoy es supervivencia. Necesita la
   clave.
2. **Convertir la situación en criterio de búsqueda**, no la firmografía: anuncios
   activos más CRM instalado. Es lo que ya trajo a Alpha Media.
3. **Separar las reservas automáticas del resto en el análisis.** Hoy están mezcladas y
   contaminan cualquier conclusión sobre el copy. Los que se agendan solos miden la
   landing y el calendario; los de correo frío miden el mensaje.
4. **Mirar el cargo, no solo la empresa.** El que cerró es CEO. En las cuentas pequeñas
   el CEO es el decisor y la venta se cierra en una conversación, y eso enlaza con lo del
   informe de esta mañana: las que se atascan son las que tienen un segundo decisor
   fuera de la sala.

## 6 · Una cosa que no puedo afirmar

Que las reservas automáticas y los referidos sean «cerca de la mitad» lo tengo sólido en
dos casos con cita textual, Asla y Skolae, y en el resto lo estoy **infiriendo de la
estructura del hilo**. No es medición. Con la clave de Smartlead se cuenta exacto en diez
minutos.
