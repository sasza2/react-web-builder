import { PageSettings } from 'types';
import { useAppSelector } from '@/store/useAppSelector';

export const usePageSettings = (): PageSettings => {
  const pageSettings = useAppSelector((state) => state.pageSettings);
  return pageSettings;
};
