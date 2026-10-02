#!/usr/bin/env node
// Genera las páginas de cuenta del ABM (qualivo.io/para/<empresa>/) a partir de
// las fichas de para/_fichas/*.json. Una página por cuenta de nivel 1.
//
//   node herramientas/para.js            → todas las fichas
//   node herramientas/para.js ejemplo    → solo esa
//
// La ficha solo lleva hechos comprobados sobre la empresa y el cargo que decide;
// nunca el nombre de la persona. Lo que no se ha comprobado va en «no_sabemos».
// Las páginas llevan noindex (vercel.json y robots.txt) y avisan a Maikel por
// /api/visita cuando hay comportamiento humano (no por una simple carga).
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const SEGMENTOS = {
  medios: { nombre: 'medios y publicidad', demo: 'b2b', objetivo: 'ventas', quien: 'un anunciante', cosa: 'campañas',
    recorrido: ['Entra una petición por cualquiera de vuestros canales', 'La ficha se crea sola en vuestro CRM, con el origen y una nota de encaje', 'El comercial de su zona recibe una tarea con fecha: llamar, visitar o enviar propuesta', 'Dirección ve cada lunes propuestas abiertas, seguimientos vencidos y qué canal trae campañas'] },
  clinicas: { nombre: 'clínicas', demo: 'clinica', objetivo: 'seguimiento', quien: 'un paciente', cosa: 'tratamientos',
    recorrido: ['Alguien pide información por la web, el teléfono o WhatsApp, a cualquier hora', 'Un WhatsApp le contesta en un minuto y le hace tres preguntas', 'La cita queda en la agenda con recordatorio la víspera y otra fecha si no viene', 'Cada presupuesto entregado tiene su siguiente paso, y recepción ve qué toca hoy'] },
  formacion: { nombre: 'formación', demo: 'formacion', objetivo: 'seguimiento', quien: 'una persona interesada', cosa: 'matrículas',
    recorrido: ['Alguien pide información de un programa, con el programa guardado', 'Un WhatsApp le contesta en un minuto y pregunta para cuándo y para quién', 'La visita o la llamada queda agendada con recordatorios', 'Admisiones ve cada mañana quién ha escrito, quién cumple y quién viene'] },
  b2b: { nombre: 'servicios B2B', demo: 'b2b', objetivo: 'ventas', quien: 'una empresa', cosa: 'propuestas',
    recorrido: ['Entra una oportunidad por la web, una recomendación o la prospección', 'La ficha se crea sola en vuestro CRM, con origen y nota de encaje', 'El comercial recibe una sola tarea con fecha, y si no la hace, dirección lo ve', 'Cada propuesta enviada tiene seguimientos preparados a los 2, 5 y 10 días'] }
};

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

