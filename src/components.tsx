import React, { memo } from 'react';
import { Trans } from 'react-i18next';
import ReactPlayer from 'react-player';
import {
  BuilderCommonProps,
  ElementContainer,
  ImageComponentProps,
  VideoComponentProps,
  WebBuilderComponent,
} from 'types';

import { Box } from '@/components/View/Box';
import { CustomButton } from '@/components/View/CustomButton';

import { VideoWrapper } from './components.styled';
import { Container } from './components/icons/Container';
import { CustomButton as CustomButtonIcon } from './components/icons/CustomButton';
import { IFrame as IFrameIcon } from './components/icons/IFrame';
import { Image as ImageIcon } from './components/icons/Image';
import { Line as LineIcon } from './components/icons/Line';
import { Row as RowIcon } from './components/icons/Row';
import { Text as TextIcon } from './components/icons/Text';
import { Video as VideoIcon } from './components/icons/Video';
import { IFrame } from './components/IFrame';
import { Line } from './components/Line';
import { Separator } from './components/Separator';
import theme from './components/StyleProvider/theme';
import { useBoxStyle } from './components/View/Box/useBoxStyle';
import {
  DEFAULT_BOX_CONTENT,
  DEFAULT_BUTTON_CONTENT,
  DEFAULT_BUTTON_HREF,
  DEFAULT_IMAGE_SRC,
  DEFAULT_VIDEO_SRC,
} from './consts';
import { BasicGroup, ButtonsGroup } from './groups';
import {
  createBackgroundColorProperty,
  createBorderProperty,
  createBoxShadowProperty,
  createColorProperty,
  createContentProperty,
  createPaddingProperty,
  createSourceProperty,
} from './properties';

export { useElementContainer } from './components/ComponentsProvider';
export { Line } from './components/Line';
export { IFrame } from '@/components/IFrame';
export { Box } from '@/components/View/Box';

export function Image({
  border, boxShadow, href, url,
}: ImageComponentProps) {
  const style = useBoxStyle({
    border,
    boxShadow,
  });

  if (!url || !url.location) return null;

  const width = '100%';

  const image = (
    <img style={{ width, ...style }} alt={url.location} src={url.location} />
  );

  const renderImage = () => {
    if (!href?.location) return image;

    const props: React.AnchorHTMLAttributes<HTMLAnchorElement> = {};

    if (href.openInNewTab) {
      props.target = '_blank';
    }

    props.href = href.location;
    props.style = { width };

    return (
      <a {...props}>{image}</a>
    );
  };

  return (
    <div style={{ display: 'flex', boxShadow }}>
      {renderImage()}
    </div>
  );
}

function VideoIn({ url }: VideoComponentProps) {
  if (!url) return null;
  return (
    <VideoWrapper>
      <ReactPlayer
        url={url.location}
        width="100%"
        height="100%"
      />
    </VideoWrapper>
  );
}

export const Video = memo(VideoIn, (a, b) => a.url === b.url);

