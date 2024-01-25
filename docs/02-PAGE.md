# Page object
`page` is an object that is produced by `<Builder />` component. Should be used by `<View />` component to display created content. 

## Structure

| Prop | Type | Description |
| --- | --- | --- |
| breakpoints[] | Breakpoint | More about <a href="./03-BREAKPOINTS.md">breakpoints</a> |
| elementsInBreakpoints | -| internal field (list of elements in each breakpoint) |
| elementsExtras | - | internal field (margins and paddings of elements) |
| backgroundColor | string | background color of page |
| colors | - | internal field (saved colors selected by user) |
| fontFamily | string | selected font in page settings by user |