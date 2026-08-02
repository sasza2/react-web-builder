import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SIDEBAR_WIDTH } from "@/consts";
import { PREVENT_USER_SELECT_CLASS_NAME } from "@/WebBuilder.styled";

const setWidth = vi.fn();
let currentWidth = SIDEBAR_WIDTH;

vi.mock("@/components/SidebarProvider", () => ({
	useSidebarSetWidth: () => setWidth,
	useSidebarWidth: () => currentWidth,
}));

import { Resize } from "./Resize";

const pointerDown = (target: EventTarget, clientX: number) => {
	fireEvent(target, new MouseEvent("pointerdown", { clientX }));
};

const pointerMove = (clientX: number) => {
	fireEvent(window, new MouseEvent("pointermove", { clientX }));
};

const mouseUp = () => {
	fireEvent(window, new MouseEvent("mouseup"));
};

describe("Resize", () => {
	beforeEach(() => {
		setWidth.mockClear();
		currentWidth = SIDEBAR_WIDTH;
		document.body.classList.remove(PREVENT_USER_SELECT_CLASS_NAME);
	});

	it("renders a Container with the given height", () => {
		const { container } = render(<Resize height={456} />);
		const div = container.firstChild as HTMLDivElement;
		expect(div).not.toBeNull();
		expect(getComputedStyle(div).height).toBe("456px");
	});

	it("does nothing on pointermove before a pointerdown started drag", () => {
		render(<Resize height={100} />);
		pointerMove(50);
		expect(setWidth).not.toHaveBeenCalled();
	});

	it("resizes on pointerdown + pointermove and stops on mouseup", () => {
		currentWidth = 300;
		const { container } = render(<Resize height={100} />);
		const div = container.firstChild as HTMLDivElement;

		pointerDown(div, 100);
		expect(
			document.body.classList.contains(PREVENT_USER_SELECT_CLASS_NAME),
		).toBe(true);

		pointerMove(150);
		expect(setWidth).toHaveBeenCalledWith(350);

		mouseUp();
		expect(
			document.body.classList.contains(PREVENT_USER_SELECT_CLASS_NAME),
		).toBe(false);

		setWidth.mockClear();
		pointerMove(200);
		expect(setWidth).not.toHaveBeenCalled();
	});

	it("ignores resize below SIDEBAR_WIDTH", () => {
		currentWidth = SIDEBAR_WIDTH;
		const { container } = render(<Resize height={100} />);
		const div = container.firstChild as HTMLDivElement;

		pointerDown(div, 100);
		pointerMove(0);

		expect(setWidth).not.toHaveBeenCalled();
	});

	it("cleans up listeners and body class on unmount", () => {
		const removeSpy = vi.spyOn(window, "removeEventListener");
		const { container, unmount } = render(<Resize height={100} />);
		const div = container.firstChild as HTMLDivElement;

		pointerDown(div, 100);
		unmount();

		expect(
			document.body.classList.contains(PREVENT_USER_SELECT_CLASS_NAME),
		).toBe(false);
		expect(removeSpy).toHaveBeenCalledWith("pointermove", expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));

		removeSpy.mockRestore();
	});

	it("re-initiates move listeners on a second pointerdown", () => {
		currentWidth = 300;
		const { container } = render(<Resize height={100} />);
		const div = container.firstChild as HTMLDivElement;

		pointerDown(div, 100);
		pointerDown(div, 120);
		pointerMove(140);

		expect(setWidth).toHaveBeenCalledWith(320);
	});
});
