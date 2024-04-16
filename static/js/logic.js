// Create the Earthquake Visualization

// CREATE A MAP USING LEAFLET
let myMap = L.map("map", {
    center: [40, -120],
    zoom: 5
  });
  
  // Adding a tile layer (the background map image) to the map using OpenStreetMap tile:
  // We use the addTo() method to add objects to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Define the URL to get the GeoJSON earthquake data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Markers should reflect the depth of the earthquake by color
function chooseColor(depth) {
    if (depth >90) return "red";
    else if (depth >70) return "orangered";
    else if (depth >50) return "orange";
    else if (depth >30) return "yellow";
    else if (depth >10) return "greenyellow";
    else return "Lime";
}

// Markers should reflect the magnitude of the earthquake by their size
// function makerSize(magnitude) {
//     magnitude * 5

// CREATE OVERLAY LAYERS
// Getting our GeoJSON data
// Function to create markers for each earthquake data point

function Markers(data) {

    let earthquakes = data.features;
    for (let i = 0; i < earthquakes.length; i++) {
         let earthquake = earthquakes[i];

         let magnitude = earthquake.properties.mag;
         let place = earthquake.properties.place;
         let longitude = earthquake.geometry.coordinates[0];
         let latitude = earthquake.geometry.coordinates[1];
         let depth = earthquake.geometry.coordinates[2];

         let marker = L.circle([latitude, longitude], {
            //markers should reflect the magnitude of the earthquake by their size
            radius: magnitude * 10000,
            fillColor: chooseColor(depth),
            color: "black",
            weight: 1,
            fillOpacity:0.75
          }).addTo(myMap);

// INCLUDE POPUPS
          // Binding a popup to our marker with in on magnitude, the location and depth 
          marker.bindPopup("Location: "+ place +"<br> Magnitude: "+ magnitude + "<br> Longitude: " + longitude + "<br> Latitude: " + latitude  + "<br> Depth: "+ depth);

          
        }
    }

// Fetch GeoJSON earthquake data using D3.js and create markers
d3.json(link).then(function(data) {
    console.log(data);
    Markers(data);

// CREATE THE LEGEND
// Ref: https://leafletjs.com/examples/choropleth/

    // Setting up the legend
    let legend = L.control({position: 'bottomright'});
    
    legend.onAdd = () => {
        let div = L.DomUtil.create('div', 'info legend legend-background'); // Add 'legend-background' class
        let grades = [-10, 10, 30, 50, 70, 90];


        // Looping through our intervals and generating a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
             div.innerHTML +=
             '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' 
             + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
             }

             return div;

            };

        // Add legend to the map
            legend.addTo(myMap);
    
})



