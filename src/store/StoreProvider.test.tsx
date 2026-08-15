import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseWebBuilderProperties = vi.fn();

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

import { StoreProvider } from "./StoreProvider";

describe("StoreProvider", () => {
	it("renders children wrapped in a redux Provider using page from properties", () => {
		mockUseWebBuilderProperties.mockReturnValue({ page: undefined });

		render(
			<StoreProvider>
				<div>child-content</div>
			</StoreProvider>,
		);

		expect(screen.getByText("child-content")).not.toBeNull();
	});

	it("reuses the same store across re-renders", () => {
		mockUseWebBuilderProperties.mockReturnValue({ page: undefined });

		const { rerender } = render(
			<StoreProvider>
				<div>first</div>
			</StoreProvider>,
		);

		rerender(
			<StoreProvider>
				<div>second</div>
			</StoreProvider>,
		);

		expect(screen.getByText("second")).not.toBeNull();
	});
});
