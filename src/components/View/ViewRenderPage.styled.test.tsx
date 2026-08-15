import { render } from "@testing-library/react";
import React from "react";
import type { FontImport } from "types";
import { expect, it } from "vitest";

import { PageContainer } from "./ViewRenderPage.styled";

it("renders with font-family from $fontImport", () => {
	const { container } = render(
		<PageContainer
			$fontImport={{ fontFamily: "Arial" } as unknown as FontImport}
		>
			content
		</PageContainer>,
	);

	const style = getComputedStyle(container.firstChild as Element);
	expect(style.fontFamily).toBe("Arial");
	expect(style.display).toBe("flex");
});

it("renders with undefined font-family when $fontImport is null", () => {
	const { container } = render(
		<PageContainer $fontImport={null}>content</PageContainer>,
	);

	expect(container.firstChild).not.toBeNull();
});
