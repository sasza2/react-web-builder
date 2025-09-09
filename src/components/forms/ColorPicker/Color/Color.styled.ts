import styled, { css } from "styled-components";

export const ColorContainer = styled.div<{
	$active: boolean;
	$hasBackground?: boolean;
	$size: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $size }) => `${$size}px`};
  max-width: ${({ $size }) => `${$size}px`};
  min-height: ${({ $size }) => `${$size}px`};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.darkBlue : theme.colors.lightGray)};
  border-radius: 4px;
  cursor: ${({ $active }) => ($active ? "default" : "pointer")};

  ${({ $hasBackground }) =>
		$hasBackground &&
		css`
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQAWJ84A0+ScZRAxiGSRgQSAb40wkoDAgBvAlt1AAGcEIiBGgbiAAgXwixcH9GzgAAAABJRU5ErkJggg==") left center;
  `};
`;

ColorContainer.defaultProps = {
	$hasBackground: true,
};

export const Color = styled.div<{ $color: string; $size: number }>`
  width:  ${({ $size }) => `${$size - 6}px`};
  height:  ${({ $size }) => `${$size - 6}px`};
  background: ${({ $color }) => $color};
  border-radius: 2px;
`;
