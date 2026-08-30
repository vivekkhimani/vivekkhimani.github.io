/* Places map.
   Markers come from _data/places.yml via the JSON block on the page, so adding a
   place is a data edit. The basemap and the marker colours follow the site theme.
   Marker size encodes whether a place has something to read or look at. */
(function () {
  "use strict";
  var host = document.getElementById("map");
  var data = document.getElementById("places-data");
  if (!host || !data || typeof L === "undefined") return;

  var places;
  try { places = JSON.parse(data.textContent); } catch (e) { return; }
  if (!places.length) return;

  // CARTO's Positron and Dark Matter are deliberately quiet basemaps, which is
  // what a page like this wants: the markers should be the loud part.
  var BASEMAPS = {
    light: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark:  "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  };
  var ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>';

  var darkQuery = matchMedia("(prefers-color-scheme: dark)");
  function themeName() { return darkQuery.matches ? "dark" : "light"; }

  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  var map = L.map(host, { scrollWheelZoom: false, worldCopyJump: true });

  var tiles = L.tileLayer(BASEMAPS[themeName()], {
    maxZoom: 19, attribution: ATTRIBUTION, detectRetina: true
  }).addTo(map);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Three states, largest first: where he lives, places with something to say,
  // and everywhere else.
  function style(place) {
    var accent = token("--accent", "#3d6b4c");
    var paper = token("--paper", "#f4f5f1");
    if (place.here) {
      return { radius: 7, color: paper, weight: 2.5, fillColor: accent, fillOpacity: 1 };
    }
    if (place.told || place.album) {
      return { radius: 5.5, color: paper, weight: 2, fillColor: accent, fillOpacity: 0.95 };
    }
    return { radius: 4, color: accent, weight: 1, fillColor: accent, fillOpacity: 0.6 };
  }

  var byId = {}, home = null, bounds = [];
  places.forEach(function (place) {
    var marker = L.circleMarker([place.lat, place.lng], style(place)).addTo(map);

    var html = "<b>" + escapeHtml(place.name) + "</b>";
    if (place.note) html += escapeHtml(place.note);
    var links = [];
    if (place.told) links.push('<a href="#note-' + place.id + '">Read the note</a>');
    if (place.album) {
      links.push('<a href="' + place.album + '">' +
                 place.albumCount + " photo" + (place.albumCount === 1 ? "" : "s") + "</a>");
    }
    if (links.length) html += '<span class="go">' + links.join(" &middot; ") + "</span>";
    marker.bindPopup(html);

    marker._place = place;
    byId[place.id] = marker;
    bounds.push([place.lat, place.lng]);
    if (place.here) home = marker;
  });

  map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });

  // Repaint markers when the reader's theme flips, so they keep their contrast.
  function applyTheme() {
    tiles.setUrl(BASEMAPS[themeName()]);
    Object.keys(byId).forEach(function (id) {
      byId[id].setStyle(style(byId[id]._place));
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", applyTheme);
  else if (darkQuery.addListener) darkQuery.addListener(applyTheme);

  function focus(id, animate) {
    var marker = byId[id];
    if (!marker) return false;
    map.setView(marker.getLatLng(), 8, { animate: !!animate });
    marker.openPopup();
    return true;
  }

  // /travel/#joshua opens that marker, which is what album pages link to.
  function focusFromHash() {
    var id = location.hash.slice(1);
    if (id.indexOf("note-") === 0) return false;  // let the browser scroll to the note
    return focus(id, false);
  }

  if (!focusFromHash() && home) home.openPopup();
  addEventListener("hashchange", focusFromHash);

  // "Show on the map" under each note.
  document.querySelectorAll("[data-focus]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (!focus(link.dataset.focus, true)) return;
      e.preventDefault();
      host.scrollIntoView({ behavior: "smooth", block: "center" });
      history.replaceState(null, "", "#" + link.dataset.focus);
    });
  });

  // Wheel zoom stays off until the map is clicked, so the page still scrolls.
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("mouseout", function () { map.scrollWheelZoom.disable(); });
})();
