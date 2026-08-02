import { renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { useIsMounted } from "./useIsMounted";

it("returns true while mounted and false after unmount", () => {
	const { result, unmount } = renderHook(() => useIsMounted());

	expect(result.current.current).toBe(true);

	unmount();

	expect(result.current.current).toBe(false);
});
