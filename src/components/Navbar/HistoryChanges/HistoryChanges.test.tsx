import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";

import { HistoryChanges } from "./HistoryChanges";

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

const renderWithProviders = (preloadedState: Record<string, unknown> = {}) => {
	const store = createStore(preloadedState as never);
	return {
		store,
		...render(
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<HistoryChanges />
				</ThemeProvider>
			</Provider>,
		),
	};
};

describe("HistoryChanges", () => {
	it("disables undo when index is 0 and disables redo when index equals history length", () => {
		renderWithProviders({
			changes: {
				history: [],
				index: 0,
				initial: {},
				pushKey: "",
				saved: true,
				undoKey: "",
			},
		});

		const undoButton = screen.getByTestId("historyUndo");
		const redoButton = screen.getByTestId("historyRedo");

		expect(undoButton.hasAttribute("disabled")).toBe(true);
		expect(redoButton.hasAttribute("disabled")).toBe(true);
	});

	it("enables undo when index > 0 and dispatches undoChanges on click", () => {
		const action = { type: "someAction" };
		const { store } = renderWithProviders({
			changes: {
				history: [{ action, key: "1", time: 1 }],
				index: 1,
				initial: {},
				pushKey: "",
				saved: true,
				undoKey: "",
			},
		});

		const undoButton = screen.getByTestId("historyUndo");
		expect(undoButton.hasAttribute("disabled")).toBe(false);

		fireEvent.click(undoButton);
		expect(store.getState().changes.index).toBe(0);
	});

	it("enables redo when index < history length and dispatches redoChanges on click", () => {
		const action = { type: "someAction" };
		const { store } = renderWithProviders({
			changes: {
				history: [{ action, key: "1", time: 1 }],
				index: 0,
				initial: {},
				pushKey: "",
				saved: true,
				undoKey: "",
			},
		});

		const redoButton = screen.getByTestId("historyRedo");
		expect(redoButton.hasAttribute("disabled")).toBe(false);

		fireEvent.click(redoButton);
		expect(store.getState().changes.index).toBe(1);
	});
});
