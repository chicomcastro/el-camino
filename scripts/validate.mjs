/* ============================================================
   Valida a integridade do currículo (assets/data.js).
   Usado pela CI e localmente:  node scripts/validate.mjs
   ============================================================ */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (msg) => errors.push(msg);

// Carrega data.js num "window" falso.
globalThis.window = {};
const dataSrc = readFileSync(join(ROOT, 'assets', 'data.js'), 'utf8');
// eslint-disable-next-line no-eval
(0, eval)(dataSrc);

const DATA = globalThis.window.CAMINO_DATA;
const ICONS = globalThis.window.CAMINO_ICONS;

if (!DATA || !ICONS) {
  fail('data.js não definiu window.CAMINO_DATA / window.CAMINO_ICONS');
} else {
  if (!Array.isArray(DATA.units) || DATA.units.length === 0) fail('units vazio');

  let lessons = 0;
  let exercises = 0;
  const lessonIds = new Set();

  for (const u of DATA.units) {
    for (const key of ['id', 'num', 'title', 'sub', 'theme', 'color', 'shadow']) {
      if (!u[key]) fail(`unidade ${u.id || '?'} sem campo "${key}"`);
    }
    if (!Array.isArray(u.lessons) || u.lessons.length === 0) fail(`unidade ${u.id} sem lições`);

    for (const l of u.lessons) {
      lessons++;
      if (!l.id) fail(`lição sem id na unidade ${u.id}`);
      if (lessonIds.has(l.id)) fail(`id de lição duplicado: ${l.id}`);
      lessonIds.add(l.id);
      if (!ICONS[l.icon]) fail(`lição ${l.id} usa ícone inexistente: "${l.icon}"`);
      if (!Array.isArray(l.exercises) || l.exercises.length === 0) fail(`lição ${l.id} sem exercícios`);

      for (const [i, ex] of (l.exercises || []).entries()) {
        exercises++;
        const where = `${l.id}#${i} (${ex.type})`;
        if (!ex.prompt) fail(`${where}: sem prompt`);
        if (!['mcq', 'bank', 'listen'].includes(ex.type)) fail(`${where}: tipo inválido`);

        if (ex.type === 'mcq') {
          if (!Array.isArray(ex.options) || ex.options.length < 2) fail(`${where}: poucas opções`);
          if (typeof ex.correct !== 'number' || !ex.options || !ex.options[ex.correct]) {
            fail(`${where}: índice "correct" inválido`);
          }
        } else {
          if (!Array.isArray(ex.words) || ex.words.length === 0) fail(`${where}: sem "words"`);
          if (!Array.isArray(ex.solution) || ex.solution.length === 0) fail(`${where}: sem "solution"`);
          for (const w of ex.solution || []) {
            if (!(ex.words || []).includes(w)) fail(`${where}: palavra da solução fora do banco: "${w}"`);
          }
          if (ex.type === 'listen' && !ex.audioEs) fail(`${where}: exercício "listen" sem audioEs`);
        }
      }
    }
  }

  // Conquistas
  if (!Array.isArray(DATA.achievements) || DATA.achievements.length === 0) fail('achievements vazio');
  for (const a of DATA.achievements || []) {
    if (!a.id || !a.name) fail(`conquista sem id/name`);
    if (!ICONS[a.icon]) fail(`conquista ${a.id} usa ícone inexistente: "${a.icon}"`);
    if (typeof a.need !== 'number' || a.need < 1 || a.need > lessons) {
      fail(`conquista ${a.id}: "need" (${a.need}) fora do intervalo 1..${lessons}`);
    }
  }

  console.log(`Currículo: ${DATA.units.length} unidades · ${lessons} lições · ${exercises} exercícios · ${DATA.achievements.length} conquistas`);
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} problema(s) encontrado(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('✓ Currículo válido.');
