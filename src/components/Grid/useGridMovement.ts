import { useEffect, useState } from 'react';

import { useConfiguration } from '@/components/ConfigurationProvider';

const isControlKey = (e: KeyboardEvent) => e.code === 'ControlLeft';

const useGridMovement = () => {
  const { panZoomScroll } = useConfiguration();
  const [shiftActive, setShiftActive] = useState(false);
  const [ctrlActive, setCtrlActive] = useState(false);
  const [metaKeyActive, setMetaKeyActive] = useState(false);
  const ctrlOrMetaKeyActive = ctrlActive || metaKeyActive;

  useEffect(() => {
    if (!panZoomScroll) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft') setShiftActive(true);
      else if (isControlKey(e)) setCtrlActive(true);
      setMetaKeyActive(e.metaKey);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft') setShiftActive(false);
      else if (isControlKey(e)) setCtrlActive(false);
      setMetaKeyActive(e.metaKey);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [panZoomScroll]);

  if (!panZoomScroll) {
    return {
      disabledZoom: false,
      disabledMove: false,
      disabledScrollVertical: true,
      disabledScrollHorizontal: true,
    };
  }

  return {
    disabledZoom: !ctrlOrMetaKeyActive,
    disabledMove: true,
    disabledScrollVertical: ctrlOrMetaKeyActive || shiftActive,
    disabledScrollHorizontal: ctrlOrMetaKeyActive || !shiftActive,
  };
};

export default useGridMovement;
