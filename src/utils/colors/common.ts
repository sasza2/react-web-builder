import { isValidGradientColor } from './gradient';
import { isValidColor } from './hex';
import { ColorType } from './types';

export const getColorType = (color?: string): ColorType => {
  if (!color) return ColorType.None;

  if (color === 'transparent' || isValidColor(color)) return ColorType.Hex;

  if (isValidGradientColor(color)) return ColorType.Gradient;

  return ColorType.Hex;
};
