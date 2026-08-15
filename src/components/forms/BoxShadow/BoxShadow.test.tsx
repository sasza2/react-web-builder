import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../ColorPicker", async () => {
	const { useField } = await vi.importActual<
		typeof import("@/components/FormProvider")
	>("@/components/FormProvider");
	return {
		ColorPicker: ({ name }: { name: string }) => {
			const { setValue, value } = useField(name);
			return (
				<button
					type="button"
					data-testid={`color-picker-${name}`}
					onClick={() => setValue("red")}
				>
					{String(value)}
				</button>
			);
		},
	};
});

vi.mock("../RangeSlider", async () => {
	const { useField } = await vi.importActual<
		typeof import("@/components/FormProvider")
	>("@/components/FormProvider");
	return {
		RangeSlider: ({ name }: { name: string }) => {
			const { setValue, value } = useField(name);
			return (
				<button
					type="button"
					data-testid={`range-slider-${name}`}
					onClick={() => setValue(((value as number) || 0) + 1)}
				>
					{String(value)}
				</button>
			);
		},
	};
});

vi.mock("../Toggle", async () => {
	const { useField } = await vi.importActual<
		typeof import("@/components/FormProvider")
	>("@/components/FormProvider");
	return {
		Toggle: ({ name, label }: { name: string; label?: string }) => {
			const { setValue, value } = useField(name);
			return (
				<button
					type="button"
					data-testid={`toggle-${name}`}
					onClick={() => setValue(!value)}
				>
					{label ?? name}: {String(value)}
				</button>
			);
		},
	};
});

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { BoxShadow } from "./BoxShadow";

function Wrapper({ initial }: { initial: Record<string, unknown> }) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<BoxShadow name="boxShadow" testId="bs" />
				<div data-testid="current-value">{String(form.boxShadow)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("BoxShadow", () => {
	it("renders collapsed when no value", () => {
		render(<Wrapper initial={{}} />);

		expect(screen.getByText("element.boxShadow.name")).not.toBeNull();
		expect(screen.getByTestId("toggle-enabled")).not.toBeNull();
		expect(screen.queryByTestId("toggle-inset")).toBeNull();
	});

	it("supports testId prop", () => {
		const { container } = render(<Wrapper initial={{}} />);
		expect(
			container.querySelector('[data-testid*="boxShadow"]'),
		).not.toBeNull();
	});

	it("toggling on with no value sets default box shadow and shows fields", () => {
		render(<Wrapper initial={{}} />);

		fireEvent.click(screen.getByTestId("toggle-enabled"));

		expect(screen.getByTestId("current-value").textContent).toBe(
			"0px 4px 4px 0px #5E5E5E",
		);
		expect(screen.getByTestId("toggle-inset")).not.toBeNull();
		expect(screen.getByTestId("range-slider-horizontalLength")).not.toBeNull();
		expect(screen.getByTestId("range-slider-verticalLength")).not.toBeNull();
		expect(screen.getByTestId("range-slider-blurRadius")).not.toBeNull();
		expect(screen.getByTestId("range-slider-spreadRadius")).not.toBeNull();
		expect(screen.getByTestId("color-picker-color")).not.toBeNull();
	});

	it("toggling off clears value", () => {
		render(<Wrapper initial={{ boxShadow: "inset 1px 2px 3px 4px #fff" }} />);

		expect(screen.getByTestId("toggle-inset")).not.toBeNull();
		fireEvent.click(screen.getByTestId("toggle-enabled"));

		expect(screen.getByTestId("current-value").textContent).toBe("null");
		expect(screen.queryByTestId("toggle-inset")).toBeNull();
	});

	it("updates individual box shadow fields", () => {
		render(<Wrapper initial={{ boxShadow: "1px 2px 3px 4px #fff" }} />);

		fireEvent.click(screen.getByTestId("toggle-inset"));
		fireEvent.click(screen.getByTestId("range-slider-horizontalLength"));
		fireEvent.click(screen.getByTestId("range-slider-verticalLength"));
		fireEvent.click(screen.getByTestId("range-slider-blurRadius"));
		fireEvent.click(screen.getByTestId("range-slider-spreadRadius"));
		fireEvent.click(screen.getByTestId("color-picker-color"));

		expect(screen.getByTestId("current-value").textContent).toBe(
			"inset 2px 3px 4px 5px red",
		);
	});
});
