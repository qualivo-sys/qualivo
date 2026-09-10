# ADR-009 · Paid de Qualivo va en sesión propia, no en un subagente de growth

**Fecha** 2026-09-10 · **Estado** propuesta

**Contexto.** Qualivo tiene campañas activas y viven dentro de Agente growth, que ya montó todo el
stack: píxel Qualivo Agencia en navegador y servidor, API de Conversiones con deduplicación frente
al píxel, webhook de GoHighLevel enviando Schedule y Purchase, cron diario que vuelca Meta Ads
**por anuncio** a un Sheet, skill de director creativo y fábrica de vídeo. La pregunta de Maikel:
¿subagente dentro de growth o cosa aparte?

**Opciones.** (a) Dejarlo dentro de growth. (b) Subagente hijo de growth. (c) Sesión propia
hermana, con rama y rutinas.

**Decisión.** (c).

**Razones.**

1. **Permisos.** Hoy la misma sesión que despliega qualivo.io puede gastar dinero. Un fallo de web
   se arregla con otro deploy; un fallo de puja no vuelve. Lo irreversible necesita su propio
   envoltorio.
2. **Ritmo.** Paid necesita vigilancia diaria y review los lunes, y las rutinas cuelgan de una
   sesión. Dentro de growth competirían con la content machine, y ya sabemos quién gana: el Growth
   Review lleva desde el 11-ago sin ejecutarse.
3. **Medición.** Si un mismo agente posee SEO, contenido y anuncios, no se puede saber de dónde
   vino el lead. El dato por anuncio ya existe en el cron; lo que falta es un dueño que responda
   por él.
4. **Reutilización.** El mismo agente sirve después para Adigital, EAC y Focus. Metido dentro de
   growth no es reutilizable.

**Sobre la objeción del contexto.** Es la buena, y tiene respuesta: lo que Paid necesita no es el
historial de conversación de growth, son datos escritos. Esquema de UTMs, eventos de la API de
Conversiones, recorrido de la Radiografía, biblioteca de dolores, matriz de posicionamiento. Casi
todo está ya escrito en su rama. **Si Paid no pudiera trabajar sin el chat de growth, eso probaría
que falta escribirlo**, no que deban ir juntos.

**Cuándo sí un subagente hijo.** Para tareas de una vez: un red team de creatividades, una
auditoría puntual. Ese patrón ya se usó bien con "Red team · Hero lead magnet", hija de growth. Un
departamento permanente necesita identidad, rama, rutinas y KPI propios, y un hijo no los tiene.

**La frontera, en una línea.**

> **La instrumentación es de Growth. La inversión es de Paid.**

Growth conserva píxel, API de Conversiones, eventos, landing y creatividades. Paid consume todo
eso, decide dónde va el dinero, y no toca la web.

**Consecuencias.** Una sesión más que mantener y un traspaso que hacer bien. A cambio, la sesión
que gasta deja de ser la que despliega, y el gasto pasa a tener dueño, ritmo y número.
