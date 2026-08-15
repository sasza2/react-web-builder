import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import theme from "@/components/StyleProvider/theme";

import { FormControl } from "./FormControl";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("FormControl", () => {
	it("renders children only when no label/description/errors are given", () => {
		renderWithTheme(
			<FormControl>
				<div>child content</div>
			</FormControl>,
		);

		expect(screen.getByText("child content")).not.toBeNull();
		expect(screen.queryByText("My Label")).toBeNull();
	});

	it("renders label when provided", () => {
		renderWithTheme(
			<FormControl label="My Label">
				<div>child</div>
			</FormControl>,
		);

		expect(screen.getByText("My Label")).not.toBeNull();
	});

	it("renders description when provided", () => {
		renderWithTheme(
			<FormControl description="My description">
				<div>child</div>
			</FormControl>,
		);

		expect(screen.getByText("My description")).not.toBeNull();
	});

	it("applies testId via assignTestProp", () => {
		renderWithTheme(
			<FormControl testId="my-form-control">
				<div>child</div>
			</FormControl>,
		);

		expect(screen.getByTestId("my-form-control")).not.toBeNull();
	});

	it("returns null error when name is not provided", () => {
		renderWithTheme(
			<FormControl errors={[{ name: "field", error: "Required" }]}>
				<div>child</div>
			</FormControl>,
		);

		expect(screen.queryByText("Required")).toBeNull();
	});

	it("returns null error when errors is not an array", () => {
		renderWithTheme(
			<FormControl name="field" errors={undefined}>
				<div>child</div>
			</FormControl>,
		);

		expect(screen.queryByText("Required")).toBeNull();
	});

	it("returns null error when no errors match the given name", () => {
		renderWithTheme(
			<FormControl name="field" errors={[{ name: "other", error: "Required" }]}>
				<div>child</div>
			</FormControl>,
		);

		expect(screen.queryByText("Required")).toBeNull();
	});

	it("renders matching errors as a list", () => {
		renderWithTheme(
			<FormControl
				name="field"
				errors={[
					{ name: "field", error: "Required" },
					{ name: "field", error: "Too short" },
					{ name: "other", error: "Ignored" },
				]}
			>
				<div>child</div>
			</FormControl>,
		);

		expect(screen.getByText("Required")).not.toBeNull();
		expect(screen.getByText("Too short")).not.toBeNull();
		expect(screen.queryByText("Ignored")).toBeNull();
	});
});
