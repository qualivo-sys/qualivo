# Paquete Paid · Google Ads y retargeting en Meta · estado al 22-oct

Encargo de Chief of Staff, de parte de Maikel (22-oct). Entrega: martes 27-oct a las 13:00. Destinos: qualivo.io/formacion/ y qualivo.io/reformas/. Nada se activa sin el OK de Maikel. E-01 no se toca hasta el 31-oct.

## Revisión inicial (22-oct, solo lectura)

**Medición en las landings** [C, código público de las dos landings, 22-oct]:
- Píxel de Meta 879197745226987 y GA4 G-LVDQS0MXF4, cargados por `/assets/consent.js` con consentimiento.
- **No hay etiqueta de Google Ads** (ningún AW-) ni Conversion Linker.
- El formulario envía a `/api/diagnostico` la query string completa como `utm`. Un gclid de la URL viajaría ahí, pero **no se ha comprobado** que llegue a un campo propio de GHL. Para importar conversiones offline a Google Ads tiene que ir en un campo propio. Responsables: Growth y Automations.

**Eventos del píxel, últimos 28 días** [C, Meta /stats, 22-oct]. Algunos llegan por la API de conversiones desde GHL:

| Evento | Recuento |
|---|---|
| PageView | 478 |
| DiagnosticoFormView | 88 |
| Qualified | 28 (la definición cambió el 20-oct) |
| Contacted | 20 |
| Schedule | 19 |
| Disqualified | 14 |
| DiagnosticoFormStart | 9 |
| Lead | 8 |
| Converted | 1 |

**Audiencias de retargeting existentes** [C, Meta /customaudiences, 22-oct]. Todas están por debajo de 1.000 personas: Meta muestra «1000» como suelo.

| Audiencia | Ventana |
|---|---|
| Web Maikel | 30 días |
| Web Observatorio | 30 días |
| Vídeos | 365 días |
| Forms_abiertos | 90 días |
| Maikel IG | 365 días |

No hay ninguna audiencia web por sector (/formacion/ o /reformas/).

**No usables por regla:** las audiencias «Copy of seguidores de @…» (unas 17 listas CSV de seguidores sacados de otras cuentas) y sus lookalikes. Se excluyen de este paquete. Propuesta para Maikel: borrarlas.

**Google Ads:** Paid no tiene acceso a ninguna cuenta. Si no lo hay antes del 27-oct, se entrega el paquete listo para cargar (Editor o CSV).

## Plan hasta el martes

1. Pedir a Maikel acceso a Google Ads, o confirmar que no hay cuenta.
2. Investigar las búsquedas de formación y reformas B2B (DinoRANK). Ya hay datos del 14 y el 21-oct.
3. Crear las audiencias web por sector y de vídeo, solo para medir su tamaño. Crear una audiencia no gasta ni entrega anuncios.
4. Definir las conversiones con Growth y Automations: solicitud, reserva, reunión celebrada con encaje y cliente.
5. Montar las campañas de Meta en pausa con sus IDs. Google, en pausa si hay acceso; si no, el paquete listo para cargar.
6. Pedir a Creative solo las adaptaciones necesarias.
