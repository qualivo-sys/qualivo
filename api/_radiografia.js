// Contenido de la radiografía ampliada que recibe por correo quien completa el
// diagnóstico de qualivo.io/donde-se-rompe-tu-crecimiento. Separado de la función
// para que el texto se pueda revisar sin tocar la lógica de envío.

const DIMS = ['captacion', 'conversion', 'seguimiento', 'dependencia', 'control'];

const NOMBRE = {
  captacion: 'Captación', conversion: 'Conversión', seguimiento: 'Seguimiento',
  dependencia: 'Dependencia', control: 'Control'
};

const PREGUNTA = {
  captacion: '¿Te llegan suficientes oportunidades?',
  conversion: '¿Las que llegan se convierten?',
  seguimiento: '¿Las que no cierran a la primera se persiguen?',
  dependencia: '¿Funciona sin el dueño?',
  control: '¿Sabes qué genera crecimiento?'
};

// Explicación por dimensión y estado. No son elogios ni reproches: describen qué
// significa esa puntuación en una empresa de 2 a 20 personas.
const EXPLICA = {
  captacion: {
    critica: 'No te llegan suficientes oportunidades y no tienes una forma de generarlas cuando hacen falta. Lo que entra, entra por suerte, por contactos o por rachas. Es la situación más incómoda de todas, porque todo lo que hagas después trabaja sobre un caudal que no controlas.',
    floja: 'Entra gente, pero no de forma predecible ni suficiente. Sabes más o menos qué funciona y no puedes subirlo a voluntad. Cada mes flojo parece un problema nuevo cuando es siempre el mismo: no hay una fuente que puedas abrir.',
    solida: 'Te llegan oportunidades, sabes de dónde y puedes generar más cuando quieres. Eso es más de lo que tiene la mayoría, y es lo que permite que el resto del sistema tenga con qué trabajar.'
  },
  conversion: {
    critica: 'Alguien pregunta y se enfría antes de que nadie le conteste, o recibe un precio y desaparece. Esto no aparece en ningún informe porque el que se va no te dice que se ha ido: simplemente deja de escribir. Y tú lo apuntas como que no estaba interesado.',
    floja: 'Contestáis, pero no siempre a tiempo y no siempre igual, y se cierra menos de lo que se podría. La diferencia entre contestar en una hora y contestar mañana no la ves tú: la ve el cliente, comparando contigo y con otros dos.',
    solida: 'A quien pregunta se le atiende rápido y una parte razonable acaba comprando. Esa es la parte que más barato sale arreglar y casi nadie tiene resuelta.'
  },
  seguimiento: {
    critica: 'Lo que sale por la puerta no lo persigue nadie, y los que dicen «ahora no» se pierden para siempre. Aquí es donde más dinero se queda por el camino, porque el coste de esos clientes ya está pagado entero. Lo único que falta es una llamada.',
    floja: 'Se hace seguimiento cuando alguien se acuerda. Eso significa que se persiguen los presupuestos que estaban frescos en la cabeza de alguien, no los que más valían.',
    solida: 'Lo que se manda tiene a alguien detrás y con fecha, y los «ahora no» vuelven a la lista. Es la señal más clara de que hay un sistema y no solo buena voluntad.'
  },
  dependencia: {
    critica: 'Casi todo pasa por el dueño y casi nada está escrito. No se nota como una pérdida, se nota como cansancio. Pero la empresa no puede crecer más rápido de lo que una persona puede atender, y eso es un techo.',
    floja: 'Hay proceso, pero se sostiene con la memoria y el criterio de una persona. Funciona mientras el volumen sea bajo. El día que entran quince cosas a la vez se cae alguna, y suele caerse la que no gritaba.',
    solida: 'Las cosas están escritas y no dependen de una sola cabeza. Eso es lo que separa una empresa de un autoempleo con gente dentro.'
  },
  control: {
    critica: 'Estás decidiendo a ciegas. No sabes qué canal te trae ventas ni miras los números con regularidad. Cuando toque decidir dónde poner el dinero, no vas a tener con qué. Y lo peor que puede pasar es cortar justo lo que funcionaba.',
    floja: 'Tienes una idea de qué funciona, pero sin números o sin una revisión fija. Enterarte tres meses tarde de un problema es enterarte cuando ya ha costado dinero.',
    solida: 'Sabes qué te trae ventas y lo revisas cada mes. Con eso ya decides con datos en vez de con intuición, y eso es otra liga.'
  }
};

