import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { NavbarProvider, useNavbarWheelMode } from "./NavbarProvider";

function Consumer() {
	const [wheelMode, setWheelMode] = useNavbarWheelMode();
	return (
		<div>
			<span data-testid="mode">{wheelMode}</span>
			<button type="button" onClick={() => setWheelMode(1)}>
				zoom
			</button>
			<button type="button" onClick={() => setWheelMode(0)}>
				scroll
			</button>
		</div>
	);
}

describe("NavbarProvider", () => {
	it("provides default wheelMode (Scroll = 0) and allows switching to Zoom and back", () => {
		render(
			<NavbarProvider>
				<Consumer />
			</NavbarProvider>,
		);

		expect(screen.getByTestId("mode").textContent).toBe("0");

		fireEvent.click(screen.getByText("zoom"));
		expect(screen.getByTestId("mode").textContent).toBe("1");

		fireEvent.click(screen.getByText("scroll"));
		expect(screen.getByTestId("mode").textContent).toBe("0");
	});

	it("renders children", () => {
		render(
			<NavbarProvider>
				<div data-testid="child">hello</div>
			</NavbarProvider>,
		);
		expect(screen.getByTestId("child")).not.toBeNull();
	});
});
