# Campañas de Meta · juego de anuncios de la propuesta V1

> Escrito el 10 sep 2026 contra `content/propuesta-de-valor-v1.md`. **Nada de esto
> está subido a Meta**: hace falta el token o pegarlo a mano en el Ads Manager.
> Cifras verificadas contra los casos publicados; no inventar ninguna más.

## Reglas que cumple todo lo de abajo

1. **El gancho es un síntoma, nunca la IA.** «IA» y «agentizar» no aparecen en
   ningún titular. Aparecen dentro del texto, como mecanismo, después de que el
   lector se haya reconocido en el problema.
2. **Orden: promesa → prueba → mecanismo.**
3. **Un solo caso por anuncio.** Nunca dos números en la misma pieza.
4. **Destino: la Radiografía** (`/donde-se-rompe-tu-crecimiento/`), no el
   formulario. Es gratis, sin registro y con resultado al momento: la fricción
   más baja que tenemos y lo único con evidencia de clic en frío.
5. **Sin precios.** Sin el piloto de riesgo compartido.

---

## Ángulo 1 · «Ya lo has pagado» — el más alineado con la propuesta

**A quién le habla:** al que ya invierte en captación y ve oportunidades morir
después.

**Texto principal**
> El presupuesto que enviaste hace tres semanas sigue abierto. Nadie ha vuelto a
> escribir.
>
> Ese cliente ya está pagado: costó atraerlo, visitarlo y calcular el precio. Y
> se pierde en la única parte del proceso que depende de que alguien se acuerde.
>
> Nuria Roure hizo 6,45 veces lo invertido sin captar un lead más. Solo
> persiguiendo bien lo que ya tenía.
>
> En 90 segundos te decimos por cuál de las cinco fugas se te está escapando a ti
> —captación, conversión, seguimiento, dependencia o control—. Gratis, sin
> registro y con el resultado en pantalla.

**Titulares (probar los tres)**
- Ya lo pagaste. Y se está enfriando.
- 6,45× sin captar un lead más
- El presupuesto que nadie persigue

**Descripciones**
- 90 segundos. Sin registro.
- Tu cuello de botella, en pantalla.

**CTA:** Más información · **Destino:** `/donde-se-rompe-tu-crecimiento/`

---

## Ángulo 2 · «No subas el presupuesto» — contra-ángulo del mercado

**Por qué existe:** es la respuesta directa a lo que están comprando los
anuncios de la competencia esta semana (Contenido Blink vende creatividades
nuevas cada mes; Crece Sin Límite vende gestión de medios). Los dos empujan a
meter más arriba del embudo. Este anuncio le habla al que ya lo ha probado.

**Texto principal**
> Antes de subir el presupuesto: ¿cuántas de las oportunidades que ya tienes
> están abiertas sin que nadie haya vuelto a llamar?
>
> Creatividad nueva no arregla un embudo roto. Si ya gastas y no cierras, el
> problema casi nunca está antes del clic.
>
> Cuando pasamos un agente por nuestro propio CRM, encontró 25 oportunidades
> paradas con 34.500 € declarados. En la primera pasada.
>
> Once preguntas, 90 segundos, y sabes por dónde se te está escapando a ti.

**Titulares**
- No subas el presupuesto todavía
- 25 oportunidades paradas. 34.500 €.
- El agujero está después del clic

**Descripciones**
- Gratis · sin registro · 90 s
- Mira dónde se rompe primero.

---

## Ángulo 3 · «Depende de que alguien se acuerde» — el más frío

**A quién le habla:** dueño de empresa de servicios de 5 a 50 personas que
todavía no se ve como comprador de nada de esto.

**Texto principal**
> Tu sistema comercial funciona. Lo que falla es todo lo que depende de que
> alguien se acuerde.
>
> Contestar rápido. Perseguir el presupuesto. Saber a quién llamar primero.
> Volver a los que dijeron «ahora no». Saber qué canal trajo al último cliente.
>
> Nada de eso sale en un informe, y ahí es donde se pierde el negocio que ya
> estaba pagado.
>
> Once preguntas sobre un martes cualquiera y te decimos cuál de las cinco partes
> es la tuya. 90 segundos, sin registro.

**Titulares**
- Cuando alguien se olvida, se pierde
- Lo que no sale en ningún informe
- ¿Qué pasa cuando piden precio?

**Descripciones**
- 11 preguntas. 90 segundos.
- Sin llamadas comerciales.

---

## Qué NO usar

- Nada que abra por «IA», «agentes» o «automatización»: en frío no vende, y la
  propuesta lo prohíbe explícitamente.
- «Consultora de growth», «diagnóstico completo», «transformación digital».
- Dos casos en el mismo anuncio.
- Cualquier cifra que no esté en la tabla de prueba de la propuesta V1.

## Medición

Cada anuncio debe llevar UTM propia y el evento `Lead` sigue llegando por el
pixel con consentimiento **y** por Conversions API con el mismo `event_id`
(deduplicado). El informe diario ya recoge impresiones, clics, CTR, coste y
visitas por anuncio en la pestaña `Ads diario`.

## Pendiente para poder subirlo

- Token de Meta con permisos de escritura sobre `act_3453332464718877`, o pegarlo
  a mano en el Ads Manager.
- Decidir si se pausa `QV_HERO_LEADS_Sep26` o se le añaden estos anuncios como
  variantes dentro del mismo conjunto (recomendado: añadirlos al mismo conjunto,
  para no reiniciar el aprendizaje).
