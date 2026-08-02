import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import * as PropertiesProviderModule from "@/components/PropertiesProvider";
import * as useDownloadPageModule from "@/hooks/page/useDownloadPage";
import * as usePagePublishModule from "@/hooks/usePagePublish";
import * as usePageSaveAsDraftModule from "@/hooks/usePageSaveAsDraft";

import { PublishButton } from "./PublishButton";

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: vi.fn(),
}));

vi.mock("@/hooks/page/useDownloadPage", () => ({
	useDownloadPage: vi.fn(),
}));

vi.mock("@/hooks/usePagePublish", () => ({
	usePagePublish: vi.fn(),
}));

vi.mock("@/hooks/usePageSaveAsDraft", () => ({
	usePageSaveAsDraft: vi.fn(),
}));

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("PublishButton", () => {
	const pagePublish = vi.fn();
	const pageSaveAsDraft = vi.fn();
	const download = vi.fn();

	beforeEach(() => {
		vi.useFakeTimers();
		(
			usePagePublishModule.usePagePublish as ReturnType<typeof vi.fn>
		).mockReturnValue(pagePublish);
		(
			usePageSaveAsDraftModule.usePageSaveAsDraft as ReturnType<typeof vi.fn>
		).mockReturnValue(pageSaveAsDraft);
		(
			useDownloadPageModule.useDownloadPage as ReturnType<typeof vi.fn>
		).mockReturnValue(download);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("shows only saveAndPublish and saveAsDraft items when enableDownload is false and onExit is not provided", () => {
		(
			PropertiesProviderModule.useWebBuilderProperties as ReturnType<
				typeof vi.fn
			>
		).mockReturnValue({ enableDownload: false, onExit: undefined });

		renderWithTheme(<PublishButton />);

		fireEvent.click(screen.getByTestId("publishButton"));

		expect(screen.getByTestId("saveAndPublish")).not.toBeNull();
		expect(screen.getByTestId("saveAsDraft")).not.toBeNull();
		expect(screen.queryByTestId("download")).toBeNull();
		expect(screen.queryByText("publish.exit")).toBeNull();
	});

	it("shows download and exit items when enableDownload and onExit are provided, and clicking each fires the handler", () => {
		const onExit = vi.fn();
		(
			PropertiesProviderModule.useWebBuilderProperties as ReturnType<
				typeof vi.fn
			>
		).mockReturnValue({ enableDownload: true, onExit });

		renderWithTheme(<PublishButton />);

		fireEvent.click(screen.getByTestId("publishButton"));

		fireEvent.click(screen.getByTestId("saveAndPublish"));
		expect(pagePublish).toHaveBeenCalled();

		fireEvent.click(screen.getByTestId("saveAsDraft"));
		expect(pageSaveAsDraft).toHaveBeenCalled();

		fireEvent.click(screen.getByTestId("download"));
		expect(download).toHaveBeenCalled();

		fireEvent.click(screen.getByText("publish.exit"));
		expect(onExit).toHaveBeenCalled();
	});

	it("does not reopen when already open, closes on outside pointerdown after the timeout, and cleans up the listener on unmount", () => {
		(
			PropertiesProviderModule.useWebBuilderProperties as ReturnType<
				typeof vi.fn
			>
		).mockReturnValue({ enableDownload: false, onExit: undefined });

		const { unmount } = renderWithTheme(<PublishButton />);

		const trigger = screen.getByTestId("publishButton");
		fireEvent.click(trigger);
		fireEvent.click(trigger);

		fireEvent.pointerDown(window);

		act(() => {
			vi.advanceTimersByTime(300);
		});

		unmount();
	});
});
