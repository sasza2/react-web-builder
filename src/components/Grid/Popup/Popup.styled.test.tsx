import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Container, WIDTH } from "./Popup.styled";

describe("Popup.styled", () => {
	it("exports the expected fixed width", () => {
		expect(WIDTH).toBe(230);
	});

	it("applies left/top/width styles based on props", () => {
		const { container } = render(
			<Container $left={15} $top={25}>
				content
			</Container>,
		);

		const el = container.firstChild as HTMLElement;
		expect(el.textContent).toBe("content");

		const styles = window.getComputedStyle(el);
		expect(styles.position).toBe("fixed");
		expect(styles.left).toBe("15px");
		expect(styles.top).toBe("25px");
		expect(styles.width).toBe("230px");
	});
});
