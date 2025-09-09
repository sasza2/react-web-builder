import { expect, test } from "@playwright/test";

import { addBreakpoint } from "./fixtures/breakpoint/addBreakpoint";
import { goThroughHints } from "./fixtures/goThroughHints";

test("add breakpoint", async ({ page }) => {
	await page.goto("/?mode=preview&story=webbuilder--web-builder-story");
	await goThroughHints(page);

	await addBreakpoint(page, {
		from: 480,
	});

	const currentBreakpoint = await page
		.getByTestId("breakpointSelect")
		.textContent();
	expect(currentBreakpoint).toBe("480px - 1280px");
});
