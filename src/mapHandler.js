// mapRenderer.js
// Utility functions for creating and updating ArcGIS FeatureLayers using H3 hexes

import Graphic from "@arcgis/core/Graphic.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import { cellToBoundary } from "h3-js";
import { generateRenderer } from './renderer.js';
import { calculateValue, getQuartileThresholds } from './calculate.js';


/**
 * Create a FeatureLayer from a list of H3 hex IDs.
 *
 * @param {string[]} uniqueHexes - Array of H3 hex IDs.
 * @returns {FeatureLayer} ArcGIS FeatureLayer ready to be added to the map.
 */
export function createHexLayer(uniqueHexes) {
  const graphics = uniqueHexes.map(hex => {
    const polygon = { type: "polygon", rings: cellToBoundary(hex, true) };
    const fillSymbol = {
      type: "simple-fill",
      color: [227, 139, 79, 0.6],
      outline: { color: [255, 255, 255, 0.8], width: 1 }
    };
    return new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
      attributes: { grid_id: hex, hex_id: hex, final_value_assets: 0.0 }
    });
  });

  return new FeatureLayer({
    objectIdField: 'grid_id',
    popupEnabled: true,
    popupTemplate: {
      outFields: ['*'],
      content: (feature) =>
        `${feature.graphic.attributes.displayString}, ${feature.graphic.attributes.compositeKey}, ${feature.graphic.attributes.final_value_assets}, ${feature.graphic.attributes.final_value_harms}`
    },
    fields: [
      { name: "grid_id", type: "oid" },
      { name: "hex_id", type: "string" },
      { name: "final_value_harms", type: "double"},
      { name: "final_value_assets", type: "double"},
      { name: "compositeKey", type: "string" },
      { name: "displayString", type: "string" }
    ],
    renderer: generateRenderer(),
    source: graphics
  });
}

/**
 * Update the `final_value` attribute of each hex in the given FeatureLayer.
 *
 * @param {FeatureLayer} hexLayer - The FeatureLayer created by createHexLayer.
 * @param {Object<string, Object[]>} hexStore - Map of hex_id → array of data rows.
 */
export async function updateHexValues(hexLayer, hexStore, indicatorThresholds) {
  const const_harms = []
  const const_assets = []
  const results = await hexLayer.queryFeatures();
  const edits = results.features.map(feature => {
    const hexId = feature.getAttribute('hex_id');
    const values = calculateValue('ugb_pct_rank', hexStore[hexId], indicatorThresholds);

    feature.setAttribute('final_value_harms', values.avg_harms);
    feature.setAttribute('final_value_assets', values.avg_assets);
    feature.setAttribute('compositeKey', values.quartile_string);
    feature.setAttribute('displayString', values.displayString);
    const_harms.push(values.avg_harms)
    const_assets.push(values.avg_assets)


 

    return feature;
  });

  const harms_thresholds = getQuartileThresholds(const_harms)
  const assets_thresholds = getQuartileThresholds(const_assets)
  console.log("Harms thresholds:", harms_thresholds)
  console.log("Assets thresholds:", assets_thresholds)


  await hexLayer.applyEdits({ updateFeatures: edits });

}
