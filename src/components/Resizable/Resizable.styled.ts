import styled from 'styled-components';

import { RESIZABLE_PROP_NAME } from './consts';

export const Container = styled.div`
  position: relative;
  height: ${() => `var(${RESIZABLE_PROP_NAME}, 160px)`};
`;

export const Anchor = styled.div`
  position: absolute;
  height: 10px;
  bottom: -5px;
  left: 0%;
  width: 100%;
  cursor: row-resize;
`;
