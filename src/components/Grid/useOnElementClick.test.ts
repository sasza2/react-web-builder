import { renderHook } from "@testing-library/react";
import type { GridElement } from "react-grid-panzoom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockToastInfo = vi.fn();
const mockElements = vi.fn();
const mockSelectedElementId = vi.fn();
const mockSetSelectedElementId = vi.fn();
const mockSelectedElements = vi.fn();
const mockSetSelectedElements = vi.fn();
const mockToggleSelectedElement = vi.fn();
const mockConfiguration = vi.fn();
const mockIsDoubleClickOnElement = vi.fn();
const mockHasFocusOnInput = vi.fn();
const mockBlurInput = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("react-toastify", () => ({
	toast: { info: (...args: never[]) => mockToastInfo(...args) },
}));
vi.mock("@/hooks/useElements", () => ({
	useElements: () => mockElements(),
}));
vi.mock("@/hooks/useSelectedElementId", () => ({
	useSelectedElementId: () => [
		mockSelectedElementId(),
		mockSetSelectedElementId,
	],
}));
vi.mock("@/hooks/useSelectedElements", () => ({
	useSelectedElements: () => ({
		selectedElements: mockSelectedElements(),
		setSelectedElements: mockSetSelectedElements,
		toggleSelectedElement: mockToggleSelectedElement,
	}),
}));
vi.mock("@/utils/input", () => ({
	blurInput: (...args: never[]) => mockBlurInput(...args),
	hasFocusOnInput: (...args: never[]) => mockHasFocusOnInput(...args),
}));
vi.mock("../ConfigurationProvider", () => ({
	useConfiguration: () => mockConfiguration(),
}));
vi.mock("./useIsDoubleClickOnElement", () => ({
	useIsDoubleClickOnElement: () => mockIsDoubleClickOnElement,
}));

import { buildElement } from "@/testing/fixtures";

import useOnElementClick from "./useOnElementClick";

const setup = () => {
	const { result } = renderHook(() => useOnElementClick());
	return result.current;
};

const buildE = (options: { shiftKey?: boolean } = {}) =>
	new MouseEvent("click", { shiftKey: false, ...options });

const buildGridElement = (element: Partial<GridElement> = {}): GridElement => ({
	id: "el-1",
	x: 0,
	y: 0,
	render: () => null,
	...element,
});

describe("useOnElementClick", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });
		mockHasFocusOnInput.mockReturnValue(false);
		mockIsDoubleClickOnElement.mockReturnValue(true);
	});

	it("does nothing when id is falsy", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: undefined }), {
			e: buildE(),
			stop,
		});

		expect(mockSetSelectedElementId).not.toHaveBeenCalled();
	});

	it("blurs input and returns early when focus is on an input", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });
		mockHasFocusOnInput.mockReturnValue(true);

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), { e: buildE(), stop });

		expect(mockBlurInput).toHaveBeenCalled();
		expect(mockSetSelectedElementId).not.toHaveBeenCalled();
	});

	it("shows a toast when the element is locked (disabledMove)", () => {
		mockElements.mockReturnValue({
			elements: [buildElement({ id: "el-1", disabledMove: true })],
		});
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), { e: buildE(), stop });

		expect(mockToastInfo).toHaveBeenCalledWith("element.lockInfo");
	});

	it("toggles the element and stops propagation on shift-click", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), {
			e: buildE({ shiftKey: true }),
			stop,
		});

		expect(mockToggleSelectedElement).toHaveBeenCalledWith("el-1");
		expect(stop).toHaveBeenCalled();
		expect(mockSetSelectedElementId).not.toHaveBeenCalled();
	});

	it("clears the selection when clicking an element outside the current selection", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue(["el-2"]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), { e: buildE(), stop });

		expect(mockSetSelectedElements).toHaveBeenCalledWith([]);
		expect(mockSetSelectedElementId).toHaveBeenCalledWith("el-1");
	});

	it("does not clear selection when the clicked element is already selected", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue(["el-1"]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), { e: buildE(), stop });

		expect(mockSetSelectedElements).not.toHaveBeenCalled();
		expect(mockSetSelectedElementId).toHaveBeenCalledWith("el-1");
	});

	it("returns early when the clicked element is already the selected element", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue("el-1");
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: false });

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), { e: buildE(), stop });

		expect(mockSetSelectedElementId).not.toHaveBeenCalled();
	});

	it("waits for a double-click when editOnDoubleClick is enabled and it is not a double click", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: true });
		mockIsDoubleClickOnElement.mockReturnValue(false);

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), { e: buildE(), stop });

		expect(mockSetSelectedElementId).not.toHaveBeenCalled();
	});

	it("selects the element on a double click when editOnDoubleClick is enabled", () => {
		mockElements.mockReturnValue({ elements: [] });
		mockSelectedElementId.mockReturnValue(null);
		mockSelectedElements.mockReturnValue([]);
		mockConfiguration.mockReturnValue({ editOnDoubleClick: true });
		mockIsDoubleClickOnElement.mockReturnValue(true);

		const onElementClick = setup();
		const stop = vi.fn();
		onElementClick(buildGridElement({ id: "el-1" }), { e: buildE(), stop });

		expect(mockSetSelectedElementId).toHaveBeenCalledWith("el-1");
	});
});
