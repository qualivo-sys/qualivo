/* ¿Dónde se está rompiendo tu crecimiento? — qualivo.io/donde-se-rompe-tu-crecimiento
   Diagnóstico del sistema de crecimiento: 11 preguntas (0 a 3 puntos), 90-120 segundos.
   Cinco dimensiones: captación (3), conversión (2), seguimiento (2), dependencia (2), control (2).
   Cada pregunta puede cambiar el resultado: cuello de botella principal + nivel.
   El resultado NUNCA se bloquea: el correo compra la radiografía ampliada, no el veredicto. */
(function () {
  'use strict';

  var URL_PUBLICA = 'https://qualivo.io/donde-se-rompe-tu-crecimiento/';

  var DIMS = [
    { id: 'captacion',   nombre: 'Captación',   pregunta: '¿Te llegan suficientes oportunidades?' },
    { id: 'conversion',  nombre: 'Conversión',  pregunta: '¿Las que llegan se convierten?' },
    { id: 'seguimiento', nombre: 'Seguimiento', pregunta: '¿Las que no cierran a la primera se persiguen?' },
    { id: 'dependencia', nombre: 'Dependencia', pregunta: '¿Funciona sin el dueño?' },
    { id: 'control',     nombre: 'Control',     pregunta: '¿Sabes qué genera crecimiento?' }
  ];

  // Desempate cuando dos dimensiones empatan a la baja. Criterio: qué arreglar
  // primero en 30 días. Lo que ya está pagado (una oportunidad que entró) se
  // recupera antes y más barato que una oportunidad que aún no existe.
  var PRIORIDAD = ['seguimiento', 'conversion', 'captacion', 'control', 'dependencia'];

  // ── Las 11 preguntas (0 a 3 puntos). `ns` marca «no lo sé»: resta 1 en control.
  var PREGUNTAS = [
    // Captación (3)
    { d: 0, sintoma: 'demanda', texto: 'En los últimos tres meses, ¿te ha llegado suficiente gente interesada en comprarte?',
      op: [['Sí. Más de la que podemos atender', 3], ['La justa, sin margen', 2], ['A rachas: meses buenos y meses vacíos', 1], ['No. Nos falta casi siempre', 0]] },
    { d: 0, sintoma: 'predecible', texto: 'Cuando necesitas más clientes, ¿qué ocurre normalmente?',
      op: [['Sabemos qué canal los trae y cómo subirlo', 3], ['Tenemos varios canales y más o menos sabemos cuáles funcionan', 2], ['Tiramos de recomendaciones y contactos', 1], ['Probamos cosas, o nos ponemos a buscar cuando hace falta', 0]] },
    { d: 0, sintoma: 'visibilidad', texto: 'Alguien que no te conoce busca lo que vendes: en Google, en una IA, en redes. ¿Te encuentra?',
      op: [['Sí, y nos llegan contactos por ahí', 3], ['Aparecemos, pero llega poca gente', 2], ['Aparecemos poco. Casi todo es boca a boca', 1], ['No aparecemos, o no lo sé', 0, true]] },
    // Conversión (2)
    { d: 1, sintoma: 'velocidad', texto: 'Entra una oportunidad nueva: una llamada, un formulario, un WhatsApp. ¿Qué pasa?',
      op: [['Se contesta en menos de una hora, siempre igual', 3], ['Se contesta el mismo día, según quién esté', 2], ['Puede pasar un día o más', 1], ['Algunas se quedan sin contestar', 0]] },
    { d: 1, sintoma: 'cierre', texto: 'De cada diez personas que te piden precio, ¿cuántas acaban comprando?',
      op: [['Más de cinco', 3], ['Entre tres y cinco', 2], ['Menos de tres', 1], ['No lo sé', 1, true]] },
    // Seguimiento (2)
    { d: 2, sintoma: 'presupuestos', texto: 'Alguien pide precio y no cierra en el momento. ¿Qué pasa después?',
      op: [['Hay un seguimiento fijo: se llama o se escribe en fechas concretas hasta cerrar o descartar', 3], ['Se hace seguimiento, pero depende de que alguien se acuerde', 2], ['Se insiste una vez y, si no contestan, se deja', 1], ['Esperamos a que el cliente responda', 0]] },
    { d: 2, sintoma: 'perdidos', texto: '¿Qué pasa con los que dijeron «ahora no» o dejaron de contestar?',
      op: [['Los volvemos a contactar más adelante, con fecha', 3], ['A veces, si alguien se acuerda', 2], ['Quedan apuntados, pero no hacemos nada', 1], ['Se pierden', 0]] },
    // Dependencia (2)
    { d: 3, sintoma: 'dueno', texto: 'Si desaparecieras dos semanas, ¿qué pasaría con las ventas?',
      op: [['Seguirían igual: está escrito y otra persona lo lleva', 3], ['Seguirían, pero más lentas', 2], ['Solo se atenderían las urgencias', 1], ['Se pararían. Todo pasa por mí', 0]] },
    { d: 3, sintoma: 'sin-registro', texto: 'Ahora mismo, ¿dónde está apuntado a qué clientes les debéis una respuesta?',
      op: [['En un programa que usamos todos', 3], ['En una hoja de cálculo o una libreta compartida', 2], ['Cada uno tiene lo suyo', 1], ['En mi cabeza, el móvil y algún papel', 0]] },
    // Control (2)
    { d: 4, sintoma: 'origen', texto: '¿Sabes qué canal te ha traído más ventas en los últimos tres meses? Ventas, no visitas ni seguidores.',
      op: [['Sí, lo tenemos apuntado y lo revisamos', 3], ['Lo sabemos a grandes rasgos, sin números', 2], ['Tenemos intuiciones, nada apuntado', 1], ['No lo sabemos', 0, true]] },
    { d: 4, sintoma: 'sin-revision', texto: '¿Cada cuánto miráis juntos lo que entra y de dónde viene?',
      op: [['Todos los meses, con una revisión fija', 3], ['Cada pocos meses', 2], ['Cuando algo va mal', 1], ['Nunca lo hemos mirado así', 0]] }
  ];

  var PERFIL = [
    { id: 'rol', label: '¿Cuál es tu papel en la empresa?', op: ['Dueño o socio', 'Dirijo ventas o marketing', 'Otro'] },
    { id: 'empleados', label: '¿Cuántas personas sois?', op: ['Solo yo', '2 a 5', '6 a 20', 'Más de 20'] },
    { id: 'valor', label: '¿Cuánto suele dejarte un cliente en un año?', op: ['Menos de 500 €', '500 a 2.000 €', '2.000 a 10.000 €', 'Más de 10.000 €', 'No lo sé'] }
  ];

  var NIVELES = {
    critico:   { et: 'Cuello de botella crítico', cl: 'critica',   li: 'No es un detalle. Es lo que está frenando la empresa.' },
    relevante: { et: 'Cuello de botella relevante', cl: 'relevante', li: 'Tienes cosas bien montadas. Esta no.' },
    leve:      { et: 'Cuello de botella leve', cl: 'bajo',       li: 'Vas bien. Esto es lo único que desentona.' }
  };

  // Texto principal por dimensión y nivel del cuello de botella.
  var RESULTADO = {
    captacion: {
      titulo: 'Tu problema empieza antes de que llegue el cliente.',
      critico: 'Estás intentando crecer sin una fuente de oportunidades que puedas medir y repetir. Lo que entra, entra por suerte, por contactos o por rachas, y cuando hace falta más, hay que salir a buscar. Todo lo que hagas después (atender mejor, cerrar mejor) trabaja sobre un caudal que no controlas.',
      relevante: 'Entra gente, pero no de forma predecible. Sabes más o menos qué funciona y no puedes subirlo a voluntad. Eso hace que el crecimiento vaya a rachas y que cada mes flojo parezca un problema nuevo cuando es siempre el mismo.',
      leve: 'Te llegan oportunidades y sabes bastante bien de dónde. Lo que falta es poder abrir el grifo cuando quieras: pasar de «nos llegan» a «las generamos».',
      prio: 'Construir una fuente de oportunidades que puedas medir y repetir.',
      antes: 'Antes de afinar cómo atiendes o cómo cierras, arreglaría de dónde llegan.',
      frase: 'Puede que tu problema sí sea conseguir oportunidades.'
    },
    conversion: {
      titulo: 'Ya te llegan oportunidades. Se pierden nada más entrar.',
      critico: 'Alguien pregunta y se enfría antes de que nadie le atienda, o recibe un precio y no vuelve a escribir. Nadie te dice que se fue con otro: simplemente deja de contestar y tú lo apuntas como «no estaba interesado». Estaba interesado. Contestó otro antes, o le costó menos decidirse con otro.',
      relevante: 'Atendéis, pero no siempre a tiempo ni siempre igual. La diferencia entre contestar en una hora y contestar mañana no la ves tú: la ve el cliente, comparando contigo y con dos más.',
      leve: 'Atendéis rápido y cerráis una parte razonable. Lo que queda es hacerlo igual todos los días, sin depender de quién esté.',
      prio: 'Reducir el tiempo de primera respuesta y acortar lo que pasa entre la pregunta y el precio.',
      antes: 'Antes de gastar un euro más en conseguir oportunidades, arreglaría lo que pasa cuando entran.',
      frase: 'Puede que tu problema no sea conseguir clientes. Puede que los estés perdiendo nada más entrar.'
    },
    seguimiento: {
      titulo: 'Ya consigues oportunidades. El problema es lo que pasa después.',
      critico: 'Mandas presupuestos y ahí se acaba. Ese es el cliente más caro que tienes: ya pagaste por atraerlo, le dedicaste tiempo y calculaste el precio. Todo el coste está gastado. Lo único que falta es una llamada de dos minutos que no hace nadie.',
      relevante: 'Se hace seguimiento cuando alguien se acuerda. Eso significa que se persiguen los presupuestos que estaban frescos en la cabeza de alguien, no los que más valían.',
      leve: 'Lo que sale por la puerta tiene a alguien detrás. Falta que ese seguimiento esté en el calendario y no en la memoria, y que incluya a los que dijeron «ahora no».',
      prio: 'Poner fecha y responsable a cada presupuesto que sale por la puerta.',
      antes: 'Antes de buscar más clientes, recuperaría los que ya te han pedido precio.',
      frase: 'Puede que tu problema no sea conseguir clientes. Puede que se te enfríen después de pedir precio.'
    },
    dependencia: {
      titulo: 'Tu empresa crece hasta donde llega el dueño. Y ahí para.',
      critico: 'Casi todo pasa por una persona y casi nada está escrito. No se nota como una pérdida, se nota como cansancio. Pero cada oportunidad que espera a que tengas un hueco es una oportunidad enfriándose. La empresa no puede crecer más rápido de lo que tú puedas atender.',
      relevante: 'Hay proceso, pero se sostiene con tu memoria y tu criterio. Funciona mientras el volumen sea bajo. El día que entran quince cosas a la vez se cae alguna, y suele caerse la que no gritaba.',
      leve: 'La empresa funciona sin ti para casi todo. Queda sacar de tu cabeza lo último: normalmente el precio y las decisiones sobre qué cliente merece la pena.',
      prio: 'Sacar de la cabeza del dueño una sola cosa: cómo se calcula un presupuesto.',
      antes: 'Antes de meter más oportunidades en la empresa, haría que la empresa pudiera atenderlas sin ti.',
      frase: 'El cuello de botella de mi crecimiento soy yo.'
    },
    control: {
      titulo: 'Haces cosas, pero no sabes cuáles te hacen crecer.',
      critico: 'Estás decidiendo a ciegas. No sabes qué canal te trae ventas, así que no puedes repetir lo que funciona ni cortar lo que no. Y lo peor: cuando toque recortar, puedes apagar justo lo que funcionaba.',
      relevante: 'Tienes una idea de qué funciona, pero sin números y sin una revisión fija. Te enteras de los problemas dos o tres meses tarde, cuando ya han costado dinero.',
      leve: 'Sabes bastante bien qué te trae clientes. Falta convertir esa intuición en dos números que se miran cada mes.',
      prio: 'Empezar a registrar de dónde viene cada venta y revisarlo una vez al mes.',
      antes: 'Antes de invertir más en ningún canal, sabría cuál está trayendo las ventas.',
      frase: 'Estoy creciendo sin saber qué me hace crecer.'
    }
  };

  // La frase que duele: depende del cuello y de si captación está bien (paga por
  // gente que luego pierde) o no.
  function frase(c) {
    var capOk = c.pct.captacion !== null && c.pct.captacion >= 67;
    switch (c.cuello) {
      case 'captacion': return c.pct.seguimiento >= 67 && c.pct.conversion >= 67
        ? 'No tienes un problema de ventas. Tienes un problema de que no llega nadie a quien venderle.'
        : 'Puedes atender mejor y cerrar mejor, pero todo eso trabaja sobre un caudal que no controlas.';
      case 'conversion': return capOk
        ? 'Ya estás pagando por que te pregunten. Y los pierdes en las primeras horas.'
        : 'Te cuesta que te pregunten, y a los que preguntan los pierdes en las primeras horas.';
      case 'seguimiento': return capOk
        ? 'Estás buscando clientes nuevos mientras los que ya te pidieron precio se enfrían sin que nadie les llame.'
        : 'Cada persona que te pide precio te ha costado conseguirla. Y después no la persigue nadie.';
      case 'dependencia': return 'Tu empresa no tiene un techo de mercado. Tiene un techo de horas: las tuyas.';
      case 'control': return 'Estás invirtiendo sin saber qué funciona. El día que recortes, puedes apagar justo lo que te traía clientes.';
    }
    return '';
  }

  // La acción concreta sale de la peor respuesta dentro del cuello de botella.
  var ACCION = {
    'demanda': 'Cuenta cuántas oportunidades nuevas te llegaron el mes pasado. Solo el número. Si no lo tienes, ese es el primer trabajo: contarlas durante treinta días.',
    'predecible': 'Elige un solo canal y dale tres meses de verdad, con una cantidad fija de tiempo o dinero cada semana. Abrir cinco a la vez es la forma más rápida de que ninguno funcione.',
    'visibilidad': 'Busca en Google lo que vende tu empresa, en tu zona, como lo haría un cliente. Apunta en qué posición sales y quién sale delante. Ese es el tamaño del hueco.',
    'velocidad': 'Decide quién contesta cuando tú no puedes, y en cuánto tiempo. Una persona y un plazo. Si no hay nadie, un aviso automático que diga cuándo vas a llamar ya cambia el resultado.',
    'cierre': 'Coge los diez últimos presupuestos y apunta qué pasó con cada uno. Cuántos cerraron, cuántos dijeron que no y cuántos no contestaron. Ese tercer número es el que duele.',
    'presupuestos': 'Coge los presupuestos de este mes sin respuesta, ponlos en una lista y llama a tres. Sin oferta ni excusa: «te mandé aquello, ¿lo has podido mirar?».',
    'perdidos': 'Haz la lista de los que dijeron que no este año y llama a cinco. No para vender: para saber qué pasó al final con aquello.',
    'dueno': 'Escribe en un folio cómo se calcula un presupuesto tipo. Ese folio es la primera pieza de sistema que tiene tu empresa.',
    'sin-registro': 'Abre una hoja con cuatro columnas: quién es, de dónde vino, qué toca hacer y cuándo. Con eso ya sabes más que la mayoría de tu sector.',
    'origen': 'Añade «¿cómo nos has conocido?» a cada alta y apúntalo, aunque sea en una libreta. En tres meses tienes el mapa.',
    'sin-revision': 'Ponte media hora en el calendario el primer lunes de cada mes. Solo dos números: qué entró y de dónde.'
  };

  // Impacto económico: solo cuando la fuga es posterior al lead y se puede calcular
  // con datos del usuario. La calculadora pide el dato y enseña la fórmula.
  var ECO = { seguimiento: 'presupuestos', conversion: 'velocidad' };

  var $ = function (id) { return document.getElementById(id); };
  var SECS = ['fg-landing', 'fg-quiz', 'fg-result', 'fg-gate', 'fg-thanks'];
  var actual = 0;
  var enPerfil = false;
  var respuestas = new Array(PREGUNTAS.length).fill(null);
  var perfil = { rol: null, empleados: null, valor: null };
  var calculado = null;
  var loadedAt = Date.now();
  var UTM = {};
  var qStart = 0;

  function track(n, d) {
    try {
      if (window.qvTrack) window.qvTrack(n, d || {});
      if (window.va) window.va('event', { name: n, data: d || {} });
    } catch (e) { /* el tracking nunca rompe la experiencia */ }
  }

  function show(id) { SECS.forEach(function (s) { var el = $(s); if (el) el.hidden = s !== id; }); if ($('fg-sticky')) $('fg-sticky').hidden = true; window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // ── Scoring ─────────────────────────────────────────────────────────
  // Cada dimensión puntúa sobre su máximo posible con lo contestado. Un «no lo sé»
  // resta un punto en control: no saberlo es, en sí mismo, un problema de control.
  function estadoPct(pct) { return pct <= 34 ? 'critica' : (pct <= 67 ? 'floja' : 'solida'); }

  function calcular() {
    var pts = {}, max = {}, peor = {}, peorPts = {}, ns = 0;
    DIMS.forEach(function (d) { pts[d.id] = 0; max[d.id] = 0; peor[d.id] = null; peorPts[d.id] = 99; });

    PREGUNTAS.forEach(function (q, n) {
      var r = respuestas[n];
      if (r === null) return;
      var id = DIMS[q.d].id;
      pts[id] += r.p; max[id] += 3;
      if (r.ns) ns++;
      if (r.p < peorPts[id]) { peorPts[id] = r.p; peor[id] = q.sintoma; }
    });
    pts.control = Math.max(0, pts.control - ns);

    var pct = {}, total = 0, maximo = 0;
    DIMS.forEach(function (d) {
      pct[d.id] = max[d.id] ? Math.round(pts[d.id] / max[d.id] * 100) : null;
      total += pts[d.id]; maximo += max[d.id];
    });
    var respondidas = respuestas.filter(function (x) { return x !== null; }).length;

    var vivas = DIMS.filter(function (d) { return pct[d.id] !== null; }).map(function (d) { return d.id; });
    var min = Math.min.apply(null, vivas.map(function (id) { return pct[id]; }));
    var cand = vivas.filter(function (id) { return pct[id] === min; });
    var cuello = PRIORIDAD.filter(function (id) { return cand.indexOf(id) !== -1; })[0] || cand[0];

    var resto = vivas.filter(function (id) { return id !== cuello; });
    var min2 = resto.length ? Math.min.apply(null, resto.map(function (id) { return pct[id]; })) : null;
    var cand2 = resto.filter(function (id) { return pct[id] === min2; });
    var segunda = PRIORIDAD.filter(function (id) { return cand2.indexOf(id) !== -1; })[0] || cand2[0] || null;

    var nivel = min <= 34 ? 'critico' : (min <= 67 ? 'relevante' : 'leve');
    var perfecto = vivas.length === 5 && min === 100;

    return { pct: pct, pts: pts, max: max, total: total, maximo: maximo, respondidas: respondidas,
             cuello: cuello, segunda: segunda, sintoma: peor[cuello], nivel: nivel, perfecto: perfecto,
             completo: respondidas === PREGUNTAS.length, ns: ns };
  }

  // ── Preguntas ───────────────────────────────────────────────────────
  function pintarPregunta() {
    var q = PREGUNTAS[actual];
    var dim = DIMS[q.d];
    var cont = $('fg-options');
    cont.innerHTML = '';
    enPerfil = false;
    $('fg-dim').textContent = dim.nombre;
    $('fg-bar').style.width = (actual / (PREGUNTAS.length + 1) * 100) + '%';
    $('fg-question').textContent = q.texto;
    $('fg-prev').hidden = actual === 0;
    $('fg-salir').hidden = actual < 5;
    qStart = Date.now();

    q.op.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fg-answer' + (respuestas[actual] && respuestas[actual].txt === o[0] ? ' sel' : '');
      b.textContent = o[0];
      b.addEventListener('click', function () {
        respuestas[actual] = { p: o[1], ns: !!o[2], txt: o[0] };
        track('hero_question_answer', { n: actual + 1, dim: dim.id, puntos: o[1], ms: Date.now() - qStart });
        avanzar();
      });
      cont.appendChild(b);
    });
  }

  function avanzar() {
    actual++;
    if (actual < PREGUNTAS.length) { pintarPregunta(); return; }
    pintarPerfil();
  }

  // ── Perfil (cualificación mínima) ───────────────────────────────────
  function pintarPerfil() {
    var cont = $('fg-options');
    cont.innerHTML = '';
    enPerfil = true;
    $('fg-dim').textContent = 'Casi está';
    $('fg-bar').style.width = '94%';
    $('fg-question').textContent = 'Tres datos rápidos para ajustar el resultado a tu caso.';
    $('fg-prev').hidden = false;
    $('fg-salir').hidden = true;

    PERFIL.forEach(function (campo) {
      var wrap = document.createElement('div');
      wrap.style.marginBottom = '18px';
      var lab = document.createElement('p');
      lab.textContent = campo.label;
      lab.style.cssText = 'margin:0 0 10px; font-size:15.5px; font-weight:800; color:#101319';
      wrap.appendChild(lab);
      var grid = document.createElement('div');
      grid.style.cssText = 'display:flex; flex-wrap:wrap; gap:8px';
      campo.op.forEach(function (o) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'fg-answer' + (perfil[campo.id] === o ? ' sel' : '');
        b.textContent = o;
        b.style.cssText = 'width:auto; min-height:46px; padding:10px 16px; font-size:15px';
        b.addEventListener('click', function () {
          perfil[campo.id] = o;
          Array.prototype.forEach.call(grid.children, function (c) { c.classList.remove('sel'); });
          b.classList.add('sel');
          if (perfil.rol && perfil.empleados && perfil.valor) $('fg-final').disabled = false;
        });
        grid.appendChild(b);
      });
      wrap.appendChild(grid);
      cont.appendChild(wrap);
    });
    var fin = document.createElement('button');
    fin.type = 'button'; fin.id = 'fg-final'; fin.className = 'btn-teal';
    fin.textContent = 'Ver mi cuello de botella →'; fin.style.marginTop = '6px';
    fin.disabled = !(perfil.rol && perfil.empleados && perfil.valor);
    fin.addEventListener('click', function () { terminar(true); });
    cont.appendChild(fin);
    show('fg-quiz');
  }

  function terminar(completo) {
    calculado = calcular();
    track('hero_complete', {
      cuello: calculado.cuello, segunda: calculado.segunda || '', sintoma: calculado.sintoma, nivel: calculado.nivel,
      total: calculado.total, de: calculado.maximo, completo: calculado.completo,
      respondidas: calculado.respondidas, no_lo_se: calculado.ns,
      rol: perfil.rol || '', empleados: perfil.empleados || '', valor_cliente: perfil.valor || '',
      segundos: Math.round((Date.now() - loadedAt) / 1000)
    });
    pintarResultado();
    try { sessionStorage.setItem('qv_hero', JSON.stringify({ cuello: calculado.cuello, nivel: calculado.nivel, segunda: calculado.segunda || '' })); } catch (e) { /* sin sesión */ }
    var sig = document.querySelector('[data-radiografia="gracias"]');
    if (sig) sig.href = '/diagnostico/?origen=dx&cuello=' + calculado.cuello;
    var res = document.querySelector('[data-radiografia="reserva"]');
    if (res) res.href = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl?cuello=' + calculado.cuello;
    show('fg-result');
    track('hero_result_view', { cuello: calculado.cuello, nivel: calculado.nivel, completo: calculado.completo });
  }

  // ── Resultado ───────────────────────────────────────────────────────
  function pintarResultado() {
    var c = calculado;
    var dim = DIMS.filter(function (d) { return d.id === c.cuello; })[0];
    var R = RESULTADO[c.cuello];
    var n = NIVELES[c.nivel];

    if (c.perfecto) {
      $('fg-nivel').className = 'fg-nivel bajo';
      $('fg-nivel').textContent = 'Sin cuello de botella claro. Pasa en menos empresas de las que dicen.';
      $('fg-cuello').textContent = 'Ninguno';
      $('fg-title').textContent = 'No hemos encontrado nada que esté frenando tu crecimiento.';
      $('fg-hostia').textContent = 'Tu problema ya no es dónde se rompe. Es hasta dónde aguanta.';
      $('fg-diag').textContent = 'Si has contestado honestamente, tu problema ya no es dónde se rompe: es cuánto puedes crecer sin que el sistema se rompa. Que es otra conversación.';
      $('fg-prio').textContent = 'Dejar de tapar agujeros y mirar el techo.';
      $('fg-antes').textContent = 'Antes de hacer nada nuevo, miraría qué parte se rompería primero si entrara el triple de trabajo.';
      $('fg-accion').textContent = 'Escribe qué pieza de tu sistema se caería primero si mañana entrara el triple de trabajo. Esa es la siguiente obra.';
      $('fg-calc').hidden = true;
    } else {
      $('fg-nivel').className = 'fg-nivel ' + n.cl;
      $('fg-nivel').textContent = n.et + ' — ' + n.li;
      $('fg-cuello').textContent = dim.nombre;
      $('fg-title').textContent = R.titulo;
      $('fg-hostia').textContent = frase(c);
      $('fg-diag').textContent = R[c.nivel];
      $('fg-prio').textContent = R.prio;
      $('fg-antes').textContent = R.antes;
      $('fg-accion').textContent = ACCION[c.sintoma] || ACCION[Object.keys(ACCION)[0]];
      var calc = $('fg-calc');
      var eco = ECO[c.cuello];
      calc.hidden = !eco;
      if (eco) calc.href = '/calculadora-de-fugas/?origen=dx&fuga=' + eco;
    }

    // La segunda dimensión más floja, solo si de verdad está floja
    var seg = $('fg-segunda');
    if (c.segunda && !c.perfecto && c.pct[c.segunda] <= 67) {
      var d2 = DIMS.filter(function (d) { return d.id === c.segunda; })[0];
      seg.hidden = false;
      $('fg-segunda-txt').textContent = d2.nombre.toLowerCase() + ' (' + c.pct[c.segunda] + ' de 100). Suele ser la que sostiene a la primera: arreglar una sin mirar la otra dura poco.';
    } else seg.hidden = true;

    $('fg-parcial').hidden = c.completo;
    $('fg-parcial-n').textContent = c.respondidas;

    var ul = $('fg-semaforos');
    ul.innerHTML = '';
    DIMS.forEach(function (d) {
      var p = c.pct[d.id];
      var li = document.createElement('li');
      if (d.id === c.cuello) li.style.cssText = 'border-color:#E8590C; border-width:2px';
      var dot = document.createElement('span');
      var est = p === null ? 'x' : estadoPct(p) === 'solida' ? 'v' : estadoPct(p) === 'floja' ? 'a' : 'r';
      dot.className = 'fg-dot ' + est;
      li.appendChild(dot);
      li.appendChild(document.createTextNode(d.nombre + (p === null ? ' —' : ' ' + p)));
      if (p === null) li.style.opacity = '.45';
      ul.appendChild(li);
    });
  }

  // ── Share card ──────────────────────────────────────────────────────
  function dibujarCard() {
    var c = $('fg-canvas'), x = c.getContext('2d');
    var dim = DIMS.filter(function (d) { return d.id === calculado.cuello; })[0];
    var R = RESULTADO[calculado.cuello];
    var W = 1080, H = 1350;

    x.fillStyle = '#F2EEE6'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#E8590C'; x.fillRect(72, 88, 520, 52);
    x.fillStyle = '#F2EEE6'; x.font = '800 23px Montserrat, system-ui, sans-serif';
    x.fillText('MI PRINCIPAL CUELLO DE BOTELLA', 92, 122);
    x.fillStyle = '#0A0A0B'; x.font = '900 30px Montserrat, system-ui, sans-serif'; x.textAlign = 'right';
    x.fillText('QUALIVO', W - 72, 124); x.textAlign = 'left';

    x.fillStyle = '#5A5E66'; x.font = '700 27px Montserrat, system-ui, sans-serif';
    x.fillText('MI CRECIMIENTO SE ROMPE EN', 72, 218);
    x.fillStyle = '#0A0A0B'; x.font = '900 88px Montserrat, system-ui, sans-serif';
    x.fillText(calculado.perfecto ? 'NINGÚN SITIO' : dim.nombre.toUpperCase(), 72, 306);
    var niv = NIVELES[calculado.nivel];
    x.fillStyle = niv.cl === 'critica' ? '#E8590C' : niv.cl === 'relevante' ? '#C98A06' : '#0E7C74';
    x.font = '800 30px Montserrat, system-ui, sans-serif';
    x.fillText(calculado.perfecto ? 'SIN CUELLO DE BOTELLA CLARO' : niv.et.toUpperCase(), 72, 372);

    // El mapa de las cinco dimensiones
    var y = 520;
    DIMS.forEach(function (d) {
      var p = calculado.pct[d.id];
      var est = p === null ? null : estadoPct(p);
      var col = p === null ? '#C9C4B9' : est === 'solida' ? '#12A150' : est === 'floja' ? '#E8A50C' : '#E8590C';
      var esCuello = d.id === calculado.cuello && !calculado.perfecto;
      if (esCuello) { x.fillStyle = 'rgba(232,89,12,.10)'; x.fillRect(60, y - 46, 960, 74); }
      x.fillStyle = col; x.beginPath(); x.arc(96, y - 10, 18, 0, Math.PI * 2); x.fill();
      x.fillStyle = esCuello ? '#0A0A0B' : '#31333A';
      x.font = (esCuello ? '900 ' : '700 ') + '34px Montserrat, system-ui, sans-serif';
      x.fillText(d.nombre, 138, y);
      x.fillStyle = '#8A8B90'; x.font = '700 30px Montserrat, system-ui, sans-serif';
      x.fillText(p === null ? '—' : String(p), 930, y);
      y += 88;
    });

    x.fillStyle = '#31333A'; x.font = 'italic 600 36px Montserrat, system-ui, sans-serif';
    envolver(x, '«' + (calculado.perfecto ? 'Mi problema ya no es dónde se rompe, es hasta dónde aguanta.' : R.frase) + '»', 72, 1030, 940, 48);

    x.fillStyle = '#0A0A0B'; x.fillRect(0, H - 150, W, 150);
    x.fillStyle = '#F2EEE6'; x.font = '800 34px Montserrat, system-ui, sans-serif';
    x.fillText('¿Necesitas más clientes o los estás perdiendo?', 72, H - 88);
    x.fillStyle = '#FF7A33'; x.font = '800 29px Montserrat, system-ui, sans-serif';
    x.fillText('qualivo.io/donde-se-rompe-tu-crecimiento', 72, H - 44);
    return c;
  }

  function envolver(ctx, t, x0, y0, ancho, alto) {
    var ps = t.split(' '), l = '', y = y0;
    ps.forEach(function (p) {
      var test = l ? l + ' ' + p : p;
      if (ctx.measureText(test).width > ancho && l) { ctx.fillText(l, x0, y); l = p; y += alto; }
      else l = test;
    });
    if (l) ctx.fillText(l, x0, y);
  }

  function textoShare(canal) {
    var dim = DIMS.filter(function (d) { return d.id === calculado.cuello; })[0];
    var donde = calculado.perfecto ? 'en ningún sitio claro' : 'en ' + dim.nombre.toLowerCase();
    return 'He hecho el diagnóstico de crecimiento de Qualivo y me sale que mi crecimiento se rompe ' + donde +
      '.\nSon 11 preguntas, minuto y medio. A ver qué te sale a ti:\n' + URL_PUBLICA + '?ref=' + canal;
  }

  // Mándaselo a tu socio: nativo con imagen si se puede; si no, WhatsApp con el texto.
  function compartir() {
    track('hero_share', { cuello: calculado.cuello, nivel: calculado.nivel });
    dibujarCard().toBlob(function (blob) {
      var f = blob ? new File([blob], 'mi-cuello-de-botella.png', { type: 'image/png' }) : null;
      var datos = { text: textoShare('share') };
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) datos.files = [f];
      if (navigator.share) {
        navigator.share(datos).then(function () { track('hero_share_done', { canal: 'nativo' }); }).catch(function () {});
      } else {
        window.open('https://wa.me/?text=' + encodeURIComponent(textoShare('wa')), '_blank', 'noopener');
        track('hero_share_done', { canal: 'whatsapp' });
      }
    }, 'image/png');
  }

  function descargarCard() {
    track('hero_share', { cuello: calculado.cuello, nivel: calculado.nivel, canal: 'descarga' });
    dibujarCard().toBlob(function (blob) {
      if (!blob) return;
      var u = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = u; a.download = 'mi-cuello-de-botella.png'; a.click();
      setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
      track('hero_share_done', { canal: 'descarga' });
    }, 'image/png');
  }

  function whatsapp() {
    track('hero_share_whatsapp', { cuello: calculado.cuello, nivel: calculado.nivel });
    window.open('https://wa.me/?text=' + encodeURIComponent(textoShare('wa')), '_blank', 'noopener');
  }

  function linkedin() {
    track('hero_share_linkedin', { cuello: calculado.cuello, nivel: calculado.nivel });
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(URL_PUBLICA + '?ref=li'), '_blank', 'noopener');
    track('hero_share_done', { canal: 'linkedin' });
  }

  // ── Envío ───────────────────────────────────────────────────────────
  function enviar(e) {
    e.preventDefault();
    var nombre = $('fg-nombre').value.trim(), email = $('fg-email').value.trim();
    var sector = $('fg-sector').value;
    var telefono = ($('fg-telefono') ? $('fg-telefono').value : '').replace(/[^\d+]/g, '');
    var rgpd = $('fg-rgpd').checked, err = $('fg-error');
    if ($('fg-website').value || Date.now() - loadedAt < 4000) { show('fg-thanks'); return; }
    err.hidden = true;
    if (!nombre) { err.textContent = 'Dinos tu nombre.'; err.hidden = false; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Revisa el correo.'; err.hidden = false; return; }
    if (telefono && !/^\+?\d{9,15}$/.test(telefono)) { err.textContent = 'Revisa el número de WhatsApp (o déjalo vacío).'; err.hidden = false; return; }
    if (!rgpd) { err.textContent = 'Necesitamos tu consentimiento para tratar los datos.'; err.hidden = false; return; }

    var btn = $('fg-submit'); btn.disabled = true; btn.textContent = 'Un segundo…';
    fetch('/api/fugas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre, email: email, rgpd: true, sector: sector, telefono: telefono,
        cuello: calculado.cuello, segunda: calculado.segunda || '', sintoma: calculado.sintoma, nivel: calculado.nivel,
        total: calculado.total, maximo: calculado.maximo, completo: calculado.completo,
        dims: calculado.pct,
        empleados: perfil.empleados || '', valor_cliente: perfil.valor || '',
        origen: window.location.hostname || 'local', rol: perfil.rol || '', utm: UTM
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      track('hero_email_submit', { cuello: calculado.cuello, nivel: calculado.nivel, sector: sector, con_telefono: !!telefono,
        rol: perfil.rol || '', empleados: perfil.empleados || '', valor_cliente: perfil.valor || '' });
      show('fg-thanks');
    }).catch(function () {
      err.textContent = 'No hemos podido guardarlo. Inténtalo otra vez en unos segundos.'; err.hidden = false;
    }).finally(function () { btn.disabled = false; btn.textContent = 'Enviarme la radiografía'; });
  }

  function empezar() { track('hero_start', {}); actual = 0; pintarPregunta(); show('fg-quiz'); }

  ['fg-start', 'fg-start2', 'fg-start3', 'fg-start4'].forEach(function (id) { if ($(id)) $(id).addEventListener('click', empezar); });

  // CTA fija en móvil: aparece cuando el botón del hero sale de pantalla, solo en la landing
  var sticky = $('fg-sticky'), heroBtn = $('fg-start');
  if (sticky && heroBtn && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var enLanding = function () { return !$('fg-landing').hidden; };
    new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; sticky.hidden = heroVisible || !enLanding(); }, { threshold: 0 }).observe(heroBtn);
    var finalBtn = $('fg-start2');
    if (finalBtn) new IntersectionObserver(function (en) { if (en[0].isIntersecting) sticky.hidden = true; else sticky.hidden = heroVisible || !enLanding(); }, { threshold: 0 }).observe(finalBtn);
  }
  $('fg-prev').addEventListener('click', function () {
    if (enPerfil) { actual = PREGUNTAS.length - 1; pintarPregunta(); return; }
    if (actual > 0) { actual--; pintarPregunta(); }
  });
  $('fg-salir').addEventListener('click', function () { pintarPerfil(); });
  $('fg-seguir').addEventListener('click', function () { actual = respuestas.indexOf(null); if (actual < 0) actual = 0; pintarPregunta(); show('fg-quiz'); });
  $('fg-sharebtn').addEventListener('click', compartir);
  $('fg-sharebtn2').addEventListener('click', compartir);
  $('fg-descargar').addEventListener('click', descargarCard);
  $('fg-whatsapp').addEventListener('click', whatsapp);
  $('fg-linkedin').addEventListener('click', linkedin);
  $('fg-gatebtn').addEventListener('click', function () {
    var dim = DIMS.filter(function (d) { return d.id === calculado.cuello; })[0];
    $('fg-gate-dim').textContent = calculado.perfecto ? 'tu siguiente techo' : dim.nombre.toLowerCase();
    track('hero_gate_view', { cuello: calculado.cuello }); show('fg-gate');
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-radiografia]'), function (a) {
    a.addEventListener('click', function () { track('hero_radiografia_click', { cuello: calculado ? calculado.cuello : '', desde: a.getAttribute('data-radiografia') }); });
  });
  $('fg-gateback').addEventListener('click', function () { show('fg-result'); });
  $('fg-form').addEventListener('submit', enviar);

  window.addEventListener('beforeunload', function () {
    if (calculado === null && actual > 0) track('hero_abandon', { ultima_pregunta: actual + 1 });
  });

  var qs = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'].forEach(function (k) { if (qs.get(k)) UTM[k] = qs.get(k).slice(0, 80); });
  try {
    if (Object.keys(UTM).length) sessionStorage.setItem('qv_utm', JSON.stringify(UTM));
    else UTM = JSON.parse(sessionStorage.getItem('qv_utm') || '{}');
  } catch (e) { /* sin almacenamiento, sin drama */ }
  track('hero_view', { utm_source: UTM.utm_source || '', utm_campaign: UTM.utm_campaign || '', utm_content: UTM.utm_content || '', ref: UTM.ref || '', referrer: document.referrer || '' });
})();
