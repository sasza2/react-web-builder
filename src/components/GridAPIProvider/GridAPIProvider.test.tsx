import { render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { GridAPIProvider, useGridAPI } from "./GridAPIProvider";

describe("GridAPIProvider", () => {
	it("renders children", () => {
		render(
			<GridAPIProvider>
				<div>child</div>
			</GridAPIProvider>,
		);

		expect(screen.getByText("child")).not.toBeNull();
	});

	it("provides a mutable ref via useGridAPI", () => {
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<GridAPIProvider>{children}</GridAPIProvider>
		);

		const { result } = renderHook(() => useGridAPI(), { wrapper });

		expect(result.current).toHaveProperty("current");
		expect(result.current.current).toBeUndefined();
	});

	it("useGridAPI outside provider returns null", () => {
		const { result } = renderHook(() => useGridAPI());
		expect(result.current).toBeNull();
	});
});
