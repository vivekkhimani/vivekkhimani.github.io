/* Justified rows plus a keyboard-driven lightbox.
   Progressive: without this file the gallery is a plain CSS grid. */
(function () {
  "use strict";

  /* ---- justified rows -------------------------------------------------- */
  function ratios(fig) {
    var r = parseFloat(getComputedStyle(fig).getPropertyValue("--r"));
    return isFinite(r) && r > 0 ? r : 1.5;
  }

  function rowHeight(width, gap, count, sum) {
    return (width - (count - 1) * gap) / sum;
  }

  function layout(gallery) {
    var width = gallery.clientWidth;
    if (!width) return;

    var figures = gallery._figures;
    var gap = parseInt(gallery.dataset.gap, 10) || 6;
    var target = parseInt(gallery.dataset.target, 10) || 240;
    // Narrow screens cannot fit a tall row without dwarfing the text around it.
    if (width < 560) target = Math.max(150, width * 0.5);

    var rows = [], cur = [], sum = 0;
    figures.forEach(function (fig) {
      var r = fig._ratio;
      // Would adding this drop the row below target? Keep it only if that is closer.
      if (cur.length && rowHeight(width, gap, cur.length + 1, sum + r) < target) {
        var without = rowHeight(width, gap, cur.length, sum);
        var with_ = rowHeight(width, gap, cur.length + 1, sum + r);
        if (Math.abs(without - target) <= Math.abs(with_ - target)) {
          rows.push({ figs: cur, sum: sum });
          cur = []; sum = 0;
        }
      }
      cur.push(fig); sum += r;
      if (rowHeight(width, gap, cur.length, sum) <= target) {
        rows.push({ figs: cur, sum: sum });
        cur = []; sum = 0;
      }
    });
    if (cur.length) rows.push({ figs: cur, sum: sum, last: true });

    var frag = document.createDocumentFragment(), prev = target;
    rows.forEach(function (row) {
      var h = rowHeight(width, gap, row.figs.length, row.sum);
      // A short final row is left aligned and never taller than the row above.
      if (row.last) h = Math.min(h, target, prev);
      prev = h;
      var div = document.createElement("div");
      div.className = "jrow";
      div.style.height = Math.round(h) + "px";
      row.figs.forEach(function (fig) {
        fig.style.flex = fig._ratio + " 1 0";
        div.appendChild(fig);
      });
      frag.appendChild(div);
    });
    gallery.innerHTML = "";
    gallery.appendChild(frag);
  }

  var galleries = [].slice.call(document.querySelectorAll(".gallery"));
  galleries.forEach(function (g) {
    g._figures = [].slice.call(g.querySelectorAll("figure"));
    g._figures.forEach(function (f) { f._ratio = ratios(f); });
    g.classList.add("justified");
    layout(g);
  });

  var resizeTimer;
  addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { galleries.forEach(layout); }, 120);
  });

  /* ---- lightbox -------------------------------------------------------- */
  var shots = [].slice.call(document.querySelectorAll(".shot"));
  if (!shots.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo");
  box.innerHTML =
    '<img alt="">' +
    '<div class="bar">' +
      '<button type="button" data-go="-1" aria-label="Previous photo">&larr;</button>' +
      '<button type="button" data-go="1" aria-label="Next photo">&rarr;</button>' +
      '<span class="cap"></span><span class="count nums"></span>' +
      '<button type="button" data-close aria-label="Close">Esc</button>' +
    "</div>";
  document.body.appendChild(box);

  var img = box.querySelector("img"),
      cap = box.querySelector(".cap"),
      count = box.querySelector(".count"),
      prevBtn = box.querySelector('[data-go="-1"]'),
      nextBtn = box.querySelector('[data-go="1"]'),
      at = 0, opener = null;

  function show(i) {
    at = (i + shots.length) % shots.length;
    var btn = shots[at];
    img.src = btn.dataset.full;
    img.alt = btn.dataset.cap || "";
    cap.textContent = btn.dataset.cap || "";
    count.textContent = at + 1 + " / " + shots.length;
    prevBtn.disabled = nextBtn.disabled = shots.length < 2;
  }

  function open(i, from) {
    opener = from;
    show(i);
    box.setAttribute("open", "");
    document.body.style.overflow = "hidden";
    box.querySelector("[data-close]").focus();
  }

  function close() {
    box.removeAttribute("open");
    document.body.style.overflow = "";
    img.removeAttribute("src");
    if (opener) opener.focus();
  }

  shots.forEach(function (btn, i) {
    btn.addEventListener("click", function () { open(i, btn); });
  });

  box.addEventListener("click", function (e) {
    var go = e.target.closest("[data-go]");
    if (go) return show(at + parseInt(go.dataset.go, 10));
    if (e.target.closest("[data-close]") || e.target === box || e.target === img) close();
  });

  addEventListener("keydown", function (e) {
    if (!box.hasAttribute("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(at - 1);
    else if (e.key === "ArrowRight") show(at + 1);
  });

  var x0 = null;
  box.addEventListener("touchstart", function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) show(at + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
})();
