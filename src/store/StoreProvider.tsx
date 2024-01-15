import React, { useRef } from 'react';
import { Provider } from 'react-redux';

import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import getInitialStateFromPage from '@/utils/getInitialStateFromPage';
import { createStore, Store } from './store';

export function StoreProvider({ children }: React.PropsWithChildren) {
  const { page } = useWebBuilderProperties();
  const storeRef = useRef<Store>();
  if (!storeRef.current) {
    storeRef.current = createStore(getInitialStateFromPage(page));
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}
