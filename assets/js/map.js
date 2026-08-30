/* Places map. Markers come from _data/places.yml via the JSON block on the page,
   so adding a place is a data edit rather than a code edit. */
(function () {
  "use strict";
  var host = document.getElementById("map");
  var data = document.getElementById("places-data");
  if (!host || !data || typeof L === "undefined") return;

  var places;
  try { places = JSON.parse(data.textContent); } catch (e) { return; }
  if (!places.length) return;

  var map = L.map(host, { scrollWheelZoom: false, worldCopyJump: true });

  // OSM's tile usage policy requires this attribution. Do not remove it.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var byId = {}, home = null, bounds = [];
  places.forEach(function (p) {
    var marker = L.marker([p.lat, p.lng]).addTo(map);
    var html = "<b>" + escapeHtml(p.name) + "</b>";
    if (p.note) html += escapeHtml(p.note);
    if (p.album) {
      html += '<div class="go"><a href="' + p.album + '">Photos from ' +
              escapeHtml(p.albumTitle) + " &rarr;</a></div>";
    }
    marker.bindPopup(html);
    byId[p.id] = marker;
    bounds.push([p.lat, p.lng]);
    if (p.here) home = marker;
  });

  map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });

  // Deep link: /travel/#joshua-tree opens that marker.
  function focusFromHash() {
    var id = location.hash.slice(1);
    var marker = id && byId[id];
    if (!marker) return false;
    map.setView(marker.getLatLng(), 8, { animate: false });
    marker.openPopup();
    return true;
  }

  if (!focusFromHash() && home) home.openPopup();
  addEventListener("hashchange", focusFromHash);

  // Scroll wheel zoom is off by default so the page still scrolls over the map.
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("mouseout", function () { map.scrollWheelZoom.disable(); });
})();
