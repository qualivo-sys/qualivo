# Carga de leads · jueves 27 de agosto

## Por qué esta carga era la prioridad

El 26 de agosto el sistema entero envió **7 emails**. No fue un problema de
reputación ni de horario: `notStarted = 0` en todas las campañas activas. El
depósito estaba vacío. Con un techo operativo de 275 envíos/día, la única
palanca real era meter leads nuevos investigados.

## Qué se hizo

Dos búsquedas en Apollo, una por vertical:

- **Inmobiliarias**: `real estate` + `inmobiliaria`, España, 1-50 empleados,
  decisores (owner / founder / c_suite / director), email verificado. Página 9
  del pool (10.735 registros).
- **Solar**: `autoconsumo` + `instalacion fotovoltaica` +
  `photovoltaic installation`, mismos filtros. Página 2 del pool nuevo (780
  registros). Este es el tag corregido del 25-ago; el antiguo `solar energy`
  devolvía imprentas y lácteos.

De ahí, un decisor por dominio, priorizando propietario / fundador / director
general / director comercial sobre CFO o CTO.

## Filtros aplicados antes de enriquecer

Descartados por no ser ICP: fondos e inversión patrimonial (Kefren, Hestia, HZ,
Renta Corporación), promotoras grandes, SaaS y proptech (PRAGMA, Saresoft,
HabiHub, Rentuos, Alquiler Protegido), medios (RevistaSemana), asociaciones
(Cambra de la Propietat), arquitectura, mayoristas y fabricantes (ELNUR
Gabarrón, Suministros Orduña), consultoras genéricas y comercializadoras
eléctricas puras.

## Filtros aplicados después de enriquecer

- **60 decisores enriquecidos** (60 créditos de Apollo).
- **16 descartados por dominio catchall.** Apollo los marca "verified" y no lo
  están: es de donde salen los rebotes. Cayeron aquí Javier James, Inmobiliaria
  Bancaria, All4flat, Solozábal, trececasas, Choose Marbella, Véreo, Gecko,
  EFIWATT, Bonobo, Garuda Solar, Fotovol, Globeenergy, D2PLUS, Stinson y
  MyVatio.
- **4 duplicados** con campañas anteriores (email o dominio ya contactado).
- **1 descartado por dominio incoherente**: el CEO de Suma100 tenía email en
  `ienergyprojects.com`. Registro probablemente desactualizado.

## Resultado

| Campaña | ID | Cargados | notStarted tras la carga |
|---|---|---:|---:|
| Inmobiliarias ES · Genérica | 3772173 | 18 | 18 |
| Solar ES · Genérica | 3767479 | 18 | 18 |

Smartlead confirma 0 duplicados, 0 bloqueados, 0 emails inválidos en ambas.

Construcción (3715161) sigue en PAUSED con ~1.700 leads aparcados. No se carga
nada ahí hasta limpiarla.

## Estado del resto

Catalunya i Andorra (3858902) sigue con `sent=0` y `notStarted=9` porque su
ventana arranca hoy a las 09:00 de Madrid. A las 07:47 todavía no había
disparado.

Página consumida: inmo 9 (siguiente, la 10), solar 2 del tag nuevo (siguiente,
la 3).
