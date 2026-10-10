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
	column,
	type NodeOptions,
	node,
	padding,
	paragraph,
	row,
} from "./treeBuilders";

// A product page for react-web-builder itself: hero, code samples, feature
// grid, built in elements, property types, API reference, use cases, FAQ
// and a call to action.
//
// Everything specific to a docs page (code blocks, terminal, API table,
// badge grid, browser frame) ships with this story as editable components.

const DISPLAY = '"Space Grotesk", "Inter", -apple-system, sans-serif';
const SANS = '"Inter", -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace';

const COLORS = {
	bg: "#080b14",
	bgCard: "#111726",
	bgCardSoft: "#161d2f",
	bgCode: "#0b1020",
	text: "#aab3c5",
	textHeading: "#f2f5fb",
	textMuted: "#79839a",
	border: "#222b3f",
	borderSoft: "#1a2133",
	accent: "#7c5cff",
	accentSoft: "#1c1740",
	cyan: "#22d3ee",
	green: "#34d399",
	amber: "#fbbf24",
	pink: "#f472b6",
};

const SHADOW = "0 18px 50px rgba(0, 0, 0, 0.45)";

const libraryFonts: FontImport[] = [
	{
		label: "Inter",
		value: "inter",
		fontFamily: SANS,
		stylesheet: (
			<>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap"
					rel="stylesheet"
				/>
			</>
		),
	},
	{
		label: "Space Grotesk",
		value: "space-grotesk",
		fontFamily: DISPLAY,
		stylesheet: (
			<link
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap"
				rel="stylesheet"
			/>
		),
	},
];

// ---------------------------------------------------------------------------
// components
// ---------------------------------------------------------------------------

const DocsGroup = { id: "docs", label: "Docs page" };

const eyebrowStyle: React.CSSProperties = {
	fontFamily: MONO,
	fontSize: 12,
	fontWeight: 500,
	letterSpacing: "0.16em",
	textTransform: "uppercase",
	color: COLORS.cyan,
	marginBottom: 12,
};

const cardStyle: React.CSSProperties = {
	background: COLORS.bgCard,
	border: `1px solid ${COLORS.border}`,
	borderRadius: 18,
};

// The html property type stores { value }, plain text properties store a
// string - accept both so the block keeps working whichever is used.
const readCode = (code?: { value?: string } | string) =>
	typeof code === "string" ? code : (code?.value ?? "");

type NavbarProps = {
	brand?: string;
	cta?: string;
	items?: string;
	stars?: string;
	version?: string;
};

function Navbar({ brand, cta, items, stars, version }: NavbarProps) {
	const links = (items || "").split(",").map((item) => item.trim());

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 20,
				height: "100%",
				padding: "14px 22px",
				borderRadius: 16,
				background: "rgba(17, 23, 38, 0.8)",
				border: `1px solid ${COLORS.border}`,
			}}
		>
			<span
				style={{
					fontFamily: MONO,
					fontWeight: 500,
					fontSize: 16,
					color: COLORS.textHeading,
					whiteSpace: "nowrap",
				}}
			>
				{brand}
			</span>
			{version && (
				<span
					style={{
						fontFamily: MONO,
						fontSize: 12,
						color: COLORS.cyan,
						background: "rgba(34, 211, 238, 0.1)",
						border: "1px solid rgba(34, 211, 238, 0.25)",
						padding: "4px 10px",
						borderRadius: 999,
						whiteSpace: "nowrap",
					}}
				>
					{version}
				</span>
			)}
			<div
				style={{ display: "flex", flexWrap: "wrap", gap: 4, marginLeft: 10 }}
			>
				{links.map((link) => (
					<span
						key={link}
						style={{
							fontFamily: SANS,
							fontSize: 14,
							color: COLORS.text,
							padding: "8px 12px",
							borderRadius: 8,
						}}
					>
						{link}
					</span>
				))}
			</div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					marginLeft: "auto",
				}}
			>
				{stars && (
					<span
						style={{
							fontFamily: SANS,
							fontSize: 13,
							color: COLORS.text,
							border: `1px solid ${COLORS.border}`,
							padding: "8px 14px",
							borderRadius: 999,
							whiteSpace: "nowrap",
						}}
					>
						★ {stars}
					</span>
				)}
				{cta && (
					<span
						style={{
							fontFamily: SANS,
							fontSize: 14,
							fontWeight: 600,
							color: "#fff",
							background: COLORS.accent,
							padding: "10px 18px",
							borderRadius: 10,
							whiteSpace: "nowrap",
						}}
					>
						{cta}
					</span>
				)}
			</div>
		</div>
	);
}

type HeroProps = {
	badge?: string;
	highlight?: string;
	tagline?: string;
	title?: string;
};

function Hero({ badge, highlight, tagline, title }: HeroProps) {
	return (
		<div style={{ textAlign: "center" }}>
			{badge && (
				<span
					style={{
						display: "inline-block",
						fontFamily: MONO,
						fontSize: 13,
						color: COLORS.cyan,
						background: "rgba(34, 211, 238, 0.08)",
						border: "1px solid rgba(34, 211, 238, 0.2)",
						padding: "8px 16px",
						borderRadius: 999,
						marginBottom: 26,
					}}
				>
					{badge}
				</span>
			)}
			<h1
				style={{
					margin: 0,
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 66,
					lineHeight: 1.05,
					letterSpacing: "-0.04em",
					color: COLORS.textHeading,
				}}
			>
				{title}{" "}
				<span
					style={{
						background: `linear-gradient(100deg, ${COLORS.accent} 0%, ${COLORS.cyan} 100%)`,
						WebkitBackgroundClip: "text",
						backgroundClip: "text",
						color: "transparent",
					}}
				>
					{highlight}
				</span>
			</h1>
			{tagline && (
				<p
					style={{
						margin: "24px auto 0",
						maxWidth: "62ch",
						fontFamily: SANS,
						fontSize: 19,
						lineHeight: 1.7,
						color: COLORS.text,
					}}
				>
					{tagline}
				</p>
			)}
		</div>
	);
}

type HeadingProps = {
	align?: string;
	eyebrow?: string;
	size?: number;
	subtitle?: string;
	title?: string;
};

