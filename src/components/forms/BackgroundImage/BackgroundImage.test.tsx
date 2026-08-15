import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../ImageUpload", () => ({
	ImageUpload: ({ name }: { name: string }) => (
		<div data-testid="image-upload">{name}</div>
	),
}));

vi.mock("../Length", () => ({
	Length: () => <div data-testid="length" />,
}));

vi.mock("../Radio", () => ({
	Radio: ({
		name,
		label,
		options,
	}: {
		name: string;
		label: string;
		options: { label: string; type: string; extra?: React.ReactNode }[];
	}) => (
		<div data-testid={`radio-${name}`}>
			<span>{label}</span>
			{options.map((option) => (
				<div key={option.type}>
					{option.label}
					{option.extra}
				</div>
			))}
		</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { BackgroundImage } from "./BackgroundImage";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("BackgroundImage", () => {
	it("renders with all fields", () => {
		renderWithTheme(<BackgroundImage name="background" />);

		expect(screen.getByText("element.backgroundImage.name")).not.toBeNull();
		expect(screen.getByTestId("image-upload")).not.toBeNull();
		expect(screen.getByTestId("radio-background.size")).not.toBeNull();
		expect(screen.getByTestId("radio-background.position")).not.toBeNull();
		expect(screen.getByTestId("radio-background.repeat")).not.toBeNull();
		expect(screen.getAllByTestId("length").length).toBe(2);
	});

	it("passes testId through assignTestProp", () => {
		const { container } = renderWithTheme(
			<BackgroundImage name="background" testId="bg" />,
		);
		expect(
			container.querySelector('[data-testid*="backgroundImage"]'),
		).not.toBeNull();
	});
});
