import React, { useLayoutEffect, useMemo, useRef } from 'react';
import type {
  Breakpoint, TransformElementProperty,
  WebBuilderComponent, WebBuilderElement,
} from 'types';

import { getProperties } from '@/utils/element';

import { useElementOptions } from './ElementOptionsProvider';
import { addElementReference } from './elementsRefMap';

type ElementProps = {
  breakpoint: Breakpoint,
  components: Array<WebBuilderComponent>;
  element: WebBuilderElement;
  paddingBottom: number,
  transformElementProperty?: TransformElementProperty,
};

function Element({
  breakpoint,
  components,
  element,
  paddingBottom,
  transformElementProperty,
}: ElementProps) {
  const component = components.find(({ id }) => id === element.componentName);
  if (!component) {
    throw new Error(`Component ${element.componentName} not found`);
  }

  const elementRef = useRef<HTMLDivElement>(null);
  const elementOptions = useElementOptions();

  const style = useMemo(() => ({
    paddingBottom: elementOptions.applyPaddingBottomToElements ? paddingBottom : undefined,
    width: '100%',
    height: '100%',
  }), [elementOptions.applyPaddingBottomToElements]);

  useLayoutEffect(() => {
    const ref = elementRef.current;
    if (!ref) return;

    const removeElementReference = addElementReference(breakpoint, element, ref);
    return removeElementReference;
  }, [breakpoint.id, element.id]);

  const props = getProperties(component, breakpoint, element, transformElementProperty);

  const renderElement = () => {
    const ElementOfComponent = component.component as React.FC<typeof props>;
    return (
      <ElementOfComponent {...props} />
    );
  };

  return (
    <div
      key={element.id}
      data-id={element.id}
      ref={elementRef}
      style={style}
    >
      {renderElement()}
    </div>
  );
}

export default Element;
