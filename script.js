/* BRUTAL RPG (site não oficial) - dados do jogo: arquétipos, ameaças, vantagens */
/* ==========================================================================
 * 1. Recursos visuais
 * Lê imagens embutidas no HTML pelo atributo data-asset-key e cria atalhos.
 * ========================================================================== */
const assetStore = document.querySelector("#asset-store").content;
const getAsset = (key) => {
  const element = assetStore.querySelector('[data-asset-key="' + key + '"]');
  if (!element) throw new Error("Imagem não encontrada no HTML: " + key);
  return element.getAttribute("src");
};
const IM = {
  "logo": getAsset("logo"),
  "atleta": getAsset("atleta"),
  "cetica": getAsset("cetica"),
  "esbelto": getAsset("esbelto"),
  "heroi": getAsset("heroi"),
  "nerd": getAsset("nerd"),
  "inocente": getAsset("inocente"),
  "relaxado": getAsset("relaxado"),
  "valentona": getAsset("valentona"),
  s: {
    "loira": getAsset("s.loira"),
    "florida": getAsset("s.florida"),
    "ruiva": getAsset("s.ruiva"),
    "gorro": getAsset("s.gorro"),
    "branco": getAsset("s.branco"),
    "laranja": getAsset("s.laranja"),
    "fone": getAsset("s.fone"),
  },
  v: {
    "flyer": getAsset("v.flyer"),
    "vamp": getAsset("v.vamp"),
    "deer": getAsset("v.deer"),
    "hat": getAsset("v.hat"),
    "blob": getAsset("v.blob"),
    "ghostR": getAsset("v.ghostR"),
    "glasses": getAsset("v.glasses"),
    "swat": getAsset("v.swat"),
    "brut": getAsset("v.brut"),
  },
  plate: { v: getAsset("plate.v") },
  t: {
    "Amaldiçoado": getAsset("t.Amaldiçoado"),
    "Assombração": getAsset("t.Assombração"),
    "Brutamontes": getAsset("t.Brutamontes"),
    "Carniceira": getAsset("t.Carniceira"),
    "Desconhecida": getAsset("t.Desconhecida"),
    "Descontrolada": getAsset("t.Descontrolada"),
    "Estratégico": getAsset("t.Estratégico"),
    "Inato": getAsset("t.Inato"),
    "Máquina": getAsset("t.Máquina"),
    "Mestre": getAsset("t.Mestre"),
    "Monstruosidade": getAsset("t.Monstruosidade"),
    "Obstinada": getAsset("t.Obstinada"),
    "Perseguidor": getAsset("t.Perseguidor"),
  },
};
/* 2. Dados de referência do jogo: atributos, descrições e vantagens.
 * Os valores abaixo alimentam os textos e os cálculos exibidos pelo site. */
const AT = {
  for: "Força",
  agi: "Agilidade",
  ast: "Astúcia",
  vig: "Vigor",
  car: "Carisma",
};
const AD = {
  for: "Potência física",
  agi: "Velocidade, destreza, reflexos",
  ast: "Conhecimento, raciocínio",
  vig: "Resiliência física",
  car: "Habilidade interpessoal",
};
const SV = {
  for: [
    "Ele Não Espera Por Mim",
    3,
    "Garante um sucesso no próximo teste de Partir para Cima. 1×/encontro.",
  ],
  agi: [
    "Preparar Para a Próxima",
    3,
    "Dado de Fuga extra no próximo Vazar Dali. 1×/encontro.",
  ],
  ast: ["Caçar Recursos", 3, "Recebe um Recurso que não estava na cena."],
  vig: ["Adrenalina", 2, "Reduz sua próxima ferida em 1. 1×/encontro."],
  car: [
    "Ombro Amigo",
    1,
    "Gaste N PT para dar N PT a outra sobrevivente (1×/encontro). Custo = quanto quiser transferir.",
  ],
};
const AR = {
  atleta: [
    "Atleta",
    "#4a4ac0",
    ["agi", "for"],
    "Capitão do time, ginasta, bailarino… acostumado a explorar os limites do corpo.",
    [
      "Home Run!|1×/encontro compra uma vantagem com PT.",
      "Eu Aguento!|1×/encontro substitui o valor de uma rolagem pelo do Dado Marcador.",
      "Não Foi Nada!|1×/cena ignora uma qualidade desfavorável do ambiente.",
      "Você Consegue!|Ao escapar, outro sobrevivente ganha um dado de fuga.",
      "Sempre Me Superando|1×/encontro recusa aumentar a Sequela ao ser ferido.",
      "★ Hora de Revanche!|1×/encontro gasta um dado para fazer 2 ações no turno.",
    ],
  ],
  cetica: [
    "Cética",
    "#555",
    ["ast", "vig"],
    "Acha que você vê filmes de terror demais. Duvida do perigo até o último segundo.",
    [
      "Impossível!|Pode re-rolar todo teste de susto uma vez.",
      "Deve Ter Uma Explicação!|Fora de encontro, descobre quantos dados o assassino tem. 1×/sessão.",
      "Talvez Eu Estivesse Errado…|Tirou 6 em susto: no início do encontro vira um dado em dado de fuga.",
      "Só Pode Ser Isso!|1×/encontro, após cair em caminho armadilha, sabe quantos restam.",
      "Não É Tão Ruim!|As 3 primeiras falhas em Ritual viram qualidades neutras.",
      "★ Faz Direito!|1×/encontro cede sua ação a um aliado; ambos ganham um dado.",
    ],
  ],
  esbelto: [
    "Esbelto",
    "#c0308a",
    ["car", "vig"],
    "Extremamente atraente. Um colírio para a audiência aterrorizada.",
    [
      "Não Perco a Pose!|1×/encontro re-rola os dados ao vazar dali.",
      "Eu Sou o Melhor!|Ganha 1 PT ao tirar 6 nos dados.",
      "Tira Ele de Mim!|1×/encontro, ao receber Ajudar Alguém, ganha +1 dado do descarte.",
      "Olhos em Mim!|1×/sessão força o Assassino a focar em você no próximo turno.",
      "Nasci Virada Para a Lua!|Dado extra no Rito de Iniciação sem sacrificar um seu.",
      "★ Sei Que Sou Demais!|1×/encontro gasta 4 PT para dar +2 PT a todos os outros.",
    ],
  ],
  heroi: [
    "Herói",
    "#a08a20",
    ["ast", "for"],
    "Corajoso e conveniente, está lá para salvar a todos.",
    [
      "Até o Fim!|Ao Arriscar Tudo por si, mantém 1 dado.",
      "Vai na Fé!|1×/sessão, ao Ajudar Alguém, os dados doados viram dados de fuga.",
      "Tudo Por Você!|Ao Arriscar Tudo para salvar outro, descarta só metade dos dados.",
      "Segue o Pai!|Aliados no mesmo caminho em Suspense: riscos com −1 de dificuldade.",
      "Eu Te Protejo!|Cancela qualidade desfavorável de um aliado (seus testes ficam complexos).",
      "★ Já Se Esqueceu de Mim?|Continua na iniciativa após escapar e pode entregar dados de fuga.",
    ],
  ],
  nerd: [
    "Nerd",
    "#7b3c96",
    ["ast", "agi"],
    "Cabeça enfiada nos livros. Seu futuro é brilhante, se sobreviver.",
    [
      "Deixa Comigo!|1×/encontro reduz em 1 o custo de uma vantagem de alguém.",
      "Eu Tenho Uma Teoria!|1×/sessão força a Diretora a anunciar a próxima ação do Assassino.",
      "Prevejo Tramoias!|1×/Suspense, ao Observar, descobre o resultado de um caminho sem ativar armadilhas.",
      "Eu Sei Um Atalho!|1×/sessão descobre quantos dados de fuga são necessários.",
      "Você Não Vai Querer Saber!|1×/sessão realiza uma Oferenda com estudos ocultos.",
      "★ Eu Sei o Seu Poder de Luta!|Gasta um turno para descobrir os dados do assassino. 1×/sessão.",
    ],
  ],
  inocente: [
    "Inocente",
    "#2a9a9a",
    ["ast", "car"],
    "Não fez nada de errado. É boa pessoa e você não quer que se dê mal.",
    [
      "Me Ajudem!|1×/sessão, quem usar Ajudar Alguém em você não perde os dados doados.",
      "Eu Não Quero Morrer!|Último no encontro: pode Arriscar Tudo e manter seus dados.",
      "Não Mereço Isso!|1×/sessão ignora uma habilidade especial de assassino.",
      "Se Fosse Uma Cobra!|Primeiro a ativar armadilhas, mas a primeira não tem efeito.",
      "Foi Sorte de Principiante!|Em Ritual, re-rola oferendas falhas até 2×.",
      "★ Pureza de Espírito|1×/sessão troca um dado marcador pelo valor dele em dados.",
    ],
  ],
  relaxado: [
    "Relaxado",
    "#2faa4e",
    ["car", "agi"],
    "Está com a cabeça em outro lugar. Talvez fosse bom estar sóbrio contra um maluco.",
    [
      "Uh? Quê?|1×/encontro ignora um Teste de Susto.",
      "Olé!|1×/encontro, ao ser ferido, re-rola o dado marcador e mantém o novo.",
      "Posso Até Tentar!|1×/encontro compra vantagem de especialidade que não tem (exige teste).",
      "Uni-Duni-Tê!|1º turno de Suspense: escolhe 2 caminhos e é afetado por ambos.",
      "Minha Nossa!|1×/sessão força susto em si e ativa qualidade favorável.",
      "★ Já Estou Acostumado!|Choque de Realidade custa 5 PT permanentemente.",
    ],
  ],
  valentona: [
    "Valentona",
    "#c0304a",
    ["for", "vig"],
    "Parece um babaca, exceto quando há um assassino à solta.",
    [
      "Daqui Ninguém Me Tira!|1×/sessão se recusa a sacrificar/descartar dados numa rolagem.",
      "Eu Não Tenho Medo de Você!|1×/encontro descarta dado de fuga para remover dado do assassino.",
      "Me Passa o Que É Seu!|1×/encontro usa a ação para roubar um dado de fuga.",
      "O Que Não Me Mata…|Ao ser afetada por caminho armadilha, recebe 2 PT.",
      "Nem Fodendo!|1×/sessão impede uma qualidade negativa do cenário.",
      "★ Você Vai Sentir Essa Amanhã!|Partir para Cima complexo: remove mais de um dado do assassino.",
    ],
  ],
};
/* Dados das Ameaças: efeitos, ações únicas, brutalidade e intento. */
const TH0 = {
  Amaldiçoado: [
    "Dados marcadores (exceto ferida) começam com +1.",
    "Possuir, Amaldiçoar, Infectar, Acidentar",
  ],
  Assombração: [
    "Susto falho carregando RECURSO o torna inutilizável.",
    "Possuir, Amaldiçoar, Acidentar, Incapacitar",
  ],
  Brutamontes: [
    "Ferir sobrevivente com Sequela: ferida +1.",
    "Segurar, Incapacitar, Destruir",
  ],
  Carniceira: [
    "Ao escapar, +1 dado por sobrevivente com ferida >3.",
    "Devorar, Segurar, Acidentar",
  ],
  Desconhecida: [
    "Partir Para Cima contra você é Risco Complexo.",
    "Possuir, Infectar, Devorar, Acidentar, Restringir",
  ],
  Descontrolada: [
    "1ª ferida em cada sobrevivente na sessão: +1.",
    "Segurar, Destruir, Devorar",
  ],
  Estratégico: [
    "+1 caminho armadilha grátis e máximo em Suspense.",
    "Restringir, Acidentar, Devorar, Infectar, Incapacitar",
  ],
  Inato: [
    "Com 3+ PH ao iniciar cena, +1 dado.",
    "Acidentar, Destruir, Segurar, Amaldiçoar",
  ],
  Máquina: [
    "Partir Para Cima contra você: +1 de dificuldade.",
    "Infectar, Destruir, Amaldiçoar, Restringir",
  ],
  Mestre: ["Sua 2ª ameaça é a Horda; role o Dado da Horda (DH).", "—"],
  Monstruosidade: [
    "1×/encontro, ao ferir, 2 dados somados divididos entre duas sobreviventes.",
    "Incapacitar, Devorar, Destruir",
  ],
  Obstinada: [
    "Escolhe um “brinquedo especial”: dados de susto dela vão para você.",
    "—",
  ],
  Perseguidor: [
    "Ferida >3: Vazar Dali com +1 de dificuldade.",
    "Devorar, Segurar, Restringir, Acidentar",
  ],
};
const INT = [
  [5, "Sobrevivente morre em Cena de Suspense"],
  [4, "Todas tentam escapar no 1º turno do encontro"],
  [2, "Sobrevivente cai em armadilha"],
  [1, "Falha em Teste de Susto"],
  [1, "Alguém usa Choque de Realidade"],
  [1, "Cada sobrevivente que saiu ferida do encontro"],
  [1, "Sobrevivente morre em encontro"],
  [1, "Sobreviventes se beijam"],
  [1, "Susto opcional (suspiro/nojo na mesa)"],
];
const CUST = [
  [
    "Acidentar",
    4,
    "Após susto fora de encontro, usa Ferir em quem falhou.",
  ],
  ["Amaldiçoar", 3, "Maldição oculta em recurso recém-encontrado."],
  ["Destruir", 4, "Destrói recurso ou qualidade favorável."],
  ["Incapacitar", 4, "Ao ferir, incapacita uma especialidade."],
  ["Infectar", 4, "Entrega um dado como marcador de infecção."],
  ["Segurar", 5, "Ao ferir, imobiliza a sobrevivente."],
  ["Dificultar", 4, "+1 Etapa de Fuga (por dado)."],
  [
    "Já Sofreu o Suficiente",
    2,
    "Mata com <3 dados descartando só 1 dado.",
  ],
  [
    "Eu Vejo Cada Passo Seu",
    2,
    "Força sacrifício de um dado ao ver fracasso.",
  ],
  [
    "Banho de Sangue",
    2,
    "(×Intérprete) 1ª morte: descarta 1 dado de todas.",
  ],
  ["Corte Profundo", 2, "Ferida +1."],
  ["Jumpscare", 2, "Susto em todas ao início do encontro."],
  ["Trauma", 3, "Ao Escapar, incapacita todas as especialidades de uma."],
  ["Isso Vai Deixar Marca", 4, "+1 Sequela ao ferir."],
  ["Ataque do Coração", 3, "Falhas do susto são sacrificadas a você."],
  ["Surpresa!", 6, "Iniciativa em 1º (sem Matar no 1º turno)."],
  ["Eu Voltarei", 3, "Escapar fora do seu turno."],
  ["Sua Hora Chegou", 3, "+1 em Dado Marcador (exceto Ferir)."],
  ["Não Há Saída", 4, "Dado de fuga vira dado comum."],
  ["Cansei de Brincar", 5, "Caminho Armadilha vira Mortal."],
  ["Mudança de Planos", 5, "Troca uma ação única."],
  ["Fim da Esperança", 5, "Mantém passo da resolução oculto."],
];

