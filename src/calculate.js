const calculateValue = (field = 'ugb_pct_rank', rows = [{
    "grid_id": "8928f00362bffff",
    "value": 0.9969179034233093,
    "var": "earthquake_liquid",
    "directionality": 1,
    "instName": "Portland",
    "region": "Metro",
    "ugb_pct_rank": 0.034512024372816086,
    "region_pct_rank": 0.17423281073570251,
    "st_pct_rank": 0.3077784776687622,
    "type": "harm"
}]) => {
    let harmsValue = 0;
    let assetsValue = 0;
    rows.forEach((row) => {
        if (row.type==='harm') {
            harmsValue += row[field];
        } else {
            assetsValue += row[field];
        }
    });
    return harmsValue / 12;
};

export { calculateValue };