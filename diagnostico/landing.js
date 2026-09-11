/* Landing del diagnóstico. Dos pasos: primero se comprueba si tiene sentido y
   solo entonces se pide el dato personal y se enseña el calendario. Quien no
   pasa el corte se le dice con claridad y se guarda el contacto. */
(function () {
  'use strict';

  var CALENDARIO = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl';
  var ENDPOINT = '/api/diagnostico';

  var f = document.getElementById('f');
  if (!f) return;
  var p1 = document.getElementById('p1'), p2 = document.getElementById('p2');
  var p3 = document.getElementById('p3'), p4 = document.getElementById('p4');
  var e1 = document.getElementById('e1'), e2 = document.getElementById('e2');
  var datos = {};

  function ver(el) {
    [p1, p2, p3, p4].forEach(function (x) { x.hidden = x !== el; });
    var y = f.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function error(nodo, texto) {
    nodo.textContent = texto;
    nodo.hidden = false;
  }

  function valor(nombre) {
    var s = f.elements[nombre];
    return s && s.value !== '' ? parseInt(s.value, 10) : -1;
  }

  // Corte: hace falta equipo de 5 o más Y alguna inversión en captación.
  // Con menos, un diagnóstico completo cuesta más de lo que devuelve.
  function cualifica() {
    return valor('equipo') >= 2 && valor('inversion') >= 2;
  }

  document.getElementById('b1').addEventListener('click', function () {
    e1.hidden = true;
    var faltan = ['sector', 'equipo', 'inversion', 'web'].filter(function (n) {
      return !String(f.elements[n].value || '').trim();
    });
    if (faltan.length) { error(e1, 'Contesta las cuatro, son diez segundos.'); return; }

    datos.sector = f.elements.sector.value;
    datos.equipo = f.elements.equipo.options[f.elements.equipo.selectedIndex].text;
    datos.inversion = f.elements.inversion.options[f.elements.inversion.selectedIndex].text;
    datos.web = f.elements.web.value.trim();
    datos.cualificado = cualifica();

    if (window.qvTrack) window.qvTrack('diagnostico_paso1', { cualificado: datos.cualificado });

    if (!datos.cualificado) {
      // Se guarda igualmente: es un contacto que puede encajar más adelante.
      enviar(true);
      ver(p4);
      return;
    }
    ver(p2);
  });

  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    e2.hidden = true;
    if (f.elements.website.value) return;               // trampa para robots
    var faltan = ['nombre', 'email', 'telefono'].filter(function (n) {
      return !String(f.elements[n].value || '').trim();
    });
    if (faltan.length) { error(e2, 'Falta el nombre, el email o el teléfono.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.elements.email.value)) {
      error(e2, 'Ese email no parece correcto.'); return;
    }
    if (!f.elements.rgpd.checked) { error(e2, 'Necesito que aceptes la política de privacidad.'); return; }

    datos.nombre = f.elements.nombre.value.trim();
    datos.email = f.elements.email.value.trim();
    datos.telefono = f.elements.telefono.value.trim();
    datos.hipotesis = f.elements.hipotesis.value.trim();

    var b = document.getElementById('b2');
    b.disabled = true; b.textContent = 'Un segundo…';

    enviar(false).then(function () {
      if (window.qvTrack) window.qvTrack('diagnostico_lead', {});
      calendario();
      ver(p3);
    }).catch(function () {
      b.disabled = false; b.textContent = 'Quiero ver dónde está la fuga →';
      error(e2, 'No ha salido. Escríbeme a hola@qualivo.io y lo vemos.');
    });
  });

  function enviar(silencioso) {
    var cuerpo = JSON.stringify(Object.assign({}, datos, {
      origen: 'diagnostico',
      utm: location.search || ''
    }));
    var p = fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r; });
    return silencioso ? p.catch(function () {}) : p;
  }

  // Quien llega desde el lead form de Meta ya ha dejado sus datos: va directo
  // al calendario (?paso=agenda). El nombre y el email se aceptan por URL si
  // el formulario los pasa, pero no hacen falta.
  var q = new URLSearchParams(location.search);
  if (q.get('paso') === 'agenda') {
    datos.nombre = q.get('nombre') || q.get('first_name') || '';
    datos.email = q.get('email') || '';
    datos.telefono = q.get('telefono') || q.get('phone') || '';
    document.getElementById('p3-n').textContent = 'Ya tenemos tus datos';
    document.getElementById('p3-t').textContent = 'Solo falta la hora. Coge la que te venga bien.';
    document.getElementById('form-bajada').textContent = 'Ya nos has dejado tus datos. Elige la hora y antes de la llamada reviso tu web y lo que nos has contado.';
    calendario();
    [p1, p2, p4].forEach(function (x) { x.hidden = true; });
    p3.hidden = false;
    if (window.qvTrack) window.qvTrack('diagnostico_leadform_agenda', {});
  }

  function calendario() {
    var cal = document.getElementById('cal');
    if (cal.dataset.listo) return;
    var q = [
      'first_name=' + encodeURIComponent(datos.nombre || ''),
      'email=' + encodeURIComponent(datos.email || ''),
      'phone=' + encodeURIComponent(datos.telefono || '')
    ].join('&');
    var i = document.createElement('iframe');
    i.src = CALENDARIO + '?' + q;
    i.setAttribute('scrolling', 'no');
    i.title = 'Calendario para reservar el diagnóstico';
    cal.appendChild(i);
    cal.dataset.listo = '1';
  }
})();
