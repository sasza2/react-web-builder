import type { WebBuilderElements } from "types";

type CutOptions = {
	from: number;
	to: number;
};

const cutBoard = (
	board: Array<WebBuilderElements>,
	{ from, to }: CutOptions,
) => {
	const boardAfterCut: Array<WebBuilderElements> = [];
	for (let i = from; i <= to; i++) {
		const row = board[i];
		if (!row) continue;

		for (let c = 0; c < row.length; c++) {
			const index = i - from;
			if (!boardAfterCut[index]) boardAfterCut[index] = [];
			boardAfterCut[index][c] = row[c];
		}
	}
	return boardAfterCut;
};

export default cutBoard;
