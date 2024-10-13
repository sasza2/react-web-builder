import React, { useCallback, useState } from 'react';
import { HelperArrowItem } from 'types';

import { useIsMounted } from '@/hooks/useIsMounted';

import { HelperArrow } from './HelperArrow';

type HintsProps = {
  list: HelperArrowItem[],
  speed?: number,
};

export function Hints({
  list,
  speed = 700,
}: HintsProps) {
  const [helperIndex, setHelperIndex] = useState(() => {
    const firstItemIndex = list.findIndex(
      (item) => !localStorage.getItem(`hint-${item.selector}`),
    );
    return firstItemIndex;
  });
  const isMounted = useIsMounted();

  const onClose = useCallback(() => {
    if (helperIndex < 0) return;
    if (helperIndex >= list.length) return;

    const show = () => {
      if (!isMounted.current) return;

      setHelperIndex((currentHelperIndex) => {
        const nextItemIndex = list.findIndex(
          (item, index) => index > currentHelperIndex
            && !localStorage.getItem(`hint-${item.selector}`),
        );
        return nextItemIndex;
      });
    };

    if (speed) setTimeout(show, speed);
    else show();
  }, [helperIndex]);

  if (helperIndex < 0) return null;

  const item = list[helperIndex];

  if (!item) return null;
  return (
    <HelperArrow
      key={helperIndex}
      selector={item.selector}
      title={item.title}
      onClose={onClose}
    />
  );
}
