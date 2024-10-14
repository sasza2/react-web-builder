import styled from 'styled-components';

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 4px;
  padding: 16px 8px;
  box-shadow: 0px 0px 4px 0px ${({ theme }) => `${theme.colors.black}26`};
`;

export const FormHeader = styled.div`
  color: ${({ theme }) => theme.colors.gray};
  ${({ theme }) => theme.typography.Title0B};
`;

export const FormControlDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.div`
  ${({ theme }) => theme.typography.Small0B};
  color: ${({ theme }) => theme.colors.gray};
`;

export const Description = styled.div`
  ${({ theme }) => theme.typography.Small0R};
  color: ${({ theme }) => theme.colors.gray};

  a {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const ListErrors = styled.ul`
  padding: 0 0 0 15px;
  color: ${({ theme }) => theme.colors.strongRed};
  ${({ theme }) => theme.typography.Small0R};
`;
