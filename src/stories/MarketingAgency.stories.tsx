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
	paragraph,
	row,
} from "./treeBuilders";

// A one page site for a fictional creative marketing agency: hero, services,
// process, selected work, testimonials, pricing tiers, FAQ and contact.
//
// The page needs a few things the built in elements cannot express (a metric
// row, a service card, a team card, a pricing plan, an FAQ item), so this
// story ships its own components and passes them to the builder.

const DISPLAY = '"Sora", "Inter", -apple-system, sans-serif';
const SANS = '"Inter", -apple-system, "Segoe UI", Roboto, sans-serif';

const COLORS = {
	bg: "#0e0f13",
	bgSoft: "#17181e",
	bgCard: "#1c1d24",
	text: "#c3c8d4",
	textHeading: "#f7f8fb",
	textMuted: "#8b909f",
	textInverse: "#0e0f13",
	border: "#2a2c35",
	accent: "#7c5cff",
	accentSoft: "#2a2350",
	green: "#34d399",
	greenSoft: "#10361f",
	amber: "#f5b952",
};

const SHADOW_SM =
	"0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.35)";
const SHADOW_MD =
	"0 16px 40px rgba(0, 0, 0, 0.4), 0 48px 80px rgba(0, 0, 0, 0.45)";

const agencyFonts: FontImport[] = [
	{
		label: "Inter",
		value: "inter",
		fontFamily: SANS,
		stylesheet: (
			<>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap"
					rel="stylesheet"
				/>
			</>
		),
	},
	{
		label: "Sora",
		value: "sora",
		fontFamily: DISPLAY,
		stylesheet: (
			<link
				href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&display=swap"
				rel="stylesheet"
			/>
		),
	},
];

// ---------------------------------------------------------------------------
// components
// ---------------------------------------------------------------------------

const AgencyGroup = { id: "agency", label: "Marketing agency" };

const eyebrowStyle: React.CSSProperties = {
	fontFamily: SANS,
	fontSize: 12,
	fontWeight: 600,
	letterSpacing: "0.16em",
	textTransform: "uppercase",
	color: COLORS.accent,
	marginBottom: 10,
};

const cardStyle: React.CSSProperties = {
	background: COLORS.bgCard,
	border: `1px solid ${COLORS.border}`,
	borderRadius: 18,
	boxShadow: SHADOW_SM,
};

type NavbarProps = {
	brand?: string;
	cta?: string;
	items?: string;
};

