// htmlHelpers.js
// Utility to load harms/assets and place names
// and create HTML components for dropdown selections

import { snappyUncompressor } from 'hysnappy';

/**
 * Creates and appends `<calcite-combobox-item>` elements to a given parent element
 * based on place names loaded from a Parquet file (`places.parquet`).
 * 
 *
 *  * @param {HTMLElement} parentEl 
 *        The parent element ( a `<calcite-combobox>`) to which 
 *        `<calcite-combobox-item>` elements will be appended.
 * @param {Function} cb 
 *        A callback function invoked when the selection changes.
 *        Receives a `string` (normalized selected place name) or `null`.
 * @returns {Promise<void>} 
 *          Resolves when the place elements have been created and event listener is attached.
 * 
 */
async function createPlaceElements(parentEl, cb) {
    const { asyncBufferFromUrl, parquetQuery } = await import('hyparquet');
    const prefix = import.meta.env.VITE_PATH;
    const file = await asyncBufferFromUrl({ url: `${prefix}/places.parquet` });
    const _data = await parquetQuery({
        file,
        compressors: { SNAPPY: snappyUncompressor() }
    });

    const place_names = _data.map(val => val.name).sort();
    const els = place_names.map(place => {
        // <calcite-combobox-item
        //  value="Natural Resources"
        //  heading="Natural Resources">
        // </calcite-combobox-item>
        const el = document.createElement('calcite-combobox-item');
        el.setAttribute('value', place);
        el.setAttribute('heading', place);
        return el;
    });
    els.forEach(el => parentEl.append(el));
    parentEl.addEventListener('calciteComboboxChange', () => {
        if (parentEl.selectedItems.length > 0) {
            const value = parentEl.selectedItems[0].value.replaceAll(/[ /]/g, "_").toLowerCase();
            cb(value);
        } else {
            cb(null)
        }
    })
}





/**
 * Loads indicator data from a Parquet file (`harms_assets.parquet`).
 * 
 * Currently this function only loads and parses the Parquet data, but does not yet
 * generate or append UI elements. Intended for future extension to populate 
 * indicator-related controls.
 *
 * @async
 * @function createIndicatorElements
 * @param {HTMLElement} parentEl 
 *        The parent element where indicator elements will eventually be appended.
 * @returns {Promise<void>} 
 *          Resolves once the Parquet data has been loaded.
 */


function createElementsHelper(_data, type, group){
    const filtered = _data.filter(d => d.type === type);

    const var_names = filtered.map(val => val.value).sort(); 
      // find the groups inside the combobox
    


    const els = var_names.map(vals => {
        // <calcite-combobox-item
        //  value="Natural Resources"
        //  heading="Natural Resources">
        // </calcite-combobox-item>
        const el = document.createElement('calcite-combobox-item');
        el.setAttribute('value', vals);
        el.setAttribute('heading', vals);
        return el;
    });
    els.forEach(el => {
        group.append(el)});
   
}

async function createIndicatorElements(parentEl) {
    const { asyncBufferFromUrl, parquetQuery } = await import('hyparquet');
    const prefix = import.meta.env.VITE_PATH;
    const file = await asyncBufferFromUrl({ url: `${prefix}/harms_assets.parquet` });
    const _data = await parquetQuery({
        file,
        compressors: { SNAPPY: snappyUncompressor() }
    });
    console.log(_data)

    const harmsGroup = parentEl.querySelector('calcite-combobox-item-group[label="Harms"]');
    const assetsGroup = parentEl.querySelector('calcite-combobox-item-group[label="Assets"]');
    createElementsHelper(_data, "asset", assetsGroup)
    createElementsHelper(_data, 'harm', harmsGroup)
    parentEl.addEventListener('calciteComboboxChange', () => {
        if (parentEl.selectedItems.length > 0) {
            const value = parentEl.selectedItems[0].value.replaceAll(/[ /]/g, "_").toLowerCase();
            cb(value);
        } else {
            cb(null)
        }
    })
}


export { createPlaceElements, createIndicatorElements };