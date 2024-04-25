import { describe, it, expect } from 'bun:test';
import { createCutPacker } from '../CutPacker';
import type { PackOptions } from '../Packer';
import { Rectangle } from '../../geometry';
import { defineSvgVisualizer } from '../../visualizers/SvgVisualizer';

describe('Cut Packer', () => {
  it('should stack peices lengthwise', () => {
    const visualizer = defineSvgVisualizer(
      'src/packers/__tests__/dist/CutPacker/1',
    );
    const packer = createCutPacker<string>(visualizer);
    const bin = new Rectangle(null, 0, 0, 10, 10);
    const rects = [
      new Rectangle('1', 0, 0, 5, 5),
      new Rectangle('2', 0, 0, 4, 4),
      new Rectangle('3', 0, 0, 3, 3),
      new Rectangle('4', 0, 0, 5, 5),
      new Rectangle('5', 0, 0, 5, 5),
    ];
    const options: PackOptions = {
      allowRotations: false,
      gap: 0,
      precision: 0,
    };

    expect(packer.pack(bin, rects, options)).toEqual({
      cuts: undefined,
      placements: [
        expect.objectContaining({
          data: '1',
          left: 0,
          bottom: 0,
        }),
        expect.objectContaining({
          data: '4',
          left: 5,
          bottom: 0,
        }),
        expect.objectContaining({
          data: '5',
          left: 0,
          bottom: 5,
        }),
        expect.objectContaining({
          data: '2',
          left: 5,
          bottom: 5,
        }),
      ],
      leftovers: ['3'],
    });
  });

  it('should properly sort peices', () => {
    const visualizer = defineSvgVisualizer(
      'src/packers/__tests__/dist/CutPacker/2',
    );
    const packer = createCutPacker<string>(visualizer);
    const bin = new Rectangle(null, 0, 0, 20, 40);
    const rects = [
      new Rectangle('1', 0, 0, 5, 5),
      new Rectangle('2', 0, 0, 4, 10),
      new Rectangle('3', 0, 0, 4, 10),
      new Rectangle('4', 0, 0, 3, 3),
      new Rectangle('5', 0, 0, 3, 3),
      new Rectangle('6', 0, 0, 3, 3),
    ];
    const options: PackOptions = {
      allowRotations: false,
      gap: 0,
      precision: 0,
    };

    expect(packer.pack(bin, rects, options)).toEqual({
      cuts: undefined,
      placements: [
        expect.objectContaining({
          data: '1',
          left: 0,
          bottom: 0,
        }),
        expect.objectContaining({
          data: '4',
          left: 5,
          bottom: 0,
        }),
        expect.objectContaining({
          data: '5',
          left: 0,
          bottom: 5,
        }),
        expect.objectContaining({
          data: '2',
          left: 5,
          bottom: 5,
        }),
      ],
      leftovers: ['3'],
    });
  });
});
