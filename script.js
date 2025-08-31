// 🔧 CONFIG — Número e mensagem padrão
const WHATS_NUMBER = '5511999999999'; // Substitua pelo número real
const WHATS_MSG = 'Olá, vim do site e quero um orçamento de divisória sanfonada.';

function buildWhatsLink(extra=''){
  const msg = encodeURIComponent(extra ? `${WHATS_MSG} ${extra}` : WHATS_MSG);
  return `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
}

// Atualiza ano no footer
const year = document.getElementById('year');
if(year) year.textContent = new Date().getFullYear();

// Aplica link do WhatsApp nos botões
const links = [
  document.getElementById('cta-whats-hero'),
  document.getElementById('cta-whats-band'),
  document.getElementById('wa-float'),
  document.getElementById('footer-whats')
];
links.forEach(el => el && (el.href = buildWhatsLink()));

// UTM forwarding
const params = new URLSearchParams(window.location.search);
if(params.toString()){
  links.forEach(el => {
    if(!el) return;
    const tag = `\nUTM: ${decodeURIComponent(params.toString())}`;
    el.href = buildWhatsLink(tag);
  });
}

// --- Carrossel de Logos (Swiper) ---
// Configurações inspiradas no Elementor: 5 colunas desktop, 3 no mobile,
// autoplay contínuo, loop infinito, sem navegação, velocidade suave.
(function initLogosSwiper() {
  const el = document.querySelector('.logos-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper('.logos-swiper', {
    slidesPerView: 5,
    spaceBetween: 24,
    loop: true,
    speed: 1500, // duração da transição (ms) — similar ao "speed" do Elementor
    allowTouchMove: true,
    autoplay: {
      delay: 300,               // tempo entre *inícios* das transições
      disableOnInteraction: false,
      pauseOnMouseEnter: false, // equivalente a "pause_on_hover": no
    },
    // sem setas / paginação (navigation: none)
    // breakpoints para mobile:
    breakpoints: {
      0:   { slidesPerView: 3, spaceBetween: 16 }, // mobile
      600: { slidesPerView: 4, spaceBetween: 20 }, // tablets pequenos
      920: { slidesPerView: 5, spaceBetween: 24 }, // desktop
    }
  });
})();


// --- Carrossel de Logos: movimento contínuo, colorido e maior ---
(function initLogosSwiper() {
  const el = document.querySelector('.logos-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper('.logos-swiper', {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: true,
    allowTouchMove: false,
    speed: 3000, // suave contínuo
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
    }
  });
})();

// --- Carrossel de Depoimentos: 3 colunas desktop, 2 tablet, 1 mobile ---
(function initTestimonialsSwiper() {
  const el = document.querySelector('.testimonials-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper('.testimonials-swiper', {
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
    }
  });
})();

// Lightbox simples
document.querySelectorAll('#galeria .thumb').forEach(thumb => {
  thumb.addEventListener('click', function(e) {
    e.preventDefault();
    const src = this.getAttribute('href');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
  });
});

document.querySelector('#lightbox .close').addEventListener('click', () => {
  document.getElementById('lightbox').style.display = 'none';
});

// Fechar com clique fora da imagem
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    e.target.style.display = 'none';
  }
});

// ===== Contadores (IntersectionObserver + animação suave) =====
(function initCounters(){
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const duration = parseInt(el.getAttribute('data-duration') || '1500', 10);
    const start = 0;
    const startTime = performance.now();

    const formatter = (n) => {
      // formata com milhar para o caso de 10.000
      return n.toLocaleString('pt-BR');
    };

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(start + (target - start) * eased);
      el.textContent = formatter(value);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const once = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !once.has(entry.target)) {
        once.add(entry.target);
        animate(entry.target);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach(c => io.observe(c));
})();

document.getElementById("nav-toggle").addEventListener("click", function () {
  document.getElementById("nav-menu").classList.toggle("active");
});
