import { CSSProperties, styled } from 'styled-components';

type BackgroundContainerProps = {
  $background?: CSSProperties['background'],
};

export const Container = styled.div<BackgroundContainerProps>`
  background: ${({ $background }) => $background};
  position: absolute;
  top: 0;
  width: 100%;
`;
