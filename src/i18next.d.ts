import 'i18next';

import ns1 from './locales/en';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common',
    fallbackNS: 'common',
    resources: {
      common: typeof ns1 & { locale: string };
    }
  }
}
