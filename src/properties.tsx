import React from 'react';
import { Trans } from 'react-i18next';

import {
  Border, TextElement, Padding, WebBuilderComponentProperty,
} from 'types';

export const createContentProperty = (
  defaultBoxContent: TextElement[],
  options: { colorAvailable?: boolean, hyperlinkAvailable?: boolean } = {},
): WebBuilderComponentProperty => ({
  id: 'content',
  label: <Trans i18nKey="element.content" />,
  type: 'richtext',
  defaultValue: defaultBoxContent,
  ...options,
});

export const createColorProperty = (
  defaultValue: string,
): WebBuilderComponentProperty => ({
  id: 'color',
  label: <Trans i18nKey="element.customColor" />,
  type: 'color',
  defaultValue,
});

export const createBackgroundColorProperty = (defaultValue?: string): WebBuilderComponentProperty => ({
  id: 'backgroundColor',
  label: <Trans i18nKey="element.backgroundColor" />,
  type: 'color',
  defaultValue: defaultValue || '#eeeeee',
});

export const createPaddingProperty = (defaultValue?: Partial<Padding>): WebBuilderComponentProperty => ({
  id: 'padding',
  label: <Trans i18nKey="element.padding" />,
  type: 'padding',
  defaultValue: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...defaultValue,
  },
});

export const createBorderProperty = (defaultValue?: Partial<Border>): WebBuilderComponentProperty => ({
  id: 'border',
  label: <Trans i18nKey="element.border.name" />,
  type: 'border',
  defaultValue: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    color: '#dddddd',
    radius: 0,
    ...defaultValue,
  },
});

export const createSourceProperty = (
  defaultValue: string = '',
  openInNewTab?: boolean,
): WebBuilderComponentProperty => ({
  id: 'url',
  label: <Trans i18nKey="element.source" />,
  type: 'url',
  defaultValue: { location: defaultValue, openInNewTab },
  canOpenInNewTab: openInNewTab,
});