function pagina(f) {
  const seg = SEGMENTOS[f.segmento] || SEGMENTOS.b2b;
  const demo = '/intelligence/?sector=' + encodeURIComponent(seg.demo) + '&empresa=' + encodeURIComponent(f.empresa) + '&objetivo=' + seg.objetivo + '&demo=1';
  const vimos = (f.vimos || []).map(function (v, i) {
    const fuente = v.url ? '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.fuente) + '</a>' : esc(v.fuente);
    return '<div><span class="n">' + (i + 1) + '</span><p>' + esc(v.texto) + '</p><small>Fuente: ' + fuente + '</small></div>';
  }).join('');
  const preguntas = (f.preguntas || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
  const canales = (f.canales || []).map(esc).join(' · ');
  const pasos = seg.recorrido.map(function (p, i) { return '<div><b>' + (i + 1) + '</b><p>' + esc(i === 0 && canales ? p + ': ' + canales : p) + '</p></div>'; }).join('');
  const m = f.mensaje_ejemplo || {};
  const equipo = f.comerciales ? f.comerciales + ' comerciales' : 'vuestro equipo';
  const crm = f.crm ? 'en ' + esc(f.crm) : 'en vuestro CRM';
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Para ${esc(f.empresa)} · Qualivo</title>
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<style>
/* Layout: página de cuenta de una columna: lo que vimos, dónde se pierde, cómo quedaría, demo y siguiente paso. */
@font-face{font-family:'Montserrat';font-style:normal;font-weight:100 900;font-display:swap;src:url('/assets/fonts/montserrat-latin.woff2') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
:root{--ink:#101319;--soft:#3D4148;--muted:#5A5E66;--line:#E3E5EA;--bg:#FFFFFF;--panel:#F6F7F9;--teal:#0E7C74;--teal-b:#27BDB1;--teal-p:#E3F7F5;--coral:#E8590C;--font:'Montserrat',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--ink:#EEF0F3;--soft:#C9CDD3;--muted:#9AA0A8;--line:#2A2F37;--bg:#0D1014;--panel:#151A20;--teal:#3CC9BD;--teal-p:#123430;--coral:#FF8A4C;color-scheme:dark}}
:root[data-theme="dark"]{--ink:#EEF0F3;--soft:#C9CDD3;--muted:#9AA0A8;--line:#2A2F37;--bg:#0D1014;--panel:#151A20;--teal:#3CC9BD;--teal-p:#123430;--coral:#FF8A4C;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 var(--font);-webkit-font-smoothing:antialiased;padding-inline:16px;padding-block:0 48px}
a{color:var(--teal)}
h1,h2,h3{line-height:1.12;margin:0;text-wrap:balance;letter-spacing:-.01em}
h1{font-size:clamp(30px,5vw,48px);font-weight:800}
h2{font-size:clamp(23px,3.2vw,32px);font-weight:800}
h3{font-size:17px;font-weight:700}
p{margin:0}
.wrap{max-width:880px;margin-inline:auto}
header.top{display:flex;justify-content:space-between;align-items:center;padding-block:18px;gap:12px}
.logo{font-weight:800;font-size:20px;color:var(--ink);text-decoration:none}.logo span{color:var(--teal)}
.kicker{font-weight:700;font-size:13px;color:var(--teal);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px}
.lead{font-size:18px;color:var(--soft);margin-top:16px;max-width:60ch}
.btn{display:inline-block;font:inherit;font-weight:700;font-size:16px;border:0;border-radius:12px;padding:13px 20px;cursor:pointer;text-decoration:none;text-align:center;background:var(--teal);color:#fff}
.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
a:focus-visible{outline:3px solid var(--teal-b);outline-offset:2px}
section{padding-block:40px;border-top:1px solid var(--line)}
.sub{color:var(--soft);margin-top:10px;max-width:62ch}
.vimos{display:grid;gap:12px;margin-top:22px}
.vimos > div{background:var(--panel);border-radius:14px;padding:16px 18px 16px 56px;position:relative}
.vimos .n{position:absolute;left:16px;top:16px;width:28px;height:28px;border-radius:50%;background:var(--teal);color:#fff;font-weight:800;display:grid;place-items:center;font-size:14px}
.vimos p{font-size:16px}
.vimos small{display:block;color:var(--muted);font-size:13px;margin-top:6px}
.nosab{border:1px dashed var(--line);border-radius:12px;padding:12px 14px;color:var(--muted);font-size:14px;margin-top:14px}
ol.preg{margin:18px 0 0;padding-left:22px;display:grid;gap:10px;font-size:17px}
.pasos{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:22px}
.pasos > div{background:var(--panel);border-radius:12px;padding:14px;min-width:0}
.pasos b{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--teal-p);color:var(--teal);margin-bottom:8px}
.pasos p{font-size:14px;color:var(--soft)}
.msg{margin-top:22px;background:var(--panel);border-radius:14px;padding:18px;display:grid;gap:8px;max-width:620px}
.msg small{font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.msg .b{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:15px}
.demo{background:var(--ink);color:var(--bg);border-radius:20px;padding:34px;display:grid;grid-template-columns:1.3fr .7fr;gap:20px;align-items:center;margin-top:22px}
.demo p{color:color-mix(in srgb,var(--bg) 75%,var(--ink));margin-top:8px}
.demo .btn{background:var(--teal-b);color:#04231F}
.final{display:grid;grid-template-columns:1.3fr .7fr;gap:24px;align-items:center}
.note{font-size:13px;color:var(--muted)}
footer{padding-block:24px;color:var(--muted);font-size:13px;border-top:1px solid var(--line)}
@media (max-width:760px){.pasos{grid-template-columns:1fr 1fr}.demo,.final{grid-template-columns:1fr}.demo{padding:24px}}
@media (max-width:460px){.pasos{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="wrap">
  <header class="top"><a class="logo" href="/">qual<span>ivo</span></a><a class="btn ghost" href="/llamada/">Hablar 30 minutos</a></header>

  <p class="kicker">Para el equipo comercial de ${esc(f.empresa)} · ${esc(f.fecha)}</p>
  <h1>Lo que vimos desde fuera en ${esc(f.empresa)}, y cómo quedaría resuelto</h1>
  <p class="lead">Hemos mirado vuestra web y lo que se ve públicamente, como lo haría ${esc(seg.quien)} que os encuentra. Tres cosas comprobadas, tres preguntas y cómo lo dejaríamos. Nada de esto se ha enviado a nadie más.</p>

  <section>
    <h2>Lo que vimos</h2>
    <div class="vimos">${vimos}</div>
    ${f.no_sabemos ? '<p class="nosab"><b>Lo que no sabemos:</b> ' + esc(f.no_sabemos) + '</p>' : ''}
  </section>

  <section>
    <h2>Dónde creemos que se pierden ${esc(seg.cosa)}</h2>
    <p class="sub">Son preguntas, no afirmaciones. Si alguna no va con vosotros, mejor: así sabemos dónde no mirar.</p>
    <ol class="preg">${preguntas}</ol>
  </section>

  <section>
    <h2>Cómo quedaría en ${esc(f.empresa)}</h2>
    <p class="sub">Una capa encima de lo que ya usáis: cada contacto con su siguiente paso, ${esc(equipo)} con su tarea y dirección viéndolo sin pedir informes. Todo queda ${crm}.</p>
    <div class="pasos">${pasos}</div>
    ${m.texto ? '<div class="msg"><small>Ejemplo de seguimiento, preparado por el sistema y enviado por ' + esc(m.quien || 'vuestro comercial') + ' a ' + esc(m.para || 'un cliente') + '</small><div class="b">' + esc(m.texto) + '</div><p class="note">El comercial lo aprueba o lo cambia antes de que salga. Nada se envía solo al principio.</p></div>' : ''}
  </section>

  <section>
    <h2>Vedlo funcionando con vuestro nombre</h2>
    <div class="demo">
      <div><h3>Demo de ${esc(f.empresa)}</h3><p>Datos inventados de una empresa como la vuestra: entra una oportunidad, se puntúa, se reparte y dirección la ve. Tres minutos.</p></div>
      <a class="btn" id="demo" href="${demo}" target="_blank" rel="noopener">Abrir la demo</a>
    </div>
  </section>

  <section class="final">
    <div><h2>¿Lo vemos con vuestro CRM abierto?</h2><p class="sub">30 minutos con ${esc(f.cargo_decisor || 'quien dirige el equipo')}. Os decimos dónde se está quedando negocio y cómo quedaría. Si hay alguien más que participe en una decisión así, mejor que esté desde el principio.</p></div>
    <a class="btn" href="/llamada/">Reservar 30 minutos</a>
  </section>

  <footer>Qualivo · qualivo.io · maikel@qualivo.io · Página preparada para ${esc(f.empresa)} con datos públicos consultados el ${esc(f.fecha)}. No es una página de ${esc(f.empresa)}.</footer>
</div>
<script>
(function () {
  var t0 = Date.now(), maxScroll = 0, demo = false, enviado = false;
  function pct() { var h = document.documentElement; var s = (h.scrollTop + h.clientHeight) / h.scrollHeight * 100; if (s > maxScroll) maxScroll = Math.min(100, Math.round(s)); }
  function manda(final) {
    if (enviado && !final) return;
    var seg = Math.round((Date.now() - t0) / 1000);
    if (!demo && seg < 20) return;
    enviado = true;
    var body = JSON.stringify({ cuenta: ${JSON.stringify(f.slug)}, segundos: seg, scroll: maxScroll, demo: demo });
    try { navigator.sendBeacon('/api/visita', new Blob([body], { type: 'application/json' })); } catch (e) {}
  }
  window.addEventListener('scroll', pct, { passive: true });
  document.getElementById('demo').addEventListener('click', function () { demo = true; manda(true); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') manda(true); });
  window.addEventListener('pagehide', function () { manda(true); });
})();
</script>
</body>
</html>
`;
}

const dir = path.join(RAIZ, 'para', '_fichas');
const solo = process.argv[2];
let n = 0;
for (const archivo of fs.readdirSync(dir)) {
  if (!archivo.endsWith('.json')) continue;
  const f = JSON.parse(fs.readFileSync(path.join(dir, archivo), 'utf8'));
  if (solo && f.slug !== solo) continue;
  if (!/^[a-z0-9-]+$/.test(f.slug)) { console.error('slug inválido en ' + archivo); continue; }
  const destino = path.join(RAIZ, 'para', f.slug);
  fs.mkdirSync(destino, { recursive: true });
  fs.writeFileSync(path.join(destino, 'index.html'), pagina(f));
  console.log('para/' + f.slug + '/  ← ' + archivo);
  n++;
}
if (!n) console.error('No se generó ninguna página.');
