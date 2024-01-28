import React, { memo } from 'react';
import ReactPlayer from 'react-player';
import { Trans } from 'react-i18next';

import {
  BuilderCommonProps,
  ImageComponentProps,
  VideoComponentProps,
  WebBuilderComponent,
} from 'types';
import { Box } from '@/components/View/Box';
import { CustomButton } from '@/components/View/CustomButton';
import theme from './components/StyleProvider/theme';
import { CustomButton as CustomButtonIcon } from './components/icons/CustomButton';
import { Line } from './components/Line';
import { IFrame as IFrameIcon } from './components/icons/IFrame';
import { Line as LineIcon } from './components/icons/Line';
import { Image as ImageIcon } from './components/icons/Image';
import { Video as VideoIcon } from './components/icons/Video';
import { Text as TextIcon } from './components/icons/Text';
import { Row as RowIcon } from './components/icons/Row';
import { Separator } from './components/Separator';
import { VideoWrapper } from './components.styled';
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
  createColorProperty,
  createContentProperty,
  createPaddingProperty,
  createSourceProperty,
} from './properties';
import { IFrame } from './components/IFrame';

export { Box } from '@/components/View/Box';
export { IFrame } from '@/components/IFrame';
export { Line } from './components/Line';

export function Image({
  href, url,
}: ImageComponentProps) {
  if (!url || !url.location) return null;

  const image = (
    <img style={{ width: '100%' }} alt={url.location} src={url.location} />
  );

  const renderImage = () => {
    if (!href?.location) return image;

    const props: React.AnchorHTMLAttributes<HTMLAnchorElement> = {};

    if (href.openInNewTab) {
      props.target = '_blank';
    }

    props.href = href.location;
    return (
      <a {...props}>{image}</a>
    );
  };

  return (
    <div>
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
}: BuilderCommonProps) => {
  const components: Array<WebBuilderComponent> = [
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
    ],
    order: -50,
  });

  return components;
};
