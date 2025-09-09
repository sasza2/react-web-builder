import { useCallback, useRef } from "react";

import { useIsMounted } from "./useIsMounted";

type CreateTimeout = (cb: () => void, timeout: number) => void;

type UseTimeout = () => CreateTimeout;

export const useTimeout: UseTimeout = () => {
	const isMounted = useIsMounted();
	const timerRef = useRef<ReturnType<typeof setTimeout>>();

	const createTimeout: CreateTimeout = useCallback((cb, timeout) => {
		clearTimeout(timerRef.current);

		timerRef.current = setTimeout(() => {
			if (isMounted.current) cb();
		}, timeout);
	}, []);

	return createTimeout;
};
