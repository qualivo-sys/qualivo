# paid · el trabajo de campañas

Separado de `content/`, que es lo editorial. Aquí vive lo que tiene que ver con
dinero invertido en anuncios.

**Fuera del despliegue.** `paid` está en `.vercelignore` igual que `captacion` y
`content`: el repositorio es público y esto no se sirve en qualivo.io.

## Qué va en cada sitio

- **`devoluciones/`** — lo que el agente de paid devuelve: inventarios de lo que
  está corriendo, lecturas de resultados, decisiones y por qué se tomaron. Un
  fichero por fecha, con el dato leído de la API y no de memoria.

## Reglas de esta carpeta

1. **Cero cifras sin fuente.** Todo número sale de la API de Meta o del CRM, y
   se dice de dónde. Si no se ha podido leer, se dice que no se ha podido.
2. **Las decisiones se escriben con su motivo**, incluido lo que se decidió NO
   hacer. Una decisión sin motivo no se puede revisar dentro de un mes.
3. **Nunca claves aquí dentro.** Identificadores de campaña sí, credenciales no.
