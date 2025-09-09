import React, { useState } from "react";
import type { Page, Tree } from "types";

import { createUniqueId } from "@/utils/createUniqueId";

import WebBuilder from "../WebBuilder";
import { fonts } from "./consts";

const templateDesktop: Tree = {
	id: "row1",
	h: 0,
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	marginTop: 0,
	type: "row",
	w: 10,
	children: [
		{
			id: "Box1",
			h: 0,
			marginBottom: 0,
			marginLeft: 2,
			marginRight: 0,
			marginTop: 0,
			w: 8,
			type: "component",
			element: {
				id: "Box1",
				componentName: "Box",
				props: [],
				h: "auto",
				x: 0,
				y: 0,
				w: 8,
			},
		},
		{
			id: "Column2",
			h: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 3,
			type: "column",
			w: 10,
			children: [
				{
					id: "Box2",
					h: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					marginTop: 0,
					w: 4,
					type: "component",
					element: {
						id: "Box2",
						componentName: "Box",
						props: [],
						h: "auto",
						x: 0,
						y: 0,
						w: 4,
					},
				},
				{
					id: "Box3",
					h: 0,
					marginBottom: 0,
					marginLeft: 2,
					marginRight: 0,
					marginTop: 0,
					w: 4,
					type: "component",
					element: {
						id: "Box3",
						componentName: "Box",
						props: [],
						h: "auto",
						x: 0,
						y: 0,
						w: 4,
					},
				},
			],
		},
	],
};

const templateMobile: Tree = {
	id: "row1",
	h: 0,
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	marginTop: 0,
	type: "row",
	w: 5,
	children: [
		{
			id: "Box4",
			h: 0,
			marginBottom: 0,
			marginLeft: 1,
			marginRight: 0,
			marginTop: 0,
			w: 4,
			type: "component",
			element: {
				id: "Box4",
				componentName: "Box",
				props: [],
				h: "auto",
				x: 0,
				y: 0,
				w: 4,
			},
		},
		{
			id: "Img1",
			h: 0,
			marginBottom: 0,
			marginLeft: 1,
			marginRight: 0,
			marginTop: 2,
			w: 3,
			type: "component",
			element: {
				id: "Img1",
				componentName: "Image",
				props: [
					{
						propId: "url",
						value: {
							location: "https://www.w3schools.com/html/img_chania.jpg",
						},
					},
				],
				h: "auto",
				x: 0,
				y: 0,
				w: 3,
			},
		},
		{
			id: "Column2",
			h: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 3,
			type: "column",
			w: 5,
			children: [
				{
					id: "Box5",
					h: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					marginTop: 0,
					w: 3,
					type: "component",
					element: {
						id: "Box5",
						componentName: "Box",
						props: [],
						h: "auto",
						x: 0,
						y: 0,
						w: 3,
					},
				},
				{
					id: "Box6",
					h: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					marginTop: 0,
					w: 2,
					type: "component",
					element: {
						id: "Box6",
						componentName: "Box",
						props: [],
						h: "auto",
						x: 0,
						y: 0,
						w: 2,
					},
				},
			],
		},
		{
			id: "Button1",
			h: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 2,
			w: 5,
			type: "component",
			element: {
				id: "Button1",
				componentName: "CustomButton",
				props: [
					{
						propId: "content",
						value: [
							{
								align: "center",
								type: "paragraph",
								children: [
									{
										fontSize: 18,
										text: "Button",
									},
								],
							},
						],
					},
				],
				h: "auto",
				x: 0,
				y: 0,
				w: 5,
			},
		},
	],
};

const template = {
	breakpoints: [
		{
			id: createUniqueId(),
			from: 360,
			to: null,
			cols: 5,
			rowHeight: 15,
			backgroundColor: "#f8f8f8",
			padding: {
				top: 15,
				left: 15,
				right: 15,
				bottom: 0,
			},
			template: templateMobile,
		},
		{
			id: createUniqueId(),
			from: 1280,
			to: null,
			cols: 10,
			rowHeight: 15,
			backgroundColor: "#f8f8f8",
			padding: {
				top: 15,
				left: 15,
				right: 15,
				bottom: 0,
			},
			template: templateDesktop,
		},
	],
} as Page;

export function Templates() {
	const [page] = useState<Page>(() => {
		const pageFromLocalStorage = JSON.parse(
			localStorage.getItem("page-builder-draft"),
		) as Page;
		if (pageFromLocalStorage) return pageFromLocalStorage;
		return template;
	});

	const onPublish = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem(
					"page-builder-published",
					JSON.stringify(nextPage),
				);
				window.parent.location =
					"/?path=/story/webbuilder-published--published";
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onSaveAsDraft = (nextPage: Page) =>
		new Promise((resolve) => {
			setTimeout(() => {
				localStorage.setItem("page-builder-draft", JSON.stringify(nextPage));
				resolve(undefined);
			}, 100); // fake backend delay
		});

	const onTemplateRestart = (): Page | null => template;

	return (
		<WebBuilder
			page={page}
			onPublish={onPublish}
			onSaveAsDraft={onSaveAsDraft}
			onTemplateRestart={onTemplateRestart}
			components={[]}
			fonts={fonts}
		/>
	);
}

const meta = {
	component: Templates,
	parameters: {
		layout: "fullscreen",
		options: { showPanel: false },
	},
	title: "WebBuilder/Templates",
};

export default meta;
