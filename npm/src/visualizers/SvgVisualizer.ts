import type { Visualizer } from './Visualizer';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Rectangle, type Point } from '../geometry';

const partStyle = { fill: 'gray', stroke: 'black', strokeWidth: 1 };
const stockStyle = { fill: 'DarkGray', stroke: 'DimGray', strokeWidth: 1 };
const pointStyle = { radius: 2, fill: 'red' };
const possiblePlacementStyle = { stroke: 'red', strokeWidth: 1 };
const validPlacementStyle = { stroke: 'green', strokeWidth: 1 };

/**
 * Used in tests to visualize and debug bin packing issues.
 */
export function defineSvgVisualizer(outDir: string): Visualizer {
  let i = 0;

  return {
    async render(description, options) {
      i++;
      const toPlace = options.toPlace?.translate(options.bin.width * 1.2, 0);

      let bounds = new Rectangle(null, 0, 0, 0, 0);
      [
        toPlace,
        options.bin,
        ...options.res.placements,
        ...(options.validPlacements ?? []),
      ].forEach((rect) => {
        if (rect) bounds = bounds.swallow(rect);
      });
      const scale = 250 / Math.max(bounds.width, bounds.height);

      const getSvgRect = (
        rect: Rectangle<unknown>,
        style: { fill?: string; stroke?: string; strokeWidth?: number },
      ) =>
        `<rect x="${rect.left * scale}" y="${rect.bottom * scale}" width="${rect.width * scale}" height="${rect.height * scale}" fill="${style.fill ?? 'none'}" stroke="${style.stroke ?? 'none'}" stroke-width="${style.strokeWidth ?? 0}"  />`;

      const getSvgCircle = (
        center: Point,
        style: { radius: number; fill?: string },
      ) =>
        `<circle cx="${center.x * scale}" cy="${center.y * scale}" r="${style.radius}" fill="${style.fill ?? 'none'}" />`;

      const svg = [
        `<svg viewBox="${bounds.left * scale} ${bounds.bottom * scale} ${bounds.width * scale} ${bounds.height * scale}" xmlns="http://www.w3.org/2000/svg">`,
      ];
      svg.push(getSvgRect(options.bin, stockStyle));
      options.res.placements.forEach((p) => {
        svg.push(getSvgRect(p, partStyle));
      });
      if (toPlace) svg.push(getSvgRect(toPlace, partStyle));

      options.possiblePlacements?.forEach((p) => {
        svg.push(getSvgRect(p, possiblePlacementStyle));
      });
      options.validPlacements?.forEach((p) => {
        svg.push(getSvgRect(p, validPlacementStyle));
      });
      options.possiblePoints?.forEach((p) => {
        svg.push(getSvgCircle(p, pointStyle));
      });

      svg.push('</svg>');

      mkdirSync(outDir, { recursive: true });
      const file = join(outDir, `${i}-${description}.svg`);
      writeFileSync(file, svg.join('\n'));
    },
  };
}
