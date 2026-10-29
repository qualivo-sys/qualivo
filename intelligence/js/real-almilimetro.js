/* Cuenta privada de Al Milímetro: /intelligence/?cuenta=almilimetro
 * Pide la contraseña, lee /api/intelligence-almilimetro/?accion=tablero (solo con sesión) y monta
 * el sector «almilimetro» con las oportunidades reales del pipeline de Sonia en GHL.
 * Solo lectura: no envía mensajes ni mueve oportunidades. En el código no hay ni un dato real. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor;
  const esc = function (s) { return QV.esc(s); };
  const $ = function (s) { return document.querySelector(s); };
  const API = '/api/intelligence-almilimetro/';
  const MIN = 60000;
  let datos = null;

  function caja(html) {
    $('#app').hidden = true; $('#inicio').hidden = true;
    let el = $('#acceso');
    if (!el) { el = document.createElement('section'); el.id = 'acceso'; el.className = 'inicio'; document.body.insertBefore(el, document.body.firstChild); }
    el.hidden = false;
    el.innerHTML = '<div class="inicio-caja" style="max-width:420px"><img class="inicio-logo" src="/assets/img/qualivo-logo.png" alt="Qualivo" width="132" height="32">' +
      '<p class="eyebrow">Intelligence System · Al Milímetro</p>' + html + '</div>';
    return el;
  }
  function pantallaClave(mensaje) {
    caja('<h1 style="font-size:26px">Tus contactos y tus obras</h1>' +
      '<form id="formClave" class="inicio-empresa" style="margin-top:8px" autocomplete="on">' +
        '<label for="clave">Contraseña</label><input id="clave" name="password" type="password" autocomplete="current-password" required>' +
        '<p id="claveError" style="color:var(--coral);font-size:13px;min-height:20px;margin-top:8px">' + esc(mensaje || '') + '</p>' +
        '<button class="btn btn-primario btn-grande" type="submit" style="width:100%">Entrar</button></form>' +
      '<p class="inicio-nota">Solo lectura: desde aquí no se envía nada a nadie ni se cambia nada en el CRM.</p>');
    $('#clave').focus();
    $('#formClave').addEventListener('submit', function (e) {
      e.preventDefault();
      const b = e.target.querySelector('button'); b.disabled = true; b.textContent = 'Entrando…';
      fetch(API + '?accion=entrar', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clave: $('#clave').value }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (x) { if (!x.ok) { b.disabled = false; b.textContent = 'Entrar'; $('#claveError').textContent = x.d.error || 'No se ha podido entrar.'; return; } cargar(false); })
        .catch(function () { b.disabled = false; b.textContent = 'Entrar'; $('#claveError').textContent = 'Sin conexión. Prueba otra vez.'; });
    });
  }
  function cargar(fresco) {
    caja('<h1 style="font-size:24px">Leyendo tus contactos…</h1><p class="inicio-nota">La primera vez tarda unos segundos; después se guarda 3 minutos.</p>');
    return fetch(API + '?accion=tablero' + (fresco ? '&fresco=1' : ''), { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) {
        if (r.status === 401) { pantallaClave(); return null; }
        return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; });
      })
      .then(function (d) { return d && QV.cargarSector('almilimetro').then(function () { montar(d); }); })
      .catch(function (err) { pantallaClave(err.message); });
  }

  const hace = function (t, ahora) { return t == null ? null : Math.round((ahora - t) / MIN); };
  const TIPO = { 'Chalet o casa entera': 'chalet', 'Piso entero': 'piso', 'Cocina y baño': 'cb', 'Dos baños': 'cb' };
  const CUANDO = { 'Menos de 3 meses': 3, 'Entre 3 y 6 meses': 6 };

  function aContacto(r, ahora) {
    return {
      id: r.id, n: r.n + (r.prueba ? ' (prueba)' : ''), rol: 'Clase ' + (r.clase || '—') + ' · ' + r.puntos + ' puntos', emp: '', seg: 'particular',
      ciudad: r.zona || r.cp || '—', prod: [r.tipo, r.metros].filter(Boolean).join(' · ') || 'Reforma', orig: r.origen, canal: 'wa',
      etapa: r.etapa, etapaTxt: r.etapaNombre, valor: r.valor, ghl: r.ghl, tel: '', email: '', web: '',
      creado: hace(r.creado, ahora), act: hace(r.cambio || r.creado, ahora), toque: null, fin: r.fin || undefined,
      f: { fitFijo: r.puntos || 0, tipo: TIPO[r.tipo], cuando: CUANDO[r.cuando] },
      s: { revision: r.revision },
      conv: [], ev: [], llamadas: []
    };
  }
  function embudo(lista) {
    const n = function (f) { return lista.filter(f).length; };
    return { anuncio: 0, solicitud: lista.length, contactado: n(function (c) { return c.etapa >= 2; }), visita: n(function (c) { return c.etapa >= 3; }),
      presupuesto: n(function (c) { return c.etapa >= 4; }), seguimiento: n(function (c) { return c.etapa >= 5; }), obra: n(function (c) { return c.fin === 'ganado'; }) };
  }

  function construir(d) {
    const base = window.QV_SECTORES.almilimetro;
    const ahora = Date.now();
    const contactos = d.contactos.map(function (r) { return aContacto(r, ahora); });
    const campanas = base.campanas.map(function (c) {
      const suyos = contactos.filter(function (k) { return k.orig === c.id; });
      // La inversión llega cuando se conecte la cuenta de anuncios de Meta: hasta entonces, 0
      return Object.assign({}, c, { inversion: 0, embudo: embudo(suyos) });
    });
    return Object.assign({}, base, {
      id: 'almilimetroReal', nombre: 'Al Milímetro · datos reales', real: true, cuenta: 'almilimetro', _ok: false,
      historias: null, historiaDefecto: null, campanas: campanas, contactos: contactos,
      columnasCrm: d.etapas || [],
      mesDatos: { respuestaAntes: 0, respuestaAhora: 0, agendadas: contactos.filter(function (c) { return c.etapa >= 3; }).length },
      // La clase la calcula el formulario (api/_am-modelo.js) y se guarda en GHL: el encaje que pinta
      // Intelligence es esa misma puntuación, en escalones de 5 (el motor solo suma puntos fijos)
      reglas: Object.assign({}, base.reglas, { fitBase: 0, fit: [[function () { return true; }, 0, function (c) { return 'puntuación del formulario: ' + c.f.fitFijo; }]]
        .concat(Array.from({ length: 20 }, function (_, i) { return [function (c) { return (c.f.fitFijo || 0) >= (i + 1) * 5; }, 5, '']; })) }),
      kpiCustom: function (m, cfg, Mo, est) {
        const cs = (est && est.contactos) || [];
        const a = cs.filter(function (c) { return /^Clase A/.test(c.rol); }).length;
        return {
          cpvisita: { l: 'Coste por visita técnica', v: '—', em: 'Falta conectar la cuenta de anuncios' },
          pctA: { l: 'Contactos A', v: Mo.pct(a / Math.max(1, cs.length)), em: a + ' de ' + cs.length + ' (según el formulario)' }
        };
      }
    });
  }
  function montar(d) {
    datos = d;
    window.QV_SECTORES.almilimetroReal = construir(d);
    const acc = $('#acceso'); if (acc) acc.hidden = true;
    QV.iniciar({ sector: 'almilimetroReal', empresa: 'Al Milímetro', objetivo: 'todo', vista: 'resumen' }).then(function () {
      if (!d.contactos.length) QV.aviso('Todavía no hay contactos en el pipeline. Aparecerán aquí en cuanto entre el primero.', 'info');
    });
  }
  function pintarBarra() {
    const chip = $('#chipSector'); if (chip && datos) chip.textContent = 'Al Milímetro · datos reales · ' + M.hora(datos.generado);
    const b = $('#demoBotones'); if (b) b.innerHTML = '<button class="btn" type="button" data-am="salir">Salir</button>';
    const sel = $('#selSector'); if (sel) sel.innerHTML = '<option value="almilimetroReal" selected>Al Milímetro · datos reales</option>';
  }
  document.addEventListener('click', function (e) {
    const s = e.target.closest && e.target.closest('[data-am="salir"]');
    if (!s) return;
    fetch(API + '?accion=salir', { method: 'POST', credentials: 'same-origin' }).finally(function () { datos = null; pantallaClave('Has salido.'); });
  });
  QV.cuentas = QV.cuentas || {};
  QV.cuentas.almilimetro = { arrancar: function () { cargar(false); }, recargar: function () { cargar(true); }, pintarBarra: pintarBarra };
})();
