/* Sector: Marketplace de jornadas de caza (monterías, recechos, esperas, caza menor).
 * Un marketplace que cobra comisión al organizador por cada reserva (con señal) y
 * tiene comerciales que asesoran al cazador. Entra mucho contacto desde los anuncios
 * y la web; se pierde por «más adelante», por «no coge el teléfono» y por contactos
 * sin contexto. Las campañas son anuncios de Meta, la captura de la web («avísame»),
 * el WhatsApp del asesor y la reactivación por temporada de los «más adelante».
 * Todos los nombres, fincas, casos e importes son inventados. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const hr = Q.hueco(12);

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.caza = {
    id: 'caza',
    nombre: 'Marketplace de caza',
    t: {
      contacto: 'cazador', contactos: 'cazadores', Contactos: 'Cazadores', Contacto: 'Cazador',
      venta: 'reserva', ventas: 'reservas', Ventas: 'Reservas', producto: 'cacería', Producto: 'Cacería',
      paginaVisitas: 'la ficha de la cacería', txtPrecio: 'ha mirado el precio del puesto', cita: 'llamada con el comercial', Cita: 'Llamada con el comercial', laCita: 'la llamada con el comercial',
      propuesta: 'la cacería recomendada', Propuesta: 'Cacería recomendada', comercial: 'el comercial', Comercial: 'Comercial',
      cliente: 'cazador', unCliente: 'un cazador', clientes: 'cazadores', convierten: 'reservan',
      objetivoPaso: 'dejarle agendada la llamada con el comercial y la cacería que encaja', casoExito: 'la opinión de un cazador que fue a esa finca', valorAlto: 400,
      oportunidades: 'cazadores', atencion: 'cazadores que requieren atención', laVenta: 'la reserva',
      verbo: 'reservar', clientesReales: 'reservas con señal', pasoHumano: 'hablar con el comercial y cerrar la reserva',
      nombreAgenteVoz: 'Álvaro',
      senales: { nueva: 'Aviso nuevo', noshow: 'No cogió la llamada del comercial', revision: 'Le toca su temporada' },
      anunciosIntro: 'Cada fila es una fuente: los anuncios de Meta (recechos por especie, calendario de monterías, Club Prime), la captura dentro de la web («avísame cuando salga»), el WhatsApp del asesor y los «más adelante» reactivados antes de su temporada. El sistema une cada fuente con lo que pasa después: quién contesta, quién habla con el comercial y quién reserva con señal.'
    },
    // Fuente → Deja sus datos → Contestado → Cacería recomendada → Llamada con el comercial → Reserva con señal → Repite temporada
    recorrido: [
      { id: 'anuncio', txt: 'Fuente', sinFuga: true },
      { id: 'info', txt: 'Deja sus datos' },
      { id: 'contactado', txt: 'Contestado' },
      { id: 'cualificado', txt: 'Cacería recomendada' },
      { id: 'cita', txt: 'Llamada con el comercial' },
      { id: 'alta', txt: 'Reserva con señal' },
      { id: 'fiel', txt: 'Repite temporada', sinFuga: true }
    ],
    ventaEtapa: 'alta',
    ticket: 90,
    referencia: { contactado: 0.95, cualificado: 0.75, cita: 0.6, alta: 0.55 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'avisos y WhatsApp del asesor que se contestan horas después, cuando el cazador ya ha mirado otra web' },
      cualificado: { txt: 'Recomendación', exp: 'conversaciones que no pasan de «¿qué tenéis en diciembre?» porque nadie le propone una cacería concreta' },
      cita: { txt: 'Llamada', exp: 'cazadores con interés a los que el comercial llama sin hora pactada y no cogen el teléfono' },
      alta: { txt: 'Reserva', exp: 'cazadores que hablaron con el comercial y se quedan en «me lo pienso» sin seguimiento' }
    },
    mesDatos: { respuestaAntes: 420, respuestaAhora: 1, agendadas: 160 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Recechos por especie · ciervo, gamo, arruí, corzo', inversion: 1800, ticket: 450,
        embudo: { anuncio: 52000, info: 210, contactado: 200, cualificado: 120, cita: 64, alta: 22, fiel: 6 } },
      { id: 'c2', canal: 'Meta', nombre: 'Calendario de monterías · temporada 26-27', inversion: 1500, ticket: 55,
        embudo: { anuncio: 61000, info: 380, contactado: 362, cualificado: 210, cita: 70, alta: 58, fiel: 14 } },
      { id: 'c3', canal: 'Meta', nombre: 'Club Prime · ahorra en tu próxima jornada', inversion: 900, ticket: 70,
        embudo: { anuncio: 34000, info: 150, contactado: 141, cualificado: 80, cita: 22, alta: 19, fiel: 9 } },
      { id: 'c4', canal: 'Web', nombre: '«Avísame cuando salga» · alertas por especie, zona y presupuesto', inversion: 0, ticket: 90,
        embudo: { anuncio: 9800, info: 260, contactado: 255, cualificado: 150, cita: 52, alta: 31, fiel: 11 } },
      { id: 'c5', canal: 'WhatsApp', nombre: 'WhatsApp del asesor · atendido al minuto', inversion: 0, ticket: 120,
        embudo: { anuncio: 640, info: 310, contactado: 305, cualificado: 190, cita: 88, alta: 41, fiel: 12 } },
      { id: 'c6', canal: 'Base de datos', nombre: '«Más adelante» · reactivación antes de su temporada', inversion: 0, ticket: 140,
        embudo: { anuncio: 1400, info: 180, contactado: 172, cualificado: 110, cita: 46, alta: 27, fiel: 12 } }
    ],
    kpis: ['interesados', 'respuesta', 'cualificados', 'entrevistas', 'ventas', 'ingresos'],
    kpiNombres: { interesados: 'Cazadores que dejan datos', cualificados: 'Con cacería recomendada', entrevistas: 'Llamadas con comercial', ventas: 'Reservas con señal', ingresos: 'Comisión generada' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'cita' },
    agenda: { horas: [9, 21], pausa: [14, 16], ocupacion: 0.5, etapa: 'cita',
      tipos: ['Llamada con el comercial · montería', 'Llamada con el comercial · rececho', 'Llamada · grupo de cazadores', 'Llamada · internacional', 'Llamada · dudas de la reserva'] },
    historiaGenerica: false,

    reglas: {
      fitBase: 20,
      fit: [
        [function (c) { return !!c.f.temaClaro; }, 14, function (c) { return 'sabe qué busca: ' + c.f.temaTxt; }, 'Modalidad y especie claras'],
        [function (c) { return !!c.f.fechas; }, 18, function (c) { return 'quiere cazar ' + c.f.fechas; }, 'Esta temporada'],
        [function (c) { return !!c.f.presupuesto; }, 12, function (c) { return 'presupuesto de ' + c.f.presupuesto; }, 'Presupuesto dicho'],
        [function (c) { return !!c.f.grupo; }, 8, function (c) { return 'van ' + c.f.grupo; }, 'Grupo'],
        [function (c) { return !!c.f.yaViajo; }, 16, 'ya ha reservado antes en Hunty', 'Ya reservó'],
        [function (c) { return !!c.f.trofeo; }, 10, 'busca trofeo (ticket alto)', 'Trofeo'],
        [function (c) { return !!c.f.soloInfo; }, -22, 'solo estaba mirando', 'Solo mirando'],
        [function (c) { return !!c.f.curioso; }, -16, 'pregunta por precios muy por debajo del mercado']
      ],
      intencion: [
        [function (c) { return c.s.incluye; }, 10, 'preguntó qué incluye el puesto'],
        [function (c) { return c.s.fechas; }, 12, 'preguntó por una fecha concreta'],
        [function (c) { return c.s.plaza; }, 14, 'pidió que le llamara el comercial']
      ]
    },

    nba: function (c, k, x, T, M) {
      if (c.s.caduca && !c.fin) return { id: 'caduca', accion: 'Recordar la señal antes de que se libere el puesto', quien: 'Agente de reservas', tipo: 'agente', estado: 'listo', por: 'Tiene el puesto apalabrado en «' + c.prod + '» y se libera ' + c.s.caduca + '. Un mensaje con el enlace de la señal y lo que incluye lo cierra sin que el comercial tenga que llamar.' };
      return M.nbaGenerica(c, k, x, T);
    },
    vozDijo: function (c) { return c.f.temaTxt ? ['Busca: ' + c.f.temaTxt] : []; },
    vozMotivo: function (c) { return 'Pidió aviso de ' + (c.f.temaTxt || c.prod.toLowerCase()) + '.'; },

    preguntas: [
      { q: '¿Qué cazadores de esta temporada no han hablado aún con un comercial?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.f.fechas && c.etapa <= 3; }, orden: 'prob',
        intro: function (l) { return l.length + ' cazadores quieren cazar esta temporada y todavía no tienen la llamada con el comercial. Son los primeros de la lista del daily.'; },
        vista: 'tabla' },
      { q: '¿A qué «más adelante» les toca su temporada?', h: 'lista', obj: ['retencion', 'expansion', 'todo'],
        filtro: function (c) { return c.s.revision || c.s.luego || c.orig === 'c6'; }, orden: 'prob',
        intro: function (l) { return l.length + ' cazadores dijeron «más adelante» y su temporada abre ahora. Se les escribe con cacerías concretas antes de que miren otra web.'; },
        vista: 'tabla' },
      { q: '¿Quién no cogió la llamada del comercial?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && (c.s.noshow || c.s.caduca); }, orden: 'prob',
        intro: function (l) { return l.length + ' cazadores no cogieron o tienen el puesto a punto de liberarse. El agente les propone otra hora por WhatsApp.'; },
        vista: 'tabla' },
      { q: '¿Qué anuncio trae reservas y no solo contactos?', h: 'lista', obj: ['captacion', 'todo'],
        filtro: function (c) { return c.fin === 'ganado'; }, orden: 'prob',
        intro: function (l) { return l.length + ' reservas este mes. Cada una lleva el anuncio o la fuente de la que vino, para medir coste por reserva y por euro de comisión.'; },
        vista: 'tabla' }
    ],

    historias: {
      aviso: {
        titulo: 'Pide aviso de monterías a las 19:20 y a las 19:32 ya tiene la llamada con el comercial agendada',
        contacto: { id: 'demo', n: 'Javier Moreno', rol: '«Avísame» · montería · Extremadura y Castilla-La Mancha', seg: 'cazador', ciudad: 'Madrid', prod: 'Montería en Río Frío (Toledo) · 26 de diciembre', orig: 'c4', canal: 'wa', etapa: 1, valor: 90, creado: 0, act: 0, f: { temaClaro: true, temaTxt: 'montería de ciervo y jabalí' }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Martes 19:20: un cazador pide aviso de monterías desde el calendario de la web', feed: '«Avísame» · montería · Extremadura y Castilla-La Mancha', cambio: {} },
          { dur: 6, min: 1, txt: 'El formulario de cuatro toques deja la ficha hecha: diciembre o enero, dos cazadores, 250-400 € por puesto', feed: 'Ficha completa · esta temporada · 2 cazadores · 250-400 €', cambio: { f: { fechas: 'en diciembre o enero', presupuesto: '250-400 € por puesto', grupo: 'dos cazadores' } } },
          { dur: 7, min: 1, txt: 'WhatsApp en el minuto uno con dos cacerías publicadas que encajan', feed: 'WhatsApp enviado en 40 segundos', toque: true, cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Javier, soy Álvaro, de Hunty. Para dos cazadores en diciembre o enero y 250-400 € por puesto, te encajan estas dos: Río Frío (Toledo), 26 de diciembre, y Valmorisco (Cáceres), 9 de enero. ¿Te cuento cómo es cada una?'] } },
          { dur: 6, min: 8, txt: 'No contesta: a los 10 minutos le llama el agente de voz (solo porque dejó su teléfono y es «ahora»)', feed: 'Llamada de Álvaro · 1 min 5 s', toque: true, cambio: { etapa: 3, s: { incluye: true } } },
          { dur: 7, min: 2, txt: 'Confirma los datos, cuenta que nunca ha cazado con organizador y elige hora para el comercial', feed: 'Llamada con el comercial · mañana 19:30', act: true, cambio: { etapa: 4, s: { plaza: true, cita: hr.min, citaOk: true }, conv: ['c', 'tel', 'Con una sociedad de mi pueblo, nunca con organizador. Mejor mañana a las siete y media.'] } },
          { dur: 6, min: 1, txt: 'Al comercial le llega la ficha: qué busca, presupuesto, experiencia, cacerías vistas y la grabación', feed: 'Ficha enviada al comercial · prioridad alta', toque: true, cambio: { conv: ['a', 'wa', 'Hecho, Javier: mañana a las 19:30 te llama Pablo, del equipo de Hunty. Te aviso un rato antes. Si te surge algo, contesta aquí y lo movemos.'] } },
          { dur: 0, min: 1, txt: 'Resumen para el daily: del aviso a la llamada agendada en 12 minutos, sin que nadie escribiera a mano', feed: 'Resumen para el comercial', humano: { titulo: 'Javier: llamada mañana a las 19:30', texto: 'Pidió aviso de montería (Extremadura y Castilla-La Mancha). Dos cazadores, diciembre o enero, 250-400 € por puesto («si es muy buena podemos subir»). Nunca ha cazado con organizador: explicarle sorteo de puestos, qué incluye y cómo funciona la señal. Le encajan Río Frío (26-dic) y Valmorisco (9-ene).' } }
        ]
      },
      temporada: {
        titulo: 'Dijo «más adelante» en abril y en septiembre el sistema le escribe con el rececho que encaja',
        contacto: { id: 'demo', n: 'Ignacio Rubio', rol: '«Más adelante» · rececho de corzo · abril', seg: 'cazador', ciudad: 'Burgos', prod: 'Rececho de corzo · Soria · mayo', orig: 'c6', canal: 'wa', etapa: 1, valor: 450, creado: 0, act: 0, f: { temaClaro: true, temaTxt: 'rececho de corzo', trofeo: true }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'En abril preguntó por un rececho de corzo y dijo «el año que viene, en mayo»', feed: 'Base de datos · «más adelante» · temporada: mayo', cambio: {} },
          { dur: 6, min: 1, txt: 'Cuando se publican los recechos de la temporada, el sistema cruza lo que pidió con lo que hay', feed: 'Encaja · rececho de corzo en Soria · 3 plazas', cambio: { f: { fechas: 'en mayo' } } },
          { dur: 7, min: 1, txt: 'Le escribe por WhatsApp con la cacería concreta, no con una newsletter', feed: 'WhatsApp enviado · reactivación por temporada', toque: true, cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Ignacio, soy Álvaro, de Hunty. En abril me dijiste que el corzo lo dejabas para mayo. Ya está publicado un rececho en Soria para la primera semana de mayo, con guía y 3 plazas. ¿Te paso la ficha?'] } },
          { dur: 6, min: 20, txt: 'Contesta y pregunta por el trofeo y el precio', feed: 'Respuesta recibida · pregunta por el trofeo', act: true, cambio: { etapa: 3, s: { incluye: true, precio: true }, conv: ['c', 'wa', 'Sí, pásamela. ¿Qué medallas salen ahí y qué incluye el precio?'] } },
          { dur: 7, min: 2, txt: 'Le propone hablar con el comercial especialista en recechos a la hora que elija', feed: 'Llamada con el comercial · jueves 13:00', act: true, cambio: { etapa: 4, s: { plaza: true, cita: hr.min, citaOk: true }, conv: ['a', 'wa', 'Te la mando. Lo de las medallas te lo cuenta mejor Luis, que lleva los recechos de Soria. ¿Te llama el jueves a las 13:00 o a las 19:00?'] } }
        ]
      }
    },
    historiaDefecto: 'aviso',

    contactos: [
      { id: 'h01', n: 'Carlos Peña', rol: 'Calendario de monterías · diciembre', seg: 'cazador', ciudad: 'Sevilla', prod: 'Montería en Sierra Morena · 12 de diciembre', orig: 'c2', canal: 'wa', etapa: 3, valor: 55, creado: 20 * H, act: 40, toque: 19 * H,
        f: { temaClaro: true, temaTxt: 'montería de ciervo y jabalí', fechas: 'en diciembre', grupo: 'tres cazadores' }, s: { precio: true, incluye: true, visitas: 3 },
        conv: [[20 * H - 1, 'a', 'wa', 'Hola Carlos, para tres cazadores en diciembre te encaja la de Sierra Morena del día 12. ¿Te cuento cómo es el sorteo de puestos?'], [19 * H, 'c', 'wa', 'Sí. ¿Los tres puestos pueden ir juntos?'], [40, 'c', 'wa', '¿Y la señal se devuelve si se suspende?']] },
      { id: 'h02', n: 'Miguel Ángel Ruiz', rol: 'Rececho de arruí · trofeo', seg: 'cazador', ciudad: 'Murcia', prod: 'Rececho de arruí macho · Murcia', orig: 'c1', canal: 'wa', etapa: 4, valor: 450, creado: 3 * D, act: 30 * H, toque: 30 * H,
        f: { temaClaro: true, temaTxt: 'rececho de arruí', fechas: 'en noviembre', presupuesto: '3.000-4.000 €', trofeo: true }, s: { plaza: true, cita: 14 * H, citaOk: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Miguel Ángel, te paso el rececho de arruí de noviembre. Mañana te llama Luis a las 13:00.'], [30 * H, 'c', 'wa', 'Perfecto, ahí estaré.']] },
      { id: 'h03', n: 'Fernando Gil', rol: 'Reservó la temporada pasada', seg: 'cazador', ciudad: 'Valladolid', prod: 'Montería en Ciudad Real · enero', orig: 'c6', canal: 'wa', etapa: 2, valor: 55, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { temaClaro: true, temaTxt: 'montería', yaViajo: true, grupo: 'cuatro cazadores' }, s: { revision: true, revisionTxt: 'Reservó montería en enero pasado · la temporada abre ahora' },
        conv: [[3 * D, 'a', 'wa', 'Hola Fernando, el año pasado fuisteis cuatro a Ciudad Real en enero. Ya están las monterías de esta temporada en esa zona.'], [2 * D, 'c', 'wa', 'Buenas. Pásame fechas de enero.']] },
      { id: 'h04', n: 'Raúl Navarro', rol: 'Puesto apalabrado · señal pendiente', seg: 'cazador', ciudad: 'Toledo', prod: 'Montería en Los Yébenes · 28 de noviembre', orig: 'c2', canal: 'wa', etapa: 4, valor: 55, creado: 3 * D, act: 30 * H, toque: 30 * H,
        f: { temaClaro: true, temaTxt: 'montería', fechas: 'en noviembre', presupuesto: '350 €' }, s: { plaza: true, cita: 14 * H, citaOk: true, caduca: 'mañana a las 12:00' },
        conv: [[3 * D, 'a', 'wa', 'Hola Raúl, te dejo apalabrado el puesto de Los Yébenes hasta mañana a las 12:00.'], [30 * H, 'c', 'wa', 'Vale, pago la señal esta noche.']] },
      { id: 'h05', n: 'Pedro Sanz', rol: 'Regalo para su padre', seg: 'cazador', ciudad: 'Madrid', prod: 'Espera de jabalí · Guadalajara', orig: 'c5', canal: 'wa', etapa: 3, valor: 30, creado: 2 * D, act: 26 * H, toque: 26 * H,
        f: { temaClaro: true, temaTxt: 'espera de jabalí para regalar' }, s: { incluye: true },
        conv: [[2 * D, 'a', 'wa', 'Hola Pedro, para regalar una espera lo más sencillo es el bono: tu padre elige fecha. ¿Te cuento?'], [26 * H, 'c', 'wa', '¿Se puede elegir finca después?']] },
      { id: 'h06', n: 'Antonio López', rol: 'Pregunta por monterías a 100 €', seg: 'cazador', ciudad: 'Jaén', prod: 'Montería', orig: 'c3', canal: 'wa', etapa: 2, valor: 55, creado: 5 * D, act: 5 * D, toque: 4 * D,
        f: { curioso: true }, s: { intentos: 2 }, conv: [[5 * D, 'a', 'wa', 'Hola Antonio, ¿buscas fecha concreta o estás mirando?'], [5 * D - 10, 'c', 'wa', '¿Tenéis algo por 100 €?']] },
      { id: 'h07', n: 'Luis Herrero', rol: 'No cogió la llamada del comercial', seg: 'cazador', ciudad: 'Cáceres', prod: 'Rececho de ciervo en berrea · próxima temporada', orig: 'c1', canal: 'wa', etapa: 4, valor: 450, creado: 9 * D, act: 6 * D, toque: 3 * D,
        f: { temaClaro: true, temaTxt: 'rececho de ciervo', presupuesto: '2.000 €', trofeo: true }, s: { plaza: true, cita: -6 * D, citaOk: true, noshow: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Luis, te llama el comercial el jueves a las 18:00 por el rececho de ciervo.'], [3 * D, 'a', 'wa', 'Luis, el jueves no pudimos hablar. ¿Te viene mejor otra hora?']],
        ev: [[6 * D, 'sistema', 'No cogió la llamada del comercial']] },
      { id: 'h08', n: 'Sergio Martín', rol: '«Avísame» · caza menor · perdiz', seg: 'cazador', ciudad: 'Albacete', prod: 'Ojeo de perdiz · Albacete', orig: 'c4', canal: 'wa', etapa: 1, valor: 60, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { temaClaro: true, temaTxt: 'ojeo de perdiz' }, s: { intentos: 2 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Sergio, soy Álvaro, de Hunty. Te aviso de ojeos de perdiz en Albacete. ¿Para cuántas escopetas?']] },
      { id: 'h09', n: 'Javier Ortega', rol: '«Más adelante» · rececho de corzo', seg: 'cazador', ciudad: 'Segovia', prod: 'Rececho de corzo · Guadalajara', orig: 'c6', canal: 'wa', etapa: 3, valor: 450, creado: 25 * D, act: 20 * D, toque: 20 * D,
        f: { temaClaro: true, temaTxt: 'rececho de corzo', trofeo: true }, s: { luego: 'primavera', luegoTxt: 'el corzo lo deja para la temporada de primavera' },
        conv: [[25 * D, 'a', 'wa', 'Hola Javier, ¿sigues con el corzo en mente?'], [20 * D, 'c', 'wa', 'Sí, pero en primavera, que es cuando se caza bien.']] },
      { id: 'h10', n: 'Álvaro Díaz', rol: 'Pide fecha y no contesta', seg: 'cazador', ciudad: 'Badajoz', prod: 'Montería en Badajoz · enero', orig: 'c2', canal: 'wa', etapa: 3, valor: 55, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { temaClaro: true, temaTxt: 'montería' }, s: { fechas: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Álvaro, en Badajoz hay monterías el 10 y el 24 de enero.'], [4 * D, 'c', 'wa', '¿La del 24 tiene puestos?']] },
      { id: 'h11', n: 'Ramón Castro', rol: 'Reservó hace 2 semanas', seg: 'cazador', ciudad: 'Zaragoza', prod: 'Montería en Teruel · noviembre', orig: 'c5', canal: 'wa', etapa: 6, valor: 55, creado: 30 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { temaClaro: true, temaTxt: 'montería' }, s: {}, conv: [] },
      { id: 'h12', n: 'Jorge Vidal', rol: 'Solo mirando', seg: 'cazador', ciudad: 'Valencia', prod: 'Montería', orig: 'c3', canal: 'wa', etapa: 1, valor: 55, creado: 8 * D, act: 8 * D, toque: 5 * D, fin: 'perdido',
        f: { soloInfo: true }, s: { intentos: 3 }, conv: [] },
      { id: 'h13', n: 'Enrique Blanco', rol: 'Rececho internacional · Kirguistán', seg: 'cazador', ciudad: 'Bilbao', prod: 'Rececho de íbice · Kirguistán', orig: 'c1', canal: 'wa', etapa: 6, valor: 900, creado: 40 * D, act: 5 * D, toque: 5 * D, fin: 'ganado',
        f: { temaClaro: true, temaTxt: 'rececho de íbice', yaViajo: true, trofeo: true }, s: {}, conv: [] },
      { id: 'h14', n: 'Tomás Prieto', rol: 'Prefiere teléfono', seg: 'cazador', ciudad: 'León', prod: 'Rececho de rebeco · Cantabria', orig: 'c1', canal: 'tel', etapa: 2, valor: 450, creado: 30 * H, act: 26 * H, toque: 26 * H,
        f: { temaClaro: true, temaTxt: 'rececho de rebeco', fechas: 'en noviembre', trofeo: true }, s: { incluye: true },
        conv: [[30 * H, 'a', 'wa', 'Hola Tomás, soy Álvaro, de Hunty. ¿Prefieres que te llame el comercial?'], [26 * H, 'c', 'wa', 'Sí, mejor por teléfono, por la tarde.']] }
    ]
  };
})();
