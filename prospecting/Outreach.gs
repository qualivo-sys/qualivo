/**
 * Outreach.gs · capa de contacto. SIEMPRE bajo control humano: estas funciones
 * se lanzan desde el menú sobre filas ya revisadas, NUNCA desde el trigger
 * automático (que solo detecta y escribe). Así protegemos reputación de dominio
 * y cumplimiento (RGPD / LSSI en España).
 */

/** Máximo de acciones de contacto por lote (evita disparos masivos). */
var OUTREACH_BATCH = 30;

/**
 * Crea borradores de Gmail para los prospectos "Cualificado" que tengan email.
 * Deja el borrador en Gmail para revisar y enviar a mano. No envía nada.
 */
function generarBorradores() {
  applyConfigOverrides();
  var rows = readProspectsByState(['Cualificado']);
  var done = 0;
  for (var i = 0; i < rows.length && done < OUTREACH_BATCH; i++) {
    var p = rows[i];
    if (!p.contactEmail) continue;
    try {
      GmailApp.createDraft(p.contactEmail, p.subject || ('Propuesta para ' + p.company), p.message || '', {
        name: QUALIVO.senderName || QUALIVO.name
      });
      setProspectState(p._row, 'Borrador listo', 'Borrador Gmail creado ' + nowStamp());
      done++;
    } catch (e) {
      logEvent('Borrador error', p.company + ': ' + e);
    }
  }
  logEvent('Borradores generados', done + ' borradores de Gmail');
  return done;
}

/**
 * Empuja los prospectos con email a la campaña de Smartlead (en pausa, para
 * revisar). Cambia su estado a "En secuencia (Smartlead)".
 */
function enviarASmartlead() {
  applyConfigOverrides();
  if (!hasCreds('Smartlead')) { logEvent('Smartlead', 'Falta SMARTLEAD_API_KEY / SMARTLEAD_CAMPAIGN_ID'); return 0; }
  var rows = readProspectsByState(['Cualificado', 'Borrador listo']);
  var done = 0;
  for (var i = 0; i < rows.length && done < OUTREACH_BATCH; i++) {
    var p = rows[i];
    if (!p.contactEmail) continue;
    var ok = smartleadAddLead(p);
    if (ok) { setProspectState(p._row, 'En secuencia (Smartlead)', 'Añadido a Smartlead ' + nowStamp()); done++; }
  }
  logEvent('Enviados a Smartlead', done + ' contactos');
  return done;
}

/**
 * Empuja los prospectos con LinkedIn a la lista de HeyReach (para lanzar la
 * campaña desde HeyReach tras revisar).
 */
function enviarAHeyReach() {
  applyConfigOverrides();
  if (!hasCreds('HeyReach')) { logEvent('HeyReach', 'Falta HEYREACH_API_KEY / HEYREACH_LIST_ID'); return 0; }
  var rows = readProspectsByState(['Cualificado', 'Borrador listo']);
  var done = 0;
  for (var i = 0; i < rows.length && done < OUTREACH_BATCH; i++) {
    var p = rows[i];
    if (!p.contactLinkedin) continue;
    var ok = heyreachAddLead(p);
    if (ok) { setProspectState(p._row, 'En secuencia (HeyReach)', 'Añadido a HeyReach ' + nowStamp()); done++; }
  }
  logEvent('Enviados a HeyReach', done + ' contactos');
  return done;
}
