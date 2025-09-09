import styled from "styled-components";

export const Empty = styled.div`
  &:after {
    content: ".";
    visibility: hidden;
  }
`;
