import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactGrid, { type GridAPI, type GridElement } from "react-grid-panzoom";
import { useDispatch } from "react-redux";
import type { Breakpoint, WebBuilderElement, WebBuilderElements } from "types";

import { useComponentsProperty } from "@/components/ComponentsProvider";
import { ElementsContext } from "@/components/ElementsProvider";
import { useProperties } from "@/components/PropertiesProvider";
import { RenderInContainer } from "@/components/RenderInContainer";
import { WAIT_FOR_LOAD } from "@/consts";
import { useFontImport } from "@/hooks/useFontImport";
import { useGetBreakpointWidth } from "@/hooks/useGetBreakpointWidth";
import { usePageSettings } from "@/hooks/usePageSettings";
import { setElementsInBreakpoint } from "@/store/elementsInBreakpointsSlice";
import {
	assignAllToElementsExtras,
	initElementsExtrasFromBreakpoint,
} from "@/utils/breakpoint";
import { delay } from "@/utils/delay";
import { produceRenderForElement } from "@/utils/element";
import {
	calculatePositionsOfElements,
	getElementsFromTree,
} from "@/utils/templates";

import { GridDiv } from "../Grid.styled";
import { IsBreakpointLoading } from "./IsBreakpointLoading";
import { useBreakpointWaitForLoad } from "./useBreakpointWaitForLoad";

type LoadBreakpointProps = {
	breakpoint: Breakpoint;
	onFinishLoading: (breakpoint: Breakpoint) => void;
	onStartLoading?: (breakpoint: Breakpoint) => void;
};

export function LoadBreakpoint({
	breakpoint,
	onFinishLoading,
	onStartLoading,
}: LoadBreakpointProps) {
	const { page, transformElementProperty } = useProperties();
	const components = useComponentsProperty();
	const gridTemplateAPIRef = useRef<GridAPI>();
	const { elementsExtras } = useContext(ElementsContext);
	const dispatch = useDispatch();
	const breakpointRef = useRef<Breakpoint>();
	breakpointRef.current = breakpoint;
	const pageSettings = usePageSettings();
	const fontImport = useFontImport(pageSettings.fontFamily);
	const getBreakpointWidth = useGetBreakpointWidth();
	const [elementsLoaded, setElementLoaded] = useState(false);
	const [waitForLoadingBreakpointRef, continueWaiting] =
		useBreakpointWaitForLoad();

	const [elements, setElements] = useState<WebBuilderElements>(() =>
		getElementsFromTree(breakpoint.template),
	);

	useEffect(() => {
		let mounted = true;

		const organizeElements = async () => {
			if (onStartLoading) onStartLoading(breakpoint);

			await waitForLoadingBreakpointRef.current;

			if (!mounted) return;

			setElementLoaded(true);

			let nextElements: WebBuilderElements;

			try {
				gridTemplateAPIRef.current.organizeElements();
				nextElements = calculatePositionsOfElements(
					breakpoint.template,
					gridTemplateAPIRef.current.measureElementHeight,
				);
			} catch (e) {
				console.warn("Error while loading breakoint template", breakpoint, e); // eslint-disable-line no-console
				return;
			}

			dispatch(
				setElementsInBreakpoint({
					elements: nextElements,
					breakpointId: breakpoint.id,
				}),
			);

			setElements(nextElements);

			await delay(WAIT_FOR_LOAD);

			if (!mounted) return;

			initElementsExtrasFromBreakpoint(
				page,
				breakpointRef.current,
				elementsExtras,
			);
			assignAllToElementsExtras(
				elementsExtras,
				breakpointRef.current,
				gridTemplateAPIRef,
			);

			onFinishLoading(breakpoint);
		};

		organizeElements();

		return () => {
			mounted = false;
		};
	}, []);

	const setGridElements = (gridElements: GridElement[]) => {
		if (!elementsLoaded) {
			continueWaiting();
			return;
		}

		const nextElements = gridElements.map((element) => {
			const nextElement = { ...element };
			delete nextElement.render;
			return nextElement as unknown as WebBuilderElement;
		});

		dispatch(
			setElementsInBreakpoint({
				elements: nextElements,
				breakpointId: breakpoint.id,
			}),
		);

		setElements(nextElements);
	};

	const gridElements = useMemo(
		() =>
			elements.map((element) => {
				const [render] = produceRenderForElement(
					components,
					breakpoint,
					element,
					transformElementProperty,
				);

				return {
					...element,
					fullHeight: true,
					render,
				} as unknown as GridElement;
			}),
		[components, elements],
	);

	return (
		<IsBreakpointLoading.Provider value={!elementsLoaded}>
			<GridDiv
				$breakpoint={breakpoint}
				$fontImport={fontImport}
				$height="100vh"
				$isLoaded
				$pageSettings={pageSettings}
			>
				<RenderInContainer breakpoint={breakpoint}>
					<ReactGrid
						autoOrganizeElements
						boundary
						cols={breakpoint.cols}
						rowHeight={breakpoint.rowHeight}
						rows="auto"
						elements={gridElements}
						setElements={setGridElements}
						width={getBreakpointWidth(breakpoint)}
						ref={gridTemplateAPIRef}
					/>
					{fontImport?.stylesheet}
				</RenderInContainer>
			</GridDiv>
		</IsBreakpointLoading.Provider>
	);
}
