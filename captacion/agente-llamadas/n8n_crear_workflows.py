#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Crea los 3 workflows del agente de llamadas en n8n via API publica.
# Sin secretos: los tokens van como placeholders que se rellenan en la UI.
# Uso: python3 n8n_crear_workflows.py <n8n_url> <n8n_api_key>
import sys, json, urllib.request

N8N, KEY = sys.argv[1].rstrip("/"), sys.argv[2]
H = {"X-N8N-API-KEY": KEY, "Content-Type": "application/json"}
PH_VAPI = "PEGA_AQUI_VAPI_PRIVATE_KEY"
PH_PIT = "PEGA_AQUI_TOKEN_PIT_GHL"
PH_LOC = "PEGA_AQUI_LOCATION_ID"
PH_CAL = "PEGA_AQUI_CALENDAR_ID"      # el de qualivo-20 (Llamada de 20 minutos)
PH_PHONE = "PEGA_AQUI_PHONE_NUMBER_ID"  # el numero +34 en Vapi
ASSISTANT_ID = "fe2ed34d-82e9-4c6b-b351-8acf90d9dcce"

def api(path, body=None, method="POST"):
    req = urllib.request.Request(N8N + "/api/v1" + path,
                                 data=json.dumps(body).encode() if body else None,
                                 headers=H, method=method)
    return json.loads(urllib.request.urlopen(req).read())

def wf(name, nodes, connections):
    return {"name": name, "nodes": nodes, "connections": connections,
            "settings": {"executionOrder": "v1"}}

# ---------- WF1 · LANZADOR ----------
wf1 = wf("Agente Llamadas · 1 Lanzador", [
  {"id": "wh", "name": "Webhook Cola", "type": "n8n-nodes-base.webhook", "typeVersion": 2,
   "position": [0, 0],
   "parameters": {"httpMethod": "POST", "path": "agente-llamadas-lanzador",
                  "responseMode": "onReceived"}},
  {"id": "split", "name": "Un lead", "type": "n8n-nodes-base.code", "typeVersion": 2,
   "position": [200, 0],
   "parameters": {"jsCode": "const h=new Date().getUTCHours()+2; const wd=new Date().getDay();\nif(h<10||h>=18||wd===0||wd===6){return [];}\nreturn ($json.body.leads||[]).map(l=>({json:l}));"}},
  {"id": "lote", "name": "De uno en uno", "type": "n8n-nodes-base.splitInBatches",
   "typeVersion": 3, "position": [400, 0], "parameters": {"batchSize": 1, "options": {}}},
  {"id": "vapi", "name": "Vapi Llamar", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
   "position": [620, 0],
   "parameters": {"method": "POST", "url": "https://api.vapi.ai/call",
     "sendHeaders": True,
     "headerParameters": {"parameters": [
        {"name": "Authorization", "value": "Bearer " + PH_VAPI},
        {"name": "Content-Type", "value": "application/json"}]},
     "sendBody": True, "specifyBody": "json",
     "jsonBody": "={{ JSON.stringify({phoneNumberId: '" + PH_PHONE + "', customer:{number:$json.telefono}, assistantId:'" + ASSISTANT_ID + "', assistantOverrides:{variableValues:{nombre:$json.nombre, empresa:$json.empresa, cargo:$json.cargo||'responsable', vertical:$json.vertical, email_que_abrio:$json.email_que_abrio, n_aperturas:String($json.n_aperturas), dato_concreto:$json.dato_concreto, dato_corto:$json.dato_corto, dias_ofrecidos:$json.dias_ofrecidos||'esta semana', email:$json.email}, metadata:{email:$json.email, campana:String($json.campana_id)}}}) }}"}},
  {"id": "espera", "name": "Esperar 4 min", "type": "n8n-nodes-base.wait", "typeVersion": 1.1,
   "position": [840, 0], "parameters": {"unit": "minutes", "amount": 4}},
], {"Webhook Cola": {"main": [[{"node": "Un lead", "type": "main", "index": 0}]]},
    "Un lead": {"main": [[{"node": "De uno en uno", "type": "main", "index": 0}]]},
    "De uno en uno": {"main": [[], [{"node": "Vapi Llamar", "type": "main", "index": 0}]]},
    "Vapi Llamar": {"main": [[{"node": "Esperar 4 min", "type": "main", "index": 0}]]},
    "Esperar 4 min": {"main": [[{"node": "De uno en uno", "type": "main", "index": 0}]]}})

