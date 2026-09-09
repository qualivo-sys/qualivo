#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Crea (o actualiza) el assistant "Qualivo SDR" en Vapi desde guion.md.
# Uso: python3 vapi_setup.py <vapi_private_key> [assistant_id_para_actualizar]
# Imprime el assistant_id: guardarlo, lo usan n8n y vapi_llamada_prueba.py.
import sys, json, os, urllib.request

KEY = sys.argv[1]
AID = sys.argv[2] if len(sys.argv) > 2 else ""
BASE = os.path.dirname(os.path.abspath(__file__))
GUION = open(os.path.join(BASE, "guion.md")).read()

# Voces candidatas ElevenLabs es-ES (se prueban con llamadas reales al movil
# de Maikel via assistantOverrides.voice en vapi_llamada_prueba.py):
VOCES = {
    "candidata_1": {"provider": "11labs", "voiceId": "onwK4e9ZLuTAKqWW03F9", "model": "eleven_multilingual_v2"},  # Daniel
    "candidata_2": {"provider": "11labs", "voiceId": "TX3LPaxmHKxFdv7VOQHJ", "model": "eleven_multilingual_v2"},  # Liam
    "candidata_3": {"provider": "11labs", "voiceId": "pNInz6obpgDQGcFmaJgB", "model": "eleven_multilingual_v2"},  # Adam
}

payload = {
    "name": "Qualivo SDR",
    "model": {
        "provider": "openai", "model": "gpt-4o",
        "messages": [{"role": "system", "content": GUION}],
        "temperature": 0.6,
    },
    "voice": {"provider": "11labs", "voiceId": "1eHrpOW5l98cxiSRjbzJ", "model": "eleven_multilingual_v2"},  # Raquel (aprobada 9-sep, cuenta 11labs propia)
    "transcriber": {"provider": "deepgram", "model": "nova-2", "language": "es"},
    "firstMessage": "Hola, ¿{{nombre}}? Mira, te llamo de parte de Maikel Echevarría, de Cualivo. Te escribió hace unos días por email, por lo de {{dato_corto}}. ¿Te pillo bien dos minutos?",
    "firstMessageMode": "assistant-speaks-first",
    "silenceTimeoutSeconds": 12,
    "maxDurationSeconds": 300,
    "recordingEnabled": True,
    # serverUrl (webhook resultados WF3) y la tool "agendar" (WF2) se añaden
    # cuando existan las URLs de n8n: python3 vapi_setup.py <key> <assistant_id>
    # tras rellenar N8N_AGENDA_URL / N8N_RESULTADOS_URL abajo.
}
N8N_AGENDA_URL = os.environ.get("N8N_AGENDA_URL", "")
N8N_RESULTADOS_URL = os.environ.get("N8N_RESULTADOS_URL", "")
if N8N_RESULTADOS_URL:
    payload["server"] = {"url": N8N_RESULTADOS_URL}
if N8N_AGENDA_URL:
    payload["model"]["tools"] = [{
        "type": "function",
        "function": {
            "name": "agendar",
            "description": "Reserva la reunion de 15 minutos con Maikel en el hueco elegido por el lead",
            "parameters": {"type": "object", "properties": {
                "slot_elegido": {"type": "string", "description": "dia y hora elegidos, ej 'martes 10:30'"},
                "email_confirmado": {"type": "string", "description": "email del lead confirmado en voz alta"}},
                "required": ["slot_elegido"]},
        },
        "server": {"url": N8N_AGENDA_URL},
    }]

url = "https://api.vapi.ai/assistant" + ("/" + AID if AID else "")
req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                             headers={"Authorization": "Bearer " + KEY,
                                      "Content-Type": "application/json"},
                             method="PATCH" if AID else "POST")
r = json.loads(urllib.request.urlopen(req).read())
print("assistant_id:", r.get("id"))
