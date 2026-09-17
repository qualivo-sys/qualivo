// Identidad de un creador: claves canónicas para cruzar listas de origen distinto
// sin duplicar. Una misma persona aparece como youtube.com/@x, /channel/UC..., «@x» o un email.

const clean = (s) => String(s || '').trim().toLowerCase();

// Extrae plataforma y handle de cualquier URL o texto suelto.
export function parseHandle(raw) {
  let s = clean(raw).replace(/^@/, '');
  if (!s) return null;
  if (!/^https?:\/\//.test(s) && /\.(com|tv|gg|io)\//.test(s)) s = 'https://' + s;

  const rules = [
    [/youtube\.com\/@([\w.-]+)/, 'youtube'],
    [/youtube\.com\/channel\/(uc[\w-]+)/, 'youtube-id'],
    [/youtube\.com\/(?:c|user)\/([\w.-]+)/, 'youtube'],
    [/youtu\.be\/@?([\w.-]+)/, 'youtube'],
    [/twitch\.tv\/([\w.-]+)/, 'twitch'],
    [/tiktok\.com\/@([\w.-]+)/, 'tiktok'],
    [/(?:twitter|x)\.com\/([\w.-]+)/, 'x'],
    [/instagram\.com\/([\w.-]+)/, 'instagram'],
  ];
  for (const [re, platform] of rules) {
    const m = re.exec(s);
    if (m) {
      const handle = m[1].replace(/\/$/, '');
      if (['about', 'videos', 'featured', 'home', 'streams'].includes(handle)) continue;
      return { platform, handle };
    }
  }
  // Texto suelto sin URL: handle sin plataforma conocida.
  if (/^[\w.-]{2,40}$/.test(s)) return { platform: null, handle: s };
  return null;
}

export const normEmail = (e) => {
  const s = clean(e);
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(s)) return null;
  const [user, domain] = s.split('@');
  // Gmail ignora puntos y lo que va tras un «+».
  if (['gmail.com', 'googlemail.com'].includes(domain)) return user.split('+')[0].replace(/\./g, '') + '@gmail.com';
  return s;
};

// Todas las claves con las que se puede reconocer a alguien. Dos registros son la
// misma persona si comparten cualquiera de ellas.
export function identityKeys(rec) {
  const keys = new Set();
  const add = (k) => k && keys.add(k);

  for (const field of [rec.url, rec.canal, rec.handle, rec.perfil, ...(rec.links || [])]) {
    const p = parseHandle(field);
    if (p) add(p.platform ? `${p.platform}:${p.handle}` : `handle:${p.handle}`);
  }
  add(normEmail(rec.email) && `email:${normEmail(rec.email)}`);
  // Nombre a secas solo como última red: es la clave más frágil.
  const n = clean(rec.name || rec.nombre).replace(/[^a-z0-9]/g, '');
  if (n.length >= 4) add(`name:${n}`);
  return [...keys];
}

// Índice de claves -> registro, para cruzar en O(1).
export function buildIndex(records) {
  const idx = new Map();
  for (const r of records) for (const k of identityKeys(r)) if (!idx.has(k)) idx.set(k, r);
  return idx;
}

// Por defecto solo cruza por claves fuertes (URL, handle, email). Con allowNameOnly
// devuelve también las coincidencias de nombre, que son frágiles y hay que revisar.
export function findMatch(idx, rec, { allowNameOnly = false } = {}) {
  const keys = identityKeys(rec);
  for (const k of keys) {
    if (k.startsWith('name:')) continue;
    const hit = idx.get(k);
    if (hit) return { match: hit, by: k };
  }
  if (!allowNameOnly) return null;
  for (const k of keys) {
    const hit = k.startsWith('name:') && idx.get(k);
    if (hit) return { match: hit, by: k };
  }
  return null;
}
