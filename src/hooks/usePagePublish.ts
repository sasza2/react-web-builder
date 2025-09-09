import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useWebBuilderProperties } from "@/components/PropertiesProvider";

import { useBuildPageWithTree } from "./page/useBuildPageWithTree";
import { useChangesSetIsSaved } from "./useChangesSetIsSaved";

export const usePagePublish = () => {
	const { onPublish } = useWebBuilderProperties();
	const build = useBuildPageWithTree();
	const { t } = useTranslation();
	const setIsSaved = useChangesSetIsSaved();

	const publish = async () => {
		if (!onPublish) return;

		const promise = onPublish(build());
		if (onPublish) {
			toast.promise(
				promise,
				{
					pending: t("publish.save.pending"),
					success: t("publish.save.success"),
					error: t("errors.somethingWentWrong"),
				},
				{
					draggable: false,
				},
			);

			await promise;

			setIsSaved();
		}
	};

	return publish;
};
