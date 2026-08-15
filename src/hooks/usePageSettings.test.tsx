import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { createStore } from "@/store/store";

import { usePageSettings } from "./usePageSettings";

describe("usePageSettings", () => {
	it("returns pageSettings from the store", () => {
		const pageSettings = { id: "page-1", name: "Home" } as never;
		const store = createStore({ pageSettings });

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(() => usePageSettings(), { wrapper });

		expect(result.current).toEqual(pageSettings);
	});
});
