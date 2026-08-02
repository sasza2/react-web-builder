import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/FormProperty", () => ({
	FormProperty: ({ name, prop }: { name: string; prop: { id: string } }) => (
		<div data-testid={`form-property-${name}`}>{prop.id}</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { FormObject } from "./FormObject";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("FormObject", () => {
	it("renders label and a FormProperty for each item", () => {
		renderWithTheme(
			<FormObject
				label="My Object"
				name="obj"
				formCreatorId="creator-1"
				of={[
					{ id: "a", type: "input" } as never,
					{ id: "b", type: "input" } as never,
				]}
			/>,
		);

		expect(screen.getByText("My Object")).not.toBeNull();
		expect(screen.getByTestId("form-property-obj.a")).not.toBeNull();
		expect(screen.getByTestId("form-property-obj.b")).not.toBeNull();
	});

	it("renders nothing extra when `of` is empty", () => {
		renderWithTheme(
			<FormObject label="Empty" name="obj" formCreatorId="c" of={[]} />,
		);
		expect(screen.getByText("Empty")).not.toBeNull();
	});
});
