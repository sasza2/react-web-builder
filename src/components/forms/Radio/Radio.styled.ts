import styled from 'styled-components';

export const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Item = styled.div<{ $selected?: boolean }>`
  align-items: center;
  border: 1px solid ${({ $selected, theme }) => ($selected ? theme.colors.darkBlue : theme.colors.lightGray)};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 12px;

  ${({ theme }) => theme.typography.Medium0R};
  line-height: 1;
`;

export const ItemInner = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const Circle = styled.div<{ $selected?: boolean }>`
  align-items: center;
  border: 1px solid ${({ $selected, theme }) => ($selected ? theme.colors.darkBlue : theme.colors.gray)};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 12px;
  justify-content: center;
  width: 12px;
`;

export const CircleFill = styled.div`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  border-radius: 50%;
  height: 7px;
  width: 7px;
`;
