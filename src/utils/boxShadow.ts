export type BoxShadow = {
  inset: boolean,
  horizontalLength: number,
  verticalLength: number,
  blurRadius: number,
  spreadRadius: number,
  color: string,
};

export const splitBoxShadow = (value: string): BoxShadow => {
  if (!value) {
    return {
      inset: false,
      horizontalLength: 0,
      verticalLength: 4,
      blurRadius: 4,
      spreadRadius: 0,
      color: '#5E5E5E',
    };
  }

  const parts = value.split(' ');
  const inset = parts[0] === 'inset';
  if (inset) {
    parts.shift();
  }

  const horizontalLength = parseInt(parts.shift());
  const verticalLength = parseInt(parts.shift());
  const blurRadius = parseInt(parts.shift());
  const spreadRadius = parseInt(parts.shift());
  const color = parts.shift();

  return {
    inset,
    horizontalLength,
    verticalLength,
    blurRadius,
    spreadRadius,
    color,
  };
};

export const boxShadowToValue = (boxShadow: BoxShadow): string => {
  const parts: string[] = [];

  if (boxShadow.inset) parts.push('inset');

  parts.push(`${boxShadow.horizontalLength}px`);
  parts.push(`${boxShadow.verticalLength}px`);
  parts.push(`${boxShadow.blurRadius}px`);
  parts.push(`${boxShadow.spreadRadius}px`);
  parts.push(boxShadow.color);

  return parts.join(' ');
};
