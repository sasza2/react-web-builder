import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { ComponentIsLoading } from "./ComponentIsLoading";

describe("ComponentIsLoading", () => {
	it("renders the loading label and spinner", () => {
		const { container } = render(<ComponentIsLoading />);
		expect(screen.getByText("element.loading")).not.toBeNull();
		expect(container.querySelector("svg")).not.toBeNull();
	});
});
