import { act, render } from "@testing-library/react";
import React, { forwardRef } from "react";
import { describe, expect, it, vi } from "vitest";

const fakeFrameDocument = {
	head: document.createElement("div"),
	body: document.createElement("div"),
};

let capturedFrameProps: never;
let capturedFrameRef: ((node: unknown) => void) | undefined;

vi.mock("react-frame-component", () => {
	const Frame = forwardRef((props: never, ref: never) => {
		capturedFrameProps = props;
		capturedFrameRef = ref as never;
		return (
			<div data-testid="frame">
				{(props as never as { children: unknown }).children}
			</div>
		);
	});
	return {
		__esModule: true,
		default: Frame,
		useFrame: () => ({ document: fakeFrameDocument }),
	};
});

vi.mock("styled-components", async () => {
	const actual = await vi.importActual<object>("styled-components");
	return {
		...actual,
		StyleSheetManager: ({ children }: React.PropsWithChildren) => (
			<>{children}</>
		),
	};
});

vi.mock("@/LoadFont", () => ({
	LoadFont: () => <div data-testid="load-font" />,
}));

vi.mock("./RenderInIFrame.styled", () => ({
	IFrameGlobalStyles: () => <div data-testid="global-styles" />,
}));

vi.mock("@/utils/tests", () => ({
	assignTestProp: () => ({ "data-test": "richTextFrame" }),
}));

let capturedOnChange: ((height: number) => void) | undefined;

vi.mock("../Resizable", async () => {
	const actual = await vi.importActual<object>("../Resizable");
	return {
		...actual,
		Resizable: ({
			children,
			onChange,
		}: React.PropsWithChildren<{ onChange?: (height: number) => void }>) => {
			capturedOnChange = onChange;
			return <div data-testid="resizable">{children}</div>;
		},
	};
});

import { RenderInIFrame } from "./RenderInIFrame";

describe("RenderInIFrame", () => {
	it("renders the resizable Frame with children, LoadFont and global styles", () => {
		const { getByTestId, getByText } = render(
			<RenderInIFrame>
				<div>frame-child</div>
			</RenderInIFrame>,
		);

		expect(getByTestId("frame")).not.toBeNull();
		expect(getByText("frame-child")).not.toBeNull();
		expect(getByTestId("load-font")).not.toBeNull();
		expect(getByTestId("global-styles")).not.toBeNull();
	});

	it("sets opacity to 1 once the frame ref (onLoad) fires", () => {
		render(
			<RenderInIFrame>
				<div>frame-child</div>
			</RenderInIFrame>,
		);

		expect(
			(capturedFrameProps as never as { style: { opacity: number } }).style
				.opacity,
		).toBe(0);

		act(() => {
			if (capturedFrameRef) capturedFrameRef({});
		});

		expect(
			(capturedFrameProps as never as { style: { opacity: number } }).style
				.opacity,
		).toBe(1);
	});

	it("propagates height changes from Resizable to the iframe body via setHeight", () => {
		render(
			<RenderInIFrame>
				<div>frame-child</div>
			</RenderInIFrame>,
		);

		act(() => {
			capturedOnChange?.(250);
		});

		expect(fakeFrameDocument.body.style.getPropertyValue("--height")).toBe(
			"250px",
		);
	});
});
