import { render as rtlRender, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const render = (ui: React.ReactElement) =>
	rtlRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockUseBreakpoint = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, unknown>) =>
			options ? `${key}:${JSON.stringify(options)}` : key,
	}),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/components/Trans", () => ({
	Trans: ({ components }: { components: Record<string, React.ReactNode> }) => (
		<div data-testid="trans">{components.readMore}</div>
	),
}));

vi.mock("../Input", () => ({
	Input: ({ label }: { label: string }) => (
		<div data-testid="input">{label}</div>
	),
}));

vi.mock("../Select", () => ({
	Select: ({
		label,
		description,
	}: {
		label: string;
		description?: React.ReactNode;
	}) => (
		<div data-testid="select">
			{label}
			{description}
		</div>
	),
}));

vi.mock("../Toggle", () => ({
	Toggle: ({ label }: { label: string }) => (
		<div data-testid="toggle">{label}</div>
	),
}));

vi.mock("@/components/FormProvider", () => ({
	useField: (name: string) => ({
		name,
		value: (globalThis as unknown as { __fieldValue: unknown }).__fieldValue,
		setValue: vi.fn(),
	}),
}));

import { BreakpointHeight } from "./BreakpointHeight";

const setFieldValue = (value: unknown) => {
	(globalThis as unknown as { __fieldValue: unknown }).__fieldValue = value;
};

describe("BreakpointHeight", () => {
	it("renders minimal content when disabled and no scroll overflow", () => {
		mockUseBreakpoint.mockReturnValue({ from: 100 });
		setFieldValue(undefined);

		render(<BreakpointHeight name="height" />);

		expect(screen.queryByTestId("input")).toBeNull();
		expect(screen.queryByTestId("select")).toBeNull();
		// only the enabled toggle
		expect(screen.getAllByTestId("toggle")).toHaveLength(1);
	});

	it("renders extra fields when enabled", () => {
		mockUseBreakpoint.mockReturnValue({ from: 320 });
		setFieldValue({ enabled: true, overflow: "visible" });

		render(<BreakpointHeight name="height" testId="bh" />);

		expect(screen.getByTestId("input")).not.toBeNull();
		expect(screen.getByTestId("select")).not.toBeNull();
		expect(screen.getByTestId("trans")).not.toBeNull();
		expect(
			screen.getByText("breakpoint.heightProp.overflow.readMore"),
		).not.toBeNull();
		expect(screen.getAllByTestId("toggle")).toHaveLength(2);
	});

	it("renders scrollbar toggle when overflow is scroll", () => {
		mockUseBreakpoint.mockReturnValue({ from: 320 });
		setFieldValue({ enabled: true, overflow: "scroll" });

		render(<BreakpointHeight name="height" />);

		expect(screen.getAllByTestId("toggle")).toHaveLength(3);
	});

	it("renders scrollbar toggle when overflow is scroll even if disabled", () => {
		mockUseBreakpoint.mockReturnValue({ from: 320 });
		setFieldValue({ enabled: false, overflow: "scroll" });

		render(<BreakpointHeight name="height" />);

		expect(screen.getAllByTestId("toggle")).toHaveLength(2);
	});
});
