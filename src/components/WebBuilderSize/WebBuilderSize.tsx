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

import { Container } from "./WebBuilderSize.styled";

type WebBuilderSize = {
	width: number;
	height: number;
};

type WebBuilderContextSize = {
	nodeRef: React.MutableRefObject<HTMLDivElement>;
	size: WebBuilderSize;
};

const WebBuilderSizeContext = createContext<WebBuilderContextSize>({
	nodeRef: { current: null },
	size: { width: 0, height: 0 },
});

export const useWebBuilderSizeHeight = (): number => {
	const { size } = useContext(WebBuilderSizeContext);
	return size.height;
};

export const useWebBuilderSizeWidth = (): number => {
	const { size } = useContext(WebBuilderSizeContext);
	return size.width;
};

export const useWebBuilderSize = (): WebBuilderSize => {
	const { size } = useContext(WebBuilderSizeContext);
	return size;
};

export const useWebBuilderNodeRef =
	(): React.MutableRefObject<HTMLDivElement> => {
		const { nodeRef } = useContext(WebBuilderSizeContext);
		return nodeRef;
	};

export function WebBuilderSizeProvider({ children }: PropsWithChildren) {
	const [size, setSize] = useState({ width: 0, height: 0 });
	const nodeRef = useRef<HTMLDivElement>();

	const value = useMemo(() => ({ size, nodeRef }), [size]);

	const updateSize = () => {
		const node = nodeRef.current;
		node.style.height = null;
		const rect = node.getBoundingClientRect();
		const height = window.innerHeight - rect.top;

		node.style.height = `${height}px`;
		setSize({
			width: rect.width,
			height,
		});
	};

	useEffect(() => {
		const node = nodeRef.current;
		if (!node) return;

		window.addEventListener("resize", updateSize);

		const disableZoomingWithControlEvent = (e: MouseEvent) => {
			if (e.ctrlKey) {
				e.preventDefault();
				return false;
			}
		};

		node.addEventListener("wheel", disableZoomingWithControlEvent);

		return () => {
			window.removeEventListener("resize", updateSize);
			node.removeEventListener("wheel", disableZoomingWithControlEvent);
		};
	}, [nodeRef.current]);

	const onInit = useCallback((node: HTMLDivElement) => {
		if (!node) return;
		nodeRef.current = node;
		updateSize();
	}, []);

	return (
		<WebBuilderSizeContext.Provider value={value}>
			<Container ref={onInit} $maxHeight={size.height}>
				{children}
			</Container>
		</WebBuilderSizeContext.Provider>
	);
}
