import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  min-width: 60px;
  max-width: 60px;

  .react-select__indicator {
    display: none;
  }

  .react-select__single-value {
    text-align: right;
  }

  svg {
    position: absolute;
    top: 3px;
    left: 5px;
    z-index: 2;
    width: 20px;
    height: 20px;
    fill: ${({ theme }) => theme.colors.gray};
  }
`;