function Heading({ align, eyebrow, size, subtitle, title }: HeadingProps) {
	const textAlign = (align || "left") as React.CSSProperties["textAlign"];

	return (
		<div style={{ textAlign }}>
			{eyebrow && <div style={eyebrowStyle}>{eyebrow}</div>}
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: size || 38,
					lineHeight: 1.15,
					letterSpacing: "-0.03em",
					color: COLORS.textHeading,
				}}
			>
				{title}
			</div>
			{subtitle && (
				<div
					style={{
						marginTop: 14,
						marginLeft: textAlign === "center" ? "auto" : undefined,
						marginRight: textAlign === "center" ? "auto" : undefined,
						maxWidth: textAlign === "center" ? 660 : undefined,
						fontFamily: SANS,
						fontSize: 17,
						lineHeight: 1.75,
						color: COLORS.textMuted,
					}}
				>
					{subtitle}
				</div>
			)}
		</div>
	);
}

type CodeBlockProps = {
	code?: { value?: string } | string;
	filename?: string;
	tag?: string;
};

function CodeBlock({ code, filename, tag }: CodeBlockProps) {
	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 16,
				overflow: "hidden",
				background: COLORS.bgCode,
				border: `1px solid ${COLORS.border}`,
				boxShadow: SHADOW,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10,
					padding: "12px 16px",
					borderBottom: `1px solid ${COLORS.borderSoft}`,
					background: "rgba(255, 255, 255, 0.02)",
				}}
			>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: "#ff5f57",
					}}
				/>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: "#febc2e",
					}}
				/>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: "#28c840",
					}}
				/>
				<span
					style={{
						marginLeft: 8,
						fontFamily: MONO,
						fontSize: 12,
						color: COLORS.textMuted,
					}}
				>
					{filename}
				</span>
				{tag && (
					<span
						style={{
							marginLeft: "auto",
							fontFamily: MONO,
							fontSize: 11,
							color: COLORS.accent,
							background: COLORS.accentSoft,
							padding: "4px 10px",
							borderRadius: 999,
						}}
					>
						{tag}
					</span>
				)}
			</div>
			<pre
				style={{
					margin: 0,
					padding: "20px 22px",
					flex: 1,
					overflowX: "auto",
					fontFamily: MONO,
					fontSize: 13.5,
					lineHeight: 1.75,
					color: "#d6def0",
					whiteSpace: "pre",
				}}
			>
				{readCode(code)}
			</pre>
		</div>
	);
}

type TerminalProps = {
	command?: string;
	output?: string;
};

function Terminal({ command, output }: TerminalProps) {
	return (
		<div
			style={{
				padding: "20px 22px",
				borderRadius: 16,
				background: COLORS.bgCode,
				border: `1px solid ${COLORS.border}`,
				fontFamily: MONO,
				fontSize: 14,
				lineHeight: 1.8,
			}}
		>
			<div style={{ color: COLORS.green }}>
				<span style={{ color: COLORS.textMuted }}>$ </span>
				{command}
			</div>
			{output && (
				<div style={{ color: COLORS.textMuted, whiteSpace: "pre-wrap" }}>
					{output}
				</div>
			)}
		</div>
	);
}

type BrowserFrameProps = {
	label?: string;
	url?: ImageURL;
};

function BrowserFrame({ label, url }: BrowserFrameProps) {
	return (
		<div
			style={{
				borderRadius: 18,
				overflow: "hidden",
				border: `1px solid ${COLORS.border}`,
				background: COLORS.bgCard,
				boxShadow: SHADOW,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					padding: "12px 16px",
					borderBottom: `1px solid ${COLORS.borderSoft}`,
				}}
			>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: "#ff5f57",
					}}
				/>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: "#febc2e",
					}}
				/>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: "#28c840",
					}}
				/>
				<span
					style={{
						marginLeft: 14,
						flex: 1,
						fontFamily: MONO,
						fontSize: 12,
						color: COLORS.textMuted,
						background: COLORS.bgCode,
						padding: "6px 12px",
						borderRadius: 8,
					}}
				>
					{label}
				</span>
			</div>
			{url?.location && (
				<img
					alt={label}
					src={url.location}
					style={{ display: "block", width: "100%" }}
				/>
			)}
		</div>
	);
}

type FeatureCardProps = {
	description?: string;
	icon?: string;
	title?: string;
};

function FeatureCard({ description, icon, title }: FeatureCardProps) {
	return (
		<div
			style={{
				...cardStyle,
				height: "100%",
				padding: "26px 24px",
				display: "flex",
				flexDirection: "column",
				gap: 10,
			}}
		>
			<div
				style={{
					width: 44,
					height: 44,
					borderRadius: 12,
					display: "grid",
					placeItems: "center",
					fontSize: 21,
					background: COLORS.bgCardSoft,
					border: `1px solid ${COLORS.border}`,
				}}
			>
				{icon}
			</div>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 600,
					fontSize: 19,
					color: COLORS.textHeading,
				}}
			>
				{title}
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 15,
					lineHeight: 1.7,
					color: COLORS.textMuted,
				}}
			>
				{description}
			</div>
		</div>
	);
}

type StepProps = {
	description?: string;
	step?: string;
	title?: string;
};

function Step({ description, step, title }: StepProps) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<div
				style={{
					width: 40,
					height: 40,
					borderRadius: 12,
					display: "grid",
					placeItems: "center",
					fontFamily: MONO,
					fontSize: 15,
					color: COLORS.accent,
					background: COLORS.accentSoft,
					border: "1px solid rgba(124, 92, 255, 0.35)",
				}}
			>
				{step}
			</div>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 600,
					fontSize: 20,
					color: COLORS.textHeading,
				}}
			>
				{title}
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 15,
					lineHeight: 1.7,
					color: COLORS.textMuted,
				}}
			>
				{description}
			</div>
		</div>
	);
}

type ApiRow = {
	description?: string;
	name?: string;
	type?: string;
};

type ApiTableProps = {
	rows?: ApiRow[];
	title?: string;
};

function ApiTable({ rows, title }: ApiTableProps) {
	return (
		<div style={{ ...cardStyle, overflow: "hidden" }}>
			{title && (
				<div
					style={{
						padding: "16px 22px",
						borderBottom: `1px solid ${COLORS.borderSoft}`,
						fontFamily: MONO,
						fontSize: 13,
						color: COLORS.cyan,
					}}
				>
					{title}
				</div>
			)}
			{(rows || []).map((apiRow, index) => (
				<div
					key={apiRow.name}
					style={{
						display: "grid",
						gridTemplateColumns: "minmax(140px, 1fr) minmax(120px, 1fr) 2fr",
						gap: 16,
						padding: "16px 22px",
						borderTop: index === 0 ? "none" : `1px solid ${COLORS.borderSoft}`,
					}}
				>
					<span
						style={{
							fontFamily: MONO,
							fontSize: 14,
							color: COLORS.textHeading,
						}}
					>
						{apiRow.name}
					</span>
					<span style={{ fontFamily: MONO, fontSize: 13, color: COLORS.pink }}>
						{apiRow.type}
					</span>
					<span
						style={{
							fontFamily: SANS,
							fontSize: 14,
							lineHeight: 1.6,
							color: COLORS.textMuted,
						}}
					>
						{apiRow.description}
					</span>
				</div>
			))}
		</div>
	);
}

