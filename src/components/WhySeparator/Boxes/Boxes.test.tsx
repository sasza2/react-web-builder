import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/Separator", () => ({
	Separator: () => <div data-testid="separator" />,
}));

import { StyleProvider } from "@/components/StyleProvider";

import { AnimationSeparator, Boxes } from "./Boxes";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Boxes", () => {
	it("renders left/right layout without separator", () => {
		renderWithTheme(<Boxes hasSeparator={false} />);

		expect(screen.queryByTestId("separator")).toBeNull();
		expect(screen.getByText(/Lorem ipsum dolor sit amet/)).not.toBeNull();
	});

	it("renders separator layout when hasSeparator is true", () => {
		renderWithTheme(
			<Boxes
				hasSeparator
				animationSeparator={AnimationSeparator.Show}
				animationSpeed={1000}
			/>,
		);

		expect(screen.getByTestId("separator")).not.toBeNull();
	});

	it("renders hidden separator when animationSeparator is Hide", () => {
		renderWithTheme(
			<Boxes hasSeparator animationSeparator={AnimationSeparator.Hide} />,
		);

		expect(screen.getByTestId("separator")).not.toBeNull();
	});

	it("sets height on ref init via getBoundingClientRect", () => {
		const rectSpy = vi
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue({ height: 42 } as DOMRect);

		renderWithTheme(<Boxes hasSeparator={false} />);

		rectSpy.mockRestore();
	});
});
