import React from 'react';
import { useTranslation } from 'react-i18next';

import { PopupItem } from '@/components/Navbar/PublishButton/PublishButton.styled';
import { useCopyElements } from '@/hooks/useCopyElements';

type CopyElementProps = {
  onClose: () => void,
};

export function CopyAllElements({ onClose }: CopyElementProps) {
  const { t } = useTranslation();
  const { copyAllElements } = useCopyElements();

  const onCopyAllElements = () => {
    copyAllElements();
    onClose();
  };

  return (
    <PopupItem onClick={onCopyAllElements}>
      {t('element.copyAll')}
    </PopupItem>
  );
}
