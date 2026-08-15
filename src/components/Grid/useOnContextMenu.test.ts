import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../GridAPIProvider", () => ({
	useGridAPI: vi.fn(),
}));

import { buildGridAPI } from "@/testing/fixtures";

import { useGridAPI } from "../GridAPIProvider";

import { useOnContextMenu } from "./useOnContextMenu";

const mockGridAPI = () => {
	vi.mocked(useGridAPI).mockReturnValue({
		current: buildGridAPI({
			calculateCellPositionByPixels: vi.fn(() => ({ x: 2, y: 3 })),
		}),
	});
};

const buildContextMenuEvent = (clientX: number, clientY: number) =>
	new MouseEvent("contextmenu", { clientX, clientY });

describe("useOnContextMenu", () => {
	afterEach(() => {
		vi.mocked(useGridAPI).mockReset();
	});

	it("starts with menu = null", () => {
		mockGridAPI();
		const { result } = renderHook(() => useOnContextMenu());
		expect(result.current.menu).toBeNull();
	});

	it("opens the menu on container context menu", () => {
		mockGridAPI();
		const { result } = renderHook(() => useOnContextMenu());

		const e = buildContextMenuEvent(10, 20);
		const preventDefault = vi.spyOn(e, "preventDefault");

		act(() => {
			result.current.onContainerContextMenu({ e, x: 100, y: 200 });
		});

		expect(preventDefault).toHaveBeenCalled();
		expect(result.current.menu).toEqual({
			position: { x: 10, y: 20 },
			row: 3,
			col: 2,
		});
	});

	it("closes the menu when updateMenu is called while a menu is open (via onContainerContextMenu again)", () => {
		mockGridAPI();
		const { result } = renderHook(() => useOnContextMenu());

		act(() => {
			result.current.onContainerContextMenu({
				e: buildContextMenuEvent(10, 20),
				x: 100,
				y: 200,
			});
		});
		expect(result.current.menu).not.toBeNull();

		act(() => {
			result.current.onContainerContextMenu({
				e: buildContextMenuEvent(11, 21),
				x: 101,
				y: 201,
			});
		});
		expect(result.current.menu).toBeNull();
	});

	it("opens the menu on element context menu with elementId", () => {
		mockGridAPI();
		const { result } = renderHook(() => useOnContextMenu());

		const e = buildContextMenuEvent(5, 6);
		const preventDefault = vi.spyOn(e, "preventDefault");
		const stopImmediatePropagation = vi.spyOn(e, "stopImmediatePropagation");

		act(() => {
			result.current.onElementContextMenu({
				e,
				id: "el-1",
				x: 50,
				y: 60,
			});
		});

		expect(preventDefault).toHaveBeenCalled();
		expect(stopImmediatePropagation).toHaveBeenCalled();
		expect(result.current.menu).toEqual({
			position: { x: 5, y: 6 },
			elementId: "el-1",
			row: 3,
			col: 2,
		});
	});

	it("closes the menu via onClose", () => {
		mockGridAPI();
		const { result } = renderHook(() => useOnContextMenu());

		act(() => {
			result.current.onContainerContextMenu({
				e: buildContextMenuEvent(1, 2),
				x: 1,
				y: 2,
			});
		});
		expect(result.current.menu).not.toBeNull();

		act(() => {
			result.current.onClose();
		});
		expect(result.current.menu).toBeNull();
	});
});
