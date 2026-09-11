// EAC · Motor de render de artículos (Qualivo)
// Convierte el modelo de contenido (posts.mjs) en HTML autocontenido listo para WordPress.
// El <style> va embebido en cada post para que se vea bien sin tocar el tema.

export const STYLE = `<style>
.eac-article{--r:#D8232A;--ink:#0E1621;--mut:#5B6675;--mist:#F4F6F9;--line:#E4E8EE;--sky:#1E6FE0;
 max-width:800px;margin:0 auto;padding:0 4px;font-size:18px;line-height:1.75;color:var(--ink);
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
 -webkit-font-smoothing:antialiased}
.eac-article *{box-sizing:border-box}
.eac-article a{color:var(--sky);text-decoration:underline;text-underline-offset:2px}
.eac-kicker{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;
 color:var(--r);background:#FDF2F2;border:1px solid #F4CCCE;padding:5px 13px;border-radius:999px;margin:0 0 16px}
.eac-article h1{font-size:2.1em;line-height:1.15;letter-spacing:-.02em;font-weight:800;margin:0 0 .3em}
.eac-meta{font-size:14px;color:var(--mut);border-bottom:1px solid var(--line);padding-bottom:14px;margin:0 0 24px}
.eac-lead{font-size:1.14em;line-height:1.62;color:#233040;margin:0 0 1.2em}
.eac-article h2{font-size:1.45em;line-height:1.25;font-weight:800;letter-spacing:-.01em;margin:2em 0 .5em;
 padding-top:.55em;border-top:3px solid var(--r);display:block}
.eac-article h3{font-size:1.12em;font-weight:700;margin:1.6em 0 .35em}
.eac-article p{margin:0 0 1.1em}
.eac-article ul,.eac-article ol{margin:0 0 1.2em;padding-left:1.3em}
.eac-article li{margin:.4em 0}
.eac-key{border-left:5px solid var(--r);background:linear-gradient(180deg,#FFF7F7 0%,#fff 100%);
 border:1px solid #F4DDDE;border-left-width:5px;border-radius:0 14px 14px 0;padding:18px 22px;margin:1.6em 0}
.eac-key .t{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:var(--r);margin-bottom:.55em}
.eac-key ul{margin:0;padding-left:1.15em}
.eac-toc{background:var(--mist);border:1px solid var(--line);border-radius:14px;padding:18px 22px;margin:1.8em 0}
.eac-toc .t{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:var(--mut);margin-bottom:.5em}
.eac-toc ol{margin:0;padding-left:1.2em;font-size:.96em}
.eac-toc li{margin:.28em 0}
.eac-stats{display:flex;flex-wrap:wrap;gap:10px;margin:1.5em 0}
.eac-stat{flex:1 1 170px;background:#fff;border:1px solid var(--line);border-top:3px solid var(--r);
 border-radius:12px;padding:14px 16px;box-shadow:0 1px 2px rgba(14,22,33,.04)}
.eac-stat b{display:block;font-size:1.35em;line-height:1.2;font-weight:800;color:var(--ink)}
.eac-stat span{display:block;font-size:13px;line-height:1.4;color:var(--mut);margin-top:4px}
.eac-iman{border:1px solid var(--line);border-radius:14px;overflow:hidden;margin:2em 0;background:#fff;box-shadow:0 2px 10px rgba(14,22,33,.06)}
.eac-iman .h{background:linear-gradient(135deg,#0E1621,#1B2A3D);color:#fff;padding:18px 22px}
.eac-iman .lab{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:#F2585E;margin-bottom:6px}
.eac-iman .h b{display:block;font-size:1.15em;font-weight:800;line-height:1.25}
.eac-iman .h .d{display:block;color:#BFCEDE;font-size:.92em;margin-top:4px}
.eac-iman .f{margin:0;padding:10px 22px;font-size:.82em;color:var(--mut);background:var(--mist);border-top:1px solid var(--line)}
.eac-tw{overflow-x:auto;margin:1.5em 0;border:1px solid var(--line);border-radius:12px}
.eac-article table.eac-t{width:100%;border-collapse:collapse;font-size:15.5px;margin:0;background:#fff}
.eac-t th{background:var(--ink);color:#fff;text-align:left;font-weight:700;padding:12px 14px;white-space:nowrap}
.eac-t td{padding:11px 14px;border-top:1px solid var(--line);vertical-align:top}
.eac-t tr:nth-child(even) td{background:#FAFBFC}
.eac-steps{list-style:none;counter-reset:s;margin:1.5em 0;padding:0}
.eac-steps li{counter-increment:s;position:relative;background:#fff;border:1px solid var(--line);border-radius:12px;
 padding:16px 18px 16px 62px;margin:0 0 10px}
.eac-steps li:before{content:counter(s);position:absolute;left:16px;top:15px;width:32px;height:32px;border-radius:50%;
 background:var(--r);color:#fff;font-weight:800;font-size:15px;display:flex;align-items:center;justify-content:center}
.eac-steps b{display:block;margin-bottom:2px}
.eac-pc{display:flex;flex-wrap:wrap;gap:12px;margin:1.5em 0}
.eac-pc>div{flex:1 1 260px;border:1px solid var(--line);border-radius:12px;padding:14px 18px;background:#fff}
.eac-pc .ok{border-top:3px solid #17915B}.eac-pc .ko{border-top:3px solid var(--r)}
.eac-pc .t{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;margin-bottom:.4em}
.eac-pc .ok .t{color:#17915B}.eac-pc .ko .t{color:var(--r)}
.eac-pc ul{margin:0;padding-left:1.1em;font-size:.96em}
.eac-note,.eac-warn{border-radius:12px;padding:14px 18px;margin:1.5em 0;font-size:.97em}
.eac-note{background:#F0F6FF;border:1px solid #CFE0FA}
.eac-warn{background:#FFF8E9;border:1px solid #F2DFB0}
.eac-note .t,.eac-warn .t{display:block;font-weight:800;margin-bottom:.25em}
.eac-article blockquote{border-left:4px solid var(--r);background:var(--mist);margin:1.5em 0;padding:14px 20px;
 font-size:1.05em;font-style:italic;border-radius:0 10px 10px 0}
.eac-article blockquote p{margin:0}
.eac-cta{background:linear-gradient(135deg,#0E1621 0%,#1B2A3D 100%);color:#fff;border-radius:16px;padding:30px 26px;margin:2.4em 0;text-align:center}
.eac-cta h3{color:#fff;margin:0 0 .35em;font-size:1.3em;font-weight:800}
.eac-cta p{color:#BFCADA;margin:0 0 1.2em;font-size:1em}
.eac-btn{display:inline-block;background:var(--r);color:#fff !important;text-decoration:none !important;font-weight:800;
 padding:14px 30px;border-radius:999px;margin:4px}
.eac-btn2{display:inline-block;background:transparent;color:#fff !important;border:1px solid rgba(255,255,255,.45);
 text-decoration:none !important;font-weight:700;padding:13px 26px;border-radius:999px;margin:4px}
.eac-recap{background:var(--mist);border:1px solid var(--line);border-radius:14px;padding:18px 22px;margin:2em 0}
.eac-recap .t{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:var(--mut);margin-bottom:.5em}
.eac-faq details{border:1px solid var(--line);border-radius:12px;padding:0;margin:0 0 10px;background:#fff}
.eac-faq summary{cursor:pointer;font-weight:700;padding:14px 18px;list-style:none;position:relative;padding-right:44px}
.eac-faq summary::-webkit-details-marker{display:none}
.eac-faq summary:after{content:"+";position:absolute;right:18px;top:11px;font-size:22px;color:var(--r);font-weight:800}
.eac-faq details[open] summary:after{content:"–"}
.eac-faq .a{padding:0 18px 14px;color:#25313F}
.eac-faq .a p{margin:0}
.eac-rel{border-top:1px solid var(--line);margin-top:2.4em;padding-top:16px}
.eac-rel .t{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:var(--mut);margin-bottom:.5em}
.eac-rel ul{margin:0;padding-left:1.1em}
.eac-author{display:flex;gap:14px;align-items:flex-start;background:var(--mist);border:1px solid var(--line);
 border-radius:14px;padding:16px 18px;margin:2em 0 0;font-size:14.5px;line-height:1.6;color:var(--mut)}
.eac-author b{color:var(--ink)}
@media(max-width:700px){
 .eac-article{font-size:17px}
 .eac-article h1{font-size:1.72em}
 .eac-article h2{font-size:1.28em}
 .eac-cta{padding:24px 18px}
 .eac-steps li{padding:14px 16px 14px 56px}
}
</style>`;

