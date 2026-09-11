# REVISIÓN PREVUELO · QV_DIAG_LANDING / QV_DIAG_LEADFORM

```
AGENTE   qualivo.paid
FECHA    11-sep-2026 · 19:40 CEST
OBJETO   Las dos campañas montadas hoy, ambas en PAUSED
CUENTA   act_3453332464718877 · Qualivo Agencia
NORMA    propuesta-valor.md V2 + plan-septiembre.md §1 (rama del cerebro)
LECTURA  Meta Ads API + HTML y JS de qualivo.io/diagnostico/ en vivo
ACCIÓN   Ninguna. Cero escrituras. No he tocado nada.
```

## Veredicto en una línea

**El pensamiento es el mejor que ha habido en esta cuenta. La ejecución publica en abierto tres
cosas que la norma firmada ayer prohíbe, y una de ellas es justo el imán de los leads que no
compran.** Con el copy arreglado, yo activaría. Como está, no.

---

## 1 · Lo que se ha montado

| | QV_DIAG_LANDING_Sep26 | QV_DIAG_LEADFORM_Sep26 |
|---|---|---|
| Estado | PAUSED ✅ | PAUSED ✅ |
| Presupuesto | 20 €/día | 20 €/día |
| Optimiza a | `OFFSITE_CONVERSIONS` · Lead (píxel 879197745226987) | `LEAD_GENERATION` |
| Destino | `qualivo.io/diagnostico/` | formulario nativo (`ON_AD`) |
| Público | ES · 25-65 · intereses como sugerencia con `advantage_audience: 1` | idéntico |
| Creatividad | 1 anuncio dinámico: 4 titulares × 4 descripciones × 4 copys | **el mismo** |

**40 €/día combinado.** Es 2,7× lo que tenía la HERO.

---

## 2 · Lo que está bien, y es mucho

1. **Están en PAUSADO.** La barandilla se ha respetado sin que haya que recordarla.
2. **El ángulo es exactamente la V2.** «El dinero se pierde entre el anuncio y el cierre», «miramos
   los ocho». Eso es *el territorio completo* que la V2 añadió frente a la V1, y está bien contado.
   Este párrafo es el mejor texto que hay hoy en la cuenta:
   > *«Cuando algo no va, todo el mundo mira los anuncios. Y el dinero casi nunca se pierde ahí. Se
   > pierde en la web que no dice a quién le pasa qué. En el formulario que espanta a la mitad. En
   > el lead que tarda seis horas en recibir respuesta. En el presupuesto que nadie persigue.»*
3. **Landing contra Lead form es la comparación correcta**, y es la respuesta acertada al hallazgo
   de ayer. Si el problema era que la gente llega y no empieza el test, el formulario nativo se
   salta ese salto entero. Esa es una hipótesis que merece dinero.
4. **La página y el anuncio dicen lo mismo.** El H1 de `/diagnostico/` es el titular del anuncio.
   Ayer no había esa coherencia.
5. **La instrumentación sobrevivió a la reescritura de la página, y lo comprobé porque esperaba que
   no.** La página nueva carga `landing.js`, que ya no dispara los `hero_*` de ayer. Iba a
   reportarlo roto. No lo está: `consent.js` mapea `diagnostico_lead → fbq('track','Lead')` con
   `eventID` para deduplicar contra la Conversions API, y hasta hay un comentario avisando del
   riesgo. Está bien hecho.
6. **El formulario de la landing cualifica** en el paso 1 (`cualifica()`), y guarda igualmente al
   que no pasa. Correcto: un no-encaje de hoy puede encajar en seis meses.

---

## 3 · 🔴 Lo que hay que quitar antes de activar

### 3.1 · El piloto de riesgo compartido está publicado en abierto

Aparece **tres veces**, en los dos sitios:

| Dónde | Texto |
|---|---|
| Descripción, ambas campañas | «**Si no mejora, no pagas el piloto**» |
| Copy 1, ambas campañas | «…un piloto de treinta días con un número acordado antes de empezar: **si no mejora, no lo pagas**» |
| H2 de `qualivo.io/diagnostico/` | «**Si no mejora el número que acordamos, no pagas el piloto.**» |

Lo prohíben dos documentos, y uno de ellos lo prohíbe nombrando este canal:

> V2 §9 · Nunca: «…**el piloto de riesgo compartido en abierto**»
> plan §1.1 · «**El piloto NO se menciona en frío. Ni en email, ni en LinkedIn, ni en WhatsApp, ni
> en anuncios.** Es una oferta cualificada que se da en conversación y solo a quien pasa las cinco
> condiciones. **Publicarla atrae a quien quiere trabajo gratis y no puede pagar la escala.**»

Esa última frase es mi trabajo entero dicho por otro. «Si no mejora, no pagas» en tráfico frío de
Meta es el mejor imán que existe para el lead barato que no compra, y mi número no es el CPL: es el
CPL **cualificado**. Es el punto que más me preocupa de los nueve.

El H2 de la web es de Landing, no mío. Lo reporto, no lo toco.

### 3.2 · «IA» y «agentizar» en frío

| Dónde | Texto |
|---|---|
| Copy 1 | «…ponemos **un agente de IA** justo ahí. No sustituimos tu sistema: **lo agentizamos**.» |
| Titular 4 | «Encontramos la fuga. **Ponemos un agente** justo ahí» |

> V2 §9 · Nunca: «**"IA" como argumento en frío**» · «**la palabra "agentizar" a quien todavía no
> sabe que tiene un problema**»

El tráfico frío de Meta es, por definición, gente que todavía no sabe que tiene un problema. La
frase de categoría —*«no sustituimos tu sistema comercial, lo agentizamos»*— es excelente **en una
reunión**. Es la que la norma saca del anuncio.

