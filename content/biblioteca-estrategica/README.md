# Biblioteca estratégica de Qualivo

| Fichero | Nivel |
|---|---|
| `00-como-funciona.md` | Cómo encaja todo · reglas no negociables |
| `01-dolores.md` | 1 · 49 fugas con ID, lenguaje llano, señal y coste |
| `02-icps.md` | 2 · 12 perfiles de cliente con sus dolores prioritarios |
| `03-angulos.md` | 3 · 12 ángulos de contenido (+ los 12 de venta y el registro) |
| `04-niveles-consciencia.md` | 4 · qué se puede decir en cada nivel |
| `05-matriz.md` | 5 · la combinación, su puntuación y el formato de brief |
| `06-motor-campanas.md` | 6 · de combinación a campaña completa |
| `motor.py` | El motor: cruza, puntúa y saca los cinco «Top» del día |
| `datos/icps.json` | Prioridades, vocabulario y prohibiciones por ICP |
| `datos/senales.json` | **Se actualiza a diario** con lo que sale del radar |
| `datos/historial.json` | Lo publicado, para la antirrepetición |

```bash
python3 content/biblioteca-estrategica/motor.py                 # carril A · orgánico
python3 content/biblioteca-estrategica/motor.py --canal pago    # carril B · el ICP que toque
python3 content/biblioteca-estrategica/motor.py --canal pago --icp ICP-FOR
python3 content/biblioteca-estrategica/motor.py --json          # para el agente
```

Los dolores **no se duplican en JSON**: `motor.py` parsea las tablas de
`01-dolores.md`. Para añadir una fuga, se añade una fila a la tabla y ya entra en
el cruce.
