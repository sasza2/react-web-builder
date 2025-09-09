import React from "react";
import { useTranslation } from "react-i18next";
import type { OnImageUpload } from "types";

import { assignTestProp } from "@/utils/tests";

import { FormGroup, FormHeader } from "../FormControl.styled";
import { ImageUpload } from "../ImageUpload";
import { Length } from "../Length";
import { Radio } from "../Radio";
import type { IFormControl } from "../types";

type BackgroundImageProps = {
	name: string;
	onImageUpload?: OnImageUpload;
} & IFormControl;

export function BackgroundImage({
	name,
	onImageUpload,
	testId,
}: BackgroundImageProps) {
	const { t } = useTranslation();

	return (
		<FormGroup {...assignTestProp(testId, null, "backgroundImage")}>
			<FormHeader>{t("element.backgroundImage.name")}</FormHeader>
			<ImageUpload name={name} onImageUpload={onImageUpload} />
			<Radio
				name={`${name}.size`}
				label={t("element.backgroundImage.size.name")}
				options={[
					{
						label: t("element.backgroundImage.size.cover"),
						type: "cover",
					},
					{
						label: t("element.backgroundImage.size.contain"),
						type: "contain",
					},
					{
						label: t("element.backgroundImage.size.custom"),
						type: "numbers",
						extra: (
							<Length
								options={[
									{
										label: t("element.backgroundImage.size.width"),
										name: `${name}.size.numbers.width`,
									},
									{
										label: t("element.backgroundImage.size.height"),
										name: `${name}.size.numbers.height`,
									},
								]}
							/>
						),
					},
				]}
			/>
			<Radio
				name={`${name}.position`}
				label={t("element.backgroundImage.position.name")}
				options={[
					{
						label: t("element.backgroundImage.position.top"),
						type: "top",
					},
					{
						label: t("element.backgroundImage.position.right"),
						type: "right",
					},
					{
						label: t("element.backgroundImage.position.bottom"),
						type: "bottom",
					},
					{
						label: t("element.backgroundImage.position.left"),
						type: "left",
					},
					{
						label: t("element.backgroundImage.position.center"),
						type: "center",
					},
					{
						label: t("element.backgroundImage.position.custom"),
						type: "numbers",
						extra: (
							<Length
								options={[
									{
										label: t("element.backgroundImage.position.x"),
										name: `${name}.position.numbers.x`,
									},
									{
										label: t("element.backgroundImage.position.y"),
										name: `${name}.position.numbers.y`,
									},
								]}
							/>
						),
					},
				]}
			/>
			<Radio
				name={`${name}.repeat`}
				label={t("element.backgroundImage.repeat.name")}
				options={[
					{
						label: t("element.backgroundImage.repeat.name"),
						type: "repeat",
					},
					{
						label: t("element.backgroundImage.repeat.noRepeat"),
						type: "no-repeat",
					},
				]}
			/>
		</FormGroup>
	);
}
