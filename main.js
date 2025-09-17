import "./styles.css";
import { generateRenderer } from './renderer.js';
import { calculateValue } from './calculate.js';

// Individual imports for each component
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";

// Uber h3-js Stuff
import { cellToBoundary } from "h3-js";
import { snappyUncompressor } from 'hysnappy';

// Core API import
import Graphic from "@arcgis/core/Graphic.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const viewElement = document.querySelector("arcgis-map");

viewElement.addEventListener("arcgisViewReadyChange", async () => {
  // Parquet Stuff
  const { asyncBufferFromUrl, parquetQuery } = await import('hyparquet');
  // github pages having issue with file.... use raw githubusercontent
  console.log("ENV::", import.meta.env);
  const prefix = import.meta.env.VITE_PATH;
  const file = await asyncBufferFromUrl({ url: `${prefix}/portland.parquet` });

  const _data = await parquetQuery({
    file,
    compressors: {
      SNAPPY: snappyUncompressor()
    },
    // columns: ['grid_id', 'instName' ],
    // filter: { instName : { $eq : 'Portland'} },
  });
  const hexStore = {};
  _data.forEach(d => {
    if (hexStore[d['grid_id']]) {
      hexStore[d['grid_id']].push(d);
    } else {
      hexStore[d['grid_id']] = [d]
    }
  });
  const uniqueHexes = Object.keys(hexStore);

  const graphics = [];
  const hexLayer = new FeatureLayer({
    objectIdField: 'grid_id',
    popupEnabled: true,
    popupTemplate: {
      outFields: ['*'],
      content: (feature) => {
        const { graphic: { attributes }} = feature;
        return `Harms Value: ${attributes['final_value'].toFixed(4)}`
      } 
    },
    fields: [
      {
        name: "grid_id",
        type: "oid",
      },
      {
        name: "hex_id",
        type: "string"
      },
      { 
        name: "final_value",
        type: "double"
      }
    ],
    renderer: generateRenderer(),
  });
  viewElement.map.add(hexLayer);
  uniqueHexes.forEach(hex => {
    const boundary = cellToBoundary(hex, true);
    // Create a polygon geometry
    const polygon = {
      type: "polygon", // autocasts as new Polygon()
      rings: boundary,
    };
    
    // Create a symbol for rendering the graphic
    const fillSymbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [227, 139, 79, 0.6],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255, 0.8],
        width: 1,
      },
    };
    
    // Add the geometry and symbol to a new graphic
    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
      attributes: {
        grid_id: hex,
        hex_id: hex,
        final_value: 0.0
      }
    });
    graphics.push(polygonGraphic);
  });
  hexLayer.source = graphics;

  const edits = [];
  hexLayer.queryFeatures().then((results) => {
    results.features.forEach((feature) => {
      feature.setAttribute('final_value', calculateValue('ugb_pct_rank', hexStore[feature.getAttribute('hex_id')]));
      edits.push(feature);
    })
  }).then(() => {
    hexLayer.applyEdits({
      updateFeatures: edits
    });
    
  })
});

