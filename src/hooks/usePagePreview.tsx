import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { useBuildPageWithTree } from './useBuildPageWithTree';

export const usePagePreview = () => {
  const { onPagePreview } = useWebBuilderProperties();
  const build = useBuildPageWithTree();

  const view = async () => {
    if (onPagePreview) {
      await onPagePreview(build());
    }
  };

  return view;
};
