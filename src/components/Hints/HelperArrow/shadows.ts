import {
	boxShadowAnimatingIdClassName,
	boxShadowClassName,
} from "./HelperArrow.styled";

let removeTimer: ReturnType<typeof setTimeout> = null;
let refreshTimer: ReturnType<typeof setInterval> = null;

const createBox = () => {
	const box = document.createElement("div");
	box.classList.add(boxShadowClassName);
	return box;
};

const boxes = {
	left: createBox(),
	top: createBox(),
	right: createBox(),
	bottom: createBox(),
};

const loopBoxes = (cb: (box: HTMLDivElement) => void) => {
	Object.values(boxes).forEach(cb);
};

const init = (node: HTMLDivElement) => {
	if (removeTimer !== null) {
		clearTimeout(removeTimer);
		removeTimer = null;
	}

	if (!refreshTimer == null) {
		clearInterval(refreshTimer);
		refreshTimer = null;
	}

	refreshTimer = setInterval(() => {
		const rect = node.getBoundingClientRect();

		boxes.top.style.top = "0";
		boxes.top.style.left = "0";
		boxes.top.style.width = "100%";
		boxes.top.style.height = `${rect.top - 5}px`;

		boxes.right.style.left = `${rect.right + 5}px`;
		boxes.right.style.right = "0";
		boxes.right.style.top = `${rect.top - 5}px`;
		boxes.right.style.height = `${rect.height + 10}px`;

		boxes.bottom.style.top = `${rect.bottom + 5}px`;
		boxes.bottom.style.left = "0px";
		boxes.bottom.style.width = "100%";
		boxes.bottom.style.bottom = "0";

		boxes.left.style.left = "0";
		boxes.left.style.width = `${Math.max(rect.left - 5, 0)}px`;
		boxes.left.style.top = `${rect.top - 5}px`;
		boxes.left.style.height = `${rect.height + 10}px`;
	}, 300); // TODO

	loopBoxes((box) => {
		if (!box.parentNode) document.body.appendChild(box);
	});
};

const startAnimating = () => {
	loopBoxes((box) => {
		if (!box.classList.contains(boxShadowAnimatingIdClassName)) {
			box.classList.add(boxShadowAnimatingIdClassName);
		}
	});
};

const stopAnimating = () => {
	loopBoxes((box) => {
		if (box.classList.contains(boxShadowAnimatingIdClassName)) {
			box.classList.remove(boxShadowAnimatingIdClassName);
		}
	});
};

const removeWithTimeout = (timeout = 300) => {
	// TODO
	if (refreshTimer !== null) {
		clearInterval(refreshTimer);
		refreshTimer = null;
	}

	stopAnimating();

	const removeAllBoxes = () => {
		loopBoxes((box) => {
			if (box.parentNode) document.body.removeChild(box);
		});
	};

	if (timeout) removeTimer = setTimeout(removeAllBoxes, timeout);
	else removeAllBoxes();
};

const removeImmediately = () => removeWithTimeout(0);

export default {
	startAnimating,
	stopAnimating,
	init,
	removeWithTimeout,
	removeImmediately,
};
