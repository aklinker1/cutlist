import consola, { Consola } from 'consola';
import {
  type Project,
  createCutlistGenerator,
  type StockMatrix,
  generateSvg,
} from '.';
import { loadConfig } from './config';
import { writeJson } from './fs';
import { convertFtToIn } from './units';
import { writeFile } from 'node:fs/promises';

const config = await loadConfig();

const project: Project = {
  source: {
    type: 'onshape',
    // Cement Side Table
    // id: "2e0d315cbf42b6f8ac081240",
    // Japanesse Bed
    id: '224b1a515e6f056d96f7bc93',
    assemblyId: '8e23e6f846a03c63d87904c9',
  },
};
const stock: StockMatrix[] = [
  {
    name: 'Red Oak (1x2)',
    material: 'Oak, Red',
    length: [3, 4, 6, 8].map(convertFtToIn),
    thickness: 0.75,
    width: 1.5,
  },
  {
    name: 'Red Oak (1x3)',
    material: 'Oak, Red',
    length: [3, 4, 6, 8].map(convertFtToIn),
    thickness: 0.75,
    width: 2.5,
  },
  {
    name: 'Red Oak (1x4)',
    material: 'Oak, Red',
    length: [3, 4, 6, 8].map(convertFtToIn),
    thickness: 0.75,
    width: 3.5,
  },
  {
    name: 'Red Oak (1x6)',
    material: 'Oak, Red',
    length: [3, 4, 6, 8].map(convertFtToIn),
    thickness: 0.75,
    width: 5.5,
  },
  {
    name: 'Red Oak (1x7)',
    material: 'Oak, Red',
    length: [3, 4, 6, 8].map(convertFtToIn),
    thickness: 0.75,
    width: 7.5,
  },
];

const cutlist = createCutlistGenerator(config, (name, obj) =>
  writeJson(`dist/json/${name}.json`, obj),
);
const parts = await cutlist.getPartsToCut(project);
const { layouts, leftovers } = await cutlist.generateBoardLayouts(parts, stock);

if (leftovers.length > 0) {
  consola.warn(`Does not fit: ${leftovers.length}`);
}

const svg = generateSvg(layouts);
await writeFile('dist/cutlist.svg', svg, 'utf8');
consola.success('Generated SVG!');
