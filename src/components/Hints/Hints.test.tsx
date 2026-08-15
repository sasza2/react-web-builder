import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./HelperArrow", () => ({
	HelperArrow: ({
		selector,
		title,
		onClose,
	}: {
		selector: string;
		title: string;
		onClose: () => void;
	}) => (
		<button type="button" data-testid="helper-arrow" onClick={onClose}>
			{selector}-{title}
		</button>
	),
}));

import { Hints } from "./Hints";

describe("Hints", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders nothing when list is empty", () => {
		const { container } = render(<Hints list={[]} />);
		expect(container.innerHTML).toBe("");
	});

	it("renders nothing when all items already have a hint stored", () => {
		localStorage.setItem("hint-.a", "true");
		const { container } = render(
			<Hints list={[{ selector: ".a", title: "A" }]} />,
		);
		expect(container.innerHTML).toBe("");
	});

	it("renders the first item without a stored hint", () => {
		render(<Hints list={[{ selector: ".a", title: "A" }]} />);
		expect(screen.getByTestId("helper-arrow")).not.toBeNull();
		expect(screen.getByText(".a-A")).not.toBeNull();
	});

	it("advances to next item on close with speed timeout", () => {
		render(
			<Hints
				list={[
					{ selector: ".a", title: "A" },
					{ selector: ".b", title: "B" },
				]}
				speed={500}
			/>,
		);

		expect(screen.getByText(".a-A")).not.toBeNull();

		act(() => {
			screen.getByTestId("helper-arrow").click();
		});

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(screen.getByText(".b-B")).not.toBeNull();
	});

	it("advances immediately when speed is 0", () => {
		render(
			<Hints
				list={[
					{ selector: ".a", title: "A" },
					{ selector: ".b", title: "B" },
				]}
				speed={0}
			/>,
		);

		act(() => {
			screen.getByTestId("helper-arrow").click();
		});

		expect(screen.getByText(".b-B")).not.toBeNull();
	});

	it("renders nothing after closing the last item", () => {
		const { container } = render(
			<Hints list={[{ selector: ".a", title: "A" }]} speed={0} />,
		);

		act(() => {
			screen.getByTestId("helper-arrow").click();
		});

		expect(container.innerHTML).toBe("");
	});

	it("skips items already marked as seen when advancing", () => {
		localStorage.setItem("hint-.b", "true");
		render(
			<Hints
				list={[
					{ selector: ".a", title: "A" },
					{ selector: ".b", title: "B" },
					{ selector: ".c", title: "C" },
				]}
				speed={0}
			/>,
		);

		act(() => {
			screen.getByTestId("helper-arrow").click();
		});

		expect(screen.getByText(".c-C")).not.toBeNull();
	});
});
