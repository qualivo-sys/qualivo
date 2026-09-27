// Interruptor general de todo lo que sale hacia leads: WhatsApp (oficial,
// pasarela y plantillas), llamadas de Raquel, correos de las secuencias,
// recordatorios y respuestas del agente de WhatsApp.
//
// 25-sep-2026, Maikel: «para de momento todas las secuencias de mensaje y
// llamadas, vamos a revisarlo todo». Con esto en true no sale nada hacia un
// lead, venga del cron o de un formulario en tiempo real. Sigue funcionando:
// la entrada de leads al CRM, los avisos al móvil y al correo de Maikel, y
// los informes internos.
//
// Para reanudar: poner false, commit y despliegue. Se deja como constante en
// el código, no como variable de entorno, para que no se quede puesta sin que
// nadie lo sepa (pasó con GATEWAY_PAUSA del 22 al 24-sep).
// 27-sep-2026, Maikel: «hazlo ahora y reactivemos». Se quita la pausa con la
// cadencia nueva (api/activacion.js): WhatsApp IA, una llamada de Raquel o
// aviso a Maikel según el nivel, D+1 y D+3, respuestas en modo copiloto.
// Correos, secuencias de correo y reenganche automático siguen apagados.
module.exports = { PAUSA_TOTAL: false };
