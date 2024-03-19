import type { StockMatrix } from '~~/src';

export default createGlobalState(() =>
  useLocalStorage<StockMatrix[]>('@cutlist/stock', [
    {
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '1.5in',
    },
    {
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '2.5in',
    },
    {
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '3.5in',
    },
    {
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '5.5in',
    },
    {
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: '0.75in',
      width: '7.5in',
    },
  ]),
);
