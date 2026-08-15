import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";
import { TransformErrorTypes } from "@/utils/html2json/errors";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, unknown>) =>
			options ? `${key}:${JSON.stringify(options)}` : key,
	}),
}));

let fieldValue: { value: string } = { value: "" };
const setValueMock = vi.fn((next: { value: string }) => {
	fieldValue = next;
});
vi.mock("@/components/FormProvider", () => ({
	useField: (name: string) => ({
		name,
		value: fieldValue,
		setValue: setValueMock,
	}),
}));

const mockUseHTMLTransform = vi.fn();
vi.mock("@/hooks/useHTMLTransform", () => ({
	useHTMLTransform: (value: string) => mockUseHTMLTransform(value),
}));

vi.mock("../FormControl", () => ({
	FormControl: ({
		children,
		errors,
		label,
	}: React.PropsWithChildren<{
		errors?: Array<{ name: string; error: string }> | null;
		label?: string;
	}>) => (
		<div data-testid="form-control">
			{label}
			{(errors || []).map((e, i) => (
				<div key={i} data-testid="error">
					{e.error}
				</div>
			))}
			{children}
		</div>
	),
}));

import { InputHTML } from "./InputHTML";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("InputHTML", () => {
	beforeEach(() => {
		fieldValue = { value: "<div></div>" };
		setValueMock.mockClear();
		mockUseHTMLTransform.mockReturnValue([[], null]);
	});

	it("renders textarea with initial value and label", () => {
		renderWithTheme(<InputHTML name="html" label="HTML" />);

		const textarea = screen.getByDisplayValue(
			"<div></div>",
		) as HTMLTextAreaElement;
		expect(textarea).not.toBeNull();
		expect(screen.getByText("HTML")).not.toBeNull();
	});

	it("updates value on change", () => {
		renderWithTheme(<InputHTML name="html" />);

		const textarea = screen.getByDisplayValue(
			"<div></div>",
		) as HTMLTextAreaElement;
		fireEvent.change(textarea, { target: { value: "<p>x</p>" } });

		expect(setValueMock).toHaveBeenCalledWith({ value: "<p>x</p>" });
	});

	it("sets value and blurs focus state on blur", () => {
		renderWithTheme(<InputHTML name="html" />);

		const textarea = screen.getByDisplayValue(
			"<div></div>",
		) as HTMLTextAreaElement;
		fireEvent.focus(textarea);
		fireEvent.blur(textarea, { target: { value: "<span></span>" } });

		expect(setValueMock).toHaveBeenCalledWith({ value: "<span></span>" });
	});

	it("supports disabled prop", () => {
		renderWithTheme(<InputHTML name="html" disabled />);

		const textarea = screen.getByDisplayValue(
			"<div></div>",
		) as HTMLTextAreaElement;
		expect(textarea.disabled).toBe(true);
	});

	it("renders no errors when errors is null", () => {
		renderWithTheme(<InputHTML name="html" />);

		expect(screen.queryAllByTestId("error").length).toBe(0);
	});

	it("maps and filters every transform error type to translated strings", () => {
		mockUseHTMLTransform.mockReturnValue([
			[],
			{
				errors: [
					{ type: TransformErrorTypes.InvalidCSS, css: "bad" },
					{ type: TransformErrorTypes.UnsupportedCSS, css: "bad2" },
					{ type: TransformErrorTypes.UnsupportedCSSAttribute, prop: "foo" },
					{
						type: TransformErrorTypes.UnsupportedCSSSelector,
						selector: ".bar",
					},
					{
						type: TransformErrorTypes.UnsupportedCSSValue,
						prop: "color",
						value: "wrong",
					},
					{
						type: TransformErrorTypes.UnsupportedHTMLAttribute,
						tagName: "div",
						attribute: "foo",
					},
					{
						type: TransformErrorTypes.UnsupportedHTMLAttributeValue,
						tagName: "div",
						attribute: "foo",
						value: "bar",
					},
					{
						type: TransformErrorTypes.UnsupportedHTMLTagName,
						tagName: "custom-tag",
					},
					// unknown/default type falls back to null and is filtered out
					{ type: "unknown-type" } as never,
				],
			},
		]);

		renderWithTheme(<InputHTML name="html" />);

		const errorEls = screen.getAllByTestId("error");
		expect(errorEls.length).toBe(8);
	});
});
