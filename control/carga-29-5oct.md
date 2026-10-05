# Cargados los 29 · 5-oct-2026

Con el ok de Maikel. Es la primera carga desde el 1-oct.

## Qué se ha hecho

| Campaña | Leads | Estado |
|---|---:|---|
| Formación · Intelligence (4042994) | **9** | ya estaba ACTIVE |
| Servicios B2B · Intelligence (4042995) | **20** | estaba PAUSED, **activada** |

Reparto por vertical a propósito, no todo junto: si se mezclan, la medición por vertical de la
semana que viene no vale nada.

Respuesta de la API en los dos lotes: `ok:true`, **9 y 20 subidos, 0 bloqueados, 0 duplicados,
0 correos inválidos.**

## Las comprobaciones, que es lo que falló el 1-oct

**29 de 29 leads tienen `subject1`, `body1`, `body2` y `body3` rellenos**, leído de vuelta de la
API lead a lead. El 1-oct se cargaron 39 sin `body2` ni `body3` y el día 3 habrían recibido un
correo en blanco con solo la firma.

Antes de activar Servicios B2B comprobé sus buzones: **10 adjuntos, 0 de SURBL.** Si hubiera
tenido alguno, no la activo.

Horario heredado correcto: `Europe/Madrid, L-V, 09:00-18:00`.

## Estado del depósito

| Campaña | Tope | En curso |
|---|---:|---:|
| Servicios B2B · Intelligence | 60 | 20 |
| Formación · Intelligence | 40 | 46 |
| Clínica · Intelligence | 40 | 5 |
| Formación · curso sin cerrar | 15 | 12 |
| Lista · ActiveCampaign | 10 | 6 |
| **Total** | | **89** |

**De 60 leads a 89**, que a 30 envíos/día son **3,0 días**. Vuelve a estar en el umbral, no por
encima. Esto compra la semana, no el mes.

## Qué hay que mirar y cuándo

- **Mañana:** que los 29 recibieran su paso 1, y de qué dominio salió. Lo esperado sigue siendo
  cero por goqualivo y gotqualivo.
- **Jueves 8 (+3 días):** que el paso 2 salga con su `body2`. Es la comprobación que de verdad
  cierra el fallo del 1-oct, porque el día 3 es cuando se vería el correo en blanco.
- **A los 100 envíos:** aplicar la regla por puerta. Formación e Servicios B2B son dos verticales
  distintas y se miden por separado.

## Lo que esta carga NO arregla

El depósito sigue siendo de días, no de semanas. Quedan **24 leads de clase C** de los 133, que
no se cargan porque no son verificables sin trabajo a mano, y **18 cuentas de tipo A** que el
Orchestrator dejó listas y que sí necesitan 20 créditos de Apollo, con el ciclo cerrando el 14-oct.
