/* ==== Minha Primeira Noite (módulo pn) ====
 * Tutorial curto e interativo: "Última Parada". Usa uma Sobrevivente de treino (Atleta,
 * com as especialidades do próprio site) e NUNCA lê nem altera as fichas reais (S e D).
 * Regras conforme o PDF de referência: testes, especialidade, Cena Livre (sacrifício),
 * Encontro (descarte), Vazar Dali, Partir Para Cima, Recuperar o Fôlego, Arriscar Tudo e Matar. */
(function () {
  "use strict";
  const R6 = () => 1 + Math.floor(Math.random() * 6);
  const roll = (n) => Array.from({ length: n }, R6);
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const pl = (n, s, p) => n + " " + (n == 1 ? s : p);
  const tray = (vals, dif, anim) => `<div class="tray">${vals.map((v) => { const ok = v >= dif; return die(v, ok ? "ok" : "no", anim, ok ? "sucesso" : "falha"); }).join("")}</div>`;
  const ctr = (v, mn, mx) => `<div class="cnt"><button type="button" class="b o${v <= mn ? " lim" : ""}" aria-label="Diminuir" data-pn="m" ${v <= mn ? "disabled" : ""}>−</button><span class="cv"><b>${v}</b></span><button type="button" class="b${v >= mx ? " lim" : ""}" aria-label="Aumentar" data-pn="p" ${v >= mx ? "disabled" : ""}>+</button></div>`;

  /* Dados da Sobrevivente de treino: Atleta, com as especialidades que o site já usa. */
  const ESP = typeof AR !== "undefined" && AR.atleta ? AR.atleta[2] : ["agi", "for"];
  const NM = (k) => (typeof AT !== "undefined" && AT[k]) || k;
  const DS = (k) => (typeof AD !== "undefined" && AD[k]) || "";
  const ATTRS = ["agi", "for", "ast", "vig", "car"];
  const difOf = (k) => (ESP.includes(k) ? 3 : 4);
  const espTxt = ESP.map(NM).join(" e ");

  const TITLES = ["Última Parada", "Como investigar?", "Atributo e especialidade", "A rolagem", "O que aconteceu", "Encontro", "Resumo da noite"];
  const IMG = ["motel", "lobby", "lobby", "hall", "hall", "killer", "motel"];
  const START = 6, DIRETORA = 4, ETAPAS = 3, DESCARTE = 6;

  const CH = {
    a: { t: "Vasculhar o balcão da recepção atrás de pistas.", atr: "ast", fb: "Você propõe usar Astúcia (conhecimento e raciocínio) para ler os sinais deixados na recepção." },
    b: { t: "Percorrer o corredor dos quartos com cuidado, sem fazer barulho.", atr: "agi", fb: "Você propõe usar Agilidade (velocidade, destreza e reflexos) para se mover sem ser notada." },
    c: { t: "Chamar por ajuda em voz alta.", atr: "car", fb: "Você propõe usar Carisma (habilidade interpessoal) para atrair quem estiver por perto." },
  };

  /* Aviso padrão para tudo o que existe só neste tutorial e não estaria numa mesa de RPG. */
  const obs = (t) => `<div class="pn-obs"><b>OBS · só no tutorial:</b> ${Array.isArray(t) ? `<ul>${t.map((x) => `<li>${x}</li>`).join("")}</ul>` : t}</div>`;
  const fresh = () => ({ step: 1, max: 1, ch: null, view: null, q3: null, roll: null, enc: null });
  let P = fresh();

  const sacr = () => (P.roll ? P.roll.vals.filter((v) => v < P.roll.dif).length : 0);
  const succ = () => (P.roll ? P.roll.vals.length - sacr() : 0);

  function encInit() {
    const you = START - sacr();
    const ass = DIRETORA + sacr();
    return { you, you0: you, ass, ass0: ass, fuga: 0, desc: DESCARTE, sel: null, n: 2, last: null, over: null, round: 1, fresh: false };
  }

  const can = (s) => (s == 2 ? !!P.ch : s == 4 ? !!P.roll : s == 6 ? !!(P.enc && P.enc.over) : true);
  const why = (s) => (s == 2 ? "Escolha como investigar para continuar." : s == 4 ? "Faça a rolagem para continuar." : s == 6 ? "Termine o Encontro (escapar, derrotar o Assassino ou cair) para continuar." : "");

  /* ------------------------------------------------------------------ ETAPAS */
  function s1() {
    return `<p class="pn-story">Noite de chuva forte na estrada. O seu carro falha perto de um motel isolado, com o letreiro de neon piscando. Você precisa de ajuda e entra.</p>
<p>Esta é uma <b>Cena Livre</b>: as Sobreviventes exploram o cenário e conversam, sem ordem de ações. Aqui, os dados que falham em testes são <b>Sacrificados</b>: saem da sua pilha e vão para a pilha da <b>Diretora</b>, que é a mesma do Assassino.</p>
<div class="pn-card"><b class="t">Sua Sobrevivente de treino: Atleta</b>
<p>Pilha de dados: <b>${START}</b> ${dice(START, 6)}</p>
<p>Especialidade em <b>${espTxt}</b>. Testes com esses atributos têm a dificuldade padrão reduzida em 1.</p>
</div>
${obs("Esta Atleta é uma personagem só do tutorial, e a sua ficha real não é usada nem alterada. Numa sessão de verdade, você cria a sua própria Sobrevivente.")}
<div class="pn-card"><b class="t">Do outro lado da mesa</b>
<p>A Diretora conduz o Assassino desta noite. Como é ela quem o controla, a pilha de dados da Diretora e a do Assassino são a mesma: ele começa com <b>${DIRETORA}</b> dados. Você ainda não o viu.</p></div>
${obs("Na mesa real você não vê quantos dados o Assassino tem (o Nerd tem uma habilidade só para descobrir isso). Aqui os números aparecem para você aprender como os dados se movem.")}
<p>Pronta? Avance e decida como investigar o lugar.</p>`;
  }

  function s2() {
    if (!P.ch) {
      return `<p class="pn-story">A recepção está vazia. Uma lâmpada falha sobre o balcão, há uma janela com grade e, no fundo, um corredor escuro de quartos. Ninguém responde.</p>
<p><b>Como você investiga?</b> Em BRUTAL, o Intérprete pode sugerir o atributo do teste, explicando a ideia. A palavra final é da Diretora.</p>
<div class="lx-opts">${Object.entries(CH).map(([k, c]) => `<button type="button" class="b o lx-o" data-pn="ch" data-k="${k}">${c.t}</button>`).join("")}</div>`;
    }
    const c = CH[P.ch];
    return `<p class="pn-story">A recepção está vazia. Uma lâmpada falha sobre o balcão, há uma janela com grade e, no fundo, um corredor escuro de quartos. Ninguém responde.</p>
<div class="lx-opts">${Object.entries(CH).map(([k, x]) => `<button type="button" class="b o lx-o ${k == P.ch ? "ok" : "dim"}" disabled>${k == P.ch ? "✔ " : ""}${x.t}</button>`).join("")}</div>
<div class="lx-why ok"><b>Boa.</b> ${c.fb} A Diretora aceita a ideia: o <b>Risco</b> é ser notada por algo que está por perto. Na próxima etapa você vê o que o atributo muda na dificuldade.</div>
<p><button type="button" class="b o" data-pn="rechoose">Escolher outra forma de investigar</button></p>
${obs("Escolher de novo não existe numa mesa de RPG: lá, a escolha feita vale. O botão serve só para você experimentar as outras opções.")}`;
  }

  function s3() {
    const mine = CH[P.ch].atr, v = P.view || mine, dif = difOf(v), isEsp = ESP.includes(v), dm = difOf(mine);
    const opts = [[3, "Sucesso em 3 ou mais"], [4, "Sucesso em 4 ou mais"], [5, "Sucesso em 5 ou mais"]];
    const q = P.q3;
    return `<p>Seu teste usa <b>${NM(mine)}</b>. Veja como a <b>especialidade</b> mexe na dificuldade: toque nos atributos para comparar.</p>
${obs("Comparar os atributos assim é só do tutorial. Na mesa, você sugere um atributo, explica a ideia e a Diretora decide.")}
<div class="pn-attrs">${ATTRS.map((k) => `<button type="button" class="b o${k == v ? " on" : ""}${k == mine ? " mine" : ""}" data-pn="view" data-k="${k}">${NM(k)}${ESP.includes(k) ? " ★" : ""}</button>`).join("")}</div>
<div class="pn-card"><b class="t">${NM(v)}</b>
<p class="pn-hint">${DS(v)}</p>
<p>${isEsp ? `★ É uma <b>especialidade</b> da Atleta: a dificuldade padrão 4 cai em 1.` : `Não é especialidade da Atleta: vale a dificuldade padrão 4.`}</p>
<p>Dado de <b>${dif}</b> ou mais é sucesso${dif == 3 ? " (3, 4, 5 ou 6)" : " (4, 5 ou 6)"}.</p></div>
<p>Este é um <b>Risco Comum</b>: basta <b>1 sucesso</b> para superá-lo.</p>
<p><b>Confira:</b> no seu teste de ${NM(mine)}, a partir de qual valor um dado é sucesso?</p>
<div class="lx-opts">${opts.map(([n, t]) => `<button type="button" class="b o lx-o${q == null ? "" : n == dm ? " ok" : n == q ? " bad" : " dim"}" data-pn="q3" data-v="${n}" ${q == null ? "" : "disabled"}>${q == null ? "" : n == dm ? "✔ " : n == q ? "✖ " : ""}${t}</button>`).join("")}</div>
${q == null ? "" : q == dm ? `<div class="lx-why ok"><b>Isso mesmo.</b> ${isEsp0(mine) ? `${NM(mine)} é especialidade da Atleta: a dificuldade padrão 4 é reduzida em 1, então vale 3 ou mais.` : `${NM(mine)} não é especialidade da Atleta: vale a dificuldade padrão, 4 ou mais.`}</div>` : `<div class="lx-why bad"><b>Não é essa.</b> ${isEsp0(mine) ? `${NM(mine)} é especialidade: a dificuldade padrão 4 é reduzida em 1, então vale <b>3 ou mais</b>.` : `${NM(mine)} não é especialidade: vale a dificuldade padrão, <b>4 ou mais</b>.`}</div>`}`;
  }
  const isEsp0 = (k) => ESP.includes(k);

  function s4() {
    const mine = CH[P.ch].atr, dif = difOf(mine), r = P.roll;
    if (!P.n4) P.n4 = 3;
    const n = r ? r.vals.length : P.n4;
    let h = `<p class="pn-story">No fundo do corredor, uma porta com marcas escuras. Algo se arrasta lá dentro. A Diretora pede o teste.</p>
<p><b>Teste de ${NM(mine)}</b> · sucesso em <b>${dif}+</b> · Risco Comum (1 sucesso). Anuncie quantos dados da sua pilha de <b>${START}</b> você arrisca e <b>role todos eles</b>.</p>`;
    if (!r) {
      h += `<div class="lx-ctl"><div><div class="lab">Dados que você arrisca</div>${ctr(n, 1, START)}</div><button type="button" class="b" data-pn="go">🎲 Rolar ${pl(n, "dado", "dados")}</button></div>
<p class="pn-hint">Mais dados dão mais chances de sucesso, mas os que falharem saem da sua pilha.${n == START ? " Arriscar os 6 e perder todos é um Desastre." : ""}</p>`;
    } else {
      const s = succ(), f = sacr();
      h += tray(r.vals, r.dif, r.fresh) + `<div class="sum ${r.fresh ? "late" : ""}"><div class="verd ${s ? "w" : "l"}">${s ? "Risco superado" : "Risco não superado"}</div><p>${pl(s, "sucesso", "sucessos")} e ${pl(f, "falha", "falhas")} em ${pl(r.vals.length, "dado", "dados")}.</p></div>
<p><button type="button" class="b o" data-pn="reroll">Refazer a rolagem (só no tutorial)</button></p>${obs("Refazer a rolagem não existe numa mesa de RPG: lá, o resultado dos dados vale. Aqui o botão serve para você testar quantidades diferentes de dados.")}`;
      if (r.fresh) { r.fresh = false; setTimeout(animateDice, 0); }
    }
    return h;
  }

  function s5() {
    if (!P.roll) return `<p>Você ainda não rolou os dados.</p><p><button type="button" class="b" data-pn="goto" data-s="4">Ir para a rolagem</button></p>`;
    const r = P.roll, s = succ(), f = sacr(), you = START - f, dr = DIRETORA + f, ok = s >= 1;
    return `<p class="pn-story">${ok ? "Você percebe o perigo a tempo: marcas de sangue na porta do fundo e algo se arrastando lá dentro." : "Você só percebe tarde demais: a porta do fundo se abre e um vulto sai dela."}</p>
<div class="pn-card"><b class="t">Lendo o resultado</b><ul class="lx-list">
<li><b>Sucessos e falhas:</b> com dificuldade ${r.dif}, você teve ${pl(s, "sucesso", "sucessos")} e ${pl(f, "falha", "falhas")}. ${ok ? "Para um Risco Comum 1 sucesso basta, então o risco foi superado." : "Sem nenhum sucesso, o risco não foi superado."}</li>
<li><b>Os dados de sucesso ficam com você.</b> Só os que falham saem da pilha.</li>
<li><b>Sacrifício:</b> ${f ? `as ${pl(f, "falha", "falhas")} foram <b>Sacrificadas</b>: saíram da sua pilha (agora <b>${you}</b>) e foram para a pilha da Diretora, que é a do Assassino (de ${DIRETORA} para <b>${dr}</b> dados). Em Cena Livre e em Cena de Suspense é assim.` : `nenhum dado falhou, então nada foi sacrificado. Sua pilha continua com <b>${you}</b> e a da Diretora (a do Assassino) com <b>${DIRETORA}</b>.`}</li>
<li><b>Por que isso importa:</b> o Assassino pode aparecer quando tiver mais dados que qualquer pessoa na mesa. Dados sacrificados o deixam mais perto disso.</li>
${you == 0 ? `<li><b>Desastre:</b> você perdeu o seu último dado. A Sobrevivente fica impossibilitada de continuar fazendo testes na cena, e sem dados ela morre na hora em um encontro com o Assassino. Volte e refaça a rolagem arriscando menos dados.</li>` : ""}
</ul></div>
${obs("Na mesa real você não vê a pilha da Diretora crescer (os dados dela ficam escondidos). Aqui os números aparecem para você enxergar o sacrifício acontecendo.")}
${you == 0 ? `<p><button type="button" class="b" data-pn="reroll">Refazer a rolagem (só no tutorial)</button></p>` : "<p>É hora do Encontro.</p>"}`;
  }

  function s6() {
    if (!P.roll || START - sacr() <= 0) return `<p>Para o Encontro você precisa de pelo menos 1 dado na pilha. Refaça a rolagem arriscando menos dados.</p><p><button type="button" class="b" data-pn="goto" data-s="4">Ir para a rolagem</button></p>`;
    if (!P.enc) P.enc = encInit();
    const E = P.enc, common = E.you - 0, esV = difOf("agi"), esC = difOf("for");
    const dado = E.sel == "vazar" || E.sel == "cima";
    let h = `<p class="pn-story">O vulto surge diante de você, de capuz e olhos acesos. A cena vira uma <b>Cena de Encontro</b>.</p>
<p>No Encontro, as Sobreviventes agem primeiro e o Assassino por último. Cada Sobrevivente faz <b>uma ação</b> por vez. Agora, os dados que falham são <b>Descartados</b> (vão para a pilha de descarte), não sacrificados.</p>
${obs([
      "Você vê os dados do Assassino e as Etapas de Fuga (" + ETAPAS + "). Na mesa real os dois são segredo.",
      "O Assassino só usa <b>Matar</b>. Na mesa, a Diretora tem muitas outras ações e poderes.",
      "Você é a única Sobrevivente na cena. Numa sessão normal há mais gente, e todo mundo age.",
      "Os Dados de Fuga ficam separados e não são rolados (o livro não detalha isso), e um 6 conta como dois no marcador de fuga.",
      "Você pode tentar o Encontro de novo. Na mesa não existe voltar atrás." + (E.ass0 <= E.you0 ? " Normalmente o Assassino só aparece quando tem mais dados que qualquer pessoa na mesa; aqui o Encontro começa mesmo assim." : "")
    ])}
<div class="lx-stat"><span>Sua pilha: <b>${E.you}</b> ${dice(E.you, 6)}</span><span>Dados de Fuga: <b>${E.fuga}/${ETAPAS}</b></span><span>Pilha do Assassino (= da Diretora): <b>${E.ass}</b> ${dice(E.ass, Math.max(E.ass0, 6))}</span></div>`;
    if (!E.over) {
      h += E.you < E.ass
        ? `<div class="pn-risk">⚠ Você tem <b>menos dados</b> que o Assassino. No turno dele, ele usa <b>Matar</b> e mata quem tem menos dados que a pilha dele.</div>`
        : `<div class="pn-safe">✔ Você tem <b>pelo menos tantos dados</b> quanto o Assassino. O Matar dele não funciona contra você agora.</div>`;
      h += `<p><b>Rodada ${E.round}: qual é a sua ação?</b></p>
<div class="pn-actions">
<button type="button" class="b o${E.sel == "vazar" ? " on" : ""}" data-pn="act" data-v="vazar" ${E.you - 0 < 1 ? "disabled" : ""}>Vazar Dali</button>
<button type="button" class="b o${E.sel == "cima" ? " on" : ""}" data-pn="act" data-v="cima">Partir Para Cima</button>
<button type="button" class="b o" data-pn="act" data-v="folego" ${E.you >= 6 || E.desc < 1 ? "disabled" : ""}>Recuperar o Fôlego</button>
<button type="button" class="b o" disabled title="Só pode ser usada por quem não é o último presente no encontro">Arriscar Tudo</button></div>
<p class="pn-hint">Arriscar Tudo está bloqueada: você é a última presente na cena e a ação não pode ser usada nessa situação.</p>`;
      if (E.sel == "vazar") h += `<div class="pn-card"><b class="t">Vazar Dali</b><p>Teste de Agilidade (especialidade: sucesso em <b>${esV}+</b>). Cada dado de sucesso vira um <b>Dado de Fuga</b>, e um 6 conta como dois. Com ${ETAPAS} Dados de Fuga você escapa.</p>`;
      if (E.sel == "cima") h += `<div class="pn-card"><b class="t">Partir Para Cima</b><p>Teste de Força (especialidade: sucesso em <b>${esC}+</b>). Com pelo menos 1 sucesso, o Assassino descarta 1 dado, não importa quantos sucessos você tire.</p>`;
      if (dado) {
        const mx = E.you - E.fuga;
        if (mx < 1) h += `<p class="pn-hint">Você só tem Dados de Fuga na pilha. Escolha outra ação.</p></div>`;
        else {
          E.n = cl(E.n, 1, mx);
          h += `<div class="lx-ctl"><div><div class="lab">Dados que você arrisca</div>${ctr(E.n, 1, mx)}</div><button type="button" class="b" data-pn="go">🎲 Rolar ${pl(E.n, "dado", "dados")}</button></div>
<p class="pn-hint">Os dados que falharem são descartados.</p></div>`;
        }
      }
    }
    if (E.last) {
      const L = E.last;
      h += (L.vals ? tray(L.vals, L.dif, E.fresh) : "") + `<div class="sum ${E.fresh ? "late" : ""}"><ul class="lx-list">${L.log.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
      if (E.fresh) { E.fresh = false; setTimeout(animateDice, 0); }
    }
    if (E.over) {
      const o = {
        escape: ["win", "Você escapou!", `Seus Dados de Fuga chegaram a ${ETAPAS}, o valor das Etapas de Fuga. Fuga concluída.`],
        defeat: ["win", "Assassino derrotado, por enquanto.", "A pilha dele zerou. A derrota é momentânea: os Intérpretes ganham uma Pista de como derrotá-lo de novo."],
        dead: ["lose", "O Assassino usou Matar.", "Você tinha menos dados que a pilha dele. No treino, tente de novo e veja o que muda."],
      }[E.over];
      h += `<div class="pn-end ${o[0]}"><b>${o[1]}</b> ${o[2]}</div><p><button type="button" class="b o" data-pn="encretry">Tentar o Encontro de novo</button></p>`;
    }
    return h;
  }

  function s7() {
    const E = P.enc, mine = P.ch ? CH[P.ch].atr : null;
    const res = !E || !E.over ? "Você ainda não terminou o Encontro, mas a noite é sua para repetir." : E.over == "escape" ? "Você escapou do Assassino com Dados de Fuga suficientes." : E.over == "defeat" ? "Você zerou a pilha do Assassino e o derrotou por enquanto." : "O Assassino usou Matar contra você.";
    return `<p class="pn-story">A chuva continua lá fora. ${E && E.over && E.over != "dead" ? "Você sobreviveu à primeira noite." : "A primeira noite acabou."}</p>
<div class="pn-end ${E && E.over && E.over != "dead" ? "win" : ""}"><b>Como sua noite terminou:</b> ${res}</div>
<div class="pn-card"><b class="t">O que você praticou</b><ul class="lx-list pn-sum">
<li><b>Atributo:</b> o Intérprete sugere${mine ? ` (você sugeriu ${NM(mine)})` : ""}; a Diretora dá a palavra final.</li>
<li><b>Especialidade:</b> reduz em 1 a dificuldade padrão 4. A Atleta de treino tinha ${espTxt}.</li>
<li><b>Teste:</b> anuncie quantos dados arrisca e role todos. Dado de sucesso fica com você; os que falham saem da pilha.</li>
<li><b>Cena Livre e Suspense:</b> falhas são <b>Sacrificadas</b> e vão para a pilha da Diretora.</li>
<li><b>Encontro:</b> falhas são <b>Descartadas</b>. O Assassino usa <b>Matar</b> contra quem tem menos dados que a pilha dele.</li>
<li><b>Ações de Encontro:</b> Vazar Dali (Dados de Fuga, 6 vale 2), Partir Para Cima (ele descarta 1 dado), Recuperar o Fôlego (+1 dado) e Arriscar Tudo (uma vez por sessão e nunca pelo último presente).</li></ul></div>
${obs("Números do Assassino à vista, Etapas de Fuga reveladas, refazer rolagens, Assassino só com Matar e uma Sobrevivente sozinha: nada disso acontece numa sessão real.")}
<p>Agora você está pronta para uma sessão de verdade. Para treinar mais, siga por aqui:</p>
<div class="pn-links"><button type="button" class="b o" data-pn="replay">Jogar a noite de novo</button><button type="button" class="b o" data-pn="tab" data-k="chal">Ir para Desafios</button><button type="button" class="b o" data-pn="tab" data-k="learn">Ir para Aprender a Jogar</button><button type="button" class="b" data-pn="tab" data-k="sob">Criar a minha Sobrevivente</button></div>`;
  }

  const STEPS = [null, s1, s2, s3, s4, s5, s6, s7];

  /* ------------------------------------------------------------------ DESENHO */
  function draw(host, scroll) {
    const s = P.step, enc = s == 6;
    host.innerHTML = `<div class="pn"><h2>Minha Primeira Noite</h2><p class="pn-sub">Última Parada · um tutorial de uns 10 minutos. Você joga uma noite curta e aprende o básico na prática, sem mexer em nenhuma ficha.</p>
<div class="pn-prog" role="group" aria-label="Etapas">${TITLES.map((t, i) => `<button type="button" class="pn-dot${i + 1 == s ? " on" : ""}${i + 1 < s ? " ok" : ""}" data-pn="goto" data-s="${i + 1}" ${i + 1 > P.max ? "disabled" : ""} title="${i + 1}. ${t}" aria-label="Etapa ${i + 1}: ${t}" ${i + 1 == s ? 'aria-current="step"' : ""}>${i + 1}</button>`).join("")}<span class="pn-of">Etapa ${s} de 7</span></div>
<div class="pn-bar" role="progressbar" aria-valuemin="1" aria-valuemax="7" aria-valuenow="${s}"><i style="width:${(s / 7) * 100}%"></i></div>
<div class="pn-scene ${IMG[s - 1]}"><div class="pn-cap"><h3>${s}. ${TITLES[s - 1]}</h3><span class="pn-tag${enc ? " enc" : ""}">${enc ? "Cena de Encontro" : s == 7 ? "Fim da noite" : "Cena Livre"}</span></div></div>
<div class="pn-body">${STEPS[s]()}
<div class="pn-nav"><button type="button" class="b o" data-pn="back" ${s == 1 ? "disabled" : ""}>← Voltar</button><button type="button" class="b" data-pn="next" ${s == 7 || !can(s) ? "disabled" : ""}>${s == 6 ? "Ver o resumo →" : "Avançar →"}</button>${s < 7 && !can(s) ? `<p class="pn-hint">${why(s)}</p>` : ""}</div></div></div>`;
    if (scroll) host.querySelector(".pn-prog").scrollIntoView({ block: "start", behavior: "auto" });
  }

  function reset(from) { /* limpa o que depende de escolhas anteriores */
    if (from <= 2) { P.ch = null; P.view = null; P.q3 = null; }
    if (from <= 4) { P.roll = null; P.enc = null; }
  }

  function go(host, s, sc) {
    P.step = cl(s, 1, 7);
    P.max = Math.max(P.max, P.step);
    draw(host, sc);
  }

  /* Ação do Encontro: resolve a ação e, se o encontro continua, o turno do Assassino. */
  function turno(E, L) {
    if (E.fuga >= ETAPAS) { E.over = "escape"; return; }
    if (E.ass <= 0) { E.over = "defeat"; return; }
    if (E.you < E.ass) {
      L.log.push(`<b>Turno do Assassino:</b> você tem ${pl(E.you, "dado", "dados")}, menos que os ${E.ass} dele. Ele usa <b>Matar</b>: você morre. (Ele descartaria 2 dados em seguida.)`);
      E.over = "dead";
    } else {
      L.log.push(`<b>Turno do Assassino:</b> você tem ${pl(E.you, "dado", "dados")}, o mesmo que ele ou mais. <b>Matar</b> não funciona contra você, e ele não consegue te matar agora.`);
      E.round++;
    }
  }

  function build() {
    const app = document.getElementById("app");
    const host = app && app.querySelector("#pn-host");
    if (!host || host.dataset.ready) return;
    host.dataset.ready = "1";
    draw(host, false);
    host.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pn]");
      if (!b || b.disabled) return;
      const k = b.dataset.pn;
      let sc = false;
      if (k == "back") { go(host, P.step - 1, true); return; }
      if (k == "next") { if (can(P.step)) go(host, P.step + 1, true); return; }
      if (k == "goto") { const t = +b.dataset.s; if (t <= P.max) go(host, t, true); return; }
      if (k == "tab") { const t = document.querySelector(`#nav [data-k="${b.dataset.k}"]`); if (t) t.click(); return; }
      if (k == "ch") { P.ch = b.dataset.k; P.view = null; P.q3 = null; P.roll = null; P.enc = null; P.max = Math.max(P.max, 2); }
      else if (k == "rechoose") { reset(2); P.max = 2; }
      else if (k == "view") P.view = b.dataset.k;
      else if (k == "q3") P.q3 = +b.dataset.v;
      else if (k == "m" || k == "p") {
        const d = k == "m" ? -1 : 1;
        if (P.step == 4) P.n4 = cl((P.n4 || 3) + d, 1, START);
        else if (P.enc) P.enc.n = cl(P.enc.n + d, 1, Math.max(1, P.enc.you - P.enc.fuga));
      }
      else if (k == "reroll") { reset(4); P.max = Math.min(P.max, 4); if (P.step > 4) P.step = 4; }
      else if (k == "go" && P.step == 4) {
        const n = P.n4 || 3, dif = difOf(CH[P.ch].atr);
        P.roll = { vals: roll(n), dif, fresh: true };
        P.enc = null;
      }
      else if (k == "act" && P.enc && !P.enc.over) {
        const E = P.enc, v = b.dataset.v;
        if (v == "folego") {
          E.sel = null;
          const L = { vals: null, log: [] };
          if (E.you < 6 && E.desc > 0) { E.you++; E.desc--; }
          L.log.push("<b>Recuperar o Fôlego:</b> você ganha +1 dado comum na pilha.");
          E.last = L; E.fresh = true;
          turno(E, L);
        } else E.sel = E.sel == v ? null : v;
      }
      else if (k == "go" && P.step == 6 && P.enc && !P.enc.over && P.enc.sel) {
        const E = P.enc, vz = E.sel == "vazar", dif = difOf(vz ? "agi" : "for");
        const n = cl(E.n, 1, E.you - E.fuga), vals = roll(n), L = { vals, dif, log: [] };
        const s = vals.filter((v) => v >= dif).length, f = n - s;
        E.you -= f; E.desc += f;
        if (vz) {
          const g = vals.filter((v) => v >= dif).reduce((a, v) => a + (v == 6 ? 2 : 1), 0);
          E.fuga += g;
          L.log.push(`<b>Vazar Dali:</b> ${pl(s, "sucesso", "sucessos")}${vals.includes(6) ? " (um 6 vale dois)" : ""}: você ganha ${pl(g, "Dado de Fuga", "Dados de Fuga")} (agora ${E.fuga}/${ETAPAS}). ${pl(f, "falha foi descartada", "falhas foram descartadas")}.`);
        } else {
          if (s >= 1) { E.ass = Math.max(0, E.ass - 1); L.log.push(`<b>Partir Para Cima:</b> ${pl(s, "sucesso", "sucessos")}. O Assassino descarta 1 dado (agora ${E.ass}), não importa quantos sucessos você tirou. ${pl(f, "falha foi descartada", "falhas foram descartadas")}.`); }
          else L.log.push(`<b>Partir Para Cima:</b> nenhum sucesso. O Assassino não perde dado. ${pl(f, "falha foi descartada", "falhas foram descartadas")}.`);
        }
        E.sel = null; E.last = L; E.fresh = true;
        turno(E, L);
      }
      else if (k == "encretry") { P.enc = encInit(); }
      else if (k == "replay") { P = fresh(); P.n4 = 3; }
      else return;
      draw(host, k == "replay" || k == "rechoose" ? true : false);
    });
  }

  const app = document.getElementById("app");
  if (app) {
    new MutationObserver(() => { if (app.querySelector("#pn-host:not([data-ready])")) build(); }).observe(app, { childList: true });
    build();
  }
})();
