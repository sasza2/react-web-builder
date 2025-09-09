import React, {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { SIDEBAR_WIDTH } from "@/consts";
import { type AccordionState, useAccordion } from "@/hooks/useAccordion";

export enum SidebarView {
	AddElement = 1,
	AddBreakpoint = 2,
	EditBreakpoint = 3,
	EditElement = 4,
	Configuration = 5,
	Theme = 6,
	PageSettings = 7,
}

type SidebarContext = {
	modalRef: React.MutableRefObject<HTMLDivElement>;
	sidebarRef: React.MutableRefObject<HTMLDivElement>;
	selectNewElementAccordion: AccordionState;
	setWidth: (width: number) => void;
	width: number;
};

const Sidebar = createContext<SidebarContext>({} as SidebarContext);

export const useSelectNewElementAccordion = (): AccordionState => {
	const { selectNewElementAccordion } = useContext(Sidebar);
	return selectNewElementAccordion;
};

export const useSidebarRef = (): React.MutableRefObject<HTMLDivElement> => {
	const { sidebarRef } = useContext(Sidebar);
	return sidebarRef;
};

export const useSidebarModalRef =
	(): React.MutableRefObject<HTMLDivElement> => {
		const { modalRef } = useContext(Sidebar);
		return modalRef;
	};

export const useSidebarWidth = (): number => {
	const { width } = useContext(Sidebar);
	return width;
};

export const useSidebarSetWidth = (): SidebarContext["setWidth"] => {
	const { setWidth } = useContext(Sidebar);
	return setWidth;
};

const updateSidebarPropertyWidth = (width: number) => {
	document.body.style.setProperty(
		"--react-web-builder-sidebar-width",
		`${width}px`,
	);
};

export function SidebarProvider({ children }: PropsWithChildren) {
	const modalRef = useRef<HTMLDivElement>();
	const sidebarRef = useRef<HTMLDivElement>();
	const selectNewElementAccordion = useAccordion();
	const [width, setWidth] = useState(SIDEBAR_WIDTH);

	useEffect(() => {
		updateSidebarPropertyWidth(SIDEBAR_WIDTH);
	}, []);

	const setWidthInternal = useCallback(
		(nextWidth: number) => {
			updateSidebarPropertyWidth(nextWidth);
			setWidth(nextWidth);
		},
		[setWidth],
	);

	const value = useMemo<SidebarContext>(
		() => ({
			selectNewElementAccordion,
			modalRef,
			sidebarRef,
			setWidth: setWidthInternal,
			width,
		}),
		[selectNewElementAccordion, sidebarRef, setWidthInternal, width],
	);

	return <Sidebar.Provider value={value}>{children}</Sidebar.Provider>;
}
