/*
 * Nosso processo: animação de entrada das dobras e carrossel de depoimentos.
 *
 * A classe .js no <html> é o que libera o CSS a esconder os blocos antes de
 * aparecerem. Sem script, nada fica escondido.
 */
(function () {
  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var itens = document.querySelectorAll(".animate-item");

  if (!reduzido && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll("video").forEach(function (v) {
            v.play().catch(function () {});
          });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -5% 0px" },
    );
    itens.forEach(function (item) {
      observer.observe(item);
    });
  }

  // Carrossel: rolagem nativa com snap; setas e pontos só movem o trilho.
  var carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;
  var track = carousel.querySelector("[data-carousel-track]");
  var dotsBox = carousel.querySelector("[data-carousel-dots]");
  var slides = Array.prototype.slice.call(track.children);

  function porVez() {
    var primeiro = slides[0].getBoundingClientRect().width;
    return Math.max(1, Math.round(track.clientWidth / primeiro));
  }

  function paginas() {
    return Math.max(1, slides.length - porVez() + 1);
  }

  function atual() {
    var passo = slides[1]
      ? slides[1].offsetLeft - slides[0].offsetLeft
      : track.clientWidth;
    return Math.round(track.scrollLeft / passo);
  }

  function ir(indice) {
    var alvo = Math.max(0, Math.min(indice, paginas() - 1));
    track.scrollTo({
      left: slides[alvo].offsetLeft - slides[0].offsetLeft,
      behavior: reduzido ? "auto" : "smooth",
    });
  }

  function desenharPontos() {
    dotsBox.innerHTML = "";
    for (var i = 0; i < paginas(); i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot";
      b.setAttribute("aria-label", "Ir para o depoimento " + (i + 1));
      b.addEventListener(
        "click",
        (function (n) {
          return function () {
            ir(n);
          };
        })(i),
      );
      dotsBox.appendChild(b);
    }
    marcar();
  }

  function marcar() {
    var n = atual();
    Array.prototype.forEach.call(dotsBox.children, function (d, i) {
      d.setAttribute("aria-current", i === n ? "true" : "false");
    });
  }

  carousel
    .querySelector("[data-carousel-prev]")
    .addEventListener("click", function () {
      ir(atual() - 1);
    });
  carousel
    .querySelector("[data-carousel-next]")
    .addEventListener("click", function () {
      ir(atual() + 1 >= paginas() ? 0 : atual() + 1);
    });

  var espera;
  track.addEventListener("scroll", function () {
    clearTimeout(espera);
    espera = setTimeout(marcar, 80);
  });
  window.addEventListener("resize", desenharPontos);
  desenharPontos();
})();
