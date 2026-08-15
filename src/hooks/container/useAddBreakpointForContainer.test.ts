import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockDispatch = vi.fn();
const mockAddBreakpoint = vi.fn();
const mockUseBreakpoint = vi.fn();
const mockUseElements = vi.fn();
const mockCreateElementsForContainer = vi.fn();
const mockGetDefaultContainer = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("@/store/useAppDispatch", () => ({
	useAppDispatch: () => mockDispatch,
}));
vi.mock("@/store/elementsInBreakpointsSlice", () => ({
	setElementsInBreakpointProgrammatic: (payload: never) => ({
		type: "setElementsInBreakpointProgrammatic",
		payload,
	}),
}));
vi.mock("@/utils/container", () => ({
	createElementsForContainer: (...args: never[]) =>
		mockCreateElementsForContainer(...args),
	getDefaultContainer: (...args: never[]) => mockGetDefaultContainer(...args),
}));
vi.mock("../useAddBreakpoint", () => ({
	useAddBreakpoint: () => mockAddBreakpoint,
}));
vi.mock("../useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));
vi.mock("../useElements", () => ({
	useElements: () => mockUseElements(),
}));

import { useAddBreakpointForContainer } from "./useAddBreakpointForContainer";

describe("useAddBreakpointForContainer", () => {
	it("creates a container breakpoint, builds elementsExtras and dispatches elements", () => {
		const parent = { id: "parent-1" };
		mockUseBreakpoint.mockReturnValue(parent);

		const elementsExtras = { current: {} };
		mockUseElements.mockReturnValue({ elementsExtras });

		const defaultContainer = { id: "default-container" };
		mockGetDefaultContainer.mockReturnValue(defaultContainer);

		const newContainer = { id: "new-container-1" };
		mockAddBreakpoint.mockReturnValue(newContainer);

		const elements = [{ id: "el-1" }, { id: "el-2" }];
		const measureContainerElement = vi.fn((id: string) =>
			id === "el-1" ? 10 : 20,
		);
		const getPaddingBottom = vi.fn((id: string) => (id === "el-1" ? 1 : 2));
		mockCreateElementsForContainer.mockReturnValue({
			elements,
			getPaddingBottom,
			measureContainerElement,
		});

		const { result } = renderHook(() => useAddBreakpointForContainer());

		const returnedId = result.current();

		expect(mockGetDefaultContainer).toHaveBeenCalledWith(parent);
		expect(mockAddBreakpoint).toHaveBeenCalledWith(defaultContainer, {
			silent: true,
		});
		expect(mockCreateElementsForContainer).toHaveBeenCalledWith(
			newContainer,
			parent,
			expect.any(Function),
		);
		expect(elementsExtras.current[newContainer.id]).toEqual({
			"el-1": { height: 10, paddingBottom: 1 },
			"el-2": { height: 20, paddingBottom: 2 },
		});
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "setElementsInBreakpointProgrammatic",
			payload: { elements, breakpointId: newContainer.id },
		});
		expect(returnedId).toBe(newContainer.id);
	});
});
