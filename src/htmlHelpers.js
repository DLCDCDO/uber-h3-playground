// htmlHelpers.js
// Utility to load harms/assets and place names
// and create HTML components for dropdown selections

import { snappyUncompressor } from 'hysnappy';

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

async function createIndicatorElements(parentEl) {
    const { asyncBufferFromUrl, parquetQuery } = await import('hyparquet');
    const prefix = import.meta.env.VITE_PATH;
    const file = await asyncBufferFromUrl({ url: `${prefix}/harms_assets.parquet` });
    const _data = await parquetQuery({
        file,
        compressors: { SNAPPY: snappyUncompressor() }
    });
}

export { createPlaceElements, createIndicatorElements };