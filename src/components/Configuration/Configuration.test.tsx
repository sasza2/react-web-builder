import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

vi.mock("./ShowHelperTips", () => ({
	ShowHelperTips: () => <div data-testid="show-helper-tips" />,
}));

import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";

import { ConfigurationProvider } from "../ConfigurationProvider";
import { Configuration } from "./Configuration";

const renderConfiguration = () => {
	const store = createStore({});
	return render(
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<ConfigurationProvider>
					<Configuration />
				</ConfigurationProvider>
			</ThemeProvider>
		</Provider>,
	);
};

describe("Configuration", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("renders header, toggle sections and ShowHelperTips", () => {
		renderConfiguration();

		expect(screen.getByText("configuration.title")).not.toBeNull();
		expect(
			screen.getByText("configuration.autoSave.description"),
		).not.toBeNull();
		expect(
			screen.getByText("configuration.mouseWheel.description"),
		).not.toBeNull();
		expect(
			screen.getByText("configuration.gridZooming.description"),
		).not.toBeNull();
		expect(
			screen.getByText("configuration.helpLines.description"),
		).not.toBeNull();
		expect(
			screen.getByText("configuration.bringElementsAbove.description"),
		).not.toBeNull();
		expect(
			screen.getByText("configuration.editOnDoubleClick.description"),
		).not.toBeNull();
		expect(
			screen.getByText("configuration.preventCloseEditOnClick.description"),
		).not.toBeNull();
		expect(
			screen.getByText(
				"configuration.autoFocusRichTextInEditProperties.description",
			),
		).not.toBeNull();
		expect(screen.getByTestId("show-helper-tips")).not.toBeNull();
	});

	it("does not render the scroll speed slider when panZoomScroll is off", () => {
		renderConfiguration();

		expect(
			screen.queryByText("configuration.mouseWheelSpeed.title"),
		).toBeNull();
	});

	it("shows the scroll speed slider when panZoomScroll toggle is turned on", () => {
		renderConfiguration();

		const toggles = screen.getAllByRole("checkbox");
		// mouseWheel toggle is the 2nd toggle in the form
		fireEvent.click(toggles[1]);

		expect(
			screen.getByText("configuration.mouseWheelSpeed.title"),
		).not.toBeNull();
	});

	it("calls setSidebarView(AddElement) when back is clicked", () => {
		renderConfiguration();

		const backButton = screen.getByTestId("sidebarBack");
		fireEvent.click(backButton);
	});
});
