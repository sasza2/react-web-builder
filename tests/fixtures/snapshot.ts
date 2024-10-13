import { Locator } from '@playwright/test';
import parseHTML, { DOMNode } from 'html-dom-parser';
import parseCSS from 'style-to-object';

type SimpleNode = {
  children?: SimpleNode[],
  data?: string,
  name?: string,
  type: DOMNode['type'],
  attribs?: Record<string, unknown>,
};

const parseNode = (tree: SimpleNode[]): SimpleNode[] => tree.map((element: SimpleNode) => {
  const simpleNode: SimpleNode = {
    type: element.type,
  };

  const children = parseNode(element.children || []);

  if (children.length) {
    simpleNode.children = children;
  }

  if (element.name) {
    simpleNode.name = element.name;
  }

  if (element.data) {
    simpleNode.data = element.data;
  }

  if (element.attribs) {
    simpleNode.attribs = element.attribs;
    if (simpleNode.attribs.style) {
      simpleNode.attribs.style = parseCSS((simpleNode.attribs.style || '') as string);
    }
    delete simpleNode.attribs.class;
  }

  return simpleNode;
});

export const toSnapshot = async (locator: Locator): Promise<string> => {
  const html = await locator.innerHTML();
  const tree = parseNode(parseHTML(html) as SimpleNode[]);
  return JSON.stringify(tree);
};
