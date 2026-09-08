// Contenido de la radiografía ampliada que recibe por correo quien completa el
// diagnóstico de qualivo.io/donde-pierdes-clientes. Separado de la función para
// que el texto se pueda revisar sin tocar la lógica de envío.

const ETAPAS = ['captacion', 'conversion', 'seguimiento', 'proceso', 'medicion'];

const NOMBRE = {
  captacion: 'Captación', conversion: 'Conversión', seguimiento: 'Seguimiento',
  proceso: 'Proceso', medicion: 'Medición'
};

const PREGUNTA = {
  captacion: '¿Entra gente?',
  conversion: '¿Los atiendes a tiempo?',
  seguimiento: '¿Los persigues?',
  proceso: '¿Aguanta sin ti?',
  medicion: '¿Sabes qué está pasando?'
};

// Explicación por etapa y estado. No son elogios ni reproches: describen qué
// significa esa puntuación en una empresa de 2 a 20 personas.
const EXPLICA = {
  captacion: {
    critica: 'Llega poca gente y, de la que llega, no sabes qué la trajo. Es la situación más incómoda de todas, porque no puedes repetir lo que funciona ni cortar lo que no. Cualquier decisión sobre presupuesto es una apuesta.',
    floja: 'Entra gente, pero casi toda por la misma vía. Mientras funcione no lo notarás. El problema aparece el día que esa vía cambia: sube el coste, cambia el algoritmo o se jubila quien te recomendaba. Y ese día no avisa.',
    solida: 'Entra gente por varios sitios y sabes de dónde viene. Eso es más de lo que tiene la mayoría, y es lo que te permite decidir con criterio dónde meter el siguiente euro.'
  },
  conversion: {
    critica: 'Alguien pregunta y se enfría antes de que nadie le conteste. Esto no aparece en ningún informe porque el que se va no te dice que se ha ido: simplemente deja de escribir. Y tú lo apuntas como que no estaba interesado.',
    floja: 'Contestáis, pero no siempre a tiempo y no siempre igual. La diferencia entre contestar en una hora y contestar al día siguiente no la ves tú: la ve el cliente, comparando contigo y con otros dos.',
    solida: 'A quien pregunta se le atiende rápido y hay alguien claro para hacerlo cuando tú no puedes. Esa es la parte que más barato sale arreglar y casi nadie tiene resuelta.'
  },
  seguimiento: {
    critica: 'Lo que sale por la puerta no lo persigue nadie. Aquí es donde más dinero se queda por el camino, porque el coste de esos clientes ya está pagado entero: captarlos, visitarlos, calcular el precio. Lo único que falta es una llamada.',
    floja: 'Se hace seguimiento cuando alguien se acuerda. Eso significa que los presupuestos que se persiguen son los que estaban frescos en la cabeza de alguien, no los que más valían.',
    solida: 'Lo que se manda tiene a alguien detrás y con fecha. Es la señal más clara de que hay un sistema y no solo buena voluntad.'
  },
  proceso: {
    critica: 'Casi todo pasa por ti y casi nada está escrito. No se nota como una pérdida, se nota como cansancio. Pero tu empresa no puede crecer más rápido de lo que tú puedas atender, y eso es un techo, no una fuga.',
    floja: 'Hay proceso, pero se sostiene con memoria. Funciona mientras el volumen sea bajo. El día que entran quince cosas a la vez se cae alguna, y suele caerse la que no gritaba.',
    solida: 'Las cosas están escritas y no dependen de una sola cabeza. Eso es lo que separa una empresa de un autoempleo con gente dentro.'
  },
  medicion: {
    critica: 'Estás decidiendo a ciegas. No es que midas mal: es que cuando toque decidir dónde poner el dinero del año que viene, no vas a tener con qué. Y lo peor que puede pasar es cortar justo el canal que funcionaba.',
    floja: 'Miras los números, pero no lo bastante seguido como para corregir a tiempo. Enterarte tres meses tarde de un problema es enterarte cuando ya ha costado dinero.',
    solida: 'Sabes qué está pasando y puedes decidir con datos en vez de con intuición. Con eso ya juegas otra liga.'
  }
};

