import { useCallback } from 'react';
import { Page } from 'types';

export const useValidatePage = () => {
  const validate = useCallback((page: Page) => {
    if (!page || typeof page !== 'object') return false;

    if (!Array.isArray(page.breakpoints)) return false;

    return true;
  }, []);

  return validate;
};
