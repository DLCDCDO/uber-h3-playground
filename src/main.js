import "./styles.css";
import { loadHexData } from './dataProcessor.js';
import { createHexLayer, updateHexValues } from './mapHandler.js';
import { createPlaceElements, createIndicatorElements } from "./htmlHelpers.js";

// Individual imports for each component
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";

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
createIndicatorElements(
  document.querySelector('#indicator-combobox')
);

// When the map loads, create a layer from the hexagons. THEN, update the values of each hexagon.
const viewElement = document.querySelector("arcgis-map");

// viewElement.addEventListener("arcgisViewReadyChange", async () => {
// });

async function selectCity(fileName) {
  const { hexStore, uniqueHexes} = await loadHexData(fileName);

  const hexLayer = createHexLayer(uniqueHexes);
  viewElement.map.add(hexLayer);
  hexLayer.when(() => {
    viewElement.view.goTo(hexLayer.fullExtent.expand(1.15));
  })

  await updateHexValues(hexLayer, hexStore);
} 

function clearCity() {
  console.log('clearCity')
  // clear city and reset extent to statewide
}