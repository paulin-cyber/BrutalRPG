# BRUTAL RPG — RPG de Mesa (não oficial)

Projeto independente de apoio a sessões de **BRUTAL RPG**, com áreas para jogadores e para o Mestre. Reúne materiais de aprendizagem e consulta, atividades, fichas e ferramentas de apoio à mesa.

## Recursos

### Área do Sobrevivente
- **Aprender a Jogar:** percurso de aprendizagem dividido em lições.
- **Desafios:** atividades práticas e acompanhamento de progresso.
- **Glossário:** consulta rápida de termos e conceitos.
- **Primeira Noite:** tutorial interativo para conhecer o fluxo básico de uma sessão.
- **Minha Ficha:** área de ficha do Sobrevivente.

### Área do Mestre
- **Guia da Diretora:** orientações e referências para conduzir uma sessão.
- **Ficha da Diretora:** área de apoio e consulta.
- **Mesa:** ferramentas e referências para acompanhar elementos da sessão.

## Estrutura

```text
BRUTAL-RPG/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── aprender.css
│   ├── glossario.css
│   ├── confirmacao.css
│   ├── primeira-noite.css
│   ├── guia.css
│   └── mesa.css
├── js/
│   ├── app.js
│   ├── aprender.js
│   ├── glossario.js
│   ├── confirmacao.js
│   ├── primeira-noite.js
│   └── mesa.js
```

- `index.html` contém a estrutura das telas, modelos e elementos do site.
- `css/` reúne os estilos separados por área.
- `js/` reúne os scripts separados por funcionalidade. A ordem de carregamento original foi preservada.

## Executar localmente

1. Baixe ou clone este repositório.
2. Mantenha os nomes e a estrutura das pastas.
3. Abra `index.html` em um navegador atualizado.

O projeto é estático e não exige instalação de dependências ou servidor de aplicação. O carregamento das fontes externas pode exigir conexão com a internet.

## Publicar com GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos e pastas para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, selecione a publicação a partir de uma branch.
5. Escolha a branch principal e a pasta `/ (root)` e salve.
6. Aguarde o GitHub Pages publicar o endereço do site.

## Manutenção

- Não mova nem renomeie arquivos CSS ou JavaScript sem atualizar os caminhos no `index.html`.
- Preserve a sequência das tags `<script>` no HTML, pois os módulos compartilham dados e funções.
- Esta separação organiza os arquivos; não é uma revisão nem uma alteração das regras ou do conteúdo do RPG.

## Créditos e permissões

BRUTAL RPG e seus materiais pertencem aos respectivos criadores e titulares. Este site é uma iniciativa de fã. Mantenha os créditos e cumpra as condições da autorização concedida para publicar textos, ilustrações e demais materiais incluídos.
