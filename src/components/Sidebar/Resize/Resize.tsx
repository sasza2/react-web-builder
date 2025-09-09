import React, { useEffect, useRef, useState } from "react";

import {
	useSidebarSetWidth,
	useSidebarWidth,
} from "@/components/SidebarProvider";
import { SIDEBAR_WIDTH } from "@/consts";
import { PREVENT_USER_SELECT_CLASS_NAME } from "@/WebBuilder.styled";

import { Container } from "./Resize.styled";

type ResizeProps = {
	height: number;
};

const addClearSelection = () => {
	document.body.classList.add(PREVENT_USER_SELECT_CLASS_NAME);
};

const clearPreventSelection = () => {
	document.body.classList.remove(PREVENT_USER_SELECT_CLASS_NAME);
};

export function Resize({ height }: ResizeProps) {
	const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
	const setWidth = useSidebarSetWidth();
	const width = useSidebarWidth();
	const widthRef = useRef<number>(width);
	widthRef.current = width;

	useEffect(() => {
		if (!containerRef) return;

		let initialX: number | null = null;
		let initialWidth: number | null = null;

		const onMove = (e: MouseEvent) => {
			if (initialX === null) return;

			const nextWidth = initialWidth + (e.clientX - initialX);
			if (nextWidth < SIDEBAR_WIDTH) return;

			setWidth(nextWidth);
		};

		const onStop = () => {
			initialX = null;
			clearPreventSelection();
			clearMove(); // eslint-disable-line @typescript-eslint/no-use-before-define
		};

		const clearMove = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("mouseup", onStop);
		};

		const initMove = () => {
			clearMove();
			window.addEventListener("pointermove", onMove);
			window.addEventListener("mouseup", onStop);
		};

		const onStart = (e: MouseEvent) => {
			initialX = e.clientX;
			initialWidth = widthRef.current;

			addClearSelection();
			initMove();
		};

		containerRef.addEventListener("pointerdown", onStart);

		return () => {
			containerRef.removeEventListener("pointerdown", onStart);
			clearMove();
			clearPreventSelection();
		};
	}, [containerRef, setWidth]);

	return <Container $height={height} ref={setContainerRef} />;
}
