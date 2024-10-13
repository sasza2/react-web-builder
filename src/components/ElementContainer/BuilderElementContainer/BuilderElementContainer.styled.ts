import styled from 'styled-components';
import { Breakpoint } from 'types';

export const Empty = styled.div<{ $container: Breakpoint }>`
  height: ${({ $container }) => `${$container.rowHeight}px`};
  width: 100%;
`;
