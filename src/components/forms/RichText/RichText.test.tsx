import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./Editor/Editor", () => ({
	Editor: ({
		autoFocus,
		colorAvailable,
		hyperlinkAvailable,
		setValue,
		value,
	}: {
		autoFocus?: boolean;
		colorAvailable?: boolean;
		hyperlinkAvailable?: boolean;
		setValue: (value: unknown) => void;
		value: unknown;
	}) => (
		<div>
			<div data-testid="editor-value">{JSON.stringify(value)}</div>
			<div data-testid="editor-flags">
				{JSON.stringify({ autoFocus, colorAvailable, hyperlinkAvailable })}
			</div>
			<button
				type="button"
				data-testid="editor-change"
				onClick={() =>
					setValue([{ type: "paragraph", children: [{ text: "x" }] }])
				}
			>
				change
			</button>
		</div>
	),
}));

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { RichText } from "./RichText";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

function Wrapper({ initial }: { initial: Record<string, unknown> }) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<FormProvider getFormValues={() => form} setForm={setForm}>
			<RichText
				name="text"
				label="My Rich Text"
				autoFocus
				colorAvailable
				hyperlinkAvailable
			/>
			<div data-testid="current-value">{JSON.stringify(form.text)}</div>
		</FormProvider>
	);
}

describe("RichText", () => {
	it("renders the label and passes the field value/flags to Editor", () => {
		renderWithTheme(
			<Wrapper
				initial={{ text: [{ type: "paragraph", children: [{ text: "a" }] }] }}
			/>,
		);

		expect(screen.getByText("My Rich Text")).not.toBeNull();
		expect(screen.getByTestId("editor-flags").textContent).toBe(
			JSON.stringify({
				autoFocus: true,
				colorAvailable: true,
				hyperlinkAvailable: true,
			}),
		);
	});

	it("updates the field value through Editor's setValue", () => {
		renderWithTheme(<Wrapper initial={{ text: [] }} />);

		fireEvent.click(screen.getByTestId("editor-change"));

		expect(screen.getByTestId("current-value").textContent).toBe(
			JSON.stringify([{ type: "paragraph", children: [{ text: "x" }] }]),
		);
	});
});