// Los tres primeros movimientos según la etapa que peor está.
const MOVIMIENTOS = {
  captacion: [
    'Añade la pregunta «¿cómo nos has conocido?» a cada alta, empezando mañana. Aunque la apuntes en una libreta.',
    'Mira qué porcentaje de tus clientes del año pasado vino de tu vía principal. Si pasa del setenta por ciento, eso no es un canal: es una dependencia.',
    'Elige una segunda vía y dale tres meses de verdad antes de juzgarla. Abrir cinco a la vez es la forma más rápida de que ninguna funcione.'
  ],
  conversion: [
    'Decide quién contesta cuando tú no puedes, y dile en cuánto tiempo tiene que hacerlo. Una persona y un plazo.',
    'Pon un aviso automático fuera de horario que diga cuándo vais a llamar. No cierra la venta, pero evita que se vaya con el que contestó antes.',
    'Coge las últimas diez personas que preguntaron y cuenta cuántas recibieron un presupuesto. Los que faltan son el tamaño del agujero.'
  ],
  seguimiento: [
    'Haz la lista de los presupuestos de este mes que no han tenido respuesta. Solo la lista, sin llamar todavía.',
    'Llama a tres. Sin oferta ni excusa: «te mandé aquello, ¿lo has podido mirar?». Nadie se ha enfadado nunca por esa llamada.',
    'Ponle fecha a los que quedan. Un segundo contacto a los tres días y un tercero a la semana. En el calendario, no en la memoria.'
  ],
  proceso: [
    'Escribe en un folio cómo se calcula un presupuesto tipo. Ese folio es la primera pieza de sistema que tiene tu empresa.',
    'Abre un sitio único donde esté lo pendiente, con cuatro columnas: quién es, de dónde vino, qué toca hacer y cuándo.',
    'Pregunta a dos personas de tu equipo qué hacen cuando entra un cliente nuevo. Si te cuentan cosas distintas, ahí tienes el siguiente trabajo.'
  ],
  medicion: [
    'Ponte media hora en el calendario el primer lunes de cada mes. Solo para mirar dos cosas: qué entró y de dónde.',
    'Suma lo que gastaste en captar el trimestre pasado y divídelo entre los clientes que entraron. Aunque sea aproximado, ese número cambia conversaciones.',
    'Empieza a registrar el origen de cada cliente nuevo. En tres meses tienes el mapa que ninguna agencia te ha dado.'
  ]
};

// Cómo comprobar en una semana si el diagnóstico ha acertado.
const COMPROBAR = {
  captacion: 'Durante una semana, pregunta a cada persona que contacte cómo te encontró. Si al final de la semana no puedes explicar tres de cada cuatro, hemos acertado.',
  conversion: 'Mira la hora a la que entró la última solicitud y la hora a la que alguien contestó. Repítelo con las cinco anteriores. Si la media pasa de unas horas, hemos acertado.',
  seguimiento: 'Cuenta los presupuestos que mandaste el mes pasado y cuántos tuvieron una segunda llamada tuya. Si el segundo número es menos de la mitad del primero, hemos acertado.',
  proceso: 'Ahora mismo, sin mirar y sin llamar a nadie: ¿cuántos clientes están esperando respuesta tuya? Si no puedes decirlo, hemos acertado.',
  medicion: 'Intenta responder en un minuto cuánto te costó conseguir un cliente el mes pasado. Si necesitas más de un minuto o más de una persona, hemos acertado.'
};

function estado(p) { return p <= 2 ? 'critica' : (p <= 5 ? 'floja' : 'solida'); }
function etiqueta(p) { return p <= 2 ? 'Crítica' : (p <= 5 ? 'Floja' : 'Sólida'); }
function color(p) { return p <= 2 ? '#E8590C' : (p <= 5 ? '#C98A06' : '#0E7C74'); }

// La segunda etapa peor, que es la que suele sorprender.
function segundaPeor(etapas, debil) {
  const resto = ETAPAS.filter(e => e !== debil);
  const min = Math.min(...resto.map(e => etapas[e]));
  const orden = ['seguimiento', 'conversion', 'captacion', 'proceso', 'medicion'];
  return orden.find(e => resto.includes(e) && etapas[e] === min) || resto[0];
}

module.exports = { ETAPAS, NOMBRE, PREGUNTA, EXPLICA, MOVIMIENTOS, COMPROBAR,
                   estado, etiqueta, color, segundaPeor };
