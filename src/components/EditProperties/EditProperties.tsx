import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  WebBuilderElement, WebBuilderElements, WebBuilderComponent, WebBuilderElementProperty,
} from 'types';
import { useElements } from '@/hooks/useElements';
import { useRemoveElement } from '@/hooks/useRemoveElement';
import { useSelectedElementId } from '@/hooks/useSelectedElementId';
import { useSetElements } from '@/hooks/useSetElements';
import { RemoveButton } from '@/components/Button';
import { useElementsCache } from '@/hooks/useElementsCache';
import { useAppSelector } from '@/store/useAppSelector';
import { getDefaultValue, withAutoFocus } from '@/utils/element';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useTimeout } from '@/hooks/useTimeout';
import { assignTestProp } from '@/utils/tests';
import { useGridAPI } from '../GridAPIProvider/GridAPIProvider';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarScrollbar } from '../SidebarScrollbar';
import { Actions } from './EditProperties.styled';
import { FormProvider, useFormCreator } from '../FormProvider/FormProvider';
import { FormContainerDiv } from '../forms/FormContainerDiv';
import { FormProperty } from '../FormProperty';

type EditPropertiesProps = {
  components: Array<WebBuilderComponent>,
};

const getElement = (selectedElementId: string, elements: WebBuilderElements) => {
  if (!selectedElementId) return null;

  const selectedElement = elements.find((element) => element.id === selectedElementId);
  return selectedElement;
};

const getComponent = (element: WebBuilderElement, components: WebBuilderComponent[]) => {
  if (!element) return null;
  return components.find((component) => component.id === element.componentName);
};

export function EditPropertiesIn({
  components,
}: EditPropertiesProps) {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const gridAPIRef = useGridAPI();
  const removeElement = useRemoveElement();
  const { elements } = useElements();
  const setElements = useSetElements();
  const elementsRef = useRef<WebBuilderElements>(elements);
  elementsRef.current = elements;
  const [selectedElementId, setSelectedElementId] = useSelectedElementId();
  const cache = useElementsCache();
  const undoKey = useAppSelector((state) => state.changes.undoKey);
  const updateElementsTimeout = useTimeout();
  const organizerElementsTimeout = useTimeout();

  const formCreator = useFormCreator(() => {
    const element = getElement(selectedElementId, elements);
    const component = getComponent(element, components);
    const values: Record<string, unknown> = {};

    if (!element || !component) return values;
    component.props.forEach((prop) => {
      const elementProp = element.props.find((p) => p.propId === prop.id);
      if (elementProp) values[elementProp.propId] = elementProp.value;
      else values[prop.id] = getDefaultValue(prop, breakpoint) || '';
    });

    return values;
  }, [undoKey]);

  const element = useMemo(
    () => getElement(selectedElementId, elements),
    [elements, selectedElementId],
  );

  const component = useMemo(() => getComponent(element, components), [components, element]);

  const onChange = () => {
    updateElementsTimeout(() => {
      const form = formCreator.getFormValues();
      const elementCurrent = getElement(selectedElementId, elementsRef.current);

      setElements(elementsRef.current.map((currentElement) => {
        if (currentElement.id === elementCurrent.id) {
          const componentOfElement = getComponent(elementCurrent, components);
          const propsGroup: Record<string, unknown> = {};
          elementCurrent.props.forEach((prop) => {
            propsGroup[prop.propId] = form[prop.propId];
          });
          componentOfElement.props.forEach((prop) => {
            propsGroup[prop.id] = form[prop.id];
          });

          const props: Array<WebBuilderElementProperty> = Object.entries(propsGroup).map(([propId, value]) => ({
            propId,
            value,
          }));

          cache.remove(elementCurrent.id);

          return {
            ...elementCurrent,
            props,
          };
        }

        return currentElement;
      }));
    }, 250);

    organizerElementsTimeout(
      () => gridAPIRef.current.organizeElements(),
      400,
    );
  };

  const onRemoveElement = () => {
    removeElement(element.id);
  };

  const onBack = () => {
    setSelectedElementId(null);
  };

  const renderComponents = () => {
    const formValues = formCreator.getFormValues();

    return component.props
      .filter((prop) => {
        if (typeof prop.visibility === 'function') {
          if (!prop.visibility({
            breakpoint,
            element,
            formValues,
            prop,
          })) return false;
        }

        return true;
      })
      .map(withAutoFocus())
      .map(([prop, { autoFocus }]) => {
        const elementProp = element.props.find((p) => p.propId === prop.id) || {
          propId: prop.id,
          value: getDefaultValue(prop, breakpoint),
        };

        return (
          <FormProperty
            key={prop.id}
            autoFocus={autoFocus}
            defaultValue={getDefaultValue(prop, breakpoint) as string}
            formCreatorId={formCreator.id}
            prop={prop}
            name={elementProp.propId}
          />
        );
      });
  };

  return (
    <>
      <SidebarHeader onBack={onBack}>
        {component?.label || component?.id || t('element.notFound')}
      </SidebarHeader>
      <SidebarScrollbar>
        <FormContainerDiv {...assignTestProp('properties')}>
          <FormProvider {...formCreator} onChange={onChange}>
            {component && renderComponents()}
          </FormProvider>
          <Actions>
            <RemoveButton onClick={onRemoveElement}>
              {t('element.delete')}
            </RemoveButton>
          </Actions>
        </FormContainerDiv>
      </SidebarScrollbar>
    </>
  );
}

export function EditProperties({
  components,
}: EditPropertiesProps) {
  const [selectedElementId] = useSelectedElementId();
  return <EditPropertiesIn key={selectedElementId} components={components} />;
}
