import React from "react";

import { Resizable as ResizableComponent } from "@/components/Resizable";

export function Resizable() {
	return (
		<ResizableComponent defaultHeight={30} minHeight={20}>
			<div style={{ backgroundColor: "violet", height: "100%" }}>resize</div>
		</ResizableComponent>
	);
}

const meta = {
	component: Resizable,
	title: "Common/Resizable",
};

export default meta;
