# Aviso de lead — n8n

Cada lead que entra por la web dispara dos cosas: el aviso al comercial y, si
viene de la guía, el PDF al propio lead.

El aviso es lo que hace que el SLA de 2 horas para los HOT sea real y no un
adorno del documento. La guía es lo que prometemos en el anuncio: si no llega,
hemos pagado por un clic y encima hemos quedado mal.

**Flujo:** `Antic Barcelona 113 · Leads` · `ACFfAUUNolBIr1DH`
**Webhook:** `https://qualivo.app.n8n.cloud/webhook/ab113-lead`

```
web → api/lead.js → hoja de cálculo               (esto es lo que no puede fallar)
                  ↘ webhook de n8n ┬→ aviso al comercial   (siempre)
                                   └→ guía en PDF al lead  (solo si origen = guia)
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

## Por qué la guía se manda desde aquí

Estaba en Apps Script, que hay que desplegar a mano desde la cuenta de Google
del cliente. Con las campañas ya encendidas eso era un problema real: dos de
los cuatro anuncios llevan a `/guia`, así que había gente descargándose una
guía que no le llegaba. Moverlo a n8n lo desbloquea sin depender de nadie.

El PDF no se guarda en n8n: se descarga de la web publicada en cada envío. Así
el adjunto siempre es la versión que está online y no hay dos copias que se
desincronicen.

**Pendiente:** sale desde `info@maikelechevarria.com` con el nombre visible
«Antic Barcelona 113» y responder-a `info@anticbarcelona113.com`. Funciona,
pero lo correcto es enviarlo desde el dominio del cliente con SPF y DKIM
configurados. Mientras siga así, la dirección real que ve quien mire la
cabecera es la de la agencia.

## El aviso al comercial

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

---

# Vigilar la web — n8n

**Flujo:** `Antic Barcelona 113 · Vigilar la web` · `Bkar0vJ79IEHb8dY` · cada 10 min

Comprueba `/cuestionario` y `/guia`, que son las dos páginas a las que llevan
los anuncios: son las que cuestan dinero si fallan. Si alguna no responde bien,
manda un correo.

**No basta con mirar el código 200.** El fallo que motivó esto fue un
despliegue de otro proyecto encima del nuestro: habría devuelto 200 con una web
ajena y el vigilante habría dicho que todo iba bien. Así que se comprueba
también que el HTML contenga «Antic Barcelona 113».

## Qué pasó

El proyecto de Vercel estaba conectado a `qualivo-sys/qualivo` con la rama de
producción puesta en `claude/eac-metrics-dashboard-qx7fkh`, de otro cliente.
Al empujar a esa rama, Vercel construyó desde la raíz del monorepo —donde no
está la landing— y sobrescribió el alias de producción. Todas las URLs pasaron
a 404, incluida la portada, con las campañas gastando.

**Arreglo:** se desconectó el proyecto de git. Ahora solo se despliega desde la
CLI, con `vercel deploy --prod` desde `landing/`. Si algún día se quiere
recuperar el despliegue automático, hay que poner el `rootDirectory` del
proyecto en `antic-barcelona-113/landing` **y** la rama de producción en una
rama de este proyecto. Con un monorepo compartido entre clientes, cualquiera de
las dos cosas mal vuelve a tirar la web.
