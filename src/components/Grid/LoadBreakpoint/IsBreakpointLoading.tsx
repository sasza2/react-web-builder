import { createContext, useContext } from 'react';

export const IsBreakpointLoading = createContext(false);

export const useIsBreakpointLoading = () => {
  const isLoading = useContext(IsBreakpointLoading);
  return isLoading;
};
