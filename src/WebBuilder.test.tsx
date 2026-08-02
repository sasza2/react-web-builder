import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ConfigurationProvider", () => ({
	ConfigurationProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="configuration-provider">{children}</div>
	),
}));
vi.mock("@/components/ElementsProvider", () => ({
	ElementsProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="elements-provider">{children}</div>
	),
}));
vi.mock("@/components/Grid", () => ({
	Grid: () => <div data-testid="grid" />,
}));
vi.mock("@/components/GridAPIProvider", () => ({
	GridAPIProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="grid-api-provider">{children}</div>
	),
}));
vi.mock("@/components/Navbar", () => ({
	Navbar: () => <div data-testid="navbar" />,
	NavbarProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="navbar-provider">{children}</div>
	),
}));
vi.mock("@/components/PropertiesProvider", () => ({
	PropertiesProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="properties-provider">{children}</div>
	),
}));
vi.mock("@/components/Sidebar", () => ({
	Sidebar: () => <div data-testid="sidebar" />,
}));
vi.mock("@/components/SidebarProvider", () => ({
	SidebarProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="sidebar-provider">{children}</div>
	),
}));
vi.mock("@/components/StyleProvider", () => ({
	StyleProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="style-provider">{children}</div>
	),
}));
vi.mock("@/components/WebBuilderSize", () => ({
	WebBuilderSizeProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="web-builder-size-provider">{children}</div>
	),
}));
vi.mock("./components/AutoSave", () => ({
	AutoSave: ({ children }: React.PropsWithChildren) => (
		<div data-testid="auto-save">{children}</div>
	),
}));
vi.mock("./components/BeforeUnload", () => ({
	BeforeUnload: () => <div data-testid="before-unload" />,
}));
vi.mock("./components/ComponentsProvider", () => ({
	ComponentsProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="components-provider">{children}</div>
	),
}));
vi.mock("./components/ElementAnchor/BuilderElementAnchor", () => ({
	BuilderElementAnchor: () => <div data-testid="builder-element-anchor" />,
}));
vi.mock("./components/ElementContainer/BuilderElementContainer", () => ({
	BuilderElementContainer: () => (
		<div data-testid="builder-element-container" />
	),
}));
vi.mock("./components/Grid/LoadTemplate", () => ({
	LoadTemplate: ({ children }: React.PropsWithChildren) => (
		<div data-testid="load-template">{children}</div>
	),
}));
vi.mock("./components/Hints", () => ({
	BuilderHints: () => <div data-testid="builder-hints" />,
}));
vi.mock("./components/HistoryOfElementsExtras", () => ({
	HistoryOfElementsExtras: () => (
		<div data-testid="history-of-elements-extras" />
	),
}));
vi.mock("./components/I18nProvider", () => ({
	I18nProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="i18n-provider">{children}</div>
	),
}));
vi.mock("./components/PrerenderDefaultContainer", () => ({
	PrerenderDefaultContainer: () => (
		<div data-testid="prerender-default-container" />
	),
}));
vi.mock("./components/ToastContainer", () => ({
	ToastContainer: () => <div data-testid="toast-container" />,
}));
vi.mock("./LoadFont", () => ({
	LoadFont: () => <div data-testid="load-font" />,
}));
vi.mock("./store/StoreProvider", () => ({
	StoreProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="store-provider">{children}</div>
	),
}));
vi.mock("./View.styled", () => ({
	ViewGlobalStyles: () => <div data-testid="view-global-styles" />,
}));
vi.mock("./WebBuilder.styled", () => ({
	GlobalStyles: () => <div data-testid="global-styles" />,
}));

import WebBuilder from "./WebBuilder";

describe("WebBuilder", () => {
	it("renders the full provider tree and builder content", () => {
		const { getByTestId } = render(<WebBuilder />);

		expect(getByTestId("properties-provider")).not.toBeNull();
		expect(getByTestId("components-provider")).not.toBeNull();
		expect(getByTestId("store-provider")).not.toBeNull();
		expect(getByTestId("configuration-provider")).not.toBeNull();
		expect(getByTestId("grid-api-provider")).not.toBeNull();
		expect(getByTestId("elements-provider")).not.toBeNull();
		expect(getByTestId("sidebar-provider")).not.toBeNull();
		expect(getByTestId("web-builder-size-provider")).not.toBeNull();
		expect(getByTestId("navbar-provider")).not.toBeNull();
		expect(getByTestId("auto-save")).not.toBeNull();
		expect(getByTestId("style-provider")).not.toBeNull();
		expect(getByTestId("i18n-provider")).not.toBeNull();
		expect(getByTestId("history-of-elements-extras")).not.toBeNull();
		expect(getByTestId("load-template")).not.toBeNull();
		expect(getByTestId("before-unload")).not.toBeNull();
		expect(getByTestId("navbar")).not.toBeNull();
		expect(getByTestId("grid")).not.toBeNull();
		expect(getByTestId("sidebar")).not.toBeNull();
		expect(getByTestId("builder-hints")).not.toBeNull();
		expect(getByTestId("toast-container")).not.toBeNull();
		expect(getByTestId("prerender-default-container")).not.toBeNull();
		expect(getByTestId("load-font")).not.toBeNull();
		expect(getByTestId("global-styles")).not.toBeNull();
		expect(getByTestId("view-global-styles")).not.toBeNull();
	});
});
