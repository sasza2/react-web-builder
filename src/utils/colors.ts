import { ColorResult } from 'react-color';

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
  const getHexAlpha = (opacityPercentage: number) => `0${Math.round((255 / 100) * opacityPercentage).toString(16)}`.slice(-2).toLowerCase();

  const hexAlpha = getHexAlpha((colorResult.rgb.a ?? 1) * 100);

  return normalizeColor(`${colorResult.hex}${hexAlpha}`);
};
