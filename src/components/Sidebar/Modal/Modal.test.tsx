import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const modalRef = { current: null } as React.MutableRefObject<HTMLDivElement>;

vi.mock("@/components/SidebarProvider", () => ({
	useSidebarModalRef: () => modalRef,
}));

import { StyleProvider } from "../../StyleProvider";
import { Modal } from "./Modal";

describe("Modal", () => {
	it("renders a container div attached to the sidebar modal ref", () => {
		const { container } = render(
			<StyleProvider>
				<Modal />
			</StyleProvider>,
		);
		const div = container.firstChild as HTMLDivElement;
		expect(div).not.toBeNull();
		expect(modalRef.current).toBe(div);
	});
});
