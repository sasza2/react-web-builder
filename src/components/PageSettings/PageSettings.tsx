import React from "react";
import { useTranslation } from "react-i18next";
import type { PageSettings as IPageSettings } from "types";

import { usePageSettings } from "@/hooks/usePageSettings";
import { useSetSidebarView } from "@/hooks/useSetSidebarView";
import { updatePageSettings } from "@/store/pageSettingsSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import { useAppSelector } from "@/store/useAppSelector";
import { assignTestProp } from "@/utils/tests";

import { RemoveGhostButton } from "../Button";
import { FormProperty } from "../FormProperty";
import { FormProvider } from "../FormProvider";
import { ColorPicker } from "../forms/ColorPicker";
import { PageSettingsCustomColors } from "../forms/ColorPicker/CustomColors/PageSettingsCustomColors";
import { FontFamily } from "../forms/FontFamily";
import { FormContainerDiv } from "../forms/FormContainerDiv";
import {
	Description,
	FormGroup,
	FormHeader,
} from "../forms/FormControl.styled";
import { useRestartTemplate } from "../Grid/RestartTemplate";
import { useWebBuilderProperties } from "../PropertiesProvider";
import { SidebarHeader } from "../SidebarHeader";
import { SidebarView } from "../SidebarProvider";
import { SidebarScrollbar } from "../SidebarScrollbar";
import { UploadPage } from "./UploadPage";

const componentName = "PageSettings";

export function PageSettings() {
	const { t } = useTranslation();
	const { enableUpload, onTemplateRestart, pageSettingsExtra } =
		useWebBuilderProperties();
	const pageSettings = usePageSettings();
	const setSidebarView = useSetSidebarView();
	const dispatch = useAppDispatch();
	const undoKey = useAppSelector((state) => state.changes.undoKey);
	const restartTemplate = useRestartTemplate();

	const getFormValues = () => pageSettings;

	const setForm = (nextPageSettings: IPageSettings) => {
		dispatch(
			updatePageSettings({
				pageSettings: nextPageSettings,
			}),
		);
	};

	const onBack = () => {
		setSidebarView(SidebarView.AddElement);
	};

	const onRestartClick = () => {
		if (!onTemplateRestart) return;

		const template = onTemplateRestart();
		if (template) restartTemplate(template);
	};

	return (
		<>
			<SidebarHeader
				{...assignTestProp(componentName, "header")}
				onBack={onBack}
			>
				{t("page.settings.title")}
			</SidebarHeader>
			<SidebarScrollbar>
				<FormContainerDiv>
					<FormProvider
						key={undoKey}
						getFormValues={getFormValues}
						setForm={setForm}
					>
						<FontFamily />
						<FormGroup>
							<FormHeader>{t("page.background")}</FormHeader>
							<ColorPicker
								allowGradient
								name="backgroundColor"
								errors={undefined}
								sketchLabel={t("page.background")}
								customColors={<PageSettingsCustomColors allowGradient />}
							/>
						</FormGroup>
						{pageSettingsExtra?.map((prop) => (
							<FormProperty
								key={prop.id}
								formCreatorId="pageSettings"
								name={prop.id}
								prop={prop}
							/>
						))}
						{onTemplateRestart && (
							<FormGroup>
								<FormHeader>{t("page.settings.reset.title")}</FormHeader>
								<Description>
									{t("page.settings.reset.description")}
								</Description>
								<RemoveGhostButton onClick={onRestartClick}>
									{t("page.settings.reset.title")}
								</RemoveGhostButton>
							</FormGroup>
						)}
						{enableUpload && <UploadPage />}
					</FormProvider>
				</FormContainerDiv>
			</SidebarScrollbar>
		</>
	);
}
