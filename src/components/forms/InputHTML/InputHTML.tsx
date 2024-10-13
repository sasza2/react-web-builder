import React, { useState } from 'react';

import { useField } from '@/components/FormProvider';

import { FormControl } from '../FormControl';
import { InputGroup } from '../Input/Input.styled';
import { IFormControl } from '../types';

type InputHTMLProps = {
  disabled?: boolean,
} & IFormControl;

export function InputHTML({
  disabled,
  name,
  errors,
  label,
}: InputHTMLProps) {
  const [hasFocus, setFocus] = useState(false);
  const { setValue } = useField<string>(name);

  const onFocusInternal = () => {
    setFocus(true);
  };

  const onBlurInternal: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
    setFocus(false);
  };

  return (
    <FormControl name={name} errors={errors} label={label}>
      <InputGroup $hasFocus={hasFocus} $height={32}>
        <textarea
          disabled={disabled}
          onFocus={onFocusInternal}
          onBlur={onBlurInternal}
        />
      </InputGroup>
    </FormControl>
  );
}
