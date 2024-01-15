import React from 'react';
import { useSlate } from 'slate-react';

import { assignTestProp } from '@/utils/tests';
import { isBlockActive } from './utils/isBlockActive';
import {
  isMarkActive, toggleBlock, toggleMark, TEXT_ALIGN_TYPES,
} from './utils';
import { ButtonWrapper } from './buttons.styled';

interface BaseProps {
  className: string
  [key: string]: unknown
}
type OrNull<T> = T | null;

export const Icon = React.forwardRef(
  (
    { className, ...props }: React.PropsWithChildren<BaseProps>,
    ref: React.Ref<OrNull<HTMLSpanElement>>,
  ) => (
    <span
      {...props}
      ref={ref}
    />
  ),
);

Icon.displayName = 'Icon';

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      icon,
      inline,
      ...props
    }: React.PropsWithChildren<
    {
      active: boolean
      reversed: boolean
      icon: React.ReactElement,
      inline?: boolean,
    } & BaseProps
    >,
    ref: React.Ref<OrNull<HTMLDivElement>>,
  ) => (
    <ButtonWrapper
      {...props}
      ref={ref}
      className={className}
      $active={active}
      $inline={inline}
      $reversed={reversed}
    >
      {icon}
    </ButtonWrapper>
  ),
);

Button.displayName = 'Button';

type BlockButtonProps = {
  format: string,
  icon: React.ReactElement,
};

export function BlockButton({ format, icon }: BlockButtonProps) {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
      )}
      icon={icon}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    />
  );
}

BlockButton.displayName = 'BlockButton';

type MarkButtonProps = {
  format: string,
  icon: React.ReactElement,
  testId?: string,
};

export function MarkButton({
  format,
  icon,
  testId,
}: MarkButtonProps) {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      icon={icon}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      {...assignTestProp(testId)}
    />
  );
}