type BadgeItem = {
	label?: string;
	note?: string;
};

type BadgeGridProps = {
	items?: BadgeItem[];
	mono?: boolean;
};

function BadgeGrid({ items, mono }: BadgeGridProps) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
			{(items || []).map((item) => (
				<span
					key={item.label}
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						padding: "10px 16px",
						borderRadius: 12,
						background: COLORS.bgCard,
						border: `1px solid ${COLORS.border}`,
						fontFamily: mono === false ? SANS : MONO,
						fontSize: 14,
						color: COLORS.textHeading,
					}}
				>
					{item.label}
					{item.note && (
						<span
							style={{
								fontFamily: SANS,
								fontSize: 12,
								color: COLORS.textMuted,
							}}
						>
							{item.note}
						</span>
					)}
				</span>
			))}
		</div>
	);
}

type StatProps = {
	label?: string;
	value?: string;
};

function Stat({ label, value }: StatProps) {
	return (
		<div
			style={{
				...cardStyle,
				height: "100%",
				padding: "22px 24px",
			}}
		>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 30,
					letterSpacing: "-0.02em",
					color: COLORS.textHeading,
				}}
			>
				{value}
			</div>
			<div
				style={{
					marginTop: 6,
					fontFamily: SANS,
					fontSize: 14,
					color: COLORS.textMuted,
				}}
			>
				{label}
			</div>
		</div>
	);
}

type UseCaseProps = {
	description?: string;
	tag?: string;
	title?: string;
};

function UseCase({ description, tag, title }: UseCaseProps) {
	return (
		<div
			style={{
				height: "100%",
				padding: "26px 24px",
				borderRadius: 18,
				background: `linear-gradient(160deg, ${COLORS.bgCardSoft} 0%, ${COLORS.bgCard} 100%)`,
				border: `1px solid ${COLORS.border}`,
				display: "flex",
				flexDirection: "column",
				gap: 10,
			}}
		>
			{tag && (
				<span
					style={{
						alignSelf: "flex-start",
						fontFamily: MONO,
						fontSize: 11,
						letterSpacing: "0.1em",
						textTransform: "uppercase",
						color: COLORS.amber,
						background: "rgba(251, 191, 36, 0.1)",
						padding: "5px 10px",
						borderRadius: 999,
					}}
				>
					{tag}
				</span>
			)}
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 600,
					fontSize: 20,
					color: COLORS.textHeading,
				}}
			>
				{title}
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 15,
					lineHeight: 1.7,
					color: COLORS.textMuted,
				}}
			>
				{description}
			</div>
		</div>
	);
}

type FaqProps = {
	answer?: string;
	question?: string;
};

function Faq({ answer, question }: FaqProps) {
	return (
		<div
			style={{
				...cardStyle,
				padding: "22px 24px",
				display: "flex",
				flexDirection: "column",
				gap: 8,
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 16,
					fontFamily: DISPLAY,
					fontWeight: 600,
					fontSize: 18,
					color: COLORS.textHeading,
				}}
			>
				{question}
				<span style={{ color: COLORS.accent, fontSize: 22 }}>+</span>
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 15,
					lineHeight: 1.7,
					color: COLORS.textMuted,
				}}
			>
				{answer}
			</div>
		</div>
	);
}

type CtaBannerProps = {
	command?: string;
	note?: string;
	primary?: string;
	secondary?: string;
	subtitle?: string;
	title?: string;
};

function CtaBanner({
	command,
	note,
	primary,
	secondary,
	subtitle,
	title,
}: CtaBannerProps) {
	return (
		<div
			style={{
				padding: "56px 48px",
				borderRadius: 26,
				textAlign: "center",
				background:
					`radial-gradient(120% 140% at 50% 0%, ${COLORS.accentSoft} 0%, transparent 60%), ` +
					`linear-gradient(160deg, ${COLORS.bgCardSoft} 0%, ${COLORS.bgCard} 100%)`,
				border: `1px solid ${COLORS.border}`,
			}}
		>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 40,
					letterSpacing: "-0.03em",
					color: COLORS.textHeading,
				}}
			>
				{title}
			</div>
			<div
				style={{
					margin: "14px auto 0",
					maxWidth: 620,
					fontFamily: SANS,
					fontSize: 17,
					lineHeight: 1.7,
					color: COLORS.text,
				}}
			>
				{subtitle}
			</div>
			{command && (
				<div
					style={{
						margin: "26px auto 0",
						maxWidth: 420,
						padding: "14px 20px",
						borderRadius: 12,
						background: COLORS.bgCode,
						border: `1px solid ${COLORS.border}`,
						fontFamily: MONO,
						fontSize: 14,
						color: COLORS.green,
					}}
				>
					<span style={{ color: COLORS.textMuted }}>$ </span>
					{command}
				</div>
			)}
			<div
				style={{
					marginTop: 24,
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: 12,
				}}
			>
				<span
					style={{
						fontFamily: SANS,
						fontSize: 15,
						fontWeight: 600,
						color: "#fff",
						background: COLORS.accent,
						padding: "15px 28px",
						borderRadius: 12,
					}}
				>
					{primary}
				</span>
				<span
					style={{
						fontFamily: SANS,
						fontSize: 15,
						fontWeight: 600,
						color: COLORS.textHeading,
						border: `1px solid ${COLORS.border}`,
						padding: "15px 28px",
						borderRadius: 12,
					}}
				>
					{secondary}
				</span>
			</div>
			{note && (
				<div
					style={{
						marginTop: 18,
						fontFamily: SANS,
						fontSize: 13,
						color: COLORS.textMuted,
					}}
				>
					{note}
				</div>
			)}
		</div>
	);
}

type FooterColumn = {
	items?: string;
	title?: string;
};

type FooterProps = {
	brand?: string;
	columns?: FooterColumn[];
	copyright?: string;
	tagline?: string;
};

