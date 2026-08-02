import { expect, test } from "@playwright/test";

import { getBreakpointDetails } from "./fixtures/breakpoint/getBreakpointDetails";
import { clickPopupItem, openElementContextMenu } from "./fixtures/elements/contextMenu";
import { createElement } from "./fixtures/elements/createElement";
import { getElementsIds } from "./fixtures/elements/elements";
import { selectElements } from "./fixtures/elements/selectElements";
import { goThroughHints } from "./fixtures/goThroughHints";
import { sleep } from "./fixtures/sleep";

test("select multiple elements with shift+click and delete them together", async ({
	page,
}) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);

	const breakpointDetails = await getBreakpointDetails(page);
	await page.getByTestId("sidebarBack").click();

	const elementIdA = await createElement(
		page,
		"basic",
		"Box",
		1,
		breakpointDetails,
	);
	const elementIdB = await createElement(
		page,
		"basic",
		"Box",
		20,
		breakpointDetails,
	);
	const elementIdC = await createElement(
		page,
		"basic",
		"Box",
		40,
		breakpointDetails,
	);

	expect(elementIdA).toBeTruthy();
	expect(elementIdB).toBeTruthy();
	expect(elementIdC).toBeTruthy();

	const elementsBefore = await getElementsIds(page);
	expect(elementsBefore.length).toBe(3);

	await selectElements(page, [elementIdA, elementIdB]);

	await openElementContextMenu(page, elementIdA);
	await clickPopupItem(page, "Delete elements");

	await sleep(300);

	const elementsAfter = await getElementsIds(page);
	expect(elementsAfter.length).toBe(1);
	expect(elementsAfter).toContain(elementIdC);
});
