import { renderHook } from "@testing-library/react";
import type { UseBoxStyleProps } from "types";
import { expect, it } from "vitest";

import { useBoxStyle } from "./useBoxStyle";

it("returns sensible defaults when called with an empty object", () => {
	const { result } = renderHook(() => useBoxStyle({} as UseBoxStyleProps));

	expect(result.current.background).toBeUndefined();
	expect(result.current.borderTop).toBeUndefined();
	expect(result.current.borderRadius).toBe(0);
	expect(result.current.boxShadow).toBeUndefined();
	expect(result.current.fontWeight).toBe("normal");
	expect(result.current.fontSize).toBe(12);
	expect(result.current.textDecoration).toBeUndefined();
	expect(result.current.fontStyle).toBeUndefined();
	expect(result.current.textAlign).toBe("left");
	expect(result.current.paddingTop).toBe(0);
});

it("returns defaults when props is undefined", () => {
	const { result } = renderHook(() =>
		useBoxStyle(undefined as unknown as UseBoxStyleProps),
	);

	expect(result.current.fontWeight).toBe("normal");
});

it("builds border values for valid border sides with a valid color", () => {
	const { result } = renderHook(() =>
		useBoxStyle({
			border: {
				top: 2,
				right: 3,
				bottom: 4,
				left: 5,
				color: "#ff0000",
				radius: 6.7,
			},
		} as UseBoxStyleProps),
	);

	expect(result.current.borderTop).toBe("2px solid #ff0000");
	expect(result.current.borderRight).toBe("3px solid #ff0000");
	expect(result.current.borderBottom).toBe("4px solid #ff0000");
	expect(result.current.borderLeft).toBe("5px solid #ff0000");
	expect(result.current.borderRadius).toBe(6);
});

it("ignores border width when color is not a string", () => {
	const { result } = renderHook(() =>
		useBoxStyle({
			border: { top: 2, color: undefined },
		} as unknown as UseBoxStyleProps),
	);

	expect(result.current.borderTop).toBeUndefined();
});

it("ignores border width when color is not a valid color", () => {
	const { result } = renderHook(() =>
		useBoxStyle({
			border: { top: 2, color: "not-a-color" },
		} as UseBoxStyleProps),
	);

	expect(result.current.borderTop).toBeUndefined();
});

it("ignores border width when the value is 0 or negative", () => {
	const { result } = renderHook(() =>
		useBoxStyle({
			border: { top: 0, right: -1, color: "#ff0000" },
		} as UseBoxStyleProps),
	);

	expect(result.current.borderTop).toBeUndefined();
	expect(result.current.borderRight).toBeUndefined();
});

it("clamps negative/undefined padding values to 0", () => {
	const { result } = renderHook(() =>
		useBoxStyle({
			padding: { top: -5, right: undefined, bottom: 3.9, left: 0 },
		} as UseBoxStyleProps),
	);

	expect(result.current.paddingTop).toBe(0);
	expect(result.current.paddingRight).toBe(0);
	expect(result.current.paddingBottom).toBe(3);
	expect(result.current.paddingLeft).toBe(0);
});

it("returns 0 when a positive padding value floors to 0 (fallback `|| 0`)", () => {
	const { result } = renderHook(() =>
		useBoxStyle({
			padding: { top: 0.5 },
		} as UseBoxStyleProps),
	);

	expect(result.current.paddingTop).toBe(0);
});

it("applies fontOptions overrides", () => {
	const { result } = renderHook(() =>
		useBoxStyle({
			backgroundColor: "#fff",
			boxShadow: "0 0 1px black",
			color: "#000",
			fontOptions: {
				bold: true,
				size: 20,
				underline: true,
				italic: true,
				textAlign: "right",
				letterSpacing: "2px",
				lineHeight: "1.5",
			},
		} as UseBoxStyleProps),
	);

	expect(result.current.background).toBe("#fff");
	expect(result.current.boxShadow).toBe("0 0 1px black");
	expect(result.current.color).toBe("#000");
	expect(result.current.fontWeight).toBe("600");
	expect(result.current.fontSize).toBe(20);
	expect(result.current.textDecoration).toBe("underline");
	expect(result.current.fontStyle).toBe("italic");
	expect(result.current.textAlign).toBe("right");
	expect(result.current.letterSpacing).toBe("2px");
	expect(result.current.lineHeight).toBe("1.5");
});
