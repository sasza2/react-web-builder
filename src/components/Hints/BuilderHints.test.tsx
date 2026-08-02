import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseConfiguration = vi.fn();
const mockUseBuilderHintsList = vi.fn();

vi.mock("../ConfigurationProvider", () => ({
	useConfiguration: () => mockUseConfiguration(),
}));

vi.mock("./useBuilderHintsList", () => ({
	useBuilderHintsList: () => mockUseBuilderHintsList(),
}));

vi.mock("./Hints", () => ({
	Hints: ({ list, speed }: { list: unknown[]; speed: number }) => (
		<div data-testid="hints">
			{list.length}-{speed}
		</div>
	),
}));

import { BuilderHints } from "./BuilderHints";

describe("BuilderHints", () => {
	it("renders Hints with the builder hints list and speed 0", () => {
		mockUseConfiguration.mockReturnValue({ builderHintsId: 1 });
		mockUseBuilderHintsList.mockReturnValue([{ selector: ".a", title: "A" }]);

		render(<BuilderHints />);

		expect(screen.getByTestId("hints")).not.toBeNull();
		expect(screen.getByText("1-0")).not.toBeNull();
	});
});
