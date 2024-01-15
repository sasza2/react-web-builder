import React from 'react';
import ReactToggle from 'react-toggle';

import { useField } from '@/components/FormProvider';
import { IFormControl } from '../types';
import { FormControl } from '../FormControl';
import { Container } from './Toggle.style';

import 'react-toggle/style.css';

type ToggleProps = {
  onBlur?: (value: boolean) => void,
} & IFormControl;

export function Toggle({
  description,
  name,
  errors,
  label,
  onBlur,
}: ToggleProps) {
  const { setValue, value } = useField<boolean>(name);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;
    setValue(checked);
    if (onBlur) onBlur(checked);
  };

  return (
    <FormControl name={name} errors={errors} label={label} description={description}>
      <Container>
        <ReactToggle
          checked={value}
          onChange={onChange}
        />
      </Container>
    </FormControl>
  );
}
