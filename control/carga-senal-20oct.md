# Carga por puertas de señal · 20-oct-2026

Orden de Maikel, 20-oct: «tenemos créditos de sobra en Apollo, recarga lo que necesites» y «las empresas de señales, que tenían CRM o campañas activas, son las que mejor funcionaron; igual no haría falta hacer tanto filtro».

## Qué se hizo

- **Búsqueda en Apollo** de personas que deciden en España, en empresas de servicios de 5 a 50 empleados, por tecnología: Google Ads, Meta y CRM (HubSpot, Salesforce, Zoho y Pipedrive). Se revelaron unas 320 personas, unos 320 créditos.
- **Filtro mínimo**, por entregabilidad y RGPD:
  - correo verificado y sin catch-all;
  - mismo dominio que la empresa;
  - sin buzones de rol;
  - sin contactos ya enviados ni empresas ya contactadas;
  - sin bloqueados;
  - fuera agencias, software y selección de personal.
- **Ya no se exige** la comprobación manual de la señal en la web ni el encaje con los tres sectores del Playbook. La señal es la tecnología que detecta Apollo.
- **Copy por lead** generado con `carga_v3.construir()`, la puerta correspondiente y el pie con identificación y BAJA. No se ha tocado ninguna secuencia. Script: `captacion/scripts/carga_senal.py`.

## Resultado: 102 leads nuevos en señal y 12 en el Playbook

| Puerta | Campaña | Leads nuevos |
|---|---|---:|
| Google Ads | 3963336 | 36 |
| Meta | 3964316 | 41 |
| HubSpot | 3940264 (motor V3, reactivada) | 12 |
| Salesforce | 3963217 | 7 |
| Zoho | 3964313 (reactivada) | 2 |
| Pipedrive | 3964076 (reactivada) | 4 |

El motor V3, Zoho y Pipedrive estaban en estado COMPLETED. Se arrancaron después de comprobar que ninguna tenía leads a medias: sus leads antiguos estaban terminados o pausados a nivel de lead, y un lead pausado no se reanuda al arrancar la campaña.

## Lo que se aprende

**Rendimiento de lo revelado:** de cada 3 personas reveladas, solo 1 acaba cargada. Las demás caen por:

| Motivo | Personas |
|---|---:|
| Catch-all | 85 |
| Ya contactados | 63 |
| Dominio cruzado | 28 |
| Sector fuera | 22 |
| Empresa ya contactada | 11 |

**La base española de Apollo para este perfil está muy trabajada.** Para sostener 100 leads nuevos al día hacen falta unos 300 créditos diarios, o bien abrir nuevas fuentes (Maps → dominio → Apollo) y nuevos sectores.
