import React, { useCallback, useRef } from "react";

import { RESIZABLE_PROP_NAME } from "./consts";
import { Anchor, Container } from "./Resizable.styled";

type ResizableProps = React.PropsWithChildren<{
	defaultHeight: number;
	minHeight?: number;
	onChange?: (height: number) => void;
}>;

export function Resizable({
	children,
	defaultHeight,
	minHeight = 16,
	onChange,
}: ResizableProps) {
	const containerRef = useRef<HTMLDivElement>();

	const onLoad = useCallback(
		(node: HTMLDivElement) => {
			containerRef.current = node;
			if (node)
				node.style.setProperty(RESIZABLE_PROP_NAME, `${defaultHeight}px`);
		},
		[defaultHeight],
	);

	const onStartResizing: React.PointerEventHandler = (startEvent) => {
		const currentHeight = containerRef.current.getBoundingClientRect().height;
		const startY = startEvent.clientY;

		let onStop: () => void;

		const onMoving = (e: MouseEvent) => {
			if (!e.buttons) {
				onStop();
				return;
			}

			const diff = e.clientY - startY;

			let nextHeight = currentHeight + diff;
			if (nextHeight < minHeight) nextHeight = minHeight;

			containerRef.current.style.setProperty(
				RESIZABLE_PROP_NAME,
				`${nextHeight}px`,
			);

			if (onChange) onChange(nextHeight);
		};

		onStop = () => {
			window.removeEventListener("pointermove", onMoving);
			window.removeEventListener("pointerup", onStop);
			containerRef.current.style.userSelect = null;
			containerRef.current.style.pointerEvents = null;
		};

		window.addEventListener("pointermove", onMoving);
		window.addEventListener("pointerup", onStop);
		containerRef.current.style.userSelect = "none";
		containerRef.current.style.pointerEvents = "none";
	};

	const style: React.CSSProperties = {
		minHeight,
	};

	return (
		<Container style={style} ref={onLoad}>
			{children}
			<Anchor onPointerDown={onStartResizing} />
		</Container>
	);
}
