import { render } from "@testing-library/react";
import React from "react";

import type { RootState } from "@/store/store";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseAppSelector = vi.fn();
const mockUseElements = vi.fn();

vi.mock("@/store/useAppSelector", () => ({
	useAppSelector: (selector: (state: RootState) => unknown) =>
		mockUseAppSelector(selector),
}));
vi.mock("@/hooks/useElements", () => ({
	useElements: () => mockUseElements(),
}));

import { HistoryOfElementsExtras } from "./HistoryOfElementsExtras";

describe("HistoryOfElementsExtras", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders null", () => {
		mockUseAppSelector.mockReturnValue({ history: [], index: 0 });
		mockUseElements.mockReturnValue({ elementsExtras: { current: {} } });

		const { container } = render(<HistoryOfElementsExtras />);

		expect(container.innerHTML).toBe("");
	});

	it("does nothing when there is no key", () => {
		mockUseAppSelector.mockReturnValue({ history: [], index: 0 });
		const elementsExtras = { current: { foo: "bar" } };
		mockUseElements.mockReturnValue({ elementsExtras });

		render(<HistoryOfElementsExtras />);

		expect(elementsExtras.current).toEqual({ foo: "bar" });
	});

	it("stores a clone of current extras on first visit to a key", () => {
		mockUseAppSelector.mockReturnValue({
			history: [{ key: "k1" }],
			index: 1,
		});
		const elementsExtras = { current: { foo: "bar" } };
		mockUseElements.mockReturnValue({ elementsExtras });

		render(<HistoryOfElementsExtras />);

		expect(elementsExtras.current).toEqual({ foo: "bar" });
	});

	it("restores extras from history map when key already seen", () => {
		mockUseAppSelector.mockReturnValueOnce({
			history: [{ key: "k1" }],
			index: 1,
		});
		const elementsExtras = { current: { foo: "bar" } };
		mockUseElements.mockReturnValue({ elementsExtras });

		const { rerender } = render(<HistoryOfElementsExtras />);

		// change current extras, then move away and back to same key
		elementsExtras.current = { foo: "changed" };
		mockUseAppSelector.mockReturnValueOnce({
			history: [{ key: "k1" }, { key: "k2" }],
			index: 2,
		});
		rerender(<HistoryOfElementsExtras />);

		mockUseAppSelector.mockReturnValueOnce({
			history: [{ key: "k1" }, { key: "k2" }],
			index: 1,
		});
		rerender(<HistoryOfElementsExtras />);

		expect(elementsExtras.current).toEqual({ foo: "bar" });
	});
});
