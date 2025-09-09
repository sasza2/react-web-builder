import React, {
  createContext, type PropsWithChildren, useContext, useRef,
} from 'react';
import type { GridAPI } from 'react-grid-panzoom';

const GridAPIContext = createContext<React.MutableRefObject<GridAPI>>(null);

export const useGridAPI = (): React.MutableRefObject<GridAPI> => {
  const gridAPI = useContext(GridAPIContext);
  return gridAPI;
};

export function GridAPIProvider({ children }: PropsWithChildren) {
  const gridAPI = useRef<GridAPI>();

  return (
    <GridAPIContext.Provider value={gridAPI}>
      {children}
    </GridAPIContext.Provider>
  );
}
