import React, {
  createElement, memo,
} from 'react';
import { HTMLComponentValue, WebBuilderElement } from 'types';

import { useHTMLTransform } from '@/hooks/useHTMLTransform';
import { ALLOWED_TAGS_VALUES } from '@/utils/html2json/consts';
import type { Node } from '@/utils/html2json/transform';

type HTMLComponentProps = {
  element: WebBuilderElement,
  html: HTMLComponentValue,
};

type RenderNodeChildProps = {
  child: Node,
};

const RenderNodeChild = memo(({ child }: RenderNodeChildProps) => {
  switch (child.type) {
    case 'text':
      return child.text;
    case 'element': {
      if (!ALLOWED_TAGS_VALUES.includes(child.tagName as typeof ALLOWED_TAGS_VALUES[number])) return null;

      const children = child.children.length ? child.children.map((currentChild) => (
        <RenderNodeChild key={currentChild.key} child={currentChild} />
      )) : undefined;

      if (child.tagName === 'fragment') return children;

      return createElement(
        child.tagName,
        {
          className: child.attributes.className,
          height: child.attributes.height,
          href: child.attributes.href,
          src: child.attributes.src,
          style: child.style,
          width: child.attributes.width,
        },
        children,
      );
    }
    case 'style':
      return (
        <style>
          {child.children.map((item) => `
            ${item.selector} {
              ${Object.entries(item.style).map(([key, value]) => `${key}: ${value}`).join(';\n')}
            }
          `)}
        </style>
      );
    default:
      return null;
  }
});

RenderNodeChild.displayName = 'RenderNodeChild';

export const HTMLComponent = memo(({ element, html }: HTMLComponentProps) => {
  const className = `react-web-builder-html-element-${element.id}`;
  const [nodes] = useHTMLTransform(html.value, className);

  return (
    <div className={className} style={{ display: 'grid', overflow: 'hidden' }}>
      {nodes.map((child) => <RenderNodeChild key={child.key} child={child} />)}
    </div>
  );
});

HTMLComponent.displayName = 'HTMLComponent';
