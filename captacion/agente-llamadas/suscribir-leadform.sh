#!/usr/bin/env bash
# Suscribe una página de Facebook al webhook de leads. Hasta que no se ejecuta
# esto, el formulario instantáneo recoge leads pero no nos avisa de ninguno.
#
#   export META_LEADFORM_TOKEN=...   # el de sistema
#   bash suscribir-leadform.sh <PAGE_ID>
#
# Antes hay que tener en Vercel META_LEADFORM_VERIFY y META_LEADFORM_TOKEN, y en
# la app de Meta el webhook apuntando a https://qualivo.io/api/meta-leadform/
# (con barra final) suscrito al campo «leadgen».
set -euo pipefail
: "${META_LEADFORM_TOKEN:?falta META_LEADFORM_TOKEN}"
PAGINA="${1:?uso: suscribir-leadform.sh <PAGE_ID>}"
GRAPH=https://graph.facebook.com/v21.0

echo "Sacando el token de la página $PAGINA…"
TOKEN_PAGINA=$(curl -sS -f "$GRAPH/$PAGINA?fields=access_token&access_token=$META_LEADFORM_TOKEN" \
  | python3 -c "import json,sys;print(json.load(sys.stdin)['access_token'])")

echo "Suscribiendo la página al campo leadgen…"
curl -sS -f -X POST "$GRAPH/$PAGINA/subscribed_apps" \
  -d "subscribed_fields=leadgen" -d "access_token=$TOKEN_PAGINA"
echo

echo "Comprobando:"
curl -sS -f "$GRAPH/$PAGINA/subscribed_apps?access_token=$TOKEN_PAGINA" \
  | python3 -c "
import json,sys
for a in json.load(sys.stdin).get('data',[]):
    print(' ', a.get('name'), '->', ', '.join(a.get('subscribed_fields',[])))"
