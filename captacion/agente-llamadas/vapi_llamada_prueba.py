#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Llamada de prueba del agente AL MOVIL DE MAIKEL con un briefing real.
# Uso: python3 vapi_llamada_prueba.py <vapi_private_key> <assistant_id> \
#        <phone_number_id> <movil_maikel_+34...> [candidata_1|candidata_2|candidata_3]
import sys, json, urllib.request
from vapi_setup import VOCES

KEY, AID, PNID, MOVIL = sys.argv[1:5]
VOZ = VOCES[sys.argv[5]] if len(sys.argv) > 5 else None

briefing = {  # briefing real de ejemplo (Paloma Bravo, 4 aperturas, dato del probe)
    "nombre": "Maikel", "empresa": "Distrito de Salamanca", "cargo": "directora",
    "vertical": "inmo", "email_que_abrio": "leads de portales que se enfrian",
    "n_aperturas": "4",
    "dato_concreto": "vuestra web recibe visitas pero no mide nada, ni Analytics ni etiquetas",
    "dato_corto": "lo que vio en vuestra web",
    "dias_ofrecidos": "martes a las diez y media o jueves a las cuatro",
    "email": "prueba@goqualivo.com",
}
payload = {"phoneNumberId": PNID, "customer": {"number": MOVIL},
           "assistantId": AID,
           "assistantOverrides": {"variableValues": briefing,
                                  "metadata": {"email": briefing["email"], "prueba": True}}}
if VOZ:
    payload["assistantOverrides"]["voice"] = VOZ
req = urllib.request.Request("https://api.vapi.ai/call", data=json.dumps(payload).encode(),
                             headers={"Authorization": "Bearer " + KEY,
                                      "Content-Type": "application/json"}, method="POST")
r = json.loads(urllib.request.urlopen(req).read())
print("llamada creada:", r.get("id"), "| estado:", r.get("status"))
