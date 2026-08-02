import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUsePresetColors = vi.fn();
vi.mock("@/hooks/usePresetColors", () => ({
	usePresetColors: () => mockUsePresetColors(),
}));

vi.mock("./Color", () => ({
	Color: ({
		active,
		color,
		onClick,
	}: {
		active?: boolean;
		color: string;
		onClick?: () => void;
	}) => (
		<button
			type="button"
			data-testid={`color-${color}`}
			data-active={String(!!active)}
			onClick={onClick}
		>
			{color}
		</button>
	),
}));

vi.mock("./ColorPickerModal", () => ({
	ColorPickerModal: ({
		isOpen,
		onClose,
	}: {
		isOpen: boolean;
		onClose?: () => void;
	}) =>
		isOpen ? (
			<div data-testid="color-picker-modal">
				<button type="button" data-testid="close-modal" onClick={onClose}>
					close
				</button>
			</div>
		) : null,
}));

vi.mock("./CustomColors/DefaultCustomColors", () => ({
	DefaultCustomColors: ({ value }: { value: string }) => (
		<div data-testid="default-custom-colors">{String(value)}</div>
	),
}));

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { ColorPicker } from "./ColorPicker";

function Wrapper({
	customColors,
	initial,
	showCustomColors,
	showDefaultColor,
	showPresetColors,
}: {
	customColors?: React.ReactNode;
	initial: Record<string, unknown>;
	showCustomColors?: boolean;
	showDefaultColor?: boolean;
	showPresetColors?: boolean;
}) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<ColorPicker
					name="color"
					label="Pick a color"
					defaultValue="#111111"
					customColors={customColors}
					showCustomColors={showCustomColors}
					showDefaultColor={showDefaultColor}
					showPresetColors={showPresetColors}
				/>
				<div data-testid="current-value">{String(form.color)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("ColorPicker", () => {
	beforeEach(() => {
		mockUsePresetColors.mockReturnValue(["#ff0000ff", "#00ff00ff"]);
	});

	it("renders label, default and preset colors, and custom colors by default", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		expect(screen.getByText("color.default")).not.toBeNull();
		expect(screen.getByText("color.preset")).not.toBeNull();
		expect(screen.getByText("color.custom")).not.toBeNull();
		expect(screen.getByTestId("color-#ff0000ff")).not.toBeNull();
		expect(screen.getByTestId("color-#00ff00ff")).not.toBeNull();
		expect(screen.getByTestId("default-custom-colors")).not.toBeNull();
	});

	it("hides default/preset/custom sections when disabled", () => {
		render(
			<Wrapper
				initial={{ color: "#ffffff" }}
				showCustomColors={false}
				showDefaultColor={false}
				showPresetColors={false}
			/>,
		);

		expect(screen.queryByText("color.default")).toBeNull();
		expect(screen.queryByText("color.preset")).toBeNull();
		expect(screen.queryByText("color.custom")).toBeNull();
	});

	it("renders provided custom colors instead of the default ones", () => {
		render(
			<Wrapper
				initial={{ color: "#ffffff" }}
				customColors={<div data-testid="custom-slot">custom</div>}
			/>,
		);

		expect(screen.getByTestId("custom-slot")).not.toBeNull();
		expect(screen.queryByTestId("default-custom-colors")).toBeNull();
	});

	it("shows a hex text input for a plain hex color", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);
		expect(screen.getByTestId("color")).not.toBeNull();
	});

	it("also shows the hex text input for transparent (getColorType treats it as Hex)", () => {
		render(<Wrapper initial={{ color: "transparent" }} />);
		expect(screen.getByTestId("color")).not.toBeNull();
	});

	it("selects the default value", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		fireEvent.click(screen.getByTestId("color-#111111ff"));

		expect(screen.getByTestId("current-value").textContent).toBe("null");
	});

	it("selects transparent", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		fireEvent.click(screen.getByTestId("color-transparent"));

		expect(screen.getByTestId("current-value").textContent).toBe("transparent");
	});

	it("selects a preset color, normalizing it", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		fireEvent.click(screen.getByTestId("color-#ff0000ff"));

		expect(screen.getByTestId("current-value").textContent).toBe("#ff0000ff");
	});

	it("opens the sketch modal on click and closes it", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		fireEvent.click(screen.getByTestId("color-#ffffffff"));
		expect(screen.getByTestId("color-picker-modal")).not.toBeNull();

		fireEvent.click(screen.getByTestId("close-modal"));
		expect(screen.queryByTestId("color-picker-modal")).toBeNull();
	});

	it("does not reopen the sketch modal on a second click while already open", () => {
		render(<Wrapper initial={{ color: "#ffffff" }} />);

		fireEvent.click(screen.getByTestId("color-#ffffffff"));
		fireEvent.click(screen.getByTestId("color-#ffffffff"));

		expect(screen.getByTestId("color-picker-modal")).not.toBeNull();
	});

	it("uses the raw gradient value as the swatch color for gradients", () => {
		render(
			<Wrapper initial={{ color: "linear-gradient(90deg, #111, #222)" }} />,
		);

		expect(
			screen.getByTestId("color-linear-gradient(90deg, #111, #222)"),
		).not.toBeNull();
	});

	it("normalizes the value passed to onBlur", () => {
		const onBlur = vi.fn();
		function OnBlurWrapper() {
			const [form, setForm] = useState<Record<string, unknown>>({
				color: "#ffffff",
			});
			return (
				<StyleProvider>
					<FormProvider getFormValues={() => form} setForm={setForm}>
						<ColorPicker name="color" onBlur={onBlur} />
					</FormProvider>
				</StyleProvider>
			);
		}
		render(<OnBlurWrapper />);

		const input = screen.getByTestId("color") as HTMLInputElement;
		fireEvent.focus(input);
		input.value = "abcdef";
		fireEvent.blur(input);

		expect(onBlur).toHaveBeenCalledWith("#abcdefff");
	});
});
