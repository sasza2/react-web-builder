import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHTMLTransform } from "./useHTMLTransform";

const transformMock = vi.fn();

vi.mock("@/utils/html2json/transform", () => ({
	transform: (...args: unknown[]) => transformMock(...args),
}));

beforeEach(() => {
	transformMock.mockClear();
});

describe("useHTMLTransform", () => {
	it("returns empty nodes and null errors before the transform resolves", () => {
		transformMock.mockReturnValue([[], null]);
		const { result } = renderHook(() => useHTMLTransform("<p>hi</p>"));

		expect(result.current).toEqual([[], null]);
	});

	it("sets nodes and errors once the async transform resolves", async () => {
		const nodes = [{ type: "text", value: "hi" }];
		const errors = { errors: [] };
		transformMock.mockReturnValue([nodes, errors]);

		const { result } = renderHook(() =>
			useHTMLTransform("<p>hi</p>", "prefix"),
		);

		await waitFor(() => {
			expect(result.current[0]).toEqual(nodes);
		});
		expect(result.current[1]).toEqual(errors);
		expect(transformMock).toHaveBeenCalledWith("<p>hi</p>", {
			classNamePrefix: "prefix",
		});
	});

	it("re-runs the transform when value or className change", async () => {
		transformMock.mockReturnValue([[], null]);
		const { result, rerender } = renderHook(
			({ value, className }) => useHTMLTransform(value, className),
			{ initialProps: { value: "<p>a</p>", className: "" } },
		);

		await waitFor(() => expect(transformMock).toHaveBeenCalledTimes(1));

		const nodes = [{ type: "text", value: "b" }];
		transformMock.mockReturnValue([nodes, null]);
		rerender({ value: "<p>b</p>", className: "" });

		await waitFor(() => {
			expect(result.current[0]).toEqual(nodes);
		});
		expect(transformMock).toHaveBeenCalledTimes(2);
	});

	it("does not update state after unmount (mounted guard)", async () => {
		transformMock.mockReturnValue([[{ type: "text", value: "late" }], null]);

		const { unmount } = renderHook(() => useHTMLTransform("<p>a</p>"));
		unmount();

		// Allow any pending microtasks/effects to flush; no error should occur
		// from setting state on an unmounted component.
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
});
