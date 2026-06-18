/* ============================================================
   Camino — conteúdo da trilha (currículo)
   Espanhol para missionários iniciantes.
   UI em português · aprendendo espanhol.
   ============================================================ */

// Ícones (paths SVG, viewBox 0 0 24 24) reutilizados pela trilha,
// conquistas e nós.
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
};

// ---- Trilha: 3 unidades temáticas, uma trilha contínua ----
// Cada unidade tem cor própria (Viagem=azul, Conversa=roxo, Evangelização=vermelho).
// Cada nó da trilha é uma lição com seus exercícios.
window.CAMINO_DATA = {
  units: [
    {
      id: 'u1',
      num: '1',
      title: 'Primeiros passos',
      sub: 'Viagem · o essencial',
      theme: 'Viagem',
      color: '#3C76E8',
      shadow: '#1446AB',
      lessons: [
        {
          id: 'u1l1', title: 'Saudações', icon: 'star',
          exercises: [
            { type: 'mcq', prompt: 'Toque na tradução correta', audioEs: '¡Buenos días!',
              options: ['Bom dia', 'Boa noite', 'Até logo', 'Por favor'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa em português?', bubblePt: 'Gracias',
              options: ['Obrigado', 'Por favor', 'Desculpe', 'De nada'], correct: 0 },
            { type: 'bank', prompt: 'Monte a saudação em espanhol', bubblePt: 'Olá, bom dia!',
              words: ['Hola', 'buenos', 'días', 'noches', 'gracias'], solution: ['Hola', 'buenos', 'días'] },
            { type: 'mcq', prompt: 'Como se diz "por favor"?',
              options: ['Por favor', 'De nada', 'Lo siento', 'Hasta luego'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Muchas gracias', dictation: true,
              words: ['Muchas', 'gracias', 'buenas', 'noches', 'hola'], solution: ['Muchas', 'gracias'] },
          ],
        },
        {
          id: 'u1l2', title: 'Na viagem', icon: 'plane',
          exercises: [
            { type: 'mcq', prompt: 'Como se diz em espanhol?', bubblePt: 'Onde fica o banheiro?',
              options: ['¿Dónde está el baño?', '¿Cuánto cuesta?', '¿Qué hora es?', '¿Cómo estás?'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'el pasaporte',
              options: ['o passaporte', 'a passagem', 'a mala', 'o aeroporto'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Cuánto cuesta?', dictation: true,
              words: ['¿Cuánto', 'cuesta?', 'dónde', 'está', 'baño'], solution: ['¿Cuánto', 'cuesta?'] },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou perdido',
              words: ['Estoy', 'perdido', 'cansado', 'aquí', 'bien'], solution: ['Estoy', 'perdido'] },
          ],
        },
        {
          id: 'u1l3', title: 'Direções', icon: 'map',
          exercises: [
            { type: 'mcq', prompt: 'O que significa "a la derecha"?',
              options: ['à direita', 'à esquerda', 'em frente', 'atrás'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "à esquerda"?',
              options: ['a la izquierda', 'a la derecha', 'todo recto', 'cerca'], correct: 0 },
            { type: 'bank', prompt: 'Monte a pergunta em espanhol', bubblePt: 'Onde fica o hotel?',
              words: ['¿Dónde', 'está', 'el', 'hotel?', 'baño'], solution: ['¿Dónde', 'está', 'el', 'hotel?'] },
            { type: 'mcq', prompt: 'O que significa "cerca"?',
              options: ['perto', 'longe', 'rua', 'mapa'], correct: 0 },
          ],
        },
        {
          id: 'u1l4', title: 'Necessidades', icon: 'cart',
          exercises: [
            { type: 'mcq', prompt: 'O que significa "agua"?',
              options: ['água', 'comida', 'ajuda', 'pão'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou com fome',
              words: ['Tengo', 'hambre', 'sed', 'frío', 'sueño'], solution: ['Tengo', 'hambre'] },
            { type: 'mcq', prompt: 'Como se pede ajuda?', audioEs: '¿Me puede ayudar?',
              options: ['¿Me puede ayudar?', '¿Cómo te llamas?', '¿Qué hora es?', 'Buen viaje'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Necesito agua', dictation: true,
              words: ['Necesito', 'agua', 'comida', 'ayuda', 'tengo'], solution: ['Necesito', 'agua'] },
          ],
        },
      ],
    },
    {
      id: 'u2',
      num: '2',
      title: 'Conhecer pessoas',
      sub: 'Conversa com estranhos',
      theme: 'Conversa',
      color: '#9D55FF',
      shadow: '#7A26E0',
      lessons: [
        {
          id: 'u2l1', title: 'Apresentar-se', icon: 'account',
          exercises: [
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Cómo te llamas?', dictation: true,
              words: ['¿Cómo', 'te', 'llamas?', 'dónde', 'vives'], solution: ['¿Cómo', 'te', 'llamas?'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Mucho gusto',
              options: ['Muito prazer', 'Boa viagem', 'Com licença', 'Boa sorte'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Meu nome é Lucas',
              words: ['Me', 'llamo', 'Lucas', 'soy', 'gusto'], solution: ['Me', 'llamo', 'Lucas'] },
            { type: 'mcq', prompt: 'Como se diz "Eu sou do Brasil"?',
              options: ['Soy de Brasil', 'Eres de Brasil', 'Vivo aquí', 'Me gusta Brasil'], correct: 0 },
          ],
        },
        {
          id: 'u2l2', title: 'Bate-papo', icon: 'chat',
          exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿De dónde eres?',
              options: ['De onde você é?', 'Como você está?', 'Onde você mora?', 'Quantos anos tem?'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Cómo estás?', dictation: true,
              words: ['¿Cómo', 'estás?', 'eres', 'dónde', 'bien'], solution: ['¿Cómo', 'estás?'] },
            { type: 'mcq', prompt: 'Como se responde "Estou bem, obrigado"?',
              options: ['Bien, gracias', 'Mucho gusto', 'Hasta luego', 'Por favor'], correct: 0 },
            { type: 'bank', prompt: 'Monte a pergunta em espanhol', bubblePt: 'Você fala espanhol?',
              words: ['¿Hablas', 'español?', 'portugués', 'inglés', 'bien'], solution: ['¿Hablas', 'español?'] },
          ],
        },
        {
          id: 'u2l3', title: 'Sobre você', icon: 'star',
          exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: 'Soy misionero',
              options: ['Sou missionário', 'Sou viajante', 'Estou perdido', 'Sou estudante'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Estou de viagem',
              words: ['Estoy', 'de', 'viaje', 'aquí', 'bien'], solution: ['Estoy', 'de', 'viaje'] },
            { type: 'mcq', prompt: 'Como se diz "Tenho vinte anos"?',
              options: ['Tengo veinte años', 'Soy veinte años', 'Hace veinte años', 'Veinte años aquí'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Soy de Brasil', dictation: true,
              words: ['Soy', 'de', 'Brasil', 'aquí', 'misionero'], solution: ['Soy', 'de', 'Brasil'] },
          ],
        },
      ],
    },
    {
      id: 'u3',
      num: '3',
      title: 'Compartilhar a fé',
      sub: 'Evangelização',
      theme: 'Evangelização',
      color: '#E73B4C',
      shadow: '#C71C2D',
      lessons: [
        {
          id: 'u3l1', title: 'A mensagem', icon: 'heart',
          exercises: [
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Deus te ama',
              words: ['Dios', 'te', 'ama', 'casa', 'gracias'], solution: ['Dios', 'te', 'ama'] },
            { type: 'mcq', prompt: 'O que significa "la fe"?',
              options: ['a fé', 'o amor', 'a paz', 'a esperança'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "o amor de Deus"?', audioEs: 'el amor de Dios',
              options: ['el amor de Dios', 'la fe de Dios', 'la paz de Dios', 'el hijo de Dios'], correct: 0 },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Jesús te ama', dictation: true,
              words: ['Jesús', 'te', 'ama', 'Dios', 'fe'], solution: ['Jesús', 'te', 'ama'] },
          ],
        },
        {
          id: 'u3l2', title: 'O convite', icon: 'cross',
          exercises: [
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: '¿Puedo orar por ti?', dictation: true,
              words: ['¿Puedo', 'orar', 'por', 'ti?', 'hoy'], solution: ['¿Puedo', 'orar', 'por', 'ti?'] },
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¿Quieres conocer a Jesús?',
              options: ['Quer conhecer Jesus?', 'Você conhece Jesus?', 'Onde está Jesus?', 'Quem é Jesus?'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa "la Biblia"?',
              options: ['a Bíblia', 'a igreja', 'a oração', 'a palavra'], correct: 0 },
            { type: 'bank', prompt: 'Monte o convite em espanhol', bubblePt: 'Posso orar por você?',
              words: ['¿Puedo', 'orar', 'por', 'ti?', 'hoy'], solution: ['¿Puedo', 'orar', 'por', 'ti?'] },
          ],
        },
        {
          id: 'u3l3', title: 'Versículos', icon: 'book',
          exercises: [
            { type: 'mcq', prompt: 'Complete o versículo (Juan 3:16)', bubblePt: '"Porque Deus amou o mundo de tal maneira..."',
              options: ['"Porque de tal manera amó Dios al mundo"', '"El Señor es mi pastor, nada me faltará"', '"Bienaventurados los pobres de espíritu"', '"La fe sin obras está muerta"'], correct: 0 },
            { type: 'mcq', prompt: 'O que significa (Salmo 23)?', bubblePt: '"El Señor es mi pastor"',
              options: ['"O Senhor é meu pastor"', '"O Senhor é minha luz"', '"Deus é amor"', '"A paz esteja convosco"'], correct: 0 },
            { type: 'bank', prompt: 'Monte o versículo em espanhol', bubblePt: 'Deus é amor',
              words: ['Dios', 'es', 'amor', 'fe', 'paz'], solution: ['Dios', 'es', 'amor'] },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'La palabra de Dios', dictation: true,
              words: ['La', 'palabra', 'de', 'Dios', 'amor'], solution: ['La', 'palabra', 'de', 'Dios'] },
          ],
        },
        {
          id: 'u3l4', title: 'A bênção', icon: 'star',
          exercises: [
            { type: 'mcq', prompt: 'O que significa?', bubblePt: '¡Dios te bendiga!',
              options: ['Deus te abençoe!', 'Deus te ama!', 'Vá com Deus!', 'Que a paz esteja contigo!'], correct: 0 },
            { type: 'mcq', prompt: 'Como se diz "a paz"?',
              options: ['la paz', 'la fe', 'el amor', 'la esperanza'], correct: 0 },
            { type: 'bank', prompt: 'Monte a frase em espanhol', bubblePt: 'Obrigado por ouvir',
              words: ['Gracias', 'por', 'escuchar', 'orar', 'venir'], solution: ['Gracias', 'por', 'escuchar'] },
            { type: 'listen', prompt: 'Toque no que você ouve', audioEs: 'Que Dios te bendiga', dictation: true,
              words: ['Que', 'Dios', 'te', 'bendiga', 'ama'], solution: ['Que', 'Dios', 'te', 'bendiga'] },
          ],
        },
      ],
    },
  ],

  // Conquistas — desbloqueadas conforme o progresso na trilha.
  achievements: [
    { id: 'a1', name: 'Primeiros passos', icon: 'star',  c: '#3C76E8', bg: '#E5EEFF', need: 1 },
    { id: 'a2', name: 'Viajante',         icon: 'plane', c: '#E8A13C', bg: '#FFF4E5', need: 4 },
    { id: 'a3', name: 'Tagarela',         icon: 'chat',  c: '#9D55FF', bg: '#F5F0FF', need: 5 },
    { id: 'a4', name: 'Comunicador',      icon: 'account', c: '#9D55FF', bg: '#F5F0FF', need: 7 },
    { id: 'a5', name: 'Mensageiro',       icon: 'heart', c: '#E73B4C', bg: '#FFE6E9', need: 8 },
    { id: 'a6', name: 'Fiel',             icon: 'cross', c: '#E73B4C', bg: '#FFE6E9', need: 11 },
  ],
};
