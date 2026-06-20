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
          { id: 'ini-m1-l1', title: 'Saudações', icon: 'star',
            teach: [
              { es: 'Hola', pt: 'Olá' },
              { es: '¡Buenos días!', pt: 'Bom dia!' },
              { es: 'Gracias', pt: 'Obrigado' },
              { es: 'Por favor', pt: 'Por favor' },
            ],
            exercises: [
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
            { type: 'pic', prompt: 'Toque na imagem certa', es: 'el baño',
              options: ['🚻', '✈️', '🧳', '🗺️'], correct: 0 },
          ] },
          { id: 'ini-m2-l2', title: 'Necessidades', icon: 'cart', exercises: [
            { type: 'mcq', prompt: 'O que significa "agua"?',
              options: ['água', 'comida', 'ajuda', 'pão'], correct: 0 },
            { type: 'pic', prompt: 'Toque na imagem certa', es: 'agua',
              options: ['💧', '🍞', '☕', '💰'], correct: 0 },
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
          { id: 'bas-m1-l1', title: 'Apresentar-se', icon: 'account',
            teach: [
              { es: '¿Cómo te llamas?', pt: 'Como você se chama?' },
              { es: 'Me llamo…', pt: 'Meu nome é…' },
              { es: 'Mucho gusto', pt: 'Muito prazer' },
              { es: 'Soy de Brasil', pt: 'Sou do Brasil' },
            ],
            exercises: [
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
          { id: 'bas-m1-l3', title: 'Tú e usted', icon: 'account',
            teach: [
              { es: 'tú', pt: 'você (informal) — amigos, crianças, jovens' },
              { es: 'usted', pt: 'você (formal) — estranhos, idosos, respeito' },
              { es: '¿Cómo se llama usted?', pt: 'Como o(a) senhor(a) se chama? (formal)' },
              { es: '¿Cómo está usted?', pt: 'Como o(a) senhor(a) está? (formal)' },
            ],
            exercises: [
              { type: 'mcq', prompt: 'Com um estranho ou uma pessoa idosa, o mais respeitoso é usar…',
                options: ['usted', 'tú', 'vos', 'ellos'], correct: 0 },
              { type: 'mcq', prompt: 'Qual é a forma FORMAL de "¿Cómo estás?"',
                options: ['¿Cómo está usted?', '¿Cómo estás tú?', '¿Qué tal, amigo?', '¿Cómo van ustedes?'], correct: 0 },
              { type: 'bank', prompt: 'Monte a pergunta formal em espanhol', bubblePt: 'Como o senhor se chama? (formal)',
                words: ['¿Cómo', 'se', 'llama', 'usted?', 'te', 'llamas'], solution: ['¿Cómo', 'se', 'llama', 'usted?'] },
              { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿De dónde es usted?',
                options: ['De onde o(a) senhor(a) é? (formal)', 'De onde você é? (informal)', 'Para onde o senhor vai?', 'Onde o senhor mora?'], correct: 0 },
              { type: 'speak', prompt: 'Fale em voz alta (formal)', es: '¿Cómo está usted?', pt: 'Como o(a) senhor(a) está?' },
            ] },
          { id: 'bas-m1-l4', title: 'Gramática: ser', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'O verbo SER (presente)',
              body: 'Use SER para identidade, profissão e origem. Ex.: "Soy misionero", "Soy de Brasil".',
              rows: [['yo', 'soy'], ['tú', 'eres'], ['él/ella/usted', 'es'], ['nosotros', 'somos'], ['ellos/ustedes', 'son']] },
            { type: 'cloze', prompt: 'Complete com o verbo SER', pt: 'Eu sou missionário',
              sentence: 'Yo ___ misionero', options: ['soy', 'eres', 'es', 'somos'], correct: 0 },
            { type: 'cloze', prompt: 'Complete com o verbo SER', pt: 'De onde você é?',
              sentence: '¿De dónde ___ tú?', options: ['eres', 'soy', 'es', 'son'], correct: 0 },
            { type: 'match', prompt: 'Relacione pronome e verbo',
              pairs: [['yo', 'soy'], ['tú', 'eres'], ['él', 'es'], ['nosotros', 'somos']] },
            { type: 'mcq', prompt: 'Como se diz "Nós somos do Brasil"?',
              options: ['Somos de Brasil', 'Soy de Brasil', 'Eres de Brasil', 'Son de Brasil'], correct: 0 },
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
            { type: 'pic', prompt: 'Toque na imagem certa', es: 'el hotel',
              options: ['🏨', '🚻', '💧', '🍞'], correct: 0 },
          ] },
          { id: 'bas-m2-l2', title: 'Compras', icon: 'cart', exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Cuánto cuesta?',
              options: ['Quanto custa?', 'Onde fica?', 'Que horas são?', 'Como vai?'], correct: 0 },
            { type: 'pic', prompt: 'Toque na imagem certa', es: 'el dinero',
              options: ['💰', '🧳', '🏨', '🚌'], correct: 0 },
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
          { id: 'int1-m1-l1', title: 'A mensagem', icon: 'heart',
            teach: [
              { es: 'Dios', pt: 'Deus' },
              { es: 'el amor', pt: 'o amor' },
              { es: 'la fe', pt: 'a fé' },
              { es: 'Dios te ama', pt: 'Deus te ama' },
            ],
            exercises: [
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
          { id: 'int1-m2-l3', title: 'Gramática: el/la', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Gênero: el / la',
              body: 'Substantivos masculinos usam "el"; femininos, "la". Em geral -o é masculino e -a é feminino (há exceções, como "el día").',
              rows: [['el', 'masculino (el amor, el cielo)'], ['la', 'feminino (la fe, la paz)']] },
            { type: 'cloze', prompt: 'Complete com el ou la', pt: 'o amor de Deus',
              sentence: '___ amor de Dios', options: ['el', 'la'], correct: 0 },
            { type: 'cloze', prompt: 'Complete com el ou la', pt: 'a fé',
              sentence: '___ fe', options: ['la', 'el'], correct: 0 },
            { type: 'mcq', prompt: 'Qual palavra é feminina (usa "la")?',
              options: ['paz', 'amor', 'perdón', 'cielo'], correct: 0 },
            { type: 'cloze', prompt: 'Complete com el ou la', pt: 'a paz',
              sentence: '___ paz', options: ['la', 'el'], correct: 0 },
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
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Antes estava perdido, agora tenho paz',
              words: ['Antes', 'estaba', 'perdido,', 'ahora', 'tengo', 'paz', 'feliz', 'casa'], solution: ['Antes', 'estaba', 'perdido,', 'ahora', 'tengo', 'paz'] },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Dios cambió mi vida', pt: 'Deus mudou minha vida' },
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
          { id: 'av1-m2-l3', title: 'Gramática: ser vs estar', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'SER vs ESTAR',
              body: 'SER = identidade, profissão, origem (permanente). ESTAR = estado, sentimento e lugar (temporário). Ex.: "Soy misionero" / "Estoy cansado" / "¿Dónde está el baño?".',
              rows: [['ser', 'identidade, origem, profissão'], ['estar', 'estado, sentimento, lugar']] },
            { type: 'mcq', prompt: 'Estado/sentimento: "Yo ___ cansado"',
              options: ['estoy', 'soy', 'es', 'eres'], correct: 0 },
            { type: 'mcq', prompt: 'Identidade: "Ella ___ misionera"',
              options: ['es', 'está', 'estoy', 'eres'], correct: 0 },
            { type: 'cloze', prompt: 'Lugar: complete', pt: 'Onde fica o banheiro?',
              sentence: '¿Dónde ___ el baño?', options: ['está', 'es', 'soy', 'son'], correct: 0 },
            { type: 'mcq', prompt: 'Origem: "Nosotros ___ de Brasil"',
              options: ['somos', 'estamos', 'están', 'es'], correct: 0 },
          ] },
        ]),
        m('av1-m3', 'Gramática', 'conversa', 'book', [
          { id: 'av1-m3-l1', title: 'Pretérito (passado)', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Pretérito indefinido (regular)',
              body: 'Para falar de ações concluídas no passado. Verbos -AR: hablé, hablaste, habló. Verbos -ER/-IR: comí, comiste, comió.',
              rows: [['-ar (hablar)', 'hablé / hablaste / habló'], ['-er (comer)', 'comí / comiste / comió'], ['-ir (vivir)', 'viví / viviste / vivió']] },
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Pretérito: irregulares úteis',
              body: 'Alguns verbos muito usados são irregulares no passado.',
              rows: [['ser / ir', 'fui, fuiste, fue'], ['tener', 'tuve, tuviste, tuvo'], ['hacer', 'hice, hiciste, hizo'], ['estar', 'estuve, estuviste, estuvo']] },
            { type: 'cloze', prompt: 'Complete no pretérito', pt: 'Ontem eu fui à igreja',
              sentence: 'Ayer ___ a la iglesia', options: ['fui', 'voy', 'iré', 'iba'], correct: 0 },
            { type: 'mcq', prompt: 'Pretérito de "hablar" (yo)',
              options: ['hablé', 'hablo', 'hablaré', 'hablaba'], correct: 0 },
            { type: 'cloze', prompt: 'Complete no pretérito', pt: 'Deus mudou minha vida',
              sentence: 'Dios ___ mi vida', options: ['cambió', 'cambia', 'cambiará', 'cambiaba'], correct: 0 },
            { type: 'match', prompt: 'Relacione infinitivo e pretérito (yo)',
              pairs: [['hablar', 'hablé'], ['comer', 'comí'], ['ir', 'fui'], ['tener', 'tuve']] },
          ] },
          { id: 'av1-m3-l2', title: 'Imperfeito', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Pretérito imperfecto',
              body: 'Para descrições e ações habituais no passado ("eu costumava…", "era…"). -AR: -aba; -ER/-IR: -ía. Irregulares: era, iba, veía.',
              rows: [['hablar', 'hablaba'], ['tener', 'tenía'], ['ser', 'era'], ['ir', 'iba']] },
            { type: 'mcq', prompt: 'Descrição no passado: "Antes yo ___ perdido"',
              options: ['estaba', 'estuve', 'estoy', 'estaré'], correct: 0 },
            { type: 'cloze', prompt: 'Complete no imperfeito', pt: 'Quando eu era criança, eu orava',
              sentence: 'Cuando ___ niño, oraba', options: ['era', 'fui', 'soy', 'seré'], correct: 0 },
            { type: 'mcq', prompt: 'Qual frase descreve um hábito no passado?',
              options: ['Todos los días leía la Biblia', 'Ayer leí un versículo', 'Mañana leeré la Biblia', 'Ahora leo la Biblia'], correct: 0 },
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
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Vamos ler a Bíblia juntos amanhã',
              words: ['Vamos', 'a', 'leer', 'la', 'Biblia', 'juntos', 'mañana', 'hoy', 'casa'], solution: ['Vamos', 'a', 'leer', 'la', 'Biblia', 'juntos', 'mañana'] },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Quiero crecer en la fe', pt: 'Quero crescer na fé' },
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
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Quero servir com amor',
              words: ['Quiero', 'servir', 'con', 'amor', 'fe', 'hoy'], solution: ['Quiero', 'servir', 'con', 'amor'] },
            { type: 'mcq', prompt: 'Como se diz "Posso orar por você agora?"',
              options: ['¿Puedo orar por ti ahora?', '¿Quieres orar conmigo hoy?', '¿Oramos juntos mañana?', '¿Puedo ayudarte ahora?'], correct: 0 },
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
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Tenha cuidado à noite',
              words: ['Ten', 'cuidado', 'por', 'la', 'noche', 'día', 'casa'], solution: ['Ten', 'cuidado', 'por', 'la', 'noche'] },
            { type: 'mcq', prompt: 'Como se diz "Gosto muito da comida típica"?',
              options: ['Me gusta mucho la comida típica', 'Me gusta la cultura local', 'Quiero probar la comida', 'No me gusta la comida'], correct: 0 },
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
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Gracias por tu hospitalidad', pt: 'Obrigado pela sua hospitalidade' },
            { type: 'cloze', prompt: 'Complete a frase', pt: 'Sinto-me bem-vindo aqui',
              sentence: 'Me siento ___ aquí', options: ['bienvenido', 'perdido', 'cansado', 'nervioso'], correct: 0 },
          ] },
        ]),
        m('av2-m3', 'Gramática', 'conversa', 'book', [
          { id: 'av2-m3-l1', title: 'Futuro e planos', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Falar do futuro',
              body: 'Dois jeitos: "ir a + infinitivo" (voy a orar = vou orar) e o futuro simples (oraré, será), com terminações -é, -ás, -á.',
              rows: [['ir a + inf.', 'voy a / vas a / va a + orar'], ['futuro (hablar)', 'hablaré / hablarás / hablará'], ['ser', 'seré / serás / será']] },
            { type: 'cloze', prompt: 'Complete com "ir a + infinitivo"', pt: 'Amanhã vou à igreja',
              sentence: 'Mañana ___ a ir a la iglesia', options: ['voy', 'fui', 'iba', 'vaya'], correct: 0 },
            { type: 'mcq', prompt: 'Futuro simples de "ser" (él)',
              options: ['será', 'es', 'fue', 'era'], correct: 0 },
            { type: 'cloze', prompt: 'Complete no futuro', pt: 'Eu vou te ligar amanhã',
              sentence: 'Te ___ mañana', options: ['llamaré', 'llamé', 'llamo', 'llamaba'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "Vamos orar amanhã"?',
              options: ['Vamos a orar mañana', 'Oramos ayer', 'Oré mañana', 'Orábamos hoy'], correct: 0 },
          ] },
          { id: 'av2-m3-l2', title: 'Imperativo (pedidos)', icon: 'chat', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Imperativo: dar ordens e convites',
              body: 'Para pedir/convidar. Informal (tú): ven, ora, escucha, lee. Formal (usted): venga, ore, escuche, lea.',
              rows: [['venir', 'ven (tú) / venga (usted)'], ['orar', 'ora / ore'], ['escuchar', 'escucha / escuche'], ['leer', 'lee / lea']] },
            { type: 'mcq', prompt: 'Convite informal: "venha comigo"',
              options: ['Ven conmigo', 'Vienes conmigo', 'Vendré contigo', 'Viene conmigo'], correct: 0 },
            { type: 'cloze', prompt: 'Imperativo informal (tú)', pt: 'Ore por mim, por favor',
              sentence: '___ por mí, por favor', options: ['Ora', 'Oras', 'Oró', 'Orar'], correct: 0 },
            { type: 'mcq', prompt: 'Peça formalmente (usted): "escute"',
              options: ['Escuche', 'Escucha', 'Escuchas', 'Escuchó'], correct: 0 },
            { type: 'match', prompt: 'Relacione verbo e imperativo (tú)',
              pairs: [['venir', 'ven'], ['orar', 'ora'], ['leer', 'lee'], ['escuchar', 'escucha']] },
          ] },
          { id: 'av2-m3-l3', title: 'Subjuntivo (desejo)', icon: 'cross', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Presente do subjuntivo',
              body: 'Usado em desejos, bênçãos e pedidos: "Que Dios te bendiga", "Espero que vengas", "Ojalá haya paz". Formas: vaya, sea, tengas, vengas.',
              rows: [['ser', 'sea'], ['ir', 'vaya'], ['venir', 'vengas'], ['haber', 'haya'], ['bendecir', 'bendiga']] },
            { type: 'cloze', prompt: 'Complete (subjuntivo)', pt: 'Espero que você venha à reunião',
              sentence: 'Espero que ___ a la reunión', options: ['vengas', 'vienes', 'viniste', 'vendrás'], correct: 0 },
            { type: 'mcq', prompt: 'Bênção: "Que Dios te ___"',
              options: ['bendiga', 'bendice', 'bendijo', 'bendecirá'], correct: 0 },
            { type: 'cloze', prompt: 'Complete (desejo)', pt: 'Tomara que haja paz',
              sentence: 'Ojalá ___ paz', options: ['haya', 'hay', 'había', 'habrá'], correct: 0 },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Que Dios te bendiga', pt: 'Que Deus te abençoe' },
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
            { type: 'mcq', prompt: 'Como se diz "Que legal, combinado!"',
              options: ['¡Qué chévere, vale!', '¡Qué pena, adiós!', '¡Qué rápido, vamos!', '¡Qué caro, no!'], correct: 0 },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'En serio, no pasa nada', pt: 'Sério, sem problema' },
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
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Siga em frente com fé e esperança',
              words: ['Sigue', 'adelante', 'con', 'fe', 'y', 'esperanza', 'amor', 'paz'], solution: ['Sigue', 'adelante', 'con', 'fe', 'y', 'esperanza'] },
            { type: 'speak', prompt: 'Fale em voz alta', es: 'Que Dios te bendiga siempre', pt: 'Que Deus te abençoe sempre' },
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
        m('flu-m3', 'Gramática', 'conversa', 'book', [
          { id: 'flu-m3-l1', title: 'Condicional (cortesia)', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Condicional: ser educado',
              body: 'Para pedidos e desejos com cortesia ("eu gostaria", "você poderia"). Terminação -ía: gustaría, podría, querría.',
              rows: [['gustar', 'me gustaría (eu gostaria)'], ['poder', 'podría (poderia)'], ['querer', 'querría (eu queria)']] },
            { type: 'cloze', prompt: 'Complete (cortesia)', pt: 'Eu gostaria de falar com você',
              sentence: 'Me ___ hablar contigo', options: ['gustaría', 'gusta', 'gustó', 'guste'], correct: 0 },
            { type: 'mcq', prompt: 'Pedido cortês: "você poderia me ajudar?"',
              options: ['¿Podría ayudarme?', '¿Puede ayuda?', '¿Ayudó usted?', '¿Ayudará?'], correct: 0 },
            { type: 'mcq', prompt: 'Qual é mais educado?',
              options: ['¿Me gustaría un café, por favor?', '¡Café!', 'Dame café', 'Quiero café ya'], correct: 0 },
          ] },
          { id: 'flu-m3-l2', title: 'Por vs Para', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'POR vs PARA',
              body: 'POR: causa, troca, "em favor de", duração. PARA: finalidade, destino, prazo. Ex.: "Oro por ti" (em favor de), "Este regalo es para ti" (destino).',
              rows: [['por', 'causa, troca, em favor de'], ['para', 'finalidade, destino, prazo']] },
            { type: 'cloze', prompt: 'Complete com por/para', pt: 'Obrigado por tudo',
              sentence: 'Gracias ___ todo', options: ['por', 'para'], correct: 0 },
            { type: 'cloze', prompt: 'Complete com por/para', pt: 'Este presente é para você',
              sentence: 'Este regalo es ___ ti', options: ['para', 'por'], correct: 0 },
            { type: 'mcq', prompt: 'Qual está correta para "Oro em favor de você"?',
              options: ['Oro por ti', 'Oro para ti', 'Oro de ti', 'Oro con ti'], correct: 0 },
            { type: 'cloze', prompt: 'Complete com por/para', pt: 'Estudo para falar espanhol',
              sentence: 'Estudio ___ hablar español', options: ['para', 'por'], correct: 0 },
          ] },
          { id: 'flu-m3-l3', title: 'Pronomes (te, lo, le)', icon: 'book', exercises: [
            { type: 'grammar', prompt: 'Aprenda a regra', title: 'Pronomes de objeto',
              body: 'Substituem a pessoa/coisa antes do verbo: me, te, lo/la, le, nos. Ex.: "Dios te ama", "Te ayudo", "Lo conozco".',
              rows: [['me', 'me (a mim)'], ['te', 'te (a você)'], ['lo / la', 'o / a (ele/ela, isso)'], ['le', 'lhe (a ele/ela/você)'], ['nos', 'nos (a nós)']] },
            { type: 'cloze', prompt: 'Complete com o pronome', pt: 'Deus te ama',
              sentence: 'Dios ___ ama', options: ['te', 'lo', 'le', 'me'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "Eu te ajudo"?',
              options: ['Te ayudo', 'Lo ayudo', 'Le ayudo', 'Me ayudo'], correct: 0 },
            { type: 'cloze', prompt: 'Pronome reflexivo', pt: 'Meu nome é Lucas (eu me chamo)',
              sentence: '___ llamo Lucas', options: ['Me', 'Te', 'Se', 'Nos'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa "Te entiendo"?',
              options: ['Eu te entendo', 'Você me entende', 'Eu o entendo', 'Nós entendemos'], correct: 0 },
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

/* ------------------------------------------------------------
   Material de "Aprenda" por lição (intro de vocabulário).
   Centralizado aqui para que quase toda lição abra com a tela
   de estudo. Lições que já definem `teach` inline têm prioridade.
   ------------------------------------------------------------ */
var CAMINO_TEACH = {
  // Iniciante
  'ini-m1-l2': [{ es: 'sí', pt: 'sim' }, { es: 'no', pt: 'não' }, { es: 'Perdón', pt: 'Desculpe / com licença' }, { es: 'Adiós', pt: 'Tchau' }],
  'ini-m2-l1': [{ es: 'el baño', pt: 'o banheiro' }, { es: 'el pasaporte', pt: 'o passaporte' }, { es: '¿Cuánto cuesta?', pt: 'Quanto custa?' }, { es: 'Estoy perdido', pt: 'Estou perdido' }],
  'ini-m2-l2': [{ es: 'agua', pt: 'água' }, { es: 'Tengo hambre', pt: 'Estou com fome' }, { es: '¿Me puede ayudar?', pt: 'Pode me ajudar?' }, { es: 'Necesito…', pt: 'Preciso de…' }],
  // Básico
  'bas-m1-l2': [{ es: '¿De dónde eres?', pt: 'De onde você é?' }, { es: '¿Cómo estás?', pt: 'Como vai?' }, { es: 'Bien, gracias', pt: 'Bem, obrigado' }, { es: '¿Hablas español?', pt: 'Você fala espanhol?' }],
  'bas-m2-l1': [{ es: 'a la derecha', pt: 'à direita' }, { es: 'a la izquierda', pt: 'à esquerda' }, { es: 'cerca / lejos', pt: 'perto / longe' }, { es: '¿Dónde está…?', pt: 'Onde fica…?' }],
  'bas-m2-l2': [{ es: '¿Cuánto cuesta?', pt: 'Quanto custa?' }, { es: 'caro / barato', pt: 'caro / barato' }, { es: 'La cuenta, por favor', pt: 'A conta, por favor' }],
  // Intermediário 1
  'int1-m1-l2': [{ es: '¿Puedo orar por ti?', pt: 'Posso orar por você?' }, { es: '¿Quieres conocer a Jesús?', pt: 'Quer conhecer Jesus?' }, { es: 'la Biblia', pt: 'a Bíblia' }],
  'int1-m2-l1': [{ es: 'Soy misionero', pt: 'Sou missionário' }, { es: 'Estoy de viaje', pt: 'Estou de viagem' }, { es: 'Tengo veinte años', pt: 'Tenho vinte anos' }],
  'int1-m2-l2': [{ es: 'Estoy feliz', pt: 'Estou feliz' }, { es: 'Estoy cansado', pt: 'Estou cansado' }, { es: 'agradecido', pt: 'agradecido' }, { es: 'Gracias a Dios', pt: 'Graças a Deus' }],
  // Intermediário 2
  'int2-m1-l1': [{ es: 'Dios cambió mi vida', pt: 'Deus mudou minha vida' }, { es: 'antes / ahora', pt: 'antes / agora' }, { es: 'Encontré la paz', pt: 'Encontrei a paz' }],
  'int2-m1-l2': [{ es: 'Dios es amor', pt: 'Deus é amor' }, { es: 'la palabra de Dios', pt: 'a palavra de Deus' }, { es: 'el Señor es mi pastor', pt: 'o Senhor é meu pastor' }],
  'int2-m2-l1': [{ es: 'mañana / hoy', pt: 'amanhã / hoje' }, { es: '¿Quieres venir?', pt: 'Quer vir?' }, { es: 'Nos vemos', pt: 'A gente se vê' }],
  'int2-m2-l2': [{ es: '¿Quieres ir conmigo?', pt: 'Quer ir comigo?' }, { es: 'Vamos a comer juntos', pt: 'Vamos comer juntos' }, { es: 'Te invito', pt: 'Eu te convido' }],
  // Avançado 1
  'av1-m1-l1': [{ es: 'Creo que…', pt: 'Acho que…' }, { es: 'Estoy de acuerdo', pt: 'Concordo' }, { es: 'No estoy seguro', pt: 'Não tenho certeza' }, { es: 'Me parece bien', pt: 'Me parece bom' }],
  'av1-m1-l2': [{ es: '¿Por qué sufrimos?', pt: 'Por que sofremos?' }, { es: 'la esperanza', pt: 'a esperança' }, { es: 'el perdón', pt: 'o perdão' }],
  'av1-m2-l1': [{ es: '¿Cómo sé que Dios existe?', pt: 'Como sei que Deus existe?' }, { es: 'la duda', pt: 'a dúvida' }, { es: 'Dios tiene un plan', pt: 'Deus tem um plano' }],
  'av1-m2-l2': [{ es: 'No estás solo', pt: 'Você não está sozinho' }, { es: 'Jesús da paz', pt: 'Jesus dá paz' }, { es: 'Puedes confiar en Dios', pt: 'Pode confiar em Deus' }],
  // Avançado 2
  'av2-m1-l1': [{ es: 'Vamos a orar juntos', pt: 'Vamos orar juntos' }, { es: 'leer la Biblia', pt: 'ler a Bíblia' }, { es: 'la iglesia', pt: 'a igreja' }, { es: 'crecer en la fe', pt: 'crescer na fé' }],
  'av2-m1-l2': [{ es: 'orar por los demás', pt: 'orar pelos outros' }, { es: 'servir con amor', pt: 'servir com amor' }, { es: '¿Cómo puedo ayudarte?', pt: 'Como posso te ajudar?' }],
  'av2-m2-l1': [{ es: 'la comida típica', pt: 'a comida típica' }, { es: 'las costumbres', pt: 'os costumes' }, { es: 'Ten cuidado', pt: 'Tenha cuidado' }],
  'av2-m2-l2': [{ es: 'respetar las costumbres', pt: 'respeitar os costumes' }, { es: 'Gracias por tu hospitalidad', pt: 'Obrigado pela hospitalidade' }, { es: 'bienvenido', pt: 'bem-vindo' }],
  // Fluente
  'flu-m1-l1': [{ es: 'vale', pt: 'ok / combinado' }, { es: 'No pasa nada', pt: 'Sem problema' }, { es: '¡Qué chévere!', pt: 'Que legal!' }, { es: 'en serio', pt: 'sério' }],
  'flu-m1-l2': [{ es: '¡Qué guay!', pt: 'Que legal! (Espanha)' }, { es: 'Nos vemos al rato', pt: 'A gente se vê já já' }, { es: 'Vale, perfecto', pt: 'Ok, perfeito' }],
  'flu-m2-l1': [{ es: 'Que Dios te bendiga', pt: 'Que Deus te abençoe' }, { es: 'Sigue adelante', pt: 'Siga em frente' }, { es: 'paz y esperanza', pt: 'paz e esperança' }],
  'flu-m2-l2': [{ es: 'Fue un placer conocerte', pt: 'Foi um prazer te conhecer' }, { es: 'Cuídate mucho', pt: 'Cuide-se' }, { es: 'Hasta pronto', pt: 'Até logo' }, { es: 'Buen viaje', pt: 'Boa viagem' }],
};
// Aplica o material às lições que ainda não definem `teach` inline.
window.CAMINO_DATA.levels.forEach(function (lv) {
  lv.modules.forEach(function (mod) {
    mod.lessons.forEach(function (l) {
      if (!l.teach && CAMINO_TEACH[l.id]) l.teach = CAMINO_TEACH[l.id];
    });
  });
});

/* ------------------------------------------------------------
   Vocabulário ilustrado (emoji → palavra). Gera muitos exercícios
   do tipo `emoji` nos níveis iniciais, com distratores da mesma
   categoria. Cada item: [emoji, palavra em espanhol].
   ------------------------------------------------------------ */
var EMOJI_GROUPS = [
  { id: 'voc-comida', title: 'Comida e bebida', icon: 'cart', level: 'iniciante', items: [
    ['💧', 'agua'], ['🍞', 'pan'], ['☕', 'café'], ['🥛', 'leche'], ['🍎', 'manzana'],
    ['🍌', 'plátano'], ['🧀', 'queso'], ['🥚', 'huevo'], ['🍖', 'carne'], ['🐟', 'pescado'] ] },
  { id: 'voc-animais', title: 'Animais', icon: 'star', level: 'iniciante', items: [
    ['🐶', 'perro'], ['🐱', 'gato'], ['🐴', 'caballo'], ['🐮', 'vaca'], ['🐦', 'pájaro'],
    ['🐑', 'oveja'], ['🦁', 'león'], ['🐘', 'elefante'], ['🐰', 'conejo'], ['🐝', 'abeja'] ] },
  { id: 'voc-transporte', title: 'Transporte', icon: 'plane', level: 'basico', items: [
    ['🚌', 'autobús'], ['🚗', 'coche'], ['✈️', 'avión'], ['🚆', 'tren'], ['🚕', 'taxi'],
    ['⛵', 'barco'], ['🚲', 'bicicleta'], ['🏍️', 'moto'] ] },
  { id: 'voc-lugares', title: 'Lugares', icon: 'map', level: 'basico', items: [
    ['🏨', 'hotel'], ['🏠', 'casa'], ['⛪', 'iglesia'], ['🏥', 'hospital'], ['🏫', 'escuela'],
    ['🏪', 'tienda'], ['🏦', 'banco'], ['🚪', 'puerta'] ] },
  { id: 'voc-natureza', title: 'Natureza', icon: 'star', level: 'basico', items: [
    ['☀️', 'sol'], ['🌧️', 'lluvia'], ['🌙', 'luna'], ['⭐', 'estrella'], ['🌳', 'árbol'],
    ['🌸', 'flor'], ['🌊', 'mar'], ['🔥', 'fuego'] ] },
  { id: 'voc-objetos', title: 'Objetos', icon: 'book', level: 'basico', items: [
    ['📖', 'libro'], ['📱', 'teléfono'], ['💰', 'dinero'], ['🔑', 'llave'], ['⌚', 'reloj'],
    ['🧳', 'maleta'], ['🛏️', 'cama'], ['🪑', 'silla'] ] },
];

(function buildEmojiVocab() {
  function levelById(id) {
    return window.CAMINO_DATA.levels.filter(function (lv) { return lv.id === id; })[0];
  }
  EMOJI_GROUPS.forEach(function (g) {
    var lv = levelById(g.level);
    if (!lv) return;
    var n = g.items.length;
    var exercises = g.items.map(function (item, i) {
      var word = item[1];
      var opts = [word,
        g.items[(i + 1) % n][1],
        g.items[(i + 2) % n][1],
        g.items[(i + 3) % n][1]];
      return { type: 'emoji', prompt: 'Qual é a palavra?', emoji: item[0], options: opts, correct: 0 };
    });
    // ensina o vocabulário antes (tela "Aprenda")
    var teach = g.items.map(function (item) { return { es: item[1], pt: item[0] }; });
    // divide em lições de até 5 exercícios
    var lessons = [];
    for (var s = 0; s < exercises.length; s += 5) {
      var idx = (s / 5) + 1;
      lessons.push({
        id: g.id + '-l' + idx,
        title: g.title + (exercises.length > 5 ? ' ' + idx : ''),
        icon: g.icon,
        teach: idx === 1 ? teach.slice(0, 8) : undefined,
        exercises: exercises.slice(s, s + 5),
      });
    }
    lv.modules.push(m(g.id, '🖼️ ' + g.title, 'viagem', g.icon, lessons));
  });
})();
