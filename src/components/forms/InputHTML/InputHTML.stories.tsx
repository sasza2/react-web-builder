import React, { useState } from "react";

import { FieldProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";
import { LoadFont } from "@/LoadFont";
import { GlobalStyles } from "@/WebBuilder.styled";

import { InputHTML } from "./InputHTML";

export function InputHTMLStories() {
	const [value, setValue] = useState("");
	return (
		<StyleProvider>
			<FieldProvider name="html" setValue={setValue} value={value}>
				<InputHTML name="html" />
			</FieldProvider>
			<GlobalStyles />
			<LoadFont />
		</StyleProvider>
	);
}

const meta = {
	component: InputHTMLStories,
	title: "Common/InputHTML",
};

export default meta;
