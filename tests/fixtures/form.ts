import { expect, type Locator } from "@playwright/test";

export const getInputValueAsInt = async (
	locator: Locator,
	testId: string,
): Promise<number> => {
	const input = locator.getByTestId(testId);
	const inputValue = parseInt(await input.inputValue());
	return inputValue || 0;
};

type EditFieldRichTextValue =
	| {
			type: "click";
			mark: "bold";
	  }
	| {
			type: "fill";
			text: string;
	  }
	| {
			type: "selectAll";
	  }
	| {
			type: "removeAll";
	  };

const editFieldRichText = async (
	formProperty: Locator,
	value: EditFieldRichTextValue[],
) => {
	const textbox = formProperty
		.frameLocator('[data-testid="richTextFrame"]')
		.getByRole("textbox");

	for await (const action of value) {
		// eslint-disable-line no-restricted-syntax
		if (action.type === "click") {
			const icon = formProperty.getByTestId(action.mark);
			expect(icon).toHaveCount(1);

			await icon.click();
			continue;
		}

		if (action.type === "selectAll") {
			await textbox.press("Control+A");
			continue;
		}

		if (action.type === "removeAll") {
			await textbox.focus();
			await textbox.press("Control+A");
			await textbox.press("Backspace");
			continue;
		}

		if (action.type === "fill") {
			await textbox.focus();
			await textbox.pressSequentially(action.text);
		}
	}
};

type EdgesValue = {
	left?: number;
	right?: number;
	top?: number;
	bottom?: number;
};

const editEdges = async (
	formProperty: Locator,
	value: EdgesValue,
	edgeFieldName: string,
) => {
	const fields = ["left", "right", "top", "bottom"] as const;

	for await (const field of fields) {
		// eslint-disable-line no-restricted-syntax
		if (value[field] === undefined) continue;

		const input = formProperty.getByTestId(`${edgeFieldName}.${field}`);
		await input.fill(`${value[field]}`);
	}
};

export const editPadding = (formProperty: Locator, value: EdgesValue) =>
	editEdges(formProperty, value, "padding");

export const editColor = async (formProperty: Locator, value: string) => {
	const colorPicker = formProperty.getByTestId("colorPicker");
	await colorPicker.click();

	const option = colorPicker.locator(
		`[data-testid*="color--${value.toLowerCase()}"]`,
	);
	await option.scrollIntoViewIfNeeded();
	await option.click();
};

type EditBorderValue = EdgesValue & {
	radius?: number;
	color?: string;
};

export const editBorder = async (
	formProperty: Locator,
	value: EditBorderValue,
) => {
	await editEdges(formProperty, value, "border");

	if (value.radius !== undefined) {
		const radiusInput = formProperty.getByTestId("border.radius.input");
		await radiusInput.fill(`${value.radius}`);
	}

	if (value.color !== undefined) {
		await editColor(formProperty, value.color);
	}
};

export const editUrl = async (formProperty: Locator, value: string) => {
	const colorSelect = formProperty.getByTestId("url");
	await colorSelect.fill(value);
	await colorSelect.blur();
};

export const editField = async (
	container: Locator,
	label: string,
	value: unknown,
) => {
	const labelElement = container.getByText(label, { exact: true });
	expect(labelElement).toHaveCount(1);

	const formProperty = container
		.locator('[data-testid*="formProperty--"]', { hasText: label })
		.first();
	expect(formProperty).toHaveCount(1);

	const testId = await formProperty.getAttribute("data-testid");
	expect(testId).toBeTruthy();

	const formPropertyTestId = testId
		.split(" ")
		.find((part) => part.startsWith("formProperty--"));
	expect(formPropertyTestId).toBeTruthy();

	const type = formPropertyTestId.replace("formProperty--", "");

	switch (type) {
		case "richtext":
			await editFieldRichText(formProperty, value as EditFieldRichTextValue[]);
			break;
		case "padding":
			await editPadding(formProperty, value as EdgesValue);
			break;
		case "color":
			await editColor(formProperty, value as string);
			break;
		case "border":
			await editBorder(formProperty, value as EditBorderValue);
			break;
		case "img":
		case "url":
			await editUrl(formProperty, value as string);
			break;
		default:
			throw new Error(`Unknown type ${type}`);
	}
};
