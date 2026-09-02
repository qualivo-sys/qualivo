import type { Metadata } from 'next';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = { title: 'Terminos del servicio · My Little Brain' };

export default function Terminos() {
  return (
    <>
      <h1>Terminos del servicio</h1>
      <p>
        Estos terminos regulan el uso de My Little Brain, prestado por <strong>{LEGAL.empresa}</strong>
        ({LEGAL.cif}, {LEGAL.direccion}). Al crear una cuenta los aceptas.
      </p>

      <h2>1. Que es el servicio</h2>
      <p>
        Una aplicacion para registrar y organizar tu alimentacion, entrenamiento, habitos,
        productividad y bienestar, con un asistente de inteligencia artificial que interpreta lo que
        le cuentas, estima valores (calorias, macros, grasa corporal) y te hace recomendaciones.
      </p>

      <h2>2. No es un producto sanitario</h2>
      <p>
        <strong>My Little Brain no presta servicios medicos, dieteticos ni psicologicos.</strong> Las
        estimaciones se calculan con formulas estandar de la literatura (Mifflin-St Jeor, US Navy) y
        las recomendaciones del coach son automaticas y orientativas. No diagnostica, no trata ni
        sustituye a un profesional. Si tienes una enfermedad, tomas medicacion, estas embarazada, has
        tenido un trastorno de la conducta alimentaria o sufres una lesion, consulta a un profesional
        antes de seguir cualquier pauta. Eres responsable de las decisiones que tomes sobre tu salud.
      </p>

      <h2>3. Cuenta</h2>
      <ul>
        <li>Debes tener al menos 18 anos.</li>
        <li>Eres responsable de la confidencialidad de tu contrasena y de lo que ocurra en tu cuenta.</li>
        <li>Puedes borrar la cuenta en cualquier momento desde Ajustes. Es irreversible.</li>
      </ul>

      <h2>4. Planes y pagos</h2>
      <ul>
        <li>El plan gratuito incluye todo el sistema con un numero limitado de mensajes mensuales al coach.</li>
        <li>Los planes de pago se cobran por suscripcion a traves de Stripe y se renuevan automaticamente hasta que los canceles desde el portal de facturacion. La cancelacion surte efecto al final del periodo ya pagado.</li>
        <li>Como consumidor tienes 14 dias de desistimiento desde la contratacion, salvo que hayas empezado a usar el plan de pago y consientas la ejecucion inmediata del servicio, en cuyo caso el derecho se pierde conforme al art. 103.m de la Ley General para la Defensa de los Consumidores y Usuarios.</li>
        <li>Los precios pueden cambiar; te avisaremos con al menos 30 dias de antelacion y podras cancelar antes de que aplique.</li>
      </ul>

      <h2>5. Uso aceptable</h2>
      <p>
        No puedes usar el servicio para fines ilegales, para intentar acceder a datos de otros
        usuarios, para automatizar consultas masivas al coach ni para extraer o revender el contenido
        generado. Podemos suspender cuentas que incumplan estos terminos.
      </p>

      <h2>6. Tu contenido</h2>
      <p>
        Todo lo que registras es tuyo. Nos das licencia unicamente para tratarlo con el fin de
        prestarte el servicio. Puedes exportarlo en cualquier momento desde Ajustes.
      </p>

      <h2>7. Disponibilidad y cambios</h2>
      <p>
        Trabajamos para que el servicio este siempre disponible, pero no garantizamos la ausencia de
        interrupciones. Podemos modificar o retirar funcionalidades; si un cambio reduce de forma
        sustancial lo contratado en un plan de pago, podras cancelarlo y te devolveremos la parte
        proporcional.
      </p>

      <h2>8. Responsabilidad</h2>
      <p>
        En la medida que permite la ley, no respondemos de danos indirectos ni de decisiones que tomes
        basandote en las estimaciones o recomendaciones del servicio. Nada en estos terminos limita los
        derechos que te reconoce la legislacion de consumo.
      </p>

      <h2>9. Ley y jurisdiccion</h2>
      <p>
        Estos terminos se rigen por la legislacion espanola. Para cualquier controversia seran
        competentes los juzgados del domicilio del consumidor. Tambien puedes acudir a la plataforma
        europea de resolucion de litigios en linea.
      </p>
    </>
  );
}
