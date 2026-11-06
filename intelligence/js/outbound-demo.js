/* Outbound en la demo (6-nov): pestaña «Outbound» con datos inventados, para enseñar en una
 * reunión cómo quedaría la prospección dentro del panel. Se activa con ?outbound=exterior
 * (publicidad exterior: caras, mupis, pantallas). Todas las cuentas y cifras son ficticias.
 * No se usa en el modo real. */
(function () {
  'use strict';
  const QV = window.QV;
  const esc = function (s) { return QV.esc(s); };
  const MODO = new URLSearchParams(location.search).get('outbound');
  if (MODO !== 'exterior') return;

  const css = document.createElement('style');
  css.textContent =
    '.ob-lineas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:14px}' +
    '.ob-lineas .tarjeta em{display:block;font-style:normal;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--verde-txt)}' +
    '.ob-lineas .tarjeta b{display:block;margin:2px 0}.ob-lineas .tarjeta span{color:var(--gris);font-size:12.5px}' +
    '.ob-kpis{grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:14px}' +
    '.ob-filtros{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}' +
    '.ob-fb{border:1px solid var(--borde);background:var(--superficie);border-radius:99px;padding:5px 11px;font-weight:600;font-size:12.5px;color:var(--tinta-2);cursor:pointer;font-family:inherit}' +
    '.ob-fb[aria-pressed="true"]{background:var(--verde-bg);color:var(--verde-txt);border-color:#CBE8E4}' +
    '.ob-fb em{font-style:normal;color:var(--gris-2);margin-left:4px}' +
    '.ob-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:14px;align-items:start}' +
    '.ob-lista{padding:0;overflow:hidden}' +
    '.ob-fila{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1.6fr) 70px minmax(0,1fr);gap:10px;align-items:center;width:100%;text-align:left;padding:10px 14px;border:0;border-bottom:1px solid var(--borde-2);background:none;font-family:inherit;font-size:13px;color:inherit;cursor:pointer}' +
    '.ob-fila:hover{background:var(--hover)}.ob-fila[aria-current="true"]{background:var(--verde-bg)}' +
    '.ob-fila>div{min-width:0}.ob-fila b{display:block}.ob-fila small{display:block;color:var(--gris);font-size:11.5px}' +
    '.ob-fila.bloq b{text-decoration:line-through;text-decoration-color:var(--gris-3)}' +
    '.ob-pr{display:inline-block;font-size:11px;font-weight:800;padding:1px 6px;border-radius:6px;margin-left:4px}' +
    '.ob-pr.A{background:var(--verde-bg);color:var(--verde-txt)}.ob-pr.B{background:var(--azul-bg);color:var(--azul)}.ob-pr.C{background:var(--hover);color:var(--gris)}' +
    '.ob-barra{height:5px;background:var(--borde-2);border-radius:99px;overflow:hidden;margin-top:4px}.ob-barra i{display:block;height:100%;background:var(--verde-2)}' +
    '.ob-est{display:inline-block;font-size:11px;font-weight:700;padding:3px 8px;border-radius:99px}' +
    '.ob-est.nuevo{background:var(--azul-bg);color:var(--azul)}.ob-est.revisar{background:var(--ambar-bg);color:var(--ambar)}' +
    '.ob-est.conv{background:var(--verde-bg);color:var(--verde-txt)}.ob-est.bloq{background:var(--coral-bg);color:var(--coral)}' +
    '.ob-ficha h2{font-size:17px;font-weight:800;letter-spacing:-.01em}.ob-ficha .sub{color:var(--gris);margin-top:2px;font-size:12.5px}' +
    '.ob-b{margin-top:14px}.ob-b h4{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--gris-2);margin:0 0 5px}' +
    '.ob-punt{display:grid;gap:5px}.ob-punt div{display:grid;grid-template-columns:minmax(0,1fr) 56px 40px;gap:8px;align-items:center;font-size:12px}' +
    '.ob-punt div span:last-child{text-align:right;font-weight:700}.ob-punt .ob-barra{margin-top:0}' +
    '.ob-msg{background:var(--fondo);border:1px solid var(--borde);border-radius:10px;padding:11px;white-space:pre-line;font-size:13px}' +
    '.ob-de{color:var(--gris);font-size:11.5px;margin-bottom:5px}' +
    '.ob-aviso{margin-top:12px;padding:9px 11px;border-radius:10px;background:var(--coral-bg);color:var(--coral);font-weight:600;font-size:12.5px}' +
    '.ob-seq{display:grid;gap:6px}.ob-paso{display:grid;grid-template-columns:72px minmax(0,1fr);gap:8px;border:1px solid var(--borde);border-radius:10px;padding:8px 10px;font-size:12.5px}' +
    '.ob-paso .dia{font-weight:800;color:var(--verde-txt);font-size:12px}.ob-paso .dia small{display:block;color:var(--gris);font-weight:600}.ob-paso p{color:var(--tinta-2);margin:2px 0 0}' +
    '.ob-acc{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}' +
    '.ob-camp{overflow-x:auto;margin-top:8px}.ob-camp>div{min-width:600px;display:grid;gap:5px}' +
    '.ob-camp>div>div{display:grid;grid-template-columns:2.4fr .8fr .8fr .8fr .8fr 1.3fr;gap:10px;padding:7px 10px;border-radius:8px;background:var(--fondo);font-size:12.5px}' +
    '.ob-camp>div>div.h{background:none;color:var(--gris-2);font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:11px}' +
    '.ob-camp .pend{color:var(--ambar);font-weight:700}' +
    '.ob-embudo{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:10px}' +
    '.ob-embudo div{border:1px solid var(--borde);border-radius:10px;padding:10px}.ob-embudo b{display:block;font-size:19px}.ob-embudo span{color:var(--gris);font-size:12px}' +
    '.ob-embudo div.fin{background:var(--verde-bg);border-color:#CBE8E4}' +
    '.ob-sec{margin-top:14px}' +
    '@media (max-width:1000px){.ob-grid{grid-template-columns:minmax(0,1fr)}.ob-lineas{grid-template-columns:minmax(0,1fr)}.ob-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.ob-embudo{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
    '@media (max-width:640px){.ob-fila{grid-template-columns:minmax(0,1fr) auto}.ob-fila .ob-sen{grid-column:1/-1;order:3}}';
  document.head.appendChild(css);

  // p = [encaje con exterior /25, señal /25, potencial /20, acceso /15, ventaja del inventario /10, datos /5]
  const CUENTAS = [
    { n: 'Calçats Ribera', d: 'Zapaterías · 9 tiendas · Lleida y Tarragona', lin: 'A', sen: 'Pidió precio', sd: 'Pidió mupis para las rebajas de enero de 2025 (18.400 €) y no compró', caras: '4 mupis y 1 pantalla digital a menos de 400 m de su tienda de la Rambla Ferran', p: [22, 23, 17, 12, 9, 4], est: 'revisar',
      quien: 'Gerente y responsable de marketing', com: 'Comercial de la sede de Lleida', paso: 'Correo del comercial con la ubicación de las caras y una propuesta para enero',
      msg: 'Hola, [nombre]. El año pasado nos pedisteis precio de mupis para las rebajas de enero. Este año tenemos 4 caras a menos de 400 m de vuestra tienda de la Rambla Ferran y una pantalla digital en la misma calle. ¿Os preparo una propuesta para enero con fotos de dónde iría vuestra campaña?' },
    { n: 'Moda Lluna', d: 'Boutiques · 6 tiendas · Girona y Costa Brava', lin: 'A', sen: 'Temporada', sd: 'Campaña de Navidad: pidieron precio en 2024 para diciembre', caras: '2 pantallas digitales en el eje comercial del centro de Girona', p: [23, 22, 14, 13, 8, 4], est: 'conv',
      quien: 'Propietaria', com: 'Comercial de la sede de Girona', paso: 'Briefing completado: el comercial prepara la propuesta para el 1 de diciembre',
      msg: '(En conversación: completó el briefing el martes. Zonas: centro de Girona y Figueres. Fechas: 1-24 de diciembre. Presupuesto: 3.000-5.000 €.)' },
    { n: 'Òptica Mirada Clara', d: 'Ópticas · 5 centros · Vallès', lin: 'A', sen: 'Apertura', sd: 'Abre un centro nuevo en Sabadell el 20 de noviembre', caras: '1 pantalla digital y 3 opis en la misma avenida del local nuevo', p: [21, 24, 13, 11, 9, 3], est: 'nuevo',
      quien: 'Dirección de marketing', com: 'Comercial de la sede de Barcelona', paso: 'Correo con la pantalla delante del local nuevo y fechas de inauguración',
      msg: 'Hola, [nombre]. Hemos visto que abrís en Sabadell el día 20. Tenemos una pantalla digital y tres opis en la misma avenida del local. ¿Os interesa anunciar la apertura las dos primeras semanas? Os paso fotos de las caras y disponibilidad.' },
    { n: 'Motor Garraf', d: 'Concesionario · 2 exposiciones · Garraf y Penedès', lin: 'A', sen: 'Lanzamiento', sd: 'Lanza un modelo eléctrico en enero; pidió precio de vallas en 2025', caras: '3 vallas en la C-32 y en el acceso a Vilanova', p: [20, 21, 18, 11, 6, 3], est: 'nuevo',
      quien: 'Gerente', com: 'Comercial de la sede de Barcelona', paso: 'Llamada del comercial y propuesta de vallas en carretera para el lanzamiento',
      msg: 'Hola, [nombre]. Hace un año nos pedisteis precio de vallas. Para el lanzamiento de enero tenemos tres caras en la C-32 y en el acceso a Vilanova, de camino a vuestra exposición. ¿Lo vemos en 10 minutos esta semana?' },
    { n: 'Escola Superior de Disseny Llum', d: 'Formación privada · Barcelona', lin: 'B', sen: 'Matrícula de enero', sd: 'Jornadas de puertas abiertas el 12 de diciembre', caras: '5 mupis a la salida de dos estaciones de metro cercanas', p: [21, 20, 14, 10, 8, 3], est: 'nuevo',
      quien: 'Responsable de admisiones', com: 'Comercial de la sede de Barcelona', paso: 'Correo en frío de la campaña de formación, cuando haya visto bueno legal',
      msg: '[Publicidad] Hola, [nombre]. Para vuestras jornadas del 12 de diciembre tenemos cinco mupis a la salida de las dos estaciones de metro más cercanas a la escuela. En formación, casi todas las campañas que funcionan se concentran en un solo barrio. ¿Os paso disponibilidad?' },
    { n: 'Grup Mediterrània Restauració', d: 'Restaurantes · 12 locales · Barcelona y Tarragona', lin: 'C', sen: 'Contratación', sd: 'Busca director de marketing: oferta publicada hace 6 días', caras: '6 opis y 2 pantallas cerca de 5 de sus locales', p: [19, 20, 17, 10, 7, 4], est: 'nuevo',
      quien: 'Dirección general (y el nuevo director de marketing cuando entre)', com: 'Comercial de la sede de Tarragona', paso: 'Conectar en LinkedIn con la dirección general, sin nota de venta',
      msg: '(Sin mensaje de venta todavía. Semana 1: conexión desde el perfil del comercial. Cuando acepte, una nota corta con las caras que tiene cerca de sus locales.)' },
    { n: 'Acadèmia d\'Idiomes Atlàntida', d: 'Academia de idiomas · Girona', lin: 'B', sen: 'Matrícula de enero', sd: 'Campaña de matrícula de enero; el año pasado anunció en prensa local', caras: '2 opis junto a la estación de tren', p: [18, 19, 9, 10, 7, 3], est: 'nuevo',
      quien: 'Directora', com: 'Comercial de la sede de Girona', paso: 'Correo en frío de la campaña de formación, cuando haya visto bueno legal',
      msg: '[Publicidad] Hola, [nombre]. Si este enero queréis llenar los grupos de adultos, tenemos dos opis junto a la estación de tren, a cinco minutos de la academia. ¿Os paso precio para las dos primeras semanas de enero?' },
    { n: 'Forma 24 Gimnasos', d: 'Gimnasios · 4 centros · Baix Llobregat', lin: 'B', sen: 'Apertura', sd: 'Abre dos centros en enero (licencias publicadas)', caras: '4 mupis a menos de 300 m de los dos locales', p: [19, 21, 12, 8, 7, 3], est: 'nuevo',
      quien: 'Socio fundador', com: 'Comercial de la sede de Barcelona', paso: 'Correo en frío con las caras cerca de los locales nuevos',
      msg: '[Publicidad] Hola, [nombre]. Hemos visto las licencias de vuestros dos centros nuevos. Enero es el mes en que más gente se apunta al gimnasio y tenemos cuatro mupis a menos de 300 m de los dos locales. ¿Os paso fotos y fechas?' },
    { n: 'Immobiliària Costa Daurada', d: 'Inmobiliaria · 3 oficinas · Tarragona', lin: 'A', sen: 'Pidió precio', sd: 'Pidió precio de autobús en 2025 y no contestó a la propuesta', caras: '2 líneas de bus que pasan por Salou y Cambrils', p: [16, 15, 11, 9, 6, 3], est: 'nuevo',
      quien: 'Gerente', com: 'Comercial de la sede de Tarragona', paso: 'Correo del comercial y llamada si no responde en 2 días',
      msg: 'Hola, [nombre]. El año pasado nos pedisteis precio para anunciaros en autobús. Esta primavera tenemos disponibles dos líneas que pasan por Salou y Cambrils. ¿Lo retomamos?' },
    { n: 'Clínica Dental Somriure', d: 'Clínicas dentales · 3 centros · Terrassa', lin: 'B', sen: 'Apertura', sd: 'Tercera clínica abierta hace 3 semanas', caras: '1 opi a 600 m de la clínica nueva', p: [14, 17, 10, 7, 4, 2], est: 'nuevo',
      quien: 'Directora médica', com: 'Comercial de la sede de Barcelona', paso: 'Enriquecer el contacto y nutrir: prioridad C',
      msg: '(Prioridad C: no se escribe todavía. Falta el decisor y solo hay una cara cerca.)' },
    { n: 'Fruiteries Can Vidal', d: 'Fruterías · 7 tiendas · Maresme', lin: 'A', sen: 'Pidió precio', sd: 'Pidió precio de mupis en 2024', caras: '3 mupis cerca de 4 de sus tiendas', p: [20, 18, 13, 12, 8, 4], est: 'bloq',
      bloqueo: 'Tiene baja de comunicaciones en el CRM: no se le escribe, dé igual la puntuación.' },
    { n: 'Plataforma Mitjans', d: 'Agencia de medios · Barcelona', lin: 'B', sen: 'Contratación', sd: 'Busca planificador de medios', caras: '—', p: [15, 16, 14, 10, 3, 3], est: 'bloq',
      bloqueo: 'Es una agencia: queda fuera del frío. Si ya trabaja con vosotros, la lleva su comercial.' }
  ];
  CUENTAS.forEach(function (c, i) { c.i = i; c.e = c.p.reduce(function (a, x) { return a + x; }, 0); c.pr = c.e >= 75 ? 'A' : (c.e >= 55 ? 'B' : 'C'); });
  const FACT = [['Encaje con exterior', 25], ['Señal actual', 25], ['Potencial', 20], ['Acceso al decisor', 15], ['Ventaja del inventario', 10], ['Calidad de los datos', 5]];
  const LIN = { A: 'A · Base propia', B: 'B · Frío', C: 'C · LinkedIn' };
  const EST = { nuevo: 'Nueva', revisar: 'Para revisar', conv: 'En conversación', bloq: 'Bloqueada' };
  const SEQ = {
    A: [['Día 0', 'Correo', 'Desde el buzón del comercial: qué pidieron, cuándo, y qué caras tienen hoy cerca de sus tiendas.'],
      ['Día 2', 'Llamada', 'El comercial llama con la ficha delante: señal, caras cerca e importe que pidieron.'],
      ['Día 5', 'Correo', 'Foto de la cara con una simulación de su marca y dos fechas posibles.'],
      ['Día 10', 'Correo', '¿Lo dejamos para la próxima temporada? Si dicen «ahora no», pasa a Pospuesta con fecha de recontacto.']],
    B: [['Día 0', 'Correo', '[Publicidad] Correo corto con la señal y las caras cercanas. Remitente identificado y baja en un clic.'],
      ['Día 3-4', 'Correo', 'Mismo hilo: cuándo compra su sector y en qué zona funciona.'],
      ['Día 8-10', 'Correo', 'Cierre amable. Si responde con interés, recibe el enlace del agente de briefing.']],
    C: [['Semana 1', 'LinkedIn', 'Conexión a mano desde el perfil del comercial, sin enlace ni catálogo.'],
      ['Tras aceptar', 'LinkedIn', 'Comentar algo suyo: una apertura, un nombramiento, una campaña.'],
      ['Día 7', 'LinkedIn', 'Una frase con las caras que tienen cerca y una pregunta. Si responde, pasa a briefing.']]
  };
  const ui = { lin: 'todas', pr: 'todas', sel: 0 };

  function filtradas() {
    return CUENTAS.filter(function (c) { return (ui.lin === 'todas' || c.lin === ui.lin) && (ui.pr === 'todas' || c.pr === ui.pr); })
      .sort(function (a, b) { return (a.est === 'bloq') - (b.est === 'bloq') || b.e - a.e; });
  }
  function boton(campo, v, txt, n) {
    return '<button type="button" class="ob-fb" data-obf="' + campo + '" data-obv="' + v + '" aria-pressed="' + (ui[campo] === v) + '">' + esc(txt) + '<em>' + n + '</em></button>';
  }
  function ficha(c) {
    if (!c) return '<div class="tarjeta ob-ficha"><p class="vacio">Elige una cuenta.</p></div>';
    const bloq = c.est === 'bloq';
    const punt = '<div class="ob-punt">' + FACT.map(function (f, k) {
      return '<div><span>' + esc(f[0]) + '</span><div class="ob-barra"><i style="width:' + Math.round(c.p[k] / f[1] * 100) + '%"></i></div><span>' + c.p[k] + '/' + f[1] + '</span></div>';
    }).join('') + '</div>';
    return '<div class="tarjeta ob-ficha"><h2>' + esc(c.n) + '</h2><p class="sub">' + esc(c.d) + ' · ' + esc(LIN[c.lin]) + ' · ' + c.e + ' puntos, prioridad ' + c.pr + '</p>' +
      (bloq ? '<p class="ob-aviso">' + esc(c.bloqueo) + '</p>' : '') +
      '<div class="ob-b"><h4>Por qué ahora</h4><p>' + esc(c.sd) + '</p></div>' +
      (c.caras !== '—' ? '<div class="ob-b"><h4>Vuestras caras cerca</h4><p>' + esc(c.caras) + '</p></div>' : '') +
      '<div class="ob-b"><h4>Puntuación</h4>' + punt + '</div>' +
      (bloq ? '' :
        '<div class="ob-b"><h4>A quién y quién lo lleva</h4><p>' + esc(c.quien) + '<br>' + esc(c.com) + '</p></div>' +
        '<div class="ob-b"><h4>Siguiente paso</h4><p>' + esc(c.paso) + '</p></div>' +
        '<div class="ob-b"><h4>Primer mensaje sugerido</h4><p class="ob-de">Sale del buzón del comercial, después de que lo revise</p><div class="ob-msg">' + esc(c.msg) + '</div></div>' +
        '<div class="ob-b"><h4>Secuencia · ' + esc(LIN[c.lin]) + '</h4><div class="ob-seq">' + SEQ[c.lin].map(function (x) {
          return '<div class="ob-paso"><div class="dia">' + esc(x[0]) + '<small>' + esc(x[1]) + '</small></div><p>' + esc(x[2]) + '</p></div>';
        }).join('') + '</div></div>' +
        '<div class="ob-acc"><button class="btn btn-mini btn-primario" type="button" data-obt="El comercial recibe el primer mensaje para revisarlo y enviarlo desde su buzón">Enviar al comercial</button>' +
        '<button class="btn btn-mini" type="button" data-obt="Se crea el lead en el CRM con la ficha, la señal y las caras cercanas">Crear lead en el CRM</button>' +
        '<button class="btn btn-mini" type="button" data-obt="Se adjunta la simulación de la campaña en sus caras cercanas">Simular campaña</button></div>') +
      '</div>';
  }
  function vista() {
    const empresa = QV.estado.cfg.nombreEmpresa || new URLSearchParams(location.search).get('empresa') || 'vuestra empresa';
    const lista = filtradas();
    if (!lista.some(function (c) { return c.i === ui.sel; }) && lista.length) ui.sel = lista[0].i;
    const cuenta = function (campo, v) { return CUENTAS.filter(function (c) { return c[campo] === v; }).length; };
    return QV.cabecera('Outbound', '¿A qué empresas deberíais escribir esta semana?', 'Cada cuenta llega con la señal que la hace interesante ahora, las caras de ' + esc(empresa) + ' que tiene cerca, su prioridad y el comercial de su sede. El mensaje lo revisa y lo envía el comercial desde su buzón. Datos de ejemplo.') +
      '<div class="ob-lineas">' +
        '<div class="tarjeta"><em>Línea A · la más fácil</em><b>Recuperar la base propia</b><span>Quien pidió precio y no compró. Ya está en el CRM y no necesita dominios nuevos.</span></div>' +
        '<div class="tarjeta"><em>Línea B</em><b>Correo en frío</b><span>Empresas nuevas, desde dominios propios calentados. Solo sale con el visto bueno legal.</span></div>' +
        '<div class="tarjeta"><em>Línea C · la más difícil</em><b>LinkedIn</b><span>Solo cuentas A, para llegar al decisor. A mano desde el perfil del comercial.</span></div></div>' +
      '<div class="kpis ob-kpis">' +
        '<div class="kpi"><span>Cuentas esta semana</span><strong>186</strong><em>en las tres líneas</em></div>' +
        '<div class="kpi"><span>Prioridad A</span><strong>27</strong><em>75 puntos o más</em></div>' +
        '<div class="kpi"><span>Con señal reciente</span><strong>64</strong><em>últimos 30 días</em></div>' +
        '<div class="kpi"><span>Bloqueadas</span><strong>11</strong><em class="mal">baja o exclusión</em></div></div>' +
      '<div class="ob-filtros">' + boton('lin', 'todas', 'Todas las líneas', CUENTAS.length) + ['A', 'B', 'C'].map(function (l) { return boton('lin', l, LIN[l], cuenta('lin', l)); }).join('') +
        boton('pr', 'todas', 'Toda prioridad', CUENTAS.length) + ['A', 'B', 'C'].map(function (p) { return boton('pr', p, 'Prioridad ' + p, cuenta('pr', p)); }).join('') + '</div>' +
      '<div class="ob-grid"><div class="tarjeta ob-lista">' + (lista.length ? lista.map(function (c) {
        return '<button type="button" class="ob-fila' + (c.est === 'bloq' ? ' bloq' : '') + '" data-obi="' + c.i + '" aria-current="' + (c.i === ui.sel) + '">' +
          '<div><b>' + esc(c.n) + '</b><small>' + esc(LIN[c.lin]) + ' · ' + esc(c.d.split(' · ')[0]) + '</small></div>' +
          '<div class="ob-sen">' + esc(c.sen) + '<small>' + esc(c.sd) + '</small></div>' +
          '<div><b>' + c.e + '<span class="ob-pr ' + c.pr + '">' + c.pr + '</span></b><div class="ob-barra"><i style="width:' + c.e + '%"></i></div></div>' +
          '<div><span class="ob-est ' + c.est + '">' + EST[c.est] + '</span></div></button>';
      }).join('') : '<p class="vacio" style="padding:20px">Ninguna cuenta con estos filtros.</p>') + '</div>' +
      ficha(CUENTAS[ui.sel]) + '</div>' +
      '<div class="tarjeta ob-sec"><h3>Campañas en marcha <span class="sub">Se paran solas cuando alguien responde</span></h3>' +
        '<p class="gris" style="margin-top:4px;font-size:12.5px">Quien responde con interés recibe el enlace del agente de briefing, que recoge zonas, fechas y presupuesto y se lo entrega al comercial en el CRM.</p>' +
        '<div class="ob-camp"><div>' +
          '<div class="h"><span>Campaña</span><span>En curso</span><span>Responden</span><span>Briefings</span><span>Aceptadas</span><span>Estado</span></div>' +
          '<div><span>A · Campaña gancho de pantallas · Retail</span><span>64</span><span>14 %</span><span>6</span><span>4</span><span>Enviando</span></div>' +
          '<div><span>A · Navidad · Moda y complementos</span><span>48</span><span>11 %</span><span>4</span><span>3</span><span>Enviando</span></div>' +
          '<div><span>A · Pidieron bus y no compraron</span><span>81</span><span>9 %</span><span>3</span><span>2</span><span>Enviando</span></div>' +
          '<div><span>B · Frío · Educación y formación</span><span>40</span><span>—</span><span>—</span><span>—</span><span class="pend">Espera visto bueno legal</span></div>' +
          '<div><span>C · LinkedIn · piloto con dos comerciales</span><span>18</span><span>17 %</span><span>2</span><span>1</span><span>Piloto</span></div>' +
        '</div></div></div>' +
      '<div class="tarjeta ob-sec"><h3>Del primer mensaje a la oportunidad aceptada <span class="sub">La métrica que manda</span></h3>' +
        '<div class="ob-embudo"><div><b>233</b><span>contactadas</span></div><div><b>27</b><span>responden con interés</span></div><div><b>15</b><span>completan el briefing</span></div><div><b>10</b><span>oportunidades aceptadas</span></div><div class="fin"><b>3</b><span>reservadas o ganadas</span></div></div>' +
        '<p class="gris" style="margin-top:10px;font-size:12px">Reglas fijas: las bajas y exclusiones (agencias, exclusivistas, mal pagador, negociación abierta) bloquean la cuenta aunque puntúe alto; si la cuenta tiene propietario en el CRM, se avisa a su comercial en lugar de escribirle; nada sale sin que lo revise una persona de la sede.</p></div>';
  }
  QV.VISTA_FN.outbound = vista;
  QV.navExtra = function (estado) {
    if (estado.cfg && estado.cfg.real) return [];
    return [{ id: 'outbound', txt: 'Outbound', ico: 'diana', tras: 'inteligencia' }];
  };

  document.addEventListener('click', function (e) {
    if (!QV.estado || QV.estado.vista !== 'outbound') return;
    const f = e.target.closest('[data-obf]');
    if (f) { ui[f.dataset.obf] = f.dataset.obv; QV.pintarVista(); return; }
    const r = e.target.closest('[data-obi]');
    if (r) { ui.sel = +r.dataset.obi; QV.pintarVista(); return; }
    const t = e.target.closest('[data-obt]');
    if (t) QV.aviso('Demo: ' + t.dataset.obt + '.', 'check');
  });
})();
