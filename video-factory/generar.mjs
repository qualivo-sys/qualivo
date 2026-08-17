// idea → guion + storyboard. NO genera vídeo: se para y espera aprobación humana.
//
//   export ANTHROPIC_API_KEY=...
//   node video-factory/generar.mjs "tu idea aquí"
//
// Escribe projects/video-NNN/ con brief.md, script.md, storyboard.json y storyboard.md.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { validarStoryboard } from './validar.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');
const esquema = JSON.parse(readFileSync(join(AQUI, 'esquema.json'), 'utf8'));

const idea = process.argv.slice(2).join(' ').trim();
if (!idea) {
  console.error('Uso: node video-factory/generar.mjs "la idea del vídeo"');
  process.exit(1);
}

// La voz de la marca no se improvisa: se lee del documento canónico.
const voz = readFileSync(join(RAIZ, 'content', 'guia-de-voz.md'), 'utf8');
// Las reglas del director no se repiten a mano: se leen del documento canónico.
const reglas = readFileSync(join(AQUI, 'reglas-del-director.md'), 'utf8');

const SISTEMA = `Eres el director de una productora pequeña que hace vídeo vertical
para Maikel Echevarría. Conviertes una idea en un guion de 30-45 segundos y en un
storyboard plano a plano.

REGLAS DURAS
- La voz de los planos va en castellano y cumple la guía de voz que viene abajo.
  Nada de anglicismos de marketing: embudo, no funnel. Página, no landing.
  Contacto o interesado, no lead.
- Ningún resultado de cliente, ni anonimizado. Regla editorial de agosto de 2026.
- Ninguna predicción sin coste ni frase de gurú. Se dice lo que se sabe.
- Todo dato del guion necesita fuente en "hechos_verificados". Si no tienes la
  fuente, no metes el dato.
- Los planos donde Maikel afirma algo o pone un ejemplo propio van con origen
  "rodado": su cara sostiene la credibilidad. Los planos de apoyo, ambiente o
  metáfora van "generado".
- Los prompts de Kling van EN INGLÉS. El resto, en castellano.
- Prohibido en lo visual: neón, interfaces flotando, hologramas, robots, circuitos
  azules, gente de banco de imágenes. Es una oficina española normal.
- Cada plano lleva en "nota" por qué es así y el plan B si sale mal.
- Máximo 4 planos generados por vídeo: cada uno cuesta 10 creditos.
- Ningún plano con action_complexity "high" sale del generador: se simplifica, se
  divide en dos planos, o se marca reference_required con la imagen que falta.
- Un plano detalle (close_up, extreme_close_up) con reference_quality "low" va
  siempre con reference_required en true.

REGLAS DEL DIRECTOR — son obligatorias y explican por qué existen. Cúmplelas.
${reglas}

GUÍA DE VOZ
${voz}`;

const cliente = new Anthropic();

const r = await cliente.messages.create({
  model: 'claude-opus-5',
  max_tokens: 8000,
  thinking: { type: 'adaptive' },
  system: SISTEMA,
  tools: [{ name: 'entregar_storyboard', description: 'Devuelve el guion y el storyboard completos.', input_schema: esquema }],
  tool_choice: { type: 'tool', name: 'entregar_storyboard' },
  messages: [{ role: 'user', content: `Idea del vídeo:\n\n<idea>${idea}</idea>\n\nDevuelve el storyboard completo.` }],
});

const bloque = r.content.find((c) => c.type === 'tool_use');
if (!bloque) throw new Error('El modelo no devolvió el storyboard estructurado.');
const sb = bloque.input;

const fallos = validarStoryboard(sb);
if (fallos.length) {
  console.error('\nEl storyboard incumple las reglas del director:\n');
  for (const f of fallos) console.error('  · ' + f);
  console.error('\nNo se ha escrito nada. Corrige la idea o vuelve a lanzarlo.\n');
  process.exit(2);
}

// Numeración del proyecto: el siguiente hueco libre.
const dirProy = join(AQUI, 'projects');
mkdirSync(dirProy, { recursive: true });
const usados = readdirSync(dirProy).filter((d) => /^video-\d+$/.test(d)).map((d) => +d.slice(6));
const num = String((usados.length ? Math.max(...usados) : 0) + 1).padStart(3, '0');
const dir = join(dirProy, `video-${num}`);
mkdirSync(join(dir, 'references'), { recursive: true });

sb.proyecto = `video-${num}`;
sb.estado = 'pendiente_de_aprobacion';
sb.duracion_storyboard = sb.planos.reduce((a, p) => a + p.duracion, 0);
const generados = sb.planos.filter((p) => p.origen === 'generado');
sb.coste_estimado = { planos_generados: generados.length, creditos_higgsfield: generados.length * 10 };

writeFileSync(join(dir, 'storyboard.json'), JSON.stringify(sb, null, 2) + '\n');
writeFileSync(join(dir, 'script.md'),
  `# Guion · video-${num} · ${sb.duracion_storyboard} s\n\n` +
  sb.planos.map((p) => `**${p.n.toString().padStart(2, '0')} · ${p.duracion}s**\n> ${p.voz}\n`).join('\n'));
writeFileSync(join(dir, 'storyboard.md'), aMarkdown(sb));

console.log(`\n${dir}`);
console.log(`${sb.planos.length} planos · ${sb.duracion_storyboard} s · ${generados.length} generados · ${sb.coste_estimado.creditos_higgsfield} creditos`);
const bloqueados = sb.planos.filter((p) => p.reference_required);
if (bloqueados.length)
  console.log(`${bloqueados.length} plano(s) esperando referencia: ${bloqueados.map((p) => p.n).join(', ')}`);
console.log('\nNO se ha generado ningún vídeo. Revisa storyboard.md y aprueba antes de seguir.\n');

function aMarkdown(s) {
  const L = [`# Storyboard · ${s.proyecto} · ${s.duracion_storyboard} s · ${s.formato}\n`,
             `> **${s.idea}**\n`, `> Estado: \`${s.estado}\` · ${s.coste_estimado.creditos_higgsfield} creditos\n`];
  for (const p of s.planos) {
    L.push(`\n## PLANO ${String(p.n).padStart(2, '0')} · ${p.duracion}s · \`${p.origen}\`\n`,
           `**Voz:** «${p.voz}»\n`, `**Visual:** ${p.visual}\n`,
           `**Plano:** ${p.tipo_plano} · **Cámara:** ${p.camara} · **Luz:** ${p.iluminacion}\n`);
    if (p.origen === 'generado')
      L.push(`**Acción:** \`${p.action_complexity}\` · **Referencia:** \`${p.reference_quality}\`` +
             (p.reference_required ? ` · ⚠️ **HACE FALTA REFERENCIA**\n` : `\n`));
    if (p.reference_required && p.reference_needed_desc)
      L.push(`\n> **Imagen que falta:** ${p.reference_needed_desc}\n`);
    if (p.referencia_id) L.push(`**Referencia:** \`${p.referencia_id}\`\n`);
    if (p.justificacion) L.push(`\n**Por qué así:** ${p.justificacion}\n`);
    if (p.prompt_kling) L.push(`\n**Prompt Kling:**\n\`\`\`\n${p.prompt_kling}\n\`\`\`\n`);
    L.push(`\n*${p.nota}*\n`);
  }
  if (s.hechos_verificados?.length) {
    L.push('\n---\n\n## Hechos verificados\n');
    for (const h of s.hechos_verificados) L.push(`- ${h.dato}\n  <${h.fuente}>\n`);
  }
  return L.join('');
}
