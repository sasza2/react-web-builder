import type { Page } from "@playwright/test";

import { sleep } from "../sleep";

export const removeBreakpoint = async (page: Page) => {
	page.once("dialog", (dialog) => dialog.accept());

	const sidebar = page.getByTestId("sidebar");
	await sidebar.getByText("Delete breakpoint", { exact: true }).click();

	await sleep(300);
};

export const clearBreakpoint = async (page: Page) => {
	page.once("dialog", (dialog) => dialog.accept());

	const sidebar = page.getByTestId("sidebar");
	await sidebar.getByText("Clear breakpoint", { exact: true }).click();

	await sleep(300);
};
