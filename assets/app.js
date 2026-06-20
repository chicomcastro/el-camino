/* ============================================================
   Camino — lógica do app (vanilla JS, sem build)
   Estados de tela: home · lesson · complete · lives · profile
   Progresso, XP, vidas e ofensiva persistem em localStorage.
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.CAMINO_DATA;
  var IC = window.CAMINO_ICONS;
  var STORE_KEY = 'camino.v1';

  var HEARTS_MAX = 5;
  var HEARTS_REGEN_MS = 20 * 60 * 1000; // 1 vida a cada 20 min
  var REVIVE_COST = 50;                 // gemas para recuperar todas as vidas

  // ---- trilha achatada: sequência contínua de lições ----
  // Cada item conhece seu nível e módulo, para agrupar a UI por nível.
  var TRAIL = [];
  DATA.levels.forEach(function (lv, levelIdx) {
    var levelStart = TRAIL.length;
    lv.modules.forEach(function (mod, moduleIdx) {
      mod.lessons.forEach(function (l, lessonIdx) {
        TRAIL.push({
          level: lv, levelIdx: levelIdx, levelStart: levelStart,
          module: mod, moduleIdx: moduleIdx,
          lesson: l, lessonIdx: lessonIdx, globalIdx: TRAIL.length,
        });
      });
    });
  });
  var TOTAL_LESSONS = TRAIL.length;

  // ---- índices de exercícios (para a revisão espaçada / SRS) ----
  // exId estável = "<lessonId>#<idx>". Como os objetos de exercício são
  // referências compartilhadas, dá para mapear objeto → id e id → objeto.
  var EX_ID_OF = new Map();
  var EX_BY_ID = {};
  TRAIL.forEach(function (t) {
    t.lesson.exercises.forEach(function (ex, i) {
      var id = t.lesson.id + '#' + i;
      EX_ID_OF.set(ex, id);
      EX_BY_ID[id] = ex;
    });
  });

  // Faixa [início, fim) de lições de cada nível e seu tamanho.
  var LEVEL_BOUNDS = DATA.levels.map(function (lv, i) {
    var idxs = TRAIL.filter(function (t) { return t.levelIdx === i; });
    var start = idxs.length ? idxs[0].globalIdx : TRAIL.length;
    return { id: lv.id, start: start, end: start + idxs.length, size: idxs.length };
  });
  // Um nível está concluído quando o progresso passou de seu fim.
  function levelDone(i) { return S.progress >= LEVEL_BOUNDS[i].end; }
  // Índice do nível "atual" (onde está a próxima lição).
  function currentLevelIdx() {
    for (var i = 0; i < LEVEL_BOUNDS.length; i++) {
      if (S.progress < LEVEL_BOUNDS[i].end) return i;
    }
    return LEVEL_BOUNDS.length - 1;
  }

  // ===========================================================
  //  Persistência
  // ===========================================================
  function defaults() {
    return {
      name: 'Lucas',
      onboarded: false,     // já passou pelo onboarding?
      dailyGoalXp: 50,      // meta diária de XP
      soundOn: true,        // efeitos sonoros de feedback
      progress: 0,          // nº de lições concluídas (índice da lição atual)
      totalXp: 0,
      gems: 0,              // gemas (moeda) p/ recuperar vidas
      xpToday: 0,           // XP ganho hoje (meta diária)
      xpTodayDate: null,    // dia de referência do xpToday
      dailyDoneDate: null,  // dia em que o desafio diário foi concluído
      goalMetDate: null,    // dia em que a meta diária foi atingida (p/ ofensiva)
      hearts: HEARTS_MAX,
      heartsTs: Date.now(), // momento da última perda (base p/ regenerar)
      streak: 0,
      lastActive: null,     // 'YYYY-MM-DD'
      srs: {},              // revisão espaçada: { exId: { box, due } }
    };
  }

  function load() {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) {}
    var s = Object.assign(defaults(), saved);
    // Migração: quem já usava o app antes do onboarding não deve revê-lo.
    if (saved.onboarded === undefined && (saved.name !== undefined || saved.progress)) {
      s.onboarded = true;
    }
    return s;
  }
  function persist() {
    var p = {
      name: S.name, onboarded: S.onboarded, dailyGoalXp: S.dailyGoalXp, soundOn: S.soundOn,
      progress: S.progress, totalXp: S.totalXp, gems: S.gems,
      xpToday: S.xpToday, xpTodayDate: S.xpTodayDate, dailyDoneDate: S.dailyDoneDate,
      goalMetDate: S.goalMetDate,
      hearts: S.hearts, heartsTs: S.heartsTs, streak: S.streak, lastActive: S.lastActive,
      srs: S.srs,
    };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  // Regenera vidas com base no tempo decorrido.
  function regenHearts() {
    if (S.hearts >= HEARTS_MAX) { S.heartsTs = Date.now(); return; }
    var elapsed = Date.now() - (S.heartsTs || Date.now());
    var gained = Math.floor(elapsed / HEARTS_REGEN_MS);
    if (gained > 0) {
      S.hearts = Math.min(HEARTS_MAX, S.hearts + gained);
      S.heartsTs = S.hearts >= HEARTS_MAX ? Date.now() : (S.heartsTs + gained * HEARTS_REGEN_MS);
    }
  }

  // ===========================================================
  //  Estado em memória (persistente + runtime da lição)
  // ===========================================================
  var S = load();
  regenHearts();

  // runtime (não persiste)
  S.screen = S.onboarded ? 'home' : 'onboarding';
  S.goalJustMet = false; // meta diária acabou de ser batida? (comemoração)
  S.obStep = 0;       // passo do onboarding
  S.obGoal = S.dailyGoalXp; // seleção temporária de meta no onboarding
  S.homeLevel = null; // nível em foco na home (null = nível atual)
  S.levelUpIdx = 0;   // nível recém-concluído (tela de level-up)
  S.cur = null;       // índice global da lição em curso (-1 = desafio diário)
  S.daily = false;    // estamos no desafio diário?
  S.review = false;   // estamos numa sessão de revisão espaçada?
  S.replay = false;   // estamos refazendo uma lição já concluída?
  S.speakStatus = 'idle'; // idle | listening | done (exercício de fala)
  S.speakHeard = '';      // transcrição reconhecida
  S.speakHits = null;     // acertos por palavra (feedback de pronúncia)
  S.speakAcc = 0;         // precisão da fala (0..1)
  S.speakAwarded = false; // já contou o acerto deste exercício de fala?
  S.speakMode = null;     // 'fallback' quando não há reconhecimento de voz
  S.matchSelLeft = null;  // pareamento: coluna esquerda selecionada
  S.matchDone = [];       // pareamento: índices já casados
  S.matchOrderR = null;   // pareamento: ordem (embaralhada) da coluna direita
  S.optOrder = null;      // ordem embaralhada das alternativas (mcq/cloze)
  S.activeExercises = []; // exercícios da sessão em curso
  S.exIndex = 0;
  S.selected = null;
  S.checked = false;
  S.lastOk = false;
  S.correct = 0;
  S.bank = [];
  S.answer = [];
  S.gainedXp = 0;
  S.gainedGems = 0;
  S.shakeKey = 0;
  ensureDaily();

  // Opções de meta diária (XP/dia ≈ minutos).
  var GOALS = [
    { xp: 20,  label: 'Casual',  mins: '5 min/dia' },
    { xp: 50,  label: 'Regular', mins: '10 min/dia' },
    { xp: 100, label: 'Sério',   mins: '15 min/dia' },
    { xp: 150, label: 'Intenso', mins: '20 min/dia' },
  ];

  function set(patch) { Object.assign(S, patch); persist(); render(); }

  // ===========================================================
  //  Helpers de UI
  // ===========================================================
  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(n) { try { return n.toLocaleString('pt-BR'); } catch (e) { return '' + n; } }
  function svg(path, size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + color + '">' +
      '<path d="' + path + '"></path></svg>';
  }
  // Gema (moeda). Path próprio (não está no conjunto de ícones do currículo).
  var GEM = 'M6,2L2,8L12,22L22,8L18,2H6M9.5,4H14.5L16.5,7H7.5L9.5,4M5.43,7L7,4.5L8.5,7H5.43M11,9H13L12,18.5L11,9M9,9L9.9,17L4.3,9H9M15,9H19.7L14.1,17L15,9Z';
  function gemIcon(size, color) { return svg(GEM, size, color || '#22B8CF'); }

  // Anel de progresso (SVG) para a meta diária.
  function ring(pct, color, size) {
    var r = (size - 8) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, pct / 100)));
    var cx = size / 2;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="#EEF1F6" stroke-width="6"></circle>' +
      '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="6" ' +
      'stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" ' +
      'transform="rotate(-90 ' + cx + ' ' + cx + ')"></circle></svg>';
  }

  // Mascote "Paloma" (pomba com auréola). mood: 'happy' | 'sad'
  function mascot(size, mood) {
    var eye = mood === 'sad'
      ? '<path d="M58 38 q3 4 6 0" fill="none" stroke="#20293B" stroke-width="2.6" stroke-linecap="round"></path>'
      : '<circle cx="64" cy="34" r="3.3" fill="#20293B"></circle><circle cx="65.1" cy="32.9" r="1" fill="#fff"></circle>';
    return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '">' +
      '<ellipse cx="50" cy="15" rx="19" ry="5.5" fill="none" stroke="#FFCF8C" stroke-width="3"></ellipse>' +
      '<path d="M14 62 L4 56 L17 50 Z" fill="#EEF2FA" stroke="#CFD6E5" stroke-width="2"></path>' +
      '<ellipse cx="52" cy="61" rx="29" ry="25" fill="#FFFFFF" stroke="#CFD6E5" stroke-width="2.5"></ellipse>' +
      '<path d="M40 52 q18 8 34 0 l-2 8 q-15 6 -30 0 Z" fill="#E73B4C"></path>' +
      '<path d="M58 52 q22 5 18 26 q-14 2 -22 -11 Z" fill="#F7FAFF" stroke="#CFD6E5" stroke-width="2"></path>' +
      '<circle cx="58" cy="37" r="18" fill="#FFFFFF" stroke="#CFD6E5" stroke-width="2.5"></circle>' +
      '<path d="M75 37 L88 40 L75 44 Z" fill="#E8A13C"></path>' + eye + '</svg>';
  }


  function heartsColor(h) { return h <= 1 ? '#E73B4C' : (h <= 2 ? '#E8A13C' : '#E73B4C'); }

  // Uma conquista foi conquistada?
  function achEarned(a) {
    if (a.kind === 'lessons') return S.progress >= a.n;
    if (a.kind === 'streak') return S.streak >= a.n;
    if (a.kind === 'xp') return S.totalXp >= a.n;
    if (a.kind === 'level') {
      var i = DATA.levels.findIndex(function (lv) { return lv.id === a.n; });
      return i >= 0 && levelDone(i);
    }
    return false;
  }
  // nº de conquistas desbloqueadas
  function medalsCount() {
    return DATA.achievements.filter(achEarned).length;
  }

  // ===========================================================
  //  Telas
  // ===========================================================

  // ---- Onboarding (primeira execução) ----
  function obDots(step) {
    var html = '<div class="ob-dots">';
    for (var i = 0; i < 3; i++) {
      html += '<i class="' + (i === step ? 'on' : (i < step ? 'done' : '')) + '"></i>';
    }
    return html + '</div>';
  }

  function viewOnboarding() {
    var step = S.obStep;
    var html = '<div class="onboarding">' + obDots(step);

    if (step === 0) {
      html += '<div class="ob-body">' +
        '<div class="pop" style="margin-bottom:8px;">' + mascot(150, 'happy') + '</div>' +
        '<h1 class="ob-title">¡Hola! Eu sou a Paloma 🕊️</h1>' +
        '<p class="ob-text">Vou te acompanhar nessa jornada para você se virar em espanhol na viagem, puxar conversa com estranhos e compartilhar sua fé. Bora começar?</p>' +
        '</div>' +
        '<div class="ob-cta"><button class="btn-3d" data-act="obNext" style="background:#1AC136;box-shadow:0 4px 0 #0B8C21;">VAMOS!</button></div>';
    } else if (step === 1) {
      html += '<div class="ob-body">' +
        '<div style="margin-bottom:6px;">' + mascot(96, 'happy') + '</div>' +
        '<h1 class="ob-title">Como posso te chamar?</h1>' +
        '<p class="ob-text">Vou usar seu nome pra te incentivar pelo caminho.</p>' +
        '<input id="ob-name" class="ob-input" type="text" inputmode="text" autocomplete="given-name" ' +
        'maxlength="24" placeholder="Seu nome" value="' + esc(S.name === 'Lucas' && !S.onboarded ? '' : S.name) + '">' +
        '</div>' +
        '<div class="ob-cta"><button class="btn-3d" data-act="obName" style="background:#1AC136;box-shadow:0 4px 0 #0B8C21;">CONTINUAR</button></div>';
    } else {
      html += '<div class="ob-body" style="justify-content:flex-start;padding-top:8px;">' +
        '<h1 class="ob-title">Qual sua meta diária?</h1>' +
        '<p class="ob-text">Você pode mudar depois no perfil.</p>' +
        '<div class="ob-goals">';
      GOALS.forEach(function (g) {
        var sel = S.obGoal === g.xp;
        html += '<button class="ob-goal' + (sel ? ' sel' : '') + '" data-act="obGoal" data-xp="' + g.xp + '">' +
          '<div class="g-left"><span class="g-label">' + g.label + (g.xp === 50 ? ' · recomendado' : '') + '</span>' +
          '<span class="g-mins">' + g.mins + '</span></div>' +
          '<span class="g-xp">' + g.xp + ' XP</span></button>';
      });
      html += '</div></div>' +
        '<div class="ob-cta"><button class="btn-3d" data-act="obFinish" style="background:#1AC136;box-shadow:0 4px 0 #0B8C21;">COMEÇAR A TRILHA</button></div>';
    }

    html += '</div>';
    return html;
  }

  function topbar() {
    return '<div class="topbar">' +
      '<div class="flag" style="margin-right:auto;"></div>' +
      '<div class="pill streak">' + svg(IC.flame, 15, '#E8730C') + '<span>' + S.streak + '</span></div>' +
      '<div class="pill gemspill">' + gemIcon(15, '#0F9FB5') + '<span>' + fmt(S.gems) + '</span></div>' +
      '<div class="pill xp">' + svg(IC.star, 15, '#E8A13C') + '<span>' + fmt(S.totalXp) + '</span></div>' +
      '<div class="pill medals">' + svg(IC.heart, 15, '#E73B4C') + '<span>' + S.hearts + '</span></div>' +
      '</div>';
  }

  // Bloco "hoje": anel de meta diária + desafio do dia.
  function todayCard() {
    ensureDaily();
    var goal = S.dailyGoalXp || 50;
    var pct = Math.min(100, Math.round((S.xpToday / goal) * 100));
    var met = S.xpToday >= goal;
    var ringColor = met ? '#1AC136' : '#E8A13C';

    var html = '<div class="today">';
    html += '<div class="today-ring">' + ring(pct, ringColor, 64) +
      '<div class="tr-center">' + (met
        ? svg(IC.checkC, 22, '#1AC136')
        : '<span class="tr-pct">' + pct + '%</span>') + '</div></div>';
    html += '<div class="today-mid"><div class="today-t">Meta diária</div>' +
      '<div class="today-s">' + S.xpToday + ' / ' + goal + ' XP' + (met ? ' · concluída! 🎉' : '') + '</div></div>';
    html += '</div>';

    // desafio do dia
    var doneToday = S.dailyDoneDate === todayStr();
    var locked = S.progress < 1;
    if (doneToday) {
      html += '<div class="daily done"><div class="d-ic" style="background:#E7FEEA;">' + svg(IC.checkC, 22, '#1AC136') + '</div>' +
        '<div class="d-mid"><div class="d-t">Desafio do dia</div><div class="d-s">Concluído! Volte amanhã 🔥</div></div></div>';
    } else if (locked) {
      html += '<div class="daily locked"><div class="d-ic" style="background:#EEF1F6;">' + svg(IC.lock, 20, '#9CA5B8') + '</div>' +
        '<div class="d-mid"><div class="d-t">Desafio do dia</div><div class="d-s">Conclua sua 1ª lição para liberar</div></div></div>';
    } else {
      html += '<button class="daily" data-act="startDaily"><div class="d-ic" style="background:#FFF1E0;">' + svg(IC.flame, 22, '#E8730C') + '</div>' +
        '<div class="d-mid"><div class="d-t">Desafio do dia</div><div class="d-s">Revisão rápida · bônus de XP e 💎</div></div>' +
        svg('M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z', 22, '#E8A13C') + '</button>';
    }

    // revisão espaçada: aparece só quando há itens vencidos
    var due = srsDue().length;
    if (due > 0) {
      html += '<button class="daily" data-act="startReview" style="margin-bottom:8px;"><div class="d-ic" style="background:#E5F0FF;">' + svg(IC.book, 22, '#3C76E8') + '</div>' +
        '<div class="d-mid"><div class="d-t">Revisão</div><div class="d-s">' + due + ' ' + (due === 1 ? 'item para revisar' : 'itens para revisar') + ' · fixe o que aprendeu</div></div>' +
        svg('M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z', 22, '#3C76E8') + '</button>';
    }
    return html;
  }

  function viewHome() {
    var pattern = [0, 46, 66, 46, 0, -46, -66, -46];
    var maxLevel = currentLevelIdx();
    var li = (S.homeLevel != null && S.homeLevel >= 0 && S.homeLevel <= maxLevel) ? S.homeLevel : maxLevel;
    var lv = DATA.levels[li];
    var b = LEVEL_BOUNDS[li];
    var doneInLevel = Math.max(0, Math.min(b.size, S.progress - b.start));

    var html = topbar();
    html += '<div class="scroll" style="padding:16px 18px 28px;">';

    // saudação + bloco "hoje": sempre presentes (status do dia, não do nível),
    // mantendo o topo estável ao navegar entre níveis — evita content shift.
    html += '<div class="greet"><div class="mascot">' + mascot(56, 'happy') + '</div>' +
      '<div style="flex:1;"><div class="t1">¡Hola, ' + esc(S.name) + '!</div>' +
      '<div class="t2">Pronto para a missão de hoje?</div></div></div>';
    html += todayCard();

    // banner do nível (com navegação entre níveis desbloqueados)
    var pct = b.size ? Math.round((doneInLevel / b.size) * 100) : 0;
    html += '<div class="level-banner" style="background:linear-gradient(135deg,' + lv.accent + ',' + lv.accentDk + ');">' +
      '<div class="lb-top">' +
      '<button class="lb-nav" ' + (li > 0 ? 'data-act="levelPrev"' : 'disabled') + '>' +
      svg('M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z', 22, '#fff') + '</button>' +
      '<div class="lb-mid"><div class="lb-step">NÍVEL ' + (li + 1) + ' DE ' + DATA.levels.length + ' · ' + esc(lv.short) + '</div>' +
      '<div class="lb-name">' + esc(lv.name) + '</div></div>' +
      '<button class="lb-nav" ' + (li < maxLevel ? 'data-act="levelNext"' : 'disabled') + '>' +
      svg('M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z', 22, '#fff') + '</button>' +
      '</div>' +
      '<div class="lb-tag">' + esc(lv.tagline) + '</div>' +
      '<div class="lb-bar"><i style="width:' + pct + '%;"></i></div>' +
      '<div class="lb-foot"><span>' + doneInLevel + '/' + b.size + ' lições</span>' +
      '<button class="lb-all" data-act="goLevels">ver níveis ›</button></div>' +
      '</div>';

    // módulos do nível + nós
    lv.modules.forEach(function (mod) {
      html += '<div class="unit">';
      html += '<div class="unit-banner" style="background:' + mod.color + ';box-shadow:0 4px 0 ' + mod.shadow + ';">' +
        '<div style="flex:1;"><div class="label">MÓDULO · ' + esc(mod.theme) + '</div>' +
        '<div class="title">' + esc(mod.title) + '</div></div>' +
        '<div class="ico">' + svg(IC[mod.icon], 22, '#fff') + '</div></div>';

      html += '<div class="nodes">';
      mod.lessons.forEach(function (l) {
        var gi = TRAIL.findIndex(function (t) { return t.lesson.id === l.id; });
        var isDone = gi < S.progress, isCurrent = gi === S.progress, locked = gi > S.progress;
        var color = locked ? 'var(--c-locked)' : mod.color;
        var shadow = locked ? 'var(--c-locked-dk)' : mod.shadow;
        var iconPath = locked ? IC.lock : IC[l.icon];
        var iconColor = locked ? '#9CA5B8' : '#fff';
        var off = pattern[(gi - b.start) % 8];

        html += '<div class="node-wrap" style="transform:translateX(' + off + 'px);">';
        if (isCurrent) {
          html += '<div class="node-start-tip" style="border-color:' + mod.color + ';color:' + mod.color + ';">COMEÇAR' +
            '<span class="arrow" style="border-top-color:' + mod.color + ';"></span></div>';
        }
        // concluído e atual são clicáveis; concluído = refazer (revisão)
        var clickable = isCurrent || isDone;
        html += '<button class="node' + (isDone ? ' done' : '') + '" ' +
          (clickable ? 'data-act="start" data-gi="' + gi + '"' : 'disabled') +
          (isDone ? ' aria-label="Refazer lição" title="Refazer (revisão)"' : '') +
          ' style="background:' + color + ';box-shadow:0 6px 0 ' + shadow + ';">' +
          svg(iconPath, 34, iconColor) + '</button>';
        if (isDone) {
          html += '<div class="node-check">' + svg('M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z', 13, '#fff') + '</div>';
        }
        // indicador "Aprenda": lição com material de introdução
        if (!locked && l.teach && l.teach.length) {
          html += '<div class="node-teach" title="Tem tela Aprenda">' + svg(IC.book, 12, '#5C19B1') + '</div>';
        }
        html += '</div>';
      });
      html += '</div></div>';
    });

    html += '</div>'; // scroll
    html += bottomnav('home');
    return html;
  }

  // ---- Visão geral dos níveis (a jornada inteira) ----
  function viewLevels() {
    var maxLevel = currentLevelIdx();
    var html = '<div class="lesson-head" style="justify-content:flex-start;gap:12px;">' +
      '<button class="iconbtn" data-act="goHome">' +
      svg('M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z', 24, '#9CA5B8') + '</button>' +
      '<span style="font-size:17px;font-weight:800;color:#20293B;">Sua jornada</span></div>';

    html += '<div class="scroll" style="padding:6px 18px 28px;">';
    DATA.levels.forEach(function (lv, i) {
      var b = LEVEL_BOUNDS[i];
      var done = Math.max(0, Math.min(b.size, S.progress - b.start));
      var locked = i > maxLevel;
      var isCur = i === maxLevel;
      var pct = b.size ? Math.round((done / b.size) * 100) : 0;
      var bg = locked ? '#F4F6FB' : '#fff';
      var ring = locked ? '#E3E8F1' : lv.accent;
      var statusIco = levelDone(i)
        ? svg(IC.checkC, 22, lv.accent)
        : (locked ? svg(IC.lock, 20, '#B6BECE') : svg(IC.flame, 20, lv.accent));
      html += '<button class="level-card" ' + (locked ? 'disabled' : 'data-act="openLevel" data-li="' + i + '"') +
        ' style="background:' + bg + ';border-color:' + (isCur ? lv.accent : '#E9EDF4') + ';">' +
        '<div class="lc-badge" style="background:' + (locked ? '#EEF1F6' : lv.accent) + ';color:' + (locked ? '#9CA5B8' : '#fff') + ';">' + esc(lv.short) + '</div>' +
        '<div class="lc-mid"><div class="lc-name" style="color:' + (locked ? '#9CA5B8' : '#20293B') + ';">' + esc(lv.name) + '</div>' +
        '<div class="lc-tag">' + esc(lv.tagline) + '</div>' +
        '<div class="lc-bar"><i style="width:' + pct + '%;background:' + ring + ';"></i></div></div>' +
        '<div class="lc-status">' + statusIco + '</div>' +
        '</button>';
    });
    html += '</div>' + bottomnav('home');
    return html;
  }

  // ---- Comemoração de subida de nível ----
  function viewLevelUp() {
    var lv = DATA.levels[S.levelUpIdx] || DATA.levels[0];
    var next = DATA.levels[S.levelUpIdx + 1];
    var html = '<div class="complete"><div class="confetti">';
    var palette = ['#E73B4C', '#3C76E8', '#9D55FF', '#1AC136', '#E8A13C'];
    for (var i = 0; i < 26; i++) {
      var left = Math.round((i * 53 + 7) % 100);
      var size = 8 + (i % 3) * 3;
      var dur = (2.2 + (i % 4) * 0.4).toFixed(1);
      var delay = ((i % 6) * 0.3).toFixed(2);
      html += '<i style="left:' + left + '%;width:' + size + 'px;height:' + size + 'px;background:' +
        palette[i % palette.length] + ';animation-duration:' + dur + 's;animation-delay:' + delay + 's;"></i>';
    }
    html += '</div><div class="center">' +
      '<div class="pop levelup-badge" style="background:linear-gradient(135deg,' + lv.accent + ',' + lv.accentDk + ');">' +
      svg(IC.trophy, 64, '#fff') + '</div>' +
      '<div class="lu-kicker" style="color:' + lv.accent + ';">NÍVEL CONCLUÍDO</div>' +
      '<h1>' + esc(lv.name) + ' ✓</h1>' +
      '<div class="sub">' + (next
        ? 'Você desbloqueou o nível <b>' + esc(next.name) + '</b>. ¡Vamos en serio!'
        : 'Você concluiu toda a trilha do Camino. ¡Felicidades, ' + esc(S.name) + '!') + '</div>' +
      '</div>' +
      '<div class="verify-wrap" style="position:relative;z-index:1;">' +
      '<button class="btn-3d" data-act="finishLevelUp" style="background:' + lv.accent + ';box-shadow:0 4px 0 ' + lv.accentDk + ';">' +
      (next ? 'CONTINUAR' : 'CONCLUIR') + '</button></div></div>';
    return html;
  }

  function bottomnav(active) {
    return '<div class="bottomnav">' +
      '<button class="navbtn ' + (active === 'home' ? 'active' : '') + '" data-act="goHome">' +
      svg(IC.map, 26, active === 'home' ? '#E73B4C' : '#9CA5B8') + '<span>Trilha</span></button>' +
      '<button class="navbtn ' + (active === 'profile' ? 'active' : '') + '" data-act="goProfile">' +
      svg(IC.account, 26, active === 'profile' ? '#E73B4C' : '#9CA5B8') + '<span>Perfil</span></button>' +
      '</div>';
  }

  // O conjunto de exercícios em curso (lição normal ou desafio diário).
  function curEx() { return (S.activeExercises && S.activeExercises[S.exIndex]) || {}; }
  function curLessonLen() { return (S.activeExercises && S.activeExercises.length) || 1; }

  // Tela "aprenda" — introduz o vocabulário antes dos exercícios.
  function viewTeach() {
    var node = TRAIL[S.cur];
    var lesson = node ? node.lesson : null;
    var teach = (lesson && lesson.teach) || [];
    var spkPath = 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z';

    var html = '<div class="lesson-head">' +
      '<button class="iconbtn" data-act="close">' + svg('M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z', 24, '#9CA5B8') + '</button>' +
      '<span style="font-size:16px;font-weight:800;color:#20293B;">' + esc(lesson ? lesson.title : '') + '</span></div>';

    html += '<div class="lesson-body">';
    html += '<div class="teach-head"><div class="mascot">' + mascot(58, 'happy') + '</div>' +
      '<div><div class="teach-title">Aprenda primeiro</div>' +
      '<div class="teach-sub">Toque para ouvir. Depois é só praticar!</div></div></div>';
    html += '<div class="teach-list">';
    teach.forEach(function (t) {
      html += '<button class="teach-item" data-act="speakText" data-text="' + esc(t.es) + '">' +
        '<div class="ti-ic">' + svg(spkPath, 22, '#9D55FF') + '</div>' +
        '<div class="ti-tx"><div class="ti-es">' + esc(t.es) + '</div>' +
        '<div class="ti-pt">' + esc(t.pt) + '</div></div></button>';
    });
    html += '</div></div>';

    html += '<div class="footer"><div class="verify-wrap">' +
      '<button class="btn-3d" data-act="teachDone" style="background:#1AC136;box-shadow:0 4px 0 #0B8C21;">COMEÇAR</button>' +
      '</div></div>';
    return html;
  }

  // Alternativas (MCQ/cloze) renderizadas na ordem embaralhada de S.optOrder.
  // data-i continua sendo o índice ORIGINAL, então a verificação não muda.
  function optionsHtml(ex) {
    var order = (S.optOrder && S.optOrder.length === ex.options.length) ? S.optOrder
      : ex.options.map(function (_, i) { return i; });
    var html = '<div class="mcq">';
    order.forEach(function (i) {
      var text = ex.options[i];
      var bg = '#fff', border = '#CFD6E5', color = '#20293B';
      if (S.checked) {
        if (i === ex.correct) { bg = '#E7FEEA'; border = '#1AC136'; color = '#0B8C21'; }
        else if (i === S.selected) { bg = '#FFF4E5'; border = '#E8A13C'; color = '#8E570B'; }
      } else if (i === S.selected) { bg = '#FFE6E9'; border = '#FF8995'; color = '#C71C2D'; }
      html += '<button class="opt" ' + (S.checked ? 'disabled' : 'data-act="select" data-i="' + i + '"') +
        ' style="background:' + bg + ';border-color:' + border + ';"><span style="color:' + color + ';">' +
        esc(text) + '</span></button>';
    });
    return html + '</div>';
  }

  function viewLesson() {
    var ex = curEx();
    var len = curLessonLen();
    var isMcq = ex.type === 'mcq';
    var isBank = ex.type === 'bank' || ex.type === 'listen';
    var isSpeak = ex.type === 'speak';
    var isCloze = ex.type === 'cloze';
    var isMatch = ex.type === 'match';
    var isGrammar = ex.type === 'grammar';
    var isPic = ex.type === 'pic';
    var pct = Math.round(((S.exIndex + (S.checked ? 1 : 0)) / len) * 100);
    var hc = heartsColor(S.hearts);

    var html = '<div class="lesson-head">' +
      '<button class="iconbtn" data-act="close">' + svg('M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z', 24, '#9CA5B8') + '</button>' +
      '<div class="progress"><i style="width:' + pct + '%;"></i></div>' +
      '<div class="hearts" style="color:' + hc + ';">' + svg(IC.heart, 18, hc) + '<span>' + S.hearts + '</span></div>' +
      '</div>';

    var shakeCls = (S.checked && !S.lastOk) ? ' style="animation:camShake 0.4s;"' : '';
    html += '<div class="lesson-body"' + shakeCls + '>';
    html += '<div class="prompt">' + esc(ex.prompt || '') + '</div>';

    // áudio
    if (ex.audioEs) {
      html += '<div class="audio"><button class="play" data-act="speak">' +
        svg('M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z', 30, '#fff') + '</button>';
      html += '<div style="flex:1;">';
      if (!ex.dictation) html += '<div class="es">' + esc(ex.audioEs) + '</div>';
      else html += '<div class="hint">Toque para ouvir e monte a frase abaixo</div>';
      html += '<div class="wave">' +
        '<i style="height:11px;"></i><i style="height:20px;background:#B88DFF;"></i><i style="height:14px;"></i>' +
        '<i style="height:24px;background:#9D55FF;"></i><i style="height:13px;"></i><i style="height:18px;background:#B88DFF;"></i></div>';
      html += '</div>';
      html += '<button class="slow" data-act="speakSlow">' +
        svg('M3,9V15H7L12,20V4L7,9H3M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23Z', 18, '#9D55FF') + '<span>Lento</span></button>';
      html += '</div>';
    }

    // balão PT
    if (ex.bubblePt) {
      html += '<div class="bubble">' + mascot(58, 'happy') +
        '<div class="box"><div class="txt">' + esc(ex.bubblePt) + '</div><span class="tail"></span></div></div>';
    }

    // PIC (toque na imagem / emoji)
    if (isPic) {
      var spkP = 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z';
      html += '<div class="pic-word"><button class="play sm" data-act="speak">' + svg(spkP, 26, '#fff') + '</button>' +
        '<div class="es">' + esc(ex.es) + '</div></div>';
      var pOrder = (S.optOrder && S.optOrder.length === ex.options.length) ? S.optOrder : ex.options.map(function (_, i) { return i; });
      html += '<div class="pic-grid">';
      pOrder.forEach(function (i) {
        var border = '#CFD6E5';
        if (S.checked) { if (i === ex.correct) border = '#1AC136'; else if (i === S.selected) border = '#E8A13C'; }
        else if (i === S.selected) border = '#9D55FF';
        html += '<button class="pic-opt" ' + (S.checked ? 'disabled' : 'data-act="select" data-i="' + i + '"') +
          ' style="border-color:' + border + ';">' + esc(ex.options[i]) + '</button>';
      });
      html += '</div>';
    }

    // GRAMMAR (carta de regra)
    if (isGrammar) {
      html += '<div class="grammar"><div class="gr-title">' + esc(ex.title) + '</div>';
      if (ex.body) html += '<div class="gr-body">' + esc(ex.body) + '</div>';
      html += '<div class="gr-table">';
      ex.rows.forEach(function (r) {
        html += '<div class="gr-row"><span class="gr-a">' + esc(r[0]) + '</span>' +
          '<span class="gr-b">' + esc(r[1]) + '</span></div>';
      });
      html += '</div>';
      if (ex.example) html += '<div class="gr-example">' + esc(ex.example) + '</div>';
      html += '</div>';
    }

    // SPEAK (pronúncia / fala)
    if (isSpeak) {
      var st = S.speakStatus || 'idle';
      var micPath = 'M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z';
      var spkPath = 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z';
      html += '<div class="speak">';
      html += '<div class="speak-phrase"><button class="play sm" data-act="speak">' + svg(spkPath, 26, '#fff') + '</button>' +
        '<div style="flex:1;"><div class="es">' + esc(ex.es) + '</div>' +
        (ex.pt ? '<div class="hint">' + esc(ex.pt) + '</div>' : '') + '</div></div>';
      if (S.speakMode === 'fallback') {
        html += '<div class="mic-label">Seu navegador não reconhece voz aqui. Ouça e repita em voz alta.</div>';
        if (!S.checked) html += '<button class="btn-3d" data-act="speakSelfOk" style="margin-top:6px;background:#9D55FF;box-shadow:0 4px 0 #7A26E0;">JÁ REPETI EM VOZ ALTA</button>';
      } else if (!S.checked) {
        html += '<button class="mic' + (st === 'listening' ? ' on' : '') + '" data-act="micStart">' + svg(micPath, 36, '#fff') + '</button>';
        html += '<div class="mic-label">' + (st === 'listening' ? 'Ouvindo… fale agora 🎤' : 'Toque no microfone e fale') + '</div>';
        html += '<button class="speak-skip" data-act="speakSkip">Não consigo falar agora</button>';
      }
      if (S.checked && S.speakMode !== 'fallback') {
        // feedback palavra por palavra
        var tw = ex.es.split(/\s+/);
        html += '<div class="speak-eval">';
        tw.forEach(function (w, idx) {
          var hit = S.speakHits && S.speakHits[idx];
          html += '<span class="sw ' + (hit ? 'ok' : 'no') + '">' + esc(w) + '</span> ';
        });
        html += '</div>';
        html += '<div class="speak-acc">Precisão: ' + Math.round((S.speakAcc || 0) * 100) + '%</div>';
        if (S.speakHeard) html += '<div class="mic-result">Você disse: <b>' + esc(S.speakHeard) + '</b></div>';
        html += '<button class="speak-skip" data-act="speakRetry">🎤 Tentar de novo</button>';
      } else if (S.checked && S.speakMode === 'fallback') {
        html += '<div class="mic-result">Você confirmou que repetiu em voz alta ✓</div>';
      }
      html += '</div>';
    }

    // CLOZE (preencher a lacuna)
    if (isCloze) {
      var filled = S.selected != null ? ex.options[S.selected] : '_____';
      var sentenceHtml = esc(ex.sentence).replace('___', '<span class="cloze-blank' + (S.selected != null ? ' filled' : '') + '">' + esc(filled) + '</span>');
      html += '<div class="cloze-sentence">' + sentenceHtml + '</div>';
      if (ex.pt) html += '<div class="cloze-hint">' + esc(ex.pt) + '</div>';
      html += optionsHtml(ex);
    }

    // MATCH (pareamento)
    if (isMatch) {
      var order = (S.matchOrderR && S.matchOrderR.length === ex.pairs.length) ? S.matchOrderR
        : (S.matchOrderR = shuffledIdx(ex.pairs.length));
      var done = S.matchDone || [];
      html += '<div class="match"><div class="match-col">';
      ex.pairs.forEach(function (p, i) {
        var m = done.indexOf(i) >= 0, sel = S.matchSelLeft === i;
        html += '<button class="match-chip' + (m ? ' matched' : '') + (sel ? ' sel' : '') + '" ' +
          (m ? 'disabled' : 'data-act="matchLeft" data-i="' + i + '"') + '>' + esc(p[0]) + '</button>';
      });
      html += '</div><div class="match-col">';
      order.forEach(function (i) {
        var m = done.indexOf(i) >= 0;
        html += '<button class="match-chip right' + (m ? ' matched' : '') + '" ' +
          (m ? 'disabled' : 'data-act="matchRight" data-i="' + i + '"') + '>' + esc(ex.pairs[i][1]) + '</button>';
      });
      html += '</div></div>';
    }

    // MCQ
    if (isMcq) {
      html += optionsHtml(ex);
    }

    // word bank
    if (isBank) {
      html += '<div><div class="answer-line">';
      S.answer.forEach(function (it) {
        html += '<button class="chip" ' + (S.checked ? 'disabled' : 'data-act="bankRemove" data-id="' + it.id + '"') + '>' + esc(it.w) + '</button>';
      });
      html += '</div><div class="bank-pool">';
      S.bank.forEach(function (it) {
        html += '<button class="chip" ' + (S.checked ? 'disabled' : 'data-act="bankAdd" data-id="' + it.id + '"') + '>' + esc(it.w) + '</button>';
      });
      html += '</div></div>';
    }

    html += '</div>'; // lesson-body

    // footer / verificar
    var canVerify = (isMcq || isCloze || isPic) ? S.selected !== null : (isBank ? S.answer.length > 0 : false);
    var enabled = S.checked || canVerify;
    var footerBg = !S.checked ? '#fff' : (S.lastOk ? '#E7FEEA' : '#FFF4E5');
    var correctAnswer = (isSpeak || isPic) ? ex.es
      : ((isMcq || isCloze) ? (ex.options ? ex.options[ex.correct] : '')
      : (isMatch ? '' : (ex.solution ? ex.solution.join(' ') : '')));

    html += '<div class="footer">';
    if (S.checked) {
      var fg = S.lastOk ? '#0B8C21' : '#8E570B';
      var icon = S.lastOk ? IC.checkC : IC.alert;
      var title = S.lastOk ? (isSpeak ? '¡Bien dicho!' : (isMatch ? '¡Perfecto!' : '¡Muito bem!')) : (isSpeak ? 'Continue praticando — imite o áudio' : 'Resposta correta');
      html += '<div class="feedback" style="background:' + footerBg + ';">' +
        '<div class="ttl" style="color:' + fg + ';">' + svg(icon, 22, fg) + '<span>' + title + '</span></div>' +
        (correctAnswer ? '<div class="msg" style="color:' + fg + ';">' + esc(correctAnswer) + '</div>' : '') + '</div>';
    }
    // speak/match antes de concluir não têm botão (a ação é o microfone / parear)
    var showBtn = !((isSpeak || isMatch) && !S.checked);
    if (isGrammar) {
      // carta de regra: só "ENTENDI" para avançar (instrucional, sem verificar)
      html += '<div class="verify-wrap">' +
        '<button class="btn-3d" data-act="next" style="color:#fff;background:#1AC136;box-shadow:0 4px 0 #0B8C21;">ENTENDI</button></div>';
    } else if (showBtn) {
      var vBg = !enabled ? '#E3E8F1' : (S.checked && !S.lastOk ? '#E8A13C' : '#1AC136');
      var vColor = !enabled ? '#9CA5B8' : '#fff';
      var vShadow = !enabled ? '#C2CADB' : (S.checked && !S.lastOk ? '#C27B17' : '#0B8C21');
      var vLabel = S.checked ? 'CONTINUAR' : 'VERIFICAR';
      var vAct = enabled ? (S.checked ? 'next' : 'verify') : '';
      html += '<div class="verify-wrap" style="background:' + footerBg + ';">' +
        '<button class="btn-3d" ' + (enabled ? 'data-act="' + vAct + '"' : 'disabled') +
        ' style="color:' + vColor + ';background:' + vBg + ';box-shadow:0 4px 0 ' + vShadow + ';">' + vLabel + '</button></div>';
    } else {
      html += '<div class="verify-wrap" style="background:' + footerBg + ';"></div>';
    }
    html += '</div>';

    return html;
  }

  function viewComplete() {
    var len = curLessonLen();
    // cartas de gramática são instrucionais; não contam na precisão
    var gradable = (S.activeExercises || []).filter(function (e) { return e.type !== 'grammar'; }).length || 1;
    var accuracy = Math.round((S.correct / gradable) * 100);
    var palette = ['#E73B4C', '#3C76E8', '#9D55FF', '#1AC136', '#E8A13C'];

    var html = '<div class="complete"><div class="confetti">';
    for (var i = 0; i < 22; i++) {
      var left = Math.round((i * 53 + 7) % 100);
      var size = 8 + (i % 3) * 3;
      var dur = (2.4 + (i % 4) * 0.4).toFixed(1);
      var delay = ((i % 6) * 0.35).toFixed(2);
      html += '<i style="left:' + left + '%;width:' + size + 'px;height:' + size + 'px;background:' +
        palette[i % palette.length] + ';animation-duration:' + dur + 's;animation-delay:' + delay + 's;"></i>';
    }
    html += '</div>';

    html += '<div class="center"><div class="pop">' + mascot(132, 'happy') + '</div>' +
      '<h1>' + (S.daily ? '¡Desafío completado!' : ((S.review || S.replay) ? '¡Repaso completado!' : '¡Lección completada!')) + '</h1>' +
      '<div class="sub">Você acertou ' + S.correct + ' de ' + len + ' · siga firme na missão!</div>' +
      '<div class="stat-cards">' +
      '<div class="stat-card" style="border-color:#FFE8C9;"><div class="cap" style="background:#E8A13C;">XP GANHO</div>' +
      '<div class="val" style="color:#8E570B;">' + svg(IC.star, 18, '#E8A13C') + '+' + S.gainedXp + '</div></div>' +
      '<div class="stat-card" style="border-color:#C9F0F6;"><div class="cap" style="background:#0F9FB5;">GEMAS</div>' +
      '<div class="val" style="color:#0B6E7E;">' + gemIcon(18, '#0F9FB5') + '+' + S.gainedGems + '</div></div>' +
      '<div class="stat-card" style="border-color:#CCFED5;"><div class="cap" style="background:#1AC136;">PRECISÃO</div>' +
      '<div class="val" style="color:#0B8C21;">' + svg(IC.checkC, 18, '#1AC136') + accuracy + '%</div></div>' +
      '</div></div>';

    html += '<div class="verify-wrap" style="position:relative;z-index:1;">' +
      '<button class="btn-3d" data-act="finish" style="background:#1AC136;box-shadow:0 4px 0 #0B8C21;">CONTINUAR</button></div>';
    html += '</div>';
    return html;
  }

  function viewLives() {
    var html = '<div class="lives"><div class="lesson-head">' +
      '<button class="iconbtn" data-act="close">' + svg('M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z', 24, '#9CA5B8') + '</button></div>';

    html += '<div class="center"><div style="position:relative;" class="pop">' + mascot(132, 'sad') +
      '<div class="badge-heart">' +
      svg('M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3M9.1,8L8,9.1L10.9,12L8,14.9L9.1,16L12,13.1L14.9,16L16,14.9L13.1,12L16,9.1L14.9,8L12,10.9L9.1,8Z', 22, '#E73B4C') +
      '</div></div>' +
      '<h1>¡Te quedaste sin vidas!</h1>' +
      '<div class="sub">Você ficou sem corações. Recupere com gemas ou volte depois — as vidas também se recuperam com o tempo.</div>' +
      '<div class="hearts-row">';
    for (var i = 0; i < HEARTS_MAX; i++) html += svg(IC.heart, 26, '#E9EDF4');
    html += '</div></div>';

    var canAfford = S.gems >= REVIVE_COST;
    html += '<div class="actions">' +
      '<button class="btn-3d" ' + (canAfford ? 'data-act="revive"' : 'disabled') +
      ' style="background:' + (canAfford ? '#E73B4C' : '#E3E8F1') + ';color:' + (canAfford ? '#fff' : '#9CA5B8') +
      ';box-shadow:0 4px 0 ' + (canAfford ? '#C71C2D' : '#C2CADB') + ';display:flex;align-items:center;justify-content:center;gap:8px;">' +
      gemIcon(18, canAfford ? '#fff' : '#9CA5B8') + 'RECUPERAR · ' + REVIVE_COST + ' GEMAS</button>' +
      (canAfford ? '' : '<div class="lives-hint">Você tem ' + S.gems + ' 💎. Faça lições para ganhar mais.</div>') +
      '<button class="btn-3d" data-act="close" style="background:#F0F3FA;color:#9CA5B8;box-shadow:none;padding:14px;font-size:14px;">SAIR DA LIÇÃO</button>' +
      '</div></div>';
    return html;
  }

  function viewProfile() {
    var name = (S.name || 'Lucas').trim();
    var initials = (name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2) || 'L').toUpperCase();

    var curLv = DATA.levels[currentLevelIdx()];

    var html = '<div class="scroll">';
    html += '<div class="profile-head"><div class="avatar" data-act="rename">' + initials + '</div>' +
      '<div><div class="pname" data-act="rename">' + esc(name) + '</div>' +
      '<div class="prole">Missionário em formação · nível ' + esc(curLv.name) + '</div></div></div>';

    html += '<div class="stats">' +
      '<div class="stat" style="background:#FFF4E5;"><div class="n" style="color:#8E570B;">' + fmt(S.totalXp) + '</div><div class="l" style="color:#C27B17;">XP total</div></div>' +
      '<div class="stat" style="background:#E5EEFF;"><div class="n" style="color:#0D378C;">' + S.progress + '</div><div class="l" style="color:#1446AB;">Lições</div></div>' +
      '<div class="stat" style="background:#FFE6E9;"><div class="n" style="color:#8D0A17;">' + medalsCount() + '</div><div class="l" style="color:#C71C2D;">Medalhas</div></div>' +
      '</div>';

    // progresso por tema (agrega todas as lições de cada tema na trilha)
    html += '<div style="padding:6px 22px 4px;"><div class="section-ttl">Progresso por tema</div>';
    var THEMES = [
      { theme: 'Viagem', color: '#3C76E8' },
      { theme: 'Conversa', color: '#9D55FF' },
      { theme: 'Evangelização', color: '#E73B4C' },
    ];
    THEMES.forEach(function (th) {
      var inTheme = TRAIL.filter(function (t) { return t.module.theme === th.theme; });
      var total = inTheme.length;
      var done = inTheme.filter(function (t) { return t.globalIdx < S.progress; }).length;
      var pct = total ? Math.round((done / total) * 100) : 0;
      html += '<div class="themebar"><div class="head"><span class="lbl">' + esc(th.theme) + '</span>' +
        '<span class="pct" style="color:' + th.color + ';">' + pct + '%</span></div>' +
        '<div class="track"><i style="width:' + pct + '%;background:' + th.color + ';"></i></div></div>';
    });
    html += '</div>';

    // conquistas
    html += '<div style="padding:14px 22px 20px;"><div class="section-ttl">Conquistas</div><div class="ach-grid">';
    DATA.achievements.forEach(function (a) {
      var earned = achEarned(a);
      var bg = earned ? a.bg : '#F0F3FA';
      var ring = earned ? a.c : '#E3E8F1';
      var iconColor = earned ? a.c : '#B6BECE';
      var labelColor = earned ? '#363D4D' : '#9CA5B8';
      html += '<div class="ach"><div class="medal" style="background:' + bg + ';border-color:' + ring + ';">' +
        svg(IC[a.icon], 28, iconColor) + '</div><span class="nm" style="color:' + labelColor + ';">' + esc(a.name) + '</span></div>';
    });
    html += '</div></div>';

    // preferências
    html += '<div style="padding:0 22px 8px;"><div class="section-ttl">Meta diária</div>';
    html += '<div class="goal-grid">';
    GOALS.forEach(function (g) {
      var sel = S.dailyGoalXp === g.xp;
      html += '<button class="goal-opt' + (sel ? ' sel' : '') + '" data-act="setGoal" data-xp="' + g.xp + '">' +
        '<span class="go-xp">' + g.xp + ' XP</span>' +
        '<span class="go-label">' + g.label + '</span>' +
        '<span class="go-mins">' + g.mins + '</span>' +
        (sel ? '<span class="go-check">' + svg(IC.checkC, 16, '#E73B4C') + '</span>' : '') +
        '</button>';
    });
    html += '</div>';

    html += '<div class="section-ttl" style="margin-top:18px;">Preferências</div>' +
      '<button class="pref-row" data-act="rename">' +
      '<div class="pref-ic" style="background:#E5EEFF;">' + svg(IC.account, 20, '#3C76E8') + '</div>' +
      '<div class="pref-txt"><span class="pref-t">Nome</span>' +
      '<span class="pref-s">' + esc(name) + '</span></div>' +
      svg('M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z', 22, '#C2CADB') + '</button>' +
      '<button class="pref-row" data-act="toggleSound">' +
      '<div class="pref-ic" style="background:' + (S.soundOn ? '#F5F0FF' : '#F0F3FA') + ';">' +
      svg(S.soundOn
        ? 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z'
        : 'M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12Z',
        20, S.soundOn ? '#9D55FF' : '#9CA5B8') + '</div>' +
      '<div class="pref-txt"><span class="pref-t">Som</span>' +
      '<span class="pref-s">' + (S.soundOn ? 'Efeitos sonoros ligados' : 'Efeitos sonoros desligados') + '</span></div>' +
      '<div class="toggle' + (S.soundOn ? ' on' : '') + '"><i></i></div></button>' +
      '</div>';

    html += '<button class="reset-btn" data-act="reset">Reiniciar progresso</button>';
    html += '<div style="height:14px;"></div>';

    html += '</div>'; // scroll
    html += bottomnav('profile');
    return html;
  }

  // ===========================================================
  //  Render
  // ===========================================================
  var root = document.getElementById('app');

  // Preserva a posição de scroll entre re-renders da MESMA tela
  // (evita "voltar ao topo" ao trocar de nível, escolher meta, etc.).
  var _scrollByScreen = {};
  var _lastScreenKey = null;

  function render() {
    ensureDaily();

    // salva o scroll atual antes de recriar o DOM
    var prevScroll = root.querySelector('.scroll');
    if (prevScroll && _lastScreenKey != null) _scrollByScreen[_lastScreenKey] = prevScroll.scrollTop;

    var body;
    switch (S.screen) {
      case 'onboarding': body = viewOnboarding(); break;
      case 'teach':    body = viewTeach(); break;
      case 'lesson':   body = viewLesson(); break;
      case 'complete': body = viewComplete(); break;
      case 'levelup':  body = viewLevelUp(); break;
      case 'levels':   body = viewLevels(); break;
      case 'lives':    body = viewLives(); break;
      case 'profile':  body = viewProfile(); break;
      default:         body = viewHome();
    }
    root.innerHTML = '<div class="screen" data-screen="' + S.screen + '">' + body + '</div>' +
      '<div class="toast" id="toast"></div>';

    // restaura o scroll se continuamos na mesma tela; senão, começa no topo
    var sc = root.querySelector('.scroll');
    if (sc) sc.scrollTop = (S.screen === _lastScreenKey) ? (_scrollByScreen[S.screen] || 0) : 0;
    _lastScreenKey = S.screen;

    // Foco no campo de nome do onboarding.
    if (S.screen === 'onboarding' && S.obStep === 1) {
      var inp = document.getElementById('ob-name');
      if (inp) setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
    }

    // Comemoração ao bater a meta diária (dispara ao chegar na home).
    if (S.screen === 'home' && S.goalJustMet) {
      S.goalJustMet = false;
      celebrateGoal(S.streak);
    }
  }

  // Confete leve + toast quando a meta diária é batida.
  function celebrateGoal(streak) {
    SFX.win();
    var palette = ['#E73B4C', '#3C76E8', '#9D55FF', '#1AC136', '#E8A13C'];
    var bits = '';
    for (var i = 0; i < 16; i++) {
      var left = Math.round((i * 53 + 9) % 100);
      var size = 7 + (i % 3) * 3;
      var dur = (1.8 + (i % 4) * 0.3).toFixed(1);
      var delay = ((i % 5) * 0.12).toFixed(2);
      bits += '<i style="left:' + left + '%;width:' + size + 'px;height:' + size + 'px;background:' +
        palette[i % palette.length] + ';animation-duration:' + dur + 's;animation-delay:' + delay + 's;"></i>';
    }
    var ov = document.createElement('div');
    ov.className = 'celebrate';
    ov.innerHTML = bits;
    try {
      root.appendChild(ov);
      setTimeout(function () { try { root.removeChild(ov); } catch (e) {} }, 2600);
    } catch (e) {}
    setTimeout(function () {
      toast(svg(IC.flame, 16, '#FFB259') + 'Meta diária batida! Ofensiva de ' + streak + (streak === 1 ? ' dia' : ' dias') + ' 🔥');
    }, 300);
  }

  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.innerHTML = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  // ===========================================================
  //  Voz (espanhol) via Web Speech API
  // ===========================================================
  function speak(text, rate) {
    try {
      var synth = window.speechSynthesis;
      if (!synth || !text) return;
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      u.rate = rate || 0.95;
      u.pitch = 1;
      var voices = synth.getVoices() || [];
      var v = voices.find(function (x) { return /^es[-_]ES/i.test(x.lang); }) ||
              voices.find(function (x) { return /^es/i.test(x.lang); });
      if (v) u.voice = v;
      synth.speak(u);
    } catch (e) {}
  }

  // ===========================================================
  //  Reconhecimento de fala (exercício "speak") via Web Speech API
  // ===========================================================
  function speechRecognitionAvailable() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  // Normaliza para comparar: minúsculas, sem acentos/pontuação.
  function normPhrase(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9ñ\s]/g, '').replace(/\s+/g, ' ').trim();
  }
  // Compara o que foi dito com o alvo (tolerante).
  function speakMatch(heard, target) {
    var h = normPhrase(heard), t = normPhrase(target);
    if (!h || !t) return false;
    if (h === t || h.indexOf(t) >= 0) return true; // exato ou disse a frase com palavras extras
    var tw = t.split(' '), hw = h.split(' ');
    var hit = tw.filter(function (w) { return hw.indexOf(w) >= 0; }).length;
    return (hit / tw.length) >= 0.6;
  }
  // Avalia a fala palavra a palavra contra o alvo; escolhe a melhor alternativa.
  function speakEvaluate(alts, target) {
    var t = normPhrase(target).split(' ').filter(Boolean);
    var best = { acc: -1, hits: [], heard: '' };
    (alts || []).forEach(function (a) {
      var hw = normPhrase(a).split(' ').filter(Boolean);
      var hits = t.map(function (w) { return hw.indexOf(w) >= 0; });
      var acc = t.length ? hits.filter(Boolean).length / t.length : 0;
      if (acc > best.acc) best = { acc: acc, hits: hits, heard: a };
    });
    if (best.acc < 0) best = { acc: 0, hits: t.map(function () { return false; }), heard: '' };
    best.ok = best.acc >= 0.6 || (alts || []).some(function (a) { return speakMatch(a, target); });
    return best;
  }
  var _recog = null;
  function micStart() {
    if (S.checked) return;
    if (!speechRecognitionAvailable()) { set({ speakMode: 'fallback' }); return; }
    var ex = curEx();
    try {
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      _recog = new SR();
      _recog.lang = 'es-ES';
      _recog.interimResults = false;
      _recog.maxAlternatives = 3;
      _recog.onresult = function (e) {
        var alts = [];
        try { for (var i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript); } catch (err) {}
        var ev = speakEvaluate(alts, ex.es);
        S.speakHeard = ev.heard || '';
        S.speakHits = ev.hits;
        S.speakAcc = ev.acc;
        S.speakStatus = 'done';
        commitSpeak(ev.ok);
      };
      _recog.onerror = function (ev) {
        if (ev && (ev.error === 'not-allowed' || ev.error === 'service-not-allowed')) S.speakMode = 'fallback';
        S.speakStatus = 'idle'; render();
      };
      _recog.onend = function () { if (S.speakStatus === 'listening') { S.speakStatus = 'idle'; render(); } };
      S.speakStatus = 'listening'; render();
      _recog.start();
    } catch (e) { set({ speakMode: 'fallback' }); }
  }
  // ---- Pareamento (match) ----
  function matchLeft(i) {
    if (S.checked || (S.matchDone || []).indexOf(i) >= 0) return;
    set({ matchSelLeft: i });
  }
  function matchRight(i) {
    if (S.checked || (S.matchDone || []).indexOf(i) >= 0) return;
    if (S.matchSelLeft == null) return;
    if (S.matchSelLeft === i) {
      S.matchDone = (S.matchDone || []).concat([i]);
      S.matchSelLeft = null;
      SFX.correct();
      if (S.matchDone.length >= curEx().pairs.length) { commitMatch(); return; }
      render();
    } else {
      S.matchSelLeft = null; SFX.wrong(); render();
    }
  }
  function commitMatch() {
    S.checked = true; S.lastOk = true; S.correct += 1;
    srsRecord(EX_ID_OF.get(curEx()), true);
    persist(); render();
  }
  // Confirma o resultado da fala (sem tirar vidas — prática de baixo risco).
  // Conta o acerto só uma vez por exercício, mesmo com "tentar de novo".
  function commitSpeak(ok) {
    S.checked = true;
    S.lastOk = ok;
    if (ok) { if (!S.speakAwarded) { S.correct += 1; S.speakAwarded = true; } SFX.correct(); } else { SFX.wrong(); }
    srsRecord(EX_ID_OF.get(curEx()), ok);
    persist();
    render();
  }
  // Permite repetir a fala sem penalidade (não reconta o acerto).
  function speakRetry() {
    S.checked = false; S.lastOk = false; S.speakStatus = 'idle'; S.speakHeard = ''; S.speakHits = null; S.speakAcc = 0;
    render();
  }

  // ===========================================================
  //  Efeitos sonoros (WebAudio, sintetizados — sem arquivos)
  // ===========================================================
  var _actx = null;
  function audioCtx() {
    try {
      if (!_actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        _actx = new AC();
      }
      if (_actx.state === 'suspended' && _actx.resume) _actx.resume();
      return _actx;
    } catch (e) { return null; }
  }
  // Toca uma sequência de notas: [{f, t, d, type, g}]
  function playSeq(notes) {
    if (!S.soundOn) return;
    var ctx = audioCtx();
    if (!ctx) return;
    var t0 = ctx.currentTime;
    notes.forEach(function (n) {
      try {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = n.type || 'sine';
        osc.frequency.value = n.f;
        var start = t0 + (n.t || 0);
        var dur = n.d || 0.12;
        var peak = n.g || 0.16;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(start); osc.stop(start + dur + 0.02);
      } catch (e) {}
    });
  }
  var SFX = {
    correct: function () { playSeq([{ f: 659.25, t: 0, d: 0.12 }, { f: 987.77, t: 0.1, d: 0.18 }]); },       // E5→B5
    wrong:   function () { playSeq([{ f: 196, t: 0, d: 0.22, type: 'sawtooth', g: 0.12 }, { f: 155.56, t: 0.08, d: 0.26, type: 'sawtooth', g: 0.12 }]); },
    win:     function () { playSeq([{ f: 523.25, t: 0, d: 0.13 }, { f: 659.25, t: 0.12, d: 0.13 }, { f: 783.99, t: 0.24, d: 0.13 }, { f: 1046.5, t: 0.36, d: 0.3 }]); }, // C-E-G-C
    levelup: function () { playSeq([{ f: 523.25, t: 0, d: 0.12 }, { f: 659.25, t: 0.1, d: 0.12 }, { f: 783.99, t: 0.2, d: 0.12 }, { f: 1046.5, t: 0.3, d: 0.14 }, { f: 1318.5, t: 0.44, d: 0.34 }]); },
    tap:     function () { playSeq([{ f: 330, t: 0, d: 0.06, g: 0.08 }]); },
  };

  // ===========================================================
  //  Ações da lição
  // ===========================================================
  function buildBank(ex) {
    if (!ex.words) return [];
    var items = ex.words.map(function (w, idx) { return { id: idx, w: w }; });
    // embaralha para o banco não vir na ordem da resposta
    var order = shuffledIdx(items.length);
    return order.map(function (i) { return items[i]; });
  }
  // Índices [0..n) embaralhados (coluna direita do pareamento).
  function shuffledIdx(n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; }
    return a;
  }
  function initEx(i) {
    var ex = S.activeExercises[i];
    Object.assign(S, { exIndex: i, selected: null, checked: false, lastOk: false, bank: buildBank(ex), answer: [], speakStatus: 'idle', speakHeard: '', speakHits: null, speakAcc: 0, speakAwarded: false, matchSelLeft: null, matchDone: [], matchOrderR: ex.type === 'match' ? shuffledIdx(ex.pairs.length) : null, optOrder: (ex.type === 'mcq' || ex.type === 'cloze' || ex.type === 'pic') ? shuffledIdx(ex.options.length) : null });
    render();
    if (ex.audioEs) speak(ex.audioEs);
    else if ((ex.type === 'speak' || ex.type === 'pic') && ex.es) speak(ex.es);
  }
  function startLesson(gi) {
    // refazer (replay) = lição já concluída (gi < progresso): revisão,
    // não regride o progresso e rende XP reduzido.
    var replay = gi < S.progress;
    if (S.hearts <= 0) { S.screen = 'lives'; S.cur = gi; S.daily = false; S.review = false; S.replay = replay; render(); return; }
    var lesson = TRAIL[gi].lesson;
    var exs = lesson.exercises;
    Object.assign(S, {
      cur: gi, daily: false, review: false, replay: replay, activeExercises: exs, correct: 0, exIndex: 0,
      selected: null, checked: false, lastOk: false, bank: buildBank(exs[0]), answer: [], speakStatus: 'idle', speakHeard: '', speakHits: null, speakAcc: 0, speakAwarded: false, matchSelLeft: null, matchDone: [], matchOrderR: exs[0].type === 'match' ? shuffledIdx(exs[0].pairs.length) : null, optOrder: (exs[0].type === 'mcq' || exs[0].type === 'cloze' || exs[0].type === 'pic') ? shuffledIdx(exs[0].options.length) : null,
    });
    // se a lição tem "aprenda", mostra a introdução antes dos exercícios
    if (lesson.teach && lesson.teach.length) { S.screen = 'teach'; render(); return; }
    S.screen = 'lesson';
    render();
    if (exs[0].audioEs) speak(exs[0].audioEs); else if ((exs[0].type === 'speak' || exs[0].type === 'pic') && exs[0].es) speak(exs[0].es);
  }
  // Sai da tela "aprenda" e começa os exercícios.
  function beginExercises() {
    S.screen = 'lesson';
    render();
    var ex0 = S.activeExercises[0];
    if (ex0.audioEs) speak(ex0.audioEs); else if ((ex0.type === 'speak' || ex0.type === 'pic') && ex0.es) speak(ex0.es);
  }

  // ---- Desafio diário ----
  // RNG determinístico por dia (mesmo desafio o dia todo).
  function seededRng(seedStr) {
    var h = 1779033703 ^ seedStr.length;
    for (var i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }
  // Exercícios já aprendidos (lições concluídas); fallback p/ a 1ª lição.
  function dailyPool() {
    var pool = [];
    var maxLesson = Math.max(1, S.progress);
    for (var i = 0; i < maxLesson && i < TRAIL.length; i++) {
      TRAIL[i].lesson.exercises.forEach(function (ex) { pool.push(ex); });
    }
    return pool;
  }
  // Monta o desafio do dia (até 5 itens), PRIORIZANDO o que está
  // vencido na revisão espaçada (SRS) e completando com um sorteio
  // determinístico (estável durante o dia) do conteúdo já aprendido.
  function buildDaily() {
    var TARGET = 5;
    var picked = [];
    var seen = [];
    function add(ex) {
      if (!ex || picked.length >= TARGET || seen.indexOf(ex) >= 0) return;
      seen.push(ex); picked.push(ex);
    }
    // 1) itens vencidos do SRS (mais atrasados primeiro)
    srsDue().forEach(function (id) { add(EX_BY_ID[id]); });
    // 2) completa com sorteio determinístico do que já foi aprendido
    if (picked.length < TARGET) {
      var arr = dailyPool().slice();
      var rng = seededRng('camino-' + todayStr());
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
      for (var k = 0; k < arr.length && picked.length < TARGET; k++) add(arr[k]);
    }
    return picked;
  }
  function startDaily() {
    if (S.hearts <= 0) { set({ screen: 'lives', daily: true }); return; }
    var exs = buildDaily();
    if (!exs.length) { toast('Conclua uma lição para liberar o desafio'); return; }
    Object.assign(S, {
      screen: 'lesson', cur: -1, daily: true, review: false, replay: false, activeExercises: exs, correct: 0, exIndex: 0,
      selected: null, checked: false, lastOk: false, bank: buildBank(exs[0]), answer: [], speakStatus: 'idle', speakHeard: '', speakHits: null, speakAcc: 0, speakAwarded: false, matchSelLeft: null, matchDone: [], matchOrderR: exs[0].type === 'match' ? shuffledIdx(exs[0].pairs.length) : null, optOrder: (exs[0].type === 'mcq' || exs[0].type === 'cloze' || exs[0].type === 'pic') ? shuffledIdx(exs[0].options.length) : null,
    });
    render();
    if (exs[0].audioEs) speak(exs[0].audioEs); else if ((exs[0].type === 'speak' || exs[0].type === 'pic') && exs[0].es) speak(exs[0].es);
  }

  // ---- Revisão espaçada (Leitner) ----
  // Intervalos por caixa (ms). Caixa 0 = volta logo; sobe a cada acerto.
  var SRS_INTERVALS = [10 * 60e3, 24 * 3600e3, 3 * 24 * 3600e3, 7 * 24 * 3600e3, 16 * 24 * 3600e3, 35 * 24 * 3600e3];
  function srsRecord(exId, ok) {
    if (!exId) return;
    var it = S.srs[exId] || { box: 0, due: 0 };
    it.box = ok ? Math.min(SRS_INTERVALS.length - 1, it.box + 1) : 0;
    it.due = Date.now() + SRS_INTERVALS[it.box];
    S.srs[exId] = it;
  }
  // Itens vencidos (já vistos e na hora de revisar).
  function srsDue() {
    var now = Date.now();
    var ids = [];
    for (var id in S.srs) {
      if (Object.prototype.hasOwnProperty.call(S.srs, id) && EX_BY_ID[id] && S.srs[id].due <= now) ids.push(id);
    }
    // mais atrasados primeiro
    ids.sort(function (a, b) { return S.srs[a].due - S.srs[b].due; });
    return ids;
  }
  function startReview() {
    if (S.hearts <= 0) { set({ screen: 'lives', review: true }); return; }
    var ids = srsDue().slice(0, 10);
    var exs = ids.map(function (id) { return EX_BY_ID[id]; });
    if (!exs.length) { toast('Nada para revisar agora 🙌'); return; }
    Object.assign(S, {
      screen: 'lesson', cur: -2, daily: false, review: true, replay: false, activeExercises: exs, correct: 0, exIndex: 0,
      selected: null, checked: false, lastOk: false, bank: buildBank(exs[0]), answer: [], speakStatus: 'idle', speakHeard: '', speakHits: null, speakAcc: 0, speakAwarded: false, matchSelLeft: null, matchDone: [], matchOrderR: exs[0].type === 'match' ? shuffledIdx(exs[0].pairs.length) : null, optOrder: (exs[0].type === 'mcq' || exs[0].type === 'cloze' || exs[0].type === 'pic') ? shuffledIdx(exs[0].options.length) : null,
    });
    render();
    if (exs[0].audioEs) speak(exs[0].audioEs); else if ((exs[0].type === 'speak' || exs[0].type === 'pic') && exs[0].es) speak(exs[0].es);
  }

  function verify() {
    var ex = curEx();
    var ok;
    if (ex.type === 'mcq' || ex.type === 'cloze' || ex.type === 'pic') ok = S.selected === ex.correct;
    else ok = S.answer.map(function (a) { return a.w; }).join(' ') === ex.solution.join(' ');
    S.checked = true;
    S.lastOk = ok;
    if (ok) { S.correct += 1; SFX.correct(); }
    else { S.hearts = Math.max(0, S.hearts - 1); if (S.hearts === HEARTS_MAX - 1) S.heartsTs = Date.now(); SFX.wrong(); }
    srsRecord(EX_ID_OF.get(ex), ok); // agenda a revisão espaçada deste item
    persist();
    render();
  }
  function next() {
    if (S.hearts <= 0) { set({ screen: 'lives' }); return; }
    var len = curLessonLen();
    if (S.exIndex >= len - 1) {
      var gained, gems;
      if (S.daily) {
        // desafio diário: bônus generoso (precisão pesa) + gemas extras
        gained = 30 + S.correct * 6;
        gems = 15;
      } else if (S.review) {
        gained = 10 + S.correct * 3;
        gems = 5;
      } else {
        gained = 15 + S.correct * 5;
        gems = 3 + S.correct;
        if (S.replay) { // refazer rende metade (revisão)
          gained = Math.max(5, Math.round(gained / 2));
          gems = Math.max(1, Math.round(gems / 2));
        }
      }
      SFX.win();
      set({ screen: 'complete', gainedXp: gained, gainedGems: gems });
    } else {
      initEx(S.exIndex + 1);
    }
  }
  function todayStr() { return new Date().toISOString().slice(0, 10); }
  function yesterdayStr() { return new Date(Date.now() - 86400000).toISOString().slice(0, 10); }
  // A ofensiva avança quando a META DIÁRIA é atingida (1x por dia).
  function creditGoalIfMet() {
    ensureDaily();
    if (S.xpToday >= S.dailyGoalXp && S.goalMetDate !== todayStr()) {
      S.streak = (S.goalMetDate === yesterdayStr()) ? S.streak + 1 : 1;
      S.goalMetDate = todayStr();
      S.lastActive = todayStr();
      S.goalJustMet = true; // dispara a comemoração na home
    }
  }
  // Zera o XP do dia quando vira o dia.
  function ensureDaily() {
    var today = todayStr();
    if (S.xpTodayDate !== today) { S.xpTodayDate = today; S.xpToday = 0; }
  }
  function awardXp(xp, gems) {
    ensureDaily();
    S.totalXp += xp;
    S.xpToday += xp;
    S.gems += (gems || 0);
    S.lastActive = todayStr();
  }
  function finishLesson() {
    var completedLevel = -1;
    if (S.daily) {
      // desafio diário: recompensa, marca o dia, sem mexer no progresso
      awardXp(S.gainedXp, S.gainedGems);
      S.dailyDoneDate = todayStr();
      creditGoalIfMet();
      S.daily = false;
      set({ screen: 'home', homeLevel: null });
      setTimeout(function () { toast(svg(IC.flame, 16, '#FFB259') + 'Desafio do dia concluído! +' + S.gainedGems + ' 💎'); }, 350);
      return;
    }
    if (S.review) {
      // revisão espaçada: recompensa leve, sem mexer no progresso
      awardXp(S.gainedXp, S.gainedGems);
      creditGoalIfMet();
      S.review = false;
      set({ screen: 'home', homeLevel: null });
      setTimeout(function () { toast(svg(IC.checkC, 16, '#1AC136') + 'Revisão concluída! Memória reforçada 🧠'); }, 350);
      return;
    }
    if (S.replay) {
      // refazer lição concluída: XP reduzido, sem mexer no progresso
      awardXp(S.gainedXp, S.gainedGems);
      creditGoalIfMet();
      S.replay = false;
      set({ screen: 'home', homeLevel: null });
      setTimeout(function () { toast(svg(IC.checkC, 16, '#1AC136') + 'Lição revisada! +' + S.gainedXp + ' XP'); }, 350);
      return;
    }
    // conclui a lição em curso, se ainda não estava concluída
    if (S.cur === S.progress) {
      var node = TRAIL[S.cur];
      S.progress = Math.min(TOTAL_LESSONS, S.progress + 1);
      if (node && S.progress >= LEVEL_BOUNDS[node.levelIdx].end) completedLevel = node.levelIdx;
    }
    awardXp(S.gainedXp, S.gainedGems);
    creditGoalIfMet();
    S.homeLevel = null;
    if (completedLevel >= 0) {
      SFX.levelup();
      set({ screen: 'levelup', levelUpIdx: completedLevel });
    } else {
      set({ screen: 'home' });
    }
  }

  // ===========================================================
  //  Delegação de eventos
  // ===========================================================
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');

    switch (act) {
      case 'obNext': set({ obStep: S.obStep + 1 }); break;
      case 'obName': {
        var inp = document.getElementById('ob-name');
        var nm = inp && inp.value ? inp.value.trim().slice(0, 24) : '';
        if (!nm) { toast('Digite seu nome 🙂'); if (inp) inp.focus(); break; }
        set({ name: nm, obStep: 2 });
        break;
      }
      case 'obGoal': set({ obGoal: parseInt(t.getAttribute('data-xp'), 10) }); break;
      case 'obFinish':
        set({ onboarded: true, dailyGoalXp: S.obGoal, screen: 'home', obStep: 0 });
        setTimeout(function () { toast('¡Vamos, ' + esc(S.name) + '! Sua trilha começa aqui 🚀'); }, 350);
        break;
      case 'setGoal': {
        var xp = parseInt(t.getAttribute('data-xp'), 10);
        if (xp === S.dailyGoalXp) break;
        S.dailyGoalXp = xp;
        // se o XP de hoje já alcança a nova meta, credita a ofensiva
        creditGoalIfMet();
        set({});
        toast('Meta diária: ' + xp + ' XP/dia');
        break;
      }
      case 'start': startLesson(parseInt(t.getAttribute('data-gi'), 10)); break;
      case 'goHome': set({ screen: 'home', homeLevel: null }); break;
      case 'goProfile': set({ screen: 'profile' }); break;
      case 'goLevels': set({ screen: 'levels' }); break;
      case 'openLevel': set({ screen: 'home', homeLevel: parseInt(t.getAttribute('data-li'), 10) }); break;
      case 'levelPrev': {
        var curL = (S.homeLevel != null ? S.homeLevel : currentLevelIdx());
        set({ homeLevel: Math.max(0, curL - 1) });
        break;
      }
      case 'levelNext': {
        var curN = (S.homeLevel != null ? S.homeLevel : currentLevelIdx());
        set({ homeLevel: Math.min(currentLevelIdx(), curN + 1) });
        break;
      }
      case 'finishLevelUp': set({ screen: 'home', homeLevel: null }); break;
      case 'close': set({ screen: 'home', homeLevel: null, daily: false, review: false, replay: false }); break;
      case 'select':
        if (!S.checked) set({ selected: parseInt(t.getAttribute('data-i'), 10) });
        break;
      case 'bankAdd': {
        if (S.checked) break;
        var idA = parseInt(t.getAttribute('data-id'), 10);
        var itA = S.bank.find(function (b) { return b.id === idA; });
        S.bank = S.bank.filter(function (b) { return b.id !== idA; });
        S.answer = S.answer.concat([itA]);
        render();
        break;
      }
      case 'bankRemove': {
        if (S.checked) break;
        var idR = parseInt(t.getAttribute('data-id'), 10);
        var itR = S.answer.find(function (b) { return b.id === idR; });
        S.answer = S.answer.filter(function (b) { return b.id !== idR; });
        S.bank = S.bank.concat([itR]);
        render();
        break;
      }
      case 'verify': verify(); break;
      case 'next': next(); break;
      case 'finish': finishLesson(); break;
      case 'revive':
        if (S.gems < REVIVE_COST) { toast('Gemas insuficientes'); break; }
        S.gems -= REVIVE_COST;
        set({ screen: 'lesson', hearts: HEARTS_MAX, heartsTs: Date.now(), selected: null, checked: false, lastOk: false, bank: buildBank(curEx()), answer: [] });
        toast('Vidas recuperadas! 💖');
        break;
      case 'startDaily': startDaily(); break;
      case 'startReview': startReview(); break;
      case 'toggleSound': {
        var on = !S.soundOn;
        S.soundOn = on; // define antes para o SFX respeitar o novo estado
        set({ soundOn: on });
        if (on) SFX.correct();
        break;
      }
      case 'speak': speak(curEx().audioEs || curEx().es); break;
      case 'speakSlow': speak(curEx().audioEs || curEx().es, 0.55); break;
      case 'micStart': micStart(); break;
      case 'matchLeft': matchLeft(parseInt(t.getAttribute('data-i'), 10)); break;
      case 'matchRight': matchRight(parseInt(t.getAttribute('data-i'), 10)); break;
      case 'teachDone': beginExercises(); break;
      case 'speakText': speak(t.getAttribute('data-text')); break;
      case 'speakSkip': S.speakHeard = ''; S.speakStatus = 'done'; commitSpeak(true); break;
      case 'speakSelfOk': S.speakHeard = ''; S.speakStatus = 'done'; commitSpeak(true); break;
      case 'speakRetry': speakRetry(); break;
      case 'rename': {
        var nn = window.prompt('Como você quer ser chamado?', S.name);
        if (nn && nn.trim()) set({ name: nn.trim().slice(0, 24) });
        break;
      }
      case 'reset': {
        if (window.confirm('Reiniciar todo o progresso? Esta ação não pode ser desfeita.')) {
          try { localStorage.removeItem(STORE_KEY); } catch (err) {}
          var d = defaults();
          Object.assign(S, d, { screen: 'onboarding', obStep: 0, obGoal: d.dailyGoalXp, cur: null, exIndex: 0, correct: 0, gainedXp: 0, bank: [], answer: [], selected: null, checked: false });
          persist(); render();
        }
        break;
      }
    }
  });

  // Enter no campo de nome avança o onboarding.
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.id === 'ob-name') {
      e.preventDefault();
      var nm = e.target.value ? e.target.value.trim().slice(0, 24) : '';
      if (!nm) { toast('Digite seu nome 🙂'); return; }
      set({ name: nm, obStep: 2 });
    }
  });

  // ===========================================================
  //  Altura real da viewport (contorna barras móveis)
  // ===========================================================
  function setAppHeight() {
    document.documentElement.style.setProperty('--app-h', window.innerHeight + 'px');
  }
  window.addEventListener('resize', setAppHeight);
  window.addEventListener('orientationchange', setAppHeight);
  setAppHeight();

  // pré-carrega vozes
  try {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {};
    }
  } catch (e) {}

  // hook de teste (inofensivo em produção)
  try { window.CAMINO_TEST = { speakMatch: speakMatch, normPhrase: normPhrase, speakEvaluate: speakEvaluate }; } catch (e) {}

  render();
})();
