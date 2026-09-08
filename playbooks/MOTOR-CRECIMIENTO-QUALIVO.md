# 🚀 Motor de Crecimiento Qualivo — visión general para replicar en cualquier proyecto

> Documento de **nivel sistema**: qué hacemos, cómo encaja cada pieza y cómo montar los mismos
> agentes en un proyecto nuevo. Para el detalle técnico (scripts de SEO, auth de Google, DinoRank,
> Search Console) ver la guía hermana **`MAQUINA-SEO-QUALIVO.md`**.
>
> Caso de referencia: **Eleva Academy** (formación de uñas). Todo lo de abajo está vivo ahí.

---

## 1. La idea en una frase

**Atraer tráfico cualificado → convertirlo en leads → nutrirlos automáticamente → priorizar a quién
llamar → medirlo todo en un panel.** Un embudo completo donde cada pieza alimenta a la siguiente.

```
   CONTENIDO SEO          LEAD MAGNETS           CRM (GoHighLevel)          PANEL
   (blog + GEO)     →     (calculadoras/tests)  →  captación · nurturing  →  medición en vivo
   atrae visitas          convierten a lead        · lead scoring            (comercial+SEO+ads)
        │                       │                        │                        │
        └── Google + IA ────────┴── etiqueta origen ─────┴── secuencia email ─────┘
```

---

## 2. Las 6 piezas del sistema

### A. Máquina de contenidos SEO (blog)
- Decenas de artículos con la marca del cliente, estructura **hub-and-spoke** (guías pilar + artículos
  satélite enlazados entre sí).
- Cada artículo: schema (`Article`/`FAQPage`), índice, recap, enlazado interno y CTA a un lead magnet.
- **GEO** (posicionamiento en IA): `robots.txt` permite GPTBot, ClaudeBot y Google-Extended para que
  ChatGPT/Perplexity/Gemini también citen el contenido.
- Sitemap enviado a Google por API.
- **Aprendizaje clave:** priorizar por **volumen real** (DinoRank), no por intuición. En Eleva las
  keywords de *diseño/inspiración* pesan 10-30× las de curso.

### B. Lead magnets (generador de leads)
- Herramientas **interactivas** que aportan valor y capturan el contacto: calculadora de ingresos,
  calculadora de precios, test "¿qué producto/curso necesitas?".
- Cada uno manda al CRM su **etiqueta de origen** distinta (para saber qué convierte).
- Alojados en Vercel (estáticos + una función serverless de captura).

### C. Captación al CRM
- Función serverless (`/api/lead`) crea el contacto en **GoHighLevel** con `source`, `tag` y campos
  personalizados. Tolerante a duplicados.
- Todo lead entra **trazado por origen/UTM**, así el panel puede desglosar por canal.

### D. Nurturing (secuencia de emails)
- Secuencia automática de **5 emails** con la marca del cliente: bienvenida → autoridad → producto/
  método → reserva de llamada → última llamada.
- Se dispara por la etiqueta del lead magnet; sale de la secuencia si la persona agenda/responde.
- Ramas por segmento (no es lo mismo quien busca formarse que quien ya trabaja) + reactivación de fríos.
- **Nota técnica:** los emails (plantillas HTML) se pueden crear por API de GHL; **el workflow que los
  encadena se monta en el editor de GHL** (la API no lo permite).

### E. Lead scoring (priorización)
- Cada contacto acumula puntos según lo que hace (usa un lead magnet, abre emails, vuelve a la web,
  visita precios…). Frío / templado / **caliente**.
- Cuando un lead se pone caliente → aviso al comercial + handoff. El equipo habla primero con quien
  está listo, no con todos por igual.

### F. Medición (panel + Sheet)
- **Panel comercial (Netlify)** en vivo desde GHL, con pestañas:
  - **Comercial:** embudo, por comercial, por canal, **provincias de los leads** y **anuncios que mejor
    rinden** (Meta), inversión/rentabilidad (CPL, CPA, ROAS).
  - **SEO:** tráfico y posiciones (Search Console) + **analítica web (GA4)**: visitas, sesiones, canales.
  - **Email:** resumen de aperturas/clics (manual desde una pestaña del Sheet, porque GHL no lo da por API).
- **Google Sheet de mando SEO:** keyword · volumen (DinoRank) · posición (Search Console) · estado ·
  oportunidades · visibilidad en IA.

**Regla de oro del panel:** mide el embudo por donde el equipo trabaja de verdad. Si trabajan por
**calendario** (citas) y no mueven las etapas del pipeline, el panel debe leer del **calendario**, no
de la etapa — si no, los números salen a cero aunque haya actividad. (Nos pasó en Eleva.)

---

## 3. Herramientas y accesos (stack)

