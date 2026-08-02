import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";

import { useSelectedElementId } from "./useSelectedElementId";

it("reads and sets the selected element id", () => {
	const store = createStore({ selectedElement: null });
	const wrapper = ({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

	const { result } = renderHook(() => useSelectedElementId(), { wrapper });

	expect(result.current[0]).toBeNull();

	act(() => {
		result.current[1]("el-1");
	});

	expect(store.getState().selectedElement).toBe("el-1");

	act(() => {
		result.current[1](null);
	});

	expect(store.getState().selectedElement).toBeNull();
});
