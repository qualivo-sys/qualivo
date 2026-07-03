# VegLiss · Automatizaciones de Klaviyo por API

Toolkit en Node.js + TypeScript para **crear y gestionar flows (automatizaciones)
de email/SMS en Klaviyo por API**, para la cuenta de **VegLiss** (vegliss.es),
gestionada por Qualivo. Empieza por *carrito abandonado* y se extiende a
bienvenida, post-compra, etc.

Sigue el enfoque fiable del brief: **montar 1 flow modelo en la UI → exportar su
definición por API → clonarlo/parametrizarlo por código**, en vez de construir a
mano el JSON gigante de la definición.

---

## Estado de la cuenta (verificado por API)

La cuenta de VegLiss (`XRs8gn`) ya tiene hecho gran parte de lo que el brief daba
por pendiente:

| Pieza | Estado |
|---|---|
| Fuente de eventos | ✅ **Shopify conectado** → llegan `Checkout Started`, `Placed Order`, `Ordered Product`, `Viewed Product`… |
| Flow modelo de carrito abandonado | ✅ **Ya montado**: *"Recordatorio de carrito abandonado"* (`RyFtr5`), con 3 emails + 2 SMS, split por consentimiento y filtro `Placed Order = 0`. Estado `manual`. |
| Otros flows | *Flow de bienvenida* (`UL3RnP`), *Abandono de producto* (`TiJfig`), *Welcome Series* (`XLP7St`). |
| SMS | ✅ En uso (no solo roadmap). |

Las definiciones exportadas de esos flows están en [`base-flows/`](./base-flows)
como plantillas clonables.

---

## Requisitos

- **Node.js ≥ 22.6** (ejecuta TypeScript directamente con type-stripping; **cero
  dependencias en runtime**).
- Una **clave privada** de Klaviyo (empieza por `pk_`, da lectura/escritura).

## Configuración

```bash
cd klaviyo
cp .env.example .env
# edita .env y pega tu clave privada en KLAVIYO_API_KEY
```

`.env` está en `.gitignore`: **la clave nunca se sube al repositorio.**

> ⚠️ **Seguridad**: la clave privada da acceso total de escritura a la cuenta.
> No la pegues en chats, tickets ni commits. Si se expone, **rótala** en
> Klaviyo → Settings → API keys.

## Uso

```bash
# Lectura (no modifican la cuenta):
node src/cli.ts accounts                       # verifica la clave y muestra la cuenta
node src/cli.ts metrics --search checkout      # lista métricas/eventos
node src/cli.ts flows:list                     # lista flows (id, nombre, status)
node src/cli.ts flows:export RyFtr5 --out base-flows/abandoned-cart.base.json
node src/cli.ts templates:list

# Escritura — por defecto DRY-RUN; añade --commit para ejecutar de verdad:
node src/cli.ts templates:create --name "Carrito #1" --html email.html --commit
node src/cli.ts flows:clone  --from RyFtr5 --name "Carrito v2" --params base-flows/params.example.json --commit
node src/cli.ts flows:create --name "Nuevo flow" --definition base-flows/welcome.base.json --commit
node src/cli.ts flows:status <flow_id> live --commit   # activar (draft -> live)
node src/cli.ts flows:delete <flow_id> --commit        # limpiar pruebas
```

También como script npm: `npm run klaviyo -- flows:list`.

### Flujo de trabajo recomendado

1. Monta y valida **1 flow modelo** en la UI de Klaviyo.
2. **Exporta** su definición: `flows:export <id> --out base-flows/mi-flow.base.json`.
3. Prepara un `params.json` (ver [`base-flows/params.example.json`](./base-flows/params.example.json))
   con los cambios: delays, `template_id`, asunto, `from_email`, metric del trigger…
   Las claves de `actions` son los `id` de acción de la definición base.
4. **Clona** parametrizando: `flows:clone --from <id> --params params.json --commit`.
5. (Opcional) crea plantillas HTML con `templates:create` y referencia su `id`
   desde `params.json` (`actions.<id>.message.template_id`).
6. **Activa** el flow: `flows:status <nuevo_id> live --commit`.

> Los flows creados por API entran en **`draft`** y no disparan hasta activarlos.
> Todos los comandos de escritura son **dry-run por defecto**; sin `--commit` solo
> imprimen lo que harían.

---

## Notas técnicas

- **Auth**: `Authorization: Klaviyo-API-Key <clave privada>`. La clave pública
  (site ID de 6 chars) es solo para eventos de cliente en el front, no sirve aquí.
- **Revisión de API**: `2025-07-15` por defecto. Exportar la `definition` de un
  flow requiere **`2025-01-15` o superior** (con revisiones antiguas devuelve
  `additional-fields must be in []`).
- **Rate limits / reintentos**: el cliente ([`src/client.ts`](./src/client.ts))
  aplica un intervalo mínimo entre llamadas (Create Flow permite burst 1/s) y
  reintenta ante `429`/`5xx` con backoff exponencial, respetando `Retry-After`.

### El formato de exportación ≠ el formato de creación

La `definition` que devuelve `GET /flows/{id}` **no** se puede reenviar tal cual a
`POST /flows`. `sanitizeForCreate()` ([`src/provision.ts`](./src/provision.ts))
hace las conversiones necesarias (verificadas contra la API real):

| En la exportación | Al crear |
|---|---|
| Cada acción tiene `id` (id de servidor) | Prohibido: hay que usar `temporary_id` (se conserva el mismo valor para que `entry_action_id` y `links.next*` sigan apuntando bien) |
| `time-delay` en horas incluye `delay_until_weekdays`/`delay_until_time` | Solo permitido si `unit` es `days`; en horas/minutos hay que quitarlos |
| `message.id` en send-email/send-sms | Prohibido al crear; se elimina (el `template_id` sí se reutiliza) |

## Estructura

```
klaviyo/
  src/
    config.ts      Carga de .env y validación de la clave (sin dependencias)
    client.ts      Cliente HTTP: auth, throttling, backoff ante 429/5xx
    flows.ts       list / export(definición) / create / status / delete
    templates.ts   list / create (HTML, editor_type=CODE) / delete
    provision.ts   applyParams() + sanitizeForCreate() (export -> create)
    cli.ts         Interfaz de línea de comandos
  base-flows/      Definiciones exportadas (plantillas clonables) + params.example.json
  .env.example     Plantilla de configuración (copiar a .env)
```

`npm install` solo hace falta para `npm run typecheck` (instala `@types/node` +
`typescript`); la ejecución con `node src/cli.ts` no necesita instalar nada.
