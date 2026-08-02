import { render, screen } from "@testing-library/react";
import React from "react";
import type { Breakpoint, WebBuilderComponent, WebBuilderElement } from "types";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as ElementOptionsProviderModule from "./ElementOptionsProvider";
import * as elementsRefMapModule from "./elementsRefMap";

vi.mock("@/utils/element", () => ({
	getProperties: vi.fn(() => ({ text: "hello" })),
}));

import Element from "./Element";

const BREAKPOINT = { id: "bp-1" } as Breakpoint;
const ELEMENT = { id: "el-1", componentName: "Text" } as WebBuilderElement;

const TextComponent = ({ text }: { text: string }) => <span>{text}</span>;

const COMPONENTS: WebBuilderComponent[] = [
	{ id: "Text", component: TextComponent } as unknown as WebBuilderComponent,
];

afterEach(() => {
	vi.restoreAllMocks();
});

describe("Element", () => {
	it("renders the matched component with the resolved props", () => {
		render(
			<Element
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				element={ELEMENT}
				paddingBottom={10}
			/>,
		);

		expect(screen.getByText("hello")).not.toBeNull();
	});

	it("warns and renders nothing when the component is not found", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const { container } = render(
			<Element
				breakpoint={BREAKPOINT}
				components={[]}
				element={ELEMENT}
				paddingBottom={10}
			/>,
		);

		expect(container.firstChild).toBeNull();
		expect(warnSpy).toHaveBeenCalledWith("Component Text not found");
	});

	it("applies paddingBottom to style when applyPaddingBottomToElements is true", () => {
		vi.spyOn(ElementOptionsProviderModule, "useElementOptions").mockReturnValue(
			{ applyPaddingBottomToElements: true },
		);

		const { container } = render(
			<Element
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				element={ELEMENT}
				paddingBottom={42}
			/>,
		);

		const div = container.querySelector("div[data-id='el-1']") as HTMLElement;
		expect(div.style.paddingBottom).toBe("42px");
	});

	it("leaves paddingBottom undefined when applyPaddingBottomToElements is false", () => {
		vi.spyOn(ElementOptionsProviderModule, "useElementOptions").mockReturnValue(
			{ applyPaddingBottomToElements: false },
		);

		const { container } = render(
			<Element
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				element={ELEMENT}
				paddingBottom={42}
			/>,
		);

		const div = container.querySelector("div[data-id='el-1']") as HTMLElement;
		expect(div.style.paddingBottom).toBe("");
	});

	it("registers and cleans up an element reference on mount/unmount", () => {
		const removeSpy = vi.fn();
		const addSpy = vi
			.spyOn(elementsRefMapModule, "addElementReference")
			.mockReturnValue(removeSpy);

		const { unmount } = render(
			<Element
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				element={ELEMENT}
				paddingBottom={10}
			/>,
		);

		expect(addSpy).toHaveBeenCalledWith(
			BREAKPOINT,
			ELEMENT,
			expect.any(HTMLDivElement),
		);

		unmount();

		expect(removeSpy).toHaveBeenCalled();
	});
});
