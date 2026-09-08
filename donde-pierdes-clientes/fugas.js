/* ¿Cuántos clientes estás perdiendo sin saberlo? — qualivo.io/donde-pierdes-clientes
   7 preguntas (6 puntúan, 1 cualifica) → 6 dimensiones de 0 a 2 → fuga principal y banda.
   El resultado NUNCA se bloquea: el email compra la radiografía ampliada. */
(function () {
  'use strict';

  // ── Dimensiones. El orden del array ES el orden de desempate (criterio económico:
  //    cuánto dinero llevas ya gastado en el cliente que estás perdiendo).
  var DIMS = [
    { id: 'seguimiento', nombre: 'Seguimiento' },
    { id: 'velocidad',   nombre: 'Velocidad' },
    { id: 'origen',      nombre: 'Origen' },
    { id: 'dependencia', nombre: 'Dependencia' },
    { id: 'proceso',     nombre: 'Proceso' },
    { id: 'cartera',     nombre: 'Cartera' }
  ];

  var PREGUNTAS = [
    { dim: 'velocidad', texto: 'Cuando entra una solicitud nueva, ¿cuánto tarda alguien en contestarla?',
      opciones: [['En menos de una hora', 2], ['El mismo día', 1], ['Al día siguiente, o más', 0], ['Depende del día que sea', 0]] },
    { dim: 'seguimiento', texto: 'De los presupuestos que enviaste el mes pasado, ¿a cuántos les habéis vuelto a llamar?',
      opciones: [['A todos, está en el calendario', 2], ['A los que me acordé', 1], ['A ninguno. Si les interesa, llaman ellos', 0], ['No sabría decirte cuántos mandé', 0]] },
    { dim: 'origen', texto: 'Tu último cliente bueno, ¿de dónde salió?',
      opciones: [['Lo sé, y sé de dónde vino cada uno', 2], ['Ese sí, pero de todos no', 1], ['Ni idea. Apareció', 0]] },
    { dim: 'dependencia', texto: 'Si mañana desapareces una semana, ¿alguien puede mandar un presupuesto y cerrar una venta sin ti?',
      opciones: [['Sí, sin preguntarme nada', 2], ['Sí, pero acabarían llamándome', 1], ['No. Eso lo hago yo', 0]] },
    { dim: 'proceso', texto: 'Ahora mismo, ¿dónde está apuntado a qué clientes les debes una respuesta?',
      opciones: [['En un programa que usamos todos', 2], ['En una hoja de cálculo o una libreta', 1], ['En mi cabeza, el móvil y algún papel', 0]] },
    { dim: 'cartera', texto: 'Un cliente que te compró hace un año y no ha vuelto, ¿qué recibe de vosotros?',
      opciones: [['Le llamamos cada cierto tiempo', 2], ['Algo le llega de vez en cuando', 1], ['Nada. Si vuelve, vuelve', 0]] },
    { tipo: 'perfil', texto: 'Dos últimas, para ajustar el resultado a tu caso.',
      campos: [
        { id: 'empleados', label: '¿Cuántas personas sois?', opciones: ['Solo yo', '2 a 5', '6 a 20', 'Más de 20'] },
        { id: 'valor', label: '¿Cuánto suele dejarte un cliente en un año?', opciones: ['Menos de 500 €', '500 a 2.000 €', '2.000 a 10.000 €', 'Más de 10.000 €', 'No lo sé'] }
      ] }
  ];

  var NIVELES = {
    critica:   { etiqueta: 'Fuga crítica',  clase: 'critica',   linea: 'No es un detalle. Es por donde se te está yendo el negocio.' },
    relevante: { etiqueta: 'Fuga relevante', clase: 'relevante', linea: 'Tienes cosas bien montadas. Esta no.' },
    bajo:      { etiqueta: 'Bajo riesgo',   clase: 'bajo',      linea: 'Vas bien. Esto es lo único que desentona.' }
  };

  var RESULTADOS = {
    seguimiento: {
      titulo: 'Tu fuga principal es el seguimiento de presupuestos.',
      corto: 'Seguimiento de presupuestos',
      frase: 'Mando presupuestos y ahí se acaba.',
      diag: 'Este es el cliente más caro que tienes. Ya pagaste por atraerlo, le dedicaste una visita y calculaste el precio. Todo el coste está gastado. Lo único que falta es una llamada de dos minutos que no hace nadie.',
      prio: 'Antes que ninguna otra cosa, esta.',
      accion: 'Coge los presupuestos de este mes sin respuesta, ponlos en una lista y llama a tres. Sin oferta ni excusa: «te mandé aquello, ¿lo has podido mirar?».',
      economica: true },
    velocidad: {
      titulo: 'Tu fuga principal es la velocidad de respuesta.',
      corto: 'Velocidad de respuesta',
      frase: 'Contesto tarde y no lo noto.',
      diag: 'Casi nadie te dice que se fue con otro. Simplemente deja de contestar, y tú lo apuntas como «no estaba interesado». Estaba interesado. Contestó otro antes.',
      prio: 'Reducir el tiempo de primera respuesta antes de tocar la publicidad.',
      accion: 'Decide quién contesta cuando tú no puedes, y dile en cuánto tiempo. Si no puede nadie, un mensaje automático que diga cuándo vas a llamar ya cambia el resultado.',
      economica: true },
    origen: {
      titulo: 'Tu fuga principal es que no sabes qué te trae los clientes.',
      corto: 'Origen de los clientes',
      frase: 'No sé de dónde me vienen los clientes.',
      diag: 'Cuando entra una venta buena y nadie sabe de dónde salió, no has tenido suerte: has tenido un canal funcionando a ciegas. El problema llega cuando toca recortar, porque puedes estar apagando justo ese.',
      prio: 'Empezar a registrar el origen antes de mover un euro de presupuesto.',
      accion: 'Añade la pregunta «¿cómo nos has conocido?» a cada alta y apúntalo, aunque sea en una libreta. En tres meses tienes el mapa.',
      economica: false },
    dependencia: {
      titulo: 'Tu fuga principal eres tú.',
      corto: 'Dependencia del dueño',
      frase: 'El cuello de botella soy yo.',
      diag: 'Esto no se nota como una pérdida, se nota como cansancio. Pero es una fuga igual: cada oportunidad que espera a que tú tengas un hueco es una oportunidad enfriándose. Y tu empresa no puede crecer más rápido de lo que tú puedas atender.',
      prio: 'Sacar de tu cabeza una sola cosa: el precio.',
      accion: 'Escribe en un folio cómo se calcula un presupuesto tipo. Ese folio es la primera pieza de sistema que tiene tu empresa.',
      economica: false },
    proceso: {
      titulo: 'Tu fuga principal es que el proceso vive en tu cabeza.',
      corto: 'Proceso sin escribir',
      frase: 'Lo que está pendiente no está escrito en ningún sitio.',
      diag: 'Mientras hay poco volumen funciona. El día que entran quince cosas a la vez se cae alguna, y siempre se cae la que no gritaba. Que suele ser la más grande.',
      prio: 'Un sitio único donde esté lo pendiente. Da igual cuál.',
      accion: 'Abre una hoja con cuatro columnas: quién es, de dónde vino, qué toca hacer y cuándo. Con eso ya sabes más que la mayoría de tu sector.',
      economica: false },
    cartera: {
      titulo: 'Tu fuga principal es la cartera dormida.',
      corto: 'Cartera dormida',
      frase: 'Mis clientes antiguos no saben nada de mí.',
      diag: 'Ya te compraron, ya confían y ya sabes que pagan. Y aun así el presupuesto se va en buscar desconocidos. No es que no les gustaras: es que no se acuerdan.',
      prio: 'Diez llamadas antes que una campaña.',
      accion: 'Coge los diez clientes que mejor te fueron y llámalos. Sin vender nada: «qué tal va aquello».',
      economica: true },
    perfecto: {
      titulo: 'No hemos encontrado ninguna fuga evidente.',
      corto: 'Sin fuga evidente',
      frase: 'No tengo fugas evidentes. Ahora el problema es otro.',
      diag: 'Esto pasa en menos empresas de las que dicen. Si has contestado honestamente, tu problema ya no es dónde pierdes: es cuánto puedes crecer sin que el sistema se rompa. Que es otra conversación distinta.',
      prio: 'Dejar de tapar agujeros y empezar a mirar el techo.',
      accion: 'Mira qué parte de tu sistema se rompería primero si mañana entrara el triple de trabajo. Esa es la siguiente obra.',
      economica: false }
  };

  var $ = function (id) { return document.getElementById(id); };
  var secciones = ['fg-landing', 'fg-quiz', 'fg-result', 'fg-gate', 'fg-thanks'];
  var actual = 0;
  var respuestas = new Array(PREGUNTAS.length).fill(null);
  var perfil = { empleados: null, valor: null };
  var calculado = null;
  var loadedAt = Date.now();
  var qStart = 0;

  function track(nombre, datos) {
    try {
      if (window.qvTrack) window.qvTrack(nombre, datos || {});
      if (window.va) window.va('event', { name: nombre, data: datos || {} });
    } catch (e) { /* el tracking nunca rompe la experiencia */ }
  }

  function show(id) {
    secciones.forEach(function (s) { var el = $(s); if (el) el.hidden = s !== id; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Scoring ──────────────────────────────────────────────────────────
  function puntosPorDimension() {
    var p = {};
    DIMS.forEach(function (d) { p[d.id] = 0; });
    PREGUNTAS.forEach(function (q, i) {
      if (q.tipo === 'perfil') return;
      p[q.dim] = respuestas[i] === null ? 0 : respuestas[i];
    });
    return p;
  }

  function calcular() {
    var p = puntosPorDimension();
    var total = DIMS.reduce(function (s, d) { return s + p[d.id]; }, 0);
    var nivel = total <= 4 ? 'critica' : (total <= 8 ? 'relevante' : 'bajo');

    // Fuga = dimensión con menos puntos. Empate → primera del orden de DIMS.
    var min = Math.min.apply(null, DIMS.map(function (d) { return p[d.id]; }));
    var fuga = null;
    for (var i = 0; i < DIMS.length; i++) {
      if (p[DIMS[i].id] === min) { fuga = DIMS[i].id; break; }
    }
    // Segunda fuga: la siguiente peor que no sea la principal.
    var resto = DIMS.filter(function (d) { return d.id !== fuga; });
    var min2 = Math.min.apply(null, resto.map(function (d) { return p[d.id]; }));
    var segunda = null;
    for (var j = 0; j < resto.length; j++) {
      if (p[resto[j].id] === min2) { segunda = resto[j].id; break; }
    }
    if (total === 12) fuga = 'perfecto';

    return { puntos: p, total: total, nivel: nivel, fuga: fuga, segunda: segunda };
  }

  // ── Pintar preguntas ─────────────────────────────────────────────────
  function pintarPregunta() {
    var q = PREGUNTAS[actual];
    var cont = $('fg-options');
    cont.innerHTML = '';
    $('fg-count').textContent = (actual + 1) + ' de ' + PREGUNTAS.length;
    $('fg-bar').style.width = (actual / PREGUNTAS.length * 100) + '%';
    $('fg-question').textContent = q.texto;
    $('fg-prev').hidden = actual === 0;
    qStart = Date.now();

    if (q.tipo === 'perfil') {
      $('fg-dim').textContent = 'Casi está';
      q.campos.forEach(function (campo) {
        var wrap = document.createElement('div');
        wrap.style.marginBottom = '18px';
        var lab = document.createElement('p');
        lab.textContent = campo.label;
        lab.style.cssText = 'margin:0 0 10px; font-size:15.5px; font-weight:800; color:#101319';
        wrap.appendChild(lab);
        var grid = document.createElement('div');
        grid.style.cssText = 'display:flex; flex-wrap:wrap; gap:8px';
        campo.opciones.forEach(function (op) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'fg-answer';
          b.textContent = op;
          b.style.cssText = 'width:auto; min-height:46px; padding:10px 16px; font-size:15px';
          if (perfil[campo.id] === op) b.classList.add('sel');
          b.addEventListener('click', function () {
            perfil[campo.id] = op;
            Array.prototype.forEach.call(grid.children, function (c) { c.classList.remove('sel'); });
            b.classList.add('sel');
            if (perfil.empleados && perfil.valor) $('fg-final').disabled = false;
          });
          grid.appendChild(b);
        });
        wrap.appendChild(grid);
        cont.appendChild(wrap);
      });
      var fin = document.createElement('button');
      fin.type = 'button';
      fin.id = 'fg-final';
      fin.className = 'btn-teal';
      fin.textContent = 'Ver mi resultado →';
      fin.style.marginTop = '6px';
      fin.disabled = !(perfil.empleados && perfil.valor);
      fin.addEventListener('click', terminar);
      cont.appendChild(fin);
      return;
    }

    $('fg-dim').textContent = DIMS.filter(function (d) { return d.id === q.dim; })[0].nombre;
    q.opciones.forEach(function (op) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fg-answer' + (respuestas[actual] === op[1] ? ' sel' : '');
      b.textContent = op[0];
      b.addEventListener('click', function () {
        respuestas[actual] = op[1];
        track('fugas_q', { n: actual + 1, dim: q.dim, puntos: op[1], ms: Date.now() - qStart });
        actual++;
        pintarPregunta();
      });
      cont.appendChild(b);
    });
  }

  function terminar() {
    calculado = calcular();
    track('fugas_complete', {
      fuga: calculado.fuga, nivel: calculado.nivel, total: calculado.total,
      empleados: perfil.empleados, valor_cliente: perfil.valor,
      segundos: Math.round((Date.now() - loadedAt) / 1000)
    });
    pintarResultado();
    show('fg-result');
    track('fugas_result_view', { fuga: calculado.fuga, nivel: calculado.nivel });
  }

  // ── Resultado ────────────────────────────────────────────────────────
  function pintarResultado() {
    var r = RESULTADOS[calculado.fuga];
    var n = NIVELES[calculado.nivel];
    $('fg-nivel').className = 'fg-nivel ' + n.clase;
    $('fg-nivel').textContent = n.etiqueta + ' — ' + n.linea;
    $('fg-title').textContent = r.titulo;
    $('fg-diag').textContent = r.diag;
    $('fg-prio').textContent = r.prio;
    $('fg-accion').textContent = r.accion;

    var ul = $('fg-semaforos');
    ul.innerHTML = '';
    DIMS.forEach(function (d) {
      var pts = calculado.puntos[d.id];
      var li = document.createElement('li');
      var dot = document.createElement('span');
      dot.className = 'fg-dot ' + (pts === 2 ? 'v' : pts === 1 ? 'a' : 'r');
      li.appendChild(dot);
      li.appendChild(document.createTextNode(d.nombre));
      ul.appendChild(li);
    });

    var calc = $('fg-calc');
    if (r.economica) {
      calc.hidden = false;
      calc.href = '/calculadora-de-fugas/?origen=fugas&fuga=' + calculado.fuga;
      calc.addEventListener('click', function () { track('fugas_calc_click', { fuga: calculado.fuga }); }, { once: true });
    } else {
      calc.hidden = true;
    }
  }

  // ── Share card ───────────────────────────────────────────────────────
  function dibujarCard() {
    var c = $('fg-canvas');
    var x = c.getContext('2d');
    var r = RESULTADOS[calculado.fuga];
    var n = NIVELES[calculado.nivel];
    var W = 1080, H = 1350;

    x.fillStyle = '#F2EEE6'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#E8590C'; x.fillRect(72, 92, 268, 52);
    x.fillStyle = '#F2EEE6'; x.font = '800 23px Montserrat, system-ui, sans-serif';
    x.fillText('MI DIAGNÓSTICO', 92, 126);

    x.fillStyle = '#5A5E66'; x.font = '700 28px Montserrat, system-ui, sans-serif';
    x.fillText('MI FUGA PRINCIPAL', 72, 232);

    x.fillStyle = '#0A0A0B'; x.font = '900 82px Montserrat, system-ui, sans-serif';
    envolver(x, r.corto.toUpperCase(), 72, 340, 940, 92);

    var col = calculado.nivel === 'critica' ? '#E8590C' : (calculado.nivel === 'relevante' ? '#C98A06' : '#0B7038');
    x.fillStyle = col; x.beginPath(); x.arc(90, 620, 16, 0, Math.PI * 2); x.fill();
    x.font = '900 40px Montserrat, system-ui, sans-serif';
    x.fillText(n.etiqueta.toUpperCase(), 122, 634);

    x.strokeStyle = 'rgba(10,10,11,.18)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(72, 700); x.lineTo(1008, 700); x.stroke();

    x.fillStyle = '#31333A'; x.font = 'italic 600 40px Montserrat, system-ui, sans-serif';
    envolver(x, '«' + r.frase + '»', 72, 776, 940, 56);

    var y0 = 952;
    x.font = '700 25px Montserrat, system-ui, sans-serif';
    DIMS.forEach(function (d, i) {
      var pts = calculado.puntos[d.id];
      var cx = 72 + (i % 3) * 320, cy = y0 + Math.floor(i / 3) * 74;
      x.fillStyle = pts === 2 ? '#12A150' : (pts === 1 ? '#E8A50C' : '#E8590C');
      x.beginPath(); x.arc(cx + 13, cy - 8, 13, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#31333A';
      x.fillText(d.nombre, cx + 38, cy);
    });

    x.fillStyle = '#0A0A0B'; x.fillRect(0, H - 150, W, 150);
    x.fillStyle = '#F2EEE6'; x.font = '800 34px Montserrat, system-ui, sans-serif';
    x.fillText('¿Y la tuya?', 72, H - 88);
    x.fillStyle = '#FF7A33'; x.font = '800 30px Montserrat, system-ui, sans-serif';
    x.fillText('qualivo.io/donde-pierdes-clientes', 72, H - 44);
    return c;
  }

  function envolver(ctx, texto, x0, y0, ancho, alto) {
    var palabras = texto.split(' '), linea = '', y = y0;
    palabras.forEach(function (p) {
      var test = linea ? linea + ' ' + p : p;
      if (ctx.measureText(test).width > ancho && linea) { ctx.fillText(linea, x0, y); linea = p; y += alto; }
      else { linea = test; }
    });
    if (linea) ctx.fillText(linea, x0, y);
  }

  function textoCompartir() {
    var r = RESULTADOS[calculado.fuga];
    return 'He hecho esto y me ha salido que mi punto débil es: ' + r.corto.toLowerCase() + '.\n' +
      'Son 90 segundos. A ver qué te sale a ti:\nhttps://qualivo.io/donde-pierdes-clientes/';
  }

  function compartir() {
    track('fugas_share_click', { fuga: calculado.fuga });
    var canvas = dibujarCard();
    canvas.toBlob(function (blob) {
      var archivo = blob ? new File([blob], 'mi-fuga.png', { type: 'image/png' }) : null;
      var datos = { text: textoCompartir() };
      if (archivo && navigator.canShare && navigator.canShare({ files: [archivo] })) datos.files = [archivo];
      if (navigator.share) {
        navigator.share(datos)
          .then(function () { track('fugas_share_done', { canal: 'nativo' }); })
          .catch(function () { /* el usuario canceló */ });
      } else if (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'mi-fuga.png'; a.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        track('fugas_share_done', { canal: 'descarga' });
      }
    }, 'image/png');
  }

  // ── Envío ────────────────────────────────────────────────────────────
  function enviar(e) {
    e.preventDefault();
    var nombre = $('fg-nombre').value.trim();
    var email = $('fg-email').value.trim();
    var rgpd = $('fg-rgpd').checked;
    var err = $('fg-error');

    if ($('fg-website').value || Date.now() - loadedAt < 4000) { show('fg-thanks'); return; }
    err.hidden = true;
    if (!nombre) { err.textContent = 'Dinos tu nombre.'; err.hidden = false; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Revisa el correo.'; err.hidden = false; return; }
    if (!rgpd) { err.textContent = 'Necesitamos tu consentimiento para tratar los datos.'; err.hidden = false; return; }

    var btn = $('fg-submit');
    btn.disabled = true; btn.textContent = 'Un segundo…';

    fetch('/api/fugas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre, email: email, rgpd: true,
        fuga: calculado.fuga, segunda: calculado.segunda,
        nivel: calculado.nivel, total: calculado.total, puntos: calculado.puntos,
        empleados: perfil.empleados, valor_cliente: perfil.valor,
        origen: window.location.hostname || 'local'
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      track('fugas_email_submit', {
        fuga: calculado.fuga, nivel: calculado.nivel,
        empleados: perfil.empleados, valor_cliente: perfil.valor
      });
      show('fg-thanks');
    }).catch(function () {
      err.textContent = 'No hemos podido guardarlo. Inténtalo otra vez en unos segundos.';
      err.hidden = false;
    }).finally(function () {
      btn.disabled = false; btn.textContent = 'Enviarme la radiografía';
    });
  }

  // ── Arranque ─────────────────────────────────────────────────────────
  function empezar() {
    track('fugas_start', {});
    actual = 0;
    pintarPregunta();
    show('fg-quiz');
  }

  $('fg-start').addEventListener('click', empezar);
  $('fg-start2').addEventListener('click', empezar);
  $('fg-prev').addEventListener('click', function () { if (actual > 0) { actual--; pintarPregunta(); } });
  $('fg-sharebtn').addEventListener('click', compartir);
  $('fg-sharebtn2').addEventListener('click', compartir);
  $('fg-gatebtn').addEventListener('click', function () { show('fg-gate'); });
  $('fg-gateback').addEventListener('click', function () { show('fg-result'); });
  $('fg-form').addEventListener('submit', enviar);

  window.addEventListener('beforeunload', function () {
    if (calculado === null && actual > 0) track('fugas_abandon', { ultima_pregunta: actual + 1 });
  });

  track('fugas_view', {
    utm_source: new URLSearchParams(location.search).get('utm_source') || '',
    utm_campaign: new URLSearchParams(location.search).get('utm_campaign') || '',
    referrer: document.referrer || ''
  });
})();
