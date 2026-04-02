(function () {
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function throttle(fn, wait) {
    var ticking = false;
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
      ".lab-section, .lab-featured, .lab-path, .lab-post-item, .lab-timeline-item, .evolution-stage, .evolution-point, .evolution-principles"
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
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function setupBackToTopEnhance() {
    var btn = document.getElementById("scroll-top-button") || document.getElementById("scroll-top");
    if (!btn) return;
    btn.style.transition = "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupNavbarScrolledState();
    setupRevealAnimation();
    setupBackToTopEnhance();
  });
})();
