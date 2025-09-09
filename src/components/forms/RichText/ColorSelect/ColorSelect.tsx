import { t } from "i18next";
import React, { useRef, useState } from "react";
import { useSlate } from "slate-react";

import { FieldProvider } from "@/components/FormProvider";
import { RenderInSidebarModal } from "@/components/RenderInSidebarModal";

import { ColorPicker } from "../../ColorPicker";
import { FormHeader } from "../../FormControl.styled";
import { Button } from "../buttons";
import { getColorActive, toggleColor } from "../utils";
import { ColorIcon, Container } from "./ColorSelect.styled";

export function ColorSelect() {
	const editor = useSlate();
	const color = getColorActive(editor);
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLDivElement>(null);

	const onClose = () => setOpen(false);

	return (
		<Container>
			<Button
				icon={<ColorIcon style={{ background: color }} />}
				onClick={() => setOpen(true)}
				ref={buttonRef}
			/>
			<RenderInSidebarModal
				onClose={onClose}
				open={open}
				opener={buttonRef}
				closeOnlyOnClickOutsideSidebarModal
			>
				<FormHeader>{t("color.font")}</FormHeader>
				<FieldProvider
					name="color"
					setValue={(nextColor) => {
						toggleColor(editor, nextColor);
					}}
					value={color}
				>
					<ColorPicker name="color" sketchLabel={t("color.font")} />
				</FieldProvider>
			</RenderInSidebarModal>
		</Container>
	);
}
