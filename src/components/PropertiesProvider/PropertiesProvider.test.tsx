import { render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import {
	PropertiesProvider,
	useProperties,
	useViewProperties,
	useWebBuilderProperties,
} from "./PropertiesProvider";

describe("PropertiesProvider", () => {
	it("renders children", () => {
		render(
			<PropertiesProvider>
				<div>child</div>
			</PropertiesProvider>,
		);

		expect(screen.getByText("child")).not.toBeNull();
	});

	it("provides props via useProperties", () => {
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<PropertiesProvider foo="bar">{children}</PropertiesProvider>
		);

		const { result } = renderHook(() => useProperties(), { wrapper });

		expect((result.current as unknown as { foo: string }).foo).toBe("bar");
	});

	it("provides props via useViewProperties", () => {
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<PropertiesProvider page="my-page">{children}</PropertiesProvider>
		);

		const { result } = renderHook(() => useViewProperties(), { wrapper });

		expect(result.current.page).toBe("my-page");
	});

	it("provides props via useWebBuilderProperties", () => {
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<PropertiesProvider page="my-page">{children}</PropertiesProvider>
		);

		const { result } = renderHook(() => useWebBuilderProperties(), {
			wrapper,
		});

		expect(result.current.page).toBe("my-page");
	});

	it("useProperties outside provider returns empty object", () => {
		const { result } = renderHook(() => useProperties());
		expect(result.current).toEqual({});
	});
});
