import type { Page } from "@playwright/test";

import { getInputValueAsInt } from "../form";
import { getBreakpointZoom } from "./getBreakpointZoom";
import type { BreakpointDetails } from "./types";

export const getBreakpointDetails = async (
	page: Page,
): Promise<BreakpointDetails> => {
	const breakpointSelect = page.getByTestId("breakpointSelect");
	await breakpointSelect.click();

	const sidebar = page.getByTestId("sidebar");

	const from = await getInputValueAsInt(sidebar, "from");
	const cols = await getInputValueAsInt(sidebar, "cols");
	const rowHeight = await getInputValueAsInt(sidebar, "rowHeight");
	const paddingLeft = await getInputValueAsInt(sidebar, "padding.left");
	const paddingRight = await getInputValueAsInt(sidebar, "padding.right");
	const paddingTop = await getInputValueAsInt(sidebar, "padding.top");
	const paddingBottom = await getInputValueAsInt(sidebar, "padding.bottom");

	const padding = {
		left: paddingLeft,
		right: paddingRight,
		top: paddingTop,
		bottom: paddingBottom,
	};

	await breakpointSelect.click();

	const gridIn = page.locator(".react-panzoom__in");
	const gridInPosition = await gridIn.boundingBox();

	const breakpointWidth = from - paddingLeft - paddingRight;
	const zoom = await getBreakpointZoom(page, {
		from,
		padding,
	});

	const rows = Math.round(gridInPosition.height / zoom);

	const colWidth = breakpointWidth / cols;

	return {
		colWidth,
		cols,
		from,
		rowHeight,
		padding,
		rows,
	};
};
