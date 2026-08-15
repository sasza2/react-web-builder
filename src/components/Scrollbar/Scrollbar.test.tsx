import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { StyleProvider } from "../StyleProvider";
import { Scrollbar } from "./Scrollbar";

describe("Scrollbar", () => {
	it("renders its children inside a container", () => {
		render(
			<StyleProvider>
				<Scrollbar>
					<span>child-content</span>
				</Scrollbar>
			</StyleProvider>,
		);
		expect(screen.getByText("child-content")).not.toBeNull();
	});
});
