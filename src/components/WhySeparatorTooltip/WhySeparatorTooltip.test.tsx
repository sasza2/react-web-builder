import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-tooltip", () => ({
	Tooltip: ({ children }: React.PropsWithChildren) => (
		<div data-testid="tooltip">{children}</div>
	),
}));

vi.mock("@/components/icons/Icon", () => ({
	Icon: Object.assign(
		({ onClick }: { onClick: React.MouseEventHandler }) => (
			<button type="button" data-testid="question-icon" onClick={onClick} />
		),
		{ QuestionMark: "QuestionMark" },
	),
}));

vi.mock("../WhySeparator", () => ({
	WhySeparator: ({ onClose }: { onClose: () => void }) => (
		<div data-testid="why-separator">
			<button type="button" data-testid="close-btn" onClick={onClose} />
		</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { WhySeparatorTooltip } from "./WhySeparatorTooltip";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("WhySeparatorTooltip", () => {
	it("renders the tooltip icon and popup text", () => {
		renderWithTheme(<WhySeparatorTooltip />);

		expect(screen.getByTestId("question-icon")).not.toBeNull();
		expect(screen.getByText("whySeparator.tooltip")).not.toBeNull();
	});

	it("does not render WhySeparator initially", () => {
		renderWithTheme(<WhySeparatorTooltip />);
		expect(screen.queryByTestId("why-separator")).toBeNull();
	});

	it("shows WhySeparator when icon is clicked, and hides it on close", () => {
		renderWithTheme(<WhySeparatorTooltip />);

		fireEvent.click(screen.getByTestId("question-icon"));
		expect(screen.getByTestId("why-separator")).not.toBeNull();

		fireEvent.click(screen.getByTestId("close-btn"));
		expect(screen.queryByTestId("why-separator")).toBeNull();
	});

	it("applies className to the tooltip inline wrapper", () => {
		renderWithTheme(<WhySeparatorTooltip className="my-class" />);
		expect(document.querySelector(".my-class")).not.toBeNull();
	});
});
