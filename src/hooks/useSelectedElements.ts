import { ElementsContext } from '@/components/ElementsProvider';
import { useContext } from 'react';

type UseSelectedElements = () => {
  selectedElements: Array<string | number>,
  setSelectedElements: React.Dispatch<React.SetStateAction<Array<string | number>>>,
};

export const useSelectedElements: UseSelectedElements = () => {
  const { selectedElements, setSelectedElements } = useContext(ElementsContext);
  return {
    selectedElements,
    setSelectedElements,
  };
};
