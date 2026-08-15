import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../Input", () => ({
	Input: ({ name, leftNode }: { name: string; leftNode?: React.ReactNode }) => (
		<div data-testid={`input-${name}`}>{leftNode}</div>
	),
}));

vi.mock("../Toggle", () => ({
	Toggle: ({ name, label }: { name: string; label?: React.ReactNode }) => (
		<div data-testid={`toggle-${name}`}>{label}</div>
	),
}));

import { URLInput } from "./URLInput";

describe("URLInput", () => {
	it("renders the location input only by default", () => {
		render(<URLInput name="link" />);

		expect(screen.getByTestId("input-link.location")).not.toBeNull();
		expect(screen.queryByTestId("toggle-link.openInNewTab")).toBeNull();
	});

	it("renders the open-in-new-tab toggle when canOpenInNewTab is true", () => {
		render(<URLInput name="link" canOpenInNewTab />);

		expect(screen.getByTestId("toggle-link.openInNewTab")).not.toBeNull();
	});
});
