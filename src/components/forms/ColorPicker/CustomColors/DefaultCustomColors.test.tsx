import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUsePageSettings = vi.fn();
vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));

const mockDispatch = vi.fn();
vi.mock("@/store/useAppDispatch", () => ({
	useAppDispatch: () => mockDispatch,
}));

vi.mock("@/store/pageSettingsSlice", () => ({
	updatePageSettings: (payload: unknown) => ({
		type: "updatePageSettings",
		payload,
	}),
}));

vi.mock("./CustomColors", () => ({
	CustomColors: ({
		allowGradient,
		colors,
		onChange,
		value,
	}: {
		allowGradient?: boolean;
		colors: string[];
		onChange: (payload: { color?: string; customColors?: string[] }) => void;
		value: string;
	}) => (
		<div>
			<div data-testid="colors">{colors.join(",")}</div>
			<div data-testid="value">{value}</div>
			<div data-testid="allow-gradient">{String(!!allowGradient)}</div>
			<button
				type="button"
				data-testid="set-color"
				onClick={() => onChange({ color: "#123456" })}
			>
				set color
			</button>
			<button
				type="button"
				data-testid="set-colors"
				onClick={() => onChange({ customColors: ["#111", "#222"] })}
			>
				set colors
			</button>
		</div>
	),
}));

import { DefaultCustomColors } from "./DefaultCustomColors";

describe("DefaultCustomColors", () => {
	it("defaults to an empty array when there are no page setting colors", () => {
		mockUsePageSettings.mockReturnValue({});
		render(<DefaultCustomColors setValue={vi.fn()} value="#fff" />);

		expect(screen.getByTestId("colors").textContent).toBe("");
	});

	it("filters out invalid colors when gradients are not allowed", () => {
		mockUsePageSettings.mockReturnValue({
			colors: ["#ffffff", "linear-gradient(90deg, #fff, #000)"],
		});
		render(<DefaultCustomColors setValue={vi.fn()} value="#fff" />);

		expect(screen.getByTestId("colors").textContent).toBe("#ffffff");
	});

	it("keeps gradient colors when allowGradient is true", () => {
		mockUsePageSettings.mockReturnValue({
			colors: ["#ffffff", "linear-gradient(90deg, #fff, #000)"],
		});
		render(
			<DefaultCustomColors allowGradient setValue={vi.fn()} value="#fff" />,
		);

		expect(screen.getByTestId("colors").textContent).toBe(
			"#ffffff,linear-gradient(90deg, #fff, #000)",
		);
	});

	it("calls setValue when a color is selected", () => {
		mockUsePageSettings.mockReturnValue({ colors: ["#fff"] });
		const setValue = vi.fn();
		render(<DefaultCustomColors setValue={setValue} value="#fff" />);

		fireEvent.click(screen.getByTestId("set-color"));

		expect(setValue).toHaveBeenCalledWith("#123456");
	});

	it("dispatches updatePageSettings when custom colors change", () => {
		mockUsePageSettings.mockReturnValue({ colors: ["#fff"] });
		render(<DefaultCustomColors setValue={vi.fn()} value="#fff" />);

		fireEvent.click(screen.getByTestId("set-colors"));

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updatePageSettings",
			payload: { pageSettings: { colors: ["#111", "#222"] } },
		});
	});
});
