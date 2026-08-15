import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { SidebarView } from "@/components/SidebarProvider";
import { createStore } from "@/store/store";

import { useSidebar } from "./useSidebarView";

it("returns the sidebar state", () => {
	const store = createStore({
		sidebar: { view: SidebarView.EditBreakpoint },
	});
	const wrapper = ({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

	const { result } = renderHook(() => useSidebar(), { wrapper });

	expect(result.current).toEqual({ view: SidebarView.EditBreakpoint });
});
