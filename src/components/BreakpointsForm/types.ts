import type { Padding } from "types";

export type Error = {
	name: string;
	error: string;
};

export type Errors = Error[];

export type IForm = Record<string, unknown> & {
	from: string;
	rowHeight: string;
	cols: string;
	padding: Padding;
	backgroundColor: string;
};