function Footer({ brand, columns, copyright, tagline }: FooterProps) {
	return (
		<div
			style={{
				padding: "44px 40px 26px",
				borderRadius: 22,
				background: COLORS.bgCard,
				border: `1px solid ${COLORS.border}`,
			}}
		>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: 40,
					justifyContent: "space-between",
				}}
			>
				<div style={{ maxWidth: 320 }}>
					<div
						style={{
							fontFamily: MONO,
							fontSize: 17,
							color: COLORS.textHeading,
						}}
					>
						{brand}
					</div>
					<div
						style={{
							marginTop: 10,
							fontFamily: SANS,
							fontSize: 15,
							lineHeight: 1.7,
							color: COLORS.textMuted,
						}}
					>
						{tagline}
					</div>
				</div>
				{(columns || []).map((footerColumn) => (
					<div key={footerColumn.title}>
						<div
							style={{
								marginBottom: 12,
								fontFamily: MONO,
								fontSize: 12,
								letterSpacing: "0.12em",
								textTransform: "uppercase",
								color: COLORS.cyan,
							}}
						>
							{footerColumn.title}
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
							{(footerColumn.items || "")
								.split(",")
								.map((item) => item.trim())
								.map((item) => (
									<span
										key={item}
										style={{
											fontFamily: SANS,
											fontSize: 15,
											color: COLORS.text,
										}}
									>
										{item}
									</span>
								))}
						</div>
					</div>
				))}
			</div>
			<div
				style={{
					marginTop: 34,
					paddingTop: 20,
					borderTop: `1px solid ${COLORS.borderSoft}`,
					textAlign: "center",
					fontFamily: SANS,
					fontSize: 13,
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
		id: "DocsNavbar",
		label: "Navbar",
		component: Navbar,
		group: DocsGroup,
		props: [
			{
				id: "brand",
				label: "Brand",
				type: "text",
				defaultValue: "react-web-builder",
			},
			{ id: "version", label: "Version", type: "text" },
			{
				id: "items",
				label: "Links (comma separated)",
				type: "text",
				defaultValue: "Docs, API",
			},
			{ id: "stars", label: "Stars", type: "text" },
			{ id: "cta", label: "Button", type: "text", defaultValue: "Live demo" },
		],
	},
	{
		id: "DocsHero",
		label: "Hero",
		component: Hero,
		group: DocsGroup,
		props: [
			{ id: "badge", label: "Badge", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "highlight", label: "Highlighted words", type: "text" },
			{ id: "tagline", label: "Tagline", type: "text" },
		],
	},
	{
		id: "DocsHeading",
		label: "Section heading",
		component: Heading,
		group: DocsGroup,
		props: [
			{ id: "eyebrow", label: "Eyebrow", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "subtitle", label: "Subtitle", type: "text" },
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
				min: 18,
				max: 72,
			},
		],
	},
	{
		id: "DocsCodeBlock",
		label: "Code block",
		component: CodeBlock,
		group: DocsGroup,
		props: [
			{ id: "filename", label: "File name", type: "text" },
			{ id: "tag", label: "Tag", type: "text" },
			{ id: "code", label: "Code", type: "html" },
		],
	},
	{
		id: "DocsTerminal",
		label: "Terminal",
		component: Terminal,
		group: DocsGroup,
		props: [
			{ id: "command", label: "Command", type: "text" },
			{ id: "output", label: "Output", type: "text" },
		],
	},
	{
		id: "DocsBrowserFrame",
		label: "Browser frame",
		component: BrowserFrame,
		group: DocsGroup,
		props: [
			{ id: "label", label: "Address", type: "text" },
			{ id: "url", label: "Screenshot", type: "img" },
		],
	},
	{
		id: "DocsFeatureCard",
		label: "Feature card",
		component: FeatureCard,
		group: DocsGroup,
		props: [
			{ id: "icon", label: "Icon (emoji)", type: "text", defaultValue: "🧩" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "DocsStep",
		label: "Step",
		component: Step,
		group: DocsGroup,
		props: [
			{ id: "step", label: "Number", type: "text", defaultValue: "01" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "DocsApiTable",
		label: "API table",
		component: ApiTable,
		group: DocsGroup,
		props: [
			{ id: "title", label: "Title", type: "text" },
			{
				id: "rows",
				label: "Rows",
				type: "array",
				of: {
					id: "apiRow",
					label: "Row",
					type: "object",
					of: [
						{ id: "name", label: "Name", type: "text" },
						{ id: "type", label: "Type", type: "text" },
						{ id: "description", label: "Description", type: "text" },
					],
				},
			},
		],
	},
	{
		id: "DocsBadgeGrid",
		label: "Badge grid",
		component: BadgeGrid,
		group: DocsGroup,
		props: [
			{
				id: "items",
				label: "Badges",
				type: "array",
				of: {
					id: "item",
					label: "Badge",
					type: "object",
					of: [
						{ id: "label", label: "Label", type: "text" },
						{ id: "note", label: "Note", type: "text" },
					],
				},
			},
			{ id: "mono", label: "Monospace", type: "toggle", defaultValue: true },
		],
	},
	{
		id: "DocsStat",
		label: "Stat",
		component: Stat,
		group: DocsGroup,
		props: [
			{ id: "value", label: "Value", type: "text" },
			{ id: "label", label: "Label", type: "text" },
		],
	},
	{
		id: "DocsUseCase",
		label: "Use case",
		component: UseCase,
		group: DocsGroup,
		props: [
			{ id: "tag", label: "Tag", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "DocsFaq",
		label: "FAQ item",
		component: Faq,
		group: DocsGroup,
		props: [
			{ id: "question", label: "Question", type: "text" },
			{ id: "answer", label: "Answer", type: "text" },
		],
	},
	{
		id: "DocsCtaBanner",
		label: "CTA banner",
		component: CtaBanner,
		group: DocsGroup,
		props: [
			{ id: "title", label: "Title", type: "text" },
			{ id: "subtitle", label: "Subtitle", type: "text" },
			{ id: "command", label: "Command", type: "text" },
			{ id: "primary", label: "Primary button", type: "text" },
			{ id: "secondary", label: "Secondary button", type: "text" },
			{ id: "note", label: "Note", type: "text" },
		],
	},
	{
		id: "DocsFooter",
		label: "Footer",
		component: Footer,
		group: DocsGroup,
		props: [
			{ id: "brand", label: "Brand", type: "text" },
			{ id: "tagline", label: "Tagline", type: "text" },
			{
				id: "columns",
				label: "Columns",
				type: "array",
				of: {
					id: "footerColumn",
					label: "Column",
					type: "object",
					of: [
						{ id: "title", label: "Title", type: "text" },
						{ id: "items", label: "Items (comma separated)", type: "text" },
					],
				},
			},
			{ id: "copyright", label: "Copyright", type: "text" },
		],
	},
];

// ---------------------------------------------------------------------------
// content
// ---------------------------------------------------------------------------

const PACKAGE = "react-web-builder";
const VERSION = "v0.25.0";
const REPO = "https://github.com/sasza2/react-web-builder";
const DEMO = "https://react-web-builder.100bit.pl";

const HERO_TAGLINE =
	"A drag & drop page builder for React where every block in the palette is " +
	"your own component. Describe it once and the builder generates the whole " +
	"editing experience — inputs, color pickers, rich text, image uploads.";

const EDITOR_CODE = `import WebBuilder from 'react-web-builder'

export function Editor() {
  const onPublish = async (page) => {
    // \`page\` is a plain, serializable object
    await fetch('/api/pages/home', {
      method: 'PUT',
      body: JSON.stringify(page),
    })
  }

  return <WebBuilder onPublish={onPublish} />
}`;

const VIEW_CODE = `import View from 'react-web-builder/View'

export function Page({ page }) {
  // the renderer - no editor code ships to
  // your visitors, just the final markup
  return <View page={page} />
}`;

const COMPONENT_CODE = `const components = [
  {
    id: 'PricingCard',
    label: 'Pricing card',
    icon: PriceIcon,
    component: PricingCard,
    props: [
      { id: 'plan', type: 'text', label: 'Plan' },
      { id: 'price', type: 'number', label: 'Price', min: 0, max: 999 },
      { id: 'accent', type: 'color', label: 'Accent' },
      { id: 'perks', type: 'array', label: 'Perks', of: {
        id: 'perk', type: 'object', label: 'Perk', of: [
          { id: 'text', type: 'text', label: 'Text' },
        ],
      } },
    ],
  },
]

<WebBuilder components={components} onPublish={save} />`;

const features = [
	{
		icon: "🧩",
		title: "Bring your own components",
		description:
			"Any React component becomes a drag & drop block. You keep the rendering, the builder handles the editing.",
	},
	{
		icon: "🎛️",
		title: "Declarative property editor",
		description:
			"20+ property types — text, number, color, richtext, image, url, border, padding, select, list, array, object.",
	},
	{
		icon: "📱",
		title: "Responsive by design",
		description:
			"Multiple breakpoints, each with its own grid, column count and layout. Mobile is designed, not guessed.",
	},
	{
		icon: "🖱️",
		title: "Grid with pan & zoom",
		description:
			"A smooth, zoomable canvas powered by react-grid-panzoom, with help lines and snapping while dragging.",
	},
	{
		icon: "✍️",
		title: "Rich text editing",
		description:
			"Slate based editing with colors, hyperlinks, alignment, letter spacing, line height and font options.",
	},
	{
		icon: "🧱",
		title: "Templates",
		description:
			"Start your users from a prepared layout per breakpoint instead of dropping them onto a blank canvas.",
	},
	{
		icon: "🌍",
		title: "i18n out of the box",
		description:
			"Every label in the editor goes through i18next, so the builder speaks your users' language.",
	},
	{
		icon: "🖼️",
		title: "Image upload hook",
		description:
			"Plug in your own storage or CDN through onImageUpload and keep full control over the assets.",
	},
	{
		icon: "🔒",
		title: "TypeScript first",
		description:
			"Types shipped for every entry point, ESM and CJS builds, tree-shakable subpath exports.",
	},
];

const steps = [
	{
		step: "01",
		title: "Install the package",
		description:
			"One dependency, with react and react-dom 18.2+ as peers. No CSS file to import.",
	},
	{
		step: "02",
		title: "Describe your components",
		description:
			"Give each one an id, a label, an icon and a list of editable properties. That is the whole integration.",
	},
	{
		step: "03",
		title: "Let users design",
		description:
			"They drag blocks onto the grid, tweak properties in the sidebar and switch breakpoints as they go.",
	},
	{
		step: "04",
		title: "Store and render",
		description:
			"onPublish hands you a serializable page object. Save it anywhere and render it later with <View />.",
	},
];

const builtInElements = [
	{ label: "Container" },
	{ label: "Box", note: "rich text" },
	{ label: "Image" },
	{ label: "Video" },
	{ label: "CustomButton" },
	{ label: "Line" },
	{ label: "Separator" },
	{ label: "Iframe" },
	{ label: "Anchor" },
	{ label: "HTML" },
];

const propertyTypes = [
	{ label: "text" },
	{ label: "number" },
	{ label: "richtext" },
	{ label: "select" },
	{ label: "toggle" },
	{ label: "color" },
	{ label: "img" },
	{ label: "url" },
	{ label: "html" },
	{ label: "list" },
	{ label: "array" },
	{ label: "object" },
	{ label: "padding" },
	{ label: "border" },
	{ label: "boxShadow" },
	{ label: "fontOptions" },
	{ label: "fontFamily" },
	{ label: "backgroundImage" },
	{ label: "breakpointHeight" },
	{ label: "editBreakpoint" },
	{ label: "hidden" },
];

const builderApi = [
	{
		name: "page",
		type: "Page",
		description:
			"The page to load into the editor. Omit it to start from an empty canvas.",
	},
	{
		name: "components",
		type: "WebBuilderComponent[]",
		description:
			"Your components, each with its id, label, icon and editable properties.",
	},
	{
		name: "onPublish",
		type: "(page) => Promise",
		description:
			"Called when the user publishes. The page object is plain JSON, store it anywhere.",
	},
	{
		name: "onSaveAsDraft",
		type: "(page) => Promise",
		description: "Same shape as onPublish, wired to the draft button.",
	},
	{
		name: "onAutoSave",
		type: "(page) => void",
		description: "Fires periodically while editing so nothing gets lost.",
	},
	{
		name: "onImageUpload",
		type: "OnImageUpload",
		description:
			"Receives the file, returns the hosted location. Enables the upload UI.",
	},
	{
		name: "fonts",
		type: "FontImport[]",
		description:
			"Fonts selectable in page settings, together with the stylesheet to inject.",
	},
	{
		name: "translations",
		type: "Translations",
		description: "Override any label in the editor through i18next resources.",
	},
	{
		name: "onTemplateRestart",
		type: "() => Page",
		description:
			"Return a starting template when the user resets the page to defaults.",
	},
];

const viewApi = [
	{
		name: "page",
		type: "Page",
		description:
			"The object produced by the editor. That is all the renderer needs.",
	},
	{
		name: "components",
		type: "WebBuilderComponent[]",
		description:
			"The same list you passed to the editor, so custom blocks render identically.",
	},
	{
		name: "fonts",
		type: "FontImport[]",
		description: "The same fonts, so typography matches the editor preview.",
	},
];

const useCases = [
	{
		tag: "SaaS",
		title: "Landing page builder in your product",
		description:
			"Let customers assemble campaign pages from blocks your design system already ships, with no HTML in sight.",
	},
	{
		tag: "CMS",
		title: "Page editor for editorial teams",
		description:
			"Replace a rigid template picker with a canvas, while keeping every component on brand and type safe.",
	},
	{
		tag: "Agency",
		title: "White label site builder",
		description:
			"Hand clients a builder that looks like yours: your fonts, your palette, your components, your language.",
	},
	{
		tag: "Email",
		title: "Newsletter layout tool",
		description:
			"Design per breakpoint, export the page object and turn it into whatever markup your sender expects.",
	},
];

const stats = [
	{ value: "2", label: "Components to integrate" },
	{ value: "20+", label: "Property types" },
	{ value: "10", label: "Built in elements" },
	{ value: "MIT", label: "License" },
];

const faqs = [
	{
		question: "Do I have to use the built in elements?",
		answer:
			"No. Text, image, button and the rest are there so a page is usable out of the box, but your own components sit next to them in the same palette.",
	},
	{
		question: "What exactly does onPublish give me?",
		answer:
			"A plain object with breakpoints, the element tree and per element properties. It is JSON, so you can store it in any database or file.",
	},
	{
		question: "Does the editor ship to my visitors?",
		answer:
			"Only if you want it to. Import View from react-web-builder/View to render a published page without any editing code.",
	},
	{
		question: "How does responsiveness work?",
		answer:
			"Each breakpoint has its own column count, row height, padding and layout tree, so a phone layout is designed rather than derived.",
	},
	{
		question: "Can I restrict what users can do?",
		answer:
			"Yes. You decide which components appear, which properties they expose, and you can hide the default button or supply your own defaults.",
	},
	{
		question: "Is it typed?",
		answer:
			"Fully. Types ship for every entry point, including the page object, component definitions and each property type.",
	},
];

const footerColumns = [
	{ title: "Docs", items: "Introduction, Components, Properties, Breakpoints" },
	{ title: "Project", items: "GitHub, npm, Changelog, License" },
	{ title: "More", items: "Live demo, Storybook, Issues, Discussions" },
];

// ---------------------------------------------------------------------------
// template
// ---------------------------------------------------------------------------

const navbar = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"DocsNavbar",
		[
			{ propId: "brand", value: PACKAGE },
			{ propId: "version", value: VERSION },
			{ propId: "items", value: "Features, Docs, API, Use cases, FAQ" },
			{ propId: "stars", value: "GitHub" },
			{ propId: "cta", value: "Live demo" },
		],
		options,
	);

const hero = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"DocsHero",
		[
			{ propId: "badge", value: `${PACKAGE} ${VERSION} · MIT` },
			{ propId: "title", value: "Page builder for React," },
			{ propId: "highlight", value: "built from your components." },
			{ propId: "tagline", value: HERO_TAGLINE },
		],
		options,
	);

const heading = (
	id: string,
	w: number,
	eyebrow: string,
	title: string,
	options: NodeOptions & {
		align?: string;
		size?: number;
		subtitle?: string;
	} = {},
): Tree =>
	node(
		id,
		w,
		"DocsHeading",
		[
			{ propId: "eyebrow", value: eyebrow },
			{ propId: "title", value: title },
			{ propId: "subtitle", value: options.subtitle ?? "" },
			{ propId: "align", value: options.align ?? "left" },
			{ propId: "size", value: options.size ?? 38 },
		],
		options,
	);

const codeBlock = (
	id: string,
	w: number,
	filename: string,
	code: string,
	options: NodeOptions & { tag?: string } = {},
): Tree =>
	node(
		id,
		w,
		"DocsCodeBlock",
		[
			{ propId: "filename", value: filename },
			{ propId: "tag", value: options.tag ?? "" },
			{ propId: "code", value: { value: code } },
		],
		options,
	);

const terminal = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"DocsTerminal",
		[
			{ propId: "command", value: `npm install ${PACKAGE}` },
			{
				propId: "output",
				value: "peer deps: react >= 18.2.0 · react-dom >= 18.2.0",
			},
		],
		options,
	);

const featureCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Feature${idSuffix}${index}`,
		w,
		"DocsFeatureCard",
		[
			{ propId: "icon", value: features[index].icon },
			{ propId: "title", value: features[index].title },
			{ propId: "description", value: features[index].description },
		],
		options,
	);

const stepCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Step${idSuffix}${index}`,
		w,
		"DocsStep",
		[
			{ propId: "step", value: steps[index].step },
			{ propId: "title", value: steps[index].title },
			{ propId: "description", value: steps[index].description },
		],
		options,
	);

const statCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Stat${idSuffix}${index}`,
		w,
		"DocsStat",
		[
			{ propId: "value", value: stats[index].value },
			{ propId: "label", value: stats[index].label },
		],
		options,
	);

const scenarioCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`UseCase${idSuffix}${index}`,
		w,
		"DocsUseCase",
		[
			{ propId: "tag", value: useCases[index].tag },
			{ propId: "title", value: useCases[index].title },
			{ propId: "description", value: useCases[index].description },
		],
		options,
	);

const faqCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Faq${idSuffix}${index}`,
		w,
		"DocsFaq",
		[
			{ propId: "question", value: faqs[index].question },
			{ propId: "answer", value: faqs[index].answer },
		],
		options,
	);

