import React from 'react';
import { useTranslation } from 'react-i18next';

import { PopupItem } from '@/components/Navbar/PublishButton/PublishButton.styled';
import { useCopyElements } from '@/hooks/useCopyElements';

type CopyElementProps = {
  elementId: string | number,
  onClose: () => void,
};

export function CopyElement({ elementId, onClose }: CopyElementProps) {
  const { t } = useTranslation();
  const { copyElement } = useCopyElements();

  const onCopyElement = () => {
    copyElement(elementId);
    onClose();
  };

  return (
    <PopupItem onClick={onCopyElement}>
      {t('element.copy')}
    </PopupItem>
  );
}
