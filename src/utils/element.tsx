import React from 'react';
import {
  Breakpoint,
  ElementRenderFunc,
  TransformElementProperty,
  WebBuilderComponent,
  WebBuilderComponentProperty,
  WebBuilderElement,
  WebBuilderElementProperty,
  WebBuilderElements,
} from 'types';

import { ComponentNotFound } from '@/components/ComponentNotFound';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RenderWebComponent } from '@/components/Grid/RenderWebComponent';

export const isSeparator = (component: WebBuilderComponent) => component.id === 'Separator'; // TODO

export const isResizable = (component: WebBuilderComponent) => component.resizable !== false;

export const getDefaultHeight = (component: WebBuilderComponent) => {
  let h: number | 'auto' = 'auto';
  if (isSeparator(component)) {
    h = 1;
  }
  return h;
};

export const getDefaultWidth = (component: WebBuilderComponent, breakpoint: Breakpoint) => {
  let defaultWidth: number | null = null;

  if (component.defaultWidth) {
    if (typeof component.defaultWidth === 'function') {
      defaultWidth = component.defaultWidth({ component, breakpoint });
    } else {
      defaultWidth = component.defaultWidth;
    }
  }

  let width = breakpoint.cols;
  if (defaultWidth && width > defaultWidth) width = defaultWidth;
  return width;
};

export const getDefaultValue = <T extends WebBuilderComponentProperty>(
  prop: T, breakpoint: Breakpoint,
): T['defaultValue'] => {
  if (typeof prop.defaultValue === 'function') {
    return prop.defaultValue({ breakpoint }) as T['defaultValue'];
  }
  return prop.defaultValue;
};

export const getElementPropsWhenCreating = (component: WebBuilderComponent, breakpoint: Breakpoint) => component.props.map((prop) => {
  if (prop.type === 'color') {
    return {
      propId: prop.id,
      value: null,
    };
  }

  return {
    propId: prop.id,
    value: getDefaultValue(prop, breakpoint),
  };
});

export const getProperties = (
  component: WebBuilderComponent,
  breakpoint: Breakpoint,
  element: WebBuilderElement,
  transformElementProperty?: TransformElementProperty,
) => {
  const props: Record<string, unknown> = {
    breakpoint,
    component,
    element,
  };

  if (component) {
    component.props.forEach((prop) => {
      if (prop.defaultValue) props[prop.id] = getDefaultValue(prop, breakpoint);
    });
  }

  if (element) {
    element.props.forEach((prop) => {
      if (prop.value === undefined || prop.value === null || prop.value === '') return;

      if (component && transformElementProperty) {
        props[prop.propId] = transformElementProperty(
          component.props.find((componentProp) => componentProp.id === prop.propId),
          prop,
        );
      } else {
        props[prop.propId] = prop.value;
      }
    });
  }

  return props;
};

export const produceRenderForElement = (
  components: WebBuilderComponent[],
  breakpoint: Breakpoint,
  element: WebBuilderElement,
  transformElementProperty?: TransformElementProperty,
): [ElementRenderFunc, boolean] => {
  const componentOfElement = components.find((component) => component.id === element.componentName);
  if (componentOfElement) {
    const props = getProperties(
      componentOfElement,
      breakpoint,
      element,
      transformElementProperty,
    );
    const WebBuilderComponentRender = componentOfElement.component as React.FC<typeof props>;

    return [
      () => (
        <RenderWebComponent display={componentOfElement.id === 'Container' ? 'flex' : undefined}>
          <ErrorBoundary>
            <WebBuilderComponentRender {...props} />
          </ErrorBoundary>
        </RenderWebComponent>
      ),
      true,
    ];
  }

  return [() => <ComponentNotFound />, false];
};

export const getElementsBelowRow = (elements: WebBuilderElements, row: number): WebBuilderElements => elements.filter((element) => element.y > row);

export const getElementsAboveRow = (elements: WebBuilderElements, row: number): WebBuilderElements => elements.filter((element) => element.y < row);

export const getFirstElementBelowRow = (elements: WebBuilderElements, row: number): WebBuilderElement | null => {
  const elementsBelow = getElementsBelowRow(elements, row);
  if (!elementsBelow.length) return null;
  const sortedElementsBelow = elementsBelow.sort((a, b) => a.y - b.y);
  return sortedElementsBelow[0];
};

export const groupElementsById = (elements: WebBuilderElements): Record<string, WebBuilderElement> => {
  const map: Record<string, WebBuilderElement> = {};
  elements.forEach((element) => {
    map[element.id] = element;
  });
  return map;
};

export const hasAnyElementAtRowPosition = (
  elements: WebBuilderElements,
  row: number,
  measureElementHeight: (elementId: string | number) => number | null,
) => {
  const map = new Map<number, boolean>();
  elements.forEach((element) => {
    const height = measureElementHeight(element.id) || 1;
    for (let { y } = element; y < element.y + height; y++) {
      map.set(y, true);
    }
  });

  return map.has(row);
};

export const withAutoFocus = (): (prop: WebBuilderComponentProperty) => [WebBuilderComponentProperty, { autoFocus: boolean }] => {
  let hasSetAutoFocus = false;

  const map = (prop: WebBuilderComponentProperty): [WebBuilderComponentProperty, { autoFocus: boolean }] => {
    const autoFocus = !hasSetAutoFocus && prop.type === 'richtext';
    if (autoFocus) {
      hasSetAutoFocus = true;
    }

    return [
      prop,
      { autoFocus },
    ];
  };

  return map;
};

export const getElementFromList = (selectedElementId: string | number, elements: WebBuilderElements) => {
  if (!selectedElementId) return null;

  const selectedElement = elements.find((element) => element.id === selectedElementId);
  return selectedElement;
};

export const getElementContainerIdProp = (props: WebBuilderElementProperty[]): WebBuilderElementProperty => {
  const containerIdProp = props.find((prop) => prop.propId === 'containerId');
  return containerIdProp;
};

export const sortElements = (elements: WebBuilderElements) => [...elements].sort((a, b) => {
  if (a.y === b.y) return a.x - b.x;
  return a.y - b.y;
});
