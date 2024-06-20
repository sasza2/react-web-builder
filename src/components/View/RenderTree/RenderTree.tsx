import React, { useCallback, useMemo } from 'react';

import {
  Breakpoint, TransformElementProperty, Tree,
  WebBuilderComponent,
} from 'types';
import { getBreakpointPadding, isBreakpoint } from '@/utils/breakpoint';
import Element from '../Element';

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

  const padding = getBreakpointPadding(breakpoint);

  const withoutPadding = useCallback((value: string): string => {
    const paddingSum = padding.left + padding.right;
    if (paddingSum) return `calc(${value} - ${paddingSum}px)`;
    return value;
  }, [padding.left, padding.right]);

  const maxWidth = useMemo(
    () => withoutPadding(breakpoint.to === null ? '100%' : `${breakpoint.to}px`),
    [breakpoint.to, withoutPadding],
  );

  const width = useMemo(
    () => withoutPadding(`${node.w / breakpoint.cols * 100}%`),
    [node.w, breakpoint.cols, withoutPadding],
  );

  const offsetTop = breakpoint.rowHeight * node.marginTop;

  const style = {
    display: 'flex',
    width,
    marginTop: isBreakpoint(breakpoint) ? offsetTop : 0,
    paddingTop: isBreakpoint(breakpoint) ? 0 : offsetTop,
    marginBottom: breakpoint.rowHeight * node.marginBottom,
    marginLeft: `${node.marginLeft / breakpoint.cols * 100}%`,
    marginRight: `${node.marginRight / breakpoint.cols * 100}%`,
    maxWidth,
  };
  switch (node.type) {
    case 'row':
      return (
        <div key={node.id} style={{ flexDirection: 'column', ...style }} className="row">
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
        <div key={node.id} style={{ flexDirection: 'row', ...style }} className="column">
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
            position: 'relative',
            height: `${node.h * breakpoint.rowHeight}px`,
          }}
        >
          {node.children.map((child) => (
            <div
              key={child.id}
              style={{
                position: 'absolute',
                width: `${child.w / breakpoint.cols * 100}%`,
                top: breakpoint.rowHeight * child.marginTop,
                left: `${child.marginLeft / breakpoint.cols * 100}%`,
              }}
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
