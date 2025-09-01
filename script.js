/* =========================================================
   CONFIGURAÇÕES GERAIS
   --------------------------------------------------------- */
// Número do WhatsApp (com DDI + DDD, sem sinais)
const WHATS_NUMBER = "5511992423233";

// Mensagem padrão para o botão/link do WhatsApp
const WHATS_MSG = "Olá, vim do site e gostaria de saber mais sobre as divisórias sanfonadas.";

/* =========================================================
   FUNÇÕES UTILITÁRIAS
   --------------------------------------------------------- */
/**
 * Monta o link do WhatsApp com a mensagem padrão (+ extra opcional)
 * @param {string} extra - Texto adicional (ex.: informações de UTM).
 * @returns {string} URL formatada do WhatsApp
 */
function buildWhatsLink(extra = "") {
  const base = WHATS_MSG + (extra ? ` ${extra}` : "");
  const msg  = encodeURIComponent(base);
  return `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
}

/**
 * Ajuda a buscar elementos por id, ignorando os que não existem
 * @param {string[]} ids - lista de ids
 * @returns {HTMLElement[]} elementos encontrados (existentes)
 */
function getElsById(ids = []) {
  return ids
    .map((id) => document.getElementById(id))
    .filter((el) => Boolean(el));
}

/* =========================================================
   INICIALIZAÇÕES GERAIS (executa após DOM pronto)
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // 1) Atualiza o ano no footer (se existir)
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) Aplica o link do WhatsApp nos botões/links conhecidos
  const whatsTargets = getElsById([
    "cta-whats-hero",
    "cta-whats-band",
    "wa-float",
    "footer-whats",
  ]);

  // Sem UTM (padrão)
  whatsTargets.forEach((el) => (el.href = buildWhatsLink()));

  // 3) Se a URL tiver parâmetros, inclui como "tag" na mensagem
  const params = new URLSearchParams(window.location.search);
  if (params.toString()) {
    const tag = `\nUTM: ${decodeURIComponent(params.toString())}`;
    whatsTargets.forEach((el) => (el.href = buildWhatsLink(tag)));
  }

  // 4) Inicializações de componentes
  initLogosSwiper();
  initTestimonialsSwiper();
  initLightbox();
  initCounters();
  initMobileMenu();
});

/* =========================================================
   SWIPER: LOGOS (carrossel contínuo suave)
   --------------------------------------------------------- */
function initLogosSwiper() {
  const el = document.querySelector(".logos-swiper");
  if (!el || typeof Swiper === "undefined") return;

  new Swiper(".logos-swiper", {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: true,
    allowTouchMove: false,
    speed: 3000, // movimento suave/contínuo
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    freeMode: true,
    freeModeMomentum: false,
    breakpoints: {
      0:   { slidesPerView: 3, spaceBetween: 20 },
      600: { slidesPerView: 4, spaceBetween: 25 },
      920: { slidesPerView: 5, spaceBetween: 30 },
    },
  });
}

/* =========================================================
   SWIPER: DEPOIMENTOS
   --------------------------------------------------------- */
function initTestimonialsSwiper() {
  const el = document.querySelector(".testimonials-swiper");
  if (!el || typeof Swiper === "undefined") return;

  new Swiper(".testimonials-swiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    autoHeight: true,
    speed: 500,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      0:   { slidesPerView: 1, spaceBetween: 10 },
      600: { slidesPerView: 2, spaceBetween: 14 },
      920: { slidesPerView: 3, spaceBetween: 20 },
    },
  });
}

/* =========================================================
   LIGHTBOX SIMPLES (galeria)
   --------------------------------------------------------- */
function initLightbox() {
  const thumbs = document.querySelectorAll("#galeria .thumb");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = lightbox ? lightbox.querySelector(".close") : null;

  if (!thumbs.length || !lightbox || !lightboxImg || !lightboxClose) return;

  // Abre lightbox ao clicar na miniatura
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      e.preventDefault();
      const src = thumb.getAttribute("href");
      if (!src) return;
      lightboxImg.src = src;
      lightbox.style.display = "flex";
    });
  });

  // Fecha ao clicar no X
  lightboxClose.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  // Fecha ao clicar fora da imagem
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
}

/* =========================================================
   CONTADORES (IntersectionObserver + animação easeOutCubic)
   --------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll(".counter-num");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute("data-target") || "0", 10);
    const duration = parseInt(el.getAttribute("data-duration") || "1500", 10);
    const startTime = performance.now();

    const format = (n) => n.toLocaleString("pt-BR");

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const value = Math.round(target * eased);
      el.textContent = format(value);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const seen = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          animate(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((c) => io.observe(c));
}

/* =========================================================
   MENU MOBILE (toggle, clique-fora, ESC, resize, no-scroll)
   --------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu   = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  };
  const close = () => {
    menu.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };

  // Estado inicial do botão ARIA
  toggle.setAttribute("aria-controls", "nav-menu");
  toggle.setAttribute(
    "aria-expanded",
    menu.classList.contains("active") ? "true" : "false"
  );

  // Clique no botão abre/fecha
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.classList.contains("active")) {
      close();
    } else {
      open();
    }
  });

  // Clique fora fecha
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("active")) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) close();
  });

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Ao redimensionar para desktop, garante fechado
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) close();
  });
}
