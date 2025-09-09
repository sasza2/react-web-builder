import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { HelperArrowItem } from 'types';

import { useWebBuilderProperties } from '../PropertiesProvider';

export const useBuilderHintsList = (): HelperArrowItem[] => {
  const { t } = useTranslation();
  const { builderHints } = useWebBuilderProperties();

  const list = useMemo<HelperArrowItem[]>(() => [
    {
      selector: '[data-id="accordionItemButton"]',
      title: t('hints.addNewElement'),
    },
    {
      selector: '[data-id="breakpointsSelect"]',
      title: t('hints.changeBreakpoint'),
    },
    {
      selector: '[data-icon-id="configuration"]',
      title: t('hints.configuration'),
    },
    {
      selector: '[data-icon-id="preview"]',
      title: t('hints.preview'),
    },
    {
      selector: '[data-button-id="publishButton"]',
      title: t('hints.saveOrPublish'),
    },
    ...(builderHints || []),
  ], [t, builderHints]);

  return list;
};
