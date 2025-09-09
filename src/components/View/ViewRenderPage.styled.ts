import styled from 'styled-components';
import type { FontImport } from 'types';

export const PageContainer = styled.div<{ $fontImport: FontImport | null }>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: ${({ $fontImport }) => $fontImport?.fontFamily};
`;
