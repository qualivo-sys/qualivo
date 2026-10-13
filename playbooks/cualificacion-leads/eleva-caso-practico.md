# Cualificación de leads · caso Eleva Academy (13-oct-2026)

Aplicación del playbook `README.md` a Eleva (GoHighLevel + Meta + Google). Lo primero fue falsificar el
scoring v2 que ya corría en n8n, y salió lo mismo que en EAC: **puntuaba al revés en un criterio y puntuaba
el resultado** (daba +25 por cita agendada y +30 por entrevista realizada, así que "caliente" llegaba
después de lo que quería predecir).

## 1. Falsificación (1.809 leads con trato desde mayo; 1.197 con más de 30 días)

Evento de valor: **entrevista realizada** (160). Matrícula (24) solo como contraste.

| Señal | Valores | Entrevista | Decisión |
|---|---|---|---|
| ¿Cuándo empezar? | Cuanto antes 7,1 % · 1-3 meses 7,3 % · Solo me informo 5,0 % | ×1,4 | se queda, peso bajo |
| ¿Inversión? | Financiación 6,9 % · Ajustado 4,7 % · **Sin problema 4,9 %** · Gratuito 7,8 % | no monótona | **fuera del scoring** (v2 le daba +10 a "sin problema" y −10 a "gratuito") |
| Nivel actual | 0 de 1.809 rellenos | — | campo muerto |
| Fuente | Landing 7,2 % · Google 8,6 % · Instantáneo 4,2 % | ×1,7 | se queda |
| Teléfono con formato imposible | 0 de 26 | descalificador | clase D, aparte de los puntos |
| Calligence: inválido | 0,8 % vs 8,6 % | descalificador | clase D |
| No responde (5 intentos) | 1,3 % vs 6,6 % | descalificador | clase D |
| Cita agendada (calligence: éxito) | 30,6 % vs 4,3 % | ×7 | clase A directa (es comportamiento) |
| Responde WhatsApp | 1 contacto etiquetado | **no se recoge** | pedir a Calligence que etiquete |
| Hora, día, dominio de email, apellido | ruido | — | fuera |

Trampa del desplegable, también aquí: 51 contactos con "Buscaba algo gratuito" en el campo de inversión B,
valor que ese campo no tenía en sus opciones (estaba en el campo A, que nadie usa). Corregido añadiendo la
opción al campo B.

## 2. Simulación sobre el histórico

| Modelo | A | B | C | D |
|---|---|---|---|---|
| Solo formulario (pre-llamada) | nadie | 1.005 · 6,8 % | 165 · 4,2 % | 27 · 0 % |
| Formulario + comportamiento | 144 · 13,9 % | 513 · 8,6 % | 94 · 7,4 % | 446 · 0,9 % |
| v2 anterior (declarado) | — | "templado" 901 · 6,9 % | "frío" 296 · 4,4 % | — |

Lectura honesta: **con lo que el lead declara solo se separa a quién no llamar (D) y a quién llamar
después (C)**. La clase A nace del comportamiento. Las dos preguntas nuevas (en qué punto estás, franja
horaria) van como hipótesis sin histórico y se miden a un mes.

## 3. Modelo en producción (n8n "Eleva · Lead scoring v2")

Pre-llamada (máximo 85 ≥ 75, comprobado): cuándo 25/25/5 (sin respuesta 15) · fuente 20/10/15 ·
teléfono válido 15 · en qué punto estás 20/15/10/0 (sin pregunta 10 + etiqueta `sin-formulario-nuevo`) ·
franja horaria 5. Descalificadores aparte: teléfono dudoso, `calligence: inválido`, `no-responde` → clase D
(`lead-descartado`). Comportamiento: cita agendada o entrevista → A; `respondio-wa` +20; `cogio-llamada` +10;
`email-click` +10; `email-abierto` +5.

Clases → etiquetas existentes: A 75-100 `lead-caliente` · B 50-74 `lead-templado` · C 25-49 `lead-frio` ·
D 0-24 `lead-descartado`. Nuevo A → tarea "llamar hoy" al comercial.

## 4. Formulario recomendado (mismas opciones, carácter a carácter, que el CRM)

Landing: nombre · email · móvil (+34, 9 cifras) · ¿Cuándo te gustaría empezar? · ¿En qué punto estás? ·
¿Cuándo te viene mejor que te llamemos? Fuera: inversión (no predice y cuesta leads), nivel actual.
Instantáneo de Meta: contacto + cuándo empezar + franja horaria.
