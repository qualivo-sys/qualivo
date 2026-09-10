# ADR-008 · El agente de ofertas es un taller, no un departamento

**Fecha** 2026-09-10 · **Estado** propuesta

**Contexto.** Existe una sesión trabajando la propuesta de valor y la oferta irresistible. Ha
producido cosas de valor: ecuación de valor, nicho, precio, plan de validación de 14 días.

**La pregunta.** ¿Es el octavo agente?

**Decisión.** No. Es un **taller**: se abre cuando hay que rediseñar la oferta, y se cierra cuando
la oferta está escrita en la Estrategia Central.

**Razones.**

1. **No posee ninguna transición del negocio.** No hay nada que fluya de A a B por su causa.
   Por la regla de creación de ADR-001, le faltan dos de los tres requisitos: no tiene transición
   propia ni KPI propio.
2. **No tiene cadencia.** La oferta se rediseña dos o tres veces al año. Un agente permanente para
   eso pasa la mayor parte del tiempo inventando trabajo.
3. **Y sobre todo: la oferta es un INPUT, no un output.** Content, Outbound, SDR, Sales y Paid
   leen todos de ella. Si además hay un agente emitiendo versiones nuevas de forma continua, se
   produce deriva de oferta: cada agente vendiendo algo ligeramente distinto. Eso es exactamente
   lo que la matriz obligatoria de `cerebro.md` existe para impedir.

**Dónde vive la oferta.** Donde dice ADR-004: Google Doc Estrategia Central y Notion, editados por
Maikel. Es capa humana, no capa máquina.

**El ciclo correcto.**

```
se abre el taller  →  se diseña la oferta  →  Maikel la firma
        ↓                                            ↓
   se cierra   ←   la matriz obligatoria se actualiza
                            ↓
        Content · Outbound · SDR · Sales · Paid leen la nueva
```

**Consecuencias.** El trabajo hecho no se tira: es el input del próximo cambio de estrategia. Pero
mientras el taller esté abierto y no haya firma, **la oferta vigente sigue siendo la de la matriz
del 8-sep**, y ningún agente cambia su mensaje. Ver hallazgo H10.
