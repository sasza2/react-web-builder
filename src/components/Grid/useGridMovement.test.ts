import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ConfigurationProvider", () => ({
	useConfiguration: vi.fn(),
}));

import { useConfiguration } from "@/components/ConfigurationProvider";

import { buildConfiguration } from "@/testing/fixtures";

import useGridMovement from "./useGridMovement";

describe("useGridMovement", () => {
	afterEach(() => {
		vi.mocked(useConfiguration).mockReset();
	});

	it("returns disabled defaults when panZoomScroll is false", () => {
		vi.mocked(useConfiguration).mockReturnValue(
			buildConfiguration({ panZoomScroll: false }),
		);

		const { result } = renderHook(() => useGridMovement());

		expect(result.current).toEqual({
			disabledZoom: false,
			disabledMove: false,
			disabledScrollVertical: true,
			disabledScrollHorizontal: true,
		});
	});

	it("returns zoom/move state derived from key state when panZoomScroll is true", () => {
		vi.mocked(useConfiguration).mockReturnValue(
			buildConfiguration({ panZoomScroll: true }),
		);

		const { result } = renderHook(() => useGridMovement());

		expect(result.current).toEqual({
			disabledZoom: true,
			disabledMove: true,
			disabledScrollVertical: false,
			disabledScrollHorizontal: true,
		});
	});

	it("tracks ShiftLeft key down/up", () => {
		vi.mocked(useConfiguration).mockReturnValue(
			buildConfiguration({ panZoomScroll: true }),
		);

		const { result } = renderHook(() => useGridMovement());

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { code: "ShiftLeft" }));
		});

		expect(result.current.disabledScrollVertical).toBe(true);
		expect(result.current.disabledScrollHorizontal).toBe(false);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { code: "ShiftLeft" }));
		});

		expect(result.current.disabledScrollVertical).toBe(false);
		expect(result.current.disabledScrollHorizontal).toBe(true);
	});

	it("tracks ControlLeft key down/up and enables zoom", () => {
		vi.mocked(useConfiguration).mockReturnValue(
			buildConfiguration({ panZoomScroll: true }),
		);

		const { result } = renderHook(() => useGridMovement());

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "ControlLeft" }),
			);
		});

		expect(result.current.disabledZoom).toBe(false);
		expect(result.current.disabledScrollVertical).toBe(true);
		expect(result.current.disabledScrollHorizontal).toBe(true);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { code: "ControlLeft" }));
		});

		expect(result.current.disabledZoom).toBe(true);
	});

	it("tracks metaKey state on keydown/keyup", () => {
		vi.mocked(useConfiguration).mockReturnValue(
			buildConfiguration({ panZoomScroll: true }),
		);

		const { result } = renderHook(() => useGridMovement());

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", { code: "KeyA", metaKey: true }),
			);
		});

		expect(result.current.disabledZoom).toBe(false);

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keyup", { code: "KeyA", metaKey: false }),
			);
		});

		expect(result.current.disabledZoom).toBe(true);
	});

	it("does not attach listeners when panZoomScroll is false, and cleans up on unmount", () => {
		vi.mocked(useConfiguration).mockReturnValue(
			buildConfiguration({ panZoomScroll: false }),
		);

		const addSpy = vi.spyOn(window, "addEventListener");
		const { unmount } = renderHook(() => useGridMovement());
		expect(addSpy).not.toHaveBeenCalledWith("keydown", expect.any(Function));
		unmount();
		addSpy.mockRestore();
	});

	it("removes listeners on unmount when panZoomScroll is true", () => {
		vi.mocked(useConfiguration).mockReturnValue(
			buildConfiguration({ panZoomScroll: true }),
		);

		const removeSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = renderHook(() => useGridMovement());
		unmount();
		expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith("keyup", expect.any(Function));
		removeSpy.mockRestore();
	});
});
