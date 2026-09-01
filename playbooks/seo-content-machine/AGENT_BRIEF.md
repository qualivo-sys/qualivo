# Brief para lanzar el agente — Máquina SEO Qualivo

Copia el bloque de abajo como mensaje inicial a un agente nuevo (Claude Code) en el proyecto del
cliente. Rellena lo que va entre `<< >>`. El agente debe leer `README.md` de esta carpeta antes de
empezar y trabajar sobre una rama de feature dedicada.

---

## Prompt de arranque (copiar/pegar)

```
Eres un agente de Qualivo. Vas a montar la "Máquina de SEO + Contenidos + Captación"
para el cliente << NOMBRE_CLIENTE >> (nicho: << NICHO >>, dominio: << DOMINIO >>).

Sigue el playbook en playbooks/seo-content-machine/README.md de este repo. Reglas:

- Trabaja en la rama << RAMA_FEATURE >>. Commitea con mensajes claros. No abras PR salvo que te lo pida.
- NUNCA commitees claves, tokens ni el JSON del service account. Todo por variables de entorno / .env
  (git-ignored). Si un secreto queda expuesto en chat, avísame para rotarlo.
- No pongas identificadores de modelo en commits ni artefactos.

Fases (confírmame al final de cada una):

1. MARCA Y PILARES
   - Define brand.css con los tokens de marca del cliente (colores, tipografías, botones).
   - Propón 5-10 pilares de contenido y su mapa hub-and-spoke.

2. KEYWORD RESEARCH
   - Ejecuta scripts/dino_enrich.py con las SEEDS y NAIL_TERMS del nicho.
   - Devuélveme las oportunidades de mayor volumen y la cola de artículos propuesta.

3. CONTENIDO
   - Adapta un generador tipo eleva-leadmagnets/tools/gen_articles.py: plantilla build(a)
     con header de marca, TOC, recap, CTA a lead magnet y schema Article/FAQPage.
   - Genera la primera tanda (>= 10 artículos). Blog index + interlinking.

4. PUBLICACIÓN Y GEO
   - Despliega (Vercel u hosting del cliente). cleanUrls, sin protección SSO.
   - Genera sitemap.xml y robots.txt que PERMITA bots de IA (GPTBot, ClaudeBot, Google-Extended).
   - Si hay Cloudflare, CNAME en DNS-only para servir nuestro robots.txt.
   - Envía el sitemap a Search Console por API.

5. CAPTACIÓN
   - Monta 1-3 lead magnets interactivos (calculadora / test) que capturen al CRM
     (adapta eleva-leadmagnets/api/lead.js; token GHL solo en variables del hosting).

6. GOOGLE SHEET DE MANDO
   - Crea un Sheet, compártelo con el service account, define SHEET_ID en .env.
   - Ejecuta scripts/build_sheet.py (crea las 4 pestañas + cruza con Search Console).
   - Ejecuta scripts/fill_volumes.py para rellenar volúmenes por URL.

7. EMBUDO Y PLAN
   - Adapta templates/plan-60-dias.md a este cliente (volúmenes, metas, CRM).
   - Deja definido: secuencia de emails, modelo de lead scoring y reporting.

Empieza confirmándome el .env que necesitas (usa .env.example como referencia) y la fase 1.
```

---

## Checklist de credenciales (a preparar ANTES de arrancar)

- [ ] Service account de Google con JSON descargado (`GOOGLE_SA_JSON`).
- [ ] Google Sheet creado y **compartido con el email del service account** (`SHEET_ID`).
- [ ] Service account **añadido en Search Console** de la propiedad `sc-domain:DOMINIO`.
- [ ] API key de **DinoRank** (`DINORANK_API_KEY`).
- [ ] Acceso al **CRM (GoHighLevel)**: token + `locationId` (se configuran en el hosting, no en el repo).
- [ ] Acceso al **hosting** (Vercel u otro) para desplegar.
- [ ] DNS del dominio (para subdominio de blog + robots que permita IA).

## Qué NO hace el agente solo (decisiones humanas)

- Elegir el ángulo comercial y la oferta del cliente.
- Aprobar el tono/marca del contenido.
- Conectar cuentas y pagar herramientas (DinoRank, hosting, dominio).
- Rotar/gestionar secretos.
