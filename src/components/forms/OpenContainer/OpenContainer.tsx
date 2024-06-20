import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { WebBuilderElement, WebBuilderElements } from 'types';
import { useSelectedElementId } from '@/hooks/useSelectedElementId';
import { useElements } from '@/hooks/useElements';
import { assignTestProp } from '@/utils/tests';
import { setSelectedElement } from '@/store/selectedElementSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { getElementContainerIdProp, getElementFromList } from '@/utils/element';
import { Description, FormGroup, FormHeader } from '../FormControl.styled';
import { LinkButton } from '../../Button';

type OpenContainerProps = {
  id: string,
  testId?: string,
};

export function OpenContainer({ testId }: OpenContainerProps) {
  const { t } = useTranslation();
  const [selectedElementId] = useSelectedElementId();
  const { elements } = useElements();
  const elementsRef = useRef<WebBuilderElements>(elements);
  elementsRef.current = elements;
  const elementCurrent = getElementFromList(selectedElementId, elementsRef.current);
  const dispatch = useAppDispatch();

  const onOpen = () => {
    const getContainerIdValue = (element: WebBuilderElement): string | null => {
      const containerId = getElementContainerIdProp(element.props);
      if (containerId && containerId.value) return containerId.value as string;
      return null;
    };

    const containerId = getContainerIdValue(elementCurrent);
    if (containerId) {
      dispatch(setSelectedElement({ elementId: null, breakpointId: containerId }));
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
