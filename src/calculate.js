// this file contains functions to calculate quartiles and assign bins
// as well as the main calculation function that returns a string to inform the rendering of the map

/**
 * assign a bin (1-4) for a value based on provided thresholds
 * 
 * This function is called to assign a bin number for assets and harms, which is then used to create a string like "1,3" that informs the rendering of the map.
 * 
 * @param {double} value the numeric value to bin
 * @param {{q1: number, q2: number, q3: number}} an object with q1, q2, and q3 properties representing the quartile thresholds. this is returned from getQuartileThresholds.
 * @returns {int} the bin number (1-4). the bin number is used to facilitate rendering the map with different colors for each bin.
 */
function assignBin(value, thresholds) {
  if (value <= thresholds.q1) return 1;
  if (value <= thresholds.q2) return 2;
  if (value <= thresholds.q3) return 3;
  return 4;
}


//placeholder thresholds, I think econorthwest might have calculated dynamic thresholds?
// I've tried calculating dynamic thresholds (from both individual parameters, and averages for harms/assets 
// but the map looks closest to the example with these static thresholds)

const fixed_thresholds = {q1:.25,q2:.5,q3:.75};



/**
 * main calculation function.
 * 
 * Calculates average values for harms and assets, then assigns bins based on thresholds.
 * @param {string} field the percentage rank field to use for calculations. ugb, county or state.
 * @param {object} rows <p>the data rows for a single hexagon. A dictionary where the key is the hex ID, 
 * and the value is an array of objects where each row is a variable (harm or asset) with its value and type.</p>
 * 
 * @returns {{avg_harms: number, avg_assets: number, quartile_string: string}} avg_harms, avg_assets, and a quartile_string like "1,3" that informs the rendering of the map.
 */
const calculateValue = (field = 'ugb_pct_rank', rows = [{
    "grid_id": "8928f00362bffff",
    "value": 0.9969179034233093,
    "var": "earthquake_liquid",
    "directionality": 1,
    "instName": "Portland",
    "region": "Metro",
    "ugb_pct_rank": 0.0,
    "region_pct_rank": 0.17423281073570251,
    "st_pct_rank": 0.3077784776687622,
    "type": "harm"
}]) => {
    
  // Calculate average values for harms and assets
  //dynamic variable for division in case some entry is missing a harm/asset
    let harmsValue = 0;
    let assetsValue = 0;
    
    let harmsCount = 0;
    let assetsCount = 0;

    let displayString = '';
    rows.forEach((row) => {
        if (["tsunami_zone", "highway", "electric_transmission_lines"].includes(row.var)) {
    return; // skip this iteration
    }



        if (row.type==='harm') {
            const quartileValue = assignBin(row[field], fixed_thresholds);
            harmsValue +=  row[field];
            harmsCount += 1;
            displayString += `${row.var}: ${quartileValue} (${row.type})<br>`;

        } else {
            const quartileValue = assignBin(row[field], fixed_thresholds);
            assetsValue += row[field];
            assetsCount += 1;
            displayString += `${row.var}: ${quartileValue} (${row.type})<br>`;

        }
    

});
    const avg_harms = (harmsValue / harmsCount);
    const avg_assets = (assetsValue / assetsCount);

    console.log(`Avg Harms: ${avg_harms}, Avg Assets: ${avg_assets}`);

    const quartile_string = `${assignBin(avg_assets, fixed_thresholds)},${assignBin(avg_harms, fixed_thresholds)}`;
    
    return {
    avg_harms,
    avg_assets,
    quartile_string,
    displayString
    };
};

export { calculateValue };