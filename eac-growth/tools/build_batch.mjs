// EAC · Genera el lote de contenido: HTML individuales + WXR de importación + plan SEO
// Uso:  node eac-growth/tools/build_batch.mjs
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { renderArticle, STYLE } from './render.mjs';
import { POSTS } from './posts.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://escolaeronauticadecatalunya.cat';
const UPDATED = 'septiembre de 2026';
mkdirSync(`${ROOT}/content/articles`, { recursive: true });
mkdirSync(`${ROOT}/import`, { recursive: true });

const cdata = s => `<![CDATA[${String(s).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nice = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// wpautop convierte líneas en blanco en <p>: las eliminamos para que el HTML entre limpio.
const forWp = html => html.replace(/\n\s*\n/g, '\n').trim();

const items = [];
const cats = new Map();
const seoRows = [];
let totalWords = 0;

POSTS.forEach((p, idx) => {
  const { html, article, scripts, minutes } = renderArticle(p, { updated: UPDATED });
  const words = article.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  totalWords += words;

  // 1) HTML individual (referencia / preview / futuro uso en Vercel)
  writeFileSync(`${ROOT}/content/articles/NUEVO-${p.slug}.html`,
    `<!-- ${p.cat} · focus: ${p.focusKw} · ${words} palabras · ${minutes} min -->\n` +
    `<link rel="stylesheet" href="/brand.css">\n${article}\n${scripts}\n`);

  cats.set(nice(p.cat), p.cat);

  // 2) Item del WXR, con meta de Yoast ya rellenado
  const body = forWp(`${STYLE}\n${article}\n${scripts}`);
  const meta = [
    ['_yoast_wpseo_title', p.seoTitle + ' %%sep%% %%sitename%%'],
    ['_yoast_wpseo_metadesc', p.metaDesc],
    ['_yoast_wpseo_focuskw', p.focusKw],
    ['_yoast_wpseo_meta-robots-noindex', '0'],
    ['_yoast_wpseo_meta-robots-nofollow', '0'],
  ];
  const pub = new Date(Date.now() + idx * 1000).toUTCString();

  items.push(`  <item>
    <title>${xesc(p.title)}</title>
    <link>${SITE}/blog/${p.slug}/</link>
    <pubDate>${pub}</pubDate>
    <dc:creator>${cdata('EAC')}</dc:creator>
    <guid isPermaLink="false">eac-lote1-${p.slug}</guid>
    <description></description>
    <content:encoded>${cdata(body)}</content:encoded>
    <excerpt:encoded>${cdata(p.metaDesc)}</excerpt:encoded>
    <wp:post_id>${9000 + idx}</wp:post_id>
    <wp:post_date>${cdata(new Date().toISOString().slice(0, 19).replace('T', ' '))}</wp:post_date>
    <wp:comment_status>${cdata('closed')}</wp:comment_status>
    <wp:ping_status>${cdata('closed')}</wp:ping_status>
    <wp:post_name>${cdata(p.slug)}</wp:post_name>
    <wp:status>${cdata('draft')}</wp:status>
    <wp:post_parent>0</wp:post_parent>
    <wp:menu_order>0</wp:menu_order>
    <wp:post_type>${cdata('post')}</wp:post_type>
    <wp:is_sticky>0</wp:is_sticky>
    <category domain="category" nicename="${nice(p.cat)}">${cdata(p.cat)}</category>
${(p.kws || []).slice(0, 4).map(k => `    <category domain="post_tag" nicename="${nice(k)}">${cdata(k)}</category>`).join('\n')}
${meta.map(([k, v]) => `    <wp:postmeta><wp:meta_key>${cdata(k)}</wp:meta_key><wp:meta_value>${cdata(v)}</wp:meta_value></wp:postmeta>`).join('\n')}
  </item>`);

  seoRows.push({ ...p, words, minutes });
});

// 3) WXR completo
const catDefs = [...cats].map(([slug, name], i) =>
  `  <wp:category><wp:term_id>${500 + i}</wp:term_id><wp:category_nicename>${cdata(slug)}</wp:category_nicename>` +
  `<wp:category_parent>${cdata('')}</wp:category_parent><wp:cat_name>${cdata(name)}</wp:cat_name></wp:category>`).join('\n');

const wxr = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
  <title>EAC · Blog — lote 1 (Qualivo)</title>
  <link>${SITE}</link>
  <description>15 artículos nuevos optimizados para SEO</description>
  <pubDate>${new Date().toUTCString()}</pubDate>
  <language>es-ES</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>${SITE}</wp:base_site_url>
  <wp:base_blog_url>${SITE}</wp:base_blog_url>
  <wp:author><wp:author_id>1</wp:author_id><wp:author_login>${cdata('EAC')}</wp:author_login><wp:author_display_name>${cdata('EAC')}</wp:author_display_name></wp:author>
${catDefs}
${items.join('\n')}
</channel>
</rss>`;
writeFileSync(`${ROOT}/import/eac-blog-lote1.xml`, wxr);

