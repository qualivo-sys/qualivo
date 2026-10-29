# Outbound → CoS · SURBL: estado, cambios hechos y solicitud de retirada (29-oct)

## Lo comprobado [C]

- **SURBL:** qualivoedge.com y novaqualivo.com responden `127.0.0.64` en `multi.surbl.org`, que es la lista AB (abuso y spam). goqualivo.com está igual.
- **Spamhaus DBL:** limpio en los dos dominios.
- **Qué falla:** un rechazo «550 A URL in this email (novaqualivo.com) is listed on SURBL» el 29-oct. Es el único rechazo por SURBL de hoy.
- **Los correos no llevan ningún enlace a esos dominios:**
  - la firma de los 10 buzones está vacía;
  - el texto solo nombra qualivo.io, que no está listado;
  - no hay dominio de seguimiento.
  - El dominio solo aparece en las cabeceras (From y Message-ID), y algunos filtros también miran ahí. **Por tanto, no hay ningún enlace que quitar (punto 2).**

## Hecho hoy

| Medida | Detalle |
|---|---|
| novaqualivo a 20 correos/día por buzón | Su reputación está en 81-87% y hay un buzón por debajo del 85%: se aplica la regla del plan |
| qualivoedge sigue a 30/día | Reputación del 100% |
| Vigilancia diaria | Los rechazos 550 por SURBL entran en el triaje horario. Si pasan del 1% de lo enviado, todos los buzones bajan a 20/día |
| Dominios nuevos | Firma sin enlaces, sin dominio de seguimiento y el dominio sin web propia. Rampa de envíos 10 → 20 → 30, y no se sube si la reputación baja del 90% |

## Ritmo recomendado desde el 30-oct

- **~250 correos/día:** qualivoedge 5×30 + novaqualivo 5×20.
- **Carga:** ~80-85 leads nuevos al día.
- **Dominios nuevos:** suman según su rampa.
- **Cuándo subir:** solo si la semana termina con un rebote menor del 2%, bajas menores del 1% y ningún rechazo SURBL nuevo.

## Punto 1 · Solicitud de retirada en SURBL (para Maikel)

**Dónde:** https://www.surbl.org/surbl-analysis. Hay que consultar cada dominio en el lookup. Si sale listado, la página ofrece el formulario de retirada.

**Quién la envía:** no hace falta una cuenta de SURBL. Piden un correo de contacto para confirmar la solicitud, así que mejor que la mande Maikel desde maikel@qualivo.io. No la he enviado yo porque es una comunicación externa en nombre de la empresa.

**Texto para pegar** (uno por dominio, cambiando el nombre):

> Hello,
>
> We kindly request the removal of **qualivoedge.com** from the SURBL AB list.
>
> This domain is used only for the outbound mailboxes of Qualivo (qualivo.io), a small B2B consultancy based in Spain. It hosts no content, it is not linked from any of our emails and it only forwards to our main site.
>
> We send low-volume, plain-text, one-to-one B2B emails, never more than 20-30 per mailbox per day, only to verified business addresses. Every email identifies the sender and offers an immediate opt-out, and opt-outs are processed the same day.
>
> Since detecting the listing we have reduced daily volume and tightened list hygiene: verified addresses only, no catch-all and no role accounts.
>
> Contact: maikel@qualivo.io
>
> Thank you,
> Maikel Echevarría, Qualivo

Para el segundo dominio: el mismo texto con **novaqualivo.com**.
