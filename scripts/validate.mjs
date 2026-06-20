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

function checkExercise(ex, where) {
  if (!ex.prompt) fail(`${where}: sem prompt`);
  if (!['mcq', 'bank', 'listen', 'speak', 'cloze', 'match', 'grammar', 'pic', 'emoji', 'dialog'].includes(ex.type)) fail(`${where}: tipo inválido (${ex.type})`);
  if (ex.type === 'dialog') {
    if (!Array.isArray(ex.turns) || ex.turns.length < 1) fail(`${where}: "dialog" precisa de "turns"`);
    (ex.turns || []).forEach((tn, i) => {
      if (!tn.npc) fail(`${where}: turno ${i} sem "npc"`);
      if (!Array.isArray(tn.options) || tn.options.length < 2) fail(`${where}: turno ${i} poucas opções`);
      if (new Set(tn.options).size !== tn.options.length) fail(`${where}: turno ${i} opções duplicadas`);
      if (typeof tn.correct !== 'number' || !tn.options[tn.correct]) fail(`${where}: turno ${i} "correct" inválido`);
    });
    return;
  }
  if (ex.type === 'emoji') {
    if (!ex.emoji || typeof ex.emoji !== 'string') fail(`${where}: "emoji" sem "emoji"`);
    if (!Array.isArray(ex.options) || ex.options.length < 2) fail(`${where}: poucas opções`);
    if (new Set(ex.options).size !== ex.options.length) fail(`${where}: opções duplicadas`);
    if (typeof ex.correct !== 'number' || !ex.options[ex.correct]) fail(`${where}: índice "correct" inválido`);
    return;
  }
  if (ex.type === 'pic') {
    if (!ex.es || typeof ex.es !== 'string') fail(`${where}: "pic" sem "es"`);
    if (!Array.isArray(ex.options) || ex.options.length < 2) fail(`${where}: poucas opções`);
    if (typeof ex.correct !== 'number' || !ex.options[ex.correct]) fail(`${where}: índice "correct" inválido`);
    return;
  }
  if (ex.type === 'grammar') {
    if (!ex.title) fail(`${where}: "grammar" sem "title"`);
    if (!Array.isArray(ex.rows) || ex.rows.length < 1) fail(`${where}: "grammar" precisa de "rows"`);
    (ex.rows || []).forEach((r, i) => { if (!Array.isArray(r) || r.length !== 2 || !r[0] || !r[1]) fail(`${where}: row ${i} inválida (espera [a, b])`); });
    return;
  }
  if (ex.type === 'speak') {
    if (!ex.es || typeof ex.es !== 'string') fail(`${where}: exercício "speak" sem "es"`);
    return;
  }
  if (ex.type === 'match') {
    if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) fail(`${where}: "match" precisa de >= 2 pares`);
    (ex.pairs || []).forEach((p, i) => {
      if (!Array.isArray(p) || p.length !== 2 || !p[0] || !p[1]) fail(`${where}: par ${i} inválido (espera ["es","pt"])`);
    });
    return;
  }
  if (ex.type === 'cloze') {
    if (!ex.sentence || ex.sentence.indexOf('___') < 0) fail(`${where}: "cloze" precisa de "sentence" com "___"`);
    if (!Array.isArray(ex.options) || ex.options.length < 2) fail(`${where}: poucas opções`);
    if (typeof ex.correct !== 'number' || !ex.options || !ex.options[ex.correct]) fail(`${where}: índice "correct" inválido`);
    return;
  }
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

if (!DATA || !ICONS) {
  fail('data.js não definiu window.CAMINO_DATA / window.CAMINO_ICONS');
} else {
  if (!Array.isArray(DATA.levels) || DATA.levels.length === 0) fail('levels vazio');

  let lessons = 0, exercises = 0, modules = 0;
  const lessonIds = new Set();
  const levelIds = new Set();

  for (const lv of DATA.levels) {
    for (const key of ['id', 'name', 'accent']) {
      if (!lv[key]) fail(`nível ${lv.id || '?'} sem campo "${key}"`);
    }
    if (levelIds.has(lv.id)) fail(`id de nível duplicado: ${lv.id}`);
    levelIds.add(lv.id);
    if (!Array.isArray(lv.modules) || lv.modules.length === 0) fail(`nível ${lv.id} sem módulos`);

    for (const mod of lv.modules || []) {
      modules++;
      if (!mod.id) fail(`módulo sem id no nível ${lv.id}`);
      if (!ICONS[mod.icon]) fail(`módulo ${mod.id} usa ícone inexistente: "${mod.icon}"`);
      if (!mod.color || !mod.theme) fail(`módulo ${mod.id} sem theme/color`);
      if (!Array.isArray(mod.lessons) || mod.lessons.length === 0) fail(`módulo ${mod.id} sem lições`);

      for (const l of mod.lessons || []) {
        lessons++;
        if (!l.id) fail(`lição sem id no módulo ${mod.id}`);
        if (lessonIds.has(l.id)) fail(`id de lição duplicado: ${l.id}`);
        lessonIds.add(l.id);
        if (!ICONS[l.icon]) fail(`lição ${l.id} usa ícone inexistente: "${l.icon}"`);
        if (l.teach !== undefined) {
          if (!Array.isArray(l.teach) || l.teach.length === 0) fail(`lição ${l.id}: "teach" deve ser uma lista não-vazia`);
          (l.teach || []).forEach((t, i) => { if (!t || !t.es || !t.pt) fail(`lição ${l.id}: teach[${i}] precisa de es e pt`); });
        }
        if (!Array.isArray(l.exercises) || l.exercises.length === 0) fail(`lição ${l.id} sem exercícios`);
        (l.exercises || []).forEach((ex, i) => { exercises++; checkExercise(ex, `${l.id}#${i} (${ex.type})`); });
      }
    }
  }

  // Conquistas
  if (!Array.isArray(DATA.achievements) || DATA.achievements.length === 0) fail('achievements vazio');
  for (const a of DATA.achievements || []) {
    if (!a.id || !a.name) fail('conquista sem id/name');
    if (!ICONS[a.icon]) fail(`conquista ${a.id} usa ícone inexistente: "${a.icon}"`);
    if (!['level', 'lessons', 'streak', 'xp'].includes(a.kind)) fail(`conquista ${a.id}: kind inválido (${a.kind})`);
    if (a.kind === 'level' && !levelIds.has(a.n)) fail(`conquista ${a.id}: nível "${a.n}" inexistente`);
    if (a.kind === 'lessons' && (typeof a.n !== 'number' || a.n < 1 || a.n > lessons)) {
      fail(`conquista ${a.id}: n (${a.n}) fora de 1..${lessons}`);
    }
    if ((a.kind === 'streak' || a.kind === 'xp') && (typeof a.n !== 'number' || a.n < 1)) fail(`conquista ${a.id}: n inválido`);
  }

  console.log(`Currículo: ${DATA.levels.length} níveis · ${modules} módulos · ${lessons} lições · ${exercises} exercícios · ${DATA.achievements.length} conquistas`);
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} problema(s) encontrado(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('✓ Currículo válido.');
