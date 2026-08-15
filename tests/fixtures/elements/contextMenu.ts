import type { Page } from "@playwright/test";

import { sleep } from "../sleep";
import { getElementById } from "./elements";

export const openElementContextMenu = async (page: Page, elementId: string) => {
	const element = getElementById(page, elementId);
	await element.click({ button: "right" });
	await sleep(200);
};

export const openGridContextMenu = async (page: Page, row: number) => {
	const gridIn = page.locator(".react-panzoom__in");
	const box = await gridIn.boundingBox();

	// use raw mouse coordinates (like createElement does) instead of locator.click,
	// since Playwright's actionability check flags this point as covered by the
	// "select new element" sidebar even though it is a real, interactive grid cell
	await page.mouse.click(box.x + 10, box.y + row, { button: "right" });
	await sleep(200);
};

export const clickPopupItem = async (page: Page, label: string) => {
	await page.getByText(label, { exact: true }).click();
	await sleep(200);
};
