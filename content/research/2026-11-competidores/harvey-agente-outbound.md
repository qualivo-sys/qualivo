# Harvey · agente de prospección por email en frío (para analizar el 2-nov)

> Fuente: README de github.com/ethanplusai/harvey (v0.2.1, licencia MIT), leído el 1-nov-2026. Lo vio Maikel en un reel de @el_hipster («Comenta HARVEY y te envío la guía»), pero no es suyo: es código abierto y gratis.

## Qué hace [C]
- Corre en local en bucle cada 15 min. Cada vuelta decide qué toca, en este orden: contestar respuestas, enviar campañas, escribir campañas, buscar negocios nuevos y, si no hay nada, analizar.
- **Busca negocios** en OpenStreetMap (gratis) o en Google Maps (DataForSEO, unos 0,002 $ por búsqueda).
- **Mira la web de cada negocio** (sin gastar en IA) y anota hasta 29 señales; tú confirmas cuáles usar. Las que nos interesan:
  - hace anuncios en Meta o en Google;
  - no tiene reserva online;
  - qué agencia le lleva el marketing;
  - qué puestos está contratando.
- **Busca el email del que decide** a partir del patrón de direcciones de su web.
- **Escribe una secuencia de 3 emails** (de menos de 75, 75 y 40 palabras), con una lista de frases prohibidas que suenan a IA.
- **Lee y clasifica las respuestas** y lleva el pipeline: contacto inicial → conversación → cualificación → presentación → negociación → cierre.
- **Panel en localhost:5555:** pipeline, bandeja de aprobación y conversaciones.
- **Coste:** usa la suscripción de Claude Pro/Max (vía Claude Code) o la de ChatGPT (vía Codex); no hay factura de API.
- **Por defecto cada email espera aprobación.** Tiene un filtro previo (etiquetas sin rellenar, frases prohibidas, longitud) y un interruptor que para todos los envíos.

## Para qué nos serviría
1. **Outbound propio de Qualivo:** que nos entren clientes sin depender solo de Meta (viernes 31-oct: 20,22 € y 0 leads).
   - Grupo objetivo: academias y formaciones en España **que hacen anuncios en Meta Y no tienen reserva online**.
   - El email nombra esa fuga concreta.
2. **Referencia de producto:** su pipeline y su bandeja de aprobación se parecen a nuestro panel. Es un buen modelo de «nada sale sin ti», el argumento de Anna.

## Riesgos y lo que habría que hacer [E]
- **Dominio aparte para enviar** (nunca qualivo.io), con Google Workspace (unos 7 € al mes) y 2-3 semanas de calentamiento antes de enviar.
- **Legal en España:** la LSSI y el RGPD limitan el email comercial no solicitado, también entre empresas. Hay que revisarlo con quien lleve lo legal antes de enviar a escala.
- **OpenStreetMap tiene muy pocas academias españolas:** usar la fuente de Google Maps.
- **Instrucciones y ejemplos en inglés:** hay que adaptarlos al español y a nuestra voz (contrabrief).
- **Dónde corre:** con una sesión de Claude iniciada en el Mac de Maikel o en un VPS. No funciona en una sesión en la nube.

## Decisión para el lunes
- ¿Hacemos una prueba de 2 semanas en modo aprobación, con unos 20 envíos al día a academias que hacen anuncios en Meta?
- Si sí, Growth prepara:
  - la configuración en español;
  - el filtro de academias;
  - los 3 emails;
  - el dominio y el calentamiento (esto requiere el OK de Maikel para comprar el dominio).
