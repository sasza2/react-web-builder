import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockT = vi.fn((key: string) => `translated:${key}`);

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: mockT }),
}));

import { Trans } from "./Trans";

describe("Trans", () => {
	it("calls t with the given i18nKey and components and renders the result", () => {
		const components = { bold: <b /> };
		render(<Trans i18nKey="some.key" components={components} />);
		expect(mockT).toHaveBeenCalledWith("some.key", { components });
		expect(screen.getByText("translated:some.key")).not.toBeNull();
	});

	it("works without components", () => {
		render(<Trans i18nKey="another.key" />);
		expect(mockT).toHaveBeenCalledWith("another.key", {
			components: undefined,
		});
		expect(screen.getByText("translated:another.key")).not.toBeNull();
	});
});
