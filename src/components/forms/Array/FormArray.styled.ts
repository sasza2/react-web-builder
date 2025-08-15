import { styled } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ItemLabel = styled.div`
  align-items: center;
  display: flex;
`;

export const ItemLabelActions = styled.div`
  display: flex;
  fill: ${({ theme }) => theme.colors.gray};
  gap: 4px;
  margin-left: auto;

  .icon--reverse {
    transform: rotate(180deg);
  }
`;
