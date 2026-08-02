import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { expect, it } from "vitest";

import { PropertiesProvider } from "@/components/PropertiesProvider";
import { DEFAULT_PRESET_COLORS } from "@/consts";

import { usePresetColors } from "./usePresetColors";

it("normalizes the default preset colors when none are provided", () => {
	const wrapper = ({ children }: PropsWithChildren) => (
		<PropertiesProvider>{children}</PropertiesProvider>
	);

	const { result } = renderHook(() => usePresetColors(), { wrapper });

	expect(result.current).toHaveLength(DEFAULT_PRESET_COLORS.length);
	result.current.forEach((color) => {
		expect(color).toMatch(/^#[0-9a-f]{8}$/i);
	});
});

it("normalizes custom preset colors when provided", () => {
	const wrapper = ({ children }: PropsWithChildren) => (
		<PropertiesProvider presetColors={["#abcdef", "abc123"]}>
			{children}
		</PropertiesProvider>
	);

	const { result } = renderHook(() => usePresetColors(), { wrapper });

	expect(result.current).toEqual(["#abcdefff", "#abc123ff"]);
});
