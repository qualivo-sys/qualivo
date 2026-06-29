/**
 * SeedData.gs
 * Carga en la caché los datos actuales de la hoja de referencia (abril, mayo y
 * junio 2026) para poder ver el dashboard funcionando sin credenciales.
 * Útil como demo / fallback. Al refrescar con APIs, estos valores se sustituyen.
 *
 * Menú: "EAC Dashboard → (datos de ejemplo)" — ver loadSeedData().
 */
function loadSeedData() {
  cachePut('2026-06', seedJunio());
  cachePut('2026-05', seedMayo());
  cachePut('2026-04', seedAbril());
  renderAll('2026-06');
  toast('Datos de ejemplo cargados (abril–junio 2026)');
}

/** Helper para construir el bloque CRM normalizado de la demo. */
function seedCrm(source, totalCreated, stageObj, statusList, sourceList, enrollment, leads) {
  var crm = emptyCrm(source);
  crm.totalCreated = totalCreated;
  // Asegura todas las etapas canónicas presentes.
  var byStage = {};
  PIPELINE_STAGES.forEach(function (s) { byStage[s] = (stageObj && stageObj[s]) || 0; });
  crm.byStage = byStage;
  crm.byStatus = withPercentages((statusList || []).map(function (r) {
    return { key: r[0], count: r[1] };
  }), totalCreated);
  crm.bySource = withPercentages((sourceList || []).map(function (r) {
    return { key: r[0], count: r[1] };
  }), totalCreated);
  crm.enrollment = enrollment;
  crm.leads = leads || [];
  return crm;
}

function plat(name, spend, impressions, clicks, leads, campaigns) {
  return { platform: name, spend: spend, impressions: impressions, clicks: clicks, leads: leads, campaigns: campaigns || [], error: null };
}
function camp(name, spend, impressions, clicks, leads) {
  return { name: name, spend: spend, impressions: impressions, clicks: clicks, leads: leads };
}

/* ------------------------------- JUNIO -------------------------------- */
function seedJunio() {
  var meta = plat('Meta', 1731.99, 528854, 5016, 393, [
    camp('[AD] Clientes Potenciales (Intereses)', 779.5, 326779, 3405, 299),
    camp('EAC_TCP_IMG_CUALIFICADO_May11', 418.85, 94562, 534, 29),
    camp('EAC_DESPACHADOR_DCO_LANDING_Jun26', 203.8, 31384, 410, 22),
    camp('EAC_AZAFATA_TIERRA_DCO_LANDING_Jun26', 203.14, 49307, 494, 30),
    camp('EAC_TCP_DCO_LEADFORM_May26', 126.69, 26822, 173, 13)
  ]);
  var google = plat('Google', 476.98, 1379, 159, 25, [
    camp('CURSO_TCP_CAT', 476.98, 1379, 159, 25)
  ]);
  var tiktok = plat('TikTok', 170.75, 79130, 210, 7, [
    camp('TikTok (manual cliente)', 170.75, 79130, 210, 7)
  ]);

  var crm = seedCrm('GHL', 465,
    { 'Nuevo Lead': 57, 'Llamados': 75, 'Cita Programada': 7, 'Entrevistado': 35, 'Negociación': 0, 'Más adelante': 28, 'Plantón': 33, 'No localizado': 102 },
    [['Nuevo Lead', 57], ['Llamados', 75], ['Cita Programada', 7], ['Entrevistado', 35], ['Negociación', 0], ['Más adelante', 28], ['Plantón', 33], ['No localizado', 102], ['Won / Matriculadas', 5], ['Lost', 75], ['Abandoned', 42]],
    [],
    { won: 5, wonPrevMonth: 8, interviewed: 43, openActive: 343, lost: 75, abandoned: 42, contractValue: 4400, revenue: 22000 },
    [
      { date: '2026-06-09', name: 'Alan Sierra Garcia', email: 'alannn.alansito12@gmail.com', phone: '0763535304', source: 'ORGANIC_SEARCH', url: 'https://escolaeronauticadecatalunya.cat/curso-auxiliar-vuelo/', status: '(sin status)' },
      { date: '2026-06-09', name: 'Marina', email: 'marina.alvarado.ruano@gmail.com', phone: '+34654069060', source: 'DIRECT_TRAFFIC', url: 'https://escolaeronauticadecatalunya.cat/contacto/', status: '(sin status)' },
      { date: '2026-06-09', name: 'Rebeca', email: 'geronimorebeca73@gmail.com', phone: '8097816586', source: 'DIRECT_TRAFFIC', url: 'https://escolaeronauticadecatalunya.cat/contacto/', status: '(sin status)' },
      { date: '2026-06-08', name: 'Anayeli', email: 'anayeliantoniogomez@gmail.com', phone: '7411197020', source: 'DIRECT_TRAFFIC', url: 'https://escolaeronauticadecatalunya.cat/contacto/', status: '(sin status)' },
      { date: '2026-06-02', name: 'Berta', email: 'bertarcrespo@gmail.com', phone: '640144541', source: 'DIRECT_TRAFFIC', url: 'https://escolaeronauticadecatalunya.cat/contacto/', status: '(sin status)' },
      { date: '2026-06-01', name: 'Shoaib', email: 'shoaibakhtarsp@gmail.com', phone: '+34643212034', source: 'DIRECT_TRAFFIC', url: 'https://escolaeronauticadecatalunya.cat/contacto/', status: '(sin status)' },
      { date: '2026-06-01', name: 'Nicole Benitez', email: 'nicolebenitez055@gmail.com', phone: '+34672457338', source: 'SOCIAL_MEDIA', url: 'https://escolaeronauticadecatalunya.cat/', status: '(sin status)' }
    ]
  );

  return buildMonthlyDataset('2026-06', [meta, google, tiktok], crm);
}

