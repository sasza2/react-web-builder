import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { ConfigurationProvider } from "@/components/ConfigurationProvider";
import { GridAPIProvider, useGridAPI } from "@/components/GridAPIProvider";
import { replaceSelectedElement } from "@/store/selectedElementSlice";
import { createStore } from "@/store/store";
import { buildGridAPI, buildPanZoomAPI } from "@/testing/fixtures";

import { useBlurSelectedElement } from "./useBlurSelectedElement";

let panZoomContainer: HTMLDivElement;
let panZoomChildNode: HTMLDivElement;
let elementWrapper: HTMLDivElement;
let outsideEl: HTMLDivElement;

function GridAPISetter({ children }: PropsWithChildren) {
	const gridAPI = useGridAPI();
	const panZoom = buildPanZoomAPI({ childNode: panZoomChildNode });
	gridAPI.current = buildGridAPI({ getPanZoom: () => panZoom });
	return <>{children}</>;
}

const makeWrapper =
	(store: ReturnType<typeof createStore>) =>
	({ children }: PropsWithChildren) => (
		<Provider store={store}>
			<ConfigurationProvider>
				<GridAPIProvider>
					<GridAPISetter>{children}</GridAPISetter>
				</GridAPIProvider>
			</ConfigurationProvider>
		</Provider>
	);

beforeEach(() => {
	localStorage.clear();
	panZoomContainer = document.createElement("div");
	panZoomChildNode = document.createElement("div");
	panZoomContainer.appendChild(panZoomChildNode);
	elementWrapper = document.createElement("div");
	elementWrapper.className = "react-panzoom-element--id-el-1";
	panZoomContainer.appendChild(elementWrapper);
	outsideEl = document.createElement("div");
	document.body.appendChild(panZoomContainer);
	document.body.appendChild(outsideEl);
});

afterEach(() => {
	panZoomContainer.remove();
	outsideEl.remove();
});

it("does nothing when preventCloseEditOnClick is enabled", () => {
	localStorage.setItem(
		"configuration",
		JSON.stringify({ preventCloseEditOnClick: true }),
	);
	const store = createStore({ selectedElement: "el-1" });

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	act(() => {
		outsideEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBe("el-1");
});

it("does nothing when there is no selected element", () => {
	const store = createStore({ selectedElement: null });

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	act(() => {
		outsideEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBeNull();
});

it("clears selection when clicking inside the panzoom area but outside the element wrapper", () => {
	const store = createStore({ selectedElement: "el-1" });

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	const insideOther = document.createElement("div");
	panZoomContainer.appendChild(insideOther);

	act(() => {
		insideOther.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBeNull();
});

it("keeps selection when the click target is the element wrapper itself", () => {
	const store = createStore({ selectedElement: "el-1" });

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	act(() => {
		elementWrapper.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBe("el-1");
});

it("keeps selection when the click target is a child of the element wrapper", () => {
	const store = createStore({ selectedElement: "el-1" });
	const child = document.createElement("span");
	elementWrapper.appendChild(child);

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	act(() => {
		child.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBe("el-1");
});

it("clears selection when no element wrapper exists for the selected id", () => {
	const store = createStore({ selectedElement: "does-not-exist" });
	const insideTarget = document.createElement("div");
	panZoomContainer.appendChild(insideTarget);

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	act(() => {
		insideTarget.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBeNull();
});

it("ignores clicks whose target is outside the panzoom container", () => {
	const store = createStore({ selectedElement: "el-1" });

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	act(() => {
		outsideEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBe("el-1");
});

it("clears selection when the click is on an input inside the panzoom area", () => {
	const store = createStore({ selectedElement: "el-1" });
	const input = document.createElement("input");
	panZoomContainer.appendChild(input);

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	act(() => {
		input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	expect(store.getState().selectedElement).toBeNull();
});

it("skips processing the click immediately following an input click", () => {
	const store = createStore({ selectedElement: "el-1" });
	const input = document.createElement("input");
	panZoomContainer.appendChild(input);
	const other = document.createElement("div");
	panZoomContainer.appendChild(other);

	renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	// first click on the input clears the selection and marks
	// isLastClickedIsInputRef.current = true
	act(() => {
		input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	expect(store.getState().selectedElement).toBeNull();

	// restore selection directly (bypassing the click handler) so we can
	// observe whether the next click is skipped
	act(() => {
		store.dispatch(replaceSelectedElement({ elementId: "el-1" }));
	});

	// this click should be skipped entirely because the previous click was
	// on an input -— selection must remain untouched
	act(() => {
		other.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	expect(store.getState().selectedElement).toBe("el-1");

	// the ref was updated to isLastClickedIsInput = false during the skipped
	// click, so this next click is processed normally and clears selection
	act(() => {
		other.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	expect(store.getState().selectedElement).toBeNull();
});

it("does nothing when gridAPIRef.current is not set", () => {
	const store = createStore({ selectedElement: "el-1" });
	const wrapperWithoutGridAPI = ({ children }: PropsWithChildren) => (
		<Provider store={store}>
			<ConfigurationProvider>
				<GridAPIProvider>{children}</GridAPIProvider>
			</ConfigurationProvider>
		</Provider>
	);

	renderHook(() => useBlurSelectedElement(), {
		wrapper: wrapperWithoutGridAPI,
	});

	act(() => {
		outsideEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	expect(store.getState().selectedElement).toBe("el-1");
});

it("removes the click listener on unmount", () => {
	const store = createStore({ selectedElement: "el-1" });
	const removeSpy = vi.spyOn(window, "removeEventListener");

	const { unmount } = renderHook(() => useBlurSelectedElement(), {
		wrapper: makeWrapper(store),
	});

	unmount();

	expect(removeSpy).toHaveBeenCalledWith("click", expect.any(Function));
	removeSpy.mockRestore();
});
