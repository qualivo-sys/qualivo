import type { Metadata } from 'next';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = { title: 'Politica de privacidad · My Little Brain' };

export default function Privacidad() {
  return (
    <>
      <h1>Politica de privacidad</h1>
      <p>
        My Little Brain trata datos personales, y algunos de ellos son <strong>datos de salud</strong>
        (peso, medidas, alimentacion, entrenamiento, sueno y estado de animo). Esta politica explica
        que recogemos, para que, con que base legal y que derechos tienes, conforme al Reglamento (UE)
        2016/679 (RGPD) y la Ley Organica 3/2018 (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        <strong>{LEGAL.empresa}</strong>, {LEGAL.cif}, {LEGAL.direccion}. Email: {LEGAL.email}.
      </p>

      <h2>2. Que datos tratamos</h2>
      <ul>
        <li><strong>Cuenta</strong>: email, nombre, contrasena (cifrada) y datos de sesion.</li>
        <li><strong>Perfil</strong>: sexo, edad, altura, ocupacion, objetivos, experiencia, material disponible, lesiones o molestias, preferencias y alergias alimentarias, horarios de sueno.</li>
        <li><strong>Registros que tu introduces</strong>: peso y perimetros, comidas (incluidas fotos si las envias), entrenamientos, tiempo de foco, habitos, tareas, sueno, animo, energia, estres y notas.</li>
        <li><strong>Conversaciones con el coach</strong>: los mensajes que escribes y las respuestas, mas los datos que el coach decide recordar de ti para personalizar el servicio.</li>
        <li><strong>Datos derivados</strong>: calorias y macros estimados, grasa corporal estimada, puntuaciones, tendencias, correlaciones y revisiones semanales.</li>
        <li><strong>Pago</strong> (solo en planes de pago): identificadores de cliente y suscripcion en Stripe. No almacenamos numeros de tarjeta.</li>
        <li><strong>Uso</strong>: numero de mensajes al coach y tokens consumidos por mes, para aplicar los limites del plan.</li>
      </ul>

      <h2>3. Para que y con que base legal</h2>
      <ul>
        <li><strong>Prestar el servicio</strong> (calcular tus objetivos, generar tu plan, responder como coach, mostrarte tu progreso): ejecucion del contrato (art. 6.1.b RGPD). Como buena parte de estos datos son de salud, ademas te pedimos tu <strong>consentimiento explicito</strong> al crear la cuenta (art. 9.2.a RGPD). Puedes retirarlo en cualquier momento borrando la cuenta.</li>
        <li><strong>Gestionar el cobro</strong>: ejecucion del contrato y obligaciones fiscales.</li>
        <li><strong>Seguridad y prevencion de abuso</strong>: interes legitimo (art. 6.1.f).</li>
      </ul>
      <p>No usamos tus datos para publicidad ni los vendemos a terceros.</p>

      <h2>4. Inteligencia artificial</h2>
      <p>
        El coach funciona con modelos de <strong>Anthropic</strong>. Para responder, enviamos a su API tu
        mensaje, un resumen de tu perfil y de tus datos recientes, y las fotos de comida que decidas
        mandar. Anthropic actua como encargado del tratamiento y, segun sus condiciones para clientes de
        API, no usa esos datos para entrenar sus modelos. Los calculos numericos (calorias, grasa,
        puntuaciones) los hace la propia aplicacion, no el modelo.
      </p>
      <p>
        Las respuestas del coach son orientativas y automatizadas. <strong>No constituyen consejo
        medico</strong> ni sustituyen a un profesional sanitario. No tomamos decisiones con efectos
        juridicos sobre ti basadas unicamente en tratamiento automatizado.
      </p>

      <h2>5. Encargados y transferencias internacionales</h2>
      <ul>
        <li><strong>Supabase</strong> (base de datos, autenticacion y almacenamiento de fotos): servidores en la Union Europea (Irlanda).</li>
        <li><strong>Vercel</strong> (alojamiento de la aplicacion).</li>
        <li><strong>Anthropic</strong> (modelo de IA), Estados Unidos.</li>
        <li><strong>Stripe</strong> (pagos), solo si contratas un plan de pago.</li>
      </ul>
      <p>
        Cuando un proveedor trata datos fuera del Espacio Economico Europeo, lo hace amparado en el
        Marco de Privacidad de Datos UE-EE. UU. o en clausulas contractuales tipo de la Comision Europea.
      </p>

      <h2>6. Conservacion</h2>
      <p>
        Conservamos tus datos mientras tengas cuenta. Si la borras, se eliminan de forma inmediata
        e irreversible todos tus registros, conversaciones y fotos; las copias de seguridad de la base
        de datos se sobreescriben en un plazo maximo de 30 dias. Los datos de facturacion se conservan
        el tiempo que exige la normativa fiscal.
      </p>

      <h2>7. Tus derechos</h2>
      <p>
        Puedes acceder, rectificar, suprimir, limitar u oponerte al tratamiento, y pedir la
        portabilidad. Desde <strong>Ajustes</strong> puedes descargar todos tus datos en JSON y borrar
        la cuenta sin pedirlo a nadie. Para cualquier otra solicitud, escribe a {LEGAL.email}. Si no
        estas conforme, puedes reclamar ante la Agencia Espanola de Proteccion de Datos (aepd.es).
      </p>

      <h2>8. Cookies</h2>
      <p>
        Solo usamos cookies estrictamente necesarias para mantener tu sesion iniciada. No hay cookies
        de analitica ni de publicidad, por lo que no se muestra banner de consentimiento.
      </p>

      <h2>9. Menores</h2>
      <p>El servicio esta dirigido a mayores de 18 anos. No creamos cuentas a menores a sabiendas.</p>

      <h2>10. Cambios</h2>
      <p>
        Si cambiamos esta politica de forma relevante, te avisaremos en la aplicacion o por email antes
        de que entre en vigor.
      </p>
    </>
  );
}
