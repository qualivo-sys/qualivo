/* ¿Dónde se te escapan los clientes? — qualivo.io/donde-pierdes-clientes
   5 etapas del recorrido × 4 preguntas = 20 preguntas (0/1/2 puntos).
   Resultado parcial al terminar cada etapa. El resultado NUNCA se bloquea:
   el correo compra la radiografía ampliada, no el veredicto. */
(function () {
  'use strict';

  var ETAPAS = [
    { id: 'captacion', nombre: 'Captación', pregunta: '¿Entra gente?' },
    { id: 'conversion', nombre: 'Conversión', pregunta: '¿Los atiendes a tiempo?' },
    { id: 'seguimiento', nombre: 'Seguimiento', pregunta: '¿Los persigues?' },
    { id: 'proceso', nombre: 'Proceso', pregunta: '¿Aguanta sin ti?' },
    { id: 'medicion', nombre: 'Medición', pregunta: '¿Sabes qué está pasando?' }
  ];

  // Orden de desempate cuando dos etapas empatan a la baja. Criterio económico:
  // cuánto dinero llevas ya gastado en el cliente que estás perdiendo ahí.
  var PRIORIDAD = ['seguimiento', 'conversion', 'captacion', 'proceso', 'medicion'];

  var PREGUNTAS = [
    // ── Captación
    { e: 0, sintoma: 'canal-unico', texto: '¿De dónde llega la mayoría de tus clientes nuevos?',
      op: [['De varios sitios distintos', 2], ['Casi todo del boca a boca', 1], ['Casi todo de un canal que pagamos', 1], ['No sabría decirte', 0]] },
    { e: 0, sintoma: 'origen', texto: 'Tu último cliente bueno, ¿de dónde salió?',
      op: [['Lo sé, y sé de dónde vino cada uno', 2], ['Ese sí, pero de todos no', 1], ['Ni idea. Apareció', 0]] },
    { e: 0, sintoma: 'canal-unico', texto: 'Si mañana se corta tu canal principal, ¿cuándo lo notarías en la facturación?',
      op: [['Tardaría. Tengo otros funcionando', 2], ['En un par de meses', 1], ['Al mes siguiente. De ahí viene casi todo', 0]] },
    { e: 0, sintoma: 'coste', texto: '¿Sabes cuánto te cuesta conseguir un cliente nuevo?',
      op: [['Sí, lo tengo calculado', 2], ['Una aproximación', 1], ['No', 0]] },
    // ── Conversión
    { e: 1, sintoma: 'velocidad', texto: 'Cuando entra una solicitud nueva, ¿cuánto tarda alguien en contestarla?',
      op: [['En menos de una hora', 2], ['El mismo día', 1], ['Al día siguiente, o más', 0], ['Depende del día que sea', 0]] },
    { e: 1, sintoma: 'velocidad', texto: '¿Quién contesta cuando tú no puedes?',
      op: [['Hay alguien con el encargo claro', 2], ['Alguien lo mira, pero sin criterio fijo', 1], ['Espera a que pueda yo', 0]] },
    { e: 1, sintoma: 'caida', texto: 'De diez personas que preguntan, ¿cuántas acaban recibiendo un presupuesto?',
      op: [['Casi todas', 2], ['Más o menos la mitad', 1], ['Pocas. Se enfrían por el camino', 0], ['No sabría decirlo', 0]] },
    { e: 1, sintoma: 'velocidad', texto: '¿Qué pasa cuando alguien escribe un sábado por la tarde?',
      op: [['Recibe respuesta y le llamamos el lunes', 2], ['Le contestamos el lunes', 1], ['Se queda ahí hasta que alguien lo ve', 0]] },
    // ── Seguimiento
    { e: 2, sintoma: 'presupuestos', texto: 'De los presupuestos que enviaste el mes pasado, ¿a cuántos les habéis vuelto a llamar?',
      op: [['A todos, está en el calendario', 2], ['A los que me acordé', 1], ['A ninguno. Si les interesa, llaman', 0], ['No sabría decirte cuántos mandé', 0]] },
    { e: 2, sintoma: 'presupuestos', texto: 'Cuando alguien no contesta a un presupuesto, ¿cuántas veces insistís?',
      op: [['Dos o tres, con días de por medio', 2], ['Una', 1], ['Ninguna', 0]] },
    { e: 2, sintoma: 'perdidos', texto: '¿Qué pasa con los que dijeron que no?',
      op: [['Los volvemos a contactar más adelante', 2], ['Quedan apuntados, pero no hacemos nada', 1], ['Se pierden', 0]] },
    { e: 2, sintoma: 'cartera', texto: 'Un cliente que te compró hace un año y no ha vuelto, ¿qué recibe de vosotros?',
      op: [['Le llamamos cada cierto tiempo', 2], ['Algo le llega de vez en cuando', 1], ['Nada. Si vuelve, vuelve', 0]] },
    // ── Proceso
    { e: 3, sintoma: 'sin-registro', texto: 'Ahora mismo, ¿dónde está apuntado a qué clientes les debes una respuesta?',
      op: [['En un programa que usamos todos', 2], ['En una hoja de cálculo o una libreta', 1], ['En mi cabeza, el móvil y algún papel', 0]] },
    { e: 3, sintoma: 'dependencia', texto: 'Si desapareces una semana, ¿alguien puede mandar un presupuesto y cerrar una venta sin ti?',
      op: [['Sí, sin preguntarme nada', 2], ['Sí, pero acabarían llamándome', 1], ['No. Eso lo hago yo', 0]] },
    { e: 3, sintoma: 'dependencia', texto: 'El precio de lo que vendes, ¿dónde está?',
      op: [['Escrito. Cualquiera puede calcularlo', 2], ['Hay una referencia, pero cada caso lo miro yo', 1], ['En mi cabeza', 0]] },
    { e: 3, sintoma: 'sin-guion', texto: 'Cuando entra un cliente nuevo, ¿todos hacéis lo mismo?',
      op: [['Sí, hay un guion', 2], ['Más o menos', 1], ['Cada uno a su manera', 0]] },
    // ── Medición
    { e: 4, sintoma: 'origen', texto: 'Si te pregunto qué canal te trajo más facturación el año pasado, ¿lo sabes?',
      op: [['Sí, con números', 2], ['Tengo una intuición', 1], ['No', 0]] },
    { e: 4, sintoma: 'sin-revision', texto: '¿Cada cuánto miras juntos los números de captación y los de ventas?',
      op: [['Todos los meses, con una revisión fija', 2], ['De vez en cuando', 1], ['Cuando algo va mal', 0]] },
    { e: 4, sintoma: 'coste', texto: 'Si mañana pudieras doblar la inversión, ¿sabrías dónde meterla?',
      op: [['Sí, sé qué canal aguanta más', 2], ['Lo intuyo', 1], ['No', 0]] },
    { e: 4, sintoma: 'origen', texto: 'De tus últimos diez clientes, ¿de cuántos sabrías explicar de dónde vinieron?',
      op: [['Ocho o más', 2], ['Entre cuatro y siete', 1], ['Menos de cuatro', 0]] }
  ];

  var PERFIL = [
    { id: 'empleados', label: '¿Cuántas personas sois?', op: ['Solo yo', '2 a 5', '6 a 20', 'Más de 20'] },
    { id: 'valor', label: '¿Cuánto suele dejarte un cliente en un año?', op: ['Menos de 500 €', '500 a 2.000 €', '2.000 a 10.000 €', 'Más de 10.000 €', 'No lo sé'] }
  ];

  // Veredicto por etapa según sus 8 puntos posibles
  var ETAPA_TXT = {
    captacion: {
      critica: 'Casi nadie llega, y lo poco que llega no sabes de dónde viene.',
      floja: 'Entra gente, pero dependes demasiado de una sola vía.',
      solida: 'Entra gente y sabes por dónde entra.' },
    conversion: {
      critica: 'Llega gente y se enfría antes de que nadie la atienda.',
      floja: 'Atendéis, pero no siempre a tiempo ni siempre igual.',
      solida: 'A quien pregunta se le atiende rápido.' },
    seguimiento: {
      critica: 'Lo que se manda no se persigue. Aquí es donde más dinero se queda por el camino.',
      floja: 'Se hace seguimiento cuando alguien se acuerda.',
      solida: 'Lo que sale por la puerta tiene a alguien detrás.' },
    proceso: {
      critica: 'Casi todo pasa por ti y casi nada está escrito.',
      floja: 'Hay proceso, pero se sostiene con memoria.',
      solida: 'La empresa funciona aunque tú no estés.' },
    medicion: {
      critica: 'Estás decidiendo a ciegas.',
      floja: 'Miras los números, pero no lo bastante seguido.',
      solida: 'Sabes qué está pasando y puedes decidir con datos.' }
  };

  var NIVELES = {
    critica: { et: 'Fuga crítica', cl: 'critica', li: 'No es un detalle. Es por donde se te está yendo el negocio.' },
    relevante: { et: 'Fuga relevante', cl: 'relevante', li: 'Tienes cosas bien montadas. Esta no.' },
    bajo: { et: 'Bajo riesgo', cl: 'bajo', li: 'Vas bien. Esto es lo único que desentona.' }
  };

  var SINTOMAS = {
    'presupuestos': { corto: 'Seguimiento de presupuestos', frase: 'Mando presupuestos y ahí se acaba.',
      diag: 'Este es el cliente más caro que tienes. Ya pagaste por atraerlo, le dedicaste una visita y calculaste el precio. Todo el coste está gastado. Lo único que falta es una llamada de dos minutos que no hace nadie.',
      prio: 'Antes que ninguna otra cosa, esta.',
      accion: 'Coge los presupuestos de este mes sin respuesta, ponlos en una lista y llama a tres. Sin oferta ni excusa: «te mandé aquello, ¿lo has podido mirar?».', eco: true },
    'velocidad': { corto: 'Velocidad de respuesta', frase: 'Contesto tarde y no lo noto.',
      diag: 'Casi nadie te dice que se fue con otro. Simplemente deja de contestar, y tú lo apuntas como «no estaba interesado». Estaba interesado. Contestó otro antes.',
      prio: 'Reducir el tiempo de primera respuesta antes de tocar la publicidad.',
      accion: 'Decide quién contesta cuando tú no puedes, y dile en cuánto tiempo. Si no puede nadie, un aviso automático que diga cuándo vas a llamar ya cambia el resultado.', eco: true },
    'caida': { corto: 'Gente que se cae por el camino', frase: 'Preguntan muchos y presupuesto pocos.',
      diag: 'Entre que alguien pregunta y alguien recibe un precio hay un tramo donde se pierde gente. Normalmente no es que no quieran: es que el camino tiene demasiados pasos o demasiada espera.',
      prio: 'Acortar lo que pasa entre la pregunta y el precio.',
      accion: 'Coge las últimas diez personas que preguntaron y cuenta cuántas recibieron un presupuesto. Los que faltan son el tamaño del agujero.', eco: true },
    'perdidos': { corto: 'Los «no» que se tiran', frase: 'El que dice que no, desaparece para siempre.',
      diag: 'Un «no» casi nunca es un no para siempre. Suele ser «ahora no» o «así no». Tirar esa lista es tirar la gente que ya te conoce y ya te comparó.',
      prio: 'Recuperar la lista de los que dijeron que no este año.',
      accion: 'Haz la lista y llama a cinco. No para vender: para saber qué pasó al final con aquello.', eco: true },
    'cartera': { corto: 'Cartera dormida', frase: 'Mis clientes antiguos no saben nada de mí.',
      diag: 'Ya te compraron, ya confían y ya sabes que pagan. Y aun así el presupuesto se va en buscar desconocidos. No es que no les gustaras: es que no se acuerdan.',
      prio: 'Diez llamadas antes que una campaña.',
      accion: 'Coge los diez clientes que mejor te fueron y llámalos. Sin vender nada: «qué tal va aquello».', eco: true },
    'origen': { corto: 'No sabes qué te trae los clientes', frase: 'No sé de dónde me vienen los clientes.',
      diag: 'Cuando entra una venta buena y nadie sabe de dónde salió, no has tenido suerte: has tenido un canal funcionando a ciegas. El problema llega cuando toca recortar, porque puedes estar apagando justo ese.',
      prio: 'Empezar a registrar el origen antes de mover un euro de presupuesto.',
      accion: 'Añade «¿cómo nos has conocido?» a cada alta y apúntalo, aunque sea en una libreta. En tres meses tienes el mapa.', eco: false },
    'canal-unico': { corto: 'Todo depende de un solo canal', frase: 'Si se cae ese canal, se cae el mes.',
      diag: 'Funcionar con un canal no es un problema mientras funciona. Es un problema el día que cambia el algoritmo, sube el coste o se jubila el que te recomendaba. Y ese día no avisa.',
      prio: 'Una segunda vía de entrada, aunque sea pequeña.',
      accion: 'Mira qué porcentaje de tus clientes del año pasado vino de tu canal principal. Si pasa del setenta por ciento, eso no es un canal: es una dependencia.', eco: false },
    'coste': { corto: 'No sabes lo que cuesta un cliente', frase: 'No sé lo que me cuesta conseguir un cliente.',
      diag: 'Sin ese número, cualquier decisión sobre invertir más o menos es una apuesta con cara de informe. Y es el número que separa gastar de invertir.',
      prio: 'Calcular el coste por cliente de los últimos tres meses.',
      accion: 'Suma lo que gastaste en captar el trimestre pasado y divídelo entre los clientes que entraron. Ese número, aunque sea aproximado, ya cambia conversaciones.', eco: true },
    'sin-registro': { corto: 'El proceso vive en tu cabeza', frase: 'Lo que está pendiente no está escrito en ningún sitio.',
      diag: 'Mientras hay poco volumen funciona. El día que entran quince cosas a la vez se cae alguna, y siempre se cae la que no gritaba. Que suele ser la más grande.',
      prio: 'Un sitio único donde esté lo pendiente. Da igual cuál.',
      accion: 'Abre una hoja con cuatro columnas: quién es, de dónde vino, qué toca hacer y cuándo. Con eso ya sabes más que la mayoría de tu sector.', eco: false },
    'dependencia': { corto: 'El cuello de botella eres tú', frase: 'El cuello de botella soy yo.',
      diag: 'Esto no se nota como una pérdida, se nota como cansancio. Pero es una fuga igual: cada oportunidad que espera a que tengas un hueco es una oportunidad enfriándose. Tu empresa no puede crecer más rápido de lo que tú puedas atender.',
      prio: 'Sacar de tu cabeza una sola cosa: el precio.',
      accion: 'Escribe en un folio cómo se calcula un presupuesto tipo. Ese folio es la primera pieza de sistema que tiene tu empresa.', eco: false },
    'sin-guion': { corto: 'Cada uno lo hace a su manera', frase: 'Cada uno atiende como le parece.',
      diag: 'Cuando no hay guion, la experiencia del cliente depende de quién le toque ese día. Y los resultados dejan de poder compararse: no sabes si funcionó el método o la persona.',
      prio: 'Escribir el guion de lo que pasa desde que alguien pregunta.',
      accion: 'Pregunta a dos personas de tu equipo qué hacen cuando entra un cliente nuevo. Si te cuentan cosas distintas, ahí tienes el trabajo.', eco: false },
    'sin-revision': { corto: 'Nadie mira los números hasta que duele', frase: 'Miro los números cuando algo va mal.',
      diag: 'Mirar solo cuando duele significa enterarte de los problemas dos o tres meses tarde, cuando ya han costado dinero. Media hora al mes cambia eso entero.',
      prio: 'Una revisión fija al mes, con día y hora.',
      accion: 'Ponte media hora en el calendario el primer lunes de cada mes. Solo dos números: qué entró y de dónde.', eco: false }
  };

  var $ = function (id) { return document.getElementById(id); };
  var SECS = ['fg-landing', 'fg-quiz', 'fg-etapa', 'fg-result', 'fg-gate', 'fg-thanks'];
  var actual = 0;
  var respuestas = new Array(PREGUNTAS.length).fill(null);
  var perfil = { empleados: null, valor: null };
  var calculado = null;
  var loadedAt = Date.now();
  var qStart = 0;
  var enPerfil = false;

  function track(n, d) {
    try {
      if (window.qvTrack) window.qvTrack(n, d || {});
      if (window.va) window.va('event', { name: n, data: d || {} });
    } catch (e) { /* el tracking nunca rompe la experiencia */ }
  }

  function show(id) { SECS.forEach(function (s) { var el = $(s); if (el) el.hidden = s !== id; }); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // ── Scoring ─────────────────────────────────────────────────────────
  function estadoEtapa(pts) { return pts <= 2 ? 'critica' : (pts <= 5 ? 'floja' : 'solida'); }

  function puntosEtapa(i) {
    var t = 0, contestadas = 0;
    PREGUNTAS.forEach(function (q, n) {
      if (q.e !== i || respuestas[n] === null) return;
      t += respuestas[n]; contestadas++;
    });
    return { puntos: t, contestadas: contestadas };
  }

  function calcular() {
    var porEtapa = {}, total = 0, respondidas = 0, maximo = 0;
    ETAPAS.forEach(function (et, i) {
      var r = puntosEtapa(i);
      porEtapa[et.id] = r.puntos;
      total += r.puntos; respondidas += r.contestadas; maximo += r.contestadas * 2;
    });

    // Etapa débil entre las que se han contestado al menos una vez
    var vivas = ETAPAS.filter(function (et, i) { return puntosEtapa(i).contestadas > 0; });
    var min = Math.min.apply(null, vivas.map(function (et) { return porEtapa[et.id]; }));
    var candidatas = vivas.filter(function (et) { return porEtapa[et.id] === min; }).map(function (et) { return et.id; });
    var debil = PRIORIDAD.filter(function (id) { return candidatas.indexOf(id) !== -1; })[0] || candidatas[0];

    // Síntoma: la pregunta peor puntuada dentro de la etapa débil
    var idxEtapa = ETAPAS.map(function (e) { return e.id; }).indexOf(debil);
    var peor = null, peorPts = 3;
    PREGUNTAS.forEach(function (q, n) {
      if (q.e !== idxEtapa || respuestas[n] === null) return;
      if (respuestas[n] < peorPts) { peorPts = respuestas[n]; peor = q.sintoma; }
    });

    var pct = maximo ? total / maximo : 0;
    var nivel = pct < 0.4 ? 'critica' : (pct < 0.7 ? 'relevante' : 'bajo');
    var perfecto = respondidas === PREGUNTAS.length && total === maximo;

    return { porEtapa: porEtapa, total: total, maximo: maximo, respondidas: respondidas,
             debil: debil, sintoma: peor, nivel: nivel, perfecto: perfecto, completo: respondidas === PREGUNTAS.length };
  }

  // ── Preguntas ───────────────────────────────────────────────────────
  function pintarPregunta() {
    var q = PREGUNTAS[actual];
    var et = ETAPAS[q.e];
    var cont = $('fg-options');
    cont.innerHTML = '';
    enPerfil = false;
    $('fg-dim').textContent = 'Etapa ' + (q.e + 1) + ' de 5 · ' + et.nombre;
    $('fg-count').textContent = (actual + 1) + ' de ' + PREGUNTAS.length;
    $('fg-bar').style.width = (actual / PREGUNTAS.length * 100) + '%';
    $('fg-question').textContent = q.texto;
    $('fg-prev').hidden = actual === 0;
    $('fg-salir').hidden = actual < 4;
    qStart = Date.now();

    q.op.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fg-answer' + (respuestas[actual] === o[1] ? ' sel' : '');
      b.textContent = o[0];
      b.addEventListener('click', function () {
        respuestas[actual] = o[1];
        track('fugas_q', { n: actual + 1, etapa: et.id, puntos: o[1], ms: Date.now() - qStart });
        avanzar();
      });
      cont.appendChild(b);
    });
  }

  function avanzar() {
    var eraEtapa = PREGUNTAS[actual].e;
    actual++;
    if (actual >= PREGUNTAS.length) { pintarPerfil(); return; }
    if (PREGUNTAS[actual].e !== eraEtapa) { pintarCorte(eraEtapa); return; }
    pintarPregunta();
  }

  // ── Corte de etapa: el resultado parcial ────────────────────────────
  function pintarCorte(i) {
    var et = ETAPAS[i];
    var pts = puntosEtapa(i).puntos;
    var est = estadoEtapa(pts);
    var clase = est === 'solida' ? 'bajo' : (est === 'floja' ? 'relevante' : 'critica');
    var etiqueta = est === 'solida' ? 'Sólida' : (est === 'floja' ? 'Floja' : 'Crítica');

    $('fg-et-num').textContent = 'Etapa ' + (i + 1) + ' de 5';
    $('fg-et-nom').textContent = et.nombre;
    $('fg-et-badge').className = 'fg-nivel ' + clase;
    $('fg-et-badge').textContent = etiqueta + ' · ' + pts + ' de 8';
    $('fg-et-txt').textContent = ETAPA_TXT[et.id][est];
    $('fg-et-sig').textContent = 'Seguir con ' + ETAPAS[i + 1].nombre + ' →';

    var mapa = $('fg-et-mapa');
    mapa.innerHTML = '';
    ETAPAS.forEach(function (e2, j) {
      var li = document.createElement('li');
      var hecha = j <= i;
      var p2 = puntosEtapa(j).puntos;
      var dot = document.createElement('span');
      dot.className = 'fg-dot ' + (!hecha ? 'x' : estadoEtapa(p2) === 'solida' ? 'v' : estadoEtapa(p2) === 'floja' ? 'a' : 'r');
      li.appendChild(dot);
      li.appendChild(document.createTextNode(e2.nombre));
      if (!hecha) li.style.opacity = '.4';
      mapa.appendChild(li);
    });
    track('fugas_etapa', { etapa: et.id, puntos: pts, estado: est });
    show('fg-etapa');
  }

  // ── Perfil ──────────────────────────────────────────────────────────
  function pintarPerfil() {
    var cont = $('fg-options');
    cont.innerHTML = '';
    enPerfil = true;
    $('fg-dim').textContent = 'Casi está';
    $('fg-count').textContent = 'Última';
    $('fg-bar').style.width = '96%';
    $('fg-question').textContent = 'Dos últimas, para ajustar el resultado a tu caso.';
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
          if (perfil.empleados && perfil.valor) $('fg-final').disabled = false;
        });
        grid.appendChild(b);
      });
      wrap.appendChild(grid);
      cont.appendChild(wrap);
    });
    var fin = document.createElement('button');
    fin.type = 'button'; fin.id = 'fg-final'; fin.className = 'btn-teal';
    fin.textContent = 'Ver mi diagnóstico →'; fin.style.marginTop = '6px';
    fin.disabled = !(perfil.empleados && perfil.valor);
    fin.addEventListener('click', function () { terminar(true); });
    cont.appendChild(fin);
    show('fg-quiz');
  }

  function terminar(completo) {
    calculado = calcular();
    track('fugas_complete', {
      etapa_debil: calculado.debil, sintoma: calculado.sintoma, nivel: calculado.nivel,
      total: calculado.total, de: calculado.maximo, completo: !!completo,
      respondidas: calculado.respondidas,
      empleados: perfil.empleados || '', valor_cliente: perfil.valor || '',
      segundos: Math.round((Date.now() - loadedAt) / 1000)
    });
    pintarResultado();
    show('fg-result');
    track('fugas_result_view', { etapa_debil: calculado.debil, nivel: calculado.nivel, completo: !!completo });
  }

  // ── Resultado ───────────────────────────────────────────────────────
  function pintarResultado() {
    var s = SINTOMAS[calculado.sintoma] || SINTOMAS['presupuestos'];
    var et = ETAPAS.filter(function (e) { return e.id === calculado.debil; })[0];
    var n = NIVELES[calculado.nivel];

    if (calculado.perfecto) {
      $('fg-nivel').className = 'fg-nivel bajo';
      $('fg-nivel').textContent = 'Sin fuga evidente — esto pasa en menos empresas de las que dicen.';
      $('fg-title').textContent = 'No hemos encontrado ninguna fuga clara.';
      $('fg-diag').textContent = 'Si has contestado honestamente, tu problema ya no es dónde pierdes: es cuánto puedes crecer sin que el sistema se rompa. Que es otra conversación distinta.';
      $('fg-prio').textContent = 'Dejar de tapar agujeros y mirar el techo.';
      $('fg-accion').textContent = 'Mira qué parte de tu sistema se rompería primero si mañana entrara el triple de trabajo. Esa es la siguiente obra.';
      $('fg-calc').hidden = true;
    } else {
      $('fg-nivel').className = 'fg-nivel ' + n.cl;
      $('fg-nivel').textContent = n.et + ' — ' + n.li;
      // Evita el titular redundante cuando el síntoma ya nombra la etapa
      var corto = s.corto.toLowerCase();
      var etapa = et.nombre.toLowerCase();
      $('fg-title').textContent = corto.indexOf(etapa) === 0
        ? 'Se te escapan en el ' + corto + '.'
        : 'Se te escapan en ' + etapa + ': ' + corto + '.';
      $('fg-diag').textContent = s.diag;
      $('fg-prio').textContent = s.prio;
      $('fg-accion').textContent = s.accion;
      var calc = $('fg-calc');
      calc.hidden = !s.eco;
      if (s.eco) calc.href = '/calculadora-de-fugas/?origen=fugas&fuga=' + calculado.sintoma;
    }

    $('fg-parcial').hidden = calculado.completo;
    $('fg-parcial-n').textContent = calculado.respondidas;

    var ul = $('fg-semaforos');
    ul.innerHTML = '';
    ETAPAS.forEach(function (e, i) {
      var contest = puntosEtapa(i).contestadas > 0;
      var p = calculado.porEtapa[e.id];
      var est = estadoEtapa(p);
      var li = document.createElement('li');
      if (e.id === calculado.debil) li.style.cssText = 'border-color:#E8590C; border-width:2px';
      var dot = document.createElement('span');
      dot.className = 'fg-dot ' + (!contest ? 'x' : est === 'solida' ? 'v' : est === 'floja' ? 'a' : 'r');
      li.appendChild(dot);
      li.appendChild(document.createTextNode(e.nombre + (contest ? ' ' + p + '/8' : ' —')));
      if (!contest) li.style.opacity = '.45';
      ul.appendChild(li);
    });
  }

  // ── Share card: el mapa de las 5 etapas ─────────────────────────────
  function dibujarCard() {
    var c = $('fg-canvas'), x = c.getContext('2d');
    var s = SINTOMAS[calculado.sintoma] || SINTOMAS['presupuestos'];
    var et = ETAPAS.filter(function (e) { return e.id === calculado.debil; })[0];
    var W = 1080, H = 1350;

    x.fillStyle = '#F2EEE6'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#E8590C'; x.fillRect(72, 88, 300, 52);
    x.fillStyle = '#F2EEE6'; x.font = '800 23px Montserrat, system-ui, sans-serif';
    x.fillText('MI DIAGNÓSTICO', 92, 122);

    x.fillStyle = '#5A5E66'; x.font = '700 27px Montserrat, system-ui, sans-serif';
    x.fillText('SE ME ESCAPAN EN', 72, 218);
    x.fillStyle = '#0A0A0B'; x.font = '900 88px Montserrat, system-ui, sans-serif';
    x.fillText(et.nombre.toUpperCase(), 72, 306);
    x.fillStyle = '#31333A'; x.font = '700 40px Montserrat, system-ui, sans-serif';
    envolver(x, s.corto, 72, 372, 940, 50);

    // El mapa del recorrido
    var y = 520;
    x.font = '800 32px Montserrat, system-ui, sans-serif';
    ETAPAS.forEach(function (e, i) {
      var contest = puntosEtapa(i).contestadas > 0;
      var p = calculado.porEtapa[e.id];
      var est = estadoEtapa(p);
      var col = !contest ? '#C9C4B9' : est === 'solida' ? '#12A150' : est === 'floja' ? '#E8A50C' : '#E8590C';
      var esDebil = e.id === calculado.debil;
      if (esDebil) { x.fillStyle = 'rgba(232,89,12,.10)'; x.fillRect(60, y - 46, 960, 74); }
      x.fillStyle = col; x.beginPath(); x.arc(96, y - 10, 18, 0, Math.PI * 2); x.fill();
      x.fillStyle = esDebil ? '#0A0A0B' : '#31333A';
      x.font = (esDebil ? '900 ' : '700 ') + '34px Montserrat, system-ui, sans-serif';
      x.fillText(e.nombre, 138, y);
      x.fillStyle = '#8A8B90'; x.font = '700 30px Montserrat, system-ui, sans-serif';
      x.fillText(contest ? p + '/8' : '—', 930, y);
      y += 88;
    });

    x.fillStyle = '#31333A'; x.font = 'italic 600 36px Montserrat, system-ui, sans-serif';
    envolver(x, '«' + s.frase + '»', 72, 1042, 940, 48);

    x.fillStyle = '#0A0A0B'; x.fillRect(0, H - 150, W, 150);
    x.fillStyle = '#F2EEE6'; x.font = '800 34px Montserrat, system-ui, sans-serif';
    x.fillText('¿Y a ti dónde se te escapan?', 72, H - 88);
    x.fillStyle = '#FF7A33'; x.font = '800 29px Montserrat, system-ui, sans-serif';
    x.fillText('qualivo.io/donde-pierdes-clientes', 72, H - 44);
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

  function compartir() {
    track('fugas_share_click', { etapa_debil: calculado.debil });
    dibujarCard().toBlob(function (blob) {
      var s = SINTOMAS[calculado.sintoma] || SINTOMAS['presupuestos'];
      var et = ETAPAS.filter(function (e) { return e.id === calculado.debil; })[0];
      var texto = 'He hecho esto y me sale que se me escapan en ' + et.nombre.toLowerCase() +
        ': ' + s.corto.toLowerCase() + '.\nA ver qué te sale a ti:\nhttps://qualivo.io/donde-pierdes-clientes/';
      var f = blob ? new File([blob], 'mi-diagnostico.png', { type: 'image/png' }) : null;
      var datos = { text: texto };
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) datos.files = [f];
      if (navigator.share) {
        navigator.share(datos).then(function () { track('fugas_share_done', { canal: 'nativo' }); }).catch(function () {});
      } else if (blob) {
        var u = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = u; a.download = 'mi-diagnostico.png'; a.click();
        setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
        track('fugas_share_done', { canal: 'descarga' });
      }
    }, 'image/png');
  }

  // ── Envío ───────────────────────────────────────────────────────────
  function enviar(e) {
    e.preventDefault();
    var nombre = $('fg-nombre').value.trim(), email = $('fg-email').value.trim();
    var rgpd = $('fg-rgpd').checked, err = $('fg-error');
    if ($('fg-website').value || Date.now() - loadedAt < 4000) { show('fg-thanks'); return; }
    err.hidden = true;
    if (!nombre) { err.textContent = 'Dinos tu nombre.'; err.hidden = false; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Revisa el correo.'; err.hidden = false; return; }
    if (!rgpd) { err.textContent = 'Necesitamos tu consentimiento para tratar los datos.'; err.hidden = false; return; }

    var btn = $('fg-submit'); btn.disabled = true; btn.textContent = 'Un segundo…';
    fetch('/api/fugas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre, email: email, rgpd: true,
        etapa_debil: calculado.debil, sintoma: calculado.sintoma, nivel: calculado.nivel,
        total: calculado.total, maximo: calculado.maximo, completo: calculado.completo,
        etapas: calculado.porEtapa,
        empleados: perfil.empleados || '', valor_cliente: perfil.valor || '',
        origen: window.location.hostname || 'local'
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      track('fugas_email_submit', { etapa_debil: calculado.debil, nivel: calculado.nivel,
        empleados: perfil.empleados || '', valor_cliente: perfil.valor || '' });
      show('fg-thanks');
    }).catch(function () {
      err.textContent = 'No hemos podido guardarlo. Inténtalo otra vez en unos segundos.'; err.hidden = false;
    }).finally(function () { btn.disabled = false; btn.textContent = 'Enviarme la radiografía'; });
  }

  function empezar() { track('fugas_start', {}); actual = 0; pintarPregunta(); show('fg-quiz'); }

  $('fg-start').addEventListener('click', empezar);
  $('fg-start2').addEventListener('click', empezar);
  $('fg-prev').addEventListener('click', function () {
    if (enPerfil) { actual = PREGUNTAS.length - 1; pintarPregunta(); return; }
    if (actual > 0) { actual--; pintarPregunta(); }
  });
  $('fg-salir').addEventListener('click', function () { terminar(false); });
  $('fg-et-sig').addEventListener('click', function () { pintarPregunta(); show('fg-quiz'); });
  $('fg-et-salir').addEventListener('click', function () { terminar(false); });
  $('fg-sharebtn').addEventListener('click', compartir);
  $('fg-sharebtn2').addEventListener('click', compartir);
  $('fg-gatebtn').addEventListener('click', function () { show('fg-gate'); });
  $('fg-gateback').addEventListener('click', function () { show('fg-result'); });
  $('fg-seguir').addEventListener('click', function () { pintarPregunta(); show('fg-quiz'); });
  $('fg-form').addEventListener('submit', enviar);

  window.addEventListener('beforeunload', function () {
    if (calculado === null && actual > 0) track('fugas_abandon', { ultima_pregunta: actual + 1 });
  });

  var qs = new URLSearchParams(location.search);
  track('fugas_view', { utm_source: qs.get('utm_source') || '', utm_campaign: qs.get('utm_campaign') || '', referrer: document.referrer || '' });
})();
