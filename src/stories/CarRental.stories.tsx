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

// A car rental landing page: search bar, fleet, how it works, pricing,
// insurance add ons, locations, reviews, FAQ and contact.
//
// Most of the page is built from components that ship with this story,
// so every block stays editable in the builder sidebar.

const DISPLAY = '"Sora", "Inter", -apple-system, sans-serif';
const SANS = '"Inter", -apple-system, "Segoe UI", Roboto, sans-serif';

const COLORS = {
	bg: "#f5f7fb",
	bgCard: "#ffffff",
	bgDeep: "#0d1424",
	bgDeepSoft: "#182236",
	text: "#4a5568",
	textHeading: "#0d1424",
	textMuted: "#7a879b",
	textInverse: "#eef2f9",
	border: "#e3e8f0",
	accent: "#2563eb",
	accentDeep: "#1d4ed8",
	accentSoft: "#e6edfe",
	amber: "#f59e0b",
	amberSoft: "#fef3c7",
	green: "#059669",
	greenSoft: "#d1fae5",
};

const SHADOW_SM =
	"0 1px 2px rgba(13, 20, 36, 0.04), 0 4px 12px rgba(13, 20, 36, 0.05)";
const SHADOW_MD =
	"0 8px 24px rgba(13, 20, 36, 0.08), 0 24px 48px rgba(13, 20, 36, 0.06)";

const rentalFonts: FontImport[] = [
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

const RentalGroup = { id: "rental", label: "Car rental" };

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
	phone?: string;
};

