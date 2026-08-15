import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/icons/Padding", () => ({
	Padding: ({ rotate }: { rotate?: number }) => (
		<div data-testid="padding-icon">{rotate ?? 0}</div>
	),
}));

vi.mock("../Input", () => ({
	Input: ({ name, leftNode }: { name: string; leftNode?: React.ReactNode }) => (
		<div data-testid={`input-${name}`}>{leftNode}</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { Padding } from "./Padding";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Padding", () => {
	it("renders header and 4 inputs", () => {
		renderWithTheme(<Padding name="padding" />);

		expect(screen.getByText("element.padding")).not.toBeNull();
		expect(screen.getByTestId("input-padding.left")).not.toBeNull();
		expect(screen.getByTestId("input-padding.top")).not.toBeNull();
		expect(screen.getByTestId("input-padding.right")).not.toBeNull();
		expect(screen.getByTestId("input-padding.bottom")).not.toBeNull();
		expect(screen.getAllByTestId("padding-icon").length).toBe(4);
	});

	it("supports testId prop", () => {
		const { container } = renderWithTheme(
			<Padding name="padding" testId="p" />,
		);
		expect(
			container.querySelector('[data-testid*="padding"][data-testid*="p"]'),
		).not.toBeNull();
	});
});
