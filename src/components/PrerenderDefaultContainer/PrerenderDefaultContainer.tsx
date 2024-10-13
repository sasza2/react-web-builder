import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Breakpoint, Tree } from 'types';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { createTreeForContainer, getDefaultContainer } from '@/utils/container';
import { usePageSettings } from '@/hooks/usePageSettings';
import { useFontImport } from '@/hooks/useFontImport';
import { RenderBreakpoint } from '../View/RenderBreakpoint';
import { Hidden } from './PrerenderDefaultContainer.styled';
import { RenderTree } from '../View/RenderTree';
import { useComponentsProperty } from '../ComponentsProvider';
import { useWebBuilderProperties } from '../PropertiesProvider';

export function PrerenderDefaultContainer() {
  const breakpoint = useBreakpoint();
  const components = useComponentsProperty();
  const { transformElementProperty } = useWebBuilderProperties();
  const { t } = useTranslation();
  const pageSettings = usePageSettings();
  const fontImport = useFontImport(pageSettings.fontFamily);

  const defaultContainer = useMemo<Breakpoint | null>(
    () => {
      if (!breakpoint) return null;

      return getDefaultContainer(breakpoint);
    },
    [breakpoint],
  );

  const tree = useMemo<Tree | null>(() => {
    if (defaultContainer) return createTreeForContainer(defaultContainer.cols, t);
    return null;
  }, [defaultContainer, t]);

  if (!tree) return null;
  return (
    <Hidden $fontImport={fontImport}>
      <RenderBreakpoint
        breakpoint={defaultContainer}
        hasMinWidth={false}
      >
        <RenderTree
          breakpoint={defaultContainer}
          components={components}
          node={tree}
          transformElementProperty={transformElementProperty}
        />
      </RenderBreakpoint>
    </Hidden>
  );
}
