# Camino · Espanhol para missionários 🕊️

App web **mobile-first** de aprendizado de espanhol no estilo Duolingo, focado em
**viagem, conversa com estranhos e vocabulário cristão para evangelização**.

Público-alvo: jovens missionários (≈20 anos), iniciantes, viajando pela primeira
vez para o exterior. Interface em **português**, aprendendo **espanhol**.

> Implementado a partir do protótipo interativo "Camino", seguindo o design system
> Brendi (Montserrat, vermelho da marca, tokens de cor).

## Funcionalidades

- **Trilha** — caminho serpentina com 3 unidades temáticas em sequência, codificadas
  por cor: Viagem (azul), Conversa com estranhos (roxo), Evangelização (vermelho).
  Nós com estados concluído / atual / bloqueado e a mascote-pomba **Paloma** (com
  auréola, um aceno ao Espírito Santo).
- **Lição** — exercícios funcionais: múltipla escolha com áudio, "monte a frase"
  (banco de palavras) e ditado ("toque no que você ouve"), com barra de progresso,
  feedback de acerto/erro e voz em espanhol (Web Speech API).
- **Conclusão** — celebração com confete, XP ganho e precisão.
- **Sem vidas** — tela de recuperação quando os corações acabam.
- **Perfil** — estatísticas, progresso por tema e grade de conquistas.
- **Gamificação** — XP, vidas (com regeneração ao longo do tempo), ofensiva
  (streak) e medalhas/conquistas.
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

Para adicionar conteúdo, edite `assets/data.js` — cada nó da trilha é uma lição
com sua lista de exercícios (`mcq`, `bank`, `listen`).

## Qualidade & deploy

- **CI** (`.github/workflows/ci.yml`) — a cada push/PR, checa a sintaxe dos JS
  (`npm run check`) e valida a integridade do currículo (`npm run validate`):
  todo MCQ tem `correct` válido, toda solução de banco existe no pool, ícones e
  ids conferem. Rode localmente com `npm test`.
- **GitHub Pages** (`.github/workflows/deploy.yml`) — publica o site estático a
  cada push na `main`.

> Para o deploy funcionar, habilite o Pages uma vez em
> **Settings → Pages → Build and deployment → Source: GitHub Actions**.
