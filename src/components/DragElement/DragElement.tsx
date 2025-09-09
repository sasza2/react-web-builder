import PanZoom, {
	type API,
	Element as PanZoomElement,
} from "@sasza/react-panzoom";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import ReactDOM from "react-dom";
import type { Position, WebBuilderComponent, WebBuilderElement } from "types";

import { useAddBreakpointForContainer } from "@/hooks/container/useAddBreakpointForContainer";
import { useAddElement } from "@/hooks/useAddElement";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useGridPositionTop } from "@/hooks/useGridPositionTop";
import { createUniqueId } from "@/utils/createUniqueId";
import {
	getDefaultHeight,
	getDefaultWidth,
	getElementContainerIdProp,
	getElementPropsWhenCreating,
	isResizable,
} from "@/utils/element";
import { PREVENT_ELEMENTS_TRANSITION_CLASS_NAME } from "@/WebBuilder.styled";

import { useGridAPI } from "../GridAPIProvider/GridAPIProvider";
import { useSidebarWidth } from "../SidebarProvider";
import { Container } from "./DragElement.styled";

const COMPONENT_ID = "component";

export type DragElementDetails = {
	position: Position;
	component: WebBuilderComponent;
	offset: Position;
	width: number;
};

type DragElementProps = React.PropsWithChildren<
	DragElementDetails & {
		onCancel: () => void;
		onSuccess: () => void;
	}
>;

export const DragElement: React.FC<DragElementProps> = ({
	children,
	component,
	position: elementPosition,
	offset,
	onCancel,
	onSuccess,
	width,
}) => {
	const breakpoint = useBreakpoint();
	const addElement = useAddElement();
	const panZoomRef = useRef<API>();
	const [loaded, setLoaded] = useState(false);
	const gridAPIRef = useGridAPI();
	const onComponentElementChange = useRef<(position: Position) => void>();
	const hasAdded = useRef<boolean>(false);
	const gridTop = useGridPositionTop();
	const addBreakpointForContainer = useAddBreakpointForContainer();
	const sidebarWidth = useSidebarWidth();

	useEffect(() => {
		if (!loaded) return;

		let disabled = false;

		const onMouseUp = (e: MouseEvent) => {
			e.preventDefault();
			onCancel();
			disabled = true;
		};

		window.addEventListener("mouseup", onMouseUp);

		const panZoom = gridAPIRef.current.getPanZoom();
		const child = panZoom.childNode;
		const childRect = child.getBoundingClientRect();

		const container = child.parentNode as HTMLDivElement;
		const containerRect = container.getBoundingClientRect();

		const maxLeft = Math.max(containerRect.left, childRect.left);
		const maxRight = Math.min(containerRect.right, childRect.right);
		const maxBottom = Math.min(containerRect.bottom, childRect.bottom);

		const draggedSize = { width };

		const onAdd = (position: Position) => {
			if (hasAdded.current) {
				return;
			}

			hasAdded.current = true;

			const { y } = gridAPIRef.current.calculateCellPositionByPixels(
				position.x,
				position.y + offset.y / panZoom.getZoom(),
			);

			const id = createUniqueId();

			const nextProps = getElementPropsWhenCreating(component, breakpoint);
			if (component.id === "Container") {
				const containerIdProp = getElementContainerIdProp(nextProps);
				if (containerIdProp) {
					containerIdProp.value = addBreakpointForContainer();
				}
			}

			addElement({
				id,
				w: getDefaultWidth(component, breakpoint),
				h: getDefaultHeight(component),
				x: 0,
				y,
				resizable: isResizable(component),
				componentName: component.id,
				props: nextProps,
			} as WebBuilderElement);

			onComponentElementChange.current = null;

			onSuccess();

			document.body.classList.add(PREVENT_ELEMENTS_TRANSITION_CLASS_NAME);

			setTimeout(() => {
				document.body.classList.remove(PREVENT_ELEMENTS_TRANSITION_CLASS_NAME);

				if (disabled) return;

				gridAPIRef.current.grabElement(id, {
					x: offset.x + sidebarWidth / panZoom.getZoom(),
					y: gridTop / panZoom.getZoom(),
				});
			}, 100); // TODO
		};

		const isOnGridArea = (position: Position) =>
			position.x < maxRight &&
			position.x + draggedSize.width > maxLeft &&
			position.y < maxBottom;

		onComponentElementChange.current = (position: Position) => {
			if (isOnGridArea(position)) {
				const originalPanZoomPosition = panZoom.getPosition();
				onAdd({
					x: position.x / panZoom.getZoom(),
					y:
						(position.y - originalPanZoomPosition.y - gridTop) /
						panZoom.getZoom(),
				});
			}
		};

		return () => {
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [loaded, sidebarWidth]);

	useLayoutEffect(() => {
		const timer = setInterval(() => {
			if (!panZoomRef.current) return;

			panZoomRef.current.grabElement(COMPONENT_ID, offset);
			setLoaded(true);

			clearInterval(timer);
		}, 10);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const onElementsChange = useCallback((elements: Record<string, Position>) => {
		const position = elements[COMPONENT_ID];
		if (position && onComponentElementChange.current) {
			onComponentElementChange.current({
				x: position.x,
				y: position.y,
			});
		}
	}, []);

	return ReactDOM.createPortal(
		<Container style={{ height: `calc(100vh - ${gridTop}px)`, top: gridTop }}>
			<PanZoom
				disabledMove
				disabledZoom
				ref={panZoomRef}
				onElementsChange={onElementsChange}
			>
				<PanZoomElement
					id={COMPONENT_ID}
					x={elementPosition.x}
					y={elementPosition.y}
				>
					{children}
				</PanZoomElement>
			</PanZoom>
		</Container>,
		document.body,
	);
};
