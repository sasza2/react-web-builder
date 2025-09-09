import { css } from "styled-components";

const typography = {
	Big0R: css`
    font-family: Inter;
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0em;
  `,
	Big1R: css`
    font-family: Inter;
    font-size: 28px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0em;
  `,
	Title0B: css`
    font-family: Inter;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0em;
  `,
	Title0R: css`
    font-family: Inter;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0em;
  `,
	Medium0R: css`
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0em;
  `,
	Medium0B: css`
    font-family: Inter;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0em;
  `,
	Small0R: css`
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0em;
  `,
	Small0B: css`
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  letter-spacing: 0em;
`,
};

const colors = {
	black: "#000000",
	darkBlue: "#0C6D97",
	gray: "#5e5e5e",
	lightGray: "#c5c5c5",
	raisinBlack: "#222426",
	seaGreen: "#2AA25D",
	strongRed: "#D62728",
	white: "#ffffff",
	whiteSmoke: "#EAEAEA",
};

const zIndex = {
	select: 3,
	tooltip: 4,
	helperShadows: 2147483646,
	whySeparatorAnimation: 2147483646,
	max: 2147483647,
};

const theme = {
	colors,
	fontFamily: "Inter",
	typography,
	zIndex,
};

export default theme;
