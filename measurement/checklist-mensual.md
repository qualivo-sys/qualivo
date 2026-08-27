# T5.2 · Checklist mensual SEO/GEO — primera ejecución = baseline.md (27-ago-2026)
**Se ejecuta el día 1 de cada mes. Resultado: `measurement/seguimiento-YYYY-MM.md` comparando contra baseline.md. Lo puede ejecutar el agente (partes A, B, D) + Maikel (parte C, 10 min).**

## A. Posiciones (agente — DinoRank + GSC)
1. GSC vía DinoRank (`searchconsole`, dominio qualivo.io): keywords con impresiones, clicks, posición media, URLs con datos. Comparar contra el mes anterior.
2. Las 10 keywords objetivo (lista fija en baseline.md §2): posición actual de qualivo.io. Anotar entradas nuevas al top 100/50/20/10.
3. Indexación: nº de URLs del sitemap indexadas (GSC → cobertura, captura de Maikel si la API no lo da).

## B. Autoridad (agente + Ahrefs Webmaster Tools)
1. AWT (gratis, 🔒 alta pendiente con la cuenta de Maikel: ahrefs.com/webmaster-tools, verificar con el mismo DNS de GSC): dominios de referencia nuevos, enlaces nuevos/perdidos, DR.
2. Menciones: buscar «"Qualivo" growth -tech» en Google (mes filtrado) y anotar menciones nuevas.
3. Google Alerts «Qualivo» (🔒 activar una vez, cuenta de Maikel): revisar la carpeta del mes.

## C. Los 8 prompts LLM (Maikel, 10 min — ventana sin sesión)
Ejecutar TEXTUALMENTE los 8 prompts de baseline.md §4 en ChatGPT, Perplexity, Claude y Gemini. Anotar por cada uno: ¿aparece Qualivo? ¿aparece qualivo.tech? ¿qué 3 competidores cita? Pegar capturas en `measurement/capturas-YYYY-MM/`.

## D. Conversión (agente vía GHL + Vercel Analytics)
1. Leads del mes por origen (tags GHL) — especialmente el origen «ChatGPT u otra IA» (🔒 Jose añade la opción al formulario; pendiente).
2. Vercel Analytics: páginas más vistas, referrers nuevos (¿llega tráfico de chat.openai.com / perplexity.ai?).

## E. Cierre
- 5 líneas de veredicto: qué mejoró, qué no, qué se decide (una acción, no cinco).
- Actualizar la fila del mes en la tabla de evolución (crearla en el primer seguimiento).
