import { useCallback } from "react";

import { setIsSaved } from "@/store/changesSlice";
import { useAppDispatch } from "@/store/useAppDispatch";

export const useChangesSetIsSaved = () => {
	const dispatch = useAppDispatch();

	const dispatchSetIsSaved = useCallback(() => {
		dispatch(setIsSaved());
	}, [dispatch]);

	return dispatchSetIsSaved;
};
