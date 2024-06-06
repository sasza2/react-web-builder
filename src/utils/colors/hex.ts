import { ColorResult } from 'react-color';
import { splitGradientColor } from './gradient';
import { getColorType } from './common';
import { ColorType } from './types';

const TRANSPARENT_HEX = '#ffffff00';

const getColorWithoutHash = (color: string) => {
  if (!color) return '';
  if (color.startsWith('#')) return color.substring(1);
  return color;
};

export const normalizeColor = (color: string): string => {
  const colorWithoutHash = getColorWithoutHash(color).toLowerCase();
  if (colorWithoutHash.length === 6) return `#${colorWithoutHash}ff`;
  return `#${colorWithoutHash}`;
};

const splitColor = (color: string): { r: number, g: number, b: number, a: number } | null => {
  if (!color) return null;

  color = normalizeColor(color);

  if (!/^#[0-9a-fA-F]{8}$/i.test(color)) return null;

  try {
    const result = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/i.exec(color);
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const a = parseInt(result[4], 16);

    return {
      r, g, b, a,
    };
  } catch (e) {
    return null;
  }
};

export const isValidColor = (color: string) => !!splitColor(color);

export const isColorTransparent = (color: string): boolean => {
  const colorValue = splitColor(color);
  if (!colorValue) return false;
  return colorValue.a === 0;
};

export const isLightColor = (color: string) => {
  const colorValue = splitColor(color);
  if (!colorValue) return null;

  const {
    r, g, b, a,
  } = colorValue;
  const Y = (0.2126 * r + 0.7152 * g + 0.0722 * b);
  const YA = Y / (a / 255);

  return YA > 230;
};

export const getColorForSketch = (color?: string, defaultValue?: string) => {
  const colorType = getColorType(color);
  if (colorType === ColorType.Gradient) {
    const gradientColor = splitGradientColor(color);
    if (gradientColor.colors.length > 0) return normalizeColor(gradientColor.colors[0].color);
  }

  if (color === 'transparent') return TRANSPARENT_HEX;
  if (color) return normalizeColor(color);
  if (defaultValue === 'transparent') return TRANSPARENT_HEX;
  if (defaultValue) return normalizeColor(defaultValue);
  return TRANSPARENT_HEX;
};

export const getColorForInput = (color?: string, defaultValue?: string) => {
  const colorForInput = getColorWithoutHash(getColorForSketch(color, defaultValue));
  if (colorForInput.length === 8 && colorForInput.endsWith('ff')) return colorForInput.substring(0, 6);
  return colorForInput;
};

export const getColorForTooltip = (color: string) => {
  if (color === 'transparent') return 'transparent';
  return `#${getColorForInput(color)}`;
};

export const normalizeSketchColor = (colorResult: ColorResult) => {
  if (colorResult.hex === 'transparent') return 'transparent';

  const getHexAlpha = (opacityPercentage: number) => `0${Math.round((255 / 100) * opacityPercentage).toString(16)}`.slice(-2).toLowerCase();

  const hexAlpha = getHexAlpha((colorResult.rgb.a ?? 1) * 100);

  return normalizeColor(`${colorResult.hex}${hexAlpha}`);
};

export const shadeColor = (color: string, percent: number): string => {
  const colorRGB = splitColor(color);
  const { a } = colorRGB;
  let { r, g, b } = colorRGB;

  r = Math.floor(r * (100 + percent) / 100);
  g = Math.floor(g * (100 + percent) / 100);
  b = Math.floor(b * (100 + percent) / 100);

  r = (r < 255) ? r : 255;
  g = (g < 255) ? g : 255;
  b = (b < 255) ? b : 255;

  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  const RR = ((g.toString(16).length === 1) ? `0${r.toString(16)}` : r.toString(16));
  const GG = ((g.toString(16).length === 1) ? `0${g.toString(16)}` : g.toString(16));
  const BB = ((b.toString(16).length === 1) ? `0${b.toString(16)}` : b.toString(16));
  const AA = ((a.toString(16).length === 1) ? `0${a.toString(16)}` : a.toString(16));

  return `#${RR}${GG}${BB}${AA}`;
};
