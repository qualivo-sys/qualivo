/* Iconos de trazo, 24×24. Sin dependencias. */
(function () {
  const P = {
    resumen: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    inteligencia: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    oportunidades: '<path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="16" r="3"/>',
    conversaciones: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z"/>',
    recorrido: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h7a3 3 0 0 1 0 6H10a3 3 0 0 0 0 6h7"/>',
    senales: '<path d="M2 12h4l3-8 6 16 3-8h4"/>',
    agentes: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
    play: '<path d="M7 4.5v15l12-7.5-12-7.5Z"/>',
    pausa: '<path d="M8 5v14M16 5v14"/>',
    reinicio: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v5h5"/>',
    enviar: '<path d="M4 12h14M13 6l6 6-6 6"/>',
    cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
    chat: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    nueva: '<path d="M12 3v18M3 12h18"/>',
    diana: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    ciclo: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
    alerta: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
    sube: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    whatsapp: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2L9 9.5Z"/>',
    voz: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    correo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    persona: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    auto: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    ojo: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    formulario: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    anuncio: '<path d="M3 10v4h4l6 4V6L7 10H3Z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    flecha: '<path d="M9 6l6 6-6 6"/>',
    formacion: '<path d="M2 9 12 4l10 5-10 5L2 9Z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    clinica: '<path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11Z"/><path d="M12 9v5M9.5 11.5h5"/>',
    saas: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    b2b: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    inmobiliaria: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    reformas: '<path d="M14 6a4 4 0 0 0 5 5l-9 9-3-3 9-9"/><path d="M3 21l3-3"/>',
    otro: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'
  };
  window.QV = window.QV || {};
  window.QV.ico = function (n, cls) {
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || P.otro) + '</svg>';
  };
})();
