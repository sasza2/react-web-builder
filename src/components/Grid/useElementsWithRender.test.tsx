import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockTransformElementProperty = vi.fn();
const mockComponents = vi.fn();
const mockElements = vi.fn();
const mockCacheGet = vi.fn();
const mockCacheSet = vi.fn();
const mockCacheRemove = vi.fn();
const mockSelectedElementId = vi.fn();
const mockSelectedElements = vi.fn();
const mockUseBreakpoint = vi.fn();
const mockProduceRenderForElement = vi.fn();

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => ({
		transformElementProperty: mockTransformElementProperty,
	}),
}));
vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));
vi.mock("@/hooks/useElements", () => ({
	useElements: () => ({ elements: mockElements() }),
}));
vi.mock("@/hooks/useElementsCache", () => ({
	useElementsCache: () => ({
		get: mockCacheGet,
		set: mockCacheSet,
		remove: mockCacheRemove,
	}),
}));
vi.mock("@/hooks/useSelectedElementId", () => ({
	useSelectedElementId: () => [mockSelectedElementId(), vi.fn()],
}));
vi.mock("@/hooks/useSelectedElements", () => ({
	useSelectedElements: () => ({ selectedElements: mockSelectedElements() }),
}));
vi.mock("@/utils/element", () => ({
	produceRenderForElement: (...args: never[]) =>
		mockProduceRenderForElement(...args),
}));
vi.mock("../ComponentsProvider", () => ({
	useComponentsProperty: () => mockComponents(),
}));

import useElementsWithRender from "./useElementsWithRender";

describe("useElementsWithRender", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseBreakpoint.mockReturnValue({ id: "bp-1" });
		mockComponents.mockReturnValue([]);
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockCacheGet.mockReturnValue(undefined);
		mockProduceRenderForElement.mockReturnValue([() => null, true]);
	});

	it("returns an empty array when there are no elements", () => {
		mockElements.mockReturnValue([]);
		const { result } = renderHook(() => useElementsWithRender());
		expect(result.current).toEqual([]);
	});

	it("removes the currently selected element from the cache before building the list", () => {
		mockElements.mockReturnValue([{ id: "el-1" }]);
		mockSelectedElementId.mockReturnValue("el-1");
		renderHook(() => useElementsWithRender());
		expect(mockCacheRemove).toHaveBeenCalledWith("el-1");
	});

	it("does not touch the cache remove when nothing is selected", () => {
		mockElements.mockReturnValue([{ id: "el-1" }]);
		mockSelectedElementId.mockReturnValue(null);
		renderHook(() => useElementsWithRender());
		expect(mockCacheRemove).not.toHaveBeenCalled();
	});

	it("uses the cached render function when available", () => {
		mockElements.mockReturnValue([{ id: "el-1" }]);
		const cachedRender = () => null;
		mockCacheGet.mockReturnValue(cachedRender);

		const { result } = renderHook(() => useElementsWithRender());

		expect(result.current[0].render).toBe(cachedRender);
		expect(mockProduceRenderForElement).not.toHaveBeenCalled();
		expect(mockCacheSet).not.toHaveBeenCalled();
	});

	it("produces and caches a render function when not present in cache and exists is true", () => {
		mockElements.mockReturnValue([{ id: "el-1" }]);
		const producedRender = () => null;
		mockProduceRenderForElement.mockReturnValue([producedRender, true]);

		const { result } = renderHook(() => useElementsWithRender());

		expect(result.current[0].render).toBe(producedRender);
		expect(mockCacheSet).toHaveBeenCalledWith("el-1", producedRender);
	});

	it("does not cache the render function when exists is false", () => {
		mockElements.mockReturnValue([{ id: "el-1" }]);
		const producedRender = () => null;
		mockProduceRenderForElement.mockReturnValue([producedRender, false]);

		renderHook(() => useElementsWithRender());

		expect(mockCacheSet).not.toHaveBeenCalled();
	});

	it("marks selected elements with family 'common' and fullHeight true", () => {
		mockElements.mockReturnValue([{ id: "el-1" }, { id: "el-2" }]);
		mockSelectedElements.mockReturnValue(["el-1"]);

		const { result } = renderHook(() => useElementsWithRender());

		const el1 = result.current.find((el) => el.id === "el-1");
		const el2 = result.current.find((el) => el.id === "el-2");
		expect(el1.family).toBe("common");
		expect(el2.family).toBeNull();
		expect(el1.fullHeight).toBe(true);
	});

	it("preserves sort order across re-renders, EXCEPT for the element that was first (index 0) - see bug note", () => {
		// NOTE: source code checks `if (sortIndexes.current.get(element.id))`
		// which is falsy for a stored index of 0, so the very first element
		// (assigned sort index 0) is incorrectly treated as "new" on every
		// subsequent render and gets pushed to the end of the order instead
		// of keeping its original position. This test documents that actual
		// (buggy) behavior rather than the presumably-intended one.
		mockElements.mockReturnValue([{ id: "el-1" }, { id: "el-2" }]);

		const { result, rerender } = renderHook(() => useElementsWithRender());
		expect(result.current.map((el) => el.id)).toEqual(["el-1", "el-2"]);

		mockElements.mockReturnValue([
			{ id: "el-2" },
			{ id: "el-1" },
			{ id: "el-3" },
		]);
		rerender();

		expect(result.current.map((el) => el.id)).toEqual(["el-2", "el-1", "el-3"]);
	});
});
