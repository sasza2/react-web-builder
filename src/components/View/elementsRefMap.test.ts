import type { Breakpoint, WebBuilderElement } from "types";
import { afterEach, expect, it, vi } from "vitest";

import {
	addElementReference,
	getElementPaddingFromStyle,
	getElementsReference,
} from "./elementsRefMap";

const BREAKPOINT = { id: "bp-1" } as Breakpoint;
const ELEMENT = { id: "el-1" } as WebBuilderElement;

afterEach(() => {
	vi.restoreAllMocks();
});

it("adds an element reference and exposes it via getElementsReference", () => {
	const ref = document.createElement("div");
	const remove = addElementReference(BREAKPOINT, ELEMENT, ref);

	const map = getElementsReference(BREAKPOINT);
	expect(map?.get(ELEMENT.id)).toBe(ref);

	remove();

	expect(getElementsReference(BREAKPOINT)?.get(ELEMENT.id)).toBeUndefined();
});

it("removes the breakpoint map entirely once it becomes empty", () => {
	const ref = document.createElement("div");
	const remove = addElementReference(BREAKPOINT, ELEMENT, ref);

	remove();

	expect(getElementsReference(BREAKPOINT)).toBeUndefined();
});

it("keeps the breakpoint map when other elements remain", () => {
	const refA = document.createElement("div");
	const refB = document.createElement("div");
	const elementB = { id: "el-2" } as WebBuilderElement;

	const removeA = addElementReference(BREAKPOINT, ELEMENT, refA);
	addElementReference(BREAKPOINT, elementB, refB);

	removeA();

	expect(getElementsReference(BREAKPOINT)).toBeDefined();
	expect(getElementsReference(BREAKPOINT)?.get(elementB.id)).toBe(refB);
});

it("getElementPaddingFromStyle returns null when breakpoint has no entries", () => {
	expect(getElementPaddingFromStyle("unknown-bp", "unknown-el")).toBeNull();
});

it("getElementPaddingFromStyle returns null when element ref is missing", () => {
	const ref = document.createElement("div");
	addElementReference(BREAKPOINT, ELEMENT, ref);

	expect(
		getElementPaddingFromStyle(BREAKPOINT.id, "does-not-exist"),
	).toBeNull();
});

it("getElementPaddingFromStyle returns the parsed paddingBottom from computed style", () => {
	const ref = document.createElement("div");
	addElementReference(BREAKPOINT, ELEMENT, ref);

	vi.spyOn(window, "getComputedStyle").mockReturnValue({
		paddingBottom: "12px",
	} as CSSStyleDeclaration);

	expect(getElementPaddingFromStyle(BREAKPOINT.id, ELEMENT.id)).toBe(12);
});

it("getElementPaddingFromStyle falls back to 0 for an invalid paddingBottom value", () => {
	const ref = document.createElement("div");
	addElementReference(BREAKPOINT, ELEMENT, ref);

	vi.spyOn(window, "getComputedStyle").mockReturnValue({
		paddingBottom: "",
	} as CSSStyleDeclaration);

	expect(getElementPaddingFromStyle(BREAKPOINT.id, ELEMENT.id)).toBe(0);
});