function Navbar({ brand, cta, items, phone }: NavbarProps) {
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
							color: COLORS.text,
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
				{phone && (
					<span
						style={{
							fontFamily: SANS,
							fontSize: 14,
							fontWeight: 600,
							color: COLORS.textHeading,
							whiteSpace: "nowrap",
						}}
					>
						{phone}
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
						color: COLORS.accentDeep,
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

type SearchField = {
	label?: string;
	value?: string;
};

type SearchBarProps = {
	fields?: SearchField[];
	submitLabel?: string;
};

function SearchBar({ fields, submitLabel }: SearchBarProps) {
	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				alignItems: "flex-end",
				gap: 12,
				padding: 16,
				borderRadius: 20,
				...cardStyle,
				boxShadow: SHADOW_MD,
			}}
		>
			{(fields || []).map((field) => (
				<div
					key={field.label}
					style={{
						flex: "1 1 160px",
						display: "flex",
						flexDirection: "column",
						gap: 6,
						padding: "12px 16px",
						borderRadius: 14,
						background: COLORS.bg,
						border: `1px solid ${COLORS.border}`,
					}}
				>
					<span
						style={{
							fontFamily: SANS,
							fontSize: 11,
							fontWeight: 600,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							color: COLORS.textMuted,
						}}
					>
						{field.label}
					</span>
					<span
						style={{
							fontFamily: SANS,
							fontSize: 15,
							fontWeight: 500,
							color: COLORS.textHeading,
						}}
					>
						{field.value}
					</span>
				</div>
			))}
			<span
				style={{
					flex: "0 0 auto",
					fontFamily: SANS,
					fontSize: 15,
					fontWeight: 600,
					color: "#fff",
					background: COLORS.accent,
					padding: "18px 28px",
					borderRadius: 14,
				}}
			>
				{submitLabel}
			</span>
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

type CarCardProps = {
	badge?: string;
	category?: string;
	fuel?: string;
	luggage?: string;
	name?: string;
	photo?: ImageURL;
	price?: string;
	seats?: string;
	transmission?: string;
};

function CarCard({
	badge,
	category,
	fuel,
	luggage,
	name,
	photo,
	price,
	seats,
	transmission,
}: CarCardProps) {
	const specs = [
		["Seats", seats],
		["Luggage", luggage],
		["Gearbox", transmission],
		["Fuel", fuel],
	].filter(([, value]) => Boolean(value));

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
					background: `linear-gradient(135deg, ${COLORS.bg} 0%, #dde5f2 100%)`,
				}}
			>
				{photo?.location && (
					<img
						alt={name}
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
				{badge && (
					<span
						style={{
							position: "absolute",
							top: 14,
							left: 14,
							fontFamily: SANS,
							fontSize: 12,
							fontWeight: 600,
							color: COLORS.textHeading,
							background: COLORS.amberSoft,
							padding: "6px 12px",
							borderRadius: 999,
						}}
					>
						{badge}
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
				<div>
					<div
						style={{
							fontFamily: SANS,
							fontSize: 12,
							fontWeight: 600,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							color: COLORS.textMuted,
						}}
					>
						{category}
					</div>
					<div
						style={{
							marginTop: 4,
							fontFamily: DISPLAY,
							fontWeight: 600,
							fontSize: 22,
							letterSpacing: "-0.02em",
							color: COLORS.textHeading,
						}}
					>
						{name}
					</div>
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 8,
					}}
				>
					{specs.map(([label, value]) => (
						<div
							key={label}
							style={{
								fontFamily: SANS,
								fontSize: 13,
								color: COLORS.text,
							}}
						>
							<span style={{ color: COLORS.textMuted }}>{label}: </span>
							<strong style={{ fontWeight: 600 }}>{value}</strong>
						</div>
					))}
				</div>
				<div
					style={{
						marginTop: "auto",
						paddingTop: 14,
						borderTop: `1px solid ${COLORS.border}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 12,
					}}
				>
					<span
						style={{
							fontFamily: DISPLAY,
							fontWeight: 700,
							fontSize: 22,
							color: COLORS.textHeading,
						}}
					>
						{price}
						<span
							style={{
								fontFamily: SANS,
								fontSize: 13,
								fontWeight: 500,
								color: COLORS.textMuted,
							}}
						>
							{" "}
							/ day
						</span>
					</span>
					<span
						style={{
							fontFamily: SANS,
							fontSize: 14,
							fontWeight: 600,
							color: "#fff",
							background: COLORS.textHeading,
							padding: "10px 18px",
							borderRadius: 999,
						}}
					>
						Book
					</span>
				</div>
			</div>
		</div>
	);
}

type IconCardProps = {
	description?: string;
	icon?: string;
	title?: string;
};

function IconCard({ description, icon, title }: IconCardProps) {
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
					color: "#fff",
					background: COLORS.textHeading,
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
				background: featured ? COLORS.bgDeep : COLORS.bgCard,
				border: `1px solid ${featured ? COLORS.bgDeep : COLORS.border}`,
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
					color: featured ? "#93b4fd" : COLORS.accent,
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
					color: featured ? "#fff" : COLORS.textHeading,
				}}
			>
				{price}
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 15,
					lineHeight: 1.6,
					color: featured ? "#b7c4da" : COLORS.textMuted,
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
							color: featured ? COLORS.textInverse : COLORS.text,
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
								color: featured ? COLORS.bgDeep : COLORS.green,
								background: featured ? "#93b4fd" : COLORS.greenSoft,
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

type LocationProps = {
	address?: string;
	city?: string;
	hours?: string;
	tag?: string;
};

function Location({ address, city, hours, tag }: LocationProps) {
	return (
		<div
			style={{
				...cardStyle,
				height: "100%",
				padding: "24px 22px",
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
					gap: 10,
				}}
			>
				<span
					style={{
						fontFamily: DISPLAY,
						fontWeight: 600,
						fontSize: 20,
						color: COLORS.textHeading,
					}}
				>
					{city}
				</span>
				{tag && (
					<span
						style={{
							fontFamily: SANS,
							fontSize: 12,
							fontWeight: 600,
							color: COLORS.green,
							background: COLORS.greenSoft,
							padding: "4px 10px",
							borderRadius: 999,
						}}
					>
						{tag}
					</span>
				)}
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 15,
					lineHeight: 1.6,
					color: COLORS.textMuted,
				}}
			>
				{address}
			</div>
			<div
				style={{
					marginTop: "auto",
					paddingTop: 12,
					fontFamily: SANS,
					fontSize: 14,
					color: COLORS.text,
				}}
			>
				{hours}
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
				background: `linear-gradient(135deg, ${COLORS.bgDeep} 0%, ${COLORS.bgDeepSoft} 60%, ${COLORS.accentDeep} 100%)`,
				textAlign: "center",
			}}
		>
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 700,
					fontSize: 38,
					letterSpacing: "-0.03em",
					color: "#fff",
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
					color: "#c3cfe3",
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
						color: COLORS.bgDeep,
						background: "#fff",
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
						color: "#fff",
						border: "1px solid rgba(255, 255, 255, 0.4)",
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
						color: "#9aa9c2",
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
				background: COLORS.bgDeep,
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
							color: "#fff",
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
							color: "#9aa9c2",
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
								color: "#93b4fd",
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
											color: COLORS.textInverse,
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
					borderTop: "1px solid rgba(255, 255, 255, 0.12)",
					textAlign: "center",
					fontFamily: SANS,
					fontSize: 13,
					color: "#7a879b",
				}}
			>
				{copyright}
			</div>
		</div>
	);
}

const components: WebBuilderComponent[] = [
	{
		id: "RentalNavbar",
		label: "Navbar",
		component: Navbar,
		group: RentalGroup,
		props: [
			{ id: "brand", label: "Brand", type: "text", defaultValue: "Driveline" },
			{
				id: "items",
				label: "Links (comma separated)",
				type: "text",
				defaultValue: "Fleet, Pricing, Locations",
			},
			{ id: "phone", label: "Phone", type: "text" },
			{ id: "cta", label: "Button", type: "text", defaultValue: "Book now" },
		],
	},
	{
		id: "RentalHeading",
		label: "Section heading",
		component: Heading,
		group: RentalGroup,
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
		id: "RentalHeroTitle",
		label: "Hero title",
		component: HeroTitle,
		group: RentalGroup,
		props: [
			{ id: "badge", label: "Badge", type: "text" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "highlight", label: "Highlighted words", type: "text" },
			{ id: "tagline", label: "Tagline", type: "text" },
		],
	},
	{
		id: "RentalSearchBar",
		label: "Search bar",
		component: SearchBar,
		group: RentalGroup,
		props: [
			{
				id: "fields",
				label: "Fields",
				type: "array",
				of: {
					id: "field",
					label: "Field",
					type: "object",
					of: [
						{ id: "label", label: "Label", type: "text" },
						{ id: "value", label: "Value", type: "text" },
					],
				},
			},
			{
				id: "submitLabel",
				label: "Button",
				type: "text",
				defaultValue: "Search cars",
			},
		],
	},
	{
		id: "RentalStat",
		label: "Stat",
		component: Stat,
		group: RentalGroup,
		props: [
			{ id: "value", label: "Value", type: "text" },
			{ id: "label", label: "Label", type: "text" },
		],
	},
	{
		id: "RentalCarCard",
		label: "Car card",
		component: CarCard,
		group: RentalGroup,
		props: [
			{ id: "photo", label: "Photo", type: "img" },
			{ id: "category", label: "Category", type: "text" },
			{ id: "name", label: "Name", type: "text" },
			{ id: "price", label: "Price", type: "text" },
			{ id: "seats", label: "Seats", type: "text" },
			{ id: "luggage", label: "Luggage", type: "text" },
			{ id: "transmission", label: "Gearbox", type: "text" },
			{ id: "fuel", label: "Fuel", type: "text" },
			{ id: "badge", label: "Badge", type: "text" },
		],
	},
	{
		id: "RentalIconCard",
		label: "Icon card",
		component: IconCard,
		group: RentalGroup,
		props: [
			{ id: "icon", label: "Icon (emoji)", type: "text", defaultValue: "🚗" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "RentalStep",
		label: "Step",
		component: Step,
		group: RentalGroup,
		props: [
			{ id: "step", label: "Number", type: "text", defaultValue: "1" },
			{ id: "title", label: "Title", type: "text" },
			{ id: "description", label: "Description", type: "text" },
		],
	},
	{
		id: "RentalPlan",
		label: "Plan",
		component: Plan,
		group: RentalGroup,
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
		id: "RentalTestimonial",
		label: "Testimonial",
		component: Testimonial,
		group: RentalGroup,
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
		id: "RentalLocation",
		label: "Location",
		component: Location,
		group: RentalGroup,
		props: [
			{ id: "city", label: "City", type: "text" },
			{ id: "address", label: "Address", type: "text" },
			{ id: "hours", label: "Opening hours", type: "text" },
			{ id: "tag", label: "Tag", type: "text" },
		],
	},
	{
		id: "RentalFaq",
		label: "FAQ item",
		component: Faq,
		group: RentalGroup,
		props: [
			{ id: "question", label: "Question", type: "text" },
			{ id: "answer", label: "Answer", type: "text" },
		],
	},
	{
		id: "RentalCtaBanner",
		label: "CTA banner",
		component: CtaBanner,
		group: RentalGroup,
		props: [
			{ id: "title", label: "Title", type: "text" },
			{ id: "subtitle", label: "Subtitle", type: "text" },
			{ id: "primary", label: "Primary button", type: "text" },
			{ id: "secondary", label: "Secondary button", type: "text" },
			{ id: "note", label: "Note", type: "text" },
		],
	},
	{
		id: "RentalFooter",
		label: "Footer",
		component: Footer,
		group: RentalGroup,
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

const BRAND = "Driveline";
const NAV_ITEMS = "Fleet, How it works, Pricing, Locations, Support";

const HERO_TAGLINE =
	"Pick up a fully insured car in under five minutes. Free cancellation up to " +
	"24 hours before your booking, unlimited mileage on weekly rentals and no " +
	"deposit on most of the fleet.";

const searchFields = [
	{ label: "Pick-up location", value: "Kraków — Balice Airport" },
	{ label: "Pick-up date", value: "Mon, 24 Aug · 10:00" },
	{ label: "Return date", value: "Fri, 28 Aug · 10:00" },
	{ label: "Driver age", value: "25+" },
];

const stats = [
	{ value: "1,200+", label: "Cars in the fleet" },
	{ value: "18", label: "Pick-up points" },
	{ value: "4.9/5", label: "Average rating" },
	{ value: "5 min", label: "Average pick-up time" },
];

const cars = [
	{
		name: "Toyota Corolla",
		category: "Compact",
		price: "€34",
		seats: "5",
		luggage: "2 bags",
		transmission: "Automatic",
		fuel: "Hybrid",
		badge: "Most booked",
		photo:
			"https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Volkswagen Passat",
		category: "Estate",
		price: "€49",
		seats: "5",
		luggage: "4 bags",
		transmission: "Automatic",
		fuel: "Diesel",
		photo:
			"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Tesla Model 3",
		category: "Electric",
		price: "€69",
		seats: "5",
		luggage: "3 bags",
		transmission: "Automatic",
		fuel: "Electric",
		badge: "Free charging",
		photo:
			"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Volvo XC60",
		category: "SUV",
		price: "€79",
		seats: "5",
		luggage: "4 bags",
		transmission: "Automatic",
		fuel: "Petrol",
		photo:
			"https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Mercedes V-Class",
		category: "Van",
		price: "€109",
		seats: "8",
		luggage: "6 bags",
		transmission: "Automatic",
		fuel: "Diesel",
		badge: "Great for groups",
		photo:
			"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Porsche 911",
		category: "Premium",
		price: "€249",
		seats: "2",
		luggage: "1 bag",
		transmission: "Automatic",
		fuel: "Petrol",
		photo:
			"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
	},
];

const benefits = [
	{
		icon: "🛡️",
		title: "Insurance included",
		description:
			"Third party liability and collision damage waiver are part of every rate. Add zero excess for €9 a day.",
	},
	{
		icon: "⏱️",
		title: "Skip the counter",
		description:
			"Check in from your phone, scan your licence once and unlock the car with a code at the parking bay.",
	},
	{
		icon: "🔁",
		title: "Free cancellation",
		description:
			"Cancel or move your booking up to 24 hours before pick-up and get the full amount back.",
	},
	{
		icon: "🛣️",
		title: "Unlimited mileage",
		description:
			"All rentals of five days or longer come with unlimited kilometres across the European Union.",
	},
	{
		icon: "🧰",
		title: "24/7 roadside help",
		description:
			"One number, answered in under a minute, with a replacement car anywhere in the country.",
	},
	{
		icon: "🌱",
		title: "Low emission fleet",
		description:
			"Half of the fleet is hybrid or fully electric, and every rental is carbon offset by default.",
	},
];

const steps = [
	{
		step: "1",
		title: "Choose your car",
		description:
			"Filter by size, gearbox or fuel and see the final price with taxes and insurance already included.",
	},
	{
		step: "2",
		title: "Confirm in 2 minutes",
		description:
			"Upload your licence once. We keep it on file, so the next booking takes a single tap.",
	},
	{
		step: "3",
		title: "Pick up and drive",
		description:
			"Open the app at the bay, unlock the car and go. No queue, no paperwork, no deposit hold.",
	},
	{
		step: "4",
		title: "Return anywhere",
		description:
			"Drop the car at any of our 18 points. The invoice lands in your inbox within an hour.",
	},
];

const plans = [
	{
		name: "Daily",
		price: "€34",
		summary: "For a weekend trip or a single day of errands.",
		features: [
			{ text: "Basic insurance included" },
			{ text: "300 km per day" },
			{ text: "Free cancellation" },
			{ text: "One additional driver" },
		],
	},
	{
		name: "Weekly",
		price: "€189",
		summary: "The best rate for holidays and longer trips.",
		featured: true,
		features: [
			{ text: "Full insurance, zero excess" },
			{ text: "Unlimited mileage" },
			{ text: "Free cancellation" },
			{ text: "Two additional drivers" },
			{ text: "Airport pick-up included" },
		],
	},
	{
		name: "Monthly",
		price: "€590",
		summary: "A subscription instead of owning a second car.",
		features: [
			{ text: "Full insurance, zero excess" },
			{ text: "Unlimited mileage" },
			{ text: "Servicing and tyres on us" },
			{ text: "Swap the car once a month" },
		],
	},
];

const testimonials = [
	{
		quote:
			"Picked the car up at the airport at midnight and was on the motorway ten minutes later. The app did everything.",
		author: "Marta Kowalczyk",
		role: "Booked a Toyota Corolla",
		rating: 5,
	},
	{
		quote:
			"We rent vans for the crew every other week. One invoice, no deposits, and the cars are always clean.",
		author: "Tomasz Nowak",
		role: "Production manager",
		rating: 5,
	},
	{
		quote:
			"Had a flat tyre near Katowice on a Sunday. A replacement car reached me in forty minutes.",
		author: "Julia Baran",
		role: "Booked a Volvo XC60",
		rating: 5,
	},
];

const locations = [
	{
		city: "Kraków",
		address: "Balice Airport, Terminal 1, level P2",
		hours: "Open 24/7",
		tag: "Airport",
	},
	{
		city: "Warsaw",
		address: "Chopin Airport and Śródmieście, Emilii Plater 12",
		hours: "06:00 – 23:00",
		tag: "2 points",
	},
	{
		city: "Gdańsk",
		address: "Lech Wałęsa Airport, arrivals hall",
		hours: "Open 24/7",
		tag: "Airport",
	},
	{
		city: "Wrocław",
		address: "Plac Grunwaldzki 22, underground parking",
		hours: "07:00 – 22:00",
	},
];

const faqs = [
	{
		question: "What do I need to rent a car?",
		answer:
			"A driving licence held for at least a year, an ID or passport and a payment card in the main driver's name.",
	},
	{
		question: "Is there a deposit?",
		answer:
			"No deposit on compact, estate and electric cars. Premium models have a €500 hold released at return.",
	},
	{
		question: "Can I drive abroad?",
		answer:
			"Yes, anywhere in the European Union at no extra charge. Let us know if you plan to cross into Ukraine or the Balkans.",
	},
	{
		question: "What happens if I return the car late?",
		answer:
			"The first hour is free, after that we bill each started hour at a tenth of the daily rate, capped at one extra day.",
	},
	{
		question: "Do you rent to drivers under 25?",
		answer:
			"Yes, from 21 years old with a young driver fee of €6 a day. Premium cars start at 27.",
	},
	{
		question: "Is fuel included?",
		answer:
			"You get the car with a full tank and return it full. Electric cars come charged and include a charging card.",
	},
];

const footerColumns = [
	{ title: "Company", items: "About us, Careers, Press, Partners" },
	{ title: "Rentals", items: "Fleet, Long term, Business, Airport pick-up" },
	{ title: "Support", items: "Help centre, Terms, Privacy, Contact" },
];

// ---------------------------------------------------------------------------
// template
// ---------------------------------------------------------------------------

const navbar = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"RentalNavbar",
		[
			{ propId: "brand", value: BRAND },
			{ propId: "items", value: NAV_ITEMS },
			{ propId: "phone", value: "+48 800 120 120" },
			{ propId: "cta", value: "Book now" },
		],
		options,
	);

const heroTitle = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"RentalHeroTitle",
		[
			{ propId: "badge", value: "No deposit · Free cancellation" },
			{ propId: "title", value: "Rent a car" },
			{ propId: "highlight", value: "without the paperwork." },
			{ propId: "tagline", value: HERO_TAGLINE },
		],
		options,
	);

const searchBar = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"RentalSearchBar",
		[
			{ propId: "fields", value: searchFields },
			{ propId: "submitLabel", value: "Search cars" },
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
		"RentalHeading",
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
		"RentalStat",
		[
			{ propId: "value", value: stats[index].value },
			{ propId: "label", value: stats[index].label },
		],
		options,
	);

const carCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Car${idSuffix}${index}`,
		w,
		"RentalCarCard",
		[
			{ propId: "photo", value: { location: cars[index].photo } },
			{ propId: "category", value: cars[index].category },
			{ propId: "name", value: cars[index].name },
			{ propId: "price", value: cars[index].price },
			{ propId: "seats", value: cars[index].seats },
			{ propId: "luggage", value: cars[index].luggage },
			{ propId: "transmission", value: cars[index].transmission },
			{ propId: "fuel", value: cars[index].fuel },
			{ propId: "badge", value: cars[index].badge ?? "" },
		],
		options,
	);

const benefitCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Benefit${idSuffix}${index}`,
		w,
		"RentalIconCard",
		[
			{ propId: "icon", value: benefits[index].icon },
			{ propId: "title", value: benefits[index].title },
			{ propId: "description", value: benefits[index].description },
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
		"RentalStep",
		[
			{ propId: "step", value: steps[index].step },
			{ propId: "title", value: steps[index].title },
			{ propId: "description", value: steps[index].description },
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
		"RentalPlan",
		[
			{ propId: "name", value: plans[index].name },
			{ propId: "price", value: plans[index].price },
			{ propId: "summary", value: plans[index].summary },
			{ propId: "features", value: plans[index].features },
			{ propId: "featured", value: Boolean(plans[index].featured) },
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
		"RentalTestimonial",
		[
			{ propId: "quote", value: testimonials[index].quote },
			{ propId: "author", value: testimonials[index].author },
			{ propId: "role", value: testimonials[index].role },
			{ propId: "rating", value: testimonials[index].rating },
		],
		options,
	);

const locationCard = (
	idSuffix: string,
	w: number,
	index: number,
	options: NodeOptions = {},
): Tree =>
	node(
		`Location${idSuffix}${index}`,
		w,
		"RentalLocation",
		[
			{ propId: "city", value: locations[index].city },
			{ propId: "address", value: locations[index].address },
			{ propId: "hours", value: locations[index].hours },
			{ propId: "tag", value: locations[index].tag ?? "" },
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
		"RentalFaq",
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
		"RentalCtaBanner",
		[
			{ propId: "title", value: "Your car is ready when you are" },
			{
				propId: "subtitle",
				value:
					"Book in two minutes, pick up at any of our 18 points and drive away " +
					"with insurance, breakdown cover and a full tank included.",
			},
			{ propId: "primary", value: "Book a car" },
			{ propId: "secondary", value: "Talk to sales" },
			{ propId: "note", value: "No deposit · Free cancellation for 24 hours" },
		],
		options,
	);

const footer = (id: string, w: number, options: NodeOptions = {}): Tree =>
	node(
		id,
		w,
		"RentalFooter",
		[
			{ propId: "brand", value: BRAND },
			{
				propId: "tagline",
				value:
					"Car rental across Poland since 2014. Fully insured, fully digital, " +
					"available around the clock.",
			},
			{ propId: "columns", value: footerColumns },
			{
				propId: "copyright",
				value: `© 2026 ${BRAND} sp. z o.o. · All rights reserved`,
			},
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
				value: { location: options.href ?? "", openInNewTab: true },
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
					radius: 999,
					color: options.ghost ? COLORS.border : COLORS.accent,
				},
			},
			{ propId: "boxShadow", value: "" },
		],
		options,
	);

const templateDesktop: Tree = row("rental-desktop", 24, [
	navbar("Navbar", 24, { marginTop: 2 }),
	// hero
	column(
		"HeroRow",
		24,
		[
			row("HeroText", 13, [
				heroTitle("HeroTitle", 13),
				column(
					"HeroButtons",
					13,
					[
						ctaButton("HeroCta", 6, "Find a car"),
						ctaButton("HeroCtaGhost", 6, "See the fleet", {
							ghost: true,
							marginLeft: 1,
						}),
					],
					{ marginTop: 3 },
				),
			]),
			node(
				"HeroImage",
				10,
				"Image",
				[
					{
						propId: "url",
						value: {
							location:
								"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
						},
					},
					{ propId: "href", value: { location: "", openInNewTab: true } },
					{
						propId: "border",
						value: {
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
							radius: 24,
							color: "transparent",
						},
					},
					{ propId: "boxShadow", value: SHADOW_MD },
				],
				{ marginLeft: 1 },
			),
		],
		{ marginTop: 4 },
	),
	searchBar("SearchBar", 24, { marginTop: 3 }),
	// stats
	column(
		"StatsRow",
		24,
		[
			stat("D", 5, 0),
			stat("D", 5, 1, { marginLeft: 1 }),
			stat("D", 5, 2, { marginLeft: 2 }),
			stat("D", 5, 3, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// fleet
	heading("FleetHeading", 24, "The fleet", "Pick the car that fits the trip", {
		marginTop: 6,
		align: "center",
		subtitle:
			"Every price below includes insurance, VAT and roadside assistance. " +
			"No hidden fees at the counter, because there is no counter.",
	}),
	column(
		"FleetRow1",
		24,
		[
			carCard("D", 7, 0),
			carCard("D", 8, 1, { marginLeft: 1 }),
			carCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	column(
		"FleetRow2",
		24,
		[
			carCard("D", 7, 3),
			carCard("D", 8, 4, { marginLeft: 1 }),
			carCard("D", 7, 5, { marginLeft: 1 }),
		],
		{ marginTop: 2 },
	),
	// benefits
	heading(
		"BenefitsHeading",
		24,
		"Why Driveline",
		"Rental without the small print",
		{
			marginTop: 7,
			align: "center",
		},
	),
	column(
		"BenefitsRow1",
		24,
		[
			benefitCard("D", 7, 0),
			benefitCard("D", 8, 1, { marginLeft: 1 }),
			benefitCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	column(
		"BenefitsRow2",
		24,
		[
			benefitCard("D", 7, 3),
			benefitCard("D", 8, 4, { marginLeft: 1 }),
			benefitCard("D", 7, 5, { marginLeft: 1 }),
		],
		{ marginTop: 2 },
	),
	// how it works
	heading("StepsHeading", 24, "How it works", "From booking to the motorway", {
		marginTop: 7,
	}),
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
	// pricing
	heading("PricingHeading", 24, "Pricing", "One rate, everything included", {
		marginTop: 7,
		align: "center",
		subtitle:
			"Rates for a compact car. Larger cars follow the same structure, and the " +
			"longer you rent, the lower the daily price.",
	}),
	column(
		"PricingRow",
		24,
		[
			planCard("D", 7, 0),
			planCard("D", 8, 1, { marginLeft: 1 }),
			planCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// reviews
	heading("ReviewsHeading", 24, "Reviews", "4.9 out of 5 from 12,400 rentals", {
		marginTop: 7,
	}),
	column(
		"ReviewsRow",
		24,
		[
			testimonialCard("D", 7, 0),
			testimonialCard("D", 8, 1, { marginLeft: 1 }),
			testimonialCard("D", 7, 2, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// locations
	heading(
		"LocationsHeading",
		24,
		"Locations",
		"18 pick-up points across Poland",
		{
			marginTop: 7,
		},
	),
	column(
		"LocationsRow",
		24,
		[
			locationCard("D", 5, 0),
			locationCard("D", 5, 1, { marginLeft: 1 }),
			locationCard("D", 5, 2, { marginLeft: 2 }),
			locationCard("D", 5, 3, { marginLeft: 1 }),
		],
		{ marginTop: 4 },
	),
	// faq
	heading("FaqHeading", 24, "FAQ", "Questions we get every day", {
		marginTop: 7,
	}),
	column(
		"FaqRow1",
		24,
		[faqCard("D", 11, 0), faqCard("D", 11, 1, { marginLeft: 2 })],
		{ marginTop: 4 },
	),
	column(
		"FaqRow2",
		24,
		[faqCard("D", 11, 2), faqCard("D", 11, 3, { marginLeft: 2 })],
		{ marginTop: 2 },
	),
	column(
		"FaqRow3",
		24,
		[faqCard("D", 11, 4), faqCard("D", 11, 5, { marginLeft: 2 })],
		{ marginTop: 2 },
	),
	ctaBanner("CtaBanner", 24, { marginTop: 7 }),
	footer("Footer", 24, { marginTop: 3, marginBottom: 2 }),
]);

const templateMobile: Tree = row("rental-mobile", 8, [
	navbar("MNavbar", 8, { marginTop: 2 }),
	heroTitle("MHeroTitle", 8, { marginTop: 3 }),
	ctaButton("MHeroCta", 8, "Find a car", { marginTop: 3 }),
	ctaButton("MHeroCtaGhost", 8, "See the fleet", { marginTop: 1, ghost: true }),
	node(
		"MHeroImage",
		8,
		"Image",
		[
			{
				propId: "url",
				value: {
					location:
						"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
				},
			},
			{ propId: "href", value: { location: "", openInNewTab: true } },
			{
				propId: "border",
				value: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					radius: 20,
					color: "transparent",
				},
			},
			{ propId: "boxShadow", value: SHADOW_MD },
		],
		{ marginTop: 3 },
	),
	searchBar("MSearchBar", 8, { marginTop: 3 }),
	column("MStatsRow1", 8, [stat("M", 4, 0), stat("M", 4, 1)], { marginTop: 3 }),
	column("MStatsRow2", 8, [stat("M", 4, 2), stat("M", 4, 3)], { marginTop: 1 }),
	heading("MFleetHeading", 8, "The fleet", "Pick the car that fits the trip", {
		marginTop: 5,
		size: 28,
		subtitle: "Every price includes insurance, VAT and roadside assistance.",
	}),
	carCard("M", 8, 0, { marginTop: 3 }),
	carCard("M", 8, 1, { marginTop: 2 }),
	carCard("M", 8, 2, { marginTop: 2 }),
	carCard("M", 8, 3, { marginTop: 2 }),
	heading(
		"MBenefitsHeading",
		8,
		"Why Driveline",
		"Rental without the small print",
		{
			marginTop: 5,
			size: 28,
		},
	),
	benefitCard("M", 8, 0, { marginTop: 3 }),
	benefitCard("M", 8, 1, { marginTop: 2 }),
	benefitCard("M", 8, 2, { marginTop: 2 }),
	benefitCard("M", 8, 3, { marginTop: 2 }),
	heading("MStepsHeading", 8, "How it works", "From booking to the motorway", {
		marginTop: 5,
		size: 28,
	}),
	stepCard("M", 8, 0, { marginTop: 3 }),
	stepCard("M", 8, 1, { marginTop: 2 }),
	stepCard("M", 8, 2, { marginTop: 2 }),
	stepCard("M", 8, 3, { marginTop: 2 }),
	heading("MPricingHeading", 8, "Pricing", "One rate, everything included", {
		marginTop: 5,
		size: 28,
	}),
	planCard("M", 8, 0, { marginTop: 3 }),
	planCard("M", 8, 1, { marginTop: 2 }),
	planCard("M", 8, 2, { marginTop: 2 }),
	heading("MReviewsHeading", 8, "Reviews", "4.9 out of 5 from 12,400 rentals", {
		marginTop: 5,
		size: 28,
	}),
	testimonialCard("M", 8, 0, { marginTop: 3 }),
	testimonialCard("M", 8, 1, { marginTop: 2 }),
	testimonialCard("M", 8, 2, { marginTop: 2 }),
	heading("MLocationsHeading", 8, "Locations", "18 pick-up points in Poland", {
		marginTop: 5,
		size: 28,
	}),
	locationCard("M", 8, 0, { marginTop: 3 }),
	locationCard("M", 8, 1, { marginTop: 2 }),
	locationCard("M", 8, 2, { marginTop: 2 }),
	locationCard("M", 8, 3, { marginTop: 2 }),
	heading("MFaqHeading", 8, "FAQ", "Questions we get every day", {
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

export function CarRental() {
	const [page] = useState<Page>(() => {
		const pageFromLocalStorage = JSON.parse(
			localStorage.getItem("car-rental-page-draft"),
		) as Page;
		if (pageFromLocalStorage) return pageFromLocalStorage;
		return template;
	});

	const onPublish = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem(
					"car-rental-page-published",
					JSON.stringify(nextPage),
				);
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onSaveAsDraft = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem("car-rental-page-draft", JSON.stringify(nextPage));
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
			fonts={rentalFonts}
		/>
	);
}

const meta = {
	component: CarRental,
	parameters: {
		layout: "fullscreen",
		options: { showPanel: false },
	},
	title: "WebBuilder/Templates/CarRental",
};

export default meta;
