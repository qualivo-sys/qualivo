# Captura de leads — puesta en marcha

Sin esto, la campaña paga por cada lead y lo pierde. Son unos 10 minutos.

```
Formulario (landing)
   └─► POST /api/lead            función serverless en Vercel: valida, limita abuso
         └─► app web de Apps Script
               ├─► fila en la hoja "Antic Barcelona 113 — CRM de leads"
               ├─► email al usuario con la guía en PDF
               └─► aviso al comercial (marcado 🔥 si el lead es HOT)
```

## 1. Apps Script

1. Abre la hoja **[Antic Barcelona 113 — CRM de leads](https://docs.google.com/spreadsheets/d/11-rbXqLFf9rnHYNmvvTv_OkTeuzQ4y-dBf3H4n2O3YM/edit)**
   y borra la fila de ejemplo.
2. **Extensiones → Apps Script**. Borra lo que haya y pega el contenido de `Codigo.gs`.
3. **Configuración del proyecto → Propiedades del script**, añade:

   | Propiedad | Valor |
   |---|---|
   | `SECRETO` | una cadena larga al azar; la misma que pondrás en Vercel |
   | `EMAIL_AVISOS` | el correo donde quieres los avisos de lead nuevo |
   | `ID_GUIA_PDF` | id del PDF de la guía en Drive (se puede dejar para después) |

4. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **yo**
   - Quién tiene acceso: **cualquier usuario**
   - Copia la URL que termina en `/exec`

> La primera vez pedirá autorizar el acceso a Gmail y a la hoja. Es normal: el
> script manda los correos desde esa cuenta.

## 2. Vercel

En el proyecto `antic-barcelona-113` → Settings → Environment Variables:

| Variable | Valor |
|---|---|
| `LEAD_WEBHOOK_URL` | la URL `/exec` del paso anterior |
| `LEAD_SHARED_SECRET` | la misma cadena que pusiste en `SECRETO` |

Y redesplegar para que las lea.

## 3. Comprobar

Rellena el formulario de la guía en producción. Tienen que pasar tres cosas:

- aparece una fila nueva en la hoja
- llega el email con la guía
- llega el aviso al comercial

Si algo falla, el lead **no se pierde**: la función lo deja entero en los logs
de Vercel (Deployments → Functions → `/api/lead`).

## Notas

- El endpoint limita a **8 envíos por minuto y por IP**.
- Hay un campo trampa oculto (`web`): si un bot lo rellena, se descarta en
  silencio con respuesta 200 para no darle pistas.
- Cada lead arrastra sus UTMs y el `fbclid`, que es lo que permite atribuir una
  venta que se cierre ocho semanas después del clic.
- Si `LEAD_WEBHOOK_URL` no está configurada, el formulario sigue funcionando de
  cara al usuario pero la respuesta trae `stored: false` y el lead queda solo en
  los logs. **No lanzar la campaña en ese estado.**
