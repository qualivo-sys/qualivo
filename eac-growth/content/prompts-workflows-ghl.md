# EAC · Los 8 workflows de GoHighLevel

Sustituyen al borrador «Email Sequence Automation», que tenía la lógica cruzada
(acciones antes de la condición, emails encadenados bajo la rama «None», ramas
por etiqueta vacías y condiciones de salida puestas como disparadores).

La idea: **workflows pequeños y lineales**. La cola de emails de TCP existe una
sola vez (WF4b) y las cuatro entradas la alimentan con la etiqueta `seq-tcp`.

Crear en **Automatización → Workflows → Crear → Asistente de IA**, uno por uno,
en el orden 1 → 8. Publicar en ese mismo orden.

---

## 1 · WF4b · Secuencia TCP D1-D14

```
Crea un workflow llamado "WF4b · Secuencia TCP D1-D14".
Disparador: se añade al contacto la etiqueta "seq-tcp". El mismo contacto no puede entrar dos veces.
Primero una condición: si el contacto tiene la etiqueta "caliente" → Finalizar workflow. Si no, continuar.
Después, en línea y sin más condiciones:
esperar 1 día → enviar plantilla "EAC · S1 TCP · D1 · Mitos"
esperar 2 días → "EAC · S1 TCP · D3 · Sueldo"
esperar 2 días → "EAC · S1 TCP · D5 · Curso oficial"
esperar 3 días → "EAC · S1 TCP · D8 · Selección"
esperar 3 días → "EAC · S1 TCP · D11 · Precio"
esperar 3 días → "EAC · S1 TCP · D14 · Cierre"
Finalizar workflow.
Las esperas son retrasos simples de días; no añadas pasos de franja horaria.
```

## 2 · WF4 · Entrada · Test TCP

```
Crea un workflow llamado "WF4 · Entrada · Test TCP".
Disparador: se añade la etiqueta "lm-test-tcp". Sin reentrada.
Acciones en línea: enviar plantilla "EAC · S1 TCP · D0 · Tu resultado" → añadir la etiqueta "seq-tcp" → Finalizar workflow.
```

## 3 · WF4 · Entrada · Calculadora

```
Crea un workflow llamado "WF4 · Entrada · Calculadora".
Disparador: se añade la etiqueta "lm-calc-sueldo". Sin reentrada.
Acciones en línea: enviar plantilla "EAC · S1 TCP · D0b · Calculadora (entrega)" → añadir la etiqueta "seq-tcp" → Finalizar workflow.
```

## 4 · WF4 · Entrada · Guía

```
Crea un workflow llamado "WF4 · Entrada · Guía".
Disparador: se añade la etiqueta "lm-guia-seleccion". Sin reentrada.
Acciones en línea: enviar plantilla "EAC · S1 TCP · D0c · Guía de selección (entrega)" → añadir la etiqueta "seq-tcp" → Finalizar workflow.
```

## 5 · WF4 · Entrada · Anuncios TCP

```
Crea un workflow llamado "WF4 · Entrada · Anuncios TCP".
Disparador: se añade la etiqueta "lead-tcp". Sin reentrada.
Primera acción, una condición que debe cumplir TODO esto (Y):
  Etiquetas contiene "lead paid"
  Etiquetas no contiene "lm-test-tcp"
  Etiquetas no contiene "lm-calc-sueldo"
  Etiquetas no contiene "lm-guia-seleccion"
Si NO se cumple → Finalizar workflow.
Si se cumple → enviar plantilla "EAC · S1 TCP · D0p · Bienvenida (anuncios)" → añadir la etiqueta "seq-tcp" → Finalizar workflow.
```

## 6 · WF4 · Despachador

```
Crea un workflow llamado "WF4 · Despachador".
Disparador: se añade la etiqueta "lm-temario-fd". Sin reentrada.
En línea: enviar "EAC · S2 FD · D0 · Temario"
esperar 2 días → "EAC · S2 FD · D2 · No es controlador"
esperar 3 días → "EAC · S2 FD · D5 · Perfil"
esperar 4 días → "EAC · S2 FD · D9 · Cierre"
Finalizar workflow. Retrasos simples de días, sin pasos de franja horaria.
```

## 7 · WF4 · Cabina o tierra

```
Crea un workflow llamado "WF4 · Cabina o tierra".
Disparador: se añade la etiqueta "lm-test-perfil". Sin reentrada.
En línea: enviar "EAC · S3 Perfil · D0 · Comparativa"
esperar 2 días → "EAC · S3 Perfil · D2 · Tierra"
esperar 3 días → "EAC · S3 Perfil · D5 · Formación"
esperar 4 días → "EAC · S3 Perfil · D9 · Cierre"
Finalizar workflow. Retrasos simples de días, sin pasos de franja horaria.
```

## 8 · WF4 · Lead caliente blog

```
Crea un workflow llamado "WF4 · Lead caliente blog".
Disparador: se añade la etiqueta "caliente". Permitir reentrada.
Primera acción, condición: el contacto tiene la etiqueta "lead-magnet". Si no → Finalizar workflow.
Si sí: crear tarea para el propietario del contacto con título "Llamar en menos de 1 hora — lead caliente del blog" → enviar notificación interna al equipo comercial → eliminar al contacto de los workflows "WF4b · Secuencia TCP D1-D14", "WF4 · Despachador" y "WF4 · Cabina o tierra" → Finalizar workflow.
```

Los calientes que vienen de anuncios ya los cubre `WF1 · Speed-to-Lead Hot TCP`.

---

## A mano, en el editor (el asistente no llega)

Solo en los que tienen esperas — **1, 6 y 7** — abrir ⚙️ Ajustes y poner:

- **Ventana de tiempo**: lunes a viernes · 09:00–19:00 · Europe/Madrid
- **Detener al responder**: activado
- **Objetivos (Goals)** → *Finalizar workflow* cuando:
  - la etapa de la oportunidad cambie a `Entrevistado` o `Negociación`
  - la oportunidad se marque como ganada
  - se añada la etiqueta `no-cumple-requisitos` o `descartado`

En el **8**: abrir la tarea y poner vencimiento **1 hora**.

## Prueba antes de publicar el 5

Contacto con tu email + etiquetas `lead-tcp` y `lead paid` → debe recibir la D0p
y aparecer en WF4b con `seq-tcp`. Añadirle `caliente` + `lead-magnet` → sale de
WF4b y se crea la tarea. Borrar el contacto y publicar.
