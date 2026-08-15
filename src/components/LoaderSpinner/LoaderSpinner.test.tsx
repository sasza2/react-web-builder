import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("styled-components", async () => {
	const actual =
		await vi.importActual<typeof import("styled-components")>(
			"styled-components",
		);
	return {
		...actual,
		useTheme: vi.fn(() => ({ colors: { darkBlue: "#123456" } })),
	};
});

import { LoaderSpinner } from "./LoaderSpinner";

describe("LoaderSpinner", () => {
	it("renders the loader icon with default width and theme color", () => {
		const { container } = render(<LoaderSpinner />);
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders with a custom color and width", () => {
		const { container } = render(<LoaderSpinner color="red" width={40} />);
		expect(container.querySelector("svg")).not.toBeNull();
	});
});
