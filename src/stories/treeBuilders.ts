import type { Border, Padding, TextElement, Tree } from "types";

// Small helpers to describe a page template (Tree) without hand writing JSON.

export type TextOptions = {
	align?: string;
	bold?: boolean;
	color?: string;
	fontSize?: number;
	italic?: boolean;
	lineHeight?: string;
	letterSpacing?: string;
};

export const paragraph = (
	text: string,
	options: TextOptions = {},
): TextElement => ({
	type: "paragraph",
	align: options.align ?? "left",
	lineHeight: options.lineHeight ?? "1.5",
	letterSpacing: options.letterSpacing ?? "normal",
	children: [
		{
			text,
			bold: options.bold,
			italic: options.italic,
			color: options.color ?? "#000000",
			fontSize: options.fontSize ?? 16,
		},
	],
});

export type NodeOptions = {
	marginLeft?: number;
	marginRight?: number;
	marginTop?: number;
	marginBottom?: number;
};

export const node = (
	id: string,
	w: number,
	componentName: string,
	props: Array<{ propId: string; value: unknown }>,
	options: NodeOptions = {},
): Tree => ({
	id,
	w,
	h: 0,
	marginLeft: options.marginLeft ?? 0,
	marginRight: options.marginRight ?? 0,
	marginTop: options.marginTop ?? 0,
	marginBottom: options.marginBottom ?? 0,
	type: "component",
	element: {
		id,
		componentName,
		props,
		h: "auto",
		x: 0,
		y: 0,
		w,
	},
});

export const padding = (value: Partial<Padding>): Padding => ({
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	...value,
});

export const border = (value: Partial<Border>): Border => ({
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	radius: 0,
	color: "transparent",
	...value,
});

export type BoxOptions = NodeOptions & {
	backgroundColor?: string;
	border?: Partial<Border>;
	boxShadow?: string;
	padding?: Partial<Padding>;
};

export const box = (
	id: string,
	w: number,
	content: TextElement[],
	options: BoxOptions = {},
): Tree =>
	node(
		id,
		w,
		"Box",
		[
			{ propId: "content", value: content },
			{
				propId: "backgroundColor",
				value: options.backgroundColor ?? "transparent",
			},
			{ propId: "padding", value: padding(options.padding ?? {}) },
			{ propId: "border", value: border(options.border ?? {}) },
			{ propId: "boxShadow", value: options.boxShadow ?? "" },
		],
		options,
	);

export type ButtonOptions = NodeOptions & {
	backgroundColor?: string;
	color?: string;
	href?: string;
	radius?: number;
};

export const button = (
	id: string,
	w: number,
	label: string,
	options: ButtonOptions = {},
): Tree =>
	node(
		id,
		w,
		"CustomButton",
		[
			{
				propId: "src",
				value: {
					location:
						options.href ?? "https://github.com/sasza2/react-web-builder",
					openInNewTab: true,
				},
			},
			{
				propId: "content",
				value: [
					paragraph(label, {
						align: "center",
						bold: true,
						fontSize: 17,
						color: options.color ?? "#ffffff",
					}),
				],
			},
			{ propId: "color", value: options.color ?? "#ffffff" },
			{
				propId: "backgroundColor",
				value: options.backgroundColor ?? "#6366f1",
			},
			{ propId: "padding", value: padding({ top: 16, bottom: 16 }) },
			{ propId: "border", value: border({ radius: options.radius ?? 10 }) },
			{ propId: "boxShadow", value: "" },
		],
		options,
	);

export type ImageOptions = NodeOptions & {
	boxShadow?: string;
	radius?: number;
};

export const image = (
	id: string,
	w: number,
	url: string,
	options: ImageOptions = {},
): Tree =>
	node(
		id,
		w,
		"Image",
		[
			{ propId: "url", value: { location: url } },
			{ propId: "href", value: { location: "", openInNewTab: true } },
			{ propId: "border", value: border({ radius: options.radius ?? 16 }) },
			{
				propId: "boxShadow",
				value: options.boxShadow ?? "0px 24px 60px rgba(15, 23, 42, 0.25)",
			},
		],
		options,
	);

export const line = (
	id: string,
	w: number,
	options: NodeOptions & { color?: string } = {},
): Tree =>
	node(
		id,
		w,
		"Line",
		[
			{ propId: "height", value: 1 },
			{ propId: "type", value: "solid" },
			{ propId: "backgroundColor", value: options.color ?? "#e2e8f0" },
			{ propId: "borderRadius", value: 0 },
		],
		options,
	);

export const column = (
	id: string,
	w: number,
	children: Tree[],
	options: NodeOptions = {},
): Tree => ({
	id,
	w,
	h: 0,
	marginLeft: options.marginLeft ?? 0,
	marginRight: options.marginRight ?? 0,
	marginTop: options.marginTop ?? 0,
	marginBottom: options.marginBottom ?? 0,
	type: "column",
	children,
});

export const row = (
	id: string,
	w: number,
	children: Tree[],
	options: NodeOptions = {},
): Tree => ({
	id,
	w,
	h: 0,
	marginLeft: options.marginLeft ?? 0,
	marginRight: options.marginRight ?? 0,
	marginTop: options.marginTop ?? 0,
	marginBottom: options.marginBottom ?? 0,
	type: "row",
	children,
});
