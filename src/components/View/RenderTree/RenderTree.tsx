import React from 'react';

import {
  Breakpoint, TransformElementProperty, Tree,
  WebBuilderComponent,
} from 'types';
import Element from '../Element';
import { getStyleForFixedChild, getStyleForFixedParent } from './styles/fixed';
import { getStyleForBreakpoint } from './styles/breakpoint';

type RenderTreeProps = {
  breakpoint: Breakpoint,
  components: WebBuilderComponent[],
  node: Tree,
  transformElementProperty: TransformElementProperty,
};

export function RenderTree({
  breakpoint,
  components,
  node,
  transformElementProperty,
}: RenderTreeProps) {
  if (!node) return null; // TODO

  const style = getStyleForBreakpoint(node, breakpoint);

  switch (node.type) {
    case 'row':
      return (
        <div key={node.id} style={{ flexDirection: 'column', ...style }} className="react-web-builder-row">
          {node.children.map((tree) => (
            <RenderTree
              key={tree.id}
              breakpoint={breakpoint}
              components={components}
              node={tree}
              transformElementProperty={transformElementProperty}
            />
          ))}
        </div>
      );
    case 'column':
      return (
        <div key={node.id} style={{ flexDirection: 'row', ...style }} className="react-web-builder-column">
          {node.children.map((tree) => (
            <RenderTree
              key={tree.id}
              breakpoint={breakpoint}
              components={components}
              node={tree}
              transformElementProperty={transformElementProperty}
            />
          ))}
        </div>
      );
    case 'component':
      if (node.element.componentName === 'Separator') return null;
      return (
        <div key={node.id} style={{ ...style }}>
          <Element
            breakpoint={breakpoint}
            element={node.element}
            components={components}
            paddingBottom={node.paddingBottom}
            transformElementProperty={transformElementProperty}
          />
        </div>
      );
    case 'fixed':
      return (
        <div
          key={node.id}
          style={{
            ...style,
            ...getStyleForFixedParent(node, breakpoint),
          }}
        >
          {node.children.map((child) => (
            <div
              key={child.id}
              style={getStyleForFixedChild(child, breakpoint)}
            >
              <Element
                breakpoint={breakpoint}
                element={child.element}
                components={components}
                paddingBottom={child.paddingBottom}
                transformElementProperty={transformElementProperty}
              />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}
