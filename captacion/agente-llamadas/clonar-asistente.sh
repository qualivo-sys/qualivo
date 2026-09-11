#!/usr/bin/env bash
# Clona el asistente de voz maestro para una campaña nueva y devuelve el id del
# clon, que es lo que va en VAPI_ASSISTANT_ID.
#
#   export VAPI_API_KEY=...
#   bash clonar-asistente.sh "Raquel · Landing Diagnóstico"
#
# El maestro no se toca: solo se lee. Si el clon sale mal, se borra con
#   curl -X DELETE https://api.vapi.ai/assistant/<id> -H "Authorization: Bearer $VAPI_API_KEY"
set -euo pipefail

MAESTRO="${MAESTRO:-fe2ed34d-82e9-4c6b-b351-8acf90d9dcce}"   # Qualivo SDR · no editar
NOMBRE="${1:-Raquel · Landing Diagnóstico}"

: "${VAPI_API_KEY:?falta VAPI_API_KEY en el entorno}"

echo "Leyendo el maestro $MAESTRO…"
CUERPO=$(curl -sS -f "https://api.vapi.ai/assistant/$MAESTRO" \
  -H "Authorization: Bearer $VAPI_API_KEY")

# Fuera los campos que pertenecen al original; el resto viaja igual.
LIMPIO=$(printf '%s' "$CUERPO" | python3 -c "
import json,sys
a=json.load(sys.stdin)
for k in ['id','orgId','createdAt','updatedAt','isServerUrlSecretSet']:
    a.pop(k,None)
a['name']=sys.argv[1]
print(json.dumps(a))
" "$NOMBRE")

echo "Creando el clon «$NOMBRE»…"
CLON=$(curl -sS -f -X POST https://api.vapi.ai/assistant \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "$LIMPIO")

ID=$(printf '%s' "$CLON" | python3 -c "import json,sys;print(json.load(sys.stdin)['id'])")
echo
echo "VAPI_ASSISTANT_ID=$ID"
echo
echo "Siguiente paso: pega el prompt de clon-landing-diagnostico.md en ese asistente"
echo "y comprueba que tiene la función agendar_diagnostico conectada al webhook"
echo "agente-llamadas-agendar (n8n 7q7jDW4mNgLQ5FFY). El maestro no la tenía, y por"
echo "eso salieron 0 citas de 12 conversaciones reales el 10-sep."
