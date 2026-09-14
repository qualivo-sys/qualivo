/**
 * Leads del formulario instantáneo de Meta — Antic Barcelona 113
 *
 * El problema que resuelve: los leads del formulario de Meta no pasan por la
 * web, así que por defecto se quedan en el Centro de clientes potenciales de
 * Meta. Serían dos buzones, y el segundo no lo abre nadie.
 *
 * Esto los trae cada 15 minutos a la MISMA hoja que los de la web, con el
 * mismo aviso al comercial y el mismo circuito. Un solo sitio donde mirar.
 *
 * Se eligió consultar la API cada 15 min en vez de montar un webhook porque
 * el webhook exige app secret, verificación de firma y un endpoint público
 * más que mantener. Con un SLA de 2 horas, 15 minutos de retraso no cambian
 * nada y hay la mitad de piezas que se pueden romper.
 *
 * Configuración: Proyecto → Configuración → Propiedades del script
 *   META_TOKEN   token de usuario de sistema con leads_retrieval (no caduca)
 */

var PAGE_ID = '383844784821243';
var API = 'https://graph.facebook.com/v21.0';

function traerLeadsDeMeta() {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('META_TOKEN');
  if (!token) return;

  var formularios = listarFormularios(token);
  if (!formularios.length) return;

  var yaEstan = idsYaGuardados();
  var nuevos = 0;

  formularios.forEach(function (form) {
    var clave = 'ULTIMO_LEAD_' + form.id;
    var desde = Number(props.getProperty(clave) || 0);
    var masReciente = desde;

    leadsDelFormulario(token, form.id, desde).forEach(function (bruto) {
      if (yaEstan[bruto.id]) return;
      var lead = mapear(bruto, form);
      guardar(lead);
      avisarComercial(lead, props);
      yaEstan[bruto.id] = true;
      nuevos++;
      var t = Math.floor(new Date(bruto.created_time).getTime() / 1000);
      if (t > masReciente) masReciente = t;
    });

    if (masReciente > desde) props.setProperty(clave, String(masReciente));
  });

  if (nuevos) console.log('Traídos ' + nuevos + ' leads del formulario de Meta.');
}

function listarFormularios(token) {
  var r = pedir(API + '/' + PAGE_ID + '/leadgen_forms?fields=id,name&limit=50&access_token=' + token);
  return (r && r.data) || [];
}

function leadsDelFormulario(token, formId, desde) {
  var url = API + '/' + formId + '/leads?limit=100&fields=' +
    'id,created_time,field_data,ad_id,ad_name,adset_name,campaign_name,platform' +
    '&access_token=' + token;
  if (desde) {
    url += '&filtering=' + encodeURIComponent(JSON.stringify(
      [{ field: 'time_created', operator: 'GREATER_THAN', value: desde }]));
  }
  var r = pedir(url);
  return (r && r.data) || [];
}

function pedir(url) {
  var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var cuerpo = JSON.parse(resp.getContentText() || '{}');
  if (cuerpo.error) {
    console.error('Meta respondió: ' + (cuerpo.error.error_user_msg || cuerpo.error.message));
    return null;
  }
  return cuerpo;
}

/** field_data de Meta → la misma forma que manda la web. */
function mapear(bruto, form) {
  var campos = {};
  (bruto.field_data || []).forEach(function (f) {
    campos[f.name] = (f.values && f.values[0]) || '';
  });

  var lead = {
    fecha: new Date(bruto.created_time),
    origen: 'meta_form',
    nombre: campos.full_name || [campos.first_name, campos.last_name].filter(Boolean).join(' '),
    email: campos.email || '',
    telefono: campos.phone_number || '',
    pieza: campos.pieza || '',
    espacio: campos.espacio || '',
    medidas: campos.medidas || '',
    plazo: campos.plazo || '',
    utm_source: 'meta',
    utm_campaign: bruto.campaign_name || '',
    utm_content: bruto.ad_name || '',
    utm_term: bruto.adset_name || '',
    lead_id: bruto.id,
    notas: 'Formulario «' + (form.name || form.id) + '»' +
      (bruto.platform ? ' · ' + bruto.platform : ''),
  };
  lead.tier = puntuar(lead);
  return lead;
}

/**
 * Mismo criterio que el cuestionario de la web, menos la pregunta de
 * presupuesto, que el formulario de Meta no hace.
 *
 * Por eso un HOT de formulario vale menos que un HOT de web: le falta la
 * señal más cara de conseguir. Al comparar las dos campañas hay que tenerlo
 * en cuenta y mirar cuántos llegan a «Presupuesto enviado», no cuántos
 * entran marcados como HOT.
 */
function puntuar(lead) {
  if (lead.plazo === 'Solo estoy explorando') return 'COLD';
  var definido = lead.pieza && lead.espacio && /\d/.test(String(lead.medidas));
  var cerca = lead.plazo === 'Lo antes posible' || lead.plazo === 'En los próximos 3 meses';
  if (definido && cerca) return 'HOT';
  return 'WARM';
}

function idsYaGuardados() {
  var hoja = hojaLeads();
  var mapa = {};
  if (hoja.getLastRow() < 2) return mapa;
  hoja.getRange(2, idx('lead_id'), hoja.getLastRow() - 1, 1).getValues()
    .forEach(function (f) { if (f[0]) mapa[String(f[0])] = true; });
  return mapa;
}

/** Para comprobar a mano que el token y los permisos están bien. */
function probarConexionMeta() {
  var token = PropertiesService.getScriptProperties().getProperty('META_TOKEN');
  if (!token) throw new Error('Falta META_TOKEN en las propiedades del script.');
  var forms = listarFormularios(token);
  console.log('Formularios visibles: ' + forms.map(function (f) {
    return f.name + ' (' + f.id + ')';
  }).join(', ') || 'ninguno');
}
