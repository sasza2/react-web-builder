# Page object

`page` is the object produced by the `<Builder />` component. It is passed to `<View />` to display the created content.

It is plain, serializable JSON: `JSON.stringify` it, store it in any database, and hand it back later. It contains no functions and no React elements.

## Structure

| Prop | Type | Description |
| --- | --- | --- |
| breakpoints[] | Breakpoint | Grid definition per breakpoint ([read more](./03-BREAKPOINTS.md)) |
| elementsInBreakpoints | internal | Elements placed in each breakpoint, keyed by breakpoint id |
| elementsExtras | internal | Heights and paddings of elements, keyed by breakpoint and element id |
| backgroundColor | string | Background color of the page |
| colors | internal | Colors saved by the user in the color picker |
| fontFamily | string | Font selected in page settings - the `value` of one of the declared [fonts](./05-FONTS.md) |

Fields marked as internal are managed by the builder. Read them if you need to, but treat them as an implementation detail rather than an API.

## Lifecycle

1. `<Builder />` starts from the `page` prop, or from an empty page when it is not provided.
2. The user edits, and the builder reports the current state through `onChange`, `onAutoSave`, `onSaveAsDraft`, `onPagePreview` and `onPublish`.
3. You persist the object.
4. `<View />` renders it back.

```jsx
import { useEffect, useState } from 'react'
import WebBuilder, { Page } from 'react-web-builder'

export function Editor() {
  const [page, setPage] = useState<Page | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pages/home')
      .then((res) => res.json())
      .then(setPage)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading…</p>

  const save = (next: Page, status: 'draft' | 'published') =>
    fetch('/api/pages/home', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: next, status }),
    })

  return (
    <WebBuilder
      page={page}
      onAutoSave={(next) => save(next, 'draft')}
      onSaveAsDraft={(next) => save(next, 'draft')}
      onPublish={(next) => save(next, 'published')}
    />
  )
}
```

Notes:

- `onAutoSave` fires only while "Auto save" is enabled in the configuration menu (top-right corner).
- `onChange` fires on **every** change - use it for live previews or an undo stack, not for network requests.
- The `page` prop is read when the builder mounts. To load a different page afterwards, remount the builder (for example with a `key`).

## Partial pages

You do not have to supply a complete `page`. Passing only the fields you care about is a common way to preconfigure the builder:

```jsx
const page = {
  backgroundColor: '#ffffff',
  fontFamily: 'inter',
} as Page

<WebBuilder page={page} fonts={fonts} />
```

The same applies to [breakpoints](./03-BREAKPOINTS.md) and [templates](./04-TEMPLATES.md), which are declared inside `page`.
