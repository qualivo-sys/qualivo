#!/usr/bin/env python3
"""Genera el refresh token OAuth para la Google Ads API.

Requisitos (una sola vez):
  pip install google-auth-oauthlib

Antes de ejecutar, crea en Google Cloud (mismo proyecto donde habilitaste
"Google Ads API") unas credenciales OAuth de tipo "Aplicación de escritorio"
y exporta:
  export GADS_CLIENT_ID="xxxx.apps.googleusercontent.com"
  export GADS_CLIENT_SECRET="xxxx"

Al ejecutarlo se abre el navegador: autoriza con info@maikelechevarria.com
(la cuenta con acceso a Google Ads). El refresh token se imprime al final.
Guárdalo en un gestor de secretos; no lo subas a ningún repo.
"""
import os

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/adwords"]

flow = InstalledAppFlow.from_client_config(
    {
        "installed": {
            "client_id": os.environ["GADS_CLIENT_ID"],
            "client_secret": os.environ["GADS_CLIENT_SECRET"],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    },
    scopes=SCOPES,
)
creds = flow.run_local_server(port=8080, access_type="offline", prompt="consent")

print("\n=== REFRESH TOKEN (guárdalo en sitio seguro) ===")
print(creds.refresh_token)
