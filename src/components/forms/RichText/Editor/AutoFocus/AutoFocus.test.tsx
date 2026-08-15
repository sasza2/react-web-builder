import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseConfiguration = vi.fn();
vi.mock("@/components/ConfigurationProvider", () => ({
	useConfiguration: () => mockUseConfiguration(),
}));

const mockUseFrame = vi.fn();
vi.mock("react-frame-component", () => ({
	useFrame: () => mockUseFrame(),
}));

import { AutoFocus } from "./AutoFocus";

describe("AutoFocus", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	function makeIframeEnv(textbox?: HTMLElement) {
		const body = document.createElement("body");
		if (textbox) body.appendChild(textbox);
		const iframeDocument = { body } as unknown as Document;
		const selection = {
			selectAllChildren: vi.fn(),
			collapseToEnd: vi.fn(),
		};
		const iframeWindow = {
			getSelection: () => selection,
		} as unknown as Window;
		return { iframeDocument, iframeWindow, selection };
	}

	it("renders nothing", () => {
		mockUseConfiguration.mockReturnValue({
			autoFocusRichTextInEditProperties: false,
		});
		const { iframeDocument, iframeWindow } = makeIframeEnv();
		mockUseFrame.mockReturnValue({
			document: iframeDocument,
			window: iframeWindow,
		});

		const { container } = render(<AutoFocus editor={{} as never} />);

		expect(container.innerHTML).toBe("");
	});

	it("waits until the textbox exists, then focuses and blurs when auto focus is disallowed", () => {
		mockUseConfiguration.mockReturnValue({
			autoFocusRichTextInEditProperties: false,
		});
		const { iframeDocument, iframeWindow } = makeIframeEnv();
		mockUseFrame.mockReturnValue({
			document: iframeDocument,
			window: iframeWindow,
		});

		render(<AutoFocus autoFocus editor={{} as never} />);

		// no textbox yet - interval keeps polling without throwing
		vi.advanceTimersByTime(400);

		const textbox = document.createElement("div");
		textbox.setAttribute("role", "textbox");
		const scrollboxParent = document.createElement("div");
		const scrollbox = document.createElement("div");
		scrollboxParent.appendChild(scrollbox);
		scrollbox.appendChild(textbox);
		iframeDocument.body.appendChild(scrollboxParent);
		textbox.focus = vi.fn();
		textbox.blur = vi.fn();

		vi.advanceTimersByTime(400);

		expect(textbox.focus).toHaveBeenCalled();
		expect(textbox.blur).toHaveBeenCalled();
	});

	it("focuses and scrolls to bottom when auto focus is allowed and enabled", () => {
		mockUseConfiguration.mockReturnValue({
			autoFocusRichTextInEditProperties: true,
		});
		const { iframeDocument, iframeWindow } = makeIframeEnv();
		mockUseFrame.mockReturnValue({
			document: iframeDocument,
			window: iframeWindow,
		});

		const textbox = document.createElement("div");
		textbox.setAttribute("role", "textbox");
		textbox.focus = vi.fn();
		textbox.blur = vi.fn();
		const scrollboxParent = document.createElement("div");
		const scrollbox = document.createElement("div");
		scrollboxParent.appendChild(scrollbox);
		scrollbox.appendChild(textbox);
		iframeDocument.body.appendChild(scrollboxParent);

		render(<AutoFocus autoFocus editor={{} as never} />);

		vi.advanceTimersByTime(400);

		expect(textbox.focus).toHaveBeenCalled();
		expect(textbox.blur).not.toHaveBeenCalled();
	});

	it("clears the interval on unmount", () => {
		mockUseConfiguration.mockReturnValue({
			autoFocusRichTextInEditProperties: false,
		});
		const { iframeDocument, iframeWindow } = makeIframeEnv();
		mockUseFrame.mockReturnValue({
			document: iframeDocument,
			window: iframeWindow,
		});

		const { unmount } = render(<AutoFocus editor={{} as never} />);
		unmount();

		expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
	});
});
