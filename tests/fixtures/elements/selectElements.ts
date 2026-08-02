import type { Page } from "@playwright/test";

import { sleep } from "../sleep";
import { getElementById } from "./elements";

export const selectElements = async (page: Page, elementIds: string[]) => {
	for await (const id of elementIds) {
		// eslint-disable-line no-restricted-syntax
		await getElementById(page, id).click({ modifiers: ["Shift"] });
		await sleep(100);
	}
};
