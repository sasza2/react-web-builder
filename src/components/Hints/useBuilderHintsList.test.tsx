import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseWebBuilderProperties = vi.fn();

vi.mock("../PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { useBuilderHintsList } from "./useBuilderHintsList";

describe("useBuilderHintsList", () => {
	it("returns the default list when builderHints is not provided", () => {
		mockUseWebBuilderProperties.mockReturnValue({});

		const { result } = renderHook(() => useBuilderHintsList());

		expect(result.current).toHaveLength(5);
		expect(result.current[0].selector).toBe('[data-id="accordionItemButton"]');
	});

	it("appends builderHints from properties", () => {
		const extra = { selector: ".custom", title: "Custom" };
		mockUseWebBuilderProperties.mockReturnValue({ builderHints: [extra] });

		const { result } = renderHook(() => useBuilderHintsList());

		expect(result.current).toHaveLength(6);
		expect(result.current[5]).toEqual(extra);
	});
});
