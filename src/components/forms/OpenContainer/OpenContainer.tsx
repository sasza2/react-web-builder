import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { WebBuilderElement, WebBuilderElements } from 'types';
import { useSelectedElementId } from '@/hooks/useSelectedElementId';
import { useElements } from '@/hooks/useElements';
import { assignTestProp } from '@/utils/tests';
import { useAppDispatch } from '@/store/useAppDispatch';
import { getElementContainerIdProp, getElementFromList } from '@/utils/element';
import { openContainer } from '@/store/elementsInBreakpointsSlice';
import createTreeElements from '@/components/View/createTreeElements';
import { useAppSelector } from '@/store/useAppSelector';
import getBreakpointRowsByLastElement from '@/components/View/getBreakpointRowsByLastElement';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { byBreakpointId } from '@/utils/breakpoint';
import { calculatePositionsOfElements } from '@/utils/templates';
import { useGridAPI } from '@/components/GridAPIProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { getContainerExtras } from '@/utils/container';
import { LinkButton } from '../../Button';
import { Description, FormGroup, FormHeader } from '../FormControl.styled';

const getContainerIdValue = (element: WebBuilderElement): string | null => {
  const containerId = getElementContainerIdProp(element.props);
  if (containerId && containerId.value) return containerId.value as string;
  return null;
};

type OpenContainerProps = {
  id: string,
  testId?: string,
};

export function OpenContainer({ id, testId }: OpenContainerProps) {
  const { t } = useTranslation();
  const [selectedElementId] = useSelectedElementId();
  const { elements } = useElements();
  const elementsRef = useRef<WebBuilderElements>(elements);
  elementsRef.current = elements;
  const elementCurrent = getElementFromList(selectedElementId, elementsRef.current);
  const dispatch = useAppDispatch();
  const { elementsExtras } = useElements();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const breakpoints = useBreakpoints();
  const breakpoint = useBreakpoint();
  const gridAPIRef = useGridAPI();
  const containerId = getContainerIdValue(elementCurrent);

  const onOpen = () => {
    if (containerId) {
      delete elementsExtras.current[breakpoint.id][id];

      const container = breakpoints.find(byBreakpointId(containerId));
      const containerExtras = getContainerExtras(container, gridAPIRef);

      const tree = createTreeElements(
        elementsInBreakpoints[container.id],
        elementsExtras.current[container.id] || {},
        container.cols,
        getBreakpointRowsByLastElement(elementsInBreakpoints[container.id], elementsExtras.current[container.id] || {}),
      );

      const nextElements = calculatePositionsOfElements(
        tree,
        (elementId) => containerExtras[elementId].height,
      );

      dispatch(openContainer({
        breakpointId: containerId,
        elements: nextElements,
      }));

      elementsExtras.current[containerId] = containerExtras;
    }
  };

  return (
    <FormGroup {...assignTestProp(testId, null, 'openContainer')}>
      <FormHeader>
        {t('container.content')}
      </FormHeader>
      <Description>{t('container.description')}</Description>
      <LinkButton onClick={onOpen}>
        {t('container.button')}
      </LinkButton>
    </FormGroup>
  );
}
