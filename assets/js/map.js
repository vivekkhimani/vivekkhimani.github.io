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

  // A basemap you can actually read: land and water have to separate at a glance,
  // which the grey canvas did not. Esri needs no API key; note the {z}/{y}/{x}
  // order, which is not the usual {z}/{x}/{y}. Labels come from a second,
  // transparent layer on top, the way Esri intends these to be used.
  var E = "https://services.arcgisonline.com/ArcGIS/rest/services/";
  var BASEMAP = E + "World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}";
  var LABELS  = E + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";
  var ATTRIBUTION =
    'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &middot; ' +
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  var darkQuery = matchMedia("(prefers-color-scheme: dark)");

  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  var map = L.map(host, {
    scrollWheelZoom: false, worldCopyJump: true, zoomControl: false
  });
  // Top right, so it never sits under the popup that opens on load.
  L.control.zoom({ position: "topright" }).addTo(map);

  L.tileLayer(BASEMAP, { maxZoom: 13, attribution: ATTRIBUTION }).addTo(map);
  L.tileLayer(LABELS, { maxZoom: 13, opacity: 0.9 }).addTo(map);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Three states, largest first: where he lives, places with something to say,
  // and everywhere else.
  // The basemap is light in both themes, so the pins are dark in both. Colour is
  // saved for where he lives and for whatever the reader is pointing at.
  function style(place) {
    var accent = token("--accent", "#3f5b70");
    var ring = "#ffffff";
    var ink = "#1b1e23";
    if (place.here) {
      return { radius: 7.5, color: ring, weight: 2.5, fillColor: accent, fillOpacity: 1 };
    }
    if (place.told || place.album) {
      return { radius: 6, color: ring, weight: 2, fillColor: ink, fillOpacity: 0.92 };
    }
    return { radius: 4.5, color: ring, weight: 1.5, fillColor: ink, fillOpacity: 0.8 };
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
    marker.bindPopup(html, { autoPan: false, maxWidth: 260 });
    // Hover names the place without asking for a click.
    marker.bindTooltip(place.name, { direction: "top", offset: [0, -6], opacity: 1 });

    marker.on("mouseover", function () {
      marker.setStyle({ radius: style(place).radius + 2.5,
                        fillColor: token("--accent", "#3f5b70"), fillOpacity: 1 });
    });
    marker.on("mouseout", function () { marker.setStyle(style(place)); });

    marker._place = place;
    byId[place.id] = marker;
    bounds.push([place.lat, place.lng]);
    if (place.here) home = marker;
  });

  // Frame it the way the old site did: the whole world at zoom 2, centred on the
  // places rather than on the prime meridian. fitBounds alone lands near zoom 1,
  // which pushes everything into a small band with empty ocean above and below.
  // A phone cannot show 237 degrees of longitude at zoom 2, so it starts one
  // step out and everywhere he has been still fits on screen.
  map.setView(L.latLngBounds(bounds).getCenter(), host.clientWidth < 620 ? 1 : 2);

  // Repaint markers when the reader's theme flips, so they keep their contrast.
  function applyTheme() {
    Object.keys(byId).forEach(function (id) {
      byId[id].setStyle(style(byId[id]._place));
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", applyTheme);
  else if (darkQuery.addListener) darkQuery.addListener(applyTheme);
  // The footer control changes the theme without touching the media query.
  new MutationObserver(applyTheme).observe(document.documentElement,
    { attributes: true, attributeFilter: ["data-theme"] });

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
      marker.setStyle({ radius: style(marker._place).radius + 3, fillOpacity: 1,
                        fillColor: token("--accent", "#3f5b70") });
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
