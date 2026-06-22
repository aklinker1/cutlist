import { describe, it, expect } from 'bun:test';
import { generateBoardLayouts } from '../index';
import testCase from '../../../test-case-backpedal.json';

describe('generateBoardLayouts - backpedal project', () => {
  it('should pack all plywood parts onto 3 boards and leave Unknown material as leftovers', () => {
    const { layouts, leftovers } = generateBoardLayouts(
      testCase.parts,
      testCase.stock,
      testCase.config,
    );

    expect(layouts).toHaveLength(3);

    const plywoodSheet = {
      material: 'Plywood',
      thicknessM: expect.any(Number),
      widthM: 1.2192,
      lengthM: 2.4384,
    };

    // Board 1: large 762×1181 bottom + 3 tall stretchers + Left(2,1) + 2 small bottoms + 2 small stretchers
    expect(layouts[0].stock).toEqual(plywoodSheet);
    expect(layouts[0].placements).toHaveLength(9);
    expect(layouts[0].placements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Bottom',
          partNumber: 8,
          instanceNumber: 1,
          leftM: 0,
          bottomM: 0,
        }),
        expect.objectContaining({
          name: 'Stretcher top front',
          partNumber: 12,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Stretcher top back',
          partNumber: 11,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Stretcher back',
          partNumber: 13,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Left',
          partNumber: 2,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Bottom',
          partNumber: 1,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Bottom',
          partNumber: 1,
          instanceNumber: 2,
        }),
        expect.objectContaining({
          name: 'Stretcher top back',
          partNumber: 4,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Stretcher top back',
          partNumber: 4,
          instanceNumber: 2,
        }),
      ]),
    );

    // Board 2: Right(10,1) + Left(2,2) + Right(3,1) + 4 stretchers (consolidated from original boards 2+4)
    expect(layouts[1].stock).toEqual(plywoodSheet);
    expect(layouts[1].placements).toHaveLength(7);
    expect(layouts[1].placements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Right',
          partNumber: 10,
          instanceNumber: 1,
          leftM: 0,
          bottomM: 0,
        }),
        expect.objectContaining({
          name: 'Left',
          partNumber: 2,
          instanceNumber: 2,
        }),
        expect.objectContaining({
          name: 'Right',
          partNumber: 3,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Stretcher top front',
          partNumber: 5,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Stretcher top front',
          partNumber: 5,
          instanceNumber: 2,
        }),
        expect.objectContaining({
          name: 'Stretcher back',
          partNumber: 6,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Stretcher back',
          partNumber: 6,
          instanceNumber: 2,
        }),
      ]),
    );

    // Board 3: Right(3,2) + Left(9,1) + Divider(15,1)
    expect(layouts[2].stock).toEqual(plywoodSheet);
    expect(layouts[2].placements).toHaveLength(3);
    expect(layouts[2].placements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Right',
          partNumber: 3,
          instanceNumber: 2,
          leftM: 0,
          bottomM: 0,
        }),
        expect.objectContaining({
          name: 'Left',
          partNumber: 9,
          instanceNumber: 1,
        }),
        expect.objectContaining({
          name: 'Divider',
          partNumber: 15,
          instanceNumber: 1,
        }),
      ]),
    );

    // Unknown material has no matching stock → all 3 backs become leftovers
    expect(leftovers).toHaveLength(3);
    expect(leftovers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Back',
          partNumber: 14,
          instanceNumber: 1,
          material: 'Unknown',
        }),
        expect.objectContaining({
          name: 'Back',
          partNumber: 7,
          instanceNumber: 1,
          material: 'Unknown',
        }),
        expect.objectContaining({
          name: 'Back',
          partNumber: 7,
          instanceNumber: 2,
          material: 'Unknown',
        }),
      ]),
    );
  });
});
