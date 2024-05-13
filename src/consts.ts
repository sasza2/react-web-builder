import { FontImport, TextElement } from 'types';

export const DEFAULT_LANGUAGE = 'en';
export const DOUBLE_CLICK_TIMEOUT = 700; // ms
export const SIDEBAR_WIDTH = 281; // px
export const NAVBAR_HEIGHT = 80; // px
export const WAIT_FOR_LOAD = 1500; // ms
export const DEFAULT_LETTER_SPACING = 'normal';
export const DEFAULT_LINE_HEIGHT = '1.5';
export const DEFAULT_BOX_CONTENT: TextElement[] = [
  {
    type: 'paragraph',
    children: [
      {
        color: '#000000',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      },
    ],
  },
];
export const DEFAULT_BUTTON_CONTENT = [
  {
    align: 'center',
    type: 'paragraph',
    children: [{
      fontSize: 18,
      text: 'Button',
    }],
  },
] as TextElement[];
export const DEFAULT_BUTTON_HREF = 'https://google.com';

// TODO
export const DEFAULT_IMAGE_SRC = 'https://www.w3schools.com/html/workplace.jpg';
export const DEFAULT_VIDEO_SRC = 'https://www.youtube.com/watch?v=IWVJq-4zW24';
export const DEFAULT_PRESET_COLORS = [
  '#ffffff',
  '#217D48',
  '#ED8908',
  '#DA4E11',
  '#734E7E',
  '#227781',
  '#854929',
  '#AD1F20',
  '#108FC6',
  '#1A1A1A',
  '#0C6D97',
];

export const DEFAULT_FONT_IMPORT: FontImport = {
  fontFamily: 'Arial, sans-serif',
  label: 'sans-serif',
  value: 'sans-serif',
};

export const MARGIN_BOTTOM_ON_PASTED_ELEMENT = 3; // rows
