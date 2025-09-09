export const mergeStyles = (
	...styles: React.CSSProperties[]
): React.CSSProperties => {
	const mergedStyles: Record<string, string> = {};

	styles.forEach((style) => {
		Object.entries(style).forEach(([key, value]) => {
			if (value === undefined) return;

			mergedStyles[key] = value as string;
		});
	});

	if (mergedStyles.background && mergedStyles.backgroundImage) {
		mergedStyles.background = `${mergedStyles.backgroundImage}, ${mergedStyles.background}`;
	} else if (mergedStyles.backgroundImage) {
		mergedStyles.background = mergedStyles.backgroundImage;
	}

	delete mergedStyles.backgroundImage;

	return mergedStyles;
};
