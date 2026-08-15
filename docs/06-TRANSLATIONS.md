# Translations

The whole builder interface is translatable. English is the default and lives in [`src/locales/en.ts`](../src/locales/en.ts) - use it as the reference for the exact shape of the object.

Pass your own locale through the `translations` prop. The `locale` key should hold the current language code.

```jsx
import WebBuilder from 'react-web-builder'

const translations = {
  locale: 'pl',
  // ...the rest of the keys, translated
}

export function TranslationsExample() {
  return (
    <WebBuilder
      page={page}
      translations={translations}
    />
  );
}
```

## Structure

Translations are a nested object grouped by area: `breakpoint`, `color`, `common`, `configuration`, `container`, `element`, `errors`, `group`, `history`, `hints`, `page`, `publish`, `preview`, `selectNewElement`, `separator`, `template` and `whySeparator`.

The simplest way to start is to copy `en.ts`, translate the strings and keep every key intact.

```ts
export default {
  locale: 'pl',
  breakpoint: {
    add: 'Dodaj breakpoint',
    background: 'Kolor tła',
    delete: 'Usuń breakpoint',
    // ...
  },
  // ...
}
```

> **The object replaces English entirely** - it is not merged with the default locale. A key you leave out is a key the builder renders as its raw path (e.g. `breakpoint.add`), so translate the whole file rather than a subset.

Some strings contain placeholders and inline tags, which must be preserved:

- `{{value}}` - interpolated value, e.g. `'Value is not greater than {{value}}'`
- `<a>…</a>`, `<readMore />` - inline elements the builder replaces with real components

Translations are powered by [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/), so the interpolation rules are theirs.

## Switching language at runtime

Pass a different `translations` object and the interface updates. The builder reacts to a **change of the `locale` value**, so make sure each locale object carries its own code:

```jsx
<WebBuilder translations={language === 'pl' ? pl : en} />
```

Passing a new object with an unchanged `locale` will not re-initialise the translations.

Pass the same object to `<View />` as well if any user-facing strings appear in the rendered page.

## Working example

`src/stories/Translations.stories.tsx` contains a runnable example - open it with `pnpm dev`.
