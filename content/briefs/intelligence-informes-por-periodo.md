# Brief · Qualivo Intelligence · «Informes» por mes y por semana

Pedido por Maikel el 2-oct-2026. Para la sesión que lleva Qualivo Intelligence.

## Qué quiere

En el apartado **Informes** de Qualivo Intelligence, una vista general para todos
los clientes, Qualivo incluido, que enseñe el embudo **por mes y por semana**, con
selector de periodo. Es lo mismo que ya está montado a mano para Qualivo en la hoja
«Facturación», pestaña **«Por meses»**
(https://docs.google.com/spreadsheets/d/1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0/edit#gid=1130139996).
Úsala como referencia de filas, definiciones y avisos.

## Métricas, en este orden

1. Inversión en anuncios.
2. Campañas activas, es decir, con gasto en el periodo.
3. Leads, con dos cuentas: los que da la plataforma de anuncios y los del CRM.
4. CPL.
5. Reuniones agendadas, separando pago de outbound y referidos.
6. Reuniones efectivas.
7. No-show y canceladas.
8. Show rate.
9. Coste por reunión efectiva.
10. No-show recuperados (los que vuelven a reservar y vienen).
11. Segundas reuniones.
12. Propuestas enviadas.
13. En negociación.
14. Dinero en juego: suma de los tratos abiertos en Oferta, Segunda reunión y Negociación.
15. Pilotos.
16. Clientes nuevos.
17. Clientes activos.
18. CAC: inversión dividida entre clientes nuevos. Si no hay clientes nuevos, «no calculable» y coste por piloto.

## Desgloses

- **Columnas por periodo:** mes y semana de lunes a domingo, en hora de Madrid.
- **Columnas por vertical**, según el nombre de campaña o conjunto y la etiqueta `sector-*` del contacto.
- **Debajo, la tabla de tratos abiertos con importe**, con estas columnas:
  - empresa;
  - etapa;
  - importe;
  - vertical;
  - origen;
  - último cambio;
  - siguiente paso.

## Fuentes y reglas

- **Meta Marketing API.** Insights por mes y por semana con `time_increment`. Los leads son la acción `lead`.
- **GHL, tratos.**
  - Pipeline Prospección `JaB4LIwUqFn96LLFEhSm`.
  - Etapas: Oferta enviada `41c3a02d…`, Segunda reunión `b853294d…`, Negociación `3e12a08f…`, Piloto `138c0901…`, Cliente `673ee555…`.
  - El importe es `monetaryValue`, que hoy vale puesta en marcha + 3 meses.
- **Reuniones.**
  - **Desde el 1-oct**, el registro por cita (`api/_citas.js`, nota `##QV-CITA##` en el contacto, con `appointment_id`, `tipo`, `status` y `resultado`). Esa es la fuente buena.
  - **Antes del 1-oct** hay que reconstruirlas con estas fuentes:
    - la etiqueta `reunion-celebrada` o `no-presentado`;
    - el `appointmentStatus` de la cita;
    - la etapa del trato.

    Marca esas cifras como «reconstruido».
  - **No mezclar segundas reuniones con diagnósticos.** El tipo de cita sale de `_citas.tipoDe`: `diagnostico`, `segunda` u `otro`.
- **«NO MEDIDO» cuando no se pueda reconstruir.** Nunca una cifra inventada.

## Cifras de Qualivo para cuadrar la primera versión (septiembre 2026)

| Métrica | Valor |
|---|---|
| Inversión | 697,99 € |
| Leads Meta | 38 |
| CPL | 18,37 € |
| Diagnósticos agendados de pago | 19 |
| Efectivas | 9 |
| No-show | 8 |
| Canceladas | 2 |
| Coste por reunión efectiva | 77,55 € |
| Dinero en juego a 2-oct | 20.500 € |
| Piloto | 1 (octubre) |
| Clientes nuevos | 0 |
