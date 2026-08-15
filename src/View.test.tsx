import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/PropertiesProvider", () => ({
	PropertiesProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="properties-provider">{children}</div>
	),
}));
vi.mock("@/components/StyleProvider", () => ({
	StyleProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="style-provider">{children}</div>
	),
}));
vi.mock("./components/ComponentsProvider", () => ({
	ComponentsProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="components-provider">{children}</div>
	),
}));
vi.mock("./components/ElementAnchor/ViewElementAnchor", () => ({
	ViewElementAnchor: () => <div data-testid="view-element-anchor" />,
}));
vi.mock("./components/ElementContainer/ViewElementContainer", () => ({
	ViewElementContainer: () => <div data-testid="view-element-container" />,
}));
vi.mock("./components/I18nProvider", () => ({
	I18nProvider: ({ children }: React.PropsWithChildren) => (
		<div data-testid="i18n-provider">{children}</div>
	),
}));
vi.mock("./components/View", () => ({
	ViewRenderPage: () => <div data-testid="view-render-page" />,
}));
vi.mock("./View.styled", () => ({
	ViewGlobalStyles: () => <div data-testid="view-global-styles" />,
}));

import { buildPage } from "@/testing/fixtures";

import View from "./View";

describe("View", () => {
	it("renders the full provider tree and page content", () => {
		const page = buildPage();
		const { getByTestId } = render(<View page={page} />);

		expect(getByTestId("properties-provider")).not.toBeNull();
		expect(getByTestId("components-provider")).not.toBeNull();
		expect(getByTestId("style-provider")).not.toBeNull();
		expect(getByTestId("i18n-provider")).not.toBeNull();
		expect(getByTestId("view-render-page")).not.toBeNull();
		expect(getByTestId("view-global-styles")).not.toBeNull();
	});
});