/* -------------------------------- MAYO -------------------------------- */
function seedMayo() {
  var meta = plat('Meta', 1868.87, 554333, 3526, 172, [
    camp('[AD] Clientes Potenciales (Intereses)', 661.54, 234797, 1440, 148),
    camp('[AD] Landing (Intereses)', 423.09, 104340, 744, 15),
    camp('EAC_TCP_IMG_CUALIFICADO_May11', 391.33, 108559, 593, 28),
    camp('EAC_TCP_DCO_LEADFORM_May26', 215.33, 61185, 274, 16),
    camp('EAC_TCP_REELS_18-30_May26', 167.09, 36387, 463, 6),
    camp('[AD] Alcance Audiencias', 5.29, 8680, 11, 0),
    camp('EAC_RMK_VISITANTES_30D_May26', 3.82, 151, 1, 0),
    camp('[AD] Clientes Potenciales (Intereses) - Neww', 1.38, 234, 0, 0)
  ]);
  var google = plat('Google', 1442.1, 15272, 889, 55, [
    camp('CURSO_TCP_CAT', 1023.34, 4048, 381, 42),
    camp('EAC - VUELO - ES', 329.33, 9007, 418, 11.7),
    camp('[AD] PM', 89.43, 2217, 90, 2.7)
  ]);
  var tiktok = plat('TikTok', 615.88, 362081, 977, 58, [
    camp('TikTok (manual cliente)', 615.88, 362081, 977, 58)
  ]);

  var crm = seedCrm('GHL', 172,
    { 'Nuevo Lead': 0, 'Llamados': 26, 'Cita Programada': 9, 'Entrevistado': 6, 'Negociación': 2, 'Más adelante': 4, 'Plantón': 13, 'No localizado': 41 },
    [['MATRICULADO', 2], ['Entrevistado', 11], ['Cita Programada', 11], ['Llamados', 24], ['Negociación', 0], ['Más adelante', 21], ['Plantón', 13], ['No localizado', 27], ['Descartado', 37], ['No cumple requisitos', 2], ['(sin status)', 152]],
    [['PAID_SOCIAL', 183], ['DIRECT_TRAFFIC', 47], ['PAID_SEARCH', 37], ['OFFLINE', 16], ['ORGANIC_SEARCH', 9], ['SOCIAL_MEDIA', 6], ['AI_REFERRALS', 1], ['REFERRALS', 1]],
    { won: 8, wonPrevMonth: 4, interviewed: 6, openActive: 104, lost: 53, abandoned: 12, contractValue: 35200, revenue: 35200 },
    []
  );

  return buildMonthlyDataset('2026-05', [meta, google, tiktok], crm);
}

/* ------------------------------- ABRIL -------------------------------- */
function seedAbril() {
  var meta = plat('Meta', 962.35, 263327, 2190, 116, [
    camp('[AD] Landing (Intereses)', 806.02, 204121, 1709, 42),
    camp('[AD] Clientes Potenciales (Intereses)', 156.32, 59206, 481, 74)
  ]);
  var google = plat('Google', 2332.83, 18152, 1272, 78, [
    camp('CURSO_TCP_CAT', 1758.07, 6633, 636, 44.9),
    camp('EAC - VUELO - ES', 574.75, 11519, 636, 32.9)
  ]);
  var tiktok = plat('TikTok', 674.55, 424116, 936, 50, [
    camp('TikTok (manual cliente)', 674.55, 424116, 936, 50)
  ]);

  var crm = seedCrm('HubSpot', 284,
    { 'Nuevo Lead': 0, 'Llamados': 0, 'Cita Programada': 1, 'Entrevistado': 30, 'Negociación': 0, 'Más adelante': 50, 'Plantón': 25, 'No localizado': 66 },
    [['MATRICULADO', 6], ['Entrevistado', 30], ['Cita Programada', 1], ['Llamados', 0], ['Negociación', 0], ['Más adelante', 50], ['Plantón', 25], ['No localizado', 66], ['Descartado', 97], ['No cumple requisitos', 7], ['(sin status)', 2]],
    [['PAID_SOCIAL', 106], ['OFFLINE', 62], ['PAID_SEARCH', 55], ['DIRECT_TRAFFIC', 54], ['SOCIAL_MEDIA', 4], ['ORGANIC_SEARCH', 3]],
    { won: 6, wonPrevMonth: 0, interviewed: 30, openActive: 172, lost: 97, abandoned: 0, contractValue: 26400, revenue: 26400 },
    []
  );

  return buildMonthlyDataset('2026-04', [meta, google, tiktok], crm);
}
