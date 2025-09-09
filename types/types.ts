import React from "react";

export type ElementId = string;

export type WebBuilderElementProperty = {
	propId: string;
	value: unknown;
};

export type Position = {
	x: number;
	y: number;
};

export type WebBuilderElement = {
	w: number;
	x: number;
	y: number;
	h?: number | "auto";
	id: ElementId;
	breakpointId?: string;
	componentName: string;
	disabledMove?: boolean;
	props: WebBuilderElementProperty[];
};

export type ElementExtra = {
	height?: number;
	paddingBottom?: number;
};

export type ElementsExtras = Record<string | number, ElementExtra>;

export type BreakpointsExtras = Record<BreakpointId, ElementsExtras>;

export type GeneratedElement = {
	marginTop: number;
} & Element;

export type WebBuilderElements = Array<WebBuilderElement>;

export type ElementsInBreakpoints = Record<string | number, WebBuilderElements>;

export type Option<T = string> = {
	value: T;
	label: string | JSX.Element;
};

export type FontImport = {
	fontFamily: string;
	stylesheet?: JSX.Element;
} & Option<string>;

export type ListOptions = Array<{
	id: string;
	label: string;
	active?: boolean;
}>;

export type FontOptions = {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	letterSpacing?: string;
	lineHeight?: string;
	textAlign?: "center" | "left" | "right" | "justify";
	size?: number;
};

export type WebBuilderComponentPropertyAbout = {
	type: "about";
	label: JSX.Element | string;
	description?: string;
	button?: {
		label?: string;
		url?: string;
	};
};

export type PropertyDefaultValue<T> =
	| T
	| (({ breakpoint }: { breakpoint: Breakpoint }) => T);

export type ElementURL = {
	location?: string;
	openInNewTab?: boolean;
};

export type ImageURL = {
	location?: string;
	locationUpload?: string;
	upload?: unknown;
};

export type BreakpointHeight = {
	enabled?: boolean;
	height?: number;
	isScrollbarHidden?: boolean;
	overflow: "hidden" | "scroll" | "visible";
	responsive?: boolean;
};

type BackgroundImageUnit = "px" | "%";

export type BackgroundImage = {
	position: {
		type: "numbers";
		numbers: {
			x: {
				value: number;
				unit: BackgroundImageUnit;
			};
			y: {
				value: number;
				unit: BackgroundImageUnit;
			};
		};
	};
	repeat: {
		type: "repeat" | "no-repeat";
	};
	size: {
		type: "cover" | "numbers";
		numbers: {
			width: {
				value: number;
				unit: BackgroundImageUnit;
			};
			height: {
				value: number;
				unit: BackgroundImageUnit;
			};
		};
	};
} & ImageURL;

export type HTMLComponentValue = {
	value: string;
};

export type WebBuilderComponentProperty = (
	| {
			type: "object";
			label: JSX.Element | string;
			of: WebBuilderComponentProperty[];
			defaultValue?: PropertyDefaultValue<Record<string, unknown>>;
	  }
	| {
			type: "array";
			label: JSX.Element | string;
			of: WebBuilderComponentProperty;
			min?: number;
			max?: number;
			defaultValue?: PropertyDefaultValue<Array<unknown>>;
	  }
	| {
			type: "toggle";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<boolean>;
	  }
	| {
			type: "text";
			label: JSX.Element | string;
			description?: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<string>;
			leftNode?: JSX.Element | string;
	  }
	| {
			type: "number";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<number>;
			min?: number;
			max?: number;
	  }
	| {
			type: "richtext";
			label: JSX.Element | string;
			colorAvailable?: boolean;
			hyperlinkAvailable?: boolean;
			defaultValue?: PropertyDefaultValue<TextElement[]>;
	  }
	| {
			type: "html";
			label: JSX.Element | string;
			defaultValue?: HTMLComponentValue;
	  }
	| {
			type: "select";
			label: JSX.Element | string;
			options: Option[];
			defaultValue?: PropertyDefaultValue<string>;
	  }
	| {
			type: "padding";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<Padding>;
	  }
	| {
			type: "border";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<Border>;
	  }
	| {
			type: "backgroundImage";
			defaultValue?: PropertyDefaultValue<BackgroundImage>;
	  }
	| {
			type: "list";
			label: JSX.Element | string;
			options: ListOptions;
			defaultValue?: PropertyDefaultValue<ListOptions>;
	  }
	| {
			type: "fontOptions";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<FontOptions>;
	  }
	| {
			type: "img";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<ImageURL>;
	  }
	| {
			type: "url";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<ElementURL>;
			canOpenInNewTab?: boolean;
	  }
	| WebBuilderComponentPropertyAbout
	| {
			type: "color";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<string>;
	  }
	| {
			type: "boxShadow";
			label: JSX.Element | string;
			defaultValue?: PropertyDefaultValue<string>;
	  }
	| {
			type: "openContainer";
	  }
	| {
			type: "editBreakpoint";
			field: keyof Breakpoint;
	  }
	| {
			type: "breakpointHeight";
			defaultValue?: PropertyDefaultValue<BreakpointHeight>;
	  }
	| {
			type: "fontFamily";
	  }
	| {
			type: "hidden";
	  }
) & {
	id: string;
	visibility?: (props: {
		breakpoint: Breakpoint;
		element: WebBuilderElement;
		formValues: Record<string, unknown>;
		prop: WebBuilderComponentProperty;
	}) => boolean;
	defaultValue?: PropertyDefaultValue<unknown>;
};

export type WebBuilderGroup = {
	id: string;
	label: JSX.Element | string;
	order?: number;
};

