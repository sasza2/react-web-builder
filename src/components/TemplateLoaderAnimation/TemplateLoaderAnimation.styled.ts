import styled from "styled-components";

export const Container = styled.div<{ $height: number }>`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  height: ${({ $height }) => `${$height}px`};
  z-index: ${({ theme }) => theme.zIndex.max};
  color: ${({ theme }) => theme.colors.gray};
`;

export const Title = styled.div`
  ${({ theme }) => theme.typography.Title0R};
`;

export const Progress = styled.div`
  width: 300px;
  height: 20px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 8px;
  overflow: hidden;
`;

export const ProgressIn = styled.div`
  height: 100%;  
  width: 0;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  transition: width 0.2s;
`;
