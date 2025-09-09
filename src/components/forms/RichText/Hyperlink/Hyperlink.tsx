import React from "react";
import { useTranslation } from "react-i18next";
import { useSlate } from "slate-react";

import { FieldProvider } from "@/components/FormProvider";
import { Icon } from "@/components/icons/Icon";

import { Input } from "../../Input";
import { Button } from "../buttons";
import { FieldPopup, usePopup } from "../FieldPopup";
import { getLinkActive, isHyperlinkActive, setLink } from "../utils/hyperlink";
import { Container } from "./Hyperlink.styled";

export function Hyperlink() {
	const editor = useSlate();
	const color = getLinkActive(editor);
	const popup = usePopup();
	const { t } = useTranslation();

	const setValue = (nextLink: string) => {
		setLink(editor, nextLink);
		popup.close();
	};

	return (
		<Container>
			<Button
				active={isHyperlinkActive(editor)}
				icon={<Icon icon={Icon.Link} />}
				onMouseDown={popup.onOpen}
				ref={popup.buttonRef}
			/>
			<FieldPopup {...popup}>
				<FieldProvider name="link" setValue={setValue} value={color}>
					<Input name="link" label={t("element.link.set")} onBlur={setValue} />
				</FieldProvider>
			</FieldPopup>
		</Container>
	);
}
