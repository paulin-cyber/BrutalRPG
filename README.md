# BRUTAL RPG — Guia completo do projeto

> **Projeto independente de fã, não oficial e sem vínculo com os criadores originais.** O site é um material de apoio para conhecer o jogo, consultar resumos de regras e organizar fichas durante uma sessão. Não substitui o livro ou as decisões da mesa.

## Visão geral

O **BRUTAL RPG — Site de Mesa** é uma aplicação web em português (Brasil), com estética de terror/slasher, que reúne materiais de aprendizagem e ferramentas práticas para dois papéis de uso:

- **Sobrevivente / Intérprete:** aprender as regras e manter uma ficha de personagem durante o jogo.
- **Mestre / Diretora:** consultar um guia de condução e manter uma ficha de Assassino com seus dados, Pontos de Horror, Ameaças e poderes.

A interface usa navegação condicionada ao papel escolhido, fichas interativas, rolagens de dados D6, galeria de imagens, controles para acompanhar condições e gravação automática do estado no armazenamento local do navegador.

## Índice

- [Áreas principais do site](#áreas-principais-do-site)
- [Aprender a jogar](#1-aprender-a-jogar)
- [Minha Ficha — Sobrevivente](#2-minha-ficha--sobrevivente)
- [Guia do Mestre / Diretora](#3-guia-do-mestre--diretora)
- [Ficha do Mestre / Assassino](#4-ficha-do-mestre--assassino)
- [Roladores de dados](#roladores-de-dados)
- [Conteúdo e referências embutidos](#conteúdo-e-referências-embutidos)
- [Imagens e identidade visual](#imagens-e-identidade-visual)
- [Salvamento, privacidade e limites atuais](#salvamento-privacidade-e-limites-atuais)
- [Tecnologias e estrutura](#tecnologias-e-estrutura)
- [Como executar localmente](#como-executar-localmente)
- [Observações sobre o escopo](#observações-sobre-o-escopo)

## Áreas principais do site

A página inicial permite escolher entre **Sobrevivente** e **Mestre**. Depois da escolha, a navegação mostra apenas as opções relacionadas ao papel selecionado:

| Papel | Área | Para que serve |
|---|---|---|
| Sobrevivente | **Aprender a Jogar** | Lições introdutórias, exemplos e galeria de arquétipos. |
| Sobrevivente | **Minha Ficha** | Criar e acompanhar a ficha do personagem, rolar dados e controlar recursos e condições. |
| Mestre / Diretora | **Guia do Mestre** | Referência para preparar e conduzir cenas, Ameaças e encontros. |
| Mestre / Diretora | **Ficha do Mestre** | Preparar e acompanhar o Assassino, seus recursos e suas ações. |

A logo permite voltar à tela de escolha de papel. As fichas exibem um aviso de que o site é não oficial.

## 1. Aprender a jogar

A área **Aprender a Jogar BRUTAL** organiza o material em 13 lições, com seções expansíveis para estudar em ordem. Os tópicos incluídos são:

1. **O que é BRUTAL e quem é quem:** apresentação do RPG de terror slasher, do Thriller e dos papéis da mesa.
2. **Como interpretar sua Sobrevivente:** interpretação dos arquétipos, decisões típicas de terror, Apegos, relações e convivência na mesa.
3. **O Rito de Iniciação:** oferendas, dados, Clamores Favoráveis e Desfavoráveis e Qualidades do cenário.
4. **Seus dados e para onde eles vão:** pilha de dados, descarte, sacrifício e recuperação.
5. **Como fazer um teste:** atributos, resultados dos D6, dificuldade, Risco Comum/Complexo, Recursos e Desastre. Inclui um pequeno rolador demonstrativo.
6. **Atributos e especialidades:** os cinco atributos, especialidades dos arquétipos e incapacitação.
7. **As cenas, uma por uma:** fluxo de cena livre, suspense e encontro.
8. **Teste de Susto:** rolagem, falhas e consequências.
9. **Pontos de Tensão e vantagens:** formas de ganhar PT, Apegos e compra de vantagens.
10. **O Encontro, turno a turno:** objetivo dos jogadores, ordem de iniciativa, ações, fuga e encerramento do encontro.
11. **Feridas e Sequelas:** acompanhamento de feridas, morte e sequelas persistentes.
12. **Criando sua Sobrevivente:** arquétipo, especialidade, habilidade inicial, vantagens, Apegos, dados pessoais e cicatrizes.
13. **Dicas para sobreviver:** recomendações de gestão de dados, cooperação, uso de especialidades, Recursos e Pistas.

A área também contém uma seção visual com os **oito arquétipos** do material: Atleta, Cética, Esbelto, Herói, Nerd, Inocente, Relaxado e Valentona. Um atalho leva diretamente à ficha da Sobrevivente.

## 2. Minha Ficha — Sobrevivente

A ficha é interativa e concentra campos de personagem, contadores e controles úteis durante a sessão.

### Identidade e imagem

- Nome da Sobrevivente, pronomes e nome do Intérprete.
- Escolha de um dos oito arquétipos.
- Imagem selecionável a partir da galeria incluída no site ou envio de imagem própria.
- Descrição do arquétipo selecionado e cor associada à ficha.

### Pilhas e Pontos de Tensão

- **Pilha de dados comuns:** contador de 0 a 6, com representação visual dos dados disponíveis.
- **Pilha de Fuga:** contador separado; ao adicionar dado de fuga, ele é removido da pilha comum.
- **Pontos de Tensão (PT):** contador de 0 a 10 com barra visual.
- Botões de incremento/decremento com limites definidos para os contadores.

### Atributos e especialidades

- Lista dos cinco atributos: **Força, Agilidade, Astúcia, Vigor e Carisma**.
- Indicação das especialidades concedidas pelo arquétipo.
- Controle para marcar uma especialidade como incapacitada ou recuperá-la. O estado de incapacitação aparece visualmente e é considerado pelo rolador.

### Feridas, Sequelas e marcadores

- **Ferida:** contador de 0 a 6, barra de progresso e aviso de morte ao chegar a 6.
- **Cuidar de Feridas:** reduz 1 ponto de Ferida ao custo de 1 PT, respeitando o limite mínimo definido pelas Sequelas.
- **Sequelas:** controle de até 5, com opção de aumentar em 1, 2 ou 3 pontos e remover uma sequela.
- **Marcadores de condição:** adicionar e remover marcadores, atribuir um nome opcional e ajustar o dano por rodada.
- Tipos de marcador disponíveis: Infecção, Possessão, Restrição, Segurar, Maldição e Personalizado.
- Botão para avançar a rodada, aplicar o dano acumulado dos marcadores à Ferida e zerar o contador de rodadas.
- Resumos de estágio para condições como Infecção, Possessão e Maldição.

### Habilidades, cicatrizes e vantagens

- Escolha de **uma habilidade inicial** entre as habilidades do arquétipo.
- Registro de cicatrizes, quando permitido pela regra descrita no site: outra habilidade do próprio arquétipo, habilidade de uma Sobrevivente morta ou Cicatriz de Sobrevivente.
- Consulta das habilidades escolhidas e suas descrições.
- Loja de vantagens com controle de custo em PT. Inclui **Tomar Jeito**, **Choque de Realidade** e **Cuidar de Feridas**.
- Vantagens associadas às especialidades, com indicação de custo e descrição e botão de uso que desconta PT quando aplicável.
- Lista das vantagens compradas e registro de quantas vezes foram usadas.

### Apegos e anotações

- Campos para **Item Icônico**, **Relação Afetiva** e **Desejo Obscuro**.
- Atalhos para registrar os ganhos de PT descritos para cada tipo de Apego.
- Área de anotações livres da Sobrevivente.
- Botão **Limpar ficha**, que reinicializa os dados atuais da ficha de Sobrevivente.

## 3. Guia do Mestre / Diretora

O **Guia do Mestre (Diretora)** apresenta 12 seções principais, incluindo subseções do Rito de Iniciação e dos Clamores. O conteúdo disponível cobre:

1. **Seu papel e o ritmo da sessão:** função narrativa da Diretora e estrutura de uma sessão.
2. **Preparação (checklist):** cenário, Ambientes, Qualidades, Assassino, Cena de Suspense, dados, funções ocultas e limites da mesa.
3. **Montando o Assassino:** escolha de duas Ameaças, Nível de Brutalidade, dados iniciais, PH, Ações Únicas, Poder Passivo e Poder Especial.
4. **Catálogo de Ameaças:** consulta das características e ações das Ameaças disponíveis.
5. **Pontos de Horror e suas ações:** formas de ganhar PH, Ações Únicas, Poderes Especiais e dicas de uso narrativo.
6. **Ações gerais e conta dos dados:** referências para as ações da Diretora e movimentação de dados entre pilhas.
7. **Cena de Suspense:** Resolução, Passos, Caminhos, Armadilhas, descrição e preparação de rodadas.
8. **Cenários, Qualidades e o Rito de Iniciação:** Ambientes e Qualidades Favoráveis, Neutras e Desfavoráveis.
   - **8.1. O Rito de Iniciação, passo a passo:** dado de abertura, oferendas dos Intérpretes e da Diretora e anulação de Clamores.
   - **8.2. Clamando Qualidades durante o jogo:** uso de Clamores, aplicação de Qualidades e Qualidades Temporárias.
9. **Conduzindo o Encontro:** etapas de fuga, iniciativa, turno da Diretora, ações e fim do encontro.
10. **NPCs e figurantes:** orientações para usar personagens incidentais na narrativa.
11. **Funções Ocultas:** resumos do Traidor, da Possuída e do Vulto Entre Nós.
12. **Dicas de Diretora:** sugestões de descrição, ritmo, recompensa de interpretação, esperança e respeito aos limites da mesa.

As lições e o guia são material textual de referência dentro da página. A condução da sessão, a interpretação de regras abertas e várias decisões narrativas continuam a cargo das pessoas na mesa.

## 4. Ficha do Mestre — Assassino

A ficha da Diretora reúne a preparação do Assassino e os controles usados para acompanhar seus recursos.

### Identidade e composição

- Nome do Assassino.
- Imagem escolhida entre as imagens de Ameaças incluídas no site ou imagem própria.
- Seleção de uma **Ameaça Principal** e uma **segunda Ameaça**.
- Seleção de uma Ação Única de cada Ameaça.
- Seleção de qual Ameaça fornece o Poder Passivo.
- Seleção de um Poder Especial.

### Valores calculados pela ficha

Ao selecionar as Ameaças, a ficha atualiza automaticamente:

- soma dos **Níveis de Brutalidade (NB)**;
- quantidade inicial de dados do Assassino;
- Pontos de Horror iniciais, com base na Ameaça Principal;
- Etapas de Fuga, com base no maior NB mais um;
- quantidade indicada de sustos por encontro;
- quantidade de Armadilhas grátis para Suspense, incluindo o bônus previsto para a Ameaça Estratégico quando aplicável.

### Dados e Pontos de Horror

- Pilha de dados do Assassino, ajustável de 0 a 12.
- Botões para ajustar a pilha por ações de jogo, acrescentar dados, restaurar o total calculado ou retirar dados.
- **Pontos de Horror (PH):** contador de 0 a 20 com barra visual.
- Atalhos para registrar ganhos e gastos de PH, incluindo os controles exibidos para Mutilar e Dificultar.
- Botões para registrar PH ganhos por **Intentos Horríveis** gerais e pelo Intento Único de cada Ameaça selecionada.
- Registro recente de PH, exibindo até as oito movimentações mais recentes geradas pela ficha.

### Rolagem e ações

- Rolador para **Ferir**, rolar dados livres e, quando a Ameaça Mestre estiver selecionada, rolar o **Dado da Horda (DH)**.
- Resultado visual dos dados e resumo dos sucessos quando o tipo de rolagem usa sucessos.
- No resultado de Ferir, controles contextuais para registrar morte, Mutilar ou entregar o dado como marcador de Ferida.
- Exibição de lembretes relacionados a certas Ameaças e Poderes Especiais, quando correspondem à seleção atual.
- Tabela de referência das ações gerais: Assustar, Matar, Ferir, Mutilar, Escapar e Dificultar.
- Área de anotações do Thriller.
- Botão **Limpar ficha**, que reinicializa os dados atuais da ficha do Mestre.

## Roladores de dados

Os roladores são uma das partes interativas centrais do projeto. Os dados usam valores de **D6** e possuem representação visual tridimensional animada.

### Rolador da Sobrevivente

Oferece três tipos de rolagem:

- **Teste de risco:** permite escolher o atributo e se o risco é Comum ou Complexo.
- **Vazar Dali:** usa a configuração de fuga e registra os dados de fuga obtidos.
- **Teste de Susto:** apresenta o resultado para a regra de susto.

Controles adicionais:

- quantidade de dados a arriscar, limitada pela pilha disponível;
- uso ou não de Recurso, com o ajuste de dificuldade correspondente;
- ajuste manual da dificuldade dentro dos limites da interface;
- cálculo da dificuldade considerando especialidade e incapacitação, quando aplicável, marcadores de Restrição, Recurso e modificador;
- resumo de sucessos e falhas;
- ação para aplicar ao estado da ficha os efeitos previstos para a rolagem, quando esse tipo de teste oferece aplicação automática;
- botões contextuais para algumas interações de habilidade, como repetir determinadas rolagens, evitar perdas específicas, trocar um dado pelo marcador de Ferida ou receber PT quando a condição correspondente se aplica.

### Rolador do Mestre

Oferece:

- **Ferir:** rola um dado e apresenta o resultado de Ferida/morte previsto pela ficha;
- **Dados livres:** escolhe quantidade de dados e limiar de sucesso;
- **Dado da Horda:** fica disponível quando uma das Ameaças selecionadas é Mestre.

Alguns resultados oferecem botões de aplicação à ficha, como atualizar a pilha de dados e PH ou registrar o dado marcador. O rolador auxilia o acompanhamento; não automatiza todas as decisões de interpretação e resolução de uma sessão completa.

### Rolador demonstrativo da área de aprendizagem

Na lição sobre testes há também uma demonstração simples, com escolha da quantidade de dados e opção de risco comum/complexo, para ilustrar como sucessos e falhas são contados.

## Conteúdo e referências embutidos

Os dados de referência ficam no próprio `script.js`, em estruturas JavaScript usadas para montar as telas. O conjunto inclui:

- **5 atributos:** Força, Agilidade, Astúcia, Vigor e Carisma, com descrições;
- **8 arquétipos:** Atleta, Cética, Esbelto, Herói, Nerd, Inocente, Relaxado e Valentona;
- descrições, especialidades, habilidades e custos de vantagens associados aos arquétipos;
- **13 Ameaças:** Amaldiçoado, Assombração, Brutamontes, Carniceira, Desconhecida, Descontrolada, Estratégico, Inato, Máquina, Mestre, Monstruosidade, Obstinada e Perseguidor;
- Nível de Brutalidade, Poderes Passivos, Ações Únicas e Intentos Únicos das Ameaças;
- lista de Intentos Horríveis e lista de poderes especiais do Assassino;
- tipos de marcadores e descrições de seus efeitos;
- descrições, tabelas e exemplos incorporados ao guia de aprendizagem e ao guia da Diretora.

Esses dados alimentam as opções das fichas, os cálculos derivados e os textos contextuais mostrados pela interface.

## Imagens e identidade visual

- O HTML contém um armazenamento de imagens em templates, com uma chave para cada imagem utilizada pelo projeto; o JavaScript consulta esse conjunto quando precisa exibir uma imagem.
- As imagens internas não dependem de uma pasta externa de assets separada.
- A galeria permite escolher uma imagem de arquétipo para a Sobrevivente e uma imagem de Ameaça para o Assassino.
- É possível enviar uma imagem própria. O navegador redimensiona a imagem para que o maior lado tenha no máximo 600 pixels e a grava como JPEG antes de colocá-la na ficha.
- A identidade visual usa fundo escuro, vermelho de destaque, tons terrosos, tipografia condensada em títulos e fonte monoespaçada no texto.
- A interface inclui cards, barras, chips, tabelas, dados visuais, modal/galeria, estados de sucesso/falha e avisos temporários (*toast*).
- O layout possui regras responsivas para telas menores, áreas seguras de dispositivos móveis e preferência por movimento reduzido.
- As fontes Anton e Courier Prime são carregadas do Google Fonts; se não houver conexão, o navegador pode usar fontes alternativas definidas no CSS.

## Salvamento, privacidade e limites atuais

### Salvamento local

O estado atual das fichas é gravado automaticamente no **`localStorage` do navegador**:

- `br_s`: ficha da Sobrevivente;
- `br_d`: ficha do Mestre.

Isso permite atualizar a página e recuperar os dados no mesmo navegador e contexto de execução. As imagens próprias também são transformadas em dados de imagem armazenados no estado da ficha.

**Importante:** o salvamento é local, não uma conta online. Os dados não são sincronizados automaticamente entre computadores ou navegadores. Limpar os dados do site/navegador pode apagar as fichas. A implementação atual mantém o estado corrente de uma ficha de Sobrevivente e uma ficha de Mestre; não há uma tela de biblioteca para administrar várias fichas independentes.

### O que não está implementado no código atual

- cadastro, login ou perfis de usuário;
- banco de dados ou servidor para armazenar as fichas;
- sincronização na nuvem entre dispositivos;
- modo multiplayer ou sincronização em tempo real entre participantes;
- exportação/importação de fichas como arquivos ou PDF;
- biblioteca de múltiplas fichas independentes com seleção e histórico;
- automação integral de todas as regras ou substituição das decisões da Diretora.

Esses itens não devem ser considerados recursos do projeto até que sejam efetivamente desenvolvidos.

## Tecnologias e estrutura

O projeto é uma aplicação web estática, construída com HTML, CSS e JavaScript, sem framework obrigatório, etapa de compilação ou dependências de pacote para as funcionalidades centrais.

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura do documento, metadados, navegação, templates das áreas, aviso de não oficialidade e imagens embutidas. O elemento `#app` recebe a tela ativa. |
| `style.css` | Variáveis visuais, tipografia, layout, cards, controles, galeria, dados 3D, animações, estados de interação e responsividade. |
| `script.js` | Dados de referência, roladores, cálculo de resultados, estado das fichas, salvamento local, galeria, renderização das telas e eventos. |
| `README.md` | Documentação do projeto, das áreas do site, das funcionalidades e da execução local. |

### Como os arquivos se conectam

1. O navegador abre `index.html`.
2. O HTML carrega `style.css` para a aparência e `script.js` para a lógica.
3. O JavaScript lê as imagens a partir do template `#asset-store`.
4. A pessoa escolhe o papel e a interface mostra a navegação correspondente.
5. A função de renderização coloca a área selecionada dentro de `#app`, usando templates HTML ou montando a ficha dinamicamente.
6. Os eventos de botões e campos atualizam o estado; as fichas são gravadas no `localStorage` e a tela é renderizada novamente quando necessário.

## Como executar localmente

### Opção simples

1. Baixe ou extraia a pasta do projeto.
2. Mantenha `index.html`, `style.css`, `script.js` e `README.md` juntos na mesma pasta.
3. Abra `index.html` em um navegador moderno.

### Opção recomendada: servidor local

Usar um servidor local evita algumas diferenças de comportamento entre navegadores ao abrir arquivos diretamente.

1. Abra um terminal dentro da pasta do projeto.
2. Execute um dos comandos abaixo, se o Python estiver instalado:

   **Windows:**

   ```bash
   py -m http.server 8000
   ```

   **macOS / Linux:**

   ```bash
   python3 -m http.server 8000
   ```

3. Abra `http://localhost:8000` no navegador.
4. Para encerrar o servidor, volte ao terminal e pressione `Ctrl+C`.

Não é necessário instalar dependências npm ou compilar o projeto.

## Observações sobre o escopo

- O site é um **guia e painel de apoio para mesa**, com resumos e ferramentas de acompanhamento; nem toda regra está transformada em um fluxo automatizado.
- Os conteúdos de aprendizagem e o Guia do Mestre têm foco didático: explicam conceitos, procedimentos e sugestões para uso durante a sessão.
- Os cálculos automáticos e limites citados nesta documentação descrevem o comportamento implementado no código atual. Para casos especiais, ambiguidades ou decisões narrativas, consulte as regras de referência e combine a resolução com a mesa.
- O aviso de não oficialidade faz parte do próprio site: o projeto não declara vínculo com a Equipe Brutal nem com a Editora New Order.

---

**BRUTAL RPG — Site de Mesa (não oficial)** · Projeto independente de apoio a jogadores e Diretoras.
