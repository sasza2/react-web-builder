import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { BackgroundDiv } from "./DotBackground.styled";

describe("DotBackground.styled", () => {
	it("renders", () => {
		const { container } = render(<BackgroundDiv />);

		expect(container.firstChild).not.toBeNull();
	});
});
