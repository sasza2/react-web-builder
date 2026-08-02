import { render } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockUseWebBuilderSizeHeight = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../WebBuilderSize", () => ({
	useWebBuilderSizeHeight: () => mockUseWebBuilderSizeHeight(),
}));

vi.mock("./TemplateLoaderAnimation.styled", () => ({
	Container: (
		props: ComponentProps<
			typeof import("./TemplateLoaderAnimation.styled").Container
		>,
	) => (
		<div data-testid="container" data-height={props.$height}>
			{props.children}
		</div>
	),
	Progress: (props: React.PropsWithChildren) => (
		<div data-testid="progress">{props.children}</div>
	),
	ProgressIn: React.forwardRef<HTMLDivElement>((_props, ref) => (
		<div ref={ref} data-testid="progress-in" />
	)),
	Title: (props: React.PropsWithChildren) => <div>{props.children}</div>,
}));

import { TemplateLoaderAnimation } from "./TemplateLoaderAnimation";

describe("TemplateLoaderAnimation", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		mockUseWebBuilderSizeHeight.mockReturnValue(500);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders with title and progress elements", () => {
		const { getByText, getByTestId } = render(<TemplateLoaderAnimation />);

		expect(getByText("template.loading")).not.toBeNull();
		expect(getByTestId("container").getAttribute("data-height")).toBe("500");
		expect(getByTestId("progress-in")).not.toBeNull();
	});

	it("updates progress percent text and bar width over time", () => {
		const { container, getByTestId } = render(<TemplateLoaderAnimation />);

		vi.advanceTimersByTime(400);

		const span = container.querySelector("span");
		expect(span.innerHTML).not.toBe("0%");
		expect(getByTestId("progress-in").style.width).not.toBe("");

		vi.advanceTimersByTime(2000);

		expect(span.innerHTML).toContain("%");
	});

	it("clears the interval on unmount", () => {
		const clearIntervalSpy = vi.spyOn(global, "clearInterval");

		const { unmount } = render(<TemplateLoaderAnimation />);
		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
		clearIntervalSpy.mockRestore();
	});
});
