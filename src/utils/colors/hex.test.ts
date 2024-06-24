import { expect, it } from 'vitest';

import { shadeColor } from './hex';

it('shade color', () => {
  expect(shadeColor('#5d0350', 40)).toBe('#820470ff');
});
