import { expect, test } from "@playwright/test";

import { getBreakpointDetails } from "./fixtures/breakpoint/getBreakpointDetails";
import { openContainer } from "./fixtures/container/openContainer";
import { createElement } from "./fixtures/elements/createElement";
import { getElementById, getElementsIds } from "./fixtures/elements/elements";
import { goThroughHints } from "./fixtures/goThroughHints";
import { sleep } from "./fixtures/sleep";

test("drag an element into a container", async ({ page }) => {
	await page.goto("/iframe.html?id=webbuilder-builder--builder&viewMode=story");
	await goThroughHints(page);

	const breakpointDetails = await getBreakpointDetails(page);
	await page.getByTestId("sidebarBack").click();

	const containerId = await createElement(
		page,
		"basic",
		"Container",
		1,
		breakpointDetails,
	);
	expect(containerId).toBeTruthy();

	const container = getElementById(page, containerId);
	await container.click();

	await page
		.getByRole("button", { name: "Go to container space" })
		.waitFor();

	await openContainer(page);

	const elementsInContainerBefore = await getElementsIds(page);
	expect(elementsInContainerBefore).not.toContain(containerId);

	const childElementId = await createElement(
		page,
		"basic",
		"Box",
		1,
		breakpointDetails,
	);
	expect(childElementId).toBeTruthy();

	await sleep(300);

	const elementsInContainerAfter = await getElementsIds(page);
	expect(elementsInContainerAfter).toContain(childElementId);
});
