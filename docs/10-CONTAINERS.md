# Containers

A container is an element that holds other elements. Dropping a Container onto the grid gives the user a nested grid: it has its own column count, background, padding and height, and elements placed inside it move with it.

Containers are what you reach for when a page needs sections - a hero band, a two-column feature strip, a footer - rather than a flat sequence of blocks.

## How containers work

Under the hood, a container element owns a **child breakpoint**. When the user opens a container:

1. A new [breakpoint](./03-BREAKPOINTS.md) is created with `parentId` pointing at the breakpoint the container lives in.
2. Its id is stored on the element in a [`hidden`](./01-COMPONENTS.md#hidden) property called `containerId`.
3. Elements dropped inside the container are stored in `page.elementsInBreakpoints` under that child breakpoint id.

This is why a container's settings - columns, background color, padding - are edited with [`editBreakpoint`](./01-COMPONENTS.md#editbreakpoint) properties: they change the child breakpoint, not the element.

Two consequences worth knowing:

- The breakpoint selector in the navbar is disabled while a container is open - you are already editing a nested grid, so switching the page breakpoint underneath it makes no sense.
- Copying a container copies its child breakpoint and everything inside it, with fresh ids.

## The built-in Container

`Container` ships with the builder and exposes these properties:

| Property | Type | Description |
| --- | --- | --- |
| openContainer | [openContainer](./01-COMPONENTS.md#opencontainer) | Button that opens the nested grid |
| breakpointHeight | [breakpointHeight](./01-COMPONENTS.md#breakpointheight) | Fixed height, overflow and scrollbar behaviour |
| cols | [editBreakpoint](./01-COMPONENTS.md#editbreakpoint) | Column count of the nested grid |
| backgroundColor | editBreakpoint | Background color |
| backgroundImage | [backgroundImage](./01-COMPONENTS.md#backgroundimage) | Background image with position, repeat and size |
| padding | editBreakpoint | Padding of the nested grid |
| containerId | [hidden](./01-COMPONENTS.md#hidden) | Id of the child breakpoint |
| border | [border](./01-COMPONENTS.md#border) | Border and radius |
| boxShadow | [boxShadow](./01-COMPONENTS.md#boxshadow) | Shadow |
| fontFamily | [fontFamily](./01-COMPONENTS.md#fontfamily) | Font used inside the container |

## Your own container component

Mark a component with `isContainer: true` and render the nested grid with the `useElementContainer` hook. Everything around it is yours - that is the point: you get your own wrapper, class names and styling, and the builder still manages what goes inside.

```jsx
import WebBuilder from 'react-web-builder'
import { useElementContainer } from 'react-web-builder/components'

const Card = ({ title }) => {
  const ElementContainer = useElementContainer()

  return (
    <section className="card">
      <h2>{title}</h2>
      <ElementContainer />
    </section>
  )
}

const components = [
  {
    id: 'card',
    label: 'Card',
    component: Card,
    isContainer: true,
    props: [
      { id: 'title',         label: 'Title', type: 'text' },
      { id: 'openContainer', type: 'openContainer' },
      { id: 'cols',          type: 'editBreakpoint', field: 'cols' },
      { id: 'padding',       type: 'editBreakpoint', field: 'padding' },
      { id: 'containerId',   type: 'hidden' },
    ],
  },
]

export const Editor = () => <WebBuilder components={components} />
```

Notes:

- `useElementContainer` must be called inside the component being rendered on the grid - it reads the container from context.
- Include the `openContainer` and `containerId` properties. The first gives the user a way in; the second is where the child breakpoint id is stored, and without it the container cannot be reopened after a save.
- The same component must be passed to `<View />`, where `useElementContainer` renders the finished contents instead of the editable grid.

## Anchors

The built-in `Anchor` component drops an invisible scroll target onto the page. Give it an `anchorId`, then link to it from any [`url`](./01-COMPONENTS.md#url) property with `#your-anchor-id`. Anchors are what make one-page layouts - a navbar linking to sections further down - work without leaving the builder.

## Decorating every element

`elementContainerDecorator` wraps **each** element on the grid, in the builder and in the view alike. It is the hook for cross-cutting concerns: analytics attributes, animation wrappers, per-element error boundaries.

```jsx
const Decorator = ({ container, children }) => (
  <div className="element" data-container={Boolean(container)}>
    {children}
  </div>
)

<WebBuilder elementContainerDecorator={Decorator} />
<View elementContainerDecorator={Decorator} page={page} />
```

It receives `container` (the [breakpoint](./03-BREAKPOINTS.md) of the container the element sits in, when it is nested) and `children`.

Use `container` from the shared props instead when you want to wrap the whole page once - see [introduction](./00-INTRODUCTION.md#shared-properties).
