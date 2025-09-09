import { type CSSProperties, styled } from 'styled-components';

export const Flex = styled.div<{ $gap?: CSSProperties['gap'] }>`
  display: flex;
  gap: ${({ $gap }) => $gap};
  width: 100%;
`;

export const FlexHorizontal = styled(Flex)``;

export const FlexVertical = styled(Flex)`
  flex-direction: column;
`;
