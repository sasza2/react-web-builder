import { act, render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WAIT_FOR_LOAD } from "@/consts";

import { RenderWebComponent } from "./RenderWebComponent";

describe("RenderWebComponent", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders children inside the component container with the $display prop applied", () => {
		const { getByTestId, getByText } = render(
			<RenderWebComponent display="flex">
				<span>hello</span>
			</RenderWebComponent>,
		);

		expect(getByTestId("component")).not.toBeNull();
		expect(getByText("hello")).not.toBeNull();
	});

	it("does not show the loading state when the content is already present after the wait timer", () => {
		const { getByText, queryByText } = render(
			<RenderWebComponent>
				<span>hello</span>
			</RenderWebComponent>,
		);

		act(() => {
			vi.advanceTimersByTime(WAIT_FOR_LOAD);
		});

		expect(getByText("hello")).not.toBeNull();
		expect(queryByText("element.loading")).toBeNull();
	});

	it("shows the loading state, then the not-found state after retries are exhausted, when content never arrives", () => {
		const { getByText, queryByText } = render(<RenderWebComponent />);

		act(() => {
			vi.advanceTimersByTime(WAIT_FOR_LOAD);
		});

		expect(getByText("element.loading")).not.toBeNull();

		act(() => {
			vi.advanceTimersByTime(WAIT_FOR_LOAD * 20);
		});

		expect(queryByText("element.loading")).toBeNull();
		expect(getByText("element.notFound")).not.toBeNull();
	});

	it("recovers from the loading state once content appears before retries are exhausted", () => {
		const { getByText, queryByText, rerender } = render(<RenderWebComponent />);

		act(() => {
			vi.advanceTimersByTime(WAIT_FOR_LOAD);
		});

		expect(getByText("element.loading")).not.toBeNull();

		rerender(
			<RenderWebComponent>
				<span>arrived</span>
			</RenderWebComponent>,
		);

		act(() => {
			vi.advanceTimersByTime(WAIT_FOR_LOAD);
		});

		expect(getByText("arrived")).not.toBeNull();
		expect(queryByText("element.loading")).toBeNull();
		expect(queryByText("element.notFound")).toBeNull();
	});

	it("clears timers on unmount without throwing", () => {
		const { unmount } = render(<RenderWebComponent />);
		expect(() => unmount()).not.toThrow();
	});
});
