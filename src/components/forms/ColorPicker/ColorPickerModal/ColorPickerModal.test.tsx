import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/RenderInSidebarModal", () => ({
	RenderInSidebarModal: ({
		children,
		open,
	}: {
		children?: React.ReactNode;
		open: boolean;
	}) => (open ? <div data-testid="sidebar-modal">{children}</div> : null),
}));

vi.mock("./GradientColorPicker", () => ({
	GradientColorPicker: ({
		setValue,
		value,
	}: {
		setValue: (value: string) => void;
		value: string;
	}) => (
		<div data-testid="gradient-picker">
			<span data-testid="gradient-value">{value}</span>
			<button
				type="button"
				data-testid="gradient-set"
				onClick={() => setValue("linear-gradient(90deg, #111, #222)")}
			>
				set gradient
			</button>
		</div>
	),
}));

vi.mock("./HexColorPicker", () => ({
	HexColorPicker: ({
		children,
		setValue,
		value,
	}: {
		children?: React.ReactNode;
		setValue: (value: string) => void;
		value: string;
	}) => (
		<div data-testid="hex-picker">
			<span data-testid="hex-value">{value}</span>
			<button
				type="button"
				data-testid="hex-set"
				onClick={() => setValue("#654321")}
			>
				set hex
			</button>
			{children}
		</div>
	),
}));

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { ColorPickerModal } from "./ColorPickerModal";

function Wrapper({
	allowGradient,
	initial,
	isOpen = true,
}: {
	allowGradient?: boolean;
	initial: Record<string, unknown>;
	isOpen?: boolean;
}) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<ColorPickerModal
					allowGradient={allowGradient}
					name="color"
					isOpen={isOpen}
					label="Pick"
				/>
				<div data-testid="current-value">{String(form.color)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("ColorPickerModal", () => {
	it("renders nothing when closed", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} isOpen={false} />);
		expect(screen.queryByTestId("sidebar-modal")).toBeNull();
	});

	it("renders the hex picker by default with the label", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		expect(screen.getByText("Pick")).not.toBeNull();
		expect(screen.getByTestId("hex-picker")).not.toBeNull();
		expect(screen.queryByText("color.type")).toBeNull();
	});

	it("shows the type switcher when allowGradient is true", () => {
		render(<Wrapper allowGradient initial={{ color: "#ffffff" }} />);
		expect(screen.getByText("color.type")).not.toBeNull();
	});

	it("starts on the gradient type when the value is already a gradient", () => {
		render(
			<Wrapper
				allowGradient
				initial={{ color: "linear-gradient(90deg, #fff, #000)" }}
			/>,
		);
		expect(screen.getByTestId("gradient-picker")).not.toBeNull();
	});

	// The hex/gradient type toggle icons are the two elements carrying a
	// `data-tooltip-id`; their tooltip text is only mounted on hover (react-
	// tooltip), so we target them via that attribute rather than by text.
	const getTypeToggles = (container: HTMLElement) =>
		Array.from(
			container.querySelectorAll("[data-tooltip-id]"),
		) as HTMLElement[];

	it("switches to gradient type and initializes the color", () => {
		const { container } = render(
			<Wrapper allowGradient initial={{ color: "#ffffff" }} />,
		);

		const [, gradientToggle] = getTypeToggles(container);
		fireEvent.click(gradientToggle);

		expect(screen.getByTestId("gradient-picker")).not.toBeNull();
	});

	it("does nothing when clicking the already-active type", () => {
		const { container } = render(
			<Wrapper allowGradient initial={{ color: "#ffffff" }} />,
		);

		const [hexToggle] = getTypeToggles(container);
		fireEvent.click(hexToggle);

		expect(screen.getByTestId("hex-picker")).not.toBeNull();
	});

	it("switches back to hex type using the first gradient color", () => {
		const { container } = render(
			<Wrapper
				allowGradient
				initial={{ color: "linear-gradient(90deg, #123456, #000)" }}
			/>,
		);

		const [hexToggle] = getTypeToggles(container);
		fireEvent.click(hexToggle);

		expect(screen.getByTestId("hex-picker")).not.toBeNull();
	});

	it("updates value through hex picker", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		fireEvent.click(screen.getByTestId("hex-set"));

		expect(screen.getByTestId("current-value").textContent).toBe("#654321");
	});
});
