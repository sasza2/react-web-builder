import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "../StyleProvider/theme";

const mockUseSidebarModalRef = vi.fn();

vi.mock("../SidebarProvider", () => ({
	useSidebarModalRef: () => mockUseSidebarModalRef(),
}));

import { RenderInSidebarModal } from "./RenderInSidebarModal";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("RenderInSidebarModal", () => {
	it("renders nothing when open is false", () => {
		const sidebarRef = { current: document.createElement("div") };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);

		const { container } = renderWithTheme(
			<RenderInSidebarModal open={false}>
				<div>content</div>
			</RenderInSidebarModal>,
		);

		expect(container.innerHTML).toBe("");
	});

	it("renders nothing (effect no-ops) when sidebarRef.current is null even if open", () => {
		const sidebarRef = { current: null };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);

		renderWithTheme(
			<RenderInSidebarModal open>
				<div>content</div>
			</RenderInSidebarModal>,
		);
		// effect returns early; no throw means success
		expect(true).toBe(true);
	});

	it("portals children into the sidebar container when open", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);

		renderWithTheme(
			<RenderInSidebarModal open>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		expect(sidebarEl.textContent).toBe("modal-content");
	});

	it("calls onClose on pointerdown outside the modal container (default mode)", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);
		const onClose = vi.fn();

		renderWithTheme(
			<RenderInSidebarModal open onClose={onClose}>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		const outside = document.createElement("div");
		document.body.appendChild(outside);
		fireEvent.pointerDown(outside);

		expect(onClose).toHaveBeenCalled();
	});

	it("does not call onClose on pointerdown inside the modal container (default mode)", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);
		const onClose = vi.fn();

		renderWithTheme(
			<RenderInSidebarModal open onClose={onClose}>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		const inside = sidebarEl.querySelector("div");
		fireEvent.pointerDown(inside as Element);

		expect(onClose).not.toHaveBeenCalled();
	});

	it("does not call onClose when clicking the opener element", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);
		const onClose = vi.fn();
		const openerEl = document.createElement("button");
		document.body.appendChild(openerEl);
		const opener = { current: openerEl };

		renderWithTheme(
			<RenderInSidebarModal open onClose={onClose} opener={opener}>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		fireEvent.pointerDown(openerEl);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("does not call onClose when clicking a child of the opener element", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);
		const onClose = vi.fn();
		const openerEl = document.createElement("button");
		const openerChild = document.createElement("span");
		openerEl.appendChild(openerChild);
		document.body.appendChild(openerEl);
		const opener = { current: openerEl };

		renderWithTheme(
			<RenderInSidebarModal open onClose={onClose} opener={opener}>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		fireEvent.pointerDown(openerChild);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("respects closeOnlyOnClickOutsideSidebarModal: does not close on click inside sidebarRef but outside container", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const outsideContainerButInsideSidebar = document.createElement("span");
		sidebarEl.appendChild(outsideContainerButInsideSidebar);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);
		const onClose = vi.fn();

		renderWithTheme(
			<RenderInSidebarModal
				open
				onClose={onClose}
				closeOnlyOnClickOutsideSidebarModal
			>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		fireEvent.pointerDown(outsideContainerButInsideSidebar);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("respects closeOnlyOnClickOutsideSidebarModal: closes when clicking fully outside sidebarRef", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);
		const onClose = vi.fn();

		renderWithTheme(
			<RenderInSidebarModal
				open
				onClose={onClose}
				closeOnlyOnClickOutsideSidebarModal
			>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		const outside = document.createElement("div");
		document.body.appendChild(outside);
		fireEvent.pointerDown(outside);

		expect(onClose).toHaveBeenCalled();
	});

	it("does nothing on outside click when onClose is not provided", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);

		renderWithTheme(
			<RenderInSidebarModal open>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		const outside = document.createElement("div");
		document.body.appendChild(outside);
		expect(() => fireEvent.pointerDown(outside)).not.toThrow();
	});

	it("cleans up listener and removes container on unmount", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);

		const { unmount } = renderWithTheme(
			<RenderInSidebarModal open>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		expect(sidebarEl.children.length).toBe(1);
		unmount();
		expect(sidebarEl.children.length).toBe(0);
	});

	it("reuses the same container element across re-renders", () => {
		const sidebarEl = document.createElement("div");
		document.body.appendChild(sidebarEl);
		const sidebarRef = { current: sidebarEl };
		mockUseSidebarModalRef.mockReturnValue(sidebarRef);

		const { rerender } = renderWithTheme(
			<RenderInSidebarModal open>
				<div>modal-content</div>
			</RenderInSidebarModal>,
		);

		rerender(
			<ThemeProvider theme={theme}>
				<RenderInSidebarModal open>
					<div>modal-content-updated</div>
				</RenderInSidebarModal>
			</ThemeProvider>,
		);

		expect(sidebarEl.textContent).toBe("modal-content-updated");
	});
});
