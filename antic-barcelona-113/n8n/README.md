# Aviso de lead — n8n

Cada lead que entra por la web dispara un correo. Es lo que hace que el SLA de
2 horas para los HOT sea real y no un adorno del documento.

**Flujo:** `Antic Barcelona 113 · Aviso de lead` · `ACFfAUUNolBIr1DH`
**Webhook:** `https://qualivo.app.n8n.cloud/webhook/ab113-lead`

```
web → api/lead.js → hoja de cálculo          (esto es lo que no puede fallar)
                  ↘ webhook de n8n → correo   (esto es lo que avisa)
```

Las dos ramas son independientes a propósito. Si n8n se cae, el lead ya está
guardado y solo se pierde el aviso: eso se arregla mirando el CRM. Al revés no
tiene arreglo.

## Autenticación

El webhook usa una credencial de cabecera (`x-ab113-secret`), no una
comprobación dentro del nodo de código. Dos razones: n8n Cloud bloquea el
acceso a variables de entorno desde los nodos de código —`$env` lanza «access
to env vars denied»—, y comprobarlo en la entrada es mejor de todos modos
porque rechaza con 403 antes de ejecutar nada.

El valor es el mismo `LEAD_SHARED_SECRET` que tiene Vercel. `api/lead.js` lo
manda en la cabecera y también en el cuerpo, por si algún día el destino
vuelve a ser Apps Script, que no puede leer cabeceras personalizadas.

## El correo

El asunto lleva delante lo que decide si hay que abrirlo ahora o luego, porque
es lo único que se lee desde la pantalla de bloqueo:

```
🔥 LEAD HOT · Marta Ribas · Mesa de comedor 240 × 100 cm
Lead nuevo · Sergi Bonet
```

Dentro: aviso rojo si es HOT con el SLA de 2 horas, todo lo que contestó,
botón de WhatsApp que abre la conversación con su número y enlace al CRM.

Sale desde la credencial SMTP `info@maikelechevarria.com`, que ya existía en
el n8n. Para añadir destinatarios, el campo `toEmail` del nodo **Mandar el
correo** admite varios separados por coma.

## Volver a montarlo

`lead-aviso.json` es el flujo exportado, con el id de la credencial puesto a
`PENDIENTE` para no guardarlo en el repositorio.

```
# crear la credencial de cabecera y anotar su id
curl -X POST -H "X-N8N-API-KEY: $K" -H 'Content-Type: application/json' \
  https://qualivo.app.n8n.cloud/api/v1/credentials \
  -d '{"name":"AB113 · cabecera","type":"httpHeaderAuth",
       "data":{"name":"x-ab113-secret","value":"<LEAD_SHARED_SECRET>"}}'

# sustituir PENDIENTE por ese id y subir el flujo
curl -X POST -H "X-N8N-API-KEY: $K" -H 'Content-Type: application/json' \
  --data-binary @n8n/lead-aviso.json \
  https://qualivo.app.n8n.cloud/api/v1/workflows
```

Después, activarlo con `POST /api/v1/workflows/<id>/activate`.
