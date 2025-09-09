import type { Page } from "@playwright/test";

import { sleep } from "../sleep";

export const selectBreakpoint = async (page: Page, testId: string) => {
	const breakpointSelect = page.getByTestId("breakpointSelect");
	await breakpointSelect.click();

	const option = page.getByTestId(testId);
	await option.scrollIntoViewIfNeeded();
	await option.click();

	await sleep(300);
};
