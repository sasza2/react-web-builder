import { act, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const mockArrowCreate = vi.fn();

vi.mock("arrows-svg", () => ({
	default: (...args: unknown[]) => mockArrowCreate(...args),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

const mockShadows = vi.hoisted(() => ({
	init: vi.fn(),
	startAnimating: vi.fn(),
	stopAnimating: vi.fn(),
	removeWithTimeout: vi.fn(),
	removeImmediately: vi.fn(),
}));

vi.mock("./shadows", () => ({
	default: mockShadows,
}));

import { HelperArrow } from "./HelperArrow";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("HelperArrow", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		document.body.innerHTML = "";
		localStorage.clear();
		mockArrowCreate.mockReset();
		mockShadows.init.mockClear();
		mockShadows.startAnimating.mockClear();
		mockShadows.stopAnimating.mockClear();
		mockShadows.removeWithTimeout.mockClear();
		mockShadows.removeImmediately.mockClear();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it("renders nothing until the target node exists, then renders the portal via a createPortal target", () => {
		renderWithTheme(<HelperArrow selector=".target" title="Hello" />);

		// initial render is null since node doesn't exist yet
		expect(screen.queryByText("Hello")).toBeNull();

		const target = document.createElement("div");
		target.className = "target";
		document.body.appendChild(target);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(screen.getByText("Hello")).not.toBeNull();
		expect(mockShadows.init).toHaveBeenCalledWith(target);
		expect(mockShadows.startAnimating).toHaveBeenCalled();
		expect(localStorage.getItem("hint-.target")).toBe("true");
	});

	it("hides the confirm button when hasButton is false", () => {
		const target = document.createElement("div");
		target.className = "target2";
		document.body.appendChild(target);

		renderWithTheme(
			<HelperArrow selector=".target2" title="Hi" hasButton={false} />,
		);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(screen.getByText("Hi")).not.toBeNull();
		expect(screen.queryByText("hints.confirm")).toBeNull();
	});

	it("stops animating after 300ms once the node exists", () => {
		const target = document.createElement("div");
		target.className = "target3";
		document.body.appendChild(target);

		renderWithTheme(<HelperArrow selector=".target3" title="Hi" />);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(mockShadows.stopAnimating).toHaveBeenCalled();
	});

	it("calls onClose and shadow cleanup when clicking the confirm button", () => {
		const target = document.createElement("div");
		target.className = "target4";
		document.body.appendChild(target);

		const onClose = vi.fn();
		renderWithTheme(
			<HelperArrow selector=".target4" title="Hi" onClose={onClose} />,
		);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		act(() => {
			screen.getByText("hints.confirm").click();
		});

		expect(onClose).toHaveBeenCalled();
		expect(mockShadows.removeWithTimeout).toHaveBeenCalled();
	});

	it("gives up and calls onHide after exceeding max retries when the node never appears", () => {
		renderWithTheme(<HelperArrow selector=".never" title="Never" />);

		act(() => {
			// 16 retries * 200ms to exceed maxRetries (15)
			vi.advanceTimersByTime(200 * 16);
		});

		expect(screen.queryByText("Never")).toBeNull();
	});

	it("creates the arrow via arrows-svg once the title ref is mounted and appends its node", () => {
		mockArrowCreate.mockImplementation(() => ({
			node: document.createElement("div"),
			clear: vi.fn(),
		}));

		const target = document.createElement("div");
		target.className = "target5";
		document.body.appendChild(target);

		renderWithTheme(<HelperArrow selector=".target5" title="Hi" />);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		act(() => {
			vi.advanceTimersByTime(300); // stop animating so the arrow effect proceeds
		});

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(mockArrowCreate).toHaveBeenCalled();
	});

	it("swallows errors from arrows-svg and keeps arrow null", () => {
		mockArrowCreate.mockImplementation(() => {
			throw new Error("boom");
		});

		const target = document.createElement("div");
		target.className = "target6";
		document.body.appendChild(target);

		renderWithTheme(<HelperArrow selector=".target6" title="Hi" />);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(mockArrowCreate).toHaveBeenCalled();
	});

	it("closes via mousedown outside after 1s, ignoring the hide-hint button and early clicks", () => {
		const target = document.createElement("div");
		target.className = "target7";
		document.body.appendChild(target);

		const onClose = vi.fn();
		renderWithTheme(
			<HelperArrow selector=".target7" title="Hi" onClose={onClose} />,
		);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		// too early - should not close
		act(() => {
			target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		});
		expect(onClose).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		act(() => {
			target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		});

		expect(onClose).toHaveBeenCalled();
	});
});
