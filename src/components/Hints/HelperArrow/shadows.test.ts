import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import shadows from "./shadows";
import {
	boxShadowAnimatingIdClassName,
	boxShadowClassName,
} from "./HelperArrow.styled";

describe("shadows", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		document.body.innerHTML = "";
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it("init appends boxes to the body and updates positions on interval", () => {
		const node = document.createElement("div");
		document.body.appendChild(node);
		node.getBoundingClientRect = () =>
			({
				top: 10,
				left: 20,
				right: 30,
				bottom: 40,
				height: 30,
				width: 10,
			}) as DOMRect;

		shadows.init(node);

		vi.advanceTimersByTime(300);

		// four boxes appended (left/top/right/bottom)
		expect(document.body.children.length).toBeGreaterThanOrEqual(4);
	});

	it("init clears an existing removeTimer when called again", () => {
		const node = document.createElement("div");
		document.body.appendChild(node);
		node.getBoundingClientRect = () =>
			({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				height: 0,
				width: 0,
			}) as DOMRect;

		shadows.init(node);
		shadows.removeWithTimeout(500);
		// re-init before timeout fires should clear the pending remove timer
		shadows.init(node);

		vi.advanceTimersByTime(500);

		expect(document.body.children.length).toBeGreaterThanOrEqual(4);
	});

	it("startAnimating and stopAnimating toggle the animating class", () => {
		const node = document.createElement("div");
		document.body.appendChild(node);
		node.getBoundingClientRect = () =>
			({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				height: 0,
				width: 0,
			}) as DOMRect;

		shadows.init(node);
		shadows.startAnimating();

		const animated = document.body.querySelectorAll(
			`.${boxShadowAnimatingIdClassName}`,
		);
		expect(animated.length).toBeGreaterThan(0);

		shadows.startAnimating(); // calling twice should not duplicate the class (branch coverage)

		shadows.stopAnimating();
		const stillAnimated = document.body.querySelectorAll(
			`.${boxShadowAnimatingIdClassName}`,
		);
		expect(stillAnimated.length).toBe(0);

		shadows.stopAnimating(); // calling twice, class already removed (branch coverage)
	});

	it("removeWithTimeout removes boxes immediately when timeout is 0", () => {
		const node = document.createElement("div");
		document.body.appendChild(node);
		node.getBoundingClientRect = () =>
			({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				height: 0,
				width: 0,
			}) as DOMRect;

		shadows.init(node);
		shadows.removeWithTimeout(0);

		expect(
			document.body.querySelectorAll(`.${boxShadowClassName}`).length,
		).toBe(0);
	});

	it("removeImmediately removes boxes without a timer", () => {
		const node = document.createElement("div");
		document.body.appendChild(node);
		node.getBoundingClientRect = () =>
			({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				height: 0,
				width: 0,
			}) as DOMRect;

		shadows.init(node);
		shadows.removeImmediately();

		expect(
			document.body.querySelectorAll(`.${boxShadowClassName}`).length,
		).toBe(0);
	});
});
