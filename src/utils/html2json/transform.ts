import * as htmlparser2 from 'htmlparser2';

import { createUniqueId } from '../createUniqueId';
import { isValidLink } from '../link';
import { ALLOWED_TAGS } from './consts';
import {
  type ErrorsInstance, initErrorsInstance, reportError, TransformErrorTypes, wrapError,
} from './errors';
import {
  isValidSelector,
  type ItemNode, parseStyle, transformSelector, transformStyles, transformStylesForReact,
} from './styles';
import { sizeValidator } from './validators';

type NodeStyle = {
  key?: string,
  children: {
    selector: string,
    style: Record<string, string>,
  }[],
  type: 'style',
};

export type NodeElement = {
  children: Node[],
  key?: string,
  tagName: string,
  attributes: Record<string, string>,
  style?: Record<string, string>,
  type: 'element',
};

type NodeText = {
  key?: string,
  text: string,
  type: 'text',
};

export type Node = NodeElement | NodeText | NodeStyle;

const isAllowedTag = (tagName: string): boolean => {
  const allowedTag = !!ALLOWED_TAGS[tagName as keyof typeof ALLOWED_TAGS];

  return allowedTag;
};

export const prepareAttributes = (tagName: string, attributes: Record<string, string>, errors: ErrorsInstance): Record<string, string> => {
  const nextAttributes: Record<string, string> = {};
  const supportedTags = ['class', 'height', 'href', 'src', 'width', 'style'];

  Object.entries(attributes).forEach(([attribute]) => {
    if (!supportedTags.includes(attribute)) {
      reportError(errors, wrapError({ type: TransformErrorTypes.UnsupportedHTMLAttribute, attribute, tagName }));
    }
  });

  if (attributes.class) {
    nextAttributes.className = attributes.class;
    delete attributes.class;
  }

  if (attributes.height) {
    if (sizeValidator(attributes.height)) {
      nextAttributes.height = attributes.height;
    } else {
      reportError(errors, wrapError({
        type: TransformErrorTypes.UnsupportedHTMLAttributeValue,
        tagName,
        attribute: 'height',
        value: attributes.height,
      }));
    }
  }

  if (attributes.width) {
    if (sizeValidator(attributes.width)) {
      nextAttributes.width = attributes.width;
    } else {
      reportError(errors, wrapError({
        type: TransformErrorTypes.UnsupportedHTMLAttributeValue,
        tagName,
        attribute: 'width',
        value: attributes.width,
      }));
    }
  }

  if (tagName === 'a') {
    if (attributes.href) {
      if (isValidLink(attributes.href)) {
        nextAttributes.href = attributes.href;
      } else {
        reportError(errors, wrapError({
          type: TransformErrorTypes.UnsupportedHTMLAttributeValue,
          tagName,
          attribute: 'href',
          value: attributes.href,
        }));
      }
    }
  }

  if (tagName === 'img') {
    if (attributes.src) {
      if (isValidLink(attributes.src)) {
        nextAttributes.src = attributes.src;
      } else {
        reportError(errors, wrapError({
          type: TransformErrorTypes.UnsupportedHTMLAttributeValue,
          tagName,
          attribute: 'src',
          value: attributes.src,
        }));
      }
    }
  }

  return nextAttributes;
};

export const transform = (
  html: string,
  options: {
    classNamePrefix: string,
    createNodeKey?: (node: Node) => string,
  },
): [Node[], ErrorsInstance] => {
  const errors = initErrorsInstance();
  const createNodeKey = options.createNodeKey || createUniqueId;

  const stackChildren: Node[][] = [[]];
  const styles: NodeStyle[] = [];
  let openedStyle: NodeStyle = null;

  const parser = new htmlparser2.Parser({
    onopentag(tagName, attributes) {
      const typedTagName = tagName as keyof typeof ALLOWED_TAGS;

      if (openedStyle) openedStyle = null;

      if (tagName === 'style') {
        openedStyle = {
          children: [],
          type: 'style',
        };

        openedStyle.key = createNodeKey(openedStyle);

        styles.push(openedStyle);

        return;
      }

      const children: Node[] = [];

      const element: NodeElement = {
        children,
        tagName: typedTagName,
        attributes: prepareAttributes(typedTagName, attributes, errors),
        type: 'element',
      };

      element.key = createNodeKey(element);

      if (attributes.style) {
        const style = parseStyle(attributes.style || '', errors);

        if (style) {
          element.style = transformStylesForReact(style.nodes as ItemNode[], errors);
        }
      }

      if (ALLOWED_TAGS[typedTagName] && ALLOWED_TAGS[typedTagName] !== tagName) {
        element.attributes.className = `${options.classNamePrefix}-${tagName} ${element.attributes.className || ''}`;
      }

      stackChildren[stackChildren.length - 1].push(element);

      stackChildren.push(children);
    },
    ontext(text) {
      if (openedStyle) {
        const style = parseStyle(text || '', errors);

        if (style) {
          openedStyle.children = style.nodes.map((node) => {
            if ('selector' in node) {
              if (!isValidSelector(node.selector)) {
                reportError(errors, wrapError({ type: TransformErrorTypes.UnsupportedCSSSelector, selector: node.selector }));
                return null;
              }

              return {
                selector: transformSelector(node.selector, options.classNamePrefix),
                style: transformStyles(node.nodes as ItemNode[], errors),
              };
            }

            reportError(errors, wrapError({ type: TransformErrorTypes.UnsupportedCSS, css: node.toString() }));

            return null;
          }).filter(Boolean);
        }

        openedStyle = null;
      } else {
        const nodeText: NodeText = {
          text,
          type: 'text',
        };

        nodeText.key = createNodeKey(nodeText);

        stackChildren[stackChildren.length - 1].push(nodeText);
      }
    },
    onclosetag(tagName) {
      if (tagName === 'style') return;

      stackChildren.pop();
    },
  });

  parser.write(html);
  parser.end();

  const removeNotAllowedTags = (children: Node[], parent: Node | null): Node[] => children.filter((child) => {
    switch (child.type) {
      case 'style':
      case 'text':
        return true;
      case 'element': {
        if (parent && parent.type === 'style') return false;

        child.children = removeNotAllowedTags(child.children, child);

        if (child.tagName === 'html' || child.tagName === 'body') {
          child.tagName = 'fragment';
          return true;
        }

        const allowedTag = isAllowedTag(child.tagName);

        if (!allowedTag && child.tagName) {
          reportError(errors, wrapError({ type: TransformErrorTypes.UnsupportedHTMLTagName, tagName: child.tagName }));
        }

        return allowedTag;
      }
      default:
        return false;
    }
  });

  const allElements: Node[] = [...styles];
  if (stackChildren?.[0]) {
    allElements.push(...stackChildren[0]);
  }

  return [removeNotAllowedTags(allElements, null), errors];
};
