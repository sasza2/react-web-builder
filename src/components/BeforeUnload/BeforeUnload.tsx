import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/store/useAppSelector";

export function BeforeUnload(): JSX.Element {
	const changes = useAppSelector((state) => state.changes);
	const { t } = useTranslation();

	useEffect(() => {
		if (changes.saved) return;

		const onBeforeunload = (event: BeforeUnloadEvent) => {
			event.returnValue = t("errors.unsavedChanges");
		};

		window.addEventListener("beforeunload", onBeforeunload);

		return () => {
			window.removeEventListener("beforeunload", onBeforeunload);
		};
	}, [changes.saved, t]);

	return null;
}
