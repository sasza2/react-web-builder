import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const render = (ui: React.ReactElement) =>
	rtlRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockUseSelectedContainer = vi.fn();
const mockUpdateBreakpoint = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/container/useSelectedContainer", () => ({
	useSelectedContainer: () => mockUseSelectedContainer(),
}));

vi.mock("@/hooks/useUpdateBreakpoint", () => ({
	useUpdateBreakpoint: () => mockUpdateBreakpoint,
}));

vi.mock("../ColorPicker", async () => {
	const { useField } = await import("@/components/FormProvider");
	return {
		ColorPicker: ({ name }: { name: string }) => {
			const { setValue } = useField(name);
			return (
				<button
					type="button"
					data-testid="color-picker"
					onClick={() => setValue("#000")}
				/>
			);
		},
	};
});

vi.mock("../Padding", async () => {
	const { useField } = await import("@/components/FormProvider");
	return {
		Padding: ({ name }: { name: string }) => {
			const { setValue } = useField(name);
			return (
				<button
					type="button"
					data-testid="padding"
					onClick={() => setValue({ top: 1, right: 1, bottom: 1, left: 1 })}
				/>
			);
		},
	};
});

vi.mock("../Input", async () => {
	const { useField } = await import("@/components/FormProvider");
	return {
		Input: ({ name }: { name: string }) => {
			const { setValue } = useField(name);
			return (
				<button
					type="button"
					data-testid="input"
					onClick={() => setValue("5")}
				/>
			);
		},
	};
});

import { EditBreakpointField } from "./EditBreakpointField";

describe("EditBreakpointField", () => {
	it("throws when container is missing (source bug: `container[field]` is read before the `!container` guard)", () => {
		mockUseSelectedContainer.mockReturnValue([null, null]);

		expect(() =>
			render(<EditBreakpointField field="backgroundColor" />),
		).toThrow();
	});

	it("renders backgroundColor field", () => {
		mockUseSelectedContainer.mockReturnValue([
			null,
			{ id: "c1", backgroundColor: "#fff" },
		]);

		render(<EditBreakpointField field="backgroundColor" testId="bg" />);

		expect(screen.getByTestId("color-picker")).not.toBeNull();
		fireEvent.click(screen.getByTestId("color-picker"));
		expect(mockUpdateBreakpoint).toHaveBeenCalledWith("c1", {
			backgroundColor: "#000",
		});
	});

	it("renders padding field", () => {
		mockUseSelectedContainer.mockReturnValue([
			null,
			{ id: "c1", padding: { top: 0, right: 0, bottom: 0, left: 0 } },
		]);

		render(<EditBreakpointField field="padding" />);

		expect(screen.getByTestId("padding")).not.toBeNull();
		fireEvent.click(screen.getByTestId("padding"));
		expect(mockUpdateBreakpoint).toHaveBeenCalledWith("c1", {
			padding: { top: 1, right: 1, bottom: 1, left: 1 },
		});
	});

	it("renders cols field", () => {
		mockUseSelectedContainer.mockReturnValue([null, { id: "c1", cols: 3 }]);

		render(<EditBreakpointField field="cols" />);

		expect(screen.getByTestId("input")).not.toBeNull();
		fireEvent.click(screen.getByTestId("input"));
		expect(mockUpdateBreakpoint).toHaveBeenCalledWith("c1", { cols: 5 });
	});

	it("renders nothing (default branch) for unknown field", () => {
		mockUseSelectedContainer.mockReturnValue([
			null,
			{ id: "c1", unknownField: 1 },
		]);

		const { container } = render(
			// @ts-expect-error testing default branch
			<EditBreakpointField field="unknownField" />,
		);

		expect(container.innerHTML).toBe("");
	});
});
