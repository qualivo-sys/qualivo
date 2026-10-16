# Contraste del plan con los datos reales de la máquina

Acompaña a `plan-marketing-ventas.md`. Base: 3.731 envíos medidos vía API de
Smartlead en 13 campañas, a 14-ago-2026.

---

## 1. Los números del mes 1 no cuadran con la realidad medida

El plan pide **200 empresas prospectadas → 50 conversaciones → 15 diagnósticos →
2-4 clientes**. Eso implica un 25% de conversaciones sobre contactados.

Lo medido:

| Campaña | Envíos | Respuestas | Tasa |
|---|---|---|---|
| Academias Q3 | 1.687 | 52 | 3,1% |
| Construcción Q3 | 612 | 8 | 1,3% |
| Clínicas Q3 | 512 | 4 | 0,8% |
| Inmo Genérica | 221 | 1 | 0,5% |
| Señales | 162 | 3 | 1,9% |
| Resto (8 campañas) | 537 | 1 | 0,2% |
| **Total** | **3.731** | **69** | **1,85%** |

Y de esas 69 respuestas, la mayoría en los triajes diarios resultaron ser
autorespuestas de vacaciones o rechazos. Respuestas reales confirmadas en agosto:
unas 9. Eso deja la tasa de conversación real en torno al **0,25%**.

Traducción: para 50 conversaciones reales por email frío harían falta del orden
de **15.000 a 20.000 envíos**, no 200 empresas. Con el techo actual de 450
envíos/día son unas seis semanas a pleno rendimiento, y ahora mismo solo hay 3
campañas activas.

**Qué hacer con esto.** No bajar la ambición, cambiar el canal del objetivo. Las
50 conversaciones del mes 1 no salen del frío: salen de contenido, red personal,
LinkedIn y auditorías públicas. El email frío sirve para volumen de arriba del
embudo y para aprender qué dolor engancha, no para llenar la agenda en 30 días.

Objetivos realistas para 30 días con la infraestructura actual:
- 4.000-5.000 envíos (lo que dan 3 campañas activas más las pausadas al reanudar).
- 60-90 respuestas totales, de las que 10-15 serán reales.
- 6-10 conversaciones, 3-5 diagnósticos, 1-2 clientes.
- Y en paralelo, las conversaciones que traigan contenido y LinkedIn, que es
  donde el plan tiene razón en poner el peso.

---

## 2. El riesgo operativo serio: las dos marcas van a la misma gente

El plan define el ICP de Agent to Me como PYMEs poco digitalizadas: inmobiliarias,
instaladoras, constructoras, clínicas, asesorías, distribuidores, ecommerce.

Esa lista es, casi literalmente, la de las campañas que Qualivo ya está enviando.
Hoy tenemos **3.633 emails y 2.523 dominios ya contactados** por Qualivo, con
1.210 empresas tocadas solo en las campañas medidas.

Si Agent to Me sale a esos mismos sectores sin cruzar listas, va a pasar esto:
la misma persona recibe un correo de Maikel de Qualivo diciendo "he visto que
perdéis oportunidades" y otro de Maikel de Agent to Me diciendo "te sobra trabajo
manual". Dos marcas, dos promesas, el mismo remitente humano y la misma semana.

Esto no es solo ruido de marca. Es exactamente el patrón que ya nos costó una
queja LOPD el 12-ago (Paco Abril, Gesfor Group, tras recibir 5 correos en 5
semanas por un fallo de reenvíos). El incidente está documentado en
`captacion/incidente-reenvios-smartlead-2026-08.md`.

**Qué hacer con esto, antes de lanzar Agent to Me:**

1. **Lista de supresión compartida entre las dos marcas.** Un dominio contactado
   por Qualivo no entra en Agent to Me hasta pasados 90 días, y al revés. La
   infraestructura ya existe: `exclusion.json` se reconstruye vía API y se usa en
   cada carga. Solo hay que ampliarla a las dos marcas.
2. **Separar verticales de salida.** Lo más limpio: Qualivo se queda con lo que
   ya trabaja (formación, clínicas, construcción, solar, inmobiliarias) y Agent
   to Me arranca por donde Qualivo no ha entrado. Según los datos, el hueco
   natural es el ICP de señal de contratación, que además es el que mejor
   funciona.
