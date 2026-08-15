import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { Toggle } from "./Toggle";

function Wrapper({
	initial,
	onBlur,
}: {
	initial: Record<string, unknown>;
	onBlur?: (value: boolean) => void;
}) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<Toggle
					name="toggle"
					label="My Toggle"
					description="desc"
					onBlur={onBlur}
				/>
				<div data-testid="current-value">{String(form.toggle)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("Toggle", () => {
	it("renders label/description and checked state", () => {
		render(<Wrapper initial={{ toggle: true }} />);

		expect(screen.getByText("My Toggle")).not.toBeNull();
		expect(screen.getByText("desc")).not.toBeNull();
		expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(
			true,
		);
	});

	it("toggles value on change", () => {
		render(<Wrapper initial={{ toggle: false }} />);

		fireEvent.click(screen.getByRole("checkbox"));

		expect(screen.getByTestId("current-value").textContent).toBe("true");
	});

	it("calls onBlur with the new value when provided", () => {
		const onBlur = vi.fn();
		render(<Wrapper initial={{ toggle: false }} onBlur={onBlur} />);

		fireEvent.click(screen.getByRole("checkbox"));

		expect(onBlur).toHaveBeenCalledWith(true);
	});

	it("does not throw without onBlur", () => {
		render(<Wrapper initial={{ toggle: false }} />);
		expect(() => fireEvent.click(screen.getByRole("checkbox"))).not.toThrow();
	});
});
