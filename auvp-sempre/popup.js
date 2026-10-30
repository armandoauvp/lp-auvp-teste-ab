/*
 * AUVP Sempre: popup de tela cheia com a oferta.
 *
 * Gatilhos:
 * - Qualquer elemento com `data-popup-sempre-gatilho="<nome>"` abre o popup
 *   quando metade dele aparece na tela. O nome vai para o GTM, para saber qual
 *   ponto da página converteu.
 * - O popup aparece uma vez por sessão do navegador (sessionStorage). Fechou,
 *   não volta até a pessoa abrir o site de novo.
 * - `data-popup-sempre-auto` no <dialog> abre assim que a página carrega e
 *   ignora o limite da sessão. Só a prévia (/auvp-sempre/popup/) usa.
 *
 * Eventos no dataLayer: popup_sempre_aberto, popup_sempre_clique e
 * popup_sempre_fechado, todos com `popup_gatilho`.
 */
(function () {
  var dialog = document.getElementById("popup-sempre");
  if (!dialog || typeof dialog.showModal !== "function") return;

  var CHAVE = "auvp-sempre-popup-visto";
  var gatilhoAtual = "";

  function registrar(evento, extra) {
    window.dataLayer = window.dataLayer || [];
    var dados = { event: evento, popup_gatilho: gatilhoAtual };
    for (var k in extra) dados[k] = extra[k];
    window.dataLayer.push(dados);
  }

  function jaVisto() {
    try {
      return sessionStorage.getItem(CHAVE) === "1";
    } catch (e) {
      return false;
    }
  }

  function marcarVisto() {
    try {
      sessionStorage.setItem(CHAVE, "1");
    } catch (e) {
      /* navegação privada sem storage: o popup só não fica lembrado */
    }
  }

  function abrir(gatilho) {
    if (dialog.open) return;
    gatilhoAtual = gatilho || "manual";
    dialog.returnValue = "";
    document.documentElement.classList.add("popup-sempre-aberto");
    dialog.showModal();
    marcarVisto();
    registrar("popup_sempre_aberto");
  }

  function fechar(motivo) {
    if (!dialog.open) return;
    dialog.close(motivo || "botao");
  }

  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("popup-sempre-aberto");
    registrar("popup_sempre_fechado", {
      popup_motivo: dialog.returnValue || "esc",
    });
  });

  dialog.addEventListener("click", function (event) {
    // Clique fora do conteúdo não fecha: o popup ocupa a tela inteira e um
    // toque no fundo seria acidental. Fecha pelo X, pelo "Agora não" ou Esc.
    var fecha = event.target.closest("[data-popup-fechar]");
    if (fecha) {
      fechar(fecha.getAttribute("data-popup-fechar"));
      return;
    }
    var plano = event.target.closest("[data-popup-plano]");
    if (plano) {
      registrar("popup_sempre_clique", {
        popup_plano: plano.getAttribute("data-popup-plano"),
      });
    }
  });

  var auto = dialog.hasAttribute("data-popup-sempre-auto");
  if (auto) abrir("previa");

  var gatilhos = document.querySelectorAll("[data-popup-sempre-gatilho]");
  if (!auto && gatilhos.length && "IntersectionObserver" in window) {
    var observador = new IntersectionObserver(
      function (entradas) {
        for (var i = 0; i < entradas.length; i++) {
          if (!entradas[i].isIntersecting || jaVisto()) continue;
          observador.disconnect();
          abrir(entradas[i].target.getAttribute("data-popup-sempre-gatilho"));
          return;
        }
      },
      { threshold: 0.5 },
    );
    gatilhos.forEach(function (el) {
      observador.observe(el);
    });
  }

  window.popupSempre = { abrir: abrir, fechar: fechar };
})();
