import { useWebBuilderProperties } from "@/components/PropertiesProvider";
import { delay } from "@/utils/delay";

import { useBuildPageWithTree } from "./page/useBuildPageWithTree";
import { useChangesSetIsSaved } from "./useChangesSetIsSaved";
import { useIsMounted } from "./useIsMounted";

export const usePageOnChange = () => {
	const { onChange } = useWebBuilderProperties();
	const build = useBuildPageWithTree();
	const setIsSaved = useChangesSetIsSaved();
	const isMounted = useIsMounted();

	const save = async () => {
		if (!onChange) return;

		await delay(2000); // TODO
		if (!isMounted.current) return;

		await onChange(build()); // eslint-disable-line
		setIsSaved();
	};

	return save;
};
