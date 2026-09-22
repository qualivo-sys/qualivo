// GTM · etiqueta HTML, disparador DOM Ready en todas las páginas.
// Copia las UTM del artículo al iframe del formulario alojado en otro dominio.
// Cambia DOMINIO por el del formulario (p. ej. 'eac-imanes.vercel.app').
<script>
(function () {
  try {
    var DOMINIO = 'eac-imanes.vercel.app';
    var q = new URLSearchParams(location.search);
    var keep = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','ttclid'];
    var out = [];
    keep.forEach(function (k) { var v = q.get(k); if (v) out.push(k + '=' + encodeURIComponent(v)); });

    // memoria de sesión: el lector puede navegar dos artículos antes de rellenar
    if (!out.length) { try { var s = sessionStorage.getItem('utm_guardadas'); if (s) out = s.split('&'); } catch (e) {} }
    else { try { sessionStorage.setItem('utm_guardadas', out.join('&')); } catch (e) {} }
    if (!out.length) return;

    var fr = document.querySelectorAll('iframe[src*="' + DOMINIO + '"]');
    for (var i = 0; i < fr.length; i++) {
      var src = fr[i].getAttribute('src');
      if (src.indexOf('utm_') > -1) continue;                    // no duplicar
      fr[i].setAttribute('src', src + (src.indexOf('?') > -1 ? '&' : '?') + out.join('&'));
    }
  } catch (e) {}
})();
</script>
