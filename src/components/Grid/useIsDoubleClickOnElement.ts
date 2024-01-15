import { useRef } from 'react';

import { DOUBLE_CLICK_TIMEOUT } from '@/consts';

export const useIsDoubleClickOnElement = () => {
  const lastSelectedElementId = useRef<string | number>();
  const lastClickTime = useRef<number>(0);

  const isDoubleClick = (id: string | number): boolean => {
    const currentTime = new Date().getTime();

    if (lastSelectedElementId.current !== id) {
      lastSelectedElementId.current = id;
      lastClickTime.current = currentTime;
      return false;
    }

    if (currentTime - lastClickTime.current > DOUBLE_CLICK_TIMEOUT) {
      lastClickTime.current = currentTime;
      return false;
    }

    return true;
  };

  return isDoubleClick;
};
