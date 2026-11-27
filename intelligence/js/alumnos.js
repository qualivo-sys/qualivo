/* Alumnos (27-nov): gestión académica dentro de Intelligence, solo para el sector CANCOMAR.
 * Grupos, matrícula desde las plazas reservadas, fichas firmadas, documentación oficial y pagos,
 * en el mismo sistema que las peticiones. Usa los mismos contactos del sector: matricular aquí
 * mueve al contacto a «Matriculado y pagado» en todo Intelligence. Todo son datos de ejemplo. */
(function () {
  'use strict';
  const QV = window.QV;
  const esc = function (s) { return QV.esc(s); };
  const ico = QV.ico;
  const SECTOR = 'cancomar';

  const CSS = '.al-kpis{margin-bottom:14px}' +
    '.al-top{margin-bottom:18px}' +
    '.al-tareas{display:grid;gap:8px;margin-top:10px}' +
    '.al-tarea{display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 10px;border:1px solid var(--borde-2);border-radius:var(--radio-s)}' +
    '.al-tarea b{display:block;font-size:13.5px}.al-tarea span{display:block;font-size:12px}' +
    '.al-tarea.hecha{background:var(--verde-bg)}.al-tarea.hecha b{text-decoration:line-through;color:var(--gris)}' +
    '.al-check{width:24px;height:24px;border-radius:7px;border:2px solid var(--gris-3);background:var(--superficie);display:grid;place-items:center;cursor:pointer;padding:0;color:#fff}' +
    '.al-check[aria-pressed="true"]{background:var(--verde);border-color:var(--verde)}.al-check .ico{width:14px;height:14px}' +
    '.al-plazas{display:grid;gap:8px;margin-top:10px}' +
    '.al-plaza{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid var(--borde-2);border-radius:var(--radio-s)}' +
    '.al-link{display:inline-flex;gap:9px;align-items:center;cursor:pointer;min-width:0}.al-link>span{display:grid;min-width:0}.al-link b{font-size:13.5px}.al-link .gris{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.al-link:hover b{text-decoration:underline}' +
    '.al-seccion{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:6px 0 10px}.al-h2{font-size:17px;font-weight:800;display:flex;gap:8px;align-items:center}' +
    '.al-grupos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:12px}' +
    '.al-grupo{display:grid;gap:7px;text-align:left;font:inherit;color:inherit;cursor:pointer;align-content:start;transition:border-color .15s,box-shadow .15s}' +
    '.al-grupo:hover{border-color:var(--gris-3)}.al-sel{border-color:var(--verde);box-shadow:inset 0 0 0 1px var(--verde)}' +
    '.al-gcab{display:flex;gap:6px;flex-wrap:wrap}.al-gtit{font-size:15px;font-weight:800;line-height:1.25}.al-gmeta{font-size:12px}' +
    '.al-fila{display:flex;justify-content:space-between;gap:8px;font-size:12.5px}.al-fila span{color:var(--gris)}' +
    '.al-barra{height:7px;border-radius:99px;background:var(--hover);overflow:hidden}.al-barra i{display:block;height:100%;background:var(--azul);border-radius:99px}.al-barra i.v{background:var(--verde-2)}' +
    '.al-falta{display:flex;gap:6px;align-items:center;font-size:12px;font-weight:700;color:var(--coral)}.al-falta .ico{width:14px;height:14px}' +
    '.al-detalle{margin-bottom:18px}' +
    '.al-det-rejilla{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:18px;margin-top:12px}' +
    '.al-cal{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}' +
    '.al-dia{border:1px solid var(--borde);border-radius:var(--radio-s);padding:8px;display:grid;gap:2px;font-size:12px}.al-dia span{font-weight:700;color:var(--gris);text-transform:uppercase;font-size:10.5px;letter-spacing:.05em}.al-dia b{font-size:12px}.al-dia em{font-style:normal;color:var(--gris);font-size:11.5px;margin-bottom:4px}' +
    '.al-dia.hoy{border-color:var(--verde);background:var(--verde-bg)}.al-dia.mas{place-content:center;text-align:center;background:var(--hover)}' +
    '.al-docs{display:grid;gap:6px}.al-doc{display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:13px;padding:7px 10px;border:1px solid var(--borde-2);border-radius:var(--radio-s)}' +
    '.al-botones{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}' +
    '.al-detalle .tabla .al-link{gap:8px}' +
    '.al-pie{font-size:12px;margin-top:10px}' +
    '@media (max-width:1000px){.al-grupos{grid-template-columns:repeat(2,minmax(0,1fr))}.al-det-rejilla{grid-template-columns:1fr}}' +
    '@media (max-width:760px){.al-grupos{grid-template-columns:1fr}.al-plaza{flex-wrap:wrap}.al-tarea{grid-template-columns:26px minmax(0,1fr)}.al-tarea>.btn{grid-column:2;justify-self:start}}';
  const sty = document.createElement('style'); sty.textContent = CSS; document.head.appendChild(sty);
  const DEMO_PDF = '/propuestas/cancomar/gestion/#doc';
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  // ---- Datos de ejemplo de la parte académica ----
  // Los grupos se colocan respecto a hoy para que la demo siempre tenga sentido.
  // prod: el curso tal como lo pide el contacto en el CRM (sectores/cancomar.js).
  const GRUPOS = [
    { id: 'pmp', curso: 'Pack Marinero en la Pesca', prod: 'Pack Marinero en la Pesca', ini: -2, fin: 3, plazas: 16, otros: 12, firmadas: 12, cobrados: 11, aula: 'Aula 1 y zona de prácticas', prof: 'Javier L.', practicas: true, organismos: ['Pesca', 'Marina Mercante'], docs: { inicio: 'enviado', practicas: 'pendiente', fin: 'luego' } },
    { id: 'fb', curso: 'Actualización Formación Básica', prod: 'Actualización Formación Básica en Seguridad Marítima', ini: 3, fin: 4, plazas: 18, otros: 14, firmadas: 0, cobrados: 12, aula: 'Aula 1 y piscina', prof: 'Marta R.', practicas: true, organismos: ['Capitanía', 'Marina Mercante'], docs: { inicio: 'pendiente', practicas: 'pendiente', fin: 'luego' } },
    { id: 'lci', curso: 'Actualización Lucha Contra Incendios', prod: 'Actualización Avanzado Lucha Contra Incendios', ini: 10, fin: 11, plazas: 12, otros: 7, firmadas: 0, cobrados: 6, aula: 'Zona de prácticas', prof: 'Carlos V.', practicas: true, organismos: ['Capitanía'], docs: { inicio: 'luego', practicas: 'luego', fin: 'luego' } },
    { id: 'san', curso: 'Actualización Sanitaria Específica Inicial', prod: 'Actualización Formación Sanitaria Específica Inicial', ini: 17, fin: 18, plazas: 14, otros: 9, firmadas: 0, cobrados: 8, aula: 'Aula 2', prof: 'Elena P.', practicas: false, organismos: ['Capitanía'], docs: { inicio: 'luego', fin: 'luego' } },
    { id: 'goc', curso: 'Actualización Operador General SMSSM', prod: 'Actualización Operador General SMSSM / GMDSS', ini: 24, fin: 25, plazas: 10, otros: 5, firmadas: 0, cobrados: 5, aula: 'Aula 2 · simulador', prof: 'Nuria S.', practicas: false, organismos: ['Capitanía'], docs: { inicio: 'luego', fin: 'luego' } },
    { id: 'plp', curso: 'Patrón Local de Pesca', prod: 'Patrón Local de Pesca', ini: 45, fin: 83, plazas: 20, otros: 9, firmadas: 0, cobrados: 7, aula: 'Aula 2 · tardes', prof: 'Javier L.', practicas: true, organismos: ['Pesca', 'Capitanía'], docs: { inicio: 'luego', practicas: 'luego', fin: 'luego' } }
  ];
  const DOC_TXT = { inicio: 'Comunicación de inicio', practicas: 'Listado de prácticas', fin: 'Comunicación de fin' };
  const st = { grupo: 'fb', hechas: {}, firmas: {}, cobros: {}, extra: {}, sector: null };

  function reiniciarSiCambia(estado) {
    const clave = estado.sectorId + '|' + (estado.contactos ? estado.contactos.length : 0) + '|' + (estado.reinicio || '');
    if (st.sector === null) st.sector = clave;
  }
  function dia(off) { const d = new Date(); d.setHours(9, 0, 0, 0); d.setDate(d.getDate() + off); return d; }
  function f(d) { return d.getDate() + ' ' + MES[d.getMonth()]; }
  function rango(g) { const a = dia(g.ini), b = dia(g.fin); return g.ini === g.fin ? f(a) : f(a) + ' – ' + f(b); }
  function cuando(g) {
    if (g.ini <= 0 && g.fin >= 0) return { txt: 'En curso', cls: 't-teal' };
    if (g.ini > 0 && g.ini <= 7) return { txt: 'Empieza en ' + g.ini + (g.ini === 1 ? ' día' : ' días'), cls: 't-amber' };
    return { txt: 'En ' + g.ini + ' días', cls: 't-gris' };
  }
  function contactos() { return (QV.estado && QV.estado.contactos) || []; }
  function etapaIdx(id) { return QV.estado.cfg.recorrido.map(function (e) { return e.id; }).indexOf(id); }
  function grupoDe(prod) { return GRUPOS.filter(function (g) { return g.prod === prod; })[0]; }
  function nombreCorto(c) { return c.n.split(' ')[0] + ' ' + (c.n.split(' ')[1] || '').charAt(0) + '.'; }
  // Alumnos del CRM que están en un grupo: matriculados (etapa matrícula) de ese curso.
  function alumnosCRM(g) {
    const im = etapaIdx('matricula');
    return contactos().filter(function (c) { return c.etapa === im && c.prod === g.prod; });
  }
  function plazasReservadas() { const ip = etapaIdx('plaza'); return contactos().filter(function (c) { return c.etapa === ip && !c.fin; }); }
  function renovaciones() { const ir = etapaIdx('renovacion'); return contactos().filter(function (c) { return c.etapa === ir; }); }
  function totalAlumnos(g) { return g.otros + alumnosCRM(g).length; }
  function firmadas(g) {
    return g.firmadas + alumnosCRM(g).filter(function (c) { return st.firmas[c.id]; }).length;
  }
  function cobrados(g) { return g.cobrados + alumnosCRM(g).filter(function (c) { return st.cobros[c.id] !== 'pend'; }).length; }
  function estadoGrupo(g) {
    const n = totalAlumnos(g), fal = [];
    if (g.ini <= 7 && g.ini > 0 && g.docs.inicio === 'pendiente') fal.push('enviar la comunicación de inicio');
    if (g.ini <= 0 && g.docs.practicas === 'pendiente') fal.push('enviar el listado de prácticas');
    if (g.ini <= 0 && firmadas(g) < n) fal.push((n - firmadas(g)) + ' fichas por firmar');
    if (g.ini <= 7 && cobrados(g) < n) fal.push((n - cobrados(g)) + ' pagos pendientes');
    if (!fal.length) return { ok: true, txt: g.ini > 7 ? 'Preparando' : 'Todo listo', fal: [] };
    return { ok: false, txt: 'Falta algo', fal: fal };
  }

  // ---- Tareas del día (salen de los grupos y del CRM) ----
  function tareas() {
    const t = [];
    plazasReservadas().slice(0, 2).forEach(function (c) { t.push({ id: 'mat-' + c.id, txt: 'Matricular a ' + nombreCorto(c), det: c.prod, acc: 'matricular', c: c.id }); });
    GRUPOS.forEach(function (g) {
      if (g.ini > 0 && g.ini <= 7 && g.docs.inicio === 'pendiente') t.push({ id: 'ini-' + g.id, txt: 'Enviar la comunicación de inicio a ' + g.organismos[0], det: g.curso + ' · empieza el ' + f(dia(g.ini)) });
      if (g.ini <= 0 && g.fin >= 0) {
        if (g.docs.practicas === 'pendiente') t.push({ id: 'pra-' + g.id, txt: 'Enviar el listado de prácticas a Marina Mercante', det: g.curso + ' · en curso' });
        t.push({ id: 'asi-' + g.id, txt: 'Pasar la asistencia de hoy', det: g.curso + ' · ' + g.aula });
      }
    });
    t.push({ id: 'cal', txt: 'Revisar los cambios de aula de la semana', det: 'Los docentes los ven en su Google Calendar' });
    return t;
  }

  // ---- Vista ----
  function kpi(l, v, em, cls) {
    return '<div class="kpi"><span title="' + esc(l) + '">' + esc(l) + '</span><strong>' + v + '</strong><em class="' + (cls || '') + '">' + esc(em || '') + '</em></div>';
  }
  function barra(a, b, cls) {
    const p = b ? Math.round(a / b * 100) : 0;
    return '<div class="al-barra"><i class="' + (cls || '') + '" style="width:' + p + '%"></i></div>';
  }
  function docChip(g, k) {
    if (!(k in g.docs)) return '';
    const v = g.docs[k], m = { enviado: ['t-teal', 'Enviado'], pendiente: ['t-amber', 'Por enviar'], luego: ['t-gris', 'Más adelante'] }[v];
    return '<span class="al-doc"><span>' + esc(DOC_TXT[k]) + '</span><span class="pill ' + m[0] + '">' + m[1] + '</span></span>';
  }

  function tarjetaGrupo(g) {
    const n = totalAlumnos(g), q = cuando(g), e = estadoGrupo(g);
    return '<button type="button" class="tarjeta al-grupo' + (st.grupo === g.id ? ' al-sel' : '') + '" data-al-grupo="' + g.id + '">' +
      '<div class="al-gcab"><span class="pill ' + q.cls + '">' + esc(q.txt) + '</span><span class="pill ' + (e.ok ? 't-teal' : 't-coral') + '"><i></i>' + esc(e.txt) + '</span></div>' +
      '<b class="al-gtit">' + esc(g.curso) + '</b>' +
      '<span class="gris al-gmeta">' + esc(rango(g)) + ' · ' + esc(g.aula) + ' · ' + esc(g.prof) + '</span>' +
      '<span class="al-fila"><span>Plazas</span><b>' + n + ' de ' + g.plazas + '</b></span>' + barra(n, g.plazas) +
      (g.ini <= 0 ? '<span class="al-fila"><span>Fichas firmadas</span><b>' + firmadas(g) + ' de ' + n + '</b></span>' + barra(firmadas(g), n, 'v') : '<span class="al-fila"><span>Fichas</span><b class="gris">se firman el primer día</b></span>') +
      (e.fal.length ? '<span class="al-falta">' + ico('alerta') + esc(e.fal[0]) + (e.fal.length > 1 ? ' y ' + (e.fal.length - 1) + ' más' : '') + '</span>' : '') +
      '</button>';
  }

  function detalleGrupo(g) {
    const crm = alumnosCRM(g), n = totalAlumnos(g);
    const ses = [];
    for (let d = g.ini; d <= Math.min(g.fin, g.ini + 4); d++) ses.push(d);
    const filas = crm.map(function (c) {
      const fir = st.firmas[c.id], cob = st.cobros[c.id] !== 'pend';
      return '<tr><td><span class="al-link" data-abrir="' + c.id + '">' + QV.avatar(c) + '<b>' + esc(c.n) + '</b></span>' + (st.extra[c.id] ? ' <span class="pill t-teal">Nuevo</span>' : '') + '</td>' +
        '<td>' + (fir ? '<span class="pill t-teal">Firmada en tablet</span>' : '<button type="button" class="btn btn-mini" data-al-firmar="' + c.id + '">' + ico('check') + 'Recoger firma</button>') + '</td>' +
        '<td>' + (cob ? '<span class="pill t-teal">Pagado</span>' : '<span class="pill t-amber">Pendiente</span>') + '</td></tr>';
    }).join('');
    const otrosF = g.firmadas, otrosC = g.cobrados;
    return '<div class="tarjeta al-detalle">' +
      '<h3>' + ico('formacion') + esc(g.curso) + '<span class="sub">' + esc(rango(g)) + ' · ' + n + ' alumnos</span></h3>' +
      '<div class="al-det-rejilla">' +
        '<div><p class="pregunta-guia">Sesiones · las ve cada docente en su Google Calendar</p><div class="al-cal">' +
          ses.map(function (d) { const x = dia(d); return '<div class="al-dia' + (d === 0 ? ' hoy' : '') + '"><span>' + ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][x.getDay()] + ' ' + f(x) + '</span><b>9:00–13:00</b><em>' + esc(g.prof) + '</em><b>14:00–18:00</b><em>' + (g.practicas && d === g.fin ? 'Prácticas' : 'Teoría') + '</em></div>'; }).join('') +
          (g.fin - g.ini > 4 ? '<div class="al-dia mas"><span>y ' + (g.fin - g.ini - 4) + ' días más</span></div>' : '') +
        '</div></div>' +
        '<div><p class="pregunta-guia">Documentación del grupo</p><div class="al-docs">' +
          docChip(g, 'inicio') + docChip(g, 'practicas') + docChip(g, 'fin') +
          '<span class="al-doc"><span>Fichas y protección de datos</span><span class="pill ' + (g.ini <= 0 && firmadas(g) === n ? 't-teal' : 't-gris') + '">' + (g.ini <= 0 ? firmadas(g) + ' de ' + n : 'el primer día') + '</span></span>' +
        '</div>' +
        '<div class="al-botones"><button type="button" class="btn btn-primario" data-al-pdf="fichas" data-g="' + g.id + '">' + ico('flecha') + 'Descargar todas las fichas</button>' +
          '<button type="button" class="btn" data-al-pdf="asistencia" data-g="' + g.id + '">Listado de asistencia</button>' +
          (g.docs.inicio === 'pendiente' ? '<button type="button" class="btn btn-verde" data-al-doc="inicio" data-g="' + g.id + '">' + ico('enviar') + 'Preparar comunicación a ' + esc(g.organismos[0]) + '</button>' : '') +
          (g.docs.practicas === 'pendiente' && g.ini <= 0 ? '<button type="button" class="btn btn-verde" data-al-doc="practicas" data-g="' + g.id + '">' + ico('enviar') + 'Preparar listado de prácticas</button>' : '') +
        '</div></div>' +
      '</div>' +
      '<p class="pregunta-guia" style="margin-top:14px">Alumnos que vienen del CRM</p>' +
      (crm.length ? '<div class="tabla-caja"><table class="tabla"><thead><tr><th>Alumno</th><th>Ficha</th><th>Pago</th></tr></thead><tbody>' + filas + '</tbody></table></div>' : '<p class="gris">Todavía no hay alumnos de este curso en el CRM. Matricula a alguien desde «Plazas reservadas».</p>') +
      '<p class="gris al-pie">Y ' + g.otros + ' alumnos más de ejemplo (' + otrosF + ' fichas firmadas, ' + otrosC + ' pagos cobrados). Pulsa un nombre para ver su ficha completa: peticiones, conversaciones y matrícula, todo junto.</p>' +
      '</div>';
  }

  function vista() {
    const est = QV.estado;
    reiniciarSiCambia(est);
    const plz = plazasReservadas(), ren = renovaciones();
    const enCurso = GRUPOS.filter(function (g) { return g.ini <= 0 && g.fin >= 0; });
    const prox = GRUPOS.filter(function (g) { return g.ini > 0 && g.ini <= 14; });
    const sinFirma = GRUPOS.reduce(function (a, g) { return a + (g.ini <= 0 ? totalAlumnos(g) - firmadas(g) : 0); }, 0);
    const pendCobro = GRUPOS.filter(function (g) { return g.ini <= 14; }).reduce(function (a, g) { return a + totalAlumnos(g) - cobrados(g); }, 0);
    const tk = tareas(), hechas = tk.filter(function (t) { return st.hechas[t.id]; }).length;
    const g = GRUPOS.filter(function (x) { return x.id === st.grupo; })[0] || GRUPOS[1];

    const cab = QV.cabecera('Alumnos', '¿Qué grupos están en marcha y qué les falta?', 'Grupos, matrículas, fichas, documentación oficial y pagos, en el mismo sitio que las peticiones. <span class="pill t-amber">Datos de ejemplo</span>');
    const kp = '<div class="kpis al-kpis">' +
      kpi('Alumnos en clase esta semana', enCurso.reduce(function (a, x) { return a + totalAlumnos(x); }, 0), enCurso.length + (enCurso.length === 1 ? ' grupo en curso' : ' grupos en curso')) +
      kpi('Grupos que empiezan pronto', prox.length, 'en los próximos 14 días') +
      kpi('Plazas por matricular', plz.length, 'reservadas en el CRM', plz.length ? 'mal' : 'bien') +
      kpi('Fichas por firmar', sinFirma, 'de los grupos en curso', sinFirma ? 'mal' : 'bien') +
      kpi('Pagos pendientes', pendCobro, 'de grupos que empiezan pronto') +
      '</div>';

    const listaT = '<div class="tarjeta"><h3>' + ico('check') + 'Para hoy · académico<span class="sub">' + hechas + ' de ' + tk.length + ' hechas</span></h3><div class="al-tareas">' +
      tk.map(function (t) {
        const ok = st.hechas[t.id];
        return '<div class="al-tarea' + (ok ? ' hecha' : '') + '"><button type="button" class="al-check" data-al-hecha="' + t.id + '" aria-pressed="' + (ok ? 'true' : 'false') + '" aria-label="Marcar como hecha">' + (ok ? ico('check') : '') + '</button>' +
          '<div><b>' + esc(t.txt) + '</b><span class="gris">' + esc(t.det) + '</span></div>' +
          (t.acc === 'matricular' && !ok ? '<button type="button" class="btn btn-mini btn-verde" data-al-matricular="' + t.c + '">Matricular</button>' : '') + '</div>';
      }).join('') + '</div></div>';

    const listaP = '<div class="tarjeta"><h3>' + ico('persona') + 'Plazas reservadas · pasar a matrícula<span class="sub">del CRM</span></h3>' +
      (plz.length ? '<div class="al-plazas">' + plz.map(function (c) {
        const gr = grupoDe(c.prod);
        return '<div class="al-plaza"><span class="al-link" data-abrir="' + c.id + '">' + QV.avatar(c) + '<span><b>' + esc(c.n) + '</b><span class="gris">' + esc(c.prod) + (gr ? ' · ' + esc(rango(gr)) : '') + '</span></span></span>' +
          '<button type="button" class="btn btn-mini btn-verde" data-al-matricular="' + c.id + '">Matricular</button></div>';
      }).join('') + '</div><p class="gris al-pie">Un clic: el alumno entra en su grupo con los datos que ya dio por WhatsApp, sin teclear nada. Su ficha queda lista para firmar en tablet.</p>' :
        '<p class="gris">Al día: no quedan plazas reservadas por matricular.</p>') + '</div>';

    const grupos = '<div class="al-seccion"><h2 class="al-h2">' + ico('calendario') + 'Grupos</h2><p class="gris">Pulsa un grupo para ver sus sesiones, alumnos y documentación.</p></div>' +
      '<div class="al-grupos">' + GRUPOS.map(tarjetaGrupo).join('') + '</div>' + detalleGrupo(g);

    const pagos = (function () {
      const filas = [];
      GRUPOS.filter(function (x) { return x.ini <= 14; }).forEach(function (x) {
        alumnosCRM(x).forEach(function (c) { filas.push([c, x]); });
      });
      return '<div class="tarjeta"><h3>' + ico('euro') + 'Pagos de los alumnos<span class="sub">conectado a vuestra facturación</span></h3>' +
        (filas.length ? '<div class="tabla-caja" style="margin-top:10px"><table class="tabla"><thead><tr><th>Alumno</th><th>Estado</th></tr></thead><tbody>' +
          filas.map(function (r, i) {
            const c = r[0], pend = st.cobros[c.id] === 'pend';
            return '<tr><td><span class="al-link" data-abrir="' + c.id + '"><span><b>' + esc(c.n) + '</b><span class="gris">' + esc(r[1].curso) + ' · factura F26-' + (318 + i) + '</span></span></span></td><td>' + (pend ? '<span class="pill t-amber">Pendiente</span> <button type="button" class="btn btn-mini" data-al-cobrar="' + c.id + '">Marcar cobrado</button>' : (c.seg === 'empresa' || /empresa/i.test(c.rol || '') ? '<span class="pill t-lila">Paga la empresa</span>' : '<span class="pill t-teal">Cobrada</span>')) + '</td></tr>';
          }).join('') + '</tbody></table></div>' : '<p class="gris">Aún no hay alumnos matriculados desde el CRM.</p>') +
        '<p class="gris al-pie">La factura y el cobro se hacen en el programa de facturación (Ágora u otro, lo decidimos tras revisarlo). Aquí veis el estado de cada alumno sin cambiar de programa.</p></div>';
    })();

    const renov = '<div class="tarjeta"><h3>' + ico('ciclo') + 'Certificados y renovaciones<span class="sub">a 5 años</span></h3>' +
      '<p class="gris" style="margin:6px 0 10px">Al cerrar cada grupo, sus certificados quedan con fecha de caducidad. Meses antes, el sistema prepara el aviso por WhatsApp.</p>' +
      '<div class="al-plazas">' + ren.slice(0, 4).map(function (c) {
        return '<div class="al-plaza"><span class="al-link" data-abrir="' + c.id + '">' + QV.avatar(c) + '<span><b>' + esc(c.n) + '</b><span class="gris">' + esc(c.rol || c.prod) + '</span></span></span><span class="pill t-lila">Renovación</span></div>';
      }).join('') + '</div></div>';

    return cab + kp +
      '<div class="rejilla r-21 al-top">' + listaT + listaP + '</div>' +
      grupos +
      '<div class="rejilla r-2 al-bottom">' + pagos + renov + '</div>' +
      '<p class="gris al-pie" style="margin-top:14px">Lo que haces aquí (matricular, firmar, marcar cobrado) se ve también en Oportunidades, Recorrido y en la ficha de cada persona: es el mismo sistema.</p>';
  }

  // ---- Acciones ----
  function matricular(id) {
    const est = QV.estado, c = QV.contacto ? QV.contacto(id) : est.contactos.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    const g = grupoDe(c.prod);
    c.etapa = etapaIdx('matricula');
    c.act = 0;
    c.conv = c.conv || [];
    c.conv.push({ t: est.ahora, de: 'a', canal: 'wa', texto: 'Matrícula confirmada' + (g ? ' para ' + g.curso + ' (' + rango(g) + ', ' + g.aula + ')' : '') + '. El primer día firmarás tu ficha en tablet. Trae el DNI y tu libreta marítima.' });
    st.extra[c.id] = true;
    st.cobros[c.id] = 'pend';
    st.hechas['mat-' + c.id] = true;
    if (g) st.grupo = g.id;
    QV.recalcular();
    QV.pintarTodo();
    QV.aviso(c.n.split(' ')[0] + ' matriculado' + (g ? ' en ' + g.curso : '') + '. 0 campos tecleados.', 'check');
  }

  document.addEventListener('click', function (e) {
    if (!QV.estado || QV.estado.sectorId !== SECTOR) return;
    const t = e.target.closest && e.target.closest('[data-al-grupo],[data-al-matricular],[data-al-hecha],[data-al-firmar],[data-al-cobrar],[data-al-pdf],[data-al-doc]');
    if (!t) return;
    e.preventDefault();
    if (t.hasAttribute('data-al-grupo')) { st.grupo = t.getAttribute('data-al-grupo'); QV.pintarVista(); const d = document.querySelector('.al-detalle'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return; }
    if (t.hasAttribute('data-al-matricular')) { matricular(t.getAttribute('data-al-matricular')); return; }
    if (t.hasAttribute('data-al-hecha')) { const k = t.getAttribute('data-al-hecha'); st.hechas[k] = !st.hechas[k]; QV.pintarVista(); return; }
    if (t.hasAttribute('data-al-firmar')) { st.firmas[t.getAttribute('data-al-firmar')] = true; QV.pintarVista(); QV.aviso('Ficha firmada en tablet y guardada en el grupo', 'check'); return; }
    if (t.hasAttribute('data-al-cobrar')) { st.cobros[t.getAttribute('data-al-cobrar')] = 'ok'; QV.pintarVista(); QV.aviso('Cobro registrado (en la versión real llega del programa de facturación)', 'euro'); return; }
    if (t.hasAttribute('data-al-doc')) {
      const g = GRUPOS.filter(function (x) { return x.id === t.getAttribute('data-g'); })[0], k = t.getAttribute('data-al-doc');
      g.docs[k] = 'enviado'; st.hechas[(k === 'inicio' ? 'ini-' : 'pra-') + g.id] = true;
      QV.pintarVista(); QV.aviso(DOC_TXT[k] + ' preparada con los datos del grupo. Demo: no ha salido nada.', 'enviar'); return;
    }
    if (t.hasAttribute('data-al-pdf')) {
      const g = GRUPOS.filter(function (x) { return x.id === t.getAttribute('data-g'); })[0];
      const n = totalAlumnos(g);
      QV.aviso((t.getAttribute('data-al-pdf') === 'fichas' ? 'Un solo PDF con las ' + n + ' fichas del grupo' : 'Listado de asistencia de ' + n + ' alumnos') + '. Abro un ejemplo en otra pestaña.', 'flecha');
      window.open(DEMO_PDF, '_blank', 'noopener');
    }
  });

  // Pestaña «Alumnos» solo en CANCOMAR, después de Conversaciones.
  const prev = QV.navExtra;
  QV.navExtra = function (estado) {
    const l = prev ? prev(estado) : [];
    if (estado.sectorId === SECTOR) l.push({ id: 'alumnos', txt: 'Alumnos', ico: 'formacion', tras: 'conversaciones' });
    return l;
  };
  QV.VISTA_FN.alumnos = vista;
})();
