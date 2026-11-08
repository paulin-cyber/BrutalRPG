/* ==== Aprender: atividades práticas e progresso (módulo lx) ====
 * Acopla-se à aba "Aprender a jogar" sem alterar o texto das lições: cria o painel de
 * progresso e, no fim de cada lição, as atividades (situações, simulações e desafios).
 * Todas as regras usadas aqui vêm do PDF de referência / das lições do próprio site. */
(function () {
  "use strict";
  const KEY = "br_lx", TOTAL = 13;
  let LX = { done: {}, sc: {} };
  try {
    const j = JSON.parse(localStorage.getItem(KEY));
    if (j && typeof j == "object") LX = { done: j.done || {}, sc: j.sc || {} };
  } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(LX)); } catch (e) { } };
  const R6 = () => 1 + Math.floor(Math.random() * 6);
  const roll = (n) => Array.from({ length: n }, R6);
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pl = (n, s, p) => n + " " + (n == 1 ? s : p);
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tray = (vals, okf) => `<div class="tray">${vals.map((v, i) => die(v, okf(v, i) ? "ok" : "no", true, okf(v, i) ? "sucesso" : "falha")).join("")}</div>`;
  const ctr = (v, mn, mx) => `<div class="cnt"><button type="button" class="b o${v <= mn ? " lim" : ""}" aria-label="Diminuir" data-lx="m" ${v <= mn ? "disabled" : ""}>−</button><span class="cv"><b>${v}</b></span><button type="button" class="b${v >= mx ? " lim" : ""}" aria-label="Aumentar" data-lx="p" ${v >= mx ? "disabled" : ""}>+</button></div>`;

  /* ---------------------------------------------------------------- QUIZ */
  function quiz(body, act, finish) {
    let ans = 0, ok = 0;
    const n = act.qs.length;
    const qs = act.qs.map((q) => ({ ...q, opts: shuf(q.opts) }));
    body.innerHTML = qs.map((q, i) => `<div class="lx-q" data-q="${i}"><p class="lx-sit"><b>${i + 1}.</b> ${q.s}</p><div class="lx-opts">${q.opts.map((o, j) => `<button type="button" class="b o lx-o" data-lx="pick" data-q="${i}" data-o="${j}">${o.t}</button>`).join("")}</div><div class="lx-why" role="status" aria-live="polite" hidden></div></div>`).join("");
    body.onclick = (e) => {
      const b = e.target.closest('[data-lx="pick"]');
      if (!b) return;
      const i = +b.dataset.q, box = body.querySelector(`.lx-q[data-q="${i}"]`);
      if (box.dataset.done) return;
      box.dataset.done = "1";
      const q = qs[i], o = q.opts[+b.dataset.o], right = q.opts.find((x) => x.ok);
      box.querySelectorAll(".lx-o").forEach((x, j) => {
        x.disabled = true;
        if (q.opts[j].ok) { x.classList.add("ok"); x.insertAdjacentHTML("afterbegin", "✔ "); }
        else if (x === b) { x.classList.add("bad"); x.insertAdjacentHTML("afterbegin", "✖ "); }
        else x.classList.add("dim");
      });
      const w = box.querySelector(".lx-why");
      w.hidden = false;
      if (o.ok) { w.className = "lx-why ok"; w.innerHTML = "<b>Correto.</b> " + o.w; ok++; }
      else { w.className = "lx-why bad"; w.innerHTML = "<b>Não é essa.</b> " + o.w + "<br><b>Resposta certa:</b> " + right.t + " " + right.w; }
      if (++ans == n) finish(`Você acertou ${ok} de ${n}.`, ok);
    };
  }

  /* ---------------------------------------------------------------- SIMULAÇÕES */
  const SIM = {};

  /* Rito de Iniciação */
  SIM.rito = (body, act, finish) => {
    let n = 3, res = null;
    const draw = () => {
      const s = res ? res.vals.filter((v) => v > 3).length : 0;
      body.innerHTML = `<p>Você tem <b>6 dados</b> na pilha. Quantos vai ofertar neste Rito de Iniciação?</p>
<div class="lx-ctl">${ctr(n, 1, 6)}<button type="button" class="b" data-lx="go">🎲 Ofertar ${pl(n, "dado", "dados")}</button></div>
${res ? tray(res.vals, (v) => v > 3) + `<div class="sum ${res.fresh ? "late" : ""}"><div class="verd ${s ? "w" : "l"}">${s} ${s == 1 ? "Clamor Favorável" : "Clamores Favoráveis"}</div>
<ul class="lx-list"><li>Cada dado que supera 3 (4, 5 ou 6) é uma oferenda de sucesso e dá 1 Clamor Favorável ao grupo.</li>
<li>Todos os <b>${res.vals.length}</b> dados ofertados foram <b>descartados</b>, deram certo ou não. Você começa o Thriller com <b>${6 - res.vals.length}</b> ${6 - res.vals.length == 1 ? "dado" : "dados"} na pilha.</li>
<li>${s == 0 ? "Nenhuma oferenda deu certo e você ainda perdeu os dados: esse é o risco do Rito." : res.vals.length >= 5 ? "Ofertar muito rende Clamores, mas você chega ao Encontro com a pilha quase vazia." : "Mais dados ofertados dão mais chances de Clamores, mas deixam sua pilha menor para o resto da sessão."}</li></ul></div>` : ""}`;
      if (res) { const f = res.fresh; res.fresh = false; if (f) animateDice(); }
    };
    body.onclick = (e) => {
      const a = e.target.closest("[data-lx]");
      if (!a) return;
      const k = a.dataset.lx;
      if (k == "m") n = cl(n - 1, 1, 6);
      if (k == "p") n = cl(n + 1, 1, 6);
      if (k == "go") { res = { vals: roll(n), fresh: true }; draw(); finish("Você fez um Rito de Iniciação."); return; }
      draw();
    };
    draw();
  };

  /* Testes de risco */
  const TESTES = [
    { n: "Armário com cupins", t: "Numa Cena de Suspense, você quer arrombar um armário devorado por cupins. Atributo: <b>Força</b>. Você <b>tem especialidade</b> em Força. Risco <b>Comum</b>.", dif: 3, need: 1, info: ["Com especialidade, a dificuldade padrão 4 cai 1: sucesso em <b>3, 4, 5 ou 6</b>.", "Risco Comum: basta <b>1 sucesso</b>."] },
    { n: "Porta reforçada", t: "Agora uma porta reforçada por barras de metal. <b>Força</b>, com especialidade. Risco <b>Complexo</b>.", dif: 3, need: 2, info: ["Com especialidade: sucesso em <b>3, 4, 5 ou 6</b>.", "Risco Complexo: são necessários <b>2 sucessos</b>."] },
    { n: "Com pé de cabra", t: "A mesma porta, mas você achou um pé de cabra: um <b>Recurso</b>, que aqui transforma o Risco Complexo em <b>Comum</b>.", dif: 3, need: 1, info: ["Um Recurso reduz a dificuldade em 1 <i>ou</i> transforma um Risco Complexo em Comum. Neste exemplo, ele faz o segundo: basta <b>1 sucesso</b>.", "Cada Recurso tem de 1 a 3 usos."] },
    { n: "Convencer o segurança", t: "Você quer convencer um segurança desconfiado a abrir o portão. Atributo: <b>Carisma</b>. Você <b>não tem especialidade</b> em Carisma. Risco <b>Comum</b>.", dif: 4, need: 1, info: ["Sem especialidade, vale a dificuldade padrão: sucesso em <b>4, 5 ou 6</b>.", "Risco Comum: basta <b>1 sucesso</b>."] },
  ];
  SIM.teste = (body, act, finish) => {
    let cur = 0, n = 2, pile = 6, res = null;
    const seen = TESTES.map(() => false);
    const draw = () => {
      const sc = TESTES[cur];
      n = cl(n, 1, Math.max(1, pile));
      let out = "";
      if (res) {
        const q = TESTES[res.sc], s = res.vals.filter((v) => v >= q.dif).length, f = res.vals.length - s, win = s >= q.need;
        out = tray(res.vals, (v) => v >= q.dif) + `<div class="sum ${res.fresh ? "late" : ""}"><div class="verd ${win ? "w" : "l"}">${win ? "Risco superado!" : "Risco NÃO superado"}</div>
<div>${pl(s, "sucesso", "sucessos")} (precisava de ${q.need}) · ${pl(f, "falha", "falhas")}</div>
<ul class="lx-list"><li>Você anunciou ${res.vals.length} ${res.vals.length == 1 ? "dado" : "dados"} e rolou <b>todos</b>, mesmo que um sucesso já tivesse saído: isso é obrigatório.</li>
<li>${f ? `As ${pl(f, "falha", "falhas")} saem da sua pilha. Em Cena de Suspense, elas são <b>sacrificadas</b>: vão para a pilha da Diretora e a deixam mais forte.` : "Nenhuma falha: você não perdeu dados."}</li>
${res.disaster ? `<li class="lx-warn"><b>Desastre:</b> você perdeu seu último dado. A ação é um desastre e a Sobrevivente não pode mais fazer testes nesta cena.</li>` : ""}</ul></div>`;
      }
      body.innerHTML = `<p>Treine com uma pilha de 6 dados. Escolha uma situação, decida quantos dados arriscar e role. Faça as quatro situações.</p>
<div class="lx-tabs">${TESTES.map((x, i) => `<button type="button" class="b o${i == cur ? " on" : ""}${seen[i] ? " seen" : ""}" data-lx="tab" data-i="${i}">${x.n}</button>`).join("")}</div>
<div class="lx-scn"><p style="margin:0 0 6px">${sc.t}</p><ul class="lx-list" style="margin:0">${sc.info.map((x) => `<li>${x}</li>`).join("")}</ul></div>
<div class="lx-stat"><span>Pilha de treino: <b>${pile}</b> ${dice(pile, 6)}</span></div>
<div class="lx-ctl"><div><div class="lab">Dados que quer arriscar</div>${ctr(n, 1, Math.max(1, pile))}</div><button type="button" class="b" data-lx="go" ${pile < 1 ? "disabled" : ""}>🎲 Rolar ${pl(n, "dado", "dados")}</button><button type="button" class="b o" data-lx="refill">Reabastecer pilha</button></div>
${pile < 1 ? '<p class="lx-warn">Sem dados: use “Reabastecer pilha” para continuar treinando.</p>' : ""}${out}`;
      if (res) { const f = res.fresh; res.fresh = false; if (f) animateDice(); }
    };
    body.onclick = (e) => {
      const a = e.target.closest("[data-lx]");
      if (!a) return;
      const k = a.dataset.lx;
      if (k == "tab") { cur = +a.dataset.i; res = null; }
      if (k == "m") n--;
      if (k == "p") n++;
      if (k == "refill") { pile = 6; res = null; }
      if (k == "go" && pile > 0) {
        n = cl(n, 1, pile);
        const vals = roll(n), q = TESTES[cur], f = vals.filter((v) => v < q.dif).length;
        pile -= f;
        res = { vals, sc: cur, fresh: true, disaster: pile == 0 && f > 0 };
        seen[cur] = true;
        draw();
        if (seen.every(Boolean)) finish("Você treinou as quatro situações.");
        return;
      }
      draw();
    };
    draw();
  };

  /* Teste de Susto */
  const SUSTOS = ["Um trovão inesperado estoura.", "O relógio antigo badala alto no escuro.", "Você tropeça em um cadáver.", "O assoalho velho range atrás de você."];
  SIM.susto = (body, act, finish) => {
    let pile = 6, cnt = 0, res = null;
    const draw = () => {
      body.innerHTML = `<p>Num Teste de Susto você rola <b>1 dado</b> da pilha, como num teste de Risco Comum. Faça 3 sustos.</p>
<div class="lx-stat"><span>Pilha: <b>${pile}</b> ${dice(pile, 6)}</span><span>Sustos feitos: <b>${cnt}</b></span></div>
<div class="lx-ctl"><button type="button" class="b" data-lx="go" ${pile < 1 ? "disabled" : ""}>🎲 Provocar um susto</button><button type="button" class="b o" data-lx="refill">Reabastecer pilha</button></div>
${pile < 1 ? '<p class="lx-warn">Sem dados na pilha. Reabasteça para continuar.</p>' : ""}
${res ? `<p><i>${res.txt}</i></p>` + tray([res.v], (v) => v >= 4) + `<div class="sum ${res.fresh ? "late" : ""}"><div class="verd ${res.v >= 4 ? "w" : "l"}">${res.v >= 4 ? "Manteve a compostura" : "Perdeu a compostura"}</div><p>${res.v >= 4 ? "Sucesso (4, 5 ou 6): nenhum dado perdido." : "Falha: o dado é <b>descartado</b>. Em Testes de Susto e em Encontros, as falhas vão para a pilha de descarte no centro da mesa, não para a Diretora."}</p></div>` : ""}`;
      if (res) { const f = res.fresh; res.fresh = false; if (f) animateDice(); }
    };
    body.onclick = (e) => {
      const a = e.target.closest("[data-lx]");
      if (!a) return;
      const k = a.dataset.lx;
      if (k == "refill") { pile = 6; res = null; }
      if (k == "go" && pile > 0) {
        const v = R6();
        if (v < 4) pile--;
        res = { v, txt: SUSTOS[cnt % SUSTOS.length], fresh: true };
        cnt++;
        draw();
        if (cnt >= 3) finish("Você enfrentou 3 sustos.");
        return;
      }
      draw();
    };
    draw();
  };

  /* Ações do Encontro */
  SIM.encontro = (body, act, finish) => {
    const init = () => ({ you: 4, ass: 5, ally: 2, fuga: 0, et: 3, desc: 6, used: {}, over: "", n: 2, a: "vazar", res: null });
    let s = init();
    const NOMES = { vazar: "Vazar Dali", cima: "Partir Para Cima", ajudar: "Ajudar Alguém", folego: "Recuperar o Fôlego" };
    const DESC = {
      vazar: "Teste de <b>Agilidade</b> (aqui você tem especialidade: sucesso em 3+). Cada sucesso vira 1 Dado de Fuga; um 6 vale 2.",
      cima: "Teste de <b>Força</b> (aqui sem especialidade: sucesso em 4+). Com pelo menos 1 sucesso, o Assassino descarta 1 dado.",
      ajudar: "Teste de um atributo à sua escolha (aqui, sem especialidade: 4+). Os sucessos são doados à aliada; as falhas não são descartadas.",
      folego: "Sem teste: você recebe +1 dado comum, pescado da pilha de descarte.",
    };
    const maxN = () => s.a == "ajudar" ? Math.min(s.you, 6 - s.ally) : s.you;
    const draw = () => {
      const mx = maxN();
      s.n = cl(s.n, 1, Math.max(1, mx));
      const used = Object.keys(s.used).length;
      const needsN = s.a != "folego";
      const blocked = s.over || (needsN && mx < 1) || (s.a == "folego" && (s.you >= 6 || s.desc < 1));
      let out = "";
      if (s.res) out = (s.res.vals ? tray(s.res.vals, (v) => v >= s.res.thr) : "") + `<div class="sum ${s.res.fresh ? "late" : ""}"><div class="verd w">${NOMES[s.res.a]}</div><ul class="lx-list">${s.res.lines.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
      body.innerHTML = `<p>Treino de ações de Encontro (sem o turno do Assassino). Faça as <b>quatro</b> ações pelo menos uma vez. Em um jogo real, você não sabe quantas Etapas de Fuga são necessárias; aqui o número é mostrado para treinar.</p>
<div class="lx-stat"><span>Sua pilha: <b>${s.you}</b></span><span>Dados de Fuga: <b>${s.fuga}/${s.et}</b></span><span>Assassino: <b>${s.ass}</b> dados</span><span>Aliada: <b>${s.ally}</b> dados</span></div>
<div class="lx-scn">${s.you < s.ass ? `<span class="lx-warn">⚠ Cuidado:</span> o Assassino pode usar <b>Matar</b> em quem tem menos dados que ele. Você (${s.you}) tem menos que ${s.ass}.` : `✔ O Assassino só pode usar Matar em quem tem <b>menos</b> dados que ele. Você (${s.you}) não tem menos que ${s.ass}, então Matar não pega você agora.`}</div>
<div class="lx-tabs">${Object.keys(NOMES).map((k) => `<button type="button" class="b o${k == s.a ? " on" : ""}${s.used[k] ? " seen" : ""}" data-lx="act" data-v="${k}">${NOMES[k]}</button>`).join("")}</div>
<p>${DESC[s.a]}</p>
<div class="lx-ctl">${needsN ? `<div><div class="lab">Dados que quer arriscar</div>${ctr(s.n, 1, Math.max(1, mx))}</div>` : ""}<button type="button" class="b" data-lx="go" ${blocked ? "disabled" : ""}>🎲 ${needsN ? "Usar " : ""}${NOMES[s.a]}</button><button type="button" class="b o" data-lx="reset">Recomeçar</button></div>
${s.over ? `<p class="lx-warn"><b>${s.over}</b> Use “Recomeçar” para treinar de novo.</p>` : ""}${!s.over && needsN && mx < 1 ? '<p class="lx-warn">Sem dados disponíveis para esta ação. Use Recuperar o Fôlego ou recomece.</p>' : ""}${out}`;
      if (s.res) { const f = s.res.fresh; s.res.fresh = false; if (f) animateDice(); }
    };
    body.onclick = (e) => {
      const a = e.target.closest("[data-lx]");
      if (!a) return;
      const k = a.dataset.lx;
      if (k == "act") { s.a = a.dataset.v; s.res = null; }
      if (k == "m") s.n--;
      if (k == "p") s.n++;
      if (k == "reset") { const u = s.used; s = init(); s.used = u; }
      if (k == "go" && !s.over) {
        const act = s.a, lines = [];
        if (act == "folego") {
          if (s.you < 6 && s.desc > 0) { s.you++; s.desc--; lines.push("Sem teste: +1 dado comum para a sua pilha, pescado do descarte. Agora você tem " + s.you + "."); s.res = { a: act, lines, fresh: true }; s.used[act] = 1; }
        } else {
          const n = cl(s.n, 1, maxN());
          if (n >= 1) {
            const vals = roll(n), thr = act == "vazar" ? 3 : 4, su = vals.filter((v) => v >= thr).length, f = n - su, six = vals.filter((v) => v == 6).length;
            if (act == "vazar") {
              const g = su + six;
              s.you -= n; s.fuga += g; s.desc += f;
              lines.push(`${pl(su, "sucesso", "sucessos")}${six ? `, incluindo ${pl(six, "dado 6", "dados 6")} (Fuga Vantajosa: conta como sucesso duplo, 2 dados de fuga)` : ""}: você ganha <b>${pl(g, "Dado de Fuga", "Dados de Fuga")}</b>.`);
              lines.push(`${pl(f, "falha", "falhas")} ${f == 1 ? "foi descartada" : "foram descartadas"}: em Encontro, falhas são descartadas, não sacrificadas.`);
              if (s.fuga >= s.et) { s.over = "Você escapou! Dados de Fuga iguais às Etapas de Fuga."; lines.push("Com Dados de Fuga iguais às Etapas de Fuga (" + s.et + "), a Sobrevivente escapa do Encontro."); }
            } else if (act == "cima") {
              s.you -= f; s.desc += f;
              if (su >= 1) { s.ass -= 1; s.desc += 1; lines.push(`${pl(su, "sucesso", "sucessos")}: o Assassino descarta <b>1 dado</b>, independente de quantos sucessos você tirou.`); }
              else lines.push("Nenhum sucesso: o Assassino não perde dado.");
              lines.push(`${pl(f, "falha", "falhas")} ${f == 1 ? "foi descartada" : "foram descartadas"} da sua pilha.`);
              if (s.ass <= 0) { s.ass = 0; s.over = "O Assassino ficou sem dados: foi derrotado por ora e o grupo ganha uma Pista."; }
            } else {
              s.you -= su; s.ally += su;
              lines.push(`${pl(su, "sucesso", "sucessos")}: ${su} ${su == 1 ? "dado é doado" : "dados são doados"} para a aliada e ${su == 1 ? "sai" : "saem"} da sua pilha.`);
              lines.push(`${pl(f, "falha", "falhas")}: ${f == 1 ? "esse dado" : "esses dados"} <b>não ${f == 1 ? "é descartado" : "são descartados"}</b> e continua${f == 1 ? "" : "m"} com você.`);
            }
            s.res = { a: act, vals, thr, lines, fresh: true };
            s.used[act] = 1;
          }
        }
        draw();
        if (Object.keys(s.used).length == 4) finish("Você usou as quatro ações.");
        return;
      }
      draw();
    };
    draw();
  };

  /* Ferir, Sequela e Cuidar de Feridas */
  SIM.ferir = (body, act, finish) => {
    const init = () => ({ fer: 0, seq: 0, pt: 5, dead: false, pend: null, res: null, acts: 0, ph: 0, msg: [] });
    let s = init();
    const draw = () => {
      const lock = s.dead || !!s.pend;
      body.innerHTML = `<p>Você é uma Sobrevivente de treino e o Assassino vai usar <b>Ferir</b> em você. Faça pelo menos 4 ações e tente curar a Ferida.</p>
<div class="lx-stat"><span>Ferida: <b>${s.fer}</b>/6</span><span>PT: <b>${s.pt}</b></span><span>PH do Assassino: <b>${s.ph}</b></span></div>
<div class="bar" style="--seg:6"><i style="width:${s.fer / 6 * 100}%"></i></div>
<div class="lx-stat"><span>Sequelas: <span class="cirs">${circ(s.seq, 5)}<span class="cirn"><b>${s.seq}</b>/5</span></span></span></div>
${s.dead ? '<p class="lx-warn"><b>A Sobrevivente morreu.</b> Use “Recomeçar”.</p>' : ""}
<div class="lx-ctl"><button type="button" class="b" data-lx="ferir" ${lock ? "disabled" : ""}>🎲 Assassino usa Ferir</button><button type="button" class="b o" data-lx="six" ${lock ? "disabled" : ""}>Forçar um 6 (treinar Mutilar)</button><button type="button" class="b o" data-lx="cura" ${lock ? "disabled" : ""}>Cuidar de Feridas (−1 PT, −1 Ferida)</button><button type="button" class="b o" data-lx="reset">Recomeçar</button></div>
${s.pend ? `<div class="lx-scn"><b>O Assassino tirou 6 no Ferir.</b> O que ele faz?<div class="lx-ctl"><button type="button" class="b" data-lx="matar">Matar</button><button type="button" class="b o" data-lx="mutilar">Mutilar</button></div></div>` : ""}
${s.res ? tray([s.res.v], (v) => v == 6) : ""}${s.msg.length ? `<div class="sum ${s.res && s.res.fresh ? "late" : ""}"><ul class="lx-list">${s.msg.map((x) => `<li>${x}</li>`).join("")}</ul></div>` : ""}`;
      if (s.res) { const f = s.res.fresh; s.res.fresh = false; if (f) animateDice(); }
    };
    const ferir = (v) => {
      s.res = { v, fresh: true }; s.msg = [];
      if (v == 6) { s.pend = { v }; s.msg.push("6 no Ferir: o Assassino escolhe entre <b>matar</b> a Sobrevivente na hora ou <b>Mutilar</b>."); return; }
      const ant = s.fer;
      s.fer = Math.min(6, s.fer + v); s.seq = Math.min(5, s.seq + 1);
      s.msg.push(`O dado ${v} vira o Dado Marcador de Ferida dela. Os valores se somam: Ferida ${ant} + ${v} = <b>${s.fer}</b>.`);
      s.msg.push(`Ela soma <b>+1 Sequela</b> (agora ${s.seq}/5).`);
      if (s.fer >= 6) { s.dead = true; s.msg.push("A Ferida chegou a 6: a Sobrevivente <b>morre</b>."); }
      else s.msg.push(`Agora Cuidar de Feridas só consegue baixar a Ferida até ${s.seq}, o número de Sequelas.`);
      s.acts++;
    };
    body.onclick = (e) => {
      const a = e.target.closest("[data-lx]");
      if (!a) return;
      const k = a.dataset.lx;
      if (k == "reset") s = init();
      if (k == "ferir" && !s.dead && !s.pend) ferir(R6());
      if (k == "six" && !s.dead && !s.pend) ferir(6);
      if (k == "matar" && s.pend) { s.pend = null; s.dead = true; s.msg = ["Com 6, o Assassino mata a Sobrevivente instantaneamente (o dado é descartado)."]; s.acts++; }
      if (k == "mutilar" && s.pend) {
        s.pend = null; s.msg = [];
        const ant = s.fer, sq = s.seq;
        s.seq = Math.min(5, s.seq + 3); s.ph += 4;
        s.fer = Math.max(s.fer, s.seq);
        s.msg.push(`<b>Mutilar:</b> o Assassino descarta o dado e a Sobrevivente continua viva, com <b>+3 Sequelas</b> (${sq} → ${s.seq}, máximo 5) e uma última chance de correr. Ela não recebe dado de Ferida.`);
        s.msg.push("O Assassino ganha <b>4 PH</b>.");
        if (s.fer > ant) s.msg.push(`A Ferida subiu de ${ant} para ${s.fer} só para não ficar abaixo das Sequelas. (O livro não esclarece este caso; as fichas do site tratam assim.)`);
        s.acts++;
      }
      if (k == "cura" && !s.dead && !s.pend) {
        s.msg = []; s.res = null;
        if (s.pt < 1) s.msg.push("Você não tem PT. Recomece para treinar de novo.");
        else if (s.fer <= s.seq) s.msg.push(`<b>Bloqueado:</b> a Ferida (${s.fer}) não pode ser reduzida abaixo do número de Sequelas (${s.seq}). Gastar PT aqui seria desperdício.`);
        else { s.fer--; s.pt--; s.msg.push(`Você gastou 1 PT e a Ferida caiu para <b>${s.fer}</b>. (Cuidar de Feridas é uma Vantagem, comprada fora de Encontro.)`); }
        s.acts++;
      }
      draw();
      if (s.acts >= 4) finish("Você praticou Ferir, Sequela e Cuidar de Feridas.");
    };
    draw();
  };

  /* ---------------------------------------------------------------- CONTEÚDO */
  const Q = (s, opts) => ({ s, opts });
  const Y = (t, w) => ({ t, w, ok: true });
  const N = (t, w) => ({ t, w });
  const ACT = {
    1: [{ id: "1a", kind: "quiz", title: "Quem faz o quê?", qs: [
      Q("Alguém precisa narrar o ambiente, dar vida ao Assassino e responder às ações dos Intérpretes. Quem faz isso?", [
        Y("A Diretora.", "Ela constrói a história ao lado dos Intérpretes e conduz o Assassino."),
        N("Um Intérprete sorteado a cada cena.", "Cada Intérprete controla a própria Sobrevivente; quem conduz o Assassino é a Diretora."),
        N("O próprio Assassino, sozinho.", "O Assassino é a ameaça da história, não uma pessoa na mesa. Quem o controla é a Diretora."),
      ]),
      Q("Uma Sobrevivente falha em um teste durante uma Cena de Suspense. Quem se fortalece com esse erro?", [
        Y("O Assassino: o dado vai para a pilha da Diretora.", "Em Cenas Livres e de Suspense, dados que falham são sacrificados e vão para a pilha da Diretora."),
        N("Ninguém, o dado simplesmente some.", "Ele não some: é sacrificado e passa para a Diretora."),
        N("Outra Sobrevivente, que fica com o dado.", "Os dados sacrificados vão para a pilha da Diretora, não para outra Sobrevivente."),
      ]),
    ] }],
    2: [{ id: "2a", kind: "quiz", title: "Como um filme de terror", qs: [
      Q("No meio da madrugada você ouve um barulho estranho vindo do sótão. Qual atitude combina com BRUTAL e pode render PT?", [
        Y("Subir sozinha para checar o barulho, como num slasher.", "Arriscar a Sobrevivente de propósito com uma ação clichê de terror pode render PT, na quantidade definida pela Diretora."),
        N("Ficar quieta no sofá e fingir que nada aconteceu.", "Não há risco nem clichê, então não há recompensa."),
        N("Pedir à Diretora que o barulho deixe de existir.", "PT vêm de desafios e de arriscar a Sobrevivente, não de fugir da cena."),
      ]),
      Q("Você escolheu o arquétipo Nerd. Você é obrigada a interpretá-lo sempre como certinho e medroso?", [
        Y("Não: o arquétipo é só uma base para a sua Sobrevivente.", "O livro diz que Nerds não precisam ser certinhos e que cada um pode reinventar o clichê."),
        N("Sim, as regras exigem o clichê.", "As regras não exigem isso; o arquétipo é uma carapuça que você veste do jeito que quiser."),
        N("Só durante os Encontros.", "Não existe essa distinção: a interpretação é livre em qualquer cena."),
      ]),
    ] }],
    3: [
      { id: "3a", kind: "sim", sim: "rito", title: "Faça o seu Rito de Iniciação", intro: "Antes de qualquer cena, os Intérpretes arriscam dados para ganhar Clamores. Experimente quantas ofertas quiser." },
      { id: "3b", kind: "quiz", title: "Conferindo o Rito", qs: [
        Q("Você oferta 4 dados e tira 1, 3, 4 e 6. Quantos Clamores Favoráveis ganha e quantos dados perde?", [
          Y("2 Clamores e perde os 4 dados.", "Só 4 e 6 superam 3. Todos os dados ofertados são descartados, deem certo ou não."),
          N("3 Clamores e perde 1 dado.", "O 3 não supera 3, e os dados ofertados são todos descartados."),
          N("2 Clamores e perde só os 2 que falharam.", "Os dados que tiraram 4 e 6 também são descartados no fim do Rito."),
        ]),
        Q("Quando o Rito termina, o que acontece com os dados que foram ofertados?", [
          Y("Todos vão para a pilha de descarte.", "Os dados ofertados são sempre descartados ao fim do Rito de Iniciação, independente do resultado."),
          N("Os que deram certo voltam para a sua pilha.", "Nenhum volta: o custo da oferenda é real."),
          N("Vão para a pilha da Diretora.", "No Rito eles vão para o descarte, não para a Diretora."),
        ]),
      ] },
    ],
    4: [{ id: "4a", kind: "quiz", des: true, title: "Desafio: para onde vai o dado?", qs: [
      Q("Numa Cena de Suspense você arrisca 3 dados e 2 falham. O que acontece com esses 2?", [
        Y("São sacrificados: vão para a pilha da Diretora.", "Em Cenas Livres e de Suspense, falhas são sacrificadas."),
        N("Vão para a pilha de descarte, no centro da mesa.", "O descarte é para falhas em Encontros e em Testes de Susto."),
        N("Voltam para a sua pilha.", "Dados que falham sempre saem da sua pilha."),
      ]),
      Q("Durante um Encontro você falha em um dado. Para onde ele vai?", [
        Y("Para a pilha de descarte, no centro da mesa.", "Em Encontros, falhas são descartadas, a não ser que alguma situação diga o contrário."),
        N("Para a pilha da Diretora.", "Isso vale para Cenas Livres e de Suspense, não para Encontros."),
        N("Fica com você como Dado Marcador.", "Dados Marcadores são outra coisa: marcam condições como Ferida."),
      ]),
      Q("Um Teste de Susto falha. O que acontece com o dado?", [
        Y("É descartado.", "Nos Testes de Susto as falhas são sempre descartadas."),
        N("É sacrificado à Diretora.", "No Susto o dado vai para o descarte, não para a Diretora."),
        N("Nada: no Susto ninguém perde dados.", "Perde: a falha descarta o dado e representa a perda de compostura."),
      ]),
      Q("Você ficou sem nenhum dado na pilha e o Assassino chega num Encontro. O que acontece?", [
        Y("A Sobrevivente morre instantaneamente.", "Com a pilha vazia, a Sobrevivente morre de imediato em um Encontro com o Assassino."),
        N("Nada, você ainda pode agir normalmente.", "Sem dados você nem consegue fazer testes."),
        N("Você ganha 1 dado de graça.", "Dados só voltam por Choque de Realidade ou Recuperar o Fôlego."),
      ]),
    ] }],
    5: [
      { id: "5a", kind: "sim", sim: "teste", title: "Role testes de risco", intro: "Cada situação tem dificuldade e quantidade de sucessos próprias. Veja como os dados reagem." },
      { id: "5b", kind: "quiz", des: true, title: "Desafio: regras do teste", qs: [
        Q("Você anunciou 3 dados e o primeiro deu 6. Pode parar de rolar?", [
          Y("Não: tem de rolar os 3 dados anunciados.", "O Intérprete é obrigado a rolar a quantidade que anunciou, mesmo que já tenha obtido um sucesso."),
          N("Sim, um sucesso já basta.", "O sucesso basta para superar o risco, mas os dados anunciados precisam ser rolados."),
          N("Sim, e guarda os outros 2 dados.", "Não existe essa opção: todos os dados anunciados são rolados."),
        ]),
        Q("Você tem especialidade no atributo do teste. Quais valores são sucesso?", [
          Y("3, 4, 5 e 6.", "A especialidade reduz a dificuldade padrão (4) em 1."),
          N("4, 5 e 6.", "Esses valem sem especialidade."),
          N("Só o 6.", "O 6 é só uma face a mais; sucesso é a partir da dificuldade."),
        ]),
        Q("Quantos sucessos são necessários para superar um Risco Complexo?", [
          Y("Dois.", "Riscos Complexos exigem dois sucessos."),
          N("Um, como no Risco Comum.", "Um sucesso é para o Risco Comum."),
          N("Três.", "O livro pede dois sucessos."),
        ]),
        Q("Você perde seu último dado em um teste. O que significa?", [
          Y("A ação é um desastre e você não pode mais fazer testes na cena.", "É o efeito de perder o último dado."),
          N("Você morre na hora, em qualquer cena.", "A morte instantânea vale para Encontros com a pilha vazia, não para qualquer teste."),
          N("Nada de especial, você segue rolando.", "Sem dados você não faz mais testes na cena."),
        ]),
      ] },
    ],
    6: [{ id: "6a", kind: "quiz", title: "Qual atributo usar?", qs: [
      Q("Você quer arrastar uma estante pesada para bloquear a porta. Qual atributo faz mais sentido?", [
        Y("Força.", "Força é a potência física."),
        N("Astúcia.", "Astúcia é conhecimento e raciocínio."),
        N("Carisma.", "Carisma é a habilidade interpessoal."),
      ]),
      Q("Você quer convencer um desconhecido desconfiado a lhe dar carona. Qual atributo?", [
        Y("Carisma.", "Carisma é a habilidade interpessoal."),
        N("Vigor.", "Vigor é resiliência física."),
        N("Agilidade.", "Agilidade é velocidade, destreza e reflexos."),
      ]),
      Q("Você está machucada e precisa continuar de pé, aguentando a dor. Qual atributo?", [
        Y("Vigor.", "Vigor é a resiliência física."),
        N("Astúcia.", "Astúcia é conhecimento e raciocínio, não aguentar dor."),
        N("Carisma.", "Carisma não ajuda a resistir ao próprio corpo."),
      ]),
      Q("A Diretora sugeriu Força, mas você tem uma ideia melhor usando outro atributo. O que fazer?", [
        Y("Explicar sua ideia antes de rolar; a palavra final é da Diretora.", "O Intérprete pode sugerir um atributo antes da rolagem, e a decisão final é da Diretora."),
        N("Rolar o atributo que você quiser, sem avisar.", "O atributo é combinado antes da rolagem."),
        N("Aceitar sempre o atributo sugerido, sem opinar.", "Você pode e deve sugerir outro, explicando a sua ideia."),
      ]),
    ] }],
    7: [{ id: "7a", kind: "quiz", title: "Em que cena você está?", qs: [
      Q("Os Intérpretes seguem uma ordem de iniciativa, um depois do outro. Que tipo de cena é essa?", [
        Y("Cena de Encontro.", "Só nos Encontros há ordem de iniciativa."),
        N("Cena de Suspense.", "Suspense é organizada em rodadas, sem iniciativa."),
        N("Cena Livre.", "Cenas Livres não têm ordem de ações."),
      ]),
      Q("Três Sobreviventes seguem o mesmo Caminho, que tem uma Armadilha de Ferir. Quem sofre o efeito?", [
        Y("Só a primeira.", "Se várias seguem o mesmo Caminho com Armadilha, apenas a primeira sofre a ação, e a Armadilha é inutilizada."),
        N("As três.", "A única exceção é a ação de Assustar, que afeta todas."),
        N("Nenhuma, a Armadilha só vale para quem investiga.", "Quem segue por um caminho armadilhado é afetada."),
      ]),
      Q("O mesmo Caminho tem uma Armadilha de Assustar. Agora, quem sofre?", [
        Y("Todas as que seguirem esse Caminho na mesma rodada.", "Assustar é a exceção: afeta todas que seguirem o mesmo Caminho na rodada."),
        N("Só a primeira.", "Para as outras ações é só a primeira, mas Assustar é a exceção."),
        N("Só a mais corajosa.", "Não existe essa regra."),
      ]),
      Q("Você quer descobrir um Passo da Resolução usando a ação da rodada. Qual Abordagem?", [
        Y("Investigativa.", "Um teste complexo de Astúcia ou Carisma; com sucesso, a Sobrevivente conhece um Passo."),
        N("Direta.", "Na Direta você segue o Caminho sem cuidado e fica sujeita às Armadilhas."),
        N("Cautelosa.", "A Cautelosa lida com as Armadilhas do Caminho, mas não descobre nenhum Passo."),
      ]),
      Q("Você quer ter a chance de desativar qualquer Armadilha do Caminho que vai seguir. Qual Abordagem?", [
        Y("Cautelosa.", "Com um teste definido pela Diretora, ela pode desativar qualquer Armadilha do Caminho, mas não descobre Passos."),
        N("Investigativa.", "A Investigativa serve para conhecer um Passo, não para desarmar Armadilhas."),
        N("Direta.", "A Direta deixa você sujeita às Armadilhas."),
      ]),
    ] }],
    8: [
      { id: "8a", kind: "sim", sim: "susto", title: "Enfrente alguns sustos", intro: "A Diretora pede um Teste de Susto sempre que algo chocante acontece." },
      { id: "8b", kind: "quiz", title: "Sobre o Susto", qs: [
        Q("Quantos dados você rola em um Teste de Susto?", [
          Y("Um único dado da pilha.", "O Susto é rolado como um Teste de Risco Comum com um dado."),
          N("Todos os dados da pilha.", "O Susto arrisca só um dado."),
          N("Quantos você quiser, como em outros testes.", "No Susto a quantidade é fixa: um dado."),
        ]),
        Q("Você encontra um cadáver na cena. Quem decide pedir o Teste de Susto?", [
          Y("A Diretora.", "Um Teste de Susto pode ser requisitado pela Diretora para representar uma cena chocante."),
          N("Cada Intérprete escolhe se quer rolar.", "Quem requisita o teste é a Diretora."),
          N("Ninguém: o teste é automático em toda cena.", "Ele só é pedido em momentos chocantes."),
        ]),
      ] },
    ],
    9: [{ id: "9a", kind: "quiz", des: true, title: "Desafio: gastando Pontos de Tensão", qs: [
      Q("Em pleno Encontro, com 6 PT, você quer comprar Choque de Realidade. Pode?", [
        Y("Não: no Encontro a compra de Vantagens é proibida, salvo situação especial.", "Vantagens são compradas fora de Encontro. As exceções são especiais, como a habilidade Home Run do Atleta ou a Qualidade Morte Iminente (esta, exceto Choque de Realidade)."),
        N("Sim, custa 6 PT.", "O custo está certo, mas durante o Encontro a compra é proibida."),
        N("Sim, desde que seja a primeira compra da sessão.", "Não existe essa permissão."),
      ]),
      Q("Você está com Ferida 3 e 1 Sequela. Qual o máximo de PT que vale gastar em Cuidar de Feridas?", [
        Y("2 PT.", "A Ferida cai 1 por PT, mas nunca abaixo das Sequelas: de 3 até 1 são 2 pontos."),
        N("3 PT.", "O terceiro PT seria desperdiçado: a Ferida não pode ficar abaixo de 1."),
        N("1 PT.", "Dá para reduzir mais um ponto sem passar do piso das Sequelas."),
      ]),
      Q("Uma Sobrevivente sem especialidade em Força quer comprar “Ele Não Espera Por Mim”. Pode?", [
        Y("Não: é uma Vantagem de especialidade em Força.", "Vantagens ligadas a um atributo só podem ser compradas por quem tem especialidade nele."),
        N("Sim, é só ter 3 PT.", "O custo está certo, mas falta a especialidade."),
        N("Sim, se a Diretora deixar.", "A regra do livro exige a especialidade; a Diretora não a substitui."),
      ]),
      Q("O que Choque de Realidade custa e o que faz?", [
        Y("6 PT: +1 dado comum na sua pilha.", "A pilha continua limitada a 6 dados."),
        N("3 PT: recupera uma especialidade.", "Esse é o Tomar Jeito."),
        N("6 PT: cura toda a sua Ferida.", "Quem reduz Ferida é Cuidar de Feridas."),
      ]),
      Q("Quantos PT você tem no começo do Thriller e qual o máximo que pode acumular?", [
        Y("Começa com 0 e acumula até 10.", "É o que o livro estabelece."),
        N("Começa com 6 e acumula até 6.", "Esses números são dos dados da pilha, não dos PT."),
        N("Começa com 3 e não tem limite.", "Os PT começam em 0 e têm limite de 10."),
      ]),
    ] }],
    10: [
      { id: "10a", kind: "sim", sim: "encontro", title: "Treine as ações do Encontro", intro: "Use Vazar Dali, Partir Para Cima, Ajudar Alguém e Recuperar o Fôlego e veja o que cada uma muda na mesa." },
      { id: "10b", kind: "quiz", des: true, title: "Desafio: o que fazer agora?", qs: [
        Q("O Assassino tem 5 dados e você também tem 5. Ele pode usar Matar em você?", [
          Y("Não: Matar só pega quem tem menos dados que ele.", "Com 5 contra 5, você não tem menos dados que ele."),
          N("Sim, ele sempre pode usar Matar.", "A ação exige que o alvo tenha menos dados que a pilha do Assassino."),
          N("Só se você estiver ferida.", "A condição é a quantidade de dados, não a Ferida."),
        ]),
        Q("Você tem 4 dados, o Assassino tem 5, e quer sair da faixa de risco do Matar sem fazer teste. Qual ação?", [
          Y("Recuperar o Fôlego.", "É a única que garante +1 dado sem teste: você fica com 5 e deixa de ter menos que ele."),
          N("Distrair.", "Distrair só faz o Assassino gastar +1 dado se usar Matar; ele ainda pode matar você."),
          N("Vazar Dali.", "É um teste: as falhas são descartadas e você pode ficar com ainda menos dados."),
        ]),
        Q("Você é a última Sobrevivente no Encontro e quer usar Arriscar Tudo. Pode?", [
          Y("Não: não se pode usar Arriscar Tudo sendo a última presente.", "Além disso, só pode ser usada uma vez por sessão."),
          N("Sim, é a melhor hora.", "A ação é proibida para a última Sobrevivente do Encontro."),
          N("Sim, mas só se ainda tiver 3 dados.", "Não existe essa condição."),
        ]),
        Q("Você usa Ajudar Alguém com 4 dados: 3 sucessos e 1 falha. O que acontece com o dado que falhou?", [
          Y("Não é descartado: continua com você.", "Só os dados de sucesso são doados; as falhas nesse teste não são descartadas."),
          N("É descartado, como em qualquer falha de Encontro.", "Ajudar Alguém é a exceção: as falhas ficam com você."),
          N("É doado junto com os outros.", "Só os sucessos são doados."),
        ]),
        Q("Qual destas situações NÃO encerra uma Cena de Encontro?", [
          Y("Uma Sobrevivente falha em um teste.", "Falhar não encerra o Encontro."),
          N("O Assassino fica sem dados.", "Encerra: o Assassino é derrotado por ora."),
          N("Todas as Sobreviventes escapam.", "Encerra: não há mais ninguém no Encontro."),
        ]),
      ] },
    ],
    11: [
      { id: "11a", kind: "sim", sim: "ferir", title: "Sinta uma Ferida e uma Sequela", intro: "Veja como o Dado Marcador de Ferida e as Sequelas se comportam e por que Cuidar de Feridas tem um limite." },
      { id: "11b", kind: "quiz", des: true, title: "Desafio: Feridas e Sequelas", qs: [
        Q("Você tem Ferida 2 e nenhuma Sequela. O Assassino usa Ferir e tira 4. O que acontece?", [
          Y("A Ferida chega a 6 e a Sobrevivente morre.", "Os valores dos Dados Marcadores se somam: 2 + 4 = 6."),
          N("Ferida 4 e 1 Sequela.", "A Ferida soma o valor novo ao antigo, não o substitui."),
          N("Só ganha uma Sequela.", "Além da Sequela, o dado entra na Ferida."),
        ]),
        Q("Você tem Ferida 3 e 2 Sequelas e gasta 3 PT em Cuidar de Feridas. Qual a Ferida final?", [
          Y("2.", "A Ferida nunca pode ser reduzida abaixo do número de Sequelas."),
          N("0.", "Seria 0 sem o piso, mas as Sequelas impedem."),
          N("3.", "A cura funciona até o piso das Sequelas: dá para baixar 1."),
        ]),
        Q("Quando uma Sobrevivente recebe Sequela?", [
          Y("Sempre que sofre Ferir do Assassino e não morre (+1).", "Também recebe com Mutilar (+3). Ela acumula até 5."),
          N("Sempre que falha em um teste.", "Falhar em teste custa dados, não Sequelas."),
          N("Só quando chega a Ferida 6.", "Com Ferida 6 ela morre."),
        ]),
        Q("O Assassino tira 6 no Ferir e escolhe Mutilar. O que acontece?", [
          Y("Ela vive, com +3 Sequelas, e o Assassino ganha 4 PH.", "O dado é descartado e ela ganha uma última chance de correr."),
          N("Ela morre e o Assassino ganha 4 PH.", "Matar e Mutilar são escolhas diferentes: Mutilar não mata."),
          N("Ela ganha 3 pontos de Ferida.", "Mutilar dá Sequelas, não dado de Ferida."),
        ]),
      ] },
    ],
    12: [{ id: "12a", kind: "quiz", title: "Montando sua Sobrevivente", qs: [
      Q("Quantas Habilidades uma Sobrevivente nova escolhe?", [
        Y("Apenas 1 das 5 do arquétipo.", "As outras só chegam com Cicatrizes, depois de sobreviver a um Thriller."),
        N("Todas as 5.", "Sobreviventes de primeira viagem escolhem uma só."),
        N("2 das 5.", "Na criação é uma Habilidade."),
      ]),
      Q("Quando uma Sobrevivente pode ganhar uma Cicatriz?", [
        Y("Depois de sobreviver a um Thriller, se a Diretora permitir.", "A Cicatriz é uma habilidade nova: outra do arquétipo, a de uma sobrevivente morta ou a Cicatriz de Sobrevivente."),
        N("Ao ser ferida pela primeira vez.", "Ferida e Cicatriz não são a mesma coisa."),
        N("Quando acumula 10 PT.", "PT não dão Cicatrizes."),
      ]),
      Q("Quais Apegos você cria ao montar sua Sobrevivente?", [
        Y("1 Item Icônico, 1 Relação Afetiva e 1 Desejo Obscuro.", "O livro pede um de cada."),
        N("Só um Desejo Obscuro.", "São três Apegos, um de cada tipo."),
        N("3 Itens Icônicos.", "São tipos diferentes: um de cada."),
      ]),
      Q("Revelar parte de um Desejo Obscuro numa cena rende quantos PT?", [
        Y("3 PT.", "Item Icônico dá 1 PT, Relação Afetiva dá 2 e Desejo Obscuro dá 3."),
        N("1 PT.", "1 PT é a recompensa do Item Icônico."),
        N("2 PT.", "2 PT é a recompensa da Relação Afetiva."),
      ]),
    ] }],
    13: [{ id: "13a", kind: "quiz", des: true, title: "Desafio final", qs: [
      Q("Um trovão estoura e a Diretora pede um Teste de Susto. Quantos dados você rola e o que perde se falhar?", [
        Y("Rola 1 dado; se falhar, ele é descartado.", "É o Teste de Susto."),
        N("Rola todos; os que falharem vão para a Diretora.", "No Susto rola-se um dado e a falha vai para o descarte."),
        N("Rola 1 dado; se falhar, ele é sacrificado.", "No Susto a falha é descartada, não sacrificada."),
      ]),
      Q("Por que guardar dados na pilha é tão importante em um Encontro?", [
        Y("Porque o Assassino pode Matar quem tem menos dados que ele.", "Quanto mais dados você tiver, mais difícil é virar alvo de Matar."),
        N("Porque o Assassino só ataca quem tem dados de sobra.", "Acontece o contrário."),
        N("Porque dados na pilha dão PT.", "Dados não rendem PT."),
      ]),
      Q("Quando você deve gastar PT em Vantagens?", [
        Y("Fora de Encontro.", "Durante o Encontro a compra é proibida, salvo exceções especiais."),
        N("Só no meio do Encontro.", "É o contrário."),
        N("A qualquer momento.", "Há restrição: nos Encontros a compra de Vantagens é proibida."),
      ]),
      Q("Um aliado está com poucos dados num Encontro. Que ação ajuda?", [
        Y("Ajudar Alguém.", "Os dados de sucesso do seu teste são doados a ele, e suas falhas não são descartadas."),
        N("Recuperar o Fôlego.", "Essa ação dá um dado a você, não a um aliado."),
        N("Distrair.", "Ela encarece o Matar do Assassino, mas não dá dados a ninguém."),
      ]),
      Q("O grupo zera os dados do Assassino em um Encontro. O que ganha?", [
        Y("Uma Pista sobre como derrotá-lo de novo.", "A Pista conta como um recurso ilimitado compartilhado pelo grupo, caso faça sentido na ação."),
        N("O Assassino morre para sempre.", "A morte do Assassino é uma decisão narrativa da Diretora."),
        N("1 dado extra para cada Intérprete.", "O livro não dá dados extras por derrotá-lo."),
      ]),
    ] }],
  };
  const NOMES_L = {};

  /* ---------------------------------------------------------------- PROGRESSO */
  const lessonDone = (n) => (ACT[n] || []).every((a) => LX.done[a.id]);
  const count = () => { let c = 0; for (let n = 1; n <= TOTAL; n++) if (lessonDone(n)) c++; return c; };
  function refresh() {
    const app = document.getElementById("app");
    if (!app) return;
    const p = app.querySelector("#lx-host .lx-pg");
    if (!p) return;
    const c = count();
    p.querySelector(".lx-cnt").textContent = `${c} de ${TOTAL} lições`;
    const bar = p.querySelector(".lx-bar");
    bar.setAttribute("aria-valuenow", c);
    bar.querySelector("i").style.width = (c / TOTAL * 100) + "%";
    p.querySelectorAll(".lx-seg").forEach((b, i) => b.classList.toggle("done", lessonDone(i + 1)));
    p.querySelector(".lx-msg").textContent = c == TOTAL ? "Treinamento completo! Agora monte a sua Sobrevivente em “Minha Ficha”." : c ? "Continue de onde parou: cada lição tem as suas atividades práticas." : "Cada lição tem atividades práticas. A lição fica marcada quando você conclui todas as atividades dela.";
  }
  function mount(host, act) {
    const wrap = document.createElement("div");
    wrap.className = "lx-act";
    wrap.dataset.act = act.id;
    const tag = act.des ? '<span class="lx-tag des">Desafio</span>' : act.kind == "sim" ? '<span class="lx-tag">Simulação</span>' : '<span class="lx-tag">Situações</span>';
    wrap.innerHTML = `<div class="lx-h">${tag}<h4>${act.title}</h4><span class="lx-ck" ${LX.done[act.id] ? "" : "hidden"}>✔ concluída</span></div>${act.intro ? `<p class="lx-intro">${act.intro}</p>` : ""}<div class="lx-body"></div><div class="lx-fin" hidden></div>`;
    host.append(wrap);
    const body = wrap.querySelector(".lx-body"), fin = wrap.querySelector(".lx-fin");
    const finish = (msg, score) => {
      LX.done[act.id] = 1;
      if (typeof score == "number") LX.sc[act.id] = Math.max(LX.sc[act.id] || 0, score);
      save();
      wrap.querySelector(".lx-ck").hidden = false;
      fin.hidden = false;
      fin.innerHTML = `<b>✔ Atividade concluída.</b> ${msg || ""} <button type="button" class="b o" data-lx="redo">Refazer</button>`;
      refresh();
    };
    const start = () => { fin.hidden = true; (act.kind == "quiz" ? quiz : SIM[act.sim])(body, act, finish); };
    wrap.addEventListener("click", (e) => { if (e.target.closest('[data-lx="redo"]')) start(); });
    start();
  }
  function build() {
    const app = document.getElementById("app");
    const host = app && app.querySelector("#lx-host");
    if (!host || host.dataset.ready) return;
    host.dataset.ready = "1";
    const tpl = document.getElementById("learn-template");
    const tit = tpl ? [...tpl.content.querySelectorAll("details > summary")].map((x) => x.textContent.trim().replace(/\s+/g, " ")) : [];
    for (let n = 1; n <= TOTAL; n++) if (!tit[n - 1]) tit[n - 1] = "Lição " + n;
    host.innerHTML = `<h2>Desafios</h2><p class="lx-sub">Pratique as regras do BRUTAL com situações, simulações de dados e pequenos desafios. Cada bloco corresponde a uma lição de “Aprender a Jogar”.</p>`;
    const p = document.createElement("div");
    p.className = "lx-pg";
    p.innerHTML = `<div class="lx-pg-h"><b>Seu progresso</b><span class="lx-cnt"></span></div><div class="lx-bar" role="progressbar" aria-label="Progresso nos desafios" aria-valuemin="0" aria-valuemax="${TOTAL}"><i></i></div><div class="lx-segs">${tit.map((t, i) => `<button type="button" class="lx-seg" data-lx="go" data-i="${i}" title="${t}" aria-label="${t}">${i + 1}</button>`).join("")}</div><p class="lx-msg"></p><button type="button" class="b o lx-reset" data-lx="reset">Reiniciar progresso</button>`;
    host.append(p);
    const secs = [];
    const fill = () => {
      secs.length = 0;
      host.querySelectorAll(".lx-les").forEach((x) => x.remove());
      tit.forEach((t, i) => {
        const sec = document.createElement("section");
        sec.className = "lx-les";
        sec.innerHTML = `<h3>${t.replace(/</g, "&lt;")}</h3>`;
        const box = document.createElement("div");
        box.className = "lx";
        box.dataset.les = i + 1;
        sec.append(box);
        host.append(sec);
        secs.push(sec);
        (ACT[i + 1] || []).forEach((a) => mount(box, a));
      });
    };
    fill();
    p.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lx]");
      if (!b) return;
      if (b.dataset.lx == "go") secs[+b.dataset.i].scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });
      if (b.dataset.lx == "reset") {
        LX = { done: {}, sc: {} };
        save();
        fill();
        refresh();
      }
    });
    refresh();
  }
  const app = document.getElementById("app");
  if (app) {
    new MutationObserver(() => { if (app.querySelector("#lx-host:not([data-ready])")) build(); }).observe(app, { childList: true });
    build();
  }
})();