const TH = TH0;
/* Nível de Brutalidade de cada Ameaça (conforme os cards do livro) */
const TN = {
  Amaldiçoado: 2,
  Assombração: 2,
  Brutamontes: 3,
  Carniceira: 3,
  Desconhecida: 1,
  Descontrolada: 3,
  Estratégico: 1,
  Inato: 2,
  Máquina: 2,
  Mestre: 1,
  Monstruosidade: 3,
  Obstinada: 2,
  Perseguidor: 2,
};
/* Intento Único: [PH, texto] */
const TI = {
  Amaldiçoado: [2, "Ao colocar um Dado Marcador em uma Sobrevivente."],
  Assombração: [1, "Por Sobrevivente que falhar em um Teste de Susto."],
  Brutamontes: [
    2,
    "Toda vez que os Intérpretes falharem em Partir para Cima.",
  ],
  Carniceira: [1, "Toda vez que usarem Cuidar de Feridas."],
  Desconhecida: [
    3,
    "Quando uma Sobrevivente prejudicar ativamente outras.",
  ],
  Descontrolada: [
    1,
    "Por Sobrevivente que entrar no encontro com 3 dados ou menos.",
  ],
  Estratégico: [1, "Por armadilha ativada em Cena de Suspense."],
  Inato: [1, "Toda vez que um Intérprete passar de 6 PT."],
  Máquina: [3, "1×/encontro: descarte um dado seu."],
  Mestre: [1, "Quando um Intérprete obtiver sua primeira Sequela."],
  Monstruosidade: [2, "Quando uma Sobrevivente morrer."],
  Obstinada: [3, "Quando alguém escapar na primeira rodada."],
  Perseguidor: [
    1,
    "Quando alguém falhar em todos os dados de um Vazar Dali.",
  ],
};
const AU = [
  [
    "Acidentar",
    "Ao usar Assustar fora de encontro, gasta 4 PH para usar Ferir em quem falhou no susto.",
  ],
  [
    "Amaldiçoar",
    "3 PH: coloca uma maldição oculta (dado marcador começando em 1) em um recurso recém-encontrado; sobe a cada uso e, no 3, a Sobrevivente perde todos os PT e não ganha novos até o fim da próxima cena.",
  ],
  [
    "Destruir",
    "Em encontro, ao Ferir, 4 PH: destrói um recurso ou qualidade favorável. Em Suspense, sem custo e sem Ferir.",
  ],
  [
    "Devorar",
    "Quando alguém anuncia um 6, você ganha 1 PH (ela mantém o sucesso).",
  ],
  [
    "Incapacitar",
    "Em encontro, ao ferir, 4 PH: incapacita uma especialidade da Sobrevivente até Tomar Jeito. Em Suspense, sem custo.",
  ],
  [
    "Infectar",
    "4 PH + 1 dado seu como marcador (começa em 1; sobe a cada tipo de cena). Valor 2 incapacita uma especialidade, 4 todas, 6 faz sacrificar todos os dados no início de cada cena.",
  ],
  [
    "Possuir",
    "Entrega 1 dado como marcador (começa em 1; sobe a cada dado de falha). No 6, você usa o dado para Matar através dela.",
  ],
  [
    "Segurar",
    "Ao ferir sem matar, 5 PH: prende a Sobrevivente (não conta dados de fuga e sofre +1 de Ferida a cada turno). Aliados tentam soltar com Força complexo.",
  ],
  [
    "Restringir",
    "Dado marcador no 3 numa Sobrevivente: seus testes ficam +1 de dificuldade. Ela tenta se livrar com Agilidade ou Astúcia; se falhar, sobe o dado e ela sofre Feridas.",
  ],
];
const AUD = Object.fromEntries(AU);
const AUC = {
  Acidentar: 4,
  Amaldiçoar: 3,
  Destruir: 4,
  Incapacitar: 4,
  Infectar: 4,
  Segurar: 5,
};

/* BRUTAL RPG (site não oficial) - rolador de dados animado (Sobrevivente e Mestre) */
/* 3. Estado temporário dos roladores de dados do Sobrevivente e do Mestre. */
const R = {
  S: {
    n: 2,
    tipo: "teste",
    atr: "for",
    risco: "1",
    rec: "0",
    mod: 0,
    res: null,
  },
  D: { n: 1, tipo: "ferir", lim: 4, res: null },
};
const rnd = () => 1 + Math.floor(Math.random() * 6);
const PIPS = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};
const ROT = {
  1: [0, 0],
  2: [-90, 0],
  3: [0, -90],
  4: [0, 90],
  5: [90, 0],
  6: [0, 180],
};
const face = (n) =>
  `<div class="f f${n}">${Array.from({ length: 9 }, (_, i) => `<i class="${PIPS[n].includes(i) ? "p" : ""}"></i>`).join("")}</div>`;
const die = (v, cls, anim, lab, extra) =>
  `<div class="d3 ${cls} ${anim ? "rolling" : ""}" data-v="${v}" ${anim ? 'data-anim="1"' : ""} ${extra || ""}><div class="cube" style="transform:rotateX(${ROT[v][0]}deg) rotateY(${ROT[v][1]}deg)">${[1, 2, 3, 4, 5, 6].map(face).join("")}</div>${lab ? `<small>${lab}</small>` : ""}</div>`;
const ctr = (o, f, v, mn, mx) =>
  `<div class="cnt"><button class="b o${v <= mn ? " lim" : ""}" aria-label="Diminuir" data-a="rn" data-o="${o}" data-f="${f}" data-d="-1" data-mn="${mn}" data-mx="${mx}">−</button><span class="cv"><b>${v}</b></span><button class="b${v >= mx ? " lim" : ""}" aria-label="Aumentar" data-a="rn" data-o="${o}" data-f="${f}" data-d="1" data-mn="${mn}" data-mx="${mx}">+</button></div>`;
const sel = (o, f, v, arr) =>
  `<select data-a="rcfg" data-o="${o}" data-f="${f}">${arr.map(([k, n]) => `<option value="${k}" ${String(v) == String(k) ? "selected" : ""}>${n}</option>`).join("")}</select>`;
