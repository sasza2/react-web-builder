import { render, screen } from "@testing-library/react";
import React from "react";
import type { RenderInContainerProps } from "types";
import { describe, expect, it, vi } from "vitest";

const mockUseProperties = vi.fn();

vi.mock("../PropertiesProvider", () => ({
	useProperties: () => mockUseProperties(),
}));

vi.mock("@/utils/breakpoint", () => ({
	getBreakpointBackgroundColor: vi.fn(() => "#fff"),
}));

import { buildBreakpoint } from "@/testing/fixtures";

import { RenderInContainer } from "./RenderInContainer";

describe("RenderInContainer", () => {
	it("renders children directly when there is no container", () => {
		mockUseProperties.mockReturnValue({ container: undefined, page: {} });

		render(
			<RenderInContainer breakpoint={buildBreakpoint()}>
				<div>plain-child</div>
			</RenderInContainer>,
		);

		expect(screen.getByText("plain-child")).not.toBeNull();
	});

	it("renders children wrapped in the provided Container component", () => {
		const Container = ({
			children,
			backgroundColor,
		}: RenderInContainerProps) => (
			<div data-bg={backgroundColor} data-testid="custom-container">
				{children}
			</div>
		);
		mockUseProperties.mockReturnValue({
			container: Container,
			page: { id: "p1" },
		});

		render(
			<RenderInContainer breakpoint={buildBreakpoint({ id: "bp1" })}>
				<div>wrapped-child</div>
			</RenderInContainer>,
		);

		expect(screen.getByTestId("custom-container")).not.toBeNull();
		expect(screen.getByText("wrapped-child")).not.toBeNull();
	});
});
