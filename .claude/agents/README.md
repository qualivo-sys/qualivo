# Agentes del ecosistema

Subagentes de Claude Code compartidos por el equipo. Viven aquí (versionados en
el repo) para que sean la fuente de verdad y cualquiera del equipo los tenga al
clonar.

## Agentes disponibles

| Agente | Para qué sirve |
|---|---|
| `chief-content-officer` | Chief Content Officer del ecosistema (Qualivo, Hack the Prompt, Agentome). Convierte el trabajo real en activos de contenido: propone contenido, diseña estrategia editorial, decide qué documentar y reutiliza cada pieza en varios formatos. Piensa como el CCO de Notion/Linear/Stripe. Nunca propone por tendencias: parte de lo que realmente construimos. |
| `radar-scout` | Feeder del Radar IA. Mantiene fresca la base de datos "📡 Radar IA Marketing" en Notion: rastrea las noticias de IA relevantes de la semana, las puntúa, las mapea a clientes y escribe los hallazgos. Es la fuente de contexto que consume el `chief-content-officer`. Pensado para correr semanalmente (programado). |

## Uso dentro de este repo

Ya funcionan sin hacer nada. Invócalos por nombre, por ejemplo:

> Actúa como el `chief-content-officer` y propón contenido a partir del trabajo
> de esta semana.

## Usarlos en TODOS tus proyectos (instalación global)

El CCO está pensado para todo el ecosistema, no solo para este repo. Para tenerlo
disponible en cualquier carpeta desde la que abras Claude Code, cópialo (o
enlázalo) a tu carpeta de agentes de usuario:

```bash
mkdir -p ~/.claude/agents
# Copia (una foto puntual):
cp .claude/agents/chief-content-officer.md ~/.claude/agents/

# …o enlaza (se mantiene sincronizado con el repo):
ln -sf "$(pwd)/.claude/agents/chief-content-officer.md" ~/.claude/agents/
```

> Recomendación: usa el enlace simbólico. Así, cuando actualices el prompt del
> agente en el repo, tu versión global se actualiza sola.
