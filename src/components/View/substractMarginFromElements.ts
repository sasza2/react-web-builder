import type { WebBuilderElements } from 'types';

const substractMarginFromElements = (elements: WebBuilderElements, marginLeft: number, marginTop: number) => elements.map((element) => ({
  ...element,
  x: element.x - marginLeft,
  y: element.y - marginTop,
}));

export default substractMarginFromElements;
