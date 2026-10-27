// Acrescenta versao_pagina aos links do formulário (form.auvp.com.br), sem mexer no que já existe.
// Injetado em todo HTML do build por scripts/inject-snippets.mjs; a versão da página (a ou b) entra no lugar do marcador abaixo.
(function () {
  var VERSAO = "__VERSAO__";
  var HOST = "form.auvp.com.br";
  var PARAM = "versao_pagina";

  function comParametro(href) {
    try {
      if (new URL(href, location.href).hostname !== HOST) return href;
    } catch (e) {
      return href;
    }
    var i = href.indexOf("#");
    var base = i < 0 ? href : href.slice(0, i);
    var hash = i < 0 ? "" : href.slice(i);
    if (new RegExp("[?&]" + PARAM + "=").test(base)) return href;
    var sep = base.indexOf("?") < 0 ? "?" : /[?&]$/.test(base) ? "" : "&";
    return base + sep + PARAM + "=" + VERSAO + hash;
  }

  function ajustar(link) {
    var atual = link.getAttribute("href");
    if (atual === null) return;
    var novo = comParametro(atual);
    if (novo !== atual) link.setAttribute("href", novo);
  }

  function varrer(raiz) {
    if (raiz.nodeName === "A") ajustar(raiz);
    var links = raiz.querySelectorAll ? raiz.querySelectorAll("a[href]") : [];
    for (var i = 0; i < links.length; i++) ajustar(links[i]);
  }

  var abrir = window.open;
  window.open = function (url) {
    if (typeof url === "string") arguments[0] = comParametro(url);
    return abrir.apply(this, arguments);
  };

  varrer(document);
  // Cobre links criados depois do carregamento e hrefs reescritos por outros scripts.
  new MutationObserver(function (mudancas) {
    for (var i = 0; i < mudancas.length; i++) {
      var m = mudancas[i];
      if (m.type === "attributes") ajustar(m.target);
      else
        for (var j = 0; j < m.addedNodes.length; j++)
          if (m.addedNodes[j].nodeType === 1) varrer(m.addedNodes[j]);
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href"],
  });
})();
