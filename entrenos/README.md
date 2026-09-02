# Entrenos — app personal de entrenamiento

App para llevar **los entrenos de dos personas** (Maikel e Isa por defecto):
peso y medidas, un **plan de entrenamiento y de calorias generado a partir de
esos datos**, y el registro serie a serie de cada sesion con la carga sugerida
para la siguiente. Next.js sobre Vercel, pensada para usarse desde el movil en
el gimnasio.

## Que hace

| Seccion | Para que sirve |
|---|---|
| **Hoy** | Resumen del dia: peso, grasa estimada, calorias, entrenos de la semana y boton para empezar la sesion que toca. |
| **Plan** | Rutina semanal completa (ejercicios, series, repeticiones, RIR y descansos), macros del dia y volumen semanal por musculo. Cada ejercicio se puede cambiar por otro del mismo patron. |
| **Medidas** | Peso y perimetros (cuello, cintura, cadera, pecho, brazo, muslo) con graficas de evolucion y estimacion de grasa corporal. |
| **Progreso** | Constancia por semanas, tonelaje, historial de sesiones y curva de fuerza (1RM estimado) por ejercicio. |
| **Perfil** | Objetivo, nivel, dias disponibles, material y molestias. Todo esto es lo que alimenta al generador del plan. |

## Como genera el plan

1. **Reparto semanal** segun los dias que puedas entrenar: 2-3 dias full body,
   4 dias torso/pierna, 5-6 dias empuje/tiron/pierna.
2. **Seleccion de ejercicios** por patron de movimiento (empuje y traccion
   horizontal y vertical, dominante de rodilla y de cadera, core y accesorios),
   filtrando por el material que tienes, tu nivel y las molestias que marques
   (una molestia de hombro descarta press militar y fondos, una de rodilla
   descarta zancadas y extensiones, etc.). Si un patron se queda sin opciones
   validas, se sustituye por uno equivalente.
3. **Series, repeticiones y RIR** segun el papel del ejercicio en la sesion
   (principal, secundario o accesorio), tu objetivo y tu experiencia.
4. **Progresion doble**: la app mira lo que levantaste la ultima vez y te dice
   que hacer hoy. Si completaste todas las series en el limite alto del rango
   con el RIR objetivo, sube el peso (y ya te lo precarga en la sesion). Si te
   quedaste corto, baja un 10%. Si no, mismo peso y una repeticion mas.

Si cambias algo del perfil que afecte a la rutina, la app avisa de que el plan
se ha quedado antiguo y ofrece regenerarlo.

## Como calcula las calorias

- **Metabolismo basal**: Mifflin-St Jeor.
- **Gasto diario**: basal x factor de actividad (1,2 a 1,725).
- **Objetivo**: -18% para perder grasa, +12% para ganar musculo, +5% en fuerza,
  con un **suelo de seguridad** (nunca por debajo del basal ni de 1.300 kcal en
  mujeres / 1.600 en hombres).
- **Proteina**: 2,4 g por kg de masa magra si se conoce la grasa corporal; si no,
  1,8-2,2 g por kg de peso segun objetivo. **Grasa**: 0,8 g/kg minimo.
  **Carbohidratos**: el resto.
- **Grasa corporal**: formula de perimetros de la US Navy (hace falta cuello y
  cintura, y ademas cadera en mujeres).
- **Ajuste automatico**: compara la tendencia real de peso (regresion lineal de
  las ultimas 4 semanas) con el ritmo objetivo y propone subir o bajar calorias.

> Son estimaciones con formulas estandar, no consejo medico. Ante patologias,
> embarazo, lesiones o dudas, que lo revise un medico o un dietista-nutricionista.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # opcional: funciona sin tocar nada
npm run dev                  # http://localhost:3000
```

Sin configurar nada, la app guarda los datos en el **navegador**
(`localStorage`): funciona al momento, pero cada dispositivo tiene los suyos.

## Despliegue en Vercel

1. Conecta el repo a un proyecto de Vercel y pon **Root Directory** en `entrenos`.
2. Deploy. Ya es usable.
3. Para que los datos se sincronicen entre el movil y el ordenador:
   **Storage → Create Database → Neon (Postgres)** y conectala al proyecto.
   Vercel inyecta `DATABASE_URL` y la app crea sola su tabla (`entrenos_estado`)
   en la primera visita. No hay migraciones que ejecutar.
4. Para que la URL no quede abierta, define `APP_PASSCODE` con un codigo: la app
   lo pedira antes de entrar y lo recordara 180 dias en ese dispositivo.

### Variables de entorno

| Variable | Obligatoria | Para que |
|---|---|---|
| `DATABASE_URL` | no | Postgres/Neon. Sin ella, los datos viven solo en el navegador. |
| `POSTGRES_URL` | no | Alternativa para bases antiguas de Vercel Postgres. |
| `APP_PASSCODE` | no | Codigo de acceso. Sin ella la app queda abierta. |
| `NEXT_PUBLIC_PERFILES` | no | Perfiles, formato `id:Nombre,id2:Nombre2`. Por defecto `maikel:Maikel,isa:Isa`. |

## Estructura

```
src/
  app/
    page.tsx                       Selector de perfil
    acceso/page.tsx                Puerta con codigo (si hay APP_PASSCODE)
    [perfil]/layout.tsx            Cabecera, navegacion y estado compartido
    [perfil]/page.tsx              Hoy
    [perfil]/plan/page.tsx         Plan de entreno + nutricion
    [perfil]/medidas/page.tsx      Peso, perimetros y graficas
    [perfil]/progreso/page.tsx     Historial, constancia y fuerza
    [perfil]/perfil/page.tsx       Datos y objetivo
    [perfil]/entreno/[dia]/        Registro de la sesion, serie a serie
    api/estado/[perfil]/route.ts   Lectura y guardado del documento del perfil
    api/acceso/route.ts            Comprobacion del codigo
  lib/
    types.ts          Modelo de datos
    ejercicios.ts     Catalogo (~55 ejercicios con patron, material y tecnica)
    planificador.ts   Plantillas semanales, seleccion de ejercicios y pautas
    progresion.ts     Progresion doble, 1RM estimado, tonelaje y constancia
    nutricion.ts      Mifflin-St Jeor, macros y ajuste segun tendencia real
    cuerpo.ts         IMC, grasa US Navy, masa magra y tendencia de peso
    estado-cliente.tsx  Estado en React + guardado (nube o navegador)
    db.ts             Postgres/Neon
  components/         Grafica SVG, navegacion e indicador de guardado
```

Cada perfil se guarda como **un unico documento JSON** (perfil + medidas +
sesiones + plan). Es de sobra para dos personas, evita migraciones y permite que
la copia del navegador y la de la nube tengan exactamente la misma forma: si te
quedas sin cobertura en el gimnasio, sigues registrando y se sincroniza al salir.

Desde **Perfil → Descargar mis datos** te llevas todo en un `.json`.
