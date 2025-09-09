import { parse as postcssParse, type Root } from 'postcss';
import selectorParser, { type Node } from 'postcss-selector-parser';

import { ALLOWED_TAGS } from './consts';
import {
  type ErrorsInstance, reportError, TransformErrorTypes, wrapError,
} from './errors';
import { allowedCSSProperties } from './validators';

export type ItemNode = {
  prop?: string,
  value?: string,
};

export const transformSelector = (originalSelector: string, classNamePrefix: string) => {
  const selector = originalSelector.trim();

  if (selector === 'body' || selector === 'html' || selector === ':root') return `.${classNamePrefix}`;

  return selector.split(',').map((className) => {
    const classNamesParts = className.split(' ').map((item) => {
      if (ALLOWED_TAGS[item as keyof typeof ALLOWED_TAGS] && ALLOWED_TAGS[item as keyof typeof ALLOWED_TAGS] !== item) {
        return `.${classNamePrefix}-${item}`;
      }

      return item;
    }).join(' ');

    return `.${classNamePrefix} ${classNamesParts}`;
  }).join(',');
};

export const isValidSelector = (selectorOriginal: string): boolean => {
  if (typeof selectorOriginal !== 'string' || !selectorOriginal) return false;

  const selector = selectorOriginal.trim();
  if (selector.includes('@') || selector.includes('|')) return false;
  if (selector.startsWith(':')) return false;

  // eslint-disable-next-line no-useless-escape
  const safePattern = /^[a-zA-Z0-9#.\-[=\]"',: \s>+~]*$/;
  if (!safePattern.test(selector)) {
    return false;
  }

  if (typeof document !== 'undefined') {
    try {
      document.createDocumentFragment().querySelector(selector);
    } catch (_e) {
      return false;
    }
  }

  try {
    const processor = selectorParser();

    processor.processSync(selector, { lossless: false });

    const ast = processor.astSync(selector);

    let previousWasCombinator = false;
    let lastWasCombinator = false;
    let isValid = true;

    ast.each((selectorNode) => {
      selectorNode.walk((node: Node) => {
        if (
          (node.type === 'class' || node.type === 'id')
          && !node.value
        ) {
          isValid = false;
        }

        if ('operator' in node && node.operator && (node.value === '' || node.value === undefined)) {
          isValid = false;
        }

        if (node.type === 'combinator') {
          lastWasCombinator = true;

          if (previousWasCombinator) {
            isValid = false;
          }
          previousWasCombinator = true;
        } else {
          lastWasCombinator = false;
          previousWasCombinator = false;
        }
      });

      if (lastWasCombinator) {
        isValid = false;
      }
    });

    return isValid;
  } catch {
    return false;
  }
};

const isValidCSSProperty = (name: string) => /^-?[a-zA-Z][a-zA-Z0-9-]*$/.test(name);

export const transformStyles = (nodes: ItemNode[], errors?: ErrorsInstance): Record<string, string> => nodes.map((attribute) => {
  if (!attribute.prop || !attribute.value) return null;

  if (!isValidCSSProperty(attribute.prop)) {
    reportError(errors, wrapError({ type: TransformErrorTypes.UnsupportedCSSAttribute, prop: attribute.prop }));
    return null;
  }

  const formatter = allowedCSSProperties[attribute.prop];
  if (formatter) {
    if (formatter(attribute.value)) {
      return { prop: attribute.prop, value: attribute.value };
    }

    reportError(errors, wrapError({ type: TransformErrorTypes.UnsupportedCSSValue, prop: attribute.prop, value: attribute.value }));
  } else if (errors) {
    reportError(errors, wrapError({ type: TransformErrorTypes.UnsupportedCSSAttribute, prop: attribute.prop }));
  }

  return null;
}).filter(Boolean).reduce((prev, current) => {
  prev[current.prop] = current.value;

  return prev;
}, {} as Record<string, string>);

const transformAttributeNameForReact = (name: string) => name.split('-').map((item, index) => {
  if (!item) return '';
  if (!index) return item;
  return item[0].toUpperCase() + item.substring(1);
}).filter(Boolean).join('');

export const transformStylesForReact = (nodes: ItemNode[], errors?: ErrorsInstance): Record<string, string> => {
  const styles = transformStyles(nodes, errors);

  Object.entries(styles).forEach(([name, value]) => {
    delete styles[name];
    styles[transformAttributeNameForReact(name)] = value;
  });

  return styles;
};

export const parseStyle = (css: string, errors?: ErrorsInstance): Root | null => {
  try {
    const style = postcssParse(css);
    return style;
  } catch {
    reportError(errors, wrapError({ type: TransformErrorTypes.InvalidCSS, css }));
    return null;
  }
};
