import { useCallback } from "react";

import { useSelectedElements } from "./useSelectedElements";

export const useElementOnStartResizing = () => {
	const { setSelectedElements } = useSelectedElements();

	const onStartResizing = useCallback(() => {
		setSelectedElements([]);
	}, []);

	return onStartResizing;
};
