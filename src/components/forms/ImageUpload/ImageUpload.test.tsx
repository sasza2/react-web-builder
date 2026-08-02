import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../Input", () => ({
	Input: ({ name, leftNode }: { name: string; leftNode: React.ReactNode }) => (
		<div data-testid={`input-${name}`}>{leftNode}</div>
	),
}));

vi.mock("./FileUpload", () => ({
	FileUpload: ({ name }: { name: string }) => (
		<div data-testid="file-upload">{name}</div>
	),
}));

import { ImageUpload } from "./ImageUpload";

describe("ImageUpload", () => {
	it("renders Input and FileUpload with correct props", () => {
		const onImageUpload = vi.fn();
		render(<ImageUpload name="image" onImageUpload={onImageUpload} />);

		expect(screen.getByTestId("input-image.location")).not.toBeNull();
		expect(screen.getByText("element.link.url")).not.toBeNull();
		expect(screen.getByTestId("file-upload")).not.toBeNull();
		expect(screen.getByText("image")).not.toBeNull();
	});
});
