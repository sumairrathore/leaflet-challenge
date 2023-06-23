function createMap(Locations) {

    let worldMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let baseMaps = {
      "World Map": worldMap
    };
    
    let overlayMaps = {
      "Earthquakes":Locations
    };
  
    let myMap = L.map("map", {
      center: [39.8, -112.51],
      zoom: 5,
      layers: [worldMap, Locations]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function () {
  
      let div = L.DomUtil.create('div', 'info legend');
      let grades = [-10, 10, 30, 50, 70, 90];
  
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
    
        return div;
    }
  
    legend.addTo(myMap);
  
  }
  
  function createMarkers(response) {
      
    let earthquakes = response.features;
    let eqMarkers = [];
  
    for (i = 0; i < earthquakes.length; i++) { 
  
      let earthquake = earthquakes[i];
  
      let eqColor = getColor(earthquake.geometry.coordinates[2]);
    
      let eqMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],{
        color: "black",
        fillColor: eqColor,
        weight: 1,
        fillOpacity: 0.75,
        radius: earthquake.properties.mag * 10000
      }).bindPopup("<h3> Location: " + earthquake.properties.place + 
                  "</h3><h3>Mag: " + earthquake.properties.mag + 
                  "</h3><h3>Depth: " + earthquake.geometry.coordinates[2] + 
                  "</h3><a href=" + earthquake.properties.url + ">URL</a>");
  
      eqMarkers.push(eqMarker);
  
    };
      createMap(L.layerGroup(eqMarkers));
  
  }
  
  function getColor(color){
    return color > 90 ?  '#800026' : 
           color > 70 ? '#BD0026' : 
           color > 50 ? '#E31A1C' : 
           color > 30 ? '#FC4E2A' : 
           color > 10 ? '#FD8D3C': 
           '#FEB24C'; 
  }
  

  let URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
  d3.json(URL).then(createMarkers);