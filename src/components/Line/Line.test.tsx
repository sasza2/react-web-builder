import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Line } from "./Line";

describe("Line", () => {
	it("renders a solid line with background color and height styles", () => {
		const { container } = render(
			<Line
				dashesWidth={4}
				dashesGap={2}
				backgroundColor="red"
				borderRadius={5}
				height={10}
				type="solid"
			/>,
		);
		const line = container.querySelector("line");
		expect(line).not.toBeNull();
		expect(line.style.stroke).toBe("red");
		expect(line.style.strokeWidth).toBe("10");
		expect(line.style.strokeDasharray).toBe("");
	});

	it("applies strokeDasharray when type is dashed", () => {
		const { container } = render(
			<Line
				dashesWidth={4}
				dashesGap={2}
				borderRadius={0}
				height={5}
				type="dashed"
			/>,
		);
		const line = container.querySelector("line");
		expect(line.style.strokeDasharray).toBe("4 2");
	});
});
