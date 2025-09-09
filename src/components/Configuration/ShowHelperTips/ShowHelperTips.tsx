import React from "react";
import { useTranslation } from "react-i18next";

import { clearHintsFromLocalStorage } from "@/components/Hints/clearHintsFromLocalStorage";
import { useBuilderHintsList } from "@/components/Hints/useBuilderHintsList";
import { SidebarView } from "@/components/SidebarProvider";
import { useContainerHintsList } from "@/hooks/container/useContainerHintsList";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useSetSidebarView } from "@/hooks/useSetSidebarView";
import { delay } from "@/utils/delay";

import { LinkGhostButton } from "../../Button";
import {
	useConfiguration,
	useSetConfiguration,
} from "../../ConfigurationProvider";
import { FormControl } from "../../forms/FormControl";
import { FormGroup, FormHeader } from "../../forms/FormControl.styled";

export function ShowHelperTips() {
	const { t } = useTranslation();
	const configuration = useConfiguration();
	const setConfiguration = useSetConfiguration();
	const breakpoint = useBreakpoint();
	const setSidebarView = useSetSidebarView();
	const builderHintsList = useBuilderHintsList();
	const containerHintsList = useContainerHintsList();

	const onClick = async () => {
		if (breakpoint) {
			setSidebarView(SidebarView.AddElement);
			await delay(300); // TODO
		}

		clearHintsFromLocalStorage([...builderHintsList, ...containerHintsList]);

		setConfiguration({
			...configuration,
			builderHintsId: configuration.builderHintsId + 1,
		});
	};

	return (
		<FormGroup>
			<FormHeader>{t("configuration.tips.header")}</FormHeader>
			<FormControl label={t("configuration.tips.label")}>
				<LinkGhostButton onClick={onClick}>
					{t("configuration.tips.button")}
				</LinkGhostButton>
			</FormControl>
		</FormGroup>
	);
}
