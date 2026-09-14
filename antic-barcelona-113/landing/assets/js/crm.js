/**
 * CRM — Antic Barcelona 113
 *
 * Pensado para mirarse desde el móvil en el taller, no desde un escritorio.
 * Por eso lo primero que se ve no es un listado completo de leads sino la
 * pestaña «Hoy»: lo que hay que contestar antes de ponerse a trabajar.
 *
 * Los datos viven en la hoja de cálculo. Esto solo es la cara.
 */
(function () {
  'use strict';

  var ESTADOS = ['Nuevo', 'Contactado', 'Visita o llamada', 'Presupuesto enviado', 'Ganado', 'Perdido'];
  var ABIERTOS = ESTADOS.slice(0, 4);
  var MOTIVOS = ['Precio', 'Plazo', 'No contesta', 'Compró en otro sitio', 'Solo miraba', 'Fuera de zona', 'Otro'];
  var ORIGENES = { guia: 'Guía', cuestionario: 'Cuestionario', meta_form: 'Formulario Meta' };

  var leads = [];
  var pestana = 'hoy';
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // ── Servidor ──────────────────────────────────────────────────────────────

  function api(carga) {
    return fetch('/api/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carga),
    }).then(function (r) {
      return r.json().then(function (j) { return { estado: r.status, cuerpo: j }; });
    });
  }

  // ── Acceso ────────────────────────────────────────────────────────────────

  $('#formAcceso').addEventListener('submit', function (e) {
    e.preventDefault();
    var boton = e.target.querySelector('button');
    boton.disabled = true; boton.textContent = 'Entrando…';
    api({ accion: 'entrar', password: $('#pass').value }).then(function (r) {
      boton.disabled = false; boton.textContent = 'Entrar';
      if (r.cuerpo.ok) { $('#pass').value = ''; entrar(); return; }
      $('#errAcceso').textContent =
        r.cuerpo.error === 'demasiados_intentos' ? 'Demasiados intentos. Prueba en 15 minutos.'
        : r.cuerpo.error === 'sin_configurar' ? 'Falta configurar CRM_PASSWORD en Vercel.'
        : 'Contraseña incorrecta.';
    });
  });

  $('#salir').addEventListener('click', function () {
    api({ accion: 'salir' }).then(function () { location.reload(); });
  });
  $('#recargar').addEventListener('click', function () { cargar(true); });

  function entrar() {
    $('#acceso').hidden = true;
    $('#app').hidden = false;
    cargar();
  }

  function cargar(manual) {
    if (manual) $('#recargar').style.opacity = '.4';
    api({ accion: 'listar' }).then(function (r) {
      $('#recargar').style.opacity = '';
      if (r.estado === 401) { $('#acceso').hidden = false; $('#app').hidden = true; return; }
      if (!r.cuerpo.ok) {
        $('#lista').innerHTML = '<div class="vacio">No se pudo leer la hoja.<br>' +
          esc(r.cuerpo.detalle || r.cuerpo.error || '') + '</div>';
        return;
      }
      leads = r.cuerpo.leads || [];
      pintarPestanas();
      pintar();
    });
  }

  // ── Selección ─────────────────────────────────────────────────────────────

  function haVencido(l) {
    if (!l.fecha_proxima || ABIERTOS.indexOf(l.estado) < 0) return false;
    var d = new Date(l.fecha_proxima); d.setHours(23, 59, 59, 999);
    return d < new Date();
  }

  function deHoy() {
    // Lo que de verdad hay que hacer: lo que nadie ha tocado y lo que se pasó
    // de fecha. Primero los HOT, y dentro de cada grupo, el que lleva más
    // tiempo esperando.
    return leads.filter(function (l) { return l.estado === 'Nuevo' || haVencido(l); })
      .sort(function (a, b) {
        var pa = (a.tier === 'HOT' ? 0 : 1), pb = (b.tier === 'HOT' ? 0 : 1);
        if (pa !== pb) return pa - pb;
        return new Date(a.fecha || 0) - new Date(b.fecha || 0);
      });
  }

  function deEstado(e) { return leads.filter(function (l) { return l.estado === e; }); }

  function pintarPestanas() {
    var hoy = deHoy().length;
    var abiertos = leads.filter(function (l) { return ABIERTOS.indexOf(l.estado) >= 0; }).length;
    var tabs = [
      ['hoy', 'Hoy', hoy],
      ['abiertos', 'En marcha', abiertos],
      ['todos', 'Todos', leads.length],
      ['panel', 'Panel', null],
    ];
    $('#pestanas').innerHTML = tabs.map(function (t) {
      return '<button role="tab" data-t="' + t[0] + '" aria-selected="' + (pestana === t[0]) + '">' +
        t[1] + (t[2] !== null ? '<b>' + t[2] + '</b>' : '') + '</button>';
    }).join('');
    Array.prototype.forEach.call($('#pestanas').children, function (b) {
      b.addEventListener('click', function () {
        pestana = b.dataset.t; pintarPestanas(); pintar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // ── Pintado ───────────────────────────────────────────────────────────────

  function pintar() {
    if (pestana === 'panel') return pintarPanel();
    var lista = pestana === 'hoy' ? deHoy()
      : pestana === 'abiertos' ? leads.filter(function (l) { return ABIERTOS.indexOf(l.estado) >= 0; })
      : leads;

    if (!lista.length) {
      $('#lista').innerHTML = '<div class="vacio">' + (pestana === 'hoy'
        ? 'Nada pendiente. Todos los leads están contestados y con fecha.'
        : 'Todavía no hay leads aquí.') + '</div>';
      return;
    }
    $('#lista').innerHTML = lista.map(tarjeta).join('');
    Array.prototype.forEach.call($('#lista').querySelectorAll('.tarjeta'), function (t) {
      t.addEventListener('click', function (ev) {
        if (ev.target.closest('.wa')) return;      // el botón de WhatsApp no abre la ficha
        abrirFicha(t.dataset.id);
      });
    });
  }

  function tarjeta(l) {
    var tel = String(l.telefono || '').replace(/\D/g, '');
    var hot = l.tier === 'HOT';
    var chips = [];
    if (hot) chips.push('<span class="chip hot">Hot</span>');
    chips.push('<span class="chip' + (l.estado === 'Ganado' ? ' ok' : '') + '">' + esc(l.estado || 'Nuevo') + '</span>');
    if (haVencido(l)) chips.push('<span class="chip tarde">Vencido</span>');
    chips.push('<span class="chip">' + esc(ORIGENES[l.origen] || l.origen || '—') + '</span>');

    return '<button class="tarjeta' + (hot && l.estado === 'Nuevo' ? ' hot' : '') +
      '" data-id="' + esc(l.lead_id) + '">' +
      '<div class="fila1"><span class="nombre">' + esc(l.nombre || 'Sin nombre') + '</span>' +
      '<span class="cuando">' + cuando(l.fecha) + '</span></div>' +
      '<div class="que">' + esc([l.pieza, l.medidas, l.presupuesto].filter(Boolean).join(' · ') ||
        l.proxima_accion || '—') + '</div>' +
      '<div class="pie">' + chips.join('') +
      (tel ? '<span class="wa" onclick="event.stopPropagation();window.open(\'https://wa.me/' +
        tel + '\',\'_blank\')">WhatsApp</span>' : '') + '</div></button>';
  }

  function cuando(f) {
    if (!f) return '';
    var d = new Date(f), min = (Date.now() - d) / 60000;
    if (min < 60) return Math.max(1, Math.round(min)) + ' min';
    if (min < 1440) return Math.round(min / 60) + ' h';
    if (min < 10080) return Math.round(min / 1440) + ' d';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }

  // ── Panel ─────────────────────────────────────────────────────────────────

  function pintarPanel() {
    var n = leads.length;
    var ganados = deEstado('Ganado');
    var facturado = ganados.reduce(function (a, l) { return a + (Number(l.importe) || 0); }, 0);
    var abierto = deEstado('Presupuesto enviado')
      .reduce(function (a, l) { return a + (Number(l.importe) || 0); }, 0);
    var mes = new Date(); mes.setDate(1); mes.setHours(0, 0, 0, 0);
    var delMes = leads.filter(function (l) { return l.fecha && new Date(l.fecha) >= mes; }).length;

    var cifras = [
      [n, 'Leads en total'],
      [delMes, 'Este mes'],
      [deHoy().length, 'Pendientes hoy'],
      [euros(facturado), 'Facturado'],
      [euros(abierto), 'En presupuesto'],
      [ganados.length ? euros(Math.round(facturado / ganados.length)) : '—', 'Ticket medio'],
    ];

    var max = Math.max(1, n);
    var embudo = ESTADOS.map(function (e) {
      var c = deEstado(e).length;
      return '<div class="paso"><span class="n">' + c + '</span>' +
        '<span class="et">' + e + '</span>' +
        (c ? '<span class="bar' + (e === 'Perdido' ? ' gris' : '') +
          '" style="width:' + Math.round((c / max) * 44 + 2) + '%"></span>' : '') +
        '</div>';
    }).join('');

    // La tabla que decide dónde va el dinero: no cuántos leads trae cada
    // anuncio sino cuántos de esos llegan a presupuesto.
    var porCrea = {};
    leads.forEach(function (l) {
      var k = l.utm_content || ORIGENES[l.origen] || 'Sin identificar';
      porCrea[k] = porCrea[k] || { n: 0, hot: 0, presu: 0, ganado: 0 };
      porCrea[k].n++;
      if (l.tier === 'HOT') porCrea[k].hot++;
      if (l.estado === 'Presupuesto enviado' || l.estado === 'Ganado') porCrea[k].presu++;
      if (l.estado === 'Ganado') porCrea[k].ganado++;
    });
    var filas = Object.keys(porCrea).sort(function (a, b) {
      return porCrea[b].presu - porCrea[a].presu || porCrea[b].n - porCrea[a].n;
    }).map(function (k) {
      var c = porCrea[k];
      return '<tr><td title="' + esc(k) + '">' + esc(k) + '</td><td>' + c.n + '</td>' +
        '<td>' + c.hot + '</td><td class="destacada">' + c.presu + '</td><td>' + c.ganado + '</td></tr>';
    }).join('');

    $('#lista').innerHTML =
      '<div class="cifras">' + cifras.map(function (c) {
        return '<div class="cifra"><b>' + c[0] + '</b><span>' + c[1] + '</span></div>';
      }).join('') + '</div>' +
      '<h2>Embudo</h2><div class="embudo">' + embudo + '</div>' +
      '<h2>Por creatividad</h2>' +
      '<div class="scrollx"><table class="creas"><tr><th>Creatividad</th><th>Leads</th><th>Hot</th>' +
      '<th>Presup.</th><th>Ventas</th></tr>' +
      (filas || '<tr><td colspan="5" style="text-align:left;color:#7C7266">Sin datos todavía.</td></tr>') +
      '</table></div>' +
      '<p class="nota">La columna que manda es <b>Presup.</b> Una creatividad con muchos ' +
      'leads y cero presupuestos trae gente que no compra, y sale más cara que otra con ' +
      'la mitad de leads.</p>';
  }

  var FORMATO_EUROS = new Intl.NumberFormat('es-ES', {
    useGrouping: 'always', maximumFractionDigits: 0,
  });
  function euros(v) {
    return (v ? FORMATO_EUROS.format(v) : '0') + ' €';
  }

  // ── Ficha ─────────────────────────────────────────────────────────────────

  function abrirFicha(id) {
    var l = leads.filter(function (x) { return String(x.lead_id) === String(id); })[0];
    if (!l) return;
    var tel = String(l.telefono || '').replace(/\D/g, '');

    var detalle = [['Pieza', l.pieza], ['Espacio', l.espacio], ['Medidas', l.medidas],
      ['Estilo', l.estilo], ['Presupuesto', l.presupuesto], ['Plazo', l.plazo],
      ['Referencias', l.referencias], ['Email', l.email], ['Teléfono', l.telefono],
      ['Campaña', l.utm_campaign], ['Anuncio', l.utm_content]]
      .filter(function (r) { return r[1]; })
      .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');

    $('#ficha').innerHTML =
      '<div class="velo"></div><div class="hoja" role="dialog" aria-modal="true">' +
      '<h3>' + esc(l.nombre || 'Sin nombre') + (l.tier === 'HOT' ?
        ' <span class="chip hot">Hot</span>' : '') + '</h3>' +
      '<p class="sub">' + esc(ORIGENES[l.origen] || l.origen || '') + ' · ' +
      (l.fecha ? new Date(l.fecha).toLocaleString('es-ES',
        { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '') + '</p>' +
      (tel ? '<a class="whatsapp" target="_blank" rel="noopener" href="https://wa.me/' + tel +
        '">Escribir por WhatsApp</a>' : '') +
      (detalle ? '<dl class="datos">' + detalle + '</dl>' : '') +
      '<div class="campo"><label for="fEstado">Estado</label><select id="fEstado">' +
      ESTADOS.map(function (e) {
        return '<option' + (e === l.estado ? ' selected' : '') + '>' + e + '</option>';
      }).join('') + '</select></div>' +
      '<div class="campo"><label for="fAccion">Próxima acción</label>' +
      '<input id="fAccion" value="' + esc(l.proxima_accion) + '"></div>' +
      '<div class="dos">' +
      '<div class="campo"><label for="fFecha">Cuándo</label>' +
      '<input id="fFecha" type="date" value="' + soloFecha(l.fecha_proxima) + '"></div>' +
      '<div class="campo"><label for="fImporte">Importe (€)</label>' +
      '<input id="fImporte" type="number" inputmode="numeric" value="' +
      esc(l.importe || '') + '"></div></div>' +
      '<div class="campo" id="cajaMotivo"' + (l.estado === 'Perdido' ? '' : ' hidden') + '>' +
      '<label for="fMotivo">Motivo de la pérdida</label><select id="fMotivo">' +
      '<option value=""></option>' + MOTIVOS.map(function (m) {
        return '<option' + (m === l.motivo_perdida ? ' selected' : '') + '>' + m + '</option>';
      }).join('') + '</select></div>' +
      '<div class="campo"><label for="fNotas">Notas</label>' +
      '<textarea id="fNotas">' + esc(l.notas) + '</textarea></div>' +
      '<div class="acciones"><button class="secundario" id="bCerrar">Cerrar</button>' +
      '<button class="primario" id="bGuardar">Guardar</button></div></div>';

    $('#ficha').hidden = false;
    document.body.style.overflow = 'hidden';

    $('#ficha .velo').addEventListener('click', cerrarFicha);
    $('#bCerrar').addEventListener('click', cerrarFicha);
    $('#fEstado').addEventListener('change', function () {
      $('#cajaMotivo').hidden = this.value !== 'Perdido';
    });
    $('#bGuardar').addEventListener('click', function () { guardar(l, this); });
  }

  function cerrarFicha() {
    $('#ficha').hidden = true;
    $('#ficha').innerHTML = '';
    document.body.style.overflow = '';
  }

  function guardar(l, boton) {
    boton.disabled = true; boton.textContent = 'Guardando…';
    var campos = {
      estado: $('#fEstado').value,
      proxima_accion: $('#fAccion').value,
      fecha_proxima: $('#fFecha').value,
      importe: $('#fImporte').value,
      notas: $('#fNotas').value,
      motivo_perdida: $('#fEstado').value === 'Perdido' ? ($('#fMotivo') || {}).value || '' : '',
    };
    api({ accion: 'actualizar', lead_id: l.lead_id, campos: campos }).then(function (r) {
      boton.disabled = false; boton.textContent = 'Guardar';
      if (!r.cuerpo.ok) { avisar('No se pudo guardar. Inténtalo otra vez.'); return; }
      Object.keys(campos).forEach(function (c) { l[c] = campos[c]; });
      if (r.cuerpo.lead) {
        // La hoja devuelve la fila ya sellada: así las fechas automáticas
        // aparecen sin tener que recargar.
        Object.keys(r.cuerpo.lead).forEach(function (c) { l[c] = r.cuerpo.lead[c]; });
      }
      cerrarFicha();
      pintarPestanas();
      pintar();
      avisar('Guardado');
    });
  }

  function soloFecha(v) {
    if (!v) return '';
    var d = new Date(v);
    return isNaN(d) ? '' : d.toISOString().slice(0, 10);
  }

  var relojAviso;
  function avisar(texto) {
    var a = $('#aviso');
    a.textContent = texto; a.hidden = false;
    requestAnimationFrame(function () { a.classList.add('ver'); });
    clearTimeout(relojAviso);
    relojAviso = setTimeout(function () {
      a.classList.remove('ver');
      setTimeout(function () { a.hidden = true; }, 320);
    }, 2200);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('#ficha').hidden) cerrarFicha();
  });

  // La cookie dura 30 días: si sigue viva se entra directo, sin pedir nada.
  api({ accion: 'listar' }).then(function (r) {
    if (r.estado !== 401 && r.cuerpo.ok) {
      $('#acceso').hidden = true; $('#app').hidden = false;
      leads = r.cuerpo.leads || [];
      pintarPestanas(); pintar();
    }
  });
})();
