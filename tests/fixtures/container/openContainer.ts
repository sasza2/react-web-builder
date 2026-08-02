import type { Page } from "@playwright/test";

import { sleep } from "../sleep";

export const openContainer = async (page: Page) => {
	await page.getByRole("button", { name: "Go to container space" }).click();

	await sleep(500);
};
