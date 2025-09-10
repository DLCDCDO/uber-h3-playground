import "./styles.css";

// Individual imports for each component
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";

// Uber h3-js Stuff
import { cellToBoundary } from "h3-js";

// Core API import
import Graphic from "@arcgis/core/Graphic.js";

const viewElement = document.querySelector("arcgis-map");

viewElement.addEventListener("arcgisViewReadyChange", async () => {
  // Parquet Stuff
  const { asyncBufferFromUrl, parquetReadObjects } = await import('hyparquet');
  // github pages having issue with file.... use raw githubusercontent
  const file = await asyncBufferFromUrl({ url: 'https://raw.githubusercontent.com/DLCDCDO/uber-h3-playground/main/dist/hexes.parquet' });
  const data = await parquetReadObjects({ file });

  data.forEach(hex => {
    const boundary = cellToBoundary(hex.index, true);
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

