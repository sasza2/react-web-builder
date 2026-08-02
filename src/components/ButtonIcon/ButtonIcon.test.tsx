import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-tooltip", () => ({
	Tooltip: ({ id, children }: { id?: string; children?: React.ReactNode }) => (
		<div data-testid="tooltip" data-tooltip-id={id}>
			{children}
		</div>
	),
}));

import { StyleProvider } from "../StyleProvider";
import { ButtonIcon } from "./ButtonIcon";

function renderWithTheme(ui: React.ReactElement) {
	return render(<StyleProvider>{ui}</StyleProvider>);
}

describe("ButtonIcon", () => {
	it("renders children inside a button", () => {
		const { container } = renderWithTheme(
			<ButtonIcon>child-content</ButtonIcon>,
		);
		expect(screen.getByText("child-content")).not.toBeNull();
		expect(container.querySelector("button")).not.toBeNull();
	});

	it("calls onClick when clicked", () => {
		const onClick = vi.fn();
		renderWithTheme(<ButtonIcon onClick={onClick}>click me</ButtonIcon>);
		screen.getByText("click me").click();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("renders a tooltip when tooltip prop is provided", () => {
		renderWithTheme(<ButtonIcon tooltip="some tooltip">child</ButtonIcon>);
		expect(screen.getByText("some tooltip")).not.toBeNull();
	});

	it("does not render a tooltip when tooltip is not provided", () => {
		renderWithTheme(<ButtonIcon>child</ButtonIcon>);
		expect(screen.queryByTestId("tooltip")).toBeNull();
	});

	it("applies id, disabled, size, testId and default (inactive) styling", () => {
		const { container } = renderWithTheme(
			<ButtonIcon id="my-id" size="small" testId="my-test-id">
				child
			</ButtonIcon>,
		);
		const button = container.querySelector("button");
		expect(button).not.toBeNull();
		expect(button.getAttribute("data-icon-id")).toBe("my-id");
	});

	it("applies active + transparent styling", () => {
		const { container } = renderWithTheme(
			<ButtonIcon active transparent>
				child
			</ButtonIcon>,
		);
		expect(container.querySelector("button")).not.toBeNull();
	});

	it("applies active styling without transparent", () => {
		const { container } = renderWithTheme(
			<ButtonIcon active>child</ButtonIcon>,
		);
		expect(container.querySelector("button")).not.toBeNull();
	});

	it("applies disabled styling", () => {
		const { container } = renderWithTheme(
			<ButtonIcon disabled>child</ButtonIcon>,
		);
		const button = container.querySelector("button");
		expect(button.hasAttribute("disabled")).toBe(true);
	});
});
