import { act, render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";

import {
	ConfigurationProvider,
	useConfiguration,
	useSetConfiguration,
} from "./ConfigurationProvider";

const wrapper = ({ children }: React.PropsWithChildren) => (
	<ConfigurationProvider>{children}</ConfigurationProvider>
);

describe("ConfigurationProvider", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("renders children", () => {
		render(
			<ConfigurationProvider>
				<div>child</div>
			</ConfigurationProvider>,
		);

		expect(screen.getByText("child")).not.toBeNull();
	});

	it("provides default configuration when localStorage is empty", () => {
		const { result } = renderHook(() => useConfiguration(), { wrapper });

		expect(result.current.autoSave).toBe(false);
		expect(result.current.helpLines).toBe(true);
		expect(result.current.scrollSpeed).toBe(3);
	});

	it("merges configuration from localStorage with defaults", () => {
		localStorage.setItem(
			"configuration",
			JSON.stringify({ autoSave: true, scrollSpeed: 7 }),
		);

		const { result } = renderHook(() => useConfiguration(), { wrapper });

		expect(result.current.autoSave).toBe(true);
		expect(result.current.scrollSpeed).toBe(7);
		expect(result.current.helpLines).toBe(true);
	});

	it("useSetConfiguration updates state and persists to localStorage", () => {
		const { result } = renderHook(
			() => ({
				configuration: useConfiguration(),
				setConfiguration: useSetConfiguration(),
			}),
			{ wrapper },
		);

		const next = {
			...result.current.configuration,
			autoSave: true,
			scrollSpeed: 9,
		};

		act(() => {
			result.current.setConfiguration(next);
		});

		expect(result.current.configuration.autoSave).toBe(true);
		expect(result.current.configuration.scrollSpeed).toBe(9);
		expect(JSON.parse(localStorage.getItem("configuration") as string)).toEqual(
			next,
		);
	});

	it("useConfiguration outside provider returns undefined", () => {
		const { result } = renderHook(() => useConfiguration());
		expect(result.current).toBeUndefined();
	});

	it("useSetConfiguration outside provider throws when invoked", () => {
		const { result } = renderHook(() => useSetConfiguration());
		expect(() => result.current({} as never)).toThrow();
	});
});