const badgeGrid = (
	id: string,
	w: number,
	items: BadgeItem[],
	options: NodeOptions = {},
): Tree =>
	node(
		id,
		w,
		"DocsBadgeGrid",
		[
			{ propId: "items", value: items },
			{ propId: "mono", value: true },
		],
		options,
	);

const apiTable = (
	id: string,
	w: number,
	title: string,
	rows: ApiRow[],
	options: NodeOptions = {},
): Tree =>
	node(
		id,
		w,
		"DocsApiTable",
		[
			{ propId: "title", value: title },
			{ propId: "rows", value: rows },
		],
		options,
	);

const browserFrame = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"DocsBrowserFrame",
		[
			{ propId: "label", value: DEMO },
			{
				propId: "url",
				value: {
					location:
						"https://raw.githubusercontent.com/sasza2/react-web-builder/master/docs/assets/intro-view.png",
				},
			},
		],
		options,
	);

const ctaBanner = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"DocsCtaBanner",
		[
			{ propId: "title", value: "Ship a page builder this week" },
			{
				propId: "subtitle",
				value:
					"Two components, your own blocks and a JSON page object. Everything " +
					"else — the grid, the sidebar, the breakpoints — is already built.",
			},
			{ propId: "command", value: `npm install ${PACKAGE}` },
			{ propId: "primary", value: "Read the docs" },
			{ propId: "secondary", value: "Open the live demo" },
			{ propId: "note", value: "MIT licensed · React 18.2+ · ESM and CJS" },
		],
		options,
	);

