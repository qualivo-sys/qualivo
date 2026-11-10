/* Formulario de ejemplo: elige una opción por pregunta y, al enviar, muestra la prioridad A, B o C (no envía nada a ningún sitio). */
(function () {
  var fm = document.getElementById('fm'), form = fm.querySelector('form');
  [].forEach.call(form.querySelectorAll('.ch'), function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      [].forEach.call(g.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });
  function val(name) { var b = form.querySelector('.ch[data-q="' + name + '"] button[aria-pressed="true"]'); return b ? b.dataset.v : ''; }
  /* botones «Pedir cita en esta sede»: preseleccionan la sede y suben al formulario */
  [].forEach.call(document.querySelectorAll('[data-sede]'), function (b) {
    b.addEventListener('click', function () {
      var t = form.querySelector('.ch[data-q="sede"] button[data-v="' + b.dataset.sede + '"]'); if (t) t.click();
      fm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var cuando = val('cuando'), sede = val('sede'), rule = window.REGLA || function () { return 'B'; };
    var l = rule(val, cuando, sede);
    var why = { A: 'Llamada en el día y primera visita.', B: 'WhatsApp y seguimiento hasta que tenga fecha.', C: 'Información y aviso más adelante.' }[l];
    var s = fm.querySelector('.sc');
    s.innerHTML = '<b class="l ' + l + '">' + l + '</b><b>En la demo, esta petición entra como ' + l + (sede && sede !== 'Me da igual' ? ' · ' + sede : '') + '.</b><br>' + why + ' <span style="color:var(--mut)">(Nada se ha enviado: es una maqueta.)</span>';
    fm.classList.add('done');
    fm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
