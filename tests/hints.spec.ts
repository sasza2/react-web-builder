import { test } from "@playwright/test";

import { goThroughHints } from "./fixtures/goThroughHints";

test("go through hints", async ({ page }) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);
});
