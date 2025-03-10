# react-web-builder

## 0.20.0

### Minor Changes

- d736da1: keyboard events on grid (tab, arrows)

### Patch Changes

- 4e89e84: fix saving input value when user clicks on element
- 4b59457: fix builder anchor element when loading breakpoint
- 6d2aa69: fix loading templates
- 5176bca: fix opening container with paddings
- 57dedab: fix validating uploaded page

## 0.19.1

### Patch Changes

- 54edbfb: fix pressing enter key in input (no page refresh)
- ad6ea45: add anchor component classname

## 0.19.0

### Minor Changes

- b57fd8f: anchor component
- 24ba614: allow page download/upload
- c5f3caf: property font family for container

### Patch Changes

- b78f702: update react-grid-panzoom (organize grid elements issue with containers)
- 61382fa: fix: opening container in builder with only one element

## 0.18.1

### Patch Changes

- b9cf9f8: fix: reset elements in breakpoints to initial state

## 0.18.0

### Minor Changes

- 45b20a7: add reset page feature in page settings

## 0.17.0

### Minor Changes

- a985ca9: add scrollbar visibility toggle to scrollbar overflow visible option in container

### Patch Changes

- 20afffb: fix: publish container element without elements

## 0.16.0

### Minor Changes

- daf7087: feat: remove apply padding bottom in view
- 6515e37: change max border radius size to 48
- c12b313: container - add text "Empty container" when there are no elements in container (grid mode)

### Patch Changes

- 230426b: fix: set color in input
- 2e64314: fix: open container without elements
- 616a025: fix: update tooltip lib

## 0.15.1

### Patch Changes

- c5e299e: fix: adding a link to an image makes the image smaller

## 0.15.0

### Minor Changes

- c4b1426: remember last grid position in breakpoints/containers

### Patch Changes

- e43e70b: grid initial position

## 0.14.0

### Minor Changes

- 213ad98: export element container hook to be able to wrap container in other components

## 0.13.0

### Minor Changes

- c25f7e2: hint to containers - how to use them
- 30413e3: open containers with same width as in breakpoint
- 5a8ff11: change initial elements of containers

### Patch Changes

- b98021e: fix in displaying containers background
- 8f0fecd: fix displaying background in grid
- c3224db: fix in adding new breakpoint
- ec8ce21: fix dot background in grid (last vertical line is not visible)

## 0.12.1

### Patch Changes

- 309d15b: drag element, prevent transition
- 5096eec: fix opening container for default height

## 0.12.0

### Minor Changes

- 895bce7: display background in container mode

### Patch Changes

- b8d4c70: Button UI improvements

## 0.11.0

### Minor Changes

- 1aa2dd3: background image

### Patch Changes

- 4a2f18c: fix display gradient background in container

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
