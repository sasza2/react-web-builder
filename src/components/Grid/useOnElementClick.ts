import { useSelectedElementId } from '@/hooks/useSelectedElementId';
import { useSelectedElements } from '@/hooks/useSelectedElements';
import { useConfiguration } from '../ConfigurationProvider';
import { useIsDoubleClickOnElement } from './useIsDoubleClickOnElement';

const useOnElementClick = () => {
  const [selectedElementId, setSelectedElementId] = useSelectedElementId();
  const isDoubleClickOnElement = useIsDoubleClickOnElement();
  const configuration = useConfiguration();
  const { selectedElements, setSelectedElements } = useSelectedElements();

  const onElementClick = ({ id }: { id?: string | number }) => {
    if (!id) return;

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
