import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import type { WebBuilderComponent } from "types";

import { ComponentsProvider } from "@/components/ComponentsProvider";
import { createStore } from "@/store/store";
import { buildBreakpoint, buildElement } from "@/testing/fixtures";

import { useSidebarContainerEditGoBack } from "./useSidebarContainerEditGoBack";

const containerBreakpoint = buildBreakpoint({
	id: "container-bp",
	parentId: "parent-bp",
});
const parentBreakpoint = buildBreakpoint({ id: "parent-bp" });

const components: WebBuilderComponent[] = [
	{ id: "Container", isContainer: true, props: [], component: () => null },
	{ id: "Text", isContainer: false, props: [], component: () => null },
];

const wrapperFor =
	(store: ReturnType<typeof createStore>) =>
	({ children }: PropsWithChildren) => (
		<Provider store={store}>
			<ComponentsProvider
				components={components}
				elementAnchor={() => null}
				elementContainer={null}
			>
				{children}
			</ComponentsProvider>
		</Provider>
	);

it("returns undefined for a top-level (non-container) breakpoint", () => {
	const store = createStore({
		breakpoints: [parentBreakpoint],
		selectedBreakpoint: "parent-bp",
		elementsInBreakpoints: {},
	});

	const { result } = renderHook(() => useSidebarContainerEditGoBack(), {
		wrapper: wrapperFor(store),
	});

	expect(result.current).toBeUndefined();
});

it("returns a goBack function for a container breakpoint and dispatches when a parent container element is found", () => {
	const containerElement = buildElement({
		id: "el-1",
		componentName: "Container",
		props: [{ propId: "containerId", value: "container-bp" }],
	});

	const store = createStore({
		breakpoints: [parentBreakpoint, containerBreakpoint],
		selectedBreakpoint: "container-bp",
		elementsInBreakpoints: { "parent-bp": [containerElement] },
	});

	const { result } = renderHook(() => useSidebarContainerEditGoBack(), {
		wrapper: wrapperFor(store),
	});

	expect(typeof result.current).toBe("function");

	result.current?.();

	expect(store.getState().selectedElement).toBe("el-1");
});

it("does nothing when no matching parent container element is found", () => {
	const store = createStore({
		breakpoints: [parentBreakpoint, containerBreakpoint],
		selectedBreakpoint: "container-bp",
		elementsInBreakpoints: { "parent-bp": [] },
	});

	const { result } = renderHook(() => useSidebarContainerEditGoBack(), {
		wrapper: wrapperFor(store),
	});

	expect(() => result.current?.()).not.toThrow();
	expect(store.getState().selectedElement).toBeNull();
});

it("skips non-container elements and elements without a matching containerId", () => {
	const nonContainerElement = buildElement({
		id: "el-2",
		componentName: "Text",
		props: [],
	});
	const wrongContainerElement = buildElement({
		id: "el-3",
		componentName: "Container",
		props: [{ propId: "containerId", value: "other-bp" }],
	});

	const store = createStore({
		breakpoints: [parentBreakpoint, containerBreakpoint],
		selectedBreakpoint: "container-bp",
		elementsInBreakpoints: {
			"parent-bp": [nonContainerElement, wrongContainerElement],
		},
	});

	const { result } = renderHook(() => useSidebarContainerEditGoBack(), {
		wrapper: wrapperFor(store),
	});

	expect(() => result.current?.()).not.toThrow();
	expect(store.getState().selectedElement).toBeNull();
});
