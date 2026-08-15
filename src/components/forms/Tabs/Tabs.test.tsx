import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";

import { FormProvider } from "@/components/FormProvider";
import { StyleProvider } from "@/components/StyleProvider";

import { Tabs } from "./Tabs";

function Wrapper({ initial }: { initial: Record<string, unknown> }) {
	const [form, setForm] = useState<Record<string, unknown>>(initial);
	return (
		<StyleProvider>
			<FormProvider getFormValues={() => form} setForm={setForm}>
				<Tabs name="tabs" items={["a", "b", "c"]} />
				<div data-testid="current-value">{String(form.tabs)}</div>
			</FormProvider>
		</StyleProvider>
	);
}

describe("Tabs", () => {
	it("renders each item", () => {
		const { container } = render(<Wrapper initial={{ tabs: "a" }} />);

		expect(container.textContent).toContain("a");
		expect(container.textContent).toContain("b");
		expect(container.textContent).toContain("c");
	});

	it("selects a tab on click", () => {
		render(<Wrapper initial={{ tabs: "a" }} />);

		fireEvent.click(screen.getByText("b"));

		expect(screen.getByTestId("current-value").textContent).toBe("b");
	});
});
