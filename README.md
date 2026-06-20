# Camino · Espanhol para missionários 🕊️

App web **mobile-first** de aprendizado de espanhol no estilo Duolingo, focado em
**viagem, conversa com estranhos e vocabulário cristão para evangelização**.

Público-alvo: jovens missionários (≈20 anos), iniciantes, viajando pela primeira
vez para o exterior. Interface em **português**, aprendendo **espanhol**.

> Implementado a partir do protótipo interativo "Camino", seguindo o design system
> Brendi (Montserrat, vermelho da marca, tokens de cor).

## Funcionalidades

- **Onboarding** — na primeira vez, a Paloma se apresenta, pergunta o nome do
  aprendiz e deixa escolher uma meta diária de XP (ajustável depois no perfil).
- **Níveis** — jornada do zero à fluência em 7 níveis (Iniciante, Básico,
  Intermediário 1 e 2, Avançado 1 e 2, Fluente). Cada nível reúne módulos com
  dificuldade crescente; concluir um nível desbloqueia o próximo com uma
  comemoração. A tela "Sua jornada" mostra todos os níveis e o progresso.
- **Trilha** — a home foca o nível atual: caminho serpentina com módulos temáticos
  codificados por cor (Viagem = azul, Conversa = roxo, Evangelização = vermelho).
  Nós com estados concluído / atual / bloqueado e a mascote-pomba **Paloma** (com
  auréola, um aceno ao Espírito Santo). Dá para navegar entre níveis já abertos.
  Lições **concluídas podem ser refeitas** (tocar no nó) como revisão — rende XP
  reduzido, alimenta a revisão espaçada e não altera o progresso.
- **Aprenda antes de treinar** — lições podem abrir com uma tela de introdução do
  vocabulário (palavra + tradução + áudio ao tocar) antes dos exercícios.
- **Gramática explícita** — cartas de regra com tabela e exemplo, seguidas de
  prática. Cobre do básico ao avançado: *ser*, gênero *el/la*, *ser* vs *estar*,
  **pretérito e imperfeito**, **futuro**, **imperativo**, **subjuntivo**,
  **condicional**, **por/para** e **pronomes** (te/lo/le). Cartas são
  instrucionais e não contam na precisão.
- **Lição** — variedade de exercícios: múltipla escolha com áudio, "monte a frase"
  (banco de palavras), ditado ("toque no que você ouve"), **preencher a lacuna**
  (cloze), **pareamento** (relacionar colunas ES↔PT), **imagem** nos dois sentidos
  (`pic`: palavra → emoji; `emoji`: emoji → palavra, com módulos de vocabulário
  ilustrado nos níveis iniciais) e **fala** (pronúncia: fale a
  frase e o app reconhece a voz), com barra de progresso, feedback de acerto/erro
  e voz em espanhol (Web Speech API). Nas alternativas em espanhol há um botão de
  **ouvir cada opção** (treino de listening); ao verificar, o feedback aparece e a
  lição **avança sozinha** após um breve cronômetro (dá pra tocar CONTINUAR antes).
  O exercício de fala dá **feedback de
  pronúncia palavra por palavra** (verde/vermelho) com % de precisão e botão de
  tentar de novo; não tira vidas e tem alternativa (auto-avaliação) onde o
  navegador não reconhece voz.
- **Diálogos de evangelização** — exercício `dialog`: uma conversa de rua em
  vários turnos (um estranho fala em espanhol e o aprendiz escolhe a melhor
  resposta a cada turno), renderizada como um chat com balões, áudio das falas e
  feedback turno a turno. Cobre primeiro contato, resposta a objeções com respeito
  e convite para a reunião — treino direto da missão.
- **Diálogos de viagem** — o mesmo formato de chat aplicado às situações clássicas
  da viagem: cafeteria, táxi até o hotel (Básico); check-in no aeroporto, check-in
  no hotel, pedido no restaurante (Intermediário 1); imigração e lanche a bordo
  (Intermediário 2). As falas vêm com tradução para facilitar nos níveis iniciais.
- **Diálogos de abordagem** — conversas de evangelização progressivas: uma primeira
  conversa simples já no Básico e, no Intermediário 1, abordagens adaptadas ao
  interlocutor — um jovem (linguagem próxima) e uma pessoa idosa (tratamento formal
  com "usted"), sempre com respeito.
