import React, { useCallback, useMemo, useRef, useState } from "react";
import type { Breakpoint } from "types";

import { useWebBuilderProperties } from "@/components/PropertiesProvider";
import { commitHistory } from "@/store/changesSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import { useAppSelector } from "@/store/useAppSelector";
import {
	shouldLoadTemplate,
	shouldLoadTemplateForBreakpoint,
} from "@/utils/breakpoint";

import { LoadMultipleBreakpoints } from "../LoadMultipleBreakpoints";

export function LoadTemplateForPage({ children }: React.PropsWithChildren) {
	const dispatch = useAppDispatch();
	const store = useAppSelector((state) => state);
	const storeRef = useRef<typeof store>();
	storeRef.current = store;
	const { page } = useWebBuilderProperties();
	const [templateLoading, setTemplateLoading] = useState(() =>
		shouldLoadTemplate(page),
	);

	const breakpoints = useMemo<Breakpoint[]>(() => {
		if (!templateLoading || !page) return [];
		return page.breakpoints.filter((breakpoint) =>
			shouldLoadTemplateForBreakpoint(page, breakpoint),
		);
	}, [page?.breakpoints, templateLoading]);

	const afterLoadingAll = useCallback(() => {
		setTemplateLoading(false);
		dispatch(commitHistory({ initial: storeRef.current }));
	}, [dispatch, setTemplateLoading]);

	if (templateLoading) {
		return (
			<LoadMultipleBreakpoints
				afterLoadingAll={afterLoadingAll}
				breakpoints={breakpoints}
			/>
		);
	}

	return children;
}