function Navbar({ brand, cta, items }: NavbarProps) {
	const links = (items || "").split(",").map((item) => item.trim());

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 24,
				height: "100%",
				padding: "14px 22px",
				borderRadius: 999,
				...cardStyle,
			}}
		>
			<span
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 21,
					letterSpacing: "-0.02em",
					color: COLORS.textHeading,
					whiteSpace: "nowrap",
				}}
			>
				{brand}
			</span>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: 6,
					marginLeft: 12,
				}}
			>
				{links.map((link) => (
					<span
						key={link}
						style={{
							fontFamily: SANS,
							fontSize: 14,
							color: COLORS.textMuted,
							padding: "8px 12px",
							borderRadius: 999,
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
					gap: 14,
					marginLeft: "auto",
				}}
			>
				{cta && (
					<span
						style={{
							fontFamily: SANS,
							fontSize: 14,
							fontWeight: 600,
							color: COLORS.textInverse,
							background: COLORS.accent,
							padding: "10px 18px",
							borderRadius: 999,
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
					fontSize: size || 36,
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
						marginTop: 12,
						fontFamily: SANS,
						fontSize: 17,
						lineHeight: 1.7,
						color: COLORS.textMuted,
						maxWidth: textAlign === "center" ? 620 : undefined,
						marginLeft: textAlign === "center" ? "auto" : undefined,
						marginRight: textAlign === "center" ? "auto" : undefined,
					}}
				>
					{subtitle}
				</div>
			)}
		</div>
	);
}

type HeroTitleProps = {
	badge?: string;
	highlight?: string;
	tagline?: string;
	title?: string;
};

function HeroTitle({ badge, highlight, tagline, title }: HeroTitleProps) {
	return (
		<div>
			{badge && (
				<span
					style={{
						display: "inline-block",
						fontFamily: SANS,
						fontSize: 13,
						fontWeight: 600,
						color: COLORS.accent,
						background: COLORS.accentSoft,
						padding: "8px 16px",
						borderRadius: 999,
						marginBottom: 20,
					}}
				>
					{badge}
				</span>
			)}
			<h1
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 60,
					lineHeight: 1.05,
					letterSpacing: "-0.04em",
					color: COLORS.textHeading,
					margin: 0,
				}}
			>
				{title} <span style={{ color: COLORS.accent }}>{highlight}</span>
			</h1>
			{tagline && (
				<p
					style={{
						marginTop: 20,
						marginBottom: 0,
						maxWidth: "52ch",
						fontFamily: SANS,
						fontSize: 18,
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

type StatProps = {
	label?: string;
	value?: string;
};

function Stat({ label, value }: StatProps) {
	return (
		<div style={{ padding: "8px 0" }}>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 34,
					letterSpacing: "-0.03em",
					color: COLORS.textHeading,
				}}
			>
				{value}
			</div>
			<div
				style={{
					marginTop: 4,
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

type ServiceCardProps = {
	description?: string;
	icon?: string;
	title?: string;
};

function ServiceCard({ description, icon, title }: ServiceCardProps) {
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
					width: 46,
					height: 46,
					borderRadius: 14,
					display: "grid",
					placeItems: "center",
					fontSize: 22,
					background: COLORS.accentSoft,
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
					width: 44,
					height: 44,
					borderRadius: "50%",
					display: "grid",
					placeItems: "center",
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 18,
					color: COLORS.textInverse,
					background: COLORS.accent,
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

type WorkCardProps = {
	client?: string;
	meta?: string;
	photo?: ImageURL;
	result?: string;
	title?: string;
};

function WorkCard({ client, meta, photo, result, title }: WorkCardProps) {
	return (
		<div
			style={{
				...cardStyle,
				overflow: "hidden",
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					position: "relative",
					aspectRatio: "16 / 10",
					background: `linear-gradient(135deg, ${COLORS.bgSoft} 0%, ${COLORS.accentSoft} 100%)`,
				}}
			>
				{photo?.location && (
					<img
						alt={title}
						src={photo.location}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				)}
				{client && (
					<span
						style={{
							position: "absolute",
							top: 14,
							left: 14,
							fontFamily: SANS,
							fontSize: 12,
							fontWeight: 600,
							color: COLORS.textHeading,
							background: "rgba(14, 15, 19, 0.7)",
							padding: "6px 12px",
							borderRadius: 999,
						}}
					>
						{client}
					</span>
				)}
			</div>
			<div
				style={{
					padding: "22px 22px 24px",
					display: "flex",
					flexDirection: "column",
					gap: 14,
					flex: 1,
				}}
			>
				<div style={{ display: "flex", alignItems: "baseline" }}>
					<div
						style={{
							fontFamily: DISPLAY,
							fontWeight: 600,
							fontSize: 22,
							letterSpacing: "-0.02em",
							color: COLORS.textHeading,
						}}
					>
						{title}
					</div>
				</div>
				<div
					style={{
						fontFamily: SANS,
						fontSize: 13,
						color: COLORS.textMuted,
					}}
				>
					{meta}
				</div>
				<div
					style={{
						marginTop: "auto",
						paddingTop: 14,
						borderTop: `1px solid ${COLORS.border}`,
						fontFamily: DISPLAY,
						fontWeight: 700,
						fontSize: 18,
						color: COLORS.green,
					}}
				>
					{result}
				</div>
			</div>
		</div>
	);
}

type TestimonialProps = {
	author?: string;
	quote?: string;
	rating?: number;
	role?: string;
};

function Testimonial({ author, quote, rating, role }: TestimonialProps) {
	return (
		<div
			style={{
				...cardStyle,
				height: "100%",
				padding: "26px 24px",
				display: "flex",
				flexDirection: "column",
				gap: 14,
			}}
		>
			<div style={{ color: COLORS.amber, fontSize: 16, letterSpacing: 2 }}>
				{"★".repeat(rating || 5)}
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 16,
					lineHeight: 1.7,
					color: COLORS.text,
					flex: 1,
				}}
			>
				“{quote}”
			</div>
			<div>
				<div
					style={{
						fontFamily: SANS,
						fontSize: 15,
						fontWeight: 600,
						color: COLORS.textHeading,
					}}
				>
					{author}
				</div>
				<div
					style={{ fontFamily: SANS, fontSize: 13, color: COLORS.textMuted }}
				>
					{role}
				</div>
			</div>
		</div>
	);
}

type PlanFeature = {
	text?: string;
};

type PlanProps = {
	features?: PlanFeature[];
	featured?: boolean;
	name?: string;
	price?: string;
	summary?: string;
};

function Plan({ features, featured, name, price, summary }: PlanProps) {
	return (
		<div
			style={{
				height: "100%",
				padding: "30px 28px",
				borderRadius: 20,
				display: "flex",
				flexDirection: "column",
				gap: 8,
				background: featured ? COLORS.accentSoft : COLORS.bgCard,
				border: `1px solid ${featured ? COLORS.accent : COLORS.border}`,
				boxShadow: featured ? SHADOW_MD : SHADOW_SM,
			}}
		>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 12,
					fontWeight: 600,
					letterSpacing: "0.14em",
					textTransform: "uppercase",
					color: featured ? COLORS.accent : COLORS.textMuted,
				}}
			>
				{name}
			</div>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 38,
					letterSpacing: "-0.03em",
					color: COLORS.textHeading,
				}}
			>
				{price}
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 15,
					lineHeight: 1.6,
					color: featured ? COLORS.text : COLORS.textMuted,
				}}
			>
				{summary}
			</div>
			<div
				style={{
					marginTop: 18,
					display: "flex",
					flexDirection: "column",
					gap: 10,
				}}
			>
				{(features || []).map((feature) => (
					<div
						key={feature.text}
						style={{
							display: "flex",
							alignItems: "flex-start",
							gap: 10,
							fontFamily: SANS,
							fontSize: 15,
							color: COLORS.text,
						}}
					>
						<span
							style={{
								flex: "0 0 auto",
								marginTop: 2,
								width: 18,
								height: 18,
								borderRadius: "50%",
								display: "grid",
								placeItems: "center",
								fontSize: 11,
								color: COLORS.textInverse,
								background: COLORS.greenSoft,
							}}
						>
							✓
						</span>
						{feature.text}
					</div>
				))}
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
					alignItems: "center",
					justifyContent: "space-between",
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
	note?: string;
	primary?: string;
	secondary?: string;
	subtitle?: string;
	title?: string;
};

function CtaBanner({
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
				background: `linear-gradient(135deg, ${COLORS.bgSoft} 0%, ${COLORS.accentSoft} 100%)`,
				textAlign: "center",
			}}
		>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 38,
					letterSpacing: "-0.03em",
					color: COLORS.textHeading,
				}}
			>
				{title}
			</div>
			<div
				style={{
					marginTop: 14,
					marginLeft: "auto",
					marginRight: "auto",
					maxWidth: 620,
					fontFamily: SANS,
					fontSize: 17,
					lineHeight: 1.7,
					color: COLORS.text,
				}}
			>
				{subtitle}
			</div>
			<div
				style={{
					marginTop: 28,
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
						color: COLORS.textInverse,
						background: COLORS.accent,
						padding: "15px 28px",
						borderRadius: 999,
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
						border: "1px solid rgba(255, 255, 255, 0.25)",
						padding: "15px 28px",
						borderRadius: 999,
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
				padding: "44px 40px 28px",
				borderRadius: 26,
				background: COLORS.bgSoft,
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
				<div style={{ maxWidth: 300 }}>
					<div
						style={{
							fontFamily: DISPLAY,
							fontWeight: 700,
							fontSize: 24,
							letterSpacing: "-0.02em",
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
								fontFamily: SANS,
								fontSize: 12,
								fontWeight: 600,
								letterSpacing: "0.14em",
								textTransform: "uppercase",
								color: COLORS.accent,
								marginBottom: 12,
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
					marginTop: 36,
					paddingTop: 20,
					borderTop: `1px solid ${COLORS.border}`,
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
		id: "AgencyNavbar",
		label: "Navbar",
		component: Navbar,
		group: AgencyGroup,
		props: [
			{ id: "brand", label: "Brand", type: "text", defaultValue: "Meridian" },
			{
				id: "items",
				label: "Links (comma separated)",
				type: "text",
				defaultValue: "Services, Work, Pricing, About",
			},
			{
				id: "cta",
				label: "Button",
				type: "text",
				defaultValue: "Start a project",
			},
		],
	},
	{
		id: "AgencyHeading",
		label: "Section heading",
		component: Heading,
		group: AgencyGroup,
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
				defaultValue: 36,
				min: 18,
				max: 72,
			},
		],
	},
	{
		id: "AgencyHeroTitle",
		label: "Hero title",
		component: HeroTitle,
		group: AgencyGroup,
		props: [
			{ id: "badge", label: "Badge", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "highlight", label: "Highlighted words", type: "text" },
			{ id: "tagline", label: "Tagline", type: "text" },
		],
	},
	{
		id: "AgencyStat",
		label: "Stat",
		component: Stat,
		group: AgencyGroup,
		props: [
			{ id: "value", label: "Value", type: "text" },
			{ id: "label", label: "Label", type: "text" },
		],
	},
	{
		id: "AgencyServiceCard",
		label: "Service card",
		component: ServiceCard,
		group: AgencyGroup,
		props: [
			{ id: "icon", label: "Icon (emoji)", type: "text", defaultValue: "🚀" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "AgencyStep",
		label: "Step",
		component: Step,
		group: AgencyGroup,
		props: [
			{ id: "step", label: "Number", type: "text", defaultValue: "1" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "AgencyWorkCard",
		label: "Work card",
		component: WorkCard,
		group: AgencyGroup,
		props: [
			{ id: "photo", label: "Photo", type: "img" },
			{ id: "client", label: "Client", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "meta", label: "Meta", type: "text" },
			{ id: "result", label: "Result", type: "text" },
		],
	},
	{
		id: "AgencyTestimonial",
		label: "Testimonial",
		component: Testimonial,
		group: AgencyGroup,
		props: [
			{ id: "quote", label: "Quote", type: "text" },
			{ id: "author", label: "Author", type: "text" },
			{ id: "role", label: "Role", type: "text" },
			{
				id: "rating",
				label: "Rating",
				type: "number",
				defaultValue: 5,
				min: 1,
				max: 5,
			},
		],
	},
	{
		id: "AgencyPlan",
		label: "Plan",
		component: Plan,
		group: AgencyGroup,
		props: [
			{ id: "name", label: "Name", type: "text" },
			{ id: "price", label: "Price", type: "text" },
			{ id: "summary", label: "Summary", type: "text" },
			{
				id: "features",
				label: "Features",
				type: "array",
				of: {
					id: "feature",
					label: "Feature",
					type: "object",
					of: [{ id: "text", label: "Text", type: "text" }],
				},
			},
			{ id: "featured", label: "Featured", type: "toggle" },
		],
	},
	{
		id: "AgencyFaq",
		label: "FAQ item",
		component: Faq,
		group: AgencyGroup,
		props: [
			{ id: "question", label: "Question", type: "text" },
			{ id: "answer", label: "Answer", type: "text" },
		],
	},
	{
		id: "AgencyCtaBanner",
		label: "CTA banner",
		component: CtaBanner,
		group: AgencyGroup,
		props: [
			{ id: "title", label: "Title", type: "text" },
			{ id: "subtitle", label: "Subtitle", type: "text" },
			{ id: "primary", label: "Primary button", type: "text" },
			{ id: "secondary", label: "Secondary button", type: "text" },
			{ id: "note", label: "Note", type: "text" },
		],
	},
	{
		id: "AgencyFooter",
		label: "Footer",
		component: Footer,
		group: AgencyGroup,
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

const BRAND = "Meridian";
const NAV_ITEMS = "Services, Work, Pricing, About";

const HERO_TAGLINE =
	"A product marketing studio for founders who need to grow fast. We run " +
	"positioning, brand and performance campaigns that turn curious visitors " +
	"into customers you can measure.";

const stats = [
	{ value: "120+", label: "Brands launched" },
	{ value: "3.4x", label: "Average ROAS" },
	{ value: "48", label: "Campaigns a month" },
	{ value: "4.9/5", label: "Client rating" },
];

const services = [
	{
		icon: "🎯",
		title: "Positioning & brand",
		description:
			"Sharp messaging, a flexible visual system and a narrative your whole team can repeat.",
	},
	{
		icon: "📈",
		title: "Performance marketing",
		description:
			"Paid search, social and email, optimised weekly against cost per acquisition, not vanity metrics.",
	},
	{
		icon: "✍️",
		title: "Content & SEO",
		description:
			"Programmatic articles, landing pages and product copy that rank and convert.",
	},
	{
		icon: "🎬",
		title: "Video & social",
		description:
			"Short-form video and social creative tested in short sprints so you keep what lands.",
	},
	{
		icon: "🔎",
		title: "Analytics & CRO",
		description:
			"Clear dashboards and experiments that lift conversion on the pages that already get traffic.",
	},
	{
		icon: "🤝",
		title: "Launch support",
		description:
			"A calm partner for launch weeks: go-to-market, PR and first-party audiences.",
	},
];

const steps = [
	{
		step: "1",
		title: "Discovery",
		description:
			"A week of interviews, analytics and a competitive audit to find where growth is leaking.",
	},
	{
		step: "2",
		title: "Strategy",
		description:
			"A one page plan: audience, message, channels and the three numbers we will move together.",
	},
	{
		step: "3",
		title: "Launch",
		description:
			"We build the creative and run the campaigns, shipping in two week sprints you review every Friday.",
	},
	{
		step: "4",
		title: "Scale",
		description:
			"What works gets a bigger budget. What does not, we cut fast and try the next idea.",
	},
];

const work = [
	{
		client: "Northwind SaaS",
		title: "Repositioning & paid search",
		meta: "B2B software · 6 month engagement",
		result: "+312% qualified demos",
		photo:
			"https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
	},
	{
		client: "Fern & Oak",
		title: "DTC brand relaunch",
		meta: "E-commerce · full funnel",
		result: "4.1x return on ad spend",
		photo:
			"https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
	},
	{
		client: "Cadence",
		title: "Launch of a developer tool",
		meta: "Product · go-to-market",
		result: "18k signups in 30 days",
		photo:
			"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
	},
	{
		client: "Lumen Health",
		title: "Patient acquisition",
		meta: "Healthcare · content + SEO",
		result: "210% more organic leads",
		photo:
			"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
	},
	{
		client: "Harbor Foods",
		title: "Social & short-form video",
		meta: "CPG · always-on social",
		result: "+820k views per month",
		photo:
			"https://images.unsplash.com/photo-1466667629124-7b880a20d661?auto=format&fit=crop&w=900&q=80",
	},
	{
		client: "Quill",
		title: "Funnel rebuild",
		meta: "SaaS · CRO",
		result: "+38% trial conversion",
		photo:
			"https://images.unsplash.com/photo-1472245734296-751a7b52b2fe?auto=format&fit=crop&w=900&q=80",
	},
];

const testimonials = [
	{
		quote:
			"Meridian rebuilt our messaging in two weeks. Within a quarter we tripled qualified pipelines and the team finally agrees on what we say.",
		author: "Elena Marsh",
		role: "VP Marketing, Northwind SaaS",
		rating: 5,
	},
	{
		quote:
			"They treat our budget like it is their own. Every sprint we can see exactly what moved and why. Numbers up, noise down.",
		author: "Daniel Roy",
		role: "Founder, Cadence",
		rating: 5,
	},
	{
		quote:
			"The short-form video work alone paid for the whole engagement. Our reach grew eightfold without a larger team.",
		author: "Priya Naidoo",
		role: "Head of Growth, Harbor Foods",
		rating: 5,
	},
];

const plans = [
	{
		name: "Sprint",
		price: "$3.5k",
		summary: "A focused two week push on one channel or one problem.",
		features: [
			{ text: "One channel or funnel" },
			{ text: "Weekly reporting" },
			{ text: "Shared strategy doc" },
		],
	},
	{
		name: "Growth",
		price: "$9k / mo",
		summary: "Our most popular plan for teams scaling steadily.",
		featured: true,
		features: [
			{ text: "Up to three channels" },
			{ text: "Two week sprints" },
			{ text: "Live dashboard access" },
			{ text: "Creative production included" },
			{ text: "Monthly strategy call" },
		],
	},
	{
		name: "Scale",
		price: "Custom",
		summary: "A dedicated pod for ambitious, multi-market launches.",
		features: [
			{ text: "Dedicated team" },
			{ text: "Unlimited channels" },
			{ text: "Quarterly business review" },
			{ text: "Go-to-market support" },
		],
	},
];

const faqs = [
	{
		question: "How quickly can we start?",
		answer:
			"Sprint engagements begin within a week. Growth and Scale plans include a discovery week before the first live campaign.",
	},
	{
		question: "Do you work with our budget?",
		answer:
			"Yes. We plan every sprint around a fixed ad and tool budget you approve, and you keep full access to the accounts we touch.",
	},
	{
		question: "What do you report on?",
		answer:
			"Cost per acquisition, pipeline and revenue. No vanity metrics. You get a short written summary every Friday and a live dashboard.",
	},
	{
		question: "Is there a minimum term?",
		answer:
			"Sprint is a single two week engagement with no lock-in. Growth and Scale are monthly, cancel with 30 days notice.",
	},
	{
		question: "Do you handle the creative ourselves?",
		answer:
			"On Sprint we advise and review. On Growth and Scale our in-house designers and editors produce the creative.",
	},
	{
		question: "Which industries do you know best?",
		answer:
			"SaaS, e-commerce and healthcare, but we have shipped campaigns across fintech, CPG and B2B services.",
	},
];

const footerColumns = [
	{ title: "Company", items: "About, Careers, Press, Partners" },
	{ title: "Services", items: "Positioning, Performance, Content, Video" },
	{ title: "Contact", items: "hello@meridian.studio, +1 415 552 0140" },
];

// ---------------------------------------------------------------------------
// template
// ---------------------------------------------------------------------------

const navbar = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"AgencyNavbar",
		[
			{ propId: "brand", value: BRAND },
			{ propId: "items", value: NAV_ITEMS },
			{ propId: "cta", value: "Start a project" },
		],
		options,
	);

const heroTitle = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"AgencyHeroTitle",
		[
			{ propId: "badge", value: "Product marketing studio" },
			{ propId: "title", value: "Marketing that " },
			{ propId: "highlight", value: "grows revenue." },
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
		"AgencyHeading",
		[
			{ propId: "eyebrow", value: eyebrow },
			{ propId: "title", value: title },
			{ propId: "subtitle", value: options.subtitle ?? "" },
			{ propId: "align", value: options.align ?? "left" },
			{ propId: "size", value: options.size ?? 36 },
		],
		options,
	);

const stat = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Stat${idSuffix}${index}`,
		w,
		"AgencyStat",
		[
			{ propId: "value", value: stats[index].value },
			{ propId: "label", value: stats[index].label },
		],
		options,
	);

const serviceCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Service${idSuffix}${index}`,
		w,
		"AgencyServiceCard",
		[
			{ propId: "icon", value: services[index].icon },
			{ propId: "title", value: services[index].title },
			{ propId: "description", value: services[index].description },
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
		"AgencyStep",
		[
			{ propId: "step", value: steps[index].step },
			{ propId: "title", value: steps[index].title },
			{ propId: "description", value: steps[index].description },
		],
		options,
	);

const workCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Work${idSuffix}${index}`,
		w,
		"AgencyWorkCard",
		[
			{ propId: "photo", value: { location: work[index].photo } },
			{ propId: "client", value: work[index].client },
			{ propId: "title", value: work[index].title },
			{ propId: "meta", value: work[index].meta },
			{ propId: "result", value: work[index].result },
		],
		options,
	);

const testimonialCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Testimonial${idSuffix}${index}`,
		w,
		"AgencyTestimonial",
		[
			{ propId: "quote", value: testimonials[index].quote },
			{ propId: "author", value: testimonials[index].author },
			{ propId: "role", value: testimonials[index].role },
			{ propId: "rating", value: testimonials[index].rating },
		],
		options,
	);

const planCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Plan${idSuffix}${index}`,
		w,
		"AgencyPlan",
		[
			{ propId: "name", value: plans[index].name },
			{ propId: "price", value: plans[index].price },
			{ propId: "summary", value: plans[index].summary },
			{ propId: "features", value: plans[index].features },
			{ propId: "featured", value: Boolean(plans[index].featured) },
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
		"AgencyFaq",
		[
			{ propId: "question", value: faqs[index].question },
			{ propId: "answer", value: faqs[index].answer },
		],
		options,
	);

const ctaBanner = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"AgencyCtaBanner",
		[
			{ propId: "title", value: "Let us grow your revenue" },
			{
				propId: "subtitle",
				value:
					"Book a 30 minute call. We will audit your funnel and send back a one page plan " +
					"within a week, no charge.",
			},
			{ propId: "primary", value: "Book a call" },
			{ propId: "secondary", value: "See our work" },
			{ propId: "note", value: "No pitch decks · No obligation" },
		],
		options,
	);

const footer = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"AgencyFooter",
		[
			{ propId: "brand", value: BRAND },
			{
				propId: "tagline",
				value:
					"A product marketing studio for founders who need to grow fast. " +
					"Positioning, brand and performance, measured by revenue.",
			},
			{ propId: "columns", value: footerColumns },
			{
				propId: "copyright",
				value: `© 2026 ${BRAND} Studio · All rights reserved`,
			},
		],
		options,
	);

const prose = (
	id: string,
	w: number,
	text: string,
	options: NodeOptions = {},
): Tree =>
	box(
		id,
		w,
		[
			paragraph(text, {
				fontSize: 17,
				color: COLORS.text,
				lineHeight: "1.7",
			}),
		],
		options,
	);

const statsRow = (
	idSuffix: string,
	w: number,
	options: NodeOptions = {},
): Tree =>
	row(
		`StatsRow${idSuffix}`,
		w,
		[
			column(`StatsRow${idSuffix}1`, w, [
				stat(`${idSuffix}M`, w / 2, 0),
				stat(`${idSuffix}M`, w / 2, 1),
			]),
			column(
				`StatsRow${idSuffix}2`,
				w,
				[stat(`${idSuffix}M`, w / 2, 2), stat(`${idSuffix}M`, w / 2, 3)],
				{ marginTop: 2 },
			),
		],
		options,
	);

const templateDesktop: Tree = row("agency-desktop", 24, [
	// header
	navbar("Navbar", 24, { marginTop: 2 }),
	// hero
	heading(
		"HeroHeading",
		24,
		"Product marketing studio",
		"Marketing that grows revenue.",
		{ marginTop: 4, size: 56 },
	),
	prose("HeroTagline", 24, HERO_TAGLINE, { marginTop: 2 }),
	// stats
	column(
		"StatsRow",
		24,
		[stat("D", 6, 0), stat("D", 6, 1), stat("D", 6, 2), stat("D", 6, 3)],
		{ marginTop: 4 },
	),
	// services
	heading("ServicesHeading", 24, "Services", "What we do", {
		marginTop: 8,
		align: "center",
		subtitle:
			"Full funnel marketing under one roof, from the first message to the closed deal.",
	}),
	column(
		"ServicesRow1",
		24,
		[
			serviceCard("D", 7, 0),
			serviceCard("D", 8, 1, { marginLeft: 1 }),
			serviceCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 3 },
	),
	column(
		"ServicesRow2",
		24,
		[
			serviceCard("D", 7, 3),
			serviceCard("D", 8, 4, { marginLeft: 1 }),
			serviceCard("D", 7, 5, { marginLeft: 1 }),
		],
		{ marginTop: 1 },
	),
	// process
	heading("ProcessHeading", 24, "Process", "How we work", {
		marginTop: 8,
		align: "center",
		subtitle: "A calm, weekly rhythm you can plan your quarter around.",
	}),
	column(
		"ProcessRow",
		24,
		[
			stepCard("D", 5, 0),
			stepCard("D", 5, 1, { marginLeft: 1 }),
			stepCard("D", 5, 2, { marginLeft: 2 }),
			stepCard("D", 5, 3, { marginLeft: 1 }),
		],
		{ marginTop: 3 },
	),
	// selected work
	heading("WorkHeading", 24, "Selected work", "Recent results", {
		marginTop: 8,
		align: "center",
		subtitle: "A slice of the campaigns we have shipped this year.",
	}),
	column(
		"WorkRow1",
		24,
		[
			workCard("D", 7, 0),
			workCard("D", 8, 1, { marginLeft: 1 }),
			workCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 3 },
	),
	column(
		"WorkRow2",
		24,
		[
			workCard("D", 7, 3),
			workCard("D", 8, 4, { marginLeft: 1 }),
			workCard("D", 7, 5, { marginLeft: 1 }),
		],
		{ marginTop: 1 },
	),
	// testimonials
	heading("TestimonialsHeading", 24, "Testimonials", "What clients say", {
		marginTop: 8,
		align: "center",
	}),
	column(
		"TestimonialsRow",
		24,
		[
			testimonialCard("D", 7, 0),
			testimonialCard("D", 8, 1, { marginLeft: 1 }),
			testimonialCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 3 },
	),
	// pricing
	heading("PricingHeading", 24, "Pricing", "Plans that fit your stage", {
		marginTop: 8,
		align: "center",
	}),
	column(
		"PricingRow",
		24,
		[
			planCard("D", 7, 0),
			planCard("D", 8, 1, { marginLeft: 1 }),
			planCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 3 },
	),
	// faq
	heading("FaqHeading", 24, "FAQ", "Questions we hear often", {
		marginTop: 8,
		align: "center",
	}),
	column(
		"FaqRow1",
		24,
		[faqCard("D", 11, 0), faqCard("D", 11, 1, { marginLeft: 2 })],
		{ marginTop: 3 },
	),
	column(
		"FaqRow2",
		24,
		[faqCard("D", 11, 2), faqCard("D", 11, 3, { marginLeft: 2 })],
		{ marginTop: 1 },
	),
	column(
		"FaqRow3",
		24,
		[faqCard("D", 11, 4), faqCard("D", 11, 5, { marginLeft: 2 })],
		{ marginTop: 1 },
	),
	// cta
	ctaBanner("CtaBanner", 24, { marginTop: 6 }),
	// footer
	footer("Footer", 24, { marginTop: 4, marginBottom: 2 }),
]);

const templateMobile: Tree = row("agency-mobile", 8, [
	navbar("MNavbar", 8, { marginTop: 2 }),
	heading(
		"MHeroHeading",
		8,
		"Product marketing studio",
		"Marketing that grows revenue.",
		{ marginTop: 3, size: 34 },
	),
	prose("MHeroTagline", 8, HERO_TAGLINE, { marginTop: 1 }),
	statsRow("M", 8, { marginTop: 3 }),
	heading("MServicesHeading", 8, "Services", "What we do", {
		marginTop: 5,
		align: "center",
		size: 30,
	}),
	serviceCard("M", 8, 0, { marginTop: 2 }),
	serviceCard("M", 8, 1, { marginTop: 1 }),
	serviceCard("M", 8, 2, { marginTop: 1 }),
	serviceCard("M", 8, 3, { marginTop: 1 }),
	serviceCard("M", 8, 4, { marginTop: 1 }),
	serviceCard("M", 8, 5, { marginTop: 1 }),
	heading("MProcessHeading", 8, "Process", "How we work", {
		marginTop: 5,
		align: "center",
		size: 30,
	}),
	stepCard("M", 8, 0, { marginTop: 2 }),
	stepCard("M", 8, 1, { marginTop: 1 }),
	stepCard("M", 8, 2, { marginTop: 1 }),
	stepCard("M", 8, 3, { marginTop: 1 }),
	heading("MWorkHeading", 8, "Selected work", "Recent results", {
		marginTop: 5,
		align: "center",
		size: 30,
	}),
	workCard("M", 8, 0, { marginTop: 2 }),
	workCard("M", 8, 1, { marginTop: 1 }),
	workCard("M", 8, 2, { marginTop: 1 }),
	workCard("M", 8, 3, { marginTop: 1 }),
	workCard("M", 8, 4, { marginTop: 1 }),
	workCard("M", 8, 5, { marginTop: 1 }),
	heading("MTestimonialsHeading", 8, "Testimonials", "What clients say", {
		marginTop: 5,
		align: "center",
		size: 30,
	}),
	testimonialCard("M", 8, 0, { marginTop: 2 }),
	testimonialCard("M", 8, 1, { marginTop: 1 }),
	testimonialCard("M", 8, 2, { marginTop: 1 }),
	heading("MPricingHeading", 8, "Pricing", "Plans that fit your stage", {
		marginTop: 5,
		align: "center",
		size: 30,
	}),
	planCard("M", 8, 0, { marginTop: 2 }),
	planCard("M", 8, 1, { marginTop: 1 }),
	planCard("M", 8, 2, { marginTop: 1 }),
	heading("MFaqHeading", 8, "FAQ", "Questions we hear often", {
		marginTop: 5,
		align: "center",
		size: 30,
	}),
	faqCard("M", 8, 0, { marginTop: 2 }),
	faqCard("M", 8, 1, { marginTop: 1 }),
	faqCard("M", 8, 2, { marginTop: 1 }),
	faqCard("M", 8, 3, { marginTop: 1 }),
	faqCard("M", 8, 4, { marginTop: 1 }),
	faqCard("M", 8, 5, { marginTop: 1 }),
	ctaBanner("MCtaBanner", 8, { marginTop: 3 }),
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

export function MarketingAgency() {
	const [page] = useState<Page>(() => {
		const pageFromLocalStorage = JSON.parse(
			localStorage.getItem("marketing-agency-page-draft"),
		) as Page;
		if (pageFromLocalStorage) return pageFromLocalStorage;
		return template;
	});

	const onPublish = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem(
					"marketing-agency-page-published",
					JSON.stringify(nextPage),
				);
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onSaveAsDraft = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem(
					"marketing-agency-page-draft",
					JSON.stringify(nextPage),
				);
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
			fonts={agencyFonts}
		/>
	);
}

const meta = {
	component: MarketingAgency,
	parameters: {
		layout: "fullscreen",
		options: { showPanel: false },
	},
	title: "WebBuilder/Templates/MarketingAgency",
};

export default meta;
