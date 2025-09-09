import type { Tree } from 'types';

export const removePaddingFromLastTreeElement = (tree: Tree) => {
  if (tree.children?.length) {
    removePaddingFromLastTreeElement(tree.children[tree.children.length - 1]);
  } else if (tree.type === 'component') {
    tree.paddingBottom = 0;
  }
};
