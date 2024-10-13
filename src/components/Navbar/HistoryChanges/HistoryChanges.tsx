import React from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonIcon } from '@/components/ButtonIcon';
import { Icon } from '@/components/icons/Icon';
import { redoChanges, undoChanges } from '@/store/changesSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useAppSelector } from '@/store/useAppSelector';

import { Container } from './HistoryChanged.styled';

export function HistoryChanges() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const changes = useAppSelector((state) => state.changes);
  const isUndoDisabled = !changes.index;
  const isRedoDisabled = changes.index === changes.history.length;

  const onUndo = () => {
    dispatch(undoChanges());
  };

  const onRedo = () => {
    dispatch(redoChanges());
  };

  return (
    <Container>
      <ButtonIcon
        disabled={isUndoDisabled}
        onClick={isUndoDisabled ? undefined : onUndo}
        testId="historyUndo"
        tooltip={t('history.undo')}
      >
        <Icon icon={Icon.Undo} />
      </ButtonIcon>
      <ButtonIcon
        disabled={isRedoDisabled}
        onClick={isRedoDisabled ? undefined : onRedo}
        testId="historyRedo"
        tooltip={t('history.redo')}
      >
        <Icon icon={Icon.Redo} />
      </ButtonIcon>
    </Container>
  );
}