const esc = s => String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jesc = s => String(s).replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
// El texto de contenido admite HTML inline (enlaces, <strong>) escrito a mano: no se escapa.
const inline = s => String(s);

function block(b) {
  const [type, ...rest] = b;
  switch (type) {
    case 'p': return `<p>${inline(rest[0])}</p>`;
    case 'h3': return `<h3>${inline(rest[0])}</h3>`;
    case 'ul': return `<ul>${rest[0].map(li => `<li>${inline(li)}</li>`).join('')}</ul>`;
    case 'ol': return `<ol>${rest[0].map(li => `<li>${inline(li)}</li>`).join('')}</ol>`;
    case 'q': return `<blockquote><p>${inline(rest[0])}</p></blockquote>`;
    case 'note': return `<div class="eac-note"><span class="t">${inline(rest[0])}</span>${inline(rest[1])}</div>`;
    case 'warn': return `<div class="eac-warn"><span class="t">${inline(rest[0])}</span>${inline(rest[1])}</div>`;
    case 'table': {
      const [head, rows] = rest;
      return `<div class="eac-tw"><table class="eac-t"><thead><tr>${head.map(h => `<th>${inline(h)}</th>`).join('')}</tr></thead>` +
        `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    case 'steps':
      return `<ol class="eac-steps">${rest[0].map(s => `<li><b>${inline(s.t)}</b>${inline(s.d)}</li>`).join('')}</ol>`;
    case 'pros':
      return `<div class="eac-pc"><div class="ok"><span class="t">${inline(rest[0].t || 'A favor')}</span>` +
        `<ul>${rest[0].items.map(i => `<li>${inline(i)}</li>`).join('')}</ul></div>` +
        `<div class="ko"><span class="t">${inline(rest[1].t || 'En contra')}</span>` +
        `<ul>${rest[1].items.map(i => `<li>${inline(i)}</li>`).join('')}</ul></div></div>`;
    case 'iman': {
      const m = rest[0];
      return `<div class="eac-iman"><div class="h"><span class="lab">${inline(m.lab||'Herramienta gratuita')}</span>` +
        `<b>${inline(m.t)}</b><span class="d">${inline(m.d)}</span></div>` +
        `<iframe src="https://eac-imanes.vercel.app/${m.slug}" title="${inline(m.t)}" loading="lazy" ` +
        `style="width:100%;height:640px;border:0;display:block;background:#F4F6F9"></iframe>` +
        `<p class="f">¿No se carga? <a href="https://eac-imanes.vercel.app/${m.slug}" target="_blank" rel="noopener">Ábrelo en una pestaña nueva</a>.</p></div>`;
    }
    case 'stats':
      return `<div class="eac-stats">${rest[0].map(s => `<div class="eac-stat"><b>${inline(s.b)}</b><span>${inline(s.s)}</span></div>`).join('')}</div>`;
    default: throw new Error('Bloque desconocido: ' + type);
  }
}

const readingTime = html => {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
};

export function renderArticle(p, opts = {}) {
  const secs = p.sections.map((s, i) => ({ ...s, id: s.id || `s${i + 1}` }));
  const body = secs.map((s, i) =>
    `<h2 id="${s.id}">${i + 1}. ${inline(s.h2)}</h2>\n` + s.blocks.map(block).join('\n')
  ).join('\n');

  const toc = `<nav class="eac-toc"><span class="t">En este artículo</span><ol>` +
    secs.map(s => `<li><a href="#${s.id}">${inline(s.h2)}</a></li>`).join('') +
    `<li><a href="#faq">Preguntas frecuentes</a></li></ol></nav>`;

  const key = p.key && p.key.length
    ? `<div class="eac-key"><span class="t">Respuesta rápida</span><ul>${p.key.map(k => `<li>${inline(k)}</li>`).join('')}</ul></div>` : '';

  const stats = p.stats && p.stats.length ? block(['stats', p.stats]) : '';

  const cta = `<div class="eac-cta"><h3>${inline(p.cta.h)}</h3><p>${inline(p.cta.p)}</p>` +
    `<a class="eac-btn" href="${p.cta.href}?utm_source=blog&amp;utm_medium=post&amp;utm_campaign=${p.slug}">${inline(p.cta.btn)}</a>` +
    (p.cta.btn2 ? `<a class="eac-btn2" href="${p.cta.href2}?utm_source=blog&amp;utm_medium=post&amp;utm_campaign=${p.slug}">${inline(p.cta.btn2)}</a>` : '') +
    `</div>`;

  const recap = `<div class="eac-recap"><span class="t">En resumen</span><p>${inline(p.recap)}</p></div>`;

  const faq = `<h2 id="faq">Preguntas frecuentes</h2>\n<div class="eac-faq">` +
    p.faq.map(f => `<details><summary>${inline(f.q)}</summary><div class="a"><p>${inline(f.a)}</p></div></details>`).join('') +
    `</div>`;

  const rel = p.related && p.related.length
    ? `<div class="eac-rel"><span class="t">Sigue leyendo</span><ul>` +
      p.related.map(r => `<li><a href="${r.href}">${inline(r.t)}</a></li>`).join('') + `</ul></div>` : '';

  const author = `<div class="eac-author"><div><b>Escola Aeronàutica de Catalunya</b> — Centro de formación aeronáutica en Barcelona. ` +
    `Formamos a tripulantes de cabina de pasajeros (TCP), personal de tierra y despachadores de vuelo. ` +
    `Contenido revisado por el equipo docente de EAC.<br><span style="font-size:13px">Última actualización: ${opts.updated || 'septiembre de 2026'}.</span></div></div>`;

  const article =
`<article class="eac-article">
<span class="eac-kicker">${inline(p.kicker)}</span>
<h1>${inline(p.title)}</h1>
<p class="eac-meta">Actualizado el ${opts.updated || 'septiembre de 2026'} · ${readingTime(body)} min de lectura · Por el equipo de EAC</p>
<p class="eac-lead">${inline(p.lead)}</p>
${key}
${stats}
${toc}
${body}
${cta}
${recap}
${faq}
${rel}
${author}
</article>`;

  const ld = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: p.title,
    description: p.metaDesc,
    inLanguage: 'es-ES',
    author: { '@type': 'Organization', name: 'Escola Aeronàutica de Catalunya' },
    publisher: { '@type': 'Organization', name: 'Escola Aeronàutica de Catalunya', url: 'https://escolaeronauticadecatalunya.cat' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://escolaeronauticadecatalunya.cat/blog/${p.slug}/` }
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map(f => ({
      '@type': 'Question', name: f.q.replace(/<[^>]+>/g, ''),
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') }
    }))
  };

  const scripts =
`<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`;

  return { article, scripts, html: `${STYLE}\n${article}\n${scripts}`, minutes: readingTime(body) };
}

export { esc, jesc };
