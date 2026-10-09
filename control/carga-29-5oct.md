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

---

## Copy cambiado a media secuencia · 5-oct, misma tarde

Maikel no se quedó convencido con la versión que salió y pidió cambiarla. Decisión suya, hecha.

**Lo que ya no se puede deshacer:** los 28 leads vivos recibieron el correo 1 esta mañana. Eso
está enviado y no hay vuelta.

**Lo que se ha cambiado:** `body2` (sale el jueves 8) y `body3` en los 28. Verificado leyendo de
vuelta lead a lead: **28 de 28 con el texto nuevo y sin rastro del viejo**, cero campos vacíos.
`subject1` y `body1` sin tocar, comprobado con un control.

Gastrouni queda fuera: contestó «No gracias» y su estado es COMPLETED.

### La estructura nueva, y por qué es mejor

Es la de Maikel. Lo que hace mejor que la mía:

- **La pregunta se puede contestar.** «¿Tenéis definido qué seguimiento recibe o depende de cada
  persona?» tiene dos respuestas y las dos son fáciles. La mía acababa en «¿Te va bien esta
  semana?», que pide una reunión antes de habérsela ganado.
- **No vende.** La mía metía la propuesta de valor, el mes sin coste y la llamada en el primer
  correo. Esta pide permiso para mandar una idea: «¿Te la paso?». Un sí mucho más barato.
- **Más corta.** 55 palabras contra 85.

Adaptada por vertical, porque «no se matricula» no sirve para una ingeniería: formación recibe
*«pide información de un curso y no se matricula»*, servicios recibe *«pide presupuesto y no
cierra a la primera… o depende de cada comercial»*.

### El coste de haberlo cambiado, que es real

**De esta tanda ya no vamos a saber qué hizo cada versión.** Los 28 recibieron el correo 1 con la
versión A y van a recibir el 2 y el 3 con la B. Cualquier respuesta que entre el jueves es
atribuible a la mezcla, no a ninguna de las dos.

Lo dije antes de hacerlo y Maikel lo mantuvo, así que queda escrito aquí y no se discute más. Lo
que sí hay que hacer es **no repetirlo**: la siguiente tanda sale entera con una sola versión, de
principio a fin, y entonces el número significa algo.

Y el dato que lo originó sigue siendo **uno**: un «no gracias» de 29, a los 19 minutos. Eso no
prueba que la versión A fuera mala. Un no rápido puede ser incluso señal de que el correo era
claro.
