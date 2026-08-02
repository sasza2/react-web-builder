import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { StyleProvider } from "../../StyleProvider";
import { Container } from "./Resize.styled";

describe("Resize.styled", () => {
	it("renders Container with computed height from $height prop", () => {
		const { container } = render(
			<StyleProvider>
				<Container $height={321} />
			</StyleProvider>,
		);
		const div = container.firstChild as HTMLElement;
		expect(getComputedStyle(div).height).toBe("321px");
	});
});
