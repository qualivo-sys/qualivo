# Máquina de captación V1 · documento operativo (10-sep-2026)

> Versión visual para revisar: https://claude.ai/code/artifact/ad403c04-078b-4ee4-ab1a-b774799f8054
> Fuente de verdad del mensaje: estrategia/propuesta-valor-v1.md (V1 congelada).

## 1. Qué cambia
Antes vendíamos diagnóstico (abre conversaciones: los 24 clics de 6.874 envíos
salieron de ese formato) pero dejaba la venta a medias. La V1 cierra la segunda
mitad: "no sustituimos tu sistema comercial, lo agentizamos".
Tres cambios en cada mensaje: (a) el problema es "lo que depende de que alguien
se acuerde"; (b) UN caso con número, casi siempre Nuria 6,45x sin captar un lead
más; (c) la oferta es plan por escrito en 48 h, gratis.
Nunca en frío: IA como argumento, "agentizar", precios, piloto de riesgo.

## 2. A quién
SÍ: servicios 5-50 personas, ya generan oportunidades (web/campañas), tienen CRM
y alguien que vende, ticket de su cliente >1.000 EUR, capacidad de atender más.
NO: sin tracción, sin capacidad, ciclo >6 meses, <500 EUR/mes, quiere leads sin
tocar su proceso, quiere "que le lleven las redes".
Traducción a Apollo: sector servicios, 11-50 empleados, España + señal
verificable de que tienen piezas (CRM detectado, píxel de ads, web instrumentada).
Sin señal verificada el lead NO entra.

## 3. Canales
- Email frío: 23 campañas, una por ICP. FUNCIONANDO.
- SDR de respuestas: webhook en las 23 campañas -> n8n -> sesión; borrador en
  minutos. COPILOTO (el ok de Maikel envía).
- Voz (Raquel, 11labs, desde el 647118491): leads con 3-5 aperturas sin
  respuesta; agenda en el calendario qualivo-20. FUNCIONANDO.
- Recepción (assistant 0014b718): contesta entrantes. FALTA número de entrada.
- WhatsApp (GHL, mismo 647): día 1 tras Radiografía. FALTA plantilla Meta +
  workflow "Customer Replied".
- LinkedIn: 4 campañas con copy conversacional v2. FUNCIONANDO.
Regla común: no insistir tras un no, no dar precios, no prometer resultados;
todos empiezan en copiloto.

## 4. Recorrido
Día 0 7:30 carga verificada (40-80/día) -> día 0-7 secuencia de 3 emails ->
respuesta: borrador en minutos -> 3+ aperturas sin respuesta: cola de Raquel
(10:00-13:00, máx 2 toques) -> devuelve llamada: recepción -> agenda: reunión de
20 min + oportunidad + nota en GHL -> tras la llamada: plan por escrito en 48 h
(parte de Maikel) -> 17:30 parte diario del embudo.

## 5. Medición
Métrica que manda: REUNIONES CUALIFICADAS. CSVs diarios en captacion/datos/
(funnel-diario, campanas-diario, embudo-ghl) + email 17:30 + Sheet.
Reglas automáticas: 50+ envíos y 0 respuestas -> cede caudal; rebote >3% ->
pausa; buzón <80% reputación -> a cero; brazo nuevo se decide a los 7 días con
n>=100 (>=5% dobla, <2% se mata); un "no" saca al lead de todos los canales.

## 6. Estado hoy
23 campañas activas · 475 emails/día de capacidad · 22 llamadas de Raquel ·
12 conversaciones reales · 0 reuniones generadas todavía (lo más cerca: Matti de
Gold-Bricks, callback 11-sep 11:00).
LÍMITE: los leads ya en vuelo terminan con el copy antiguo (tocar secuencias
vivas reiniciaría envíos). La V1 entra solo por cargas nuevas.

## 7. Pendiente de Maikel
1. Número de entrada en Vapi (1 clic + desvío) -> la recepción contesta.
2. Plantilla WhatsApp + workflow GHL (~10 min) -> cierra el circuito Radiografía.
3. Aprobar plantillas por ICP de una vez -> deja de ser el cuello del motor.
4. 2 dominios x 5 buzones (35-50 EUR/mes) -> de 475 a 600-700/día. No urgente.

## 8. Riesgos
Evidencia: el formato diagnóstico genera respuesta en frío; reactivación y
seguimiento producen retorno (Nuria, Equipzilla, EAC); el enfoque de entrar
encima despierta interés repetido.
Hipótesis: que este ICP responda en frío; que el precio aguante; que un piloto
mueva el indicador en semanas; que del piloto se pase al sistema.
Riesgos operativos: el plan en 48 h es una promesa con reloj y el cuello pasa a
ser el tiempo de Maikel · la cifra de Nuria hay que verificarla antes de
publicarla en abierto · no hay ningún caso todavía de "agentizamos un proceso y
pasó esto" · la voz lleva 0 reuniones de 22 llamadas (si sigue en cero la semana
que viene, el problema es a quién llamamos, no la voz).
