import React from "react";
import { Tooltip } from "react-tooltip";

import { AddBreakpoint } from "./AddBreakpoint";
import { Anchor } from "./Anchor";
import { ArrowLeft } from "./ArrowLeft";
import { ColorBasic } from "./ColorBasic";
import { ColorGradient } from "./ColorGradient";
import { Configuration } from "./Configuration";
import { Container } from "./Container";
import { Cross } from "./Cross";
import { Desktop } from "./Desktop";
import { Hamburger } from "./Hamburger";
import { HTML } from "./HTML";
import { IFrame } from "./IFrame";
import { Image } from "./Image";
import { LetterSpacing } from "./LetterSpacing";
import { Line } from "./Line";
import { LineHeight } from "./LineHeight";
import { Link } from "./Link";
import { Loader } from "./Loader";
import { Mobile } from "./Mobile";
import { MoveUp } from "./MoveUp";
import { Padding } from "./Padding";
import { PageSettings } from "./PageSettings";
import { Palette } from "./Palette";
import { Plus } from "./Plus";
import { QuestionMark } from "./QuestionMark";
import { Redo } from "./Redo";
import { Row } from "./Row";
import { Square } from "./Square";
import { Tablet } from "./Tablet";
import { Text } from "./Text";
import { TextBold } from "./TextBold";
import { TextCenter } from "./TextCenter";
import { TextItalic } from "./TextItalic";
import { TextJustify } from "./TextJustify";
import { TextLeft } from "./TextLeft";
import { TextRight } from "./TextRight";
import { TextUnderline } from "./TextUnderline";
import { Trash } from "./Trash";
import type { IconWrapperProps } from "./types";
import { Undo } from "./Undo";
import { Video } from "./Video";
import { View } from "./View";
import { Zoom } from "./Zoom";

type IconProps = {
	icon: React.FC<IconWrapperProps>;
	tooltip?: string;
} & IconWrapperProps;

export function Icon({
	className,
	icon: RenderIcon,
	id,
	onClick,
	tooltip,
}: IconProps) {
	const svgProps = {
		className,
		"data-icon-id": id,
		"data-tooltip-id": id ? `tooltip-${id}` : undefined,
		onClick,
	};

	return (
		<>
			<RenderIcon {...svgProps} />
			{tooltip && <Tooltip id={`tooltip-${id}`}>{tooltip}</Tooltip>}
		</>
	);
}

Icon.AddBreakpoint = AddBreakpoint;
Icon.ArrowLeft = ArrowLeft;
Icon.Anchor = Anchor;
Icon.Configuration = Configuration;
Icon.ColorBasic = ColorBasic;
Icon.ColorGradient = ColorGradient;
Icon.Cross = Cross;
Icon.Container = Container;
Icon.Desktop = Desktop;
Icon.Hamburger = Hamburger;
Icon.HTML = HTML;
Icon.IFrame = IFrame;
Icon.Image = Image;
Icon.LetterSpacing = LetterSpacing;
Icon.Line = Line;
Icon.LineHeight = LineHeight;
Icon.Link = Link;
Icon.Loader = Loader;
Icon.Mobile = Mobile;
Icon.MoveUp = MoveUp;
Icon.QuestionMark = QuestionMark;
Icon.Palette = Palette;
Icon.Plus = Plus;
Icon.Redo = Redo;
Icon.Row = Row;
Icon.Square = Square;
Icon.Tablet = Tablet;
Icon.Text = Text;
Icon.Trash = Trash;
Icon.Padding = Padding;
Icon.PageSettings = PageSettings;
Icon.TextBold = TextBold;
Icon.TextCenter = TextCenter;
Icon.TextItalic = TextItalic;
Icon.TextJustify = TextJustify;
Icon.TextLeft = TextLeft;
Icon.TextRight = TextRight;
Icon.TextUnderline = TextUnderline;
Icon.Undo = Undo;
Icon.Video = Video;
Icon.View = View;
Icon.Zoom = Zoom;
