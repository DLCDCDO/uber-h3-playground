import "./styles.css";
import { loadHexData } from './dataProcessor.js';
import { createHexLayer, updateHexValues } from './mapHandler.js';
import { build_indicator_thresholds, getQuartileThresholds } from './calculate.js';

// Individual imports for each component
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";

// When the map loads, create a layer from the hexagons. THEN, update the values of each hexagon.
const viewElement = document.querySelector("arcgis-map");

viewElement.addEventListener("arcgisViewReadyChange", async () => {
  const { hexStore, uniqueHexes, indicatorStore } = await loadHexData('portland.parquet');

  const hexLayer = createHexLayer(uniqueHexes);
  viewElement.map.add(hexLayer);

  const indicatorThresholds = build_indicator_thresholds(indicatorStore);

  await updateHexValues(hexLayer, hexStore, indicatorThresholds);})