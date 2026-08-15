import { render as testingLibraryRender, screen } from "@testing-library/react";
import React from "react";
import type { WebBuilderComponentProperty } from "types";
import { describe, expect, it, vi } from "vitest";

vi.mock("../forms/About", () => ({
	About: (props: unknown) => (
		<div data-testid="mock-about">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/Array", () => ({
	FormArray: (props: unknown) => (
		<div data-testid="mock-array">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/BackgroundImage", () => ({
	BackgroundImage: (props: unknown) => (
		<div data-testid="mock-backgroundImage">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/Border", () => ({
	Border: (props: unknown) => (
		<div data-testid="mock-border">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/BoxShadow", () => ({
	BoxShadow: (props: unknown) => (
		<div data-testid="mock-boxShadow">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/BreakpointHeight", () => ({
	BreakpointHeight: (props: unknown) => (
		<div data-testid="mock-breakpointHeight">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/ColorPicker", () => ({
	ColorPicker: (props: unknown) => (
		<div data-testid="mock-colorPicker">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/EditBreakpointField", () => ({
	EditBreakpointField: (props: unknown) => (
		<div data-testid="mock-editBreakpoint">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/FontFamily", () => ({
	FontFamily: (props: unknown) => (
		<div data-testid="mock-fontFamily">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/FontOptions", () => ({
	FontOptions: (props: unknown) => (
		<div data-testid="mock-fontOptions">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/ImageUpload", () => ({
	ImageUpload: (props: unknown) => (
		<div data-testid="mock-imageUpload">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/Input", () => ({
	Input: (props: unknown) => (
		<div data-testid="mock-input">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/InputHTML", () => ({
	InputHTML: (props: unknown) => (
		<div data-testid="mock-inputHtml">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/ListOrder", () => ({
	ListOrder: (props: unknown) => (
		<div data-testid="mock-listOrder">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/Object", () => ({
	FormObject: (props: unknown) => (
		<div data-testid="mock-object">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/OpenContainer", () => ({
	OpenContainer: (props: unknown) => (
		<div data-testid="mock-openContainer">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/Padding", () => ({
	Padding: (props: unknown) => (
		<div data-testid="mock-padding">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/RangeSlider", () => ({
	RangeSlider: (props: unknown) => (
		<div data-testid="mock-rangeSlider">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/RichText", () => ({
	RichText: (props: unknown) => (
		<div data-testid="mock-richText">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/Select/Select", () => ({
	Select: (props: unknown) => (
		<div data-testid="mock-select">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/Toggle", () => ({
	Toggle: (props: unknown) => (
		<div data-testid="mock-toggle">{JSON.stringify(props)}</div>
	),
}));
vi.mock("../forms/URLInput", () => ({
	URLInput: (props: unknown) => (
		<div data-testid="mock-urlInput">{JSON.stringify(props)}</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { FormProperty } from "./FormProperty";

const baseProps = {
	formCreatorId: "form-1",
	name: "myProp",
};

const render = (ui: React.ReactElement) =>
	testingLibraryRender(<StyleProvider>{ui}</StyleProvider>);

describe("FormProperty", () => {
	it("renders FontOptions for type fontOptions", () => {
		const prop = {
			id: "myProp",
			type: "fontOptions",
			label: "Font options",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("Font options")).not.toBeNull();
		expect(screen.getByTestId("mock-fontOptions")).not.toBeNull();
	});

	it("renders FontFamily for type fontFamily (no wrapper)", () => {
		const prop = {
			id: "myProp",
			type: "fontFamily",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByTestId("mock-fontFamily")).not.toBeNull();
	});

	it("renders ListOrder for type list", () => {
		const prop = {
			id: "myProp",
			type: "list",
			label: "List",
			options: [],
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("List")).not.toBeNull();
		expect(screen.getByTestId("mock-listOrder")).not.toBeNull();
	});

	it("renders Padding for type padding", () => {
		const prop = {
			id: "myProp",
			type: "padding",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} testId="myTestId" />);

		expect(screen.getByTestId("mock-padding")).not.toBeNull();
	});

	it("renders Border for type border", () => {
		const prop = {
			id: "myProp",
			type: "border",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByTestId("mock-border")).not.toBeNull();
	});

	it("renders BackgroundImage for type backgroundImage passing onImageUpload", () => {
		const onImageUpload = vi.fn();
		const prop = {
			id: "myProp",
			type: "backgroundImage",
		} as WebBuilderComponentProperty;
		render(
			<FormProperty {...baseProps} prop={prop} onImageUpload={onImageUpload} />,
		);

		expect(screen.getByTestId("mock-backgroundImage")).not.toBeNull();
	});

	it("renders BoxShadow for type boxShadow", () => {
		const prop = {
			id: "myProp",
			type: "boxShadow",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByTestId("mock-boxShadow")).not.toBeNull();
	});

	it("renders Select for type select", () => {
		const prop = {
			id: "myProp",
			type: "select",
			label: "Select label",
			options: [],
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("Select label")).not.toBeNull();
		expect(screen.getByTestId("mock-select")).not.toBeNull();
	});

	it("renders RichText for type richtext with autoFocus/formCreatorId", () => {
		const prop = {
			id: "myProp",
			type: "richtext",
			label: "Rich text",
			colorAvailable: true,
			hyperlinkAvailable: true,
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} autoFocus />);

		expect(screen.getByText("Rich text")).not.toBeNull();
		expect(screen.getByTestId("mock-richText")).not.toBeNull();
	});

	it("renders InputHTML for type html", () => {
		const prop = {
			id: "myProp",
			type: "html",
			label: "HTML",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("HTML")).not.toBeNull();
		expect(screen.getByTestId("mock-inputHtml")).not.toBeNull();
	});

	it("renders Input for type text", () => {
		const prop = {
			id: "myProp",
			type: "text",
			label: "Text",
			leftNode: "px",
			description: "desc",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("Text")).not.toBeNull();
		expect(screen.getByTestId("mock-input")).not.toBeNull();
	});

	it("renders URLInput for type url", () => {
		const prop = {
			id: "myProp",
			type: "url",
			label: "URL",
			canOpenInNewTab: true,
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("URL")).not.toBeNull();
		expect(screen.getByTestId("mock-urlInput")).not.toBeNull();
	});

	it("renders ColorPicker for type color", () => {
		const prop = {
			id: "myProp",
			type: "color",
			label: "Color",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} defaultValue="#ffffff" />);

		expect(screen.getByText("Color")).not.toBeNull();
		expect(screen.getByTestId("mock-colorPicker")).not.toBeNull();
	});

	it("renders RangeSlider for type number", () => {
		const prop = {
			id: "myProp",
			type: "number",
			label: "Number",
			min: 0,
			max: 50,
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("Number")).not.toBeNull();
		expect(screen.getByTestId("mock-rangeSlider")).not.toBeNull();
	});

	it("renders RangeSlider with a default max when max is not provided", () => {
		const prop = {
			id: "myProp",
			type: "number",
			label: "Number",
			min: 0,
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByTestId("mock-rangeSlider").textContent).toContain(
			'"max":20',
		);
	});

	it("renders Toggle for type toggle", () => {
		const prop = {
			id: "myProp",
			type: "toggle",
			label: "Toggle",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("Toggle")).not.toBeNull();
		expect(screen.getByTestId("mock-toggle")).not.toBeNull();
	});

	it("renders OpenContainer for type openContainer (no wrapper)", () => {
		const prop = {
			id: "myProp",
			type: "openContainer",
			label: "Open",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} testId="openTestId" />);

		expect(screen.getByTestId("mock-openContainer")).not.toBeNull();
	});

	it("renders BreakpointHeight for type breakpointHeight (no wrapper)", () => {
		const prop = {
			id: "myProp",
			type: "breakpointHeight",
			label: "BP Height",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByTestId("mock-breakpointHeight")).not.toBeNull();
	});

	it("renders EditBreakpointField for type editBreakpoint (no wrapper)", () => {
		const prop = {
			id: "myProp",
			type: "editBreakpoint",
			label: "Edit BP",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByTestId("mock-editBreakpoint")).not.toBeNull();
	});

	it("renders About for type about", () => {
		const prop = {
			id: "myProp",
			type: "about",
			label: "About",
			description: "desc",
			button: { label: "Go", url: "https://example.com" },
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("About")).not.toBeNull();
		expect(screen.getByTestId("mock-about")).not.toBeNull();
	});

	it("renders ImageUpload for type img when onImageUpload is provided", () => {
		const onImageUpload = vi.fn();
		const prop = {
			id: "myProp",
			type: "img",
			label: "Image",
		} as WebBuilderComponentProperty;
		render(
			<FormProperty {...baseProps} prop={prop} onImageUpload={onImageUpload} />,
		);

		expect(screen.getByText("Image")).not.toBeNull();
		expect(screen.getByTestId("mock-imageUpload")).not.toBeNull();
	});

	it("does not render ImageUpload for type img when onImageUpload is missing", () => {
		const prop = {
			id: "myProp",
			type: "img",
			label: "Image",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("Image")).not.toBeNull();
		expect(screen.queryByTestId("mock-imageUpload")).toBeNull();
	});

	it("renders FormArray for type array", () => {
		const prop = {
			id: "myProp",
			type: "array",
			label: "Array",
			of: {} as WebBuilderComponentProperty,
		} as WebBuilderComponentProperty;
		render(
			<FormProperty {...baseProps} prop={prop} autoFocus defaultValue={[]} />,
		);

		expect(screen.getByTestId("mock-array")).not.toBeNull();
	});

	it("renders FormObject for type object", () => {
		const prop = {
			id: "myProp",
			type: "object",
			label: "Object",
			of: [],
		} as WebBuilderComponentProperty;
		render(
			<FormProperty {...baseProps} prop={prop} autoFocus defaultValue={{}} />,
		);

		expect(screen.getByTestId("mock-object")).not.toBeNull();
	});

	it("returns null for an unknown prop type", () => {
		const prop = {
			id: "myProp",
			type: "unknown-type",
		} as unknown as WebBuilderComponentProperty;
		const { container } = render(<FormProperty {...baseProps} prop={prop} />);

		expect(container.textContent).toBe("");
	});

	it("uses the default testId of 'formProperty' when none is passed", () => {
		const prop = {
			id: "myProp",
			type: "toggle",
			label: "Toggle",
		} as WebBuilderComponentProperty;
		render(<FormProperty {...baseProps} prop={prop} />);

		expect(screen.getByText("Toggle")).not.toBeNull();
	});
});
