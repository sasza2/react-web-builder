import React from "react";
import { useTranslation } from "react-i18next";

import { useWebBuilderProperties } from "@/components/PropertiesProvider/PropertiesProvider";

import { FormGroup, FormHeader } from "../FormControl.styled";
import { Select } from "../Select";

export function FontFamily() {
	const { t } = useTranslation();
	const { fonts } = useWebBuilderProperties();

	if (!fonts) return null;
	return (
		<FormGroup>
			<FormHeader>{t("page.fontFamily")}</FormHeader>
			<Select name="fontFamily" size="lg" options={fonts} />
		</FormGroup>
	);
}
