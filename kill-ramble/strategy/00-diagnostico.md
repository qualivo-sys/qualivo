# 00 · Diagnóstico y premisas

Antes de diseñar el sistema, cuatro hechos del juego que cambian el diseño. Ignorarlos es la forma más
rápida de montar una máquina de outreach que no mueva nada.

## Hechos verificados (ficha de Steam y prensa, sept. 2026)

| Hecho | Consecuencia para el sistema |
|---|---|
| El nombre público es **Don't Kill Rumble**, no «Kill & Ramble» | Todo el copy, dominios, UTM y press kit usan el nombre real. Un creador que reciba un email con el nombre mal escrito no abre el Steam. |
| Es un **brawler online de hasta 6 jugadores**, partidas de 5-7 min | Un creador que abre la demo solo ve un lobby vacío. El playtest no es «te mando una clave», es «te reservo una sesión con gente dentro». |
| La **demo es gratuita y pública** en Steam | No hay barrera de clave. La barrera es tiempo y atención. La oferta no es acceso, es una sesión divertida con otros. |
| La ficha sigue en **«próximamente»** sin fecha; la prensa anunció marzo 2026 | Sin fecha ni ventana, el contenido de creadores no convierte en wishlists con urgencia. Pedimos al estudio una ventana pública (trimestre) antes de la ola grande. |
| Idiomas: inglés + **español (España y LatAm)**; estudio argentino | Ventaja competitiva real en creadores hispanohablantes, un mercado menos saturado de outreach indie. Se ataca en paralelo a inglés, no después. |
| Etiquetas: party, físicas, PvP, cute, funny, «built for streamers» | El juego ya está diseñado para ser contenido. Los comparables son claros (ver abajo). |
| Anti-cheat de kernel (Easy Anti-Cheat) | Objeción habitual de algunos creadores y prensa. Se responde de forma proactiva en el FAQ del press kit. |
| Selección en Steam Next Fest, LAGS, The MIX, Indie Arena Booth (Gamescom) | Hay prueba social. Va en la segunda línea de cada mensaje, no en la primera. |

## Comparables (semilla de afinidad para descubrimiento y scoring)

Juegos cuyo público y creadores son los nuestros, por proximidad:

- **Núcleo:** Gang Beasts, Party Animals, Stick Fight: The Game, Pummel Party, Rubber Bandits, Havocado, Move or Die.
- **Adyacente físicas/caos:** Human Fall Flat, Fall Guys, Chained Together, Crab Game, Duck Game, Boomerang Fu, Ultimate Chicken Horse.
- **Adyacente party con amigos:** Golf With Your Friends, Knight Squad 2, Bopl Battle, Stumble Guys.

Un creador que ha publicado dos o más vídeos de la lista núcleo en los últimos 6 meses es un candidato
casi seguro. Uno que solo hace shooters competitivos, no lo es aunque tenga un millón de suscriptores.

## Tres correcciones de enfoque

1. **No estamos en un problema de base de datos.** Apollo no tiene a los creadores de YouTube ni de
   Twitch; los tiene a los periodistas. Sirve para prensa y poco más. El descubrimiento de creadores sale
   de las plataformas (Apify, SullyGnome, YouTube) y de mirar quién juega a los comparables.
2. **La unidad es el grupo, no el individuo.** Un juego de 6 se vende a squads que ya graban juntos.
   Convencer a uno del grupo trae a los otros cinco y la sesión sale sola.
3. **El activo no es la clave, es la sesión.** Se programan «Rumble Nights» semanales con hora fija
   (una ES/LatAm, una EN/EU-US) y el outreach invita a una fecha concreta. Esto elimina el lobby vacío,
   concentra feedback y produce clips con seis personas gritando, que es lo que TikTok premia.

## Lo que pedimos al estudio antes de la semana 2

- Ventana de lanzamiento pública o, si no, una fecha de «demo actualizada» que sirva de gancho.
- Un remitente humano con nombre y cara (Federico o el community manager) para todo el outreach.
- Press kit en `presskit()` o página equivalente: logos, capturas, GIFs de 5 s, tráiler, FAQ (EAC, cross-play, precio).
- Enlaces de Steam con UTM por creador (Steamworks admite UTM y muestra visitas y wishlists atribuidas).
- Un canal de Discord `#rumble-night` con el calendario fijado y rol `@Creator`.
