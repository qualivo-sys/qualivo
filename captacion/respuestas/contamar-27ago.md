# Contamar · Óscar Martínez · borrador pendiente del ok de Maikel

Respondió el 27-ago a las 10:10 al tercer email de la campaña ICP Adelantta:

> "Hola Maikel, Si tienes ese análisis preparado, envíamelo y encantado de
> comentarlo a partir de ahí. Gracias!!"

Primera respuesta con interés real desde el 24 de agosto.

## Lo que comprobé en su web (27-ago)

- `contamar.es`, WordPress. Título: "Asesoría Fiscal y Laboral en Pinto · 36
  años". 500+ empresas según su propia home.
- **26 páginas de servicio distintas**: fiscal, laboral, contable, jurídica,
  mercantil, criptomonedas y blockchain, PRL, RRHH, auditoría contable,
  auditoría fiscal, nóminas, constitución de empresas, desbloquea tu NIF, y más.
- Probé seis de ellas (`/asesoria-fiscal/`, `/asesoria-laboral/`,
  `/asesoria-en-criptomonedas-y-blockchain/`, `/desbloquea-tu-nif-cif/`,
  `/auditoria-contable/`, `/blog/`). **En ninguna hay formulario de contacto.**
  El único `<form>` del HTML es el buscador de WordPress.
- **Un solo formulario de HubSpot en toda la web**, embebido únicamente en
  `/contacto/`: `portalId 4600832`, `formId 03550f96-006e-4d38-9252-71399049408d`.
  Un solo formId para las 26 líneas.
- Llevan GTM (GTM-MGR9TN2K), GA4 y el script de HubSpot en todas las páginas.
- **`contamar.com` no responde por HTTPS.** Resuelve a 217.76.142.79 pero el
  handshake TLS falla en el 443. Por HTTP sí redirige a `contamar.es`. Su correo
  es `@contamar.com`.
- El único correo de contacto publicado es `contamar@contamar.com`, buzón
  compartido y en el dominio que no carga por https.
- Botón de WhatsApp al +34 916 912 456, que es su fijo.

Comprobé el formulario mirando el embed de HubSpot en el HTML, no solo contando
etiquetas `<form>`. Un formulario de HubSpot se inyecta por JavaScript y no
aparece como `<form>` en el HTML servido, así que contar etiquetas habría dado
un falso negativo.

## Borrador de respuesta

**Asunto:** RE: vuestras líneas de servicio en Contamar

> Óscar, aquí lo tienes. Miré contamar.es esta mañana, página por página. Cuatro
> cosas.
>
> **1. Tenéis 26 páginas de servicio y un solo formulario, y no está en ninguna
> de ellas.**
>
> Hay página propia para fiscal, laboral, contable, jurídica, mercantil,
> criptomonedas, PRL, recursos humanos, auditoría, nóminas, constitución de
> empresas, desbloquear el NIF y una docena más. Comprobé seis. En todas, lo
> único que hay para contactar es el botón de WhatsApp.
>
> Vuestro formulario de HubSpot existe, pero vive solo en /contacto/. Alguien que
> llega desde Google buscando "asesoría en criptomonedas" aterriza en esa página,
> lee, y para contactar tiene que volver al menú, encontrar contacto y explicar
> otra vez a qué venía.
>
> **2. Ese formulario es el mismo para las 26 líneas.**
>
> Un único formulario, un único identificador. En vuestro HubSpot todas las
> conversiones entran por la misma puerta y sin etiqueta de línea. Eso es lo que
> te decía en el primer correo, y ahora sé que no era una suposición: el
> problema no es que no midáis, es que lo que medís no distingue entre fiscal,
> laboral y cripto. Sin eso, repartir presupuesto entre líneas es a ojo.
>
> **3. contamar.com no carga por https.**
>
> Tu correo es @contamar.com y la web es contamar.es. Los navegadores hoy van a
> https por defecto. Si alguien coge el dominio de tu firma y lo teclea, se
> encuentra un error de conexión. Por http sí redirige bien a contamar.es, pero
> ese ya no es el camino que toma un navegador. No sé cuánta gente lo hace. Sé
> que arreglarlo no cuesta dinero.
>
> **4. El único correo de contacto de toda la web es contamar@contamar.com.**
>
> Buzón compartido, y encima en el dominio que no responde.
>
> Hasta aquí lo que se ve desde fuera. Lo que decide de verdad el asunto no se ve
> y está en vuestros datos:
>
> Cuántas de esas conversiones acaban en cliente y en qué punto se caen las
> demás. Qué línea concentra el negocio real frente a la que concentra el
> esfuerzo. Y qué pasa dentro de HubSpot cuando entra un contacto: quién lo coge,
> en cuánto tiempo, y qué le ocurre si no responde a la primera.
>
> Con eso encima de la mesa te digo cuál de las cuatro mueve más dinero en
> vuestro caso, que casi nunca es la más aparatosa.
>
> Veinte minutos:
> https://api.leadconnectorhq.com/widget/bookings/llamada-hackthelead
>
> O dime dos huecos que te vengan bien y me adapto.
>
> Maikel
