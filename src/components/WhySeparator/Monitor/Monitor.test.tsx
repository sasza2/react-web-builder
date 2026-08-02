import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { StyleProvider } from "@/components/StyleProvider";

import { Monitor } from "./Monitor";

describe("Monitor", () => {
	it("renders children inside the monitor screen", () => {
		render(
			<StyleProvider>
				<Monitor>
					<div>inner-content</div>
				</Monitor>
			</StyleProvider>,
		);

		expect(screen.getByText("inner-content")).not.toBeNull();
	});
});