# ---------- WF2 · AGENDA (tool en vivo) ----------
wf2 = wf("Agente Llamadas · 2 Agenda", [
  {"id": "wh", "name": "Webhook Agendar", "type": "n8n-nodes-base.webhook", "typeVersion": 2,
   "position": [0, 0],
   "parameters": {"httpMethod": "POST", "path": "agente-llamadas-agendar",
                  "responseMode": "responseNode"}},
  {"id": "parse", "name": "Parsear tool call", "type": "n8n-nodes-base.code", "typeVersion": 2,
   "position": [200, 0],
   "parameters": {"jsCode": "const m=$json.body.message; const tc=(m.toolCalls||m.toolCallList||[])[0];\nconst args=typeof tc.function.arguments==='string'?JSON.parse(tc.function.arguments):tc.function.arguments;\nreturn [{json:{toolCallId:tc.id, slot:args.slot_elegido, email:(args.email_confirmado||m.call?.metadata?.email||'').toLowerCase(), nombre:m.call?.assistantOverrides?.variableValues?.nombre||''}}];"}},
  {"id": "upsert", "name": "GHL Upsert Contacto", "type": "n8n-nodes-base.httpRequest",
   "typeVersion": 4.2, "position": [400, 0],
   "parameters": {"method": "POST", "url": "https://services.leadconnectorhq.com/contacts/upsert",
     "sendHeaders": True,
     "headerParameters": {"parameters": [
        {"name": "Authorization", "value": "Bearer " + PH_PIT},
        {"name": "Version", "value": "2021-07-28"},
        {"name": "Content-Type", "value": "application/json"}]},
     "sendBody": True, "specifyBody": "json",
     "jsonBody": "={{ JSON.stringify({locationId:'" + PH_LOC + "', email:$json.email, firstName:$json.nombre, tags:['agente-llamadas']}) }}"}},
  {"id": "slotcalc", "name": "Slot a fecha", "type": "n8n-nodes-base.code", "typeVersion": 2,
   "position": [600, 0],
   "parameters": {"jsCode": "// v1: el guion ofrece huecos fijos; mapear 'martes 10:30' etc a la proxima fecha\nconst s=($json.slot||'').toLowerCase();\nconst dias={lunes:1,martes:2,miercoles:3,'miércoles':3,jueves:4,viernes:5};\nlet dow=2; for(const d in dias){if(s.includes(d)){dow=dias[d];break;}}\nconst hm=s.match(/(\\d{1,2})[:. ]?(\\d{2})?/); const h=hm?parseInt(hm[1]):10; const mi=hm&&hm[2]?parseInt(hm[2]):(s.includes('media')?30:0);\nconst now=new Date(); const target=new Date(now);\ntarget.setDate(now.getDate()+((dow-now.getDay()+7)%7||7));\ntarget.setHours(h+(h<8?12:0),mi,0,0);\nconst end=new Date(target.getTime()+15*60000);\nreturn [{json:{...$('Parsear tool call').first().json, contactId:$json.contact?.id||$json.id, startTime:target.toISOString(), endTime:end.toISOString()}}];"}},
  {"id": "cita", "name": "GHL Crear Cita", "type": "n8n-nodes-base.httpRequest",
   "typeVersion": 4.2, "position": [800, 0],
   "parameters": {"method": "POST",
     "url": "https://services.leadconnectorhq.com/calendars/events/appointments",
     "sendHeaders": True,
     "headerParameters": {"parameters": [
        {"name": "Authorization", "value": "Bearer " + PH_PIT},
        {"name": "Version", "value": "2021-07-28"},
        {"name": "Content-Type", "value": "application/json"}]},
     "sendBody": True, "specifyBody": "json",
     "jsonBody": "={{ JSON.stringify({calendarId:'" + PH_CAL + "', locationId:'" + PH_LOC + "', contactId:$json.contactId, startTime:$json.startTime, endTime:$json.endTime, title:'Llamada 15 min · '+$json.nombre+' (agente)', appointmentStatus:'confirmed'}) }}"}},
  {"id": "resp", "name": "Responder a Vapi", "type": "n8n-nodes-base.respondToWebhook",
   "typeVersion": 1.1, "position": [1000, 0],
   "parameters": {"respondWith": "json",
     "responseBody": "={{ JSON.stringify({results:[{toolCallId:$('Parsear tool call').first().json.toolCallId, result:'Reunion confirmada para '+$('Parsear tool call').first().json.slot+'. La invitacion llega ahora por email.'}]}) }}"}},
], {"Webhook Agendar": {"main": [[{"node": "Parsear tool call", "type": "main", "index": 0}]]},
    "Parsear tool call": {"main": [[{"node": "GHL Upsert Contacto", "type": "main", "index": 0}]]},
    "GHL Upsert Contacto": {"main": [[{"node": "Slot a fecha", "type": "main", "index": 0}]]},
    "Slot a fecha": {"main": [[{"node": "GHL Crear Cita", "type": "main", "index": 0}]]},
    "GHL Crear Cita": {"main": [[{"node": "Responder a Vapi", "type": "main", "index": 0}]]}})

