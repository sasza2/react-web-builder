import React from 'react';

import { Input } from '../Input';
import { Tabs } from '../Tabs';
import {
  FlexVertical, FormContainer, InputContainer, Label,
} from './Length.styled';

type Option = {
  label?: string;
  name: string;
};

type LengthProps = {
  options: Option[],
};

export function Length({ options }: LengthProps) {
  return (
    <FormContainer>
      <FlexVertical>
        {options.map((option) => (
          <Label key={option.name}>
            {option.label}
            :
          </Label>
        ))}
      </FlexVertical>
      <FlexVertical>
        {options.map((option) => (
          <InputContainer key={option.name}>
            <Input name={`${option.name}.value`} />
            <div>
              <Tabs name={`${option.name}.unit`} items={['px', '%']} />
            </div>
          </InputContainer>
        ))}
      </FlexVertical>
    </FormContainer>
  );
}
