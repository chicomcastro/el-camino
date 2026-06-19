/* ============================================================
   Camino — currículo (níveis → módulos → lições → exercícios)
   Espanhol para missionários iniciantes.
   UI em português · aprendendo espanhol.

   Progressão por níveis (CEFR-like), do zero à fluência:
   Iniciante · Básico · Intermediário 1 · Intermediário 2 ·
   Avançado 1 · Avançado 2 · Fluente.

   Cada módulo carrega um dos 3 temas, codificado por cor:
   Viagem (azul), Conversa com estranhos (roxo), Evangelização (vermelho).
   A dificuldade cresce a cada nível: frases mais longas, menos apoio
   em português, mais ditado e tradução PT→ES.
   ============================================================ */

window.CAMINO_ICONS = {
  star: 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z',
  plane: 'M22,16.5V14.5L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L1,14.5V16.5L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L22,16.5Z',
  map: 'M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z',
  cart: 'M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z',
  account: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
  chat: 'M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z',
  hand: 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z',
  heart: 'M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z',
  cross: 'M10,2H14A2,2 0 0,1 16,4V7H19A2,2 0 0,1 21,9V13A2,2 0 0,1 19,15H16V20A2,2 0 0,1 14,22H10A2,2 0 0,1 8,20V15H5A2,2 0 0,1 3,13V9A2,2 0 0,1 5,7H8V4A2,2 0 0,1 10,2Z',
  book: 'M18,2A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2H18M18,4H13V12L10.5,9.75L8,12V4H6V20H18V4Z',
  lock: 'M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z',
  checkC: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z',
  alert: 'M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  trophy: 'M18,2H6V9A6,6 0 0,0 9,14.19V18H7A1,1 0 0,0 6,19V21H18V19A1,1 0 0,0 17,18H15V14.19A6,6 0 0,0 18,9V2M16,4V5H8V4H16M4,5H2V7A3,3 0 0,0 5,10H5.41A8,8 0 0,1 4,6.5V5M20,5V6.5A8,8 0 0,1 18.59,10H19A3,3 0 0,0 22,7V5H20Z',
  flame: 'M17.66,11.2C17.43,10.9 17.15,10.64 16.89,10.38C16.22,9.78 15.46,9.35 14.82,8.72C13.33,7.26 13,4.85 13.95,3C13,3.23 12.17,3.75 11.46,4.32C8.87,6.4 7.85,10.07 9.07,13.22C9.11,13.32 9.15,13.42 9.15,13.55C9.15,13.77 9,13.97 8.8,14.05C8.57,14.15 8.33,14.09 8.14,13.93C8.08,13.88 8.04,13.83 8,13.76C6.87,12.33 6.69,10.28 7.45,8.64C5.78,10 4.87,12.3 5,14.47C5.06,14.97 5.12,15.47 5.29,15.97C5.43,16.57 5.7,17.17 6,17.7C7.08,19.43 8.95,20.67 10.96,20.92C13.1,21.19 15.39,20.8 17.03,19.32C18.86,17.66 19.5,15 18.56,12.72C18.34,12.18 18.03,11.66 17.66,11.2M14.5,17.5C14.22,17.74 13.76,18 13.4,18.1C12.28,18.5 11.16,17.94 10.5,17.28C11.69,17 12.4,16.12 12.61,15.23C12.78,14.43 12.46,13.77 12.33,13C12.21,12.26 12.23,11.63 12.5,10.94C12.69,11.32 12.89,11.7 13.13,12C13.9,13 15.11,13.44 15.37,14.8C15.41,14.94 15.43,15.08 15.43,15.23C15.46,16.05 15.1,16.95 14.5,17.5H14.5Z',
  medal: 'M12,2A5,5 0 0,1 17,7C17,8.7 16.15,10.2 14.86,11.1L17,22L12,19L7,22L9.14,11.1C7.85,10.2 7,8.7 7,7A5,5 0 0,1 12,2M12,4A3,3 0 0,0 9,7A3,3 0 0,0 12,10A3,3 0 0,0 15,7A3,3 0 0,0 12,4Z',
  earth: 'M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
};

