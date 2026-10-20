# Limpieza de campañas y veredicto de las puertas · 8-oct-2026

Maikel dio la clave y pidió revisar y reactivar lo parado. Resultado: **reactivé cinco
puertas por hipótesis, corrí la medición, y la medición me obligó a deshacerlo.**

## El veredicto, con el histórico completo y la regla de Maikel

| Puerta | Env. | Resp. | Tasa | Veredicto |
|---|---:|---:|---:|---|
| **intelligence** | 123 | 6 | **4,9%** | **una semana más, cambiando el ángulo** |
| linkedin-ads | 60 | 1 | 1,7% | insuficiente |
| sin-clasificar | 9.498 | 143 | 1,5% | cerrar |
| zoho | 132 | 2 | 1,5% | cerrar |
| **google-ads** | 221 | 3 | **1,4%** | **cerrar** |
| curso-abierto | 264 | 3 | 1,1% | cerrar |
| odoo / mailchimp / pipedrive / salesforce | 107-130 | 1 | 0,8-0,9% | cerrar |
| activecampaign / meta-ads | 156-177 | 1 | 0,6% | cerrar |
| dynamics / brevo | 111-137 | 0 | 0,0% | cerrar |

**Google Ads era mi hipótesis estrella y está muerta.** El 16-sep hizo 3 de 40 y de ahí
salió Sergi López, la única reunión y el único cierre del correo frío. Con el histórico
son **3 de 221: 1,4%**. Aquel día fue suerte. El 7-oct recomendé doblar esa puerta
diciendo «está medido» y no lo estaba. Ahora sí.

## Lo que he hecho

- **Baja de Hotelverse ejecutada.** Clara Onraita contestó «BAJA» el 7-oct a las 09:50 y
  llevaba 24 horas sin atender. Dominio al bloqueo global, lead pausado.
- **Confirmado que los 3 correos del ABM salieron** el 7-oct 07:02 UTC, paso 1, 0 rebotes.
- **11 campañas pausadas por la regla.**
- **3 colas pequeñas reactivadas** para que terminen (ICP15, Rescate Meta, Señales).
- **LinkedIn Ads se queda activa** hasta llegar a 100 envíos y poder decidir.

Quedan **8 campañas de Qualivo activas**, cada una con motivo escrito.

## Lo que NO he reactivado, y por qué

| Campaña | Motivo |
|---|---|
| Clínicas · precio por WhatsApp | 151 pausados son **buzones de rol**; reactivar rompe la regla |
| Academias ES · Inmobiliarias ES | **orden expresa: no cargar** |
| Infoproducto ES (1.426, 1.363 sin empezar) | **ICP distinto**, creadores de infoproducto. Decisión de Maikel |
| Construcción, Solar, Obra, Asesorías | verticales antiguas, pendientes de revisión de ICP |
| Las 3 Radiografía PERSONALIZADA | la variante hiperpersonalizada **ya estaba cerrada**: 265 envíos, 0 respuestas |

## El dato que estaba oculto

**El depósito no está a cero: 1.827 leads sin empezar y 1.953 congelados a mitad de
secuencia**, de 6.386 totales. El informe diario decía cero porque solo mira las activas.

No hace falta comprar leads. El problema es que están dentro de puertas que la regla
acaba de cerrar: para usarlos hay que reasignarlos al ángulo Intelligence, y eso pide
copy por lead. **El cuello es la señal, no el pool.**

## Nota técnica

El tope de nuevos leads por día es `max_new_leads_per_day` y va en **`/schedule`**, no en
`/settings`. `settings` lo rechaza con «is not allowed».
