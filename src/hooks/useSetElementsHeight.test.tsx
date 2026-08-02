import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it, vi } from "vitest";

import type { BreakpointsExtras, ElementId, ElementRenderFunc } from "types";

import { ElementsContext } from "@/components/ElementsProvider";
import { GridAPIProvider, useGridAPI } from "@/components/GridAPIProvider";
import { createStore } from "@/store/store";
import { buildBreakpoint, buildGridAPI } from "@/testing/fixtures";
import * as breakpointUtils from "@/utils/breakpoint";

import { useSetElementsHeight } from "./useSetElementsHeight";

vi.mock("@/utils/breakpoint", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils/breakpoint")>();
	return {
		...actual,
		assignAllToElementsExtras: vi.fn(),
	};
});

const breakpoint = buildBreakpoint({ id: "bp-1" });

function GridAPISetter({ children }: PropsWithChildren) {
	const gridAPI = useGridAPI();
	gridAPI.current = buildGridAPI();
	return <>{children}</>;
}

const wrapper = ({ children }: PropsWithChildren) => {
	const store = createStore({
		breakpoints: [breakpoint],
		selectedBreakpoint: "bp-1",
	});
	const elementsExtras: React.MutableRefObject<BreakpointsExtras> = {
		current: {},
	};

	return (
		<Provider store={store}>
			<GridAPIProvider>
				<GridAPISetter>
					<ElementsContext.Provider
						value={{
							elements: [],
							elementsCache: {
								current: new Map<ElementId, ElementRenderFunc>(),
							},
							elementsExtras,
						}}
					>
						{children}
					</ElementsContext.Provider>
				</GridAPISetter>
			</GridAPIProvider>
		</Provider>
	);
};

it("assigns elements heights via the grid API and breakpoint", () => {
	const { result } = renderHook(() => useSetElementsHeight(), { wrapper });

	act(() => {
		result.current();
	});

	expect(breakpointUtils.assignAllToElementsExtras).toHaveBeenCalledWith(
		{ current: {} },
		breakpoint,
		expect.any(Object),
	);
});
