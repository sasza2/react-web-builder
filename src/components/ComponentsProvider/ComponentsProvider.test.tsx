import { render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseInternalComponents = vi.fn();
vi.mock("@/components", () => ({
	useInternalComponents: (...args: unknown[]) =>
		mockUseInternalComponents(...args),
}));

import {
	ComponentsProvider,
	useComponentsProperty,
	useElementContainer,
} from "./ComponentsProvider";

describe("ComponentsProvider", () => {
	it("renders children", () => {
		mockUseInternalComponents.mockReturnValue([]);

		render(
			<ComponentsProvider
				components={[]}
				elementAnchor={null}
				elementContainer={null}
			>
				<div>child</div>
			</ComponentsProvider>,
		);

		expect(screen.getByText("child")).not.toBeNull();
	});

	it("merges internal components with extra components, preparing props defaults", () => {
		mockUseInternalComponents.mockReturnValue([
			{ id: "Container", label: "internal", props: [{ id: "a" }] },
			{ id: "Text", label: "internal-text" },
		]);

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<ComponentsProvider
				components={[
					{ id: "Container", label: "extra", props: [{ id: "b" }] },
					{ id: "Custom", label: "custom-only" },
				]}
				elementAnchor={null}
				elementContainer={null}
			>
				{children}
			</ComponentsProvider>
		);

		const { result } = renderHook(() => useComponentsProperty(), { wrapper });

		const container = result.current.find((c) => c.id === "Container");
		expect(container.label).toBe("extra");
		expect(container.props).toEqual([{ id: "a" }, { id: "b" }]);

		const text = result.current.find((c) => c.id === "Text");
		expect(text.props).toEqual([]);

		const custom = result.current.find((c) => c.id === "Custom");
		expect(custom.label).toBe("custom-only");
	});

	it("provides elementContainer via useElementContainer", () => {
		mockUseInternalComponents.mockReturnValue([]);
		const container = { id: "el-container" };

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<ComponentsProvider
				components={[]}
				elementAnchor={null}
				elementContainer={container as never}
			>
				{children}
			</ComponentsProvider>
		);

		const { result } = renderHook(() => useElementContainer(), { wrapper });

		expect(result.current).toBe(container);
	});

	it("useComponentsProperty outside provider returns empty array", () => {
		const { result } = renderHook(() => useComponentsProperty());
		expect(result.current).toEqual([]);
	});

	it("useElementContainer outside provider returns null", () => {
		const { result } = renderHook(() => useElementContainer());
		expect(result.current).toBeNull();
	});
});
