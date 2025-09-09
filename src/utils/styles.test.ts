import { expect, it } from "vitest";

import { mergeStyles } from "./styles";

it("should properly merge styles", () => {
	expect(
		mergeStyles(
			{
				background: "red",
				color: "green",
			},
			{
				backgroundImage: "url(image.png)",
			},
		),
	).toStrictEqual({
		background: "url(image.png), red",
		color: "green",
	});

	expect(
		mergeStyles({
			backgroundImage: "url(example.png)",
			color: "green",
		}),
	).toStrictEqual({
		background: "url(example.png)",
		color: "green",
	});
});
