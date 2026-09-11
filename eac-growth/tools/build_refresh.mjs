// Genera los refrescos: HTML listo para pegar en el editor de WordPress + guía de publicación.
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { renderArticle, STYLE } from './render.mjs';
import { REFRESH } from './refresh.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UPDATED = 'septiembre de 2026';
mkdirSync(`${ROOT}/content/articles`, { recursive: true });
const forWp = h => h.replace(/\n\s*\n/g, '\n').trim();

const filas = [];
for (const p of REFRESH) {
  const { article, scripts, minutes } = renderArticle(p, { updated: UPDATED });
  const words = article.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  writeFileSync(`${ROOT}/content/articles/REFRESH-${p.slug}.html`, forWp(`${STYLE}\n${article}\n${scripts}`));
  filas.push({ ...p, words, minutes });
}

const guia = `# EAC · Refrescos de contenido — los 5 posts que ya rankean

Estos **no son artículos nuevos**: sustituyen el contenido de posts existentes **manteniendo su URL**.
Crear una URL nueva canibalizaría el posicionamiento que ya tienen.

| # | URL a editar | Posición | Impresiones/90d | Keyword objetivo | Palabras |
|---|---|---|---|---|---|
${filas.map((r, i) => `| ${i + 1} | \`/blog/${r.slug}/\` | ${['6','8','11','6','7'][i]} | ${['99.000','75.000','63.000','50.000','48.000'][i]} | ${r.focusKw} | ${r.words} |`).join('\n')}

**Total: ${filas.reduce((a, r) => a + r.words, 0).toLocaleString('es-ES')} palabras sobre 335.000 impresiones al trimestre.**

## Cómo publicar cada uno

1. WordPress → **Entradas** → busca el post por su slug → **Editar**.
2. Cambia el editor a **HTML** (en Gutenberg: bloque HTML personalizado; en el editor clásico: pestaña «Texto»).
3. **Borra todo el contenido anterior** y pega el archivo \`REFRESH-<slug>.html\` completo.
4. **No cambies el slug ni la fecha de publicación.** Mantener la URL es todo el objetivo.
5. En **Yoast**, actualiza:

${filas.map(r => `   - \`/${r.slug}/\`\n     - Título SEO: **${r.seoTitle}**\n     - Meta descripción: ${r.metaDesc}\n     - Keyword objetivo: \`${r.focusKw}\``).join('\n')}

6. Actualiza la entrada y, en Search Console, **Inspección de URL → Solicitar indexación**.

## Qué lleva cada refresco

- **Imán de leads incrustado** donde encaja de forma natural (no al final, dentro del cuerpo).
- Respuesta rápida al inicio, índice con anclas, tablas comparativas y bloques de pasos.
- CTA doble con UTM, resumen final y FAQ desplegable.
- Schema \`Article\` + \`FAQPage\`.
- Enlazado interno hacia los artículos del lote 1.

## Imanes incrustados

| Post | Imán | Por qué ahí |
|---|---|---|
| cuanto-cobran-las-azafatas-de-vuelo | Calculadora de sueldo | El lector viene buscando una cifra: se la damos personalizada |
| requisitos-azafata-vuelo | Test de requisitos | Coincide exactamente con la intención de búsqueda |
| que-hay-que-estudiar-para-ser-azafata-de-vuelo | Test de requisitos | Antes de invertir en formación, comprobar el punto de partida |
| sobrecargo-vuelo | Calculadora de sueldo | Incluye la opción de sobrecargo |
| diferencia-azafata-auxiliar-vuelo | Test de perfil cabina/tierra | El artículo trata justo esa duda |

Los imanes escriben directamente en GoHighLevel con puntuación y etiquetas. Ya está activo y verificado.

## Orden recomendado

Empezar por **cuanto-cobran-las-azafatas-de-vuelo** (99.000 impresiones en posición 6): es donde una
mejora se traduce antes en tráfico. Después el resto, uno cada dos o tres días.
`;
writeFileSync(`${ROOT}/content/refrescos-guia.md`, guia);
console.log(`✅ ${filas.length} refrescos · ${filas.reduce((a,r)=>a+r.words,0).toLocaleString('es-ES')} palabras`);
filas.forEach(r => console.log(`   REFRESH-${r.slug}.html · ${r.words} palabras · ${r.minutes} min`));
