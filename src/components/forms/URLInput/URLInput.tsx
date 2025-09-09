import React from "react";
import { useTranslation } from "react-i18next";

import { Input } from "../Input";
import { Toggle } from "../Toggle";

type URLInputProps = {
	canOpenInNewTab?: boolean;
	name: string;
};

export function URLInput({ canOpenInNewTab, name }: URLInputProps) {
	const { t } = useTranslation();
	return (
		<>
			<Input
				name={`${name}.location`}
				testId="url"
				leftNode={t("element.link.url")}
			/>
			{canOpenInNewTab && (
				<Toggle
					name={`${name}.openInNewTab`}
					label={t("element.link.openInNewTab")}
				/>
			)}
		</>
	);
}
