import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import { FormProvider, useField } from "@/components/FormProvider";
import theme from "@/components/StyleProvider/theme";

const render = (ui: React.ReactElement) =>
	rtlRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

vi.mock("@/components/icons/Icon", () => {
	const Icon = ({ icon }: { icon: string }) => (
		<span data-testid="icon">{icon}</span>
	);
	Icon.TextBold = "TextBold";
	Icon.TextItalic = "TextItalic";
	Icon.TextUnderline = "TextUnderline";
	Icon.TextLeft = "TextLeft";
	Icon.TextCenter = "TextCenter";
	Icon.TextRight = "TextRight";
	Icon.TextJustify = "TextJustify";
	Icon.LineHeight = "LineHeight";
	Icon.LetterSpacing = "LetterSpacing";
	return { Icon };
});

vi.mock("../Select", () => ({
	Select: ({ name }: { name: string }) => {
		const { value, setValue } = useField<unknown>(name);
		return (
			<div data-testid={`select-${name}`}>
				<span>{JSON.stringify(value)}</span>
				<button type="button" onClick={() => setValue("changed")}>
					change-{name}
				</button>
			</div>
		);
	},
}));

import { FontOptions } from "./FontOptions";

function Wrapper({ initial }: { initial: Record<string, unknown> }) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<FormProvider getFormValues={() => form} setForm={setForm}>
			<FontOptions name="fontOptions" />
		</FormProvider>
	);
}

describe("FontOptions", () => {
	it("renders with default (empty) value", () => {
		render(<Wrapper initial={{}} />);

		expect(screen.getAllByTestId("icon")).toHaveLength(9);
		expect(screen.getByTestId("select-fontSize")).not.toBeNull();
	});

	it("renders with an existing value and highlights active states", () => {
		render(
			<Wrapper
				initial={{
					fontOptions: {
						bold: true,
						italic: true,
						underline: true,
						textAlign: "center",
						size: 14.7,
						lineHeight: "1.5",
						letterSpacing: "2px",
					},
				}}
			/>,
		);

		expect(screen.getByText("14")).not.toBeNull();
	});

	it("toggles bold/italic/underline and text align and font size/line height/letter spacing", () => {
		render(<Wrapper initial={{ fontOptions: {} }} />);

		fireEvent.click(screen.getByText("TextBold"));
		fireEvent.click(screen.getByText("TextItalic"));
		fireEvent.click(screen.getByText("TextUnderline"));
		fireEvent.click(screen.getByText("TextLeft"));
		fireEvent.click(screen.getByText("TextCenter"));
		fireEvent.click(screen.getByText("TextRight"));
		fireEvent.click(screen.getByText("TextJustify"));

		fireEvent.click(screen.getByText("change-fontSize"));
		fireEvent.click(screen.getByText("change-lineHeight"));
		fireEvent.click(screen.getByText("change-letterSpacing"));
	});

	it("supports right and justify text align active states", () => {
		render(<Wrapper initial={{ fontOptions: { textAlign: "right" } }} />);
		expect(screen.getByTestId("select-fontSize")).not.toBeNull();

		render(<Wrapper initial={{ fontOptions: { textAlign: "justify" } }} />);
	});
});
