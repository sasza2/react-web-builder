import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { RangeSlider } from "./RangeSlider";

function Wrapper({
	initial,
	max = 100,
	min,
	rightNode = "px",
	testId,
}: {
	initial: Record<string, unknown>;
	max?: number;
	min?: number;
	rightNode?: string;
	testId?: string;
}) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<RangeSlider
					name="range"
					label="My Range"
					max={max}
					min={min}
					rightNode={rightNode}
					testId={testId}
				/>
				<div data-testid="current-value">{String(form.range)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("RangeSlider", () => {
	it("renders label and input value", () => {
		const { container } = render(<Wrapper initial={{ range: 5 }} />);

		expect(screen.getByText("My Range")).not.toBeNull();
		expect(container.querySelector("input")).not.toBeNull();
	});

	it("renders without input when rightNode is not provided", () => {
		render(<Wrapper initial={{ range: 5 }} rightNode={null} />);
		expect(screen.queryByRole("slider")).not.toBeNull();
		expect(document.querySelectorAll("input").length).toBe(0);
	});

	it("passes testId down to the input", () => {
		render(<Wrapper initial={{ range: 5 }} testId="my-range" />);
		expect(screen.getByTestId("my-range.input")).not.toBeNull();
	});

	it("updates value via input, clamping to max", () => {
		const { container } = render(<Wrapper initial={{ range: 5 }} max={10} />);

		const input = container.querySelector("input");
		fireEvent.focus(input);
		input.value = "999";
		fireEvent.blur(input);

		expect(screen.getByTestId("current-value").textContent).toBe("10");
	});

	it("clamps negative values to 0", () => {
		const { container } = render(<Wrapper initial={{ range: 5 }} max={10} />);

		const input = container.querySelector("input");
		fireEvent.focus(input);
		input.value = "-5";
		fireEvent.blur(input);

		expect(screen.getByTestId("current-value").textContent).toBe("0");
	});

	it("clamps to min when provided", () => {
		const { container } = render(
			<Wrapper initial={{ range: 5 }} max={10} min={3} />,
		);

		const input = container.querySelector("input");
		fireEvent.focus(input);
		input.value = "1";
		fireEvent.blur(input);

		expect(screen.getByTestId("current-value").textContent).toBe("3");
	});

	it("falls back to 0 for non-numeric input", () => {
		const { container } = render(<Wrapper initial={{ range: 5 }} max={10} />);

		const input = container.querySelector("input");
		fireEvent.focus(input);
		input.value = "abc";
		fireEvent.blur(input);

		expect(screen.getByTestId("current-value").textContent).toBe("0");
	});
});