// 4) Plan SEO (para Yoast / control de publicación)
const plan = `# EAC · Plan SEO del lote 1 (15 posts nuevos)

Generado automáticamente por \`eac-growth/tools/build_batch.mjs\`.
Los campos de Yoast (**título SEO, meta descripción y keyword objetivo**) **ya van dentro del archivo de importación**:
al importar \`import/eac-blog-lote1.xml\` se rellenan solos. Esta tabla es la referencia para revisarlos.

| # | URL (slug) | Keyword objetivo | Título SEO (Yoast) | Palabras |
|---|---|---|---|---|
${seoRows.map((r, i) => `| ${i + 1} | \`/blog/${r.slug}/\` | ${r.focusKw} | ${r.seoTitle} | ${r.words} |`).join('\n')}

**Total: ${seoRows.length} artículos · ${totalWords.toLocaleString('es-ES')} palabras.**

## Meta descripciones
${seoRows.map(r => `- \`/${r.slug}/\` → ${r.metaDesc}`).join('\n')}

## Keywords secundarias por artículo
${seoRows.map(r => `- **${r.slug}**: ${(r.kws || []).join(' · ')}`).join('\n')}

## Qué lleva cada artículo (aplicado por plantilla)
- **Respuesta rápida** al inicio (bloque destacado) → optimizado para fragmento destacado y para respuestas de IA.
- **Índice con anclas** → enlaces de salto en Google.
- **Datos en tarjetas**, tablas comparativas, pasos numerados y bloques a favor / en contra.
- **CTA doble** (curso + información) con UTM: \`utm_source=blog&utm_medium=post&utm_campaign={slug}\`.
- **Resumen final** + **FAQ desplegable**.
- **Schema.org**: \`Article\` + \`FAQPage\` (JSON-LD) en cada post.
- **Enlazado interno** cruzado entre artículos del lote y con los posts que ya rankean.
- **Caja de autoría E-E-A-T** (centro + revisión del equipo docente + fecha de actualización).

## Cómo publicar
1. WordPress → **Herramientas → Importar → WordPress**.
2. Sube \`eac-blog-lote1.xml\`. Asigna todo al autor del blog. **No** marques "descargar e importar archivos adjuntos".
3. Entran como **borradores**. Revisa, añade imagen destacada y publica.
4. Recomendado: **publicar escalonado** (3-4 por semana) en lugar de los 15 de golpe. Es más natural para Google en un dominio que sale de un hackeo.
5. Tras publicar: Search Console → Inspección de URL → **Solicitar indexación** de cada uno.

## Enlazado interno pendiente (desde posts existentes)
Añadir a mano un enlace desde estos posts que ya rankean hacia los nuevos:
- \`cuanto-cobran-las-azafatas-de-vuelo\` → \`/blog/ser-azafato-de-vuelo-hombre-tcp/\` y \`/blog/salidas-profesionales-tcp-carrera-aviacion/\`
- \`requisitos-azafata-vuelo\` → \`/blog/como-superar-entrevista-tcp-aerolinea/\` y \`/blog/curso-tcp-precio-cuanto-cuesta/\`
- \`que-hay-que-estudiar-para-ser-azafata-de-vuelo\` → \`/blog/cursos-para-trabajar-en-el-aeropuerto-cuales-sirven/\`
- \`sobrecargo-vuelo\` → \`/blog/salidas-profesionales-tcp-carrera-aviacion/\`
- \`diferencia-azafata-auxiliar-vuelo\` → \`/blog/tcp-o-azafata-de-tierra-cual-elegir/\`
- \`que-es-un-agente-de-handling\` → \`/blog/agente-de-rampa-que-hace-cuanto-gana/\`
- \`que-velocidad-va-avion\` (139k impresiones, poco comercial) → \`/blog/trabajos-en-el-aeropuerto-lista-puestos/\`
`;
writeFileSync(`${ROOT}/content/seo-plan-lote1.md`, plan);

console.log(`✅ ${POSTS.length} artículos · ${totalWords.toLocaleString('es-ES')} palabras`);
console.log(`   → eac-growth/import/eac-blog-lote1.xml`);
console.log(`   → eac-growth/content/articles/NUEVO-*.html`);
console.log(`   → eac-growth/content/seo-plan-lote1.md`);