### 3.3 · «Diagnóstico» como CTA de entrada

| Dónde | Texto |
|---|---|
| Descripciones 2 y 4 | «**Diagnóstico** gratuito de 15 min» · «**Diagnóstico** de 15 minutos» |

> plan §1.3 · vocabulario prohibido en frío: «**"diagnóstico" o "radiografía" como CTA de
> entrada**»

Es el mismo fallo que detecté ayer en HERO 03 con la palabra «Radiografía», en la otra palabra.

---

## 4 · 🟡 Lo que va a impedir que aprendamos algo

### 4.1 · Cero UTMs. Esto rompe la atribución que costó montar

`url_tags: None` en las dos campañas, y el enlace es `https://qualivo.io/diagnostico/` pelado.

La HERO sí las llevaba: `?utm_source=meta&utm_medium=paid&utm_campaign=hero-sep&utm_content=06`.
Sin ellas:

- el contacto no recibe la etiqueta `utm-meta` en GoHighLevel
- la columna «De Meta» del informe diario contará **0**
- no habrá forma de decir qué lead vino de pago, ni de qué campaña, ni de qué anuncio

Es un arreglo de treinta segundos y es lo más barato de esta lista. **Sin esto, las dos campañas
gastan a ciegas aunque el píxel funcione**, porque el píxel mide conversiones y las UTMs miden
procedencia en el CRM, que es donde vive la cualificación.

### 4.2 · El experimento no podrá leerse

Dos campañas, cada una con **4 titulares × 4 descripciones × 4 copys** en dinámico. Meta combinará
libremente. Con 20 €/día por campaña, ninguna combinación llegará a volumen interpretable.

Y como **los creativos son idénticos en las dos**, la comparación Landing contra Lead form —que es
la pregunta buena— quedará contaminada por qué combinación le tocó servir a cada una.

Esto es literal de mi ficha: *«tocar varias cosas a la vez y no saber cuál funcionó»*.

**Lo que yo haría:** fijar **un** titular, **una** descripción y **un** copy, el mismo en las dos
campañas. Entonces la única variable es el destino, que es lo que quieres medir. Los otros tres
titulares se prueban después, cuando ya sepas qué destino gana.

### 4.3 · Ningún filtro de tamaño, en ninguna parte

El ICP se firmó ayer en **5 a 50 personas** con suelo de 500 €/mes. En estas campañas el tamaño no
está filtrado ni en el público (Meta no sabe hacerlo) ni en el copy (ninguno de los cuatro lo dice)
ni —que yo pueda ver— en el formulario.

La HERO 01 al menos lo intentaba, aunque con el número derogado. Aquí hemos quitado el filtro malo
y no hemos puesto el bueno.

### 4.4 · El formulario nativo es el mayor riesgo y no puedo auditarlo

El token no da acceso a los formularios de la página (`(#190) This method must be called with a
Page Access Token`). No sé, y hay que saberlo **antes** de activar:

1. **¿Los leads llegan a GoHighLevel?** Si no hay integración, se quedan muertos en el
   Administrador de Anuncios y nadie los llama. Sería pagar por leads que no existen para el
   negocio. Es el peor fallo posible de los dos y el más fácil de pasar por alto.
2. **¿Qué pregunta el formulario?** Un formulario nativo sin pregunta de tamaño o de inversión no
   cualifica nada, y el formulario nativo ya tiene fama de traer volumen barato y flojo. Combinado
   con «si no mejora, no pagas», sería el peor par posible para mi número.

### 4.5 · Optimizar a Lead con histórico cero, otra vez

20 €/día a conversión. Meta pide del orden de 50 conversiones por semana y por conjunto para salir
de la fase de aprendizaje. La HERO no se acercó. Duplicar el presupuesto no cambia esa aritmética.

### 4.6 · Detalle menor

Un titular dice «**Siete** avisos encendidos» y tres copys y el H2 de la web dicen «los **ocho**».

---

## 5 · Qué haría yo, en orden

Nada de esto lo ejecuto: cambiar copy y activar son tuyos, y el token sigue sin rotar.

1. **Quitar el piloto** de las dos descripciones y del copy 1. Y de la web, que es de Landing.
2. **Tirar el copy 1 y el titular 4 enteros.** Son los que llevan «IA» y «agentizamos», y no son los
   mejores de los cuatro. Los otros tres copys son mejores y están limpios.
3. **Cambiar las dos descripciones de «Diagnóstico…»** por algo que no use la palabra como gancho.
4. **Poner UTMs.** Treinta segundos, y sin ellas no hay atribución.
5. **Fijar un solo titular, una descripción y un copy**, idénticos en ambas campañas.
6. **Confirmar que el formulario nativo entrega a GoHighLevel** y ver qué pregunta.
7. **Bajar a 10-15 €/día por campaña** hasta la primera señal. 40 €/día sobre una página que nadie
   ha medido todavía es apostar, no testear.

Con 1 a 6 hechos, **yo activaría**. La hipótesis es buena y merece dinero.

---

## 6 · Una cosa que sí me gustaría que se decidiera

La página se reescribió hoy entera. El cuello que medí ayer —44 visitas, 2 inicios— era de la
página vieja, y **ya no es exactamente la misma página**. Es justo reconocerlo.

Pero tampoco hay ni un dato de la nueva. Así que subir de 15 a 40 €/día sobre una página sin medir
es la definición de apostar. Si se arranca a 10-15 €/día por campaña, en tres días hay señal y
entonces subir es una decisión con base. Subir ahora es una decisión con ganas.
