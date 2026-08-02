import { act, renderHook } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { SIDEBAR_WIDTH } from "@/consts";

import {
	SidebarProvider,
	useSelectNewElementAccordion,
	useSidebarModalRef,
	useSidebarRef,
	useSidebarSetWidth,
	useSidebarWidth,
} from "./SidebarProvider";

const wrapper = ({ children }: React.PropsWithChildren) => (
	<SidebarProvider>{children}</SidebarProvider>
);

describe("SidebarProvider", () => {
	it("provides the default sidebar width", () => {
		const { result } = renderHook(() => useSidebarWidth(), { wrapper });
		expect(result.current).toBe(SIDEBAR_WIDTH);
	});

	it("sets the css variable for the sidebar width on mount", () => {
		renderHook(() => useSidebarWidth(), { wrapper });
		expect(
			document.body.style.getPropertyValue("--react-web-builder-sidebar-width"),
		).toBe(`${SIDEBAR_WIDTH}px`);
	});

	it("updates the width via useSidebarSetWidth and reflects it in useSidebarWidth", () => {
		const { result } = renderHook(
			() => ({
				width: useSidebarWidth(),
				setWidth: useSidebarSetWidth(),
			}),
			{ wrapper },
		);

		act(() => {
			result.current.setWidth(320);
		});

		expect(result.current.width).toBe(320);
		expect(
			document.body.style.getPropertyValue("--react-web-builder-sidebar-width"),
		).toBe("320px");
	});

	it("provides modal and sidebar refs", () => {
		const { result } = renderHook(
			() => ({
				modalRef: useSidebarModalRef(),
				sidebarRef: useSidebarRef(),
			}),
			{ wrapper },
		);

		expect(result.current.modalRef).toBeDefined();
		expect(result.current.sidebarRef).toBeDefined();
	});

	it("provides a selectNewElementAccordion state", () => {
		const { result } = renderHook(() => useSelectNewElementAccordion(), {
			wrapper,
		});

		expect(result.current).toBeDefined();
	});
});
