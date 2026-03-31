// Kapibala 全站动效与交互增强
(function () {
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function throttle(fn, wait) {
    let ticking = false;
    return function throttled() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        fn();
        window.setTimeout(function () {
          ticking = false;
        }, wait);
      });
    };
  }

  function setupNavbarScrolledState() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;

    var onScroll = throttle(function () {
      if (window.scrollY > 24) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }, 80);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupRevealAnimation() {
    if (prefersReducedMotion()) return;

    var targets = document.querySelectorAll(
      ".post-content h2, .post-content h3, .post-content p, .post-preview, .index-card, .evolution-container .item, .evolution-container .philosophy"
    );

    if (!targets.length) return;

    targets.forEach(function (el) {
      el.classList.add("kb-reveal");
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-inview");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function setupBackToTopEnhance() {
    var btn = document.getElementById("scroll-top-button") || document.getElementById("scroll-top");
    if (!btn) return;
    btn.style.transition = "opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms cubic-bezier(0.22, 1, 0.36, 1)";
  }

  function enforceBrandTitle() {
    var brand = document.querySelector("#navbar .navbar-brand");
    if (!brand) return;

    var current = (brand.textContent || "").trim();
    if (!current || current === "Fluid") {
      brand.textContent = "AI芝士";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    enforceBrandTitle();
    setupNavbarScrolledState();
    setupRevealAnimation();
    setupBackToTopEnhance();
  });
})();
