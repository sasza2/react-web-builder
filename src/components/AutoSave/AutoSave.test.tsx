import { render } from "@testing-library/react";
import React from "react";

import type { RootState } from "@/store/store";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseBuildPage = vi.fn();
const mockUseAppSelector = vi.fn();
const mockUsePageOnChange = vi.fn();
const mockUseWebBuilderProperties = vi.fn();
const mockUseChangesSetIsSaved = vi.fn();
const mockUseConfiguration = vi.fn();

vi.mock("@/hooks/page/useBuildPage", () => ({
	useBuildPage: () => mockUseBuildPage(),
}));
vi.mock("@/hooks/useChangesSetIsSaved", () => ({
	useChangesSetIsSaved: () => mockUseChangesSetIsSaved(),
}));
vi.mock("@/hooks/usePageOnChange", () => ({
	usePageOnChange: () => mockUsePageOnChange(),
}));
vi.mock("@/store/useAppSelector", () => ({
	useAppSelector: (selector: (state: RootState) => unknown) =>
		mockUseAppSelector(selector),
}));
vi.mock("../ConfigurationProvider", () => ({
	useConfiguration: () => mockUseConfiguration(),
}));
vi.mock("../PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

import { AutoSave } from "./AutoSave";

describe("AutoSave", () => {
	const onAutoSave = vi.fn();
	const build = vi.fn(() => ({ page: "built" }));
	const setIsSaved = vi.fn();
	const onChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseBuildPage.mockReturnValue(build);
		mockUsePageOnChange.mockReturnValue(onChange);
		mockUseChangesSetIsSaved.mockReturnValue(setIsSaved);
		mockUseWebBuilderProperties.mockReturnValue({ onAutoSave });
	});

	it("renders children", () => {
		mockUseAppSelector.mockReturnValue({ pushKey: null });
		mockUseConfiguration.mockReturnValue({ autoSave: false });

		const { getByText } = render(
			<AutoSave>
				<div>child</div>
			</AutoSave>,
		);

		expect(getByText("child")).not.toBeNull();
	});

	it("calls onChange when pushKey present", () => {
		mockUseAppSelector.mockReturnValue({ pushKey: "abc" });
		mockUseConfiguration.mockReturnValue({ autoSave: false });

		render(<AutoSave>{<div>child</div>}</AutoSave>);

		expect(onChange).toHaveBeenCalled();
	});

	it("does not call onChange when pushKey absent", () => {
		mockUseAppSelector.mockReturnValue({ pushKey: "" });
		mockUseConfiguration.mockReturnValue({ autoSave: false });

		render(<AutoSave>{<div>child</div>}</AutoSave>);

		expect(onChange).not.toHaveBeenCalled();
	});

	it("does not call onAutoSave when autoSave configuration disabled", () => {
		mockUseAppSelector.mockReturnValue({ pushKey: "abc" });
		mockUseConfiguration.mockReturnValue({ autoSave: false });

		render(<AutoSave>{<div>child</div>}</AutoSave>);

		expect(onAutoSave).not.toHaveBeenCalled();
		expect(setIsSaved).not.toHaveBeenCalled();
	});

	it("calls onAutoSave and setIsSaved when autoSave enabled and pushKey present", () => {
		mockUseAppSelector.mockReturnValue({ pushKey: "abc" });
		mockUseConfiguration.mockReturnValue({ autoSave: true });

		render(<AutoSave>{<div>child</div>}</AutoSave>);

		expect(build).toHaveBeenCalled();
		expect(onAutoSave).toHaveBeenCalledWith({ page: "built" });
		expect(setIsSaved).toHaveBeenCalled();
	});

	it("does not call onAutoSave when autoSave enabled but no pushKey", () => {
		mockUseAppSelector.mockReturnValue({ pushKey: "" });
		mockUseConfiguration.mockReturnValue({ autoSave: true });

		render(<AutoSave>{<div>child</div>}</AutoSave>);

		expect(onAutoSave).not.toHaveBeenCalled();
	});

	it("does not call onAutoSave when autoSave enabled, pushKey present, but no onAutoSave handler", () => {
		mockUseWebBuilderProperties.mockReturnValue({ onAutoSave: undefined });
		mockUseAppSelector.mockReturnValue({ pushKey: "abc" });
		mockUseConfiguration.mockReturnValue({ autoSave: true });

		render(<AutoSave>{<div>child</div>}</AutoSave>);

		expect(setIsSaved).not.toHaveBeenCalled();
	});
});
