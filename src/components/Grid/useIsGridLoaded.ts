import { useEffect, useState } from "react";

import { useGridAPI } from "@/components/GridAPIProvider";

const useIsGridLoaded = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const gridAPIRef = useGridAPI();

	useEffect(() => {
		if (isLoaded) return;

		const waitForAPI = () => {
			if (gridAPIRef.current) setIsLoaded(true);
		};

		const timer = setInterval(waitForAPI, 200);

		return () => {
			clearInterval(timer);
		};
	}, [isLoaded]);

	return isLoaded;
};

export default useIsGridLoaded;
