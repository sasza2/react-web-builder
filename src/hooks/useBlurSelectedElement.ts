import { useEffect, useRef } from 'react';

import { useConfiguration } from '@/components/ConfigurationProvider';
import { useGridAPI } from '@/components/GridAPIProvider';

import { useSelectedElementId } from './useSelectedElementId';

export const useBlurSelectedElement = () => {
  const gridAPIRef = useGridAPI();
  const [selectedElementId, setSelectedElementId] = useSelectedElementId();
  const isLastClickedIsInputRef = useRef<boolean>();
  const configuration = useConfiguration();

  useEffect(() => {
    if (configuration.preventCloseEditOnClick || !selectedElementId) return;

    const onClick = (e: MouseEvent) => {
      if (!e.target || !gridAPIRef.current) return;

      const isLastClickedIsInput = (e.target as HTMLElement).tagName === 'INPUT';

      if (isLastClickedIsInputRef.current) {
        isLastClickedIsInputRef.current = isLastClickedIsInput;
        return;
      }

      isLastClickedIsInputRef.current = isLastClickedIsInput;

      const panZoom = gridAPIRef.current.getPanZoom();
      const parentNode = panZoom.childNode.parentNode as HTMLDivElement;
      const target = e.target as HTMLDivElement;

      if (!parentNode.contains(target)) return;

      const elementWrapper = document.querySelector(`.react-panzoom-element--id-${selectedElementId}`);
      if (!elementWrapper) {
        setSelectedElementId(null);
        return;
      }

      if (elementWrapper === target || elementWrapper.contains(target)) return;

      setSelectedElementId(null);
    };

    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [configuration.preventCloseEditOnClick, selectedElementId]);
};
