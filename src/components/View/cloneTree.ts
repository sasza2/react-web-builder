import type { Tree } from 'types';

export const cloneTree = (tree: Tree, createUniqueId: (current: string) => string): Tree => {
  const clonedTree = { ...tree };
  if (clonedTree.type === 'component') {
    clonedTree.element = {
      ...clonedTree.element,
      id: createUniqueId(clonedTree.element.id),
    };
  }

  if (clonedTree.children) {
    clonedTree.children = clonedTree.children.map((child) => cloneTree(child, createUniqueId));
  }

  return clonedTree;
};
