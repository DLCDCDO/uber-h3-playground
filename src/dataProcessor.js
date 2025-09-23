// dataProcessor.js
// Utility function for loading and structuring h3 hex data from a parquet fil
//  used as input for map handling. 

import { snappyUncompressor } from 'hysnappy';

/**
 * Load and process H3 hex data from a Parquet file.
 *
 * @param {string} parquetFile - The filename (relative to VITE_PATH) of the Parquet file to load.
 * @returns {Promise<{ hexStore: Object<string, Object[]>, uniqueHexes: string[] }>}
 *   hexStore: An object where hex_id is the key, which is mapped to an array of records (all harms/assets for a hex_id )
 *   uniqueHexes: Array of unique hex IDs (keys of hexStore).
 */
export async function loadHexData(parquetFile) {
  const { asyncBufferFromUrl, parquetQuery } = await import('hyparquet');

  console.log("ENV::", import.meta.env);
  const prefix = import.meta.env.VITE_PATH;
  const file = await asyncBufferFromUrl({ url: `${prefix}/${parquetFile}` });

  // Read parquet file contents
  const _data = await parquetQuery({
    file,
    compressors: { SNAPPY: snappyUncompressor() }
  });

  // Build hexStore keyed by grid_id
  const hexStore = {};
  //build a store for accessing pctranks by indicator name
  //used to compute thresholds for indicators
  // in the future, these calculations should be done while creating the parquet files for performance
  const indicatorStore ={};
  _data.forEach(d => {
    const id = d['grid_id'];
    const indicator = d['var'];
    if (!indicatorStore[indicator]) indicatorStore[indicator] = [];
    indicatorStore[indicator].push(d['ugb_pct_rank']);

    if (!hexStore[id]) hexStore[id] = [];
    hexStore[id].push(d);
  });

  const uniqueHexes = Object.keys(hexStore);

  return { hexStore, uniqueHexes, indicatorStore };
}
