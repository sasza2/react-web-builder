import type { WebBuilderElements } from 'types';

const canSplitLine = (prev: WebBuilderElements, current: WebBuilderElements): boolean => {
  const size = Math.max(prev.length, current.length);
  for (let i = 0; i < size; i++) {
    const a = prev[i];
    const b = current[i];
    if (a && b && a.id === b.id) return false;
  }

  return true;
};

export default canSplitLine;
