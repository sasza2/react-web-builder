import { renderHook } from "@testing-library/react";
import type { BackgroundImage, BreakpointHeight } from "types";
import { describe, expect, it } from "vitest";

import { useContainerStyle } from "./useContainerStyle";

const buildBreakpointHeight = (
	breakpointHeight: Partial<BreakpointHeight> = {},
): BreakpointHeight => ({
	enabled: false,
	overflow: "visible",
	...breakpointHeight,
});

const buildBackgroundImage = (
	backgroundImage: Partial<BackgroundImage> = {},
): BackgroundImage => ({
	location: "img.png",
	position: undefined,
	repeat: undefined,
	size: undefined,
	...backgroundImage,
});

describe("useContainerStyle", () => {
	it("returns the base box style when no optional props are provided", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				breakpointHeight: buildBreakpointHeight({ enabled: false }),
			}),
		);

		expect(result.current.height).toBeUndefined();
		expect(result.current.backgroundImage).toBeUndefined();
	});

	it("sets a fixed height/maxHeight when breakpointHeight is enabled and non-responsive", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				breakpointHeight: buildBreakpointHeight({
					enabled: true,
					height: 200,
					responsive: false,
				}),
			}),
		);

		expect(result.current.height).toBe("200px");
		expect(result.current.maxHeight).toBe("200px");
	});

	it("sets a calc()-based responsive height/maxHeight when breakpointHeight is responsive", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				breakpointHeight: buildBreakpointHeight({
					enabled: true,
					height: 150,
					responsive: true,
				}),
			}),
		);

		expect(result.current.height).toBe(
			"calc(150px / var(--breakpoint-scale, 1))",
		);
		expect(result.current.maxHeight).toBe(
			"calc(150px / var(--breakpoint-scale, 1))",
		);
	});

	it("does not set a height when the parsed height is falsy (0/NaN)", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				breakpointHeight: buildBreakpointHeight({
					enabled: true,
					// the stored value comes from a form input, so it may not be numeric
					height: "not-a-number" as unknown as number,
				}),
			}),
		);

		expect(result.current.height).toBeUndefined();
		expect(result.current.maxHeight).toBeUndefined();
	});

	it("sets overflowY when breakpointHeight.overflow is provided", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				breakpointHeight: buildBreakpointHeight({
					enabled: true,
					overflow: "scroll",
				}),
			}),
		);

		expect(result.current.overflowY).toBe("scroll");
	});

	it("builds backgroundImage with default repeat/position/size when only location is set", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				backgroundImage: buildBackgroundImage(),
				breakpointHeight: buildBreakpointHeight(),
			}),
		);

		expect(result.current.backgroundImage).toBe(
			"0% 0% / auto auto repeat url(img.png)",
		);
	});

	it("uses backgroundImage.repeat.type when provided", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				backgroundImage: buildBackgroundImage({
					repeat: { type: "no-repeat" },
				}),
				breakpointHeight: buildBreakpointHeight(),
			}),
		);

		expect(result.current.backgroundImage).toBe(
			"0% 0% / auto auto no-repeat url(img.png)",
		);
	});

	it("computes numeric position when position.type is 'numbers'", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				backgroundImage: buildBackgroundImage({
					position: {
						type: "numbers",
						numbers: {
							x: { value: 10, unit: "px" },
							y: { value: 20, unit: "%" },
						},
					},
				}),
				breakpointHeight: buildBreakpointHeight(),
			}),
		);

		expect(result.current.backgroundImage).toBe(
			"10px 20% / auto auto repeat url(img.png)",
		);
	});

	it("uses position.type string directly when not 'numbers'", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				backgroundImage: buildBackgroundImage({
					// keyword positions are rendered as-is by the hook
					position: {
						type: "center",
					} as unknown as BackgroundImage["position"],
				}),
				breakpointHeight: buildBreakpointHeight(),
			}),
		);

		expect(result.current.backgroundImage).toBe(
			"center / auto auto repeat url(img.png)",
		);
	});

	it("computes numeric size when size.type is 'numbers'", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				backgroundImage: buildBackgroundImage({
					size: {
						type: "numbers",
						numbers: {
							width: { value: 100, unit: "px" },
							height: { value: 50, unit: "px" },
						},
					},
				}),
				breakpointHeight: buildBreakpointHeight(),
			}),
		);

		expect(result.current.backgroundImage).toBe(
			"0% 0% / 100px 50px repeat url(img.png)",
		);
	});

	it("uses size.type string directly when not 'numbers'", () => {
		const { result } = renderHook(() =>
			useContainerStyle({
				backgroundImage: buildBackgroundImage({
					// keyword sizes carry no numbers object
					size: { type: "cover" } as BackgroundImage["size"],
				}),
				breakpointHeight: buildBreakpointHeight(),
			}),
		);

		expect(result.current.backgroundImage).toBe(
			"0% 0% / cover repeat url(img.png)",
		);
	});
});
