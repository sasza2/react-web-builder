export type IconWrapperProps = {
  className?: string,
  id?: string;
  onClick?: React.MouseEventHandler;
};

type RenderIcon = React.FC<IconWrapperProps>;

export type AllIcons = {
  AddBreakpoint: RenderIcon,
  ArrowLeft: RenderIcon,
  Anchor: RenderIcon,
  ColorBasic: RenderIcon,
  ColorGradient: RenderIcon,
  Configuration: RenderIcon,
  Cross: RenderIcon,
  Container: RenderIcon,
  Desktop: RenderIcon,
  Hamburger: RenderIcon,
  IFrame: RenderIcon,
  Image: RenderIcon,
  LetterSpacing: RenderIcon,
  Line: RenderIcon,
  LineHeight: RenderIcon,
  Link: RenderIcon,
  Loader: RenderIcon,
  Mobile: RenderIcon,
  QuestionMark: RenderIcon,
  Padding: RenderIcon,
  PageSettings: RenderIcon,
  Palette: RenderIcon,
  Redo: RenderIcon,
  Row: RenderIcon,
  Square: RenderIcon,
  Tablet: RenderIcon,
  Text: RenderIcon,
  TextBold: RenderIcon,
  TextCenter: RenderIcon,
  TextItalic: RenderIcon,
  TextJustify: RenderIcon,
  TextLeft: RenderIcon,
  TextRight: RenderIcon,
  TextUnderline: RenderIcon,
  Trash: RenderIcon,
  Undo: RenderIcon,
  Video: RenderIcon,
  View: RenderIcon,
  Zoom: RenderIcon,
};
