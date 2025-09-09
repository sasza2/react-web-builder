import { useMemo } from 'react';
import type { Breakpoint } from 'types';

import { byBreakpointId } from '@/utils/breakpoint';

import { useContainerElementPropertiesByValue } from './container/useContainerElementPropertiesByValue';
import { useBreakpoint } from './useBreakpoint';
import { useBreakpoints } from './useBreakpoints';
import { useFontImport } from './useFontImport';
import { usePageSettings } from './usePageSettings';

export const useFontImportInGrid = () => {
  const pageSettings = usePageSettings();
  const container = useBreakpoint();
  const breakpoints = useBreakpoints();
  const getProperties = useContainerElementPropertiesByValue();

  const fontFamily = useMemo<string | null>(() => {
    const getPropertiesRecursive = (current: Breakpoint): string | null => {
      if (!current.parentId) return pageSettings.fontFamily;

      const properties = getProperties(current);
      if (properties.fontFamily) return properties.fontFamily as string;

      const parent = breakpoints.find(byBreakpointId(current.parentId));
      if (!parent) return null;

      return getPropertiesRecursive(parent);
    };

    return getPropertiesRecursive(container);
  }, [pageSettings.fontFamily, container, breakpoints, getProperties]);

  const fontImport = useFontImport(fontFamily);

  return fontImport;
};