/* anima os dados recém-rolados */
/* Animação visual dos dados recém-rolados; respeita a preferência por menos movimento. */
function animateDice() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".d3[data-anim]").forEach((d, i) => {
    const c = d.querySelector(".cube"),
      v = +d.dataset.v,
      [ax, ay] = ROT[v];
    d.removeAttribute("data-anim");
    const fin = () => {
      d.classList.remove("rolling");
    };
    if (reduce) {
      fin();
      return;
    }
    c.style.transition = "none";
    c.style.transform = `rotateX(${ax - 360 * (2 + (i % 2)) - Math.floor(Math.random() * 90)}deg) rotateY(${ay - 360 * (2 + ((i + 1) % 2)) - Math.floor(Math.random() * 90)}deg)`;
    void c.offsetWidth;
    d.style.animationDelay = i * 70 + "ms";
    d.classList.add("hop");
    c.style.transition = `transform ${1.0 + Math.random() * 0.5}s cubic-bezier(.15,.75,.25,1) ${i * 70}ms`;
    c.style.transform = `rotateX(${ax}deg) rotateY(${ay}deg)`;
    setTimeout(fin, 1700 + i * 70);
  });
}
/* 4. Rolagens do Sobrevivente: configurações, cálculo e exibição do resultado. */
/* ---------- SOBREVIVENTE ---------- */
function sCfg() {
  const o = R.S,
    tipo = o.tipo,
    atr = tipo == "vazar" ? "agi" : o.atr,
    info = [];
  let dif = 4;
  if (tipo != "susto") {
    if (esp().includes(atr)) {
      if (S.inc.includes(atr))
        info.push("⚠ incapacitada em " + AT[atr] + ": sem bônus de especialidade");
      else {
        dif--;
        info.push("✔ especialidade em " + AT[atr] + " (automático) −1");
      }
    } else info.push("sem especialidade em " + AT[atr]);
  }
  if (o.rec == "1" && tipo != "susto") {
    dif--;
    info.push("recurso −1");
  }
  if (S.marc.some((m) => m.t == "res")) {
    dif++;
    info.push("Restrição +1");
  }
  if (o.mod) {
    dif += o.mod;
    info.push("ajuste " + (o.mod > 0 ? "+" : "") + o.mod);
  }
  let need = 1;
  if (tipo == "teste" && o.risco == "2") need = 2;
  return { dif: cl(dif, 2, 6), need, info, atr };
}
function rollS() {
  const o = R.S,
    c = sCfg(),
    max = Math.max(1, S.dados);
  o.n = cl(o.n, 1, max);
  const ar = S.arq;
  return `<div class="g" style="grid-template-columns:1fr"><div class="card act" style="--c:${ar ? AR[ar][1] : "var(--r)"}"><h3>Rolar dados</h3>
<div class="row" style="align-items:flex-end;gap:14px"><div><div class="lab">Dados que quer arriscar (pilha: ${S.dados})</div>${ctr("S", "n", o.n, 1, max)}</div>
<div style="flex:1;min-width:170px"><div class="lab">Tipo de teste</div>${sel(
    "S",
    "tipo",
    o.tipo,
    [
      ["teste", "Teste de risco"],
      ["vazar", "Vazar Dali (dados de fuga)"],
      ["susto", "Teste de Susto"],
    ],
  )}</div>
${o.tipo == "teste"
      ? `<div style="flex:1;min-width:140px"><div class="lab">Atributo</div>${sel(
        "S",
        "atr",
        o.atr,
        Object.entries(AT).map(([k, n]) => [
          k,
          n + (esp().includes(k) ? (S.inc.includes(k) ? " ✖ incapacitada" : " ★ especialidade") : ""),
        ]),
      )}</div><div style="flex:1;min-width:140px"><div class="lab">Risco</div>${sel(
        "S",
        "risco",
        o.risco,
        [
          ["1", "Comum (1 sucesso)"],
          ["2", "Complexo (2 sucessos)"],
        ],
      )}</div>`
      : ""
}
${o.tipo != "susto"
      ? `<div style="flex:1;min-width:150px"><div class="lab">Recurso</div>${sel(
        "S",
        "rec",
        o.rec,
        [
          ["0", "Nenhum"],
          ["1", "Usando recurso (−1 dificuldade)"],
        ],
      )}</div>`
      : ""
}
<div><div class="lab">Ajuste de dificuldade</div>${ctr("S", "mod", o.mod, -2, 3)}</div></div>
${o.tipo != "susto" && esp().includes(c.atr) && S.inc.includes(c.atr) ? `<p style="margin:10px 0;padding:8px 10px;border:1px solid var(--r);border-left:4px solid var(--r);border-radius:4px;color:var(--r)"><b>⚠ Você está incapacitada de ${AT[c.atr]}.</b> <span style="color:var(--t)">A especialidade não conta (sem −1 de dificuldade) até você recuperá-la com Tomar Jeito.</span></p>` : ""}${!S.arq && o.tipo != "susto" ? "<p><small>Escolha o arquétipo na ficha para a especialidade ser contada automaticamente.</small></p>" : ""}<p style="margin:10px 0"><b>Sucesso em ${c.dif}+</b> · precisa de <b>${c.need}</b> sucesso${c.need > 1 ? "s" : ""}${o.tipo == "vazar" ? " · cada sucesso vira dado de fuga; 6 vale 2" : ""}<br><small>${c.info.join(" · ") || "dificuldade padrão 4"}</small></p>
<button class="b" data-a="rollS" ${S.dados < 1 ? "disabled" : ""}>🎲 Rolar ${o.n} dado${o.n > 1 ? "s" : ""}</button>${S.dados < 1 ? " <small>Sem dados na pilha.</small>" : ""}
${sResUI()}</div></div>`;
}
function sResUI() {
  const r = R.S.res;
  if (!r) return "";
  const ok = r.vals.map((v) => v >= r.dif),
    s = ok.filter(Boolean).length,
    f = r.vals.length - s,
    six = r.vals.filter((v) => v == 6).length,
    vz = r.tipo == "vazar",
    fuga = s + six,
    win = s >= r.need;
  const h = (i, k) => hasHab(S.arq, i) && S.arq == k,
    A = S.arq;
  const tray = r.vals
    .map((v, i) =>
      die(
        v,
        ok[i] ? "ok" : "no",
        r.fresh,
        ok[i] ? "sucesso" : "falha",
        `data-i="${i}" ${r.eag ? 'data-a="dieset"' : ""}`,
      ),
    )
    .join("");
  let b = "",
    n = "";
  if (!r.applied) {
    if (vz)
      b += `<button class="b" data-a="rapply">Aplicar: pilha −${r.vals.length}, fuga +${fuga}</button>`;
    else if (r.tipo == "susto") {
      if (f)
        n += `<p><b>Retire você mesma ${f} dado${f > 1 ? "s" : ""} da sua pilha</b> <small>(use o − em “Pilha de dados”).</small></p>`;
    } else {
      b += `<button class="b" data-a="rapply" ${f ? "" : "disabled"}>Aplicar falhas: pilha −${f}</button>`;
      if (f && S.dados - f <= 0)
        n += `<p style="color:var(--r)"><b>Desastre!</b> Se perder esses dados a pilha zera e você não faz mais testes na cena.</p>`;
    }
    if (r.tipo == "susto" && h(0, "relaxado") && A == "relaxado")
      b += ` <button class="b o" data-a="rskip">Uh? Quê? — ignorar este susto</button>`;
    if (!vz && f && h(0, "valentona") && A == "valentona")
      b += ` <button class="b o" data-a="rskip">Daqui Ninguém Me Tira! — não perder dados</button>`;
  }
  if (!r.rr) {
    if (r.tipo == "susto" && h(0, "cetica") && A == "cetica")
      b += ` <button class="b o" data-a="rreroll">Impossível! — re-rolar o susto</button>`;
    if (vz && h(0, "esbelto") && A == "esbelto")
      b += ` <button class="b o" data-a="rreroll">Não Perco a Pose! — re-rolar</button>`;
  }
  if (!r.eagU && h(1, "atleta") && A == "atleta")
    b += ` <button class="b o" data-a="reag" ${S.fer < 1 ? "disabled" : ""}>${r.eag ? "Toque no dado a trocar…" : "Eu Aguento! — trocar um dado pelo da Ferida (" + S.fer + ")"}</button>`;
  if (six && h(1, "esbelto") && A == "esbelto" && !r.pt)
    b += ` <button class="b o" data-a="rpt">Eu Sou o Melhor! +1 PT</button>`;
  if (r.tipo == "susto" && six && h(2, "cetica") && A == "cetica")
    n += `<p><small>Talvez Eu Estivesse Errado…: tirou 6 no susto, no início do encontro um dado vira dado de fuga.</small></p>`;
  if (r.msg) n += `<p><small>${r.msg}</small></p>`;
  return `<div class="tray">${tray}</div><div class="sum ${r.fresh ? "late" : ""}"><div class="verd ${win ? "w" : "l"}">${vz ? `${fuga} dado${fuga != 1 ? "s" : ""} de fuga` : win ? "Risco superado!" : "Risco NÃO superado"}</div><div>${s} sucesso${s != 1 ? "s" : ""} · ${f} falha${f != 1 ? "s" : ""} <small>(sucesso em ${r.dif}+${vz && six ? "; " + six + " × 6 = fuga vantajosa" : ""})</small></div><div class="row" style="margin-top:8px">${b}</div>${n}</div>`;
}
/* 5. Rolagens do Mestre: ferir, testes livres e resultados especiais. */
/* ---------- MESTRE ---------- */
const FN = {
  Brutamontes:
    "Brutamontes: se a sobrevivente já tem Sequela, a Ferida sobe +1.",
  Descontrolada:
    "Descontrolada: a 1ª ferida de cada sobrevivente na sessão vale +1.",
  Monstruosidade:
    "Monstruosidade: 1×/encontro, ao ferir, role 2 dados somados e divida entre duas sobreviventes.",
};
function rollD() {
  const o = R.D,
    horda = D.a1 == "Mestre" || D.a2 == "Mestre",
    tipos = [
      ["ferir", "Ferir (1 dado da Diretora)"],
      ["livre", "Dados da Diretora (livre)"],
    ];
  if (horda) tipos.push(["horda", "Dado da Horda (DH)"]);
  if (!tipos.some((t) => t[0] == o.tipo)) o.tipo = "ferir";
  o.n = cl(o.n, 1, Infinity);
  return `<div class="g" style="grid-template-columns:1fr"><div class="card act" style="--c:#8a1fb0"><h3>Rolar dados</h3>
<div class="row" style="align-items:flex-end;gap:14px"><div style="flex:1;min-width:200px"><div class="lab">O que rolar</div>${sel("D", "tipo", o.tipo, tipos)}</div>
${o.tipo == "livre" ? `<div><div class="lab">Quantos dados</div>${ctr("D", "n", o.n, 1, Infinity)}</div><div><div class="lab">Sucesso em</div>${ctr("D", "lim", o.lim, 2, 6)}</div>` : ""}</div>
<p style="margin:10px 0"><small>${o.tipo == "ferir" ? "6 = a sobrevivente morre (ou Mutilar). Menos de 6 = Sequela e ela fica com o dado como marcador." : o.tipo == "horda" ? "Dado da Horda do Mestre: role e aplique o resultado da sua Horda." : "Rola a quantidade escolhida e conta os sucessos."}</small></p>
<button class="b" data-a="rollD">🎲 Rolar</button>${dResUI()}</div></div>`;
}
function dResUI() {
  const r = R.D.res;
  if (!r) return "";
  let tray = "",
    b = "",
    n = "",
    head = "",
    sub = "";
  const T = (v, c, l, i) => die(v, c, r.fresh, l, `data-i="${i}"`);
  if (r.tipo == "ferir") {
    const v = r.vals[0];
    tray = T(v, v == 6 ? "ok" : "no", v == 6 ? "6!" : "", 0);
    head = v == 6 ? "A sobrevivente MORRE" : "Sequela!";
    sub =
      v == 6
        ? "Você perde o dado. Ou use Mutilar: descarte o dado, +4 PH e 3 Sequelas."
        : `A sobrevivente fica com o dado (valor ${v}) como Dado Marcador de Ferida.`;
    if (!r.applied) {
      /* o Mestre escolhe, entre os sobreviventes cadastrados, quem sofre o efeito */
      const tem = D.sob.length > 0,
        ok = !tem || r.alvo !== undefined && r.alvo !== "",
        off = ok ? "" : "disabled";
      if (tem)
        b += `<div class="lab">Quem toma o dado?</div><select data-a="ftarget" style="max-width:100%"><option value="">Escolha o sobrevivente…</option>${D.sob.map((x, i) => `<option value="${escH(x.id)}" ${r.alvo == x.id ? "selected" : ""} ${x.fer >= 6 ? "disabled" : ""}>${escH(String(x.n || "").trim() || "Sobrevivente " + (i + 1))} · Ferida ${x.fer}/6 · Seq. ${x.seq}${x.fer >= 6 ? " (morto)" : ""}</option>`).join("")}<option value="-" ${r.alvo == "-" ? "selected" : ""}>Sem alvo registrado</option></select><p></p>`;
      else
        b += `<p><small>Cadastre sobreviventes em “Sobreviventes da sessão” para escolher quem toma o dado.</small></p>`;
      b +=
        v == 6
          ? `<button class="b" data-a="dap" data-k="kill" ${off}>Matar: descartar dado (−1)</button> <button class="b o" data-a="dap" data-k="mut" ${off}>Mutilar: +4 PH, 3 Sequelas</button>`
          : `<button class="b" data-a="dap" data-k="seq" ${off}>Entregar o dado (−1 dado, +1 Sequela)</button>`;
    }
    [D.a1, D.a2].forEach((t) => {
      if (FN[t]) n += `<p><small>${FN[t]}</small></p>`;
    });
    if (D.pe == "Corte Profundo")
      n += `<p><small>Corte Profundo: gaste 2 PH para +1 no valor do dado marcador.</small></p>`;
    if (D.pe == "Isso Vai Deixar Marca")
      n += `<p><small>Isso Vai Deixar Marca: 1×/encontro, gaste 4 PH para +1 ponto de Sequela.</small></p>`;
  } else if (r.tipo == "livre") {
    const s = r.vals.filter((v) => v >= r.lim).length;
    tray = r.vals
      .map((v, i) =>
        T(
          v,
          v >= r.lim ? "ok" : "no",
          v >= r.lim ? "sucesso" : "falha",
          i,
        ),
      )
      .join("");
    head = `${s} sucesso${s != 1 ? "s" : ""}`;
    sub = `${r.vals.length - s} falha${r.vals.length - s != 1 ? "s" : ""} (sucesso em ${r.lim}+)`;
  } else {
    tray = T(r.vals[0], "ok", "DH", 0);
    head = "Dado da Horda: " + r.vals[0];
    sub = "Aplique o resultado conforme a sua Horda.";
  }
  return `<div class="tray">${tray}</div><div class="sum ${r.fresh ? "late" : ""}"><div class="verd ${r.tipo == "ferir" && r.vals[0] == 6 ? "l" : "w"}">${head}</div><div><small>${sub}</small></div><div class="row" style="margin-top:8px">${b}</div>${n}</div>`;
}
/* Eventos próprios do rolador: atualizam configurações e aplicam ações. */
/* ---------- EVENTOS ---------- */
function diceChange(a, t) {
  if (a != "rcfg") return false;
  const o = R[t.dataset.o],
    f = t.dataset.f;
  o[f] = t.value;
  o.res = null;
  return true;
}
function diceClick(a, t, d) {
  const o = t.dataset.o,
    r = R.S.res;
  if (a == "rn") {
    const x = R[o];
    x[t.dataset.f] = cl(x[t.dataset.f] + d, +t.dataset.mn, +t.dataset.mx);
    x.res = null;
    return true;
  }
  if (a == "rollS") {
    const x = R.S;
    if (S.dados < 1) return true;
    const c = sCfg(),
      n = cl(x.n, 1, S.dados);
    x.res = {
      tipo: x.tipo,
      dif: c.dif,
      need: c.need,
      vals: Array.from({ length: n }, rnd),
      fresh: true,
    };
    return true;
  }
  if (a == "rreroll" && r) {
    r.vals = r.vals.map(rnd);
    r.fresh = true;
    r.rr = true;
    r.eag = false;
    return true;
  }
  if (a == "reag" && r) {
    r.eag = !r.eag;
    r.fresh = false;
    return true;
  }
  if (a == "dieset" && r && r.eag) {
    r.vals[+t.dataset.i] = cl(S.fer, 1, 6);
    r.eag = false;
    r.eagU = true;
    r.fresh = false;
    return true;
  }
  if (a == "rpt" && r) {
    S.pt = cl(S.pt + 1, 0, 10);
    r.pt = true;
    r.fresh = false;
    toast("+1 PT");
    return true;
  }
  if (a == "rskip" && r) {
    r.applied = true;
    r.fresh = false;
    r.msg = "Sem perda de dados nesta rolagem.";
    return true;
  }
  if (a == "rapply" && r) {
    const s = r.vals.filter((v) => v >= r.dif).length,
      six = r.vals.filter((v) => v == 6).length,
      f = r.vals.length - s;
    if (r.tipo == "vazar") {
      S.dados = Math.max(0, S.dados - r.vals.length);
      S.fuga += s + six;
      r.msg = `Pilha −${r.vals.length}, +${s + six} dado(s) de fuga.`;
    } else {
      S.dados = Math.max(0, S.dados - f);
      r.msg = `Pilha −${f}.${S.dados == 0 && f ? " DESASTRE: sem dados na pilha." : ""}`;
    }
    r.applied = true;
    r.fresh = false;
    return true;
  }
  if (a == "rollD") {
    const x = R.D;
    let vals,
      labs = [];
    vals = Array.from({ length: x.tipo == "livre" ? x.n : 1 }, rnd);
    x.res = { tipo: x.tipo, vals, lim: x.lim, fresh: true };
    return true;
  }
  if (a == "dap" && R.D.res) {
    const q = R.D.res,
      k = t.dataset.k;
    const alvo = D.sob.find((x) => x.id == q.alvo),
      nm = alvo ? String(alvo.n || "").trim() || "sobrevivente sem nome" : "";
    if (D.sob.length && !alvo && q.alvo !== "-") return true;
    if (alvo && alvo.fer >= 6) return true;
    if (k == "kill") {
      D.dados = Math.max(0, D.dados - 1);
      if (alvo) alvo.fer = 6;
      D.log.push("Ferir 6: matou" + (alvo ? " " + nm : "") + " (−1 dado)");
      if (alvo) toast(nm + " morreu.");
    }
    if (k == "mut") {
      D.dados = Math.max(0, D.dados - 1);
      if (alvo) {
        alvo.seq = Math.min(5, alvo.seq + 3);
        alvo.fer = Math.min(6, Math.max(alvo.fer + 3, alvo.seq));
        D.log.push("Mutilar em " + nm + ": +3 Sequelas");
      }
      const g = Math.min(4, 20 - D.ph);
      D.ph += g;
      D.log.push(
        "+" + g + " PH: Mutilar" + (g < 4 ? " (limite de 20)" : ""),
      );
      if (g < 4) toast("Limite de 20 Pontos de Horror");
    }
    if (k == "seq") {
      D.dados = Math.max(0, D.dados - 1);
      if (alvo) {
        const antes = alvo.fer;
        alvo.seq = Math.min(5, alvo.seq + 1);
        alvo.fer = Math.min(6, Math.max(alvo.fer + q.vals[0], alvo.seq));
        D.log.push("Ferir: dado " + q.vals[0] + " em " + nm + " (+1 Sequela)");
        toast(nm + ": Ferida " + antes + " → " + alvo.fer + ", Sequelas " + alvo.seq + (alvo.fer >= 6 ? " — MORTO(A)!" : ""));
      } else D.log.push("Ferir: dado entregue (valor " + q.vals[0] + ")");
    }
    q.applied = true;
    q.fresh = false;
    return true;
  }
  return false;
}

