import React from "react";

import { StyleProvider } from "@/components/StyleProvider";
import { LoadFont } from "@/LoadFont";
import { GlobalStyles } from "@/WebBuilder.styled";

import { LoaderSpinner as LoaderSpinnerComp } from "./LoaderSpinner";

export function LoaderSpinner() {
	return (
		<StyleProvider>
			<LoaderSpinnerComp width={40} />
			<GlobalStyles />
			<LoadFont />
		</StyleProvider>
	);
}

const meta = {
	component: LoaderSpinner,
	title: "Common/LoaderSpinner",
};

export default meta;