- **Compaixão na rua** — nos níveis Avançado 2 e Fluente, diálogos para situações
  delicadas que o missionário pode encontrar (alguém com fome, pessoas em
  vulnerabilidade, quem luta contra o vício), conduzidos sempre com **dignidade,
  sem julgamento e oferecendo esperança e ajuda concreta**.
- **Kit de campo** — módulo prático para o missionário montar a própria fala:
  estrutura do testemunho pessoal (antes → encontro → agora) e respostas
  respeitosas às objeções mais comuns ("não tenho tempo", "há muitas religiões",
  "já sofri demais"), no Avançado 1.
- **Vocabulário bíblico** — módulo no Intermediário 2 com os termos de fé além do
  básico (graça, pecado, perdão, salvação, oração, bênção, evangelho, Espírito
  Santo), praticados em significado, pareamento, frase e fala.
- **Desafio do dia** — uma revisão rápida diária que **prioriza os itens vencidos
  da revisão espaçada (SRS)** e completa com exercícios sorteados do que já foi
  aprendido (estáveis durante o dia); dá bônus de XP e gemas.
- **Conclusão** — celebração com confete, XP ganho, gemas e precisão.
- **Sem vidas** — tela de recuperação: gaste **gemas** para repor as vidas (ou
  espere a regeneração com o tempo).
- **Perfil** — estatísticas, progresso por tema e grade de conquistas.
- **Gamificação** — XP, meta diária (escolhível: 20/50/100/150 XP) com anel de
  progresso e comemoração ao bater a meta, **ofensiva** que avança a cada dia em
  que a meta diária é atingida, **gemas** (moeda para repor vidas), vidas
  (regeneram com o tempo) e conquistas (por nível, lições, ofensiva e XP).
- **Sons de feedback** — efeitos sonoros sintetizados (WebAudio, sem arquivos)
  para acerto, erro, conclusão e subida de nível; com botão de mudo no perfil.
- **Revisão espaçada (SRS)** — cada exercício respondido entra num sistema de
  caixas (Leitner): acertos aumentam o intervalo, erros reaproximam. Quando há
  itens "vencidos", a home oferece uma sessão de revisão que reapresenta o que
  você aprendeu, reforçando a memória de longo prazo.
- **Progresso persistente** — XP, lições concluídas, vidas e ofensiva ficam salvos
  no `localStorage` do dispositivo.
- **Instalável (PWA)** — pode ser adicionado à tela inicial do celular.

## Como rodar

Não há build. É só servir os arquivos estáticos:

```bash
# qualquer servidor estático serve, por exemplo:
python3 -m http.server 8000
# depois abra http://localhost:8000 no navegador (de preferência no modo celular)
```

Ou abra o `index.html` direto no navegador.

## Estrutura

```
index.html              entrada do app + meta tags PWA
assets/styles.css       design system + telas + animações
assets/data.js          currículo (unidades, lições, exercícios, conquistas)
assets/app.js           estado, navegação, gamificação e voz
manifest.webmanifest    manifesto PWA
icon.svg                ícone (Paloma)
```

Para adicionar conteúdo, edite `assets/data.js`: a estrutura é
`levels → modules → lessons → exercises`. Cada lição traz uma lista de
exercícios (`mcq`, `cloze`, `bank`, `listen`, `match`, `speak`, `grammar`, `pic`,
`emoji`, `dialog`), pode ter um
`teach` opcional (intro de vocabulário) e cada módulo carrega um tema/cor. As
conquistas (`achievements`) podem ser por nível concluído (`kind: 'level'`),
nº de lições (`kind: 'lessons'`) ou ofensiva (`kind: 'streak'`).

## Qualidade & deploy

- **CI** (`.github/workflows/ci.yml`) — a cada push/PR, checa a sintaxe dos JS
  (`npm run check`) e valida a integridade do currículo (`npm run validate`):
  todo MCQ tem `correct` válido, toda solução de banco existe no pool, ícones e
  ids conferem. Rode localmente com `npm test`.
- **GitHub Pages** (`.github/workflows/deploy.yml`) — publica o site estático a
  cada push na `main`.

> Para o deploy funcionar, habilite o Pages uma vez em
> **Settings → Pages → Build and deployment → Source: GitHub Actions**.