| Función | Herramienta | Qué hace falta |
|---|---|---|
| Contenido / hosting | **Vercel** | token de API + dominio/subdominio (blog.) |
| DNS | **Cloudflare** (si aplica) | CNAME del blog en **DNS-only** para servir nuestro robots.txt |
| Keyword research | **DinoRank** | API key (`X-API-Key`) |
| Posiciones + sitemap | **Google Search Console** | service account con acceso |
| Analítica web | **Google Analytics 4** | property ID + service account con rol Visor |
| Sheet de mando | **Google Sheets** | service account con acceso de edición |
| CRM / emails / scoring | **GoHighLevel** | token (PIT) + locationId |
| Anuncios | **Meta Ads** (+ Google Ads) | token de Meta + act_id |
| Panel | **Netlify** | deploy del repo + variables de entorno |

> **Seguridad (innegociable):** nada de claves en el repo. Todo por variables de entorno / `.env`
> (git-ignored). Los scripts leen credenciales solo del entorno. Si un secreto se expone, se rota.

---

## 4. Cómo montar los mismos agentes en un proyecto nuevo

La idea es lanzar **un agente por bloque** (o uno que los recorra en fases). Briefs sugeridos:

### Agente 1 — SEO & Contenido
> "Monta la máquina de contenidos SEO para `<<CLIENTE>>` (nicho `<<NICHO>>`, dominio `<<DOMINIO>>`).
> Define la marca (CSS), 5-10 pilares hub-and-spoke, investiga keywords con DinoRank, genera la
> primera tanda (≥10 artículos) con schema + interlinking + CTA a lead magnet, publica en Vercel con
> sitemap y robots que permita IA. Sigue `MAQUINA-SEO-QUALIVO.md`."

### Agente 2 — Lead magnets & Captación
> "Crea 1-3 lead magnets interactivos (calculadora/test) con la marca del cliente, cada uno con su
> etiqueta de origen, capturando al CRM vía función serverless (`/api/lead`, patrón GHL v2). Token y
> locationId en variables del hosting."

### Agente 3 — CRM: nurturing & scoring
> "Crea en GHL la secuencia de 5 emails de bienvenida (plantillas HTML con la marca) y deja el mapa
> del workflow (disparadores por etiqueta, esperas 2-2-2-4 días, salida si agenda). Define el modelo
> de lead scoring (señales → puntos → frío/templado/caliente) y el handoff al comercial."

### Agente 4 — Sheet & Analítica
> "Crea el Google Sheet de mando (keywords/volumen/posición/oportunidades) conectado a DinoRank y
> Search Console. Monta el panel de Netlify con las pestañas Comercial + SEO + GA4 + Email. Mide el
> embudo por la fuente donde el equipo trabaja de verdad."

### Agente 5 — Campañas & Reporting (continuo)
> "Lanza y optimiza campañas (contenido orgánico, lead magnets de pago, retargeting), revisa el panel
> semanalmente, informe mensual, y prioriza la siguiente tanda de contenido por volumen del Sheet."

> Para arrancar cualquiera de ellos hace falta el **checklist de credenciales** de la sección 3 y el
> `.env.example` de `MAQUINA-SEO-QUALIVO.md`.

---

## 5. Plan de trabajo (ritmo estándar)

- **8-10 artículos / semana**, priorizados por volumen real del Sheet.
- **Secuencia de nurturing** activa desde la semana 2.
- **Lead scoring** activo desde la semana 3.
- **Informe** mensual + check-in semanal (20 min).
- **Aviso de lead caliente** en tiempo real al comercial.
- Plan detallado a 60 días con hitos semanales: ver `MAQUINA-SEO-QUALIVO.md` (sección plan) —
  Mes 1 "Cimientos y captación", Mes 2 "Nurturing, scoring y escala".

---

## 6. Errores/aprendizajes que ahorran tiempo

1. **El equipo no mueve las etapas del pipeline** → mide el embudo por calendario/etiquetas, no por etapa.
2. **La provincia del lead casi nunca se captura** en el CRM → sácala de Meta (breakdown por región) o
   añade un campo "provincia" a los formularios.
3. **GHL no expone aperturas/clics de email por API** → resumen manual (pestaña del Sheet) o su reporting.
4. **Cloudflare sirve su propio robots.txt** si el CNAME está proxied → ponlo en DNS-only para GEO.
5. **Emparejado automático de volúmenes** puede colar keywords genéricas (p. ej. "portfolio") → revisar a mano.
6. **Dominio nuevo = semanas hasta ver clics.** Google indexa primero, el tráfico llega después.
7. **Otro proveedor puede estar operando el mismo CRM** (en Eleva había otro sistema) → coordinar para no pisarse.

---

## 7. Ficheros de referencia en este repo

- `playbooks/MOTOR-CRECIMIENTO-QUALIVO.md` — este documento (visión general).
- `playbooks/seo-content-machine/MAQUINA-SEO-QUALIVO.md` — guía técnica autocontenida (scripts + .env + plan).
- `playbooks/seo-content-machine/` — scripts sanitizados (gauth, dino_enrich, build_sheet, fill_volumes).
- Implementación viva de Eleva: `eleva-leadmagnets/` (artículos, brand.css, `api/lead.js`, `emails/`,
  `tools/`) y `netlify-dashboard/` (panel comercial + SEO + GA4 + provincias + anuncios).

---

*Qualivo — Motor de crecimiento. Replicable en cualquier nicho. No se commiten secretos: todo por `.env`.*
