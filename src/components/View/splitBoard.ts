import type { WebBuilderElements } from "types";

import canSplitLine from "./canSplitLine";

type Lines = Array<[number, number]>;

const isColumnEmpty = (column: WebBuilderElements) => {
	if (!column || !column.length) return true;
	for (let i = 0; i < column.length; i++) {
		if (column[i]) return false;
	}
	return true;
};

const splitBoard = (
	board: Array<WebBuilderElements>,
	columns: number,
): Lines => {
	const lines: Lines = [];
	let openIndex = -1;

	for (let i = 0; i < columns; i++) {
		const column = board[i];
		if (isColumnEmpty(column)) {
			if (openIndex < 0) continue;
			lines.push([openIndex, i - 1]);
			continue;
		}

		if (openIndex < 0) {
			openIndex = i;
		}

		const next = board[i + 1];
		if (!next) {
			lines.push([openIndex, i]);
			openIndex = -1;
			continue;
		}

		if (canSplitLine(column, next)) {
			lines.push([openIndex, i]);
			openIndex = -1;
		}
	}

	if (openIndex >= 0) {
		lines.push([openIndex, columns - 1]);
	}

	if (lines.length === 1) return [];

	return lines;
};

export default splitBoard;
