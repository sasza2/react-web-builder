
import {
  BoxProps, ElementContainer, IFrameComponentProps, ImageComponentProps, LineComponentProps, VideoComponentProps,
  WebBuilderComponent,
} from './types'

export function Box(props: BoxProps): JSX.Element;

export function Image(props: ImageComponentProps): JSX.Element;

export function Line(props: LineComponentProps): JSX.Element;

export function Video(props: VideoComponentProps): JSX.Element;

export function IFrame(props: IFrameComponentProps): JSX.Element;

export function useElementContainer(): ElementContainer;
