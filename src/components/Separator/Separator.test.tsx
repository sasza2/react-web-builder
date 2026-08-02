import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { buildBreakpoint } from "@/testing/fixtures";

import { Separator } from "./Separator";

describe("Separator", () => {
	it("renders without a breakpoint", () => {
		const { container } = render(<Separator />);
		expect(container.firstChild).not.toBeNull();
	});

	it("renders with a breakpoint providing rowHeight", () => {
		const { container } = render(
			<Separator breakpoint={buildBreakpoint({ rowHeight: 20 })} />,
		);
		expect(container.firstChild).not.toBeNull();
	});
});
