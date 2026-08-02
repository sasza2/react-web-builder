import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";

import { useSelectedElements } from "./useSelectedElements";

it("reads, sets, and toggles selected elements", () => {
	const store = createStore({ selectedElements: [] });
	const wrapper = ({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

	const { result } = renderHook(() => useSelectedElements(), { wrapper });

	expect(result.current.selectedElements).toEqual([]);

	act(() => {
		result.current.setSelectedElements(["el-1", "el-2"]);
	});

	expect(store.getState().selectedElements).toEqual(["el-1", "el-2"]);

	act(() => {
		result.current.toggleSelectedElement("el-1");
	});

	expect(store.getState().selectedElements).toEqual(["el-2"]);

	act(() => {
		result.current.toggleSelectedElement("el-3");
	});

	expect(store.getState().selectedElements).toEqual(["el-2", "el-3"]);
});
