import styled from 'styled-components';

const ButtonContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 6px;
  padding: 0px 16px;
  cursor: pointer;
`;

export const ConfirmButtonContainer = styled(ButtonContainer)`
  background-color: ${({ theme }) => theme.colors.seaGreen};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.typography.Title0B};
`;

export const LinkButtonContainer = styled(ButtonContainer)`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.typography.Title0B};
`;

export const LinkGhostButtonContainer = styled(ButtonContainer)`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.darkBlue};
  color: ${({ theme }) => theme.colors.darkBlue};
  ${({ theme }) => theme.typography.Title0B};
`;

export const RemoveButtonContainer = styled(ButtonContainer)`
  background-color: ${({ theme }) => theme.colors.strongRed};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.typography.Title0B};
`;

export const RemoveGhostButtonContainer = styled(ButtonContainer)`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.strongRed};
  color: ${({ theme }) => theme.colors.strongRed};
  ${({ theme }) => theme.typography.Title0B};
`;
