import { WebBuilderElements } from 'types';
import { useAppDispatch } from '@/store/useAppDispatch';
import { setElementsInBreakpointProgrammatic } from '@/store/elementsInBreakpointsSlice';
import { createUniqueId } from '@/utils/createUniqueId';
import { DEFAULT_BOX_CONTENT } from '@/consts';
import { useBreakpoint } from '../useBreakpoint';
import { useAddBreakpoint } from '../useAddBreakpoint';

export const useAddBreakpointForContainer = () => {
  const dispatch = useAppDispatch();
  const addBreakpoint = useAddBreakpoint();
  const currentBreakpoint = useBreakpoint();

  const addBreakpointForContainer = () => {
    const breakpoint = addBreakpoint({
      cols: currentBreakpoint.cols,
      from: currentBreakpoint.from,
      rowHeight: currentBreakpoint.rowHeight,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      parentId: currentBreakpoint.id,
      to: null,
    }, { silent: true });

    const elements: WebBuilderElements = [
      {
        componentName: 'Box',
        id: createUniqueId(),
        x: 0,
        y: 0,
        w: currentBreakpoint.cols,
        h: 'auto',
        breakpointId: breakpoint.id,
        props: [
          {
            propId: 'content',
            value: DEFAULT_BOX_CONTENT,
          },
        ],
      },
    ];

    dispatch(setElementsInBreakpointProgrammatic({ elements, breakpointId: breakpoint.id }));

    return breakpoint.id;
  };

  return addBreakpointForContainer;
};
