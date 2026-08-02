import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { FormContainerDiv } from "./FormContainerDiv";

describe("FormContainerDiv", () => {
	it("renders a form element with children", () => {
		const { container } = render(
			<FormContainerDiv>
				<div>content</div>
			</FormContainerDiv>,
		);

		const formEl = container.querySelector("form");
		expect(formEl).not.toBeNull();
		expect(formEl?.textContent).toBe("content");
	});
});
