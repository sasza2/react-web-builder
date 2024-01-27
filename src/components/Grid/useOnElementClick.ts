import { GridProps } from 'react-grid-panzoom';

import { useSelectedElementId } from '@/hooks/useSelectedElementId';
import { useSelectedElements } from '@/hooks/useSelectedElements';
import { useConfiguration } from '../ConfigurationProvider';
import { useIsDoubleClickOnElement } from './useIsDoubleClickOnElement';

const useOnElementClick = () => {
  const [selectedElementId, setSelectedElementId] = useSelectedElementId();
  const isDoubleClickOnElement = useIsDoubleClickOnElement();
  const configuration = useConfiguration();
  const { selectedElements, setSelectedElements, toggleSelectedElement } = useSelectedElements();

  const onElementClick: GridProps['onElementClick'] = ({ id }, { e, stop }) => {
    if (!id) return;

    if (e.shiftKey) {
      toggleSelectedElement(id);
      stop();
      return;
    }

    if (!selectedElements.includes(id)) {
      setSelectedElements([]);
    }

    if (selectedElementId === id) return;

    if (configuration.editOnDoubleClick && !isDoubleClickOnElement(id)) return;

    setSelectedElementId(id as string);
  };

  return onElementClick;
};

export default useOnElementClick;
