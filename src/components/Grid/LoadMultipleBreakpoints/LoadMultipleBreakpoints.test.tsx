import { render } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { buildBreakpoint } from "@/testing/fixtures";

import type { LoadBreakpoint } from "../LoadBreakpoint";

import { LoadMultipleBreakpoints } from "./LoadMultipleBreakpoints";

vi.mock("@/components/TemplateLoaderAnimation", () => ({
	TemplateLoaderAnimation: () => <div data-testid="loader-animation" />,
}));

vi.mock("../LoadBreakpoint", () => ({
	LoadBreakpoint: ({
		breakpoint,
		onStartLoading,
		onFinishLoading,
	}: ComponentProps<typeof LoadBreakpoint>) => (
		<div data-testid={`load-breakpoint-${breakpoint.id}`}>
			<button
				type="button"
				data-testid={`start-${breakpoint.id}`}
				onClick={() => onStartLoading(breakpoint)}
			>
				start
			</button>
			<button
				type="button"
				data-testid={`finish-${breakpoint.id}`}
				onClick={() => onFinishLoading(breakpoint)}
			>
				finish
			</button>
		</div>
	),
}));

const breakpointA = buildBreakpoint({ id: "a" });
const breakpointB = buildBreakpoint({ id: "b" });

describe("LoadMultipleBreakpoints", () => {
	it("renders the loader animation always", () => {
		const { getByTestId } = render(
			<LoadMultipleBreakpoints breakpoints={[]} />,
		);
		expect(getByTestId("loader-animation")).not.toBeNull();
	});

	it("renders nothing inside container when breakpoints is empty", () => {
		const { queryByTestId } = render(
			<LoadMultipleBreakpoints breakpoints={[]} />,
		);
		expect(queryByTestId("load-breakpoint-a")).toBeNull();
	});

	it("renders one LoadBreakpoint per breakpoint", () => {
		const { getByTestId } = render(
			<LoadMultipleBreakpoints breakpoints={[breakpointA, breakpointB]} />,
		);
		expect(getByTestId("load-breakpoint-a")).not.toBeNull();
		expect(getByTestId("load-breakpoint-b")).not.toBeNull();
	});

	it("calls beforeLoadingAll only on the first start, and onStartLoadingBreakpoint every time", () => {
		const beforeLoadingAll = vi.fn();
		const onStartLoadingBreakpoint = vi.fn();

		const { getByTestId } = render(
			<LoadMultipleBreakpoints
				breakpoints={[breakpointA, breakpointB]}
				beforeLoadingAll={beforeLoadingAll}
				onStartLoadingBreakpoint={onStartLoadingBreakpoint}
			/>,
		);

		getByTestId("start-a").click();
		expect(beforeLoadingAll).toHaveBeenCalledTimes(1);
		expect(onStartLoadingBreakpoint).toHaveBeenCalledWith(breakpointA);

		getByTestId("start-b").click();
		expect(beforeLoadingAll).toHaveBeenCalledTimes(1);
		expect(onStartLoadingBreakpoint).toHaveBeenCalledWith(breakpointB);
	});

	it("works without optional callbacks provided when starting", () => {
		const { getByTestId } = render(
			<LoadMultipleBreakpoints breakpoints={[breakpointA]} />,
		);
		expect(() => getByTestId("start-a").click()).not.toThrow();
	});

	it("calls onFinishLoadingBreakpoint and afterLoadingAll only after all started breakpoints finish", () => {
		const afterLoadingAll = vi.fn();
		const onFinishLoadingBreakpoint = vi.fn();

		const { getByTestId } = render(
			<LoadMultipleBreakpoints
				breakpoints={[breakpointA, breakpointB]}
				afterLoadingAll={afterLoadingAll}
				onFinishLoadingBreakpoint={onFinishLoadingBreakpoint}
			/>,
		);

		getByTestId("start-a").click();
		getByTestId("start-b").click();

		getByTestId("finish-a").click();
		expect(onFinishLoadingBreakpoint).toHaveBeenCalledWith(breakpointA);
		expect(afterLoadingAll).not.toHaveBeenCalled();

		getByTestId("finish-b").click();
		expect(onFinishLoadingBreakpoint).toHaveBeenCalledWith(breakpointB);
		expect(afterLoadingAll).toHaveBeenCalledTimes(1);
	});

	it("keeps the same loaded-breakpoints ref across re-renders", () => {
		const { getByTestId, rerender } = render(
			<LoadMultipleBreakpoints breakpoints={[breakpointA]} />,
		);

		rerender(
			<LoadMultipleBreakpoints breakpoints={[breakpointA, breakpointB]} />,
		);

		expect(() => getByTestId("start-a").click()).not.toThrow();
	});

	it("works without optional callbacks provided when finishing", () => {
		const { getByTestId } = render(
			<LoadMultipleBreakpoints breakpoints={[breakpointA]} />,
		);
		getByTestId("start-a").click();
		expect(() => getByTestId("finish-a").click()).not.toThrow();
	});
});
