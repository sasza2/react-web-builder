import React, { useState } from "react";
import type {
	FontImport,
	ImageURL,
	Page,
	Tree,
	WebBuilderComponent,
} from "types";

import { createUniqueId } from "@/utils/createUniqueId";

import WebBuilder from "../WebBuilder";
import {
	box,
	column,
	type NodeOptions,
	node,
	padding,
	paragraph,
	row,
} from "./treeBuilders";

// A one dog kennel page in the style of mangopembroke.pl: a Welsh Corgi
// Pembroke stud dog with titles, health results, pedigree, activities
// and contact details.
//
// The page needs a few things the built in elements cannot express (chips,
// an ornamental photo frame, a pedigree list, activity tiles), so this story
// ships its own components and passes them to the builder.

const SERIF = '"Cormorant Garamond", "Times New Roman", Georgia, serif';
const SANS = '"Inter", -apple-system, "Segoe UI", Roboto, sans-serif';

const COLORS = {
	bg: "#faf7f2",
	bgSoft: "#f3ede2",
	bgCard: "#ffffff",
	text: "#5b4f42",
	textHeading: "#2a221a",
	textMuted: "#6b5c4d",
	textInverse: "#f7f1e6",
	border: "#e6dcc9",
	borderSoft: "#efe7d6",
	accent: "#b8784a",
	accentDeep: "#7d4e2c",
	accentSoft: "#f0dcc6",
};

const SHADOW_MD =
	"0 4px 14px rgba(60, 40, 20, 0.06), 0 12px 28px rgba(60, 40, 20, 0.06)";

const corgiFonts: FontImport[] = [
	{
		label: "Inter",
		value: "inter",
		fontFamily: SANS,
		stylesheet: (
			<>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&display=swap"
					rel="stylesheet"
				/>
			</>
		),
	},
	{
		label: "Cormorant Garamond",
		value: "cormorant",
		fontFamily: SERIF,
		stylesheet: (
			<link
				href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
				rel="stylesheet"
			/>
		),
	},
];

// ---------------------------------------------------------------------------
// components
// ---------------------------------------------------------------------------

const CorgiGroup = { id: "corgi", label: "Corgi" };

const eyebrowStyle: React.CSSProperties = {
	fontFamily: SANS,
	fontSize: 12,
	fontWeight: 500,
	letterSpacing: "0.18em",
	textTransform: "uppercase",
	color: COLORS.accentDeep,
	marginBottom: 12,
};

type BrandProps = {
	logo?: ImageURL;
	name?: string;
	sub?: string;
};

