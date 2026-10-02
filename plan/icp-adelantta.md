# ICP del Sistema de Growth + IA (el que compró Adelantta)

Definido a partir del primer caso que ha funcionado de verdad: reunión con
Adelantta, propuesta bien recibida y alta probabilidad de firma. 17-ago-2026.

---

## Qué es realmente Adelantta

No es "una empresa de RRHH". Ese es el error de leer el caso por el sector.
Lo que la convierte en compradora ideal son cinco rasgos, y ninguno es el sector.

1. **Cuatro líneas de servicio compitiendo por el mismo presupuesto**: formación,
   selección, consultoría y HRO. Nadie sabe qué línea genera qué negocio. Ese es
   exactamente el problema que Qualivo dice resolver.
2. **Venta consultiva B2B de ticket medio**. Entre el lead y la firma hay
   proceso, personas y tiempo. Sin eso no hay fugas que encontrar.
3. **Una sola persona de marketing**, no un equipo. En Adelantta es una
   Responsable de Comunicación y Marketing. Este rasgo es el más importante y el
   menos obvio: siente el dolor todos los días, no tiene medios para resolverlo,
   y es quien defiende la propuesta dentro de la empresa.
4. **Base de clientes existente**. Permite prometer cross-sell y reactivación,
   que es la parte más fácil de demostrar y la que da resultados en semanas.
5. **Sector tradicional donde la IA todavía suena a ventaja**, no a obviedad.

Tamaño real: pequeña. Apollo solo indexa 6 personas. El comprador es el Managing
Director, y decide él.

## La regla que resume el ICP

> Empresas de servicios profesionales B2B, 11 a 200 empleados, España, con varias
> líneas de servicio, equipo comercial y **entre 1 y 4 personas en marketing**.

El filtro de marketing es el que más afina. Con cero personas de marketing no hay
interlocutor ni cultura. Con más de cinco ya tienen equipo propio y no te
necesitan, o te compran solo ejecución.

## Sectores donde vive ese perfil

En orden de parecido con Adelantta:

1. **RRHH y talento**: selección, formación bonificada, consultoría de RRHH, HRO,
   ETT con servicios de valor. Pool en Apollo con el filtro completo: **559
   decisores**.
2. **Consultoría de gestión y organización** con varias áreas de servicio.
3. **Prevención de riesgos, salud laboral y compliance**, misma estructura de
   venta y mismos compradores.
4. **Formación empresarial y centros de FP privados**. Aquí además ya tenemos
   respuestas reales, es el vertical con más tracción de la máquina.
5. **Ingeniería y servicios técnicos B2B** con varias divisiones.

## Filtro de Apollo listo para usar

```
q_organization_keyword_tags: recursos humanos, selección de personal,
  formación para empresas, consultoría rrhh
person_locations / organization_locations: Spain
organization_num_employees_ranges: 11,50 · 51,200
person_seniorities: founder, owner, c_suite, director
organization_department_or_subdepartment_counts: {"master_marketing": {"min":1,"max":4}}
contact_email_status: verified
```

Devuelve 559 decisores. Con dedupe contra la lista de supresión compartida.

## Primeras 10 cuentas verificadas

| Empresa | Empleados | Decisor | Email |
|---|---|---|---|
| Grupo2000 (formación bonificada) | 73 | Estela García, Dtora. Operaciones | estela@grupo2000.es |
| Avansel (selección + transformación) | 58 | Rafa Terán, Founder | rafaelteran@avanselseleccion.es |
| Grup Montaner (multi división RRHH) | 54 | Joan Montaner, Director General | joan@grupmontaner.com |
| GLM Gestora Laboral Mediterránea | 36 | Joaquim Ayza, CEO | ayza@glm-ett.com |
| Beta Formación | 32 | Atena Vilciu, Subdirección | atena@betaformacion.com |
| equilibrha (consultoría RRHH) | 29 | Beatriz Sánchez, Socia Directora | bsanchez@equilibrha.es |
| TTI Success Insights España | 20 | Javier Mazario, CEO | d.producto@ttisuccessinsights.es |
| Uare Important People | 18 | Johanna Ruiz, COO | jruiz@uare.es |
| People2People | 12 | Manuela Arjona, CEO & Founder | manuela.arjona@people2people.es |
| Ceifor Estudios | 12 | Ceifor Estudios | ceiforestudios@ceiforestudios.com |

Grup Montaner es el más parecido a Adelantta de todos: varias divisiones,
CMO propio, director general accesible. Audiolís, Grupo Piquer y Safe Formación
salieron en la búsqueda pero ya están contactados por Qualivo.

## El mensaje para este ICP

No es el de las fugas genéricas. El gancho aquí es **la competencia entre líneas
de servicio**, que es lo que les duele y nadie les nombra.

> Asunto: vuestras cuatro líneas de servicio
>
> Hola {{firstName}},
>
> He visto que en {{companyName}} trabajáis varias líneas a la vez, formación,
> selección y consultoría entre ellas.
>
> Lo que suelo encontrar en empresas así es que el marketing es común pero el
> negocio de cada línea es muy distinto, y al final nadie sabe qué línea genera
> los clientes que de verdad interesan. Se acaba invirtiendo igual en todas.
>
> ¿Tenéis medido qué parte de vuestras oportunidades viene de cada servicio y
> cuáles acaban cerrando?
>
> Si quieres le echo un vistazo y te digo qué miraría primero. Sin coste y por
> escrito.

Y el remate que solo funciona con este ICP: **la persona de marketing es aliada,
no obstáculo**. Merece la pena escribir también a ella, no solo al director
general, porque es quien lleva la propuesta dentro.

## Qué cambia en la propuesta

Adelantta compró un documento de 24 páginas con todo el abanico. Para este ICP
funciona, pero conviene sacar la página de "visión no es roadmap" al principio y
ajustar el alcance al precio, que hoy promete demasiado por 1.000 al mes.
