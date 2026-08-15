import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { Radio } from "./Radio";

function Wrapper({ initial }: { initial: Record<string, unknown> }) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<Radio
					name="radio"
					label="My Radio"
					options={[
						{ type: "a", label: "Option A" },
						{ type: "b", label: "Option B", extra: <span>extra-b</span> },
					]}
				/>
				<div data-testid="current-value">{JSON.stringify(form.radio)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("Radio", () => {
	it("renders label and options", () => {
		render(<Wrapper initial={{}} />);

		expect(screen.getByText("My Radio")).not.toBeNull();
		expect(screen.getByText("Option A")).not.toBeNull();
		expect(screen.getByText("Option B")).not.toBeNull();
		expect(screen.getByText("extra-b")).not.toBeNull();
	});

	it("selects an option on click", () => {
		render(<Wrapper initial={{}} />);

		fireEvent.click(screen.getByText("Option A"));

		expect(screen.getByTestId("current-value").textContent).toBe(
			JSON.stringify({ type: "a" }),
		);
	});

	it("does nothing when clicking the already-selected option", () => {
		render(<Wrapper initial={{ radio: { type: "a" } }} />);

		fireEvent.click(screen.getByText("Option A"));

		expect(screen.getByTestId("current-value").textContent).toBe(
			JSON.stringify({ type: "a" }),
		);
	});

	it("preserves other value fields when switching selection", () => {
		render(<Wrapper initial={{ radio: { type: "a", extraProp: 1 } }} />);

		fireEvent.click(screen.getByText("Option B"));

		expect(screen.getByTestId("current-value").textContent).toBe(
			JSON.stringify({ type: "b", extraProp: 1 }),
		);
	});
});
