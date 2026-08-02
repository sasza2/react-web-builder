import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import * as PropertiesProviderModule from "../PropertiesProvider";
import theme from "@/components/StyleProvider/theme";
import * as useOnNavbarIconClickModule from "@/hooks/useOnNavbarIconClick";
import * as usePagePreviewModule from "@/hooks/usePagePreview";
import * as useSetSidebarViewModule from "@/hooks/useSetSidebarView";
import * as useSidebarViewModule from "@/hooks/useSidebarView";

import { Navbar } from "./Navbar";
import { SidebarView } from "@/components/SidebarProvider";

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

vi.mock("./BreakpointsSelect", () => ({
	BreakpointsSelect: () => <div data-testid="breakpoints-select" />,
}));

vi.mock("./HistoryChanges", () => ({
	HistoryChanges: () => <div data-testid="history-changes" />,
}));

vi.mock("./PublishButton", () => ({
	PublishButton: () => <div data-testid="publish-button" />,
}));

vi.mock("../PropertiesProvider", () => ({
	useWebBuilderProperties: vi.fn(),
}));

vi.mock("@/hooks/useOnNavbarIconClick", () => ({
	useOnNavbarIconClick: vi.fn(),
}));

vi.mock("@/hooks/usePagePreview", () => ({
	usePagePreview: vi.fn(),
}));

vi.mock("@/hooks/useSetSidebarView", () => ({
	useSetSidebarView: vi.fn(),
}));

vi.mock("@/hooks/useSidebarView", () => ({
	useSidebar: vi.fn(),
}));

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Navbar", () => {
	const setSidebarView = vi.fn();
	const onNavbarIconClick = vi.fn();

	beforeEach(() => {
		(
			useSetSidebarViewModule.useSetSidebarView as ReturnType<typeof vi.fn>
		).mockReturnValue(setSidebarView);
		(
			useOnNavbarIconClickModule.useOnNavbarIconClick as ReturnType<
				typeof vi.fn
			>
		).mockReturnValue(onNavbarIconClick);
		(
			useSidebarViewModule.useSidebar as ReturnType<typeof vi.fn>
		).mockReturnValue({
			view: null,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders without navbar icons and without the preview button when onPagePreview is not configured", () => {
		(
			PropertiesProviderModule.useWebBuilderProperties as ReturnType<
				typeof vi.fn
			>
		).mockReturnValue({ navbarIcons: null });
		(
			usePagePreviewModule.usePagePreview as ReturnType<typeof vi.fn>
		).mockReturnValue(undefined);

		const { container } = renderWithTheme(<Navbar />);

		expect(screen.getByTestId("navbar")).not.toBeNull();
		expect(screen.getByTestId("breakpoints-select")).not.toBeNull();
		expect(screen.getByTestId("history-changes")).not.toBeNull();
		expect(screen.getByTestId("publish-button")).not.toBeNull();
		expect(container.querySelector('[data-icon-id="preview"]')).toBeNull();
	});

	it("renders navbar icons and the preview button when configured, and dispatches navbar-icon clicks", () => {
		(
			PropertiesProviderModule.useWebBuilderProperties as ReturnType<
				typeof vi.fn
			>
		).mockReturnValue({
			navbarIcons: [{ id: "custom1", icon: () => null, tooltip: "custom" }],
		});
		const onPageView = vi.fn();
		(
			usePagePreviewModule.usePagePreview as ReturnType<typeof vi.fn>
		).mockReturnValue(onPageView);

		const { container } = renderWithTheme(<Navbar />);

		const previewButton = container.querySelector('[data-icon-id="preview"]');
		const customButton = container.querySelector('[data-icon-id="custom1"]');
		expect(previewButton).not.toBeNull();
		expect(customButton).not.toBeNull();

		fireEvent.click(customButton as Element);
		expect(onNavbarIconClick).toHaveBeenCalledWith({
			id: "custom1",
			icon: expect.any(Function),
			tooltip: "custom",
		});

		fireEvent.click(previewButton as Element);
		expect(onPageView).toHaveBeenCalled();
	});

	it("opens the page settings and configuration sidebar views on click, reflecting active state", () => {
		(
			PropertiesProviderModule.useWebBuilderProperties as ReturnType<
				typeof vi.fn
			>
		).mockReturnValue({ navbarIcons: null });
		(
			usePagePreviewModule.usePagePreview as ReturnType<typeof vi.fn>
		).mockReturnValue(undefined);
		(
			useSidebarViewModule.useSidebar as ReturnType<typeof vi.fn>
		).mockReturnValue({
			view: SidebarView.PageSettings,
		});

		const { container } = renderWithTheme(<Navbar />);

		fireEvent.click(
			container.querySelector('[data-icon-id="pageSettings"]') as Element,
		);
		expect(setSidebarView).toHaveBeenCalledWith(SidebarView.PageSettings);

		fireEvent.click(
			container.querySelector('[data-icon-id="configuration"]') as Element,
		);
		expect(setSidebarView).toHaveBeenCalledWith(SidebarView.Configuration);
	});
});
