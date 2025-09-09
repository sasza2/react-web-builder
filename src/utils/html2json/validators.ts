import valueParser, { type Node } from 'postcss-value-parser';

type Validator = (value: string) => boolean;

export const allowedValuesValidator = (...allowed: string[]): Validator => (value) => allowed.includes(value);

export const colorValidator: Validator = (value) => {
  const parsedValue = `${value}`.trim();
  const basicColors = /^[a-z]+$/; // red, black, etc.
  const hexColors = /^#[0-9a-f]{3,6}$/i; // #fff, #ffffff
  const rgb = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
  const rgba = /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|0?\.\d+|1(\.0)?)\s*\)$/;

  return (
    basicColors.test(parsedValue)
    || hexColors.test(parsedValue)
    || rgb.test(parsedValue)
    || rgba.test(parsedValue)
  );
};

export const borderValidator: Validator = (value) => {
  const allowedStyles = [
    'none', 'solid', 'dashed', 'dotted', 'double',
    'hidden', 'inset', 'outset', 'groove', 'ridge',
  ];

  const widthRegex = /^[0-9.]+(px|em|rem|%)?$|^0$/; // np. "1px", "0.5em", "0"

  const parts = value.trim().toLowerCase().split(/\s+/);
  if (!parts.length || parts.length > 3) return null;

  if (parts.length === 1) {
    return (
      !!(parts[0] === 'none' || widthRegex.test(parts[0]))
    );
  }

  let width: string = null;
  let style: string = null;
  let color: string = null;

  parts.forEach((part) => {
    if (!style && allowedStyles.includes(part)) style = part;
    else if (!width && widthRegex.test(part)) width = part;
    else if (!color && colorValidator(part)) color = part;
  });

  const formattedParts = [width, style, color].filter(Boolean);

  if (parts.length === formattedParts.length) return true;

  return false;
};

const numberValidator: Validator = (value) => /^-?\d+(\.\d+)?$/.test(`${value}`);

export const sizeValidator: Validator = (value) => {
  if (numberValidator(value)) return true;

  const parsedValue = valueParser.unit(`${value}`);

  if (!parsedValue || !parsedValue.unit) return false;

  return true;
};

const sizePositiveValidator: Validator = (value) => {
  if (numberValidator(value)) return Number.parseFloat(value) >= 0;

  const parsedValue = valueParser.unit(`${value}`);

  if (!parsedValue || !parsedValue.unit || Number.parseFloat(parsedValue.number) < 0) return false;

  return true;
};

export const sizeArrayValidator = (maxParts: number): Validator => (value) => {
  const sizeParts = `${value}`.split(' ').filter(Boolean).filter(sizeValidator);
  if (sizeParts.length === 0 || sizeParts.length > maxParts) return false;

  return true;
};

export const spacingValidator: Validator = (value) => {
  if (allowedValuesValidator('normal', 'inherit', 'initial', 'unset')(value)) return true;
  return sizeValidator(value);
};

export const flexValidator: Validator = (flex: string) => {
  const keywords = ['none', 'auto', 'initial', 'inherit', 'unset'];

  const isLengthOrAuto = (value: string): boolean => (
    value === 'auto' || sizePositiveValidator(value)
  );

  const parsed = valueParser(flex).nodes.filter((n) => n.type === 'word');
  const values = parsed.map((n) => n.value);

  if (values.length === 1 && keywords.includes(values[0])) {
    return true;
  }

  if (values.length === 1) {
    return numberValidator(values[0]);
  }

  if (values.length === 2) {
    return numberValidator(values[0]) && numberValidator(values[1]);
  }

  if (values.length === 3) {
    return numberValidator(values[0]) && numberValidator(values[1]) && isLengthOrAuto(values[2]);
  }

  return false;
};

export const flexSizeValidator: Validator = (flexSize) => {
  const isNonNegativeNumber = (value: string): boolean => {
    const num = parseFloat(value);
    return !Number.isNaN(num) && Number.isFinite(num) && num >= 0 && /^[\d.]+$/.test(value);
  };

  const parsed = valueParser(flexSize).nodes.filter((n) => n.type === 'word');

  return parsed.length === 1 && isNonNegativeNumber(parsed[0].value);
};

