import { useMemo } from "react";

import { useWebBuilderProperties } from "@/components/PropertiesProvider";
import { DEFAULT_PRESET_COLORS } from "@/consts";
import { normalizeColor } from "@/utils/colors";

export const usePresetColors = (): string[] => {
	const { presetColors } = useWebBuilderProperties();

	return useMemo(
		() => (presetColors || DEFAULT_PRESET_COLORS).map(normalizeColor),
		[presetColors],
	);
};