/* 6. Aplicação: estado das fichas, persistência local, utilitários e renderização. */
/* BRUTAL RPG (site não oficial) - estado, fichas, navegação e eventos */
const $ = (s) => document.querySelector(s),
  cl = (v, a, b) => Math.max(a, Math.min(b, v));
const ld = (k, d) => {
  try {
    return Object.assign(d, JSON.parse(localStorage.getItem(k)) || {});
  } catch (e) {
    return d;
  }
};
/* Modelos iniciais: valores padrão da ficha de Sobrevivente e da ficha do Mestre. */
const S0 = () => ({
  arq: "",
  foto: "",
  nome: "",
  pron: "",
  jog: "",
  dados: 6,
  fuga: 0,
  pt: 0,
  fer: 0,
  seq: 0,
  hab: -1,
  cic: [],
  inc: [],
  buys: {},
  apg: ["", "", ""],
  apar: "",
  marc: [],
  rod: 0,
  nota: "",
});
const D0 = () => ({
  nome: "",
  foto: "",
  a1: "Brutamontes",
  a2: "Estratégico",
  dados: 4,
  ph: 3,
  pas: 1,
  au1: "",
  au2: "",
  pe: "",
  log: [],
  sob: [],
  apar: "",
  nota: "",
});
let S = ld("br_s", S0()),
  D = ld("br_d", D0()),
  tab = "home",
  role = "";
/* pilha da Diretora sem limite máximo (só não pode ser negativa) */
D.dados = Math.max(0, +D.dados || 0);
const escH = (v) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
/* Lista de sobreviventes do Mestre: registros 100% manuais e independentes das fichas dos jogadores.
 * Fica em D.sob (salvo em "br_d"). Aceita o formato antigo { n, d } e completa os campos novos. */
/* Condições que o Mestre aplica a um sobrevivente (marcadores das Ações Únicas). Valores conforme as regras do livro. */
const COND = {
  segurar: { rot: "Presa (Segurar)", dica: () => "Não conta Dados de Fuga e recebe +1 de Ferida no começo de cada turno dela. Aliadas soltam com Força (Risco Complexo)." },
  infectar: {
    rot: "Infecção", min: 1, max: 6, ini: 1,
    dica: (v) => (v >= 6 ? "Estágio Mortal: sacrifica todos os dados comuns no começo de cada cena." : v >= 4 ? "Estágio Avançado: todas as especialidades incapacitadas." : v >= 2 ? "Estágio Inicial: 1 especialidade (à sua escolha) incapacitada." : "Ainda sem efeito. Sobe a cada tipo de cena."),
  },
  possuir: {
    rot: "Possessão", min: 1, max: 6, ini: 1,
    dica: (v) => (v >= 6 ? "Pronta: use o dado para Matar através dela (no turno dela)." : "Sobe a cada dado de falha ao superar um Risco."),
  },
  restringir: {
    rot: "Restrição", min: 1, max: 6, ini: 3,
    dica: () => "Todos os testes dela com +1 de dificuldade. Reduz 1 por dado de sucesso (Agilidade ou Astúcia); abaixo de 1, some. Se falhar: +1 aqui e Feridas iguais ao valor.",
  },
  amaldicoar: {
    rot: "Recurso amaldiçoado (oculto)", min: 1, max: 3, ini: 1,
    dica: (v) => (v >= 3 ? "Ela perde todos os PT e não ganha novos até o fim da próxima cena." : "Sobe 1 a cada vez que ela usa o recurso em um teste."),
  },
  incapacitar: { rot: "Incapacitada", attr: true, dica: () => "Fica sem a especialidade (e sua vantagem) até usar Tomar Jeito.", pilha: true },
  destruir: { rot: "Recurso destruído", txt: true, dica: () => "Anote o que foi destruído.", pilha: true },
};
const novoSob = () => ({
  id: "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
  n: "",
  jog: "",
  arq: "",
  dados: 6,
  fuga: 0,
  fer: 0,
  seq: 0,
  pt: 0,
  nota: "",
  cond: [],
});
const numSob = (v, a, b, p) => (Number.isFinite(+v) && v !== "" && v !== null ? cl(Math.round(+v), a, b) : p);
const normSob = (x) => {
  const b = novoSob(),
    seq = numSob(x.seq, 0, 5, 0);
  return {
    id: typeof x.id == "string" && x.id ? x.id : b.id,
    n: String(x.n ?? ""),
    jog: String(x.jog ?? ""),
    arq: AR[x.arq] ? x.arq : "",
    dados: numSob(x.dados ?? x.d, 0, 6, 6),
    fuga: numSob(x.fuga, 0, 6, 0),
    fer: Math.max(seq, numSob(x.fer, 0, 6, 0)),
    seq,
    pt: numSob(x.pt, 0, 10, 0),
    nota: String(x.nota ?? ""),
    cond: (Array.isArray(x.cond) ? x.cond : [])
      .filter((c) => c && typeof c == "object" && COND[c.k])
      .map((c) => ({
        k: c.k,
        v: numSob(c.v, COND[c.k].min ?? 0, COND[c.k].max ?? 0, COND[c.k].ini ?? 0),
        attr: String(c.attr ?? ""),
        txt: String(c.txt ?? ""),
      })),
  };
};
{
  const usados = new Set();
  D.sob = (Array.isArray(D.sob) ? D.sob : [])
    .filter((x) => x && typeof x == "object")
    .map(normSob)
    .map((x) => {
      if (usados.has(x.id)) x.id = novoSob().id;
      usados.add(x.id);
      return x;
    });
}
/* migração de fichas salvas em versões antigas */
if (Array.isArray(S.fer)) {
  S.fer = cl(
    S.fer.reduce((a, f) => a + (f.v || 0), 0),
    0,
    6,
  );
  S.seq = 0;
}
if (Array.isArray(S.seq)) S.seq = Math.min(5, S.seq.length);
if (Array.isArray(S.hab)) {
  const k = S.hab.find((i) => i < 5);
  S.hab = k === undefined ? -1 : k;
}
if (typeof S.hab != "number") S.hab = -1;
if (!Array.isArray(S.cic)) S.cic = [];
if (!Array.isArray(S.marc)) S.marc = [];
S.marc.forEach((m) => {
  if (!m.t) {
    m.t = "cus";
    m.dm = 0;
    m.up = false;
  }
});
S.fer = Math.max(S.fer, S.seq);
if (!TH[D.a1]) D.a1 = "Brutamontes";
if (!TH[D.a2]) D.a2 = "Estratégico";
/* Persistência: grava o estado localmente para recuperar as fichas depois. */
const sv = () => {
  try {
    localStorage.setItem("br_s", JSON.stringify(S));
    localStorage.setItem("br_d", JSON.stringify(D));
  } catch (e) { }
};
const toast = (m) => {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = m;
  document.body.append(t);
  setTimeout(() => t.remove(), 2200);
};
/* Funções auxiliares para atributos, HTML dinâmico, dados e seleção de imagens. */
const esp = () => (S.arq ? AR[S.arq][2] : []);
const src = (f) =>
  !f
    ? f
    : f.startsWith("art:")
      ? IM.t[f.slice(4)]
      : f.startsWith("sv:")
        ? IM[f.slice(3)]
        : f;
let gal = "";
const cnt = (k, v, mn, mx, o) =>
  `<div class="cnt"><button class="b o${v <= mn ? " lim" : ""}" aria-label="Diminuir" data-a="n" data-k="${k}" data-d="-1" data-mn="${mn}" data-mx="${mx}">−</button><span class="cv"><b>${v}</b>${Number.isFinite(mx) ? `<em>/${mx}</em>` : ""}</span><button class="b${v >= mx ? " lim" : ""}" aria-label="Aumentar" data-a="n" data-k="${k}" data-d="1" data-mn="${mn}" data-mx="${mx}">+</button></div>`;
const dice = (n, m) =>
  `<div class="dice">${Array.from({ length: m }, (_, i) => `<div class="die ${i < n ? "" : "off"}">${i < n ? "⚅" : ""}</div>`).join("")}</div>`;
const circ = (n, m) =>
  Array.from(
    { length: m },
    (_, i) => `<span class="cir ${i < n ? "on" : ""}"></span>`,
  ).join("");
