import { expect, it } from 'vitest';

import { gradientToValue, splitGradientColor } from './gradient';

it('gradient', () => {
  const background = 'radial-gradient(circle, #ffaabb00 0%, #ccddee55 35%, #abcdefff 100%)';
  const gradient = splitGradientColor(background);

  expect(gradient).toStrictEqual({
    type: 'radial-gradient',
    angle: 'circle',
    colors: [
      { color: '#ffaabb00', percent: 0 },
      { color: '#ccddee55', percent: 35 },
      { color: '#abcdefff', percent: 100 },
    ],
  });

  expect(gradientToValue(gradient)).toBe(background);
});
