import React, {
  memo, useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmButton } from '@/components/Button';
import { Icon } from '@/components/icons/Icon';
import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { usePagePublish } from '@/hooks/usePagePublish';
import { usePageSaveAsDraft } from '@/hooks/usePageSaveAsDraft';
import { assignTestProp } from '@/utils/tests';

import {
  AbsoluteContainer, Popup, PopupItem, Wrapper,
} from './PublishButton.styled';

export function PublishButtonIn() {
  const { t } = useTranslation();
  const { onExit } = useWebBuilderProperties();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pagePublish = usePagePublish();
  const pageSaveAsDraft = usePageSaveAsDraft();

  useEffect(() => {
    if (!isOpen) return;

    const onClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    };

    window.addEventListener('pointerdown', onClose);

    return () => {
      window.removeEventListener('pointerdown', onClose);
    };
  }, [isOpen]);

  const onShow = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  return (
    <Wrapper>
      <ConfirmButton
        id="publishButton"
        tooltip={isOpen ? undefined : t('publish.tooltip')}
        onClick={onShow}
        testId="publishButton"
      >
        {t('publish.name')}
        <Icon icon={Icon.ArrowLeft} />
      </ConfirmButton>
      <AbsoluteContainer $isOpen={isOpen}>
        <Popup $isOpen={isOpen} $isClosing={isClosing}>
          <PopupItem
            onClick={pagePublish}
            {...assignTestProp('saveAndPublish')}
          >
            {t('publish.save.label')}
          </PopupItem>
          { pageSaveAsDraft && (
            <PopupItem
              onClick={pageSaveAsDraft}
              {...assignTestProp('saveAsDraft')}
            >
              {t('publish.draft.label')}
            </PopupItem>
          ) }
          { onExit && (
            <PopupItem onClick={onExit}>
              {t('publish.exit')}
            </PopupItem>
          ) }
        </Popup>
      </AbsoluteContainer>
    </Wrapper>
  );
}

export const PublishButton = memo(PublishButtonIn);
