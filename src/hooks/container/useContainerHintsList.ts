import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HelperArrowItem } from 'types';

export const useContainerHintsList = (): HelperArrowItem[] => {
  const { t } = useTranslation();

  const hints = useMemo<HelperArrowItem[]>(() => [
    {
      selector: '[data-id="openContainer"]',
      title: t('container.hints.openContainer'),
    },
    {
      selector: '[data-id="breakpointHeight"]',
      title: t('common:container.hints.breakpointHeight'),
    },
  ], [t]);

  return hints;
};
