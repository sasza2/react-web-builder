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
		colors,
		onChange,
		value,
	}: {
		colors: string[];
		onChange: (payload: { color?: string; customColors?: string[] }) => void;
		value: string;
	}) => (
		<div>
			<div data-testid="colors">{colors.join(",")}</div>
			<div data-testid="value">{value}</div>
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
			<button
				type="button"
				data-testid="set-both"
				onClick={() => onChange({ color: "#654321", customColors: ["#333"] })}
			>
				set both
			</button>
		</div>
	),
}));

import { PageSettingsCustomColors } from "./PageSettingsCustomColors";

describe("PageSettingsCustomColors", () => {
	it("defaults colors to an empty array and uses backgroundColor as value", () => {
		mockUsePageSettings.mockReturnValue({ backgroundColor: "#abc" });
		render(<PageSettingsCustomColors />);

		expect(screen.getByTestId("colors").textContent).toBe("");
		expect(screen.getByTestId("value").textContent).toBe("#abc");
	});

	it("dispatches backgroundColor update when a color is selected", () => {
		mockUsePageSettings.mockReturnValue({ colors: ["#fff"] });
		render(<PageSettingsCustomColors />);

		fireEvent.click(screen.getByTestId("set-color"));

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updatePageSettings",
			payload: { pageSettings: { backgroundColor: "#123456" } },
		});
	});

	it("dispatches colors update when custom colors change", () => {
		mockUsePageSettings.mockReturnValue({ colors: ["#fff"] });
		render(<PageSettingsCustomColors />);

		fireEvent.click(screen.getByTestId("set-colors"));

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updatePageSettings",
			payload: { pageSettings: { colors: ["#111", "#222"] } },
		});
	});

	it("dispatches both when color and customColors change together", () => {
		mockUsePageSettings.mockReturnValue({ colors: ["#fff"] });
		render(<PageSettingsCustomColors allowGradient />);

		fireEvent.click(screen.getByTestId("set-both"));

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updatePageSettings",
			payload: {
				pageSettings: { backgroundColor: "#654321", colors: ["#333"] },
			},
		});
	});
});
