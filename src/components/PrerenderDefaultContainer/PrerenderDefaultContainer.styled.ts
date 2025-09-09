import { styled } from "styled-components";
import type { FontImport } from "types";

export const Hidden = styled.div<{ $fontImport: FontImport | null }>`
  font-family: ${({ $fontImport }) => $fontImport?.fontFamily};
  max-height: 0;
  overflow: hidden;
  pointer-events: none;
  visibility: hidden;
`;
