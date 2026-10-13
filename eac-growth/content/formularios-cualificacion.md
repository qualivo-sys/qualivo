# EAC · Qué preguntar en los formularios

Escrito el 13-oct-2026. Las preguntas no se eligen por intuición: cada una de las
que ya existen está medida contra 428 leads de Meta y su resultado real.

## Lo primero: cada campo cuesta leads

El CPL de la campaña buena es **€2,22**. Cada pregunta que añades al formulario
sube ese coste. Así que la regla es: **solo entra una pregunta si descarta gente
que nunca iba a matricularse, o si predice que la persona se presentará a la
entrevista.** Lo demás se pregunta en la llamada, que es gratis.

Por eso la propuesta son **5 preguntas**, no doce.

## Lo que ya sabemos que funciona (medido)

| Pregunta actual | Qué hace | Veredicto |
|---|---|---|
| **¿Sabes nadar?** | «No» / «No, pero puedo aprender» → **0 entrevistas de 88 leads** | **Se queda.** Es el filtro más potente que tenemos |
| **¿Hablas inglés?** | Señal débil, dirección correcta | Se queda, con poco peso |
| **Nivel de estudios** | No discrimina: Bachillerato convertía **peor** que ESO | **Se quita.** Ocupa un campo y no dice nada |
| **Edad** | Ni siquiera llega mapeada desde Meta | **Se quita** del formulario |

Y la señal más fuerte de todas no es una pregunta: **que el lead contteste al
WhatsApp multiplica por 2,3 las entrevistas** (15,0 % contra 6,4 %). Eso no se
pregunta, se provoca.

## Lo que falta y es el agujero grande

El problema de la cuenta no es captar: es que **el 56-60 % de las citas son
plantón** y que entran leads que no pueden hacer el curso. Tres cosas que nadie
pregunta hoy y que atacan justo eso:

### 1. Residencia — el problema de los leads de fuera

Entran leads de fuera de España que no hablan español (4 en un día esta semana,
~13 % del mes). El curso es presencial en Barcelona.

> **¿Dónde vives ahora mismo?**
> · Barcelona o área metropolitana · Resto de Cataluña · Resto de España · Fuera de España

No descartamos a nadie automáticamente, pero «Fuera de España» baja la
prioridad y entra en una secuencia distinta.

### 2. Formato de la entrevista — la palanca directa contra el plantón

Online planta al 44 %, presencial al 74 %. Si la persona elige el formato, se
compromete.

> **La entrevista de admisión, ¿cómo la prefieres?**
> · Por videollamada (20 min) · En la escuela, en Barcelona

Que la opción online salga **primera y por defecto**.

### 3. Cuándo quiere empezar — el mejor proxy de intención que existe

> **¿Cuándo te gustaría empezar?**
> · Lo antes posible · En los próximos 3 meses · Más adelante, estoy informándome

«Estoy informándome» no es un mal lead: es un lead de secuencia de email, no de
llamada urgente. Hoy los tratamos igual y por eso quemamos agenda.

## El formulario que propongo

| # | Pregunta | Tipo | Para qué |
|---|---|---|---|
| 1 | Nombre y apellidos | texto | — |
| 2 | Teléfono (con prefijo) | tel | Teléfono español +10 · extranjero −15 · inválido −30 |
| 3 | Email | email | Secuencias |
| 4 | **¿Sabes nadar?** | Sí / No, pero puedo aprender / No | **−20 / −40.** Requisito real del curso |
| 5 | **¿Dónde vives ahora mismo?** | 4 opciones | Filtra el lead de fuera |
| 6 | **¿Cuándo te gustaría empezar?** | 3 opciones | Separa llamada urgente de secuencia |
| 7 | **Formato de entrevista** | Videollamada / Presencial | Ataca el plantón |
| 8 | ¿Hablas inglés? | Sí / No, pero lo estoy aprendiendo / No | ±10 |

Son 8 campos, de los que 3 son datos de contacto. **Quito estudios y edad**, que
no predicen nada, y añado tres que atacan los dos problemas reales de la cuenta.

### Para el formulario instantáneo de Meta

Ahí cada pregunta pesa el doble en el CPL. Versión corta: **contacto + nadar +
residencia + cuándo empezar.** El formato de entrevista y el inglés se preguntan
al agendar, no al captar.

### Para la landing

La versión completa de 8 campos. El lead de landing ya ha hecho el esfuerzo de
leer, aguanta más preguntas y convierte mejor.

## Aviso honesto sobre los pesos

«Nadar», «inglés» y «teléfono» tienen peso **medido** contra resultados reales.
Residencia, cuándo empezar y formato de entrevista son **hipótesis razonadas**:
no tienen histórico porque nunca se han preguntado. Hay que dejarlas correr un
mes antes de ponerles puntos en el scoring, y entonces medirlas igual que medimos
las otras — que es como descubrimos que la versión 1 del scoring estaba invertida.

## Ojo: el campo «Lead Temperature» solo admite 4 valores

`Caliente` · `Tibio` · `Frio` · `Congelado`, con esa grafía exacta. Es un
desplegable de GHL, no texto libre. Escribir `caliente` o `templado` deja el
campo con un valor que ninguna lista inteligente de GHL reconoce, y la etapa
🔥 Lead caliente no se activa. Pasó: 51 contactos quedaron así.
