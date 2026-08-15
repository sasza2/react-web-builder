import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { StyleProvider } from "../../StyleProvider";
import { Container } from "./Modal.styled";

describe("Modal.styled", () => {
	it("renders the Container without errors", () => {
		const { container } = render(
			<StyleProvider>
				<Container />
			</StyleProvider>,
		);
		expect(container.firstChild).not.toBeNull();
	});
});
