// Vigilancia del numero de voz y de su expediente regulatorio en Twilio.
//
// El 11-sep Twilio rechazo el Regulatory Bundle de Espana y, al rechazarlo,
// libero el numero del agente. Nadie se entero hasta el 15, cuando un lead real
// se quedo sin su llamada: la centralita devolvia un SIP 404 que parecia un
// problema de enrutado y en realidad era que la cuenta se habia quedado sin
// ningun numero detras del trunk.
//
// La documentacion regulatoria se revisa y se rechaza sin avisar, y cuando cae
// se lleva el numero por delante. Esto lo mira todos los dias y avisa por
// correo. Cuando todo esta en orden no escribe nada.

const TW = 'https://api.twilio.com/2010-04-01';
const NUMBERS = 'https://numbers.twilio.com/v2';
const DIAS_AVISO_CADUCIDAD = 30;

// Preferimos una API Key (SK...) porque se revoca sola sin tocar la cuenta.
// El Auth Token vale como respaldo, pero da acceso total y conviene no usarlo.
function credenciales() {
  const cuenta = process.env.TWILIO_ACCOUNT_SID;
  if (!cuenta) return null;
  const usuario = process.env.TWILIO_API_KEY_SID || cuenta;
  const clave = process.env.TWILIO_API_KEY_SECRET || process.env.TWILIO_AUTH_TOKEN;
  if (!clave) return null;
  return { cuenta: cuenta, cabecera: 'Basic ' + Buffer.from(usuario + ':' + clave).toString('base64') };
}

async function pedir(url, cred) {
  const r = await fetch(url, { headers: { Authorization: cred.cabecera } });
  if (!r.ok) throw new Error('twilio ' + r.status + ' en ' + url.split('?')[0].split('/').slice(-1)[0]);
  return r.json();
}

async function avisar(asunto, html) {
  if (!process.env.RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
      to: [process.env.INFORME_PAID_TO || 'maikel@qualivo.io'],
      subject: asunto, html: html
    })
  }).catch(function () {});
}

function parrafo(texto, color) {
  return '<p style="font:15px/1.6 system-ui' + (color ? ';color:' + color : '') + '">' + texto + '</p>';
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const cred = credenciales();
  if (!cred) return res.status(500).json({ ok: false, error: 'not_configured' });

  const alarmas = [];
  const parte = { numeros: null, bundles: [] };

  try {
    const d = await pedir(TW + '/Accounts/' + cred.cuenta + '/IncomingPhoneNumbers.json?PageSize=50', cred);
    const numeros = d.incoming_phone_numbers || [];
    parte.numeros = numeros.map(function (n) { return n.phone_number; });
    if (!numeros.length) {
      alarmas.push('<b>La cuenta no tiene ningun numero.</b> El agente no puede llamar a nadie. ' +
        'Esto es exactamente lo que paso el 11 de septiembre.');
    }
  } catch (e) {
    alarmas.push('No se ha podido leer el inventario de numeros: ' + String(e && e.message));
  }

  try {
    const d = await pedir(NUMBERS + '/RegulatoryCompliance/Bundles?PageSize=20', cred);
    for (const b of d.results || []) {
      const estado = String(b.status || '');
      parte.bundles.push({ nombre: b.friendly_name, estado: estado, hasta: b.valid_until });
      if (estado === 'twilio-rejected') {
        alarmas.push('Expediente <b>' + b.friendly_name + '</b> rechazado. Mientras siga asi no se puede ' +
          'comprar ni conservar un numero espanol.');
      }
      if (estado === 'twilio-approved' && b.valid_until) {
        const dias = Math.round((new Date(b.valid_until) - Date.now()) / 86400000);
        if (dias <= DIAS_AVISO_CADUCIDAD) {
          alarmas.push('Expediente <b>' + b.friendly_name + '</b> caduca en ' + dias + ' dias (' +
            String(b.valid_until).slice(0, 10) + '). Renovarlo antes de que se lleve el numero por delante.');
        }
      }
    }
  } catch (e) {
    alarmas.push('No se han podido leer los expedientes regulatorios: ' + String(e && e.message));
  }

  if (alarmas.length) {
    await avisar(
      'La voz saliente esta en riesgo',
      alarmas.map(function (a) { return parrafo(a, '#C2410C'); }).join('') +
      parrafo('Numeros en la cuenta: ' + (parte.numeros && parte.numeros.length ? parte.numeros.join(', ') : 'ninguno')) +
      parrafo('Expedientes: ' + (parte.bundles.length
        ? parte.bundles.map(function (b) { return b.nombre + ' (' + b.estado + ')'; }).join(' · ')
        : 'ninguno')) +
      parrafo('El detalle de la averia anterior esta en paid/devoluciones/2026-09-15-averia-voz-twilio.md', '#666')
    );
  }

  return res.status(200).json({ ok: true, alarmas: alarmas.length, parte: parte });
};
