import styled from "styled-components";

const FloatLeft = styled.div`
  float: left;
`;

export const Box1 = styled(FloatLeft)`
  background-color: ${({ theme }) => theme.colors.seaGreen};
  height: 150px;
`;

export const Box2 = styled(FloatLeft)`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  font-family: monospace;
  font-size: 10px;
  line-height: 15px;
`;

export const Box3 = styled(FloatLeft)`
  background-color: ${({ theme }) => theme.colors.seaGreen};
  height: 50px;
`;

export const Box4 = styled(FloatLeft)`
  background-color: ${({ theme }) => theme.colors.seaGreen};
  height: 50px;
`;

export const SeparatorDiv = styled.div<{ $hidden: boolean }>`
  width: 100%;
  height: 10px;
  transition: opacity var(--speed);
  opacity: ${({ $hidden }) => ($hidden ? "0" : "1")};
  float: left;
`;

const Container = styled.div`
  padding: 10px;
  min-width: 380px;
`;

export const ContainerWithout = styled(Container)`
  ${Box1}, ${Box2}, ${Box3}, ${Box4} {
    width: 100%;
  }
  ${Box3}, ${Box4} {
    margin-top: 10px;
  }
`;

export const ContainerSeparator = styled(Container)`
  ${Box1}, ${Box2}, ${Box3}, ${Box4} {
    float: left;
  }
  ${Box1}, ${Box3} {
    width: 75%;
  }
  ${Box2}, ${Box4} {
    width: calc(25% - 10px);
    margin-left: 10px;
  }
`;

export const Left = styled.div`
  float: left;
  width: 75%;
`;

export const Right = styled.div`
  float: left;
  width: calc(25% - 10px);
  margin-left: 10px;
`;