# ---------- WF3 · RESULTADOS ----------
wf3 = wf("Agente Llamadas · 3 Resultados", [
  {"id": "wh", "name": "Webhook Resultados", "type": "n8n-nodes-base.webhook", "typeVersion": 2,
   "position": [0, 0],
   "parameters": {"httpMethod": "POST", "path": "agente-llamadas-resultados",
                  "responseMode": "onReceived"}},
  {"id": "filtro", "name": "Solo fin de llamada", "type": "n8n-nodes-base.if", "typeVersion": 2,
   "position": [200, 0],
   "parameters": {"conditions": {"options": {"caseSensitive": True, "typeValidation": "loose"},
     "conditions": [{"leftValue": "={{ $json.body.message.type }}",
                     "rightValue": "end-of-call-report", "operator": {"type": "string", "operation": "equals"}}],
     "combinator": "and"}}},
  {"id": "resumen", "name": "Extraer resumen", "type": "n8n-nodes-base.code", "typeVersion": 2,
   "position": [400, 0],
   "parameters": {"jsCode": "const m=$json.body.message;\nreturn [{json:{email:(m.call?.metadata?.email||'').toLowerCase(), resumen:m.analysis?.summary||m.summary||'', transcript:(m.artifact?.transcript||m.transcript||'').slice(0,4000), grabacion:m.artifact?.recordingUrl||m.recordingUrl||'', duracion:m.durationSeconds||''}}];"}},
  {"id": "upsert", "name": "GHL Upsert Contacto", "type": "n8n-nodes-base.httpRequest",
   "typeVersion": 4.2, "position": [600, 0],
   "parameters": {"method": "POST", "url": "https://services.leadconnectorhq.com/contacts/upsert",
     "sendHeaders": True,
     "headerParameters": {"parameters": [
        {"name": "Authorization", "value": "Bearer " + PH_PIT},
        {"name": "Version", "value": "2021-07-28"},
        {"name": "Content-Type", "value": "application/json"}]},
     "sendBody": True, "specifyBody": "json",
     "jsonBody": "={{ JSON.stringify({locationId:'" + PH_LOC + "', email:$json.email, tags:['agente-llamadas']}) }}"}},
  {"id": "nota", "name": "GHL Nota", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
   "position": [800, 0],
   "parameters": {"method": "POST",
     "url": "=https://services.leadconnectorhq.com/contacts/{{ $json.contact.id }}/notes",
     "sendHeaders": True,
     "headerParameters": {"parameters": [
        {"name": "Authorization", "value": "Bearer " + PH_PIT},
        {"name": "Version", "value": "2021-07-28"},
        {"name": "Content-Type", "value": "application/json"}]},
     "sendBody": True, "specifyBody": "json",
     "jsonBody": "={{ JSON.stringify({body:'[Agente llamadas] '+$('Extraer resumen').first().json.resumen+'\\n\\nGrabacion: '+$('Extraer resumen').first().json.grabacion+'\\n\\nTranscripcion:\\n'+$('Extraer resumen').first().json.transcript}) }}"}},
  {"id": "mail", "name": "Email a Maikel", "type": "n8n-nodes-base.emailSend", "typeVersion": 2.1,
   "position": [1000, 0],
   "parameters": {"fromEmail": "info@maikelechevarria.com", "toEmail": "info@maikelechevarria.com",
     "subject": "=Agente llamadas · {{ $('Extraer resumen').first().json.email }}",
     "emailFormat": "text",
     "text": "={{ $('Extraer resumen').first().json.resumen + '\\n\\nGrabacion: ' + $('Extraer resumen').first().json.grabacion }}"},
   "credentials": {"smtp": {"id": "2lt9aBFiTuuZWMV7", "name": "SMTP Gmail · info@maikelechevarria.com"}}},
], {"Webhook Resultados": {"main": [[{"node": "Solo fin de llamada", "type": "main", "index": 0}]]},
    "Solo fin de llamada": {"main": [[{"node": "Extraer resumen", "type": "main", "index": 0}], []]},
    "Extraer resumen": {"main": [[{"node": "GHL Upsert Contacto", "type": "main", "index": 0}]]},
    "GHL Upsert Contacto": {"main": [[{"node": "GHL Nota", "type": "main", "index": 0}]]},
    "GHL Nota": {"main": [[{"node": "Email a Maikel", "type": "main", "index": 0}]]}})

for w in (wf1, wf2, wf3):
    r = api("/workflows", w)
    print(r.get("id"), "·", r.get("name"))
print("\nWebhooks (activar los workflows en la UI primero):")
for p in ("agente-llamadas-lanzador", "agente-llamadas-agendar", "agente-llamadas-resultados"):
    print(" ", N8N + "/webhook/" + p)
