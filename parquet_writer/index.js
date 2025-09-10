import parquetjs from '@dsnp/parquetjs';
import { hexes } from './hexes.js'

const { ParquetSchema, ParquetWriter } = parquetjs;

var schema = new ParquetSchema({
    index: { type: 'UTF8'},
    value: { type: 'FLOAT'},
});

var writer = await ParquetWriter.openFile(
    schema, './parquet_writer/hexes.parquet'
);

Object.keys(hexes).forEach(key => {
    writer.appendRow({
        index: key,
        value: hexes[key]
    });
});

writer.close();