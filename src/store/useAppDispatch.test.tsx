import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { createStore } from "./store";
import { useAppDispatch } from "./useAppDispatch";

describe("useAppDispatch", () => {
	it("returns the store dispatch function", () => {
		const store = createStore({});
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(() => useAppDispatch(), { wrapper });

		expect(typeof result.current).toBe("function");
	});
});
