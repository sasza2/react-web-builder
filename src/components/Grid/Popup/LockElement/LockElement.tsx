import React from 'react';
import { useTranslation } from 'react-i18next';

import { PopupItem } from '@/components/Navbar/PublishButton/PublishButton.styled';
import { useElements } from '@/hooks/useElements';
import { useAppDispatch } from '@/store/useAppDispatch';
import { changeElementInBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { WebBuilderElement } from 'types';

type LockElementProps = {
  elementId: string | number,
  onClose: () => void,
};

export function LockElement({ elementId, onClose }: LockElementProps) {
  const { t } = useTranslation();
  const { elements } = useElements();
  const breakpoint = useBreakpoint();
  const element = elements.find((item) => item.id === elementId);
  const dispatch = useAppDispatch();

  const onClick = () => {
    const nextElement: Partial<WebBuilderElement> = {
      id: elementId as string,
      disabledMove: !element.disabledMove,
    };
    dispatch(changeElementInBreakpoint({ breakpointId: breakpoint.id, element: nextElement }));
    onClose();
  };

  return (
    <PopupItem onClick={onClick}>
      {element.disabledMove ? t('element.unlock') : t('element.lock')}
    </PopupItem>
  );
}
