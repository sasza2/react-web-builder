import { WebBuilderNavbarIcon } from 'types';
import { useBuildPageWithTree } from './useBuildPageWithTree';

export const useOnNavbarIconClick = () => {
  const build = useBuildPageWithTree();

  const onClick = (navbarIcon: WebBuilderNavbarIcon) => {
    if (typeof navbarIcon.onClick === 'function') navbarIcon.onClick({ page: build() });
  };

  return onClick;
};
