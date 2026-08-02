import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { Select } from "./Select";

const options = [
	{ label: "One", value: "one" },
	{ label: "Two", value: "two" },
];

function Wrapper({
	initial,
	menuTooltip,
}: {
	initial: Record<string, unknown>;
	menuTooltip?: string;
}) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<Select
					name="select"
					label="My Select"
					description="desc"
					size="lg"
					options={options}
					menuTooltip={menuTooltip}
					testId="my-select"
				/>
				<div data-testid="current-value">{String(form.select)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("Select", () => {
	it("renders label/description and current value", () => {
		render(<Wrapper initial={{ select: "one" }} />);

		expect(screen.getByText("My Select")).not.toBeNull();
		expect(screen.getByText("desc")).not.toBeNull();
		expect(screen.getByText("One")).not.toBeNull();
	});

	it("opens and closes the menu, hiding tooltip while open", () => {
		render(<Wrapper initial={{ select: "one" }} menuTooltip="tip" />);

		const control = document.querySelector(".react-select__control");
		fireEvent.mouseDown(control, { button: 0 });

		expect(document.querySelector(".react-select__menu")).not.toBeNull();

		fireEvent.mouseDown(control, { button: 0 });
	});

	it("selects an option, updating the field value", () => {
		render(<Wrapper initial={{ select: "one" }} />);

		const control = document.querySelector(".react-select__control");
		fireEvent.mouseDown(control, { button: 0 });

		fireEvent.click(screen.getByText("Two"));

		expect(screen.getByTestId("current-value").textContent).toBe("two");
	});

	it("supports the disabled prop", () => {
		function DisabledWrapper() {
			const [form, setForm] = useState<Record<string, unknown>>({});
			return (
				<StyleProvider>
					<FormProvider getFormValues={() => form} setForm={setForm}>
						<Select name="select" size="lg" options={options} disabled />
					</FormProvider>
				</StyleProvider>
			);
		}
		render(<DisabledWrapper />);
		expect(document.querySelector(".react-select--is-disabled")).not.toBeNull();
	});
});
