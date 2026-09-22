// Normaliza los datasets crudos de Apify (YouTube y Twitch) a un registro común de creador.
export const CORE_2026 = ['peak', 'r.e.p.o', 'repo', 'meccha chameleon', 'mecha chameleon', 'bombanana', 'mimic party', 'machine party'];
export const CORE_CLASSIC = ['gang beasts', 'party animals', 'stick fight', 'pummel party', 'rubber bandits', 'havocado', 'move or die'];
export const ADJACENT = ['human fall flat', 'fall guys', 'chained together', 'crab game', 'duck game', 'boomerang fu',
  'ultimate chicken horse', 'golf with your friends', 'knight squad', 'bopl battle', 'stumble guys', 'content warning',
  'lethal company', 'phasmophobia', 'pico park', 'overcooked', 'goose goose duck', 'among us', 'mario party',
  'brawlhalla', 'towerfall', 'speedrunners', 'super bunny man', 'it takes two', 'split fiction', 'liar\'s bar'];

const PT = /\b(jogando|jogo|jogos|com amigos|n[aã]o|voc[eê]|muito|minha|n[oó]s|at[eé]|jogamos|epis[oó]dio)\b/gi;
const ES = /\b(jugando|juego|juegos|con amigos|muy|nosotros|hasta|jugamos|amigos|gracioso|divertido|partida|risas)\b/gi;
const EN = /\b(the|and|we|with|this|that|playing|game|games|funny|moments|friends|our)\b/gi;

export function detectLang(text, fallback = 'en') {
  const t = String(text || '');
  const pt = (t.match(PT) || []).length, es = (t.match(ES) || []).length, en = (t.match(EN) || []).length;
  if (pt >= 3 && pt > es) return 'pt';
  if (es > en) return 'es';
  if (en > 0) return 'en';
  return fallback;
}

const matchGames = (text) => {
  const t = String(text || '').toLowerCase();
  return {
    core2026: CORE_2026.filter((g) => t.includes(g)),
    coreClassic: CORE_CLASSIC.filter((g) => t.includes(g)),
    adjacent: ADJACENT.filter((g) => t.includes(g)),
  };
};

// Vídeos de streamers/youtube-scraper -> un registro por canal
export function fromYouTube(items) {
  const by = new Map();
  for (const v of items) {
    const url = v.channelUrl || (v.channelUsername ? `https://www.youtube.com/@${v.channelUsername}` : null);
    if (!url) continue;
    const c = by.get(url) || { platform: 'youtube', url, name: v.channelName, followers: v.numberOfSubscribers || 0,
      videos: [], games: new Set(), collabs: new Set(), links: new Set(), emails: new Set() };
    const text = `${v.title || ''} ${(v.text || '').slice(0, 400)}`;
    const m = matchGames(text);
    for (const g of [...m.core2026, ...m.coreClassic, ...m.adjacent]) c.games.add(g);
    for (const col of v.collaborators || []) c.collabs.add(typeof col === 'string' ? col : col.name || col.channelName || '');
    for (const l of v.descriptionLinks || []) { const u = typeof l === 'string' ? l : l.url || ''; if (u) c.links.add(u); }
    for (const e of (v.text || '').match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi) || []) c.emails.add(e.toLowerCase());
    c.videos.push({ title: v.title || '', url: v.url, views: v.viewCount || 0, likes: v.likes || 0,
      comments: v.commentsCount || 0, date: v.date || '' });
    by.set(url, c);
  }
  return [...by.values()].map((c) => {
    const n = c.videos.length;
    const best = [...c.videos].sort((a, b) => b.views - a.views)[0] || {};
    return { platform: 'youtube', url: c.url, name: c.name, followers: c.followers,
      audience: Math.round(c.videos.reduce((a, b) => a + b.views, 0) / n),
      engagement: +(c.videos.reduce((a, b) => a + (b.views ? (b.likes + b.comments) / b.views : 0), 0) / n * 100).toFixed(2),
      games: [...c.games], collabs: [...c.collabs].filter(Boolean), links: [...c.links],
      email: [...c.emails].find((e) => !/\.(png|jpe?g|gif)$/i.test(e)) || '',
      lang: detectLang(c.videos.map((v) => v.title).join(' ')),
      citedTitle: best.title || '', citedUrl: best.url || '', citedViews: best.views || 0,
      recentTitles: c.videos.map((v) => v.title).slice(0, 10), matchedCount: n };
  });
}

// Redes escritas a mano dentro de una biografía. Se normalizan a URL completa para que
// parseHandle() las reconozca igual que si vinieran de un campo estructurado.
const SOCIAL = /(?:https?:\/\/)?(?:www\.)?((?:instagram|twitter|x|tiktok|youtube|linktr|beacons|bio)\.(?:com|ee|ai|link)\/[\w.\-@]+)/gi;
export function socialsFrom(text) {
  const out = new Set();
  for (const m of String(text || '').matchAll(SOCIAL)) {
    const u = m[1].replace(/[.,)]+$/, '');
    if (!/\/(about|videos|home|featured)$/i.test(u)) out.add('https://' + u);
  }
  return [...out];
}

// Streamers de scrapemint/twitch-streamer-leads -> un registro por canal
export function fromTwitch(items) {
  const by = new Map();
  for (const r of items) {
    if (!r.login || by.has(r.login)) continue;
    const cat = r.matchedCategory || '';
    by.set(r.login, {
      platform: 'twitch', url: r.url, name: r.displayName || r.login,
      followers: +(r.followers || 0), audience: +(r.liveViewers || 0), engagement: null,
      games: [cat].filter(Boolean),
      // El actor no devuelve socialLinks: los streamers escriben sus redes dentro de la
      // biografía, en texto y a menudo sin protocolo. De ahí salen el Instagram y la X
      // con los que se llega a quien no publica correo, que es la mayoría.
      links: socialsFrom(`${r.description || ''} ${r.panels || ''}`),
      email: r.businessEmail && String(r.businessEmail) !== 'None' ? r.businessEmail : '',
      lang: (r.language || 'EN').toLowerCase().slice(0, 2),
      partner: !!r.isPartner, affiliate: !!r.isAffiliate, bio: r.description || '',
      citedTitle: cat ? `en directo con ${cat}` : '', citedUrl: r.url, citedViews: +(r.liveViewers || 0),
      lastStream: r.lastStreamedAt || '', scrapedAt: r.scrapedAt || '', matchedCount: 1,
    });
  }
  return [...by.values()];
}

export { matchGames };
