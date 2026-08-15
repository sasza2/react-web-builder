import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createStore } from "@/store/store";

const removeElementMock = vi.fn();
vi.mock("./useRemoveElement", () => ({
	useRemoveElement: () => removeElementMock,
}));

import { useDeleteElementOnKey } from "./useDeleteElementOnKey";

afterEach(() => {
	vi.clearAllMocks();
});

const buildWrapper = (selectedElement: string | null) => {
	const store = createStore({ selectedElement });
	return ({ children }: React.PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);
};

describe("useDeleteElementOnKey", () => {
	it("does not register a listener when no element is selected", () => {
		const addSpy = vi.spyOn(window, "addEventListener");
		renderHook(() => useDeleteElementOnKey(), {
			wrapper: buildWrapper(null),
		});

		expect(addSpy).not.toHaveBeenCalledWith("keydown", expect.any(Function));
		addSpy.mockRestore();
	});

	it("removes the selected element on Delete keydown when body is focused", () => {
		document.body.focus();
		renderHook(() => useDeleteElementOnKey(), {
			wrapper: buildWrapper("el1"),
		});

		const event = new KeyboardEvent("keydown", { code: "Delete" });
		window.dispatchEvent(event);

		expect(removeElementMock).toHaveBeenCalledWith("el1");
	});

	it("does nothing on Delete keydown when body is not the active element", () => {
		const input = document.createElement("input");
		document.body.appendChild(input);
		input.focus();

		renderHook(() => useDeleteElementOnKey(), {
			wrapper: buildWrapper("el1"),
		});

		const event = new KeyboardEvent("keydown", { code: "Delete" });
		window.dispatchEvent(event);

		expect(removeElementMock).not.toHaveBeenCalled();
		document.body.removeChild(input);
	});

	it("ignores non-Delete keys", () => {
		document.body.focus();
		renderHook(() => useDeleteElementOnKey(), {
			wrapper: buildWrapper("el1"),
		});

		const event = new KeyboardEvent("keydown", { code: "Enter" });
		window.dispatchEvent(event);

		expect(removeElementMock).not.toHaveBeenCalled();
	});

	it("removes the keydown listener on unmount / when selection changes", () => {
		const removeSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = renderHook(() => useDeleteElementOnKey(), {
			wrapper: buildWrapper("el1"),
		});

		unmount();

		expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
		removeSpy.mockRestore();
	});
});
