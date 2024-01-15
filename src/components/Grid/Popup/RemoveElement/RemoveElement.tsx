import React from 'react';
import { useTranslation } from 'react-i18next';

import { PopupItem } from '@/components/Navbar/PublishButton/PublishButton.styled';
import { useRemoveElement } from '@/hooks/useRemoveElement';

type RemoveElementProps = {
  elementId: string | number,
  onClose: () => void,
};

export function RemoveElement({ elementId, onClose }: RemoveElementProps) {
  const { t } = useTranslation();
  const removeElement = useRemoveElement();

  const onRemoveElement = () => {
    removeElement(elementId);
    onClose();
  };

  return (
    <PopupItem onClick={onRemoveElement}>
      {t('element.delete')}
    </PopupItem>
  );
}
