import type { Tree, WebBuilderElements } from "types";
import { expect, it, vi } from "vitest";

import createTreeElements from "./createTreeElements";

const MOCK_ID = "none";

vi.mock("@/utils/createUniqueId", () => ({
	createUniqueId: () => MOCK_ID,
}));

it("createTreeElement #1", () => {
	const elements: WebBuilderElements = [
		{
			id: "1",
			w: 20,
			x: 0,
			y: 31,
			componentName: "type",
			props: [],
		},
		{
			id: "2",
			w: 20,
			x: 0,
			y: 62,
			componentName: "type",
			props: [],
		},
	];

	const elementsExtras = {
		1: { height: 2 },
		2: { height: 1 },
	};

	const result: Tree = {
		children: [
			{
				element: {
					componentName: "type",
					id: "1",
					props: [],
					w: 20,
					x: 0,
					y: 0,
				},
				h: 2,
				id: MOCK_ID,
				marginBottom: 29,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 31,
				paddingBottom: 0,
				type: "component",
				w: 20,
			},
			{
				element: {
					componentName: "type",
					id: "2",
					props: [],
					w: 20,
					x: 0,
					y: 0,
				},
				h: 1,
				id: MOCK_ID,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				paddingBottom: 0,
				type: "component",
				w: 20,
			},
		],
		h: 400,
		id: MOCK_ID,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		type: "row",
		w: 20,
	};

	expect(createTreeElements(elements, elementsExtras, 20, 400)).toEqual(result);
});

it("createTreeElement #2", () => {
	const elements: WebBuilderElements = [
		{
			id: "1",
			w: 3,
			x: 0,
			y: 0,
			componentName: "example",
			props: [],
		},
		{
			id: "2",
			w: 2,
			x: 4,
			y: 0,
			componentName: "test",
			props: [],
		},
		{
			id: "3",
			w: 2,
			x: 4,
			y: 3,
			componentName: "test22",
			props: [],
		},
	];

	const elementsExtras = {
		1: { height: 2 },
		2: { height: 1 },
		3: { height: 1 },
	};

	const result: Tree = {
		children: [
			{
				element: { ...elements[0], x: 0, y: 0 },
				h: 2,
				id: MOCK_ID,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 1,
				marginTop: 0,
				paddingBottom: 0,
				type: "component",
				w: 3,
			},
			{
				children: [
					{
						element: { ...elements[1], x: 0, y: 0 },
						h: 1,
						id: MOCK_ID,
						marginBottom: 2,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 0,
						paddingBottom: 0,
						type: "component",
						w: 2,
					},
					{
						element: { ...elements[2], x: 0, y: 0 },
						h: 1,
						id: MOCK_ID,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 0,
						paddingBottom: 0,
						type: "component",
						w: 2,
					},
				],
				h: 4,
				id: MOCK_ID,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				type: "row",
				w: 2,
			},
		],
		h: 4,
		id: MOCK_ID,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		type: "column",
		w: 6,
	};

	expect(createTreeElements(elements, elementsExtras, 6, 4)).toEqual(result);
});

it("createTreeElement #3", () => {
	const elements: WebBuilderElements = [
		{
			id: "1",
			w: 4,
			x: 0,
			y: 20,
			componentName: "example",
			props: [],
		},
		{
			id: "2",
			w: 15,
			x: 4,
			y: 20,
			componentName: "test",
			props: [],
		},
		{
			id: "3",
			w: 4,
			x: 0,
			y: 38,
			componentName: "test22",
			props: [],
		},
		{
			id: "4",
			w: 15,
			x: 4,
			y: 38,
			componentName: "test22",
			props: [],
		},
	];

	const elementsExtras = {
		1: { height: 15 },
		2: { height: 15 },
		3: { height: 2 },
		4: { height: 2 },
	};

	const result: Tree = {
		children: [
			{
				children: [
					{
						element: {
							...elements[0],
							x: 0,
							y: 0,
						},
						h: 15,
						id: MOCK_ID,
						marginBottom: 3,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 20,
						paddingBottom: 0,
						type: "component",
						w: 4,
					},
					{
						element: {
							...elements[2],
							x: 0,
							y: 0,
						},
						h: 2,
						id: MOCK_ID,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 0,
						paddingBottom: 0,
						type: "component",
						w: 4,
					},
				],
				h: 400,
				id: MOCK_ID,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				type: "row",
				w: 4,
			},
			{
				children: [
					{
						element: { ...elements[1], x: 0, y: 0 },
						h: 15,
						id: MOCK_ID,
						marginBottom: 3,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 20,
						paddingBottom: 0,
						type: "component",
						w: 15,
					},
					{
						element: { ...elements[3], x: 0, y: 0 },
						h: 2,
						id: MOCK_ID,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 0,
						paddingBottom: 0,
						type: "component",
						w: 15,
					},
				],
				h: 400,
				id: MOCK_ID,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				type: "row",
				w: 15,
			},
		],
		h: 400,
		id: MOCK_ID,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		type: "column",
		w: 20,
	};

	expect(createTreeElements(elements, elementsExtras, 20, 400)).toEqual(result);
});

