# AI Video Factory — Fase 1

> Estado a 17-ago-2026. La integración con Kling **ya funciona** (probada esta noche
> vía Higgsfield: Claude → MCP → Kling → tarea → estado → URL → descarga local).
> Esta fase NO la toca. Aquí solo se construye la capa de decisión: idea → guion →
> storyboard → aprobación humana. **No se genera vídeo.**

```
IDEA → CONTEXTO → CONCEPTO → GUION → STORYBOARD → APROBACIÓN → generación
```

## Estructura

```
video-factory/
├── README.md              este archivo
├── esquema.json           forma que debe tener todo storyboard
├── generar.mjs            idea → guion + storyboard (Claude API, salida estructurada)
└── projects/
    └── video-001/
        ├── brief.md
        ├── script.md
        ├── storyboard.json
        ├── storyboard.md
        └── references/
            └── estilo.md
```

## Cómo se ejecuta

```bash
export ANTHROPIC_API_KEY=...
node video-factory/generar.mjs "Los anuncios dentro de ChatGPT van a cambiar la forma de hacer publicidad"
```

Crea la carpeta del proyecto siguiente y **se para**. No llama a Kling.

---

## Cuatro cosas aprendidas que cambian el diseño

### 1. El texto a vídeo NO da consistencia de personaje

Este es el problema de fondo de la Fase 2 y conviene decidirlo ahora. Si generas
ocho planos por texto, salen ocho personas distintas. Da igual lo detallado que
sea el prompt.

**La única forma que funciona:** generar **una imagen de referencia** del personaje
y la localización, y usar **`image_to_video` en todos los planos** partiendo de esa
misma imagen. Por eso el esquema obliga a declarar `referencia_id` en cada plano y
la carpeta `references/` existe desde la Fase 1, no desde la 2.

### 2. Los prompts de Kling van en inglés

El prompt en castellano funcionó en la prueba, pero el modelo está entrenado
mayoritariamente en inglés y chino. El esquema guarda **el texto y la voz en
castellano** —que es lo que se lee y se locuta— y **el prompt visual en inglés**.

### 3. Kling devuelve 720×1280 a 24 fps

El material de móvil de Maikel es 4K a 30 fps. Si se mezclan sin igualar, el corte
tira. El storyboard marca cada plano como `generado` o `rodado` para que el motor
de montaje sepa qué normalizar.

### 4. Coste real por plano

10 creditos de Higgsfield por plano de 5 s con `kling3_0`. Un vídeo de 35 s con 8
planos generados sale por unos **80 creditos**. Con 270 de saldo: tres vídeos.
Por eso el storyboard marca qué planos merecen generarse y cuáles se resuelven con
material propio o con rótulo.

---

## Regla que gobierna el contenido

Todo guion pasa por `content/guia-de-voz.md`: sin anglicismos de marketing, sin
lenguaje de consultora, sin gurú. Y por la regla editorial de ago-2026: **ningún
resultado de cliente en contenido**, ni anonimizado.
