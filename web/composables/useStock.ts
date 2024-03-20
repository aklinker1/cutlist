import type { StockMatrix } from '~~/src';

export default createGlobalState(() =>
  useLocalStorage<StockMatrix[]>('@cutlist/stock', [
    {
      material: 'Oak, Red',
      length: ['3ft', '4ft', '6ft', '8ft'],
      thickness: ['0.75in'],
      width: ['1.5in', '2.5in', '3.5in', '5.5in', '7.5in'],
    },
  ]),
);
