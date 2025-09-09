import { useCallback, useEffect, useRef, useState } from "react";

export const usePopup = () => {
	const [position, setPosition] = useState<{ top: number; left: number }>(null);
	const buttonRef = useRef<HTMLDivElement>();
	const popupRef = useRef<HTMLDivElement>();
	const [closing, setClosing] = useState(false);

	useEffect(() => {
		if (!position) return;

		let mounted = true;

		const onClick = (e: MouseEvent) => {
			const node = e.target as HTMLDivElement;
			if (!node) return;

			if (popupRef.current === node || popupRef.current.contains(node)) {
				return;
			}

			setClosing(true);

			setTimeout(() => {
				if (!mounted) return;
				setClosing(false);
				setPosition(null);
			}, 300);
		};

		window.addEventListener("pointerdown", onClick);

		return () => {
			mounted = false;
			window.removeEventListener("pointerdown", onClick);
		};
	}, [position]);

	const onOpen = useCallback(() => {
		if (position) {
			setClosing(false);
			return;
		}

		const { left, top } = buttonRef.current.getBoundingClientRect();
		setClosing(false);
		setPosition({
			left,
			top,
		});
	}, [position]);

	const close = () => {
		setPosition(null);
	};

	return {
		buttonRef,
		close,
		closing,
		onOpen,
		popupRef,
		position,
		setPosition,
	};
};
