import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

import {
	ConfirmButton,
	LinkButton,
	LinkGhostButton,
	RemoveButton,
	RemoveGhostButton,
} from "./Button";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Button", () => {
	it("renders all button variants with children", () => {
		renderWithTheme(
			<>
				<ConfirmButton>Confirm</ConfirmButton>
				<RemoveButton>Remove</RemoveButton>
				<RemoveGhostButton>RemoveGhost</RemoveGhostButton>
				<LinkButton>Link</LinkButton>
				<LinkGhostButton>LinkGhost</LinkGhostButton>
			</>,
		);

		expect(screen.getByText("Confirm")).not.toBeNull();
		expect(screen.getByText("Remove")).not.toBeNull();
		expect(screen.getByText("RemoveGhost")).not.toBeNull();
		expect(screen.getByText("Link")).not.toBeNull();
		expect(screen.getByText("LinkGhost")).not.toBeNull();
	});

	it("calls onClick when not disabled", () => {
		const onClick = vi.fn();
		renderWithTheme(<ConfirmButton onClick={onClick}>Click me</ConfirmButton>);

		fireEvent.click(screen.getByText("Click me"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick when disabled", () => {
		const onClick = vi.fn();
		renderWithTheme(
			<ConfirmButton disabled onClick={onClick}>
				Click me
			</ConfirmButton>,
		);

		fireEvent.click(screen.getByText("Click me"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("uses provided id instead of generated one", () => {
		renderWithTheme(<ConfirmButton id="my-id">Btn</ConfirmButton>);

		const button = screen.getByText("Btn");
		expect(button.getAttribute("data-button-id")).toBe("my-id");
		expect(button.getAttribute("data-tooltip-id")).toBe("button-my-id");
	});

	it("generates an id when none provided", () => {
		renderWithTheme(<ConfirmButton>Btn</ConfirmButton>);

		const button = screen.getByText("Btn");
		expect(button.getAttribute("data-button-id")).not.toBeNull();
	});

	it("applies testId", () => {
		renderWithTheme(<ConfirmButton testId="confirm-btn">Btn</ConfirmButton>);

		expect(screen.getByTestId("confirm-btn")).not.toBeNull();
	});

	it("renders without throwing when a tooltip is provided", () => {
		// react-tooltip only renders its content on hover/open state, which is
		// not reproducible under jsdom without additional mocking; this test
		// just exercises the `tooltip && <Tooltip>` branch for coverage.
		renderWithTheme(
			<ConfirmButton id="tid" tooltip="Helpful tooltip">
				Btn
			</ConfirmButton>,
		);

		expect(screen.getByText("Btn")).not.toBeNull();
	});

	it("does not render tooltip when not provided", () => {
		renderWithTheme(<ConfirmButton id="tid2">Btn</ConfirmButton>);

		expect(screen.queryByText("Helpful tooltip")).toBeNull();
	});

	it("forwards buttonRef to the underlying button element", () => {
		const ref = React.createRef<HTMLButtonElement>();
		renderWithTheme(<ConfirmButton ref={ref}>Btn</ConfirmButton>);

		expect(ref.current).not.toBeNull();
		expect(ref.current?.tagName).toBe("BUTTON");
	});
});
