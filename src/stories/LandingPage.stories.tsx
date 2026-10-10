import React, { useState } from "react";
import type { Page, Tree } from "types";

import { createUniqueId } from "@/utils/createUniqueId";

import WebBuilder from "../WebBuilder";
import { fonts } from "./consts";
import {
	box,
	button,
	column,
	image,
	line,
	type NodeOptions,
	padding,
	paragraph,
	row,
} from "./treeBuilders";

const COLORS = {
	dark: "#0f172a",
	darkSoft: "#1e293b",
	accent: "#6366f1",
	accentSoft: "#eef2ff",
	white: "#ffffff",
	muted: "#64748b",
	card: "#ffffff",
	page: "#f5f6fb",
};

const HERO_IMAGE =
	"https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1400&q=80";

const CARD_SHADOW = "0px 12px 30px rgba(15, 23, 42, 0.08)";

const features = [
	{
		title: "Drag & drop grid",
		description:
			"Arrange elements on the grid with full control over margins, width and order.",
	},
	{
		title: "Responsive breakpoints",
		description:
			"Every breakpoint has its own layout — design mobile and desktop independently.",
	},
	{
		title: "Your own components",
		description:
			"Plug in your React components with their properties and edit them in the panel.",
	},
];

const featureCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	box(
		`Feature${idSuffix}${index}`,
		w,
		[
			paragraph(features[index].title, {
				bold: true,
				fontSize: 20,
				color: COLORS.dark,
			}),
			paragraph("", { fontSize: 8 }),
			paragraph(features[index].description, {
				fontSize: 15,
				color: COLORS.muted,
				lineHeight: "1.7",
			}),
		],
		{
			backgroundColor: COLORS.card,
			padding: padding({ top: 28, right: 26, bottom: 28, left: 26 }),
			border: { radius: 18 },
			boxShadow: CARD_SHADOW,
			...options,
		},
	);

