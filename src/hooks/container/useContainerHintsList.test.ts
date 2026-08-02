import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const t = (key: string) => key;
vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t }),
}));

import { useContainerHintsList } from "./useContainerHintsList";

describe("useContainerHintsList", () => {
	it("returns the list of hints", () => {
		const { result } = renderHook(() => useContainerHintsList());

		expect(result.current).toEqual([
			{
				selector: '[data-id="openContainer"]',
				title: "container.hints.openContainer",
			},
			{
				selector: '[data-id="breakpointHeight"]',
				title: "common:container.hints.breakpointHeight",
			},
		]);
	});

	it("memoizes the result across re-renders", () => {
		const { result, rerender } = renderHook(() => useContainerHintsList());
		const first = result.current;
		rerender();
		expect(result.current).toBe(first);
	});
});
