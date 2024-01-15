import { Breakpoint } from 'types';
import { createUniqueId } from '@/utils/createUniqueId';

const generateDefaultBreakpoints = () => [
  {
    id: createUniqueId(),
    from: 360,
    to: null,
    cols: 5,
    rowHeight: 15,
    backgroundColor: null,
    padding: {
      top: 15,
      right: 15,
      bottom: 0,
      left: 15,
    },
  },
  {
    id: createUniqueId(),
    from: 1280,
    to: 1280,
    cols: 20,
    rowHeight: 15,
    backgroundColor: null,
    padding: {
      top: 15,
      right: 15,
      bottom: 0,
      left: 15,
    },
  },
] as Breakpoint[];

export default generateDefaultBreakpoints;
