import { setSelectedElement } from '@/store/selectedElementSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useAppSelector } from '@/store/useAppSelector';

export const useSelectedElementId = (): [string | null, (elementId: string | null) => void] => {
  const dispatch = useAppDispatch();
  const selectedElementId = useAppSelector((state) => state.selectedElement);

  const setSelectedElementId = (nextSelectedElement: string | null) => {
    dispatch(setSelectedElement({ elementId: nextSelectedElement }));
  };

  return [selectedElementId, setSelectedElementId];
};
