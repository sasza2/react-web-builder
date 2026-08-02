import { renderHook } from "@testing-library/react";
import React from "react";
import { expect, it, vi } from "vitest";

import type { WebBuilderNavbarIcon } from "types";

import { useOnNavbarIconClick } from "./useOnNavbarIconClick";

const buildMock = vi.fn(() => ({ id: "built-page" }));

const buildNavbarIcon = (
	navbarIcon: Partial<WebBuilderNavbarIcon> = {},
): WebBuilderNavbarIcon => ({
	id: "icon-1",
	icon: () => <span />,
	onClick: () => undefined,
	...navbarIcon,
});

vi.mock("./page/useBuildPageWithTree", () => ({
	useBuildPageWithTree: () => buildMock,
}));

it("calls the navbar icon's onClick handler with the built page", () => {
	const { result } = renderHook(() => useOnNavbarIconClick());

	const onClick = vi.fn();
	result.current(buildNavbarIcon({ onClick }));

	expect(buildMock).toHaveBeenCalled();
	expect(onClick).toHaveBeenCalledWith({ page: { id: "built-page" } });
});

it("does nothing when onClick is not a function", () => {
	const { result } = renderHook(() => useOnNavbarIconClick());

	expect(() =>
		result.current(buildNavbarIcon({ onClick: undefined })),
	).not.toThrow();
});