3. **Remitente distinto.** Dominio hermano para Agent to Me, no los buzones de
   Qualivo. Ya recomendado en `captacion/agenttome/estrategia-outbound.md`.

---

## 3. El plan de 30 días choca con el warmup

Semana 1 dice "Agent to Me: contactar 30-50 PYMEs". Hoy no se puede: Mailerfind
tiene 0 buzones conectados, HeyReach tiene 1 sola cuenta de LinkedIn y está
ocupada con el piloto Lanzadera, y los 15 buzones de Smartlead son dominios
Qualivo.

Un dominio nuevo necesita 2-3 semanas de warmup antes de enviar en frío. Si el
día 1 no se compra el dominio y se arranca el calentamiento, la semana 1 de Agent
to Me se retrasa hasta la semana 4.

**Qué hacer:** comprar dominio y buzones hoy, y usar la semana 1 y 2 para lo que
no depende del email: contenido, la regla de las 2 veces, el convertidor, la red
personal y LinkedIn desde una segunda cuenta si aparece.

---

## 4. Dónde el plan acierta y los datos lo confirman

- **"Empresas que ya venden y ya hacen marketing"** como ICP de Qualivo. Los
  datos lo respaldan: la campaña Señales (empresas con vacante de comercial
  activa, es decir, empresas que ya venden y quieren vender más) tiene el mejor
  open rate de las trece, un 60%, y produjo la respuesta más rápida de la
  historia de la máquina, 13 minutos.
- **El diagnóstico como puerta de entrada.** En las campañas actuales, los
  mensajes que ofrecen análisis gratis generan más respuesta que los que ofrecen
  llamada. La primera respuesta real de Infoproducto (Antonio Calviño) llegó
  justo al ofrecer una radiografía gratuita del embudo.
- **Verticales con casos y autoridad.** Formación es el vertical con más
  respuestas reales (4 en una semana) y dentro de él las academias de idiomas
  responden por encima del resto. Es el candidato natural para las primeras
  auditorías públicas.
- **No vender IA en Agent to Me.** Coincide con lo diseñado en la estrategia de
  outbound: vender la nómina que no hace falta firmar, no la tecnología.

---

## 5. Dos ajustes de contenido del plan

**El outbound de Agent to Me del plan es mejor que el de la estrategia previa
para la fase de aprendizaje.** El mensaje "dime una tarea que hagáis cada semana
y te digo cómo sería como empleado digital, sin coste" pide algo mínimo, no
pretende vender y genera exactamente el activo que hace falta ahora: tareas
reales. Propongo usar ese para la fase 1 y reservar el mensaje de la vacante de
comercial (más comercial, con ancla de precio) para cuando haya 50 tareas
recogidas y empleados paquetizados.

**El convertidor y el Plan de Equipo Digital no compiten, se encadenan.** El
convertidor es autoservicio y da una tarea; el Plan de Equipo Digital es el
entregable en profundidad de outbound, hecho a mano al principio. Escalera
completa: convertidor (2 min, web) → Plan de Equipo Digital (48 h, outbound) →
Company Scan (diagnóstico de pago) → piloto → cuota mensual. Hay un ejemplo real
del Plan en `captacion/agenttome/ejemplo-plan-qamarero.md`.

---

## 6. Lo que falta en el plan

1. **Quién entrega.** El plan tiene objetivos de venta pero no dice quién hace
   los diagnósticos ni cuántas horas cuesta cada uno. Con 15 diagnósticos al mes
   y un día de trabajo por diagnóstico, es tres semanas de una persona. Conviene
   fijar cuánto tiempo semanal hay disponible antes de prometer volumen.
2. **Higiene de datos y LOPD.** Ni una línea sobre supresión, pie legal de los
   correos ni gestión de bajas. Después del incidente de agosto debería ser un
   apartado propio: pie con identificación y origen de los datos, baja visible,
   lista de exclusión compartida y revisión semanal.
3. **Precio de Qualivo.** El plan detalla precios de Agent to Me pero no los de
   Qualivo Diagnostic ni del retainer. Sin eso no se puede calcular CAC ni decidir
   cuánto invertir en captación.
4. **Criterio de parada.** No hay ninguna condición que diga cuándo abandonar un
   vertical o un mensaje. La máquina ya tiene reglas así (pausar por bounce alto,
   desactivar variante perdedora); el plan comercial debería tenerlas también.