const photo = (f, o) => {
  const a = f && /^(art|sv):/.test(f);
  return `<div class="ph ${a ? "pa" : ""}" data-a="gal" data-o="${o}" style="${f ? `background-image:url(${src(f)})` : ""}">${f ? "" : "📷<br>Toque para<br>escolher a foto"}</div><button class="b o" style="margin-top:6px;width:100%" data-a="gal" data-o="${o}">${f ? "Trocar foto" : "Escolher foto"}</button>`;
};
const galUI = () => {
  if (!gal) return "";
  const sv_ = gal == "S",
    cur = (sv_ ? S : D).foto,
    items = sv_
      ? Object.keys(AR).map((k) => ["sv:" + k, AR[k][0], IM[k]])
      : Object.keys(IM.t).map((k) => ["art:" + k, k, IM.t[k]]);
  return `<div class="gal" data-a="galx"><div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h3>${sv_ ? "Escolha a imagem do seu sobrevivente" : "Escolha a imagem do seu assassino"}</h3><button class="b o" data-a="galx">✕ Fechar</button></div><p>${sv_ ? "Toque em um dos sobreviventes do livro ou envie a sua própria imagem." : "Toque em uma das ameaças do livro ou envie a sua própria imagem."}</p><div class="gg">${items.map(([v, n, im]) => `<button class="gt ${cur == v ? "on" : ""}" data-a="pick" data-o="${gal}" data-v="${v}"><i style="background-image:url(${im})"></i><span>${n}</span></button>`).join("")}<label class="gt up"><i>📷</i><span>Enviar minha foto</span><input type="file" accept="image/*" hidden data-a="img" data-o="${gal}"></label>${cur ? `<button class="gt up" data-a="pick" data-o="${gal}" data-v=""><i>🗑</i><span>Sem foto</span></button>` : ""}</div></div></div>`;
};
const opt = (arr, sel) =>
  arr
    .map(
      ([v, n, dis]) =>
        `<option value="${v}" ${v == sel ? "selected" : ""} ${dis ? "disabled" : ""}>${n}</option>`,
    )
    .join("");
/* habilidades: 1 inicial + cicatrizes (regras do livro) */
/* Reúne habilidades e cicatrizes disponíveis para a ficha atual. */
const allHab = () => {
  const r = [];
  if (S.arq && S.hab >= 0) r.push({ k: S.arq, i: S.hab, s: "inicial" });
  S.cic.forEach((c) => {
    if (c.t == "star" && S.arq)
      r.push({ k: S.arq, i: 5, s: "Cicatriz de Sobrevivente" });
    else if (c.t == "own" && S.arq && c.i >= 0)
      r.push({ k: S.arq, i: c.i, s: "Cicatriz" });
    else if (c.t == "dead" && c.a && c.i >= 0)
      r.push({ k: c.a, i: c.i, s: "Cicatriz (de sobrevivente morto)" });
  });
  return r;
};
const hasHab = (k, i) => allHab().some((h) => h.k == k && h.i == i);
const hb = (h) => {
  const [n, d] = AR[h.k][4][h.i].split("|");
  return { n, d };
};
const tot = () => TN[D.a1] + TN[D.a2],
  mxN = () => Math.max(TN[D.a1], TN[D.a2]);
