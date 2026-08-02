import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { createStore } from "./store";
import { useAppSelector } from "./useAppSelector";

describe("useAppSelector", () => {
	it("selects state from the store", () => {
		const store = createStore({ pageSettings: { title: "abc" } as never });
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(
			() => useAppSelector((state) => state.pageSettings),
			{
				wrapper,
			},
		);

		expect(result.current).toEqual({ title: "abc" });
	});
});
