# BRUTAL RPG — Site de Mesa (não oficial)

Um site de apoio para jogar e aprender as regras do **BRUTAL RPG**, com áreas específicas para a pessoa que joga como Sobrevivente e para a Mestre/Diretora. O próprio site informa que é um projeto de fã, não oficial, sem vínculo com a Equipe Brutal ou a Editora New Order; regras e arte exibidas são do playtest e pertencem aos seus criadores. Em caso de dúvida, consulte o material oficial.

## O que o site faz

### Área de Sobrevivente

- **Aprender a jogar:** apresenta 13 lições com explicações e exemplos sobre o sistema, a interpretação, o Rito de Iniciação, os dados, testes, atributos, especialidades, cenas, sustos, Pontos de Tensão, vantagens, encontros, feridas e sequelas.
- **Oito arquétipos:** Atleta, Cética, Esbelto, Herói, Nerd, Inocente, Relaxado e Valentona, com suas especialidades e características.
- **Ficha de personagem:** guarda nome, pronomes, intérprete, arquétipo, imagem, dados disponíveis, dados de fuga, Pontos de Tensão, feridas, sequelas, especialidades incapacitadas, habilidades, cicatrizes, apegos e anotações.
- **Rolador de dados:** simula testes de risco, Vazar Dali e Testes de Susto; mostra sucessos e falhas e considera opções como atributo, risco, recursos e ajustes de dificuldade.
- **Vantagens:** apresenta opções compráveis com Pontos de Tensão e permite acompanhar a ficha durante a sessão.

### Área de Mestre/Diretora

- **Guia do Mestre:** cobre o papel da Diretora, preparação, construção do Assassino, catálogo de ameaças, Pontos de Horror, ações, cenas de Suspense, cenários e Qualidades, Rito de Iniciação, encontros, NPCs, funções ocultas e dicas para conduzir a sessão.
- **Ficha do Assassino:** reúne nome, imagem, ameaças escolhidas, nível de brutalidade, dados, Pontos de Horror, sustos e armadilhas disponíveis, além das ações e opções especiais associadas às ameaças.
- **Rolagens do Mestre:** inclui rolagens para ferir, dados livres e, quando aplicável, dado da Horda; exibe os resultados e oferece ações de acompanhamento.
- **Lista de sobreviventes:** permite cadastrar e acompanhar sobreviventes independentemente das fichas dos jogadores, incluindo dados, fuga, Pontos de Tensão, feridas, sequelas e observações.

### Interface e armazenamento

- Interface adaptável a telas menores, com navegação entre as áreas.
- Tema de terror com tons escuros e vermelhos, fontes Anton e Courier Prime, dados animados, cartões, indicadores e notificações.
- Galeria de imagens e opção de carregar uma imagem própria para a ficha.
- Os dados das fichas são guardados no **armazenamento local do navegador** (`localStorage`), por meio das chaves `br_s` e `br_d`. Isso não equivale a uma conta ou sincronização em nuvem: os dados ficam no navegador/dispositivo e podem não acompanhar a pessoa para outro navegador ou dispositivo.
- A maior parte das imagens está embutida no HTML para que os recursos visuais originais continuem disponíveis sem uma pasta de imagens separada. As fontes Google Fonts são referenciadas externamente e podem depender de conexão para carregar.

## Arquivos

- `index.html` — estrutura da página, conteúdo das lições e guias, modelos de interface e recursos visuais embutidos.
- `style.css` — cores, tipografia, disposição, componentes, animações e estilos responsivos.
- `app.js` — dados do jogo, rolagens, lógica das fichas, navegação, eventos, armazenamento local e renderização da interface.

## Como abrir

1. Extraia todos os arquivos para a mesma pasta.
2. Abra `index.html` em um navegador moderno.
3. Para desenvolvimento, recomenda-se servir a pasta por um servidor local (por exemplo, a extensão Live Server no VS Code), em vez de depender do comportamento específico do navegador ao abrir arquivos diretamente.

Não renomeie nem mova os arquivos sem atualizar as referências em `index.html` (`style.css` e `app.js`).

## Observações técnicas

- O projeto é uma aplicação de front-end, sem servidor ou API própria identificada no código analisado.
- A separação dos arquivos foi feita mantendo o conteúdo e o código do site; as mudanças principais são a extração do bloco `<style>` para `style.css` e do bloco `<script>` para `app.js`, com referências adicionadas no HTML.
- O JavaScript pode ser verificado sintaticamente com `node --check app.js`. Essa verificação não substitui testes manuais de todos os fluxos em um navegador.
