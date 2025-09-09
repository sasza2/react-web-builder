import React, { useCallback, useEffect, useRef } from "react";

import { useGridAPI } from "@/components/GridAPIProvider";
import {
	useWebBuilderSizeHeight,
	useWebBuilderSizeWidth,
} from "@/components/WebBuilderSize";
import { NAVBAR_HEIGHT } from "@/consts";

import {
	ScrollHorizontal,
	ScrollHorizontalIn,
	ScrollVertical,
	ScrollVerticalIn,
} from "./Scroll.styled";

export const useScroll = () => {
	const webBuilderHeight = useWebBuilderSizeHeight() - NAVBAR_HEIGHT;
	const webBuilderWidth = useWebBuilderSizeWidth();
	const gridAPIRef = useGridAPI();
	const scrollVerticalInRef = useRef<HTMLDivElement>();
	const scrollHorizontalInRef = useRef<HTMLDivElement>();
	const isUsingScrollRef = useRef<boolean>(false);

	const onScrollChange = useCallback(() => {
		if (
			!gridAPIRef.current ||
			!scrollVerticalInRef.current ||
			!scrollHorizontalInRef.current ||
			isUsingScrollRef.current
		)
			return;

		const panZoom = gridAPIRef.current.getPanZoom();
		const { childNode } = panZoom;
		const parentNode = childNode.parentNode as HTMLDivElement;

		const parentRect = parentNode.getBoundingClientRect();
		const childRect = childNode.getBoundingClientRect();

		const verticalheightPercentage = Math.min(
			(parentRect.height / childRect.height) * 100,
			100,
		);
		const verticaltopPercentage =
			(Math.abs(childRect.top - parentRect.top) / childRect.height) * 100;

		if (verticalheightPercentage === 100) {
			scrollVerticalInRef.current.style.opacity = "0";
			scrollVerticalInRef.current.style.pointerEvents = "none";
		} else {
			scrollVerticalInRef.current.style.opacity = null;
			scrollVerticalInRef.current.style.pointerEvents = null;
			scrollVerticalInRef.current.style.height = `${verticalheightPercentage}%`;
			scrollVerticalInRef.current.style.top = `${verticaltopPercentage}%`;
		}

		const horizontalWidthPercentage = Math.min(
			(parentRect.width / childRect.width) * 100,
			100,
		);
		const horizontalLeftPercentage =
			(Math.abs(childRect.left - parentRect.left) / childRect.width) * 100;

		if (horizontalWidthPercentage === 100) {
			scrollHorizontalInRef.current.style.opacity = "0";
			scrollHorizontalInRef.current.style.pointerEvents = "none";
		} else {
			scrollHorizontalInRef.current.style.opacity = null;
			scrollHorizontalInRef.current.style.pointerEvents = null;
			scrollHorizontalInRef.current.style.width = `${horizontalWidthPercentage}%`;
			scrollHorizontalInRef.current.style.left = `${horizontalLeftPercentage}%`;
		}
	}, [webBuilderWidth]);

	useEffect(() => {
		let intervalTimer: ReturnType<typeof setInterval>;
		let timeoutTimer: ReturnType<typeof setTimeout>;

		const watchScroll = () => {
			clearInterval(intervalTimer);
			intervalTimer = setInterval(() => {
				onScrollChange();
			}, 250);
		};

		const stopWatchingScroll = () => {
			onScrollChange();
			clearInterval(intervalTimer);
			clearTimeout(timeoutTimer);

			timeoutTimer = setTimeout(onScrollChange, 250);
		};

		window.addEventListener("pointerdown", watchScroll);
		window.addEventListener("pointerup", stopWatchingScroll);

		return () => {
			window.removeEventListener("pointerdown", watchScroll);
			window.removeEventListener("pointerup", stopWatchingScroll);
			clearInterval(intervalTimer);
			clearTimeout(timeoutTimer);
		};
	}, [onScrollChange]);

	const onStartScroll = (
		e: React.PointerEvent<HTMLDivElement>,
		onChange: (pos: { left: number; top: number }) => void,
	) => {
		if (e.button) return;

		const target = e.target as HTMLDivElement;
		if (!target) return;

		isUsingScrollRef.current = true;

		const targetChildRect = target.getBoundingClientRect();
		const targetParentRect = target.parentElement.getBoundingClientRect();

		const getCurrentPosition = () => ({
			x: targetChildRect.x - targetParentRect.x,
			y: targetChildRect.y - targetParentRect.y,
		});

		const startPosition = getCurrentPosition();
		const startMousePos = {
			x: e.clientX,
			y: e.clientY,
		};

		target.setPointerCapture(e.pointerId);

		const onPointerMove = (eMove: PointerEvent) => {
			eMove.preventDefault();
			eMove.stopPropagation();

			let left = startPosition.x + (eMove.clientX - startMousePos.x);
			if (left < 0) left = 0;

			let top = startPosition.y + (eMove.clientY - startMousePos.y);
			if (top < 0) top = 0;

			const maxX = targetParentRect.width - targetChildRect.width;
			if (left > maxX) left = maxX;

			const maxY = targetParentRect.height - targetChildRect.height;
			if (top > maxY) top = maxY;

			target.style.top = `${top}px`;
			target.style.left = `${left}px`;

			onChange({
				left: Math.min((left / targetParentRect.width) * 100, 100),
				top: Math.min((top / targetParentRect.height) * 100, 100),
			});
		};

		const onPointerUp = () => {
			isUsingScrollRef.current = false;
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			target.releasePointerCapture(e.pointerId);
		};

		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
	};

	const onStartScrollVertical: React.PointerEventHandler<HTMLDivElement> = (
		e,
	) => {
		const panZoom = gridAPIRef.current.getPanZoom();
		const childRect = panZoom.childNode.getBoundingClientRect();
		const panZoomPosition = panZoom.getPosition();

		const onChange = ({ top }: { top: number }) => {
			panZoom.setPosition(panZoomPosition.x, (-top * childRect.height) / 100);
		};

		onStartScroll(e, onChange);
	};

	const onStartScrollHorizontal: React.PointerEventHandler<HTMLDivElement> = (
		e,
	) => {
		const panZoom = gridAPIRef.current.getPanZoom();
		const childRect = panZoom.childNode.getBoundingClientRect();
		const panZoomPosition = panZoom.getPosition();

		const onChange = ({ left }: { left: number }) => {
			panZoom.setPosition((-left * childRect.width) / 100, panZoomPosition.y);
		};

		onStartScroll(e, onChange);
	};

	return {
		onScrollChange,
		scrollElement: (
			<>
				<ScrollVertical style={{ height: webBuilderHeight - 20 }}>
					<ScrollVerticalIn
						ref={scrollVerticalInRef}
						onPointerDown={onStartScrollVertical}
					/>
				</ScrollVertical>
				<ScrollHorizontal>
					<ScrollHorizontalIn
						ref={scrollHorizontalInRef}
						onPointerDown={onStartScrollHorizontal}
					/>
				</ScrollHorizontal>
			</>
		),
	};
};
