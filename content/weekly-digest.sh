#!/usr/bin/env bash
#
# weekly-digest.sh — Materia prima de contenido a partir del trabajo real.
#
# Vuelca lo que se ha construido de verdad en el repo (commits + estadísticas)
# durante un periodo, para que el Chief Content Officer parta de hechos y no de
# tendencias.
#
# Uso:
#   bash content/weekly-digest.sh          # últimos 7 días
#   bash content/weekly-digest.sh 14       # últimos N días
#   bash content/weekly-digest.sh 30 all   # N días, todos los autores
#
# Por defecto muestra solo tus commits (los del email configurado en git).
# Pasa "all" como segundo argumento para ver los de todo el equipo.

set -euo pipefail

DAYS="${1:-7}"
SCOPE="${2:-mine}"

# Colócate en la raíz del repo aunque se ejecute desde otra carpeta.
cd "$(git rev-parse --show-toplevel)"

SINCE="${DAYS} days ago"

AUTHOR_FILTER=()
if [ "$SCOPE" != "all" ]; then
  ME="$(git config user.email || true)"
  if [ -n "$ME" ]; then
    AUTHOR_FILTER=(--author="$ME")
  fi
fi

echo "============================================================"
echo "  DIGEST DE CONSTRUCCIÓN — últimos ${DAYS} días"
echo "  Rama: $(git rev-parse --abbrev-ref HEAD)"
if [ "$SCOPE" != "all" ] && [ -n "${ME:-}" ]; then
  echo "  Autor: ${ME}"
else
  echo "  Autor: todo el equipo"
fi
echo "============================================================"
echo

COUNT="$(git log --since="$SINCE" "${AUTHOR_FILTER[@]}" --oneline | wc -l | tr -d ' ')"

if [ "$COUNT" -eq 0 ]; then
  echo "Sin commits en el periodo. Materia prima del repo = vacía."
  echo "→ Pregunta al fundador qué se construyó fuera del repo esta semana."
  exit 0
fi

echo "## $COUNT commits en el periodo"
echo
echo "------------------------------------------------------------"
echo "## TITULARES (qué se construyó)"
echo "------------------------------------------------------------"
git log --since="$SINCE" "${AUTHOR_FILTER[@]}" \
  --pretty=format:"• %ad  %s" --date=short
echo
echo

echo "------------------------------------------------------------"
echo "## DETALLE POR COMMIT (cuerpo + archivos tocados)"
echo "------------------------------------------------------------"
git log --since="$SINCE" "${AUTHOR_FILTER[@]}" \
  --stat --pretty=format:"%n▸ %ad  %h%n  %s%n%w(0,2,2)%b" --date=short
echo

echo "============================================================"
echo "  Siguiente paso para el CCO:"
echo "  De cada bloque, extrae 1 ángulo de contenido y respóndelo"
echo "  con los 8 puntos (objetivo, público, hook, desarrollo, CTA,"
echo "  reutilización, empresa que alimenta, formatos)."
echo "============================================================"
