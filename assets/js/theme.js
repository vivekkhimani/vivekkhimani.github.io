/* Theme control. The page follows the reader's system setting until they choose
   otherwise here; the choice is remembered and applied before paint by the
   inline script in the head. The button is hidden until this runs, so nobody
   without JavaScript is offered a control that would not work. */
(function () {
  "use strict";
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  var ORDER = ["auto", "light", "dark"];
  var LABEL = { auto: "Auto", light: "Light", dark: "Dark" };

  function current() {
    var t = document.documentElement.getAttribute("data-theme");
    return t === "light" || t === "dark" ? t : "auto";
  }

  function apply(choice) {
    if (choice === "auto") {
      document.documentElement.removeAttribute("data-theme");
      try { localStorage.removeItem("theme"); } catch (e) {}
    } else {
      document.documentElement.setAttribute("data-theme", choice);
      try { localStorage.setItem("theme", choice); } catch (e) {}
    }
    render();
  }

  function render() {
    var c = current();
    btn.textContent = LABEL[c];
    btn.setAttribute("aria-label", "Colour theme: " + LABEL[c] + ". Activate to change.");
  }

  btn.addEventListener("click", function () {
    apply(ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length]);
  });

  btn.hidden = false;
  render();
})();
