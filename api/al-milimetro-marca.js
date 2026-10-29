// Al Milímetro: los botones de los emails de Sonia y el enlace de baja de los leads.
//
//   GET /api/al-milimetro-marca?l=<lead>&a=<acción>&t=<firma>
//       acción: respondio · presupuesto · mas_adelante · stop · ganado · perdido · baja
//               visita → enseña un formulario con fecha y hora; al enviarlo (…&cita=AAAA-MM-DDTHH:MM)
//               guarda la cita y apunta el evento, y el reloj programa W7 y W8.
//
// Cada acción apunta un evento en am_eventos; api/_am-flujos.js hace el resto (paradas,
// visita, recuperación). La firma es la de al-milimetro-cron.js (HMAC con CRON_SECRET).

const DB = require('./_am-db.js');
const H = require('./_horario.js');
const { firma } = require('./al-milimetro-cron.js');

const ACCIONES = {
  respondio: ['Apuntado: ha contestado', 'Se paran los mensajes automáticos con este contacto. A partir de aquí sigues tú.'],
  visita: ['Visita apuntada', 'Le llegará la confirmación por WhatsApp (te aviso para que la envíes) y el recordatorio antes de la visita.'],
  presupuesto: ['Presupuesto apuntado', 'Te aviso a los 2, 7, 14 y 21 días para hacer el seguimiento, salvo que conteste antes.'],
  mas_adelante: ['Apuntado: más adelante', 'Ya no le llegan WhatsApp; solo los emails.'],
  stop: ['Parado', 'Este contacto ya no recibe nada más.'],
  ganado: ['¡Enhorabuena!', 'Obra apuntada como ganada.'],
  perdido: ['Apuntado como perdido', 'Si quieres, contesta a mi email con el motivo y lo guardo.'],
  baja: ['Hecho. No te escribo más.', 'No recibirás más correos de Al Milímetro.']
};

function pagina(titulo, html) {
  return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + titulo + ' · Al Milímetro</title><meta name="robots" content="noindex"></head>' +
    '<body style="margin:0;background:#F7F8F9;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#101319">' +
    '<div style="max-width:520px;margin:60px auto;background:#fff;border-radius:16px;padding:36px 30px">' +
    '<h1 style="margin:0 0 12px;font-size:24px">' + titulo + '</h1><div style="font-size:16px;line-height:1.6;color:#3D4148">' + html + '</div></div></body></html>';
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const q = req.query || {};
  const l = String(q.l || ''), a = String(q.a || ''), t = String(q.t || '');
  if (!process.env.CRON_SECRET || !/^[\w-]{4,64}$/.test(l) || !ACCIONES[a] || t !== firma(l, a)) {
    return res.status(400).send(pagina('Enlace no válido', '<p>Este enlace no es correcto o ha caducado.</p>'));
  }
  try {
    if (a === 'visita') {
      const cita = String(q.cita || '');
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(cita)) {
        return res.status(200).send(pagina('¿Cuándo es la visita?',
          '<form method="get"><input type="hidden" name="l" value="' + l + '"><input type="hidden" name="a" value="visita"><input type="hidden" name="t" value="' + t + '">' +
          '<p><input type="datetime-local" name="cita" required style="font-size:18px;padding:8px"></p>' +
          '<p><button style="font-size:16px;padding:10px 18px;border-radius:10px;border:0;background:#0E7C74;color:#fff">Guardar</button></p></form>'));
      }
      const [fecha, hm] = cita.split('T');
      const [hh, mm] = hm.split(':').map(Number);
      await DB.ponerCita(l, new Date(H.msDeMadrid(fecha, hh * 60 + mm)).toISOString());
    }
    await DB.apuntar(l, a, { desde: 'enlace' });
  } catch (e) {
    console.error('[al-milimetro-marca]', e.message);
    return res.status(502).send(pagina('No se ha podido guardar', '<p>Inténtalo otra vez en un minuto. Si sigue fallando, avisa a Qualivo.</p>'));
  }
  return res.status(200).send(pagina(ACCIONES[a][0], '<p>' + ACCIONES[a][1] + '</p>'));
};