it("createTreeElement #4", () => {
	const elements: WebBuilderElements = [
		{
			id: "1",
			x: 0,
			y: 20,
			w: 20,
			componentName: "type",
			props: [],
		},
		{
			id: "2",
			x: 0,
			y: 32,
			w: 8,
			componentName: "type",
			props: [],
		},
		{
			id: "3",
			x: 9,
			y: 32,
			w: 11,
			componentName: "type",
			props: [],
		},
		{
			id: "4",
			x: 14,
			y: 34,
			w: 5,
			componentName: "type",
			props: [],
		},
		{
			id: "5",
			x: 0,
			y: 39,
			w: 12,
			componentName: "type",
			props: [],
		},
	];

	const elementsExtras = {
		1: { height: 10 },
		2: { height: 5 },
		3: { height: 1 },
		4: { height: 1 },
		5: { height: 1 },
	};

	const result: Tree = {
		children: [
			{
				element: {
					componentName: "type",
					id: "1",
					props: [],
					w: 20,
					x: 0,
					y: 0,
				},
				h: 10,
				id: MOCK_ID,
				marginBottom: 2,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 20,
				paddingBottom: 0,
				type: "component",
				w: 20,
			},
			{
				children: [
					{
						element: {
							componentName: "type",
							id: "2",
							props: [],
							w: 8,
							x: 0,
							y: 0,
						},
						h: 5,
						id: MOCK_ID,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 1,
						marginTop: 0,
						paddingBottom: 0,
						type: "component",
						w: 8,
					},
					{
						children: [
							{
								element: {
									componentName: "type",
									id: "3",
									props: [],
									w: 11,
									x: 0,
									y: 0,
								},
								h: 1,
								id: MOCK_ID,
								marginBottom: 1,
								marginLeft: 0,
								marginRight: 0,
								marginTop: 0,
								paddingBottom: 0,
								type: "component",
								w: 11,
							},
							{
								element: {
									componentName: "type",
									id: "4",
									props: [],
									w: 5,
									x: 5,
									y: 0,
								},
								h: 1,
								id: MOCK_ID,
								marginBottom: 0,
								marginLeft: 5,
								marginRight: 0,
								marginTop: 0,
								paddingBottom: 0,
								type: "component",
								w: 5,
							},
						],
						h: 5,
						id: MOCK_ID,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 0,
						type: "row",
						w: 11,
					},
				],
				h: 5,
				id: MOCK_ID,
				marginBottom: 2,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				type: "column",
				w: 20,
			},
			{
				element: {
					componentName: "type",
					id: "5",
					props: [],
					w: 12,
					x: 0,
					y: 0,
				},
				h: 1,
				id: MOCK_ID,
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				paddingBottom: 0,
				type: "component",
				w: 12,
			},
		],
		h: 400,
		id: MOCK_ID,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		type: "row",
		w: 20,
	};

	expect(createTreeElements(elements, elementsExtras, 20, 400)).toStrictEqual(
		result,
	);
});

it("createTreeElement #5", () => {
	const elements: WebBuilderElements = [
		{
			id: "1",
			x: 5,
			y: 10,
			w: 7,
			componentName: "type",
			props: [],
		},
		{
			id: "2",
			x: 5,
			y: 12,
			w: 3,
			componentName: "type",
			props: [],
		},
		{
			id: "3",
			x: 9,
			y: 12,
			w: 3,
			componentName: "type",
			props: [],
		},
		{
			id: "4",
			x: 5,
			y: 18,
			w: 7,
			componentName: "type",
			props: [],
		},
	];

	const elementsExtras = {
		1: { height: 1 },
		2: { height: 1 },
		3: { height: 1 },
		4: { height: 1 },
	};

	const result: Tree = {
		children: [
			{
				element: {
					componentName: "type",
					id: "1",
					props: [],
					w: 7,
					x: 5,
					y: 0,
				},
				h: 1,
				id: MOCK_ID,
				marginBottom: 1,
				marginLeft: 5,
				marginRight: 0,
				marginTop: 10,
				paddingBottom: 0,
				type: "component",
				w: 7,
			},
			{
				children: [
					{
						element: {
							componentName: "type",
							id: "2",
							props: [],
							w: 3,
							x: 0,
							y: 0,
						},
						h: 1,
						id: MOCK_ID,
						marginBottom: 0,
						marginLeft: 5,
						marginRight: 1,
						marginTop: 0,
						paddingBottom: 0,
						type: "component",
						w: 3,
					},
					{
						element: {
							componentName: "type",
							id: "3",
							props: [],
							w: 3,
							x: 0,
							y: 0,
						},
						h: 1,
						id: MOCK_ID,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 0,
						marginTop: 0,
						paddingBottom: 0,
						type: "component",
						w: 3,
					},
				],
				h: 1,
				id: MOCK_ID,
				marginBottom: 5,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				type: "column",
				w: 20,
			},
			{
				element: {
					componentName: "type",
					id: "4",
					props: [],
					w: 7,
					x: 5,
					y: 0,
				},
				h: 1,
				id: MOCK_ID,
				marginBottom: 0,
				marginLeft: 5,
				marginRight: 0,
				marginTop: 0,
				paddingBottom: 0,
				type: "component",
				w: 7,
			},
		],
		h: 30,
		id: MOCK_ID,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		type: "row",
		w: 20,
	};

	expect(createTreeElements(elements, elementsExtras, 20, 30)).toEqual(result);
});