// Los tres primeros movimientos, en orden, según el cuello de botella.
const MOVIMIENTOS = {
  captacion: [
    'Cuenta cuántas oportunidades nuevas te llegaron el mes pasado y de dónde vino cada una. Solo el número. Si no lo tienes, cuéntalas durante treinta días: sin ese dato no se puede decidir nada.',
    'Busca en Google lo que vende tu empresa, en tu zona, como lo haría un cliente. Apunta en qué posición sales y quién sale delante. Ese es el tamaño del hueco.',
    'Elige un solo canal y dale tres meses de verdad, con una cantidad fija de tiempo o dinero cada semana. Abrir cinco a la vez es la forma más rápida de que ninguno funcione.'
  ],
  conversion: [
    'Decide quién contesta cuando tú no puedes, y en cuánto tiempo tiene que hacerlo. Una persona y un plazo.',
    'Pon un aviso automático fuera de horario que diga cuándo vais a llamar. No cierra la venta, pero evita que se vaya con el que contestó antes.',
    'Coge los diez últimos presupuestos y apunta qué pasó con cada uno: cerró, dijo que no, o no contestó. Ese tercer número es el agujero.'
  ],
  seguimiento: [
    'Haz la lista de los presupuestos de este mes que no han tenido respuesta. Solo la lista, sin llamar todavía.',
    'Llama a tres. Sin oferta ni excusa: «te mandé aquello, ¿lo has podido mirar?». Nadie se ha enfadado nunca por esa llamada.',
    'Ponle fecha a los que quedan y a los que dijeron «ahora no». Un segundo contacto a los tres días y un tercero a la semana. En el calendario, no en la memoria.'
  ],
  dependencia: [
    'Escribe en un folio cómo se calcula un presupuesto tipo. Ese folio es la primera pieza de sistema que tiene tu empresa.',
    'Abre un sitio único donde esté lo pendiente, con cuatro columnas: quién es, de dónde vino, qué toca hacer y cuándo. Que lo use todo el mundo.',
    'Elige una sola cosa que hoy pasa por ti y dásela a otra persona con un criterio escrito. Una. Cuando funcione, la siguiente.'
  ],
  control: [
    'Añade la pregunta «¿cómo nos has conocido?» a cada alta, empezando mañana. Aunque la apuntes en una libreta.',
    'Ponte media hora en el calendario el primer lunes de cada mes. Solo para mirar dos cosas: qué entró y de dónde.',
    'Suma lo que gastaste en captar el trimestre pasado y divídelo entre los clientes que entraron. Aunque sea aproximado, ese número cambia conversaciones.'
  ]
};

// Cómo comprobar en una semana si el diagnóstico ha acertado.
const COMPROBAR = {
  captacion: 'Durante una semana, apunta cada oportunidad nueva que entre y de dónde vino. Si al final de la semana el número te parece corto, o no puedes explicar de dónde salieron tres de cada cuatro, hemos acertado.',
  conversion: 'Mira la hora a la que entró la última solicitud y la hora a la que alguien contestó. Repítelo con las cinco anteriores. Si la media pasa de unas horas, hemos acertado.',
  seguimiento: 'Cuenta los presupuestos que mandaste el mes pasado y cuántos tuvieron una segunda llamada tuya. Si el segundo número es menos de la mitad del primero, hemos acertado.',
  dependencia: 'Ahora mismo, sin mirar y sin llamar a nadie: ¿cuántos clientes están esperando respuesta tuya? Si no puedes decirlo, o si nadie más podría decirlo, hemos acertado.',
  control: 'Intenta responder en un minuto qué canal te trajo más ventas el trimestre pasado, con un número. Si necesitas más de un minuto o más de una persona, hemos acertado.'
};

function estado(p) { return p <= 34 ? 'critica' : (p <= 67 ? 'floja' : 'solida'); }
function etiqueta(p) { return p <= 34 ? 'Crítica' : (p <= 67 ? 'Floja' : 'Sólida'); }
function color(p) { return p <= 34 ? '#E8590C' : (p <= 67 ? '#C98A06' : '#0E7C74'); }

// La segunda dimensión peor, que es la que suele sorprender.
function segundaPeor(dims, cuello) {
  const resto = DIMS.filter(e => e !== cuello);
  const min = Math.min(...resto.map(e => dims[e]));
  const orden = ['seguimiento', 'conversion', 'captacion', 'control', 'dependencia'];
  return orden.find(e => resto.includes(e) && dims[e] === min) || resto[0];
}

module.exports = { DIMS, NOMBRE, PREGUNTA, EXPLICA, MOVIMIENTOS, COMPROBAR,
                   estado, etiqueta, color, segundaPeor };
