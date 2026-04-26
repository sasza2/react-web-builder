import { expect, test } from "@playwright/test";

import { goThroughHints } from "./fixtures/goThroughHints";
import { publish } from "./fixtures/publish";
import { waitForTemplate } from "./fixtures/template";

test("publish template", async ({ page }) => {
	await page.goto(
		"/iframe.html?id=webbuilder-templates--templates&viewMode=story",
	);
	await goThroughHints(page);
	await waitForTemplate(page);

	await publish(page);
	await page.goto(
		"/iframe.html?id=webbuilder-published--published&viewMode=story",
	);
	await expect(page).toHaveScreenshot("templatePublishedDesktop.png", {
		fullPage: true,
	});

	await page.setViewportSize({ width: 360, height: 600 });
	await expect(page).toHaveScreenshot("templatePublishedMobile.png", {
		fullPage: true,
	});
});
