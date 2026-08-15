import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

let fieldValue: string | undefined;
const setValueMock = vi.fn((next: string) => {
	fieldValue = next;
});
vi.mock("@/components/FormProvider", () => ({
	useField: (name: string) => ({
		name,
		value: fieldValue,
		setValue: setValueMock,
	}),
}));

vi.mock("../FormControl", () => ({
	FormControl: ({
		children,
		label,
	}: React.PropsWithChildren<{ label?: string }>) => (
		<div data-testid="form-control">
			{label}
			{children}
		</div>
	),
}));

import { Input } from "./Input";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Input", () => {
	beforeEach(() => {
		fieldValue = undefined;
		setValueMock.mockClear();
	});

	it("renders with label, left and right nodes", () => {
		renderWithTheme(
			<Input
				name="field1"
				label="My Field"
				leftNode="$"
				rightNode="USD"
				testId="input1"
			/>,
		);

		expect(screen.getByText("My Field")).not.toBeNull();
		expect(screen.getByText("$")).not.toBeNull();
		expect(screen.getByText("USD")).not.toBeNull();
		expect(screen.getByTestId("input1")).not.toBeNull();
	});

	it("initializes input value from field value", () => {
		fieldValue = "hello";
		renderWithTheme(<Input name="field1" testId="input1" />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		expect(input.value).toBe("hello");
	});

	it("initializes to empty string when field value is undefined", () => {
		renderWithTheme(<Input name="field1" testId="input1" />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		expect(input.value).toBe("");
	});

	it("clears input value on focus when clearOnClick is set", () => {
		fieldValue = "initial";
		renderWithTheme(<Input name="field1" testId="input1" clearOnClick />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		fireEvent.focus(input);

		expect(setValueMock).toHaveBeenCalledWith("");
		expect(input.value).toBe("");
	});

	it("does not clear on focus when clearOnClick is not set", () => {
		fieldValue = "initial";
		renderWithTheme(<Input name="field1" testId="input1" />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		fireEvent.focus(input);

		expect(setValueMock).not.toHaveBeenCalled();
	});

	it("calls onBlur with normalized value and setValue when value differs", () => {
		fieldValue = "old";
		const onBlur = vi.fn();
		renderWithTheme(<Input name="field1" testId="input1" onBlur={onBlur} />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "new" } });
		fireEvent.blur(input);

		expect(setValueMock).toHaveBeenCalledWith("new");
		expect(onBlur).toHaveBeenCalledWith("new");
		expect(input.value).toBe("new");
	});

	it("calls onBlur without setValue when value is unchanged", () => {
		fieldValue = "same";
		const onBlur = vi.fn();
		renderWithTheme(<Input name="field1" testId="input1" onBlur={onBlur} />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		// value initialized to "same"; blur without changing
		fireEvent.blur(input);

		expect(setValueMock).not.toHaveBeenCalled();
		expect(onBlur).toHaveBeenCalledWith("same");
	});

	it("does nothing extra on blur without onBlur callback", () => {
		fieldValue = "same";
		renderWithTheme(<Input name="field1" testId="input1" />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		fireEvent.blur(input);

		expect(setValueMock).not.toHaveBeenCalled();
	});

	it("uses normalize function on blur", () => {
		fieldValue = "old";
		const normalize = vi.fn((v?: string) => v?.toUpperCase());
		renderWithTheme(
			<Input name="field1" testId="input1" normalize={normalize} />,
		);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "new" } });
		fireEvent.blur(input);

		expect(normalize).toHaveBeenCalledWith("new");
		expect(setValueMock).toHaveBeenCalledWith("NEW");
	});

	it("triggers blur logic and schedules blur() on Enter key", () => {
		vi.useFakeTimers();
		fieldValue = "old";
		const onBlur = vi.fn();
		renderWithTheme(<Input name="field1" testId="input1" onBlur={onBlur} />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "new" } });
		fireEvent.keyDown(input, { code: "Enter" });

		expect(onBlur).toHaveBeenCalledWith("new");

		vi.runAllTimers();
		vi.useRealTimers();
	});

	it("ignores non-Enter key presses", () => {
		fieldValue = "old";
		const onBlur = vi.fn();
		renderWithTheme(<Input name="field1" testId="input1" onBlur={onBlur} />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		fireEvent.keyDown(input, { code: "KeyA" });

		expect(onBlur).not.toHaveBeenCalled();
	});

	it("supports disabled prop", () => {
		renderWithTheme(<Input name="field1" testId="input1" disabled />);

		const input = screen.getByTestId("input1") as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});

	it("forwards ref to the underlying input", () => {
		const ref = React.createRef<HTMLInputElement>();
		renderWithTheme(<Input name="field1" testId="input1" ref={ref} />);

		expect(ref.current).not.toBeNull();
		expect(ref.current?.tagName).toBe("INPUT");
	});
});
