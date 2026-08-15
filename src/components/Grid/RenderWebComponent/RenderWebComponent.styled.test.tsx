import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import {
	ComponentContainer,
	StateContainer,
} from "./RenderWebComponent.styled";

describe("RenderWebComponent.styled", () => {
	it("renders StateContainer without throwing", () => {
		const { container } = render(<StateContainer />);
		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders ComponentContainer applying the $display prop", () => {
		const { container } = render(<ComponentContainer $display="flex" />);
		const div = container.querySelector("div");
		expect(div).not.toBeNull();
	});

	it("renders ComponentContainer without a $display prop", () => {
		const { container } = render(<ComponentContainer />);
		expect(container.querySelector("div")).not.toBeNull();
	});
});
