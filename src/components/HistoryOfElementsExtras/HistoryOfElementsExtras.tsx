import { useEffect, useRef } from 'react';
import type { BreakpointsExtras } from 'types';

import { useElements } from '@/hooks/useElements';
import { useAppSelector } from '@/store/useAppSelector';
import { cloneDeep } from '@/utils/clone';

export function HistoryOfElementsExtras(): JSX.Element {
  const historyMap = useRef<Map<string, BreakpointsExtras>>(new Map());
  const changes = useAppSelector((state) => state.changes);
  const key = changes.history?.[changes.index - 1]?.key;
  const { elementsExtras } = useElements();

  useEffect(() => {
    if (!key) return;

    if (historyMap.current.get(key)) {
      elementsExtras.current = historyMap.current.get(key);
    } else {
      historyMap.current.set(key, cloneDeep(elementsExtras.current));
    }
  }, [key]);

  return null;
}
