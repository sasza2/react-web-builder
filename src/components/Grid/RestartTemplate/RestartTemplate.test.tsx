import { act, render, renderHook } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { addBreakpoint } from "@/store/breakpointsSlice";
import { createStore } from "@/store/store";

import { buildBreakpoint, buildPage } from "@/testing/fixtures";

import { RestartTemplate, useRestartTemplate } from "./RestartTemplate";

type LoadMultipleBreakpointsProps = ComponentProps<
	typeof import("../LoadMultipleBreakpoints").LoadMultipleBreakpoints
>;

let loadMultipleBreakpointsProps: LoadMultipleBreakpointsProps | null = null;

vi.mock("../LoadMultipleBreakpoints", () => ({
	LoadMultipleBreakpoints: (props: LoadMultipleBreakpointsProps) => {
		loadMultipleBreakpointsProps = props;
		return <div data-testid="load-multiple-breakpoints" />;
	},
}));

const renderWithStore = (ui: React.ReactElement, preloadedState = {}) => {
	const store = createStore(preloadedState);
	return { ...render(<Provider store={store}>{ui}</Provider>), store };
};

const existingBreakpoint = buildBreakpoint({ id: "existing" });

const template = buildPage({
	breakpoints: [
		buildBreakpoint({ id: "tpl-1" }),
		buildBreakpoint({ id: "tpl-2" }),
	],
	backgroundColor: "red",
});

describe("RestartTemplate", () => {
	beforeEach(() => {
		loadMultipleBreakpointsProps = null;
	});

	it("renders children and exposes useRestartTemplate via context", () => {
		const store = createStore({});
		store.dispatch(addBreakpoint({ breakpoint: existingBreakpoint }));

		let restartTemplate: unknown;
		function Consumer() {
			restartTemplate = useRestartTemplate();
			return <span>content</span>;
		}

		const { getByText } = render(
			<Provider store={store}>
				<RestartTemplate>
					<Consumer />
				</RestartTemplate>
			</Provider>,
		);

		expect(getByText("content")).not.toBeNull();
		expect(restartTemplate).toBeInstanceOf(Function);
	});

	it("returns null from useRestartTemplate outside of a provider", () => {
		const { result } = renderHook(() => useRestartTemplate());
		expect(result.current).toBeNull();
	});

	it("does not render LoadMultipleBreakpoints until a restart is triggered", () => {
		const store = createStore({});
		store.dispatch(addBreakpoint({ breakpoint: existingBreakpoint }));

		const { queryByTestId } = renderWithStore(
			<RestartTemplate>
				<span>content</span>
			</RestartTemplate>,
			{ breakpoints: [existingBreakpoint] },
		);

		expect(queryByTestId("load-multiple-breakpoints")).toBeNull();
	});

	it("restarts the template: clears breakpoints, adds new ones on beforeLoadingAll, and resolves the promise on afterLoadingAll", async () => {
		let restartTemplate: ReturnType<typeof useRestartTemplate>;

		function Consumer() {
			restartTemplate = useRestartTemplate();
			return null;
		}

		const { getByTestId, store } = renderWithStore(
			<RestartTemplate>
				<Consumer />
			</RestartTemplate>,
			{ breakpoints: [existingBreakpoint] },
		);

		let restartPromise: Promise<void>;
		act(() => {
			restartPromise = restartTemplate(template);
		});

		expect(getByTestId("load-multiple-breakpoints")).not.toBeNull();
		expect(loadMultipleBreakpointsProps?.breakpoints).toEqual(
			template.breakpoints,
		);

		act(() => {
			loadMultipleBreakpointsProps?.beforeLoadingAll?.();
		});

		expect(store.getState().breakpoints).toEqual(template.breakpoints);

		act(() => {
			loadMultipleBreakpointsProps?.afterLoadingAll?.();
		});

		await expect(restartPromise).resolves.toBeUndefined();
		expect(store.getState().selectedBreakpoint).toBe("tpl-2");
		expect(store.getState().pageSettings.backgroundColor).toBe("red");
	});

	it("rejects a pending restart promise if a new restart is triggered before the first completes", async () => {
		let restartTemplate: ReturnType<typeof useRestartTemplate>;

		function Consumer() {
			restartTemplate = useRestartTemplate();
			return null;
		}

		renderWithStore(
			<RestartTemplate>
				<Consumer />
			</RestartTemplate>,
			{ breakpoints: [existingBreakpoint] },
		);

		let firstPromise: Promise<void>;
		act(() => {
			firstPromise = restartTemplate(template);
		});
		firstPromise.catch(() => {});

		let secondPromise: Promise<void>;
		act(() => {
			secondPromise = restartTemplate({
				...template,
				breakpoints: [buildBreakpoint({ id: "tpl-3" })],
			});
		});
		secondPromise.catch(() => {});

		await expect(firstPromise).rejects.toBeUndefined();
	});

	it("rejects any pending restart promise on unmount", async () => {
		let restartTemplate: ReturnType<typeof useRestartTemplate>;

		function Consumer() {
			restartTemplate = useRestartTemplate();
			return null;
		}

		const { unmount } = renderWithStore(
			<RestartTemplate>
				<Consumer />
			</RestartTemplate>,
			{ breakpoints: [existingBreakpoint] },
		);

		let promise: Promise<void>;
		act(() => {
			promise = restartTemplate(template);
		});
		promise.catch(() => {});

		act(() => {
			unmount();
		});

		await expect(promise).rejects.toBeUndefined();
	});
});
