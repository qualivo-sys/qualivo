// Genera la primera línea del mensaje: qué vídeo/directo se cita y el detalle.
// Reglas, no IA: es auditable y no inventa nada que no esté en los datos.
const GAME_LABEL = { 'r.e.p.o': 'R.E.P.O.', repo: 'R.E.P.O.', peak: 'PEAK', 'meccha chameleon': 'Meccha Chameleon',
  'mecha chameleon': 'Meccha Chameleon', bombanana: 'Bombanana', 'mimic party': 'Mimic Party',
  'gang beasts': 'Gang Beasts', 'party animals': 'Party Animals', 'pummel party': 'Pummel Party',
  'stick fight': 'Stick Fight', 'rubber bandits': 'Rubber Bandits' };
const label = (g) => GAME_LABEL[String(g).toLowerCase()] || g;
// Evita 'R.E.P.O..' al final de frase.
const labelMid = (g) => String(label(g)).replace(/\.$/, '');
const nf = (n, lang) => new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(Math.round(n));

const trim = (t, n = 70) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

export function personalize(c, lang = c.lang) {
  const es = lang === 'es';
  const game = label(c.games?.[0] || '');

  if (c.platform === 'twitch') {
    const v = c.audience || 0;
    return {
      cited: es ? `tu directo de ${game}` : `your ${game} stream`,
      detail: v >= 40
        ? (es ? `con ${nf(v, 'es')} personas dentro` : `with ${nf(v, 'en')} people watching`)
        : (es ? 'y me quedé un rato' : `and stuck around for a while`),
      citedUrl: c.url,
    };
  }

  const title = trim(c.citedTitle);
  const views = c.citedViews || 0;
  const squad = c.collabs?.length ? c.collabs[0] : null;
  let detail;
  if (squad) detail = es ? `el que grabaste con ${squad}` : `the one you recorded with ${squad}`;
  else if (views >= 50000) detail = es ? `el que se fue a ${nf(views, 'es')} vistas` : `the one that hit ${nf(views, 'en')} views`;
  else if (game) detail = es ? `la parte de ${game}` : `the ${game} part`;
  else detail = es ? 'y me reí bastante' : 'and it made me laugh';

  return {
    cited: title ? (es ? `tu vídeo «${title}»` : `your video "${title}"`) : (es ? `tus vídeos de ${game}` : `your ${game} videos`),
    detail, citedUrl: c.citedUrl || c.url,
  };
}

// Mensaje directo listo para copiar (Twitch, X o Discord). No se envía solo: se pega a mano.
export function dmText(c, bookingUrl, lang = c.lang) {
  const p = personalize(c, lang);
  const game = label(c.games?.[0] || '');
  if (lang === 'es') {
    return `Hola ${c.name}, te vi ${c.platform === 'twitch' ? `en directo con ${labelMid(c.games?.[0] || '')}` : `en ${p.cited}`}. `
      + `Soy Lea, hago Don't Kill Rumble, un brawler con físicas de 1 a 6 jugadores. `
      + `Estamos haciendo un playtest abierto con el equipo antes del lanzamiento. ¿Te reservo una hora? `
      + `Podés venir con tu gente o jugar con nosotros. Sin embargo, grabá lo que quieras. ${bookingUrl}`;
  }
  return `Hey ${c.name}, saw you ${c.platform === 'twitch' ? `live with ${labelMid(c.games?.[0] || '')}` : `in ${p.cited}`}. `
    + `I'm Lea, I make Don't Kill Rumble, a 1-6 player physics brawler. `
    + `We're running an open playtest with the dev team before launch. Want an hour with us? `
    + `Bring your squad or play with our crew. No embargo, record whatever. ${bookingUrl}`;
}

export const utmFor = (c) => {
  const slug = String(c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  return `https://store.steampowered.com/app/2146310/?utm_source=creator&utm_campaign=playtest&utm_content=${slug}`;
};
