import type { StockMatrix } from '~~/src';

export default createGlobalState(() =>
  useLocalStorage<StockMatrix[]>('@cutlist/stock', [
    {
      name: 'Red Oak (1x2)',
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '1.5in',
    },
    {
      name: 'Red Oak (1x3)',
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '2.5in',
    },
    {
      name: 'Red Oak (1x4)',
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '3.5in',
    },
    {
      name: 'Red Oak (1x6)',
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '5.5in',
    },
    {
      name: 'Red Oak (1x7)',
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '7.5in',
    },
  ]),
);
