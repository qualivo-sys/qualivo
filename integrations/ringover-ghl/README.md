# Ringover → GHL · Registro de llamadas (Nuria Roure)

Integración mínima: los agentes **llaman desde Ringover** (app móvil / web / escritorio,
con número español como identificador) y **cada llamada queda registrada como nota en la
ficha del contacto en GoHighLevel** (dirección, agente, número, duración, estado y enlace
a la grabación).

> Alcance actual: **solo registro de llamadas**. Sin transcripción/IA (eso sería una fase
> posterior — ver "Fase 2" abajo). No requiere subir de plan ni el add-on Empower.

## Arquitectura

```
Agente llama desde Ringover (móvil/app)
        │
        ▼
Ringover dispara webhook (fin de llamada)
        │  POST JSON
        ▼
n8n  (workflow incluido en esta carpeta)
        │  1) normaliza el evento
        │  2) busca/crea el contacto en GHL por teléfono (upsert)
        │  3) añade una NOTA con los datos de la llamada
        ▼
GHL · Ficha del contacto → timeline con la llamada
```

Coste de plataforma: **0 € extra** (n8n ya está en el stack). Sin Empower ni cambio de plan.

## Puesta en marcha

### 1. Ringover (telefonía)
1. Dar de alta los **seats de agentes** (Ferran, Alba, Raquel, Eva) y asignarles número
   español. *(Hoy solo existe 1 usuario: Maikel · +34 930 52 37 94.)*
2. Instalarles la **app móvil** (iOS/Android, en español) e iniciar sesión.
3. Activar **grabación de llamadas** (incluida en SMART, básica).
4. **Dashboard > Developer > Webhooks**: activar los eventos de llamada
   (entrante, contestada, perdida, buzón, **fin de llamada/hangup**) y poner como URL la
   del webhook de n8n (ver paso 3).

### 2. GoHighLevel (CRM)
1. En la subcuenta de Nuria: **Settings > Private Integrations** → crear un token con
   permisos sobre **Contacts** (lectura/escritura) y **Notes**.
2. Anotar el **Location ID** de la subcuenta (Settings > Business Profile).

### 3. n8n
1. Importar `n8n-ringover-to-ghl-call-logging.json`.
2. Crear una credencial **Header Auth** llamada `GHL Private Token (Header Auth)`:
   - Name: `Authorization`
   - Value: `Bearer <TU_PRIVATE_INTEGRATION_TOKEN>`
   - Asignarla a los dos nodos HTTP (`GHL · Buscar/crear contacto` y `GHL · Añadir nota`).
3. En el nodo **`Normalizar llamada`**, editar:
   - `GHL_LOCATION_ID` → el Location ID de Nuria.
   - `RINGOVER_DIDS` → lista de números españoles de Ringover.
4. **Activar** el workflow y copiar la **Production URL** del nodo `Webhook · Ringover`
   → pegarla en la configuración de webhooks de Ringover (paso 1.4).

### 4. Validación
1. Hacer una llamada de prueba desde la app de Ringover.
2. Revisar la ejecución en n8n: el nodo `Normalizar llamada` incluye el payload crudo en
   el campo `raw`. **Confirmar que los nombres de campo coinciden** (caller/receiver,
   direction, duration, record…). Si Ringover usa otros nombres, ajustar los mapeos en ese
   nodo (están centralizados y comentados).
3. Comprobar que en la ficha del contacto en GHL aparece la nota de la llamada.

## Notas / decisiones tomadas
- **SMART** incluye API + webhooks + grabación básica → suficiente para esta fase.
- **Un número español solo llama a España** (perfecto para la audiencia de Nuria).
- Para no duplicar notas, el workflow registra **solo en el evento terminal** de la llamada
  (hangup/missed/voicemail/ended). Ajustable en el nodo `¿Llamada terminada?`.
- El mapeo de campos del webhook se **confirma contra el primer payload real** (campo `raw`).

## Fase 2 (futuro, opcional) — Transcripción en GHL
Sin Empower (que es caro): n8n descarga la grabación → Whisper/Deepgram → resumen con un LLM
→ se añade a la nota. Coste estimado ~20-30 €/mes a volumen alto. No incluido en esta fase.

## Pendiente del cliente
- [ ] Decidir si Ringover **sustituye a CloudTalk** (hay una tarea de onboarding CloudTalk en Notion).
- [ ] Provisionar seats + números para Ferran, Alba, Raquel, Eva.
- [ ] Facilitar **Private Integration token** + **Location ID** de GHL.
- [ ] Confirmar acceso a la instancia de **n8n** para desplegar el workflow.
