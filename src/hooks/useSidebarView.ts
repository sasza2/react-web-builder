import { useAppSelector } from '@/store/useAppSelector';

export const useSidebar = () => {
  const sidebar = useAppSelector((state) => state.sidebar);
  return sidebar;
};
