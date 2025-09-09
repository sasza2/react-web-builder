import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import type { Page } from "types";

import { useBreakpoints } from "@/hooks/useBreakpoints";
import {
	addBreakpointSilent,
	removeAllBreakpoints,
} from "@/store/breakpointsSlice";
import {
	changesStartTransaction,
	changesStopTransaction,
} from "@/store/changesTransactions";
import { setPageSettings } from "@/store/pageSettingsSlice";
import { setSelectedBreakpoint } from "@/store/selectedBreakpointSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import { getLastBreakpointId } from "@/utils/getInitialStateFromPage";
import { getPageSettings } from "@/utils/pageSettings";
import { type WithResolvers, withResolvers } from "@/utils/promise";

import { LoadMultipleBreakpoints } from "../LoadMultipleBreakpoints";

const RestartTemplateContext = createContext<
	((template: Page) => Promise<void>) | null
>(null);

export const useRestartTemplate = () => {
	const restartTemplate = useContext(RestartTemplateContext);
	return restartTemplate;
};

export function RestartTemplate({ children }: React.PropsWithChildren) {
	const dispatch = useAppDispatch();
	const breakpoints = useBreakpoints();
	const [template, setTemplate] = useState<Page | null>(null);
	const withResolversRef = useRef<WithResolvers | null>(null);

	const clearWithResolvers = () => {
		if (withResolversRef.current) {
			withResolversRef.current.reject();
			withResolversRef.current = null;
		}
	};

	useEffect(() => clearWithResolvers, []);

	const onRestart = useCallback(
		(nextTemplate: Page) => {
			clearWithResolvers();

			withResolversRef.current = withResolvers();
			setTemplate(nextTemplate);

			return withResolversRef.current.promise;
		},
		[setTemplate],
	);

	const afterLoadingAll = useCallback(() => {
		dispatch(
			setSelectedBreakpoint({ id: getLastBreakpointId(template.breakpoints) }),
		);
		dispatch(setPageSettings({ pageSettings: getPageSettings(template) }));
		dispatch(changesStopTransaction());
		setTemplate(null);
		withResolversRef.current.resolve();
		withResolversRef.current = null;
	}, [dispatch, setTemplate, template]);

	const beforeLoadingAll = useCallback(() => {
		dispatch(changesStartTransaction());
		dispatch(removeAllBreakpoints());
		template.breakpoints.forEach((breakpoint) => {
			dispatch(addBreakpointSilent({ breakpoint }));
		});
	}, [breakpoints, dispatch, template]);

	return (
		<>
			<RestartTemplateContext.Provider value={onRestart}>
				{children}
			</RestartTemplateContext.Provider>
			{template?.breakpoints && (
				<LoadMultipleBreakpoints
					afterLoadingAll={afterLoadingAll}
					beforeLoadingAll={beforeLoadingAll}
					breakpoints={template.breakpoints}
				/>
			)}
		</>
	);
}
