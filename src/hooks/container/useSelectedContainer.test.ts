import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseElements = vi.fn();
const mockUseSelectedElementId = vi.fn();
const mockUseBreakpoints = vi.fn();

vi.mock("../useElements", () => ({
	useElements: () => mockUseElements(),
}));
vi.mock("../useSelectedElementId", () => ({
	useSelectedElementId: () => mockUseSelectedElementId(),
}));
vi.mock("../useBreakpoints", () => ({
	useBreakpoints: () => mockUseBreakpoints(),
}));

import { useSelectedContainer } from "./useSelectedContainer";

const element = {
	id: "el-1",
	props: [{ propId: "containerId", value: "container-1" }],
};
const breakpoint = { id: "container-1" };

describe("useSelectedContainer", () => {
	it("returns [null, undefined] when no element is selected", () => {
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseSelectedElementId.mockReturnValue([null]);
		mockUseBreakpoints.mockReturnValue([]);

		const { result } = renderHook(() => useSelectedContainer());

		expect(result.current[0]).toBeNull();
		expect(result.current[1]).toBeUndefined();
	});

	it("returns element and its container breakpoint when found", () => {
		mockUseElements.mockReturnValue({ elements: [element] });
		mockUseSelectedElementId.mockReturnValue(["el-1"]);
		mockUseBreakpoints.mockReturnValue([breakpoint]);

		const { result } = renderHook(() => useSelectedContainer());

		expect(result.current[0]).toEqual(element);
		expect(result.current[1]).toEqual(breakpoint);
	});

	it("returns undefined container when containerId doesn't match any breakpoint", () => {
		mockUseElements.mockReturnValue({ elements: [element] });
		mockUseSelectedElementId.mockReturnValue(["el-1"]);
		mockUseBreakpoints.mockReturnValue([{ id: "other" }]);

		const { result } = renderHook(() => useSelectedContainer());

		expect(result.current[0]).toEqual(element);
		expect(result.current[1]).toBeUndefined();
	});
});
