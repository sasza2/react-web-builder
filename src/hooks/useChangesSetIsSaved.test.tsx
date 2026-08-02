import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";

import { useChangesSetIsSaved } from "./useChangesSetIsSaved";

it("marks changes as saved", () => {
	const store = createStore({
		changes: {
			history: [],
			index: 0,
			initial: {},
			pushKey: "",
			saved: false,
			undoKey: "",
		},
	});
	const wrapper = ({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

	const { result } = renderHook(() => useChangesSetIsSaved(), { wrapper });

	act(() => {
		result.current();
	});

	expect(store.getState().changes.saved).toBe(true);
});