// Cores de tema (mantêm a identidade dos 3 temas).
var THEME = {
  viagem:        { theme: 'Viagem',        color: '#3C76E8', shadow: '#1446AB' },
  conversa:      { theme: 'Conversa',      color: '#9D55FF', shadow: '#7A26E0' },
  evangelizacao: { theme: 'Evangelização', color: '#E73B4C', shadow: '#C71C2D' },
};

// Atalho para montar módulos: m(id, título, tema, ícone, lições)
function m(id, title, themeKey, icon, lessons) {
  var t = THEME[themeKey];
  return { id: id, title: title, theme: t.theme, color: t.color, shadow: t.shadow, icon: icon, lessons: lessons };
}

window.CAMINO_DATA = {
  // Níveis na ordem da jornada. accent = cor do nível (banner/level-up).
  levels: [
    // ===================== 1 · INICIANTE =====================
    { id: 'iniciante', name: 'Iniciante', short: 'A1', accent: '#1AC136', accentDk: '#0B8C21',
      tagline: 'As primeiras palavras e a sobrevivência na viagem.',
      modules: [
        m('ini-m1', 'Primeiros passos', 'viagem', 'star', [
          { id: 'ini-m1-l1', title: 'Saudações', icon: 'star', exercises: [
            { type: 'mcq', prompt: 'Toque na tradução correta', audioEs: '¡Buenos días!',
              options: ['Bom dia', 'Boa noite', 'Até logo', 'Por favor'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa em português?', bubblePt: 'Gracias',
              options: ['Obrigado', 'Por favor', 'Desculpe', 'De nada'], correct: 0 },
            { type: 'bank', prompt: 'Monte a saudação em espanhol', bubblePt: 'Olá, bom dia!',
              words: ['Hola', 'buenos', 'días', 'noches', 'gracias'], solution: ['Hola', 'buenos', 'días'] },
            { type: 'mcq', prompt: 'Como se diz "por favor"?',
              options: ['Por favor', 'De nada', 'Lo siento', 'Hasta luego'], correct: 0 },
            { type: 'cloze', prompt: 'Complete a frase', pt: 'Olá, bom dia!',
              sentence: 'Hola, buenos ___', options: ['días', 'noches', 'gracias', 'tardes'], correct: 0 },
            { type: 'speak', prompt: 'Fale em voz alta', es: '¡Buenos días!', pt: 'Bom dia!' },
          ] },
          { id: 'ini-m1-l2', title: 'Sim, não, desculpe', icon: 'chat', exercises: [
            { type: 'mcq', prompt: 'O que significa "sí"?',
              options: ['sim', 'não', 'talvez', 'sempre'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "desculpe / com licença"?', audioEs: 'Perdón',
              options: ['Perdón', 'Gracias', 'Hola', 'Adiós'], correct: 0 },
            { type: 'match', prompt: 'Relacione as colunas',
              pairs: [['hola', 'olá'], ['gracias', 'obrigado'], ['adiós', 'tchau'], ['perdón', 'desculpe']] },
            { type: 'mcq', prompt: 'O que significa "adiós"?',
              options: ['tchau', 'olá', 'obrigado', 'sim'], correct: 0 },
          ] },
        ]),
        m('ini-m2', 'Sobreviver na viagem', 'viagem', 'plane', [
          { id: 'ini-m2-l1', title: 'No aeroporto', icon: 'plane', exercises: [
            { type: 'mcq', prompt: 'Como se diz em espanhol?', bubblePt: 'Onde fica o banheiro?',
              options: ['¿Dónde está el baño?', '¿Cuánto cuesta?', '¿Qué hora es?', '¿Cómo estás?'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'el pasaporte',
              options: ['o passaporte', 'a passagem', 'a mala', 'o aeroporto'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Cuánto cuesta?', dictation: true,
              words: ['¿Cuánto', 'cuesta?', 'dónde', 'está'], solution: ['¿Cuánto', 'cuesta?'] },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou perdido',
              words: ['Estoy', 'perdido', 'cansado', 'aquí'], solution: ['Estoy', 'perdido'] },
          ] },
          { id: 'ini-m2-l2', title: 'Necessidades', icon: 'cart', exercises: [
            { type: 'mcq', prompt: 'O que significa "agua"?',
              options: ['água', 'comida', 'ajuda', 'pão'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou com fome',
              words: ['Tengo', 'hambre', 'sed', 'frío'], solution: ['Tengo', 'hambre'] },
            { type: 'mcq', prompt: 'Como se pede ajuda?', audioEs: '¿Me puede ayudar?',
              options: ['¿Me puede ayudar?', '¿Cómo te llamas?', '¿Qué hora es?', 'Buen viaje'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Necesito agua', dictation: true,
              words: ['Necesito', 'agua', 'comida', 'ayuda'], solution: ['Necesito', 'agua'] },
          ] },
        ]),
      ] },

    // ===================== 2 · BÁSICO =====================
    { id: 'basico', name: 'Básico', short: 'A2', accent: '#3C76E8', accentDk: '#1446AB',
      tagline: 'Apresentar-se, puxar conversa e se virar na cidade.',
      modules: [
        m('bas-m1', 'Conhecer pessoas', 'conversa', 'account', [
          { id: 'bas-m1-l1', title: 'Apresentar-se', icon: 'account', exercises: [
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Cómo te llamas?', dictation: true,
              words: ['¿Cómo', 'te', 'llamas?', 'dónde', 'vives'], solution: ['¿Cómo', 'te', 'llamas?'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Mucho gusto',
              options: ['Muito prazer', 'Boa viagem', 'Com licença', 'Boa sorte'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Meu nome é Lucas',
              words: ['Me', 'llamo', 'Lucas', 'soy', 'gusto'], solution: ['Me', 'llamo', 'Lucas'] },
            { type: 'mcq', prompt: 'Como se diz "Eu sou do Brasil"?',
              options: ['Soy de Brasil', 'Eres de Brasil', 'Vivo aquí', 'Me gusta Brasil'], correct: 0 },
            { type: 'cloze', prompt: 'Complete a frase', pt: 'Meu nome é Lucas',
              sentence: 'Me ___ Lucas', options: ['llamo', 'llamas', 'nombre', 'soy'], correct: 0 },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Mucho gusto, me llamo Lucas', pt: 'Muito prazer, meu nome é Lucas' },
          ] },
          { id: 'bas-m1-l2', title: 'Bate-papo', icon: 'chat', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿De dónde eres?',
              options: ['De onde você é?', 'Como você está?', 'Onde você mora?', 'Quantos anos tem?'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Cómo estás?', dictation: true,
              words: ['¿Cómo', 'estás?', 'eres', 'bien'], solution: ['¿Cómo', 'estás?'] },
            { type: 'match', prompt: 'Relacione as colunas',
              pairs: [['¿cómo estás?', 'como vai?'], ['bien', 'bem'], ['¿de dónde eres?', 'de onde é?'], ['gracias', 'obrigado']] },
            { type: 'bank', prompt: 'Monte a pergunta em espanhol', bubblePt: 'Você fala espanhol?',
              words: ['¿Hablas', 'español?', 'portugués', 'inglés'], solution: ['¿Hablas', 'español?'] },
          ] },
        ]),
        m('bas-m2', 'Na cidade', 'viagem', 'map', [
          { id: 'bas-m2-l1', title: 'Direções', icon: 'map', exercises: [
            { type: 'mcq', prompt: 'O que significa "a la derecha"?',
              options: ['à direita', 'à esquerda', 'em frente', 'atrás'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "à esquerda"?',
              options: ['a la izquierda', 'a la derecha', 'todo recto', 'cerca'], correct: 0 },
            { type: 'bank', prompt: 'Monte a pergunta em espanhol', bubblePt: 'Onde fica o hotel?',
              words: ['¿Dónde', 'está', 'el', 'hotel?', 'baño'], solution: ['¿Dónde', 'está', 'el', 'hotel?'] },
            { type: 'mcq', prompt: 'O que significa "cerca"?',
              options: ['perto', 'longe', 'rua', 'mapa'], correct: 0 },
          ] },
          { id: 'bas-m2-l2', title: 'Compras', icon: 'cart', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Cuánto cuesta?',
              options: ['Quanto custa?', 'Onde fica?', 'Que horas são?', 'Como vai?'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa "caro"?',
              options: ['caro', 'barato', 'dinheiro', 'troco'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'A conta, por favor',
              words: ['La', 'cuenta,', 'por', 'favor', 'gracias'], solution: ['La', 'cuenta,', 'por', 'favor'] },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Es muy barato', dictation: true,
              words: ['Es', 'muy', 'barato', 'caro'], solution: ['Es', 'muy', 'barato'] },
          ] },
        ]),
      ] },

    // ===================== 3 · INTERMEDIÁRIO 1 =====================
    { id: 'inter1', name: 'Intermediário 1', short: 'B1', accent: '#9D55FF', accentDk: '#7A26E0',
      tagline: 'Compartilhar a fé e falar um pouco sobre você.',
      modules: [
        m('int1-m1', 'Compartilhar a fé', 'evangelizacao', 'heart', [
          { id: 'int1-m1-l1', title: 'A mensagem', icon: 'heart', exercises: [
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Deus te ama',
              words: ['Dios', 'te', 'ama', 'casa', 'gracias'], solution: ['Dios', 'te', 'ama'] },
            { type: 'mcq', prompt: 'O que significa "la fe"?',
              options: ['a fé', 'o amor', 'a paz', 'a esperança'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "o amor de Deus"?', audioEs: 'el amor de Dios',
              options: ['el amor de Dios', 'la fe de Dios', 'la paz de Dios', 'el hijo de Dios'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Jesús te ama', dictation: true,
              words: ['Jesús', 'te', 'ama', 'Dios'], solution: ['Jesús', 'te', 'ama'] },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Dios te ama', pt: 'Deus te ama' },
          ] },
          { id: 'int1-m1-l2', title: 'O convite', icon: 'cross', exercises: [
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Puedo orar por ti?', dictation: true,
              words: ['¿Puedo', 'orar', 'por', 'ti?', 'hoy'], solution: ['¿Puedo', 'orar', 'por', 'ti?'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Quieres conocer a Jesús?',
              options: ['Quer conhecer Jesus?', 'Você conhece Jesus?', 'Onde está Jesus?', 'Quem é Jesus?'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa "la Biblia"?',
              options: ['a Bíblia', 'a igreja', 'a oração', 'a palavra'], correct: 0 },
            { type: 'bank', prompt: 'Monte o convite em espanhol', bubblePt: 'Posso orar por você?',
              words: ['¿Puedo', 'orar', 'por', 'ti?', 'hoy'], solution: ['¿Puedo', 'orar', 'por', 'ti?'] },
          ] },
        ]),
        m('int1-m2', 'Falar de si', 'conversa', 'account', [
          { id: 'int1-m2-l1', title: 'Sobre você', icon: 'account', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Soy misionero',
              options: ['Sou missionário', 'Sou viajante', 'Estou perdido', 'Sou estudante'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou de viagem',
              words: ['Estoy', 'de', 'viaje', 'aquí', 'bien'], solution: ['Estoy', 'de', 'viaje'] },
            { type: 'mcq', prompt: 'Como se diz "Tenho vinte anos"?',
              options: ['Tengo veinte años', 'Soy veinte años', 'Hace veinte años', 'Veinte años aquí'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Soy de Brasil', dictation: true,
              words: ['Soy', 'de', 'Brasil', 'aquí'], solution: ['Soy', 'de', 'Brasil'] },
          ] },
          { id: 'int1-m2-l2', title: 'Sentimentos', icon: 'chat', exercises: [
            { type: 'mcq', prompt: 'O que significa "estoy agradecido"?',
              options: ['estou agradecido', 'estou cansado', 'estou feliz', 'estou nervoso'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou muito feliz',
              words: ['Estoy', 'muy', 'feliz', 'triste', 'cansado'], solution: ['Estoy', 'muy', 'feliz'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Estoy un poco cansado',
              options: ['Estou um pouco cansado', 'Estou com fome', 'Estou animado', 'Estou perdido'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Gracias a Dios', dictation: true,
              words: ['Gracias', 'a', 'Dios', 'por'], solution: ['Gracias', 'a', 'Dios'] },
          ] },
        ]),
      ] },

    // ===================== 4 · INTERMEDIÁRIO 2 =====================
    { id: 'inter2', name: 'Intermediário 2', short: 'B1+', accent: '#7A26E0', accentDk: '#5C19B1',
      tagline: 'Seu testemunho, versículos e combinar planos.',
      modules: [
        m('int2-m1', 'Testemunho', 'evangelizacao', 'book', [
          { id: 'int2-m1-l1', title: 'Minha história', icon: 'book', exercises: [
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Deus mudou minha vida',
              words: ['Dios', 'cambió', 'mi', 'vida', 'casa', 'fe'], solution: ['Dios', 'cambió', 'mi', 'vida'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Antes estaba perdido, ahora tengo paz',
              options: ['Antes estava perdido, agora tenho paz', 'Hoje estou cansado, amanhã viajo', 'Tenho fé e esperança', 'Quero conhecer a Deus'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "Encontrei a paz"?',
              options: ['Encontré la paz', 'Busco la paz', 'Tengo miedo', 'Soy feliz'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Dios cambió mi vida', dictation: true,
              words: ['Dios', 'cambió', 'mi', 'vida', 'paz'], solution: ['Dios', 'cambió', 'mi', 'vida'] },
          ] },
          { id: 'int2-m1-l2', title: 'Versículos', icon: 'cross', exercises: [
            { type: 'mcq', prompt: 'Complete o versículo (Juan 3:16)', bubblePt: '"Porque Deus amou o mundo de tal maneira..."',
              options: ['"Porque de tal manera amó Dios al mundo"', '"El Señor es mi pastor, nada me faltará"', '"Bienaventurados los pobres de espíritu"', '"La fe sin obras está muerta"'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa (Salmo 23)?', bubblePt: '"El Señor es mi pastor"',
              options: ['"O Senhor é meu pastor"', '"O Senhor é minha luz"', '"Deus é amor"', '"A paz esteja convosco"'], correct: 0 },
            { type: 'bank', prompt: 'Monte o versículo em espanhol', bubblePt: 'Deus é amor',
              words: ['Dios', 'es', 'amor', 'fe', 'paz'], solution: ['Dios', 'es', 'amor'] },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'La palabra de Dios', dictation: true,
              words: ['La', 'palabra', 'de', 'Dios', 'amor'], solution: ['La', 'palabra', 'de', 'Dios'] },
          ] },
        ]),
        m('int2-m2', 'Combinar planos', 'conversa', 'chat', [
          { id: 'int2-m2-l1', title: 'Hoje e amanhã', icon: 'chat', exercises: [
            { type: 'mcq', prompt: 'O que significa "mañana"?',
              options: ['amanhã', 'hoje', 'ontem', 'agora'], correct: 0 },
            { type: 'bank', prompt: 'Monte o convite em espanhol', bubblePt: 'Você quer vir amanhã?',
              words: ['¿Quieres', 'venir', 'mañana?', 'hoy?', 'aquí'], solution: ['¿Quieres', 'venir', 'mañana?'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Nos vemos mañana',
              options: ['A gente se vê amanhã', 'Vamos agora', 'Até semana que vem', 'Boa noite'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Quieres venir?', dictation: true,
              words: ['¿Quieres', 'venir?', 'mañana', 'hoy'], solution: ['¿Quieres', 'venir?'] },
          ] },
          { id: 'int2-m2-l2', title: 'Convites', icon: 'chat', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Quieres ir conmigo?',
              options: ['Quer ir comigo?', 'Você mora aqui?', 'Quer comer algo?', 'Onde você vai?'], correct: 0 },
            { type: 'bank', prompt: 'Monte o convite em espanhol', bubblePt: 'Vamos comer juntos',
              words: ['Vamos', 'a', 'comer', 'juntos', 'hoy', 'casa'], solution: ['Vamos', 'a', 'comer', 'juntos'] },
            { type: 'mcq', prompt: 'Como se diz "Eu te convido"?',
              options: ['Te invito', 'Te llamo', 'Te veo', 'Te espero'], correct: 0 },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Te invito a comer', pt: 'Eu te convido para comer' },
          ] },
        ]),
      ] },

    // ===================== 5 · AVANÇADO 1 =====================
    { id: 'avan1', name: 'Avançado 1', short: 'B2', accent: '#E8730C', accentDk: '#B5530A',
      tagline: 'Dar opinião e responder perguntas mais profundas.',
      modules: [
        m('av1-m1', 'Diálogo mais profundo', 'conversa', 'chat', [
          { id: 'av1-m1-l1', title: 'Dar opinião', icon: 'chat', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Creo que es importante',
              options: ['Acho que é importante', 'Sei que é difícil', 'Quero que venha', 'Não tenho certeza'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou de acordo com você',
              words: ['Estoy', 'de', 'acuerdo', 'contigo', 'mañana', 'no'], solution: ['Estoy', 'de', 'acuerdo', 'contigo'] },
            { type: 'mcq', prompt: 'Como se diz "Não tenho certeza"?',
              options: ['No estoy seguro', 'Estoy de acuerdo', 'Me parece bien', 'Creo que sí'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Me parece muy bien', dictation: true,
              words: ['Me', 'parece', 'muy', 'bien', 'mal'], solution: ['Me', 'parece', 'muy', 'bien'] },
          ] },
          { id: 'av1-m1-l2', title: 'Perguntas difíceis', icon: 'heart', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Por qué sufrimos?',
              options: ['Por que sofremos?', 'Onde vivemos?', 'Quem nos ama?', 'Quando voltamos?'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Há esperança em Deus',
              words: ['Hay', 'esperanza', 'en', 'Dios', 'miedo', 'casa'], solution: ['Hay', 'esperanza', 'en', 'Dios'] },
            { type: 'mcq', prompt: 'O que significa "el perdón"?',
              options: ['o perdão', 'a dúvida', 'o medo', 'o sofrimento'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Dios da esperanza', dictation: true,
              words: ['Dios', 'da', 'esperanza', 'paz'], solution: ['Dios', 'da', 'esperanza'] },
          ] },
        ]),
        m('av1-m2', 'Conversas de fé', 'evangelizacao', 'heart', [
          { id: 'av1-m2-l1', title: 'Dúvidas comuns', icon: 'heart', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Cómo sé que Dios existe?',
              options: ['Como sei que Deus existe?', 'Onde está Deus agora?', 'Quem criou o mundo?', 'Por que orar a Deus?'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Deus tem um plano para você',
              words: ['Dios', 'tiene', 'un', 'plan', 'para', 'ti', 'casa'], solution: ['Dios', 'tiene', 'un', 'plan', 'para', 'ti'] },
            { type: 'mcq', prompt: 'O que significa "la duda"?',
              options: ['a dúvida', 'a verdade', 'a prova', 'a razão'], correct: 0 },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Dios tiene un plan para ti', pt: 'Deus tem um plano para você' },
          ] },
          { id: 'av1-m2-l2', title: 'Compartilhar esperança', icon: 'cross', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'En los momentos difíciles, no estás solo',
              options: ['Nos momentos difíceis, você não está sozinho', 'Os dias bons vão voltar logo', 'Tudo acontece por um motivo', 'A vida é cheia de provações'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Jesus dá paz ao coração',
              words: ['Jesús', 'da', 'paz', 'al', 'corazón', 'mundo'], solution: ['Jesús', 'da', 'paz', 'al', 'corazón'] },
            { type: 'mcq', prompt: 'Como se diz "Você pode confiar em Deus"?',
              options: ['Puedes confiar en Dios', 'Quieres hablar con Dios', 'Debes orar a Dios', 'Vas a ver a Dios'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'No estás solo', dictation: true,
              words: ['No', 'estás', 'solo', 'triste'], solution: ['No', 'estás', 'solo'] },
          ] },
        ]),
      ] },

    // ===================== 6 · AVANÇADO 2 =====================
    { id: 'avan2', name: 'Avançado 2', short: 'C1', accent: '#E73B4C', accentDk: '#C71C2D',
      tagline: 'Acompanhar quem crê e entender a cultura local.',
      modules: [
        m('av2-m1', 'Discipulado', 'evangelizacao', 'book', [
          { id: 'av2-m1-l1', title: 'Crescer na fé', icon: 'book', exercises: [
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Vamos orar juntos',
              words: ['Vamos', 'a', 'orar', 'juntos', 'casa', 'hoy'], solution: ['Vamos', 'a', 'orar', 'juntos'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Podemos leer la Biblia juntos',
              options: ['Podemos ler a Bíblia juntos', 'Vamos à igreja amanhã', 'Deus te abençoe sempre', 'Quero conhecer Jesus'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa "crecer en la fe"?',
              options: ['crescer na fé', 'orar pela paz', 'ler a palavra', 'ir à igreja'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Vamos a la iglesia', dictation: true,
              words: ['Vamos', 'a', 'la', 'iglesia', 'casa'], solution: ['Vamos', 'a', 'la', 'iglesia'] },
          ] },
          { id: 'av2-m1-l2', title: 'Orar e servir', icon: 'heart', exercises: [
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Vamos orar pelos outros',
              words: ['Vamos', 'a', 'orar', 'por', 'los', 'demás', 'casa'], solution: ['Vamos', 'a', 'orar', 'por', 'los', 'demás'] },
            { type: 'mcq', prompt: 'O que significa "servir con amor"?',
              options: ['servir com amor', 'orar com fé', 'viver em paz', 'falar com Deus'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Cómo puedo ayudarte?',
              options: ['Como posso te ajudar?', 'Quando você volta?', 'Onde você vai?', 'Por que está triste?'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Dios escucha tus oraciones', dictation: true,
              words: ['Dios', 'escucha', 'tus', 'oraciones', 'palabras'], solution: ['Dios', 'escucha', 'tus', 'oraciones'] },
          ] },
        ]),
        m('av2-m2', 'Cultura e viagem', 'viagem', 'earth', [
          { id: 'av2-m2-l1', title: 'Costumes', icon: 'earth', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'la comida típica',
              options: ['a comida típica', 'a festa local', 'o costume antigo', 'a rua principal'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Tenha cuidado na rua',
              words: ['Ten', 'cuidado', 'en', 'la', 'calle', 'casa'], solution: ['Ten', 'cuidado', 'en', 'la', 'calle'] },
            { type: 'mcq', prompt: 'O que significa "las costumbres"?',
              options: ['os costumes', 'as compras', 'as comidas', 'as cidades'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Me gusta la cultura', dictation: true,
              words: ['Me', 'gusta', 'la', 'cultura', 'comida'], solution: ['Me', 'gusta', 'la', 'cultura'] },
          ] },
          { id: 'av2-m2-l2', title: 'Convivência', icon: 'account', exercises: [
            { type: 'mcq', prompt: 'O que significa "respetar las costumbres"?',
              options: ['respeitar os costumes', 'conhecer a cidade', 'provar a comida', 'aprender a língua'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Obrigado pela sua hospitalidade',
              words: ['Gracias', 'por', 'tu', 'hospitalidad', 'comida'], solution: ['Gracias', 'por', 'tu', 'hospitalidad'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Me siento bienvenido',
              options: ['Sinto-me bem-vindo', 'Estou com pressa', 'Gosto daqui', 'Preciso de ajuda'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Gracias por todo', dictation: true,
              words: ['Gracias', 'por', 'todo', 'venir'], solution: ['Gracias', 'por', 'todo'] },
          ] },
        ]),
      ] },

    // ===================== 7 · FLUENTE =====================
    { id: 'fluente', name: 'Fluente', short: 'C2', accent: '#C9A227', accentDk: '#9A7B12',
      tagline: 'Expressões naturais e a missão por completo.',
      modules: [
        m('flu-m1', 'Soar natural', 'conversa', 'star', [
          { id: 'flu-m1-l1', title: 'Expressões', icon: 'star', exercises: [
            { type: 'mcq', prompt: 'O que significa "vale" (Espanha)?',
              options: ['ok / combinado', 'tchau', 'obrigado', 'talvez'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'No pasa nada',
              options: ['Tudo bem / sem problema', 'Não entendi', 'Que pena', 'De novo'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa "¡Qué chévere!" (América Latina)?',
              options: ['Que legal!', 'Que pena!', 'Com certeza!', 'Tanto faz!'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'En serio, no pasa nada', dictation: true,
              words: ['En', 'serio,', 'no', 'pasa', 'nada', 'bien'], solution: ['En', 'serio,', 'no', 'pasa', 'nada'] },
          ] },
          { id: 'flu-m1-l2', title: 'Gírias e fluência', icon: 'chat', exercises: [
            { type: 'mcq', prompt: 'O que significa "¡Qué guay!" (Espanha)?',
              options: ['Que legal!', 'Que pena!', 'Que rápido!', 'Que caro!'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Nos vemos al rato',
              options: ['A gente se vê daqui a pouco', 'Vejo você amanhã', 'Até mais tarde hoje', 'Nos falamos depois'], correct: 0 },
            { type: 'bank', prompt: 'Monte a resposta em espanhol', bubblePt: 'Tudo bem, perfeito',
              words: ['Vale,', 'perfecto', 'gracias', 'bien'], solution: ['Vale,', 'perfecto'] },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Vale, nos vemos al rato', pt: 'Ok, a gente se vê daqui a pouco' },
          ] },
        ]),
        m('flu-m2', 'Missão completa', 'evangelizacao', 'cross', [
          { id: 'flu-m2-l1', title: 'Encorajamento', icon: 'cross', exercises: [
            { type: 'bank', prompt: 'Monte a bênção em espanhol', bubblePt: 'Que Deus te abençoe sempre',
              words: ['Que', 'Dios', 'te', 'bendiga', 'siempre', 'hoy'], solution: ['Que', 'Dios', 'te', 'bendiga', 'siempre'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Sigue adelante con fe',
              options: ['Siga em frente com fé', 'Volte para casa', 'Descanse um pouco', 'Não tenha medo'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "paz e esperança"?',
              options: ['paz y esperanza', 'fe y amor', 'gracia y perdón', 'luz y vida'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Que Dios te bendiga', dictation: true,
              words: ['Que', 'Dios', 'te', 'bendiga', 'ama'], solution: ['Que', 'Dios', 'te', 'bendiga'] },
          ] },
          { id: 'flu-m2-l2', title: 'Despedida', icon: 'star', exercises: [
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Foi um prazer te conhecer',
              words: ['Fue', 'un', 'placer', 'conocerte', 'gracias', 'hoy'], solution: ['Fue', 'un', 'placer', 'conocerte'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Cuídate mucho',
              options: ['Cuide-se muito', 'Volte logo', 'Boa sorte', 'Até amanhã'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "Até logo, amigo"?',
              options: ['Hasta pronto, amigo', 'Buenos días, amigo', 'Mucho gusto, amigo', 'Por favor, amigo'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Que tengas un buen viaje', dictation: true,
              words: ['Que', 'tengas', 'un', 'buen', 'viaje', 'día'], solution: ['Que', 'tengas', 'un', 'buen', 'viaje'] },
          ] },
        ]),
      ] },
  ],

  // Conquistas. kind: 'level' (concluir um nível, n = id do nível) ·
  // 'lessons' (n lições concluídas) · 'streak' (n dias de ofensiva).
  achievements: [
    { id: 'a-first',  name: 'Primeiros passos', icon: 'star',   c: '#3C76E8', bg: '#E5EEFF', kind: 'lessons', n: 1 },
    { id: 'a-ini',    name: 'Iniciante feito',  icon: 'plane',  c: '#1AC136', bg: '#E7FEEA', kind: 'level',   n: 'iniciante' },
    { id: 'a-bas',    name: 'Básico feito',     icon: 'map',    c: '#3C76E8', bg: '#E5EEFF', kind: 'level',   n: 'basico' },
    { id: 'a-streak', name: 'Ofensiva de 3',    icon: 'flame',  c: '#E8730C', bg: '#FFF1E0', kind: 'streak',  n: 3 },
    { id: 'a-xp',     name: '500 XP',           icon: 'medal',  c: '#E8A13C', bg: '#FFF4E5', kind: 'xp',      n: 500 },
    { id: 'a-msg',    name: 'Mensageiro',       icon: 'heart',  c: '#E73B4C', bg: '#FFE6E9', kind: 'level',   n: 'inter1' },
    { id: 'a-test',   name: 'Testemunha',       icon: 'book',   c: '#7A26E0', bg: '#F5F0FF', kind: 'level',   n: 'inter2' },
    { id: 'a-adv',    name: 'Comunicador',      icon: 'chat',   c: '#E8730C', bg: '#FFF1E0', kind: 'level',   n: 'avan1' },
    { id: 'a-disc',   name: 'Discipulador',     icon: 'cross',  c: '#E73B4C', bg: '#FFE6E9', kind: 'level',   n: 'avan2' },
    { id: 'a-fluent', name: 'Fluente',          icon: 'trophy', c: '#C9A227', bg: '#FBF3D6', kind: 'level',   n: 'fluente' },
  ],
};
