# The editor

This page describes the behaviour users get from `<Builder />` out of the box: shortcuts, the configuration menu, history, and how work is saved. None of it needs configuration - but knowing what is there tells you what you do *not* have to build yourself, and what to mention in your own onboarding.

## Keyboard shortcuts

Shortcuts act on the grid, so they apply while no input field has focus.

| Keys | Action |
| --- | --- |
| <kbd>Arrow keys</kbd> | Pan the grid |
| <kbd>Tab</kbd> | Move to the next element and center it on screen |
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | Move to the previous element |
| <kbd>Delete</kbd> | Remove the selected element |

Mouse wheel behaviour depends on the "Mouse wheel" option. While it is off, the wheel zooms the grid. While it is on, the wheel scrolls vertically, <kbd>Shift</kbd> + wheel scrolls horizontally, and <kbd>Ctrl</kbd> / <kbd>Cmd</kbd> + wheel zooms.

Elements can be copied and pasted from the element's context menu. The copied payload is the elements' JSON and is also written to the system clipboard, so it can be inspected or stored - but pasting reads the builder's own clipboard, which means copy and paste work within one builder session rather than across browser tabs.

## Configuration menu

The gear icon in the top-right corner opens per-user settings. They are stored in local storage under the `configuration` key, so they persist across sessions and are **not** part of the [page](./02-PAGE.md).

| Option | Default | Description |
| --- | --- | --- |
| Auto save | off | Save as draft on every change - this is what enables the `onAutoSave` callback |
| Autofocus editor | on | Put the cursor in the text editor when opening an element's properties |
| Grid elements | on | Automatically pull "jumped" elements up, removing empty space left when an element is dragged below others |
| Grid helper | on | Show column numbers on both sides of an element while it is being placed |
| Grid zooming | off | Always zoom towards the center of the grid |
| Mouse wheel | off | Scroll the breakpoint area with the wheel (see above) |
| Mouse wheel speed | 3 | Scrolling speed |
| Edit on double-click | off | Require a double click to open an element's editor |
| Close edit on click | off | Keep the properties panel open when clicking outside the element |
| Show helper tips | - | Bring back the dismissed [builder hints](./07-BUILDER-HINTS.md) |

Because these live in local storage, a developer who has changed them will not see what a first-time user sees. Clear the site data when checking the default experience.

## History

The undo and redo buttons in the navbar walk a history stack of grid changes - adding, moving, resizing, deleting elements and editing their properties. It is internal to a builder session: it is not stored in the `page` object and does not survive a remount.

## Saving

There are four ways a page leaves the builder, and each has its own callback:

| Action | Callback | Typical use |
| --- | --- | --- |
| Auto save | `onAutoSave` | Draft snapshot on every change, only while "Auto save" is on |
| Save as draft | `onSaveAsDraft` | Explicit draft save |
| Preview | `onPagePreview` | Render the page somewhere else without publishing |
| Publish | `onPublish` | The version your users see |

`onChange` fires on every change regardless of these. It is meant for live previews and mirroring state into your own store - not for network requests.

The builder also warns before leaving the tab when there are unsaved changes, so a browser refresh cannot silently discard work.

## Download and upload

`enableDownload` and `enableUpload` add actions that write the [page](./02-PAGE.md) object to a JSON file and read it back. They are useful for moving a page between environments, attaching a page to a bug report, or seeding a template from something a user built by hand.

`onBeforeDownloadPage` lets you rename the file or adjust the payload first:

```jsx
<WebBuilder
  enableDownload
  enableUpload
  onBeforeDownloadPage={(page) => ({
    filename: `landing-${new Date().toISOString().slice(0, 10)}.json`,
    page,
  })}
/>
```

## Rendering safety

Two states are worth knowing about when your own [components](./01-COMPONENTS.md) are involved:

- **Component not found** - an element referencing a `componentName` that is not in the `components` array renders a placeholder instead of breaking the page. This is what you see if the builder and the view are given different component lists, or if a component id has been renamed after pages were saved. Treat component ids as a stable contract.
- **Errors are contained** - a component that throws does not take the whole builder down.

Because of the first point, removing a component from the array does not remove it from pages already saved. If you retire a component, keep the id registered - even as an empty placeholder - until you have migrated the stored pages.

## Storybook playground

Every feature in these docs has a runnable story in `src/stories`:

| Story | Covers |
| --- | --- |
| `Builder.stories.tsx` | The editor, custom components, property types |
| `View.stories.tsx` | Rendering a published page |
| `Templates.stories.tsx` | [Templates](./04-TEMPLATES.md) |
| `Translations.stories.tsx` | [Translations](./06-TRANSLATIONS.md) |
| `Icons.stories.tsx` | Component icons and [navbar icons](./08-NAVBAR-ICONS.md) |
| `Resizable.stories.tsx` | Resizing behaviour |

```sh
pnpm install
pnpm dev   # http://localhost:6006
```
