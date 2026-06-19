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

  // ---- trilha achatada: sequência contínua de lições ----
  var TRAIL = [];
  DATA.units.forEach(function (u, ui) {
    u.lessons.forEach(function (l, li) {
      TRAIL.push({ unit: u, lesson: l, unitIdx: ui, lessonIdx: li, globalIdx: TRAIL.length });
    });
  });
  var TOTAL_LESSONS = TRAIL.length;

  // ===========================================================
  //  Persistência
  // ===========================================================
  function defaults() {
    return {
      name: 'Lucas',
      onboarded: false,     // já passou pelo onboarding?
      dailyGoalXp: 50,      // meta diária de XP
      progress: 0,          // nº de lições concluídas (índice da lição atual)
      totalXp: 0,
      hearts: HEARTS_MAX,
      heartsTs: Date.now(), // momento da última perda (base p/ regenerar)
      streak: 0,
      lastActive: null,     // 'YYYY-MM-DD'
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
      name: S.name, onboarded: S.onboarded, dailyGoalXp: S.dailyGoalXp,
      progress: S.progress, totalXp: S.totalXp,
      hearts: S.hearts, heartsTs: S.heartsTs, streak: S.streak, lastActive: S.lastActive,
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
  S.obStep = 0;       // passo do onboarding
  S.obGoal = S.dailyGoalXp; // seleção temporária de meta no onboarding
  S.cur = null;       // índice global da lição em curso
  S.exIndex = 0;
  S.selected = null;
  S.checked = false;
  S.lastOk = false;
  S.correct = 0;
  S.bank = [];
  S.answer = [];
  S.gainedXp = 0;
  S.shakeKey = 0;

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

  // nº de conquistas desbloqueadas
  function medalsCount() {
    return DATA.achievements.filter(function (a) { return S.progress >= a.need; }).length;
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

  function viewHome() {
    var pattern = [0, 46, 66, 46, 0, -46, -66, -46];
    var html = '';

    // topbar
    html += '<div class="topbar">' +
      '<div class="row" style="gap:7px;flex:1;"><div class="flag"></div><span class="lang">Espanhol</span></div>' +
      '<div class="pill streak">' + svg(IC.flame, 16, '#E8730C') + '<span>' + S.streak + '</span></div>' +
      '<div class="pill xp">' + svg(IC.star, 16, '#E8A13C') + '<span>' + fmt(S.totalXp) + '</span></div>' +
      '<div class="pill medals">' + svg(IC.heart, 16, '#E73B4C') + '<span>' + S.hearts + '</span></div>' +
      '</div>';

    html += '<div class="scroll" style="padding:16px 18px 28px;">';

    // saudação
    html += '<div class="greet"><div class="mascot">' + mascot(56, 'happy') + '</div>' +
      '<div style="flex:1;"><div class="t1">¡Hola, ' + esc(S.name) + '!</div>' +
      '<div class="t2">Pronto para a missão de hoje?</div></div></div>';

    // unidades + nós
    DATA.units.forEach(function (u, ui) {
      html += '<div class="unit">';
      html += '<div class="unit-banner" style="background:' + u.color + ';box-shadow:0 4px 0 ' + u.shadow + ';">' +
        '<div style="flex:1;"><div class="label">UNIDADE ' + u.num + '</div>' +
        '<div class="title">' + esc(u.title) + '</div><div class="sub">' + esc(u.sub) + '</div></div>' +
        '<div class="ico">' + svg(IC.book, 22, '#fff') + '</div></div>';

      html += '<div class="nodes">';
      u.lessons.forEach(function (l, li) {
        var gi = TRAIL.findIndex(function (t) { return t.unitIdx === ui && t.lessonIdx === li; });
        var isDone = gi < S.progress, isCurrent = gi === S.progress, locked = gi > S.progress;
        var color = locked ? 'var(--c-locked)' : u.color;
        var shadow = locked ? 'var(--c-locked-dk)' : u.shadow;
        var iconPath = locked ? IC.lock : IC[l.icon];
        var iconColor = locked ? '#9CA5B8' : '#fff';
        var off = pattern[gi % 8];

        html += '<div class="node-wrap" style="transform:translateX(' + off + 'px);">';
        if (isCurrent) {
          html += '<div class="node-start-tip" style="border-color:' + u.color + ';color:' + u.color + ';">COMEÇAR' +
            '<span class="arrow" style="border-top-color:' + u.color + ';"></span></div>';
        }
        html += '<button class="node" ' + (isCurrent ? 'data-act="start" data-gi="' + gi + '"' : 'disabled') +
          ' style="background:' + color + ';box-shadow:0 6px 0 ' + shadow + ';">' +
          svg(iconPath, 34, iconColor) + '</button>';
        if (isDone) {
          html += '<div class="node-check">' + svg('M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z', 13, '#fff') + '</div>';
        }
        html += '</div>';
      });
      html += '</div></div>';
    });

    html += '</div>'; // scroll
    html += bottomnav('home');
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

  function curEx() {
    var node = TRAIL[S.cur];
    return node ? node.lesson.exercises[S.exIndex] : {};
  }
  function curLessonLen() {
    var node = TRAIL[S.cur];
    return node ? node.lesson.exercises.length : 1;
  }

  function viewLesson() {
    var ex = curEx();
    var len = curLessonLen();
    var isMcq = ex.type === 'mcq';
    var isBank = ex.type === 'bank' || ex.type === 'listen';
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

    // MCQ
    if (isMcq) {
      html += '<div class="mcq">';
      ex.options.forEach(function (text, i) {
        var bg = '#fff', border = '#CFD6E5', color = '#20293B';
        if (S.checked) {
          if (i === ex.correct) { bg = '#E7FEEA'; border = '#1AC136'; color = '#0B8C21'; }
          else if (i === S.selected) { bg = '#FFF4E5'; border = '#E8A13C'; color = '#8E570B'; }
        } else if (i === S.selected) { bg = '#FFE6E9'; border = '#FF8995'; color = '#C71C2D'; }
        html += '<button class="opt" ' + (S.checked ? 'disabled' : 'data-act="select" data-i="' + i + '"') +
          ' style="background:' + bg + ';border-color:' + border + ';"><span style="color:' + color + ';">' +
          esc(text) + '</span></button>';
      });
      html += '</div>';
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
    var canVerify = isMcq ? S.selected !== null : S.answer.length > 0;
    var enabled = S.checked || canVerify;
    var footerBg = !S.checked ? '#fff' : (S.lastOk ? '#E7FEEA' : '#FFF4E5');
    var correctAnswer = ex.type === 'mcq'
      ? (ex.options ? ex.options[ex.correct] : '')
      : (ex.solution ? ex.solution.join(' ') : '');

    html += '<div class="footer">';
    if (S.checked) {
      var fg = S.lastOk ? '#0B8C21' : '#8E570B';
      var icon = S.lastOk ? IC.checkC : IC.alert;
      var title = S.lastOk ? '¡Muito bem!' : 'Resposta correta';
      html += '<div class="feedback" style="background:' + footerBg + ';">' +
        '<div class="ttl" style="color:' + fg + ';">' + svg(icon, 22, fg) + '<span>' + title + '</span></div>' +
        '<div class="msg" style="color:' + fg + ';">' + esc(correctAnswer) + '</div></div>';
    }
    var vBg = !enabled ? '#E3E8F1' : (S.checked && !S.lastOk ? '#E8A13C' : '#1AC136');
    var vColor = !enabled ? '#9CA5B8' : '#fff';
    var vShadow = !enabled ? '#C2CADB' : (S.checked && !S.lastOk ? '#C27B17' : '#0B8C21');
    var vLabel = S.checked ? 'CONTINUAR' : 'VERIFICAR';
    var vAct = enabled ? (S.checked ? 'next' : 'verify') : '';
    html += '<div class="verify-wrap" style="background:' + footerBg + ';">' +
      '<button class="btn-3d" ' + (enabled ? 'data-act="' + vAct + '"' : 'disabled') +
      ' style="color:' + vColor + ';background:' + vBg + ';box-shadow:0 4px 0 ' + vShadow + ';">' + vLabel + '</button></div>';
    html += '</div>';

    return html;
  }

  function viewComplete() {
    var node = TRAIL[S.cur];
    var len = node ? node.lesson.exercises.length : 1;
    var accuracy = Math.round((S.correct / len) * 100);
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

    html += '<div class="center"><div class="pop">' + mascot(148, 'happy') + '</div>' +
      '<h1>¡Lección completada!</h1>' +
      '<div class="sub">Você acertou ' + S.correct + ' de ' + len + ' · siga firme na missão!</div>' +
      '<div class="stat-cards">' +
      '<div class="stat-card" style="border-color:#FFE8C9;"><div class="cap" style="background:#E8A13C;">XP GANHO</div>' +
      '<div class="val" style="color:#8E570B;">' + svg(IC.star, 20, '#E8A13C') + '+' + S.gainedXp + '</div></div>' +
      '<div class="stat-card" style="border-color:#CCFED5;"><div class="cap" style="background:#1AC136;">PRECISÃO</div>' +
      '<div class="val" style="color:#0B8C21;">' + svg(IC.checkC, 20, '#1AC136') + accuracy + '%</div></div>' +
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
      '<div class="sub">Você ficou sem corações nesta lição. Recupere para seguir firme na missão.</div>' +
      '<div class="hearts-row">';
    for (var i = 0; i < HEARTS_MAX; i++) html += svg(IC.heart, 26, '#E9EDF4');
    html += '</div></div>';

    html += '<div class="actions">' +
      '<button class="btn-3d" data-act="revive" style="background:#E73B4C;box-shadow:0 4px 0 #C71C2D;display:flex;align-items:center;justify-content:center;gap:9px;">' +
      svg(IC.heart, 20, '#fff') + 'RECUPERAR VIDAS</button>' +
      '<button class="btn-3d" data-act="close" style="background:#F0F3FA;color:#9CA5B8;box-shadow:none;padding:14px;font-size:14px;">SAIR DA LIÇÃO</button>' +
      '</div></div>';
    return html;
  }

  function viewProfile() {
    var name = (S.name || 'Lucas').trim();
    var initials = (name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2) || 'L').toUpperCase();

    var html = '<div class="scroll">';
    html += '<div class="profile-head"><div class="avatar" data-act="rename">' + initials + '</div>' +
      '<div><div class="pname" data-act="rename">' + esc(name) + '</div>' +
      '<div class="prole">Missionário em formação · nível básico</div></div></div>';

    html += '<div class="stats">' +
      '<div class="stat" style="background:#FFF4E5;"><div class="n" style="color:#8E570B;">' + fmt(S.totalXp) + '</div><div class="l" style="color:#C27B17;">XP total</div></div>' +
      '<div class="stat" style="background:#E5EEFF;"><div class="n" style="color:#0D378C;">' + S.progress + '</div><div class="l" style="color:#1446AB;">Lições</div></div>' +
      '<div class="stat" style="background:#FFE6E9;"><div class="n" style="color:#8D0A17;">' + medalsCount() + '</div><div class="l" style="color:#C71C2D;">Medalhas</div></div>' +
      '</div>';

    // progresso por tema (calculado a partir das lições concluídas)
    html += '<div style="padding:6px 22px 4px;"><div class="section-ttl">Progresso por tema</div>';
    DATA.units.forEach(function (u, ui) {
      var total = u.lessons.length;
      var done = TRAIL.filter(function (t) { return t.unitIdx === ui && t.globalIdx < S.progress; }).length;
      var pct = Math.round((done / total) * 100);
      html += '<div class="themebar"><div class="head"><span class="lbl">' + esc(u.theme) + '</span>' +
        '<span class="pct" style="color:' + u.color + ';">' + pct + '%</span></div>' +
        '<div class="track"><i style="width:' + pct + '%;background:' + u.color + ';"></i></div></div>';
    });
    html += '</div>';

    // conquistas
    html += '<div style="padding:14px 22px 20px;"><div class="section-ttl">Conquistas</div><div class="ach-grid">';
    DATA.achievements.forEach(function (a) {
      var earned = S.progress >= a.need;
      var bg = earned ? a.bg : '#F0F3FA';
      var ring = earned ? a.c : '#E3E8F1';
      var iconColor = earned ? a.c : '#B6BECE';
      var labelColor = earned ? '#363D4D' : '#9CA5B8';
      html += '<div class="ach"><div class="medal" style="background:' + bg + ';border-color:' + ring + ';">' +
        svg(IC[a.icon], 28, iconColor) + '</div><span class="nm" style="color:' + labelColor + ';">' + esc(a.name) + '</span></div>';
    });
    html += '</div></div>';

    // preferências
    var goal = GOALS.find(function (g) { return g.xp === S.dailyGoalXp; }) || GOALS[1];
    html += '<div style="padding:0 22px 8px;"><div class="section-ttl">Preferências</div>' +
      '<button class="pref-row" data-act="changeGoal">' +
      '<div class="pref-ic" style="background:#FFF4E5;">' + svg(IC.star, 20, '#E8A13C') + '</div>' +
      '<div class="pref-txt"><span class="pref-t">Meta diária</span>' +
      '<span class="pref-s">' + goal.label + ' · ' + S.dailyGoalXp + ' XP por dia</span></div>' +
      svg('M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z', 22, '#C2CADB') + '</button>' +
      '<button class="pref-row" data-act="rename">' +
      '<div class="pref-ic" style="background:#E5EEFF;">' + svg(IC.account, 20, '#3C76E8') + '</div>' +
      '<div class="pref-txt"><span class="pref-t">Nome</span>' +
      '<span class="pref-s">' + esc(name) + '</span></div>' +
      svg('M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z', 22, '#C2CADB') + '</button>' +
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

  function render() {
    var body;
    switch (S.screen) {
      case 'onboarding': body = viewOnboarding(); break;
      case 'lesson':   body = viewLesson(); break;
      case 'complete': body = viewComplete(); break;
      case 'lives':    body = viewLives(); break;
      case 'profile':  body = viewProfile(); break;
      default:         body = viewHome();
    }
    root.innerHTML = '<div class="screen" data-screen="' + S.screen + '">' + body + '</div>' +
      '<div class="toast" id="toast"></div>';

    // Foco no campo de nome do onboarding.
    if (S.screen === 'onboarding' && S.obStep === 1) {
      var inp = document.getElementById('ob-name');
      if (inp) setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
    }
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
  //  Ações da lição
  // ===========================================================
  function buildBank(ex) {
    return ex.words ? ex.words.map(function (w, idx) { return { id: idx, w: w }; }) : [];
  }
  function initEx(i) {
    var ex = TRAIL[S.cur].lesson.exercises[i];
    Object.assign(S, { exIndex: i, selected: null, checked: false, lastOk: false, bank: buildBank(ex), answer: [] });
    render();
    if (ex.audioEs) speak(ex.audioEs);
  }
  function startLesson(gi) {
    if (S.hearts <= 0) { S.screen = 'lives'; S.cur = gi; render(); return; }
    var ex = TRAIL[gi].lesson.exercises[0];
    Object.assign(S, {
      screen: 'lesson', cur: gi, correct: 0, exIndex: 0,
      selected: null, checked: false, lastOk: false, bank: buildBank(ex), answer: [],
    });
    render();
    if (ex.audioEs) speak(ex.audioEs);
  }
  function verify() {
    var ex = curEx();
    var ok;
    if (ex.type === 'mcq') ok = S.selected === ex.correct;
    else ok = S.answer.map(function (a) { return a.w; }).join(' ') === ex.solution.join(' ');
    S.checked = true;
    S.lastOk = ok;
    if (ok) S.correct += 1;
    else { S.hearts = Math.max(0, S.hearts - 1); if (S.hearts === HEARTS_MAX - 1) S.heartsTs = Date.now(); }
    persist();
    render();
  }
  function next() {
    if (S.hearts <= 0) { set({ screen: 'lives' }); return; }
    var len = curLessonLen();
    if (S.exIndex >= len - 1) {
      var gained = 15 + S.correct * 5;
      set({ screen: 'complete', gainedXp: gained });
    } else {
      initEx(S.exIndex + 1);
    }
  }
  function todayStr() { return new Date().toISOString().slice(0, 10); }
  function bumpStreak() {
    var today = todayStr();
    if (S.lastActive === today) return;
    var yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    S.streak = (S.lastActive === yest) ? S.streak + 1 : 1;
    S.lastActive = today;
  }
  function finishLesson() {
    // conclui a lição em curso, se ainda não estava concluída
    if (S.cur === S.progress) S.progress = Math.min(TOTAL_LESSONS, S.progress + 1);
    S.totalXp += S.gainedXp;
    bumpStreak();
    set({ screen: 'home' });
    if (S.progress >= TOTAL_LESSONS) {
      setTimeout(function () { toast(svg(IC.trophy, 16, '#FFD479') + 'Trilha concluída! ¡Bien hecho!'); }, 400);
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
      case 'changeGoal': {
        var idx = GOALS.findIndex(function (g) { return g.xp === S.dailyGoalXp; });
        var nextGoal = GOALS[(idx + 1) % GOALS.length];
        set({ dailyGoalXp: nextGoal.xp });
        toast('Meta diária: ' + nextGoal.xp + ' XP/dia');
        break;
      }
      case 'start': startLesson(parseInt(t.getAttribute('data-gi'), 10)); break;
      case 'goHome': set({ screen: 'home' }); break;
      case 'goProfile': set({ screen: 'profile' }); break;
      case 'close': set({ screen: 'home' }); break;
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
      case 'revive': set({ screen: 'lesson', hearts: HEARTS_MAX, heartsTs: Date.now(), selected: null, checked: false, lastOk: false, bank: buildBank(curEx()), answer: [] }); toast('Vidas recuperadas!'); break;
      case 'speak': speak(curEx().audioEs); break;
      case 'speakSlow': speak(curEx().audioEs, 0.55); break;
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

  render();
})();
