/*
 * AUVP Sempre: menu móvel.
 *
 * Compartilhado entre index.html (versão A) e um eventual b.html (versão B).
 * O FAQ usa <details> nativo e não depende deste arquivo.
 */
(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  if (!toggle || !menu) return;

  var label = toggle.querySelector(".sr-only");

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Fechar menu" : "Abrir menu";
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
})();
