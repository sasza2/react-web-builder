import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

const mockGetPanZoom = vi.fn();
vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: () => ({ current: { getPanZoom: mockGetPanZoom } }),
}));

vi.mock("@/components/Hints", () => ({
	Hints: ({ list }: { list: unknown[] }) => (
		<div data-testid="hints">{list.length}</div>
	),
}));

vi.mock("@/components/View/createTreeElements", () => ({
	default: vi.fn(() => ({ tree: true })),
}));

vi.mock("@/components/View/getBreakpointRowsByLastElement", () => ({
	default: vi.fn(() => 2),
}));

vi.mock("@/hooks/container/useContainerHintsList", () => ({
	useContainerHintsList: () => [{ selector: "a", title: "b" }],
}));

const mockUseBreakpoint = vi.fn();
vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

const mockUseBreakpoints = vi.fn();
vi.mock("@/hooks/useBreakpoints", () => ({
	useBreakpoints: () => mockUseBreakpoints(),
}));

const mockUseElements = vi.fn();
vi.mock("@/hooks/useElements", () => ({
	useElements: () => mockUseElements(),
}));

const mockUseSelectedElementId = vi.fn();
vi.mock("@/hooks/useSelectedElementId", () => ({
	useSelectedElementId: () => mockUseSelectedElementId(),
}));

const mockDispatch = vi.fn();
vi.mock("@/store/useAppDispatch", () => ({
	useAppDispatch: () => mockDispatch,
}));

vi.mock("@/store/useAppSelector", () => ({
	useAppSelector: (selector: (state: unknown) => unknown) =>
		selector({
			elementsInBreakpoints: {
				"container-1": [{ id: "el1" }],
			},
		}),
}));

vi.mock("@/store/elementsInBreakpointsSlice", () => ({
	openContainer: (payload: unknown) => ({ type: "openContainer", payload }),
}));

vi.mock("@/utils/breakpoint", () => ({
	byBreakpointId: (id: string) => (bp: { id: string }) => bp.id === id,
}));

vi.mock("@/utils/container", () => ({
	getContainerExtras: vi.fn(() => ({ el1: { height: 10 } })),
}));

vi.mock("@/utils/element", () => ({
	getElementContainerIdProp: (props: Record<string, unknown>) =>
		props?.containerId ?? null,
	getElementFromList: (id: string, elements: { id: string }[]) =>
		elements.find((el) => el.id === id),
}));

vi.mock("@/utils/templates", () => ({
	calculatePositionsOfElements: vi.fn(() => ({ positioned: true })),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { OpenContainer } from "./OpenContainer";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("OpenContainer", () => {
	beforeEach(() => {
		mockDispatch.mockClear();
		mockGetPanZoom.mockReturnValue({ getZoom: () => 1 });
		mockUseBreakpoint.mockReturnValue({ id: "bp1" });
		mockUseBreakpoints.mockReturnValue([{ id: "container-1", cols: 12 }]);
		mockUseSelectedElementId.mockReturnValue(["el1"]);
	});

	it("renders header, description and button", () => {
		mockUseElements.mockReturnValue({
			elements: [{ id: "el1", props: {} }],
			elementsExtras: { current: { bp1: {} } },
		});

		renderWithTheme(<OpenContainer id="el1" />);

		expect(screen.getByText("container.content")).not.toBeNull();
		expect(screen.getByText("container.description")).not.toBeNull();
		expect(screen.getByText("container.button")).not.toBeNull();
		expect(screen.getByTestId("hints")).not.toBeNull();
	});

	it("does nothing when there's no container id", () => {
		mockUseElements.mockReturnValue({
			elements: [{ id: "el1", props: {} }],
			elementsExtras: { current: { bp1: {} } },
		});

		renderWithTheme(<OpenContainer id="el1" />);
		fireEvent.click(screen.getByText("container.button"));

		expect(mockDispatch).not.toHaveBeenCalled();
	});

	it("dispatches openContainer when a container id is set", () => {
		mockUseElements.mockReturnValue({
			elements: [
				{ id: "el1", props: { containerId: { value: "container-1" } } },
			],
			elementsExtras: { current: { bp1: { el1: {} }, "container-1": {} } },
		});

		renderWithTheme(<OpenContainer id="el1" testId="open" />);
		fireEvent.click(screen.getByText("container.button"));

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "openContainer",
			payload: {
				breakpointId: "container-1",
				elements: { positioned: true },
			},
		});
	});
});