const footer = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"DocsFooter",
		[
			{ propId: "brand", value: PACKAGE },
			{
				propId: "tagline",
				value:
					"A drag & drop page builder for React — with your own components. " +
					"Open source and MIT licensed.",
			},
			{ propId: "columns", value: footerColumns },
			{ propId: "copyright", value: `© 2026 ${PACKAGE} · MIT License` },
		],
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
				value: { location: options.href ?? REPO, openInNewTab: true },
			},
			{
				propId: "content",
				value: [
					paragraph(label, {
						align: "center",
						fontSize: 15,
						color: options.ghost ? COLORS.textHeading : "#ffffff",
					}),
				],
			},
			{
				propId: "color",
				value: options.ghost ? COLORS.textHeading : "#ffffff",
			},
			{
				propId: "backgroundColor",
				value: options.ghost ? "transparent" : COLORS.accent,
			},
			{ propId: "padding", value: padding({ top: 15, bottom: 15 }) },
			{
				propId: "border",
				value: {
					top: 1,
					right: 1,
					bottom: 1,
					left: 1,
					radius: 12,
					color: options.ghost ? COLORS.border : COLORS.accent,
				},
			},
			{ propId: "boxShadow", value: "" },
		],
		options,
	);

const templateDesktop: Tree = row("library-desktop", 24, [
	navbar("Navbar", 24, { marginTop: 2 }),
	hero("Hero", 24, { marginTop: 6 }),
	column(
		"HeroButtons",
		24,
		[
			ctaButton("HeroCta", 5, "Get started", { marginLeft: 6 }),
			ctaButton("HeroCtaGhost", 5, "Live demo", {
				marginLeft: 2,
				ghost: true,
				href: DEMO,
			}),
		],
		{ marginTop: 4 },
	),
	terminal("Terminal", 10, { marginLeft: 7, marginTop: 3 }),
	browserFrame("Screenshot", 22, { marginLeft: 1, marginTop: 5 }),
	// stats
	column(
		"StatsRow",
		24,
		[
			statCard("D", 5, 0),
			statCard("D", 5, 1, { marginLeft: 1 }),
			statCard("D", 5, 2, { marginLeft: 2 }),
			statCard("D", 5, 3, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// two components
	heading(
		"ApiIntroHeading",
		24,
		"The whole api",
		"Two components, one object",
		{
			marginTop: 8,
			align: "center",
			subtitle:
				"WebBuilder is the editor, View is the renderer, and the page object " +
				"travels between them as plain JSON.",
		},
	),
	column(
		"CodeRow",
		24,
		[
			codeBlock("EditorCode", 13, "Editor.jsx", EDITOR_CODE, {
				tag: "editor",
			}),
			codeBlock("ViewCode", 10, "Page.jsx", VIEW_CODE, {
				marginLeft: 1,
				tag: "renderer",
			}),
		],
		{ marginTop: 4 },
	),
	// features
	heading(
		"FeaturesHeading",
		24,
		"Features",
		"Everything the editor already does",
		{
			marginTop: 8,
			align: "center",
		},
	),
	column(
		"FeaturesRow1",
		24,
		[
			featureCard("D", 7, 0),
			featureCard("D", 8, 1, { marginLeft: 1 }),
			featureCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	column(
		"FeaturesRow2",
		24,
		[
			featureCard("D", 7, 3),
			featureCard("D", 8, 4, { marginLeft: 1 }),
			featureCard("D", 7, 5, { marginLeft: 1 }),
		],
		{ marginTop: 2 },
	),
	column(
		"FeaturesRow3",
		24,
		[
			featureCard("D", 7, 6),
			featureCard("D", 8, 7, { marginLeft: 1 }),
			featureCard("D", 7, 8, { marginLeft: 1 }),
		],
		{ marginTop: 2 },
	),
	// your components
	heading(
		"ComponentsHeading",
		24,
		"Your components",
		"Describe it once, edit it forever",
		{
			marginTop: 8,
			subtitle:
				"A component definition is an id, a label, an icon and a list of " +
				"properties. The sidebar, the inputs and the validation come for free.",
		},
	),
	column(
		"ComponentsRow",
		24,
		[
			codeBlock("ComponentCode", 14, "components.ts", COMPONENT_CODE, {
				tag: "definition",
			}),
			row(
				"ComponentsSide",
				9,
				[
					heading("PropertyTypesHeading", 9, "", "Property types", {
						size: 22,
					}),
					badgeGrid("PropertyTypes", 9, propertyTypes, { marginTop: 1 }),
					heading("ElementsHeading", 9, "", "Built in elements", {
						marginTop: 2,
						size: 22,
					}),
					badgeGrid("Elements", 9, builtInElements, { marginTop: 1 }),
				],
				{ marginLeft: 1 },
			),
		],
		{ marginTop: 4 },
	),
	// how it works
	heading(
		"StepsHeading",
		24,
		"How it works",
		"From install to published page",
		{
			marginTop: 8,
		},
	),
	column(
		"StepsRow",
		24,
		[
			stepCard("D", 5, 0),
			stepCard("D", 5, 1, { marginLeft: 1 }),
			stepCard("D", 5, 2, { marginLeft: 2 }),
			stepCard("D", 5, 3, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// api reference
	heading("ApiHeading", 24, "Api reference", "The props you will reach for", {
		marginTop: 8,
	}),
	apiTable("BuilderApi", 24, "<WebBuilder />", builderApi, { marginTop: 3 }),
	apiTable("ViewApi", 24, "<View />", viewApi, { marginTop: 2 }),
	// use cases
	heading("UseCasesHeading", 24, "Use cases", "Where it earns its keep", {
		marginTop: 8,
		align: "center",
	}),
	column(
		"UseCasesRow",
		24,
		[
			scenarioCard("D", 5, 0),
			scenarioCard("D", 5, 1, { marginLeft: 1 }),
			scenarioCard("D", 5, 2, { marginLeft: 2 }),
			scenarioCard("D", 5, 3, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// faq
	heading("FaqHeading", 24, "Faq", "Questions before you install", {
		marginTop: 8,
	}),
	column(
		"FaqRow1",
		24,
		[faqCard("D", 11, 0), faqCard("D", 11, 1, { marginLeft: 2 })],
		{
			marginTop: 4,
		},
	),
	column(
		"FaqRow2",
		24,
		[faqCard("D", 11, 2), faqCard("D", 11, 3, { marginLeft: 2 })],
		{
			marginTop: 2,
		},
	),
	column(
		"FaqRow3",
		24,
		[faqCard("D", 11, 4), faqCard("D", 11, 5, { marginLeft: 2 })],
		{
			marginTop: 2,
		},
	),
	ctaBanner("CtaBanner", 24, { marginTop: 8 }),
	footer("Footer", 24, { marginTop: 3, marginBottom: 2 }),
]);

const templateMobile: Tree = row("library-mobile", 8, [
	navbar("MNavbar", 8, { marginTop: 2 }),
	hero("MHero", 8, { marginTop: 4 }),
	ctaButton("MHeroCta", 8, "Get started", { marginTop: 3 }),
	ctaButton("MHeroCtaGhost", 8, "Live demo", {
		marginTop: 1,
		ghost: true,
		href: DEMO,
	}),
	terminal("MTerminal", 8, { marginTop: 3 }),
	browserFrame("MScreenshot", 8, { marginTop: 3 }),
	column("MStatsRow1", 8, [statCard("M", 4, 0), statCard("M", 4, 1)], {
		marginTop: 3,
	}),
	column("MStatsRow2", 8, [statCard("M", 4, 2), statCard("M", 4, 3)], {
		marginTop: 1,
	}),
	heading(
		"MApiIntroHeading",
		8,
		"The whole api",
		"Two components, one object",
		{
			marginTop: 5,
			size: 28,
			subtitle: "WebBuilder edits, View renders, JSON travels between them.",
		},
	),
	codeBlock("MEditorCode", 8, "Editor.jsx", EDITOR_CODE, {
		marginTop: 3,
		tag: "editor",
	}),
	codeBlock("MViewCode", 8, "Page.jsx", VIEW_CODE, {
		marginTop: 2,
		tag: "renderer",
	}),
	heading(
		"MFeaturesHeading",
		8,
		"Features",
		"Everything the editor already does",
		{
			marginTop: 5,
			size: 28,
		},
	),
	featureCard("M", 8, 0, { marginTop: 3 }),
	featureCard("M", 8, 1, { marginTop: 2 }),
	featureCard("M", 8, 2, { marginTop: 2 }),
	featureCard("M", 8, 3, { marginTop: 2 }),
	featureCard("M", 8, 4, { marginTop: 2 }),
	featureCard("M", 8, 5, { marginTop: 2 }),
	heading("MComponentsHeading", 8, "Your components", "Describe it once", {
		marginTop: 5,
		size: 28,
	}),
	codeBlock("MComponentCode", 8, "components.ts", COMPONENT_CODE, {
		marginTop: 3,
		tag: "definition",
	}),
	heading("MPropertyTypesHeading", 8, "", "Property types", {
		marginTop: 3,
		size: 22,
	}),
	badgeGrid("MPropertyTypes", 8, propertyTypes, { marginTop: 1 }),
	heading("MElementsHeading", 8, "", "Built in elements", {
		marginTop: 3,
		size: 22,
	}),
	badgeGrid("MElements", 8, builtInElements, { marginTop: 1 }),
	heading(
		"MStepsHeading",
		8,
		"How it works",
		"From install to published page",
		{
			marginTop: 5,
			size: 28,
		},
	),
	stepCard("M", 8, 0, { marginTop: 3 }),
	stepCard("M", 8, 1, { marginTop: 2 }),
	stepCard("M", 8, 2, { marginTop: 2 }),
	stepCard("M", 8, 3, { marginTop: 2 }),
	heading("MApiHeading", 8, "Api reference", "The props you will reach for", {
		marginTop: 5,
		size: 28,
	}),
	apiTable("MBuilderApi", 8, "<WebBuilder />", builderApi, { marginTop: 3 }),
	apiTable("MViewApi", 8, "<View />", viewApi, { marginTop: 2 }),
	heading("MUseCasesHeading", 8, "Use cases", "Where it earns its keep", {
		marginTop: 5,
		size: 28,
	}),
	scenarioCard("M", 8, 0, { marginTop: 3 }),
	scenarioCard("M", 8, 1, { marginTop: 2 }),
	scenarioCard("M", 8, 2, { marginTop: 2 }),
	scenarioCard("M", 8, 3, { marginTop: 2 }),
	heading("MFaqHeading", 8, "Faq", "Questions before you install", {
		marginTop: 5,
		size: 28,
	}),
	faqCard("M", 8, 0, { marginTop: 3 }),
	faqCard("M", 8, 1, { marginTop: 2 }),
	faqCard("M", 8, 2, { marginTop: 2 }),
	faqCard("M", 8, 3, { marginTop: 2 }),
	faqCard("M", 8, 4, { marginTop: 2 }),
	faqCard("M", 8, 5, { marginTop: 2 }),
	ctaBanner("MCtaBanner", 8, { marginTop: 5 }),
	footer("MFooter", 8, { marginTop: 3, marginBottom: 2 }),
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
				left: 72,
				right: 72,
				bottom: 32,
			},
			template: templateDesktop,
		},
	],
} as Page;

export function Library() {
	const [page] = useState<Page>(() => {
		const pageFromLocalStorage = JSON.parse(
			localStorage.getItem("library-page-draft") ?? "null",
		) as Page;
		if (pageFromLocalStorage) return pageFromLocalStorage;
		return template;
	});

	const onPublish = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem(
					"library-page-published",
					JSON.stringify(nextPage),
				);
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onSaveAsDraft = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem("library-page-draft", JSON.stringify(nextPage));
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onTemplateRestart = (): Page => template;

	return (
		<WebBuilder
			page={page}
			onPublish={onPublish}
			onSaveAsDraft={onSaveAsDraft}
			onTemplateRestart={onTemplateRestart}
			components={components}
			fonts={libraryFonts}
		/>
	);
}

const meta = {
	component: Library,
	parameters: {
		layout: "fullscreen",
		options: { showPanel: false },
	},
	title: "WebBuilder/Library",
};

export default meta;
