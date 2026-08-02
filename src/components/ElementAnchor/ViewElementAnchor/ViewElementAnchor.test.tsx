import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { ViewElementAnchor } from "./ViewElementAnchor";

describe("ViewElementAnchor", () => {
	it("renders a hidden div with the given anchor id and class name", () => {
		const { container } = render(<ViewElementAnchor anchorId="el-1" />);

		const div = container.firstChild as HTMLElement;
		expect(div).not.toBeNull();
		expect(div.id).toBe("el-1");
		expect(div.className).toBe("react-web-builder-component-anchor");
		expect(div.style.height).toBe("0px");
		expect(div.style.maxHeight).toBe("0");
		expect(div.style.pointerEvents).toBe("none");
		expect(div.style.visibility).toBe("hidden");
	});
});
