# BRUTAL RPG — Site de RPG de terror

Site não oficial de apoio ao jogo de mesa **BRUTAL RPG**, com ambientação de terror slasher. O projeto reúne material introdutório, referências do jogo e ferramentas interativas para apoiar a criação de personagens e a condução das sessões.

## ✦ Principais recursos

- **Ambientação visual de terror:** cenas ilustradas, personagens e ameaças, animações e elementos visuais que reforçam a identidade do site.
- **Aprender a jogar:** lições introdutórias, explicações de termos, papéis dos participantes e orientações para começar uma sessão.
- **Referência de jogo:** informações sobre atributos, arquétipos, vantagens, ameaças e outros elementos usados nas regras.
- **Fichas e personagens:** ferramentas para consultar e preencher informações relacionadas às sobreviventes e à Diretora/Mestre.
- **Rolagens de dados:** controles para realizar rolagens e apresentar resultados, com animações e interação visual.
- **Navegação dinâmica:** diferentes áreas do conteúdo são exibidas pela interface do próprio site.
- **Efeitos de interface:** animações, efeitos de iluminação e respostas visuais às ações do usuário.
- **Salvamento local:** parte dos dados de jogo é guardada no `localStorage` do navegador.
- **Layout responsivo:** estilos preparados para diferentes tamanhos de tela.

> A lista se baseia na estrutura e no código do projeto. O funcionamento completo de todas as funcionalidades deve ser confirmado usando o site no navegador.

## 🗂️ Estrutura dos arquivos

Mantenha os três arquivos na mesma pasta:

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da página, conteúdo, modelos das telas e imagens incorporadas. |
| `style.css` | Cores, fontes, posicionamento, animações e adaptação do layout. |
| `script.js` | Lógica e interatividade: dados do jogo, fichas, rolagens, navegação, renderização, eventos e salvamento local. |

### Sobre as imagens

Para preservar os recursos visuais originais, várias imagens e o ícone do site continuam incorporados no HTML em formato Base64. Por isso, `index.html` é relativamente grande. O JavaScript localiza imagens usando identificadores definidos no HTML.

## 🚀 Como executar

1. Baixe ou extraia os arquivos do projeto.
2. Confirme que `index.html`, `style.css` e `script.js` estão na mesma pasta.
3. Abra `index.html` em um navegador atualizado.
4. Para carregar as fontes **Anton** e **Courier Prime**, mantenha a conexão com a internet, pois elas são obtidas pelo Google Fonts.

O projeto é composto por HTML, CSS e JavaScript e não exige um processo de compilação obrigatório para abrir localmente.

## 💾 Salvamento de dados

O código usa o `localStorage` do navegador para guardar parte do estado do jogo. Esse armazenamento:

- fica no navegador e dispositivo em que foi criado;
- não sincroniza automaticamente entre dispositivos ou navegadores;
- pode ser apagado ao limpar os dados do site ou o armazenamento do navegador.

## 🛠️ Tecnologias utilizadas

- **HTML5** — estrutura e conteúdo.
- **CSS3** — layout, tipografia, animações e efeitos visuais.
- **JavaScript** — interações, manipulação do DOM, rolagens e persistência local.
- **Google Fonts** — fontes Anton e Courier Prime.

## 🧭 Manutenção e personalização

- Edite a estrutura e o conteúdo das telas em `index.html`.
- Altere cores, espaçamentos, tipografia e animações em `style.css`.
- Modifique interações, rolagens, fichas e navegação em `script.js`.
- Ao alterar identificadores de imagens, mantenha os nomes consistentes entre o HTML e o JavaScript.
- Depois de qualquer alteração, teste navegação, formulários, rolagens e recuperação de dados no navegador.

## ⚠️ Observações

- O próprio site identifica o projeto como **não oficial**.
- As fontes externas dependem de conexão com a internet.
- A existência de uma funcionalidade no código não substitui testes práticos de todos os fluxos.
- Antes de publicar o site, revise direitos de uso de imagens e materiais, acessibilidade, contraste, desempenho e funcionamento em dispositivos móveis.

## 📄 Licença

Nenhuma licença específica foi identificada nos arquivos fornecidos. Antes de redistribuir ou reutilizar o projeto, defina uma licença e confirme que você tem autorização para distribuir os textos, imagens, fontes e demais recursos incluídos.

---

**BRUTAL RPG — apoio visual e ferramentas para uma sessão de terror de mesa.**