export type WebBuilderComponent = {
	id: string;
	label?: JSX.Element | string;
	icon?: React.FC;
	component: React.ReactNode | React.FC;
	defaultWidth?:
		| number
		| ((props: {
				component: WebBuilderComponent;
				breakpoint: Breakpoint;
		  }) => number);
	expandToWindowWidth?: boolean;
	group?: WebBuilderGroup | WebBuilderGroup[];
	props?: Array<WebBuilderComponentProperty>;
	order?: number;
	resizable?: boolean;
};

export type BreakpointId = string;

export type Padding = {
	top: number;
	right: number;
	bottom: number;
	left: number;
};

export type Border = {
	top: number;
	right: number;
	bottom: number;
	left: number;
	radius: number;
	color: string;
};

export type Breakpoint = {
	id: BreakpointId;
	parentId?: BreakpointId;
	from: number;
	to: number | null;
	rowHeight: number;
	cols: number;
	backgroundColor?: string;
	padding: Padding;
	view?: Tree;
	template?: Tree;
};

export type PageSettings = {
	backgroundColor?: string;
	colors?: string[];
	fontFamily?: string;
};

export type Page = {
	breakpoints: Breakpoint[];
	elementsInBreakpoints: Record<string, WebBuilderElements>;
	elementsExtras: BreakpointsExtras;
} & PageSettings;

export type Tree = {
	id: string;
	children?: Array<Tree>;
	marginLeft: number;
	marginRight: number;
	marginTop: number;
	marginBottom: number;
	paddingBottom?: number;
	element?: WebBuilderElement;
	w: number;
	h: number;
	type: "row" | "column" | "component" | "fixed";
};

export type Translations = unknown;

export type RenderInContainerProps = React.PropsWithChildren<{
	backgroundColor?: string;
	breakpoint?: Breakpoint;
	page?: Page;
}>;

export type TransformElementProperty = (
	componentProperty: WebBuilderComponentProperty,
	elementyPropertyp: WebBuilderElementProperty,
) => unknown;

export type BuilderCommonProps = {
	components?: Array<WebBuilderComponent>;
	container?: React.ElementType<RenderInContainerProps>;
	defaultBoxContent?: TextElement[];
	defaultButtonBackgroundColor?: string;
	defaultButtonAvailable?: boolean;
	defaultButtonContent?: TextElement[];
	defaultButtonHref?: string;
	defaultImageSrc?: string;
	defaultVideoSrc?: string;
	fonts?: FontImport[];
	translations?: Translations;
	transformElementProperty?: TransformElementProperty;
	page?: Page;
};

export type ViewProps = { page: Page } & BuilderCommonProps;

export type WebBuilderNavbarIcon = {
	id: string;
	icon: () => JSX.Element;
	tooltip?: string;
	onClick: (res: { page: Page }) => void;
};

export type HelperArrowItem = {
	hasButton?: boolean;
	selector: string;
	title: string;
};

export type OnImageUpload = (file: unknown) => Promise<ImageURL>;

export type WebBuilderProps = {
	builderHints?: HelperArrowItem[];
	enableDownload?: boolean;
	enableUpload?: boolean;
	navbarIcons?: Array<WebBuilderNavbarIcon>;
	page?: Page;
	pageSettingsExtra?: WebBuilderComponentProperty[];
	presetColors?: string[];
	onAutoSave?: (page: Page) => void;
	onChange?: (page: Page) => void;
	onAboutClick?: (about: WebBuilderComponentPropertyAbout["button"]) => void;
	onBeforeDownloadPage?: (page: Page) => { filename?: string; page?: Page };
	onExit?: () => Promise<void>;
	onImageUpload?: OnImageUpload;
	onPublish?: (page: Page) => Promise<unknown>;
	onSaveAsDraft?: (page: Page) => Promise<unknown>;
	onPagePreview?: (page: Page) => Promise<unknown>;
	onTemplateRestart?: () => Page;
} & BuilderCommonProps;

export type Configuration = {
	autoFocusRichTextInEditProperties: boolean;
	autoSave: boolean;
	bringElementsAbove: boolean;
	gridZoomingInCenter: boolean;
	helpLines: boolean;
	panZoomScroll: boolean;
	builderHintsId: number;
	scrollSpeed: number;
	editOnDoubleClick: boolean;
	preventCloseEditOnClick: boolean;
};

export type ILeaf = {
	bold?: boolean;
	code?: boolean;
	italic?: boolean;
	underline?: boolean;
	fontSize?: number;
	color?: string;
	text?: string;
	link?: string;
};

export type TextElement = {
	children: ILeaf[];
	align?: string;
	type: string;
	letterSpacing?: string;
	lineHeight?: string;
};

export type BoxProps = {
	backgroundColor?: string;
	border?: Partial<Border>;
	boxShadow?: string;
	content?: TextElement[];
	padding?: Partial<Padding>;
};

export type UseBoxStyleProps = {
	backgroundColor?: string;
	border?: Partial<Border>;
	boxShadow?: string;
	color?: string;
	fontOptions?: FontOptions;
	padding?: Partial<Padding>;
};

export type ElementRenderFunc = () => void;

export type VideoComponentProps = {
	url: ElementURL;
};

export type LineComponentProps = {
	dashesWidth: number;
	dashesGap: number;
	backgroundColor?: string;
	borderRadius: number;
	height: number;
	type: string;
};

export type ImageComponentProps = {
	border?: Partial<Border>;
	boxShadow?: string;
	href: ElementURL;
	url: ElementURL;
};

export type IFrameComponentProps = {
	backgroundColor?: string;
	border?: Partial<Border>;
	boxShadow?: string;
	element: WebBuilderElement;
	height: number;
	src?: ElementURL;
	padding?: Partial<Padding>;
};

export type ElementContainer = React.FC;

export type ElementAnchor = React.FC<{ anchorId: string }>;
