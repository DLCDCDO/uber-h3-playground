import "./styles.css";

// Individual imports for each component
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";

// Uber h3-js
import {latLngToCell, cellToBoundary} from "h3-js";

// Core API import
import Graphic from "@arcgis/core/Graphic.js";

console.log(`latLngToCell::`, latLngToCell);

const viewElement = document.querySelector("arcgis-map");

viewElement.addEventListener("arcgisViewReadyChange", (event) => {
});

viewElement.addEventListener("arcgisViewReadyChange", () => {
  viewElement.addEventListener('arcgisViewClick', (evt) => {
    const { detail : { mapPoint: { latitude, longitude } }} = evt;
    const h3Index = latLngToCell(latitude, longitude, 9);
    console.log('latitude::', latitude);
    console.log('longitude::', longitude);
    console.log('h3Index::', h3Index);
    // Add Cell as Graphic
    const boundary = cellToBoundary(h3Index, true);
    console.log('boundary::', boundary);
    // Create a polygon geometry
    const polygon = {
      type: "polygon", // autocasts as new Polygon()
      rings: boundary,
    };
    
    // Create a symbol for rendering the graphic
    const fillSymbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [227, 139, 79, 0.8],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1,
      },
    };
    
    // Add the geometry and symbol to a new graphic
    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });
    
    viewElement.graphics.add(polygonGraphic)
  })
});
