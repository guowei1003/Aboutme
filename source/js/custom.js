(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("scroll-top-button") || document.getElementById("scroll-top");
    if (!btn) return;
    btn.style.transition = "opacity 160ms ease, background-color 160ms ease, color 160ms ease";
  });
})();
