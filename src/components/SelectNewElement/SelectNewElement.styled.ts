import styled from "styled-components";

export const Container = styled.div`
  color: ${({ theme }) => theme.colors.gray};
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;

  .accordion {
    .accordion__button {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 44px;
      padding: 8px 16px 8px 16px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
      cursor: pointer;
      ${({ theme }) => theme.typography.Title0B};

      &[aria-expanded="true"] {
        svg {
          transform: rotate(90deg);
        }
      }

      svg {
        margin-left: auto;
        width: 12px;
        height: 12px;
        transform: rotate(-90deg);
        transition: transform 0.4s;
        fill: ${({ theme }) => theme.colors.gray};
      }
    }

    .accordion__panel {
      animation: fadein 0.4s ease-in;
      padding: 16px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
    }

    @keyframes fadein {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

export const GridItem = styled.div``;
