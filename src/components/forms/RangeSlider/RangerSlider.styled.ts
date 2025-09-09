import styled from "styled-components";

const calculateWidth = (size: number) => Math.max(75, 30 + size * 15);

export const RangeSliderWithInput = styled.div`
  display: flex;
  align-items: center;
`;

export const RangeContainer = styled.div<{
	$inputSize: number;
	$fullWidth: boolean;
}>`
  margin-left: 10px;
  min-width: ${({ $inputSize, $fullWidth }) => ($fullWidth ? "calc(100% - 20px)" : `calc(100% - ${calculateWidth($inputSize)}px - 45px)`)};
`;

export const InputContainer = styled.div<{ $inputSize: number }>`
  margin: 0 5px 0 35px;
  min-width: ${({ $inputSize }) => `${calculateWidth($inputSize)}px`};
`;
