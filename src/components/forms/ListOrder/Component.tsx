import React from "react";

import { ComponentBox } from "./Component.styled";

export const ROW_HEIGHT = 30; // px

export type ComponentItem = {
	id: string;
	label: string;
	active?: boolean;
};

export function Component({ label }: Omit<ComponentItem, "id" | "active">) {
	return <ComponentBox $height={ROW_HEIGHT}>{label}</ComponentBox>;
}
