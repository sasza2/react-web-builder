import React from 'react';
import { useTranslation } from 'react-i18next';

import { PopupItem } from '@/components/Navbar/PublishButton/PublishButton.styled';
import { useSelectedElements } from '@/hooks/useSelectedElements';

type SelectElementProps = {
  elementId: string | number,
  onClose: () => void,
};

export function SelectElement({ elementId, onClose }: SelectElementProps) {
  const { t } = useTranslation();
  const { selectedElements, setSelectedElements } = useSelectedElements();
  const selected = selectedElements.includes(elementId);

  const onClick = () => {
    setSelectedElements((currentSelectedElements) => {
      if (selected) {
        return currentSelectedElements.filter((id) => id !== elementId);
      }
      return [...currentSelectedElements, elementId];
    });

    onClose();
  };

  return (
    <PopupItem onClick={onClick}>
      {selected ? t('element.deselect') : t('element.select')}
    </PopupItem>
  );
}
