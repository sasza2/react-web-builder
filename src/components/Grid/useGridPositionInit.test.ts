import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockUseWebBuilderSizeWidth = vi.fn();
const mockUseSidebarWidth = vi.fn();
const mockGetBreakpointWidth = vi.fn();

vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: vi.fn(),
}));
vi.mock("@/components/WebBuilderSize", () => ({
	useWebBuilderSizeWidth: () => mockUseWebBuilderSizeWidth(),
}));
vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));
vi.mock("@/hooks/useGetBreakpointWidth", () => ({
	useGetBreakpointWidth: () => mockGetBreakpointWidth,
}));
vi.mock("../SidebarProvider", () => ({
	useSidebarWidth: () => mockUseSidebarWidth(),
}));

import { useGridAPI } from "@/components/GridAPIProvider";

import {
	buildBreakpoint,
	buildGridAPI,
	buildPanZoomAPI,
} from "@/testing/fixtures";

import { useGridPositionInit } from "./useGridPositionInit";

let bpCounter = 0;

describe("useGridPositionInit", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		bpCounter += 1;
		mockUseBreakpoint.mockReturnValue(
			buildBreakpoint({ id: `bp-${bpCounter}`, from: 1000 }),
		);
		mockUseWebBuilderSizeWidth.mockReturnValue(1000);
		mockUseSidebarWidth.mockReturnValue(0);
		mockGetBreakpointWidth.mockReturnValue(1000);
	});

	it("does nothing when isLoaded is false", () => {
		const gridAPI = buildGridAPI();
		vi.mocked(useGridAPI).mockReturnValue({ current: gridAPI });
		renderHook(() => useGridPositionInit(false));
		expect(gridAPI.getPanZoom).not.toHaveBeenCalled();
	});

	it("does nothing when panZoom API is not available", () => {
		vi.mocked(useGridAPI).mockReturnValue({
			current: buildGridAPI({ getPanZoom: () => null }),
		});
		renderHook(() => useGridPositionInit(true));
		// no throw
	});

	it("restores a previously saved position/zoom for the breakpoint", () => {
		const setZoom = vi.fn();
		const setPosition = vi.fn();
		const getPosition = vi.fn(() => ({ x: 5, y: 6 }));
		const getZoom = vi.fn(() => 2);
		const panZoom = buildPanZoomAPI({
			setZoom,
			setPosition,
			getPosition,
			getZoom,
		});
		vi.mocked(useGridAPI).mockReturnValue({
			current: buildGridAPI({ getPanZoom: () => panZoom }),
		});

		const { unmount } = renderHook(
			({ isLoaded }: { isLoaded: boolean }) => useGridPositionInit(isLoaded),
			{ initialProps: { isLoaded: true } },
		);

		// first mount computes a fresh position (no saved position yet)
		expect(setPosition).toHaveBeenCalled();

		setPosition.mockClear();
		setZoom.mockClear();

		// trigger cleanup (savePosition) then remount to hit the "has saved position" branch
		unmount();

		renderHook(
			({ isLoaded }: { isLoaded: boolean }) => useGridPositionInit(isLoaded),
			{ initialProps: { isLoaded: true } },
		);

		expect(setZoom).toHaveBeenCalledWith(2);
		expect(setPosition).toHaveBeenCalledWith(5, 6);
	});

	it("scales zoom down when breakpoint is wider than the available web builder width", () => {
		mockUseWebBuilderSizeWidth.mockReturnValue(500);
		mockGetBreakpointWidth.mockReturnValue(1000);
		const setZoom = vi.fn();
		const setPosition = vi.fn();
		const getPosition = vi.fn(() => ({ x: 0, y: 0 }));
		const getZoom = vi.fn(() => 1);
		const panZoom = buildPanZoomAPI({
			setZoom,
			setPosition,
			getPosition,
			getZoom,
		});
		vi.mocked(useGridAPI).mockReturnValue({
			current: buildGridAPI({ getPanZoom: () => panZoom }),
		});

		renderHook(() => useGridPositionInit(true));

		expect(setZoom).toHaveBeenCalled();
		expect(setPosition).toHaveBeenCalled();
	});

	it("uses mobile zoom scale for narrow breakpoints that still fit", () => {
		mockUseWebBuilderSizeWidth.mockReturnValue(2000);
		mockGetBreakpointWidth.mockReturnValue(400);
		const setZoom = vi.fn();
		const setPosition = vi.fn();
		const getPosition = vi.fn(() => ({ x: 0, y: 0 }));
		const getZoom = vi.fn(() => 1);
		const panZoom = buildPanZoomAPI({
			setZoom,
			setPosition,
			getPosition,
			getZoom,
		});
		vi.mocked(useGridAPI).mockReturnValue({
			current: buildGridAPI({ getPanZoom: () => panZoom }),
		});

		renderHook(() => useGridPositionInit(true));

		expect(setZoom).toHaveBeenCalledWith(0.7);
	});

	it("does not adjust zoom when breakpoint fits and is not mobile-sized", () => {
		mockUseWebBuilderSizeWidth.mockReturnValue(2000);
		mockGetBreakpointWidth.mockReturnValue(1000);
		const setZoom = vi.fn();
		const setPosition = vi.fn();
		const getPosition = vi.fn(() => ({ x: 0, y: 0 }));
		const getZoom = vi.fn(() => 1);
		const panZoom = buildPanZoomAPI({
			setZoom,
			setPosition,
			getPosition,
			getZoom,
		});
		vi.mocked(useGridAPI).mockReturnValue({
			current: buildGridAPI({ getPanZoom: () => panZoom }),
		});

		renderHook(() => useGridPositionInit(true));

		expect(setZoom).not.toHaveBeenCalled();
		expect(setPosition).toHaveBeenCalled();
	});

	it("saves the position on cleanup (unmount) using the current panZoom state", () => {
		const setZoom = vi.fn();
		const setPosition = vi.fn();
		const getPosition = vi.fn(() => ({ x: 9, y: 10 }));
		const getZoom = vi.fn(() => 3);
		const panZoom = buildPanZoomAPI({
			setZoom,
			setPosition,
			getPosition,
			getZoom,
		});
		vi.mocked(useGridAPI).mockReturnValue({
			current: buildGridAPI({ getPanZoom: () => panZoom }),
		});

		const { unmount } = renderHook(() => useGridPositionInit(true));
		act(() => {
			unmount();
		});
		// cleanup calls savePosition -> getPosition/getZoom
		expect(getPosition).toHaveBeenCalled();
		expect(getZoom).toHaveBeenCalled();
	});
});
