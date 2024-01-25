# Translations
English (default) translations are located in file `src/locales/en.ts`. Translation can be passed with prop `translations`. Value of key `locale` in translations should be current language.

```jsx
import WebBuilder from 'react-web-builder'

const translations = {
  locale: 'pl',
  // rest of translations
}

export function Fonts() {
  return (
    <WebBuilder
      page={page}
      translations={translations}
    />
  );
}
```
