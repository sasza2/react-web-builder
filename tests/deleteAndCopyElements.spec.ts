import { expect, test } from "@playwright/test";

import { getBreakpointDetails } from "./fixtures/breakpoint/getBreakpointDetails";
import {
	clickPopupItem,
	openElementContextMenu,
	openGridContextMenu,
} from "./fixtures/elements/contextMenu";
import { createElement } from "./fixtures/elements/createElement";
import { getElementsIds } from "./fixtures/elements/elements";
import { goThroughHints } from "./fixtures/goThroughHints";
import { sleep } from "./fixtures/sleep";

test("delete element with Delete key", async ({ page }) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);

	const breakpointDetails = await getBreakpointDetails(page);
	await page.getByTestId("sidebarBack").click();

	const elementId = await createElement(
		page,
		"basic",
		"Box",
		1,
		breakpointDetails,
	);
	expect(elementId).toBeTruthy();

	const elementsBefore = await getElementsIds(page);
	expect(elementsBefore).toContain(elementId);

	await page.locator(`.react-panzoom-element--id-${elementId}`).click();
	await page.keyboard.press("Delete");
	await sleep(300);

	const elementsAfter = await getElementsIds(page);
	expect(elementsAfter).not.toContain(elementId);
});

test("delete element via context menu", async ({ page }) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);

	const breakpointDetails = await getBreakpointDetails(page);
	await page.getByTestId("sidebarBack").click();

	const elementId = await createElement(
		page,
		"basic",
		"Box",
		1,
		breakpointDetails,
	);
	expect(elementId).toBeTruthy();

	await openElementContextMenu(page, elementId);
	await clickPopupItem(page, "Delete element");
	await sleep(300);

	const elementsAfter = await getElementsIds(page);
	expect(elementsAfter).not.toContain(elementId);
});

test("copy element via context menu and paste it", async ({ page }) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);

	const breakpointDetails = await getBreakpointDetails(page);
	await page.getByTestId("sidebarBack").click();

	const elementId = await createElement(
		page,
		"basic",
		"Box",
		1,
		breakpointDetails,
	);
	expect(elementId).toBeTruthy();

	const elementsBefore = await getElementsIds(page);
	expect(elementsBefore.length).toBe(1);

	await openElementContextMenu(page, elementId);
	await clickPopupItem(page, "Copy element");
	await sleep(500);

	await openGridContextMenu(page, 500);
	await clickPopupItem(page, "Paste");

	await sleep(2500);

	const elementsAfter = await getElementsIds(page);
	expect(elementsAfter.length).toBe(2);
	expect(elementsAfter).toContain(elementId);
});
