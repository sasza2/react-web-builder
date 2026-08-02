import { act, render, screen } from "@testing-library/react";
import React from "react";
import type { GridElement } from "react-grid-panzoom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSetValue = vi.fn();
let mockValue: unknown;

vi.mock("@/components/FormProvider", () => ({
	useField: () => ({ value: mockValue, setValue: mockSetValue }),
}));

type GridElementWithItem = GridElement & {
	item: ComponentItem;
	render: (props: { item: ComponentItem }) => React.ReactElement;
};

// only the parts of the grid API that ListOrder actually uses
type GridProps = {
	elements: GridElementWithItem[];
	setElements: (elements: Array<Partial<GridElementWithItem>>) => void;
};

let capturedProps: GridProps;
vi.mock("react-grid-panzoom", () => ({
	default: (props: GridProps) => {
		capturedProps = props;
		return <div data-testid="react-grid" />;
	},
}));

vi.mock("./Component", () => ({
	Component: ({ label }: { label: string }) => (
		<div data-testid="component">{label}</div>
	),
	ROW_HEIGHT: 30,
}));

import type { ComponentItem } from "./Component";
import { ListOrder } from "./ListOrder";

const options = [
	{ id: "a", label: "A" },
	{ id: "b", label: "B" },
	{ id: "c", label: "C" },
];

describe("ListOrder", () => {
	beforeEach(() => {
		mockSetValue.mockClear();
		capturedProps = undefined;
	});

	it("does not render grid when width is 0 (no ref callback triggered)", () => {
		mockValue = undefined;
		render(<ListOrder name="order" options={options} />);
		expect(screen.queryByTestId("react-grid")).toBeNull();
	});

	it("renders grid once width is measured via ref, merging value with options", () => {
		mockValue = [{ id: "b", label: "B-custom" }];

		const originalGetBoundingClientRect =
			HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width: 300 }) as DOMRect;

		render(<ListOrder name="order" options={options} />);

		expect(screen.getByTestId("react-grid")).not.toBeNull();
		expect(capturedProps.elements).toHaveLength(3);
		// merged item for "b" keeps combinedOptions' properties over item's,
		// and existing value entries are ordered first
		expect(capturedProps.elements[0].item).toEqual({
			id: "b",
			label: "B-custom",
		});
		expect(capturedProps.elements[1].item).toEqual({
			id: "a",
			label: "A",
		});
		expect(capturedProps.elements[2].item).toEqual({
			id: "c",
			label: "C",
		});

		const rendered = capturedProps.elements[1].render({
			item: capturedProps.elements[1].item,
		});
		const { container } = render(rendered);
		expect(container.textContent).toBe("A");

		act(() => {
			capturedProps.setElements([
				{ y: 1, item: { id: "b", label: "B-custom" } },
				{ y: 0, item: { id: "a", label: "A" } },
			]);
		});

		expect(mockSetValue).toHaveBeenCalledWith([
			{ id: "a", label: "A" },
			{ id: "b", label: "B-custom" },
		]);

		HTMLDivElement.prototype.getBoundingClientRect =
			originalGetBoundingClientRect;
	});

	it("does NOT remove stale value entries no longer present in options (source bug: the removal filter's guard condition can never trigger a removal)", () => {
		mockValue = [{ id: "z", label: "Stale" }];

		const original = HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width: 200 }) as DOMRect;

		render(<ListOrder name="order" options={options} />);

		// Expected/intended behaviour would be for "z" (no longer present in
		// `options`) to be dropped, but the `else` branch's
		// `combinedOptions.filter((option) => option.id !== item.id)` only runs
		// when `item.id` was NOT found in `combinedOptions` in the first place,
		// so the filter predicate can never actually remove anything -- "z"
		// stays in the list alongside all of `options`.
		expect(capturedProps.elements.find((el) => el.item.id === "z")).not.toBe(
			undefined,
		);
		expect(capturedProps.elements).toHaveLength(4);

		HTMLDivElement.prototype.getBoundingClientRect = original;
	});
	// Note: the `!Array.isArray(options)` guard inside `elements` (and an
	// analogous one guarding the merge loop) cannot be exercised without
	// crashing the component first: `rows={options.length}` (source line ~87)
	// unconditionally dereferences `options.length` whenever width > 0,
	// so passing a non-array `options` (undefined/null) throws before the
	// guarded branch is ever reached. This looks like a source bug (the
	// `!Array.isArray(options)` defensive checks are dead code given the
	// current `options` prop is required and used unguarded elsewhere) -
	// left unfixed and untested per process, reported as a gap.
});
