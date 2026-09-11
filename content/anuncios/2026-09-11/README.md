# Cinco anuncios · 11 sep 2026

Los cinco dicen lo mismo pero no se parecen en nada: fondo, formato y gancho
distintos, para que Meta tenga de dónde elegir y para que quien vea dos seguidos
no sienta que es el mismo. Todos llevan **dolor → promesa → siguiente paso**, y
los tres datos que no pueden faltar: **15 minutos, plan por escrito, piloto de
30 días sin coste si no funciona.**

Destino de los cinco: `/diagnostico-de-crecimiento/`.

| # | Formato | Fondo | Dolor | Archivo |
|---|---|---|---|---|
| 1 | Golpe tipográfico | Amarillo | El riesgo de contratar | `anuncio-01.png` |
| 2 | Lista de lo que miramos | Tinta | No saber por dónde se pierde | `anuncio-02.png` |
| 3 | Conversación de WhatsApp | Lila | El presupuesto que se murió | `anuncio-03.png` |
| 4 | Antes / después | Crema | Todo depende de que alguien se acuerde | `anuncio-04.png` |
| 5 | Vídeo a cámara, 35 s | — | Subir el presupuesto sin mirar abajo | guion abajo |

---

## Texto para Meta

Cada anuncio con su texto principal, titular y descripción.

### 1 · «30 días. 0 €.»
**Texto principal**
> Te lo pongo fácil: montamos el arreglo, lo medimos, y si al día treinta el
> número no se ha movido, no pagas nada.
>
> Antes de eso hay una llamada de quince minutos donde miramos tu sistema de
> ventas entero. Sales con un plan por escrito, lo uses con nosotros o no.
>
> Sin presentación comercial y sin PDF de cuarenta páginas.

**Titular:** 30 días de piloto. 0 € si no funciona.
**Descripción:** Quince minutos y un plan por escrito.

### 2 · «Lo que miramos»
**Texto principal**
> Captación, prospección, orgánico, anuncios, formularios, qué pasa con el lead
> cuando entra, seguimiento y cierre.
>
> Todo, de arriba abajo, en quince minutos. Y sales sabiendo cuál de esas ocho
> te está costando dinero ahora mismo y qué haríamos primero.
>
> Si de ahí sale algo claro, lo probamos treinta días. Si no funciona, no pagas.

**Titular:** Tu sistema de ventas, de arriba abajo.
**Descripción:** Diagnóstico gratis de 15 minutos.

### 3 · «La conversación que se murió»
**Texto principal**
> Pidió presupuesto un martes. Se lo mandaste el miércoles. Y ahí se quedó.
>
> Ese cliente ya estaba pagado: costó atraerlo, atenderlo y calcular el precio.
> Y lleva tres semanas esperando a que alguien vuelva a escribirle.
>
> Eso no es un problema de captación. En quince minutos te decimos cuántos
> tienes así y cuánto valen.

**Titular:** ¿Cuántos presupuestos tienes muertos?
**Descripción:** Lo miramos en 15 minutos. Gratis.

### 4 · «Lo mismo, pero sin que nadie se acuerde»
**Texto principal**
> Contestar rápido. Perseguir el presupuesto. Volver al que dijo «ahora no».
>
> Nada de eso es difícil. El problema es que depende de que alguien se acuerde,
> y en treinta días eso se puede arreglar sin cambiar de CRM, ni de web, ni de
> agencia.
>
> Empieza por quince minutos. Y si el piloto no funciona, no pagas.

**Titular:** Sin cambiar de CRM, ni de web, ni de agencia.
**Descripción:** Piloto de 30 días. 0 € si no funciona.

### 5 · Vídeo, 35 segundos · guion

**Plano único, a cámara, móvil y luz de ventana. Sin música.**

> *(mirando a cámara, directo)*
> Si este mes no llegas a los números, lo primero que vas a hacer es subir el
> presupuesto de anuncios.
>
> *(pausa)*
> Espera.
>
> ¿Cuánto tardaste en contestar al último que preguntó? ¿Cuántos presupuestos
> tienes ahora mismo abiertos sin que nadie haya vuelto a llamar? ¿A cuántos de
> los que dijeron «ahora no» has vuelto este trimestre?
>
> Si no sabes las tres, no tienes un problema de captación. Tienes una fuga.
>
> Yo me meto quince minutos contigo, miramos tu sistema de ventas de arriba
> abajo, y sales con un plan de qué arreglar primero. Si vemos algo claro, lo
> montamos y lo probamos treinta días. Si no funciona, no pagas nada.
>
> Te dejo el enlace aquí abajo.

**Rótulos en pantalla:** «15 minutos» al segundo 18 · «30 días» al 27 ·
«0 € si no funciona» al 31.
**Titular:** Antes de subir el presupuesto, mira esto.
**Descripción:** Diagnóstico de 15 minutos. Gratis.

---

## Cómo se sube

- **Un solo conjunto** con los cinco dentro. Advantage+ reparte y no se parte el
  aprendizaje.
- **Objetivo:** clientes potenciales. Evento `Lead`, que en la landing solo salta
  cuando alguien pasa el corte de cualificación.
- **Nombres:** `QV_SEP26_DIAG_[01..05]`, para que el informe de la mañana los
  agrupe solo.
- **UTM en los cinco**, con `utm_content` igual al nombre. La landing lo guarda
  como etiqueta en el CRM, así que sabrás de qué anuncio vino cada diagnóstico.

## Cuándo se apaga y cuándo se sube

Reglas relativas, contra el mejor de la propia cuenta. Nada de cifras de manual.

| Momento | Qué se hace |
|---|---|
| 1.000 impresiones por anuncio | Se apaga el que tenga menos de la mitad del CTR del mejor |
| 7 días | Se apaga el que no haya traído ni un diagnóstico si otro sí |
| Cada diagnóstico agendado | Se anota de qué anuncio vino |
| Semana 3 | Sube presupuesto solo el de menor coste por diagnóstico |

**La métrica que decide no es el lead. Es el diagnóstico agendado, y después el
piloto arrancado.**

## Regenerar

`node render.js` desde el scratchpad, o abrir `anuncios.html`.
