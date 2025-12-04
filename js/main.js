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

})(); // Cierre de heroSlider()

// ======================
//   MÚLTIPLES MAPAS DE UBICACIÓN
// ======================
(function locationSwitcher() {
  const mapElement = document.getElementById('googleMap');
  const buttons = document.querySelectorAll('.location-btn');
  if (!mapElement || !buttons.length) return;

  // URLs de las sucursales
  const locations = {
    cuauhtemoc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58302.67624917888!2d-104.69659702645167!3d24.033982512803632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869bb7d85e390589%3A0x352d3ba28ed6b210!2sNorte%C3%B1o%20Chilis%20Tacos!5e0!3m2!1ses-419!2smx!4v1764048709565!5m2!1ses-419!2smx", // N. Chilis Cuauhtémoc
    villa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58302.67624917888!2d-104.69659702645167!3d24.033982512803632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869bb6f8cefd8f73%3A0x1be3696b70a1d9bb!2sNorte%C3%B1o%20Chili's%20Fco%20Villa%20Rinconada%20Sol!5e0!3m2!1ses-419!2smx!4v1764048673024!5m2!1ses-419!2smx",       // N. Chilis Fco. Villa
    futura: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1576.4389659972332!2d-104.6600000!3d24.0200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx"       // Próxima Apertura
  };
  
  const defaultLocationKey = 'cuauhtemoc';

  // Función para cargar el mapa
  function loadMap(locationKey) {
    const url = locations[locationKey];
    if (url) {
      mapElement.src = url;
    }
  }

  // Función para actualizar los estilos de los botones
  function updateButtons(activeButton) {
    buttons.forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    });
    activeButton.classList.remove('btn-outline');
    activeButton.classList.add('btn-primary');
  }

  // Manejador de eventos para los botones
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      // ✅ Aquí obtenemos la clave correcta (ej: 'villa')
      const locationKey = e.currentTarget.dataset.location;
      
      loadMap(locationKey);
      
      updateButtons(e.currentTarget);
    });
  });

  // --- Carga Inicial ---
  loadMap(defaultLocationKey);
  
  // Aseguramos que el botón inicial esté activo
  const initialButton = document.querySelector(`[data-location="${defaultLocationKey}"]`);
  if (initialButton) {
      // Aquí llamamos a updateButtons para que el botón de inicio se vea PRIMARY
      updateButtons(initialButton);
  }
})(); // Cierre de locationSwitcher()