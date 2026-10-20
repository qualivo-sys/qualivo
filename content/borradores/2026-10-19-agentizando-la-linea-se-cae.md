# Lunes 19-oct · Agentizando mi propia empresa · «Mi agente de voz lleva cuatro días sin llamar a nadie»

> Pieza de lunes de la serie «Agentizando», para LinkedIn. **Sin publicar.** Las redes siguen en pausa: se publican una a una con el ok de Maikel (R16).
>
> **Cuándo:** mejor **cuando la línea vuelva**, con la frase final de la variante B. Publicarla con la línea aún caída enseña un fallo sin arreglo.
>
> **Alternativa en el banco:** `content/borradores/2026-10-08-agentizando-se-corrige.md` («Un agente que se corrige por escrito») sigue sin publicar y vale para hoy si Maikel prefiere no contar este fallo.

> **Actualización del 20-oct:** desde la tarde del 19-oct la voz está **pausada a propósito** en el código (`VOZ_PAUSADA` en `api/activacion.js`, Revenue Journey V3 aprobado por Maikel). La B y la C van solo por WhatsApp, y la voz automática no vuelve sin reparación, pruebas y consentimiento específico del contacto. La variante B ya no puede decir «volvió» hasta que Maikel la reactive. Si se publica antes, el cierre honesto es: «Mientras tanto, la he parado. No vuelve hasta que esté arreglada, probada y con permiso de quien recibe la llamada.»

## Ficha

- **Serie:** Agentizando mi propia empresa.
- **Etapa del Revenue Journey:** primer contacto (lo que pasa en las primeras horas después del formulario).
- **Dato real:** cierres de Growth en `bus/out/demand.jsonl`.
  - **15-oct:** tres intentos de Raquel a un contacto en seguimiento fallaron en la línea telefónica (el trunk SIP de Twilio). El registro lo apunta como «no conectó (fallo SIP, no cuenta como contacto entregado)».
  - **16, 17 y 18-oct:** Raquel, 0 llamadas. La línea sigue caída. El WhatsApp sí entrega.
  - **Causa pendiente:** Maikel tiene que revisar el saldo o la cuenta de Twilio.
- **Reglas:**
  - **R1/R2:** solo lo que dicen los cierres. No se dice cuántos contactos se quedaron sin llamada, porque no está contado.
  - **R5:** sin nombre ni sector del contacto.
  - **R7:** no habla de plantones.
  - **R12:** el acierto primero (el registro distinguió «no conectó» de «no contestó»), el fallo después.
  - **R13:** a cualquier dueño se le ha caído algo sin que nadie lo avise a tiempo.
- **CTA:** conversación.
- **Qué se mide:** comentarios sobre quién vigila sus automatizaciones.
- **Imagen:** sin imagen. Si Maikel la quiere, captura de la línea «no conectó (fallo SIP)» con el contacto tapado.

## Texto para LinkedIn (variante A, con la línea aún caída)

> Mi agente de voz lleva cuatro días sin llamar a nadie.
>
> No es que no quiera. Es que la línea de teléfono por la que llama se cayó el
> jueves 15. Desde entonces, cero llamadas.
>
> Lo bueno: el sistema no lo escondió. El registro apuntó cada intento como
> «no conectó», no como «no contestó».
>
> Parece un detalle. No lo es. Si lo apunta como «no contestó», ese contacto
> cuenta como alguien que no quiso hablar. Y tú sacas conclusiones de un
> número que es mentira.
>
> Lo malo: el WhatsApp siguió saliendo, pero la llamada que les toca a los que
> no contestan en dos horas y media no salió. Cuatro días.
>
> Lo que me llevo:
>
> Un agente no es solo el agente. Es la línea, el saldo, la cuenta del
> proveedor. Si una de esas piezas se cae, el agente sigue «funcionando» y no
> hace nada.
>
> Ahora me falta lo segundo: que el sistema no solo lo apunte, sino que me
> avise el primer día.
>
> ¿Quién se entera en tu empresa cuando una automatización deja de hacer su
> trabajo?

## Variante B (cuando la línea vuelva)

Cambiar el titular por «Mi agente de voz estuvo X días sin llamar a nadie» y el penúltimo bloque por:

> Volvió el [día]. La causa fue [la que diga Maikel]. Y ahora el sistema me
> avisa el primer día que una llamada no conecta.

**Ojo:** la última frase solo se publica si el aviso existe de verdad (R2). Si no, se queda «Ahora me falta…».

## Pendiente de Maikel

- **Revisar Twilio** (saldo o cuenta). Es lo que desbloquea la pieza y, sobre todo, las llamadas de la B y la C.
- **Ok a contar el fallo**, y si va con la línea caída (A) o cuando vuelva (B). Recomendación: B.
- **Si va B:** la causa y el día en que volvió.
