import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-player", () => ({
	default: ({ src }: { src: string }) => (
		<div data-testid="react-player" data-src={src} />
	),
}));

import { StyleProvider } from "@/components/StyleProvider";
import { buildBreakpoint, buildElement } from "@/testing/fixtures";

import { Image, useInternalComponents, Video } from "./components";

describe("Image", () => {
	it("returns null when url is missing", () => {
		const { container } = render(<Image />);
		expect(container.innerHTML).toBe("");
	});

	it("returns null when url.location is missing", () => {
		const { container } = render(<Image url={{ location: "" }} />);
		expect(container.innerHTML).toBe("");
	});

	it("renders a plain image when no href is provided", () => {
		const { container, queryByRole } = render(
			<Image url={{ location: "https://example.com/img.png" }} />,
		);
		expect(queryByRole("link")).toBeNull();
		const img = container.querySelector("img");
		expect(img).not.toBeNull();
		expect(img?.getAttribute("src")).toBe("https://example.com/img.png");
	});

	it("renders a plain image when href.location is empty", () => {
		const { container } = render(
			<Image
				url={{ location: "https://example.com/img.png" }}
				href={{ location: "" }}
			/>,
		);
		expect(container.querySelector("a")).toBeNull();
	});

	it("wraps the image in a link when href.location is set, without target", () => {
		const { container } = render(
			<Image
				url={{ location: "https://example.com/img.png" }}
				href={{ location: "https://example.com" }}
			/>,
		);
		const a = container.querySelector("a");
		expect(a).not.toBeNull();
		expect(a?.getAttribute("href")).toBe("https://example.com");
		expect(a?.getAttribute("target")).toBeNull();
	});

	it("wraps the image in a link that opens in a new tab", () => {
		const { container } = render(
			<Image
				url={{ location: "https://example.com/img.png" }}
				href={{ location: "https://example.com", openInNewTab: true }}
			/>,
		);
		const a = container.querySelector("a");
		expect(a?.getAttribute("target")).toBe("_blank");
	});

	it("applies border/boxShadow styles via useBoxStyle", () => {
		const { container } = render(
			<Image
				url={{ location: "https://example.com/img.png" }}
				border={{ top: 1, right: 1, bottom: 1, left: 1, color: "#000000" }}
				boxShadow="0 0 1px #000"
			/>,
		);
		const img = container.querySelector("img");
		expect(img?.style.boxShadow).toBe("0 0 1px #000");
	});
});

describe("Video", () => {
	it("returns null when url is missing", () => {
		const { container } = render(<Video />);
		expect(container.innerHTML).toBe("");
	});

	it("renders ReactPlayer when url is provided", () => {
		const { getByTestId } = render(
			<StyleProvider>
				<Video url={{ location: "https://example.com/video.mp4" }} />
			</StyleProvider>,
		);
		const player = getByTestId("react-player");
		expect(player.getAttribute("data-src")).toBe(
			"https://example.com/video.mp4",
		);
	});

	it("is wrapped in memo with a comparator based on url reference equality", () => {
		const url = { location: "https://example.com/video.mp4" };
		const { getByTestId, rerender } = render(
			<StyleProvider>
				<Video url={url} />
			</StyleProvider>,
		);
		expect(getByTestId("react-player")).not.toBeNull();

		// Same url reference: comparator returns true, no re-render needed.
		rerender(
			<StyleProvider>
				<Video url={url} />
			</StyleProvider>,
		);
		expect(getByTestId("react-player")).not.toBeNull();

		// Different url reference: comparator returns false, re-renders.
		rerender(
			<StyleProvider>
				<Video url={{ location: "https://example.com/other.mp4" }} />
			</StyleProvider>,
		);
		expect(getByTestId("react-player").getAttribute("data-src")).toBe(
			"https://example.com/other.mp4",
		);
	});
});

describe("useInternalComponents", () => {
	const elementAnchor = () => <div data-testid="anchor" />;
	const elementContainer = () => <div data-testid="container" />;

	it("builds the default component list including CustomButton", () => {
		const components = useInternalComponents({
			elementAnchor,
			elementContainer,
		});

		const ids = components.map((c) => c.id);
		expect(ids).toContain("Container");
		expect(ids).toContain("Box");
		expect(ids).toContain("Image");
		expect(ids).toContain("Video");
		expect(ids).toContain("CustomButton");
		expect(ids).toContain("Line");
		expect(ids).toContain("Separator");
		expect(ids).toContain("Iframe");
		expect(ids).toContain("Anchor");
		expect(ids).toContain("HTMLComponent");
	});

	it("excludes CustomButton when defaultButtonAvailable is false", () => {
		const components = useInternalComponents({
			elementAnchor,
			elementContainer,
			defaultButtonAvailable: false,
		});

		const ids = components.map((c) => c.id);
		expect(ids).not.toContain("CustomButton");
	});

	it("uses provided default overrides", () => {
		const components = useInternalComponents({
			elementAnchor,
			elementContainer,
			defaultBoxContent: [{ type: "paragraph", children: [] }],
			defaultButtonBackgroundColor: "#123456",
			defaultButtonContent: [{ type: "paragraph", children: [] }],
			defaultButtonHref: "https://custom.example.com",
			defaultImageSrc: "https://custom.example.com/img.png",
			defaultVideoSrc: "https://custom.example.com/video.mp4",
		});

		const box = components.find((c) => c.id === "Box");
		const boxContentProp = box?.props.find((p) => p.id === "content");
		expect(boxContentProp?.defaultValue).toEqual([
			{ type: "paragraph", children: [] },
		]);

		const image = components.find((c) => c.id === "Image");
		const urlProp = image?.props.find((p) => p.id === "url");
		expect(urlProp?.defaultValue).toEqual({
			location: "https://custom.example.com/img.png",
		});

		const customButton = components.find((c) => c.id === "CustomButton");
		const backgroundColorProp = customButton?.props.find(
			(p) => p.id === "backgroundColor",
		);
		expect(backgroundColorProp?.defaultValue).toBe("#123456");
	});

	it("Line's dashesWidth/dashesGap visibility depends on type", () => {
		const components = useInternalComponents({
			elementAnchor,
			elementContainer,
		});
		const line = components.find((c) => c.id === "Line");
		const dashesWidth = line?.props?.find((p) => p.id === "dashesWidth");
		const dashesGap = line?.props?.find((p) => p.id === "dashesGap");

		const visibilityProps = (type: string) => ({
			breakpoint: buildBreakpoint(),
			element: buildElement(),
			formValues: { type },
			prop: dashesWidth,
		});

		expect(dashesWidth?.visibility?.(visibilityProps("dashed"))).toBe(true);
		expect(dashesWidth?.visibility?.(visibilityProps("solid"))).toBe(false);
		expect(dashesGap?.visibility?.(visibilityProps("dashed"))).toBe(true);
		expect(dashesGap?.visibility?.(visibilityProps("solid"))).toBe(false);
	});
});
