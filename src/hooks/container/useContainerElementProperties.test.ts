import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockGetProperties = vi.fn();
const mockUseContainerElementPropertiesByValue = vi.fn(() => mockGetProperties);

vi.mock("../useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));
vi.mock("./useContainerElementPropertiesByValue", () => ({
	useContainerElementPropertiesByValue: () =>
		mockUseContainerElementPropertiesByValue(),
}));

import { useContainerElementProperties } from "./useContainerElementProperties";

describe("useContainerElementProperties", () => {
	it("calls getProperties with the current breakpoint container", () => {
		const container = { id: "bp-1" } as never;
		mockUseBreakpoint.mockReturnValue(container);
		mockGetProperties.mockReturnValue({ foo: "bar" });

		const { result } = renderHook(() => useContainerElementProperties());

		expect(mockGetProperties).toHaveBeenCalledWith(container);
		expect(result.current).toEqual({ foo: "bar" });
	});
});
