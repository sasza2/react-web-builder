import styled from 'styled-components';

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TooltipContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 5px;
`;

// text md semi
export const Container = styled.div<{
  $active?: boolean,
  $overflow: 'visible' | 'hidden',
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.gray)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.darkBlue : undefined)};
  height: 75px;
  width: calc((var(--react-web-builder-sidebar-width) - 32px - 8px) / 2);
  position: relative;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  cursor: ${({ $active }) => ($active ? 'grabbing' : 'grab')};
  ${({ theme }) => theme.typography.Small0R};
  gap: 8px;
  overflow: ${({ $overflow }) => $overflow};
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none; 

  span {
    word-break: break-word;
    text-align: center;
    max-height: 30px;
    max-width: calc(100% - 10px);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${IconContainer} {
    svg {
      width: 20px;
      height: 20px;
      fill: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.gray)};
    }
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.darkBlue};;
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.darkBlue)};
    ${IconContainer} {
      svg {
        fill: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.darkBlue)};
      }
    }
  }
`;
