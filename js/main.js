// Año actual en footer
(function setYear() {
  const yearEl = document.getElementById('displayYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

// Toggle menú móvil
(function mobileNav() {
  const navToggle = document.getElementById('navToggle');
  const body = document.body;

  if (!navToggle) return;

  navToggle.addEventListener('click', () => {
    body.classList.toggle('nav-open');
  });

  // Cerrar menú al hacer clic en un enlace del menú móvil
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        body.classList.remove('nav-open');
      }
    });
  }
})();

// Modo oscuro / claro con almacenamiento en localStorage
(function themeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const body = document.body;
  const THEME_KEY = 'nortenochilis-theme';

  // Cargar tema guardado
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') {
    body.classList.add('theme-dark');
  }

  const updateIcon = () => {
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (body.classList.contains('theme-dark')) {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  };

  updateIcon();

  btn.addEventListener('click', () => {
    body.classList.toggle('theme-dark');
    const isDark = body.classList.contains('theme-dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    updateIcon();
  });
})();

// Slider básico
(function heroSlider() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  if (!slides.length) return;

  let currentIndex = 0;
  let intervalId = null;
  const AUTO_INTERVAL = 8000;

  const dotsContainer = document.querySelector('[data-dots]');
  const prevBtn = document.querySelector('[data-prev]');
  const nextBtn = document.querySelector('[data-next]');

  const dots = [];

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

  // Eventos botones
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Pausa en hover sobre la zona inferior de controles
  const controlsArea = document.querySelector('.slider-controls');
  if (controlsArea) {
    controlsArea.addEventListener('mouseenter', stopAutoPlay);
    controlsArea.addEventListener('mouseleave', startAutoPlay);
  }

  // Inicializar
  setActiveSlide(0);
  startAutoPlay();
})();
