import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useProperties } from "@/components/PropertiesProvider";
import { useInitI18n } from "./useInitI18n";

vi.mock("@/components/PropertiesProvider", () => ({
	useProperties: vi.fn(),
}));

const mockedUseProperties = vi.mocked(useProperties);

describe("useInitI18n", () => {
	it("initializes with the default language when translations has no locale", () => {
		mockedUseProperties.mockReturnValue({ translations: {} } as never);

		const { result } = renderHook(() => useInitI18n());

		expect(result.current.language).toBe("en");
	});

	it("initializes with translations.locale when provided", () => {
		mockedUseProperties.mockReturnValue({
			translations: { locale: "fr", greeting: "Bonjour" },
		} as never);

		const { result } = renderHook(() => useInitI18n());

		expect(result.current.language).toBe("fr");
	});

	it("does nothing when translations is undefined", () => {
		mockedUseProperties.mockReturnValue({} as never);

		const { result } = renderHook(() => useInitI18n());

		expect(result.current.language).toBe("en");
	});

	it("does nothing when translations.locale equals the current locale", () => {
		mockedUseProperties.mockReturnValue({
			translations: { locale: "en" },
		} as never);

		const { result, rerender } = renderHook(() => useInitI18n());
		const first = result.current;

		rerender();

		expect(result.current).toBe(first);
	});

	it("re-initializes the i18n instance when translations.locale changes", async () => {
		mockedUseProperties.mockReturnValue({
			translations: { locale: "en" },
		} as never);

		const { result, rerender } = renderHook(() => useInitI18n());
		const first = result.current;

		mockedUseProperties.mockReturnValue({
			translations: { locale: "fr", greeting: "Bonjour" },
		} as never);
		rerender();

		await waitFor(() => {
			expect(result.current).not.toBe(first);
		});
		expect(result.current.language).toBe("fr");
	});

	it("cleans up without updating state after unmount before init resolves", async () => {
		mockedUseProperties.mockReturnValue({
			translations: { locale: "en" },
		} as never);

		const { unmount, rerender } = renderHook(() => useInitI18n());

		mockedUseProperties.mockReturnValue({
			translations: { locale: "fr" },
		} as never);
		rerender();
		unmount();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
	});
});
