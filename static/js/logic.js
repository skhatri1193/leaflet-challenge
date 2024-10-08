const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Initialize the map
const myMap = L.map("map").setView([37.7749, -122.4194], 5); // Set to a default global location (San Francisco)

// Add a tile layer (map background)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Fetch earthquake data
fetch(earthquakeURL)
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const [longitude, latitude, depth] = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;

      // Choose marker size based on magnitude
      const markerSize = magnitude * 20000;  // Adjust size factor for visibility

      // Choose color based on depth
      const depthColor = getColor(depth);

      // Create a circle marker with better visibility options
      L.circle([latitude, longitude], {
        fillOpacity: 0.75,
        color: "white",
        fillColor: depthColor,
        radius: markerSize
      })
      .bindPopup(`
        <h3>${feature.properties.place}</h3>
        <hr>
        <p>Magnitude: ${magnitude}</p>
        <p>Depth: ${depth} km</p>
        <p>Date: ${new Date(feature.properties.time)}</p>
      `)
      .addTo(myMap);
    });
  });

// Function to get color based on earthquake depth
function getColor(depth) {
  return depth > 90 ? "#ff3333" :
         depth > 70 ? "#ff6633" :
         depth > 50 ? "#ff9933" :
         depth > 30 ? "#ffcc33" :
         "#99ff33";  // Default color for shallow depths
}

// Add a legend to the map
const legend = L.control({ position: "bottomright" });
legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "info legend");
  
    // Heading for Magnitude
    div.innerHTML += "<h4>Magnitude</h4>";
    const magnitudeSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    magnitudeSizes.forEach((size) => {
      div.innerHTML +=
        `<i class="magnitude" style="width: ${size * 7}px; height: ${size * 7}px; background: #666;"></i> ${size}<br>`;
    });
  
    // Heading for Depth
    div.innerHTML += "<h4>Depth (km)</h4>";
    const depthRanges = [0, 30, 50, 70, 90];
    const colors = ["#99ff33", "#ffcc33", "#ff9933", "#ff6633", "#ff3333"];
    
    depthRanges.forEach((range, i) => {
      div.innerHTML +=
        `<div class="depth" style="background:${colors[i]}"></div> ${range} - ${depthRanges[i + 1] || "+"}<br>`;
    });
  
    return div;
  };
  
  legend.addTo(myMap);





  