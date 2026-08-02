import { afterEach, describe, expect, it, vi } from "vitest";

import pageView from "./pageView";

describe("pageView", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("opens url in a new tab and focuses it", () => {
		const focus = vi.fn();
		const openSpy = vi
			.spyOn(window, "open")
			.mockReturnValue({ focus } as unknown as Window);

		pageView("https://example.com");

		expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank");
		expect(focus).toHaveBeenCalled();
	});
});
