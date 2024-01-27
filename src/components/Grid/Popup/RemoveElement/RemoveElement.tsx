import React from 'react';
import { useTranslation } from 'react-i18next';

import { PopupItem } from '@/components/Navbar/PublishButton/PublishButton.styled';
import { useRemoveElement } from '@/hooks/useRemoveElement';
import useRemoveSelectedElements from '@/hooks/useRemoveSelectedElements';
import { useSelectedElements } from '@/hooks/useSelectedElements';

type RemoveElementProps = {
  elementId: string | number,
  onClose: () => void,
};

export function RemoveElement({ elementId, onClose }: RemoveElementProps) {
  const { t } = useTranslation();
  const removeElement = useRemoveElement();
  const removeSelectedElements = useRemoveSelectedElements();
  const { selectedElements } = useSelectedElements();
  const isSelected = selectedElements.includes(elementId);

  const onRemoveElement = () => {
    if (isSelected) {
      removeSelectedElements();
    } else {
      removeElement(elementId);
    }
    onClose();
  };

  const label = isSelected && selectedElements.length > 1
    ? t('element.deleteSelected')
    : t('element.delete');

  return (
    <PopupItem onClick={onRemoveElement}>
      {label}
    </PopupItem>
  );
}
