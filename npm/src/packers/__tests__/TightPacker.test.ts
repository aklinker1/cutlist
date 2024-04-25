import { describe, it, expect } from 'bun:test';
import { createTightPacker } from '../TightPacker';
import type { PackOptions } from '../Packer';
import { Rectangle } from '../../geometry';
import { defineSvgVisualizer } from '../../visualizers/SvgVisualizer';

describe('Tight Bin Packer', () => {
  it('should pack rectangles as closely as possible', () => {
    const visualizer = defineSvgVisualizer(
      'src/packers/__tests__/dist/TightPacker/1',
    );
    const packer = createTightPacker<string>(visualizer);
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
          data: '2',
          left: 0,
          bottom: 5,
        }),
        expect.objectContaining({
          data: '3',
          left: 5,
          bottom: 0,
        }),
        expect.objectContaining({
          data: '4',
          left: 5,
          bottom: 3,
        }),
      ],
      leftovers: ['5'],
    });
  });

  it('should not pack rectangles of the same size ontop of one another', () => {
    const visualizer = defineSvgVisualizer(
      'src/packers/__tests__/dist/TightPacker/2',
    );
    const packer = createTightPacker<string>(visualizer);
    const bin = new Rectangle(null, 0, 0, 10, 5);
    const rects = [
      new Rectangle('1', 0, 0, 5, 5),
      new Rectangle('2', 0, 0, 5, 5),
      new Rectangle('3', 0, 0, 5, 5),
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
          data: '2',
          left: 5,
          bottom: 0,
        }),
      ],
      leftovers: ['3'],
    });
  });

  it('should allow rotating rectangles to fit in either orientation', () => {
    const visualizer = defineSvgVisualizer(
      'src/packers/__tests__/dist/TightPacker/3',
    );
    const packer = createTightPacker<string>(visualizer);
    const bin = new Rectangle(null, 0, 0, 1, 3);
    const rects = [
      new Rectangle('1', 0, 0, 1, 1),
      new Rectangle('2', 0, 0, 2, 1),
    ];
    const options: PackOptions = {
      allowRotations: true,
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
          data: '2',
          left: 0,
          bottom: 1,
          height: 2,
          width: 1,
        }),
      ],
      leftovers: [],
    });
  });
});
