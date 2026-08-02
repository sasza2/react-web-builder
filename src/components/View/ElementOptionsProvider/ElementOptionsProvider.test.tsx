import { render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import {
	ElementOptionsProvider,
	useElementOptions,
} from "./ElementOptionsProvider";

describe("useElementOptions", () => {
	it("returns the default context value (true) outside a provider", () => {
		const { result } = renderHook(() => useElementOptions());

		expect(result.current.applyPaddingBottomToElements).toBe(true);
	});

	it("returns the value provided by ElementOptionsProvider", () => {
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<ElementOptionsProvider applyPaddingBottomToElements={false}>
				{children}
			</ElementOptionsProvider>
		);

		const { result } = renderHook(() => useElementOptions(), { wrapper });

		expect(result.current.applyPaddingBottomToElements).toBe(false);
	});
});

describe("ElementOptionsProvider", () => {
	it("renders its children", () => {
		render(
			<ElementOptionsProvider applyPaddingBottomToElements>
				<span data-testid="child">hello</span>
			</ElementOptionsProvider>,
		);

		expect(screen.getByTestId("child").textContent).toBe("hello");
	});

	it("updates consumers when applyPaddingBottomToElements changes", () => {
		function Consumer() {
			const { applyPaddingBottomToElements } = useElementOptions();
			return (
				<span data-testid="value">{String(applyPaddingBottomToElements)}</span>
			);
		}

		const { rerender } = render(
			<ElementOptionsProvider applyPaddingBottomToElements>
				<Consumer />
			</ElementOptionsProvider>,
		);

		expect(screen.getByTestId("value").textContent).toBe("true");

		rerender(
			<ElementOptionsProvider applyPaddingBottomToElements={false}>
				<Consumer />
			</ElementOptionsProvider>,
		);

		expect(screen.getByTestId("value").textContent).toBe("false");
	});
});
