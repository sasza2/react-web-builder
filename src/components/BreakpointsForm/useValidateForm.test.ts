import { act, renderHook } from "@testing-library/react";
import type { Padding } from "types";
import { describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockUseBreakpoints = vi.fn();
const mockUseElements = vi.fn();
const mockUseSidebarRef = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, unknown>) =>
			options ? `${key}:${JSON.stringify(options)}` : key,
	}),
	withTranslation:
		() =>
		<Props>(Component: Props) =>
			Component,
}));

vi.mock("@/components/SidebarProvider", () => ({
	useSidebarRef: () => mockUseSidebarRef(),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/hooks/useBreakpoints", () => ({
	useBreakpoints: () => mockUseBreakpoints(),
}));

vi.mock("@/hooks/useElements", () => ({
	useElements: () => mockUseElements(),
}));

import type { Errors } from "./types";
import { useValidateForm } from "./useValidateForm";

const validForm = () => ({
	from: "500",
	rowHeight: "15",
	cols: "10",
	backgroundColor: "#fff",
	padding: { top: 10, right: 10, bottom: 0, left: 10 },
});

describe("useValidateForm", () => {
	const makeSidebarRef = () => {
		const errorNode = {
			getBoundingClientRect: () => ({ top: 100 }),
		};
		const el = {
			querySelectorAll: vi.fn().mockReturnValue([errorNode]),
			getBoundingClientRect: () => ({ top: 0 }),
			scrollTop: 0,
			scrollTo: vi.fn(),
		};
		return { current: el };
	};

	it("returns no errors for a fully valid form", () => {
		mockUseBreakpoint.mockReturnValue(null);
		mockUseBreakpoints.mockReturnValue([]);
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseSidebarRef.mockReturnValue(makeSidebarRef());

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		let errors: Errors;
		act(() => {
			errors = validate(validForm());
		});

		expect(errors).toEqual([]);
		expect(result.current[0]).toEqual([]);
	});

	it("collects errors for invalid numeric fields and too-small from", () => {
		mockUseBreakpoint.mockReturnValue(null);
		mockUseBreakpoints.mockReturnValue([]);
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseSidebarRef.mockReturnValue(makeSidebarRef());

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		let errors: Errors;
		act(() => {
			errors = validate({
				from: "abc",
				rowHeight: "abc",
				cols: "abc",
				backgroundColor: "#fff",
				// padding values come straight from text inputs
				padding: {
					top: "abc",
					right: "abc",
					left: "abc",
					bottom: 0,
				} as unknown as Padding,
			});
		});

		const names = errors.map((e) => e.name);
		expect(names).toContain("from");
		expect(names).toContain("rowHeight");
		expect(names).toContain("cols");
		expect(names).toContain("paddingTop");
		expect(names).toContain("paddingRight");
		expect(names).toContain("paddingLeft");
	});

	it("flags an already-existing breakpoint 'from' value, excluding the current breakpoint", () => {
		mockUseBreakpoint.mockReturnValue({ id: "current", from: 500 });
		mockUseBreakpoints.mockReturnValue([
			{ id: "other", from: 500 },
			{ id: "current", from: 500 },
		]);
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseSidebarRef.mockReturnValue(makeSidebarRef());

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		let errors: Errors;
		act(() => {
			errors = validate(validForm());
		});

		expect(
			errors.some((e) => e.error === "breakpoint.errors.alreadyExists"),
		).toBe(true);
	});

	it("excludes the current breakpoint itself from the duplicate check", () => {
		mockUseBreakpoint.mockReturnValue({ id: "current", from: 500 });
		mockUseBreakpoints.mockReturnValue([{ id: "current", from: 500 }]);
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseSidebarRef.mockReturnValue(makeSidebarRef());

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		let errors: Errors;
		act(() => {
			errors = validate(validForm());
		});

		expect(
			errors.some((e) => e.error === "breakpoint.errors.alreadyExists"),
		).toBe(false);
	});

	it("filters non-breakpoint entries via isBreakpoint before checking duplicates", () => {
		mockUseBreakpoint.mockReturnValue(null);
		mockUseBreakpoints.mockReturnValue([
			{ id: "child", from: 500, parentId: "x" },
		]);
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseSidebarRef.mockReturnValue(makeSidebarRef());

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		let errors: Errors;
		act(() => {
			errors = validate(validForm());
		});

		expect(
			errors.some((e) => e.error === "breakpoint.errors.alreadyExists"),
		).toBe(false);
	});

	it("flags elements that don't fit within cols", () => {
		mockUseBreakpoint.mockReturnValue(null);
		mockUseBreakpoints.mockReturnValue([]);
		mockUseElements.mockReturnValue({ elements: [{ x: 8, w: 5 }] });
		mockUseSidebarRef.mockReturnValue(makeSidebarRef());

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		let errors: Errors;
		act(() => {
			errors = validate(validForm());
		});

		expect(
			errors.some((e) => e.error === "breakpoint.errors.wontFitGrid"),
		).toBe(true);
	});

	it("flags cols not less than 'from'", () => {
		mockUseBreakpoint.mockReturnValue(null);
		mockUseBreakpoints.mockReturnValue([]);
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseSidebarRef.mockReturnValue(makeSidebarRef());

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		let errors: Errors;
		act(() => {
			errors = validate({ ...validForm(), cols: "9999" });
		});

		expect(
			errors.some((e) => e.error === "breakpoint.errors.biggerThanFrom"),
		).toBe(true);
	});

	it("flags horizontal padding that's too big and scrolls to first error node", () => {
		vi.useFakeTimers();
		mockUseBreakpoint.mockReturnValue(null);
		mockUseBreakpoints.mockReturnValue([]);
		mockUseElements.mockReturnValue({ elements: [] });
		const sidebarRef = makeSidebarRef();
		mockUseSidebarRef.mockReturnValue(sidebarRef);

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		act(() => {
			validate({
				...validForm(),
				from: "360",
				padding: { top: 0, right: 100, bottom: 0, left: 100 },
			});
		});

		act(() => {
			vi.runAllTimers();
		});

		expect(sidebarRef.current.scrollTo).toHaveBeenCalled();
		vi.useRealTimers();
	});

	it("does not scroll when there are no error nodes found in the DOM", () => {
		vi.useFakeTimers();
		mockUseBreakpoint.mockReturnValue(null);
		mockUseBreakpoints.mockReturnValue([]);
		mockUseElements.mockReturnValue({ elements: [] });
		const sidebarRef = makeSidebarRef();
		sidebarRef.current.querySelectorAll = vi.fn().mockReturnValue([]);
		mockUseSidebarRef.mockReturnValue(sidebarRef);

		const { result } = renderHook(() => useValidateForm());
		const [, validate] = result.current;

		act(() => {
			validate({
				...validForm(),
				from: "360",
				padding: { top: 0, right: 100, bottom: 0, left: 100 },
			});
		});

		act(() => {
			vi.runAllTimers();
		});

		expect(sidebarRef.current.scrollTo).not.toHaveBeenCalled();
		vi.useRealTimers();
	});
});
