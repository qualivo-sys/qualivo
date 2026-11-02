# Alpha · por qué el píxel no registra nada desde el 13-ago

2-nov-2026 · solo lectura, navegador automático sobre la web pública · [C] comprobado · [E] estimación

## Causa

**La web tiene dos avisos de cookies y el que ve la gente no da permiso al píxel** [C].

1. alphamediagroup.es redirige a **alphapublicidad.com** (WordPress) [C].
2. El código del píxel (2110869956321028) está en la página, pero bloqueado por **Complianz** hasta que el visitante acepta las cookies de marketing (`type="text/plain" data-category="marketing"`). Es lo correcto según el RGPD [C].
3. **El aviso de Complianz está oculto:** existe en la página, con la clase `cmplz-show`, pero con `display: none`, tanto en escritorio como en móvil [C].
4. **El aviso que se ve es otro:** una barra abajo («Utilizamos cookies… Si continúa navegando, consideramos que acepta su uso», con el botón «Aceptar», `#cookieChoiceDismiss`, `wf-cc`). Al pulsarlo **no se da permiso en Complianz**, y el píxel no se carga ni después de recargar la página: 0 peticiones a Meta [C].
5. Si se acepta en el aviso de Complianz, que está oculto, el píxel sí se carga y se configura [C]. El PageView lo bloqueó Meta por detectar un navegador automático, lo normal en una prueba así.

**Resultado:** ningún visitante puede dar permiso al píxel, así que no llega ningún evento a Meta. Encaja con que el último evento sea del 13-ago: probablemente es cuando se instaló o se cambió Complianz [E].

## Riesgo legal

El aviso visible usa el «si continúa navegando, acepta». En España (AEPD) ese consentimiento no es válido. Arreglarlo es bueno para el píxel y para el cumplimiento.

## Arreglo (lo hace quien gestione la web de Alpha; ~30 min [E])

1. Quitar la barra antigua de cookies (`wf-cc` / «Cookie Choices», del tema o de un plugin).
2. Hacer visible el aviso de Complianz: revisar en Complianz › Asistente › Aviso de cookies que esté activo para la UE, y que no haya CSS del tema que lo oculte (`.cmplz-cookiebanner { display:none }`).
3. Comprobar con Meta Events Manager › Probar eventos que, tras aceptar, llegan PageView y Contact/Lead.
4. Opcional: el sitio también carga Google Tag Manager (GTM-NJFX2LW). Si el píxel se mueve a GTM, que use el mismo consentimiento.