function Brand({ logo, name, sub }: BrandProps) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
			<div
				style={{
					width: 42,
					height: 42,
					borderRadius: "50%",
					display: "grid",
					placeItems: "center",
					overflow: "hidden",
					color: "#fff",
					fontFamily: SERIF,
					fontSize: 24,
					background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDeep} 100%)`,
					boxShadow: "0 4px 14px rgba(184, 120, 74, 0.35)",
				}}
			>
				{logo?.location ? (
					<img
						alt={name}
						src={logo.location}
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
					/>
				) : (
					name?.slice(0, 1)
				)}
			</div>
			<div
				style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}
			>
				<span
					style={{
						fontFamily: SERIF,
						fontSize: 23,
						color: COLORS.textHeading,
						letterSpacing: "-0.01em",
					}}
				>
					{name}
				</span>
				<span
					style={{
						fontFamily: SANS,
						fontSize: 11,
						letterSpacing: "0.16em",
						textTransform: "uppercase",
						color: COLORS.textMuted,
						marginTop: 2,
					}}
				>
					{sub}
				</span>
			</div>
		</div>
	);
}

type NavProps = {
	activeItem?: string;
	items?: string;
};

function Nav({ activeItem, items }: NavProps) {
	const links = (items || "").split(",").map((item) => item.trim());

	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				gap: 4,
				justifyContent: "flex-end",
				alignItems: "center",
				height: "100%",
			}}
		>
			{links.map((link) => {
				const isActive = link === activeItem;
				return (
					<span
						key={link}
						style={{
							fontFamily: SANS,
							fontSize: 14,
							padding: "8px 14px",
							borderRadius: 999,
							color: isActive ? COLORS.textInverse : COLORS.text,
							background: isActive ? COLORS.textHeading : "transparent",
						}}
					>
						{link}
					</span>
				);
			})}
		</div>
	);
}

type HeadingProps = {
	align?: string;
	eyebrow?: string;
	size?: number;
	title?: string;
};

function Heading({ align, eyebrow, size, title }: HeadingProps) {
	return (
		<div
			style={{
				textAlign: (align || "left") as React.CSSProperties["textAlign"],
			}}
		>
			{eyebrow && <div style={eyebrowStyle}>{eyebrow}</div>}
			<div
				style={{
					fontFamily: SERIF,
					fontWeight: 500,
					fontSize: size || 38,
					lineHeight: 1.15,
					letterSpacing: "-0.01em",
					color: COLORS.textHeading,
				}}
			>
				{title}
			</div>
		</div>
	);
}

type HeroTitleProps = {
	eyebrow?: string;
	subtitle?: string;
	title?: string;
};

function HeroTitle({ eyebrow, subtitle, title }: HeroTitleProps) {
	return (
		<div>
			{eyebrow && <div style={eyebrowStyle}>{eyebrow}</div>}
			<h1
				style={{
					fontFamily: SERIF,
					fontWeight: 500,
					fontSize: 58,
					lineHeight: 1.05,
					letterSpacing: "-0.02em",
					color: COLORS.textHeading,
					margin: "8px 0 0",
				}}
			>
				{title}
				<span
					style={{
						display: "block",
						fontSize: "0.6em",
						fontStyle: "italic",
						fontWeight: 400,
						letterSpacing: "0.04em",
						color: COLORS.textMuted,
					}}
				>
					{subtitle}
				</span>
			</h1>
			<span
				style={{
					display: "block",
					width: 80,
					height: 1,
					margin: "16px 0",
					background: COLORS.accent,
				}}
			/>
		</div>
	);
}

type Chip = {
	highlighted?: boolean;
	label?: string;
	value?: string;
};

type ChipsProps = {
	chips?: Chip[];
};

function Chips({ chips }: ChipsProps) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
			{(chips || []).map((chip) => (
				<span
					key={`${chip.label}${chip.value}`}
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						padding: "8px 14px",
						borderRadius: 999,
						fontFamily: SANS,
						fontSize: 13,
						color: COLORS.textHeading,
						background: chip.highlighted ? COLORS.accentSoft : COLORS.bgCard,
						border: `1px solid ${
							chip.highlighted ? "transparent" : COLORS.border
						}`,
					}}
				>
					{chip.label}
					{chip.value && (
						<strong style={{ color: COLORS.accentDeep, fontWeight: 600 }}>
							{chip.value}
						</strong>
					)}
				</span>
			))}
		</div>
	);
}

type PhotoFrameProps = {
	caption?: string;
	url?: ImageURL;
};

function PhotoFrame({ caption, url }: PhotoFrameProps) {
	return (
		<div>
			<div
				style={{
					position: "relative",
					width: "100%",
					aspectRatio: "4 / 5",
					borderRadius: 16,
					overflow: "hidden",
					border: `1px solid ${COLORS.border}`,
					boxShadow: SHADOW_MD,
					background:
						"radial-gradient(120% 80% at 20% 0, #f6e6d0 0%, transparent 50%)," +
						"radial-gradient(120% 80% at 80% 100%, #efd6b8 0%, transparent 50%)," +
						"linear-gradient(135deg, #f3e6d2 0%, #e8d3b4 100%)",
				}}
			>
				{url?.location && (
					<img
						alt={caption}
						src={url.location}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				)}
				<span
					style={{
						position: "absolute",
						inset: 12,
						borderRadius: 10,
						border: "1px solid rgba(184, 120, 74, 0.25)",
						pointerEvents: "none",
					}}
				/>
			</div>
			{caption && (
				<div
					style={{
						marginTop: 14,
						textAlign: "center",
						fontFamily: SANS,
						fontSize: 13,
						color: COLORS.textMuted,
					}}
				>
					{caption}
				</div>
			)}
		</div>
	);
}

type PedigreeRow = {
	label?: string;
	value?: string;
};

type PedigreeProps = {
	rows?: PedigreeRow[];
};

function Pedigree({ rows }: PedigreeProps) {
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			{(rows || []).map((pedigreeRow, index) => (
				<div
					key={pedigreeRow.label}
					style={{
						display: "grid",
						gridTemplateColumns: "160px 1fr",
						gap: 16,
						padding: "14px 0",
						borderBottom:
							index === rows.length - 1
								? "none"
								: `1px solid ${COLORS.borderSoft}`,
					}}
				>
					<span
						style={{
							fontFamily: SANS,
							fontSize: 12,
							letterSpacing: "0.16em",
							textTransform: "uppercase",
							color: COLORS.textMuted,
							paddingTop: 3,
						}}
					>
						{pedigreeRow.label}
					</span>
					<span
						style={{
							fontFamily: SERIF,
							fontStyle: "italic",
							fontSize: 20,
							color: COLORS.textHeading,
						}}
					>
						{pedigreeRow.value}
					</span>
				</div>
			))}
		</div>
	);
}

type CheckListItem = {
	text?: string;
};

type CheckListProps = {
	items?: CheckListItem[];
	note?: string;
};

function CheckList({ items, note }: CheckListProps) {
	return (
		<div>
			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				{(items || []).map((item) => (
					<div
						key={item.text}
						style={{
							position: "relative",
							paddingLeft: 26,
							fontFamily: SANS,
							fontSize: 16,
							color: COLORS.textHeading,
						}}
					>
						<span
							style={{
								position: "absolute",
								top: 9,
								left: 0,
								width: 14,
								height: 8,
								borderLeft: `1.5px solid ${COLORS.accent}`,
								borderBottom: `1.5px solid ${COLORS.accent}`,
								transform: "rotate(-45deg)",
							}}
						/>
						{item.text}
					</div>
				))}
			</div>
			{note && (
				<div
					style={{
						marginTop: 16,
						fontFamily: SANS,
						fontSize: 15,
						fontStyle: "italic",
						color: COLORS.textMuted,
					}}
				>
					{note}
				</div>
			)}
		</div>
	);
}

type TileProps = {
	description?: string;
	title?: string;
};

function Tile({ description, title }: TileProps) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: "auto 1fr auto",
				gap: 8,
				height: "100%",
				padding: "28px 26px 24px",
				borderRadius: 18,
				background: COLORS.bgCard,
				border: `1px solid ${COLORS.border}`,
			}}
		>
			<div
				style={{ fontFamily: SERIF, fontSize: 26, color: COLORS.textHeading }}
			>
				{title}
			</div>
			<div style={{ fontFamily: SANS, fontSize: 15, color: COLORS.textMuted }}>
				{description}
			</div>
			<div
				style={{ justifySelf: "end", fontSize: 19, color: COLORS.accentDeep }}
			>
				→
			</div>
		</div>
	);
}

function Divider() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: 12,
				padding: "24px 0",
			}}
		>
			<span style={{ width: 60, height: 1, background: COLORS.border }} />
			<span
				style={{
					width: 8,
					height: 8,
					borderRadius: "50%",
					background: COLORS.accent,
				}}
			/>
			<span style={{ width: 60, height: 1, background: COLORS.border }} />
		</div>
	);
}

type PanelProps = {
	height?: number;
};

// An empty rounded panel to sit behind a section, the way `.section.panel`
// does on the original page.
function Panel({ height }: PanelProps) {
	return (
		<div
			style={{
				height: height || 400,
				borderRadius: 24,
				background: COLORS.bgSoft,
				border: `1px solid ${COLORS.borderSoft}`,
			}}
		/>
	);
}

type FooterProps = {
	copyright?: string;
	instagram?: string;
	location?: string;
	name?: string;
	phone?: string;
	sub?: string;
};

function Footer({
	copyright,
	instagram,
	location,
	name,
	phone,
	sub,
}: FooterProps) {
	return (
		<div
			style={{
				background: COLORS.bgSoft,
				borderTop: `1px solid ${COLORS.borderSoft}`,
				borderRadius: 20,
				padding: "40px 32px 24px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 24,
				}}
			>
				<div>
					<div
						style={{
							fontFamily: SERIF,
							fontSize: 26,
							color: COLORS.textHeading,
						}}
					>
						{name}
					</div>
					<div
						style={{
							fontFamily: SANS,
							fontSize: 12,
							letterSpacing: "0.16em",
							textTransform: "uppercase",
							color: COLORS.textMuted,
							marginTop: 4,
						}}
					>
						{sub}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: 6,
						fontFamily: SANS,
						fontSize: 15,
						color: COLORS.accentDeep,
					}}
				>
					<span>{phone}</span>
					<span>{instagram}</span>
					<span style={{ color: COLORS.textMuted, fontSize: 14 }}>
						{location}
					</span>
				</div>
			</div>
			<div
				style={{
					marginTop: 24,
					textAlign: "center",
					fontFamily: SANS,
					fontSize: 12,
					letterSpacing: "0.04em",
					color: COLORS.textMuted,
				}}
			>
				{copyright}
			</div>
		</div>
	);
}

const components: WebBuilderComponent[] = [
	{
		id: "CorgiBrand",
		label: "Brand",
		component: Brand,
		group: CorgiGroup,
		props: [
			{ id: "name", label: "Name", type: "text", defaultValue: "Mango" },
			{ id: "sub", label: "Subtitle", type: "text", defaultValue: "" },
			{
				id: "logo",
				label: "Logo",
				type: "img",
				defaultValue: { location: "" },
			},
		],
	},
	{
		id: "CorgiNav",
		label: "Navigation",
		component: Nav,
		group: CorgiGroup,
		props: [
			{
				id: "items",
				label: "Items (comma separated)",
				type: "text",
				defaultValue: "Home, Exhibitions",
			},
			{ id: "activeItem", label: "Active item", type: "text" },
		],
	},
	{
		id: "CorgiHeroTitle",
		label: "Hero title",
		component: HeroTitle,
		group: CorgiGroup,
		props: [
			{ id: "eyebrow", label: "Eyebrow", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "subtitle", label: "Subtitle", type: "text" },
		],
	},
	{
		id: "CorgiHeading",
		label: "Heading",
		component: Heading,
		group: CorgiGroup,
		props: [
			{ id: "eyebrow", label: "Eyebrow", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{
				id: "align",
				label: "Align",
				type: "select",
				options: [
					{ label: "Left", value: "left" },
					{ label: "Center", value: "center" },
				],
				defaultValue: "left",
			},
			{
				id: "size",
				label: "Font size",
				type: "number",
				defaultValue: 38,
				min: 16,
				max: 72,
			},
		],
	},
	{
		id: "CorgiChips",
		label: "Chips",
		component: Chips,
		group: CorgiGroup,
		props: [
			{
				id: "chips",
				label: "Chips",
				type: "array",
				of: {
					id: "chip",
					label: "Chip",
					type: "object",
					of: [
						{ id: "label", label: "Label", type: "text" },
						{ id: "value", label: "Value", type: "text" },
						{ id: "highlighted", label: "Highlighted", type: "toggle" },
					],
				},
			},
		],
	},
	{
		id: "CorgiPhotoFrame",
		label: "Photo frame",
		component: PhotoFrame,
		group: CorgiGroup,
		props: [
			{ id: "url", label: "Photo", type: "img" },
			{ id: "caption", label: "Caption", type: "text" },
		],
	},
	{
		id: "CorgiPedigree",
		label: "Pedigree",
		component: Pedigree,
		group: CorgiGroup,
		props: [
			{
				id: "rows",
				label: "Rows",
				type: "array",
				of: {
					id: "pedigreeRow",
					label: "Row",
					type: "object",
					of: [
						{ id: "label", label: "Label", type: "text" },
						{ id: "value", label: "Value", type: "text" },
					],
				},
			},
		],
	},
	{
		id: "CorgiCheckList",
		label: "Check list",
		component: CheckList,
		group: CorgiGroup,
		props: [
			{
				id: "items",
				label: "Items",
				type: "array",
				of: {
					id: "item",
					label: "Item",
					type: "object",
					of: [{ id: "text", label: "Text", type: "text" }],
				},
			},
			{ id: "note", label: "Note", type: "text" },
		],
	},
	{
		id: "CorgiTile",
		label: "Tile",
		component: Tile,
		group: CorgiGroup,
		props: [
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "CorgiDivider",
		label: "Divider",
		component: Divider,
		group: CorgiGroup,
		props: [],
	},
	{
		id: "CorgiPanel",
		label: "Panel",
		component: Panel,
		group: CorgiGroup,
		props: [
			{
				id: "height",
				label: "Height",
				type: "number",
				defaultValue: 400,
				min: 40,
				max: 1200,
			},
		],
	},
	{
		id: "CorgiFooter",
		label: "Footer",
		component: Footer,
		group: CorgiGroup,
		props: [
			{ id: "name", label: "Name", type: "text" },
			{ id: "sub", label: "Subtitle", type: "text" },
			{ id: "phone", label: "Phone", type: "text" },
			{ id: "instagram", label: "Instagram", type: "text" },
			{ id: "location", label: "Location", type: "text" },
			{ id: "copyright", label: "Copyright", type: "text" },
		],
	},
];

// ---------------------------------------------------------------------------
// content
// ---------------------------------------------------------------------------

const DOG_NAME = "Mango";
const DOG_FULL_NAME = "Aidan Listopadowa Kraina";
const PHOTO = "https://mangopembroke.pl/mango-corgi-reproduktor.webp";
const LOGO = "https://mangopembroke.pl/logo.webp";
const NAV_ITEMS =
	"Home, Exhibitions, Frisbee, Nosework, Fitness, Collaboration";

const chips = [
	{ label: "Youth Champion of Poland" },
	{ label: "Champion of Poland" },
	{ label: "HD", value: "A", highlighted: true },
	{ label: "ED", value: "0/0", highlighted: true },
	{ label: "Tail", value: "long", highlighted: true },
	{ label: "Correct cardiac tests", highlighted: true },
];

const pedigreeRows = [
	{ label: "Sire", value: "LEARNING TO LIVE Dellbenq (FCI)" },
	{ label: "Dam", value: "GINERWA Zakątek Fauna (FCI)" },
	{ label: "Kennel", value: "Listopadowa Kraina (FCI)" },
	{ label: "Date of birth", value: "7 June 2024" },
	{ label: "Colour", value: "red and white" },
];

const healthItems = [
	{ text: "Youth Champion of Poland (JCh.PL)" },
	{ text: "Champion of Poland (Ch.PL)" },
	{ text: "Hip dysplasia examination — HD A" },
	{ text: "Elbow dysplasia examination — ED 0/0" },
	{ text: "Full vaccinations, regular preventive care" },
	{ text: "Correct cardiac tests" },
];

const HEALTH_NOTE =
	"Full results, show ratings and copies of the documents are shared with " +
	"interested owners of bitches after getting in touch.";

const tiles = [
	{ title: "Exhibitions", description: "The ring, titles and presence." },
	{ title: "Fitness", description: "Condition, body control, proprioception." },
	{ title: "Frisbee", description: "Speed, precision and the joy of work." },
	{ title: "Nosework", description: "Scent work and concentration." },
	{
		title: "Collaboration",
		description: "Stud service and the brands we work with.",
	},
];

const ABOUT_TEXT =
	`${DOG_NAME} is a sporting Welsh Corgi Pembroke stud dog from the ` +
	"Listopadowa Kraina (FCI) kennel. Day to day he is physically active — " +
	"he trains fitness, frisbee, nosework and sheep herding.";

const ABOUT_TEXT_2 =
	"Regular effort and work with the dog translate into condition, focus and " +
	"a stable character, which shows both in the ring and outside of it.";

const HERO_TAGLINE =
	`In February 2026 ${DOG_NAME} earned his stud dog licence, confirmed by an ` +
	"entry in his pedigree. Registered with ZKwP Kraków.";

// ---------------------------------------------------------------------------
// template
// ---------------------------------------------------------------------------

const brand = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"CorgiBrand",
		[
			{ propId: "name", value: DOG_NAME },
			{ propId: "sub", value: `${DOG_FULL_NAME} · FCI` },
			{ propId: "logo", value: { location: LOGO } },
		],
		options,
	);

const nav = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"CorgiNav",
		[
			{ propId: "items", value: NAV_ITEMS },
			{ propId: "activeItem", value: "Home" },
		],
		options,
	);

const heroTitle = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"CorgiHeroTitle",
		[
			{ propId: "eyebrow", value: "Welsh Corgi Pembroke · Stud dog" },
			{ propId: "title", value: DOG_FULL_NAME },
			{ propId: "subtitle", value: "FCI" },
		],
		options,
	);

const heading = (
	id: string,
	w: number,
	eyebrow: string,
	title: string,
	options: NodeOptions & { align?: string; size?: number } = {},
): Tree =>
	node(
		id,
		w,
		"CorgiHeading",
		[
			{ propId: "eyebrow", value: eyebrow },
			{ propId: "title", value: title },
			{ propId: "align", value: options.align ?? "left" },
			{ propId: "size", value: options.size ?? 38 },
		],
		options,
	);

const photoFrame = (
	id: string,
	w: number,
	options: NodeOptions & { caption?: string } = {},
): Tree =>
	node(
		id,
		w,
		"CorgiPhotoFrame",
		[
			{ propId: "url", value: { location: PHOTO } },
			{ propId: "caption", value: options.caption ?? "" },
		],
		options,
	);

const tile = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Tile${idSuffix}${index}`,
		w,
		"CorgiTile",
		[
			{ propId: "title", value: tiles[index].title },
			{ propId: "description", value: tiles[index].description },
		],
		options,
	);

