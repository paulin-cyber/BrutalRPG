/* ==== Glossário e consulta rápida (módulo gl) ==== */
(function () {
  "use strict";

  const CATS = [
    ["base", "Cenas, testes e dados"],
    ["atr", "Atributos"],
    ["aco", "Ações"],
    ["enc", "Encontros"],
    ["ame", "Ameaças"],
    ["con", "Condições"],
    ["van", "Vantagens"],
    ["sus", "Suspense e cenário"],
    ["esp", "Mecânicas especiais"],
  ];

  /* c = categoria, n = nome, t = explicação, g = rótulo (opcional),
     k = palavras relacionadas para a busca, v = termos relacionados */
  const T = [
    /* ---------- Cenas, testes e dados ---------- */
    { c: "base", n: "Thriller", t: "A história preparada pela Diretora, na qual as Sobreviventes vivem (ou morrem).", k: "sessao jogatina historia partida" },
    { c: "base", p: 50, n: "Diretora", t: "Quem conduz o Thriller ao lado dos Intérpretes: define o cenário, os conflitos e o Assassino.", k: "mestre gm narrador narradora", v: ["Intérprete", "Assassino"] },
    { c: "base", n: "Intérprete", t: "O jogador. Cada Intérprete controla uma Sobrevivente.", k: "jogador jogadora pj", v: ["Sobrevivente"] },
    { c: "base", n: "Sobrevivente", t: "A personagem de um Intérprete: jovem marcada para morrer, definida por um Arquétipo.", k: "personagem alvo pj", v: ["Arquétipo", "Intérprete"] },
    { c: "base", n: "Cena Livre", t: "As Sobreviventes exploram o cenário e conversam, sem ordem de ações nem limites. Dados que falham são Sacrificados.", k: "tipos de cena explorar", g: "Tipo de cena", v: ["Dado Sacrificado"] },
    { c: "base", n: "Cena de Suspense", t: "Há um conflito a resolver (mistério, quebra-cabeças ou rota de fuga). Organizada em rodadas, sem iniciativa. Dados que falham são Sacrificados.", k: "tipos de cena", g: "Tipo de cena", v: ["Caminho", "Passo", "Dado Sacrificado"] },
    { c: "base", n: "Cena de Encontro", t: "Enfrentamento direto com a ameaça, em ordem de iniciativa e com ações definidas. Dados que falham são Descartados.", k: "tipos de cena combate luta", g: "Tipo de cena", v: ["Encontro", "Iniciativa", "Dado Descartado"] },
    { c: "base", n: "Teste", t: "Para superar um Risco, anuncie quantos dados da pilha arrisca e role todos eles, mesmo que já tenha obtido um sucesso. Dificuldade padrão 4: dado 4 ou mais é Sucesso; abaixo disso, Falha. Cada dado de Falha sai da sua mão.", k: "rolar rolagem dificuldade 4 d6 arriscar anunciar", v: ["Risco", "Risco Complexo", "Pilha de dados"] },
    { c: "base", n: "Risco", t: "Perigo à integridade mental ou física de uma ação (feridas, cansaço, rejeição, decepção). Superá-lo muitas vezes exige um Teste. Em Risco Comum basta 1 sucesso.", k: "risco comum perigo", v: ["Teste", "Risco Complexo"] },
    { c: "base", n: "Risco Complexo", t: "Dificuldade maior que a do Risco Comum: exige 2 sucessos no Teste. A Diretora pode decidir a complexidade de um Risco. Um Recurso pode transformá-lo em Risco Comum.", k: "dois sucessos complexo", v: ["Teste", "Recurso"] },
    { c: "base", n: "Sucesso e Falha", t: "Com dificuldade 4, dado 4, 5 ou 6 é Sucesso; 1, 2 ou 3 é Falha. Falhas saem da pilha: Sacrificadas ou Descartadas, conforme a cena.", k: "acerto erro 4 5 6", v: ["Dado Sacrificado", "Dado Descartado"] },
    { c: "base", n: "Desastre", t: "Se você perder seu último dado em um teste, a ação é um desastre e a Sobrevivente fica impossibilitada de continuar fazendo testes na cena.", k: "ultimo dado sem dados", v: ["Pilha de dados"] },
    { c: "base", n: "Pilha de dados", t: "Cada Intérprete começa com 6 dados D6 e não pode exceder esse limite. Representa determinação, estabilidade física e emocional. Sem dados, a personagem não faz testes e morre na hora em um encontro com o Assassino se estiver de mãos vazias.", k: "dados maximo 6 mao vazia morte", v: ["Teste", "Recuperar dados"] },
    { c: "base", n: "Dado Sacrificado", t: "Em Cenas Livres e de Suspense, dado que falhou sai da pilha do Intérprete e vai para a pilha da Diretora.", k: "falha sacrificar pilha da diretora", v: ["Dado Descartado"] },
    { c: "base", n: "Dado Descartado", t: "Vai para a Pilha de Descarte, no centro da mesa, e não pertence a ninguém. Em Encontros e em Testes de Susto, falhas são sempre Descartadas, salvo exceção.", k: "descartar pilha de descarte falha", v: ["Dado Sacrificado", "Recuperar dados"] },
    { c: "base", n: "Recuperar dados", t: "Duas maneiras: comprar a Vantagem Choque de Realidade ou usar a ação Recuperar o Fôlego em um encontro. Os dados recuperados são pescados da pilha de descarte, montada antes da jogatina.", k: "recuperar folego pilha de descarte pescar", v: ["Choque de Realidade", "Recuperar o Fôlego"] },
    { c: "base", n: "Teste de Susto", t: "Pedido pela Diretora diante de uma cena chocante. Role 1 dado da pilha, como Risco Comum. Se falhar, descarte o dado.", k: "susto assustar medo", v: ["Assustar", "Risco"] },
    { c: "base", n: "Recurso", t: "Item ou elemento do ambiente (arma improvisada, decoração). Usado em um teste, reduz a dificuldade padrão em 1 ou transforma um Risco Complexo em Comum. Tem de 1 a 3 usos, conforme a Diretora. Vem de ação narrativa ou da Vantagem Caçar Recursos.", k: "item usos arma improvisada", v: ["Caçar Recursos", "Risco Complexo"] },
    { c: "base", n: "Especialidade", t: "Cada Arquétipo tem Especialidade em 2 atributos. Testes que usem esses atributos como base têm a dificuldade padrão reduzida em 1.", k: "especialista dificuldade reduzida bonus", v: ["Atributos", "Arquétipo", "Incapacitado"] },
    { c: "base", n: "Atributo base", t: "A Diretora sugere o atributo de um teste. O Intérprete também pode sugerir um antes de rolar, explicando a ideia, mas a palavra final é da Diretora.", k: "escolher atributo teste sugerir", v: ["Atributos"] },

    /* ---------- Atributos ---------- */
    { c: "atr", n: "Atributos", t: "São 5: Agilidade, Vigor, Força, Carisma e Astúcia. Ditam as áreas de atuação da Sobrevivente: física, mental ou social.", k: "agilidade vigor forca carisma astucia cinco", v: ["Especialidade"] },
    { c: "atr", n: "Agilidade", t: "Velocidade, destreza, reflexos. Base de Vazar Dali. Vantagem de especialidade: Preparar Para a Próxima.", k: "velocidade destreza reflexos", v: ["Vazar Dali", "Preparar Para a Próxima"] },
    { c: "atr", n: "Vigor", t: "Resiliência física. Vantagem de especialidade: Adrenalina.", k: "resiliencia fisica", v: ["Adrenalina"] },
    { c: "atr", n: "Força", t: "Potência física. Base de Partir Para Cima. Vantagem de especialidade: Ele Não Espera Por Mim.", k: "potencia fisica forca", v: ["Partir Para Cima", "Ele Não Espera Por Mim"] },
    { c: "atr", n: "Carisma", t: "Habilidade interpessoal. Vantagem de especialidade: Ombro Amigo.", k: "interpessoal social", v: ["Ombro Amigo"] },
    { c: "atr", n: "Astúcia", t: "Conhecimento, raciocínio. Vantagem de especialidade: Caçar Recursos. Em algumas ações e vantagens o livro a chama de Intelecto ou Inteligência.", k: "intelecto inteligencia conhecimento raciocinio", v: ["Caçar Recursos", "Distrair"] },

    /* ---------- Ações das Sobreviventes ---------- */
    { c: "aco", n: "Vazar Dali", g: "Sobrevivente", t: "Teste de Agilidade para se afastar do Assassino. Cada dado de sucesso vira um Dado de Fuga. Um 6 é Fuga Vantajosa e conta como dois Dados de Fuga.", k: "fugir fuga agilidade escapar", v: ["Dado de Fuga", "Fuga Vantajosa", "Etapas de Fuga"] },
    { c: "aco", n: "Recuperar o Fôlego", g: "Sobrevivente", t: "Gaste a ação para receber +1 dado comum na pilha.", k: "folego descansar dado", v: ["Recuperar dados"] },
    { c: "aco", n: "Partir Para Cima", g: "Sobrevivente", t: "Teste de Força para enfrentar o Assassino. Se houver sucesso, ele descarta 1 dado, independentemente de quantos sucessos você tirar.", k: "atacar enfrentar forca lutar", v: ["Força"] },
    { c: "aco", n: "Arriscar Tudo", g: "Sobrevivente", t: "Descarte todos os seus dados para fugir automaticamente do encontro. Só em encontro, uma vez por sessão, e não pode ser usada pelo último presente na cena.", k: "fugir automatico ultima chance", v: ["Etapas de Fuga"] },
    { c: "aco", n: "Ajudar Alguém", g: "Sobrevivente", t: "Teste de um atributo à sua escolha. Todos os dados de sucesso são doados a uma Sobrevivente à sua escolha. As falhas não são descartadas.", k: "doar dados ajudar ajuda companheiro", v: ["Pilha de dados"] },
    { c: "aco", n: "Distrair", g: "Sobrevivente", t: "Teste complexo de Astúcia (o livro escreve Inteligência). Em sucesso, o Assassino gasta +1 dado se usar Matar no turno. Usos múltiplos acumulam +1 cada.", k: "distracao assassino matar", v: ["Matar", "Risco Complexo"] },
    { c: "aco", n: "Ações com outra especialidade", g: "Sobrevivente", t: "Se a ideia do Intérprete fizer sentido, a Diretora pode permitir outro atributo numa ação, como Distrair com Agilidade (atirando no Assassino) ou Partir Para Cima com Carisma (seduzindo).", k: "trocar atributo outra especialidade", v: ["Atributo base"] },

    /* ---------- Ações do Assassino ---------- */
    { c: "aco", n: "Assustar", g: "Assassino · geral", t: "Provoca um Teste de Susto a qualquer momento. Sustos por encontro: 7 menos o Nível de Brutalidade. Susto Opcional: +1 PH se um Intérprete suspirar de medo ou se contorcer de nojo.", k: "susto teste de susto", v: ["Teste de Susto", "Nível de Brutalidade"] },
    { c: "aco", n: "Matar", g: "Assassino · geral", t: "No encontro, mata qualquer Sobrevivente com menos dados que a pilha do Assassino, que descarta 2 dados em seguida.", k: "morte assassinar", v: ["Pilha de dados"] },
    { c: "aco", n: "Ferir", g: "Assassino · geral", t: "Rola 1 dado. Com 6, mata na hora e o dado é descartado. Com menos, o dado vai para a Sobrevivente como Dado Marcador de Ferida (valores somados). Cada Ferida soma 1 ponto de Sequela.", k: "ferimento machucar dano", v: ["Ferida", "Sequela", "Mutilar"] },
    { c: "aco", n: "Mutilar", g: "Assassino · geral", t: "Ao tirar 6 em um Ferir, o Assassino pode descartar o dado e não matar: o alvo recebe +3 Sequelas e uma última chance de correr. O Assassino ganha 4 PH.", k: "sequelas 6 ferir", v: ["Ferir", "Sequela"] },
    { c: "aco", n: "Escapar", g: "Assassino · geral", t: "O Assassino se retira da cena, encerrando o confronto, e recebe 1 dado na pilha.", k: "fugir assassino sair", v: ["Fim do encontro"] },
    { c: "aco", n: "Dificultar", g: "Assassino · geral", t: "No começo do encontro, aumenta em 1 as Etapas de Fuga, ao custo de 4 PH por dado.", k: "etapas de fuga aumentar", v: ["Etapas de Fuga"] },

    /* ---------- Ações Únicas ---------- */
    { c: "aco", n: "Acidentar", g: "Assassino · única", t: "Ao usar Assustar no grupo fora de encontro, gasta 4 PH para usar Ferir em uma Sobrevivente que falhou no teste.", k: "armadilha ferir susto", v: ["Assustar", "Ferir"] },
    { c: "aco", n: "Amaldiçoar", g: "Assassino · única", t: "Gasta 3 PH para pôr, em segredo, um Dado Marcador oculto num recurso recém encontrado. Começa em 1 e sobe a cada uso do recurso em teste. No 3, a portadora perde todos os PT e não ganha novos até o fim da próxima cena.", k: "maldicao recurso dado marcador oculto", v: ["Recurso", "Dado Marcador"] },
    { c: "aco", n: "Destruir", g: "Assassino · única", t: "Em encontro, ao usar Ferir, gasta 4 PH para destruir um recurso do cenário ou de uma Sobrevivente, ou uma qualidade favorável. Em Cena de Suspense, sem PH e sem Ferir.", k: "recurso qualidade", v: ["Recurso", "Qualidade"] },
    { c: "aco", n: "Devorar", g: "Assassino · única", t: "Quando uma Sobrevivente anunciar um resultado 6, o Assassino recebe 1 PH. A Sobrevivente mantém o sucesso.", k: "seis ph pontos de horror", v: ["Pontos de Horror"] },
    { c: "aco", n: "Incapacitar", g: "Assassino · única", t: "Em encontro, ao ferir, gasta 4 PH para incapacitar uma especialidade da Sobrevivente até ela ser recuperada com Tomar Jeito. Também bloqueia a vantagem ligada. Em Suspense, sem PH e sem Ferir.", k: "especialidade atributo", v: ["Incapacitado", "Tomar Jeito"] },
    { c: "aco", n: "Infectar", g: "Assassino · única", t: "Gasta 4 PH e entrega 1 de seus dados como Dado Marcador de Infecção a uma Sobrevivente.", k: "infeccao dado marcador", v: ["Infecção"] },
    { c: "aco", n: "Possuir", g: "Assassino · única", t: "Entrega 1 de seus dados como Dado Marcador de Possessão. Começa em 1 e sobe a cada dado de falha da Sobrevivente ao tentar superar um Risco. No 6, o Assassino pode usá-lo para Matar através dela.", k: "possessao dado marcador", v: ["Possessão"] },
    { c: "aco", n: "Segurar", g: "Assassino · única", t: "Ao ferir sem matar, gasta 5 PH para segurar a Sobrevivente e impedi-la de fugir. Veja Imobilizada.", k: "imobilizar prender", v: ["Imobilizada"] },
    { c: "aco", n: "Restringir", g: "Assassino · única", t: "Entrega 1 de seus dados na face 3 como Dado Marcador: todos os testes da Sobrevivente ficam +1 de dificuldade. Veja Restrição.", k: "restricao dado marcador", v: ["Restrição"] },

    /* ---------- Encontros ---------- */
    { c: "enc", n: "Encontro", t: "O Assassino pode aparecer quando tiver mais dados que qualquer pessoa na mesa, iniciando um Encontro. Todos agem em iniciativa. A compra de Vantagens é proibida, salvo situação especial.", k: "combate luta cena de encontro assassino aparece", v: ["Iniciativa", "Fim do encontro"] },
    { c: "enc", n: "Iniciativa", t: "Os jogadores agem primeiro, na ordem do Arquétipo: Herói, Atleta, Valentona, Esbelto, Inocente, Nerd, Relaxado, Cética. Por último, o Assassino.", k: "ordem turno arquetipo", v: ["Encontro"] },
    { c: "enc", n: "Etapas de Fuga", t: "Número de Dados de Fuga que a Sobrevivente precisa ter na pilha para escapar. O valor é secreto para os Intérpretes e varia conforme as Ameaças e o ambiente. Base: maior NB entre as Ameaças + 1.", k: "escapar valor de fuga secreto", v: ["Dado de Fuga", "Nível de Brutalidade"] },
    { c: "enc", n: "Dado de Fuga", t: "Criado pelo Vazar Dali. Dados de Fuga na pilha somam para atingir as Etapas de Fuga. Marque-os na ficha ou deixe-os em outra área da mesa.", k: "fuga progresso", v: ["Vazar Dali", "Etapas de Fuga"] },
    { c: "enc", n: "Fuga Vantajosa", t: "Dado 6 no Vazar Dali: conta como sucesso duplo, ou seja, dois Dados de Fuga.", k: "seis dado duplo", v: ["Vazar Dali"] },
    { c: "enc", n: "Movimento", t: "Abstrato e narrativo. Para saber quem está mais perto do Assassino, conte os Dados de Fuga: quem tem menos está mais próximo.", k: "distancia proximidade", v: ["Dado de Fuga"] },
    { c: "enc", n: "Turno do Assassino", t: "Normalmente vem depois de todas as ações das Sobreviventes. A Diretora usa suas ações e habilidades especiais.", k: "diretora vez assassino", v: ["Iniciativa"] },
    { c: "enc", n: "Derrotar o Assassino", t: "Zerar a pilha de dados da Diretora derrota o Assassino momentaneamente. Os Intérpretes ganham uma Pista de como derrotá-lo de novo.", k: "pilha zerada vitoria", v: ["Pista"] },
    { c: "enc", n: "Pista", t: "Conhecimento sobre uma fraqueza do Assassino. Conta como um Recurso ilimitado, compartilhado pelo grupo, quando fizer sentido na ação.", k: "fraqueza recurso ilimitado", v: ["Recurso"] },
    { c: "enc", n: "Morte do Assassino", t: "É puramente narrativa e decisão da Diretora. A derrota (mão zerada) pode ser só uma fuga para voltar depois.", k: "matar assassino narrativo", v: ["Derrotar o Assassino"] },
    { c: "enc", n: "Fim do encontro", t: "A cena acaba em 4 situações: o Assassino abandona a cena em seu turno, o Assassino fica sem dados, todos os personagens escapam ou o último personagem morre.", k: "terminar acabar encerrar", v: ["Encontro"] },

    /* ---------- Ameaças ---------- */
    { c: "ame", n: "Assassino", t: "Formado por duas Ameaças. Tem Ações Gerais, Ações Únicas, Poderes Passivos e Poderes Especiais, e é conduzido pela Diretora.", k: "vilao slasher monstro", v: ["Ameaça", "Nível de Brutalidade"] },
    { c: "ame", n: "Ameaça", t: "Descritor, baseado em clichês de Slasher, que define o Assassino narrativa e mecanicamente. Escolha duas; a favorita é a Principal. Cada uma dá Ações Únicas, Poder Passivo, Nível de Brutalidade e Intento Único.", k: "descritor tipo", v: ["Ameaça Principal", "Nível de Brutalidade"] },
    { c: "ame", n: "Ameaça Principal", t: "A Ameaça favorita, que fornece inicialmente o Poder Passivo. Seu NB define os PH iniciais.", k: "principal passivo", v: ["Poder Passivo", "Pontos de Horror"] },
    { c: "ame", n: "Nível de Brutalidade (NB)", t: "Valor da Ameaça. A soma dos NB das duas Ameaças é a pilha inicial da Diretora. Também define sustos e armadilhas grátis. Mantenha NB e Ameaças em segredo.", k: "nb brutalidade pilha inicial", v: ["Etapas de Fuga", "Pontos de Horror"] },
    { c: "ame", n: "Ações Gerais", t: "Ferramentas base de todo Assassino: Assustar, Matar, Ferir, Mutilar, Escapar e Dificultar.", k: "assassino acoes", v: ["Assustar", "Matar", "Ferir", "Mutilar", "Escapar", "Dificultar"] },
    { c: "ame", n: "Ações Únicas", t: "Dão variedade ao Assassino. Escolha 1 da lista de cada Ameaça. Entre sessões, pode trocar uma.", k: "assassino acoes lista", v: ["Mudança de Planos"] },
    { c: "ame", n: "Poder Passivo", t: "Altera como o Assassino funciona mecanicamente. É definido pelas Ameaças. Escolha 1 de uma das Ameaças.", k: "passiva passivo", v: ["Ameaça Principal"] },
    { c: "ame", n: "Pontos de Horror (PH)", t: "Saldo do Assassino para gastar em habilidades e ações. Começa igual ao NB da Ameaça Principal. Ganha mais ao cumprir Intentos Horríveis.", k: "ph horror moeda assassino", v: ["Intentos Horríveis", "Intento Único"] },
    { c: "ame", n: "Intentos Horríveis", t: "Tarefas que dão PH ao Assassino: 5 PH uma Sobrevivente morre em Suspense; 4 PH todas tentam escapar no 1º turno; 2 PH cai em armadilha; 1 PH falha em Teste de Susto, Choque de Realidade, cada Sobrevivente ferida ao sair de um encontro, morte em encontro e beijo entre Sobreviventes.", k: "tabela ph pontos de horror ganhar", v: ["Pontos de Horror (PH)", "Intento Único"] },
    { c: "ame", n: "Intento Único", t: "Maneira, exclusiva de cada Ameaça, de o Assassino ganhar PH, além dos Intentos Horríveis.", k: "ph ameaca", v: ["Intentos Horríveis"] },
    { c: "ame", n: "Amaldiçoado", g: "Ameaça", t: "Passiva: Dados Marcadores, exceto Ferida, começam com +1. Ações: Possuir, Amaldiçoar, Infectar, Acidentar. Intento: 2 PH ao colocar um Dado Marcador numa Sobrevivente.", k: "possuir amaldicoar infectar acidentar dado marcador" },
    { c: "ame", n: "Assombração", g: "Ameaça", t: "Passiva: Sobrevivente que falhar em Teste de Susto carregando um Recurso o torna inutilizável (só uma por susto). Ações: Possuir, Amaldiçoar, Acidentar, Incapacitar. Intento: PH igual ao nº de Sobreviventes que falharem no Teste de Susto.", k: "fantasma possuir amaldicoar acidentar incapacitar" },
    { c: "ame", n: "Brutamontes", g: "Ameaça", t: "Passiva: ao ferir Sobrevivente que já tem Sequela, a Ferida recebe +1. Ações: Segurar, Incapacitar, Destruir. Intento: 2 PH sempre que os Intérpretes falharem em Partir Para Cima.", k: "segurar incapacitar destruir sequela" },
    { c: "ame", n: "Carniceira", g: "Ameaça", t: "Passiva: ao escapar de um Encontro, recebe 1 dado extra por Sobrevivente com ferimento maior que 3. Ações: Devorar, Segurar, Acidentar. Intento: 1 PH sempre que as Sobreviventes usarem Cuidar de Feridas.", k: "carniceiro devorar segurar acidentar" },
    { c: "ame", n: "Desconhecida", g: "Ameaça", t: "Passiva: Partir Para Cima contra você vira Risco Complexo. Ações: Possuir, Infectar, Devorar, Acidentar, Restringir. Intento: 3 PH sempre que uma Sobrevivente prejudicar ativamente outras.", k: "possuir infectar devorar acidentar restringir" },
    { c: "ame", n: "Descontrolada", g: "Ameaça", t: "Passiva: ao ferir cada Sobrevivente pela primeira vez na sessão, +1 no marcador de ferimento. Ações: Segurar, Destruir, Devorar. Intento: 1 PH por Sobrevivente que entrar em encontro com 3 dados ou menos.", k: "descontrolado segurar destruir devorar" },
    { c: "ame", n: "Estratégico", g: "Ameaça", t: "Passiva: +1 Caminho Armadilha grátis e +1 no máximo, em toda Cena de Suspense. Ações: Restringir, Acidentar, Devorar, Infectar, Incapacitar. Intento: 1 PH por armadilha ativada em Suspense.", k: "armadilha restringir acidentar devorar infectar incapacitar" },
    { c: "ame", n: "Inato", g: "Ameaça", t: "Passiva: ao começar Encontro ou Suspense com 3 ou mais PH, recebe 1 dado a mais. Ações: Acidentar, Destruir, Segurar, Amaldiçoar. Intento: 1 PH cada vez que um Intérprete passar de 6 PT.", k: "acidentar destruir segurar amaldicoar" },
    { c: "ame", n: "Máquina", g: "Ameaça", t: "Passiva: testes de Partir Para Cima contra você têm +1 de dificuldade. Ações: Infectar, Destruir, Amaldiçoar, Restringir. Intento: a cada encontro, pode descartar 1 dado para receber 3 PH.", k: "tecnologia infectar destruir amaldicoar restringir" },
    { c: "ame", n: "Mestre (Ameaça)", g: "Ameaça", t: "Passiva: a 2ª Ameaça é a Ameaça da Horda. O Dado da Horda (DH), que sai da pilha da Diretora e só é revelado em encontros, diz quantas Sobreviventes um Ferir afeta (valor dividido como quiser). Com DH 3 ou mais, ganha a passiva da Horda. Ações: Segurar, Infectar, Possuir, Devorar, Incapacitar. Intérpretes podem reduzir o DH com Partir Para Cima. Intento: 1 PH quando um Intérprete obtiver sua 1ª Sequela.", k: "horda dado da horda dh segurar infectar possuir devorar incapacitar culto" },
    { c: "ame", n: "Monstruosidade", g: "Ameaça", t: "Passiva: uma vez por encontro, ao ferir, role 2 dados, some e distribua igualmente entre duas Sobreviventes (ímpar arredonda para baixo). Ações: Incapacitar, Devorar, Destruir. Intento: 2 PH quando uma Sobrevivente morrer.", k: "monstro incapacitar devorar destruir" },
    { c: "ame", n: "Obstinada", g: "Ameaça", t: "Passiva: escolhe uma Sobrevivente como brinquedo especial; cada dado que ela descartar em Teste de Susto é doado a você. Ações: Destruir, Segurar, Devorar, Restringir. Intento: 3 PH sempre que alguém escapar na 1ª rodada de um encontro.", k: "obstinado brinquedo destruir segurar devorar restringir" },
    { c: "ame", n: "Perseguidor", g: "Ameaça", t: "Passiva: Sobrevivente com dado de ferida maior que 3 tem +1 de dificuldade no Vazar Dali. Ações: Devorar, Segurar, Restringir, Acidentar. Intento: 1 PH sempre que alguém falhar todos os dados em um Vazar Dali.", k: "devorar segurar restringir acidentar fuga" },

    /* ---------- Condições ---------- */
    { c: "con", n: "Dado Marcador", t: "Dado entregue pela Diretora a um Intérprete para marcar uma condição (ferida, infecção, possessão etc.). Quanto maior o número, mais grave. Não conta na pilha comum e não pode ser usado em testes.", k: "marcador condicao gravidade", v: ["Ferida", "Infecção", "Possessão", "Restrição"] },
    { c: "con", n: "Ferida", t: "Controlada por um Dado Marcador. Mais de uma Ferida soma os valores, e chegar a 6 é morte. Retirada pela Vantagem Cuidar de Feridas, fora do encontro, nunca abaixo do valor de Sequela.", k: "ferimento morte seis dano", v: ["Sequela", "Cuidar de Feridas", "Ferir"] },
    { c: "con", n: "Sequela", t: "Ferimento mais profundo, que não se cura tão facilmente. Ganha-se ao sofrer Ferir do Assassino (+1 a cada Ferida). Acumula até 5. Você não consegue reduzir a Ferida abaixo do nº de Sequelas.", k: "cicatriz ferimento profundo osso quebrado", v: ["Ferida", "Mutilar", "Isso Vai Deixar Marca"] },
    { c: "con", n: "Infecção", t: "Dado Marcador que começa em 1 e sobe a cada tipo de cena que se passa (em encontro, a cada rodada sem escapar). No 2, incapacita uma especialidade à escolha do Assassino; do 4 em diante, todas; no 6, o Intérprete sacrifica todos os dados comuns no começo de cada cena.", k: "infectar estagio mortal doenca", v: ["Infectar", "Incapacitado"] },
    { c: "con", n: "Reduzir a Infecção", t: "Descartar 1 dado diminui o valor em 1 (não retira a infecção por completo). Ou passar 1 dado a outra Sobrevivente: ele vira marcador de infecção e as duas infecções vão para 1.", k: "diminuir curar infeccao", v: ["Infecção"] },
    { c: "con", n: "Possessão", t: "Dado Marcador que começa em 1 e sobe a cada dado de falha da Sobrevivente ao tentar superar um Risco. No 6, o Assassino o usa para Matar através dela; em encontro, no turno dela, e o Intérprete perde esse turno. O dado é descartado depois.", k: "possuir possuida", v: ["Possuir"] },
    { c: "con", n: "Restrição", t: "Dado Marcador na face 3: todos os testes da Sobrevivente ficam +1 de dificuldade. Para se livrar, teste de Agilidade ou Astúcia: cada sucesso reduz o marcador em 1; abaixo de 1, a restrição some. Se falhar, o marcador sobe 1 e ela recebe Feridas iguais ao valor do dado.", k: "restringir limitacao estorvo", v: ["Restringir"] },
    { c: "con", n: "Incapacitado", t: "Especialidade desmarcada até ser recuperada com Tomar Jeito. A Sobrevivente também fica sem a vantagem associada àquela especialidade.", k: "incapacitar especialidade atributo desmarcada", v: ["Incapacitar", "Tomar Jeito"] },
    { c: "con", n: "Imobilizada", t: "Sobrevivente segurada: não contabiliza Dados de Fuga e recebe +1 na Ferida no começo de cada turno. Aliadas podem fazer testes de Força com Risco Complexo para libertá-la.", k: "segurar presa", v: ["Segurar", "Risco Complexo"] },
    { c: "con", n: "Maldição", t: "Dado Marcador oculto num recurso (Amaldiçoar). Sobe a cada uso do recurso em teste; no 3, a portadora perde todos os PT e não ganha novos até o fim da próxima cena.", k: "amaldicoar recurso oculto", v: ["Amaldiçoar"] },

    /* ---------- Vantagens ---------- */
    { c: "van", n: "Pontos de Tensão (PT)", t: "Moedas gastas para comprar Vantagens. Começa com 0 e acumula até 10. Vêm de desafios combinados com a mesa (boa interpretação, boas estratégias, ações clichê arriscadas), com recompensas definidas pela Diretora, e de Apegos.", k: "pt moeda tensao ganhar", v: ["Vantagens", "Apegos"] },
    { c: "van", n: "Vantagens", t: "Fora de cena de encontro, gaste PT para ações que facilitem a sobrevivência. As ligadas a um atributo só podem ser compradas por quem tem especialidade nele. Em Suspense, compre só depois de escolher um Caminho.", k: "comprar pt custo", v: ["Pontos de Tensão (PT)", "Especialidade"] },
    { c: "van", n: "Cuidar de Feridas", g: "Vantagem · quantos PT quiser", t: "Gaste quantos PT quiser para reduzir em igual valor suas Feridas ou as de um companheiro. Nunca cura abaixo do valor de Sequela. Uma vez a cada encontro.", k: "curar ferida", v: ["Ferida", "Sequela"] },
    { c: "van", n: "Tomar Jeito", g: "Vantagem · 3 PT", t: "Recupera alguma especialidade sua ou de outra Sobrevivente que tenha sido incapacitada.", k: "recuperar especialidade", v: ["Incapacitado"] },
    { c: "van", n: "Choque de Realidade", g: "Vantagem · 6 PT", t: "Compra 1 dado comum a mais para a pilha.", k: "dado extra pilha recuperar", v: ["Pilha de dados", "Recuperar dados"] },
    { c: "van", n: "Adrenalina", g: "Vantagem · Vigor · 2 PT", t: "Reduz automaticamente sua próxima ferida em 1. Uma vez a cada encontro.", k: "vigor ferida reduzir", v: ["Vigor", "Ferida"] },
    { c: "van", n: "Caçar Recursos", g: "Vantagem · Astúcia · 3 PT", t: "Recebe um Recurso que não estava na cena nem com o personagem. No livro, o atributo aparece como Intelecto.", k: "intelecto recurso", v: ["Recurso", "Astúcia"] },
    { c: "van", n: "Preparar Para a Próxima", g: "Vantagem · Agilidade · 3 PT", t: "Garante 1 Dado de Fuga extra no próximo Vazar Dali. Uma vez a cada encontro.", k: "agilidade fuga", v: ["Vazar Dali", "Agilidade"] },
    { c: "van", n: "Ele Não Espera Por Mim", g: "Vantagem · Força · 3 PT", t: "Garante 1 sucesso no próximo Partir Para Cima. Uma vez a cada encontro.", k: "forca sucesso garantido", v: ["Partir Para Cima", "Força"] },
    { c: "van", n: "Ombro Amigo", g: "Vantagem · Carisma · N PT", t: "Gaste uma quantidade de PT para dar a mesma quantia de PT a outra Sobrevivente à sua escolha. Uma vez a cada encontro.", k: "carisma dar pt transferir", v: ["Carisma", "Pontos de Tensão (PT)"] },
    { c: "van", n: "Compra durante o Encontro", t: "É estritamente proibida, a não ser que alguma situação especial diga o contrário.", k: "vantagem proibida encontro excecao", v: ["Encontro", "Vantagens"] },

    /* ---------- Suspense e cenário ---------- */
    { c: "sus", n: "Rodada de Suspense", t: "Cada Intérprete escolhe um Caminho e uma Abordagem; a Diretora resolve cada Caminho em ordem que decide. Se todos os Passos forem realizados, a cena acaba; senão, começa outra rodada.", k: "rodada suspense escolher caminho", v: ["Caminho", "Abordagem"] },
    { c: "sus", n: "Caminho", t: "Ponto de interesse da situação. Pode esconder Passos da Resolução ou Armadilhas. Vários Intérpretes podem seguir o mesmo Caminho. A Diretora pode esconder Caminhos que só aparecem após investigar outro.", k: "ponto de interesse", v: ["Passo", "Armadilha"] },
    { c: "sus", n: "Passo", t: "Etapa necessária para atingir a Resolução da cena. Encontrados todos os Passos, a Cena de Suspense termina.", k: "resolucao etapa", v: ["Resolução", "Limite de Passos (LP)"] },
    { c: "sus", n: "Resolução", t: "O objetivo que as Sobreviventes precisam alcançar na Cena de Suspense (por exemplo, realizar um ritual). A Diretora define quantos Passos são necessários.", k: "objetivo", v: ["Passo"] },
    { c: "sus", n: "Limite de Passos (LP)", t: "LP = 4 − maior NB entre as Ameaças. A Diretora esconde ao menos 1 Passo por rodada e pode gastar 4 PH no começo da cena para adicionar um Passo.", k: "lp passos calculo", v: ["Passo", "Nível de Brutalidade (NB)"] },
    { c: "sus", n: "Abordagem", t: "Três tipos: Direta (suscetível às Armadilhas), Investigativa (teste complexo de Astúcia ou Carisma; em sucesso, descobre um Passo) e Cautelosa (teste para desativar Armadilhas, sem descobrir Passos).", k: "direta investigativa cautelosa", v: ["Armadilha", "Passo"] },
    { c: "sus", n: "Armadilha", t: "Ação do Assassino posta num Caminho. Afeta quem o seguir (só a primeira Sobrevivente, exceto Assustar, que afeta todas) e some. Extra: 1 dado da pilha por armadilha. Em Caminho com Passo, custa o dobro. No máximo 6 por rodada. As não usadas são descartadas.", k: "caminho armadilha dobro seis", v: ["Caminho", "Nível de Brutalidade (NB)"] },
    { c: "sus", n: "Cenário e Ambiente", t: "O Cenário é o local do Thriller. Ambientes são lugares relevantes dentro dele (lago, cabana, caverna). Cada Ambiente pode ter Qualidades.", k: "local lugar", v: ["Qualidade"] },
    { c: "sus", n: "Qualidade", t: "Elemento do Ambiente que muda a narrativa. Favorável (Intérpretes invocam), Neutra (afeta todos; ambos invocam) ou Desfavorável (a Diretora invoca). Temporárias duram a cena.", k: "favoravel neutra desfavoravel temporaria", v: ["Clamor"] },
    { c: "sus", n: "Clamor", t: "Uso de uma Qualidade, obtido no Rito de Iniciação. Gasta-se 1 Clamor para clamar uma Qualidade Favorável ou Neutra. A Diretora pode gastar 2 para aplicar uma Qualidade em todos os cenários.", k: "clamar qualidade rito", v: ["Rito de Iniciação", "Qualidade"] },
    { c: "sus", n: "Rito de Iniciação", t: "No início da sessão: a Diretora rola 1 dado (define Clamores Desfavoráveis, depois ele volta à pilha). Intérpretes oferecem dados: cada um acima de 3 dá 1 Clamor Favorável; todos os dados ofertados são descartados.", k: "oferenda clamores inicio sessao", v: ["Clamor"] },

    /* ---------- Mecânicas especiais ---------- */
    { c: "esp", n: "Arquétipo", t: "Base da Sobrevivente: Atleta, Cética, Esbelto, Herói, Nerd, Inocente, Relaxado ou Valentona. Define Especialidades em 2 atributos e uma lista de Habilidades (escolha 1).", k: "classe habilidade", v: ["Especialidade", "Habilidade e Cicatriz"] },
    { c: "esp", n: "Habilidade e Cicatriz", t: "Sobreviventes de primeira viagem escolhem 1 de 5 habilidades do Arquétipo. Após sobreviver, se a Diretora permitir: mais 1 habilidade, uma de arquétipo morto, ou a Cicatriz de Sobrevivente.", k: "habilidades cicatrizes arquetipo", v: ["Arquétipo"] },
    { c: "esp", n: "Apegos", t: "Um de cada na criação: Item Icônico (trazê-lo em cena dá 1 PT), Relação Afetiva (passar um momento com ela dá 2 PT) e Desejo Obscuro (revelá-lo em cena dá 3 PT).", k: "item iconico relacao afetiva desejo obscuro pt", v: ["Pontos de Tensão (PT)"] },
    { c: "esp", n: "Você Já Sofreu o Suficiente", g: "Poder Especial", t: "Ao matar Sobrevivente com menos de 3 dados, gasta 2 PH para descartar só 1 dado.", k: "matar poder especial" },
    { c: "esp", n: "Eu Vejo Cada Passo Seu", g: "Poder Especial", t: "1×/encontro, 2 PH ao presenciar um fracasso para obrigar a Sobrevivente a sacrificar um dado a você.", k: "sacrificar fracasso" },
    { c: "esp", n: "Banho de Sangue", g: "Poder Especial", t: "Na 1ª morte causada em um encontro, 2 PH por Intérprete na mesa (vivo ou morto) para descartar 1 dado de todas as Sobreviventes vivas.", k: "morte descartar todas" },
    { c: "esp", n: "Corte Profundo", g: "Poder Especial", t: "Ao ferir, 2 PH para somar +1 ao dado marcador de ferida.", k: "ferir ferida" },
    { c: "esp", n: "Jumpscare", g: "Poder Especial", t: "Ao começar um encontro, 2 PH para provocar Teste de Susto em todas as Sobreviventes na cena sem gastar seus Testes de Susto.", k: "susto" },
    { c: "esp", n: "Trauma", g: "Poder Especial", t: "Ao usar Escapar, 3 PH para incapacitar todas as especialidades de uma Sobrevivente ainda ativa.", k: "escapar incapacitar" },
    { c: "esp", n: "Isso Vai Deixar Marca", g: "Poder Especial", t: "1×/encontro, ao ferir, 4 PH para adicionar +1 ponto de Sequela.", k: "sequela ferir", v: ["Sequela"] },
    { c: "esp", n: "Ataque do Coração", g: "Poder Especial", t: "1×/encontro, antes de um Teste de Susto, 3 PH: todas as falhas são sacrificadas a você.", k: "susto sacrificar" },
    { c: "esp", n: "Surpresa!", g: "Poder Especial", t: "No início de um encontro, 6 PH para mover sua iniciativa para o 1º lugar. Não pode usar Matar nesse primeiro turno.", k: "iniciativa primeiro" },
    { c: "esp", n: "Eu Voltarei", g: "Poder Especial", t: "3 PH para usar Escapar fora do seu turno em um encontro, só entre os turnos das Sobreviventes.", k: "escapar fora do turno" },
    { c: "esp", n: "Sua Hora Chegou", g: "Poder Especial", t: "Ao iniciar um encontro, 3 PH para aumentar em 1 algum Dado Marcador da mesa, exceto Ferida.", k: "marcador aumentar" },
    { c: "esp", n: "Não Há Saída", g: "Poder Especial", t: "No fim do turno, 4 PH para transformar um Dado de Fuga de uma Sobrevivente em dado comum. Pode trazer de volta quem escapou, exceto quem usou Arriscar Tudo.", k: "dado de fuga escapou" },
    { c: "esp", n: "Cansei de Brincar", g: "Poder Especial", t: "Ao gastar 1 dado para criar um Caminho Armadilha em Suspense, 5 PH para torná-lo Caminho Mortal, que aniquila quem o seguir.", k: "caminho mortal armadilha" },
    { c: "esp", n: "Mudança de Planos", g: "Poder Especial", t: "Ao terminar um encontro, 5 PH para trocar uma Ação Única por outra da mesma lista de Ameaça.", k: "trocar acao unica" },
    { c: "esp", n: "Fim da Esperança", g: "Poder Especial", t: "Ao iniciar um Suspense, 5 PH para manter um Passo oculto durante a 1ª rodada.", k: "passo oculto" },
    { c: "esp", n: "Caiam na Teia", g: "Poder Especial", t: "1×/sessão, em encontro, 5 PH para ativar uma qualidade negativa no cenário.", k: "qualidade negativa" },
    { c: "esp", n: "Indiferença Perturbadora", g: "Poder Especial", t: "No começo de uma rodada de encontro, 2 PH para ignorar os efeitos de uma qualidade neutra, só para o Assassino, por um turno.", k: "qualidade neutra" },
    { c: "esp", n: "Traidor", g: "Função Oculta", t: "Sobrevivente que sabota o grupo e ajuda o Assassino. Ganha Pontos de Enganação: 1 a cada dado perdido, e o valor do dado marcador ao receber Ferir. Pode mentir sobre não ter especialidades.", k: "funcao oculta enganacao traicao", v: ["Pontos de Enganação", "A Grande Revelação"] },
    { c: "esp", n: "Pontos de Enganação (PE)", g: "Função Oculta", t: "Começam em 0. Adoração custa 3 PE (dar um dado ao Assassino; o dado doado não pode ser usado). Após a revelação, conforme os PE acumulados: Facada pelas costas (4), Vaso ruim não quebra (8) e Somos dois agora (12).", k: "pe traidor adoracao tramoias", v: ["Traidor"] },
    { c: "esp", n: "A Grande Revelação", g: "Função Oculta", t: "O Traidor se revela e ganha habilidades conforme os PE; não ganha mais pontos. Em qualquer cena; em encontro custa uma ação e pode ser usada junto com Partir Para Cima.", k: "traidor revelar", v: ["Traidor"] },
    { c: "esp", n: "Acusação (Era você!)", g: "Função Oculta", t: "Antes da revelação, todas apostam 1 dado e apontam um Intérprete, por maioria. Se acertarem, o Traidor perde metade dos PE e ativa a Grande Revelação; se errarem, todos perdem o dado e o Traidor ganha 5 PE.", k: "traidor votar apostar", v: ["Traidor"] },
    { c: "esp", n: "Possuída", g: "Função Oculta", t: "Sobrevivente alvo de uma possessão que ela não percebe. Nível inicial 1, máximo 3. A Diretora sobe o nível gastando 15 PH. No nível 3, fica completamente sob controle e age como segundo Assassino.", k: "funcao oculta nivel de possessao", v: ["Possessão"] },
    { c: "esp", n: "Vulto Entre Nós", g: "Função Oculta", t: "O Intérprete é o próprio Assassino disfarçado de Sobrevivente. Tem acesso à ficha do Assassino e não gera Intentos Horríveis. A Diretora segue narrando e anotando dados e PH.", k: "funcao oculta vulto assassino disfarcado", v: ["Por trás dos panos", "Tudo arquitetado", "Tirar a Máscara"] },
    { c: "esp", n: "Por trás dos panos", g: "Função Oculta · Vulto", t: "O Vulto pode manipular seus dados marcadores sem ser visto, ignorar armadilhas em Suspense, mentir sobre especializações e tem Choque de Realidade a 5 PT.", k: "vulto manipular", v: ["Vulto Entre Nós"] },
    { c: "esp", n: "Tudo arquitetado", g: "Função Oculta · Vulto", t: "O Vulto pode gastar 2 dados da pilha do Assassino para a Diretora ganhar um Clamor.", k: "vulto clamor", v: ["Vulto Entre Nós", "Clamor"] },
    { c: "esp", n: "Tirar a Máscara", g: "Função Oculta · Vulto", t: "Ao ser revelado, o Vulto vira o Assassino, com controle integral da ficha. Seus dados de Sobrevivente vão para os outros Intérpretes e seus PT viram PH. Pode apontar um apego descoberto: Item Icônico 1 PH, Relação Afetiva 3 PH, Desejo Obscuro 6 PH.", k: "vulto revelar apego", v: ["Vulto Entre Nós", "Apegos"] },
  ];

  /* ---------- Tabelas de consulta rápida ---------- */
  const NUMS = [
    ["Dificuldade padrão", "4 (sucesso com 4, 5 ou 6)"],
    ["Risco Comum / Complexo", "1 sucesso / 2 sucessos"],
    ["Pilha da Sobrevivente", "6 dados (máximo)"],
    ["Pontos de Tensão", "começa em 0, máximo 10"],
    ["Ferida", "somada; 6 = morte"],
    ["Sequelas", "acumulam até 5"],
    ["Especialidade", "dificuldade −1"],
    ["Recurso", "dificuldade −1, 1 a 3 usos"],
    ["Teste de Susto", "1 dado da pilha"],
    ["Sustos por encontro", "7 − NB"],
    ["Limite de Passos", "4 − maior NB"],
    ["Etapas de Fuga (base)", "maior NB + 1"],
    ["PH iniciais", "NB da Ameaça Principal"],
    ["Rito de Iniciação", "sucesso com mais de 3"],
  ];
  const TAB_NB = [
    ["2", "2", "5", "5"], ["3", "3", "4", "4"], ["4", "4", "3", "3"], ["5", "5", "2", "2"], ["6", "6", "1", "1"],
  ];
  const TAB_INT = [
    ["5 PH", "Uma Sobrevivente morre durante uma Cena de Suspense"],
    ["4 PH", "Todas as Sobreviventes tentam escapar no primeiro turno de um encontro"],
    ["2 PH", "A Sobrevivente cai em uma armadilha"],
    ["1 PH", "Pelo menos uma Sobrevivente falha em um Teste de Susto"],
    ["1 PH", "Um Intérprete usa a vantagem Choque de Realidade"],
    ["1 PH", "Cada Sobrevivente que saiu ferida de um encontro"],
    ["1 PH", "Uma Sobrevivente morre durante um encontro"],
    ["1 PH", "Sobreviventes se beijam"],
  ];
  const TAB_VAN = [
    ["Cuidar de Feridas", "quantos PT quiser", "—", "1× por encontro"],
    ["Tomar Jeito", "3 PT", "—", "—"],
    ["Choque de Realidade", "6 PT", "—", "—"],
    ["Adrenalina", "2 PT", "Vigor", "1× por encontro"],
    ["Caçar Recursos", "3 PT", "Astúcia", "—"],
    ["Preparar Para a Próxima", "3 PT", "Agilidade", "1× por encontro"],
    ["Ele Não Espera Por Mim", "3 PT", "Força", "1× por encontro"],
    ["Ombro Amigo", "N PT", "Carisma", "1× por encontro"],
  ];
  const INI = ["Herói", "Atleta", "Valentona", "Esbelto", "Inocente", "Nerd", "Relaxado", "Cética", "Assassino"];

  /* ---------- Utilidades ---------- */
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const catName = Object.fromEntries(CATS);
  T.forEach((e, i) => {
    e.i = i;
    e.nn = norm(e.n);
    e.kk = norm((e.k || "") + " " + (e.g || ""));
    e.tt = norm(e.t);
  });
  const byName = {};
  T.forEach((e) => (byName[e.nn] = e));

  let cat = "all";
  let q = "";

  function run(qq, cc) {
    const toks = norm(qq).split(/\s+/).filter(Boolean);
    let list = T.filter((e) => cc === "all" || e.c === cc);
    if (!toks.length) return list.map((e) => ({ e, s: 0 }));
    const out = [];
    for (const e of list) {
      let s = 0, ok = true;
      for (const t of toks) {
        let p = 0;
        if (e.nn === t) p = 120;
        else if (e.nn.startsWith(t)) p = 100;
        else if (e.nn.includes(" " + t)) p = 80;
        else if (e.nn.includes(t)) p = 60;
        else if (e.kk.includes(t)) p = 40;
        else if (e.tt.includes(t)) p = 15;
        if (!p) { ok = false; break; }
        s += p;
      }
      if (ok) out.push({ e, s });
    }
    out.forEach((r) => (r.s += r.e.p || 0));
    return out.sort((a, b) => b.s - a.s || a.e.i - b.e.i);
  }
  const search = () => run(q, cat);

  const card = (e, showCat) =>
    `<article class="gl-t" id="gl-${e.i}"><div class="gl-th"><h4>${esc(e.n)}</h4>${e.g ? `<span class="gl-tag">${esc(e.g)}</span>` : ""}${showCat ? `<span class="gl-cat">${esc(catName[e.c])}</span>` : ""}</div><p>${esc(e.t)}</p>${
      e.v && e.v.length
        ? `<div class="gl-v"><span>Ver também:</span> ${e.v.map((n) => `<button type="button" class="gl-ref" data-gl="ref" data-n="${esc(n)}">${esc(n)}</button>`).join(" ")}</div>`
        : ""
    }</article>`;

  function renderResults(root) {
    const res = search();
    const box = root.querySelector("#gl-res");
    const cnt = root.querySelector("#gl-cnt");
    cnt.textContent = res.length === 1 ? "1 termo" : res.length + " termos";
    if (!res.length) {
      box.innerHTML = `<p class="gl-none">Nenhum termo encontrado para “${esc(q)}”. Tente outra palavra (por exemplo: dado, ferida, fuga, PT, susto) ou escolha “Todas”.</p>`;
      return;
    }
    if (q.trim()) {
      box.innerHTML = res.map((r) => card(r.e, cat === "all")).join("");
      return;
    }
    let h = "";
    for (const [k, nome] of CATS) {
      const g = res.filter((r) => r.e.c === k).map((r) => r.e).sort((a, b) => 0);
      if (!g.length) continue;
      h += `<section class="gl-sec"><h3 id="gl-s-${k}">${esc(nome)} <small>${g.length}</small></h3>${g.map((e) => card(e, false)).join("")}</section>`;
    }
    box.innerHTML = h;
  }

  function chips(root) {
    root.querySelector("#gl-chips").innerHTML =
      `<button type="button" class="gl-chip${cat === "all" ? " on" : ""}" data-gl="cat" data-k="all" aria-pressed="${cat === "all"}">Todas <small>${T.length}</small></button>` +
      CATS.map(([k, n]) => {
        const c = T.filter((e) => e.c === k).length;
        return `<button type="button" class="gl-chip${cat === k ? " on" : ""}" data-gl="cat" data-k="${k}" aria-pressed="${cat === k}">${esc(n)} <small>${c}</small></button>`;
      }).join("");
  }

  const tb = (h, r) => `<div class="tb-wrap"><table class="tb-g"><tr>${h.map((x) => `<th>${x}</th>`).join("")}</tr>${r.map((l) => `<tr>${l.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</table></div>`;

  function shell() {
    return `<div class="gl">
<h2>Glossário e consulta rápida</h2>
<p class="gl-sub">Termos e regras de BRUTAL RPG em linguagem curta, para consultar durante a partida. Baseado no livro de regras.</p>
<div class="gl-bar"><div class="gl-search"><label for="gl-q" class="gl-lab">Buscar termo ou regra</label><div class="gl-row"><input id="gl-q" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Ex.: ferida, fuga, PT, dado marcador…" value=""><button type="button" class="b o gl-clr" data-gl="clear" hidden>Limpar</button></div></div>
<div id="gl-chips" class="gl-chips" role="group" aria-label="Categorias"></div>
<div id="gl-cnt" class="gl-cnt" aria-live="polite"></div></div>
<div id="gl-res"></div>
<h3 class="gl-h3">Tabelas de consulta rápida</h3>
<details open><summary>Números-chave</summary><div>${tb(["Regra", "Valor"], NUMS)}</div></details>
<details><summary>Ordem de iniciativa</summary><div><ol class="gl-ini">${INI.map((x) => `<li>${x}</li>`).join("")}</ol></div></details>
<details><summary>Vantagens: custos e limites</summary><div>${tb(["Vantagem", "Custo", "Atributo", "Limite"], TAB_VAN)}<p class="gl-note">Compra proibida durante o Encontro, salvo situação especial.</p></div></details>
<details><summary>Nível de Brutalidade: dados, sustos e armadilhas</summary><div>${tb(["NB total (soma)", "Dados iniciais", "Sustos por encontro", "Armadilhas grátis"], TAB_NB)}<p class="gl-note">Etapa de Fuga base = maior NB + 1. PH inicial = NB da Ameaça Principal. O exemplo do livro cita apenas 1 armadilha para NB 5, enquanto a tabela diz 2.</p></div></details>
<details><summary>Intentos Horríveis (PH do Assassino)</summary><div>${tb(["PH", "Intento Horrível"], TAB_INT)}<p class="gl-note">Cada Ameaça ainda tem seu Intento Único.</p></div></details>
</div>`;
  }

  function build() {
    const app = document.getElementById("app");
    if (!app) return;
    const host = app.querySelector("#gl-host");
    if (!host || host.dataset.ready) return;
    host.dataset.ready = "1";
    q = "";
    cat = "all";
    host.innerHTML = shell();
    const root = host.querySelector(".gl");
    const nv = document.getElementById("nav");
    const setTop = () => root.style.setProperty("--gl-top", (nv ? nv.offsetHeight : 48) + "px");
    setTop();
    window.addEventListener("resize", setTop);
    const inp = root.querySelector("#gl-q");
    const clr = root.querySelector(".gl-clr");
    const upd = () => {
      clr.hidden = !q;
      chips(root);
      renderResults(root);
    };
    inp.addEventListener("input", () => { q = inp.value; upd(); });
    inp.addEventListener("keydown", (e) => { if (e.key === "Escape") { q = ""; inp.value = ""; upd(); } });
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-gl]");
      if (!b) return;
      e.stopPropagation();
      const a = b.dataset.gl;
      if (a === "cat") { cat = b.dataset.k; upd(); }
      else if (a === "clear") { q = ""; inp.value = ""; upd(); inp.focus(); }
      else if (a === "ref") {
        const nn = norm(b.dataset.n);
        const t = byName[nn] || T.find((x) => x.nn.startsWith(nn));
        cat = "all";
        q = t ? t.n : b.dataset.n;
        inp.value = q;
        upd();
        root.querySelector(".gl-bar").scrollIntoView({ block: "start" });
      }
    });
    upd();
  }

  document.addEventListener("keydown", (e) => {
    const f = document.getElementById("gl-q");
    if (e.key === "/" && f && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) {
      e.preventDefault();
      f.focus();
    }
  });

  /* Consulta rápida da aba Mesa reaproveita estes dados e cartões. */
  window.GLX = {
    T, NUMS, INI, run, card, tb, esc,
    get: (n) => byName[norm(n)] || T.find((e) => e.nn.includes(norm(n))),
  };

  const app = document.getElementById("app");
  if (app) {
    new MutationObserver(build).observe(app, { childList: true });
    build();
  }
})();
