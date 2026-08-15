import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

const mockUseBreakpoints = vi.fn();
const mockUseProperties = vi.fn();
const mockUseComponentsProperty = vi.fn();

vi.mock("../useBreakpoints", () => ({
	useBreakpoints: () => mockUseBreakpoints(),
}));
vi.mock("@/components/PropertiesProvider", () => ({
	useProperties: () => mockUseProperties(),
}));
vi.mock("@/components/ComponentsProvider", () => ({
	useComponentsProperty: () => mockUseComponentsProperty(),
}));

import { createStore } from "@/store/store";

import { useContainerElementPropertiesByValue } from "./useContainerElementPropertiesByValue";

const wrapperFor =
	(preloadedState: Parameters<typeof createStore>[0]) =>
	({ children }: React.PropsWithChildren) => {
		const store = createStore(preloadedState);
		return <Provider store={store}>{children}</Provider>;
	};

const setup = (preloadedState: Parameters<typeof createStore>[0]) => {
	const { result } = renderHook(() => useContainerElementPropertiesByValue(), {
		wrapper: wrapperFor(preloadedState),
	});
	return result;
};

describe("useContainerElementPropertiesByValue", () => {
	it("returns NO_PROPERTIES when container has no parentId", () => {
		mockUseBreakpoints.mockReturnValue([]);
		mockUseProperties.mockReturnValue({ transformElementProperty: vi.fn() });
		mockUseComponentsProperty.mockReturnValue([]);

		const result = setup({ elementsInBreakpoints: {} });

		expect(result.current({ id: "c1", parentId: null } as never)).toEqual({});
	});

	it("returns NO_PROPERTIES when parent breakpoint isn't found", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "other" }]);
		mockUseProperties.mockReturnValue({ transformElementProperty: vi.fn() });
		mockUseComponentsProperty.mockReturnValue([]);

		const result = setup({ elementsInBreakpoints: {} });

		expect(result.current({ id: "c1", parentId: "parent-1" } as never)).toEqual(
			{},
		);
	});

	it("returns NO_PROPERTIES when parent has no elements", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);
		mockUseProperties.mockReturnValue({ transformElementProperty: vi.fn() });
		mockUseComponentsProperty.mockReturnValue([]);

		const result = setup({ elementsInBreakpoints: {} });

		expect(result.current({ id: "c1", parentId: "parent-1" } as never)).toEqual(
			{},
		);
	});

	it("returns NO_PROPERTIES when no element references the container", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);
		mockUseProperties.mockReturnValue({ transformElementProperty: vi.fn() });
		mockUseComponentsProperty.mockReturnValue([]);

		const result = setup({
			elementsInBreakpoints: {
				"parent-1": [
					{ id: "e1", props: [{ propId: "containerId", value: "other" }] },
				],
			},
		});

		expect(result.current({ id: "c1", parentId: "parent-1" } as never)).toEqual(
			{},
		);
	});

	it("returns properties from getProperties when element and component are found", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);
		const transformElementProperty = vi.fn();
		mockUseProperties.mockReturnValue({ transformElementProperty });
		mockUseComponentsProperty.mockReturnValue([{ id: "Box", props: [] }]);

		const result = setup({
			elementsInBreakpoints: {
				"parent-1": [
					{
						id: "e1",
						componentName: "Box",
						props: [{ propId: "containerId", value: "c1" }],
					},
				],
			},
		});

		const properties = result.current({
			id: "c1",
			parentId: "parent-1",
		} as never);

		expect(properties).toMatchObject({ component: { id: "Box", props: [] } });
	});

	it("returns properties when element's component isn't found in components list", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);
		mockUseProperties.mockReturnValue({ transformElementProperty: vi.fn() });
		mockUseComponentsProperty.mockReturnValue([]);

		const result = setup({
			elementsInBreakpoints: {
				"parent-1": [
					{
						id: "e1",
						componentName: "Unknown",
						props: [{ propId: "containerId", value: "c1" }],
					},
				],
			},
		});

		const properties = result.current({
			id: "c1",
			parentId: "parent-1",
		} as never);

		expect(properties).toMatchObject({ component: undefined });
	});
});