function assetByKey(key) {
  return key.split(".").reduce((value, part) => value && value[part], IM);
}
function hydrateAssets(root) {
  root.querySelectorAll("[data-asset]").forEach((element) => {
    element.src = assetByKey(element.dataset.asset);
    element.removeAttribute("data-asset");
  });
  root.querySelectorAll("[data-bg-asset]").forEach((element) => {
    element.style.backgroundImage = `url("${assetByKey(element.dataset.bgAsset)}")`;
    element.removeAttribute("data-bg-asset");
  });
}
/* Ajusta a navegação conforme o papel escolhido: Sobrevivente ou Mestre. */
function nav() {
  const navEl = $("#nav");
  navEl.style.display = role ? "flex" : "none";
  navEl.querySelectorAll("[data-nav-role]").forEach((button) => {
    button.hidden = button.dataset.navRole !== role;
    button.classList.toggle("on", button.dataset.k === tab);
  });
  hydrateAssets(navEl);
}
/* Textos e tabelas de consulta usados nas fichas e no guia. */
const TB = (h, r) =>
  `<table><tr>${h.map((x) => `<th>${x}</th>`).join("")}</tr>${r.map((l) => `<tr>${l.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;
const MT = {
  inf: [
    "Infecção",
    1,
    1,
    1,
    1,
    "Infecção: destrói a sobrevivente por dentro, piorando a cada rodada. Defina quanto de dano ela causa por rodada.",
  ],
  pos: [
    "Possessão",
    1,
    0,
    0,
    1,
    "Possessão: o Assassino ganha controle sobre a sobrevivente a cada falha dela. Defina o dano por rodada, se houver.",
  ],
  res: [
    "Restrição",
    3,
    0,
    0,
    3,
    "Restrição: estorvo que aumenta em +1 a dificuldade de todos os testes da sobrevivente (o rolador já soma isso). Em falha ao se livrar, ela recebe Feridas.",
  ],
  seg: [
    "Segurar",
    1,
    1,
    0,
    1,
    "Segurar: imobilizada, não conta Dados de Fuga e recebe +1 de Ferida no início de cada turno. Aliados podem testar Força (Risco Complexo) para libertar.",
  ],
  mal: [
    "Maldição",
    1,
    0,
    0,
    1,
    "Maldição: efeito oculto num recurso; ao ser ativada, a sobrevivente perde todos os Pontos de Tensão e não ganha novos até o fim da próxima cena.",
  ],
  cus: [
    "Personalizado",
    1,
    0,
    0,
    1,
    "Qualquer condição que piore com o tempo (queimadura, veneno, medo…). Defina o dano por rodada.",
  ],
};
const stg = (m) =>
  m.t == "inf"
    ? m.v >= 6
      ? "Estágio MORTAL: sacrifica todos os dados comuns a cada cena."
      : m.v >= 4
        ? "Estágio avançado: todas as especialidades incapacitadas."
        : m.v >= 2
          ? "Estágio inicial: 1 especialidade incapacitada."
          : "Incubação: ainda sem efeito."
    : m.t == "pos"
      ? m.v >= 6
        ? "Possessão completa: pode ser usada para Matar."
        : ""
      : m.t == "mal"
        ? m.v >= 3
          ? "Maldição ativa: perde todos os PT."
          : ""
        : "";
/* Interface dos marcadores e acompanhamento de efeitos por rodada. */
function marcUI() {
  const tot = S.marc.reduce((a, m) => a + (m.dm || 0), 0);
  return `<div class="card" style="--c:#8a1fb0"><h3>Marcadores</h3><small>Dados marcadores do livro: condições que pioram com o tempo. Ferida e Sequela têm cards próprios. Escolha um tipo para ver como funciona.</small>
<div class="row" style="margin-top:8px"><select id="mt" data-a="mtsel" style="flex:1;min-width:140px">${Object.entries(
    MT,
  )
      .map(
        ([k, v]) =>
          `<option value="${k}" ${k == (window.mtSel || "inf") ? "selected" : ""}>${v[0]}</option>`,
      )
      .join(
        "",
      )}</select><input id="mn" placeholder="Nome (opcional)" style="flex:1;min-width:120px"><button class="b" data-a="madd">Adicionar</button></div>
<p><small id="mdesc">${MT[window.mtSel || "inf"][5]}</small></p>
${S.marc
      .map(
        (
          m,
          i,
        ) => `<div class="item" style="flex-wrap:wrap;align-items:flex-start"><div style="flex:1 1 150px"><b>${MT[m.t][0]}</b>${m.n ? ` <small>— ${m.n}</small>` : ""}</div>
<div><div class="lab">Dano/rodada</div><div class="cnt"><button class="b o" data-a="mdm" data-id="${i}" data-d="-1">−</button><b style="font-size:28px;min-width:30px">${m.dm || 0}</b><button class="b" data-a="mdm" data-id="${i}" data-d="1">+</button></div></div>
<button class="b o" data-a="mdel" data-id="${i}">✕</button></div>`,
      )
      .join("") || "<p><small>Nenhum marcador ativo.</small></p>"
}
<div class="row" style="margin-top:10px"><button class="b" data-a="prox" ${S.marc.length ? "" : "disabled"}>Próxima rodada ▶</button><button class="b o" data-a="rod0">Zerar rodadas</button><span>Rodada <b>${S.rod || 0}</b> · Dano por rodada: <b>${tot}</b></span></div><small>Ao avançar a rodada, cada marcador causa seu dano na Ferida (máx. 6 = morte).</small></div>`;
}
/* Apresentação das fichas (somente visual): estado do indicador e agrupamento em seções. */
const estado = (cls, txt) =>
  cls ? { c: " st-" + cls, t: `<span class="stag">${txt}</span>` } : { c: "", t: "" };
const secao = (n, id, titulo, dica, corpo, cor) =>
  `<section class="sec" aria-labelledby="sec-${id}" style="--c:${cor || "var(--r)"}"><div class="sec-h"><span class="sec-n">${n}</span><h2 class="sec-t" id="sec-${id}">${titulo}</h2>${dica ? `<small>${dica}</small>` : ""}</div>${corpo}</section>`;
/* 7. Monta a ficha do jogador: atributos, dados, feridas, habilidades e cicatrizes. */
/* ---------- FICHA DO SOBREVIVENTE ---------- */
function cicUI(c, x) {
  const a = AR[S.arq];
  if (!a) return "";
  const usedOwn = [
    S.hab,
    ...S.cic.filter((q, j) => j != x && q.t == "own").map((q) => q.i),
  ];
  const starUsed = S.cic.some((q, j) => j != x && q.t == "star");
  let h = `<div class="item" style="flex-wrap:wrap"><select data-a="cic" data-id="${x}" data-f="t" style="flex:1;min-width:150px">${opt(
    [
      ["own", "Outra habilidade do meu arquétipo"],
      ["dead", "Habilidade de sobrevivente que morreu"],
      ["star", "Cicatriz de Sobrevivente ★", starUsed],
    ],
    c.t,
  )}</select>`;
  if (c.t == "own")
    h += `<select data-a="cic" data-id="${x}" data-f="i" style="flex:1;min-width:150px">${opt([[-1, "Escolher…"], ...[0, 1, 2, 3, 4].map((i) => [i, a[4][i].split("|")[0], usedOwn.includes(i)])], c.i)}</select>`;
  if (c.t == "dead")
    h += `<select data-a="cic" data-id="${x}" data-f="a" style="flex:1;min-width:120px">${opt(
      [
        ["", "Arquétipo…"],
        ...Object.entries(AR)
          .filter(([k]) => k != S.arq)
          .map(([k, v]) => [k, v[0]]),
      ],
      c.a,
    )}</select>${c.a ? `<select data-a="cic" data-id="${x}" data-f="i" style="flex:1;min-width:150px">${opt([[-1, "Escolher…"], ...[0, 1, 2, 3, 4].map((i) => [i, AR[c.a][4][i].split("|")[0]])], c.i)}</select>` : ""}`;
  if (c.t == "star")
    h += `<b style="flex:1">${a[4][5].split("|")[0].replace("★ ", "★ ")}</b>`;
  return (
    h +
    `<button class="b o" data-a="cicdel" data-id="${x}">✕</button></div>`
  );
}
function sob() {
  const a = AR[S.arq],
    c = a ? a[1] : "#d1121f",
    f = S.fer,
    sq = S.seq,
    cr = S.arq == "relaxado" && hasHab("relaxado", 5) ? 5 : 6;
  const buy = (id, n, cs, ds, lock) =>
    `<div class="item buy ${S.pt < cs || lock ? "no" : "ok"}"><div><b>${n}</b> <span class="chip">${cs} PT</span><br><small>${ds}</small></div><button class="b" data-a="buy" data-id="${id}" data-c="${cs}" ${S.pt < cs || lock ? "disabled" : ""}>${S.pt < cs ? "Faltam " + (cs - S.pt) + " PT" : "Comprar"}</button></div>`;
  const sd = S.dados == 0 ? estado("zero", "Sem dados") : S.dados <= 2 ? estado("low", "Baixo") : S.dados >= 6 ? estado("max", "Cheia") : estado(),
    sp = S.pt >= 10 ? estado("max", "Máx.") : estado(),
    sf = f >= 6 ? estado("zero", "Morta") : f >= 5 ? estado("crit", "Crítica") : f >= 4 ? estado("low", "Grave") : estado(),
    ss = sq >= 5 ? estado("max", "Máx.") : estado();
  return `<h2>Ficha da Sobrevivente</h2>
${secao("01", "ident", "Identidade", "Quem é a sobrevivente.", `<div class="g"><div class="card" style="--c:${c}"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div style="width:42%">${photo(S.foto, "S")}</div><div style="flex:1"><div class="lab">Nome</div><input data-k="S.nome" value="${S.nome}"><div class="lab">Pronomes</div><input data-k="S.pron" value="${S.pron}"><div class="lab">Intérprete</div><input data-k="S.jog" value="${S.jog}"><div class="lab">Arquétipo</div><select data-a="arq"><option value="">Escolher…</option>${Object.entries(
    AR,
  )
      .map(
        ([k, v]) =>
          `<option value="${k}" ${S.arq == k ? "selected" : ""}>${v[0]}</option>`,
      )
      .join(
        "",
      )}</select></div></div>${a ? `${S.foto == "sv:" + S.arq ? "" : `<div class="art" style="background-image:url(${IM[S.arq]});margin-top:10px"></div>`}<p><small>${a[3]}</small></p>` : ""}</div></div>`, c)}
${secao("02", "rec", "Recursos", "Consulte e ajuste a cada rolagem e a cada cena.", `<div class="g g-res">
<div class="card key${sd.c}" style="--c:${c}"><div class="ch"><h3>Pilha de dados</h3>${sd.t}</div>${dice(S.dados, 6)}${cnt("S.dados", S.dados, 0, 6)}<small class="${S.dados == 0 ? "alert" : ""}">${S.dados == 0 ? "Sem dados: sem testes e morte certa num encontro." : "Máx. 6. Falhas: sacrifica (suspense) ou descarta (encontro)."}</small></div>
<div class="card key" style="--c:${c}"><div class="ch"><h3>Pilha de Fuga</h3></div><div class="cnt"><button class="b o${S.fuga < 1 ? " lim" : ""}" aria-label="Diminuir" data-a="fuga" data-d="-1" ${S.fuga < 1 ? "disabled" : ""}>−</button><span class="cv"><b>${S.fuga}</b></span><button class="b${S.dados < 1 ? " lim" : ""}" aria-label="Aumentar" data-a="fuga" data-d="1" ${S.dados < 1 ? "disabled" : ""}>+</button></div><small>Cada dado de fuga sai da pilha de dados comum.</small></div>
<div class="card key${sp.c}" style="--c:${c}"><div class="ch"><h3>Pontos de Tensão</h3>${sp.t}</div><div class="bar" style="--seg:10"><i style="width:${S.pt * 10}%"></i></div>${cnt("S.pt", S.pt, 0, 10)}<small>0 a 10. Gaste na loja de vantagens.</small></div>
</div>`, c)}
${secao("03", "teste", "Testes e especialidades", "Role aqui; as especialidades abaixo valem −1 de dificuldade.", `${rollS()}
<div class="g"><div class="card" style="--c:${c}"><h3>Especialidades</h3><p><small>Dificuldade −1 (toque para incapacitar/recuperar).</small></p>${Object.keys(
        AT,
      )
      .map((k) => {
        const e = esp().includes(k),
          x = S.inc.includes(k);
        return `<div class="item spec ${x ? "is-x" : e ? "is-on" : "is-off"}"><span><span class="chip ${e ? "s" : ""} ${x ? "x" : ""}" style="--c:${c}" ${e ? `data-a="inc" data-id="${k}"` : ""}>${AT[k]}</span> <small>${AD[k]}</small></span>${x ? '<b style="color:var(--r)">INCAPACITADA</b>' : e ? "<b>★</b>" : ""}</div>`;
      })
      .join("")}</div></div>`, c)}
${secao("04", "fer", "Ferimentos e condições", "Ferida, sequelas e marcadores que pioram com o tempo.", `<div class="g">
<div class="card key${sf.c}" style="--c:var(--r)"><div class="ch"><h3>Ferida</h3>${sf.t}</div><div class="bar" style="--seg:6"><i style="width:${(f / 6) * 100}%"></i></div>${f >= 6 ? '<div class="dead">Sobrevivente morta</div>' : ""}${cnt("S.fer", f, sq, 6)}<small>Dado Marcador de 0 a 6; em 6 a Sobrevivente morre. Nunca fica abaixo das Sequelas (${sq}).</small><div style="margin-top:8px"><button class="b o" data-a="cure" ${f <= sq || S.pt < 1 ? "disabled" : ""}>Cuidar de Feridas (−1 PT, −1 ferida)</button></div></div>
<div class="card${ss.c}" style="--c:var(--r)"><div class="ch"><h3>Sequelas</h3>${ss.t}</div><div class="cirs">${circ(sq, 5)}<span class="cirn"><b>${sq}</b>/5</span></div><small>Só o número (até 5). O Mestre decide quantos pontos vale a sequela. Cada ponto <b>aumenta a Ferida</b> na mesma quantidade (máx. 6) e a Ferida nunca fica abaixo do total de Sequelas.</small><div class="row" style="margin-top:8px"><select id="sq" style="width:90px">${[1, 2, 3].map((n) => `<option value="${n}">+${n}</option>`).join("")}</select><button class="b" data-a="seqadd" ${sq >= 5 ? "disabled" : ""}>Receber sequela</button><button class="b o" data-a="seqdel" ${sq < 1 ? "disabled" : ""}>−1</button></div></div>
</div>
${marcUI()}`, c)}
${secao("05", "hab", "Habilidades e vantagens", "O que a sobrevivente sabe fazer e o que já comprou.", `<div class="g g-wide">
<div class="card" style="--c:${c}"><h3>Vantagens e Habilidades</h3>${!a ? "<small>Escolha um arquétipo para ver as habilidades dele aqui.</small>" : ""}
<div class="lab" style="margin-top:8px">Compradas</div>${Object.keys(S.buys)
      .filter((k) => S.buys[k] && k[0] != "s")
      .map(
        (k) =>
          `<div class="item"><span><b>${k == "tj" ? "Tomar Jeito" : k == "cr" ? "Choque de Realidade" : k.startsWith("pv") && SV[k.slice(2)] ? SV[k.slice(2)][0] + " <small>(" + AT[k.slice(2)] + ")</small>" : k}</b> ×${S.buys[k]}</span><button class="b o" data-a="use" data-id="${k}" ${k.startsWith("pv") && S.inc.includes(k.slice(2)) ? "disabled" : ""}>Usar</button></div>`,
      )
      .join("") || "<small>Nenhuma comprada ainda.</small>"
    }
<div class="lab" style="margin-top:8px">Habilidades</div>${allHab()
      .map((h) => {
        const { n, d } = hb(h);
        return `<div class="item"><span><b>${n}</b> <span class="chip">${h.s}</span><br><small>${d}</small></span></div>`;
      })
      .join("") || "<small>Escolha sua habilidade inicial.</small>"
    }</div>
<div class="card" style="--c:${c}"><h3>Habilidades</h3>${a
      ? `<p><small>Sobrevivente de primeira viagem escolhe <b>apenas 1</b> das 5 habilidades do arquétipo.</small></p>` +
      a[4]
        .slice(0, 5)
        .map((h, i) => {
          const [n, d] = h.split("|");
          return `<label class="item pick${S.hab == i ? " on" : ""}" style="cursor:pointer"><span><b>${n}</b><br><small>${d}</small></span><input type="radio" name="hab" style="width:auto" data-a="hab" data-id="${i}" ${S.hab == i ? "checked" : ""}></label>`;
        })
        .join("")
      : "<small>Escolha um arquétipo.</small>"
    }</div>
<div class="card" style="--c:${c}"><h3>Cicatrizes</h3>${a ? `<p><small>Só depois de sobreviver a um Thriller e se a Diretora permitir. Cada cicatriz dá <b>1 habilidade</b>: outra do seu arquétipo, a de um sobrevivente que morreu, ou a Cicatriz de Sobrevivente ★ (${a[4][5].split("|")[0].replace("★ ", "")}).</small></p>` + S.cic.map(cicUI).join("") + `<button class="b" data-a="cicadd" style="margin-top:8px" ${S.hab < 0 ? "disabled" : ""}>+ Ganhar cicatriz</button>${S.hab < 0 ? "<br><small>Escolha primeiro a habilidade inicial.</small>" : ""}` : "<small>Escolha um arquétipo.</small>"}</div>
</div>`, c)}
${secao("06", "loja", "Loja", "Gaste Pontos de Tensão fora de encontro.", `<div class="g g-one">
<div class="card" style="--c:${c}"><h3>Loja de Vantagens</h3><p><small>Só fora de encontro. Você precisa ter o PT inteiro do custo: ele é descontado na hora. Seus PT: <b>${S.pt}</b>.</small></p>${buy("tj", "Tomar Jeito", 3, "Recupera uma especialidade incapacitada (sua ou de outra).", !S.inc.length)}${buy("cr", "Choque de Realidade", cr, "+1 dado comum na pilha (máx. 6).", S.dados >= 6)}${a ? `<div class="lab" style="margin-top:8px">Vantagens do seu arquétipo</div>` + esp().map((k) => { const v = SV[k], x = S.inc.includes(k); return buy("pv" + k, `${v[0]} <small>(${AT[k]})</small>`, v[1], v[2] + (x ? '<br><b style="color:var(--r)">Especialidade incapacitada: recupere com Tomar Jeito.</b>' : ""), x); }).join("") : ""}<div class="item buy ${f <= sq || S.pt < 1 ? "no" : "ok"}"><div><b>Cuidar de Feridas</b> <span class="chip">1 PT por 1</span><br><small>Reduz a Ferida (nunca abaixo das Sequelas). 1×/encontro.</small></div><button class="b" data-a="cure" ${f <= sq || S.pt < 1 ? "disabled" : ""}>Comprar 1</button></div></div>
</div>`, c)}
${secao("07", "nota", "Apegos e anotações", "Ganhe PT com apegos e registre o que precisar.", `<div class="g">
<div class="card" style="--c:${c}"><h3>Apegos</h3>${[
      ["Item Icônico (+1 PT na cena)", 1],
      ["Relação Afetiva (+2 PT no momento)", 2],
      ["Desejo Obscuro (+3 PT ao revelar)", 3],
    ]
      .map(
        ([t, p], i) =>
          `<div class="lab">${t}</div><div class="row"><input style="flex:1" data-k="S.apg.${i}" value="${S.apg[i]}"><button class="b o" data-a="ptp" data-d="${p}">+${p} PT</button></div>`,
      )
      .join(
        "",
      )}</div><div class="card" style="--c:${c}"><h3>Anotações</h3><textarea rows="6" data-k="S.nota">${S.nota}</textarea></div>
</div>`, c)}
<div class="sheet-foot"><button class="b o" data-a="reset" data-o="S">Limpar ficha</button></div>`;
}
/* 8. Monta a ficha do Mestre: Ameaças, dados, Pontos de Horror e ações. */
/* ---------- FICHA DO MESTRE ---------- */
const auList = (t) =>
  TH[t][1] == "—"
    ? AU.map((x) => x[0])
    : TH[t][1].replace(/ e /g, ", ").split(", ");
/* Lista de sobreviventes do Mestre: cadastro manual e independente (D.sob).
 * Não lê nem copia as fichas dos jogadores; cada registro tem seus próprios valores. */
function sobUI() {
  const stc = (f, v) => f == "dados" ? (v == 0 ? " st-zero" : v <= 2 ? " st-low" : v >= 6 ? " st-max" : "") : f == "fer" ? (v >= 6 ? " st-zero" : v >= 5 ? " st-crit" : v >= 4 ? " st-low" : "") : (f == "pt" && v >= 10) || (f == "seq" && v >= 5) ? " st-max" : "";
  const st = (rot, f, v, mn, mx, extra) =>
    `<div class="sst${stc(f, v)}"><div class="lab">${rot}</div><div class="sv"><button class="b o" data-a="sst" data-f="${f}" data-d="-1" data-id="@I@" ${v <= mn ? "disabled" : ""} aria-label="Diminuir ${rot}">−</button><b>${v}</b><button class="b" data-a="sst" data-f="${f}" data-d="1" data-id="@I@" ${v >= mx ? "disabled" : ""} aria-label="Aumentar ${rot}">+</button></div>${extra || ""}</div>`;
  const lista = D.sob
    .map((x, i) => {
      const ar = AR[x.arq],
        esp = ar ? ar[2].map((k) => AT[k]).join(", ") : "",
        k = (f) => `D.sob.${i}.${f}`,
        S_ = (rot, f, v, mn, mx, extra) => st(rot, f, v, mn, mx, extra).replace(/@I@/g, i);
      return `<div class="sobr${x.fer >= 6 ? " is-dead" : ""}" data-sid="${escH(x.id)}"><div class="row" style="flex-wrap:wrap"><input style="flex:1 1 160px" data-k="${k("n")}" value="${escH(x.n)}" placeholder="Nome do sobrevivente" aria-label="Nome do sobrevivente">${ar ? `<span class="chip s" style="--c:${ar[1]}">${ar[0]}</span>` : ""}${x.fer >= 6 ? '<b style="color:var(--r)">MORTO(A)</b>' : ""}<button class="b o" data-a="sdel" data-id="${i}">Excluir</button></div>
<div class="sgrid">${S_("Dados", "dados", x.dados, 0, 6)}${S_("Fuga", "fuga", x.fuga, 0, 6)}${S_("Ferida", "fer", x.fer, x.seq, 6)}${S_("Sequelas", "seq", x.seq, 0, 5)}${S_("PT", "pt", x.pt, 0, 10)}</div>
<div class="row" style="margin-top:8px;flex-wrap:wrap"><div style="flex:1 1 160px"><div class="lab">Intérprete</div><input data-k="${k("jog")}" value="${escH(x.jog)}" placeholder="Quem controla (opcional)"></div><div style="flex:1 1 160px"><div class="lab">Arquétipo</div><select data-a="sel" data-k="${k("arq")}"><option value="">Sem arquétipo</option>${Object.entries(AR).map(([c, v]) => `<option value="${c}" ${x.arq == c ? "selected" : ""}>${v[0]}</option>`).join("")}</select></div></div>${esp ? `<small>Especialidades: ${esp}</small>` : ""}
<div class="lab" style="margin-top:8px">Anotações</div><input data-k="${k("nota")}" value="${escH(x.nota)}" placeholder="Ex.: ferido na perna, carrega a chave…"></div>`;
    })
    .join("");
  return `<div class="g" style="grid-template-columns:1fr"><div class="card" style="--c:#8a1fb0"><h3>Sobreviventes da sessão</h3><p><small>Lista própria do Mestre: cadastre qualquer sobrevivente à mão, mesmo sem ficha em Minha Ficha. Os valores não se misturam com as fichas dos jogadores. Ferida nunca fica abaixo das Sequelas; cada Sequela adicionada sobe a Ferida em 1.</small></p>${lista || "<small>Nenhum sobrevivente cadastrado.</small>"}<div class="row" style="margin-top:10px"><button class="b" data-a="sadd">+ Adicionar sobrevivente</button></div></div></div>`;
}

function dir() {
  const t = tot(),
    mx = mxN(),
    pn = D.pas == 2 ? D.a2 : D.a1,
    sust = Math.max(0, 7 - t),
    arm = Math.max(0, 7 - t) + (pn == "Estratégico" ? 1 : 0);
  const th = (v) =>
    Object.keys(TH)
      .map(
        (k) =>
          `<option value="${k}" ${k == v ? "selected" : ""}>${k} (NB ${TN[k]})</option>`,
      )
      .join("");
  const pe = CUST.slice(7).find((x) => x[0] == D.pe);
  const aur = (n, key) =>
    `<select data-a="sel" data-k="D.${key}"><option value="">Escolher 1 ação única…</option>${auList(
      n,
    )
      .map(
        (x) => `<option ${D[key] == x ? "selected" : ""}>${x}</option>`,
      )
      .join(
        "",
      )}</select>${D[key] ? `<div class="item"><div><b>${D[key]}</b> <small>(de ${n})</small><br><small>${AUD[D[key]] || ""}</small></div>${AUC[D[key]] ? `<button class="b" data-a="phs" data-d="${AUC[D[key]]}" data-n="${D[key]}" ${D.ph < AUC[D[key]] ? "disabled" : ""}>Usar −${AUC[D[key]]} PH</button>` : ""}</div>` : ""}`;
  const sd = D.dados == 0 ? estado("zero", "Derrotado") : D.dados <= 2 ? estado("low", "Baixo") : estado(),
    sph = D.ph == 0 ? estado("zero", "Sem PH") : D.ph < 4 ? estado("low", "Baixo") : D.ph >= 20 ? estado("max", "Máx.") : estado();
  return `<h2>Ficha do Mestre (Assassino)</h2>
${secao("01", "ident", "Identidade e números", "O Assassino e os valores que decorrem das Ameaças.", `<div class="g">
<div class="card" style="--c:#8a1fb0"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div style="width:45%">${photo(D.foto, "D")}</div><div style="flex:1"><div class="lab">Nome do Assassino</div><input data-k="D.nome" value="${D.nome}" placeholder="Ex.: O Açougueiro"><div class="lab">Ameaça Principal</div><select data-a="th" data-k="a1">${th(D.a1)}</select><div class="lab">2ª Ameaça</div><select data-a="th" data-k="a2">${th(D.a2)}</select></div></div></div>
<div class="card"><h3>Números do Assassino</h3><div class="nums"><div class="num"><span>Nível de Brutalidade (soma)</span><b>${t}</b></div><div class="num"><span>Dados iniciais</span><b>${t}</b></div><div class="num"><span>Pontos de Horror iniciais</span><b>${TN[D.a1]}</b></div><div class="num"><span>Etapas de Fuga (maior NB + 1)</span><b>${mx + 1}</b></div><div class="num wide"><span>Sustos por encontro</span><div class="cirs">${circ(sust, 5)}</div></div><div class="num wide"><span>Armadilhas grátis (Suspense)</span><div class="cirs">${circ(arm, 6)} <small>${pn == "Estratégico" ? "(+1 do passivo)" : ""}</small></div></div></div></div>
</div>`, "#8a1fb0")}
${secao("02", "rec", "Recursos", "Consulte e ajuste a cada cena.", `<div class="g g-res">
<div class="card key${sd.c}" style="--c:#8a1fb0"><div class="ch"><h3>Pilha de dados</h3>${sd.t}</div>${dice(D.dados, Math.max(12, D.dados))}${cnt("D.dados", D.dados, 0, Infinity)}<div class="row acts"><button class="b o" data-a="dmat">Matar (−2 dados)</button><button class="b o" data-a="desc">Escapar (+1 dado)</button><button class="b o" data-a="dset">Restaurar (${t})</button></div><small>Aparece quando tem mais dados que qualquer sobrevivente. Zerar = derrotado por ora.</small></div>
<div class="card key${sph.c}" style="--c:#8a1fb0"><div class="ch"><h3>Pontos de Horror</h3>${sph.t}</div><div class="bar" style="--seg:20"><i style="width:${Math.min(100, D.ph * 5)}%"></i></div>${cnt("D.ph", D.ph, 0, 20)}<div class="row acts"><button class="b o" data-a="phs" data-d="-4" data-n="Mutilar">Mutilar +4</button><button class="b o" data-a="phs" data-d="4" data-n="Dificultar (por dado)" ${D.ph < 4 ? "disabled" : ""}>Dificultar −4</button></div></div>
</div>`, "#8a1fb0")}
${secao("03", "roll", "Rolagem", "Ferir, dados livres e Dado da Horda.", `${rollD()}`, "#8a1fb0")}
${secao("04", "sob", "Sobreviventes", "Acompanhe os dados e as feridas de cada sobrevivente.", `${sobUI()}`, "#8a1fb0")}
${secao("05", "hab", "Habilidades do Assassino", "Ações únicas, passiva e poder especial.", `<div class="g">
<div class="card"><h3>Ações Únicas</h3><p><small>1 de cada Ameaça (você pode trocar uma entre sessões).</small></p><div class="lab">De ${D.a1}</div>${aur(D.a1, "au1")}<div class="lab" style="margin-top:8px">De ${D.a2}</div>${aur(D.a2, "au2")}</div>
<div class="card"><h3>Habilidade Passiva</h3><select data-a="sel" data-k="D.pas"><option value="1" ${D.pas != 2 ? "selected" : ""}>${D.a1} (Principal)</option><option value="2" ${D.pas == 2 ? "selected" : ""}>${D.a2}</option></select><p>${TH[pn][0]}</p><h3 style="margin-top:12px">Poder Especial</h3><select data-a="sel" data-k="D.pe"><option value="">Escolher 1 poder…</option>${CUST.slice(
    7,
  )
      .map(
        (x) => `<option ${D.pe == x[0] ? "selected" : ""}>${x[0]}</option>`,
      )
      .join(
        "",
      )}</select>${pe ? `<div class="item"><div><span class="chip">${pe[1]} PH</span><br><small>${pe[2]}</small></div><button class="b" data-a="phs" data-d="${pe[1]}" data-n="${pe[0]}" ${D.ph < pe[1] ? "disabled" : ""}>Usar</button></div>` : ""}</div>
</div>`, "#8a1fb0")}
${secao("06", "acao", "Intentos e ações", "Intentos Horríveis geram PH; Ações Gerais são a referência de regras.", `<div class="g">
<div class="card"><h3>Intentos Horríveis</h3>${INT.map((i) => `<div class="item"><span>${i[1]}</span><button class="b" data-a="php" data-d="${i[0]}" data-n="${i[1]}">+${i[0]}</button></div>`).join("")}${[D.a1, D.a2].map((n) => `<div class="item"><span><small>Intento único (${n}):</small> ${TI[n][1]}</span><button class="b" data-a="php" data-d="${TI[n][0]}" data-n="Único: ${n}">+${TI[n][0]}</button></div>`).join("")}</div>
<div class="card"><h3>Ações Gerais</h3>${TB(
        ["Ação", "Regra"],
        [
          [
            "Assustar",
            "Todas rolam 1 dado. Limitada (7 − NB total por encontro).",
          ],
          [
            "Matar",
            "Gaste 2 dados: mata sobrevivente com menos dados que você.",
          ],
          [
            "Ferir",
            "Role 1 dado seu: 6 mata; menos = Sequela e marcador (soma no próximo Ferir).",
          ],
          ["Mutilar", "6 no Ferir: descarte o dado, +4 PH e 3 Sequelas."],
          ["Escapar", "Encerra o encontro e ganha 1 dado."],
          ["Dificultar", "+1 Etapa de Fuga por 4 PH por dado."],
        ],
      )}</div>
</div>`, "#8a1fb0")}
${secao("07", "reg", "Registro e anotações", "Últimos movimentos de PH e anotações do Thriller.", `<div class="g">
<div class="card"><h3>Registro de PH</h3>${D.log
      .slice(-8)
      .reverse()
      .map((l) => `<div class="item"><small>${l}</small></div>`)
      .join("") || "<small>Vazio.</small>"
    }</div><div class="card"><h3>Anotações do Thriller</h3><textarea rows="6" data-k="D.nota">${D.nota}</textarea></div></div>`, "#8a1fb0")}
<div class="sheet-foot"><button class="b o" data-a="reset" data-o="D">Limpar ficha</button></div>`;
}
/* 9. Renderização das telas e delegação dos eventos de formulário e clique. */
/* ---------- RENDER E EVENTOS ---------- */
function render() {
  const y0 = scrollY;
  nav();
  const app = $("#app");
  const templateId = {
    home: "home-template",
    learn: "learn-template",
    guide: "guide-template",
  }[tab];

  if (templateId) {
    app.replaceChildren($("#" + templateId).content.cloneNode(true));
  } else {
    app.innerHTML = tab === "sob" ? sob() : dir();
    app.append($("#disclaimer-template").content.cloneNode(true));
  }

  hydrateAssets(app);
  const gallery = galUI();
  if (gallery) app.insertAdjacentHTML("beforeend", gallery);
  sv();
  animateDice();
  scrollTo(0, y0);
}
const P = (k) => {
  const p = k.split(".");
  let o = p[0] == "S" ? S : D;
  for (let i = 1; i < p.length - 1; i++) o = o[p[i]];
  return [o, p[p.length - 1]];
};
/* Atualizações em tempo real para campos editáveis. */
document.addEventListener("input", (e) => {
  const k = e.target.dataset.k;
  if (k && !e.target.dataset.a) {
    const [o, f] = P(k);
    o[f] = e.target.value;
    sv();
  }
});
/* Alterações em seletores, arquivos e controles com mudança confirmada. */
document.addEventListener("change", (e) => {
  const t = e.target,
    a = t.dataset.a;
  if (diceChange(a, t)) {
    render();
    return;
  }
  if (a == "arq") {
    S.arq = t.value;
    S.hab = -1;
    S.cic = [];
    S.inc = [];
    if (t.value && (!S.foto || S.foto.startsWith("sv:")))
      S.foto = "sv:" + t.value;
  } else if (a == "th") {
    D[t.dataset.k] = t.value;
    D.dados = tot();
    D.ph = TN[D.a1];
    D.pas = 1;
    D.au1 = "";
    D.au2 = "";
  } else if (a == "ftarget") {
    if (R.D.res) {
      R.D.res.alvo = t.value;
      R.D.res.fresh = false;
    }
  } else if (a == "sel") {
    const [o, f] = P(t.dataset.k);
    o[f] = f == "pas" ? +t.value : t.value;
  } else if (a == "mtsel") {
    window.mtSel = t.value;
    $("#mdesc").textContent = MT[t.value][5];
    return;
  } else if (a == "mup") {
    S.marc[+t.dataset.id].up = t.checked;
  } else if (a == "hab") {
    S.hab = +t.dataset.id;
    S.cic = S.cic.map((c) =>
      c.t == "own" && c.i == S.hab ? { ...c, i: -1 } : c,
    );
  } else if (a == "cic") {
    const c = S.cic[+t.dataset.id],
      f = t.dataset.f;
    c[f] = f == "i" ? +t.value : t.value;
    if (f == "t") {
      c.a = "";
      c.i = -1;
    }
    if (f == "a") c.i = -1;
  } else if (a == "img") {
    const f = t.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement("canvas"),
          s = Math.min(1, 600 / Math.max(im.width, im.height));
        c.width = im.width * s;
        c.height = im.height * s;
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        (t.dataset.o == "S" ? S : D).foto = c.toDataURL(
          "image/jpeg",
          0.8,
        );
        gal = "";
        render();
      };
      im.src = r.result;
    };
    r.readAsDataURL(f);
    return;
  } else return;
  render();
});
/* Ações da interface: navegação, botões, rolagens, galeria e controles das fichas. */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-a]");
  if (!t || ["SELECT", "INPUT", "TEXTAREA"].includes(t.tagName)) return;
  const a = t.dataset.a,
    id = t.dataset.id,
    d = +t.dataset.d;
  if (diceClick(a, t, d)) {
    render();
    return;
  }
  if (a == "logo") {
    role = "";
    tab = "home";
    render();
    return;
  }
  if (a == "role") {
    role = t.dataset.k;
    tab = role == "p" ? "learn" : "guide";
    render();
    scrollTo(0, 0);
    return;
  }
  if (a == "roll") {
    const n = cl(+$("#rn").value || 1, 1, 12),
      e2 = $("#re").checked,
      r = Array.from(
        { length: n },
        () => 1 + Math.floor(Math.random() * 6),
      ),
      m = e2 ? 3 : 4,
      ok = r.filter((x) => x >= m).length;
    $("#rr").innerHTML =
      r
        .map(
          (x) =>
            `<span class="die" style="display:inline-flex;margin:2px;${x >= m ? "border-color:#2faa4e;color:#2faa4e" : "opacity:.5"}">${x}</span>`,
        )
        .join("") +
      `<p><b>${ok} sucesso(s)</b>, ${n - ok} falha(s) saem da pilha. Risco comum: ${ok >= 1 ? "superado" : "não superado"}; complexo: ${ok >= 2 ? "superado" : "não superado"}.</p>`;
    return;
  }
  if (a == "tab") {
    tab = t.dataset.k;
    render();
    scrollTo(0, 0);
    return;
  }
  if (a == "n") {
    const [o, f] = P(t.dataset.k);
    o[f] = cl(o[f] + d, +t.dataset.mn, +t.dataset.mx);
  }
  if (a == "fuga") {
    if (d > 0) {
      if (S.dados < 1)
        return toast("Sem dados na pilha para virar dado de fuga");
      S.dados--;
      S.fuga++;
    } else if (S.fuga > 0) S.fuga--;
  }
  if (a == "inc")
    S.inc = S.inc.includes(id)
      ? S.inc.filter((x) => x != id)
      : [...S.inc, id];
  if (a == "seqadd") {
    const n = +$("#sq").value;
    S.seq = Math.min(5, S.seq + n);
    S.fer = Math.min(6, Math.max(S.fer + n, S.seq));
  }
  if (a == "seqdel") S.seq = Math.max(0, S.seq - 1);
  if (a == "cure" && S.fer > S.seq && S.pt >= 1) {
    S.fer--;
    S.pt--;
  }
  if (a == "buy") {
    const c = +t.dataset.c;
    if (S.pt < c) return toast("Você precisa de " + c + " PT");
    S.pt -= c;
    if (id == "tj") S.inc = [];
    if (id == "cr") S.dados = Math.min(6, S.dados + 1);
    S.buys[id] = (S.buys[id] || 0) + 1;
    toast("Vantagem comprada!");
  }
  if (a == "use") {
    S.buys[id]--;
    if (S.buys[id] < 1) delete S.buys[id];
  }
  if (a == "ptp") S.pt = cl(S.pt + d, 0, 10);
  if (a == "madd") {
    const k = $("#mt").value,
      d = MT[k];
    S.marc.push({
      t: k,
      n: $("#mn").value,
      v: d[1],
      dm: d[2],
      up: !!d[3],
    });
  }
  if (a == "mdm") S.marc[id].dm = cl((S.marc[id].dm || 0) + d, 0, 6);
  if (a == "rod0") S.rod = 0;
  if (a == "prox") {
    let dn = 0;
    S.marc.forEach((m) => {
      dn += m.dm || 0;
    });
    S.rod = (S.rod || 0) + 1;
    const antes = S.fer;
    S.fer = Math.min(6, S.fer + dn);
    toast(
      `Rodada ${S.rod}: ${dn ? "−" + dn + " (Ferida " + antes + " → " + S.fer + ")" : "sem dano"}${S.fer >= 6 ? " — MORTA!" : ""}`,
    );
  }
  if (a == "mv") S.marc[id].v = cl(S.marc[id].v + d, 1, 6);
  if (a == "mdel") S.marc.splice(+id, 1);
  if (a == "cicadd") S.cic.push({ t: "own", a: "", i: -1 });
  if (a == "cicdel") S.cic.splice(+id, 1);
  if (a == "php") {
    const g = Math.min(d, 20 - D.ph);
    D.ph += g;
    D.log.push(
      "+" + g + " PH: " + t.dataset.n + (g < d ? " (limite de 20)" : ""),
    );
    if (g < d) toast("Limite de 20 Pontos de Horror");
  }
  if (a == "phs") {
    if (d > 0) {
      if (D.ph < d) return;
      D.ph -= d;
      D.log.push("−" + d + " PH: " + t.dataset.n);
    } else {
      const g = Math.min(-d, 20 - D.ph);
      if (g <= 0) return toast("Limite de 20 Pontos de Horror");
      D.ph += g;
      D.log.push(
        "+" +
        g +
        " PH: " +
        t.dataset.n +
        (g < -d ? " (limite de 20)" : ""),
      );
      if (g < -d) toast("Limite de 20 Pontos de Horror");
    }
  }
  if (a == "dmat") D.dados = Math.max(0, D.dados - 2);
  if (a == "desc") {
    D.dados++;
  }
  if (a == "dset") D.dados = tot();
  if (a == "artfoto") D.foto = "art:" + D.a1;
  if (a == "gal") gal = t.dataset.o;
  if (a == "galx") {
    if (e.target.closest(".gal>div") && !t.matches("button")) return;
    gal = "";
  }
  if (a == "pick") {
    (t.dataset.o == "S" ? S : D).foto = t.dataset.v;
    gal = "";
  }
  if (a == "sadd") D.sob.push(novoSob());
  if (a == "sst") {
    /* ajusta um valor do sobrevivente do Mestre, respeitando as regras da ficha */
    const x = D.sob[+id],
      f = t.dataset.f;
    if (!x) return;
    if (f == "dados" || f == "fuga") x[f] = cl(x[f] + d, 0, 6);
    else if (f == "pt") x.pt = cl(x.pt + d, 0, 10);
    else if (f == "fer") x.fer = cl(x.fer + d, x.seq, 6);
    else if (f == "seq") {
      if (d > 0 && x.seq < 5) {
        x.seq++;
        x.fer = Math.min(6, Math.max(x.fer + 1, x.seq));
      } else if (d < 0) x.seq = Math.max(0, x.seq - 1);
    }
  }
  if (a == "sdel") {
    const x = D.sob[+id];
    if (!x) return;
    if (!confirm('Excluir "' + (String(x.n).trim() || "sobrevivente sem nome") + '" da lista do Mestre? Isso não pode ser desfeito.')) return;
    D.sob.splice(+id, 1);
  }
  if (a == "reset") {
    if (t.dataset.o == "S") S = S0();
    else D = D0();
  }
  render();
});
/* Tela inicial: a lanterna segue o ponteiro e os painéis abrem pelo teclado. */
(function () {
  const luz = (e) => {
    if (!document.querySelector(".land")) return;
    const p = e.target.closest && e.target.closest(".land .pan");
    document.querySelectorAll(".land .pan").forEach((x) => {
      if (x !== p) {
        x.style.removeProperty("--mx");
        x.style.removeProperty("--my");
      }
    });
    if (!p) return;
    const r = p.getBoundingClientRect();
    p.style.setProperty("--mx", e.clientX - r.left + "px");
    p.style.setProperty("--my", e.clientY - r.top + "px");
  };
  document.addEventListener("pointermove", luz, { passive: true });
  document.addEventListener("pointerdown", luz, { passive: true });
  document.addEventListener("keydown", (e) => {
    const p = e.target.closest && e.target.closest(".land .pan");
    if (p && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      p.click();
    }
  });
})();
/* Cenas da tela inicial: o painel sob o ponteiro entra em cena (classe .go).
   Em telas de toque, que não têm "passar o mouse", a revelação é automática. */
