

// 1. Compute quartile thresholds
export function getQuartileThresholds(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  return {
    q1: sorted[Math.floor(0.25 * n)],
    q2: sorted[Math.floor(0.5 * n)],
    q3: sorted[Math.floor(0.75 * n)]
  };
}

// 2. Assign a bin based on thresholds
function assignBin(value, thresholds) {
  if (value <= thresholds.q1) return 1;
  if (value <= thresholds.q2) return 2;
  if (value <= thresholds.q3) return 3;
  return 4;
}


const harms_thresholds = {q1:0.25,q2: 0.5,q3: 0.75};
const assets_thresholds = {q1:0.25,q2: 0.5,q3: 0.75};

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
    
    let harmsValue = 0;
    let assetsValue = 0;
    let harmsCount = 0;
    let assetsCount = 0;
    rows.forEach((row) => {
        if (["tsunami_zone", "highway", "electric_transmission_lines"].includes(row.var)) {
    return; // skip this iteration
    }

        if (row.type==='harm') {
            harmsValue += row[field];
            harmsCount += 1;
        } else {
            assetsValue += row[field];
            assetsCount += 1;
        }
    

});
    const avg_harms = harmsValue / harmsCount;
    const avg_assets = assetsValue / assetsCount;



    const quartile_string = `${assignBin(avg_assets, assets_thresholds)},${assignBin(avg_harms, harms_thresholds)}`;
    
    return {
    avg_harms,
    avg_assets,
    quartile_string
    };
};

export { calculateValue };