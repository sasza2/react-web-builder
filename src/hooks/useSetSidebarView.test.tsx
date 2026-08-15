import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { SidebarView } from "@/components/SidebarProvider";
import { createStore } from "@/store/store";

import { useSetSidebarView } from "./useSetSidebarView";

const wrapperFor =
	(store: ReturnType<typeof createStore>) =>
	({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

it("sets a new sidebar view", () => {
	const store = createStore({ sidebar: { view: null } });

	const { result } = renderHook(() => useSetSidebarView(), {
		wrapper: wrapperFor(store),
	});

	act(() => {
		result.current(SidebarView.AddElement);
	});

	expect(store.getState().sidebar.view).toBe(SidebarView.AddElement);
});

it("does nothing when the view is already the requested one", () => {
	const store = createStore({ sidebar: { view: SidebarView.AddElement } });

	const { result } = renderHook(() => useSetSidebarView(), {
		wrapper: wrapperFor(store),
	});

	act(() => {
		result.current(SidebarView.AddElement);
	});

	expect(store.getState().sidebar.view).toBe(SidebarView.AddElement);
});

it("sets the view to null", () => {
	const store = createStore({ sidebar: { view: SidebarView.AddElement } });

	const { result } = renderHook(() => useSetSidebarView(), {
		wrapper: wrapperFor(store),
	});

	act(() => {
		result.current(null);
	});

	expect(store.getState().sidebar.view).toBeNull();
});
