# react-web-builder

## 0.10.0

### Minor Changes

- 07bb87b: UI changes

### Patch Changes

- ed4c602: fix containers height in fixed mode

## 0.9.2

### Patch Changes

- e4232cc: fix passing default props to internal components

## 0.9.1

### Patch Changes

- 73e7137: fix rendering containers width

## 0.9.0

### Minor Changes

- 0c317d5: change positon of form components in configuration
- 5ea4684: remove container elements (clean unused data)
- 5073487: container element
- 9c28e4f: add function as type of defaultWidth of component

### Patch Changes

- 36d9e90: wrap property 'number' in sidebar to form group
- dd7da2b: wrap property 'select' in sidebar to form group
- f08eb52: fix shade of color
- 8ec4592: change default color gradient percentage
- 2875709: fix range slider component line

## 0.8.0

### Minor Changes

- c1af9de: gradient colors
- dbfdd84: add default box shadow values for elements
- 3ad375b: default gradient color - light up second color

## 0.7.1

### Patch Changes

- abbbfde: go back to grid boundary when removing element that is at the bottom of grid

## 0.7.0

### Minor Changes

- 803cb2e: add margin to pasted elements

## 0.6.1

### Patch Changes

- e2dd7bc: remove lock when pasting elements

## 0.6.0

### Minor Changes

- eb0760c: element lock/unlock
- a878a8c: grid vertical helper lines

## 0.5.0

### Minor Changes

- 25164ef: add possibility to change link color in box component

## 0.4.0

### Minor Changes

- 40b6123: add configuration setting grid zoom position

## 0.3.2

### Patch Changes

- 7988782: change breakpoint hint text

## 0.3.1

### Patch Changes

- d1e5d14: fixes in english translations
- 3d6f9ca: fix hint button visibility on "smaller" resolutions like 1366 x 768
- d69615b: fix unnecessary mutual highlight of grid components and items in form list component in sidebar. now only one component is highlighting elements inside

## 0.3.0

### Minor Changes

- dc5ce1c: add resizable vertical to richtext editor
- e33ed6f: remember accordion state in select new component when changing to other sidebar view

### Patch Changes

- 6c42368: separator tooltip - shorten first scene and 'this is separtor element' scene
- b8552ec: change locale en from 'HTML iframe' to 'HTML Iframe'

## 0.2.0

### Minor Changes

- 738a297: pressing shift button now allowing to select multiple elements. it's also possible to copy and remove all selected elements
- 0e48b9b: add ability to uploading images. new property type 'img'

### Patch Changes

- 0d66957: fix textarea autofocus interval when "autofocus" option in user configuration is ON
- 15e0b19: [Breakpoints] Move dropdown options to be in line with the selected one

## 0.1.1

### Patch Changes

- 2c41fb9: fix in 'react-grid-panzoom' library connected with "waiting" for useRef api to load. in Builder it was causing that sometimes it was required to click on sidebar component "ListOrder" to load
