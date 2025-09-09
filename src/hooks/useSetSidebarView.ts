import type { SidebarView } from '@/components/SidebarProvider';
import { setViewAnimation } from '@/store/sidebarSlice';
import { useAppDispatch } from '@/store/useAppDispatch';

export const useSetSidebarView = () => {
  const dispatch = useAppDispatch();

  const set = (view: SidebarView | null) => {
    dispatch(setViewAnimation(view));
  };

  return set;
};
