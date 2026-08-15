import { render } from "@testing-library/react";
import React from "react";

import type { RootState } from "@/store/store";
import { describe, expect, it, vi } from "vitest";

const mockUseAppSelector = vi.fn();

vi.mock("@/store/useAppSelector", () => ({
	useAppSelector: (selector: (state: RootState) => unknown) =>
		mockUseAppSelector(selector),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { BeforeUnload } from "./BeforeUnload";

describe("BeforeUnload", () => {
	it("renders null", () => {
		mockUseAppSelector.mockReturnValue({ saved: true });

		const { container } = render(<BeforeUnload />);

		expect(container.innerHTML).toBe("");
	});

	it("does not attach listener when changes are saved", () => {
		mockUseAppSelector.mockReturnValue({ saved: true });
		const addSpy = vi.spyOn(window, "addEventListener");

		render(<BeforeUnload />);

		expect(addSpy).not.toHaveBeenCalledWith(
			"beforeunload",
			expect.any(Function),
		);
		addSpy.mockRestore();
	});

	it("attaches beforeunload listener and sets returnValue when not saved", () => {
		mockUseAppSelector.mockReturnValue({ saved: false });
		const addSpy = vi.spyOn(window, "addEventListener");

		render(<BeforeUnload />);

		const call = addSpy.mock.calls.find(([type]) => type === "beforeunload");
		expect(call).not.toBeUndefined();

		const handler = call[1] as (event: BeforeUnloadEvent) => void;
		const fakeEvent = {} as BeforeUnloadEvent;
		handler(fakeEvent);

		expect(fakeEvent.returnValue).toBe("errors.unsavedChanges");
		addSpy.mockRestore();
	});

	it("removes listener on unmount", () => {
		mockUseAppSelector.mockReturnValue({ saved: false });
		const removeSpy = vi.spyOn(window, "removeEventListener");

		const { unmount } = render(<BeforeUnload />);
		unmount();

		expect(removeSpy).toHaveBeenCalledWith(
			"beforeunload",
			expect.any(Function),
		);
		removeSpy.mockRestore();
	});
});
