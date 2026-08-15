import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AnimationWidth } from "./AnimationWidth";

describe("AnimationWidth", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts with 'from' width and animates to 'to' width after timeout", () => {
		render(
			<AnimationWidth from={100} to={300} speed={500}>
				<div>child</div>
			</AnimationWidth>,
		);

		const container = screen.getByText("child").parentElement as HTMLElement;
		expect(container.style.width).toBe("100px");

		act(() => {
			vi.runAllTimers();
		});

		expect(container.style.width).toBe("300px");
	});

	it("clears the timer on unmount", () => {
		const { unmount } = render(
			<AnimationWidth from={100} to={300} speed={500}>
				<div>child</div>
			</AnimationWidth>,
		);

		unmount();
		act(() => {
			vi.runAllTimers();
		});
	});

	it("resets the timer when 'to' changes", () => {
		const { rerender } = render(
			<AnimationWidth from={100} to={300} speed={500}>
				<div>child</div>
			</AnimationWidth>,
		);

		rerender(
			<AnimationWidth from={100} to={400} speed={500}>
				<div>child</div>
			</AnimationWidth>,
		);

		act(() => {
			vi.runAllTimers();
		});

		const container = screen.getByText("child").parentElement as HTMLElement;
		expect(container.style.width).toBe("400px");
	});
});
