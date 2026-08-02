import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { RESIZABLE_PROP_NAME } from "./consts";
import { Resizable } from "./Resizable";

describe("Resizable", () => {
	it("renders children and sets the initial height CSS variable", () => {
		render(
			<Resizable defaultHeight={200}>
				<div>content</div>
			</Resizable>,
		);

		expect(screen.getByText("content")).not.toBeNull();

		const container = screen.getByText("content").parentElement as HTMLElement;
		expect(container.style.getPropertyValue(RESIZABLE_PROP_NAME)).toBe("200px");
	});

	it("resizes on pointer drag, respecting minHeight and calling onChange", () => {
		const onChange = vi.fn();
		render(
			<Resizable defaultHeight={200} minHeight={50} onChange={onChange}>
				<div>content</div>
			</Resizable>,
		);

		const container = screen.getByText("content").parentElement as HTMLElement;
		vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
			height: 200,
		} as DOMRect);

		const anchor = container.querySelector("div:last-child") as HTMLDivElement;

		// jsdom doesn't construct real PointerEvents with clientY populated via
		// fireEvent.pointerDown, so dispatch a MouseEvent with the same type
		// instead (React's native listener only cares about the event name).
		fireEvent(
			anchor,
			new MouseEvent("pointerdown", { clientY: 100, bubbles: true }),
		);

		expect(container.style.userSelect).toBe("none");
		expect(container.style.pointerEvents).toBe("none");

		// move down by 30 -> height 230
		fireEvent(
			window,
			new MouseEvent("pointermove", { clientY: 130, buttons: 1 }),
		);
		expect(container.style.getPropertyValue(RESIZABLE_PROP_NAME)).toBe("230px");
		expect(onChange).toHaveBeenLastCalledWith(230);

		// move up past minHeight -> clamps to 50
		fireEvent(
			window,
			new MouseEvent("pointermove", { clientY: -1000, buttons: 1 }),
		);
		expect(container.style.getPropertyValue(RESIZABLE_PROP_NAME)).toBe("50px");
		expect(onChange).toHaveBeenLastCalledWith(50);

		// releasing the pointer (buttons === 0) stops resizing and resets styles
		fireEvent(
			window,
			new MouseEvent("pointermove", { clientY: 130, buttons: 0 }),
		);
		expect(container.style.userSelect).toBe("");
		expect(container.style.pointerEvents).toBe("");

		const callCountAfterStop = onChange.mock.calls.length;

		// further moves after stop should not affect anything (listeners removed)
		fireEvent(
			window,
			new MouseEvent("pointermove", { clientY: 500, buttons: 1 }),
		);
		expect(onChange.mock.calls.length).toBe(callCountAfterStop);
	});

	it("works without an onChange handler", () => {
		render(
			<Resizable defaultHeight={100}>
				<div>content</div>
			</Resizable>,
		);

		const container = screen.getByText("content").parentElement as HTMLElement;
		vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
			height: 100,
		} as DOMRect);

		const anchor = container.querySelector("div:last-child") as HTMLDivElement;

		fireEvent(
			anchor,
			new MouseEvent("pointerdown", { clientY: 5, bubbles: true }),
		);
		fireEvent(
			window,
			new MouseEvent("pointermove", { clientY: 15, buttons: 1 }),
		);

		expect(container.style.getPropertyValue(RESIZABLE_PROP_NAME)).toBe("110px");

		fireEvent(window, new MouseEvent("pointerup"));
	});

	it("stops resizing explicitly via pointerup", () => {
		render(
			<Resizable defaultHeight={100}>
				<div>content</div>
			</Resizable>,
		);

		const container = screen.getByText("content").parentElement as HTMLElement;
		vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
			height: 100,
		} as DOMRect);

		const anchor = container.querySelector("div:last-child") as HTMLDivElement;

		fireEvent(
			anchor,
			new MouseEvent("pointerdown", { clientY: 0, bubbles: true }),
		);
		fireEvent(window, new MouseEvent("pointerup"));

		expect(container.style.userSelect).toBe("");
		expect(container.style.pointerEvents).toBe("");
	});
});