const templateDesktop: Tree = row("landing-desktop", 12, [
	// nav
	column(
		"NavRow",
		12,
		[
			box(
				"NavLogo",
				4,
				[
					paragraph("react-web-builder", {
						bold: true,
						fontSize: 20,
						color: COLORS.dark,
						letterSpacing: "-0.5px",
					}),
				],
				{ marginLeft: 1 },
			),
			box(
				"NavLinks",
				4,
				[
					paragraph("Features  ·  Docs  ·  GitHub", {
						align: "right",
						fontSize: 15,
						color: COLORS.muted,
					}),
				],
				{ marginLeft: 2 },
			),
		],
		{ marginTop: 2 },
	),
	// hero
	box(
		"HeroTitle",
		8,
		[
			paragraph("Build React pages", {
				align: "center",
				bold: true,
				fontSize: 56,
				color: COLORS.dark,
				lineHeight: "1.1",
				letterSpacing: "-1.5px",
			}),
			paragraph("without writing layout.", {
				align: "center",
				bold: true,
				fontSize: 56,
				color: COLORS.accent,
				lineHeight: "1.1",
				letterSpacing: "-1.5px",
			}),
		],
		{ marginLeft: 2, marginTop: 6 },
	),
	box(
		"HeroSubtitle",
		6,
		[
			paragraph(
				"A visual page builder powered by a grid, breakpoints and your own components. Save the result as plain JSON and render it anywhere.",
				{
					align: "center",
					fontSize: 18,
					color: COLORS.muted,
					lineHeight: "1.7",
				},
			),
		],
		{ marginLeft: 3, marginTop: 2 },
	),
	column(
		"HeroButtons",
		12,
		[
			button("HeroCta", 3, "Start building", { marginLeft: 2 }),
			button("HeroDocs", 3, "Read the docs", {
				marginLeft: 2,
				backgroundColor: COLORS.accentSoft,
				color: COLORS.accent,
				href: "https://github.com/sasza2/react-web-builder#readme",
			}),
		],
		{ marginTop: 3 },
	),
	image("HeroImage", 10, HERO_IMAGE, { marginLeft: 1, marginTop: 5 }),
	// features
	box(
		"FeaturesTitle",
		8,
		[
			paragraph("Everything a page editor needs", {
				align: "center",
				bold: true,
				fontSize: 34,
				color: COLORS.dark,
				letterSpacing: "-0.8px",
			}),
		],
		{ marginLeft: 2, marginTop: 8 },
	),
	column(
		"FeaturesRow",
		12,
		[
			featureCard("D", 3, 0),
			featureCard("D", 4, 1, { marginLeft: 1 }),
			featureCard("D", 3, 2, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// stats
	column(
		"StatsRow",
		12,
		[
			box("Stat1", 4, [
				paragraph("100%", {
					align: "center",
					bold: true,
					fontSize: 40,
					color: COLORS.accent,
				}),
				paragraph("TypeScript", {
					align: "center",
					fontSize: 15,
					color: COLORS.muted,
				}),
			]),
			box("Stat2", 4, [
				paragraph("2", {
					align: "center",
					bold: true,
					fontSize: 40,
					color: COLORS.accent,
				}),
				paragraph("breakpoints in the starter", {
					align: "center",
					fontSize: 15,
					color: COLORS.muted,
				}),
			]),
			box("Stat3", 4, [
				paragraph("0", {
					align: "center",
					bold: true,
					fontSize: 40,
					color: COLORS.accent,
				}),
				paragraph("lines of CSS to write", {
					align: "center",
					fontSize: 15,
					color: COLORS.muted,
				}),
			]),
		],
		{ marginTop: 7 },
	),
	// cta banner
	box(
		"CtaBanner",
		10,
		[
			paragraph("Ready for your first page?", {
				align: "center",
				bold: true,
				fontSize: 32,
				color: COLORS.white,
				letterSpacing: "-0.5px",
			}),
			paragraph("", { fontSize: 8 }),
			paragraph("npm install react-web-builder", {
				align: "center",
				fontSize: 18,
				color: "#c7d2fe",
			}),
		],
		{
			marginLeft: 1,
			marginTop: 8,
			backgroundColor: COLORS.dark,
			padding: padding({ top: 48, right: 40, bottom: 48, left: 40 }),
			border: { radius: 24 },
			boxShadow: "0px 20px 50px rgba(15, 23, 42, 0.25)",
		},
	),
	line("FooterLine", 10, { marginLeft: 1, marginTop: 6 }),
	box(
		"Footer",
		10,
		[
			paragraph("© 2026 react-web-builder · MIT License", {
				align: "center",
				fontSize: 14,
				color: COLORS.muted,
			}),
		],
		{ marginLeft: 1, marginTop: 2, marginBottom: 2 },
	),
]);

const templateMobile: Tree = row("landing-mobile", 4, [
	box(
		"MNavLogo",
		4,
		[
			paragraph("react-web-builder", {
				bold: true,
				fontSize: 18,
				color: COLORS.dark,
			}),
		],
		{ marginTop: 2 },
	),
	box(
		"MHeroTitle",
		4,
		[
			paragraph("Build React pages", {
				bold: true,
				fontSize: 34,
				color: COLORS.dark,
				lineHeight: "1.15",
				letterSpacing: "-1px",
			}),
			paragraph("without writing layout.", {
				bold: true,
				fontSize: 34,
				color: COLORS.accent,
				lineHeight: "1.15",
				letterSpacing: "-1px",
			}),
		],
		{ marginTop: 4 },
	),
	box(
		"MHeroSubtitle",
		4,
		[
			paragraph(
				"A visual page builder powered by a grid, breakpoints and your own components.",
				{ fontSize: 16, color: COLORS.muted, lineHeight: "1.7" },
			),
		],
		{ marginTop: 2 },
	),
	button("MHeroCta", 4, "Start building", { marginTop: 3 }),
	button("MHeroDocs", 4, "Read the docs", {
		marginTop: 1,
		backgroundColor: COLORS.accentSoft,
		color: COLORS.accent,
		href: "https://github.com/sasza2/react-web-builder#readme",
	}),
	image("MHeroImage", 4, HERO_IMAGE, { marginTop: 4 }),
	box(
		"MFeaturesTitle",
		4,
		[
			paragraph("Everything a page editor needs", {
				bold: true,
				fontSize: 26,
				color: COLORS.dark,
				lineHeight: "1.25",
			}),
		],
		{ marginTop: 6 },
	),
	featureCard("M", 4, 0, { marginTop: 3 }),
	featureCard("M", 4, 1, { marginTop: 2 }),
	featureCard("M", 4, 2, { marginTop: 2 }),
	box(
		"MCtaBanner",
		4,
		[
			paragraph("Ready for your first page?", {
				align: "center",
				bold: true,
				fontSize: 24,
				color: COLORS.white,
			}),
			paragraph("", { fontSize: 8 }),
			paragraph("npm install react-web-builder", {
				align: "center",
				fontSize: 15,
				color: "#c7d2fe",
			}),
		],
		{
			marginTop: 6,
			backgroundColor: COLORS.dark,
			padding: padding({ top: 32, right: 20, bottom: 32, left: 20 }),
			border: { radius: 20 },
		},
	),
	line("MFooterLine", 4, { marginTop: 5 }),
	box(
		"MFooter",
		4,
		[
			paragraph("© 2026 react-web-builder · MIT License", {
				align: "center",
				fontSize: 13,
				color: COLORS.muted,
			}),
		],
		{ marginTop: 2, marginBottom: 2 },
	),
]);

const template = {
	fontFamily: "roboto",
	breakpoints: [
		{
			id: createUniqueId(),
			from: 360,
			to: null,
			cols: 4,
			rowHeight: 15,
			backgroundColor: COLORS.page,
			padding: {
				top: 15,
				left: 20,
				right: 20,
				bottom: 15,
			},
			template: templateMobile,
		},
		{
			id: createUniqueId(),
			from: 1280,
			to: null,
			cols: 12,
			rowHeight: 15,
			backgroundColor: COLORS.page,
			padding: {
				top: 15,
				left: 30,
				right: 30,
				bottom: 15,
			},
			template: templateDesktop,
		},
	],
} as Page;

export function LandingPage() {
	const [page] = useState<Page>(() => {
		const pageFromLocalStorage = JSON.parse(
			localStorage.getItem("landing-page-draft"),
		) as Page;
		if (pageFromLocalStorage) return pageFromLocalStorage;
		return template;
	});

	const onPublish = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem(
					"landing-page-published",
					JSON.stringify(nextPage),
				);
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onSaveAsDraft = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem("landing-page-draft", JSON.stringify(nextPage));
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onTemplateRestart = (): Page | null => template;

	return (
		<WebBuilder
			page={page}
			onPublish={onPublish}
			onSaveAsDraft={onSaveAsDraft}
			onTemplateRestart={onTemplateRestart}
			components={[]}
			fonts={fonts}
		/>
	);
}

const meta = {
	component: LandingPage,
	parameters: {
		layout: "fullscreen",
		options: { showPanel: false },
	},
	title: "WebBuilder/Templates/LandingPage",
};

export default meta;
