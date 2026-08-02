import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useProperties } from "@/components/PropertiesProvider";
import { DEFAULT_FONT_IMPORT } from "@/consts";
import { useFontImport } from "./useFontImport";

vi.mock("@/components/PropertiesProvider", () => ({
	useProperties: vi.fn(),
}));

const mockedUseProperties = vi.mocked(useProperties);

describe("useFontImport", () => {
	it("returns DEFAULT_FONT_IMPORT when fonts is not an array", () => {
		mockedUseProperties.mockReturnValue({} as never);

		const { result } = renderHook(() => useFontImport("Arial"));

		expect(result.current).toBe(DEFAULT_FONT_IMPORT);
	});

	it("returns DEFAULT_FONT_IMPORT when the font is not found", () => {
		mockedUseProperties.mockReturnValue({
			fonts: [{ value: "Roboto", label: "Roboto", fontFamily: "Roboto" }],
		} as never);

		const { result } = renderHook(() => useFontImport("Arial"));

		expect(result.current).toBe(DEFAULT_FONT_IMPORT);
	});

	it("returns the matching font when found", () => {
		const font = { value: "Roboto", label: "Roboto", fontFamily: "Roboto" };
		mockedUseProperties.mockReturnValue({
			fonts: [font],
		} as never);

		const { result } = renderHook(() => useFontImport("Roboto"));

		expect(result.current).toEqual(font);
	});

	it("memoizes the result while fonts/selectedFontFamily stay the same", () => {
		const font = { value: "Roboto", label: "Roboto", fontFamily: "Roboto" };
		const fonts = [font];
		mockedUseProperties.mockReturnValue({ fonts } as never);

		const { result, rerender } = renderHook(
			({ selectedFontFamily }) => useFontImport(selectedFontFamily),
			{ initialProps: { selectedFontFamily: "Roboto" } },
		);
		const first = result.current;
		rerender({ selectedFontFamily: "Roboto" });

		expect(result.current).toBe(first);
	});
});
