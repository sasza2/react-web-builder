import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { StyleProvider } from "@/components/StyleProvider";

import { FieldPopup } from "./FieldPopup";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("FieldPopup", () => {
	it("renders nothing when there is no position", () => {
		const popupRef = { current: null };
		const { container } = renderWithTheme(
			<FieldPopup closing={false} position={null} popupRef={popupRef}>
				<div>content</div>
			</FieldPopup>,
		);
		expect(container.innerHTML).toBe("");
	});

	it("portals its content into document.body when a position is set", () => {
		const popupRef = { current: null };
		renderWithTheme(
			<FieldPopup
				closing={false}
				position={{ top: 10, left: 20 }}
				popupRef={popupRef}
			>
				<div>portal-content</div>
			</FieldPopup>,
		);

		expect(screen.getByText("portal-content")).not.toBeNull();
	});
});
