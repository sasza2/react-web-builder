import { useMemo } from 'react';

import { useWebBuilderSize } from '@/components/WebBuilderSize';
import { NAVBAR_HEIGHT } from '@/consts';

export const useGridPositionTop = () => {
  const webBuilderSize = useWebBuilderSize();

  const top = useMemo(() => {
    if (typeof window === 'undefined') return 0;

    return window.innerHeight - webBuilderSize.height + NAVBAR_HEIGHT;
  }, [webBuilderSize.height]);

  return top;
};
