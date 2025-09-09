import styled from "styled-components";

const HEIGHT_BY_SIZE = {
	xs: 26,
	lg: 40,
};

const getPaddingForIndicator = (size: "xs" | "lg") => {
	const height = HEIGHT_BY_SIZE[size];
	return `${Math.max((height - 22) / 2, 0)}px 8px !important`;
};

export const Wrapped = styled.div<{ $size: "xs" | "lg" }>`
  font-family: ${({ theme }) => theme.fontFamily};

  .react-select__menu {
    z-index: ${({ theme }) => theme.zIndex.select};
  }
  .react-select__control {
    min-height: ${({ $size }) => `${HEIGHT_BY_SIZE[$size]}px !important`};
    max-height: ${({ $size }) => `${HEIGHT_BY_SIZE[$size]}px`};
    box-shadow: none !important;
    cursor: pointer;

    &:hover {
      border: 1px solid ${({ theme }) => theme.colors.darkBlue};
      .react-select__single-value {
        color: ${({ theme }) => theme.colors.darkBlue};
      }
    }
  }
  .react-select__indicator {
    padding: ${({ $size }) => getPaddingForIndicator($size)};
    svg {
      fill: ${({ theme }) => theme.colors.gray};
    }
  };
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__single-value {
    ${({ $size, theme }) => {
			switch ($size) {
				case "xs":
					return theme.typography.Small0R;
				default:
					return theme.typography.Title0R;
			}
		}}

    svg {
      fill: ${({ theme }) => theme.colors.gray};
    }
  }
  .react-select__option {
    ${({ theme }) => theme.typography.Title0R};
    color: ${({ theme }) => theme.colors.black};
    cursor: pointer;

    svg {
      fill: ${({ theme }) => theme.colors.gray};
    }
  }
  .react-select__option.react-select__option--is-focused,
  .react-select__option:hover {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.darkBlue};

    svg {
      fill: ${({ theme }) => theme.colors.darkBlue};
    }
  }
  .react-select__option.react-select__option--is-selected {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    color: ${({ theme }) => theme.colors.white};

    svg {
      fill: ${({ theme }) => theme.colors.white};
    }
  }
  .react-select__option:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    color: ${({ theme }) => theme.colors.white};

    svg {
      fill: ${({ theme }) => theme.colors.white};
    }
  }
`;
