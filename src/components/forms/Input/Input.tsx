import React, {
  forwardRef, useCallback, useRef, useState,
} from 'react';

import { useField } from '@/components/FormProvider';
import { assignTestProp } from '@/utils/tests';

import { FormControl } from '../FormControl';
import type { IFormControl } from '../types';
import { ExtraNode, InputGroup } from './Input.styled';

type InputProps = {
  clearOnClick?: boolean,
  disabled?: boolean,
  inputRef?: React.MutableRefObject<HTMLInputElement>,
  onBlur?: (value: string) => void,
  leftNode?: JSX.Element | string,
  rightNode?: JSX.Element | string,
  normalize?: (value?: string) => unknown,
} & IFormControl;

function InputRef({
  clearOnClick,
  disabled,
  name,
  errors,
  inputRef,
  label,
  onBlur,
  testId,
  leftNode,
  rightNode,
  normalize,
}: InputProps) {
  const nodeRef = useRef<HTMLInputElement>();
  const [hasFocus, setFocus] = useState(false);
  const { setValue, value } = useField<string>(name);

  const normalizeInternal = (): string => {
    if (normalize) return normalize(nodeRef.current.value) as string;
    return nodeRef.current.value;
  };

  const onInit = useCallback((node: HTMLInputElement) => {
    if (!node) return;
    nodeRef.current = node;
    node.value = value === undefined ? '' : value;
    if (inputRef) inputRef.current = node;
  }, [inputRef, value]);

  const onFocusInternal = useCallback(() => {
    setFocus(true);
    if (clearOnClick) {
      setValue('');
      nodeRef.current.value = '';
    }
  }, [clearOnClick, setValue]);

  const onBlurInternal = useCallback(() => {
    setFocus(false);

    const nextValue = normalizeInternal();
    if (value === nextValue) {
      if (onBlur) onBlur(nextValue);
      return;
    }

    nodeRef.current.value = nextValue;
    setValue(nextValue);

    if (onBlur) onBlur(nextValue);
  }, [onBlur, setValue, value]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      onBlurInternal();
      setTimeout(() => (e.target as HTMLInputElement).blur(), 0);
    }
  }, [normalizeInternal, onBlurInternal]);

  return (
    <FormControl name={name} errors={errors} label={label}>
      <InputGroup $hasFocus={hasFocus} $height={32}>
        { leftNode && (
          <ExtraNode $rightBorder>
            {leftNode}
          </ExtraNode>
        ) }
        <input
          disabled={disabled}
          ref={onInit}
          onFocus={onFocusInternal}
          onBlur={onBlurInternal}
          onKeyDown={onKeyDown}
          {...assignTestProp(testId)}
        />
        { rightNode && (
          <ExtraNode $leftBorder>
            {rightNode}
          </ExtraNode>
        ) }
      </InputGroup>
    </FormControl>
  );
}

export const Input = forwardRef((props: InputProps, ref: React.MutableRefObject<HTMLInputElement>) => (
  <InputRef {...props} inputRef={ref} />
));

Input.displayName = 'Input';
