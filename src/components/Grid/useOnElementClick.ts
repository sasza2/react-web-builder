import { GridProps } from 'react-grid-panzoom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useSelectedElementId } from '@/hooks/useSelectedElementId';
import { useSelectedElements } from '@/hooks/useSelectedElements';
import { useElements } from '@/hooks/useElements';
import { useConfiguration } from '../ConfigurationProvider';
import { useIsDoubleClickOnElement } from './useIsDoubleClickOnElement';

const useOnElementClick = () => {
  const { t } = useTranslation();
  const { elements } = useElements();
  const [selectedElementId, setSelectedElementId] = useSelectedElementId();
  const isDoubleClickOnElement = useIsDoubleClickOnElement();
  const configuration = useConfiguration();
  const { selectedElements, setSelectedElements, toggleSelectedElement } = useSelectedElements();

  const onElementClick: GridProps['onElementClick'] = ({ id }, { e, stop }) => {
    if (!id) return;

    const element = elements.find((item) => item.id === id);
    if (element && element.disabledMove) {
      toast.info(t('element.lockInfo'));
    }

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
