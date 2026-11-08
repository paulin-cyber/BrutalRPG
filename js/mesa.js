/* ==== Mesa da Diretora (módulo ms) ====
 * Condução do Encontro: turnos, Testes de Susto, Matar/Ferir/Mutilar/Escapar/Dificultar, poderes do Assassino,
 * ações das sobreviventes, condições e consulta rápida das regras.
 * Reaproveita o que o site já tem: D.sob, COND, AR/AT, cnt(), D.ph/D.log e a confirmação de exclusão (cf).
 * Os textos de regras vêm do Glossário (window.GLX). Regras: PDF oficial do BRUTAL RPG. */
(function () {
  "use strict";

  const INI_ORD = ["heroi", "atleta", "valentona", "esbelto", "inocente", "nerd", "relaxado", "cetica"];
  const CCOR = { segurar: "#d1121f", infectar: "#6aa84f", possuir: "#8a1fb0", restringir: "#d9a21b", amaldicoar: "#5b3a8a", incapacitar: "#8a8a8a", destruir: "#8a8a8a" };
  const ACOES_SOB = ["Vazar Dali", "Partir Para Cima", "Recuperar o Fôlego", "Ajudar Alguém", "Distrair", "Arriscar Tudo"];
  const MAIS = ["Teste", "Risco Complexo", "Especialidade", "Vazar Dali", "Partir Para Cima", "Ferir", "Matar", "Ferida", "Sequela", "Dado Marcador", "Etapas de Fuga", "Fim do encontro"];

  /* Estado só de tela (não é salvo). */
  const UI = { ex: new Set(), quem: "", acao: "", conf: false, alvo: "", rs: "", rv: { n: 1, s: 0, six: 0, cx: null, dest: "", vf: false, ma: false, po: false }, inc: "", mpk: "", mpv: "", shc: "", trauma: false, fresh: new Set() };

  /* Troca o tratamento do livro pelo usado no site (textos do Glossário exibidos na Mesa). */
  const mt = (s) => String(s);

  const morta = (x) => x.fer >= 6;
  const pres = (x) => !morta(x) && !x.aus; /* presente na cena (não ausente do encontro) */
  const ativa = (x) => pres(x) && !x.esc;
  const temCond = (x, k) => x.cond.some((c) => c.k === k);
  const nomeSob = (x, i) => String(x.n || "").trim() || (AR[x.arq] ? AR[x.arq][0] : "Sobrevivente " + ((i < 0 ? D.sob.indexOf(x) : i) + 1));
  const nm = (x) => nomeSob(x, D.sob.indexOf(x));
  const nomeAss = () => String(D.nome || "").trim() || "Assassino";
  const pl = (n, s, p) => n + " " + (n == 1 ? s : p);
  const freq = (d) => {
    const m = /1×\/(encontro|sessão|cena|Suspense)/i.exec(d || "");
    return m ? m[1].toLowerCase() : "";
  };
  const habInfo = (h) => {
    const p = AR[h.k][4][h.i].split("|");
    return { n: p[0], d: p[1] || "", f: freq(p[1]), a: AR[h.k][0] };
  };
  const pilha = (x) => x.dados + x.fuga;
  const menorPilha = () => D.sob.filter(ativa).reduce((m, x) => Math.min(m, pilha(x)), Infinity);
  const maiorPilha = () => D.sob.filter(ativa).reduce((m, x) => Math.max(m, pilha(x)), 0);
  const maxSustos = () => Math.max(0, 7 - tot());
  const pas = () => (D.pas == 2 ? D.a2 : D.a1);
  const temP = (n) => pas() === n;
  const temAmeaca = (n) => D.a1 === n || D.a2 === n;
  const temAU = (n) => D.au1 === n || D.au2 === n;
  const pe = (n) => D.pe === n;
  const usou = (k) => D.enc.us.includes(k);
  const marca = (k) => { if (!usou(k)) D.enc.us.push(k); };
  const rnd6 = () => 1 + Math.floor(Math.random() * 6);
  /* Dado 3D do site (mesma animação das outras rolagens): só gira quando acabou de ser rolado aqui. */
  const dadoH = (v, key, cls) => die(v, cls, UI.fresh.delete(key), "");
  const dnome = (x) => (x ? nm(x) : "");
  /* Habilidade de arquétipo da sobrevivente, ainda não usada (por nome). */
  const habDe = (x, re) => x.hab.find((h) => re.test(AR[h.k][4][h.i].split("|")[0]));

  /* ------------------------------------------------------------------ PH (sem limite máximo; cada acontecimento gera PH uma vez) */
  function ganha(key, n, txt) {
    const E = D.enc;
    if (n <= 0) return false;
    if (key) { if (E.ev.includes(key)) return false; E.ev.push(key); }
    D.ph += n;
    D.log.push("+" + n + " PH: " + txt);
    return true;
  }
  function gasta(n, txt) {
    if (D.ph < n) { toast("PH insuficientes (" + D.ph + " de " + n + ")"); return false; }
    D.ph -= n;
    D.log.push("−" + n + " PH: " + txt);
    return true;
  }
  const evk = () => "e" + (++D.enc.seqn);

  /* ------------------------------------------------------------------ MORTE, FERIDA, FUGA */
  function morre(x) {
    const E = D.enc;
    x.fer = 6;
    UI.ex.delete(x.id);
    if (E.on) {
      E.matou++;
      if (E.matou === 1 && pe("Banho de Sangue")) E.bs = true;
      ganha("morte:" + x.id, 1, "Sobrevivente morreu em encontro (" + nm(x) + ")");
      if (temAmeaca("Monstruosidade")) ganha("mon:" + x.id, 2, "Monstruosidade: " + nm(x) + " morreu");
    }
    toast(nm(x) + " morreu.");
  }
  function saiu(x) {
    if (D.enc.rod === 1 && temAmeaca("Obstinada")) ganha("obst:" + x.id, 3, "Obstinada: " + nm(x) + " escapou na 1ª rodada");
  }
  /* Quem chegou ao número de Etapas de Fuga escapa (livro: Dados de Fuga = Etapas de Fuga); presa não conta. */
  function autoEsc() {
    const E = D.enc;
    if (!E.on || E.etapas < 1) return;
    D.sob.forEach((x) => {
      if (ativa(x) && !temCond(x, "segurar") && x.fuga >= E.etapas) { x.esc = true; saiu(x); toast(nm(x) + " escapou do encontro."); }
    });
  }
  /* Valor final de um Ferir de valor 1–5, com passivas e opções escolhidas. */
  function calcFer(x, fe) {
    let val = fe.v + (fe.cp ? 1 : 0);
    const ex = [];
    if (temP("Brutamontes") && x.seq > 0) { val += 1; ex.push("Brutamontes: alvo já tinha Sequela (+1 de Ferida)"); }
    if (temP("Descontrolada") && !x.f1) { val += 1; ex.push("Descontrolada: 1ª ferida dela na sessão (+1)"); }
    const sq = (fe.nos ? 0 : 1) + (fe.marca ? 1 : 0);
    const seq2 = Math.min(5, x.seq + sq);
    return { val, ex, seq2, fer2: Math.min(6, Math.max(x.fer + val, seq2)), sq };
  }
  /* Livro: o dado sai da pilha do Assassino e vira Dado Marcador (soma na Ferida); +1 Sequela por ferida. */
  function aplicaFerir(x, fe) {
    const E = D.enc, cp = fe.cp ? 2 : 0, mk = fe.marca ? 4 : 0;
    if (D.ph < cp + mk) { toast("PH insuficientes para as opções escolhidas (" + (cp + mk) + ")"); return false; }
    if (cp) gasta(2, "Corte Profundo");
    if (mk) { gasta(4, "Isso Vai Deixar Marca"); marca("marca"); }
    const c = calcFer(x, fe), a0 = x.fer;
    D.dados = Math.max(0, D.dados - 1);
    x.fer = c.fer2; x.seq = c.seq2; x.f1 = true;
    D.log.push("Ferir: dado " + fe.v + (fe.cp ? " (+1 Corte Profundo)" : "") + " em " + nm(x) + " · Ferida " + a0 + " → " + x.fer + ", Sequela " + x.seq);
    toast(nm(x) + ": Ferida " + a0 + " → " + x.fer + ", Sequelas " + x.seq);
    if (temAmeaca("Amaldiçoado")) ganha(evk(), 2, "Amaldiçoado: Dado Marcador de Ferida em " + nm(x));
    if (x.fer >= 6) morre(x);
    return true;
  }
  function mata6(x) {
    D.dados = Math.max(0, D.dados - 1);
    D.log.push("Ferir 6: matou " + nm(x) + " (dado descartado)");
    morre(x);
  }
  function mutila(x) {
    D.dados = Math.max(0, D.dados - 1);
    x.seq = Math.min(5, x.seq + 3);
    x.fer = Math.min(6, Math.max(x.fer, x.seq));
    D.log.push("Mutilar em " + nm(x) + ": dado descartado, +3 Sequelas (Sequela " + x.seq + ")");
    ganha(evk(), 4, "Mutilar");
    toast(nm(x) + " foi mutilada: +3 Sequelas, +4 PH. Ela tem uma última chance de correr.");
  }

  /* ------------------------------------------------------------------ TURNOS */
  function ordem() {
    const l = D.sob
      .map((x, i) => ({ id: x.id, i, x, r: INI_ORD.indexOf(x.arq) < 0 ? 50 : INI_ORD.indexOf(x.arq) }))
      .sort((a, b) => a.r - b.r || a.i - b.i);
    l.push({ id: "ass", ass: true });
    if (D.enc.ass1) {
      const k = l.findIndex((a) => a.ass);
      l.unshift(l.splice(k, 1)[0]);
    }
    return l;
  }
  const primeiro = () => {
    const a = ordem().find((a) => a.ass || ativa(a.x));
    return a ? a.id : "ass";
  };
  function pend(id, t) {
    const E = D.enc;
    E.pend = E.pend.filter((p) => !(p.id === id && p.t === t));
    E.pend.push({ id, t });
  }
  function avanca(dir) {
    const E = D.enc, o = ordem(), n = o.length, antes = E.vez;
    autoEsc();
    E.ini = false;
    let q = o.findIndex((a) => a.id === E.vez), wrap = false;
    if (q < 0) q = dir > 0 ? -1 : 0;
    for (let s = 0; s < n; s++) {
      q += dir;
      if (q >= n) { q = 0; wrap = true; } else if (q < 0) { q = n - 1; wrap = true; }
      const a = o[q];
      if (a.ass || ativa(a.x)) {
        E.vez = a.id;
        if (antes === "ass" && dir > 0) { E.nomat = false; E.dist = 0; E.fe = null; }
        if (wrap) {
          if (dir > 0) {
            E.rod++;
            D.sob.forEach((x) => { if (ativa(x) && temCond(x, "infectar")) pend(x.id, "inf"); });
          } else E.rod = Math.max(1, E.rod - 1);
        }
        if (dir > 0 && !a.ass) {
          if (temCond(a.x, "segurar")) pend(a.id, "seg");
          const po = a.x.cond.find((c) => c.k === "possuir");
          if (po && po.v >= 6) pend(a.id, "pos");
        }
        return;
      }
    }
  }
  function iniciar() {
    const E = D.enc;
    if (!D.sob.some(pres) || D.dados < 1) return;
    D.sob.forEach((x) => {
      x.esc = false; x.aaE = false;
      x.hab.forEach((h) => { const f = habInfo(h).f; if (f === "encontro" || f === "cena") h.u = false; });
    });
    Object.assign(E, { on: true, rod: 1, sus: 0, pend: [], res: null, ini: true, nomat: false, ass1: false, dist: 0, dif: 0, ev: [], us: [], su: null, fe: null, matou: 0, bs: false });
    E.etapas = mxN() + 1; /* Etapas de Fuga base: maior NB + 1 */
    E.vez = primeiro();
    D.sob.forEach((x) => {
      const c = x.cond.find((c) => c.k === "infectar");
      if (pres(x) && c && c.v >= 6 && x.dados > 0) E.pend.push({ id: x.id, t: "inf6" });
      if (temAmeaca("Descontrolada") && pres(x) && x.dados <= 3) ganha("desc:" + x.id, 1, "Descontrolada: " + nm(x) + " entrou no encontro com " + x.dados + " dados");
    });
    UI.quem = ""; UI.acao = ""; UI.rs = "";
  }
  function encerrar(m) {
    const E = D.enc;
    if (!E.on) return;
    const fer = D.sob.filter((x) => pres(x) && x.fer > 0).length;
    const phg = fer && ganha("ferfim", fer, "Sobreviventes que saíram feridas do encontro (" + fer + ")") ? fer : 0;
    E.res = { fer, phg, pista: D.dados === 0, m: m || "Encontro encerrado pela Diretora.", mp: false };
    Object.assign(E, { on: false, vez: "", pend: [], inv: false, ass1: false, ini: false, nomat: false, dist: 0, su: null, fe: null, bs: false });
    D.sob.forEach((x) => { x.esc = false; x.aaE = false; });
    UI.quem = ""; UI.acao = ""; UI.rs = "";
  }
  /* Livro: o encontro só acaba quando o Assassino sai da cena no turno dele (Escapar), fica sem dados, todos escapam ou o último morre. */
  function checaFim() {
    const E = D.enc;
    if (!E.on) return;
    if (D.dados === 0) { encerrar("O Assassino ficou sem dados: derrotado por ora. Os Intérpretes ganham uma Pista."); toast("Encontro encerrado: o Assassino ficou sem dados."); }
    else if (D.sob.length && !D.sob.some(ativa)) {
      const todasMortas = D.sob.every(morta);
      encerrar(todasMortas ? "Todas as sobreviventes morreram." : "Nenhuma sobrevivente resta na cena (escaparam ou morreram).");
      toast("Encontro encerrado: ninguém resta na cena.");
    }
  }

  /* ------------------------------------------------------------------ TESTE DE SUSTO */
  const susAlvos = () => D.sob.filter((x) => ativa(x) && x.dados > 0);
  function susInicia(tipo) {
    const E = D.enc;
    if (E.su) return;
    if (tipo === "ass") {
      if (E.on) return; /* Assustar só em Cena Livre e Cena de Suspense, nunca em encontro */
    } else {
      if (!E.on || !E.ini || !pe("Jumpscare") || usou("jump")) return;
      if (!gasta(2, "Jumpscare")) return;
      marca("jump");
    }
    E.su = { t: tipo, n: ++E.seqn, ac: false, v: {}, d: {}, fin: false, res: [], opc: false };
  }
  function susCancela() {
    const E = D.enc, s = E.su;
    if (!s || s.fin) { E.su = null; return; }
    if (s.t === "ass" && E.on) E.sus = Math.max(0, E.sus - 1);
    if (s.t === "jump") { D.ph += 2; D.log.push("+2 PH: Jumpscare cancelado"); E.us = E.us.filter((k) => k !== "jump"); }
    E.su = null;
  }
  function susAplica() {
    const E = D.enc, s = E.su, al = susAlvos();
    if (!s || s.fin || al.some((x) => !s.v[x.id])) return;
    if (s.ac) {
      if (!gasta(3, "Ataque do Coração")) return;
      marca("ac");
    }
    const fal = al.filter((x) => s.v[x.id] === "no");
    fal.forEach((x) => {
      x.dados = Math.max(0, x.dados - 1);
      if (s.ac) D.dados += 1; /* Ataque do Coração: as falhas são sacrificadas ao Assassino */
    });
    s.res = [];
    s.res.push(fal.length ? pl(fal.length, "falha", "falhas") + " (" + fal.map(nm).join(", ") + "): " + (s.ac ? "dados sacrificados ao Assassino (+" + fal.length + " na pilha dele)." : "dados descartados.") : "Ninguém falhou.");
    if (fal.length && ganha("susto:" + s.n, 1, "Falha em Teste de Susto")) s.res.push("+1 PH (Intento Horrível: falha em Teste de Susto).");
    if (fal.length && temAmeaca("Assombração") && ganha("assomb:" + s.n, fal.length, "Assombração: " + fal.length + " falha(s) em Teste de Susto")) s.res.push("+" + fal.length + " PH (Intento Único da Assombração).");
    s.fal = fal.map((x) => x.id);
    s.fin = true;
  }

  /* ------------------------------------------------------------------ AÇÕES DO ASSASSINO */
  const vezAss = () => D.enc.on && D.enc.vez === "ass";
  function alvoSel(permiteEsc) {
    const l = D.sob.filter((x) => pres(x) && (permiteEsc || !x.esc));
    return l.find((x) => x.id === UI.alvo) || l[0] || null;
  }
  function matar(id, sofreu) {
    const E = D.enc, x = D.sob.find((s) => s.id === id);
    if (!E.on || !vezAss() || E.nomat || !x || !ativa(x) || pilha(x) >= D.dados) return;
    if (sofreu && (!pe("Já Sofreu o Suficiente") || x.dados >= 3)) return;
    if (sofreu && !gasta(2, "Já Sofreu o Suficiente")) return;
    const custo = (sofreu ? 1 : 2) + E.dist;
    D.dados = Math.max(0, D.dados - custo);
    D.log.push("Matar: " + nm(x) + " (descartou " + custo + " dado" + (custo > 1 ? "s" : "") + ")");
    morre(x);
  }
  function escapar(fora) {
    const E = D.enc;
    if (!E.on) return;
    if (fora) { if (!pe("Eu Voltarei") || vezAss()) return; } else if (!vezAss()) return;
    const t = UI.trauma ? alvoSel() : null;
    if (t && (!pe("Trauma") || !ativa(t))) return;
    if (D.ph < (fora ? 3 : 0) + (t ? 3 : 0)) { toast("PH insuficientes"); return; }
    if (fora) gasta(3, "Eu Voltarei");
    if (t) gasta(3, "Trauma");
    let g = 1;
    if (temP("Carniceira")) g += D.sob.filter((x) => pres(x) && x.fer > 3).length;
    if (t) {
      const at = AR[t.arq] ? AR[t.arq][2] : Object.keys(AT);
      at.forEach((k) => { if (!t.cond.some((c) => c.k === "incapacitar" && c.attr === k)) t.cond.push({ k: "incapacitar", v: 0, attr: k, txt: "" }); });
      D.log.push("Trauma: " + nm(t) + " incapacitada em todas as especialidades");
    }
    D.dados += g;
    D.log.push("Escapar: Assassino saiu da cena (+" + g + " dado" + (g > 1 ? "s" : "") + ")");
    UI.trauma = false;
    encerrar("O Assassino escapou da cena" + (fora ? " fora do turno (Eu Voltarei)" : "") + " e recebeu " + pl(g, "dado", "dados") + ".");
  }
  function dificultar() {
    const E = D.enc;
    if (!E.on || !E.ini || !gasta(4, "Dificultar (+1 Etapa de Fuga)")) return;
    E.etapas++; E.dif++;
  }
  function surpresa() {
    const E = D.enc;
    if (!E.on || !E.ini || !pe("Surpresa!") || usou("surp") || !gasta(6, "Surpresa!")) return;
    marca("surp"); E.ass1 = true; E.nomat = true; E.vez = "ass";
  }
  function suaHora() {
    const E = D.enc;
    if (!E.on || !E.ini || !pe("Sua Hora Chegou") || usou("hora")) return;
    const [i, j] = (UI.shc || "").split(":").map(Number), x = D.sob[i], c = x && x.cond[j];
    if (!c || !COND[c.k] || COND[c.k].min === undefined || c.v >= COND[c.k].max) return;
    if (!gasta(3, "Sua Hora Chegou")) return;
    marca("hora"); c.v += 1;
    D.log.push("Sua Hora Chegou: " + COND[c.k].rot + " de " + nm(x) + " subiu para " + c.v);
  }
  function colocaMarc(k) {
    const x = alvoSel(true);
    if (!x || morta(x) || !temAU(AUDK[k]) || temCond(x, k)) return;
    if (!E_ok()) return;
    const custo = { infectar: 4, amaldicoar: 3 }[k] || 0, dado = k === "amaldicoar" ? 0 : 1;
    if (D.dados < dado || D.ph < custo) { toast(D.dados < dado ? "Sem dado para entregar." : "PH insuficientes (" + custo + ")"); return; }
    if (custo) gasta(custo, AUDK[k]);
    D.dados -= dado;
    let v = k === "restringir" ? 3 : 1;
    if (temP("Amaldiçoado")) v = Math.min(COND[k].max, v + 1);
    x.cond.push({ k, v, attr: "", txt: "" });
    D.log.push(AUDK[k] + ": " + COND[k].rot + " em " + nm(x) + " (valor " + v + (dado ? ", 1 dado entregue" : "") + ")");
    if (temAmeaca("Amaldiçoado")) ganha(evk(), 2, "Amaldiçoado: Dado Marcador em " + nm(x));
  }
  const AUDK = { infectar: "Infectar", possuir: "Possuir", restringir: "Restringir", amaldicoar: "Amaldiçoar" };
  const E_ok = () => !D.enc.on || vezAss();
  function aoFerir(k) {
    const E = D.enc, fe = E.fe, x = fe && D.sob.find((s) => s.id === fe.id);
    if (!fe || !fe.ap || !x || morta(x) || !temAU(k)) return;
    if (k === "Segurar") { if (temCond(x, "segurar") || !gasta(5, "Segurar")) return; x.cond.push({ k: "segurar", v: 0, attr: "", txt: "" }); }
    else if (k === "Incapacitar") {
      const a = UI.inc || (AR[x.arq] ? AR[x.arq][2][0] : Object.keys(AT)[0]);
      if (x.cond.some((c) => c.k === "incapacitar" && c.attr === a) || !gasta(4, "Incapacitar")) return;
      x.cond.push({ k: "incapacitar", v: 0, attr: a, txt: "" });
    } else if (k === "Destruir") { if (!gasta(4, "Destruir")) return; x.cond.push({ k: "destruir", v: 0, attr: "", txt: "" }); }
    fe.usou = (fe.usou || []).concat(k);
  }
  function eVejo() {
    const E = D.enc, x = alvoSel();
    if (!E.on || !pe("Eu Vejo Cada Passo Seu") || usou("vejo") || !x || x.dados < 1 || !gasta(2, "Eu Vejo Cada Passo Seu")) return;
    marca("vejo"); x.dados -= 1; D.dados += 1;
    D.log.push("Eu Vejo Cada Passo Seu: " + nm(x) + " sacrificou 1 dado");
  }
  function naoHaSaida() {
    const E = D.enc, x = alvoSel(true);
    if (!vezAss() || !pe("Não Há Saída") || !x || morta(x) || x.fuga < 1 || (x.aaE && x.esc) || !gasta(4, "Não Há Saída")) return;
    x.fuga -= 1; x.dados = Math.min(6, x.dados + 1);
    if (x.esc && x.fuga < E.etapas) { x.esc = false; toast(nm(x) + " voltou ao encontro."); }
  }
  function banho() {
    const E = D.enc, c = 2 * D.sob.length;
    if (!E.on || !E.bs || usou("banho") || !gasta(c, "Banho de Sangue")) return;
    marca("banho"); E.bs = false;
    D.sob.filter((x) => pres(x)).forEach((x) => { x.dados = Math.max(0, x.dados - 1); });
    D.log.push("Banho de Sangue: 1 dado descartado de cada sobrevivente viva");
  }
  function poderLivre(n, custo, reg) {
    if (!gasta(custo, n)) return;
    if (reg) marca(reg);
  }

  /* ------------------------------------------------------------------ AÇÕES DAS SOBREVIVENTES */
  /* Distrair é teste complexo (livro); Partir Para Cima é complexo contra a passiva Desconhecida. */
  const cxDef = (a) => a === "Distrair" || (a === "Partir Para Cima" && temP("Desconhecida"));
  function resolve() {
    const E = D.enc, a = UI.acao, x = D.sob.find((s) => s.id === UI.rs) || D.sob.find((s) => s.id === E.vez);
    if (!E.on || !x || !ativa(x)) return;
    const R = UI.rv;
    const n = cl(R.n, 0, x.dados), s = cl(R.s, 0, n), six = cl(R.six, 0, s);
    const cx = R.cx === null ? cxDef(a) : R.cx;
    const req = cx ? 2 : 1, ok = s >= req, f = n - s;
    if (a === "Recuperar o Fôlego") { x.dados = Math.min(6, x.dados + 1); }
    else if (a === "Vazar Dali") {
      if (n < 1) return;
      x.dados -= n; x.fuga = Math.min(12, x.fuga + s + six);
      if (s === 0 && temAmeaca("Perseguidor")) ganha(evk(), 1, "Perseguidor: " + nm(x) + " falhou em todos os dados do Vazar Dali");
    } else if (a === "Partir Para Cima") {
      if (n < 1) return;
      x.dados -= f;
      if (ok) { D.dados = Math.max(0, D.dados - 1); D.log.push("Partir Para Cima: " + nm(x) + " fez o Assassino descartar 1 dado"); }
      else if (temAmeaca("Brutamontes")) ganha(evk(), 2, "Brutamontes: " + nm(x) + " falhou em Partir Para Cima");
    } else if (a === "Distrair") {
      if (n < 1) return;
      x.dados -= f;
      if (ok) { E.dist++; D.log.push("Distrair: " + nm(x) + " (Matar custa +" + E.dist + " dado" + (E.dist > 1 ? "s" : "") + ")"); }
    } else if (a === "Ajudar Alguém") {
      const al = D.sob.find((q) => q.id === R.dest && q !== x && pres(q));
      if (n < 1 || !al) return;
      /* Vai na Fé! (quem ajuda, 1×/sessão): os dados doados chegam como Dados de Fuga. Me Ajudem! (quem recebe, 1×/sessão): quem ajuda não perde os dados doados. */
      const hvf = R.vf ? habDe(x, /^Vai na F[ée]!/i) : null, vf = hvf && !hvf.u ? hvf : null;
      const hma = R.ma ? habDe(al, /^Me Ajudem!/i) : null, ma = hma && !hma.u ? hma : null;
      const t = Math.min(s, vf ? 6 - pilha(al) : 6 - al.dados, x.dados); /* as falhas NÃO são descartadas */
      if (!ma) x.dados -= t;
      if (vf) al.fuga = Math.min(12, al.fuga + t); else al.dados += t;
      if (vf) vf.u = true;
      if (ma) ma.u = true;
      D.log.push("Ajudar Alguém: " + nm(x) + " doou " + t + " dado(s) a " + nm(al) + (vf ? " como Dados de Fuga (Vai na Fé!)" : "") + (ma ? " sem perder os dados (Me Ajudem!)" : ""));
    } else return;
    UI.rv = { n: 1, s: 0, six: 0, cx: null, dest: R.dest, vf: false, ma: false, po: R.po };
    autoEsc();
    passaVez(x);
  }
  /* Depois da ação da sobrevivente na vez dela, a vez passa direto para a próxima na iniciativa (ou para o Assassino). */
  function passaVez(x) {
    const E = D.enc;
    if (!E.on || E.vez !== x.id) return;
    avanca(1);
    UI.quem = ""; UI.acao = ""; UI.rs = "";
    UI.rv = { n: 1, s: 0, six: 0, cx: null, dest: "", vf: false, ma: false, po: false };
  }
  /* Arriscar Tudo e as habilidades de arquétipo que o alteram (Até o Fim!, Tudo Por Você!, Eu Não Quero Morrer!). */
  function aaInfo(x, po) {
    const T = pilha(x), ult = D.sob.filter(ativa).length < 2;
    const ate = habDe(x, /^At[ée] o Fim!/i), tudo = habDe(x, /^Tudo Por Voc[êe]!/i), enqm = habDe(x, /^Eu N[ãa]o Quero Morrer!/i);
    const outro = D.sob.some((q) => q !== x && q.aaE);
    let rest = 0, nota = "Descarta todos os dados.", mantem = false;
    if (ult && enqm) {
      if (outro) nota = "Eu Não Quero Morrer!: alguém já arriscou tudo antes, então ela perde todos os dados.";
      else { rest = T; mantem = true; nota = "Eu Não Quero Morrer!: sendo a última presente, arrisca tudo e mantém todos os dados."; }
    } else if (po && tudo) { rest = Math.floor(T / 2); nota = "Tudo Por Você!: descarta apenas metade dos dados (" + (T - rest) + " de " + T + "; se for ímpar o livro não diz o arredondamento, aqui descarta a metade maior)."; }
    else if (!po && ate) { rest = Math.min(1, T); nota = "Até o Fim!: mantém um único dado em vez de sacrificar todos."; }
    return { T, ult, ate, tudo, enqm, outro, rest, nota, mantem, livre: !!(ate || tudo || enqm), bloq: x.aa || (ult && !enqm) };
  }
  function arriscar(x, po) {
    if (!x || !ativa(x) || !D.enc.on) return;
    const I = aaInfo(x, po);
    if (I.bloq) return;
    x.aa = true; x.aaE = true; x.esc = true;
    if (!I.mantem) { x.dados = I.rest; x.fuga = 0; }
    D.log.push("Arriscar Tudo: " + nm(x) + " escapou. " + I.nota);
    saiu(x);
    passaVez(x);
    toast("Arriscar Tudo: " + nm(x) + " escapou" + (I.rest ? " e ficou com " + I.rest + " dado(s)" : " e descartou todos os dados") + ".");
  }

  /* ------------------------------------------------------------------ HTML */
  const stc = (f, v) =>
    f == "dados" ? (v == 0 ? " st-zero" : v <= 2 ? " st-low" : v >= 6 ? " st-max" : "")
      : f == "fer" ? (v >= 6 ? " st-zero" : v >= 5 ? " st-crit" : v >= 4 ? " st-low" : "")
        : (f == "pt" && v >= 10) || (f == "seq" && v >= 5) ? " st-max" : "";
  const stat = (rot, f, v, mn, mx, i, extra) =>
    `<div class="sst${stc(f, v)}"><div class="lab">${rot}</div><div class="sv"><button class="b o" data-a="sst" data-f="${f}" data-d="-1" data-id="${i}" ${v <= mn ? "disabled" : ""} aria-label="Diminuir ${rot}">−</button><b>${v}</b><button class="b" data-a="sst" data-f="${f}" data-d="1" data-id="${i}" ${v >= mx ? "disabled" : ""} aria-label="Aumentar ${rot}">+</button></div>${extra || ""}</div>`;
  const B = (a, txt, o) => {
    o = o || {};
    return `<button class="b${o.o ? " o" : ""}${o.on ? " on" : ""}" data-ms="${a}"${Object.entries(o.d || {}).map(([k, v]) => ` data-${k}="${escH(v)}"`).join("")}${o.off ? " disabled" : ""}${o.tt ? ` title="${escH(o.tt)}"` : ""}>${txt}</button>`;
  };
  const SEL = (f, val, opts, ph) => `<select class="ms-mini" data-ms-sel="ui" data-f="${f}" aria-label="${escH(ph)}">${ph ? `<option value="">${ph}</option>` : ""}${opts.map((o) => `<option value="${escH(o[0])}" ${String(val) === String(o[0]) ? "selected" : ""}>${escH(o[1])}</option>`).join("")}</select>`;

  function barHtml() {
    const E = D.enc;
    if (!E.on) return "";
    const a = ordem().find((a) => a.id === E.vez) || { ass: true };
    const nome = a.ass ? nomeAss() : nomeSob(a.x, a.i);
    return `<div class="ms-bar" role="region" aria-label="Controle de turnos"><div class="ms-bar-i"><span class="ms-rod">Rodada ${E.rod}</span><span class="ms-vez">${E.ini ? "<b>Início do encontro</b> · " : ""}Vez de <b>${escH(nome)}</b>${a.ass ? " (Assassino)" : ""}</span><div class="ms-bar-b"><button class="b o" data-ms="prev" aria-label="Voltar um turno">◀<span class="ms-lg"> Voltar</span></button><button class="b" data-ms="next">Próximo<span class="ms-lg"> turno</span> ▶</button></div></div></div>`;
  }

  function tokens() {
    const E = D.enc;
    return ordem().map((a, k) => {
      if (a.ass) return `<button class="ms-tok${E.vez === "ass" ? " on" : ""}" style="--c:#8a1fb0" data-ms="vez" data-id="ass"><i>${k + 1}</i><span>${escH(nomeAss())}</span><small>Assassino</small></button>`;
      const x = a.x, ar = AR[x.arq];
      return `<button class="ms-tok${E.vez === x.id ? " on" : ""}${ativa(x) ? "" : " off"}" style="--c:${ar ? ar[1] : "#777"}" data-ms="vez" data-id="${escH(x.id)}"><i>${k + 1}</i><span>${escH(nomeSob(x, a.i))}</span><small>${ar ? ar[0] : "sem arquétipo"}${morta(x) ? " · morta" : x.aus ? " · ausente" : x.esc ? " · escapou" : ""}</small></button>`;
    }).join("");
  }

  function pendHtml() {
    const E = D.enc;
    const btn = (a, j, txt) => `<span class="row"><button class="b" data-ms="${a}" data-j="${j}">${txt}</button><button class="b o" data-ms="pig" data-j="${j}">Ignorar</button></span>`;
    const itens = E.pend.map((p, j) => {
      const x = D.sob.find((s) => s.id === p.id);
      if (!x || morta(x)) return "";
      if (p.t === "inf") {
        const c = x.cond.find((c) => c.k === "infectar");
        return c ? `<div class="item"><span>${escH(nm(x))}: fim da rodada, a Infecção sobe de ${c.v} para ${Math.min(6, c.v + 1)}.</span>${btn("pap", j, "Aplicar")}</div>` : "";
      }
      if (p.t === "seg") return `<div class="item"><span>${escH(nm(x))} está presa: +1 de Ferida no começo do turno (${x.fer} → ${Math.min(6, x.fer + 1)}).</span>${btn("pap", j, "Aplicar +1")}</div>`;
      if (p.t === "inf6") return `<div class="item"><span>${escH(nm(x))} com Infecção 6: no começo da cena sacrifica todos os dados comuns (${x.dados}) ao Assassino.</span>${btn("pap", j, "Sacrificar " + x.dados)}</div>`;
      if (p.t === "pos") return `<div class="item"><span>${escH(nm(x))} com Possessão 6: o Assassino pode usar o dado para Matar através dela neste turno (o Intérprete perde o turno). <small>O livro não cita custo em dados nem PH para isso.</small></span>${btn("pap", j, "Matar através dela")}</div>`;
      return "";
    }).join("");
    /* Pilha vazia em encontro = morte instantânea (livro, pág. 11). */
    const vazias = E.on ? D.sob.map((x, i) => ({ x, i })).filter((o) => ativa(o.x) && pilha(o.x) === 0).map((o) => `<div class="item"><span>${escH(nm(o.x))} está com a pilha vazia: morre instantaneamente no encontro.</span><span class="row"><button class="b" data-ms="vaz" data-i="${o.i}">Marcar como morta</button></span></div>`).join("") : "";
    return itens || vazias ? `<div class="ms-alert"><b>Efeitos pendentes</b>${itens}${vazias}</div>` : "";
  }

  function iniPainel() {
    const E = D.enc;
    if (!E.on || !E.ini) return "";
    const marc = [];
    D.sob.forEach((x, i) => x.cond.forEach((c, j) => { if (COND[c.k] && COND[c.k].min !== undefined && c.v < COND[c.k].max) marc.push([i + ":" + j, nm(x) + ": " + COND[c.k].rot + " " + c.v + " → " + (c.v + 1)]); }));
    const l = [];
    l.push(`<div class="item"><span><b>Dificultar</b> <small>4 PH por +1 Etapa de Fuga${E.dif ? " · comprado: " + E.dif : ""}</small></span>${B("dif", "−4 PH: +1 Etapa", { off: D.ph < 4 })}</div>`);
    if (pe("Surpresa!")) l.push(`<div class="item"><span><b>Surpresa!</b> <small>6 PH: Assassino em 1º. Sem Matar nesse 1º turno.</small></span>${usou("surp") ? '<span class="ms-bd ok">usada</span>' : B("surp", "−6 PH", { off: D.ph < 6 })}</div>`);
    if (pe("Jumpscare")) l.push(`<div class="item"><span><b>Jumpscare</b> <small>2 PH: Teste de Susto em todas, sem gastar Sustos</small></span>${usou("jump") ? '<span class="ms-bd ok">usado</span>' : B("jump", "−2 PH", { off: D.ph < 2 || !!E.su })}</div>`);
    if (pe("Sua Hora Chegou")) l.push(`<div class="item"><span><b>Sua Hora Chegou</b> <small>3 PH: +1 em um Dado Marcador (exceto Ferida)</small></span>${usou("hora") ? '<span class="ms-bd ok">usada</span>' : `<span class="row">${SEL("shc", UI.shc, marc, "Qual marcador?")}${B("hora", "−3 PH", { off: D.ph < 3 || !UI.shc })}</span>`}</div>`);
    if (temP("Inato")) l.push(`<div class="item"><span><b>Inato (passiva)</b> <small>Com 3+ PH ao iniciar a cena: +1 dado</small></span>${usou("inato") ? '<span class="ms-bd ok">aplicada</span>' : B("inato", "+1 dado", { off: D.ph < 3 })}</div>`);
    return `<div class="ms-alert ok"><b>Início do encontro</b><small>Poderes que só valem agora. Avançar o turno fecha esta janela.</small>${l.join("")}<div class="row" style="margin-top:6px">${B("comeca", "Começar o encontro ▶")}</div></div>`;
  }

  function encHtml() {
    const E = D.enc;
    if (!E.on) {
      const mp = menorPilha(), temAtiva = D.sob.some(ativa), pode = temAtiva && D.dados > mp;
      const semArq = D.sob.filter((x) => !AR[x.arq]).length;
      let res = "";
      if (E.res) {
        const r = E.res;
        res = `<div class="ms-res"><b>Encontro encerrado.</b> ${escH(r.m)}<ul>${r.phg ? `<li>+${r.phg} PH já somados: ${pl(r.fer, "sobrevivente saiu ferida", "sobreviventes saíram feridas")} (Intento Horrível).</li>` : ""}${r.pista ? "<li>O Assassino ficou sem dados: os Intérpretes ganham uma Pista (recurso ilimitado do grupo).</li>" : ""}<li>Confira Dados de Fuga e Feridas de cada sobrevivente abaixo.</li></ul>${mudancaHtml(r)}<button class="b o" data-ms="resx">Ok</button></div>`;
      }
      return `<div class="card ms-enc" style="--c:var(--r)"><div class="ch"><h3>Encontro</h3><span class="ms-bd">Fora de encontro</span></div>
<p class="ms-line">Assassino: <b>${D.dados}</b> ${D.dados == 1 ? "dado" : "dados"} · menor pilha entre as presentes: <b>${temAtiva ? mp : "—"}</b> ${temAtiva ? `<span class="ms-bd ${pode ? "ok" : "bad"}">${pode ? "Pode aparecer" : "Ainda não tem mais dados que nenhuma"}</span>` : ""}</p>
<small>O Assassino pode aparecer quando tiver mais dados que ao menos uma sobrevivente presente. Quem estiver ausente da cena não conta.</small>
${semArq ? `<p class="ms-line"><small>${pl(semArq, "sobrevivente sem arquétipo", "sobreviventes sem arquétipo")}: escolha em Detalhes para entrar na ordem de iniciativa.</small></p>` : ""}
<div class="row" style="margin-top:10px"><button class="b" data-ms="ini" ${D.sob.some(pres) && D.dados > 0 ? "" : "disabled"}>Iniciar encontro</button>${!D.sob.length ? "<small>Cadastre ao menos uma sobrevivente abaixo.</small>" : !D.sob.some(pres) ? "<small>Todas as sobreviventes estão ausentes ou mortas: marque ao menos uma como presente.</small>" : D.dados > 0 ? "" : "<small>O Assassino está sem dados.</small>"}</div>${res}</div>`;
    }
        return `<div class="card ms-enc live" style="--c:var(--r)"><div class="ch"><h3>Encontro</h3><span class="ms-bd bad">Em andamento</span></div>
${pendHtml()}${iniPainel()}
<div class="lab">Ordem de iniciativa <small>(toque para passar a vez)</small></div>
<div class="ms-ini">${tokens()}</div>
<div class="ms-two"><div><div class="lab">Etapas de Fuga (segredo)</div><b class="ms-big">${E.etapas}</b> <small>${E.dif ? "(base " + (E.etapas - E.dif) + " + " + E.dif + " de Dificultar)" : "(maior NB + 1)"}</small></div><div><small>Susto não é usado em encontro: só em Cena Livre e Cena de Suspense.</small></div></div>
<div class="row" style="margin-top:10px"><button class="b o" data-ms="fim">Encerrar encontro</button></div></div>`;
  }

  function mudancaHtml(r) {
    if (!pe("Mudança de Planos") || r.mp || typeof auList !== "function") return "";
    const k = UI.mpk || "au1", lst = auList(k === "au2" ? D.a2 : D.a1);
    return `<div class="ms-alert"><b>Mudança de Planos</b><small>5 PH: troca uma ação única por outra da mesma lista da Ameaça.</small><div class="row">${SEL("mpk", UI.mpk || "au1", [["au1", "De " + D.a1 + (D.au1 ? ": " + D.au1 : "")], ["au2", "De " + D.a2 + (D.au2 ? ": " + D.au2 : "")]], "")}${SEL("mpv", UI.mpv, lst.filter((n) => n !== D[k]).map((n) => [n, n]), "Nova ação…")}${B("mp", "−5 PH: trocar", { off: D.ph < 5 || !UI.mpv })}</div></div>`;
  }

  /* ---------- Teste de Susto ---------- */
  function susHtml() {
    const E = D.enc, s = E.su;
    const al = susAlvos(), tipo = s.t === "jump" ? "Jumpscare" : "Assustar";
    if (s.fin) {
      const fal = (s.fal || []).map((id) => D.sob.find((x) => x.id === id)).filter(Boolean);
      const acid = !E.on && s.t === "ass" && temAU("Acidentar") ? fal.filter((x) => pres(x)).map((x) => B("acid", "Acidentar: Ferir " + escH(nm(x)) + " (4 PH)", { d: { id: x.id }, off: D.ph < 4 || !!E.fe })).join("") : "";
      return `<div class="ms-res"><b>Teste de Susto resolvido (${tipo})</b><ul>${s.res.map((r) => `<li>${escH(r)}</li>`).join("")}</ul><div class="row">${B("sopc", s.opc ? "Susto opcional somado" : "Susto opcional: +1 PH", { o: true, off: s.opc, tt: "Se algum Intérprete suspirar de medo ou se contorcer de nojo" })}${acid}${B("sfim", "Fechar")}</div></div>`;
    }
    const linhas = al.map((x) => {
      const r = s.v[x.id], d = s.d[x.id];
      const uh = habDe(x, /^Uh\?/i), im = habDe(x, /^Imposs/i);
      return `<div class="item"><span><b>${escH(nm(x))}</b> <small>${x.dados} dados</small>${d ? `<span class="ms-sd">${dadoH(d, "s:" + x.id, d >= 4 ? "ok" : "no")}</span>` : ""}${uh && !uh.u ? " <small>(pode ignorar: Uh? Quê?)</small>" : ""}${im && !im.u && r ? " <small>(pode re-rolar: Impossível!)</small>" : ""}</span><span class="row">${B("sv", "Passou", { o: r !== "ok", on: r === "ok", d: { id: x.id, r: "ok" } })}${B("sv", "Falhou", { o: r !== "no", on: r === "no", d: { id: x.id, r: "no" } })}${uh && !uh.u ? B("sv", "Ignora", { o: r !== "sk", on: r === "sk", d: { id: x.id, r: "sk" }, tt: "Uh? Quê?: 1×/encontro ignora um Teste de Susto (marca a habilidade como usada)" }) : ""}${im && !im.u && r && r !== "sk" ? B("sre", "Re-rolar", { o: true, d: { id: x.id }, tt: "Impossível!: re-rola o teste de Susto uma vez" }) : ""}</span></div>`;
    }).join("");
    const falta = al.some((x) => !s.v[x.id]);
    const acOk = E.on && pe("Ataque do Coração") && (!usou("ac"));
    return `<div class="ms-res"><b>Teste de Susto (${tipo})</b> <small>Cada sobrevivente rola 1 dado da pilha: sucesso em 4+ (Risco Comum). Falha: o dado é descartado.</small>
${al.length ? linhas : "<p><small>Nenhuma sobrevivente na cena com dados para testar.</small></p>"}
${acOk ? `<div class="row" style="margin-top:6px">${B("sac", s.ac ? "✔ Ataque do Coração (3 PH): falhas sacrificadas a você" : "Ataque do Coração (3 PH, 1×/encontro)", { o: !s.ac, on: s.ac, off: !s.ac && D.ph < 3, tt: "Antes do teste: todas as falhas são sacrificadas ao Assassino" })}</div>` : ""}
<div class="row" style="margin-top:8px">${B("sroll", "🎲 Rolar por quem falta", { o: true, off: !falta })}${B("sapp", "Aplicar resultado", { off: falta || (s.ac && D.ph < 3) })}${B("scan", "Cancelar", { o: true })}</div>${s.t === "jump" ? "" : `<small>Ao aplicar: dado de cada falha sai da pilha; 1 PH se alguém falhou (uma vez por Susto).</small>`}</div>`;
  }

  /* ---------- Ferir ---------- */
  function ferHtml() {
    const E = D.enc, fe = E.fe, x = fe && D.sob.find((s) => s.id === fe.id);
    if (fe && x) {
      if (fe.v === null) return `<div class="ms-res"><b>Ferir ${escH(nm(x))}</b> <small>(Acidentar)</small><div class="row" style="margin-top:6px">${B("frol", "🎲 Rolar 1 dado", {})}${[1, 2, 3, 4, 5, 6].map((v) => B("fval", v, { o: true, d: { v } })).join("")}${B("fcan", "Cancelar", { o: true })}</div></div>`;
      if (fe.ap) {
        const bt = ["Segurar", "Incapacitar", "Destruir"].filter(temAU).map((k) => {
          const c = k === "Segurar" ? 5 : 4, feito = (fe.usou || []).includes(k);
          const attr = k === "Incapacitar" ? SEL("inc", UI.inc || (AR[x.arq] ? AR[x.arq][2][0] : Object.keys(AT)[0]), (AR[x.arq] ? AR[x.arq][2] : Object.keys(AT)).map((a) => [a, AT[a]]), "") : "";
          return `<div class="item"><span><b>${k}</b> <small>${c} PH · ao ferir sem matar</small></span><span class="row">${attr}${feito ? '<span class="ms-bd ok">aplicada</span>' : B("afer", "−" + c + " PH", { d: { k }, off: D.ph < c || morta(x) })}</span></div>`;
        }).join("");
        return `<div class="ms-res"><b>Ferida aplicada em ${escH(nm(x))}</b> <small>Ferida ${x.fer}/6 · Sequelas ${x.seq}</small>${bt ? `<div class="lab" style="margin-top:6px">Ações únicas ao ferir</div>${bt}` : ""}<div class="row" style="margin-top:6px">${B("ffim", "Concluir")}</div></div>`;
      }
      if (fe.v === 6)
        return `<div class="ms-res"><div class="ms-dtray">${dadoH(fe.v, "f", "ok")}</div><b>Ferir ${escH(nm(x))}: saiu 6</b><p><small>Ela morre e o dado é descartado — ou use Mutilar: o dado é descartado, ela fica viva com +3 Sequelas (máx. 5) e uma última chance de correr, e você ganha +4 PH.</small></p><div class="row">${B("fmat", "Matar (descarta o dado)")}${B("fmut", "Mutilar (+3 Sequelas, +4 PH)", { o: true })}${B("fcan", "Cancelar", { o: true })}</div></div>`;
      const c = calcFer(x, fe);
      const opts = [];
      if (pe("Corte Profundo")) opts.push(B("fcp", (fe.cp ? "✔ " : "") + "Corte Profundo (2 PH): +1 no dado", { o: !fe.cp, on: fe.cp }));
      if (pe("Isso Vai Deixar Marca") && !usou("marca")) opts.push(B("fmk", (fe.marca ? "✔ " : "") + "Isso Vai Deixar Marca (4 PH, 1×/encontro): +1 Sequela", { o: !fe.marca, on: fe.marca }));
      const hs = [], sm = habDe(x, /^Sempre Me Superando/i), ole = habDe(x, /^Ol[ée]!/i);
      if (sm && !sm.u && E.on) hs.push(B("fsm", (fe.nos ? "✔ " : "") + "Sempre Me Superando: ela recusa a +1 Sequela", { o: !fe.nos, on: fe.nos }));
      if (ole && !ole.u && E.on) hs.push(B("fole", "Olé!: re-rolar o dado marcador", { o: true }));
      return `<div class="ms-res"><div class="ms-dtray">${dadoH(fe.v, "f", "no")}</div><b>Ferir ${escH(nm(x))}: dado ${fe.v}</b>${fe.cp ? " <small>(+1 Corte Profundo)</small>" : ""}<p class="ms-line">Ferida <b>${x.fer} → ${c.fer2}</b> · Sequelas <b>${x.seq} → ${c.seq2}</b>${c.fer2 >= 6 ? ' <span class="ms-bd dead">morre</span>' : ""}</p>${c.ex.map((t) => `<small class="ms-line">${escH(t)}</small>`).join("")}<div class="ms-chs">${opts.join("")}${hs.join("")}</div><div class="row">${B("fapp", "Entregar o dado (−1 dado do Assassino)")}${B("fcan", "Cancelar", { o: true })}</div></div>`;
    }
    const al = D.sob.filter(ativa), t = alvoSel();
    return `<div class="row ms-line">${al.length ? SEL("alvo", t ? t.id : "", al.map((q) => [q.id, nm(q) + " · Ferida " + q.fer + "/6"]), "") : "<small>Ninguém na cena.</small>"}${B("frol", "🎲 Ferir: rolar 1 dado", { off: !vezAss() || !t || D.dados < 1 })}</div><div class="ms-chs"><small>ou informe o dado:</small>${[1, 2, 3, 4, 5, 6].map((v) => B("fval", v, { o: true, d: { v }, off: !vezAss() || !t || D.dados < 1 })).join("")}</div>`;
  }

  /* ---------- Painel do Assassino ---------- */
  function assPainel() {
    const E = D.enc, vez = vezAss(), fora = !E.on;
    const t = alvoSel(true), al = D.sob.filter((x) => pres(x));
    const alvoSelect = al.length ? `<div class="row ms-line"><span class="lab" style="margin:0">Alvo</span>${SEL("alvo", t ? t.id : "", al.map((q) => [q.id, nm(q) + (q.esc ? " (escapou)" : "")]), "")}</div>` : "";
    const aviso = fora ? "Fora de encontro. Estão liberados o Teste de Susto e as ações únicas de cena." : vez ? "<b>Turno do Assassino.</b>" : "Aguardando o turno do Assassino. Matar, Ferir e Escapar só no turno dele.";
    /* Assustar */
    const sustoBtn = E.su || E.on ? "" : `<div class="item"><span><b>Assustar</b> <small>Teste de Susto em quem está na cena. Só em Cena Livre e Cena de Suspense (não existe em encontro).</small></span>${B("sus", "Provocar Susto", { off: !D.sob.some(ativa) })}</div>`;
    /* Matar */
    let matarH = "";
    if (E.on) {
      const custo = 2 + E.dist, el = D.sob.filter((x) => ativa(x) && pilha(x) < D.dados);
      const bloq = !vez ? "só no turno do Assassino" : E.nomat ? "Surpresa!: sem Matar neste 1º turno" : "";
      matarH = `<div class="item ms-col"><span><b>Matar</b> <small>mata quem tem menos dados que ${D.dados}; descarta ${custo} da pilha${E.dist ? " (2 + " + E.dist + " de Distrair)" : ""}${bloq ? " · <b>" + bloq + "</b>" : ""}</small></span>${el.length ? `<div class="ms-chs">${el.map((x) => B("mat", "☠ " + escH(nm(x)) + " <small>(" + pilha(x) + ")</small>", { o: true, d: { id: x.id }, off: !!bloq })).join("")}</div>` : "<small>Nenhuma sobrevivente com menos dados que o Assassino.</small>"}${pe("Já Sofreu o Suficiente") ? `<div class="ms-chs"><small>Já Sofreu o Suficiente (2 PH, descarta só 1 dado${E.dist ? " + Distrair" : ""}), alvo com menos de 3 dados:</small>${el.filter((x) => x.dados < 3).map((x) => B("matS", "☠ " + escH(nm(x)), { o: true, d: { id: x.id }, off: !!bloq || D.ph < 2 })).join("") || "<small>ninguém</small>"}</div>` : ""}</div>`;
    }
    /* Ferir */
    const ferirH = (E.on || E.fe) ? `<div class="item ms-col"><span><b>Ferir</b> <small>rola 1 dado do Assassino: 6 mata (ou Mutilar); menos que 6 entrega o dado como marcador (soma na Ferida) e +1 Sequela${E.on && !vez && !E.fe ? " · <b>só no turno do Assassino</b>" : ""}</small></span>${ferHtml()}</div>` : "";
    /* Escapar */
    let escH_ = "";
    if (E.on) {
      const g = 1 + (temP("Carniceira") ? D.sob.filter((x) => pres(x) && x.fer > 3).length : 0);
      escH_ = `<div class="item ms-col"><span><b>Escapar</b> <small>encerra o Encontro e dá ${g} dado${g > 1 ? "s" : ""} ao Assassino${temP("Carniceira") ? " (Carniceira: +1 por sobrevivente com Ferida > 3)" : ""}${!vez ? " · só no turno do Assassino" : ""}</small></span><div class="row">${pe("Trauma") ? `<button class="b o ms-tg${UI.trauma ? " on" : ""}" data-ms="trauma" aria-pressed="${UI.trauma}">${UI.trauma ? "✔ " : ""}Trauma (3 PH): incapacita todas as especialidades do alvo</button>` : ""}${B("escap", "Escapar da cena", { off: !vez || (UI.trauma && (!t || !ativa(t) || D.ph < 3)) })}${pe("Eu Voltarei") ? B("escapF", "Eu Voltarei (3 PH): fora do turno", { o: true, off: vez || D.ph < 3, tt: "Só entre os turnos das sobreviventes, não durante" }) : ""}</div></div>`;
    }
    /* Ações únicas */
    const au = [D.au1, D.au2].filter(Boolean).map((n) => {
      const k = Object.keys(AUDK).find((q) => AUDK[q] === n);
      const custo = AUC[n] || 0;
      if (k) return `<div class="item"><span><b>${n}</b> <small>${custo ? custo + " PH · " : ""}${k === "amaldicoar" ? "sem dado" : "entrega 1 dado seu"}${k === "restringir" ? " na face 3" : ""} ao alvo</small></span>${B("au", "Aplicar em " + (t ? escH(nm(t)) : "—"), { d: { k }, off: !t || !E_ok() || (t && temCond(t, k)) || D.ph < custo || D.dados < (k === "amaldicoar" ? 0 : 1) })}</div>`;
      if (n === "Devorar") return `<div class="item"><span><b>Devorar</b> <small>quando alguém anuncia um 6, +1 PH</small></span>${B("devo", "+1 PH (um 6 anunciado)", { o: true })}</div>`;
      if (n === "Acidentar") return `<div class="item"><span><b>Acidentar</b> <small>4 PH: após um Susto fora de encontro, usa Ferir em quem falhou (botão aparece no resultado do Susto)</small></span></div>`;
      return `<div class="item"><span><b>${n}</b> <small>${custo} PH · aparece depois de um Ferir que não mata</small></span></div>`;
    }).join("");
    /* Poderes especiais fora do início */
    const pw = [];
    const P = (n, txt, btn) => pw.push(`<div class="item"><span><b>${n}</b> <small>${txt}</small></span>${btn || ""}</div>`);
    if (pe("Eu Vejo Cada Passo Seu")) P("Eu Vejo Cada Passo Seu", "2 PH, 1×/encontro: o alvo sacrifica 1 dado a você", usou("vejo") ? '<span class="ms-bd ok">usado</span>' : B("vejo", "−2 PH", { off: !E.on || D.ph < 2 || !t || t.dados < 1 }));
    if (pe("Não Há Saída")) P("Não Há Saída", "4 PH, no fim do seu turno: 1 Dado de Fuga do alvo vira dado comum (pode trazer de volta quem escapou, exceto Arriscar Tudo)", B("nhs", "−4 PH", { off: !vez || D.ph < 4 || !t || t.fuga < 1 || (t.aaE && t.esc) }));
    if (pe("Banho de Sangue")) P("Banho de Sangue", `1ª morte do encontro: ${2 * D.sob.length} PH (2 por Intérprete) para descartar 1 dado de cada sobrevivente viva`, usou("banho") ? '<span class="ms-bd ok">usado</span>' : B("banho", "−" + 2 * D.sob.length + " PH", { off: !E.bs || D.ph < 2 * D.sob.length, tt: E.bs ? "" : "Disponível logo após a 1ª morte do encontro" }));
    const MAN = (t) => ` <b class="ms-man">Decisão manual da Diretora:</b> ${t}`;
    if (pe("Indiferença Perturbadora")) {
      const ini = E.on && ordem()[0] && ordem()[0].id === E.vez, n = E.on ? E.ev.filter((e) => e === "indif:" + E.rod).length : 0;
      P("Indiferença Perturbadora", "2 PH, só no começo de uma rodada de encontro (1º turno da rodada): ignora os efeitos de uma qualidade neutra, só para o Assassino, por um turno." + MAN("escolha qual qualidade neutra é ignorada; o site não controla qualidades.") + (n ? ` <span class="ms-bd ok">usada ${n}× nesta rodada</span>` : ""), B("indif", "−2 PH", { off: !ini || D.ph < 2, tt: E.on ? (ini ? "" : "Só no começo de uma rodada") : "Só em encontro" }));
    }
    if (pe("Caiam na Teia")) P("Caiam na Teia", "5 PH, 1×/sessão, durante um encontro: ativa uma qualidade negativa no cenário." + MAN("escolha qual qualidade negativa é ativada; o site não controla qualidades."), (E.sx || []).includes("teia") ? '<span class="ms-bd ok">usada nesta sessão</span>' : B("teia", "−5 PH", { off: !E.on || D.ph < 5 }));
    if (pe("Cansei de Brincar")) P("Cansei de Brincar", "5 PH, em Cena de Suspense, ao gastar 1 dado para criar um Caminho Armadilha: ele vira Caminho Mortal e aniquila a Sobrevivente que o seguir." + MAN("o 1 dado do Caminho Armadilha é gasto por você na sua pilha (aqui só saem os 5 PH); anote qual Caminho é mortal."), B("susp5", "−5 PH", { off: E.on || D.ph < 5, tt: E.on ? "Só em Cena de Suspense (fora de encontro)" : "" }));
    if (pe("Fim da Esperança")) P("Fim da Esperança", "5 PH, ao iniciar uma Cena de Suspense: mantém um Passo da resolução oculto durante a primeira rodada." + MAN("escolha qual Passo fica oculto e revele-o só depois da 1ª rodada."), B("susp5f", "−5 PH", { off: E.on || D.ph < 5, tt: E.on ? "Só ao iniciar uma Cena de Suspense (fora de encontro)" : "" }));
    if (pe("Mudança de Planos")) pw.push(`<div class="item"><span><b>Mudança de Planos</b> <small>5 PH, ao terminar uma Cena de Encontro: aparece no resumo do encontro</small></span></div>`);
    if (pe("Surpresa!") || pe("Jumpscare") || pe("Sua Hora Chegou")) pw.push(`<div class="item"><span><b>${D.pe}</b> <small>só no início do encontro (painel verde ao iniciar)</small></span></div>`);
    if (pe("Ataque do Coração")) pw.push(`<div class="item"><span><b>Ataque do Coração</b> <small>3 PH, 1×/encontro, antes de um Teste de Susto. Como Susto só existe em Cena Livre e de Suspense, não há como usá-lo aqui: aplique à mão se sua mesa permitir.</small></span></div>`);
    if (pe("Já Sofreu o Suficiente") || pe("Corte Profundo") || pe("Isso Vai Deixar Marca") || pe("Trauma") || pe("Eu Voltarei")) pw.push(`<div class="item"><span><b>${D.pe}</b> <small>use nos botões de Matar, Ferir ou Escapar acima</small></span></div>`);
    const pn = pas();
    const passNotas = {
      Mestre: "A 2ª ameaça é a Horda: DH sai da pilha da Diretora e só se revela em encontros (veja a Ficha da Diretora).",
      Monstruosidade: "1×/encontro, ao ferir: 2 dados somados divididos igualmente entre duas sobreviventes (ímpar arredonda para baixo). Aplique à mão.",
      Obstinada: "O “brinquedo especial”: dados que ela descartar em Susto vão para você. Aplique à mão.",
      Assombração: "Falha em Susto carregando RECURSO o torna inutilizável (1 sobrevivente por Susto).",
      Estratégico: "+1 caminho armadilha grátis e máximo em Suspense.",
      Máquina: "Partir Para Cima contra você: +1 de dificuldade.",
      Desconhecida: "Partir Para Cima contra você é Risco Complexo.",
      Perseguidor: "Ferida > 3: Vazar Dali com +1 de dificuldade.",
      Brutamontes: "Aplicada sozinha no Ferir: alvo com Sequela leva +1 de Ferida.",
      Descontrolada: "Aplicada sozinha no Ferir: 1ª ferida de cada sobrevivente na sessão leva +1.",
      Carniceira: "Aplicada sozinha no Escapar: +1 dado por sobrevivente com Ferida > 3.",
      Inato: "Botão no início do encontro.",
      Amaldiçoado: "Dados marcadores colocados pela Mesa (exceto Ferida) começam com +1.",
    };
    const intentos = intentosHtml();
    return `<div class="card ms-ac" style="--c:#8a1fb0"><div class="ch"><h3>Ações do Assassino</h3></div>
<p class="ms-line">${aviso}</p>${alvoSelect}
<div class="ms-list">${sustoBtn}${matarH}${ferirH}${escH_}${au}</div>
${pw.length ? `<div class="lab" style="margin-top:10px">Poder especial</div><div class="ms-list">${pw.join("")}</div>` : ""}
<p class="ms-pass"><b>Passiva (${pn}):</b> ${TH[pn][0]}${passNotas[pn] ? ` <small>${passNotas[pn]}</small>` : ""}</p>
${intentos}</div>`;
  }

  /* ---------- Intentos Horríveis (a Mesa registra sozinha os que acompanha, uma vez por acontecimento) ---------- */
  const AUTO_U = { Assombração: 1, Monstruosidade: 1, Descontrolada: 1, Brutamontes: 1, Perseguidor: 1, Obstinada: 1, Amaldiçoado: 1 };
  function intentosHtml() {
    const E = D.enc;
    const man = [0, 1, 2, 4, 7].map((i) => {
      const it = INT[i], k = i === 1;
      return `<div class="item"><span>${it[1]}</span>${B("int", "+" + it[0], { d: { i, k: k ? "todas1" : "" }, off: k && (!E.on || E.rod !== 1 || E.ev.includes("todas1")) })}</div>`;
    }).join("");
    const uni = [D.a1, D.a2].map((n) => {
      const it = TI[n];
      if (n === "Máquina") return `<div class="item"><span><small>Único (${n}):</small> ${it[1]}</span>${B("maq", "+3 PH", { off: !E.on || usou("maq") || D.dados < 1 })}</div>`;
      if (AUTO_U[n]) return `<div class="item"><span><small>Único (${n}):</small> ${it[1]} <small>(a Mesa registra sozinha)</small></span></div>`;
      return `<div class="item"><span><small>Único (${n}):</small> ${it[1]}</span>${B("uni", "+" + it[0], { d: { n } })}</div>`;
    }).join("");
    return `<details class="ms-int"><summary>Intentos Horríveis (PH)</summary><small>Já automáticos na Mesa: falha em Susto, morte em encontro, feridas ao fim do encontro. Susto opcional fica dentro do Teste de Susto.</small>${man}${uni}</details>`;
  }

  /* ---------- Ações das sobreviventes ---------- */
  function acoesHtml() {
    const G = window.GLX, E = D.enc;
    if (!G) return "";
    const quem = UI.quem || (E.on && E.vez === "ass" ? "ass" : "sob");
    const sw = `<div class="ms-sw"><button class="b o${quem === "sob" ? " on" : ""}" data-ms="quem" data-q="sob">Sobrevivente</button><button class="b o${quem === "ass" ? " on" : ""}" data-ms="quem" data-q="ass">Assassino</button></div>`;
    if (quem === "ass") return `<div class="ms-quem">${sw}</div>${assPainel()}`;
    const atual = E.on && E.vez !== "ass" ? D.sob.find((x) => x.id === E.vez) : null;
    const x = D.sob.find((s) => s.id === UI.rs) || atual;
    const sel = UI.acao && ACOES_SOB.includes(UI.acao) ? G.get(UI.acao) : null;
    const chips = ACOES_SOB.map((n) => `<button class="ms-ch${UI.acao === n ? " on" : ""}" data-ms="ac" data-n="${escH(n)}" aria-pressed="${UI.acao === n}">${escH(n)}</button>`).join("");
    const topo = E.on
      ? `<div class="row ms-line"><span class="lab" style="margin:0">Quem age</span>${SEL("rs", x ? x.id : "", D.sob.filter(ativa).map((q) => [q.id, nm(q)]), "")}</div>${x && AR[x.arq] ? `<small class="ms-line">Especialidades (dificuldade −1): ${AR[x.arq][2].map((k) => AT[k]).join(", ")}</small>` : ""}`
      : "<small>Fora de encontro. Inicie o encontro para resolver as ações.</small>";
    return `<div class="ms-quem">${sw}</div><div class="card ms-ac" style="--c:#2a9a9a"><div class="ch"><h3>Ações da Sobrevivente</h3></div>
${topo}<div class="ms-chs">${chips}</div>
${sel ? `<div class="gl">${mt(G.card(sel, false))}</div>` : "<small>Toque numa ação para ver a regra.</small>"}${E.on && x && UI.acao ? resolvedor(x) : ""}</div>`;
  }
  function resolvedor(x) {
    const a = UI.acao, R = UI.rv;
    if (!ativa(x)) return "";
    if (a === "Arriscar Tudo") {
      const I = aaInfo(x, R.po);
      const po = I.tudo ? `<div class="row"><button class="b o ms-tg${R.po ? " on" : ""}" data-ms="rvt" data-f="po" aria-pressed="${!!R.po}">Para salvar outra sobrevivente (Tudo Por Você!)</button></div>` : "";
      return `<div class="ms-res"><b>${escH(nm(x))}: Arriscar Tudo</b><p><small>Descarta todos os dados e foge automaticamente. 1× por sessão; não vale para o último presente no encontro${I.enqm ? " (exceto com Eu Não Quero Morrer!)" : ""}.</small></p>${po}<p class="ms-line"><small>${I.bloq ? "" : escH(I.nota) + (I.rest ? " Ela termina com " + I.rest + " dado(s)." : "")}</small></p>${B("aaf", "Arriscar Tudo", { off: I.bloq, d: { i: D.sob.indexOf(x) } })}${x.aa ? " <small>já usado nesta sessão</small>" : I.bloq ? " <small>é a última presente</small>" : ""}</div>`;
    }
    if (a === "Recuperar o Fôlego") return `<div class="ms-res"><b>${escH(nm(x))}: Recuperar o Fôlego</b><p><small>Gasta a ação para receber +1 dado comum na pilha (máx. 6).</small></p>${B("res", "+1 dado (" + x.dados + " → " + Math.min(6, x.dados + 1) + ")", { off: x.dados >= 6 })}</div>`;
    const n = cl(R.n, 0, x.dados), s = cl(R.s, 0, n), six = cl(R.six, 0, s), vz = a === "Vazar Dali";
    const cx = R.cx === null ? cxDef(a) : R.cx, req = cx ? 2 : 1, ok = s >= req, f = n - s;
    const stp = (rot, f2, v, mx) => `<div class="sst"><div class="lab">${rot}</div><div class="sv"><button class="b o" data-ms="rv" data-f="${f2}" data-d="-1" ${v <= 0 ? "disabled" : ""}>−</button><b>${v}</b><button class="b" data-ms="rv" data-f="${f2}" data-d="1" ${v >= mx ? "disabled" : ""}>+</button></div></div>`;
    let prev = "";
    if (vz) prev = `${n} dado${n == 1 ? "" : "s"} saem da pilha; Dados de Fuga +${s + six}${six ? " (" + six + " Fuga Vantajosa)" : ""}.${n && s === 0 && temAmeaca("Perseguidor") ? " Perseguidor: +1 PH." : ""}`;
    else if (a === "Partir Para Cima") prev = `${ok ? "Sucesso: o Assassino descarta 1 dado." : "Sem sucesso suficiente."} Falhas descartadas: −${f}.${!ok && temAmeaca("Brutamontes") ? " Brutamontes: +2 PH." : ""}`;
    else if (a === "Distrair") prev = `${ok ? "Superou: Matar custa +1 dado ao Assassino." : "Não superou."} Falhas descartadas: −${f}.`;
    else if (a === "Ajudar Alguém") prev = `Sucessos doados: ${s} (as falhas não são descartadas).${R.vf && habDe(x, /^Vai na F[ée]!/i) && !habDe(x, /^Vai na F[ée]!/i).u ? " Vai na Fé!: chegam como Dados de Fuga." : ""}${R.ma && R.dest && habDe(D.sob.find((q) => q.id === R.dest) || x, /^Me Ajudem!/i) ? " Me Ajudem!: quem ajuda mantém os dados." : ""}`;
    const aviso = [];
    if (a === "Partir Para Cima") { if (temP("Máquina")) aviso.push("Máquina: +1 de dificuldade."); if (temP("Desconhecida")) aviso.push("Desconhecida: Risco Complexo (marque Complexo)."); if (temP("Mestre")) aviso.push("Horda: subtrai o DH."); }
    if (vz && temP("Perseguidor") && x.fer > 3) aviso.push("Perseguidor: +1 de dificuldade (Ferida > 3).");
    const alD = a === "Ajudar Alguém" ? D.sob.find((q) => q.id === R.dest && q !== x && pres(q)) : null;
    const hvf = a === "Ajudar Alguém" ? habDe(x, /^Vai na F[ée]!/i) : null, hma = alD ? habDe(alD, /^Me Ajudem!/i) : null;
    const opts = [hvf ? `<button class="b o ms-tg${R.vf && !hvf.u ? " on" : ""}" data-ms="rvt" data-f="vf" aria-pressed="${!!R.vf}" ${hvf.u ? "disabled" : ""} title="1×/sessão: os dados doados viram Dados de Fuga">Vai na Fé!${hvf.u ? " (já usada)" : ": doar como Dados de Fuga"}</button>` : "", hma ? `<button class="b o ms-tg${R.ma && !hma.u ? " on" : ""}" data-ms="rvt" data-f="ma" aria-pressed="${!!R.ma}" ${hma.u ? "disabled" : ""} title="1×/sessão: quem ajuda não perde os dados doados">Me Ajudem! (${escH(nm(alD))})${hma.u ? " (já usada)" : ": ela não perde os dados"}</button>` : ""].join("");
    const dest = a === "Ajudar Alguém" ? `<div class="row ms-line"><span class="lab" style="margin:0">Doar para</span>${SEL("dest", R.dest, D.sob.filter((q) => q !== x && pres(q)).map((q) => [q.id, nm(q) + " (" + q.dados + " dados)"]), "Escolha…")}</div>` : "";
    const des = x.dados === 0 ? "<small>Sem dados: não pode fazer testes nesta cena.</small>" : "";
    return `<div class="ms-res"><b>${escH(nm(x))}: ${a}</b> <small>Informe o teste (dificuldade 4+${cx ? ", Risco Complexo: 2 sucessos" : ""}).</small>${des}
<div class="ms-two">${stp("Dados rolados", "n", n, x.dados)}${stp("Sucessos", "s", s, n)}${vz ? stp("Dos quais 6", "six", six, s) : ""}</div>
${dest}${opts ? `<div class="row">${opts}</div>` : ""}<div class="row"><button class="b o ms-tg${cx ? " on" : ""}" data-ms="rvcx" aria-pressed="${cx}">Risco Complexo (2 sucessos)</button></div>
${aviso.map((t) => `<small class="ms-line">${t}</small>`).join("")}<p class="ms-line"><small>${prev}</small></p>
${B("res", "Aplicar", { off: n < 1 || (a === "Ajudar Alguém" && !R.dest) })}</div>`;
  }

  /* ---------- Sobreviventes ---------- */
  /* O que o site NÃO aplica sozinho em cada condição: a Diretora faz à mão. */
  const MANUAL = {
    infectar: "no encontro a Infecção sobe sozinha a cada rodada (aparece como pendência), mas FORA de encontro ela sobe a cada tipo de cena que passa e isso é por sua conta. Escolher a especialidade incapacitada (valor 2), descartar dado para baixar a Infecção ou passar a Infecção a outra sobrevivente também são manuais.",
    possuir: "a Possessão NÃO sobe sozinha quando a sobrevivente falha ao superar um Risco: some +1 por dado de falha. Ao chegar em 6, o Matar por ela e a perda do turno do Intérprete são decididos por você.",
    restringir: "a dificuldade +1 nos testes dela, a redução por dado de sucesso e as Feridas ao falhar não são aplicadas pelo site.",
    amaldicoar: "o valor sobe 1 cada vez que ela usa o recurso em um teste (o site não vê o teste). Aos 3, tire os PT dela à mão.",
    segurar: "a Ferida +1 no começo do turno dela aparece como pendência; o teste de Força (Risco Complexo) das aliadas para soltá-la é feito na mesa.",
    incapacitar: "o site só anota; você impede o uso da especialidade e da vantagem até Tomar Jeito.",
    destruir: "o site só anota; você aplica o efeito na narrativa e nas regras.",
  };
  function condHtml(x, i) {
    const espec = AR[x.arq] ? AR[x.arq][2] : Object.keys(AT);
    const lista = x.cond.map((c, j) => {
      const d = COND[c.k];
      const num = d.min !== undefined
        ? `<span class="ms-cv"><button class="b o" data-ms="cv" data-i="${i}" data-j="${j}" data-d="-1" ${c.v <= d.min ? "disabled" : ""} aria-label="Diminuir ${d.rot}">−</button><b>${c.v}</b><button class="b" data-ms="cv" data-i="${i}" data-j="${j}" data-d="1" ${c.v >= d.max ? "disabled" : ""} aria-label="Aumentar ${d.rot}">+</button></span>` : "";
      const ext = d.attr
        ? `<select class="ms-mini" data-a="sel" data-k="D.sob.${i}.cond.${j}.attr" aria-label="Especialidade incapacitada"><option value="">Qual especialidade?</option>${espec.map((k) => `<option value="${k}" ${c.attr === k ? "selected" : ""}>${AT[k]}</option>`).join("")}</select>`
        : d.txt ? `<input class="ms-mini" data-k="D.sob.${i}.cond.${j}.txt" value="${escH(c.txt)}" placeholder="O que foi destruído?" aria-label="O que foi destruído">` : "";
      return `<div class="ms-cd" style="--c:${CCOR[c.k] || "#888"}"><div class="ms-cdh"><b>${d.rot}</b>${ext}${num}<button class="ms-x" data-ms="cdel" data-i="${i}" data-j="${j}" aria-label="Remover ${d.rot}">×</button></div><small>${d.dica(c.v)}</small>${MANUAL[c.k] ? `<small class="ms-man">⚠ Manual: ${MANUAL[c.k]}</small>` : ""}</div>`;
    }).join("");
    const add = `<select class="ms-mini ms-add" data-ms-sel="cadd" data-i="${i}" aria-label="Adicionar condição"><option value="">+ Condição…</option>${Object.entries(COND).map(([k, d]) => `<option value="${k}">${d.rot}</option>`).join("")}</select>`;
    return `<div class="ms-conds">${lista}${add}</div>`;
  }

  function habChips(x, i) {
    if (!x.hab.length) return "";
    const chips = x.hab.map((h, j) => {
      const f = habInfo(h);
      return f.f
        ? `<button class="ms-hb${h.u ? " used" : ""}" data-ms="hu" data-i="${i}" data-j="${j}" aria-pressed="${!!h.u}" title="${escH(f.d)}">${escH(f.n)} <small>1×/${f.f}${h.u ? " · usada" : ""}</small></button>`
        : `<span class="ms-hb passive" title="${escH(f.d)}">${escH(f.n)}</span>`;
    }).join("");
    return `<div class="ms-habs"><span class="lab">Habilidades <small>(toque para marcar como usada)</small></span><div>${chips}</div></div>`;
  }

  function detalhes(x, i) {
    const ar = AR[x.arq];
    const grupos = Object.entries(AR)
      .sort(([a], [b]) => (a === x.arq ? -1 : b === x.arq ? 1 : 0))
      .map(([k, v]) => `<optgroup label="${v[0]}">${v[4].map((h, n) => (x.hab.some((q) => q.k === k && q.i === n) ? "" : `<option value="${k}:${n}">${escH(h.split("|")[0])}</option>`)).join("")}</optgroup>`).join("");
    const habs = x.hab.map((h, j) => {
      const f = habInfo(h);
      return `<div class="ms-hl"><div><b>${escH(f.n)}</b>${f.f ? ` <span class="chip">1×/${f.f}</span>` : ""}${h.k !== x.arq ? ` <small>(de ${f.a})</small>` : ""}<br><small>${escH(f.d)}</small></div><button class="ms-x" data-ms="hdel" data-i="${i}" data-j="${j}" aria-label="Remover ${escH(f.n)}">×</button></div>`;
    }).join("");
    return `<div class="ms-det">
<div class="row" style="flex-wrap:wrap"><div style="flex:1 1 160px"><div class="lab">Nome</div><input data-k="D.sob.${i}.n" value="${escH(x.n)}" placeholder="Nome da sobrevivente"></div><div style="flex:1 1 160px"><div class="lab">Intérprete</div><input data-k="D.sob.${i}.jog" value="${escH(x.jog)}" placeholder="Quem controla (opcional)"></div><div style="flex:1 1 160px"><div class="lab">Arquétipo</div><select data-a="sel" data-k="D.sob.${i}.arq"><option value="">Sem arquétipo</option>${Object.entries(AR).map(([c, v]) => `<option value="${c}" ${x.arq == c ? "selected" : ""}>${v[0]}</option>`).join("")}</select></div></div>
<small>${ar ? `Especialidades (dificuldade −1): ${ar[2].map((k) => AT[k]).join(", ")}.` : "Escolha o arquétipo para a sobrevivente entrar na ordem de iniciativa."}</small>
<div class="lab" style="margin-top:10px">Habilidades da sobrevivente</div>${habs || "<small>Nenhuma registrada. Adicione as que ela escolheu (inicial e cicatrizes).</small>"}
<div style="margin-top:6px"><select class="ms-mini" data-ms-sel="hadd" data-i="${i}" aria-label="Adicionar habilidade"><option value="">+ Habilidade…</option>${grupos}</select></div>
<div class="lab" style="margin-top:10px">Anotações</div><input data-k="D.sob.${i}.nota" value="${escH(x.nota)}" placeholder="Ex.: ferido na perna, carrega a chave…">
<div class="row" style="margin-top:10px;justify-content:space-between"><button class="b o" data-ms="aaT" data-i="${i}" aria-pressed="${x.aa}">Arriscar Tudo: ${x.aa ? "já usado nesta sessão" : "disponível"}</button><button class="b o" data-a="sdel" data-id="${i}">Excluir sobrevivente</button></div></div>`;
  }

  function cartao(x, i, pos) {
    const E = D.enc, mr = morta(x), at = ativa(x), vez = E.on && E.vez === x.id;
    const presa = temCond(x, "segurar"), ar = AR[x.arq], aberto = UI.ex.has(x.id);
    const risco = E.on && at && pilha(x) < D.dados;
    const pronta = E.on && at && !presa && E.etapas > 0 && x.fuga >= E.etapas;
    const ultima = D.sob.filter(ativa).length < 2;
    const bd = [
      vez ? '<span class="ms-bd vez">Vez dela</span>' : "",
      mr ? '<span class="ms-bd dead">Morta</span>' : "",
      x.aus ? '<span class="ms-bd bad" title="Não está na cena: fora do encontro">Ausente</span>' : "",
      x.esc ? '<span class="ms-bd ok">Escapou</span>' : "",
      pronta ? '<span class="ms-bd ok" title="Os Dados de Fuga chegaram às Etapas de Fuga">Fuga completa</span>' : "",
      risco ? '<span class="ms-bd bad" title="Tem menos dados que a pilha do Assassino: Matar pode atingi-la">⚠ Matar</span>' : "",
      presa ? '<span class="ms-bd bad">Presa</span>' : "",
      E.on && at && x.dados === 0 ? '<span class="ms-bd bad" title="Sem dados: não faz testes e morre instantaneamente em encontro">Pilha vazia</span>' : "",
      x.aa ? '<span class="ms-bd" title="Arriscar Tudo só pode ser usada uma vez por sessão">Arriscar Tudo usado</span>' : "",
    ].join("");
    const fugaExtra = E.on
      ? `<div class="bar"><i style="width:${Math.min(100, (E.etapas ? (presa ? 0 : x.fuga) / E.etapas : 0) * 100)}%"></i></div><small>${presa ? "presa: não conta" : x.fuga + " de " + E.etapas + " etapas"}</small>` : "";
    const acts = E.on && !mr && !x.aus
      ? `<div class="row ms-acts">${x.esc
        ? `<button class="b o" data-ms="esc" data-i="${i}">Voltou à cena</button>`
        : `<button class="b o" data-ms="esc" data-i="${i}">Escapou</button><button class="b o" data-ms="aa" data-i="${i}" ${x.aa || (ultima && !aaInfo(x, false).enqm) || !at ? "disabled" : ""} title="${x.aa ? "Já usada nesta sessão" : ultima && !aaInfo(x, false).enqm ? "Não pode ser usada pelo último presente no encontro" : "Descarta todos os dados e foge automaticamente (1× por sessão)"}">Arriscar Tudo</button>`}</div>` : "";
    return `<div class="sobr ms-card${vez ? " vez" : ""}${mr ? " is-dead" : ""}${x.esc ? " is-esc" : ""}" style="--c:${ar ? ar[1] : "#777"}" data-sid="${escH(x.id)}">
<div class="ms-hd"><div class="ms-who">${E.on ? `<span class="ms-ord" title="Posição na iniciativa">${pos}</span>` : ""}<b class="ms-nm">${escH(nomeSob(x, i))}</b>${ar ? `<span class="chip s" style="--c:${ar[1]}">${ar[0]}</span>` : ""}${x.jog ? `<small>${escH(x.jog)}</small>` : ""}</div><div class="ms-bds">${bd}</div><button class="b o ms-ex" data-ms="ex" data-id="${escH(x.id)}" aria-expanded="${aberto}">${aberto ? "Fechar" : "Detalhes"}</button></div>
<div class="sgrid">${stat("Dados", "dados", x.dados, 0, 6, i)}${stat("Fuga", "fuga", x.fuga, 0, 12, i, fugaExtra)}${stat("Ferida", "fer", x.fer, x.seq, 6, i)}${stat("Sequelas", "seq", x.seq, 0, 5, i)}${stat("PT", "pt", x.pt, 0, 10, i)}</div>
${condHtml(x, i)}${habChips(x, i)}${acts}${!mr ? `<div class="row ms-acts"><button class="b o ms-tg${x.aus ? " on" : ""}" data-ms="aus" data-i="${i}" aria-pressed="${!!x.aus}" title="Fora da cena: a iniciativa pula esta sobrevivente, como a de quem escapou">${x.aus ? "Ausente do encontro: voltar à cena" : "Ausente do encontro"}</button></div>` : ""}${aberto ? detalhes(x, i) : ""}</div>`;
  }

  function sobsHtml() {
    if (!D.sob.length) return `<div class="ms-empty">Nenhuma sobrevivente cadastrada. Adicione as personagens da mesa para acompanhar dados, feridas, condições e habilidades.</div>`;
    return ordem().map((a, k) => (a.ass ? "" : cartao(a.x, a.i, k + 1))).join("");
  }

  function assResumo() {
    const pn = pas();
    return `<div class="card ms-ass${vezAss() ? " vez" : ""}" style="--c:#8a1fb0"><div class="ch"><h3>${escH(nomeAss())}</h3><span><span class="chip">${D.a1}</span><span class="chip">${D.a2}</span></span></div>
<div class="ms-ass-g"><div><div class="lab">Pilha de dados</div>${cnt("D.dados", D.dados, 0, Infinity)}</div><div><div class="lab">Pontos de Horror</div>${cnt("D.ph", D.ph, 0, Infinity)}</div></div>
<small>Passiva escolhida: <b>${pn}</b>${D.pe ? " · Poder especial: <b>" + escH(D.pe) + "</b>" : " · sem Poder Especial escolhido"}${D.au1 || D.au2 ? " · Ações únicas: <b>" + [D.au1, D.au2].filter(Boolean).join(", ") + "</b>" : ""}</small></div>`;
  }

  /* Lembretes à Diretora: regras do livro que o site não automatiza. */
  function lembretes() {
    const L = [
      ["Infecção", "No encontro sobe por rodada (pendência). Fora dele, sobe a cada tipo de cena que passa: ajuste com +/− no cartão da sobrevivente. Reduzir descartando dado, passar a outra sobrevivente e escolher a especialidade incapacitada: à mão."],
      ["Possessão", "Sobe +1 por dado de falha quando a sobrevivente tenta superar um Risco. O site não vê esses testes: some à mão."],
      ["Restringir e Amaldiçoar", "Dificuldade +1, Feridas por falha, redução por sucesso e o contador do recurso amaldiçoado: tudo à mão."],
      ["Susto", "Assustar só existe em Cena Livre e Cena de Suspense; em encontro não há botão. Jumpscare (2 PH, ao começar o encontro) segue como a exceção do livro. Ataque do Coração, que pede um Teste de Susto durante o encontro, fica sem uso."],
      ["Testes fora das ações do encontro", "Riscos e Cenas Livres são rolados na mesa. A Mesa só controla as ações de encontro e o Teste de Susto aberto por ela."],
      ["Cena Livre e Cena de Suspense", "Sacrifício de dados falhos ao Assassino, Caminhos, Passos, Armadilhas e a resolução da Suspense não são controlados aqui. Cuide da pilha do Assassino na Ficha da Diretora."],
      ["Qualidades do cenário", "Qualidades favoráveis, neutras e negativas não são rastreadas (por isso Indiferença Perturbadora, Caiam na Teia e Destruir pedem sua escolha)."],
      ["Passivas do Assassino", "Monstruosidade, Obstinada, Assombração e Mestre (Horda) são aplicadas por você. Estratégico, Máquina, Desconhecida e Perseguidor aparecem só como lembrete."],
      ["Incapacitar e Destruir", "O site anota a condição; impedir a especialidade, a vantagem ou o recurso é com você."],
      ["Pontos de Horror de eventos de cena", "Ganhos por eventos fora do encontro (morte em Suspense, queda em armadilha etc.) usam os botões da Ficha da Diretora; nada é somado sozinho aqui."],
      ["Pontos sem resposta no livro", "Quando Assustar pode ser usado, quantas ações o Assassino faz por turno, o arredondamento de “metade” em Tudo Por Você!, o limite de dados do Vai na Fé!, Mutilar como “última chance de correr” e o momento exato de Eu Voltarei. A Mesa não decide por você."],
    ];
    return `<details class="card ms-lem" style="--c:#d9a21b"><summary><b>⚠ O que o site não automatiza (lembretes da Diretora)</b></summary><ul>${L.map((l) => `<li><b>${l[0]}:</b> ${l[1]}</li>`).join("")}</ul></details>`;
  }

  /* Aviso grande na tela a cada troca de turno no encontro (nome da sobrevivente em cena, ou do Assassino). */
  function anunciaVez() {
    const E = D.enc;
    if (!E.on) { UI.ultVez = null; return; }
    if (UI.ultVez === undefined) { UI.ultVez = E.vez; return; } /* página aberta no meio do encontro: não anuncia */
    if (UI.ultVez === E.vez) return;
    UI.ultVez = E.vez;
    const ass = E.vez === "ass", x = D.sob.find((q) => q.id === E.vez);
    if (!ass && !x) return;
    const ar = x && AR[x.arq], cor = ass ? "#b04bd6" : ar ? ar[1] : "#e8e8e8";
    const nome = ass ? nomeAss() : nm(x);
    document.querySelectorAll(".ms-vezov").forEach((e) => e.remove());
    const el = document.createElement("div");
    el.className = "ms-vezov";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.style.setProperty("--c", cor);
    el.innerHTML = `<div class="ms-vezov-i"><small>Rodada ${E.rod} · Vez de</small><b></b></div>`;
    el.querySelector("b").textContent = nome;
    const fecha = () => { el.classList.add("out"); setTimeout(() => el.remove(), 250); };
    el.addEventListener("click", fecha);
    document.body.appendChild(el);
    setTimeout(fecha, 2200);
  }

  function mesa() {
    const E = D.enc;
    anunciaVez();
    E.pend = E.pend.filter((p) => D.sob.some((x) => x.id === p.id));
    if (E.on && !ordem().some((a) => a.id === E.vez)) E.vez = primeiro();
    if (E.su && E.su.fin === false && !E.on && E.su.t === "jump") E.su = null;
    if (E.fe && !D.sob.some((x) => x.id === E.fe.id)) E.fe = null;
    return `<h2>Mesa da Diretora</h2><p class="ms-sub">Conduza o encontro, os turnos e o estado de cada sobrevivente. Use o botão <b>Regras</b> para consultar o livro sem sair daqui.</p>
${barHtml()}${encHtml()}${E.su ? `<div class="card ms-su" style="--c:#c8501f"><div class="ch"><h3>Teste de Susto</h3></div>${susHtml()}</div>` : ""}${assResumo()}${acoesHtml()}
<h3 class="ms-h3">Sobreviventes <small>${D.sob.length ? pl(D.sob.filter((x) => !morta(x)).length, "viva", "vivas") + " de " + D.sob.length : ""}</small></h3>
${sobsHtml()}
${lembretes()}
<div class="row ms-foot"><button class="b" data-a="sadd">+ Adicionar sobrevivente</button><button class="b o" data-ms="nova">${UI.conf ? "Confirmar: zerar usos da sessão" : "Nova sessão: zerar usos"}</button></div>
${UI.conf ? "<small>Desmarca habilidades usadas, Arriscar Tudo, a 1ª ferida da Descontrolada e o poder de 1×/sessão. Dados, feridas e condições não mudam.</small>" : ""}`;
  }
  window.mesa = mesa;

  /* Funções que a Ficha da Diretora reaproveita, para Mesa e Ficha aplicarem o Ferir do mesmo jeito. */
  window.BRM = {
    /* Mesmo Ferir da Mesa (kill = 6 mata, mut = Mutilar, seq = dado menor que 6). */
    ferirAplica(k, id, v) {
      const x = D.sob.find((s) => s.id === id);
      if (!x) {
        D.dados = Math.max(0, D.dados - 1);
        if (k === "mut") { D.ph += 4; D.log.push("+4 PH: Mutilar (sem sobrevivente registrada)"); }
        else D.log.push((k === "kill" ? "Ferir 6" : "Ferir: dado " + v) + " (sem sobrevivente registrada, −1 dado)");
        return { msg: "" };
      }
      if (k === "kill") mata6(x);
      else if (k === "mut") mutila(x);
      else aplicaFerir(x, { v });
      checaFim();
      return { msg: "" };
    },
  };

  /* ------------------------------------------------------------------ EVENTOS */
  document.addEventListener("click", (e) => {
    const ref = e.target.closest && e.target.closest('[data-gl="ref"]');
    if (ref && !ref.closest("#gl-host") && !ref.closest("#ms-dr")) {
      e.stopPropagation();
      abrirDr(ref.dataset.n);
      return;
    }
    const b = e.target.closest && e.target.closest("[data-ms]");
    if (!b || b.disabled) return;
    const a = b.dataset.ms, E = D.enc, i = +b.dataset.i, j = +b.dataset.j, d = +b.dataset.d;
    const x = D.sob[i], xid = D.sob.find((s) => s.id === b.dataset.id);
    if (a !== "nova") UI.conf = false;
    const R = UI.rv;
    if (a === "ini") iniciar();
    else if (a === "fim") encerrar("Encerrado pela Diretora.");
    else if (a === "next" || a === "prev") { avanca(a === "next" ? 1 : -1); UI.quem = ""; UI.acao = ""; UI.rs = ""; }
    else if (a === "comeca") { E.ini = false; }
    else if (a === "vez") { if (ordem().some((o) => o.id === b.dataset.id)) { if (E.vez === "ass" && b.dataset.id !== "ass") { E.nomat = false; E.dist = 0; E.fe = null; } E.vez = b.dataset.id; E.ini = false; UI.quem = ""; UI.acao = ""; UI.rs = ""; } }
    else if (a === "tog") E[b.dataset.f] = !E[b.dataset.f];
    else if (a === "aus" && x) { x.aus = !x.aus; D.log.push(nm(x) + (x.aus ? " ficou ausente do encontro (fora da cena)" : " voltou à cena")); if (D.enc.on && x.aus && D.enc.vez === x.id) avanca(1); }
    else if (a === "esc" && x) { x.esc = !x.esc; if (x.esc) saiu(x); }
    else if (a === "aa" && x) { if (aaInfo(x, false).livre) { UI.quem = "sob"; UI.acao = "Arriscar Tudo"; UI.rs = x.id; } else arriscar(x, false); }
    else if (a === "aaf" && x) { arriscar(x, UI.rv.po); UI.rv.po = false; }
    else if (a === "rvt") { UI.rv[b.dataset.f] = !UI.rv[b.dataset.f]; }
    else if (a === "aaT" && x) x.aa = !x.aa;
    else if (a === "ex") { const id = b.dataset.id; UI.ex.has(id) ? UI.ex.delete(id) : UI.ex.add(id); }
    else if (a === "cv" && x && x.cond[j]) { const c = COND[x.cond[j].k]; x.cond[j].v = cl(x.cond[j].v + d, c.min, c.max); }
    else if (a === "cdel" && x) x.cond.splice(j, 1);
    else if (a === "hu" && x && x.hab[j]) x.hab[j].u = !x.hab[j].u;
    else if (a === "hdel" && x) x.hab.splice(j, 1);
    else if (a === "pap") {
      const p = E.pend[j], s = p && D.sob.find((q) => q.id === p.id);
      if (s) {
        if (p.t === "inf") { const c = s.cond.find((c) => c.k === "infectar"); if (c) c.v = Math.min(6, c.v + 1); }
        else if (p.t === "seg") s.fer = Math.min(6, s.fer + 1);
        else if (p.t === "inf6") { D.dados += s.dados; D.log.push("Infecção 6: " + nm(s) + " sacrificou " + s.dados + " dados"); s.dados = 0; }
        else if (p.t === "pos") { const c = s.cond.findIndex((c) => c.k === "possuir"); if (c >= 0) s.cond.splice(c, 1); D.log.push("Possessão 6: Matou " + nm(s) + " através dela"); morre(s); }
        if (p.t === "seg" && s.fer >= 6) morre(s);
      }
      E.pend.splice(j, 1);
    }
    else if (a === "pig") E.pend.splice(j, 1);
    else if (a === "vaz" && x) morre(x);
    else if (a === "resx") E.res = null;
    else if (a === "mp") {
      const k = UI.mpk || "au1";
      if (E.res && !E.res.mp && UI.mpv && gasta(5, "Mudança de Planos")) { D[k] = UI.mpv; E.res.mp = true; UI.mpv = ""; }
    }
    else if (a === "quem") { UI.quem = b.dataset.q; UI.acao = ""; }
    else if (a === "ac") UI.acao = UI.acao === b.dataset.n ? "" : b.dataset.n;
    /* Início do encontro */
    else if (a === "dif") dificultar();
    else if (a === "surp") surpresa();
    else if (a === "jump") susInicia("jump");
    else if (a === "hora") suaHora();
    else if (a === "inato") { if (E.on && E.ini && temP("Inato") && D.ph >= 3 && !usou("inato")) { marca("inato"); D.dados += 1; D.log.push("Inato: +1 dado ao iniciar a cena (3+ PH)"); } }
    /* Susto */
    else if (a === "sus") susInicia("ass");
    else if (a === "sv" && E.su) { E.su.v[b.dataset.id] = b.dataset.r; E.su.d[b.dataset.id] = 0; if (b.dataset.r === "sk") { const s = D.sob.find((q) => q.id === b.dataset.id), h = s && habDe(s, /^Uh\?/i); if (h) h.u = true; } }
    else if (a === "sre" && E.su && xid) { const h = habDe(xid, /^Imposs/i); if (h && !h.u) { h.u = true; delete E.su.v[xid.id]; E.su.d[xid.id] = 0; } }
    else if (a === "sroll" && E.su) susAlvos().forEach((q) => { if (!E.su.v[q.id]) { const v = rnd6(); E.su.d[q.id] = v; E.su.v[q.id] = v >= 4 ? "ok" : "no"; UI.fresh.add("s:" + q.id); } });
    else if (a === "sac" && E.su && !E.su.fin) E.su.ac = !E.su.ac;
    else if (a === "sapp") susAplica();
    else if (a === "scan") susCancela();
    else if (a === "sfim") E.su = null;
    else if (a === "sopc" && E.su && !E.su.opc) { E.su.opc = true; ganha("opc:" + E.su.n, 1, "Susto opcional"); }
    /* Matar */
    else if (a === "mat" && xid) matar(xid.id, false);
    else if (a === "matS" && xid) matar(xid.id, true);
    /* Ferir */
    else if (a === "frol" || a === "fval") {
      const alvo = E.fe && E.fe.acid ? D.sob.find((q) => q.id === E.fe.id) : alvoSel();
      if (alvo && ativa(alvo) && (E.fe && E.fe.acid ? true : vezAss()) && D.dados > 0) {
        const v = a === "frol" ? rnd6() : +b.dataset.v;
        if (a === "frol") UI.fresh.add("f");
        E.fe = { id: alvo.id, v, acid: !!(E.fe && E.fe.acid), cp: false, marca: false, nos: false, ap: false, usou: [] };
      }
    }
    else if (a === "fcan") { if (E.fe && E.fe.acid && E.fe.v === null) { D.ph += 4; D.log.push("+4 PH: Acidentar cancelado"); } E.fe = null; }
    else if (a === "fcp" && E.fe) E.fe.cp = !E.fe.cp;
    else if (a === "fmk" && E.fe) E.fe.marca = !E.fe.marca;
    else if (a === "fsm" && E.fe) E.fe.nos = !E.fe.nos;
    else if (a === "fole" && E.fe) { const s = D.sob.find((q) => q.id === E.fe.id), h = s && habDe(s, /^Ol[ée]!/i); if (h && !h.u && E.fe.v < 6) { h.u = true; E.fe.v = rnd6(); UI.fresh.add("f"); } }
    else if (a === "fapp" && E.fe) { const s = D.sob.find((q) => q.id === E.fe.id); if (s && ativa(s) && D.dados > 0 && aplicaFerir(s, E.fe)) { if (morta(s)) E.fe = null; else E.fe.ap = true; } }
    else if (a === "fmat" && E.fe) { const s = D.sob.find((q) => q.id === E.fe.id); if (s && ativa(s)) { mata6(s); E.fe = null; } }
    else if (a === "fmut" && E.fe) { const s = D.sob.find((q) => q.id === E.fe.id); if (s && ativa(s)) { mutila(s); E.fe = null; } }
    else if (a === "afer") aoFerir(b.dataset.k);
    else if (a === "ffim") E.fe = null;
    else if (a === "acid" && xid && !E.fe && gasta(4, "Acidentar")) E.fe = { id: xid.id, v: null, acid: true, cp: false, marca: false, nos: false, ap: false, usou: [] };
    /* Escapar e poderes */
    else if (a === "trauma") UI.trauma = !UI.trauma;
    else if (a === "escap") escapar(false);
    else if (a === "escapF") escapar(true);
    else if (a === "au") colocaMarc(b.dataset.k);
    else if (a === "devo") ganha(evk(), 1, "Devorar: 6 anunciado");
    else if (a === "vejo") eVejo();
    else if (a === "nhs") naoHaSaida();
    else if (a === "banho") banho();
    else if (a === "indif") { const o = ordem(); if (E.on && o[0] && o[0].id === E.vez && gasta(2, "Indiferença Perturbadora (rodada " + E.rod + "): ignora uma qualidade neutra só para o Assassino por um turno. A Diretora escolhe qual.")) E.ev.push("indif:" + E.rod); }
    else if (a === "teia") { if (!(E.sx || []).includes("teia")) { if (gasta(5, "Caiam na Teia: ativa uma qualidade negativa no cenário. A Diretora escolhe qual.")) E.sx.push("teia"); } }
    else if (a === "susp5") { if (!E.on) poderLivre("Cansei de Brincar: Caminho Armadilha vira Caminho Mortal (anote qual)", 5); }
    else if (a === "susp5f") { if (!E.on) poderLivre("Fim da Esperança: mantém um Passo oculto na 1ª rodada da Suspense", 5); }
    else if (a === "int") { const it = INT[+b.dataset.i], k = b.dataset.k; if (it) ganha(k || null, it[0], it[1]); }
    else if (a === "uni") { const it = TI[b.dataset.n]; if (it) ganha(null, it[0], "Único: " + b.dataset.n); }
    else if (a === "maq") { if (E.on && !usou("maq") && D.dados > 0) { marca("maq"); D.dados -= 1; ganha(null, 3, "Máquina: descartou 1 dado"); } }
    /* Sobreviventes */
    else if (a === "rv") {
      const f = b.dataset.f, q = D.sob.find((s) => s.id === UI.rs) || D.sob.find((s) => s.id === E.vez), mx = q ? q.dados : 0;
      R.n = cl(R.n, 0, mx); R.s = cl(R.s, 0, R.n); R.six = cl(R.six, 0, R.s);
      R[f] = (+R[f] || 0) + d;
      R.n = cl(R.n, 1, Math.max(1, mx)); R.s = cl(R.s, 0, R.n); R.six = cl(R.six, 0, R.s);
    }
    else if (a === "rvcx") { R.cx = (R.cx === null ? cxDef(UI.acao) : R.cx) ? false : true; }
    else if (a === "res") resolve();
    else if (a === "nova") {
      if (!UI.conf) UI.conf = true;
      else { D.sob.forEach((s) => { s.aa = false; s.f1 = false; s.hab.forEach((h) => (h.u = false)); }); E.sx = []; UI.conf = false; toast("Usos da sessão zerados."); }
    }
    else return;
    if (D.enc.on) checaFim();
    if (D.enc.res && D.enc.res.mp === false && !pe("Mudança de Planos")) D.enc.res.mp = true;
    render();
  });

  /* Selects: adicionam na hora (condição ou habilidade) ou guardam uma escolha de tela. */
  document.addEventListener("change", (e) => {
    const t = e.target, m = t.dataset && t.dataset.msSel;
    if (!m) return;
    if (m === "ui") {
      const f = t.dataset.f;
      if (f === "dest") UI.rv.dest = t.value;
      else UI[f] = t.value;
      render();
      return;
    }
    if (!t.value) return;
    const x = D.sob[+t.dataset.i];
    if (!x) return;
    if (m === "cadd") {
      const c = COND[t.value];
      if (!c) return;
      x.cond.push({ k: t.value, v: c.ini ?? 0, attr: "", txt: "" });
    } else if (m === "hadd") {
      const p = t.value.split(":"), n = +p[1];
      if (AR[p[0]] && AR[p[0]][4][n] && !x.hab.some((h) => h.k === p[0] && h.i === n)) x.hab.push({ k: p[0], i: n, u: false });
    }
    render();
  });

  /* ------------------------------------------------------------------ CONSULTA RÁPIDA */
  const DR = { q: "", f: "mais", prev: null };
  const FILTROS = {
    mais: ["Mais usadas"],
    sob: ["Ações da Sobrevivente", (e) => e.c === "aco" && e.g === "Sobrevivente"],
    ass: ["Ações do Assassino", (e) => e.c === "aco" && /^Assassino/.test(e.g || "")],
    enc: ["Encontro", (e) => e.c === "enc"],
    con: ["Condições", (e) => e.c === "con"],
    van: ["Vantagens", (e) => e.c === "van"],
    num: ["Números e iniciativa"],
  };
  function drRes() {
    const G = window.GLX, box = document.getElementById("ms-res"), chips = document.getElementById("ms-chips");
    if (!box) return;
    chips.innerHTML = Object.entries(FILTROS).map(([k, f]) => `<button type="button" class="gl-chip${!DR.q.trim() && DR.f === k ? " on" : ""}" data-mq="f" data-k="${k}" aria-pressed="${!DR.q.trim() && DR.f === k}">${f[0]}</button>`).join("");
    if (!G) { box.innerHTML = '<p class="gl-none">Glossário indisponível.</p>'; return; }
    let h = "";
    const tabela = () => G.tb(["Regra", "Valor"], G.NUMS) + `<h4 class="ms-h4">Ordem de iniciativa</h4><ol class="gl-ini">${G.INI.map((n) => `<li>${n}</li>`).join("")}</ol>`;
    if (DR.q.trim()) {
      const r = G.run(DR.q, "all");
      h = r.length ? r.slice(0, 40).map((o) => G.card(o.e, true)).join("") : `<p class="gl-none">Nenhum termo encontrado para “${G.esc(DR.q)}”. Tente outra palavra.</p>`;
    } else if (DR.f === "mais") h = MAIS.map((n) => G.get(n)).filter(Boolean).map((e) => G.card(e, false)).join("") + `<h4 class="ms-h4">Números-chave</h4>` + G.tb(["Regra", "Valor"], G.NUMS);
    else if (DR.f === "num") h = tabela();
    else h = G.T.filter(FILTROS[DR.f][1]).map((e) => G.card(e, false)).join("");
    box.innerHTML = mt(h);
  }
  function montaDr() {
    let ov = document.getElementById("ms-dr");
    if (ov) return ov;
    ov = document.createElement("div");
    ov.id = "ms-dr";
    ov.className = "ms-dr-ov";
    ov.hidden = true;
    ov.innerHTML = `<div class="ms-dr gl" role="dialog" aria-modal="true" aria-labelledby="ms-dr-t"><div class="ms-dr-h"><h3 id="ms-dr-t">Consulta rápida</h3><button type="button" class="b o" data-mq="x" aria-label="Fechar consulta">✕ Fechar</button></div><input id="ms-q" type="search" inputmode="search" placeholder="Buscar regra: ferida, fuga, PT, susto…" autocomplete="off" spellcheck="false" aria-label="Buscar regra"><div id="ms-chips" class="gl-chips" role="group" aria-label="Categorias"></div><div id="ms-res" class="ms-res-l" aria-live="polite"></div></div>`;
    document.body.append(ov);
    const inp = ov.querySelector("#ms-q");
    inp.addEventListener("input", () => { DR.q = inp.value; drRes(); });
    ov.addEventListener("click", (e) => {
      const r = e.target.closest("[data-gl='ref']");
      if (r) { e.stopPropagation(); DR.q = r.dataset.n; inp.value = DR.q; drRes(); ov.querySelector(".ms-dr").scrollTop = 0; return; }
      const b = e.target.closest("[data-mq]");
      if (b) {
        if (b.dataset.mq === "x") fechaDr();
        else if (b.dataset.mq === "f") { DR.f = b.dataset.k; DR.q = ""; inp.value = ""; drRes(); ov.querySelector(".ms-dr").scrollTop = 0; }
      } else if (e.target === ov) fechaDr();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !ov.hidden) { e.preventDefault(); fechaDr(); } });
    return ov;
  }
  function abrirDr(termo) {
    const ov = montaDr(), inp = ov.querySelector("#ms-q");
    DR.prev = document.activeElement;
    if (typeof termo === "string") { DR.q = termo; inp.value = termo; }
    ov.hidden = false;
    drRes();
    syncFab();
    inp.focus();
  }
  function fechaDr() {
    const ov = document.getElementById("ms-dr");
    if (ov) ov.hidden = true;
    syncFab();
    if (DR.prev && DR.prev.isConnected && DR.prev.focus) DR.prev.focus();
  }

  let fab = null;
  function syncFab() {
    if (!fab) {
      fab = document.createElement("button");
      fab.type = "button";
      fab.className = "b ms-fab";
      fab.textContent = "📖 Regras";
      fab.setAttribute("aria-label", "Abrir consulta rápida de regras");
      fab.addEventListener("click", () => abrirDr());
      document.body.append(fab);
    }
    const ov = document.getElementById("ms-dr");
    fab.hidden = !(typeof role !== "undefined" && role === "m" && tab !== "gloss") || (ov && !ov.hidden);
    const nv = document.getElementById("nav");
    document.documentElement.style.setProperty("--ms-top", (nv ? nv.offsetHeight : 50) + "px");
  }
  const app = document.getElementById("app");
  if (app) new MutationObserver(syncFab).observe(app, { childList: true });
  window.addEventListener("resize", syncFab);
  syncFab();
})();
