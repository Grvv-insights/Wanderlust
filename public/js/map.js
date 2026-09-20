document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");

  if (mapDiv) {
    const lat = parseFloat(mapDiv.dataset.lat);
    const lon = parseFloat(mapDiv.dataset.lon);
    const location = mapDiv.dataset.location;

    const map = L.map("map").setView([lat, lon], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup(location).openPopup();
  }
});
