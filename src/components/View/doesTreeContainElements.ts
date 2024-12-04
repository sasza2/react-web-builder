import { Tree } from 'types';

export const doesTreeContainElements = (tree: Tree): boolean => {
  if (!tree) return false;

  if (tree.type === 'component') return true;

  return tree.children?.length > 0;
};
