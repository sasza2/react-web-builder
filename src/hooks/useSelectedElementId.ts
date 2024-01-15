import { setSelectedElement } from '@/store/selectedElementSlice';
import { useAppSelector } from '@/store/useAppSelector';
import { useAppDispatch } from '@/store/useAppDispatch';

export const useSelectedElementId = (): [string | null, (elementId: string | null) => void] => {
  const dispatch = useAppDispatch();
  const selectedElementId = useAppSelector((state) => state.selectedElement);

  const setSelectedElementId = (nextSelectedElement: string | null) => {
    dispatch(setSelectedElement({ elementId: nextSelectedElement }));
  };

  return [selectedElementId, setSelectedElementId];
};
