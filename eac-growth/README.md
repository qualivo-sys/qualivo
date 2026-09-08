# EAC · Motor de Crecimiento Qualivo

Implementación del Motor de Crecimiento (ver `playbooks/MOTOR-CRECIMIENTO-QUALIVO.md`) para
**Escola Aeronàutica de Catalunya** · nicho: formación aeronáutica · dominio: `escolaeronauticadecatalunya.cat`.

## Fases
1. **Marca y pilares de contenido** ✅ (`brand/`, `content/content-pillars.md`)
2. Keyword research (DinoRank) → `content/keywords.*`
3. Primera tanda de artículos + publicación (Vercel · sitemap · robots que permite IA)
4. Lead magnets que capturan al CRM (`/api/lead` → GoHighLevel)
5. Secuencia de emails + lead scoring (GHL)
6. Sheet de mando + panel de métricas

## Estructura
```
eac-growth/
  brand/         marca: tokens CSS + guía de voz
  content/       pilares hub-and-spoke, keyword research, artículos
  .env.example   credenciales necesarias (sin secretos; copiar a .env)
```

## Seguridad
Nada de claves en el repo. `.env` está git-ignored; los scripts leen del entorno.
Los secretos reales de esta sesión viven fuera del repo (scratchpad). Si un secreto se expone → se rota.

## Credenciales — estado
| Servicio | Estado |
|---|---|
| Google service account (Sheets) | ✅ |
| Search Console (propiedad EAC) | ⏳ verificando acceso de la SA |
| DinoRank | ✅ key recibida |
| GoHighLevel (PIT + location + pipeline) | ✅ |
| Meta Ads (token + act_id) | ✅ |
| GA4 (property id) | ❌ pendiente |
| Vercel / Netlify / Cloudflare | ❌ pendiente |
| Google Ads (OAuth completo) | ❌ pendiente (proxy) |
| `MAQUINA-SEO-QUALIVO.md` (guía técnica) | ❌ no recibido aún |
