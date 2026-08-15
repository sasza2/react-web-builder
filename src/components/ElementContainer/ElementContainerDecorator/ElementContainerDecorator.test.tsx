import { render, screen } from "@testing-library/react";
import React from "react";
import type { Breakpoint } from "types";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as PropertiesProviderModule from "@/components/PropertiesProvider";
import { buildBreakpoint } from "@/testing/fixtures";

import { ElementContainerDecorator } from "./ElementContainerDecorator";

afterEach(() => {
	vi.restoreAllMocks();
});

const CONTAINER = buildBreakpoint({ id: "bp-1" });

describe("ElementContainerDecorator", () => {
	it("renders children directly when no elementContainerDecorator is set", () => {
		vi.spyOn(PropertiesProviderModule, "useProperties").mockReturnValue({});

		render(
			<ElementContainerDecorator container={CONTAINER}>
				<div>child content</div>
			</ElementContainerDecorator>,
		);

		expect(screen.getByText("child content")).not.toBeNull();
	});

	it("renders the Decorator component with container and extra props when set", () => {
		const Decorator = ({
			children,
			container,
			extra,
		}: {
			children: React.ReactNode;
			container?: Breakpoint;
			extra?: string;
		}) => (
			<div
				data-testid="decorator"
				data-container={container?.id}
				data-extra={extra}
			>
				{children}
			</div>
		);

		vi.spyOn(PropertiesProviderModule, "useProperties").mockReturnValue({
			elementContainerDecorator: Decorator,
		});

		// extra props are forwarded to the decorator, so they are spread in
		const extraProps = { extra: "hello" };

		render(
			<ElementContainerDecorator container={CONTAINER} {...extraProps}>
				<span>inner</span>
			</ElementContainerDecorator>,
		);

		const el = screen.getByTestId("decorator");
		expect(el.getAttribute("data-container")).toBe("bp-1");
		expect(el.getAttribute("data-extra")).toBe("hello");
		expect(screen.getByText("inner")).not.toBeNull();
	});
});
