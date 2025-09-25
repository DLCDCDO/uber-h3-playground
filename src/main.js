import "./styles.css";
import { loadHexData } from './dataProcessor.js';
import { createHexLayer, updateHexValues } from './mapHandler.js';
import { createPlaceElements, createIndicatorElements } from "./htmlHelpers.js";

// Individual imports for each component
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";


let indicators = null;

createIndicatorElements(
  document.querySelector('#indicator-combobox'),
   (val) => {
    if (val) {
      indicators = val
    } else {
      indicators = null
    }
  }
);




// Dropdowns
createPlaceElements(
  document.querySelector('#place-combobox'),
  (val) => {
    if (val) {
      selectCity(`${val}.parquet`)
    } else {
      clearCity();
    }
  }
);


// When the map loads, create a layer from the hexagons. THEN, update the values of each hexagon.
const viewElement = document.querySelector("arcgis-map");

// viewElement.addEventListener("arcgisViewReadyChange", async () => {
// });

async function selectCity(fileName) {



  if(!indicators){
    console.log("no indicators selected")

  }

  const indicators_set = new Set(indicators);

  console.log(`INDICATORS: ${indicators_set}`)
 
  const { hexStore, uniqueHexes} = await loadHexData(fileName);
  
  const hexLayer = createHexLayer(uniqueHexes, viewElement.map);
  viewElement.map.add(hexLayer);
  hexLayer.when(() => {
    viewElement.view.goTo(hexLayer.fullExtent.expand(1.15));
  })

  await updateHexValues(hexLayer, hexStore, indicators_set);
} 

function clearCity() {
  console.log('clearCity')
  // clear city and reset extent to statewide
}