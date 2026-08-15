import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Container } from "./LoadMultipleBreakpoint.styled";

describe("LoadMultipleBreakpoint.styled", () => {
	it("renders Container without throwing", () => {
		const { container } = render(<Container data-testid="container" />);
		expect(container.querySelector("div")).not.toBeNull();
	});
});