export const useInternalComponents = ({
  defaultBoxContent,
  defaultButtonBackgroundColor,
  defaultButtonAvailable,
  defaultButtonContent,
  defaultButtonHref,
  defaultImageSrc,
  defaultVideoSrc,
  elementContainer,
}: BuilderCommonProps & { elementContainer: ElementContainer }) => {
  const components: Array<WebBuilderComponent> = [
    {
      id: 'Container',
      icon: Container,
      label: <Trans i18nKey="container.text" />,
      component: elementContainer,
      group: BasicGroup,
      props: [
        {
          id: 'openContainer',
          type: 'openContainer',
        },
        {
          id: 'breakpointHeight',
          type: 'breakpointHeight',
        },
        {
          id: 'cols',
          type: 'editBreakpoint',
          field: 'cols',
        },
        {
          id: 'backgroundColor',
          type: 'editBreakpoint',
          field: 'backgroundColor',
        },
        {
          id: 'backgroundImage',
          type: 'backgroundImage',
          defaultValue: {
            position: {
              type: 'numbers',
              numbers: {
                x: {
                  value: 0,
                  unit: 'px',
                },
                y: {
                  value: 0,
                  unit: 'px',
                },
              },
            },
            repeat: {
              type: 'no-repeat',
            },
            size: {
              type: 'cover',
              numbers: {
                width: {
                  value: 100,
                  unit: '%',
                },
                height: {
                  value: 100,
                  unit: '%',
                },
              },
            },
            location: '',
          },
        },
        {
          id: 'padding',
          type: 'editBreakpoint',
          field: 'padding',
        },
        {
          id: 'containerId',
          type: 'hidden',
        },
        createBorderProperty(),
        createBoxShadowProperty(),
      ],
      order: -600,
    },
    {
      id: 'Box',
      icon: TextIcon,
      label: <Trans i18nKey="element.text" />,
      component: Box,
      group: BasicGroup,
      props: [
        createContentProperty(defaultBoxContent || DEFAULT_BOX_CONTENT),
        createBackgroundColorProperty('transparent'),
        createPaddingProperty(),
        createBorderProperty(),
        createBoxShadowProperty(),
      ],
      order: -500,
    },
    {
      id: 'Image',
      icon: ImageIcon,
      label: <Trans i18nKey="element.image" />,
      component: Image,
      group: BasicGroup,
      props: [
        {
          id: 'url',
          label: <Trans i18nKey="element.imageUrl" />,
          type: 'img',
          defaultValue: { location: defaultImageSrc || DEFAULT_IMAGE_SRC },
        },
        {
          id: 'href',
          label: <Trans i18nKey="element.imageLink" />,
          type: 'url',
          defaultValue: { location: '', openInNewTab: true },
          canOpenInNewTab: true,
        },
        createBorderProperty(),
        createBoxShadowProperty(),
      ],
      order: -400,
    },
    {
      id: 'Video',
      icon: VideoIcon,
      label: <Trans i18nKey="element.video" />,
      component: Video,
      group: BasicGroup,
      props: [
        createSourceProperty(defaultVideoSrc || DEFAULT_VIDEO_SRC),
      ],
      order: -300,
    },
  ];

  if (defaultButtonAvailable !== false) {
    components.push({
      id: 'CustomButton',
      icon: CustomButtonIcon,
      label: <Trans i18nKey="element.customButton" />,
      component: CustomButton,
      group: ButtonsGroup,
      props: [
        createSourceProperty(defaultButtonHref || DEFAULT_BUTTON_HREF, true),
        createContentProperty(
          defaultButtonContent || DEFAULT_BUTTON_CONTENT,
          {
            colorAvailable: false,
            hyperlinkAvailable: false,
          },
        ),
        createColorProperty('#ffffff'),
        createBackgroundColorProperty(defaultButtonBackgroundColor || theme.colors.darkBlue),
        createPaddingProperty({
          top: 15,
          bottom: 15,
        }),
        createBorderProperty({
          radius: 4,
        }),
        createBoxShadowProperty(),
      ],
      order: -100,
    });
  }

  components.push({
    id: 'Line',
    icon: LineIcon,
    label: <Trans i18nKey="element.line.name" />,
    component: Line,
    group: BasicGroup,
    props: [
      {
        id: 'height',
        label: <Trans i18nKey="element.height" />,
        type: 'number',
        defaultValue: 2,
        min: 1,
      },
      {
        id: 'type',
        label: <Trans i18nKey="element.type" />,
        type: 'select',
        options: [
          {
            label: <Trans i18nKey="element.line.solid" />,
            value: 'solid',
          },
          {
            label: <Trans i18nKey="element.line.dashed" />,
            value: 'dashed',
          },
        ],
        defaultValue: 'solid',
      },
      {
        id: 'dashesWidth',
        label: <Trans i18nKey="element.dashes.width" />,
        type: 'number',
        visibility: ({ formValues }) => formValues.type === 'dashed',
        defaultValue: 2,
        min: 1,
      },
      {
        id: 'dashesGap',
        label: <Trans i18nKey="element.dashes.gap" />,
        type: 'number',
        visibility: ({ formValues }) => formValues.type === 'dashed',
        defaultValue: 2,
        min: 1,
      },
      createBackgroundColorProperty(theme.colors.lightGray),
      {
        id: 'borderRadius',
        label: <Trans i18nKey="element.border.radius" />,
        type: 'number',
        defaultValue: 0,
      },
    ],
    order: -200,
  });

  components.push({
    id: 'Separator',
    icon: RowIcon,
    label: <Trans i18nKey="element.separator" />,
    component: Separator,
    group: BasicGroup,
    props: [],
    order: -100,
  });

  components.push({
    id: 'Iframe',
    icon: IFrameIcon,
    label: <Trans i18nKey="element.iframe.name" />,
    component: IFrame,
    group: BasicGroup,
    props: [
      {
        id: 'src',
        label: <Trans i18nKey="element.iframe.src" />,
        type: 'url',
        defaultValue: { location: '' },
      },
      {
        id: 'height',
        label: <Trans i18nKey="element.iframe.height" />,
        type: 'number',
        defaultValue: 300,
        min: 10,
        max: 1200,
      },
      createBackgroundColorProperty('transparent'),
      createPaddingProperty(),
      createBorderProperty(),
      createBoxShadowProperty(),
    ],
    order: -50,
  });

  return components;
};
