import React from "react";

import { StyleProvider } from "@/components/StyleProvider";
import { LoadFont } from "@/LoadFont";
import { GlobalStyles } from "@/WebBuilder.styled";

import { FlexVertical } from "../styles/common";
import {
	ConfirmButton,
	LinkButton,
	LinkGhostButton,
	RemoveButton,
	RemoveGhostButton,
} from "./Button";

export function Buttons() {
	return (
		<StyleProvider>
			<FlexVertical $gap="15px">
				<ConfirmButton>TODO</ConfirmButton>
				<RemoveButton>TODO</RemoveButton>
				<RemoveGhostButton>TODO</RemoveGhostButton>
				<LinkButton>TODO</LinkButton>
				<LinkGhostButton>TODO</LinkGhostButton>
			</FlexVertical>
			<GlobalStyles />
			<LoadFont />
		</StyleProvider>
	);
}

const meta = {
	component: Buttons,
	title: "Common/Buttons",
};

export default meta;
