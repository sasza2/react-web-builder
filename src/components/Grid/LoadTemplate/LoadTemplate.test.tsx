import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { LoadTemplate } from "./LoadTemplate";

vi.mock("../LoadTemplateForPage", () => ({
	LoadTemplateForPage: ({ children }: React.PropsWithChildren) => (
		<div data-testid="load-template-for-page">{children}</div>
	),
}));

vi.mock("../RestartTemplate", () => ({
	RestartTemplate: ({ children }: React.PropsWithChildren) => (
		<div data-testid="restart-template">{children}</div>
	),
}));

describe("LoadTemplate", () => {
	it("wraps children with LoadTemplateForPage and RestartTemplate, nested in the right order", () => {
		const { getByTestId, getByText } = render(
			<LoadTemplate>
				<span>child content</span>
			</LoadTemplate>,
		);

		const outer = getByTestId("load-template-for-page");
		const inner = getByTestId("restart-template");

		expect(outer.contains(inner)).toBe(true);
		expect(inner.contains(getByText("child content"))).toBe(true);
	});
});
