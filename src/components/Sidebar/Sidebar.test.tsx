import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/BreakpointsForm", () => ({
	AddBreakpoint: () => <div>AddBreakpoint</div>,
	EditBreakpoint: () => <div>EditBreakpoint</div>,
}));

vi.mock("@/components/Configuration", () => ({
	Configuration: () => <div>Configuration</div>,
}));

vi.mock("@/components/WebBuilderSize", () => ({
	useWebBuilderSizeHeight: () => 123,
}));

vi.mock("@/hooks/useBreakpoints", () => ({
	useBreakpoints: vi.fn(() => []),
}));

vi.mock("../ComponentsProvider", () => ({
	useComponentsProperty: () => [],
}));

vi.mock("../EditProperties", () => ({
	EditProperties: () => <div>EditProperties</div>,
}));

vi.mock("../ErrorBoundary", () => ({
	ErrorBoundary: ({ children }: React.PropsWithChildren) => (
		<div>{children}</div>
	),
}));

vi.mock("../PageSettings", () => ({
	PageSettings: () => <div>PageSettings</div>,
}));

vi.mock("../SelectNewElement", () => ({
	SelectNewElement: () => <div>SelectNewElement</div>,
}));

vi.mock("../SidebarProvider/SidebarProvider", async () => {
	const actual = await vi.importActual<
		typeof import("../SidebarProvider/SidebarProvider")
	>("../SidebarProvider/SidebarProvider");
	return {
		...actual,
		useSidebarRef: () => ({ current: null }),
	};
});

vi.mock("./Modal", () => ({
	Modal: () => <div>Modal</div>,
}));

vi.mock("./Resize", () => ({
	Resize: ({ height }: { height: number }) => <div>Resize-{height}</div>,
}));

import { createStore } from "@/store/store";
import { useBreakpoints } from "@/hooks/useBreakpoints";

import { StyleProvider } from "../StyleProvider";
import { SidebarView } from "../SidebarProvider/SidebarProvider";
import { Sidebar } from "./Sidebar";

const renderWithStore = (view: SidebarView | null) => {
	const store = createStore({ sidebar: { view } as never });
	return render(
		<Provider store={store}>
			<StyleProvider>
				<Sidebar />
			</StyleProvider>
		</Provider>,
	);
};

describe("Sidebar", () => {
	it("renders AddBreakpoint view", () => {
		renderWithStore(SidebarView.AddBreakpoint);
		expect(screen.getByText("AddBreakpoint")).not.toBeNull();
	});

	it("renders EditBreakpoint view", () => {
		renderWithStore(SidebarView.EditBreakpoint);
		expect(screen.getByText("EditBreakpoint")).not.toBeNull();
	});

	it("renders EditElement view", () => {
		renderWithStore(SidebarView.EditElement);
		expect(screen.getByText("EditProperties")).not.toBeNull();
	});

	it("renders Configuration view", () => {
		renderWithStore(SidebarView.Configuration);
		expect(screen.getByText("Configuration")).not.toBeNull();
	});

	it("renders PageSettings view", () => {
		renderWithStore(SidebarView.PageSettings);
		expect(screen.getByText("PageSettings")).not.toBeNull();
	});

	it("renders AddBreakpoint when view is null and no breakpoints exist", () => {
		renderWithStore(null);
		expect(screen.getByText("AddBreakpoint")).not.toBeNull();
	});

	it("renders SelectNewElement when view is null and breakpoints exist", () => {
		vi.mocked(useBreakpoints).mockReturnValueOnce([{ id: "1" }] as never);
		renderWithStore(null);
		expect(screen.getByText("SelectNewElement")).not.toBeNull();
	});

	it("renders Resize and Modal with height", () => {
		renderWithStore(SidebarView.Configuration);
		expect(screen.getByText("Resize-123")).not.toBeNull();
		expect(screen.getByText("Modal")).not.toBeNull();
	});

	it("has the sidebar test id on the container", () => {
		renderWithStore(SidebarView.Configuration);
		expect(screen.getByTestId("sidebar")).not.toBeNull();
	});
});
