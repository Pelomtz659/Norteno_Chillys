// ======================
//  AÑO ACTUAL EN FOOTER
// ======================
(function setYear() {
  const yearEl = document.getElementById('displayYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

// ======================
//   MENÚ MÓVIL
// ======================
(function mobileNav() {
  const navToggle = document.getElementById('navToggle');
  const body = document.body;

  if (!navToggle) return;

  navToggle.addEventListener('click', () => {
    body.classList.toggle('nav-open');
  });

  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        body.classList.remove('nav-open');
      }
    });
  }
})();

// ======================
//   TEMA OSCURO / CLARO
// ======================
(function themeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const body = document.body;
  const THEME_KEY = 'nortenochilis-theme';

  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') {
    body.classList.add('theme-dark');
  }

  const updateIcon = () => {
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = body.classList.contains('theme-dark')
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';
  };

  updateIcon();

  btn.addEventListener('click', () => {
    body.classList.toggle('theme-dark');
    localStorage.setItem(
      THEME_KEY,
      body.classList.contains('theme-dark') ? 'dark' : 'light'
    );
    updateIcon();
  });
})();

// ======================
//        SLIDER
// ======================
(function heroSlider() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  if (!slides.length) return;

  let currentIndex = 0;
  let intervalId = null;
  const AUTO_INTERVAL = 6000; // velocidad del autoplay

  const dotsContainer = document.querySelector('[data-dots]');
  const prevBtn = document.querySelector('[data-prev]');
  const nextBtn = document.querySelector('[data-next]');

  const dots = [];

  // Crear puntos del slider
  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.type = 'button';
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function setActiveSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    currentIndex = index;
  }

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    setActiveSlide(index);
    restartAutoPlay();
  }

  function next() {
    goToSlide(currentIndex + 1);
  }

  function prev() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    intervalId = setInterval(next, AUTO_INTERVAL);
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function restartAutoPlay() {
    startAutoPlay();
  }

  // Botones manuales
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Pausa en hover
  const controlsArea = document.querySelector('.slider-controls');
  if (controlsArea) {
    controlsArea.addEventListener('mouseenter', stopAutoPlay);
    controlsArea.addEventListener('mouseleave', startAutoPlay);
  }

  // ===========================
  //   PRE-CARGA DE IMÁGENES
  //   (SOLUCIÓN DEFINITIVA)
  // ===========================
  function waitForImages() {
    const imgs = [];

    slides.forEach(slide => {
      const bg = slide.style.backgroundImage;
      if (bg && bg.includes("url")) {
        const url = bg.slice(5, -2);
        const img = new Image();
        img.src = url;
        imgs.push(img);
      }
    });

    let loaded = 0;

    imgs.forEach(img => {
      img.onload = () => {
        loaded++;
        if (loaded === imgs.length) {
          // Iniciar slider solo cuando ya cargaron todas
          setActiveSlide(0);
          startAutoPlay();
        }
      };
    });
  }

  waitForImages();
})();
