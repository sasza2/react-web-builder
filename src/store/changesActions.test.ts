import { describe, expect, it } from "vitest";

import { actions, actionsToOmit } from "./changesActions";

describe("changesActions", () => {
	it("actions contains both important and omit action types", () => {
		expect(actions.length).toBeGreaterThan(0);
		expect(actions).toEqual(expect.arrayContaining(actionsToOmit));
		expect(actions).toContain("breakpoints/addBreakpoint");
		expect(actions).toContain("changesStartTransaction");
		expect(actions).toContain("changesStopTransaction");
	});

	it("actionsToOmit contains silent/omitted action types", () => {
		expect(actionsToOmit).toContain("breakpoints/addBreakpointSilent");
		expect(actionsToOmit).toContain("selectedElement/setSelectedElement");
	});
});
