import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = {
  type?: string;
  align?: string,
  lineHeight?: string,
  letterSpacing?: string,
  children: CustomText[],
};
type CustomText = {
  text: string;
  bold?: true,
  fontSize?: number,
  color?: string,
  link?: string,
  openInNewTab?: boolean,
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