export const fontFamilyValidator: Validator = (fontFamily) => {
  if (fontFamily.includes(';')) return false;

  const isValidFontName = (node: Node) => (
    node.type === 'word' || (node.type === 'string' && node.value.length > 0)
  );

  const parsed = valueParser(fontFamily).nodes;
  const cleaned = parsed.filter((n) => n.type !== 'space');

  if (cleaned.length === 0) return false;

  let expectingComma = false;

  for (let i = 0; i < cleaned.length; i++) {
    const node = cleaned[i];

    if (expectingComma) {
      if (node.type !== 'div' || node.value !== ',') return false;
      expectingComma = false;
    } else {
      if (!isValidFontName(node)) return false;
      expectingComma = true;
    }
  }

  const last = cleaned[cleaned.length - 1];
  if (last.type === 'div' && last.value === ',') return false;

  return true;
};

export const alignItemsValidator = allowedValuesValidator('stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'normal', 'start', 'end', 'self-start', 'self-end', 'unsafe start', 'unsafe end', 'safe start', 'safe end');

export const allowedCSSProperties: Record<string, Validator> = {
  'align-items': alignItemsValidator,
  background: colorValidator,
  'background-color': colorValidator,
  border: borderValidator,
  'border-top': borderValidator,
  'border-right': borderValidator,
  'border-bottom': borderValidator,
  'border-left': borderValidator,
  'border-radius': borderValidator,
  color: colorValidator,
  cursor: allowedValuesValidator('auto', 'default', 'pointer', 'crosshair', 'move', 'text', 'wait', 'help', 'not-allowed', 'progress', 'zoom-in', 'zoom-out', 'grab', 'grabbing', 'e-resize', 'n-resize', 'ne-resize', 'nw-resize', 's-resize', 'se-resize', 'sw'),
  display: allowedValuesValidator('block', 'inline', 'inline-block', 'flex', 'grid', 'inline-flex', 'inline-grid', 'list-item', 'run-in', 'table', 'inline-table', 'table-row', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'contents', 'legacy'),
  gap: sizeArrayValidator(2),
  flex: flexValidator,
  'flex-grow': flexSizeValidator,
  'flex-shrink': flexSizeValidator,
  'flex-direction': allowedValuesValidator('row', 'row-reverse', 'column', 'column-reverse'),
  'font-family': fontFamilyValidator,
  'font-size': sizeValidator,
  'font-style': allowedValuesValidator('normal', 'italic', 'oblique', 'inherit', 'initial', 'unset'),
  'font-weight': allowedValuesValidator('normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'),
  'flex-wrap': allowedValuesValidator('nowrap', 'wrap', 'wrap-reverse'),
  float: allowedValuesValidator('left', 'right', 'none'),
  height: sizeValidator,
  'justify-content': allowedValuesValidator('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'start', 'end', 'left', 'right'),
  'letter-spacing': spacingValidator,
  'line-height': spacingValidator,
  'list-style': allowedValuesValidator('disc', 'circle', 'square', 'decimal', 'none'),
  margin: sizeArrayValidator(4),
  'margin-top': sizeValidator,
  'margin-right': sizeValidator,
  'margin-bottom': sizeValidator,
  'margin-left': sizeValidator,
  'max-width': sizeValidator,
  'min-width': sizeValidator,
  'max-height': sizeValidator,
  'min-height': sizeValidator,
  outline: borderValidator,
  padding: sizeArrayValidator(4),
  'padding-top': sizeValidator,
  'padding-right': sizeValidator,
  'padding-bottom': sizeValidator,
  'padding-left': sizeValidator,
  'text-align': allowedValuesValidator('left', 'right', 'center', 'justify', 'start', 'end', 'match-parent'),
  'text-decoration': allowedValuesValidator('none', 'underline', 'overline', 'line-through', 'blink', 'inherit', 'initial', 'unset'),
  width: sizeValidator,
} as const;
