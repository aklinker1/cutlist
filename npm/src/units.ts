export function toFraction(value: number, threshold = 1e-5) {
  const integerPart = Math.floor(value);
  const decimalPart = value - integerPart;

  let minDifference = Infinity;
  let closestFraction = decimalPart.toString();
  for (let [fractionDecimal, fractionString] of fractionLookupTable) {
    let difference = Math.abs(decimalPart - fractionDecimal);
    if (difference < minDifference) {
      minDifference = difference;
      closestFraction = fractionString;
    }
  }

  // If the decimal part is close enough to a fraction, prepare the result with the integer part
  let result =
    minDifference <= threshold ? closestFraction : decimalPart.toString();
  if (integerPart > 0) {
    result =
      minDifference <= threshold || decimalPart === 0
        ? `${integerPart}` + (decimalPart > 0 ? ` ${result}` : '')
        : Number(value.toFixed(5)).toString();
  }
  return result;
}

const fractionLookupTable = new Map<number, string>([
  [1 / 32, '1/32'],
  [1 / 16, '1/16'], // Simplified from 2/32
  [3 / 32, '3/32'],
  [1 / 8, '1/8'], // Simplified from 4/32
  [5 / 32, '5/32'],
  [3 / 16, '3/16'], // Simplified from 6/32
  [7 / 32, '7/32'],
  [1 / 4, '1/4'], // Simplified from 8/32
  [9 / 32, '9/32'],
  [5 / 16, '5/16'], // Simplified from 10/32
  [11 / 32, '11/32'],
  [3 / 8, '3/8'], // Simplified from 12/32
  [13 / 32, '13/32'],
  [7 / 16, '7/16'], // Simplified from 14/32
  [15 / 32, '15/32'],
  [1 / 2, '1/2'], // Simplified from 16/32
  [17 / 32, '17/32'],
  [9 / 16, '9/16'], // Simplified from 18/32
  [19 / 32, '19/32'],
  [5 / 8, '5/8'], // Simplified from 20/32
  [21 / 32, '21/32'],
  [11 / 16, '11/16'], // Simplified from 22/32
  [23 / 32, '23/32'],
  [3 / 4, '3/4'], // Simplified from 24/32
  [25 / 32, '25/32'],
  [13 / 16, '13/16'], // Simplified from 26/32
  [27 / 32, '27/32'],
  [7 / 8, '7/8'], // Simplified from 28/32
  [29 / 32, '29/32'],
  [15 / 16, '15/16'], // Simplified from 30/32
  [31 / 32, '31/32'],
]);

export class Distance {
  readonly m: number;

  constructor(v: number | string) {
    if (typeof v === 'number') {
      this.m = v;
    } else if (v.endsWith('ft')) {
      this.m = Number(v.replace('ft', '')) * 0.3048;
    } else if (v.endsWith('in') || v.endsWith('"')) {
      this.m = Number(v.replace(/(in|")/, '')) * 0.0254;
    } else if (v.endsWith('mm')) {
      this.m = Number(v.replace('mm', '')) / 1000;
    } else {
      this.m = Number(v.replace('m', ''));
    }
    if (isNaN(this.m)) {
      throw Error('Could not convert to meters: ' + v);
    }
  }

  get mm() {
    return this.m * 1000;
  }
  get in() {
    return this.m * 39.37008;
  }
  get ft() {
    return this.m * 3.28084;
  }
}
