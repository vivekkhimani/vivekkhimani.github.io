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

  // Esri's Gray Canvas basemaps are built as a quiet backdrop for data overlays,
  // which is what this page wants: the markers should be the loud part. They need
  // no API key. Note the {z}/{y}/{x} order, which is not the usual {z}/{x}/{y}.
  // CARTO's Positron was the obvious choice and now watermarks keyless requests
  // with "API KEY REQUIRED", serving it as a normal 200, so it cannot be used.
  var BASE = "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/";
  var BASEMAPS = {
    light: BASE + "World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    dark:  BASE + "World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  };
  var ATTRIBUTION =
    'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &middot; ' +
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  var darkQuery = matchMedia("(prefers-color-scheme: dark)");
  function themeName() { return darkQuery.matches ? "dark" : "light"; }

  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  var map = L.map(host, { scrollWheelZoom: false, worldCopyJump: true });

  var tiles = L.tileLayer(BASEMAPS[themeName()], {
    maxZoom: 16, attribution: ATTRIBUTION
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
    // Hover names the place without asking for a click.
    marker.bindTooltip(place.name, { direction: "top", offset: [0, -6], opacity: 1 });

    marker.on("mouseover", function () { marker.setStyle({ radius: style(place).radius + 2.5 }); });
    marker.on("mouseout", function () { marker.setStyle(style(place)); });

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

  // Pointing at a name in the list lights up its marker, so a reader can find a
  // place among fifty-nine dots without clicking through them.
  function highlight(id, on) {
    var marker = byId[id];
    if (!marker) return;
    if (on) {
      marker.setStyle({ radius: style(marker._place).radius + 3, fillOpacity: 1 });
      marker.bringToFront();
      marker.openTooltip();
    } else {
      marker.setStyle(style(marker._place));
      marker.closeTooltip();
    }
  }

  // /travel/#joshua opens that marker, which is what album pages link to.
  function focusFromHash() {
    var id = location.hash.slice(1);
    if (id.indexOf("note-") === 0) return false;  // let the browser scroll to the note
    return focus(id, false);
  }

  if (!focusFromHash() && home) home.openPopup();
  addEventListener("hashchange", focusFromHash);

  // Every place name on the page: the list under the map, and "Show on the map"
  // under each note.
  document.querySelectorAll("[data-place]").forEach(function (link) {
    var id = link.dataset.place;
    link.addEventListener("mouseenter", function () { highlight(id, true); });
    link.addEventListener("mouseleave", function () { highlight(id, false); });
    link.addEventListener("focus", function () { highlight(id, true); });
    link.addEventListener("blur", function () { highlight(id, false); });
    link.addEventListener("click", function (e) {
      if (!focus(id, true)) return;
      e.preventDefault();
      host.scrollIntoView({ behavior: "smooth", block: "center" });
      history.replaceState(null, "", "#" + id);
    });
  });

  // Wheel zoom stays off until the map is clicked, so the page still scrolls.
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("mouseout", function () { map.scrollWheelZoom.disable(); });
})();
