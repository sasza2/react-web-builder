import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { LoadFont } from "./LoadFont";

describe("LoadFont", () => {
	it("renders font link tags", () => {
		const { container } = render(<LoadFont />);

		const links = container.querySelectorAll("link");

		expect(links.length).toBe(3);
		expect(links[0].getAttribute("rel")).toBe("preconnect");
		expect(links[0].getAttribute("href")).toBe("https://fonts.googleapis.com");
		expect(links[1].getAttribute("rel")).toBe("preconnect");
		expect(links[1].getAttribute("href")).toBe("https://fonts.gstatic.com");
		expect(links[2].getAttribute("rel")).toBe("stylesheet");
		expect(links[2].getAttribute("href")).toBe(
			"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
		);
	});
});
