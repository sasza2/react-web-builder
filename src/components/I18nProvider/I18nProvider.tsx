import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';

import { useInitI18n } from '@/hooks/useInitI18n';

export function I18nProvider({ children }: React.PropsWithChildren) {
  const i18n = useInitI18n();
  return (
    <Suspense>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </Suspense>
  );
}
