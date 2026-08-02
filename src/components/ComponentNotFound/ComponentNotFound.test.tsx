import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { ComponentNotFound } from "./ComponentNotFound";

describe("ComponentNotFound", () => {
	it("renders the not-found label", () => {
		render(<ComponentNotFound />);
		expect(screen.getByText("element.notFound")).not.toBeNull();
	});
});
