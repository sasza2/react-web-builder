import styled from 'styled-components';

export const MenuWrapper = styled.div`
  & > * {
    display: inline-block;
  }

  & > * + * {
    margin-left: 15px;
  }
`;

export const ToolbarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
