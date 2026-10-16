# Las cinco verticales en COMPLETED se pueden revivir sin recrearlas · 2-oct-2026

> Corrige lo que dije el 2-oct por la tarde: *«cargarles leads no envía nada, habría que
> recrearlas»*. Lo primero es cierto. **Lo segundo no.**

De las siete campañas por vertical abiertas el 29-sep, cinco pasaron a `COMPLETED` por estar
vacías. Smartlead las cierra cuando no le queda nada que procesar.

Probado hoy sobre `Servicios B2B · Intelligence` (4042995), que tiene 0 leads y por tanto no puede
enviar nada:

```
POST /api/v1/campaigns/4042995/status   {"status":"PAUSED"}
-> {"ok":true}
estado antes: COMPLETED
estado despues: PAUSED
```

**Una llamada por campaña.** No hace falta duplicar nada, ni volver a adjuntar buzones, ni volver a
configurar la secuencia, y por tanto **no hay que hacer POST de secuencia sobre ninguna**, que es la
operación prohibida cuando hay leads dentro.

| Vertical | ID | Estado ahora |
|---|---|---|
| Servicios B2B | 4042995 | **PAUSED** (probado hoy) |
| SaaS y Software | 4042996 | COMPLETED |
| Agencia de marketing | 4042998 | COMPLETED |
| Inmobiliaria | 4042999 | COMPLETED |
| Reformas y Construcción | 4043000 | COMPLETED |

Dejé la primera en PAUSED y no en ACTIVE a propósito: PAUSED es inerte y reversible, y **poner una
campaña en ACTIVE está en la lista de cosas que necesitan el ok de Maikel.**

## El orden correcto, cuando se decida usarlas

1. Status a PAUSED (una llamada por campaña).
2. Cargar los leads **con `subject1`, `body1`, `body2` y `body3` rellenos**. Un lead sin `body2`
   recibe un correo vacío con solo la firma el día 3. Pasó el 1-oct con 39 leads.
3. Pasar la lista por `captacion/scripts/prefiltro_leads.py`.
4. **Entonces** ACTIVE, con el ok de Maikel.

Hacerlo al revés (ACTIVE y luego cargar) es lo que produce envíos en blanco.
