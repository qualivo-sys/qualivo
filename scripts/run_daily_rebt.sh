#!/usr/bin/env bash
# Actualiza el dashboard REBT (Focus Practical) en Google Sheets.
# Uso: bash scripts/run_daily_rebt.sh <PASSPHRASE>
# La passphrase descifra scripts/rebt_creds.enc (Meta/GHL/Google) en memoria.
set -euo pipefail
PASS="${1:?falta passphrase}"
HERE="$(cd "$(dirname "$0")" && pwd)"
CREDS="$(openssl enc -d -aes-256-cbc -pbkdf2 -pass "pass:$PASS" -in "$HERE/rebt_creds.enc")"
export META_TOKEN="$(printf '%s' "$CREDS" | python3 -c 'import sys,json;print(json.load(sys.stdin)["META_TOKEN"])')"
export GHL_PIT="$(printf '%s' "$CREDS" | python3 -c 'import sys,json;print(json.load(sys.stdin)["GHL_PIT"])')"
export SHEET_ID="$(printf '%s' "$CREDS" | python3 -c 'import sys,json;print(json.load(sys.stdin)["SHEET_ID"])')"
export GOOGLE_SA="$(printf '%s' "$CREDS" | python3 -c 'import sys,json;print(json.load(sys.stdin)["GOOGLE_SA"])')"
unset CREDS
pip install -q google-auth >/dev/null 2>&1 || pip install -q --break-system-packages google-auth >/dev/null 2>&1 || true
python3 "$HERE/update_rebt_dashboard.py"
