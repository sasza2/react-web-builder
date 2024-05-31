import React, { forwardRef, useId } from 'react';
import { Tooltip } from 'react-tooltip';

import 'react-tooltip/dist/react-tooltip.css';

import { assignTestProp } from '@/utils/tests';
import {
  ConfirmButtonContainer,
  RemoveButtonContainer,
  RemoveGhostButtonContainer,
  LinkButtonContainer,
  LinkGhostButtonContainer,
} from './Button.styled';

type ButtonRef = {
  buttonRef: React.MutableRefObject<HTMLButtonElement>,
};

type ButtonProps = React.PropsWithChildren<{
  disabled?: boolean,
  id?: string
  onClick?: React.MouseEventHandler,
  testId?: string,
  tooltip?: string,
} & Partial<ButtonRef>>;

type IButtonContainer = React.FC<
React.ButtonHTMLAttributes<HTMLButtonElement>
& { $disabled?: boolean, ref: ButtonRef['buttonRef'] }
>;

function Button({
  buttonContainer: ButtonContainer,
  buttonRef,
  children,
  disabled,
  id,
  onClick,
  testId,
  tooltip,
}: ButtonProps & { buttonContainer: IButtonContainer }) {
  const customId = useId();
  const buttonId = id || customId;
  return (
    <>
      <ButtonContainer
        $disabled={disabled}
        data-button-id={buttonId}
        data-tooltip-id={`button-${buttonId}`}
        ref={buttonRef}
        onClick={disabled ? undefined : onClick}
        type="button"
        {...assignTestProp(testId)}
      >
        {children}
      </ButtonContainer>
      {
        tooltip && (
          <Tooltip id={`button-${buttonId}`}>
            {tooltip}
          </Tooltip>
        )
      }
    </>
  );
}

Button.displayName = 'Button';

const createButton = (buttonContainer: React.FC) => {
  const ButtonWithRef = forwardRef((props: ButtonProps, ref: ButtonRef['buttonRef']) => (
    <Button
      {...props}
      buttonRef={ref}
      buttonContainer={buttonContainer}
    />
  ));
  ButtonWithRef.displayName = 'ButtonWithRef';

  return ButtonWithRef;
};

export const ConfirmButton = createButton(ConfirmButtonContainer);

export const RemoveButton = createButton(RemoveButtonContainer);

export const RemoveGhostButton = createButton(RemoveGhostButtonContainer);

export const LinkButton = createButton(LinkButtonContainer);

export const LinkGhostButton = createButton(LinkGhostButtonContainer);