const footer = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"CorgiFooter",
		[
			{ propId: "name", value: DOG_NAME },
			{ propId: "sub", value: `${DOG_FULL_NAME} (FCI)` },
			{ propId: "phone", value: "519 758 793" },
			{ propId: "instagram", value: "Instagram · @mango_pembroke" },
			{ propId: "location", value: "Kraków, Poland" },
			{
				propId: "copyright",
				value: `© 2026 ${DOG_NAME}. All rights reserved.`,
			},
		],
		options,
	);

const prose = (
	id: string,
	w: number,
	texts: string[],
	options: NodeOptions = {},
): Tree =>
	box(
		id,
		w,
		texts.flatMap((text, index) => [
			...(index === 0 ? [] : [paragraph("", { fontSize: 8 })]),
			paragraph(text, {
				fontSize: 17,
				color: COLORS.text,
				lineHeight: "1.7",
			}),
		]),
		options,
	);

const ctaButton = (
	id: string,
	w: number,
	label: string,
	options: NodeOptions & { ghost?: boolean; href?: string } = {},
): Tree =>
	node(
		id,
		w,
		"CustomButton",
		[
			{
				propId: "src",
				value: {
					location: options.href ?? "https://mangopembroke.pl",
					openInNewTab: true,
				},
			},
			{
				propId: "content",
				value: [
					paragraph(label, {
						align: "center",
						fontSize: 15,
						color: options.ghost ? COLORS.textHeading : COLORS.textInverse,
					}),
				],
			},
			{
				propId: "color",
				value: options.ghost ? COLORS.textHeading : COLORS.textInverse,
			},
			{
				propId: "backgroundColor",
				value: options.ghost ? "transparent" : COLORS.textHeading,
			},
			{ propId: "padding", value: padding({ top: 14, bottom: 14 }) },
			{
				propId: "border",
				value: {
					top: 1,
					right: 1,
					bottom: 1,
					left: 1,
					radius: 999,
					color: COLORS.textHeading,
				},
			},
			{ propId: "boxShadow", value: "" },
		],
		options,
	);

