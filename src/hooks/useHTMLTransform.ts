import { useEffect, useState } from "react";

import type { ErrorsInstance } from "@/utils/html2json/errors";
import type { Node } from "@/utils/html2json/transform";

export const useHTMLTransform = (
	value: string,
	className = "",
): [Node[], ErrorsInstance | null] => {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [errors, setErrors] = useState<ErrorsInstance | null>(null);

	useEffect(() => {
		let mounted = true;

		(async () => {
			const { transform } = await import("@/utils/html2json/transform");

			if (!mounted) return;

			const [nextNodes, nextErrors] = transform(value, {
				classNamePrefix: className,
			});
			setNodes(nextNodes);
			setErrors(nextErrors);
		})();

		return () => {
			mounted = false;
		};
	}, [value, className]);

	return [nodes, errors];
};
