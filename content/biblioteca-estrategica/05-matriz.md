# Nivel 5 · La matriz

## La combinación

```
ICP × DOLOR × ÁNGULO × NIVEL  →  una pieza
```

Tamaño real del espacio con la biblioteca de hoy: **12 ICPs × 49 dolores × 12 ángulos
× 5 niveles**, filtrado por las reglas de compatibilidad de abajo. En bruto son
decenas de miles de coordenadas; lo que importa no es el número, es que **nunca hay
que inventar de cero: hay que elegir**.

## Reglas de compatibilidad (lo que poda el espacio)

1. **Dolor ↔ ICP**: el dolor tiene que estar en la lista de prioritarios de ese ICP
   (`02-icps.md`), o ser uno de los 8 dolores de entrada.
2. **Ángulo ↔ Nivel**: solo las casillas marcadas en la tabla de `04-niveles-consciencia.md`.
3. **`A-CASO` bloqueado** hasta que exista un piloto cerrado con permiso.
4. **`A-TEND` caduca a los 7 días** de la señal que lo originó.
5. **Antirrepetición**: la misma combinación no vuelve en 60 días; el mismo *dolor*
   no vuelve en 14; el mismo *ángulo* no va dos piezas seguidas.

## La puntuación

Cada combinación candidata se puntúa de 0 a 100:

| Factor | Peso | De dónde sale |
|---|---|---|
| **Señal caliente** | 30 | El dolor aparece esta semana en el radar de IA, en el radar comercial (empresas contratando ese puesto), o en una conversación real de Maikel |
| **Prioridad del ICP** | 20 | Ranking de `02-icps.md` (ICP de la semana = máximo) |
| **Peso del dolor para ese ICP** | 20 | Posición en su lista de prioritarios |
| **Encaje ángulo × nivel** | 15 | Casilla fuerte / casilla válida |
| **Cuota de nivel pendiente** | 10 | Si al reparto semanal (30/30/25/10/5) le falta ese nivel, sube |
| **Frescura** | 5 | Días desde la última vez que se usó ese ángulo o ese dolor |
| **Penalizaciones** | −∞ | Cualquier regla de compatibilidad incumplida descarta la combinación |

**Lo que hace ganar a una combinación es casi siempre la señal.** Sin señal, todas
las combinaciones puntúan parecido y el motor rota por cuota. Con señal —«esta
semana tres clínicas de la zona han publicado oferta de coordinador de pacientes»—
una combinación se dispara y arrastra la semana entera.

## El formato de salida

Cada combinación ganadora sale expandida así (es el brief completo, listo para producir):

```
CÓDIGO      ICP-CLI · D-COM-01 · A-COSTE · N2
TITULAR     «La persona que quiere un implante y la que pregunta por una limpieza
             reciben exactamente la misma llamada.»
ESCENA      Recepción. Tres personas esperando, el teléfono sonando, el WhatsApp
             del centro con 40 mensajes sin abrir.
GIRO        No es un problema de personal. Es que nadie ha decidido a quién se
             llama primero.
COSTE       Las horas de tu mejor profesional en la consulta menos rentable.
CTA         Escríbeme FUGAS.
FORMATO     Reel 25-35 s · voz en off + b-roll (sin cara a cámara)
NO DECIR    lead scoring · cualificación · funnel · CRM
```

## Los cinco «Top» diarios

No son cinco decisiones: son **la combinación ganadora expresada en cinco formatos**.

| Salida | Qué es | Cuántas |
|---|---|---|
| **Contenidos** | Piezas orgánicas (reel, carrusel, post, email) con su brief | 10 |
| **Anuncios** | La misma idea con palanca de venta (eje B) + variante de creatividad | 5 |
| **Lead magnets** | Normalmente el ángulo `A-DIAG` convertido en herramienta | 3 |
| **Landings** | La promesa de la combinación como página, con su titular y su prueba | 3 |
| **Campañas** | Secuencia completa: ver `06-motor-campanas.md` | 3 |

Los diez contenidos **no son diez temas**: son un ICP, tres o cuatro dolores y
cinco niveles. Por eso la semana tiene hilo conductor.

## El registro

Todo lo que se propone y todo lo que se publica queda en **`📊 QUALIVO DAILY`**
(Notion). El motor lo consulta antes de proponer para aplicar la antirrepetición, y
después de publicar para aprender qué combinaciones generaron conversación real.

**El bucle que importa**: combinación → pieza → conversaciones que abrió → vuelve a
la puntuación como señal. A las pocas semanas el motor deja de proponer por teoría
y empieza a proponer por lo que a este negocio le funciona.
