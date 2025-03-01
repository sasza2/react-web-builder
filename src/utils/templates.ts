import { Tree, WebBuilderElements } from 'types';

import { groupElementsById } from './element';

export const getElementsFromTree = (tree: Tree): WebBuilderElements => {
  const elements: WebBuilderElements = [];

  switch (tree.type) {
    case 'column':
    case 'row':
    case 'fixed':
      tree.children.forEach((child) => {
        const elementsIn = getElementsFromTree(child);
        if (elementsIn.length) elements.push(...elementsIn);
      });
      break;
    case 'component':
      elements.push(tree.element);
      break;
    default:
      throw new Error('undefined tree type');
  }

  return elements;
};

const fillTreeWithHeight = (
  tree: Tree,
  measureElementHeight: (elementId: string | number) => number | null,
): Tree => {
  const treeWithHeight: Tree = { ...tree, children: [] };
  const elementsById = groupElementsById(getElementsFromTree(tree));

  switch (treeWithHeight.type) {
    case 'column':
      {
        let height = 0;
        tree.children.forEach((child) => {
          const treeIn = fillTreeWithHeight(child, measureElementHeight);
          if (!treeIn) return;

          treeWithHeight.children.push(treeIn);
          const currentHeight = treeIn.marginBottom + treeIn.marginTop + treeIn.h;
          if (currentHeight > height) height = currentHeight;
        });
        treeWithHeight.h = height;
      }
      break;
    case 'row':
      {
        let height = 0;
        tree.children.forEach((child) => {
          const treeIn = fillTreeWithHeight(child, measureElementHeight);
          if (!treeIn) return;

          treeWithHeight.children.push(treeIn);
          height += treeIn.marginBottom + treeIn.marginTop + treeIn.h;
        });
        treeWithHeight.h = height;
      }
      break;
    case 'fixed':
      {
        let maxHeight = 0;
        tree.children.forEach((child) => {
          const treeIn = fillTreeWithHeight(child, measureElementHeight);
          if (!treeIn) return;

          treeWithHeight.children.push(treeIn);
          const height = treeIn.marginTop + treeIn.h;
          if (height > maxHeight) maxHeight = height;
        });
        treeWithHeight.h = maxHeight;
      }
      break;
    case 'component': {
      const height = measureElementHeight(tree.element.id);
      treeWithHeight.element = {
        ...elementsById[tree.element.id],
      };
      treeWithHeight.h = height;
      break;
    }
    default:
      throw new Error('undefined tree type');
  }

  return treeWithHeight;
};

export const calculatePositionsOfElements = (
  root: Tree,
  measureElementHeight: (elementId: string | number) => number | null,
): WebBuilderElements => {
  const treeWithHeight = fillTreeWithHeight(root, measureElementHeight);
  const elements: WebBuilderElements = [];

  const rec = (tree: Tree, marginLeft: number, marginTop: number) => {
    switch (tree.type) {
      case 'column':
        {
          let x = marginLeft;
          tree.children.forEach((child) => {
            const y = marginTop + child.marginTop;
            x += child.marginLeft;
            rec(child, x, y);
            x += child.w + child.marginRight;
          });
        }
        break;
      case 'row':
        {
          let y = marginTop;
          tree.children.forEach((child) => {
            const x = marginLeft + child.marginLeft;
            y += child.marginTop;
            rec(child, x, y);
            y += child.h + child.marginBottom;
          });
        }
        break;
      case 'component':
        tree.element.x = marginLeft;
        tree.element.y = marginTop;
        elements.push(tree.element);
        break;
      case 'fixed':
        tree.children.forEach((child) => {
          rec(child, tree.marginLeft + marginLeft + child.marginLeft, tree.marginTop + marginTop + child.marginTop);
        });
        break;
      default:
        throw new Error('undefined tree type');
    }
  };

  rec(treeWithHeight, treeWithHeight.marginLeft, treeWithHeight.marginTop);

  return elements;
};
