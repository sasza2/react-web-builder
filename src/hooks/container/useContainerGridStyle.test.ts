import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseContainerElementProperties = vi.fn();
const mockUseContainerStyle = vi.fn();

vi.mock("./useContainerElementProperties", () => ({
	useContainerElementProperties: () => mockUseContainerElementProperties(),
}));
vi.mock("@/components/ElementContainer/useContainerStyle", () => ({
	useContainerStyle: (props: never) => mockUseContainerStyle(props),
}));

import { useContainerGridStyle } from "./useContainerGridStyle";

describe("useContainerGridStyle", () => {
	it("passes container element properties to useContainerStyle and returns its result", () => {
		const properties = { border: { enabled: true } };
		mockUseContainerElementProperties.mockReturnValue(properties);
		mockUseContainerStyle.mockReturnValue({ color: "red" });

		const { result } = renderHook(() => useContainerGridStyle());

		expect(mockUseContainerStyle).toHaveBeenCalledWith(properties);
		expect(result.current).toEqual({ color: "red" });
	});
});
