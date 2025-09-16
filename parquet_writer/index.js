import { ParquetSchema, ParquetWriter } from '@dsnp/parquetjs';
import Papa from 'papaparse';
import fs from 'fs';

// GRID_ID | 8928f496e57ffff
// value | 4.6392035484313965
// var | earthquake_liquid
// directionality | 1
// instName | Springfield
// region | Willamette Valley
// ugb_pct_rank | 0.7610241820768137
// region_pct_rank | 0.8456726649528706
// st_pct_rank | 0.8696605133700258
// type | harm

const csvFile = fs.readFileSync('./parquet_writer/harms_assets.csv', 'utf8');

Papa.parse(csvFile, {
    header: true, // Use the first row as headers
    dynamicTyping: true, // Automatically convert values to their appropriate types (numbers, booleans)
    complete: async function(results) {
        await createParquetFile(results.data); // then write to parquet
    },
    error: function(err) {
        console.error('Error parsing CSV:', err);
    }
});

async function createParquetFile (data) {
    const schema = new ParquetSchema({
        grid_id: { type: 'UTF8', compression: 'SNAPPY' },
        value: { type: 'FLOAT', compression: 'SNAPPY' },
        var: { type: 'UTF8', compression: 'SNAPPY' },
        directionality: { type: 'INT_8', compression: 'SNAPPY' },
        instName: { type: 'UTF8', compression: 'SNAPPY' },
        region: { type: 'UTF8', compression: 'SNAPPY' },
        ugb_pct_rank: { type: 'FLOAT', compression: 'SNAPPY' },
        region_pct_rank: { type: 'FLOAT', compression: 'SNAPPY' },
        st_pct_rank: { type: 'FLOAT', compression: 'SNAPPY' },
        type: { type: 'UTF8', compression: 'SNAPPY' },
    });

    const writers = {};
    const openWriter = async (instName) => {
        if (!writers[instName]) {
            writers[instName] = await ParquetWriter.openFile(
                schema, 
                `./parquet_writer/data/${(instName.replaceAll(/[ /]/g, "_")).toLowerCase()}.parquet`
            );
        }
        return writers[instName];
    };

    // test sample data
    for (const d of data) {
        if (d['GRID_ID'] === null ) { continue; }
        const writer = await openWriter(d['instName']);
        await writer.appendRow({
            grid_id: d['GRID_ID'], // make INT64
            value: d['value'],
            var: d['var'],
            directionality: d['directionality'],
            instName: d['instName'],
            region: d['region'],
            ugb_pct_rank: d['ugb_pct_rank'],
            region_pct_rank: d['region_pct_rank'],
            st_pct_rank: d['st_pct_rank'],
            type: d['type']
        });
    }

    // close all writers
    Object.keys(writers).forEach((key) => {
        writers[key].close();
    })
}