const divider = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(id, w, "CorgiDivider", [], options);

const templateDesktop: Tree = row("corgi-desktop", 24, [
	// header
	column("HeaderRow", 24, [brand("Brand", 8), nav("Nav", 16)], {
		marginTop: 2,
	}),
	// hero
	column(
		"HeroRow",
		24,
		[
			row("HeroText", 13, [
				heroTitle("HeroTitle", 13),
				box(
					"HeroTagline",
					12,
					[
						paragraph(HERO_TAGLINE, {
							fontSize: 18,
							color: COLORS.text,
							lineHeight: "1.7",
						}),
					],
					{ marginTop: 1 },
				),
				node(
					"HeroChips",
					13,
					"CorgiChips",
					[{ propId: "chips", value: chips }],
					{ marginTop: 2 },
				),
				column(
					"HeroButtons",
					13,
					[
						ctaButton("HeroCta", 6, "Stud & collaboration", {
							href: "https://instagram.com/mango_pembroke",
						}),
						ctaButton("HeroCtaGhost", 6, "See achievements", {
							ghost: true,
							marginLeft: 1,
						}),
					],
					{ marginTop: 3 },
				),
			]),
			photoFrame("HeroPhoto", 10, {
				marginLeft: 1,
				caption: "7 June 2024 · red and white · Kraków, Poland",
			}),
		],
		{ marginTop: 4 },
	),
	divider("Divider1", 24, { marginTop: 4 }),
	// about
	column(
		"AboutRow",
		24,
		[
			heading(
				"AboutHeading",
				10,
				"About the dog",
				"A dog for the ring, for work and for life",
			),
			prose("AboutText", 13, [ABOUT_TEXT, ABOUT_TEXT_2], { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// pedigree
	heading("PedigreeHeading", 24, "Origin", "Pedigree", { marginTop: 6 }),
	node(
		"Pedigree",
		18,
		"CorgiPedigree",
		[{ propId: "rows", value: pedigreeRows }],
		{ marginTop: 2, marginLeft: 3 },
	),
	// health and titles
	heading("HealthHeading", 24, "Documentation", "Health and titles", {
		marginTop: 6,
	}),
	column(
		"HealthRow",
		24,
		[
			node(
				"HealthList",
				13,
				"CorgiCheckList",
				[
					{ propId: "items", value: healthItems },
					{ propId: "note", value: HEALTH_NOTE },
				],
				{},
			),
			photoFrame("HealthPhoto", 10, { marginLeft: 1 }),
		],
		{ marginTop: 3 },
	),
	// activities
	heading("TilesHeading", 24, "Activities", "A versatile dog at work", {
		marginTop: 6,
		align: "center",
	}),
	column(
		"TilesRow1",
		24,
		[
			tile("D", 7, 0),
			tile("D", 8, 1, { marginLeft: 1 }),
			tile("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 3 },
	),
	column(
		"TilesRow2",
		24,
		[tile("D", 7, 3, { marginLeft: 4 }), tile("D", 7, 4, { marginLeft: 2 })],
		{ marginTop: 1 },
	),
	divider("Divider2", 24, { marginTop: 4 }),
	// footer
	footer("Footer", 24, { marginTop: 2, marginBottom: 2 }),
]);

const templateMobile: Tree = row("corgi-mobile", 8, [
	brand("MBrand", 8, { marginTop: 2 }),
	nav("MNav", 8, { marginTop: 1 }),
	heroTitle("MHeroTitle", 8, { marginTop: 3 }),
	box(
		"MHeroTagline",
		8,
		[
			paragraph(HERO_TAGLINE, {
				fontSize: 16,
				color: COLORS.text,
				lineHeight: "1.7",
			}),
		],
		{ marginTop: 1 },
	),
	node("MHeroChips", 8, "CorgiChips", [{ propId: "chips", value: chips }], {
		marginTop: 2,
	}),
	ctaButton("MHeroCta", 8, "Stud & collaboration", {
		marginTop: 3,
		href: "https://instagram.com/mango_pembroke",
	}),
	ctaButton("MHeroCtaGhost", 8, "See achievements", {
		marginTop: 1,
		ghost: true,
	}),
	photoFrame("MHeroPhoto", 8, {
		marginTop: 3,
		caption: "7 June 2024 · red and white · Kraków, Poland",
	}),
	divider("MDivider1", 8, { marginTop: 3 }),
	heading(
		"MAboutHeading",
		8,
		"About the dog",
		"A dog for the ring, for work and for life",
		{ size: 30 },
	),
	prose("MAboutText", 8, [ABOUT_TEXT, ABOUT_TEXT_2], { marginTop: 2 }),
	heading("MPedigreeHeading", 8, "Origin", "Pedigree", {
		marginTop: 5,
		size: 30,
	}),
	node(
		"MPedigree",
		8,
		"CorgiPedigree",
		[{ propId: "rows", value: pedigreeRows }],
		{
			marginTop: 2,
		},
	),
	heading("MHealthHeading", 8, "Documentation", "Health and titles", {
		marginTop: 5,
		size: 30,
	}),
	node(
		"MHealthList",
		8,
		"CorgiCheckList",
		[
			{ propId: "items", value: healthItems },
			{ propId: "note", value: HEALTH_NOTE },
		],
		{ marginTop: 2 },
	),
	heading("MTilesHeading", 8, "Activities", "A versatile dog at work", {
		marginTop: 5,
		align: "center",
		size: 30,
	}),
	tile("M", 8, 0, { marginTop: 2 }),
	tile("M", 8, 1, { marginTop: 1 }),
	tile("M", 8, 2, { marginTop: 1 }),
	tile("M", 8, 3, { marginTop: 1 }),
	tile("M", 8, 4, { marginTop: 1 }),
	divider("MDivider2", 8, { marginTop: 3 }),
	footer("MFooter", 8, { marginTop: 2, marginBottom: 2 }),
]);

const template = {
	fontFamily: "inter",
	backgroundColor: COLORS.bg,
	breakpoints: [
		{
			id: createUniqueId(),
			from: 360,
			to: null,
			cols: 8,
			rowHeight: 15,
			backgroundColor: COLORS.bg,
			padding: {
				top: 24,
				left: 24,
				right: 24,
				bottom: 24,
			},
			template: templateMobile,
		},
		{
			id: createUniqueId(),
			from: 1280,
			to: null,
			cols: 24,
			rowHeight: 15,
			backgroundColor: COLORS.bg,
			padding: {
				top: 24,
				left: 80,
				right: 80,
				bottom: 32,
			},
			template: templateDesktop,
		},
	],
} as Page;

export function Corgi() {
	const [page] = useState<Page>(() => {
		const pageFromLocalStorage = JSON.parse(
			localStorage.getItem("corgi-page-draft"),
		) as Page;
		if (pageFromLocalStorage) return pageFromLocalStorage;
		return template;
	});

	const onPublish = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem("corgi-page-published", JSON.stringify(nextPage));
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onSaveAsDraft = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem("corgi-page-draft", JSON.stringify(nextPage));
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
			components={components}
			fonts={corgiFonts}
		/>
	);
}

const meta = {
	component: Corgi,
	parameters: {
		layout: "fullscreen",
		options: { showPanel: false },
	},
	title: "WebBuilder/Templates/Corgi",
};

export default meta;