(function () {
  const pans = () => document.querySelectorAll(".land .pan");
  const set = (p) => pans().forEach((x) => x.classList.toggle("go", x === p));
  document.addEventListener(
    "pointerover",
    (e) => {
      if (e.pointerType === "touch" || !document.querySelector(".land")) return;
      set(e.target.closest && e.target.closest(".land .pan"));
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => set(null));
  window.addEventListener("blur", () => set(null));
  const touch = window.matchMedia("(hover: none)");
  new MutationObserver(() => {
    const land = document.querySelector(".land");
    if (!land || land.dataset.armed) return;
    land.dataset.armed = "1";
    if (touch.matches) {
      setTimeout(() => {
        if (land.isConnected) pans().forEach((x) => x.classList.add("go"));
      }, 1700);
    }
  }).observe(document.getElementById("app"), { childList: true, subtree: true });
})();

/* Lição 2: ao clicar (ou tocar) num arquétipo, mostra os detalhes logo abaixo da fileira dele. */
(function () {
  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let trava = 0;
  const ir = (box) => {
    trava = Date.now() + 900;
    box.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  function mostrar(card, rolar) {
    const a = AR[card.dataset.arq];
    const gal = card.closest(".arq-gal");
    const box = gal && gal.querySelector(".arq-info");
    if (!a || !box) return;
    if (box.dataset.cur === card.dataset.arq && !box.hidden) {
      /* segundo clique no mesmo arquétipo: fecha o painel, mantendo o cartão parado na tela */
      const t0 = card.getBoundingClientRect().top;
      delete box.dataset.cur;
      box.hidden = true;
      card.classList.remove("on");
      const d = card.getBoundingClientRect().top - t0;
      if (d) scrollBy({ top: d, behavior: "instant" });
      return;
    }
    box.dataset.cur = card.dataset.arq;
    gal.querySelectorAll(".arq.on").forEach((x) => x.classList.remove("on"));
    card.classList.add("on");
    /* coloca o painel logo abaixo da fileira do cartão, mantendo o cartão parado na tela */
    const cartas = [...gal.querySelectorAll(".arq")];
    const cols = getComputedStyle(gal).gridTemplateColumns.split(" ").length;
    const fim = cartas[Math.min(cartas.length - 1, (Math.floor(cartas.indexOf(card) / cols) + 1) * cols - 1)];
    const y0 = card.getBoundingClientRect().top;
    box.hidden = false;
    if (box.previousElementSibling !== fim) fim.after(box);
    box.style.setProperty("--seta", card.offsetLeft + card.offsetWidth / 2 - box.offsetLeft + "px");
    const dy = card.getBoundingClientRect().top - y0;
    if (dy) scrollBy({ top: dy, behavior: "instant" });
    const hab = a[4].map((h) => h.split("|"));
    const normais = hab.filter((h) => !h[0].startsWith("★"));
    const estrela = hab.find((h) => h[0].startsWith("★"));
    box.style.setProperty("--c", a[1]);
    box.innerHTML =
      `<h3>${esc(a[0])}</h3>` +
      `<p>${esc(card.dataset.quem)}</p>` +
      `<p><b>Especialidades</b> (dificuldade −1): ` +
      a[2].map((k) => `<span class="chip s" style="--c:${a[1]}">${esc(AT[k])}</span>`).join(" ") +
      `</p>` +
      `<p><b>Habilidades</b> (no começo você escolhe 1):</p><ul>` +
      normais.map((h) => `<li><b>${esc(h[0])}</b> ${esc(h[1])}</li>`).join("") +
      `</ul>` +
      (estrela ? `<p><small><b>${esc(estrela[0])}</b> ${esc(estrela[1])} <i>(Cicatriz)</i></small></p>` : "");
    if (rolar) ir(box);
  }
  const alvo = (e) => (e.target.closest ? e.target.closest(".arq") : null);
  document.addEventListener("click", (e) => {
    const c = alvo(e);
    if (c) mostrar(c, true);
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("arq")) {
      e.preventDefault();
      mostrar(e.target, true);
    }
  });
})();

render();
