import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockUseComponentsProperty = vi.fn();
const mockUseWebBuilderProperties = vi.fn();
const mockUsePageSettings = vi.fn();
const mockUseFontImport = vi.fn();
const mockGetDefaultContainer = vi.fn();
const mockCreateTreeForContainer = vi.fn();

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));
vi.mock("@/hooks/useFontImport", () => ({
	useFontImport: (...args: unknown[]) => mockUseFontImport(...args),
}));
vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));
vi.mock("@/utils/container", () => ({
	createTreeForContainer: (...args: unknown[]) =>
		mockCreateTreeForContainer(...args),
	getDefaultContainer: (...args: unknown[]) => mockGetDefaultContainer(...args),
}));
vi.mock("../ComponentsProvider", () => ({
	useComponentsProperty: () => mockUseComponentsProperty(),
}));
vi.mock("../PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));
vi.mock("../View/RenderBreakpoint", () => ({
	RenderBreakpoint: ({ children }: React.PropsWithChildren) => (
		<div data-testid="render-breakpoint">{children}</div>
	),
}));
vi.mock("../View/RenderTree", () => ({
	RenderTree: () => <div data-testid="render-tree" />,
}));

import { PrerenderDefaultContainer } from "./PrerenderDefaultContainer";

describe("PrerenderDefaultContainer", () => {
	beforeEachSetup();

	function beforeEachSetup() {
		beforeEach(() => {
			mockUseComponentsProperty.mockReturnValue({});
			mockUseWebBuilderProperties.mockReturnValue({
				transformElementProperty: vi.fn(),
			});
			mockUsePageSettings.mockReturnValue({ fontFamily: undefined });
			mockUseFontImport.mockReturnValue(null);
			mockGetDefaultContainer.mockReturnValue({ cols: 12 });
			mockCreateTreeForContainer.mockReturnValue({ id: "tree" });
		});
	}

	it("renders null when there is no breakpoint", () => {
		mockUseBreakpoint.mockReturnValue(null);

		const { container } = render(<PrerenderDefaultContainer />);

		expect(container.innerHTML).toBe("");
	});

	it("renders the tree when a breakpoint and default container are available", () => {
		mockUseBreakpoint.mockReturnValue({ id: "bp1" });

		const { getByTestId } = render(<PrerenderDefaultContainer />);

		expect(getByTestId("render-breakpoint")).not.toBeNull();
		expect(getByTestId("render-tree")).not.toBeNull();
		expect(mockGetDefaultContainer).toHaveBeenCalledWith({ id: "bp1" });
		expect(mockCreateTreeForContainer).toHaveBeenCalled();
	});

	it("renders null when defaultContainer resolves but tree creation is skipped (no default container)", () => {
		mockUseBreakpoint.mockReturnValue({ id: "bp1" });
		mockGetDefaultContainer.mockReturnValue(null);

		const { container } = render(<PrerenderDefaultContainer />);

		expect(container.innerHTML).toBe("");
	});
});
