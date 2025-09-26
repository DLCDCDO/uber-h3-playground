import "./styles.css";
import { loadHexData } from './dataProcessor.js';
import { createHexLayer, updateHexValues } from './mapHandler.js';
import { createPlaceElements, createIndicatorElements, attachRadioListener } from "./htmlHelpers.js";

// Individual imports for each component
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";

const indicator_combo = document.querySelector('#indicator-combobox');
let city = null;
let indicators = null;
let region = 'ugb_pct_rank'; // default region

let previous_hex_layer = null;
let previous_hex_store = null;

createIndicatorElements(
  indicator_combo,
   (val) => {
    if (val) {
      indicators = val
    } else {
      indicators = null
    }
    if(city){
      const indicators_set = new Set(indicators);

      updateHexValues(previous_hex_layer, previous_hex_store, indicators_set, region);

    }
  }
);


// Force Calcite to respect selected-items-label
indicator_combo.selectionDisplay = "single";
indicator_combo.selectAllEnabled = true;
indicator_combo.requestUpdate(); // tells Calcite to re-render the label


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

const radioGroup = document.querySelector("#comparison-region calcite-radio-button-group");

attachRadioListener(radioGroup, (selected) => {
  region =  radioGroup.selectedItem.value;
  if (indicators && city){
    const indicators_set = new Set(indicators);

    updateHexValues(previous_hex_layer, previous_hex_store, indicators_set, region);
  }   
  // update filters, map, etc.
});



// When the map loads, create a layer from the hexagons. THEN, update the values of each hexagon.
const viewElement = document.querySelector("arcgis-map");

// viewElement.addEventListener("arcgisViewReadyChange", async () => {
// });

async function selectCity(fileName) {
  city = fileName



  if(!indicators){
    console.log("no indicators selected")

  }

  const indicators_set = new Set(indicators);

 
  const { hexStore, uniqueHexes} = await loadHexData(fileName);
  
  const hexLayer = createHexLayer(uniqueHexes, viewElement.map);
  previous_hex_layer = hexLayer;
  previous_hex_store = hexStore;
  viewElement.map.add(hexLayer);
  hexLayer.when(() => {
    viewElement.view.goTo(hexLayer.fullExtent.expand(1.15));
  })

  await updateHexValues(hexLayer, hexStore, indicators_set, region);
} 

function clearCity() {
  console.log('clearCity')
  // clear city and reset extent to statewide
}

