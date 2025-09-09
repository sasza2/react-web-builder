import { isValidColor, shadeColor } from "./hex";

const LIGHT_UP_PERCENT = 40;

export enum GradientType {
	Linear = "linear-gradient",
	Radial = "radial-gradient",
}

type Gradient = {
	angle: number | "circle";
	type: GradientType;
	colors: {
		color: string;
		percent: number;
	}[];
};

export const splitGradientColor = (gradientColor: string): Gradient => {
	if (!gradientColor) {
		return {
			angle: 180,
			type: GradientType.Linear,
			colors: [
				{
					color: "transparent",
					percent: 20,
				},
				{
					color: "transparent",
					percent: 80,
				},
			],
		};
	}

	if (isValidColor(gradientColor)) {
		return {
			angle: 180,
			type: GradientType.Linear,
			colors: [
				{
					color: gradientColor,
					percent: 20,
				},
				{
					color: shadeColor(gradientColor, LIGHT_UP_PERCENT),
					percent: 80,
				},
			],
		};
	}

	const parts = [];

	let currentPart = "";

	for (let i = 0; i < gradientColor.length; i++) {
		const c = gradientColor[i];

		if (c === "(" || c === ")" || c === ",") {
			parts.push(currentPart);
			currentPart = "";
			continue;
		}

		currentPart += c;
	}

	const type = parts.shift() as unknown as GradientType;
	const angle = parts.shift();
	const colors = parts;

	return {
		type,
		angle: angle === "circle" ? angle : parseInt(angle),
		colors: colors.map((item) => {
			const [color, percent] = item.trim().split(" ");

			return {
				color,
				percent: parseInt(percent),
			};
		}),
	};
};

export const isValidGradientColor = (gradientColor: string) =>
	!!splitGradientColor(gradientColor);

export const gradientToValue = (gradient: Gradient): string => {
	let cssValue = "";
	cssValue += `${gradient.type}(`;

	if (gradient.type === GradientType.Linear) {
		let angle = parseInt(gradient.angle as string);
		if (Number.isNaN(angle)) angle = 180;

		cssValue += `${angle}deg`;
	} else {
		cssValue += "circle";
	}

	cssValue += ", ";

	cssValue += gradient.colors
		.map((item) => `${item.color} ${item.percent}%`)
		.join(", ");

	cssValue += ")";

	return cssValue;
};
