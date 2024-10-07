import React, { useLayoutEffect, useRef } from 'react';

import {
  Breakpoint, WebBuilderElement, WebBuilderComponent, TransformElementProperty,
} from 'types';
import { getProperties } from '@/utils/element';
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
    console.warn(`Component ${element.componentName} not found`); // eslint-disable-line no-console
    return null;
  }

  const elementRef = useRef<HTMLDivElement>(null);

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
      style={{ paddingBottom, width: '100%' }}
    >
      {renderElement()}
    </div>
  );
}

export default Element;
