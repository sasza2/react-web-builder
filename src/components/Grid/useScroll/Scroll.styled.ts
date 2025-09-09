import styled from "styled-components";

export const ScrollVertical = styled.div`
  position: absolute;
  top: 10px;
  right: 5px;
  width: 5px;
  background-color: transparent;
  border-radius: 3px;
`;

export const ScrollHorizontal = styled.div`
  position: absolute;
  bottom: 5px;
  height: 5px;
  left: 10px;
  width: calc(100% - 20px);
  background-color: transparent;
  border-radius: 3px;
`;

const ScrollIn = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 3px;
  opacity: 0.8;
`;

export const ScrollHorizontalIn = styled(ScrollIn)`
  cursor: pointer;
  height: 5px;
`;

export const ScrollVerticalIn = styled(ScrollIn)`
  cursor: pointer;
  width: 5px;
`;
