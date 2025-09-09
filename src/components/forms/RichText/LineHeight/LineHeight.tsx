import React from "react";
import { useSlate } from "slate-react";
import type { Option } from "types";

import { FieldProvider } from "@/components/FormProvider";
import { Icon } from "@/components/icons/Icon";

import { Select } from "../../Select";
import { getLineHeight } from "../utils/getLineHeight";
import { toggleLineHeight } from "../utils/toggleLineHeight";
import { Container } from "./LineHeight.styled";

export const LINE_HEIGHTS: Option<string>[] = [];

for (let size = 8; size <= 20; size++) {
	let sizeStr = `${size / 10}`;
	if (!sizeStr.includes(".")) sizeStr += ".0";
	LINE_HEIGHTS.push({
		label: sizeStr,
		value: sizeStr,
	});
}

export function LineHeightSelect() {
	const editor = useSlate();
	return (
		<Container>
			<FieldProvider
				name="lineHeight"
				setValue={(lineHeight) => {
					toggleLineHeight(editor, lineHeight as unknown as string);
				}}
				value={getLineHeight(editor)}
			>
				<Select name="lineHeight" options={LINE_HEIGHTS} size="xs" />
			</FieldProvider>
			<Icon icon={Icon.LineHeight} />
		</Container>
	);
}
