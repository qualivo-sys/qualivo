/* Modo demo: una historia de 60-90 segundos que modifica el MISMO estado que
 * el resto de la app. El contacto nuevo aparece en Oportunidades, sus
 * puntuaciones suben, salta la señal, y el Copilot lo sabe si le preguntas. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor, ico = QV.ico, esc = QV.esc;
  const $ = function (s) { return document.querySelector(s); };
  const VEL = window.QV_DEMO_VEL || 1.2; // multiplica la duración de cada paso

  let d = null; // { historia, paso, timer, inicio, restante, pausado, antes, fin }

  function E() { return QV.estado; }
  function historia() { const cfg = E().cfg; return cfg.historias && cfg.historias[E().historia || cfg.historiaDefecto]; }
  function demoC() { return QV.contacto('demo'); }

  function pintarBotones() {
    const el = $('#demoBotones');
    if (!el) return;
    if (!historia()) { el.innerHTML = ''; return; }
    if (!d) el.innerHTML = '<button class="btn btn-verde" type="button" data-demo="empezar">' + ico('play') + '<span>Iniciar demo</span></button>';
    else if (d.fin) el.innerHTML = '<button class="btn btn-verde" type="button" data-demo="empezar">' + ico('reinicio') + '<span>Repetir demo</span></button>';
    else el.innerHTML = '<button class="btn" type="button" data-demo="' + (d.pausado ? 'reanudar' : 'pausar') + '">' + ico(d.pausado ? 'play' : 'pausa') + '<span>' + (d.pausado ? 'Reanudar' : 'Pausar') + '</span></button>';
  }

  function empezar() {
    const h = historia();
    if (!h) return;
    parar(true);
    const est = E();
    est.contactos = est.contactos.filter(function (c) { return c.id !== 'demo'; });
    const c = M.preparar(h.contacto, est.ahora);
    est.contactos.push(c);
    est.nuevos = { demo: true };
    d = { historia: h, paso: -1, pausado: false, antes: null, fin: false };
    QV.cerrarFicha();
    QV.recalcular();
    est.filtro = 'todos';
    QV.irA('oportunidades');
    $('#demoPanel').hidden = false;
    pintarBotones();
    siguiente();
  }

  function aplicar(paso) {
    const est = E(), c = demoC();
    if (!c) return;
    est.ahora += (paso.min || 0) * M.MIN;
    const k = paso.cambio || {};
    Object.keys(k).forEach(function (key) {
      if (key === 's' || key === 'f') {
        c[key] = Object.assign(c[key] || {}, k[key]);
        if (key === 's' && k.s.cita != null) c.s.tCita = est.ahora + k.s.cita * M.MIN;
      } else if (key === 'conv') {
        c.conv.push({ t: est.ahora, de: k.conv[0], canal: k.conv[1], texto: k.conv[2] });
        if (k.conv[0] === 'c') c.tAct = est.ahora; else c.tToque = est.ahora;
      } else {
        c[key] = k[key];
      }
    });
    if (paso.toque) c.tToque = est.ahora;
    if (paso.act) c.tAct = est.ahora;
    if (!k.conv && d.paso > 0) c.ev.push({ t: est.ahora, tipo: /visita|página|web/i.test(paso.feed) ? 'web' : 'sistema', texto: paso.feed });
    est.feed.push({ t: est.ahora, ico: paso.humano ? 'persona' : k.conv ? (k.conv[0] === 'c' ? 'conversaciones' : 'whatsapp') : d.paso === 0 ? 'nueva' : 'auto', tono: paso.humano ? 't-coral' : 't-teal', titulo: paso.feed, quien: c.n, id: c.id, nuevo: true });
  }

  function siguiente() {
    if (!d) return;
    d.paso++;
    const pasos = d.historia.pasos;
    if (d.paso >= pasos.length) return;
    const paso = pasos[d.paso];
    const c0 = demoC();
    d.antes = c0 && c0.x ? { fit: c0.x.fit, comp: c0.x.comp, int: c0.x.int, riesgo: c0.x.riesgo } : null;
    aplicar(paso);
    QV.recalcular();
    E().nuevos = { demo: true };
    QV.pintarNav();
    QV.pintarBarra();
    QV.pintarVista();
    if (E().fichaId === 'demo') QV.abrirFicha('demo');
    pintarPanel(paso);
    if (paso.humano) return final(paso);
    d.restante = (paso.dur || 6) * 1000 * VEL;
    programar();
  }

  function programar() {
    clearTimeout(d.timer);
    d.inicio = Date.now();
    d.timer = setTimeout(siguiente, d.restante);
  }

  function final(paso) {
    const c = demoC();
    d.fin = true;
    // La intención ya está en lo alto: el motor lo manda a una persona.
    const el = $('#humano');
    el.innerHTML = '<span class="humano-tag">' + ico('persona') + 'Requiere persona · ' + esc(c.x.nba.quien) + '</span><h3>' + esc(paso.humano.titulo) + '</h3><p>' + esc(paso.humano.texto) + '</p>' +
      '<div class="botones"><button class="btn btn-primario" type="button" data-abrir="demo">Ver ficha completa</button><button class="btn" type="button" data-demo="preguntar">Preguntar al Copilot</button><button class="btn btn-fantasma" type="button" data-demo="cerrar-humano">Cerrar</button></div>';
    el.hidden = false;
    pintarBotones();
    pintarPanel(paso);
  }

  function pintarPanel(paso) {
    const c = demoC(), h = d.historia, n = h.pasos.length;
    const a = d.antes || {};
    const val = function (k, v, inv) {
      const cls = a[k] == null ? '' : v > a[k] ? (inv ? 'baja' : 'sube') : '';
      const delta = a[k] != null && v !== a[k] ? '<small style="font-size:11px;margin-left:4px;opacity:.8">' + (v > a[k] ? '↑' : '↓') + Math.abs(v - a[k]) + '</small>' : '';
      return '<b class="' + cls + '">' + v + delta + '</b>';
    };
    $('#demoPanel').classList.toggle('pausado', !!d.pausado);
    $('#demoPanel').innerHTML =
      '<div class="l1"><small>Modo demo · paso ' + (d.paso + 1) + ' de ' + n + '</small><span style="font-size:12px;color:#9AA2AE">' + esc(c.n) + ' · ' + M.hora(E().ahora) + '</span></div>' +
      '<h4>' + esc(paso.txt) + '</h4>' +
      '<div class="progreso">' + h.pasos.map(function (p, i) { return '<i class="' + (i < d.paso ? 'hecho' : i === d.paso ? (paso.humano ? 'hecho' : 'actual') : '') + '" style="--dur:' + ((p.dur || 6) * VEL) + 's"></i>'; }).join('') + '</div>' +
      '<div class="dsc"><div><span>Encaje</span>' + val('fit', c.x.fit) + '</div><div><span>Actividad</span>' + val('comp', c.x.comp) + '</div>' + (h.riesgo ? '<div><span>Riesgo</span>' + val('riesgo', c.x.riesgo, true) + '</div>' : '<div><span>Intención</span>' + val('int', c.x.int) + '</div>') + '<div><span>Prioridad</span><b style="font-size:13px;padding-top:4px">' + M.PRIO[c.x.prio].txt + '</b></div></div>' +
      '<div class="ctrl">' + (d.fin ? '<button class="btn" type="button" data-demo="empezar">' + ico('reinicio') + 'Repetir</button>' : '<button class="btn" type="button" data-demo="' + (d.pausado ? 'reanudar' : 'pausar') + '">' + ico(d.pausado ? 'play' : 'pausa') + (d.pausado ? 'Reanudar' : 'Pausar') + '</button>') +
      '<button class="btn" type="button" data-abrir="demo">Ver ficha</button><span style="flex:1"></span><button class="btn" type="button" data-demo="salir">Salir</button></div>';
  }

  function pausar() {
    if (!d || d.fin || d.pausado) return;
    clearTimeout(d.timer);
    d.restante = Math.max(300, d.restante - (Date.now() - d.inicio));
    d.pausado = true;
    pintarPanel(d.historia.pasos[d.paso]);
    pintarBotones();
  }
  function reanudar() {
    if (!d || !d.pausado) return;
    d.pausado = false;
    pintarPanel(d.historia.pasos[d.paso]);
    pintarBotones();
    programar();
  }
  // Parar deja el estado como está (el contacto sigue en el sistema).
  function parar(silencioso) {
    if (d) clearTimeout(d.timer);
    d = null;
    const p = $('#demoPanel'), h = $('#humano');
    if (p) p.hidden = true;
    if (h) h.hidden = true;
    if (!silencioso) pintarBotones();
  }

  document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-demo]');
    if (!b) return;
    const a = b.dataset.demo;
    if (a === 'empezar') empezar();
    else if (a === 'pausar') pausar();
    else if (a === 'reanudar') reanudar();
    else if (a === 'salir') { parar(); }
    else if (a === 'cerrar-humano') { $('#humano').hidden = true; }
    else if (a === 'preguntar') {
      $('#humano').hidden = true;
      const p = QV.copilot.todas().filter(function (x) { return x.h === 'trabajar'; })[0];
      if (window.innerWidth <= 1180) $('#copilot').classList.add('abierto');
      QV.copilot.preguntarSugerida(p);
    }
  });
  // Barra espaciadora: pausar / reanudar (cómodo al presentar)
  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space' || !d || d.fin) return;
    if (/input|textarea|select|button/i.test((e.target.tagName || ''))) return;
    e.preventDefault();
    d.pausado ? reanudar() : pausar();
  });
  // Los clics en «Ver ficha» dentro del aviso cierran el aviso
  document.addEventListener('click', function (e) { if (e.target.closest('#humano [data-abrir]')) $('#humano').hidden = true; }, true);

  QV.demo = { empezar: empezar, pausar: pausar, reanudar: reanudar, parar: parar, pintarBotones: pintarBotones, activo: function () { return !!d; } };
})();
