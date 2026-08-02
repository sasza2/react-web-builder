import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import type { Breakpoint } from "types";

import { useField } from "@/components/FormProvider";
import { SidebarView } from "@/components/SidebarProvider";
import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";

import { BreakpointsSelect } from "./BreakpointsSelect";

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

vi.mock("@/components/forms/Select", () => ({
	Select: (props: {
		name: string;
		disabled?: boolean;
		menuTooltip?: string;
		options: Array<{ value: unknown; label: unknown }>;
	}) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { value, setValue } = useField<string>(props.name);
		return (
			<div
				data-testid="mock-select"
				data-value={String(value)}
				data-disabled={String(!!props.disabled)}
				data-tooltip={props.menuTooltip}
			>
				{props.options.map((option) => (
					<button
						key={String(option.value)}
						type="button"
						data-testid={`option-${option.value}`}
						onClick={() => setValue(option.value as string)}
					>
						{String(option.value)}
					</button>
				))}
			</div>
		);
	},
}));

const renderWithProviders = (preloadedState: Record<string, unknown> = {}) => {
	const store = createStore(preloadedState as never);
	return {
		store,
		...render(
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<BreakpointsSelect />
				</ThemeProvider>
			</Provider>,
		),
	};
};

const makeBreakpoint = (overrides: Partial<Breakpoint> = {}): Breakpoint =>
	({
		id: "bp1",
		from: 0,
		to: null,
		parentId: null,
		...overrides,
	}) as Breakpoint;

describe("BreakpointsSelect", () => {
	it("renders the enabled select when no breakpoint is selected, and clicking opens AddBreakpoint sidebar", () => {
		const { store } = renderWithProviders({
			breakpoints: [makeBreakpoint({ id: "bp1", from: 0, to: 767 })],
			selectedBreakpoint: null,
		});

		const select = screen.getByTestId("mock-select");
		expect(select.getAttribute("data-disabled")).toBe("false");
		expect(select.getAttribute("data-value")).toBe("-");

		fireEvent.click(screen.getByTestId("breakpointSelect"));
		expect(store.getState().sidebar.view).toBe(SidebarView.AddBreakpoint);
	});

	it("clicking opens EditBreakpoint sidebar when a breakpoint is selected", () => {
		const { store } = renderWithProviders({
			breakpoints: [makeBreakpoint({ id: "bp1", from: 0, to: 767 })],
			selectedBreakpoint: "bp1",
		});

		fireEvent.click(screen.getByTestId("breakpointSelect"));
		expect(store.getState().sidebar.view).toBe(SidebarView.EditBreakpoint);
	});

	it("renders the disabled select for container breakpoints and does not respond to clicks", () => {
		const { store } = renderWithProviders({
			breakpoints: [
				makeBreakpoint({
					id: "container1",
					from: 0,
					to: null,
					parentId: "bp1",
				}),
			],
			selectedBreakpoint: "container1",
		});

		const select = screen.getByTestId("mock-select");
		expect(select.getAttribute("data-disabled")).toBe("true");
		expect(select.getAttribute("data-value")).toBe("container");

		fireEvent.click(screen.getByTestId("breakpointSelect"));
		expect(store.getState().sidebar.view).toBe(null);
	});

	it("builds option labels for multiple breakpoints (with/without a next breakpoint and open-ended `to`)", () => {
		renderWithProviders({
			breakpoints: [
				makeBreakpoint({ id: "bp1", from: 0, to: 767 }),
				makeBreakpoint({ id: "bp2", from: 768, to: null }),
			],
			selectedBreakpoint: "bp1",
		});

		expect(screen.getByTestId("option-bp1")).not.toBeNull();
		expect(screen.getByTestId("option-bp2")).not.toBeNull();
		expect(screen.getByTestId("option--")).not.toBeNull();
	});

	it("labels an open-ended (`to === null`) breakpoint using the next breakpoint's `from` when one exists", () => {
		renderWithProviders({
			breakpoints: [
				makeBreakpoint({ id: "bp1", from: 0, to: null }),
				makeBreakpoint({ id: "bp2", from: 500, to: 900 }),
			],
			selectedBreakpoint: "bp1",
		});

		expect(screen.getByTestId("option-bp1")).not.toBeNull();
		expect(screen.getByTestId("option-bp2")).not.toBeNull();
	});

	it("selecting the same breakpoint id is a no-op, selecting '-' opens AddBreakpoint, and re-selecting is blocked until the debounce timeout elapses", () => {
		vi.useFakeTimers();
		const { store } = renderWithProviders({
			breakpoints: [
				makeBreakpoint({ id: "bp1", from: 0, to: 767 }),
				makeBreakpoint({ id: "bp2", from: 768, to: null }),
			],
			selectedBreakpoint: "bp1",
		});

		// no-op: selecting the currently selected breakpoint
		fireEvent.click(screen.getByTestId("option-bp1"));
		expect(store.getState().selectedBreakpoint).toBe("bp1");

		// select a different breakpoint -> EditBreakpoint, blockChangeRef becomes true
		fireEvent.click(screen.getByTestId("option-bp2"));
		expect(store.getState().selectedBreakpoint).toBe("bp2");
		expect(store.getState().sidebar.view).toBe(SidebarView.EditBreakpoint);

		// blocked immediately after (blockChangeRef.current is true)
		fireEvent.click(screen.getByTestId("option-bp1"));
		expect(store.getState().selectedBreakpoint).toBe("bp2");

		act(() => {
			vi.advanceTimersByTime(600);
		});

		// select "-" (add breakpoint) after the block clears
		fireEvent.click(screen.getByTestId("option--"));
		expect(store.getState().selectedBreakpoint).toBe(null);
		expect(store.getState().sidebar.view).toBe(SidebarView.AddBreakpoint);

		vi.useRealTimers();
	});

	it("does not dispatch a duplicate setSidebarView action when already on the target view", () => {
		const { store } = renderWithProviders({
			breakpoints: [
				makeBreakpoint({ id: "bp1", from: 0, to: 767 }),
				makeBreakpoint({ id: "bp2", from: 768, to: null }),
			],
			selectedBreakpoint: "bp1",
			sidebar: { view: SidebarView.EditBreakpoint },
		});

		fireEvent.click(screen.getByTestId("option-bp2"));
		expect(store.getState().selectedBreakpoint).toBe("bp2");
		expect(store.getState().sidebar.view).toBe(SidebarView.EditBreakpoint);
	});
});
