import { useEffect } from 'react';

import { useRemoveElement } from './useRemoveElement';
import { useSelectedElementId } from './useSelectedElementId';

export const useDeleteElementOnKey = () => {
  const [selectedElementId] = useSelectedElementId();
  const removeElement = useRemoveElement();

  useEffect(() => {
    if (!selectedElementId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!document.activeElement || document.body !== document.activeElement) return;
      if (e.code === 'Delete') removeElement(selectedElementId);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedElementId]);
};
