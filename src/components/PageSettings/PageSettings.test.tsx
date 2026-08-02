import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { beforeEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

const mockUseWebBuilderProperties = vi.fn();
vi.mock("../PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

const mockRestartTemplate = vi.fn();
const mockUseRestartTemplate = vi.fn(() => mockRestartTemplate);
vi.mock("../Grid/RestartTemplate", () => ({
	useRestartTemplate: () => mockUseRestartTemplate(),
}));

vi.mock("../FormProvider", () => ({
	FormProvider: ({
		children,
		getFormValues,
		setForm,
	}: React.PropsWithChildren<{
		getFormValues: () => unknown;
		setForm: (value: unknown) => void;
	}>) => {
		getFormValues();
		React.useEffect(() => {
			setForm({ backgroundColor: "#fff" });
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);
		return <div data-testid="form-provider">{children}</div>;
	},
}));

vi.mock("../forms/ColorPicker", () => ({
	ColorPicker: () => <div data-testid="color-picker" />,
}));

vi.mock("../forms/ColorPicker/CustomColors/PageSettingsCustomColors", () => ({
	PageSettingsCustomColors: () => (
		<div data-testid="page-settings-custom-colors" />
	),
}));

vi.mock("../forms/FontFamily", () => ({
	FontFamily: () => <div data-testid="font-family" />,
}));

vi.mock("../FormProperty", () => ({
	FormProperty: ({ name }: { name: string }) => (
		<div data-testid="form-property">{name}</div>
	),
}));

vi.mock("./UploadPage", () => ({
	UploadPage: () => <div data-testid="upload-page" />,
}));

import { PageSettings } from "./PageSettings";

beforeEach(() => {
	vi.clearAllMocks();
	mockUseRestartTemplate.mockReturnValue(mockRestartTemplate);
});

const renderWithProviders = (
	preloadedState: Partial<Parameters<typeof createStore>[0]> = {},
) => {
	const store = createStore({
		pageSettings: { id: "page-1" } as never,
		...preloadedState,
	});
	return render(
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<PageSettings />
			</ThemeProvider>
		</Provider>,
	);
};

describe("PageSettings", () => {
	it("renders the header, font family and background color fields", () => {
		mockUseWebBuilderProperties.mockReturnValue({});

		renderWithProviders();

		expect(screen.getByText("page.settings.title")).not.toBeNull();
		expect(screen.getByTestId("font-family")).not.toBeNull();
		expect(screen.getByTestId("color-picker")).not.toBeNull();
		expect(screen.getByText("page.background")).not.toBeNull();
	});

	it("does not render the restart section when onTemplateRestart is not provided", () => {
		mockUseWebBuilderProperties.mockReturnValue({});

		renderWithProviders();

		expect(screen.queryByText("page.settings.reset.title")).toBeNull();
	});

	it("does not render the upload page section when enableUpload is falsy", () => {
		mockUseWebBuilderProperties.mockReturnValue({});

		renderWithProviders();

		expect(screen.queryByTestId("upload-page")).toBeNull();
	});

	it("renders the upload page section when enableUpload is true", () => {
		mockUseWebBuilderProperties.mockReturnValue({ enableUpload: true });

		renderWithProviders();

		expect(screen.getByTestId("upload-page")).not.toBeNull();
	});

	it("renders pageSettingsExtra form properties", () => {
		mockUseWebBuilderProperties.mockReturnValue({
			pageSettingsExtra: [{ id: "extra-1" }, { id: "extra-2" }],
		});

		renderWithProviders();

		const items = screen.getAllByTestId("form-property");
		expect(items).toHaveLength(2);
	});

	it("renders the restart section and calls onTemplateRestart + restartTemplate on click", () => {
		const template = { breakpoints: [] };
		const onTemplateRestart = vi.fn(() => template);
		mockUseWebBuilderProperties.mockReturnValue({ onTemplateRestart });

		renderWithProviders();

		expect(screen.getAllByText("page.settings.reset.title").length).toBe(2);
		expect(screen.getByText("page.settings.reset.description")).not.toBeNull();

		const button = screen.getByRole("button", {
			name: "page.settings.reset.title",
		});
		fireEvent.click(button);

		expect(onTemplateRestart).toHaveBeenCalled();
		expect(mockRestartTemplate).toHaveBeenCalledWith(template);
	});

	it("does not call restartTemplate when onTemplateRestart returns a falsy template", () => {
		const onTemplateRestart = vi.fn(() => null);
		mockUseWebBuilderProperties.mockReturnValue({ onTemplateRestart });

		renderWithProviders();

		const button = screen.getByRole("button", {
			name: "page.settings.reset.title",
		});
		fireEvent.click(button);

		expect(onTemplateRestart).toHaveBeenCalled();
		expect(mockRestartTemplate).not.toHaveBeenCalled();
	});

	it("dispatches setViewAnimation(AddElement) when the back button is clicked", () => {
		mockUseWebBuilderProperties.mockReturnValue({});
		const store = createStore({ pageSettings: { id: "page-1" } as never });

		render(
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<PageSettings />
				</ThemeProvider>
			</Provider>,
		);

		const backButton = screen.getByTestId("sidebarBack");
		fireEvent.click(backButton);

		expect(store.getState().sidebar.view).toBe(1);
	});
});
