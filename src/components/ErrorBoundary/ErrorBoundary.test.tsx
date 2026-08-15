import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	withTranslation:
		() =>
		<Props extends object>(Component: React.ComponentType<Props>) =>
		(props: Props) => <Component {...props} t={(key: string) => key} />,
}));

import { ErrorBoundary } from "./ErrorBoundary";

function Bomb(): React.ReactElement {
	throw new Error("boom");
}

describe("ErrorBoundary", () => {
	it("renders children when there is no error", () => {
		render(
			<ErrorBoundary>
				<div>child-content</div>
			</ErrorBoundary>,
		);

		expect(screen.getByText("child-content")).not.toBeNull();
	});

	it("renders fallback message when a child throws", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		render(
			<ErrorBoundary>
				<Bomb />
			</ErrorBoundary>,
		);

		expect(screen.getByText("errors.somethingWentWrong")).not.toBeNull();

		spy.mockRestore();
	});
});
