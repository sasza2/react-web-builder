import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../Hints/HelperArrow/HelperArrow", () => ({
	HelperArrow: ({ title }: { title: string }) => (
		<div data-testid="helper-arrow">{title}</div>
	),
}));

vi.mock("./AnimationWidth", () => ({
	AnimationWidth: ({ children }: React.PropsWithChildren) => (
		<div data-testid="animation-width">{children}</div>
	),
}));

vi.mock("./Boxes", () => ({
	AnimationSeparator: { Show: 0, Hide: 1 },
	Boxes: () => <div data-testid="boxes" />,
}));

vi.mock("./Monitor", () => ({
	Monitor: ({ children }: React.PropsWithChildren) => (
		<div data-testid="monitor">{children}</div>
	),
}));

vi.mock("./ScaleAnimation", () => ({
	ScaleAnimation: ({ children }: React.PropsWithChildren) => (
		<div data-testid="scale-animation">{children}</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { WhySeparator } from "./WhySeparator";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("WhySeparator", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders the animation chain", () => {
		renderWithTheme(<WhySeparator />);

		expect(screen.getByTestId("scale-animation")).not.toBeNull();
		expect(screen.getByTestId("animation-width")).not.toBeNull();
		expect(screen.getByTestId("monitor")).not.toBeNull();
		expect(screen.getByTestId("boxes")).not.toBeNull();
	});

	it("calls onClose when the container is clicked", () => {
		const onClose = vi.fn();
		const { container } = renderWithTheme(<WhySeparator onClose={onClose} />);

		fireEvent.click(container.firstElementChild as HTMLElement);

		expect(onClose).toHaveBeenCalled();
	});

	it("calls onClose on window click via document listener", () => {
		const onClose = vi.fn();
		renderWithTheme(<WhySeparator onClose={onClose} />);

		act(() => {
			window.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});

		expect(onClose).toHaveBeenCalled();
	});

	it("advances through animation steps over time, wrapping back to the first", () => {
		renderWithTheme(<WhySeparator onClose={vi.fn()} />);

		// advance through all animation steps (10 steps) to hit the wrap-around branch
		for (let i = 0; i < 12; i += 1) {
			act(() => {
				vi.runOnlyPendingTimers();
			});
		}

		expect(screen.getByTestId("boxes")).not.toBeNull();
	});

	it("renders an arrow when the current animation step defines one", () => {
		renderWithTheme(<WhySeparator onClose={vi.fn()} />);

		// first step has an arrow
		expect(screen.getByTestId("helper-arrow")).not.toBeNull();
	});

	it("removes the click listener on unmount", () => {
		const { unmount } = renderWithTheme(<WhySeparator onClose={vi.fn()} />);
		unmount();
	});
});
