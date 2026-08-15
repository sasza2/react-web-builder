import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../RangeSlider", () => ({
	RangeSlider: ({ name }: { name: string }) => (
		<div data-testid={`range-slider-${name}`} />
	),
}));

vi.mock("../..", () => ({
	ColorPicker: ({ name }: { name: string }) => (
		<div data-testid={`color-picker-${name}`} />
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { GradientColorPicker } from "./GradientColorPicker";

// Re-mock Select to actually drive FieldProvider's setValue through context,
// matching the BoxShadow.test.tsx convention used elsewhere in this repo.
vi.mock("../../../Select", async () => {
	const { useField: realUseField } = await vi.importActual<
		typeof import("@/components/FormProvider")
	>("@/components/FormProvider");
	return {
		Select: ({
			name,
			options,
		}: {
			name: string;
			options: { label: string; value: unknown }[];
		}) => {
			const { setValue } = realUseField(name);
			return (
				<div data-testid={`select-${name}`}>
					{options.map((o) => (
						<button
							key={String(o.value)}
							type="button"
							data-testid={`select-${name}-${o.value}`}
							onClick={() => setValue(o.value)}
						>
							{o.label}
						</button>
					))}
				</div>
			);
		},
	};
});

function Wrapper({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<StyleProvider>
			<GradientColorPicker setValue={onChange} value={value} />
		</StyleProvider>
	);
}

describe("GradientColorPicker", () => {
	it("renders type select, angle slider, and one row per color for a linear gradient", () => {
		render(
			<Wrapper
				value="linear-gradient(90deg, #111 0%, #222 100%)"
				onChange={vi.fn()}
			/>,
		);

		expect(screen.getByTestId("select-type")).not.toBeNull();
		expect(screen.getByTestId("range-slider-angle")).not.toBeNull();
		expect(screen.getAllByTestId("range-slider-percent").length).toBe(2);
		expect(screen.getAllByTestId("color-picker-color").length).toBe(2);
	});

	it("does not render the angle slider for radial gradients", () => {
		render(
			<Wrapper
				value="radial-gradient(circle, #111 0%, #222 100%)"
				onChange={vi.fn()}
			/>,
		);

		expect(screen.queryByTestId("range-slider-angle")).toBeNull();
	});

	it("changes the gradient type", () => {
		const onChange = vi.fn();
		render(
			<Wrapper
				value="linear-gradient(90deg, #111 0%, #222 100%)"
				onChange={onChange}
			/>,
		);

		fireEvent.click(screen.getByTestId("select-type-radial-gradient"));

		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls[0][0]).toContain("radial-gradient");
	});

	it("adds a color", () => {
		const onChange = vi.fn();
		render(
			<Wrapper
				value="linear-gradient(90deg, #111 0%, #222 100%)"
				onChange={onChange}
			/>,
		);

		fireEvent.click(screen.getByText("color.gradient.add"));

		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls[0][0]).toContain("#000000");
	});

	it("removes a color when more than 2 exist", () => {
		const onChange = vi.fn();
		render(
			<Wrapper
				value="linear-gradient(90deg, #111 0%, #222 50%, #333 100%)"
				onChange={onChange}
			/>,
		);

		fireEvent.click(screen.getByText("color.gradient.remove"));

		expect(onChange).toHaveBeenCalled();
	});

	it("disables removing colors when only 2 remain (click is a no-op)", () => {
		// RemoveGhostButton only styles disabled state via `$disabled` and
		// conditionally omits `onClick` -- it never sets the native `disabled`
		// DOM attribute -- so we assert the no-op behavior via onChange rather
		// than the `disabled` property.
		const onChange = vi.fn();
		render(
			<Wrapper
				value="linear-gradient(90deg, #111 0%, #222 100%)"
				onChange={onChange}
			/>,
		);

		fireEvent.click(screen.getByText("color.gradient.remove"));

		expect(onChange).not.toHaveBeenCalled();
	});
});
