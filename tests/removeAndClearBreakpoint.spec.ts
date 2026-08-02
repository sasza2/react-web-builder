import { expect, test } from "@playwright/test";

import { addBreakpoint } from "./fixtures/breakpoint/addBreakpoint";
import { clearBreakpoint, removeBreakpoint } from "./fixtures/breakpoint/removeBreakpoint";
import { getBreakpointDetails } from "./fixtures/breakpoint/getBreakpointDetails";
import { createElement } from "./fixtures/elements/createElement";
import { getElementsIds } from "./fixtures/elements/elements";
import { goThroughHints } from "./fixtures/goThroughHints";
import { sleep } from "./fixtures/sleep";

test("remove a breakpoint", async ({ page }) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);

	await addBreakpoint(page, {
		from: 480,
	});

	const currentBreakpoint = await page
		.getByTestId("breakpointSelect")
		.textContent();
	expect(currentBreakpoint).toBe("480px - 1280px");

	await page.getByTestId("breakpointSelect").click();
	await removeBreakpoint(page);

	await page.getByTestId("breakpointSelect").click();
	await sleep(200);
	await expect(page.getByTestId("breakpoint480")).toHaveCount(0);
});

test("clear a breakpoint removes all its elements", async ({ page }) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);

	const breakpointDetails = await getBreakpointDetails(page);
	await page.getByTestId("sidebarBack").click();

	await createElement(page, "basic", "Box", 1, breakpointDetails);
	await createElement(page, "basic", "Box", 20, breakpointDetails);

	const elementsBefore = await getElementsIds(page);
	expect(elementsBefore.length).toBe(2);

	await page.getByTestId("breakpointSelect").click();
	await clearBreakpoint(page);

	const elementsAfter = await getElementsIds(page);
	expect(elementsAfter.length).toBe(0);
});
