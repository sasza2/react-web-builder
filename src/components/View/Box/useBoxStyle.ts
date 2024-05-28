import { UseBoxStyleProps } from 'types';
import { isValidColor } from '@/utils/colors';
import { DEFAULT_LETTER_SPACING, DEFAULT_LINE_HEIGHT } from '@/consts';

const parseNumberValue = (padding?: number) => {
  if (!padding || padding < 0) return 0;
  return Math.floor(padding) || 0;
};

const parseBorderValue = (border: number, color: string) => {
  if (typeof color !== 'string') return undefined;
  const value = Math.floor(border) || 0;
  if (!value || value < 0) return undefined;
  if (!isValidColor(color)) return undefined;
  return `${value}px solid ${color}`;
};

export const useBoxStyle = (props: UseBoxStyleProps): React.CSSProperties => {
  const {
    backgroundColor,
    border = {},
    boxShadow,
    color,
    fontOptions = {},
    padding = {},
  } = props || {};
  return {
    background: backgroundColor,
    borderTop: parseBorderValue(border.top, border.color),
    borderRight: parseBorderValue(border.right, border.color),
    borderBottom: parseBorderValue(border.bottom, border.color),
    borderLeft: parseBorderValue(border.left, border.color),
    borderRadius: parseNumberValue(border.radius),
    boxShadow: boxShadow || undefined,
    color,
    fontWeight: fontOptions.bold ? '600' : 'normal',
    fontSize: fontOptions.size || 12,
    textDecoration: fontOptions.underline ? 'underline' : undefined,
    fontStyle: fontOptions.italic ? 'italic' : undefined,
    letterSpacing: fontOptions.letterSpacing || DEFAULT_LETTER_SPACING,
    lineHeight: fontOptions.lineHeight || DEFAULT_LINE_HEIGHT,
    textAlign: fontOptions.textAlign || 'left',
    paddingTop: parseNumberValue(padding.top),
    paddingRight: parseNumberValue(padding.right),
    paddingBottom: parseNumberValue(padding.bottom),
    paddingLeft: parseNumberValue(padding.left),
  };
};

export default useBoxStyle;
