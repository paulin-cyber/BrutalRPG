/* ==== Confirmação antes de excluir (módulo cf) ==== */
(function () {
  "use strict";
  const esc = (x) => String(x == null ? "" : x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let pass = false, open = null;

  function ask(o, done) {
    if (open) return;
    const prev = document.activeElement;
    const ov = document.createElement("div");
    ov.className = "cf-ov";
    ov.innerHTML = `<div class="cf-box" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" aria-describedby="cf-d"><h3 id="cf-t">${esc(o.title)}</h3><div id="cf-d"><p>${o.msg}</p><p class="cf-warn">Isso não pode ser desfeito.</p></div><div class="cf-btns"><button type="button" class="b o" data-cf="no">Cancelar</button><button type="button" class="b" data-cf="yes">${esc(o.ok || "Confirmar")}</button></div></div>`;
    document.body.append(ov);
    open = ov;
    const no = ov.querySelector('[data-cf="no"]'), yes = ov.querySelector('[data-cf="yes"]');
    const close = (ok) => {
      document.removeEventListener("keydown", key, true);
      ov.remove();
      open = null;
      if (ok) done();
      else if (prev && prev.isConnected && prev.focus) prev.focus();
    };
    const key = (e) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(false); }
      else if (e.key === "Tab") {
        e.preventDefault();
        (document.activeElement === no ? yes : no).focus();
      }
    };
    document.addEventListener("keydown", key, true);
    ov.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cf]");
      if (b) close(b.dataset.cf === "yes");
      else if (e.target === ov) close(false);
    });
    no.focus();
  }

  /* Define, para o botão clicado, o aviso a exibir (ou null se não for uma exclusão). */
  function spec(el) {
    const a = el.dataset.a, id = el.dataset.id;
    if (el.dataset.lx === "reset")
      return { title: "Reiniciar progresso?", msg: "O progresso de todos os desafios será apagado e você recomeça do zero.", ok: "Apagar progresso" };
    if (a === "reset" && el.dataset.o === "S")
      return { title: "Limpar a ficha?", msg: "Todas as informações da ficha da Sobrevivente (nome, arquétipo, dados, PT, marcadores, cicatrizes e imagem) serão apagadas.", ok: "Limpar ficha" };
    if (a === "reset")
      return { title: "Limpar a ficha da Diretora?", msg: "Todas as informações da ficha da Diretora (Ameaças, dados, Pontos de Horror, anotações, registro e sobreviventes da sessão) serão apagadas.", ok: "Limpar ficha" };
    if (a === "sdel") {
      const x = (typeof D !== "undefined" && D.sob) ? D.sob[+id] : null;
      if (!x) return null;
      const n = String(x.n || "").trim() || "sobrevivente sem nome";
      return { title: "Excluir sobrevivente?", msg: `“${esc(n)}” será excluída da lista da Diretora.`, ok: "Excluir" };
    }
    if (a === "mdel") {
      const m = (typeof S !== "undefined" && S.marc) ? S.marc[+id] : null;
      const n = m && String(m.n || "").trim();
      return { title: "Remover marcador?", msg: n ? `O marcador “${esc(n)}” será removido da ficha.` : "Este marcador será removido da ficha.", ok: "Remover" };
    }
    if (a === "cicdel")
      return { title: "Remover cicatriz?", msg: "Esta cicatriz será removida da ficha.", ok: "Remover" };
    return null;
  }

  /* Captura o clique antes dos tratadores do site; só deixa passar depois de confirmado. */
  document.addEventListener("click", (e) => {
    if (open && !(e.target.closest && e.target.closest(".cf-ov"))) { e.stopImmediatePropagation(); e.preventDefault(); return; }
    if (pass || open) return;
    const el = e.target.closest && e.target.closest('[data-a="reset"],[data-a="sdel"],[data-a="mdel"],[data-a="cicdel"],[data-lx="reset"]');
    if (!el) return;
    const o = spec(el);
    if (!o) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    ask(o, () => {
      if (!el.isConnected) return;
      pass = true;
      try { el.click(); } finally { pass = false; }
    });
  }, true);
})();
